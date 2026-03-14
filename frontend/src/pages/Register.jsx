import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Briefcase, MapPin, AlertCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'client',
    city: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.password_confirmation) {
        return setError("Les mots de passe ne correspondent pas.");
    }
    setError('');
    setLoading(true);
    try {
      const { user } = await register(formData);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      console.error("Registration full error:", err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de l’inscription');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4 py-20">
      <div className="w-full max-w-lg animate-fade-in text-white">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl shadow-xl shadow-primary-500/20 mb-6 transition-transform hover:scale-110">
            <UserPlus className="w-8 h-8 text-white" />
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">Rejoignez-nous.</h1>
          <p className="text-gray-400 mt-2">Choisissez votre profil et commencez.</p>
        </div>

        <div className="glass-card p-10 rounded-3xl shadow-2xl backdrop-blur-2xl">
          <div className="flex p-1.5 bg-white/5 rounded-2xl mb-10 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'client' })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${
                formData.role === 'client' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 px-4' : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" /> Client
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'expert' })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${
                formData.role === 'expert' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 px-4' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" /> Expert
            </button>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Nom complet</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text" required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all placeholder-gray-600"
                    placeholder="John Doe"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Ville</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text" required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all placeholder-gray-600"
                    placeholder="Casablanca"
                    value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email" required
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all placeholder-gray-600"
                  placeholder="votre@email.com"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Mot de passe</label>
                <input
                  type="password" required
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Confirmation</label>
                <input
                  type="password" required
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                  value={formData.password_confirmation} onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-primary-600/20 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-primary-500 font-bold hover:text-primary-400">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
