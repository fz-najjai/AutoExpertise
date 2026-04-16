import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { Search, MapPin, Grid, List, ChevronRight, SlidersHorizontal, Info } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ExpertSearch() {
  const [searchParams] = useSearchParams();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    city: searchParams.get('city') || '', 
    specialty: searchParams.get('specialty') || '', 
    max_price: '' 
  });
  const navigate = useNavigate();

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/client/experts', { params: filters });
      setExperts(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExperts();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.specialty) params.set('specialty', filters.specialty);
    navigate(`/client/experts?${params.toString()}`, { replace: true });
    fetchExperts();
  };

  return (
    <div className="space-y-10">
      {/* Header & Page Title */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trouver un expert</h2>
        <p className="text-slate-500 font-medium tracking-tight">Sélectionnez le professionnel idéal pour votre diagnostic automobile.</p>
      </div>

      {/* Advanced Filters Bar */}
      <section className="glass-card p-6 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-200/40">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-[2] relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input
              type="text" placeholder="Spécialité (ex: Moteur, Électronique...)"
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-slate-900 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-200 outline-none transition-all placeholder-slate-400 font-bold"
              value={filters.specialty} onChange={e => setFilters({ ...filters, specialty: e.target.value })}
            />
          </div>
          <div className="flex-1 relative group">
            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input
              type="text" placeholder="Toute la France"
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-slate-900 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-200 outline-none transition-all placeholder-slate-400 font-bold"
              value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })}
            />
          </div>
          <button type="submit" className="lg:w-48 btn-primary px-8">
            Filtrer
          </button>
        </form>
      </section>

      {/* Grid of Experts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card p-8 h-80 animate-pulse rounded-[32px] bg-white border border-slate-100"></div>
          ))
        ) : experts.length > 0 ? (
          experts.map((expert) => (
            <div 
              key={expert.id}
              className="glass-card p-8 rounded-[32px] border border-slate-100 hover:border-slate-300 transition-all group bg-white hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                    <img
                      src={expert.expert_profile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=0F172A&color=fff&size=128`}
                      alt={expert.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900">{expert.expert_profile?.price ? `${expert.expert_profile.price}€` : 'N/A'}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Tarif horaire</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{expert.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {expert.expert_profile?.specialty || 'Generalist'}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {expert.city || 'Casablanca'}
                    </span>
                  </div>
                </div>

                <p className="mt-6 text-sm text-slate-500 font-medium leading-relaxed line-clamp-3 italic">
                  "{expert.expert_profile?.bio || 'Aucune biographie disponible pour cet expert.'}"
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50">
                <button 
                  onClick={() => navigate(`/client/experts/${expert.id}`)}
                  className="w-full btn-primary group flex items-center justify-center gap-3"
                >
                  Voir le profil
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center glass-card rounded-[40px] border border-dashed border-slate-200 bg-white/50">
            <Info className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h4 className="text-xl font-bold text-slate-900">Aucun expert trouvé</h4>
            <p className="text-slate-500 font-medium">Réessayez avec d'autres critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}
