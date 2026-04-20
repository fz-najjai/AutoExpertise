import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { CreditCard, ArrowUpRight, DollarSign, Clock, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

export default function Payouts() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ available: 0 });
  const [requesting, setRequesting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payoutsRes, earningsRes] = await Promise.all([
        api.get('/expert/payouts'),
        api.get('/expert/earnings')
      ]);
      setPayouts(payoutsRes.data);
      setStats({ available: earningsRes.data.net_revenue });
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestPayout = async () => {
    if (stats.available <= 0) return;
    setRequesting(true);
    try {
      await api.post('/expert/payouts');
      await fetchData();
      alert("Votre demande de virement a été enregistrée.");
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.message || "Impossible de traiter le virement."));
    }
    setRequesting(false);
  };

  if (loading && payouts.length === 0) return <div className="p-20 text-center font-bold text-slate-500 animate-pulse italic">Synchronisation avec Stripe...</div>;

  return (
    <div className="space-y-12 pb-20">
       <div className="space-y-2">
           <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200/50">
                <CreditCard className="w-6 h-6" />
             </div>
             Virements Bancaires
           </h2>
           <p className="text-slate-500 font-medium text-lg">Gérez vos revenus et planifiez vos retraits vers votre compte bancaire.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-4 glass-card bg-slate-900 text-white p-10 rounded-[45px] border-none shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 blur-[80px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000 -mr-20 -mt-20"></div>
               <div className="space-y-10 relative z-10">
                   <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Solde Disponible</p>
                      <button onClick={fetchData} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      </button>
                   </div>

                   <div className="space-y-2">
                       <p className="text-6xl font-black tracking-tighter">{stats.available.toFixed(2)}<span className="text-2xl text-slate-500 ml-1">€</span></p>
                       <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle className="w-3 h-3" /> Prêt pour virement
                       </p>
                   </div>
                   
                   <button 
                     onClick={handleRequestPayout}
                     disabled={stats.available <= 0 || requesting}
                     className="w-full py-5 bg-primary-500 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-600 disabled:bg-slate-800 disabled:text-slate-600 rounded-[22px] flex justify-center items-center gap-3 transition-all shadow-xl shadow-primary-500/20 active:scale-95"
                   >
                      {requesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                      Demander un retrait
                   </button>

                   <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex gap-4">
                      <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                        Les virements prennent généralement 2 à 3 jours ouvrés pour apparaître sur votre compte bancaire après validation.
                      </p>
                   </div>
               </div>
           </div>

           <div className="lg:col-span-8 glass-card bg-white p-10 rounded-[45px] border border-slate-100 shadow-2xl shadow-slate-200/40">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="font-black text-xl text-slate-900 tracking-tight flex items-center gap-3">
                      <DollarSign className="w-6 h-6 text-primary-500" /> Historique des règlements
                  </h3>
                  <span className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full">Derniers 12 mois</span>
               </div>
               
               <div className="space-y-4">
                   {payouts.length > 0 ? payouts.map((po, i) => (
                       <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 rounded-[30px] border border-transparent hover:border-slate-100 transition-all group">
                           <div className="flex items-center gap-5">
                               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 ${po.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-500'}`}>
                                   {po.status === 'paid' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                               </div>
                               <div>
                                   <p className="font-black text-slate-900 text-base uppercase tracking-tight">Virement Stripe</p>
                                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">{po.id || `TX-${po.created_at.substring(0,8)}`}</p>
                               </div>
                           </div>
                           <div className="text-right">
                               <p className="text-xl font-black text-slate-900 tracking-tighter">{parseFloat(po.amount).toFixed(2)} €</p>
                               <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${po.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                  {po.status === 'paid' ? 'VIRÉ' : 'EN ATTENTE'}
                               </p>
                           </div>
                       </div>
                   )) : (
                       <div className="py-20 text-center space-y-6">
                          <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto text-slate-200">
                             <DollarSign className="w-10 h-10" />
                          </div>
                          <p className="text-slate-400 font-medium italic">Aucun virement enregistré dans votre historique.</p>
                       </div>
                   )}
               </div>
           </div>
       </div>
    </div>
  )
}
