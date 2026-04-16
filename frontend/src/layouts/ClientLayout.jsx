import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Search, 
  Calendar, 
  User, 
  LogOut, 
  Bell, 
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function ClientLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Tableau de bord', icon: LayoutDashboard, path: '/client/dashboard' },
    { name: 'Rechercher un expert', icon: Search, path: '/client/experts' },
    { name: 'Mes réservations', icon: Calendar, path: '/client/history' },
    { name: 'Mon Profil', icon: User, path: '/client/profile' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-slate-200">
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-8 gap-3 mb-10">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-slate-900/10">
                A
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 uppercase tracking-[0.1em]">AutoExpertis</span>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className={`mr-4 h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-slate-100 p-6">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-4 py-3 text-sm font-semibold text-red-500 rounded-2xl hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="mr-4 h-5 w-5 text-red-400 group-hover:text-red-500" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-600 rounded-md hover:bg-slate-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="ml-4 font-bold text-slate-900">AutoExpertis</span>
          </div>
          
          <div className="hidden lg:flex flex-col">
            <h1 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Client Portal</h1>
            <p className="text-xl font-bold text-slate-900 tracking-tight">Espace Personnel</p>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-1">Client Privilège</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 font-bold border border-slate-200">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl flex flex-col animate-slide-in-left">
            <div className="p-6 flex items-center justify-between border-b border-slate-100">
               <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <span className="font-bold text-slate-900">AutoExpertis</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-900"><X /></button>
            </div>
            <nav className="flex-1 p-6 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center px-4 py-3 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="mr-4 h-5 w-5 text-slate-400" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-3 text-sm font-semibold text-red-500 rounded-xl hover:bg-red-50"
                 >
                  <LogOut className="mr-4 h-5 w-5 text-red-400" />
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
