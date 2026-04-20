import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { Users, Briefcase, Activity, ShieldAlert, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const [stats, setStats] = useState({
     clients_count: 0,
     experts_count: 0,
     pending_experts_count: 0,
     appointments_count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="py-20 text-center italic text-indigo-400/50">Analyse de la plateforme en cours...</div>;

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white tracking-tight">Analyse de Vaisseau</h2>
        <p className="text-indigo-200/50 font-medium tracking-tight">Supervisez l'activité et l'état global d'AutoExpertise.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI: Pending Experts */}
        <div className="glass-card rounded-[32px] p-6 lg:p-8 bg-indigo-900/10 border-indigo-500/20 shadow-[0_0_40px_-10px_rgba(79,70,229,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-[50px] -mr-8 -mt-8"></div>
          <div className="flex items-center justify-between z-10 relative">
            <div>
              <p className="text-[10px] text-red-400 font-black uppercase tracking-widest mb-1">Alertes Validations</p>
              <p className="text-4xl font-black text-white">{stats.pending_experts_count}</p>
            </div>
            <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl group-hover:bg-red-500/20 transition-colors">
              <ShieldAlert className="h-8 w-8" />
            </div>
          </div>
          {stats.pending_experts_count > 0 && (
             <Link to="/admin/experts" className="inline-flex mt-6 items-center gap-2 text-xs font-black text-red-400 bg-red-500/10 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-colors uppercase tracking-wider">
               Traiter maintenant <ChevronRight className="w-3 h-3" />
             </Link>
          )}
        </div>

        {/* KPI: Clients */}
        <div className="glass-card rounded-[32px] p-6 lg:p-8 bg-[#020617] border-indigo-900/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[50px] -mr-8 -mt-8"></div>
          <div className="flex items-center justify-between z-10 relative">
            <div>
              <p className="text-[10px] text-indigo-400/50 font-black uppercase tracking-widest mb-1">Total Utilisateurs</p>
              <p className="text-4xl font-black text-white">{stats.clients_count}</p>
            </div>
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
              <Users className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* KPI: Experts */}
        <div className="glass-card rounded-[32px] p-6 lg:p-8 bg-[#020617] border-indigo-900/40 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-[50px] -mr-8 -mt-8"></div>
          <div className="flex items-center justify-between z-10 relative">
            <div>
              <p className="text-[10px] text-indigo-400/50 font-black uppercase tracking-widest mb-1">Total Experts</p>
              <p className="text-4xl font-black text-white">{stats.experts_count}</p>
            </div>
            <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Briefcase className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* KPI: Form */}
        <div className="glass-card rounded-[32px] p-6 lg:p-8 bg-[#020617] border-indigo-900/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[50px] -mr-8 -mt-8"></div>
           <div className="flex items-center justify-between z-10 relative">
            <div>
              <p className="text-[10px] text-indigo-400/50 font-black uppercase tracking-widest mb-1">Rendez-vous créés</p>
              <p className="text-4xl font-black text-white">{stats.appointments_count}</p>
            </div>
            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform">
              <Activity className="h-8 w-8" />
            </div>
          </div>
        </div>

      </div>

      {stats.pending_experts_count > 0 && (
         <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
                 <ShieldAlert className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-red-400 font-bold">Action Requise</h3>
                  <p className="text-sm font-medium text-red-400/60">Il y a {stats.pending_experts_count} profil(s) en attente de vérification.</p>
               </div>
            </div>
            <Link to="/admin/experts" className="w-full sm:w-auto px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl text-sm uppercase tracking-widest transition-colors shadow-lg shadow-red-500/20 text-center">
               Gérer
            </Link>
         </div>
      )}
    </div>
  );
}
