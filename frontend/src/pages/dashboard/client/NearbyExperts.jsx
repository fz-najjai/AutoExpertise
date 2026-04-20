import SectionPage from '../../shared/SectionPage';
import { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, Star, Compass, Layers, ChevronRight, Clock, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../context/AuthContext';

const hashStringToNumber = (value) => {
  const text = String(value ?? '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

export default function NearbyExperts() {
  const [search, setSearch] = useState('');
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpertId, setSelectedExpertId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchExperts = async (params = {}) => {
      setLoading(true);
      try {
        const res = await api.get('/client/experts', { params: { ...params, nopaginate: true } });
        if (cancelled) return;
        setExperts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setExperts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const fetchWithLocationIfPossible = async () => {
      if (!navigator.geolocation) {
        await fetchExperts();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          if (!cancelled) setUserLocation(location);
          await fetchExperts(location);
        },
        async () => {
          await fetchExperts();
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
      );
    };

    fetchWithLocationIfPossible();

    return () => {
      cancelled = true;
    };
  }, []);

  const expertsWithUi = useMemo(() => {
    return experts.map((expert) => {
      const expertProfile = expert?.expert_profile;
      const name = expert?.name || 'Expert';
      const specialty = expertProfile?.specialty || 'Expert automobile';

      const canComputeDistance =
        userLocation &&
        expert?.latitude != null &&
        expert?.longitude != null &&
        Number.isFinite(Number(expert.latitude)) &&
        Number.isFinite(Number(expert.longitude));

      const distance = canComputeDistance
        ? haversineKm(userLocation.latitude, userLocation.longitude, Number(expert.latitude), Number(expert.longitude))
        : null;

      const hash = hashStringToNumber(expert?.id ?? name);
      const coordinates = {
        left: `${clamp(18 + (hash % 64), 15, 85)}%`,
        top: `${clamp(18 + ((hash >>> 6) % 60), 15, 85)}%`,
      };

      const featuresFromServices = (expertProfile?.services || '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 3);

      const features = featuresFromServices.length
        ? featuresFromServices
        : ['Profil vÃ©rifiÃ©', 'RÃ©ponse rapide', 'Rendez-vous en ligne'];

      return {
        id: expert?.id,
        name,
        specialty,
        distance,
        rating: Number(expertProfile?.average_rating || 0),
        reviews: Number(expertProfile?.total_reviews || 0),
        price: expertProfile?.price,
        coordinates,
        features,
      };
    });
  }, [experts, userLocation]);

  useEffect(() => {
    if (selectedExpertId != null) return;
    if (expertsWithUi.length === 0) return;
    setSelectedExpertId(expertsWithUi[0].id);
  }, [expertsWithUi, selectedExpertId]);

  const filteredExperts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return expertsWithUi;
    return expertsWithUi.filter((expert) => {
      return expert.name.toLowerCase().includes(query) || expert.specialty.toLowerCase().includes(query);
    });
  }, [expertsWithUi, search]);

  const selectedExpert = expertsWithUi.find((expert) => expert.id === selectedExpertId) || expertsWithUi[0] || null;

  return (
    <SectionPage
      title="Carte des experts"
      subtitle="Localisez les meilleurs spÃ©cialistes autour de vous et comparez les profils en temps rÃ©el."
      description="Le plan vous permet de visualiser la proximitÃ© des experts et dâ€™accÃ©der directement Ã  leur fiche pour rÃ©server en quelques clics."
      actions={[{ label: 'Rechercher un expert', path: '/client/experts' }]}
    >
      <div className="grid gap-8 xl:grid-cols-[1.35fr_0.95fr]">
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-[1.5fr_auto] items-end">
            <div className="relative rounded-4xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="flex items-center gap-3 text-slate-700 mb-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cherchez un expert ou spÃ©cialitÃ©"
                  className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
              {showFilters && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {['Tous', 'Carrosserie', 'Ã‰lectricitÃ©', 'ContrÃ´le'].map((filter) => (
                    <button
                      key={filter}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-100 transition"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </button>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white shadow-sm overflow-hidden h-130 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_28%),#f8fafc]" />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60')] bg-cover bg-center opacity-10" />
              <div className="absolute inset-0 bg-slate-50/90" />

              {loading ? (
                <div className="absolute inset-0 grid place-items-center text-slate-400 text-sm font-semibold">
                  Chargement des experts...
                </div>
              ) : filteredExperts.length === 0 ? (
                <div className="absolute inset-0 grid place-items-center text-slate-400 text-sm font-semibold text-center px-6">
                  Aucun expert trouvÃ© pour le moment.
                </div>
              ) : (
                filteredExperts.map((expert) => (
                  <button
                    key={expert.id}
                    type="button"
                    onClick={() => setSelectedExpertId(expert.id)}
                    className={`absolute inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-bold shadow-lg transition-all ${
                      selectedExpertId === expert.id
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-white bg-white/90 text-slate-700 hover:scale-105'
                    }`}
                    style={{ left: expert.coordinates.left, top: expert.coordinates.top, transform: 'translate(-50%, -50%)' }}
                    aria-label={`SÃ©lectionner ${expert.name}`}
                  >
                    <MapPin className="w-4 h-4" />
                    {expert.distance != null ? `${expert.distance.toFixed(1)} km` : 'Voir'}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-slate-700 mb-4">
                <Compass className="w-5 h-5 text-slate-500" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Distance moyenne</p>
              </div>
              <p className="text-3xl font-black text-slate-900">
                {selectedExpert?.distance != null ? `${selectedExpert.distance.toFixed(1)} km` : '—'}
              </p>
              <p className="mt-2 text-sm text-slate-500">Rayon de couverture des experts proches de votre position.</p>
            </div>
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-slate-700 mb-4">
                <Layers className="w-5 h-5 text-slate-500" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Services disponibles</p>
              </div>
              <div className="grid gap-2">
                {['Diagnostic complet', 'Carrosserie rapide', 'Ã‰lectricitÃ© automobile', 'ContrÃ´le technique'].map((tag) => (
                  <span key={tag} className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Expert sÃ©lectionnÃ©</p>
                <h2 className="text-2xl font-black text-slate-900">{selectedExpert?.name || '—'}</h2>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                {selectedExpert?.distance != null ? `${selectedExpert.distance.toFixed(1)} km` : '—'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <Star className="w-4 h-4 text-amber-400" />
                <p className="font-bold text-slate-900">{selectedExpert?.rating ? selectedExpert.rating.toFixed(1) : '—'}</p>
                <span className="text-sm text-slate-400">â€¢ {selectedExpert?.reviews ?? 0} avis</span>
              </div>
              <p className="text-slate-500">
                SpÃ©cialiste en {selectedExpert?.specialty || 'expertise automobile'}, disponible pour des diagnostics et expertises terrain.
              </p>

              <div className="grid gap-3 rounded-4xl bg-slate-50 p-4">
                {(selectedExpert?.features || []).map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-slate-600 text-sm">
                    <Clock className="w-4 h-4 text-primary-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                const targetId = selectedExpert?.id;
                if (!targetId) return;
                console.log("Navigating to expert:", targetId);
                navigate(`/client/experts/${targetId}`);
              }}
              disabled={!selectedExpert?.id}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition shadow-xl shadow-slate-900/10 active:scale-95"
            >
              Voir le profil complet
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {filteredExperts.map((expert) => (
              <button
                key={expert.id}
                onClick={() => setSelectedExpertId(expert.id)}
                className={`w-full rounded-4xl border p-4 text-left transition ${
                  selectedExpertId === expert.id
                    ? 'border-primary-500 bg-primary-500/10 text-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">{expert.name}</h3>
                    <p className="text-sm text-slate-500">{expert.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{expert.price != null ? `${expert.price}â‚¬/h` : 'N/A'}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {expert.distance != null ? `${expert.distance.toFixed(1)} km` : '—'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                  {expert.features.slice(0, 2).map((feature) => (
                    <span key={feature} className="rounded-full bg-slate-100 px-3 py-2">
                      {feature}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </SectionPage>
  );
}
