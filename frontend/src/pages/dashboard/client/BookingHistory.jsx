import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { Calendar, User, Clock, ChevronRight, Info, AlertCircle } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function BookingHistory() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past, cancelled
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/client/appointments');
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.scheduled_at);
    const isPast = !isAfter(apptDate, new Date());
    
    if (activeTab === 'cancelled') return appt.status === 'cancelled';
    if (activeTab === 'past') return isPast && appt.status !== 'cancelled';
    return !isPast && appt.status !== 'cancelled';
  }).sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

  const tabs = [
    { id: 'upcoming', label: 'À venir' },
    { id: 'past', label: 'Passées' },
    { id: 'cancelled', label: 'Annulées' },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mon historique de réservations</h2>
        <p className="text-slate-500 font-medium">Suivez et gérez l'ensemble de vos interventions automobiles.</p>
      </div>

      {/* Tabs (Fig 3.11 Top) */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl max-w-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            [ {tab.label} ]
          </button>
        ))}
      </div>

      {/* List of Bookings (Fig 3.11 Center) */}
      <div className="space-y-6">
        {loading ? (
          [1, 2].map(i => (
            <div key={i} className="glass-card p-8 h-40 animate-pulse rounded-[32px] bg-white border border-slate-100"></div>
          ))
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt) => (
            <div 
              key={appt.id}
              className="glass-card p-8 rounded-[32px] border border-slate-100 bg-white hover:border-slate-300 transition-all group flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="flex flex-wrap items-center gap-12 flex-1">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Heure</p>
                  <p className="text-xl font-bold text-slate-900">
                    {format(new Date(appt.scheduled_at), 'dd/MM/yyyy', { locale: fr })}
                  </p>
                  <p className="text-slate-500 font-semibold">{format(new Date(appt.scheduled_at), 'HH:mm')}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expert</p>
                  <p className="text-xl font-bold text-slate-900">{appt.expert.name}</p>
                  <p className="text-slate-500 font-semibold text-sm">{appt.expert.expert_profile?.specialty || 'Expert'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tarif</p>
                  <p className="text-xl font-bold text-slate-900">{appt.expert.expert_profile?.price}€</p>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-4 min-w-[180px]">
                <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${
                  appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                  appt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                   ( {appt.status === 'confirmed' ? 'Confirmé' : appt.status === 'pending' ? 'En attente' : 'Annulé'} )
                </span>
                
                {appt.status !== 'cancelled' && (
                  <button 
                    onClick={() => navigate(`/client/appointments/${appt.id}`)}
                    className="px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
                  >
                    Gérer / Modifier
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 glass-card rounded-[40px] border border-dashed border-slate-200 bg-white/50 text-center space-y-4">
             <AlertCircle className="w-12 h-12 text-slate-200 mx-auto" />
             <p className="text-slate-500 font-medium italic">Aucune réservation dans cette catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
}
