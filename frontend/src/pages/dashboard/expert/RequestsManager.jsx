import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { Inbox, CheckCircle, XCircle, FileText, Calendar, User, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function RequestsManager() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, confirmed, cancelled

  const fetchRequests = async () => {
    try {
      const res = await api.get('/expert/appointments');
      setAppointments(res.data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.put(`/expert/appointments/${id}/manage`, { action });
      fetchRequests();
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || 'Action impossible'));
    }
  };

  if (loading) return <div className="py-20 text-center italic text-gray-500">Chargement des requêtes...</div>;

  const filtered = appointments.filter(apt => apt.status === filter);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <Inbox className="w-8 h-8 text-primary-500" /> Demandes & Réservations
        </h2>
        <p className="text-slate-500 font-medium tracking-tight">Validez les demandes d'expertise de vos clients.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-max border border-slate-200 shadow-inner">
        {[ 
          { id: 'pending', label: 'En attente', count: appointments.filter(a=>a.status==='pending').length },
          { id: 'confirmed', label: 'Confirmés', count: appointments.filter(a=>a.status==='confirmed').length },
          { id: 'cancelled', label: 'Annulés', count: appointments.filter(a=>a.status==='cancelled').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
              filter === tab.id 
                ? 'bg-white text-slate-900 shadow-lg shadow-black/5' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] leading-none ${filter === tab.id ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="glass-card p-16 rounded-[40px] border border-slate-200 text-center bg-white shadow-xl">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 mx-auto mb-6">
              <Inbox className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Aucune demande {filter.replace('pending','en attente').replace('confirmed','confirmée').replace('cancelled','annulée')}</h3>
            <p className="text-slate-500 font-medium mt-2">Vous n'avez pas de rendez-vous dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          filtered.map(apt => (
            <div key={apt.id} className="glass-card p-8 rounded-[32px] border border-slate-200 shadow-2xl relative overflow-hidden group hover:bg-slate-50 transition-colors bg-white">
              {/* Left Decoration */}
              <div className={`absolute top-0 left-0 w-2 h-full ${
                apt.status === 'pending' ? 'bg-yellow-500' : 
                apt.status === 'confirmed' ? 'bg-emerald-500' : 'bg-red-500'
              }`}></div>
              
              <div className="flex flex-col md:flex-row gap-8 justify-between">
                
                {/* Details */}
                <div className="flex-1 space-y-6 pl-4">
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 shadow-inner">
                      Ref: {apt.reference}
                    </div>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                       <Clock className="w-3 h-3" />
                       Créé il y a {formatDistanceToNow(new Date(apt.created_at), { locale: fr })}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-500/10 text-primary-400 rounded-2xl flex items-center justify-center shrink-0">
                       <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900">{apt.client.name}</h4>
                      <p className="text-sm font-bold text-slate-500 mt-1">{apt.vehicle_details}</p>
                    </div>
                  </div>

                  {apt.problem_description && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                      <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Motif de la demande</span>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-2 border-primary-500/30 pl-3">"{apt.problem_description}"</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date & Actions */}
                <div className="flex flex-col justify-between items-start md:items-end md:w-64 space-y-6 pb-2 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                  <div className="w-full text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                    <Calendar className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Date prévue</p>
                    <p className="font-black text-lg text-slate-900 leading-tight">
                      {format(new Date(apt.scheduled_at), 'dd MMM yyyy', { locale: fr })}
                    </p>
                    <p className="text-primary-500 font-bold">{format(new Date(apt.scheduled_at), 'HH:mm')}</p>
                  </div>

                  {apt.status === 'pending' && (
                    <div className="w-full flex gap-3">
                      <button 
                        onClick={() => handleAction(apt.id, 'refuse')}
                        className="flex-1 py-3 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-white font-black rounded-xl transition-all flex items-center justify-center shadow"
                        title="Refuser"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleAction(apt.id, 'accept')}
                        className="flex-[2] py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" /> Accepter
                      </button>
                    </div>
                  )}
                  {apt.status === 'confirmed' && (
                     <div className="w-full py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-center font-black rounded-xl uppercase tracking-wider text-xs">
                       RDV Confirmé
                     </div>
                  )}
                  {apt.status === 'cancelled' && (
                     <div className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 text-center font-black rounded-xl uppercase tracking-wider text-xs">
                       Annulé
                     </div>
                  )}
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
