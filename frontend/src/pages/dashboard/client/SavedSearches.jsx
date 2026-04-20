import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { Bookmark, Search, Bell, Trash2 } from 'lucide-react';

export default function SavedSearches() {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSearches();
  }, []);

  const fetchSearches = async () => {
    try {
      const res = await api.get('/client/saved-searches'); // To implement
      setSearches(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-bold">Chargement...</div>;

  return (
    <div className="space-y-8 pb-20">
       <div className="space-y-2">
           <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <Bookmark className="w-8 h-8 text-primary-500" />
             Recherches Sauvées
           </h2>
           <p className="text-slate-500 font-medium">Ne manquez aucun expert. Soyez alerté dès qu'un pro correspondant à vos critères se rend disponible.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {searches.length === 0 ? (
              <div className="col-span-full p-10 bg-slate-50 rounded-3xl text-center text-slate-400 font-bold border-2 border-dashed border-slate-200">
                  <Search className="w-10 h-10 mx-auto mb-4 opacity-50" />
                  Aucune recherche enregistrée.
                  <p className="text-xs mt-2 italic font-medium">Allez dans "Rechercher", faites vos filtres, et cliquez sur "Sauvegarder".</p>
              </div>
           ) : (
             searches.map(s => (
               <div key={s.id} className="p-6 bg-white border border-slate-200 rounded-3xl shadow-lg shadow-slate-200/40 relative">
                  <div className="absolute top-4 right-4">
                     <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
                  <h3 className="font-black text-xl text-slate-800 mb-4 pr-10">{s.name}</h3>
                  <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Critères</p>
                     <p className="text-sm font-semibold text-slate-700 font-mono break-words">{JSON.stringify(s.criteria)}</p>
                  </div>
                  <button className="w-full py-3 bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-100 flex items-center justify-center gap-2 transition-colors">
                     <Bell className="w-4 h-4" /> Activer les alertes email
                  </button>
               </div>
             ))
           )}
       </div>
    </div>
  )
}
