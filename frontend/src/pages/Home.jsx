import { Link } from 'react-router-dom';
import { Shield, Clock, Search, ChevronRight, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.png" 
            alt="Mechanic hero" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              L'Expertise Automobile <br />
              <span className="text-primary-500">en un clic.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Trouvez les meilleurs experts mécaniques pour vos diagnostics, expertises et conseils techniques. Rapide, fiable et transparent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-primary-600/20 flex items-center justify-center gap-2"
              >
                Commencer maintenant <ChevronRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg backdrop-blur-md border border-white/10 transition-all flex items-center justify-center"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="glass-card p-8 rounded-3xl space-y-4">
              <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">Recherche Intelligente</h3>
              <p className="text-gray-400">Trouvez un expert par ville, spécialité ou tarif horaire en quelques secondes.</p>
            </div>
            <div className="glass-card p-8 rounded-3xl space-y-4">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">Réservation Flexible</h3>
              <p className="text-gray-400">Choisissez vos créneaux directement sur le calendrier de l'expert de votre choix.</p>
            </div>
            <div className="glass-card p-8 rounded-3xl space-y-4">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">Profils Vérifiés</h3>
              <p className="text-gray-400">Tous nos experts sont validés manuellement par notre équipe administrative.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Fonctionnement Simple</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Trois étapes simples pour résoudre vos problèmes mécaniques avec les meilleurs pros.</p>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Choisissez', desc: 'Sélectionnez un expert validé' },
            { step: '02', title: 'Réservez', desc: 'Fixez un rendez-vous' },
            { step: '03', title: 'Validez', desc: 'Recevez votre expertise' },
          ].map((item, idx) => (
            <div key={idx} className="relative p-10 text-center">
              <span className="text-6xl font-black text-white/5 absolute -top-4 left-1/2 -translate-x-1/2">{item.step}</span>
              <h4 className="text-xl font-bold mb-2 relative z-10">{item.title}</h4>
              <p className="text-gray-400 relative z-10">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2024 Expertise Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
