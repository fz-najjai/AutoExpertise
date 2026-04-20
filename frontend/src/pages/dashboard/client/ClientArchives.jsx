import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { Archive, ChevronRight, User, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientArchives() {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const res = await api.get('/client/history/archives');
        setArchives(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchArchives();
  }, []);

  if (loading && archives.length === 0) return <div className="p-20 text-center italic text-primary-500 font-bold animate-pulse">Archivage des données...</div>;

  return (
    <div className="space-y-12 pb-20">
       <div className="space-y-2">
           <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100/50">
                <Archive className="w-6 h-6" />
             </div>
             Archives des Diagnostics
           </h2>
           <p className="text-slate-500 font-medium text-lg">Retrouvez l’historique complet de vos rendez-vous terminés ou annulés.</p>
       </div>

       <div className="space-y-4">
          {archives.length > 0 ? archives.map((a, i) => (
            <div 
              key={i} 
              className="group p-8 bg-white border border-slate-100 rounded-[40px] shadow-xl shadow-slate-200/40 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 overflow-hidden">
                      {a.expert.expert_profile?.photo_url ? (
                        <img src={a.expert.expert_profile.photo_url} alt={a.expert.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8" />
                      )}
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-slate-900 text-xl tracking-tight">{a.expert.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${a.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            {a.status === 'completed' ? 'Complété' : 'Annulé'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                         <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(a.scheduled_at).toLocaleDateString()}</span>
                         <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-slate-400" /> Réf: {a.reference || `#${a.id}`}</span>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-3">
                   {a.status === 'completed' && (
                     <button className="px-6 py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-colors">
                        Voir le rapport
                     </button>
                   )}
                   <Link 
                     to={`/appointments/${a.id}`}
                     className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 group-hover:text-slate-900 transition-all border border-slate-100"
                   >
                     <ChevronRight className="w-5 h-5" />
                   </Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-32 text-center space-y-6">
               <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto text-slate-200">
                  <Archive className="w-10 h-10" />
               </div>
               <p className="text-slate-400 font-medium italic text-lg">Votre archive est actuellement vide.</p>
            </div>
          )}
       </div>
    </div>
  );
}
