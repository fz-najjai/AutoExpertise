import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { ShieldX, UserCheck, CheckCircle } from 'lucide-react';

export default function RejectedExperts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExperts = async () => {
    try {
      const res = await api.get('/admin/experts?status=rejected');
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
     if(!window.confirm("Voulez-vous approuver cet expert finalement ?")) return;
     try {
        await api.post(`/admin/experts/${id}/approve`);
        fetchExperts();
     } catch (error) {
        alert('Erreur: ' + (error.response?.data?.message || 'Impossible d\'approuver.'));
     }
  }

  if (loading) return <div className="py-20 text-center italic text-indigo-400/50">Chargement...</div>;

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
          <ShieldX className="w-8 h-8 text-red-500" /> Experts Rejetés
        </h2>
        <p className="text-indigo-200/50 font-medium tracking-tight">Liste des experts dont la candidature a été rejetée ou suspendue.</p>
      </div>

      <div className="glass-card rounded-[32px] border border-indigo-900/40 overflow-hidden shadow-2xl bg-[#020617] relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
         
         <div className="p-8 border-b border-indigo-900/40 bg-indigo-900/5 relative z-10 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
               <UserCheck className="w-5 h-5 text-red-500" />
               Rejetés ({experts.length})
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
                       Aucun expert rejeté.
                     </td>
                  </tr>
               ) : (
                  experts.map(expert => (
                    <tr key={expert.id} className="hover:bg-indigo-900/10 transition-colors">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-900/40 rounded-xl overflow-hidden border border-indigo-500/20 shrink-0">
                               <img src={expert.expert_profile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=ef4444&color=fff`} className="w-full h-full object-cover" alt="avatar"/>
                            </div>
                            <div>
                               <p className="font-black text-white text-sm">{expert.name}</p>
                               <p className="text-xs text-indigo-200/50 font-medium">{expert.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                         <p className="text-sm font-bold text-indigo-100">{expert.expert_profile?.specialty || '—'}</p>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <button 
                           onClick={() => handleApprove(expert.id)} 
                           className="p-2 text-indigo-200/40 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all"
                           title="Restaurer / Approuver"
                         >
                            <CheckCircle className="w-5 h-5" />
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
