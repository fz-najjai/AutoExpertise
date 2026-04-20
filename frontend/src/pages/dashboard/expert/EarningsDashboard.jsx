import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  Download,
  Filter,
  Users,
  PieChart as PieChartIcon
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function EarningsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/expert/earnings');
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Calcul de vos revenus...</p>
    </div>
  );

  const stats = [
    { name: 'Revenu Brut', value: `${data?.total_revenue.toFixed(2)}€`, icon: DollarSign, color: 'bg-primary-500', trend: '+12%' },
    { name: 'Gains Nets', value: `${data?.net_revenue.toFixed(2)}€`, icon: TrendingUp, color: 'bg-emerald-500', trend: 'Libre de frais' },
    { name: 'Expertises', value: data?.transaction_count, icon: Users, color: 'bg-indigo-500', trend: 'Validés' },
    { name: 'Frais Plateforme', value: `${data?.total_fees.toFixed(2)}€`, icon: CreditCard, color: 'bg-slate-900', trend: '-1.50€ / rdv' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header with Glass Gradient Area */}
      <div className="relative group">
         <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-[40px] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
         <div className="relative glass-card bg-white p-10 md:p-14 rounded-[40px] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
               <span className="px-4 py-1.5 bg-primary-100 text-primary-600 text-[10px] font-black uppercase tracking-widest rounded-full">Reporting Financier</span>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Vos Revenus</h2>
               <p className="text-slate-500 font-medium text-lg max-w-lg">Suivez vos performances financières et gérez vos virements en toute transparence.</p>
            </div>
            <div className="flex gap-4">
               <button className="px-8 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                  <Download className="w-5 h-5" /> Exporter PDF
               </button>
            </div>
         </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card bg-white p-8 rounded-[35px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-500 group">
             <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform`}>
                   <stat.icon className="w-7 h-7" />
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${i === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                   {stat.trend}
                </span>
             </div>
             <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">{stat.name}</p>
             <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Recent Transactions List */}
         <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-4">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Dernières transactions</h3>
               <button className="text-xs font-black text-primary-500 uppercase tracking-widest hover:underline flex items-center gap-2">
                 Voir tout <ArrowUpRight className="w-4 h-4" />
               </button>
            </div>
            
            <div className="glass-card bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/40">
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                           <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                           <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                           <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant</th>
                           <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 uppercase text-[11px] font-bold">
                        {data?.recent_transactions?.map((t) => (
                           <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 font-black">
                                       {t.client?.name.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="text-slate-900 text-sm font-black lowercase first-letter:uppercase">{t.client?.name}</p>
                                       <p className="text-slate-400 text-[9px] tracking-widest">{t.stripe_payment_intent.substring(0, 15)}...</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-slate-500">
                                 {t.paid_at ? format(parseISO(t.paid_at), 'dd MMM yyyy') : format(parseISO(t.created_at), 'dd MMM yyyy')}
                              </td>
                              <td className="px-8 py-6">
                                 <span className="text-slate-900 font-black text-sm">{t.amount}€</span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black border border-emerald-100">
                                    COMPLÉTÉ
                                 </span>
                              </td>
                           </tr>
                        ))}
                        {(!data?.recent_transactions || data.recent_transactions.length === 0) && (
                          <tr>
                            <td colSpan="4" className="px-8 py-20 text-center text-slate-400 italic">
                               <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-10" />
                               Aucune transaction pour le moment.
                            </td>
                          </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Sidebar Actions / Stats Summary */}
         <div className="lg:col-span-4 space-y-8">
            <div className="glass-card bg-slate-900 p-10 rounded-[45px] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between">
                     <PieChartIcon className="w-8 h-8 text-primary-400" />
                     <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black tracking-widest">NEXT PAYOUT</span>
                  </div>
                  <div className="space-y-2">
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Solde en attente</p>
                     <p className="text-5xl font-black tracking-tighter">0.00€</p>
                  </div>
                  <button className="w-full py-5 bg-white text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5">
                     Demander un virement
                  </button>
               </div>
            </div>

            <div className="glass-card bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest px-2">Récapitulatif Mensuel</h4>
               <div className="space-y-4">
                  {[
                     { label: 'Janvier', amount: '1,240€', color: 'bg-primary-500', width: 'w-3/4' },
                     { label: 'Février', amount: '980€', color: 'bg-indigo-500', width: 'w-2/3' },
                     { label: 'Mars', amount: '1,560€', color: 'bg-emerald-500', width: 'w-full' },
                  ].map((item, idx) => (
                     <div key={idx} className="space-y-2 p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className="text-slate-500">{item.label}</span>
                           <span className="text-slate-900">{item.amount}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${item.color} ${item.width} rounded-full`}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
