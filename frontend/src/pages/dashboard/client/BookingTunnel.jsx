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
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
      navigate('/client/confirmation', { state: { appointment: res.data.appointment, expert } });
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la réservation.');
    }
  };

  const steps = [
    { n: 1, name: 'Expert', icon: User },
    { n: 2, name: 'Créneau', icon: CalendarIcon },
    { n: 3, name: 'Détails', icon: FileText },
    { n: 4, name: 'Validation', icon: CheckCircle },
  ];

  if (loading) return <div className="text-center py-20 italic">Chargement du tunnel de réservation...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Stepper (Fig 3.9 Top) */}
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center flex-1 last:flex-none">
            <div className={`flex flex-col items-center gap-3 relative z-10 ${step >= s.n ? 'text-slate-900' : 'text-slate-300'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                step === s.n ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20' : 
                step > s.n ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-300 border-slate-100'
              }`}>
                {step > s.n ? <CheckCircle className="w-7 h-7" /> : <s.icon className="w-7 h-7" />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{s.n}. {s.name}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-4 transition-all duration-700 ${step > s.n ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card p-10 rounded-[40px] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 min-h-[500px] flex flex-col justify-between">
        <div className="animate-fade-in" key={step}>
          {step === 1 && (
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Vérification de l'expert</h3>
                <p className="text-slate-500 font-medium">Vous avez choisi de réserver une expertise avec le professionnel suivant.</p>
              </div>
              <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-white rounded-[32px] overflow-hidden shadow-xl">
                  <img src={expert.expert_profile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=0F172A&color=fff&size=256`} alt={expert.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left space-y-2">
                  <h4 className="text-3xl font-black text-slate-900">{expert.name}</h4>
                  <p className="text-lg font-bold text-slate-400">{expert.expert_profile?.specialty}</p>
                  <p className="text-primary-600 font-black text-xl mt-4">{expert.expert_profile?.price}€ <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">/ l'intervention</span></p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10">
              <div className="space-y-4 text-center">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Choisir un créneau</h3>
                <p className="text-slate-500 font-medium">Sélectionnez la date et l'heure qui vous conviennent.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Date du rendez-vous</h4>
                   <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                     <input 
                      type="date"
                      className="w-full bg-transparent text-xl font-bold text-slate-900 outline-none cursor-pointer"
                      value={bookingData.scheduled_at.split('T')[0]}
                      onChange={(e) => setBookingData({...bookingData, scheduled_at: e.target.value + 'T10:00'})}
                     />
                   </div>
                </div>
                <div className="space-y-4">
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Horaires disponibles</h4>
                   <div className="grid grid-cols-2 gap-3">
                     {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                       <button
                        key={time}
                        onClick={() => {
                          const date = bookingData.scheduled_at.split('T')[0] || format(new Date(), 'yyyy-MM-dd');
                          setBookingData({...bookingData, scheduled_at: `${date}T${time}`});
                        }}
                        className={`py-4 rounded-2xl font-bold border-2 transition-all ${
                          bookingData.scheduled_at.includes(time) 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                            : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                        }`}
                       >
                         {time}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Détails de l'expertise</h3>
                <p className="text-slate-500 font-medium">Fournissez des informations sur votre véhicule pour aider l'expert.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 ml-2">Modèle du véhicule *</label>
                  <div className="relative">
                    <Car className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                    <input 
                      type="text"
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-3xl outline-none focus:ring-2 focus:ring-slate-900/5 font-bold"
                      placeholder="Ex: BMW Série 3 (2020)"
                      value={bookingData.vehicle_details}
                      onChange={e => setBookingData({...bookingData, vehicle_details: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 ml-2">Description du problème (Optionnel)</label>
                  <div className="relative">
                    <FileText className="absolute left-6 top-6 w-6 h-6 text-slate-400" />
                    <textarea 
                      rows="5"
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-3xl outline-none focus:ring-2 focus:ring-slate-900/5 font-medium resize-none"
                      placeholder="Expliquez brièvement la raison de l'expertise..."
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
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight text-center">Récapitulatif</h3>
                <p className="text-slate-500 font-medium text-center">Vérifiez les informations avant de confirmer.</p>
              </div>

              {error && (
                <div className="p-5 bg-red-50 border border-red-100 rounded-[32px] flex items-center gap-4 text-red-700 font-bold text-sm animate-fade-in">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-slate-900 rounded-[40px] text-white shadow-2xl space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rendez-vous le</p>
                      <p className="text-xl font-bold">
                        {bookingData.scheduled_at ? format(new Date(bookingData.scheduled_at), 'dd MMMM yyyy', { locale: fr }) : 'Non défini'}
                      </p>
                      <p className="text-slate-400 font-bold">{bookingData.scheduled_at ? format(new Date(bookingData.scheduled_at), 'HH:mm') : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expert</p>
                      <p className="text-xl font-bold">{expert.name}</p>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 space-y-8">
                   <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Car className="w-4 h-4" /> Véhicule
                    </p>
                    <p className="font-bold text-slate-900 text-lg">{bookingData.vehicle_details || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Durée estimée
                    </p>
                    <p className="font-bold text-slate-900 text-lg">1 Heure</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <button 
            onClick={() => step === 1 ? navigate(-1) : setStep(step - 1)}
            className="w-full md:w-auto px-10 py-5 text-slate-900 font-bold hover:bg-slate-50 rounded-[28px] transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            {step === 1 ? 'Annuler' : 'Étape précédente'}
          </button>
          
          <button 
            onClick={() => {
               if (step === 4) handleSubmit();
               else if (step === 2 && !bookingData.scheduled_at) alert('Veuillez sélectionner un créneau');
               else if (step === 3 && !bookingData.vehicle_details) alert('Veuillez renseigner le véhicule');
               else setStep(step + 1);
            }}
            className="w-full md:w-auto btn-primary px-12 py-5 shadow-2xl flex items-center justify-center gap-2 group"
          >
            {step === 4 ? 'Confirmer la réservation' : 'Continuer'}
            {step < 4 && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </div>
    </div>
  );
}
