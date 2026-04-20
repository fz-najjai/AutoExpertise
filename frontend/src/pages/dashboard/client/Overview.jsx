import { useState, useEffect } from 'react';
import { useAuth, api } from '../../../context/AuthContext';
import { 
  Calendar, 
  ChevronRight, 
  MapPin, 
  Timer, 
  User as UserIcon,
  Search,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';
import RecommendedExperts from '../../../components/RecommendedExperts';

export default function Overview() {
  const { user } = useAuth();
  const [nextAppointments, setNextAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/client/appointments');
        const upcoming = res.data
          .filter(a => a.status === 'confirmed' || a.status === 'pending')
          .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
          .slice(0, 5);
        setNextAppointments(upcoming);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchAppointments();
  }, []);

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Bonjour, {user.name.split(' ')[0]} 
          </h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Ravi de vous revoir. Voici un aperçu de vos activités.
          </p>
        </div>
        <Link 
          to="/client/experts"
          className="btn-primary flex items-center gap-3 px-8 group"
        >
          Trouver un expert
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Mes prochains rendez-vous (Fig 3.8) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-slate-400" />
            Mes prochains rendez-vous
          </h3>
          <Link to="/client/history" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            Voir tout
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="glass-card p-6 h-48 animate-pulse rounded-[32px] bg-white/50 border border-slate-100"></div>
            ))}
          </div>
        ) : nextAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nextAppointments.map((appt) => (
              <div 
                key={appt.id}
                className="glass-card p-8 rounded-[32px] border border-slate-100 hover:border-slate-300 transition-all hover:shadow-2xl hover:shadow-slate-200/50 group bg-white"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date & Heure</p>
                    <p className="text-lg font-bold text-slate-900">
                      {format(new Date(appt.scheduled_at), 'dd MMM yyyy', { locale: fr })}
                    </p>
                    <p className="text-slate-500 font-semibold">{format(new Date(appt.scheduled_at), 'HH:mm')}</p>
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                    appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {appt.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expert</p>
                      <p className="font-bold text-slate-900">{appt.expert.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spécialité</p>
                      <p className="font-bold text-slate-900">{appt.expert.expert_profile?.specialty || 'Expert automobile'}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/client/appointments/${appt.id}`)}
                  className="w-full py-4 text-sm font-bold text-slate-900 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  Gérer la réservation
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 glass-card rounded-[40px] text-center bg-white/50 border border-dashed border-slate-200">
            <Calendar className="w-20 h-20 text-slate-200 mx-auto mb-6" />
            <h4 className="text-2xl font-bold text-slate-900 mb-2">Aucun rendez-vous</h4>
            <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
              Vous n'avez pas encore de rendez-vous programmé. Commencez par trouver un expert pour votre véhicule.
            </p>
            <Link to="/client/experts" className="btn-secondary whitespace-nowrap">
              Explorer les experts
            </Link>
          </div>
        )}
      </section>

      {/* Smart Recommendations Section */}
      <section className="animate-fade-up" style={{ animationDelay: '200ms' }}>
         <RecommendedExperts />
      </section>

      {/* Quick Actions / Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Mécanique', color: 'bg-blue-500' },
          { title: 'Électronique', color: 'bg-indigo-500' },
          { title: 'Carrosserie', color: 'bg-orange-500' },
          { title: 'Diagnostic complet', color: 'bg-emerald-500' },
        ].map((cat, i) => (
          <button 
            key={i}
            className="p-6 glass-card rounded-[32px] bg-white border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all text-left group"
          >
            <div className={`w-12 h-12 ${cat.color} rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}></div>
            <h4 className="text-lg font-bold text-slate-900">{cat.title}</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Secteur Expertise</p>
          </button>
        ))}
      </div>
    </div>
  );
}
