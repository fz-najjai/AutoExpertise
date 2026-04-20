import { useState } from 'react';
import SectionPage from '../../shared/SectionPage';
import { Shield, Lock, CheckCircle, RefreshCw } from 'lucide-react';
import { api } from '../../../context/AuthContext';

export default function ClientSecuritySettings() {
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
      await api.put('/user/password', passwords);
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès.' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la mise à jour.' });
    }
    setSaving(false);
  };

  return (
    <SectionPage
      title="Sécurité du compte"
      subtitle="Gérez vos identifiants et les paramètres de protection de votre espace client."
      description="Nous prenons la sécurité de vos données très au sérieux. Modifiez régulièrement votre mot de passe pour une protection optimale." 
    >
      <div className="max-w-3xl">
        <div className="bg-white p-10 rounded-[45px] border border-slate-100 shadow-2xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-primary-50 text-primary-500 rounded-2xl">
                    <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Modifier le mot de passe</h3>
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
                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[22px] outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-900"
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
                            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[22px] outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Confirmation</label>
                        <input 
                            type="password"
                            required
                            value={passwords.confirm}
                            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[22px] outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-900"
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
                        Mettre à jour mes accès
                    </button>
                </div>
            </form>
        </div>
      </div>
    </SectionPage>
  );
}
