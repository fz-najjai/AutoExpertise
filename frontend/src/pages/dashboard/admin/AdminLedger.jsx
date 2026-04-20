import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import SectionPage from '../../shared/SectionPage';
import { CreditCard, PieChart, ShieldCheck, RefreshCw } from 'lucide-react';

export default function AdminLedger() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/ledger');
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  if (loading && !data) return <div className="p-20 text-center italic text-indigo-400">Accès aux registres financiers...</div>;

  const { transactions, stats } = data || { transactions: { data: [] }, stats: { total_volume: 0, total_fees: 0, transaction_count: 0 } };

  return (
    <SectionPage
      title="Transactions & Ledger"
      subtitle="Suivez les entrées et sorties financières, avec une vue claire des transactions récentes."
      description="Accédez au journal complet des paiements, remboursements et commissions pour contrôler la santé financière de la plateforme." 
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl -mr-8 -mt-8"></div>
          <div className="flex items-center gap-4 text-slate-900 mb-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                <PieChart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Volume Total</p>
              <p className="text-3xl font-black text-slate-900">{stats.total_volume.toFixed(2)}€</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Montant total brut géré sur la plateforme.</p>
        </div>
        <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-sm relative overflow-hidden group">
          <div className="flex items-center gap-4 text-slate-900 mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Commissions</p>
              <p className="text-3xl font-black text-slate-900">{stats.total_fees.toFixed(2)}€</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Revenus nets générés par les frais de service.</p>
        </div>
        <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-sm relative overflow-hidden group">
          <div className="flex items-center gap-4 text-slate-900 mb-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Transactions</p>
              <p className="text-3xl font-black text-slate-900">{stats.transaction_count}</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Nombre total de paiements traités avec succès.</p>
        </div>
      </div>

      <div className="mt-12 rounded-[40px] overflow-hidden border border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
        <div className="bg-slate-50 px-10 py-6 flex items-center justify-between border-b border-slate-100">
            <span className="text-slate-900 uppercase tracking-[0.2em] text-[10px] font-black">Registre des mouvements</span>
            <button onClick={fetchLedger} className={`p-2 text-slate-400 hover:text-indigo-500 transition-colors ${loading ? 'animate-spin' : ''}`}>
                <RefreshCw className="w-4 h-4" />
            </button>
        </div>
        <div className="divide-y divide-slate-100">
          {transactions.data.length > 0 ? transactions.data.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-10 py-8 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                    <CreditCard className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-wider">{item.stripe_payment_intent.substring(0, 12)}...</p>
                    <p className="text-xs text-slate-500 font-medium">{item.client.name} • Fixé le {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-slate-900">{item.amount}€</p>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-full">Succeeded</span>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center text-slate-400 italic">Aucune transaction enregistrée.</div>
          )}
        </div>
      </div>
    </SectionPage>
  );
}
