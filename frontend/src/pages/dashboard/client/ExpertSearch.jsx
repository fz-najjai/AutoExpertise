import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { Search, MapPin, ChevronRight, Star, Filter, Navigation, Heart, CheckCircle, ChevronLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ExpertSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [paginationData, setPaginationData] = useState(null);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    city: searchParams.get('city') || '', 
    specialty: searchParams.get('specialty') || '', 
    max_price: '',
    min_rating: '',
    latitude: null,
    longitude: null,
    page: searchParams.get('page') || 1
  });
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/client/experts', { params: filters });
      setPaginationData(res.data);
      setExperts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [filters.page, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchData();
  };

  const setPage = (p) => {
    setFilters({ ...filters, page: p });
    setSearchParams({ ...Object.fromEntries(searchParams), page: p });
  };

  const useMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFilters({
          ...filters,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          page: 1
        });
      });
    }
  };

  const toggleFavorite = async (expertId) => {
    try {
      const res = await api.post(`/client/experts/${expertId}/favorite`);
      setExperts(prev => prev.map(e => 
        e.id === expertId ? { ...e, is_favorite: res.data.is_favorite } : e
      ));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                <Search className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Trouver un expert</h2>
        </div>
        <p className="text-slate-500 font-medium text-lg max-w-2xl">Recherche optimisée parmi les meilleurs professionnels certifiés.</p>
      </div>

      <section className="glass-card p-10 rounded-[45px] bg-white border border-slate-100 shadow-2xl shadow-slate-200/30">
        <form onSubmit={handleSearch} className="space-y-8">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              <input
                type="text" placeholder="Quelle spécialité recherchez-vous ?"
                className="w-full pl-16 pr-6 py-6 bg-slate-50/50 border border-slate-100 rounded-[28px] text-slate-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-200 outline-none transition-all placeholder-slate-400 font-bold"
                value={filters.specialty} onChange={e => setFilters({ ...filters, specialty: e.target.value })}
              />
            </div>
            <div className="lg:col-span-5 relative group">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              <input
                type="text" placeholder="Ville"
                className="w-full pl-16 pr-6 py-6 bg-slate-50/50 border border-slate-100 rounded-[28px] text-slate-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-200 outline-none transition-all placeholder-slate-400 font-bold"
                value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-50">
            <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                <div className="relative group min-w-[160px]">
                  <Filter className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number" placeholder="Budget Max"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-[20px] text-slate-900 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-bold text-xs"
                    value={filters.max_price} onChange={e => setFilters({ ...filters, max_price: e.target.value })}
                  />
                </div>
            </div>

            <div className="flex gap-4 w-full lg:w-auto">
              <button 
                type="button"
                onClick={useMyLocation}
                className="p-5 bg-white border border-slate-200 text-slate-600 rounded-[22px] hover:bg-slate-50 transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest"
              >
                <Navigation className="w-4 h-4" />
                Proximité
              </button>
              <button type="submit" className="flex-1 lg:w-60 bg-slate-900 text-white px-10 py-5 rounded-[22px] shadow-xl hover:bg-primary-500 transition-all font-black text-[10px] uppercase tracking-[0.2em]">
                Rechercher
              </button>
            </div>
          </div>
        </form>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="glass-card p-10 h-[450px] animate-pulse rounded-[45px] bg-white border border-slate-100"></div>
          ))
        ) : experts.length > 0 ? (
          experts.map((expert) => (
            <div 
              key={expert.id}
              className="glass-card p-10 rounded-[50px] border border-slate-100 transition-all group bg-white hover:shadow-3xl flex flex-col justify-between relative"
            >
              <div className="absolute top-10 right-10 z-20">
                  <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(expert.id); }}
                      className={`p-3 rounded-2xl transition-all active:scale-75 ${expert.is_favorite ? 'bg-rose-50 text-rose-500 shadow-lg shadow-rose-100' : 'bg-slate-50 text-slate-300 hover:text-rose-500'}`}
                  >
                      <Heart className={`w-5 h-5 ${expert.is_favorite ? 'fill-current' : ''}`} />
                  </button>
              </div>

              <div onClick={() => navigate(`/client/experts/${expert.id}`)} className="cursor-pointer">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-24 h-24 bg-slate-100 rounded-[35px] overflow-hidden border-2 border-slate-50 shadow-inner">
                    <img
                      src={expert.expert_profile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=0F172A&color=fff&size=128`}
                      alt={expert.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors uppercase">{expert.name}</h3>
                  <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">{expert.expert_profile?.specialty || 'Généraliste'}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(i => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i <= (expert.expert_profile?.average_rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
                        ))}
                    </div>
                    <span className="text-xs font-black text-slate-900">{expert.expert_profile?.average_rating || '5.0'}</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-8">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">A partir de</span>
                      <span className="text-xl font-black text-slate-900">{expert.expert_profile?.price || 0}€<small className="text-xs text-slate-400 ml-1">/h</small></span>
                   </div>
                </div>
              </div>

              <div className="mt-10">
                <button 
                  onClick={() => navigate(`/client/experts/${expert.id}`)}
                  className="w-full bg-slate-900 text-white group flex items-center justify-center gap-4 py-5 rounded-[22px] font-black uppercase tracking-[0.2em] text-[10px] active:scale-95 transition-all"
                >
                  Profil complet
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-40 text-center">
            <h4 className="text-3xl font-black text-slate-900 mb-3 uppercase">Aucun résultat</h4>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {paginationData && paginationData.last_page > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12 bg-white p-4 rounded-[30px] w-fit mx-auto shadow-xl border border-slate-100">
            <button
              onClick={() => setPage(Math.max(1, paginationData.current_page - 1))}
              disabled={paginationData.current_page === 1}
              className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all disabled:opacity-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
                {[...Array(paginationData.last_page)].map((_, i) => (
                    <button
                        key={i+1}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${paginationData.current_page === i + 1 ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button
              onClick={() => setPage(Math.min(paginationData.last_page, paginationData.current_page + 1))}
              disabled={paginationData.current_page === paginationData.last_page}
              className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all disabled:opacity-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      )}
    </div>
  );
}
