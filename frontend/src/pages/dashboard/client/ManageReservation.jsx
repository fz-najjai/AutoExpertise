import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  User, 
  AlertTriangle, 
  ChevronLeft, 
  Clock, 
  XCircle,
  RefreshCw,
  FileText
} from 'lucide-react';
import { format, differenceInHours } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ManageReservation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/client/appointments/${id}`);
      setAppointment(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) return;
    try {
      await api.put(`/client/appointments/${id}/cancel`);
      alert("Réservation annulée avec succès.");
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'annulation.");
    }
  };

  if (loading) return <div className="text-center py-20 italic">Chargement des détails...</div>;
  if (!appointment) return <div className="text-center py-20 font-bold">Réservation introuvable.</div>;

  const scheduledTime = new Date(appointment.scheduled_at);
  const hoursUntil = differenceInHours(scheduledTime, new Date());
  const canModify = hoursUntil >= 24 && appointment.status !== 'cancelled';

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Retour aux réservations
      </button>

      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Détails de la réservation #{appointment.reference}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Reservation Info (Fig 3.12 Top Box) */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-card p-10 rounded-[40px] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">Informations du rendez-vous</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</p>
                    <p className="text-lg font-bold text-slate-900">{format(scheduledTime, 'dd/MM/yyyy', { locale: fr })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Heure</p>
                    <p className="text-lg font-bold text-slate-900">{format(scheduledTime, 'HH:mm')}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expert</p>
                    <p className="text-lg font-bold text-slate-900">{appointment.expert.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lieu</p>
                    <p className="text-lg font-bold text-slate-900">Garage Central, {appointment.expert.city || 'Casablanca'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50 space-y-4">
              <div className="flex items-start gap-4">
                <FileText className="w-6 h-6 text-slate-300 mt-1" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Détails du véhicule & Problème</p>
                  <p className="text-slate-900 font-bold">{appointment.vehicle_details}</p>
                  <p className="text-slate-500 mt-2 text-sm leading-relaxed">{appointment.problem_description || "Aucune description supplémentaire."}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Actions Menu (Fig 3.12 Scenarios) */}
        <div className="lg:col-span-1 space-y-6">
           <section className="glass-card p-8 rounded-[32px] bg-slate-50 border border-slate-200">
             <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 border-b border-slate-200 pb-4">Options d'actions</h4>
             
             {appointment.status === 'cancelled' ? (
                <div className="text-center py-6 space-y-4">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                  <p className="text-red-700 font-bold">Cette réservation est déjà annulée.</p>
                </div>
             ) : !canModify ? (
               /* Scenario B: less than 24h */
               <div className="space-y-6">
                 <div className="p-5 bg-white border border-slate-200 rounded-2xl flex gap-4 text-slate-600 animate-fade-in shadow-sm">
                   <AlertTriangle className="w-8 h-8 text-amber-500 flex-shrink-0" />
                   <p className="text-xs font-medium leading-relaxed">
                     Cette réservation a lieu dans moins de 24 heures. Elle est **verrouillée** et ne peut plus être modifiée ou annulée en ligne.
                   </p>
                 </div>
                 <button disabled className="w-full py-4 bg-slate-200 text-slate-400 font-bold rounded-2xl cursor-not-allowed opacity-50 flex items-center justify-center gap-2">
                   <RefreshCw className="w-4 h-4" /> Modifier la date/heure
                 </button>
                 <button disabled className="w-full py-4 bg-slate-200 text-slate-400 font-bold rounded-2xl cursor-not-allowed opacity-50 flex items-center justify-center gap-2">
                   <XCircle className="w-4 h-4" /> Annuler la réservation
                 </button>
               </div>
             ) : (
               /* Scenario A: more than 24h */
               <div className="space-y-4">
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">[ SCÉNARIO A : Plus de 24h ]</p>
                 <button 
                  onClick={() => alert("Fonctionnalité de modification bientôt disponible (ouvre modale calendrier).")}
                  className="w-full py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-2xl hover:bg-white hover:border-slate-900 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                 >
                   <RefreshCw className="w-4 h-4" /> Modifier la date/heure
                 </button>
                 <button 
                  onClick={handleCancel}
                  className="w-full py-4 bg-red-100/50 text-red-600 font-bold rounded-2xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
                 >
                   <XCircle className="w-4 h-4" /> Annuler la réservation
                 </button>
               </div>
             )}
           </section>

           <div className="p-6 bg-slate-900 rounded-[32px] text-white space-y-4 shadow-xl">
             <div className="flex items-center gap-3">
               <Info className="w-5 h-5 text-primary-400" />
               <p className="text-sm font-bold">Besoin d'aide ?</p>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed">Contactez notre support client si vous rencontrez un problème avec cette réservation.</p>
             <button className="text-xs font-black text-primary-400 hover:text-primary-300 uppercase tracking-widest">Contacter le support</button>
           </div>
        </div>
      </div>
    </div>
  );
}
