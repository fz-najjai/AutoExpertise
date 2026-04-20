import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, ShieldCheck, LogOut, Bell, Menu, X, ShieldAlert, ShieldX, TrendingUp, AlertTriangle, Settings, DollarSign, Activity, FileText
} from 'lucide-react';
import { useState } from 'react';
import NotificationBell from '../components/NotificationBell';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarGroups = [
    {
      title: 'Global',
      items: [
        { name: 'Vue d\'ensemble', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Analytique', icon: TrendingUp, path: '/admin/analytics' },
      ]
    },
    {
      title: 'Gestion Utilisateurs',
      items: [
        { name: 'Annuaire & Rôles', icon: Users, path: '/admin/users' },
        { name: 'Experts en attente', icon: ShieldAlert, path: '/admin/experts/pending' },
        { name: 'Experts approuvés', icon: ShieldCheck, path: '/admin/experts/approved' },
        { name: 'Experts rejetés', icon: ShieldX, path: '/admin/experts/rejected' },
      ]
    },
    {
      title: 'Finance & Revenus',
      items: [
        { name: 'Transactions & Ledger', icon: DollarSign, path: '/admin/finance/ledger' },
      ]
    },
    {
      title: 'Modération',
      items: [
        { name: 'Signalements', icon: AlertTriangle, path: '/admin/reports', badge: 2 },
        { name: 'Trust & Safety', icon: FileText, path: '/admin/moderation/trust' },
      ]
    },
    {
      title: 'Système',
      items: [
        { name: 'Configuration', icon: Settings, path: '/admin/settings' },
        { name: 'Logs d\'Audit', icon: Activity, path: '/admin/system/logs' },
      ]
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans selection:bg-indigo-500/30">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50">
        <div className="flex-1 flex flex-col min-h-0 bg-[#020617] border-r border-indigo-900/40 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto relative z-10 cs-scrollbar">
            <div className="flex items-center flex-shrink-0 px-8 gap-3 mb-10 group cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/40 group-hover:scale-110 transition-transform">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <span className="text-xl font-black text-white tracking-widest group-hover:text-indigo-400 transition-colors uppercase">Console</span>
            </div>
            
            <nav className="flex-1 px-4 space-y-6">
              {sidebarGroups.map((group, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="px-4 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest">
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
                              ? 'bg-indigo-600/10 text-indigo-400 shadow-inner shadow-indigo-600/5 border border-indigo-500/20' 
                              : 'text-indigo-200/50 hover:bg-indigo-900/20 hover:text-indigo-200 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                             <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-indigo-400' : 'text-indigo-800 group-hover:text-indigo-400'}`} />
                             {item.name}
                          </div>
                          {item.badge && (
                             <span className={`px-2 py-0.5 rounded-[8px] text-[10px] font-black ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-red-500/20 text-red-500'}`}>
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
          <div className="flex-shrink-0 flex border-t border-indigo-900/40 p-6 relative z-10">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-4 py-3 text-sm font-black text-indigo-400/50 hover:text-indigo-400 rounded-2xl hover:bg-indigo-900/20 transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-indigo-900/40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-indigo-400 rounded-xl hover:bg-indigo-900/40 hover:text-white transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
               <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col animate-fade-in-left">
            <h1 className="text-sm font-bold text-indigo-400/50 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-lg shadow-indigo-600"></span> Supervision
            </h1>
            <p className="text-xl font-black text-white tracking-tight">Admin System</p>
          </div>

          <div className="flex items-center gap-6">
            <NotificationBell />
            <div className="flex items-center gap-3 pl-6 border-l border-indigo-900/40">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-white leading-none">{user.name}</p>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-xl shadow-indigo-600/20 overflow-hidden">
                 A
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
          <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-80 bg-[#020617] border-r border-indigo-900/40 shadow-2xl flex flex-col animate-slide-in-left">
            <div className="p-6 flex items-center justify-between border-b border-indigo-900/40">
               <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-600/20">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="font-black text-white tracking-widest uppercase text-sm">Console</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-indigo-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <nav className="flex-1 p-6 space-y-6 overflow-y-auto">
              {sidebarGroups.map((group, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="px-4 text-[10px] font-black text-indigo-400/50 uppercase tracking-widest">
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
                              ? 'bg-indigo-600/10 text-indigo-400 shadow-inner shadow-indigo-600/5 border border-indigo-500/20' 
                              : 'text-indigo-200/50 hover:bg-indigo-900/20 hover:text-indigo-200 border border-transparent'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                             <item.icon className="h-5 w-5" />
                             {item.name}
                          </div>
                          {item.badge && (
                             <span className={`px-2 py-0.5 rounded-[8px] text-[10px] font-black ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-red-500/20 text-red-500'}`}>
                               {item.badge}
                             </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="pt-6 mt-6 border-t border-indigo-900/40">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-3 text-sm font-black text-indigo-400/50 rounded-2xl hover:bg-indigo-900/20 transition-colors"
                 >
                  <LogOut className="mr-3 h-5 w-5" />
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
