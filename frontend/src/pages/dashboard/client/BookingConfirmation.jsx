import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, User, Phone, Mail, ArrowRight, LayoutDashboard } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function BookingConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Handle case where state is missing (direct access)
  if (!state || !state.appointment) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Session expirée</h2>
        <Link to="/client/dashboard" className="text-primary-600 hover:underline">Retour au tableau de bord</Link>
      </div>
    );
  }

  const { appointment, expert } = state;

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-10">
      {/* Success Animation Container (Fig 3.10 Top) */}
      <div className="text-center space-y-8 animate-fade-in">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative z-10 animate-bounce-subtle">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">Votre réservation est confirmée !</h2>
          <p className="text-slate-500 font-medium text-lg">Un email de confirmation vous a été envoyé à votre adresse.</p>
        </div>
      </div>

      {/* Booking Recaps (Fig 3.10 Center) */}
      <div className="glass-card p-10 rounded-[40px] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10 animate-fade-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Numéro de réservation</p>
              <p className="text-2xl font-black text-primary-600 underline underline-offset-8">#{appointment.reference}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date & Heure</p>
                  <p className="font-bold text-slate-900">
                    {format(new Date(appointment.scheduled_at), 'dd/MM/yyyy', { locale: fr })} à {format(new Date(appointment.scheduled_at), 'HH:mm')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expert</p>
                  <p className="font-bold text-slate-900">{expert.name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col justify-center gap-6">
            <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-2">Coordonnées de l'expert</h4>
            <div className="space-y-1.5">
               <div className="flex items-center gap-2 text-slate-600 font-medium">
                 <Phone className="w-4 h-4 text-slate-400" />
                 {expert.phone || '06 12 34 56 78'}
               </div>
               <div className="flex items-center gap-2 text-slate-600 font-medium">
                 <Mail className="w-4 h-4 text-slate-400" />
                 {expert.email}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA (Fig 3.10 Bottom) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in transition-delay-500">
        <Link 
          to="/client/dashboard"
          className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 rounded-[28px] text-slate-900 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
        >
          <LayoutDashboard className="w-5 h-5" />
          Retour au tableau de bord
        </Link>
        <Link 
          to="/client/history"
          className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-[28px] font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 group"
        >
          Voir mes réservations
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
