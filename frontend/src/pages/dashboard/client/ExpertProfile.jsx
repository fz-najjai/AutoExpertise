import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../context/AuthContext';
import { 
  MapPin, 
  Award, 
  Briefcase, 
  Wrench, 
  Calendar, 
  ChevronLeft,
  CheckCircle2,
  Euro,
  Star,
  MessageSquare,
  Heart,
  ShieldCheck,
  Share2
} from 'lucide-react';
import ReviewsList from '../../../components/ReviewsList';

export default function ExpertProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [togglingFav, setTogglingFav] = useState(false);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const res = await api.get(`/client/experts/${id}`);
        setExpert(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchExpert();
  }, [id]);

  const startChat = async () => {
    try {
      const res = await api.post('/conversations', { peer_id: id });
      navigate('/client/chat', { state: { openConversation: res.data } });
    } catch (err) {
      console.error("Failed to start chat", err);
    }
  };

  const toggleFavorite = async () => {
    setTogglingFav(true);
    try {
      const res = await api.post(`/client/experts/${id}/favorite`);
      setExpert(prev => ({ ...prev, is_favorite: res.data.is_favorite }));
    } catch (err) {
      console.error(err);
    }
    setTogglingFav(false);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="w-16 h-16 bg-slate-100 rounded-full border-4 border-slate-50 border-t-primary-500 animate-spin"></div>
        <p className="italic text-slate-400 font-bold tracking-widest text-xs uppercase text-center">Chargement ultra-rapide...</p>
    </div>
  );
  
  if (!expert) return (
    <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-xl">
        <h3 className="text-2xl font-black text-slate-900 mb-2 font-bold">Expert non trouvé</h3>
        <button onClick={() => navigate('/client/experts')} className="bg-slate-900 text-white px-8 py-3 rounded-xl mt-4">Retour</button>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-3 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] transition-all group"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:-translate-x-1 transition-transform">
                <ChevronLeft className="w-4 h-4" />
            </div>
            Retour
          </button>
          
          <div className="flex items-center gap-3">
              <button 
                onClick={toggleFavorite}
                disabled={togglingFav}
                className={`p-3 rounded-2xl transition-all active:scale-90 border flex items-center gap-2 group ${
                    expert.is_favorite 
                    ? 'bg-rose-50 border-rose-100 text-rose-500' 
                    : 'bg-white border-slate-100 text-slate-400 hover:text-rose-500'
                }`}
              >
                  <Heart className={`w-5 h-5 ${expert.is_favorite ? 'fill-current' : ''}`} />
                  {expert.is_favorite && <span className="text-[10px] font-black uppercase tracking-widest mr-1">Favori</span>}
              </button>
          </div>
      </div>

      <section className="bg-slate-900 rounded-[50px] overflow-hidden shadow-3xl text-white relative p-12 md:p-16 flex flex-col md:flex-row gap-12 items-center md:items-start">
          <div className="w-48 h-48 bg-white/5 rounded-[45px] p-2 border border-white/10 overflow-hidden shrink-0">
              <img
                src={expert.expert_profile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=fff&color=0F172A&size=256`}
                alt={expert.name}
                className="w-full h-full object-cover rounded-[38px]"
              />
          </div>

          <div className="flex-1 space-y-6">
              <div className="space-y-2">
                  <h2 className="text-5xl font-black tracking-tighter uppercase text-center md:text-left">{expert.name}</h2>
                  <p className="text-indigo-300 font-bold tracking-widest text-sm uppercase opacity-80 text-center md:text-left">{expert.expert_profile?.specialty || 'Expert Automobile'}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary-400" />
                      <span className="text-sm font-bold">{expert.city || 'Casablanca'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <Euro className="w-5 h-5 text-primary-400" />
                      <span className="text-sm font-bold">{expert.expert_profile?.price}€ / h</span>
                  </div>
              </div>

              <div className="pt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                  <button 
                    onClick={() => navigate(`/client/book/${expert.id}`)}
                    className="px-10 py-5 bg-white text-slate-900 rounded-[25px] font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-500 hover:text-white transition-all shadow-xl"
                  >
                      Réserver
                  </button>
                  <button 
                    onClick={startChat}
                    className="px-8 py-5 bg-white/5 border border-white/10 rounded-[25px] font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3"
                  >
                      <MessageSquare className="w-4 h-4" /> Message
                  </button>
              </div>
          </div>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6 bg-white p-10 rounded-[40px] border border-slate-100 italic font-medium text-slate-500 leading-relaxed shadow-sm">
              "{expert.expert_profile?.bio || 'Pas de description.'}"
          </div>
          <div className="space-y-4">
              <h3 className="text-xl font-black uppercase tracking-widest text-slate-400 mb-6">Expertises phares</h3>
              {(expert.expert_profile?.services ? expert.expert_profile.services.split('\n') : ['Moteur', 'Châssis']).map((s, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 text-sm border border-white shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {s}
                  </div>
              ))}
          </div>
      </div>

      <div className="pt-12 border-t border-slate-100">
          <ReviewsList expertId={expert.id} />
      </div>
    </div>
  );
}
