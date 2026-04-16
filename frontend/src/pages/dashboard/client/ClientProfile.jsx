import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { User, Mail, MapPin, Phone, Shield, Camera, Save } from 'lucide-react';

export default function ClientProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    // In a real app, you would call the API to update the profile here.
    setIsEditing(false);
    alert('Profil mis à jour avec succès !');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mon Profil</h2>
        <p className="text-slate-500 font-medium tracking-tight">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="glass-card p-8 rounded-[32px] bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[80px] -mr-32 -mt-32"></div>
            
            <div className="flex flex-col items-center text-center relative z-10 space-y-6">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 bg-white/10 rounded-[24px] flex items-center justify-center text-5xl font-black border border-white/20 shadow-xl overflow-hidden">
                  {user?.name.charAt(0)}
                </div>
                <div className="absolute inset-0 bg-slate-900/60 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black">{user?.name}</h3>
                <p className="text-slate-400 font-medium mt-1">Client Privilège</p>
                <div className="flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-emerald-400">
                  <Shield className="w-4 h-4" />
                  Compte vérifié
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Form */}
        <div className="lg:col-span-2">
          <div className="glass-card p-10 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4 flex-1">Informations Personnelles</h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="ml-4 text-sm font-bold text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-widest"
              >
                {isEditing ? 'Annuler' : 'Modifier'}
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nom complet</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-200 outline-none transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Adresse Email</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-200 outline-none transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-200 outline-none transition-all disabled:opacity-60"
                      placeholder="+212 600 000 000"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Ville</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-200 outline-none transition-all disabled:opacity-60"
                      placeholder="Ex: Casablanca"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-6 mt-6 border-t border-slate-50 flex justify-end">
                  <button type="submit" className="btn-primary px-10 py-4 flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Enregistrer les modifications
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
