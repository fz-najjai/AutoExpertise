import { useState, useEffect } from 'react';
import { api, useAuth } from '../../../context/AuthContext';
import { Settings, Save, Briefcase, Award, FileText } from 'lucide-react';

export default function ExpertProfileEdit() {
  const { user } = useAuth();
  const [profileForm, setProfileForm] = useState({
    specialty: '',
    price: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user && user.expertProfile) {
      setProfileForm({
        specialty: user.expertProfile.specialty || '',
        price: user.expertProfile.price || '',
        bio: user.expertProfile.bio || ''
      });
    }
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await api.put('/expert/profile', profileForm);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || 'Problème réseau'));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-10 group/profile">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <Settings className="w-8 h-8 text-primary-500 group-hover/profile:rotate-90 transition-transform duration-700" /> Profil Professionnel
        </h2>
        <p className="text-slate-500 font-medium tracking-tight">Maintenez vos informations à jour pour attirer plus de clients.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Photo Card */}
        <div className="lg:col-span-1">
           <div className="glass-card p-8 rounded-[32px] bg-white border border-slate-200 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             
             <div className="w-40 h-40 bg-slate-50 rounded-[32px] overflow-hidden mb-6 border border-slate-200 shadow-2xl relative z-10 group">
                <img 
                  src={user.expertProfile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=F1F5F9&color=0F172A&size=256`} 
                  alt={user.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
             </div>
             
             <div className="relative z-10">
               <h3 className="text-2xl font-black text-slate-900">{user.name}</h3>
               <p className="text-primary-500 font-bold mt-1 text-sm">{profileForm.specialty || 'Spécialité non définie'}</p>
               <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-emerald-500">
                  <Award className="w-4 h-4" /> Validé
               </div>
             </div>
           </div>
        </div>

        {/* Form Card */}
        <div className="lg:col-span-2">
           <div className="glass-card p-8 md:p-10 rounded-[32px] border border-slate-200 shadow-2xl bg-white overflow-hidden relative">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>
              
              <form onSubmit={updateProfile} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Spécialité principale</label>
                    <div className="relative">
                       <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                       <input 
                         type="text" 
                         value={profileForm.specialty} 
                         onChange={e => setProfileForm({...profileForm, specialty: e.target.value})} 
                         className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-slate-300" 
                         placeholder="Ex: Audi, BMW, Moteur..." 
                       />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tarif de l'intervention (€)</label>
                    <div className="relative">
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-500">€</span>
                       <input 
                         type="number" 
                         value={profileForm.price} 
                         onChange={e => setProfileForm({...profileForm, price: e.target.value})} 
                         className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-black text-lg outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 transition-all" 
                       />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Biographie & Expérience</label>
                  <div className="relative">
                     <FileText className="absolute left-5 top-5 w-5 h-5 text-gray-500" />
                     <textarea 
                       rows="6" 
                       value={profileForm.bio} 
                       onChange={e => setProfileForm({...profileForm, bio: e.target.value})} 
                       className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 transition-all text-sm leading-relaxed resize-none placeholder:text-slate-300 font-medium" 
                       placeholder="Décrivez votre parcours d'expert..." 
                     />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                   {success ? (
                      <p className="text-emerald-400 font-bold text-sm flex items-center gap-2 animate-fade-in">
                        Opération réussie !
                      </p>
                   ) : <div />}
                   
                   <button 
                     type="submit" 
                     disabled={loading}
                     className="btn-primary py-4 px-10 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-slate-900/10 disabled:opacity-50 text-white"
                   >
                     <Save className="w-5 h-5" />
                     {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                   </button>
                </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
