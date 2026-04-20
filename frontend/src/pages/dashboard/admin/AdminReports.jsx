import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  User, 
  Calendar, 
  Search,
  MessageSquare,
  ShieldCheck,
  Flag
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports');
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleProcess = async (id, status) => {
    try {
      await api.post(`/admin/reports/${id}/process`, { status });
      fetchReports();
    } catch (err) {
      alert('Erreur: ' + (err.response?.data?.message || 'Problème lors du traitement'));
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Chargement des signalements...</p>
    </div>
  );

  const filteredReports = reports.filter(r => r.status === filter);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/10">
                <Flag className="w-6 h-6" />
             </div>
             <h2 className="text-4xl font-black text-white tracking-tight">Signalements</h2>
          </div>
          <p className="text-indigo-200/50 font-medium text-lg">Modérez les comportements inappropriés et maintenez la qualité de la plateforme.</p>
        </div>

        <div className="flex bg-[#0f172a] p-1.5 rounded-2xl border border-indigo-900/40">
           {['pending', 'resolved', 'dismissed'].map((t) => (
             <button
               key={t}
               onClick={() => setFilter(t)}
               className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 filter === t 
                 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                 : 'text-indigo-200/40 hover:text-indigo-200'
               }`}
             >
               {t === 'pending' ? 'À traiter' : t === 'resolved' ? 'Résolus' : 'Classés'}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {filteredReports.length === 0 ? (
           <div className="glass-card bg-white/5 p-20 rounded-[45px] border border-white/5 text-center space-y-4">
              <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                 <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Tout est en ordre</h3>
              <p className="text-indigo-200/40 font-medium italic">Aucun signalement de type "{filter}" à afficher.</p>
           </div>
         ) : (
           filteredReports.map((report) => (
             <div key={report.id} className="glass-card bg-white/5 p-8 md:p-10 rounded-[45px] border border-white/5 hover:bg-white/[0.08] transition-all group relative overflow-hidden">
                {/* Background ID text */}
                <div className="absolute top-10 right-10 text-[120px] font-black text-white/5 select-none pointer-events-none -mr-10 -mt-20">#{report.id}</div>
                
                <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                   {/* Info Area */}
                   <div className="flex-1 space-y-8">
                      <div className="flex items-center gap-6">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Motif du signalement</p>
                            <h4 className="text-2xl font-black text-white">{report.reason || 'Comportement suspect'}</h4>
                         </div>
                         <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest">
                            Urgence Moyenne
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="p-6 bg-white/5 rounded-3xl space-y-4 border border-white/5">
                            <p className="text-[10px] font-black text-indigo-200/30 uppercase tracking-widest">Rapporté par</p>
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black">
                                  {report.reporter?.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="font-bold text-white">{report.reporter?.name}</p>
                                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{report.reporter?.role}</p>
                               </div>
                            </div>
                         </div>
                         <div className="p-6 bg-red-500/5 rounded-3xl space-y-4 border border-red-500/10">
                            <p className="text-[10px] font-black text-indigo-200/30 uppercase tracking-widest">Utilisateur visé</p>
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black">
                                  {report.reported?.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="font-bold text-white">{report.reported?.name}</p>
                                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">{report.reported?.role}</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-3">
                         <p className="text-[10px] font-black text-indigo-200/30 uppercase tracking-widest ml-1">Notes Additionnelles</p>
                         <div className="p-8 bg-[#020617] rounded-[35px] border border-white/5 text-indigo-100/70 font-medium italic leading-relaxed">
                            "{report.notes || 'Aucun détail supplémentaire fourni par l\'utilisateur.'}"
                         </div>
                      </div>
                   </div>

                   {/* Actions Area */}
                   <div className="w-full lg:w-72 flex flex-col justify-between border-l border-white/5 lg:pl-10 space-y-8">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3 text-indigo-200/50">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-bold">{format(parseISO(report.created_at), 'dd MMMM yyyy', { locale: fr })}</span>
                         </div>
                         <div className="flex items-center gap-3 text-indigo-200/50">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-bold">{format(parseISO(report.created_at), 'HH:mm')}</span>
                         </div>
                      </div>

                      {report.status === 'pending' && (
                         <div className="space-y-4">
                            <button 
                              onClick={() => handleProcess(report.id, 'resolved')}
                              className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 hover:scale-105 transition-all"
                            >
                               <CheckCircle2 className="w-5 h-5" /> Sanctionner
                            </button>
                            <button 
                              onClick={() => handleProcess(report.id, 'dismissed')}
                              className="w-full py-5 bg-white/5 text-indigo-200 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                            >
                               <XCircle className="w-5 h-5" /> Ignorer
                            </button>
                         </div>
                      )}
                      
                      {report.status !== 'pending' && (
                         <div className={`p-6 rounded-[30px] border text-center ${report.status === 'resolved' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-slate-500/5 border-slate-500/20 text-slate-400'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1">État du dossier</p>
                            <p className="font-bold text-sm uppercase">{report.status === 'resolved' ? 'Résolu' : 'Classé sans suite'}</p>
                         </div>
                      )}
                   </div>
                </div>
             </div>
           ))
         )}
      </div>
    </div>
  );
}
