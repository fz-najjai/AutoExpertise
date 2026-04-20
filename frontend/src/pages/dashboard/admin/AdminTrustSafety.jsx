import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import SectionPage from '../../shared/SectionPage';
import { ShieldAlert, Users, MessageCircle, RefreshCw, ChevronRight } from 'lucide-react';

const IconMap = {
    ShieldAlert: ShieldAlert,
    Users: Users,
    MessageCircle: MessageCircle
};

export default function AdminTrustSafety() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/trust/safety');
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !data) return <div className="p-20 text-center italic text-indigo-400">Analyse de la sécurité réseau...</div>;

  const { stats, recent_reports } = data || { stats: [], recent_reports: [] };

  return (
    <SectionPage
      title="Trust & Safety"
      subtitle="Surveillez les incidents, les signalements et les contenus problématiques du réseau."
      description="La protection de vos membres est essentielle : suivez les alertes, les actions prises et les tendances de sécurité." 
    >
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        {stats.map((item, i) => {
          const Icon = IconMap[item.icon] || ShieldAlert;
          return (
            <div key={i} className="rounded-[35px] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-all group">
              <div className="flex items-center gap-4 text-slate-700 mb-4">
                <div className="p-3 bg-indigo-50 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">{item.title}</p>
                  <p className="text-4xl font-black text-slate-900">{item.value}</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs font-medium">Alertes en temps réel basées sur l'activité communautaire.</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-[40px] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="bg-slate-50 px-10 py-6 flex items-center justify-between border-b border-slate-100">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Signalements récents</h3>
          <button onClick={fetchStats} className={`p-2 text-slate-400 hover:text-indigo-500 transition-colors ${loading ? 'animate-spin' : ''}`}>
             <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {recent_reports.length > 0 ? recent_reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between px-10 py-6 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="font-bold text-slate-900">Signalement #{report.id}</p>
                    <p className="text-xs text-slate-500 font-medium">Par {report.reporter?.name} contre {report.reported?.name}</p>
                 </div>
              </div>
              <button className="flex items-center gap-2 text-xs font-black text-indigo-500 uppercase tracking-widest hover:underline">
                Traiter <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )) : (
            <div className="py-20 text-center text-slate-400 italic">Aucun signalement en attente.</div>
          )}
        </div>
      </div>
    </SectionPage>
  );
}
