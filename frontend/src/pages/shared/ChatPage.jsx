import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import echo from '../../utils/echo';
import { 
  Send, 
  User, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Image as ImageIcon, 
  Paperclip, 
  Smile,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ChatPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(location.state?.openConversation || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/conversations');
        setConversations(res.data.sort((a, b) => new Date(b.last_message_at || b.created_at) - new Date(a.last_message_at || a.created_at)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter(conv => {
    const peer = getPeer(conv);
    return peer.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Load messages when conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/conversations/${activeConversation.id}/messages`);
        setMessages(res.data);
        // Mark as read
        api.post(`/conversations/${activeConversation.id}/read`);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();

    // Listen for new messages
    const channel = echo.private(`chat.${activeConversation.id}`)
      .listen('MessageSent', (e) => {
        setMessages(prev => {
            if (prev.find(m => m.id === e.id)) return prev;
            return [...prev, e];
        });
        // Update last message in conversation list
        setConversations(prev => prev.map(c => 
          c.id === activeConversation.id ? { ...c, messages: [{ body: e.body }], last_message_at: e.created_at } : c
        ));
        // Mark as read if active
        api.post(`/conversations/${activeConversation.id}/read`);
      });

    return () => {
      echo.leave(`chat.${activeConversation.id}`);
    };
  }, [activeConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const text = newMessage;
    setNewMessage('');

    try {
      const res = await api.post(`/conversations/${activeConversation.id}/messages`, {
        body: text
      });
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const getPeer = (conv) => {
    return user.role === 'client' ? conv.expert : conv.client;
  };

  return (
    <div className="h-[calc(100vh-140px)] flex overflow-hidden glass-card rounded-[40px] bg-white border border-slate-100 shadow-2xl animate-fade-in">
      {/* Sidebar */}
      <div className="w-96 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h2>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
              <MoreVertical className="w-5 h-5" />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher une discussion..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-2 pb-8">
          {filteredConversations.map((conv) => {
            const peer = getPeer(conv);
            const isActive = activeConversation?.id === conv.id;
            return (
              <button 
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all duration-300 group ${
                  isActive ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'hover:bg-white'
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-colors ${isActive ? 'border-white/20' : 'border-slate-100'}`}>
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(peer.name)}&background=${isActive ? 'fff' : '0F172A'}&color=${isActive ? '0F172A' : 'fff'}&size=128`} alt={peer.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex-1 text-left min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-black truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>{peer.name}</p>
                    <span className={`text-[10px] font-bold ${isActive ? 'text-white/40' : 'text-slate-400'}`}>
                      {conv.last_message_at ? format(new Date(conv.last_message_at), 'HH:mm') : ''}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${isActive ? 'text-white/60' : 'text-slate-500 font-medium'}`}>
                    {conv.messages?.[0]?.body || 'Démarrer la discussion...'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getPeer(activeConversation).name)}&background=F8FAFC&color=0F172A&size=128`} alt={getPeer(activeConversation).name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">{getPeer(activeConversation).name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En ligne</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all"><Phone className="w-5 h-5" /></button>
                <button className="p-3 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all"><Video className="w-5 h-5" /></button>
                <div className="w-px h-8 bg-slate-100 mx-2"></div>
                <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/30">
              {messages.map((msg, idx) => {
                const isMe = msg.sender_id === user.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-up`} style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className={`max-w-[70%] space-y-1.5`}>
                      <div className={`p-4 rounded-3xl text-sm font-medium ${
                        isMe 
                          ? 'bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-900/10' 
                          : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'
                      }`}>
                        {msg.body}
                      </div>
                      <div className={`flex items-center gap-2 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] font-bold text-slate-400">
                          {format(new Date(msg.created_at), 'HH:mm')}
                        </span>
                        {isMe && (
                          <CheckCheck className="w-3 h-3 text-primary-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="relative flex items-center gap-4">
                <div className="flex items-center gap-2 pr-2">
                   <button type="button" className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"><Paperclip className="w-5 h-5" /></button>
                   <button type="button" className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"><ImageIcon className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message ici..." 
                    className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-medium"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-500 transition-colors"><Smile className="w-5 h-5" /></button>
                </div>
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-6 h-6" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-fade-in">
            <div className="w-32 h-32 bg-slate-50 rounded-[40px] flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner">
              <User className="w-16 h-16" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vos Discussions</h3>
              <p className="text-slate-500 font-medium">Sélectionnez une conversation pour commencer à échanger en temps réel.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
