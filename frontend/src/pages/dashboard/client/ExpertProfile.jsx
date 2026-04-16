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
  Clock,
  Euro
} from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ExpertProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center italic text-slate-400">Chargement du profil...</div>;
  if (!expert) return <div className="text-center py-20">Expert non trouvé.</div>;

  return (
    <div className="space-y-10">
      {/* Back Link */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Retour à la recherche
      </button>

      {/* Header Profile Section (Fig 3.7 Top) */}
      <section className="glass-card p-10 rounded-[40px] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[120px] -mr-48 -mt-48"></div>
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="w-40 h-40 bg-white/10 rounded-[32px] overflow-hidden border border-white/20 shadow-2xl">
            <img
              src={expert.expert_profile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=fff&color=0F172A&size=256`}
              alt={expert.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left space-y-4">
            <h2 className="text-5xl font-black tracking-tight">{expert.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <span className="px-4 py-2 bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                 <Wrench className="w-4 h-4 text-primary-400" />
                 {expert.expert_profile?.specialty || 'Expert Automobile'}
               </span>
               <span className="px-4 py-2 bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-primary-400" />
                 {expert.city || 'Casablanca'}
               </span>
               <span className="px-4 py-2 bg-primary-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                 <Euro className="w-4 h-4" />
                 {expert.expert_profile?.price}€ / heure
               </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Information (Fig 3.7 Left) */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-8 rounded-[32px] border border-slate-100 bg-white space-y-8">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">Informations</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900">
                <Award className="w-6 h-6 text-primary-500" />
                <h4 className="font-bold">Qualifications</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                {expert.expert_profile?.qualifications || "Plus de 10 ans d'expérience dans le diagnostic de véhicules haut de gamme et expertise technique certifiée."}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900">
                <Briefcase className="w-6 h-6 text-primary-500" />
                <h4 className="font-bold">Expérience professionnelle</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                {expert.expert_profile?.experience || "Ancien chef d'atelier chez plusieurs concessionnaires majeurs. Spécialiste des moteurs thermiques et hybrides."}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900">
                <Wrench className="w-6 h-6 text-primary-500" />
                <h4 className="font-bold">Services proposés</h4>
              </div>
              <ul className="space-y-2">
                {(expert.expert_profile?.services ? expert.expert_profile.services.split('\n') : ['Inspection pré-achat', 'Diagnostic électrique', 'Vérification carrosserie']).map((s, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar (Fig 3.7 Right) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 rounded-[32px] border border-slate-100 bg-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary-500" />
                Calendrier des Disponibilités
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-400 font-bold uppercase tracking-widest">
                <Clock className="w-4 h-4" />
                Fusel horaire local
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-100 italic text-slate-400 text-sm text-center py-20 bg-slate-50">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
              Le calendrier interactif sera implémenté dans le tunnel de réservation.<br/>
              Consultez les créneaux disponibles ci-dessous.
            </div>

            <div className="mt-10 pt-10 border-t border-slate-50 flex justify-center">
               <button 
                onClick={() => navigate(`/client/book/${expert.id}`)}
                className="btn-primary px-12 py-5 text-lg"
               >
                 Réserver un rendez-vous
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
