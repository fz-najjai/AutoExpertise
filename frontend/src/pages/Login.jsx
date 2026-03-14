import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await login(email, password);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants invalides');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-3xl shadow-xl shadow-primary-500/20 mb-6">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Expertise.</h1>
          <p className="text-gray-400 mt-2">Heureux de vous revoir !</p>
        </div>

        <div className="glass-card p-8 rounded-3xl shadow-2xl backdrop-blur-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1 text-xs">
                <label className="text-sm font-medium text-gray-300">Mot de passe</label>
                <a href="#" className="text-primary-500 hover:text-primary-400">Oublié ?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-primary-600/10 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Se connecter'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Nouveau ici ?{' '}
            <Link to="/register" className="text-primary-500 font-bold hover:text-primary-400">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
