import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { Users, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
     if(!window.confirm("Attention : Supprimer ce compte client entraînera la suppression de tout son historique de réservation. Continuer ?")) return;
     try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
     } catch (error) {
        alert('Erreur: ' + (error.response?.data?.message || 'Impossible de supprimer ce client.'));
     }
  }

  if (loading) return <div className="py-20 text-center italic text-indigo-400/50">Chargement de la base clients...</div>;

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
          <Users className="w-8 h-8 text-indigo-400" /> Gestion des Clients
        </h2>
        <p className="text-indigo-200/50 font-medium tracking-tight">Consultez la base des particuliers inscrits et modérez les comptes.</p>
      </div>

      <div className="glass-card rounded-[32px] border border-indigo-900/40 overflow-hidden shadow-2xl bg-[#020617]">
         <div className="p-8 border-b border-indigo-900/40 bg-indigo-900/5 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
               Base Utilisateurs
            </h3>
            <div className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-black uppercase tracking-widest rounded-lg border border-blue-500/20">
               {users.length} Clients
            </div>
         </div>

         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className="bg-[#020617]/50">
               <tr className="border-b border-indigo-900/40">
                 <th className="px-8 py-5 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest">Client</th>
                 <th className="px-8 py-5 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest">Contact</th>
                 <th className="px-8 py-5 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest">Inscription</th>
                 <th className="px-8 py-5 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-indigo-900/20">
               {users.length === 0 ? (
                  <tr>
                     <td colSpan="4" className="px-8 py-12 text-center text-sm font-medium text-indigo-200/40 italic">
                       Aucun client inscrit pour le moment.
                     </td>
                  </tr>
               ) : (
                  users.map(u => (
                    <tr key={u.id} className="hover:bg-indigo-900/10 transition-colors">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-900/40 rounded-xl flex flex-col items-center justify-center text-indigo-400 font-black text-lg border border-indigo-500/20 shrink-0">
                               {u.name.charAt(0)}
                            </div>
                            <p className="font-black text-white text-sm">{u.name}</p>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                         <p className="text-sm font-bold text-indigo-200">{u.email}</p>
                         <p className="text-xs text-indigo-200/50 font-medium mt-1">{u.phone || 'Aucun numéro'}</p>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-2 text-indigo-100 text-sm font-bold">
                            <Calendar className="w-4 h-4 text-indigo-400" />
                            {format(new Date(u.created_at), 'dd MMM yyyy', { locale: fr })}
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <button 
                           onClick={() => handleDelete(u.id)} 
                           className="p-2 text-indigo-400/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                           title="Supprimer ce client"
                         >
                            <Trash2 className="w-5 h-5" />
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
