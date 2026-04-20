import { useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  Lock, 
  DollarSign, 
  Mail, 
  Bell,
  Activity,
  ToggleLeft as Toggle
} from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async (id, value) => {
    setSaving(id);
    try {
      await api.patch(`/admin/settings/${id}`, { value });
      fetchSettings();
    } catch (err) {
      alert('Erreur: ' + (err.response?.data?.message || 'Problème lors de la mise à jour'));
    }
    setSaving(null);
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Chargement des configurations...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-3">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600/10 text-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/10">
               <Settings className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">Configuration Système</h2>
         </div>
         <p className="text-indigo-200/50 font-medium text-lg">Gérez les paramètres globaux de la plateforme AutoExpertise.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Left Column: Categories */}
         <div className="lg:col-span-4 space-y-6">
            <div className="glass-card bg-white/5 p-4 rounded-[35px] border border-white/5 space-y-2">
               {[
                  { name: 'Général', icon: Database, active: true },
                  { name: 'Paiements', icon: DollarSign, active: false },
                  { name: 'Sécurité', icon: ShieldCheck, active: false },
                  { name: 'Notifications', icon: Bell, active: false },
                  { name: 'Maintenance', icon: Activity, active: false },
               ].map((cat, i) => (
                  <button 
                    key={i}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                       cat.active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-indigo-200/40 hover:bg-white/5 hover:text-indigo-200'
                    }`}
                  >
                     <cat.icon className="w-4 h-4" /> {cat.name}
                  </button>
               ))}
            </div>

            <div className="p-10 bg-indigo-600 rounded-[45px] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10 space-y-6">
                  <Lock className="w-10 h-10 border-2 border-white/20 p-2 rounded-xl" />
                  <div>
                     <h4 className="font-black text-lg">Mode Coffre-fort</h4>
                     <p className="text-indigo-100/50 text-xs font-medium leading-relaxed mt-2">Activez la restriction d'accès totale en cas de mise à jour critique de la base de données.</p>
                  </div>
                  <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-50 transition-colors">
                     Activer
                  </button>
               </div>
            </div>
         </div>

         {/* Right Column: Settings List */}
         <div className="lg:col-span-8 space-y-8">
            <div className="glass-card bg-white/5 p-10 rounded-[50px] border border-white/5 space-y-10">
               <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <h3 className="text-xl font-black text-white tracking-tight">Paramètres de la Plateforme</h3>
                  <button onClick={fetchSettings} className="p-3 text-indigo-400 hover:text-white transition-colors bg-white/5 rounded-xl">
                     <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
               </div>

               <div className="space-y-12">
                  {settings.map((setting) => (
                     <div key={setting.id} className="group relative">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div className="space-y-2 flex-1">
                              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                 {setting.key.replace(/_/g, ' ')}
                              </label>
                              <p className="text-indigo-100/70 font-medium text-sm max-w-md">
                                 {getDescription(setting.key)}
                              </p>
                           </div>
                           
                           <div className="flex items-center gap-4">
                              <div className="relative">
                                 <input 
                                    type={getType(setting.key)}
                                    className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-w-[200px]"
                                    defaultValue={setting.value}
                                    onBlur={(e) => {
                                       if (e.target.value !== setting.value) {
                                          handleUpdate(setting.id, e.target.value);
                                       }
                                    }}
                                 />
                                 {saving === setting.id && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                       <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="pt-8 border-t border-white/5">
                  <div className="bg-indigo-500/5 p-6 rounded-[30px] border border-indigo-500/10 flex items-start gap-5">
                     <Save className="w-6 h-6 text-indigo-400 mt-1" />
                     <p className="text-xs text-indigo-200/50 font-medium leading-relaxed">
                        Les modifications apportées aux paramètres système sont appliquées en temps réel. <br />
                        Certains changements peuvent nécessiter une reconnexion des utilisateurs.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function getType(key) {
   if (key.includes('commission')) return 'number';
   if (key.includes('max')) return 'number';
   if (key.includes('enabled')) return 'checkbox';
   return 'text';
}

function getDescription(key) {
   const descriptions = {
      'commission_rate': 'Pourcentage prélevé sur chaque transaction réussie.',
      'platform_fee': 'Frais de service fixes ajoutés à chaque réservation.',
      'max_search_radius': 'Rayon maximal (km) pour la recherche de proximité.',
      'maintenance_mode': 'Désactive l\'accès public au site pour maintenance.',
      'min_expert_rating': 'Note minimale pour être affiché dans les recommandations.',
      'stripe_fee_covered': 'Définit si la plateforme absorbe les frais Stripe.',
   };
   return descriptions[key] || 'Paramètre de configuration du moteur métier AutoExpertise.';
}
