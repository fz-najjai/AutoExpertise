import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Briefcase,
  User as UserIcon, 
  LogOut, 
  Bell, 
  Menu,
  X,
  Clock,
  Settings,
  MessageSquare,
  DollarSign,
  Users,
  CreditCard,
  Star,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';
import NotificationBell from '../components/NotificationBell';

export default function ExpertLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const expertStatus = user.expertProfile?.status || user.expert_profile?.status || 'pending';

  // If not validated yet, don't show the full layout
  if (expertStatus === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-primary-500/30">
        <div className="glass-card p-12 rounded-[40px] shadow-2xl max-w-md w-full text-center space-y-8 border border-slate-200 animate-fade-in relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl -mr-16 -mt-16"></div>
          <div className="mx-auto w-24 h-24 bg-yellow-500/10 text-yellow-500 rounded-3xl flex items-center justify-center shadow-lg shadow-yellow-500/10 hover:scale-110 transition-transform">
            <Clock className="w-10 h-10" />
          </div>
          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Compte en Attente</h2>
            <p className="text-slate-500 leading-relaxed font-medium">
              Votre profil expert est actuellement en cours de vérification par notre équipe administrative. Nous vous notifierons dès qu'il sera validé.
            </p>
          </div>
          <div className="pt-4 relative z-10">
            <button 
              onClick={async () => { await logout(); navigate('/login'); }} 
              className="w-full py-4 border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (expertStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-primary-500/30">
        <div className="glass-card p-12 rounded-[40px] shadow-2xl max-w-md w-full text-center space-y-8 border border-slate-200 animate-fade-in relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl -mr-16 -mt-16"></div>
          <div className="mx-auto w-24 h-24 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center shadow-lg shadow-red-500/10 hover:scale-110 transition-transform">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Candidature Rejetée</h2>
            <p className="text-slate-500 leading-relaxed font-medium">
              Malheureusement, votre demande d'expertise n'a pas été retenue par notre équipe. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support.
            </p>
          </div>
          <div className="pt-4 relative z-10">
            <button 
              onClick={async () => { await logout(); navigate('/login'); }} 
              className="w-full py-4 border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sidebarGroups = [
    {
      title: 'Principal',
      items: [
        { name: 'Tableau de bord', icon: LayoutDashboard, path: '/expert/dashboard' },
        { name: 'Mon Profil Public', icon: UserIcon, path: '/expert/profile' },
      ]
    },
    {
      title: 'Agenda & Réservations',
      items: [
        { name: 'Demandes (Inbox)', icon: Briefcase, path: '/expert/requests', badge: 1 },
        { name: 'Calendrier & Dispos', icon: CalendarIcon, path: '/expert/availabilities' },
      ]
    },
    {
      title: 'Clients',
      items: [
        { name: 'CRM & Historique', icon: Users, path: '/expert/crm' },
      ]
    },
    {
      title: 'Communication',
      items: [
        { name: 'Messages', icon: MessageSquare, path: '/expert/chat' },
      ]
    },
    {
      title: 'Finance',
      items: [
        { name: 'Reporting Revenus', icon: DollarSign, path: '/expert/earnings' },
        { name: 'Virements', icon: CreditCard, path: '/expert/payouts' },
      ]
    },
    {
      title: 'Performance',
      items: [
        { name: 'Avis & Notation', icon: Star, path: '/expert/performance/reviews' },
        { name: 'Statistiques', icon: TrendingUp, path: '/expert/performance/stats' },
      ]
    },
    {
      title: 'Paramètres',
      items: [
        { name: 'Préférences Agenda', icon: Clock, path: '/expert/settings/schedule' },
        { name: 'Configuration du compte', icon: Settings, path: '/expert/settings/account' },
      ]
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-primary-500/30">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto relative z-10 cs-scrollbar">
            <div className="flex items-center flex-shrink-0 px-8 gap-3 mb-10 group cursor-pointer" onClick={() => navigate('/expert/dashboard')}>
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-[0.1em] group-hover:text-primary-500 transition-colors uppercase">AutoExpertise</span>
            </div>
            
            <nav className="flex-1 px-4 space-y-6">
              {sidebarGroups.map((group, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {group.title}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = location.pathname.startsWith(item.path);
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`group flex items-center justify-between px-4 py-2.5 text-sm font-black rounded-2xl transition-all duration-200 ${
                            isActive 
                              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center">
                             <item.icon className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-500'}`} />
                             {item.name}
                          </div>
                          {item.badge && (
                             <span className={`px-2 py-0.5 rounded-[8px] text-[10px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                               {item.badge}
                             </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-slate-200 p-6 relative z-10">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-4 py-3 text-sm font-black text-red-500/80 rounded-2xl hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
               <Briefcase className="h-4 w-4" />
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col animate-fade-in-left">
            <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-lg shadow-primary-500"></span> Expert Portal
            </h1>
            <p className="text-xl font-black text-slate-900 tracking-tight">Espace Professionnel</p>
          </div>

          <div className="flex items-center gap-6">
            <NotificationBell />
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">Dr. {user.name.split(' ')[0]}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{user.city || 'Non défini'}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 overflow-hidden shadow-xl">
                 <img src={user.expertProfile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=F1F5F9&color=0F172A&size=128`} alt={user.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 relative">
          <div className="max-w-6xl mx-auto animate-fade-up">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-80 bg-white border-r border-slate-200 shadow-2xl flex flex-col animate-slide-in-left">
            <div className="p-6 flex items-center justify-between border-b border-slate-200">
               <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/20">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="font-black text-slate-900 tracking-widest">EXPERTISE</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-900"><X className="w-6 h-6" /></button>
            </div>
            <nav className="flex-1 p-6 space-y-6 overflow-y-auto">
              {sidebarGroups.map((group, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {group.title}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = location.pathname.startsWith(item.path);
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`group flex items-center justify-between px-4 py-2 text-sm font-black rounded-2xl transition-all duration-200 ${
                            isActive 
                              ? 'bg-primary-500 text-white' 
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                             <item.icon className="h-5 w-5" />
                             {item.name}
                          </div>
                          {item.badge && (
                             <span className={`px-2 py-0.5 rounded-[8px] text-[10px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                               {item.badge}
                             </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-3 text-sm font-black text-red-500/80 rounded-2xl hover:bg-red-500/10 transition-colors"
                 >
                  <LogOut className="mr-4 h-5 w-5" />
                  Déconnexion
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
