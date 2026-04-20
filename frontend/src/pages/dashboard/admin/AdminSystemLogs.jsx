import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import SectionPage from '../../shared/SectionPage';
import { Activity, Clock, Terminal, Search, RefreshCw } from 'lucide-react';

export default function AdminSystemLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/system/logs');
      setLogs(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <SectionPage
      title="Logs d’audit"
      subtitle="Consultez l’historique des actions critiques réalisées au sein de l’administration."
      description="Chaque entrée indique le type d’action, l’heure et le contexte pour améliorer la traçabilité et le support."
    >
      <div className="rounded-[40px] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="bg-slate-50 px-10 py-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3 text-slate-900">
            <Activity className="w-5 h-5 text-indigo-500" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Journal d’activité plateforme</h2>
          </div>
          <button onClick={fetchLogs} className={`p-2 text-slate-400 hover:text-indigo-500 transition-colors ${loading ? 'animate-spin' : ''}`}>
             <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {logs.length > 0 ? logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between px-10 py-6 hover:bg-slate-50/50 transition-colors group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all">
                    <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{log.action}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {log.user ? log.user.name : 'Système'} • {log.ip_address || 'IP Interne'}
                    {log.model && ` • ${log.model} #${log.model_id}`}
                  </p>
                </div>
              </div>
              <div className="text-right text-slate-400 text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                {new Date(log.created_at).toLocaleString()}
              </div>
            </div>
          )) : (
            <div className="py-20 text-center text-slate-400 italic font-medium">
                {loading ? 'Interrogation de la base de données...' : 'Aucun log d’audit trouvé.'}
            </div>
          )}
        </div>
      </div>
    </SectionPage>
  );
}
