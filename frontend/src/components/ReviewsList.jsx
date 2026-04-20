import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { StarRating } from './StarRating';
import { MessageCircle, ChevronLeft, ChevronRight, Star, TrendingUp, Users } from 'lucide-react';

export default function ReviewsList({ expertId }) {
  const [data,    setData]    = useState(null);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!expertId) return;
    setLoading(true);
    api.get(`/client/experts/${expertId}/reviews?page=${page}`)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [expertId, page]);

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-50 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const { stats, reviews } = data;
  const hasReviews = stats.total > 0;

  return (
    <div className="space-y-12">
      {/* Premium Rating Summary Header */}
      <div className="grid md:grid-cols-12 gap-8 items-center bg-slate-50/50 p-10 rounded-[45px] border border-slate-100">
        <div className="md:col-span-4 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Star className="w-3 h-3 fill-current" /> Note Globale
            </div>
            <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-7xl font-black text-slate-900 tracking-tighter">
                   {hasReviews ? Number(stats.average).toFixed(1) : '0.0'}
                </span>
                <span className="text-2xl font-bold text-slate-300">/ 5</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1">
                {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-5 h-5 ${i <= Math.round(stats.average) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                ))}
            </div>
            <p className="text-sm font-bold text-slate-400 flex items-center justify-center md:justify-start gap-2 italic">
               <Users className="w-4 h-4" /> Basé sur {stats.total} avis clients vérifiés
            </p>
        </div>

        <div className="md:col-span-8">
          <div className="grid gap-3">
            {[5, 4, 3, 2, 1].map(star => {
              const count  = stats.breakdown?.[star] ?? 0;
              const pct    = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-6 group">
                  <span className="w-6 text-xs font-black text-slate-400 group-hover:text-slate-900 transition-colors">{star}★</span>
                  <div className="flex-1 h-3 bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                    <div
                      className="h-full bg-slate-900 transition-all duration-1000 group-hover:bg-primary-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-[10px] font-black text-slate-300 group-hover:text-slate-900 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review cards List */}
      {!hasReviews ? (
        <div className="py-20 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto text-slate-200 border border-slate-100">
            <MessageCircle className="w-10 h-10" />
          </div>
          <p className="text-slate-400 font-bold italic text-lg uppercase tracking-widest text-[10px]">Cet expert n'a pas encore reçu d'avis.</p>
        </div>
      ) : (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Derniers témoignages</h4>
                <div className="h-px bg-slate-100 flex-1 mx-8 hidden md:block"></div>
            </div>

            <div className="grid gap-6">
                {reviews.data.map((review, idx) => (
                <div 
                    key={review.id} 
                    className="p-8 bg-white border border-slate-100 rounded-[35px] shadow-xl shadow-slate-200/20 hover:border-slate-200 transition-all group animate-fade-up"
                    style={{ animationDelay: `${idx * 100}ms` }}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
                                {review.client?.name?.charAt(0).toUpperCase() ?? '?'}
                            </div>
                            <div>
                                <h5 className="font-black text-slate-900 text-lg tracking-tight uppercase">{review.client?.name ?? 'Client Anonyme'}</h5>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                    {new Date(review.created_at).toLocaleDateString('fr-FR', {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(i => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
                                ))}
                            </div>
                            {review.rating === 5 && (
                                <span className="flex items-center gap-1.5 text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                    <TrendingUp className="w-3 h-3" /> Recommandé
                                </span>
                            )}
                        </div>
                    </div>
                    {review.comment && (
                    <div className="mt-8 relative">
                        <div className="absolute -left-2 top-0 text-6xl font-serif text-slate-50 select-none pointer-events-none group-hover:text-primary-50 transition-colors">"</div>
                        <p className="text-slate-600 font-medium leading-relaxed italic relative z-10 pl-4 border-l-2 border-slate-50 group-hover:border-primary-100 transition-colors">
                            {review.comment}
                        </p>
                    </div>
                    )}
                </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {reviews.last_page > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 bg-slate-50 p-3 rounded-full w-fit mx-auto border border-slate-100 shadow-sm">
                <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-3 bg-white border border-slate-200 text-slate-400 rounded-full hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 disabled:scale-100 active:scale-90"
                >
                <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-black text-slate-500 px-4 uppercase tracking-[0.2em]">
                Page {page} <span className="text-slate-300 mx-2">/</span> {reviews.last_page}
                </span>
                <button
                onClick={() => setPage(p => Math.min(reviews.last_page, p + 1))}
                disabled={page === reviews.last_page}
                className="p-3 bg-white border border-slate-200 text-slate-400 rounded-full hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 disabled:scale-100 active:scale-90"
                >
                <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            )}
        </div>
      )}
    </div>
  );
}
