import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { ShieldCheck, UserCheck, ShieldAlert, CheckCircle, Trash2, ShieldX, XCircle } from 'lucide-react';

export default function PendingExperts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExperts = async () => {
    try {
      const res = await api.get('/admin/experts?status=pending');
      setExperts(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleApprove = async (id) => {
    if(!window.confirm("Approuver cet expert et lui donner accès à la plateforme ?")) return;
    try {
      await api.post(`/admin/experts/${id}/approve`);
      fetchExperts();
    } catch (error) {
       alert('Erreur: ' + (error.response?.data?.message || 'Action impossible'));
    }
  };

  const handleReject = async (id) => {
     if(!window.confirm("Voulez-vous rejeter la candidature de cet expert ?")) return;
     try {
        await api.post(`/admin/experts/${id}/reject`);
        fetchExperts();
     } catch (error) {
        alert('Erreur: ' + (error.response?.data?.message || 'Action impossible.'));
     }
  }

  if (loading) return <div className="py-20 text-center italic text-indigo-400/50">Chargement des candidatures...</div>;

  return (
    <div className="space-y-10 border border-transparent">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
          <ShieldAlert className="w-8 h-8 text-yellow-500" /> Experts en attente
        </h2>
        <p className="text-indigo-200/50 font-medium tracking-tight">Vérifiez et approuvez les nouvelles candidatures d'experts.</p>
      </div>

      <div className="glass-card rounded-[32px] border border-indigo-900/40 overflow-hidden shadow-2xl bg-[#020617] relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-600/5 blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
         
         <div className="p-8 border-b border-indigo-900/40 bg-indigo-900/5 relative z-10 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
               <UserCheck className="w-5 h-5 text-yellow-500" />
               Candidatures ({experts.length})
            </h3>
         </div>

         <div className="overflow-x-auto relative z-10">
           <table className="w-full text-left">
             <thead className="bg-[#020617]/50">
               <tr className="border-b border-indigo-900/40">
                 <th className="px-8 py-5 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest">Identité</th>
                 <th className="px-8 py-5 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest">Compétence</th>
                 <th className="px-8 py-5 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-indigo-900/20">
               {experts.length === 0 ? (
                  <tr>
                     <td colSpan="3" className="px-8 py-12 text-center text-sm font-medium text-indigo-200/40 italic">
                       Aucun expert en attente.
                     </td>
                  </tr>
               ) : (
                  experts.map(expert => (
                    <tr key={expert.id} className="hover:bg-indigo-900/10 transition-colors">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-900/40 rounded-xl overflow-hidden border border-indigo-500/20 shrink-0">
                               <img src={expert.expert_profile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=1e1b4b&color=fff`} className="w-full h-full object-cover" alt="avatar"/>
                            </div>
                            <div>
                               <p className="font-black text-white text-sm">{expert.name}</p>
                               <p className="text-xs text-indigo-200/50 font-medium">{expert.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                         <p className="text-sm font-bold text-indigo-100">{expert.expert_profile?.specialty || '—'}</p>
                         <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1">Ville: {expert.city || '?'}</p>
                      </td>
                      <td className="px-8 py-5 text-right space-x-3">
                         <button 
                           onClick={() => handleApprove(expert.id)} 
                           className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest border-t border-emerald-400 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex-inline items-center gap-2"
                         >
                           <CheckCircle className="w-4 h-4 inline-block mr-1" />
                           Approuver
                         </button>
                         <button 
                           onClick={() => handleReject(expert.id)} 
                           className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest border-t border-red-400 rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95 flex-inline items-center gap-2"
                         >
                           <XCircle className="w-4 h-4 inline-block mr-1" />
                           Rejeter
                         </button>
                      </td>
                    </tr>
                  ))
               )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}
