import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { HelpCircle, MessageSquare, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function SupportDesk() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', priority: 'medium', content: '' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/client/support/tickets'); // To implement in backend
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/client/support/tickets', newTicket);
      setShowForm(false);
      setNewTicket({ subject: '', priority: 'medium', content: '' });
      fetchTickets();
    } catch (err) {
      alert("Erreur lors de la création du ticket");
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-bold">Chargement du support...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
         <div>
             <h2 className="text-3xl font-black text-indigo-900 tracking-tight flex items-center gap-3">
               <HelpCircle className="w-8 h-8 text-indigo-500" />
               Centre d'Aide
             </h2>
             <p className="text-indigo-600/70 font-medium mt-2">Un problème avec une réservation ? Contactez notre support expert.</p>
         </div>
         <button onClick={() => setShowForm(!showForm)} className="btn-primary py-4 px-8 text-sm uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center gap-2 font-black shadow-lg shadow-indigo-600/30">
             <Plus className="w-5 h-5" /> Nouveau Ticket
         </button>
      </div>

      {showForm && (
         <div className="glass-card p-8 bg-white border border-slate-200 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-xl font-bold">Ouvrir une réclamation</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-black text-slate-400">Sujet / Motif</label>
                 <input type="text" value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})} required className="w-full p-4 bg-slate-50 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Panne lors du rendez-vous" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-black text-slate-400">Niveau d'Urgence</label>
                 <select value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="urgent">Urgence critique</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-black text-slate-400">Message détaillé</label>
                 <textarea value={newTicket.content} onChange={e => setNewTicket({...newTicket, content: e.target.value})} required className="w-full p-4 bg-slate-50 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px]" placeholder="Soyez le plus précis possible..."></textarea>
               </div>
               <button type="submit" className="w-full py-4 text-white bg-slate-900 font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800">
                  Envoyer au support
               </button>
            </form>
         </div>
      )}

      <div className="space-y-4">
         <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest pl-2">Vos Tickets Récents</h3>
         {tickets.length === 0 ? (
            <div className="p-10 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400 font-bold">
               Aucun ticket de support ouvert.
            </div>
         ) : (
            tickets.map(ticket => (
               <div key={ticket.id} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-xl ${ticket.status === 'open' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                         {ticket.status === 'open' ? <Clock className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                      </div>
                      <div>
                         <p className="font-bold text-slate-900 text-lg">{ticket.subject}</p>
                         <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">
                            Urgence: <span className="font-black text-slate-700">{ticket.priority}</span>
                         </p>
                      </div>
                  </div>
                  <button className="px-6 py-3 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-100 flex items-center gap-2">
                     <MessageSquare className="w-4 h-4" /> Détails
                  </button>
               </div>
            ))
         )}
      </div>
    </div>
  )
}
