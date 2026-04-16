import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { Calendar as CalendarIcon, Trash2, Clock, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AvailabilitiesManager() {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAvail, setNewAvail] = useState({ start_time: '', end_time: '' });

  const fetchAvailabilities = async () => {
    try {
      const res = await api.get('/expert/availabilities');
      setAvailabilities(res.data.sort((a,b) => new Date(a.start_time) - new Date(b.start_time)));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const addAvailability = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expert/availabilities', newAvail);
      setNewAvail({ start_time: '', end_time: '' });
      fetchAvailabilities();
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || 'Problème lors de la création'));
    }
  };

  const deleteAvailability = async (id) => {
    try {
      await api.delete(`/expert/availabilities/${id}`);
      fetchAvailabilities();
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || 'Impossible de supprimer ce créneau'));
    }
  };

  if (loading) return <div className="py-20 text-center italic text-gray-500">Chargement de l'agenda...</div>;

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <CalendarIcon className="w-8 h-8 text-primary-500" /> Mon Agenda
        </h2>
        <p className="text-slate-500 font-medium tracking-tight">Ajoutez des créneaux de disponibilité pour que vos clients puissent réserver.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ajouter form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 rounded-[32px] border border-slate-200 bg-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/10 blur-3xl -ml-16 -mt-16 pointer-events-none"></div>
             <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10 text-slate-900">
                <PlusCircle className="w-6 h-6 text-primary-500" />
                Nouveau créneau
             </h3>
             <form onSubmit={addAvailability} className="space-y-6 relative z-10">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Début (Date et Heure)</label>
                 <input 
                  type="datetime-local" 
                  required 
                  value={newAvail.start_time} 
                  onChange={e => setNewAvail({...newAvail, start_time: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 transition-all cursor-text"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fin (Date et Heure)</label>
                 <input 
                  type="datetime-local" 
                  required 
                  value={newAvail.end_time} 
                  onChange={e => setNewAvail({...newAvail, end_time: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 transition-all cursor-text"
                 />
               </div>
               <button type="submit" className="w-full btn-primary py-4 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-slate-900/10 text-white">
                 Enregistrer
               </button>
             </form>
          </div>
        </div>

        {/* Liste Disponibilites */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-[32px] border border-slate-200 overflow-hidden shadow-2xl bg-white">
            <div className="p-8 border-b border-slate-100 bg-slate-50">
               <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
                  <Clock className="w-6 h-6 text-blue-500" />
                  Liste de vos disponibilités
               </h3>
            </div>
            
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Créneau</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {availabilities.length === 0 ? (
                     <tr>
                        <td colSpan="3" className="px-6 py-12 text-center text-sm font-medium text-slate-400 italic">
                          Votre agenda est vide. Ajoutez des créneaux pour vos clients.
                        </td>
                     </tr>
                  ) : (
                    availabilities.map(avail => {
                      const isPast = new Date(avail.start_time) < new Date();
                      return (
                      <tr key={avail.id} className={`hover:bg-slate-50 transition-colors ${isPast ? 'opacity-40' : ''}`}>
                        <td className="px-6 py-5">
                           <p className="font-bold text-slate-900 text-sm">
                             {format(new Date(avail.start_time), 'EEEE d MMMM yyyy', { locale: fr })}
                           </p>
                           <p className="text-xs font-black text-slate-400 mt-1">
                             {format(new Date(avail.start_time), 'HH:mm')} — {format(new Date(avail.end_time), 'HH:mm')}
                           </p>
                        </td>
                        <td className="px-6 py-5 text-center">
                          {avail.is_booked ? (
                            <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-500/20">
                              Réservé
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                              Libre
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                           <button 
                            onClick={() => deleteAvailability(avail.id)} 
                            disabled={avail.is_booked} 
                            className={`p-2 rounded-xl transition-all ${avail.is_booked ? 'text-slate-200 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                            title={avail.is_booked ? 'Créneau déjà réservé' : 'Supprimer'}
                            >
                             <Trash2 className="h-5 w-5" />
                           </button>
                        </td>
                      </tr>
                    )})
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

      {/* Styles for datetime-local picker if needed */}
    </div>
  );
}
