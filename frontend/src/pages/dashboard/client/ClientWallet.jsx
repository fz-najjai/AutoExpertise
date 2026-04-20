import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { CreditCard, Plus, Trash2, ShieldCheck, CheckCircle, RefreshCw, X } from 'lucide-react';

export default function ClientWallet() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newCard, setNewCard] = useState({ card_type: 'Visa', last_four: '', expiry: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const res = await api.get('/client/wallet');
      setMethods(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/client/wallet', newCard);
      await fetchMethods();
      setShowAdd(false);
      setNewCard({ card_type: 'Visa', last_four: '', expiry: '' });
    } catch (err) {
      alert("Erreur lors de l'ajout de la carte");
    }
    setSubmitting(false);
  };

  if (loading && methods.length === 0) return <div className="p-20 text-center text-primary-500 font-black animate-pulse italic">Accès sécurisé au coffre-fort...</div>;

  return (
    <div className="space-y-12 pb-20">
       <div className="space-y-2">
           <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-100/50">
                <CreditCard className="w-6 h-6" />
             </div>
             Mon Portefeuille
           </h2>
           <p className="text-slate-500 font-medium text-lg">Gérez vos moyens de paiement enregistrés de façon sécurisée via Stripe.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {methods.map(card => (
              <div key={card.id} className="relative p-8 bg-slate-900 text-white rounded-[40px] overflow-hidden shadow-2xl shadow-slate-900/30 group hover:-translate-y-2 transition-all">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="flex justify-between items-start mb-16 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{card.card_type}</p>
                    {card.is_default && (
                        <div className="flex items-center gap-1.5 bg-primary-500 text-white text-[8px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg shadow-primary-500/30">
                            <CheckCircle className="w-2.5 h-2.5" /> Par défaut
                        </div>
                    )}
                 </div>
                 <div className="space-y-1 relative z-10">
                    <p className="font-mono text-2xl tracking-[0.2em]">**** **** **** {card.last_four}</p>
                    <div className="flex justify-between items-end mt-8">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Expiration</p>
                            <p className="text-sm font-bold">{card.expiry}</p>
                        </div>
                        <CreditCard className="w-10 h-10 text-white/10 group-hover:text-primary-500 transition-colors" />
                    </div>
                 </div>
                 <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-3 bg-red-500/10 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           ))}

           <button 
             onClick={() => setShowAdd(true)}
             className="flex flex-col items-center justify-center p-10 border-4 border-dashed border-slate-100 rounded-[40px] text-slate-300 hover:border-primary-400 hover:text-primary-500 hover:bg-primary-50/30 transition-all min-h-[220px] group"
           >
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 group-hover:bg-primary-100 group-hover:scale-110 transition-all">
                <Plus className="w-8 h-8" />
              </div>
              <span className="font-black uppercase tracking-[0.2em] text-[10px]">Ajouter une carte</span>
           </button>
       </div>

       <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[35px] flex gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
          <div className="w-14 h-14 bg-white text-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/50 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <p className="text-base text-emerald-900 font-bold mb-2">Sécurité maximale garantie</p>
            <p className="text-sm text-emerald-700/80 font-medium leading-relaxed">
                Vos données bancaires sont traitées et chiffrées de bout en bout par <strong className="font-black text-emerald-900">Stripe</strong>. AutoExpertise ne stocke aucune coordonnée bancaire sur ses serveurs, vous garantissant une protection totale de vos actifs.
            </p>
          </div>
       </div>

       {showAdd && (
           <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-md rounded-[45px] shadow-3xl p-10 relative animate-in fade-in zoom-in duration-300">
                    <button onClick={() => setShowAdd(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                    
                    <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Nouvelle Carte</h3>
                    
                    <form onSubmit={handleAddCard} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Type de carte</label>
                            <select 
                                value={newCard.card_type}
                                onChange={e => setNewCard({...newCard, card_type: e.target.value})}
                                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[22px] font-bold outline-none ring-primary-500 focus:ring-2"
                            >
                                <option>Visa</option>
                                <option>Mastercard</option>
                                <option>AMEX</option>
                            </select>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">4 derniers chiffres</label>
                            <input 
                                type="text"
                                maxLength={4}
                                required
                                value={newCard.last_four}
                                onChange={e => setNewCard({...newCard, last_four: e.target.value})}
                                placeholder="4242"
                                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[22px] font-bold outline-none ring-primary-500 focus:ring-2"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Expiration (MM/YY)</label>
                            <input 
                                type="text"
                                required
                                placeholder="12/28"
                                value={newCard.expiry}
                                onChange={e => setNewCard({...newCard, expiry: e.target.value})}
                                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[22px] font-bold outline-none ring-primary-500 focus:ring-2"
                            />
                        </div>

                        <button 
                            disabled={submitting}
                            className="w-full py-5 bg-primary-500 text-white font-black text-xs uppercase tracking-widest rounded-[22px] shadow-xl shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Enregistrer la carte
                        </button>
                    </form>
                </div>
           </div>
       )}
    </div>
  )
}
