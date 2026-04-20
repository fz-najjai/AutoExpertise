import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Star, 
  ChevronRight,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
        <p className="text-indigo-200/50 font-medium animate-pulse">Calcul des algorithmes de performance...</p>
      </div>
    );
  }

  if (!data) return <div className="text-white text-center py-20">Erreur lors de la récupération des données.</div>;

  const { users, appointments, reviews, top_experts } = data;

  // Chart Details
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1b4b',
        titleFont: { size: 14, weight: 'bold' },
        padding: 12,
        cornerRadius: 12,
      }
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6366f1' } },
      x: { grid: { display: false }, ticks: { color: '#6366f1' } }
    }
  };

  const bookingsChart = {
    labels: appointments.monthly.map(m => m.month),
    datasets: [{
      label: 'Réservations',
      data: appointments.monthly.map(m => m.total),
      backgroundColor: 'rgba(79, 70, 229, 0.6)',
      borderColor: '#6366f1',
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const statusChart = {
    labels: ['En attente', 'Confirmé', 'Terminé', 'Annulé'],
    datasets: [{
      data: [appointments.pending, appointments.confirmed, appointments.completed, appointments.cancelled],
      backgroundColor: [
        'rgba(245, 158, 11, 0.6)',
        'rgba(59, 130, 246, 0.6)',
        'rgba(16, 185, 129, 0.6)',
        'rgba(239, 68, 68, 0.6)'
      ],
      hoverOffset: 20
    }]
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-indigo-500" />
            Dashboard Analytique
          </h2>
          <p className="text-indigo-200/50 font-medium">Vue d'ensemble de la croissance et des performances d'AutoExpertise.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-6 py-3 rounded-2xl bg-indigo-500/10 border-indigo-500/20">
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Nouveaux ce mois</p>
            <p className="text-2xl font-black text-white">+{users.new_this_month}</p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Utilisateurs" value={users.total} icon={<Users />} color="blue" />
        <KPICard title="Experts" value={users.experts} icon={<Briefcase />} color="purple" />
        <KPICard title="Réservations" value={appointments.total} icon={<Calendar />} color="indigo" />
        <KPICard title="Note Moyenne" value={reviews.average_rating} icon={<Star />} color="amber" suffix="/ 5" />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bookings Trend */}
        <div className="lg:col-span-2 glass-card p-8 rounded-[40px] bg-[#020617] border-indigo-900/40">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-indigo-500" />
              Volume de réservations
            </h3>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full">Mensuel</span>
          </div>
          <div className="h-80">
            <Bar options={barOptions} data={bookingsChart} />
          </div>
        </div>

        {/* Status Distribution */}
        <div className="glass-card p-8 rounded-[40px] bg-[#020617] border-indigo-900/40 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-8">Répartition des statuts</h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-[240px]">
              <Doughnut 
                data={statusChart} 
                options={{
                  plugins: { legend: { position: 'bottom', labels: { color: '#6366f1', padding: 20, font: { weight: 'bold', size: 10 } } } },
                  cutout: '70% shadow'
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Experts & Alert Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Top Experts List */}
        <div className="lg:col-span-3 glass-card p-8 rounded-[40px] bg-[#020617] border-indigo-900/40 space-y-6">
          <div className="flex items-center justify-between border-b border-indigo-900/20 pb-4">
             <h3 className="text-xl font-bold text-white flex items-center gap-3">
               <UserCheck className="w-6 h-6 text-emerald-500" />
               Performers Top 5
             </h3>
             <p className="text-xs font-bold text-indigo-400/50 uppercase tracking-widest">Par interventions terminées</p>
          </div>
          
          <div className="space-y-4">
            {top_experts.length > 0 ? top_experts.map((expert, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-indigo-500/5 rounded-3xl border border-transparent hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 font-black text-lg">
                      {idx + 1}
                   </div>
                   <div>
                     <p className="font-bold text-white">{expert.name}</p>
                     <p className="text-xs text-indigo-300/50">{expert.specialty}</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white">{expert.completed}</p>
                  <p className="text-[10px] text-indigo-400 uppercase font-black">Missions</p>
                </div>
              </div>
            )) : (
              <p className="text-indigo-200/30 text-center py-10 italic">Pas encore de données de performance.</p>
            )}
          </div>
        </div>

        {/* Validation Alert / Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
           <div className={`p-8 rounded-[40px] border transition-all ${
             users.pending_experts > 0 
               ? 'bg-red-500/10 border-red-500/30' 
               : 'bg-emerald-500/10 border-emerald-500/30'
           }`}>
              <div className="flex items-center gap-4 mb-6">
                 {users.pending_experts > 0 ? (
                   <ShieldAlert className="w-12 h-12 text-red-500" />
                 ) : (
                   <UserCheck className="w-12 h-12 text-emerald-500" />
                 )}
                 <div>
                    <h4 className={`font-black uppercase tracking-widest text-sm ${users.pending_experts > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      Validation Experts
                    </h4>
                    <p className="text-white font-medium">
                      {users.pending_experts > 0 
                        ? `${users.pending_experts} nouveau(x) profil(s) à vérifier.` 
                        : "Tous les profils sont à jour."}
                    </p>
                 </div>
              </div>
              <button 
                onClick={() => window.location.href='/admin/experts'}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg ${
                users.pending_experts > 0 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
              }`}>
                Accéder aux validations
              </button>
           </div>

           <div className="glass-card p-8 rounded-[40px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20">
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-4">Export de données</h4>
              <p className="text-indigo-100/60 text-sm mb-6">Générez un rapport complet de l'activité plateforme au format PDF ou Excel.</p>
              <button disabled className="w-full py-3 bg-white/10 text-white/40 font-bold rounded-2xl cursor-not-allowed border border-white/5">
                Bientôt disponible
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, color, suffix = "" }) {
  const colors = {
    blue: 'text-blue-500 bg-blue-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
    indigo: 'text-indigo-500 bg-indigo-500/10',
    amber: 'text-amber-500 bg-amber-500/10'
  };

  return (
    <div className="glass-card rounded-[32px] p-8 bg-[#020617] border-indigo-900/40 relative overflow-hidden group">
      <div className="flex items-center justify-between z-10 relative">
        <div>
          <p className="text-[10px] text-indigo-400/50 font-black uppercase tracking-widest mb-1">{title}</p>
          <p className="text-4xl font-black text-white">{value}{suffix}</p>
        </div>
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${colors[color]}`}>
          {cloneElement(icon, { className: 'h-8 w-8' })}
        </div>
      </div>
    </div>
  );
}

// Helper to clone lucide icon with class
import { cloneElement } from 'react';
