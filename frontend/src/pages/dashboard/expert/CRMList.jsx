import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { Users, Search, Phone, Mail, FolderOpen, Calendar } from 'lucide-react';

export default function CRMList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCRM();
  }, []);

  const fetchCRM = async () => {
    try {
      // Temporary mock if API not ready, replace with actual res later.
      // const res = await api.get('/expert/crm/clients');
      // setClients(res.data);
      const mock = [
         { id: 1, name: 'Jean Dupont', email: 'jean@example.com', phone: '06 12 34 56 78', last_appointment: '2026-03-15', total_appointments: 3 },
         { id: 2, name: 'Marie Martin', email: 'marie.m@example.com', phone: '07 89 12 34 56', last_appointment: '2026-04-10', total_appointments: 1 },
      ];
      setClients(mock);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Chargement du CRM...</div>;

  return (
    <div className="space-y-8 pb-20">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-2">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                 <Users className="w-8 h-8 text-indigo-500" />
                 CRM & Clients
               </h2>
               <p className="text-slate-500 font-medium">Gérez votre portefeuille clients et consultez l'historique d'interventions.</p>
           </div>
           
           <div className="flex bg-white p-2 rounded-2xl border border-slate-200 w-full md:w-96 shadow-sm">
               <div className="pl-3 py-2 text-slate-400">
                  <Search className="w-5 h-5" />
               </div>
               <input type="text" placeholder="Rechercher un client..." className="w-full bg-transparent px-3 py-2 font-bold outline-none text-slate-700" />
           </div>
       </div>

       <div className="glass-card bg-white border border-slate-200 rounded-[35px] overflow-hidden shadow-xl">
           <div className="overflow-x-auto">
               <table className="w-full text-left">
                   <thead className="bg-slate-50">
                       <tr>
                           <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Client</th>
                           <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Contact</th>
                           <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Interventions</th>
                           <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Action</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                       {clients.map(client => (
                           <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                               <td className="px-6 py-6">
                                   <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg">
                                           {client.name.charAt(0)}
                                       </div>
                                       <div>
                                           <p className="font-bold text-slate-900">{client.name}</p>
                                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: #{client.id.toString().padStart(4, '0')}</p>
                                       </div>
                                   </div>
                               </td>
                               <td className="px-6 py-6 space-y-2">
                                   <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                       <Mail className="w-4 h-4 text-slate-400" /> {client.email}
                                   </div>
                                   <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                       <Phone className="w-4 h-4 text-slate-400" /> {client.phone}
                                   </div>
                               </td>
                               <td className="px-6 py-6">
                                   <div className="flex flex-col gap-2">
                                       <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg w-max">
                                           <FolderOpen className="w-4 h-4" /> {client.total_appointments} dossiers
                                       </span>
                                       <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                           <Calendar className="w-3 h-3" /> Dernier: {client.last_appointment}
                                       </span>
                                   </div>
                               </td>
                               <td className="px-6 py-6">
                                   <button className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors">
                                       Fiche Client
                                   </button>
                               </td>
                           </tr>
                       ))}
                       {clients.length === 0 && (
                          <tr><td colSpan="4" className="p-10 text-center font-medium text-slate-400">Aucun client trouvé.</td></tr>
                       )}
                   </tbody>
               </table>
           </div>
       </div>
    </div>
  )
}
