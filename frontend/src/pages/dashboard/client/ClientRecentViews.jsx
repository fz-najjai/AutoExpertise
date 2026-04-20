import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { Eye, ChevronRight, User, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientRecentViews() {
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const res = await api.get('/client/history/views');
        setViews(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchViews();
  }, []);

  if (loading && views.length === 0) return <div className="p-20 text-center italic text-indigo-400 font-bold">Récupération de votre historique de visite...</div>;

  return (
    <div className="space-y-12 pb-20">
       <div className="space-y-2">
           <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100/50">
                <Eye className="w-6 h-6" />
             </div>
             Consultations Récentes
           </h2>
           <p className="text-slate-500 font-medium text-lg">Retrouvez les experts que vous avez consultés dernièrement.</p>
       </div>

       <div className="grid gap-6">
          {views.length > 0 ? views.map((v, i) => (
            <Link 
              key={i} 
              to={`/expert/${v.expert_id}`}
              className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[35px] shadow-xl shadow-slate-200/40 hover:border-indigo-500 transition-all hover:-translate-x-1"
            >
              <div className="flex items-center gap-6">
                 <div className="relative">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden">
                        {v.expert.expert_profile?.photo_url ? (
                            <img src={v.expert.expert_profile.photo_url} alt={v.expert.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <User className="w-8 h-8" />
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    </div>
                 </div>
                 <div>
                    <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{v.expert.name}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                        Consulté le {new Date(v.viewed_at).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em] mt-2">
                        {v.expert.expert_profile?.job_title || 'Expert Automobile'}
                    </p>
                 </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
                <ChevronRight className="w-6 h-6" />
              </div>
            </Link>
          )) : (
            <div className="py-32 text-center space-y-6">
               <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto text-slate-200">
                  <Eye className="w-10 h-10" />
               </div>
               <p className="text-slate-400 font-medium italic text-lg">Vous n'avez pas encore consulté de profil d'expert.</p>
               <Link to="/search" className="inline-block px-8 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-colors">
                  Explorer les experts
               </Link>
            </div>
          )}
       </div>
    </div>
  );
}
