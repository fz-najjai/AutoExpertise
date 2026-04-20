import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { MapPin, Star, Sparkles, Navigation, ChevronRight } from 'lucide-react';
import { RatingDisplay } from './StarRating';
import { useNavigate } from 'react-router-dom';

/**
 * RecommendedExperts — lists intelligent suggestions based on scoring.
 * Fetches from GET /recommendations
 */
export default function RecommendedExperts({ specialty = '' }) {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Get location first to ensure distance score is accurate
    const init = async () => {
      setLocating(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // Update user location in DB
              await api.patch('/profile/location', { latitude, longitude });
              fetchRecommendations();
            } catch (e) {
              console.error("Location update failed", e);
              fetchRecommendations(); // still fetch even if update fails
            } finally {
              setLocating(false);
            }
          },
          (error) => {
            console.warn("Geolocation denied", error);
            setLocating(false);
            fetchRecommendations();
          }
        );
      } else {
        setLocating(false);
        fetchRecommendations();
      }
    };

    init();
  }, [specialty]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/recommendations?specialty=${specialty}&limit=4`);
      setExperts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || locating) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card h-64 animate-pulse rounded-[32px] bg-slate-50 border border-slate-100"></div>
        ))}
      </div>
    );
  }

  if (experts.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500" />
          Experts recommandés pour vous
        </h3>
        <button 
          onClick={() => navigate('/client/experts')}
          className="text-xs font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          Voir tout <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {experts.map(({ expert, score, distance_km }) => (
          <div 
            key={expert.id}
            onClick={() => navigate(`/client/experts/${expert.id}`)}
            className="glass-card p-6 rounded-[32px] border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
          >
            {/* Top Score Badge */}
            <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Navigation className="w-3 h-3 fill-amber-700" /> {Math.round(score * 100)}% Match
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl overflow-hidden border border-slate-50 shadow-inner group-hover:scale-110 transition-transform">
                <img
                  src={expert.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=random&color=fff`}
                  alt={expert.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 line-clamp-1">{expert.name}</h4>
                <p className="text-xs text-slate-500 font-medium mb-2">{expert.specialty}</p>
                <div className="flex justify-center">
                   <RatingDisplay average={expert.rating} total={expert.reviews} showCount={false} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3 h-3" />
                  {distance_km < 1 ? '< 1' : distance_km} km
                </div>
                <div className="text-primary-600">
                  {expert.price}€/h
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
