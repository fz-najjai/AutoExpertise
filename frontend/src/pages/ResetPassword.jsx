import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }
    if (password.length < 8) {
      return setError("Le mot de passe doit contenir au moins 8 caractères.");
    }
    setLoading(true);
    setError('');
    
    // Simulate API call to /api/reset-password
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans text-slate-900">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-xl relative z-10 animate-fade-up">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl shadow-slate-900/20 group-hover:scale-105 transition-transform">
              A
            </div>
            <span className="text-3xl font-black tracking-tighter text-slate-900">AutoExpertise</span>
          </Link>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
             Créer un nouveau <br/> mot de passe
          </h1>
          <p className="mt-4 text-slate-500 font-medium text-lg italic">Sécurisez votre compte avec une clé unique.</p>
        </div>

        <div className="glass-card p-12 rounded-[48px] bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-slate-200/60">
          {!submitted ? (
            <>
              {error && (
                <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-[28px] flex items-center gap-4 text-red-700 text-sm font-bold animate-shake">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nouveau mot de passe *</label>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      className="w-full pl-16 pr-16 py-5 bg-slate-50 border border-transparent rounded-[24px] focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-200 outline-none transition-all placeholder:text-slate-300 font-bold text-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors p-2"
                    >
                      {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Confirmer le mot de passe *</label>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-transparent rounded-[24px] focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-200 outline-none transition-all placeholder:text-slate-300 font-bold text-lg"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Enregistrer le mot de passe
                        <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8 animate-fade-in">
              <div className="relative inline-block mb-10">
                <div className="w-28 h-28 bg-emerald-500 rounded-[40px] flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative z-10 animate-bounce-subtle">
                  <CheckCircle2 className="w-14 h-14 text-white" />
                </div>
                <div className="absolute inset-0 bg-emerald-500/20 rounded-[40px] animate-ping"></div>
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">C'est tout bon !</h3>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm mx-auto">
                Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
              </p>
            </div>
          )}
        </div>

        <p className="text-center mt-12 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          &copy; 2024 AUTOEXPERTISE — Sécurité Certifiée
        </p>
      </div>
    </div>
  );
}
