import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { Star, TrendingUp, BarChart, MessageSquare, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PerformanceMetrics() {
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPerformance = async () => {
    setLoading(true);
    try {
      const [perfRes, revRes] = await Promise.all([
        api.get('/expert/performance'),
        api.get('/expert/reviews')
      ]);
      setData(perfRes.data);
      setReviews(revRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  if (loading && !data) return <div className="p-20 text-center italic text-primary-500 font-bold animate-pulse">Analyse des indicateurs de performance...</div>;

  const stats = [
    { title: 'Note Moyenne', value: data?.rating || '0.0', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50', suffix: '/ 5' },
    { title: 'Avis Reçus', value: data?.total_reviews || 0, icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { title: 'RDV Terminés', value: data?.completed_appointments || 0, icon: BarChart, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-12 pb-20">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-200">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  Avis & Performances
                </h2>
                <p className="text-slate-500 font-medium text-lg">Suivez l'excellence de votre service à travers les retours clients.</p>
            </div>
            <button onClick={fetchPerformance} className="p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors">
                <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
                <div key={i} className="glass-card bg-white p-10 rounded-[45px] shadow-2xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-all group">
                    <div className="flex justify-between items-start mb-8">
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.title}</p>
                    <div className="flex items-end gap-2">
                        <p className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                        {stat.suffix && <p className="text-slate-400 font-black text-xl mb-1">{stat.suffix}</p>}
                    </div>
                </div>
            ))}
       </div>

       <div className="glass-card bg-slate-900 p-12 rounded-[50px] text-white shadow-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] -mr-20 -mt-20"></div>
            <h3 className="font-black text-2xl mb-10 tracking-tight flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-primary-400" />
                Derniers Avis Clients
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.length > 0 ? reviews.map((rev, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-[40px] hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-1.5 mb-5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'text-yellow-400 fill-current' : 'text-slate-700'}`} />
                            ))}
                        </div>
                        <p className="text-lg text-slate-200 font-medium italic leading-relaxed mb-8">
                            "{rev.comment}"
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xs font-black uppercase">
                                {rev.client?.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-black uppercase tracking-widest text-white">{rev.client?.name}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                                    {format(new Date(rev.created_at), 'dd MMMM yyyy', { locale: fr })}
                                </p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-2 py-20 text-center border-2 border-dashed border-white/10 rounded-[40px]">
                        <p className="text-slate-500 font-medium italic">Vous n'avez pas encore reçu d'avis.</p>
                    </div>
                )}
            </div>
       </div>
    </div>
  )
}
