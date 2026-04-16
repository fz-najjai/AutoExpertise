import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { Calendar as CalendarIcon, PieChart, Activity, TrendingUp, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Overview() {
  const [stats, setStats] = useState({ total_bookings: 0, occupation_rate: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, aptRes] = await Promise.all([
          api.get('/expert/dashboard'),
          api.get('/expert/appointments')
        ]);
        setStats(statsRes.data);
        setAppointments(aptRes.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div className="py-20 text-center italic text-gray-500">Chargement du tableau de bord...</div>;

  const todayAppointments = appointments.filter(apt => 
    new Date(apt.scheduled_at).toDateString() === new Date().toDateString() && apt.status === 'confirmed'
  ).sort((a,b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Bonjour, Docteur</h2>
        <p className="text-slate-500 font-medium tracking-tight">Voici le résumé de votre activité d'aujourd'hui.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-[32px] p-8 shadow-2xl flex items-center justify-between border border-slate-200 relative overflow-hidden group hover:border-primary-500/20 transition-all bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl -mr-16 -mt-16"></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Rendez-vous terminés</p>
            <p className="text-4xl font-black text-slate-900">{stats.total_bookings}</p>
          </div>
          <div className="p-4 bg-primary-500/10 text-primary-500 rounded-2xl group-hover:scale-110 transition-transform">
            <Briefcase className="h-8 w-8" />
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-8 shadow-2xl flex items-center justify-between border border-slate-200 relative overflow-hidden group hover:border-blue-500/20 transition-all bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16"></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Taux d'occupation</p>
            <p className="text-4xl font-black text-slate-900">{stats.occupation_rate}%</p>
          </div>
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
            <PieChart className="h-8 w-8" />
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-8 shadow-2xl flex items-center justify-between border border-slate-200 relative overflow-hidden group hover:border-emerald-500/20 transition-all bg-white">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16"></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Demandes en attente</p>
            <p className="text-4xl font-black text-slate-900">{appointments.filter(a => a.status === 'pending').length}</p>
          </div>
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
            <Activity className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="glass-card rounded-[32px] p-8 shadow-2xl border border-slate-200 bg-white space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
            <CalendarIcon className="w-6 h-6 text-primary-500" />
            Planning du Jour
          </h3>
          <span className="text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-50 px-4 py-2 rounded-xl">
             {format(new Date(), 'EEEE d MMMM', { locale: fr })}
          </span>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="py-12 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
               <TrendingUp className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-bold text-slate-400">Aucun rendez-vous prévu pour aujourd'hui.</p>
            <p className="text-sm font-medium text-slate-500">Profitez-en pour mettre à jour votre profil ou ajouter des disponibilités.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="text-center w-20 border-r border-slate-200 pr-6">
                    <p className="text-2xl font-black text-primary-400">{format(new Date(apt.scheduled_at), 'HH:mm')}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Heure</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">{apt.client.name}</h4>
                    <p className="text-sm text-slate-500 font-medium">#{apt.reference}</p>
                  </div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto p-4 md:p-0 bg-slate-100 md:bg-transparent rounded-xl md:rounded-none mt-4 md:mt-0">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Véhicule</p>
                  <p className="font-bold text-slate-900">{apt.vehicle_details}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
