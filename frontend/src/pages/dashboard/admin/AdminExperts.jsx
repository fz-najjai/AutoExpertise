import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { ShieldCheck, UserCheck, ShieldAlert, CheckCircle, Trash2, ShieldX } from 'lucide-react';

export default function AdminExperts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExperts = async () => {
    try {
      const res = await api.get('/admin/experts');
      // Sort: unvalidated first, then by date descending
      const sorted = res.data.sort((a,b) => {
         if (a.is_validated === b.is_validated) {
            return new Date(b.created_at) - new Date(a.created_at);
         }
         return a.is_validated ? 1 : -1;
      });
      setExperts(sorted);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleValidate = async (id) => {
    try {
      await api.post(`/admin/validate-expert/${id}`);
      fetchExperts();
    } catch (error) {
       alert('Erreur: ' + (error.response?.data?.message || 'Action impossible'));
    }
  };

  const handleDelete = async (id) => {
     if(!window.confirm("Voulez-vous vraiment bannir/supprimer cet expert définitivement ?")) return;
     try {
        await api.delete(`/admin/users/${id}`);
        fetchExperts();
     } catch (error) {
        alert('Erreur: ' + (error.response?.data?.message || 'Impossible de supprimer.'));
     }
  }

  if (loading) return <div className="py-20 text-center italic text-indigo-400/50">Chargement de la base d'experts...</div>;

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
          <ShieldCheck className="w-8 h-8 text-indigo-400" /> Validation & Modération
        </h2>
        <p className="text-indigo-200/50 font-medium tracking-tight">Gérez les accès des mécaniciens professionnels à la plateforme AutoExpertis.</p>
      </div>

      <div className="glass-card rounded-[32px] border border-indigo-900/40 overflow-hidden shadow-2xl bg-[#020617] relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
         
         <div className="p-8 border-b border-indigo-900/40 bg-indigo-900/5 relative z-10 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
               <UserCheck className="w-5 h-5 text-indigo-400" />
               Registre des Experts
            </h3>
            <div className="px-4 py-1.5 bg-indigo-600/10 text-indigo-400 text-xs font-black uppercase tracking-widest rounded-lg border border-indigo-500/20">
               {experts.length} Enregistrés
            </div>
         </div>

         <div className="overflow-x-auto relative z-10">
           <table className="w-full text-left">
             <thead className="bg-[#020617]/50">
               <tr className="border-b border-indigo-900/40">
                 <th className="px-8 py-5 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest">Identité</th>
                 <th className="px-8 py-5 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest">Compétence</th>
                 <th className="px-8 py-5 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest">Statut</th>
                 <th className="px-8 py-5 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest text-right">Contrôle Admin</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-indigo-900/20">
               {experts.length === 0 ? (
                  <tr>
                     <td colSpan="4" className="px-8 py-12 text-center text-sm font-medium text-indigo-200/40 italic">
                       Aucun expert inscrit.
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
                         <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1">Tarif: {expert.expert_profile?.price ? expert.expert_profile.price + '€' : '?'}</p>
                      </td>
                      <td className="px-8 py-5">
                        {expert.is_validated ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" /> Validé
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-500/20">
                            <ShieldAlert className="w-3 h-3" /> En attente
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right space-x-3">
                         {!expert.is_validated && (
                            <button 
                              onClick={() => handleValidate(expert.id)} 
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest border-t border-emerald-400 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                            >
                              Valider l'expert
                            </button>
                         )}
                         <button 
                           onClick={() => handleDelete(expert.id)} 
                           className="p-2 text-indigo-200/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                           title="Supprimer / Bannir"
                         >
                            <ShieldX className="w-5 h-5" />
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
