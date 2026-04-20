import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, ChevronRight, User, Loader2 } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/client/favorites');
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const toggleFavorite = async (expertId) => {
    try {
      await api.post(`/client/experts/${expertId}/favorite`);
      setFavorites(favorites.filter(f => f.id !== expertId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Chargement de vos favoris...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mes Experts Favoris</h2>
        <p className="text-slate-500 font-medium tracking-tight">Retrouvez ici les professionnels avec qui vous aimez travailler.</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((expert) => (
            <div 
              key={expert.id}
              className="glass-card p-8 rounded-[40px] border border-slate-100 hover:border-slate-300 transition-all group bg-white shadow-xl shadow-slate-100/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-8">
                  <div className="w-20 h-20 bg-slate-100 rounded-[30px] overflow-hidden border-2 border-slate-50 relative group-hover:border-slate-200 transition-colors">
                    <img
                      src={expert.expert_profile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=0F172A&color=fff&size=128`}
                      alt={expert.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <button 
                    onClick={() => toggleFavorite(expert.id)}
                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{expert.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">
                      {expert.expert_profile?.specialty || 'Généraliste'}
                    </span>
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {expert.city}
                    </span>
                  </div>
                </div>

                <p className="mt-8 text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 italic opacity-80">
                  "{expert.expert_profile?.bio || 'Aucune biographie disponible pour cet expert.'}"
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50">
                <button 
                  onClick={() => navigate(`/client/experts/${expert.id}`)}
                  className="w-full btn-primary group flex items-center justify-center gap-4 py-4 rounded-[24px] shadow-lg shadow-slate-900/5 hover:shadow-slate-900/10 transition-all font-black uppercase tracking-widest text-[10px]"
                >
                  Prendre RDV
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center glass-card rounded-[50px] border border-dashed border-slate-200 bg-white/30 backdrop-blur-sm">
          <div className="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Heart className="w-10 h-10 text-slate-200" />
          </div>
          <h4 className="text-2xl font-black text-slate-900 mb-2">Aucun expert favori</h4>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">Ajoutez des experts à vos favoris pour les retrouver plus facilement lors de vos prochaines recherches.</p>
          <button 
            onClick={() => navigate('/client/experts')}
            className="mt-10 px-10 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-[22px] hover:scale-105 transition-all shadow-xl shadow-slate-900/20"
          >
            Explorer les experts
          </button>
        </div>
      )}
    </div>
  );
}
