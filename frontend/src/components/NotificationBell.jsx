import { useState, useEffect, useRef } from 'react';
import { api } from '../context/AuthContext';
import { Bell, Check, Clock, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      // Format response (Laravel pagination)
      const list = res.data.data || [];
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.read_at).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // In a real app, we'd use Echo/Websockets here
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/mark-as-read`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all duration-300 group ${
          isOpen ? 'bg-indigo-600/20 text-indigo-400' : 'text-indigo-200/40 hover:text-indigo-300 hover:bg-white/5'
        }`}
      >
        <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#020617] shadow-lg shadow-rose-500/20">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-96 glass-card rounded-[32px] bg-[#020617] border border-indigo-900/40 shadow-2xl overflow-hidden animate-fade-in-up z-[100]">
          <div className="p-6 border-b border-indigo-900/40 bg-indigo-950/20 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Centre de Commandes</h3>
            <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">
              {notifications.length} Messages
            </span>
          </div>

          <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-indigo-200/30 uppercase font-black">Synchronisation...</p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-indigo-900/20">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-5 transition-colors flex gap-4 ${
                      !notif.read_at ? 'bg-indigo-600/5 hover:bg-indigo-600/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${
                      notif.data.type === 'booking_created' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'
                    }`}>
                      {notif.data.type === 'booking_created' ? <Calendar className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-bold ${!notif.read_at ? 'text-white' : 'text-indigo-200/50'}`}>
                          {notif.data.message}
                        </p>
                        {!notif.read_at && (
                          <button 
                            onClick={() => markAsRead(notif.id)}
                            className="text-indigo-400 hover:text-emerald-400 p-1"
                            title="Marquer comme lu"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-indigo-200/40 leading-relaxed">
                        Ref: {notif.data.reference} • {notif.data.client_name ? `Par ${notif.data.client_name}` : ''}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-indigo-500 font-bold uppercase tracking-wider mt-2">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-500/5 rounded-3xl flex items-center justify-center mx-auto text-indigo-900">
                  <Bell className="w-8 h-8 opacity-20" />
                </div>
                <div>
                   <p className="text-white font-bold">Aucune transmission</p>
                   <p className="text-xs text-indigo-200/30 mt-1">Le système est actuellement silencieux.</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-indigo-900/40 bg-indigo-950/20">
            <button className="w-full py-2.5 text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-[0.2em] transition-colors">
              Voir tout l'historique
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
