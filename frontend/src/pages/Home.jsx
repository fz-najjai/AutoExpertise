import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, MapPin, Calendar, Car, Shield, UserCheck, FileText, ChevronRight, CheckCircle2, Star, CheckCircle, Clock } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ city: '', specialty: '' });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.city) params.append('city', searchParams.city);
    if (searchParams.specialty) params.append('specialty', searchParams.specialty);
    navigate(`/client/experts?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary-500/30 selection:text-white">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-slate-900/20">
              A
            </div>
            <span className="text-xl font-black tracking-widest uppercase">AutoExpertis</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2.5 font-bold text-slate-500 hover:text-slate-900 transition-colors">
              Se connecter
            </Link>
            <Link to="/register" className="btn-primary py-2.5 shadow-lg shadow-primary-500/20">
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/2 h-full z-0 hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/50 to-white z-10"></div>
          <img 
            src="/hero.png" 
            alt="Auto Expert Hero" 
            className="w-full h-full object-cover rounded-l-[100px] shadow-2xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6">
               <CheckCircle2 className="w-3 h-3" /> N°1 de l'expertise au Maroc
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tight">
              Votre partenaire pour le <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-600">diagnostic</span> automobile
            </h1>
            <p className="text-lg text-slate-500 font-medium mb-10 max-w-xl leading-relaxed">
               Ne laissez plus de place au doute lors de l'achat de votre véhicule. Réservez l'un de nos mécaniciens certifiés pour une inspection complète.
            </p>
            
            {/* Multi-field Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-stretch gap-2 max-w-4xl relative z-20">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-slate-100 focus-within:bg-slate-50 transition-colors rounded-xl">
                <Car className="w-5 h-5 text-primary-500" />
                <input 
                  type="text" 
                  placeholder="Électronique, Motorisation..." 
                  className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-bold"
                  value={searchParams.specialty}
                  onChange={e => setSearchParams({...searchParams, specialty: e.target.value})}
                />
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-slate-100 focus-within:bg-slate-50 transition-colors rounded-xl">
                <MapPin className="w-5 h-5 text-primary-500" />
                <input 
                  type="text" 
                  placeholder="Ex: Casablanca, Rabat" 
                  className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-bold" 
                  value={searchParams.city}
                  onChange={e => setSearchParams({...searchParams, city: e.target.value})}
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-slate-900/20"
              >
                <Search className="w-5 h-5" />
                Inspecter
              </button>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm font-bold text-slate-500">
               <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Paiement Sécurisé</span>
               <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Experts Vérifiés</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
             <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-2 block">Fonctionnement</span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">Le Processus</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">Un processus simple et transparent pour garantir la santé mécanique de votre prochain véhicule.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[20%] w-[60%] h-[2px] bg-gradient-to-r from-primary-500/20 via-primary-500/50 to-primary-500/20"></div>

            <div className="glass-card p-10 rounded-[32px] text-center shadow-xl shadow-slate-200/50 border border-slate-100 relative group animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-primary-500/20 flex items-center justify-center mx-auto text-primary-500 mb-8 border border-primary-50 group-hover:scale-110 transition-transform duration-500">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-slate-900 tracking-tight">1. Recherchez</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Trouvez le bon profil spécialisé près de l'endroit où la voiture est située.</p>
            </div>

            <div className="glass-card p-10 rounded-[32px] text-center shadow-xl shadow-slate-200/50 border border-slate-100 relative group animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-indigo-500/20 flex items-center justify-center mx-auto text-indigo-500 mb-8 border border-indigo-50 group-hover:scale-110 transition-transform duration-500">
                <Calendar className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-slate-900 tracking-tight">2. Réservez</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Fixez un créneau en fonction de la disponibilité de l'expert en 3 clics.</p>
            </div>

            <div className="glass-card p-10 rounded-[32px] text-center shadow-xl shadow-slate-200/50 border border-slate-100 relative group animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500 mb-8 border border-emerald-50 group-hover:scale-110 transition-transform duration-500">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-slate-900 tracking-tight">3. Obtenez le rapport</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Le mécanicien se déplace, inspecte et vous rend compte de l'état réel de l'auto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages / Why Us */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-2 block">Garantie Qualité</span>
                 <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">Ne prenez plus de risques à l'aveugle.</h2>
                 <p className="text-slate-500 font-medium text-lg mb-8 leading-relaxed">
                   Acheter une voiture d'occasion est toujours stressant. Vices cachés, kilométrage truqué, accidents masqués. Avec AutoExpertis, vous achetez la certitude.
                 </p>
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
                          <Shield className="w-6 h-6 text-primary-500" />
                       </div>
                       <div>
                          <h4 className="text-xl font-bold text-slate-900 mb-1">Experts Vérifiés</h4>
                          <p className="text-slate-500 font-medium">Chaque mécanicien est rigoureusement sélectionné et son historique vérifié par notre équipe.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                          <Clock className="w-6 h-6 text-indigo-500" />
                       </div>
                       <div>
                          <h4 className="text-xl font-bold text-slate-900 mb-1">Intervention Rapide</h4>
                          <p className="text-slate-500 font-medium">Nous garantissons l'intervention de l'expert en moins de 48 heures ouvrées sur le lieu du véhicule.</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="relative">
                 <div className="absolute inset-0 bg-primary-500/10 blur-[100px] rounded-full"></div>
                 <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?q=80&w=2070&auto=format&fit=crop" alt="Mécanicien inspectant voiture" className="rounded-[40px] shadow-2xl relative z-10 border border-slate-100" />
                 
                 <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-20 flex items-center gap-4 animate-bounce hover:pause">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                       <UserCheck className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                       <p className="text-2xl font-black text-slate-900">4,9/5</p>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Note globale</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">Ils ont évité l'arnaque</h2>
              <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">Découvrez les retours de nos derniers clients.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Review 1 */}
              <div className="glass-card p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 bg-white transition-transform hover:-translate-y-2">
                 <div className="flex items-center gap-1 text-yellow-400 mb-6">
                    <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                 </div>
                 <p className="text-slate-600 font-medium leading-relaxed italic mb-8">"L'expert a détecté que le compteur avait été reculé de 80,000 km ! Il m'a fait économiser 15,000 euros. Je n'achèterai plus jamais sans eux."</p>
                 <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 text-lg">M</div>
                    <div>
                       <p className="font-bold text-slate-900">Mohammed B.</p>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Achat BMW Série 3</p>
                    </div>
                 </div>
              </div>

              {/* Review 2 */}
              <div className="glass-card p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 bg-white transition-transform hover:-translate-y-2">
                 <div className="flex items-center gap-1 text-yellow-400 mb-6">
                    <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                 </div>
                 <p className="text-slate-600 font-medium leading-relaxed italic mb-8">"Karim, mon mécanicien assigné a été d'un grand professionnalisme. Rapport PDF détaillé reçu le soir même. Une vraie tranquillité d'esprit."</p>
                 <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 text-lg">S</div>
                    <div>
                       <p className="font-bold text-slate-900">Sara L.</p>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Achat Peugeot 208</p>
                    </div>
                 </div>
              </div>

              {/* Review 3 */}
              <div className="glass-card p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 bg-white transition-transform hover:-translate-y-2">
                 <div className="flex items-center gap-1 text-yellow-400 mb-6">
                    <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                 </div>
                 <p className="text-slate-600 font-medium leading-relaxed italic mb-8">"Concept génial. Moi qui n'y connais rien en mécanique, j'ai pu déléguer totalement le diagnostic. Voiture achetée en toute sérénité."</p>
                 <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 text-lg">Y</div>
                    <div>
                       <p className="font-bold text-slate-900">Yassine E.</p>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Achat VW Golf</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Final CTA Action Banner */}
      <section className="py-24 bg-white">
         <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <div className="bg-slate-950 rounded-[40px] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-slate-900/30">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[100px] pointer-events-none"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[100px] pointer-events-none"></div>
               
               <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-6 relative z-10">
                  Prêt à acheter <br/> <span className="text-primary-400">sans stress</span> ?
               </h2>
               <p className="text-gray-400 text-lg font-medium mb-10 max-w-xl mx-auto relative z-10">
                  Créez votre compte gratuitement, recherchez votre expert et sécurisez le plus gros investissement de l'année.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                  <Link to="/register" className="btn-primary py-4 px-10 text-lg w-full sm:w-auto shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2">
                     Commencer maintenant <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link to="/login" className="py-4 px-10 text-lg font-bold text-white bg-white/10 hover:bg-white/20 rounded-2xl transition-colors w-full sm:w-auto text-center border border-white/5">
                     Espace Expert
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* Advanced Footer */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
              <div className="md:col-span-2">
                 <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <span className="text-xl font-black tracking-widest uppercase">AutoExpertis</span>
                </div>
                <p className="text-slate-500 font-medium max-w-sm leading-relaxed mb-6">
                   La première plateforme de mise en relation entre acheteurs exigeants et mécaniciens certifiés indépendants.
                </p>
              </div>
              
              <div>
                 <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">La Plateforme</h4>
                 <ul className="space-y-4">
                    <li><Link to="/client/experts" className="text-slate-500 hover:text-primary-500 font-medium transition-colors">Trouver un expert</Link></li>
                    <li><Link to="/register" className="text-slate-500 hover:text-primary-500 font-medium transition-colors">Inscription Client</Link></li>
                    <li><Link to="/register?type=expert" className="text-slate-500 hover:text-primary-500 font-medium transition-colors">Devenir Expert Partenaire</Link></li>
                 </ul>
              </div>

              <div>
                 <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Liens Utiles</h4>
                 <ul className="space-y-4">
                    <li><a href="#" className="text-slate-500 hover:text-primary-500 font-medium transition-colors">CGV & Mentions légales</a></li>
                    <li><a href="#" className="text-slate-500 hover:text-primary-500 font-medium transition-colors">Politique de confidentialité</a></li>
                    <li><a href="#" className="text-slate-500 hover:text-primary-500 font-medium transition-colors">FAQ</a></li>
                 </ul>
              </div>
           </div>

           <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 font-semibold text-sm">
              <p>&copy; 2026 AutoExpertis. Tous droits réservés.</p>
              <div className="flex gap-6">
                 Made with passion by A.I.
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
