import { useState } from 'react';
import SectionPage from '../../shared/SectionPage';
import { User, Shield, Mail, Lock, CheckCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../../context/AuthContext';

export default function AccountSettings() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    setSaving(true);
    try {
      // Assuming endpoint exists or we'll add it
      await api.put('/user/password', passwords);
      setMessage({ type: 'success', text: 'Mot de passe mis à jour.' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la mise à jour.' });
    }
    setSaving(false);
  };

  return (
    <SectionPage
      title="Configuration du compte"
      subtitle="Gérez la sécurité et les paramètres fondamentaux de votre compte expert."
      description="Gardez votre compte expert sécurisé et à jour afin d’offrir une expérience fiable à vos clients." 
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
            <Link to="/expert/profile" className="block group">
                <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary-500 transition-all flex flex-col gap-4">
                    <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-1">Profil Public</h3>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed">Modifiez votre présentation, vos compétences et vos tarifs visibles par les clients.</p>
                    </div>
                </div>
            </Link>

            <div className="p-8 rounded-[40px] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl -mr-10 -mt-10"></div>
                <div className="relative z-10 space-y-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold">Contact Support</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">Besoin d'aide pour changer vos coordonnées bancaires ou administratives ?</p>
                    <button className="text-xs font-black uppercase tracking-widest text-primary-400 hover:text-primary-300">Ouvrir un ticket</button>
                </div>
            </div>
        </div>

        <div className="lg:col-span-8">
            <div className="bg-white p-10 rounded-[45px] border border-slate-100 shadow-2xl shadow-slate-200/50">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Sécurité & Accès</h3>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                    {message && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Mot de passe actuel</label>
                        <input 
                            type="password"
                            required
                            value={passwords.current}
                            onChange={e => setPasswords({...passwords, current: e.target.value})}
                            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[22px] outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Nouveau mot de passe</label>
                            <input 
                                type="password"
                                required
                                value={passwords.new}
                                onChange={e => setPasswords({...passwords, new: e.target.value})}
                                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[22px] outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Confirmation</label>
                            <input 
                                type="password"
                                required
                                value={passwords.confirm}
                                onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[22px] outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={saving}
                            className="w-full py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[22px] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                            Mettre à jour le mot de passe
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </SectionPage>
  );
}
