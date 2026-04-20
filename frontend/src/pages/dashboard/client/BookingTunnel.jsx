import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../context/AuthContext';
import { 
  User, 
  Calendar as CalendarIcon, 
  FileText, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Car,
  AlertCircle,
  CreditCard,
  Lock,
  CalendarCheck
} from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../../../components/PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function BookingTunnel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [bookingData, setBookingData] = useState({
    scheduled_at: '',
    vehicle_details: '',
    problem_description: ''
  });
  const [newAppointment, setNewAppointment] = useState(null);

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

  const handleSubmit = async () => {
    setError('');
    try {
      const res = await api.post('/client/appointments', {
        expert_id: id,
        ...bookingData
      });
      setNewAppointment(res.data.appointment);
      setStep(5); // Move to payment
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la réservation.');
    }
  };

  const handlePaymentSuccess = () => {
    navigate('/client/confirmation', { 
      state: { 
        appointment: newAppointment, 
        expert 
      } 
    });
  };

  const steps = [
    { n: 1, name: 'Profil', icon: User },
    { n: 2, name: 'Dispo', icon: CalendarIcon },
    { n: 3, name: 'Véhicule', icon: Car },
    { n: 4, name: 'Validation', icon: CheckCircle },
    { n: 5, name: 'Paiement', icon: CreditCard },
  ];

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Chargement du tunnel...</p>
    </div>
  );

  const selectedDate = bookingData.scheduled_at ? parseISO(bookingData.scheduled_at) : null;
  const availabilitiesOnSelectedDay = expert.availabilities?.filter(a => 
    selectedDate && isSameDay(parseISO(a.start_time), selectedDate)
  ) || [];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 px-4 md:px-0">
      {/* Premium Stepper */}
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center flex-1 last:flex-none">
            <div className={`flex flex-col items-center gap-3 relative z-10 transition-all duration-500 ${step >= s.n ? 'scale-110 opacity-100' : 'scale-100 opacity-40'}`}>
              <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all duration-500 border-2 ${
                step === s.n ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-900/40 rotate-12' : 
                step > s.n ? 'bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/20' : 'bg-white text-slate-300 border-slate-100'
              }`}>
                {step > s.n ? <CheckCircle className="w-6 h-6" /> : <s.icon className="w-6 h-6" />}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] whitespace-now800 ${step >= s.n ? 'text-slate-900' : 'text-slate-400'}`}>{s.name}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-1000 ${step > s.n ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card p-8 md:p-14 rounded-[50px] bg-white border border-slate-100 shadow-2xl shadow-slate-200/40 min-h-[600px] flex flex-col justify-between relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
        
        <div className="animate-fade-in relative z-10" key={step}>
          {step === 1 && (
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Étape 01</span>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Vérification de l'expert</h3>
                <p className="text-slate-500 font-medium text-lg">Veuillez confirmer votre choix avant de continuer.</p>
              </div>
              
              <div className="p-10 bg-slate-50/50 backdrop-blur-sm rounded-[45px] border border-slate-100 flex flex-col md:flex-row items-center gap-10 hover:shadow-inner transition-all">
                <div className="relative group">
                  <div className="w-40 h-40 bg-white rounded-[35px] overflow-hidden shadow-2xl shadow-slate-900/10 p-2">
                    <img 
                      src={expert.expert_profile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=0F172A&color=fff&size=256`} 
                      alt={expert.name} 
                      className="w-full h-full object-cover rounded-[28px] group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-slate-900 border border-slate-100">
                    <CheckCircle className="w-6 h-6 fill-emerald-500 text-white" />
                  </div>
                </div>
                <div className="text-center md:text-left space-y-4 flex-1">
                  <div>
                    <h4 className="text-4xl font-black text-slate-900 leading-none mb-2">{expert.name}</h4>
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl">{expert.expert_profile?.specialty}</span>
                  </div>
                  <p className="text-slate-500 font-medium italic opacity-80 leading-relaxed">"{expert.expert_profile?.bio || 'Ce professionnel est prêt à intervenir pour votre diagnostic.'}"</p>
                  <div className="pt-4 flex items-center gap-4">
                    <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Prix de base</p>
                      <p className="text-2xl font-black text-slate-900">{expert.expert_profile?.price}€</p>
                    </div>
                    <div className="px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700">
                       <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Disponibilité</p>
                       <p className="text-lg font-bold">Immédiate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Étape 02</span>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Plannifier l'intervention</h3>
                <p className="text-slate-500 font-medium text-lg">Choisissez un créneau parmi les disponibilités de l'expert.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 space-y-6">
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                     <CalendarIcon className="w-5 h-5 text-slate-400" />
                     Sélectionnez le jour
                   </h4>
                   <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 shadow-inner group">
                     <input 
                      type="date"
                      className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none cursor-pointer group-hover:translate-x-1 transition-transform"
                      min={format(new Date(), 'yyyy-MM-dd')}
                      value={bookingData.scheduled_at ? format(parseISO(bookingData.scheduled_at), 'yyyy-MM-dd') : ''}
                      onChange={(e) => setBookingData({...bookingData, scheduled_at: e.target.value + 'T09:00'})}
                     />
                   </div>
                   <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-start gap-4">
                     <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                     <p className="text-sm text-amber-800 font-medium leading-relaxed">
                       L'expert se déplace à votre domicile ou sur le lieu de votre choix dans un rayon de 30km autour de <strong>{expert.city}</strong>.
                     </p>
                   </div>
                </div>

                <div className="lg:col-span-1 flex items-center justify-center opacity-20 hidden lg:flex">
                  <div className="w-[2px] h-48 bg-slate-200 rounded-full"></div>
                </div>

                <div className="lg:col-span-6 space-y-6">
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                     <Clock className="w-5 h-5 text-slate-400" />
                     Choisissez l'heure
                   </h4>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                     {expert.availabilities?.length > 0 ? (
                       expert.availabilities
                         .filter(a => bookingData.scheduled_at && isSameDay(parseISO(a.start_time), parseISO(bookingData.scheduled_at)))
                         .map((avail) => {
                           const timeStr = format(parseISO(avail.start_time), 'HH:mm');
                           const isActive = bookingData.scheduled_at === avail.start_time;
                           return (
                             <button
                               key={avail.id}
                               onClick={() => setBookingData({...bookingData, scheduled_at: avail.start_time})}
                               className={`py-5 rounded-[22px] font-black text-sm border-2 transition-all duration-300 transform active:scale-95 shadow-sm ${
                                 isActive 
                                   ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20' 
                                   : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:shadow-md'
                               }`}
                             >
                               {timeStr}
                             </button>
                           );
                         })
                     ) : null}
                     
                     {availabilitiesOnSelectedDay.length === 0 && bookingData.scheduled_at && (
                       <div className="col-span-full py-10 text-center bg-slate-50 rounded-[30px] border border-dashed border-slate-200">
                         <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                         <p className="text-slate-500 font-bold text-sm">Aucun créneau ce jour-là.</p>
                       </div>
                     )}
                     {!bookingData.scheduled_at && (
                       <div className="col-span-full py-10 text-center opacity-40">
                         <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sélectionnez une date d'abord</p>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Étape 03</span>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Détails du véhicule</h3>
                <p className="text-slate-500 font-medium text-lg text-balance">Décrivez votre voiture et le problème rencontré pour optimiser le diagnostic.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Modèle & Motorisation *</label>
                    <div className="relative group">
                      <Car className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                      <input 
                        type="text"
                        className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[32px] outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-300 font-bold text-lg transition-all"
                        placeholder="Ex: Tesla Model 3 Long Range"
                        value={bookingData.vehicle_details}
                        onChange={e => setBookingData({...bookingData, vehicle_details: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-6 relative z-10">
                       <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                         <CheckCircle className="w-8 h-8 text-emerald-400" />
                       </div>
                       <div>
                         <p className="text-xl font-black mb-1 leading-none">Diagnostic complet</p>
                         <p className="text-slate-400 text-sm font-medium">Inclus: rapport digital & conseils après-vente.</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Description du besoin *</label>
                  <div className="relative group h-full">
                    <FileText className="absolute left-6 top-8 w-6 h-6 text-slate-400 group-focus-within:text-slate-900 transition-all" />
                    <textarea 
                      rows="8"
                      className="w-full pl-16 pr-8 py-8 bg-slate-50 border border-slate-100 rounded-[40px] outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-300 font-medium text-slate-700 resize-none transition-all h-[calc(100%-32px)]"
                      placeholder="Expliquez ici les bruits suspects, voyants allumés ou le contexte de l'expertise (ex: avant achat)..."
                      value={bookingData.problem_description}
                      onChange={e => setBookingData({...bookingData, problem_description: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-12">
              <div className="space-y-4 text-center">
                <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Étape 04</span>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Récapitulatif final</h3>
                <p className="text-slate-500 font-medium text-lg">Veuillez valider toutes les informations ci-dessous.</p>
              </div>

              {error && (
                <div className="p-6 bg-red-50 border-2 border-red-100 rounded-[35px] flex items-center gap-5 text-red-700 font-black text-sm animate-shake shadow-lg shadow-red-500/5">
                  <AlertCircle className="w-8 h-8 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm hover:shadow-xl transition-all">
                       <User className="w-8 h-8 text-slate-200 mb-6" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Votre Expert</p>
                       <p className="text-2xl font-black text-slate-900">{expert.name}</p>
                    </div>
                    <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm hover:shadow-xl transition-all">
                       <CalendarIcon className="w-8 h-8 text-slate-200 mb-6" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date & Heure</p>
                       <p className="text-2xl font-black text-slate-900">
                         {bookingData.scheduled_at ? format(parseISO(bookingData.scheduled_at), 'dd MMM yyyy', { locale: fr }) : 'Err'}
                       </p>
                       <p className="text-slate-500 font-black">{bookingData.scheduled_at ? format(parseISO(bookingData.scheduled_at), 'HH:mm') : ''}</p>
                    </div>
                    <div className="md:col-span-2 p-8 bg-slate-50 border border-slate-100 rounded-[40px]">
                       <Car className="w-8 h-8 text-slate-200 mb-6" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Véhicule concerné</p>
                       <p className="text-xl font-bold text-slate-900">{bookingData.vehicle_details}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                   <div className="p-10 bg-slate-900 rounded-[50px] text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
                     <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mb-24 -mr-24 blur-2xl"></div>
                     <div className="space-y-8 relative z-10">
                        <h4 className="text-xl font-black border-b border-white/10 pb-6">Détail du prix</h4>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center group">
                             <span className="text-slate-400 font-bold group-hover:text-white transition-colors">Intervention</span>
                             <span className="font-black">{expert.expert_profile?.price}€</span>
                           </div>
                           <div className="flex justify-between items-center group">
                             <span className="text-slate-400 font-bold group-hover:text-white transition-colors">Frais de déplacement</span>
                             <span className="font-black text-emerald-400">OFFERT</span>
                           </div>
                           <div className="flex justify-between items-center group">
                             <span className="text-slate-400 font-bold group-hover:text-white transition-colors">Service Fee (Platform)</span>
                             <span className="font-black">1.50€</span>
                           </div>
                        </div>
                     </div>
                     <div className="pt-10 relative z-10">
                        <div className="flex justify-between items-end">
                           <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Total à régler</p>
                             <p className="text-5xl font-black text-white">{(expert.expert_profile?.price + 1.5).toFixed(2)}€</p>
                           </div>
                           <Lock className="w-8 h-8 text-white/20 mb-2" />
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-12 animate-fade-in py-10">
              <div className="space-y-4 text-center">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                  <CreditCard className="w-12 h-12" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Paiement Sécurisé</h3>
                <p className="text-slate-500 font-medium max-w-lg mx-auto text-lg leading-relaxed">
                  Votre réservation sera validée instantanément après confirmation du paiement par Stripe.
                </p>
              </div>

              <div className="max-w-xl mx-auto p-12 bg-slate-50 rounded-[50px] border border-slate-100 shadow-inner">
                <Elements stripe={stripePromise}>
                   <PaymentForm 
                    appointment={newAppointment} 
                    onSuccess={handlePaymentSuccess} 
                   />
                </Elements>
                <div className="mt-10 flex items-center justify-center gap-3 opacity-40 grayscale">
                   <Lock className="w-4 h-4 text-slate-900" />
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Paiement certifié PCI-DSS Level 1</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar (Footer) */}
        <div className="mt-16 pt-12 border-t border-slate-50 flex flex-col md:flex-row gap-6 justify-between items-center relative z-20">
          <button 
            onClick={() => step === 1 ? navigate(-1) : setStep(step - 1)}
            disabled={step === 5}
            className="w-full md:w-auto px-12 py-6 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-900 hover:bg-slate-50 rounded-[28px] transition-all flex items-center justify-center gap-3 disabled:opacity-0"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            {step === 1 ? 'Annuler' : 'Étape précédente'}
          </button>
          
          <button 
            onClick={() => {
               if (step === 4) handleSubmit();
               else if (step === 2 && !bookingData.scheduled_at) alert('Veuillez sélectionner un créneau disponible.');
               else if (step === 3 && (!bookingData.vehicle_details || !bookingData.problem_description)) alert('Veuillez remplir tous les champs obligatoires.');
               else if (step === 5) return; 
               else setStep(step + 1);
            }}
            className={`w-full md:w-auto btn-primary px-16 py-6 shadow-[0_20px_50px_rgba(15,23,42,0.2)] flex items-center justify-center gap-4 group rounded-[28px] animate-fade-up ${step === 5 ? 'hidden' : ''}`}
          >
            <span className="font-black uppercase tracking-[0.2em] text-xs">
              {step === 4 ? 'Confirmer & Régler' : 'Continuer'}
            </span>
            {step < 4 && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </div>
    </div>
  );
}

