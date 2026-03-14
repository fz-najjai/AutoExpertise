import { useState, useEffect } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { LogOut, Calendar, X, Search, MapPin, User as UserIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const [experts, setExperts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchCity, setSearchCity] = useState('');
  const [searchSpecialty, setSearchSpecialty] = useState('');

  // Booking state
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    scheduled_at: '',
    vehicle_details: '',
    problem_description: ''
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [expertsRes, apptsRes] = await Promise.all([
        api.get('/client/experts', { params: { city: searchCity, specialty: searchSpecialty } }),
        api.get('/client/appointments')
      ]);
      setExperts(expertsRes.data);
      setAppointments(apptsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const handleBook = (expert) => {
    setSelectedExpert(expert);
    setBookingStep(1);
    setBookingData({ scheduled_at: '', vehicle_details: '', problem_description: '' });
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    try {
      await api.post('/client/appointments', {
        expert_id: selectedExpert.id,
        ...bookingData
      });
      alert('Rendez-vous réservé avec succès!');
      setSelectedExpert(null);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la réservation');
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;
    try {
      await api.put(`/client/appointments/${id}/cancel`);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de l\'annulation');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary-500/30">
      {/* Navbar */}
      <nav className="glass-card sticky top-0 z-40 border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 text-primary-500 font-black text-2xl tracking-tighter">
              <div className="p-2 bg-primary-500 rounded-xl shadow-lg shadow-primary-500/20">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <span>Expertise.</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Espace Client</p>
              </div>
              <button
                onClick={logout}
                className="p-3 text-gray-400 hover:text-red-400 transition-all rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Reservation Tunnel Modal Overlay */}
        {selectedExpert && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-card rounded-3xl shadow-2xl max-w-lg w-full p-8 border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold tracking-tight text-white">Réserver avec {selectedExpert.name}</h3>
                <button
                  onClick={() => setSelectedExpert(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                >
                  &times;
                </button>
              </div>

              {bookingStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase tracking-tighter rounded">Étape 01</span>
                    <p className="text-sm text-gray-400 font-medium tracking-tight">Validation de l'expert</p>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="font-bold text-lg text-white mb-1">{selectedExpert.name}</p>
                    <p className="text-sm text-primary-400 font-medium">{selectedExpert.expert_profile?.specialty} • {selectedExpert.expert_profile?.price}€/h</p>
                  </div>
                  <button onClick={() => setBookingStep(2)} className="w-full py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 font-bold shadow-xl shadow-primary-600/20 transition-all transform hover:scale-[1.02]">Continuer</button>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase tracking-tighter rounded">Étape 02</span>
                    <p className="text-sm text-gray-400 font-medium tracking-tight">Date et Heure</p>
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="datetime-local"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                      value={bookingData.scheduled_at}
                      onChange={e => setBookingData({ ...bookingData, scheduled_at: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button onClick={() => setBookingStep(1)} className="flex-1 py-4 bg-white/5 text-gray-400 rounded-2xl hover:bg-white/10 font-bold transition-all">Retour</button>
                    <button
                      onClick={() => { if (bookingData.scheduled_at) setBookingStep(3) }}
                      disabled={!bookingData.scheduled_at}
                      className="flex-1 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 font-bold shadow-xl shadow-primary-600/20 transition-all disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <form onSubmit={submitBooking} className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase tracking-tighter rounded">Étape 03</span>
                    <p className="text-sm text-gray-400 font-medium tracking-tight">Détails de l'intervention</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Véhicule</label>
                      <input
                        type="text" required placeholder="Ex: Peugeot 208, 2019"
                        className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-gray-600"
                        value={bookingData.vehicle_details} onChange={e => setBookingData({ ...bookingData, vehicle_details: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Problème</label>
                      <textarea
                        required rows="4" placeholder="Décrivez le problème en quelques mots..."
                        className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-gray-600 resize-none"
                        value={bookingData.problem_description} onChange={e => setBookingData({ ...bookingData, problem_description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setBookingStep(2)} className="flex-1 py-4 bg-white/5 text-gray-400 rounded-2xl hover:bg-white/10 font-bold transition-all">Retour</button>
                    <button type="submit" className="flex-1 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 font-bold shadow-xl shadow-primary-600/20 transition-all">Confirmer</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Top Section: Search */}
        <section className="glass-card rounded-[32px] p-10 shadow-2xl border border-white/5 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] -mr-32 -mt-32"></div>
          <h2 className="text-3xl font-black mb-8 flex items-center gap-4 tracking-tighter">
            <Search className="h-8 w-8 text-primary-500" />
            Trouver un Expert
          </h2>
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 relative z-10">
            <div className="flex-[2] relative group">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text" placeholder="Dans quelle ville ?"
                className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 outline-none transition-all placeholder-gray-500 font-medium"
                value={searchCity} onChange={e => setSearchCity(e.target.value)}
              />
            </div>
            <div className="flex-[3] relative group">
              <input
                type="text" placeholder="Spécialité (ex: Moteur, Boîte auto, Électronique...)"
                className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 outline-none transition-all placeholder-gray-500 font-medium"
                value={searchSpecialty} onChange={e => setSearchSpecialty(e.target.value)}
              />
            </div>
            <button type="submit" className="lg:w-48 bg-primary-600 hover:bg-primary-700 text-white font-black text-lg py-5 px-8 rounded-2xl transition-all shadow-xl shadow-primary-600/20 active:scale-95">
              Rechercher
            </button>
          </form>

          {/* Search Results */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experts.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white/2 rounded-[32px] border border-dashed border-white/10">
                <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 font-medium italic">Aucun expert trouvé correspondant à vos critères.</p>
              </div>
            ) : (
              experts.map(expert => (
                <div key={expert.id} className="glass-card rounded-[28px] p-6 hover:translate-y-[-8px] transition-all duration-300 border border-white/5 flex flex-col justify-between group">
                  <div className="relative mb-6">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl overflow-hidden shadow-inner">
                        <img
                          src={expert.expert_profile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=6366f1&color=fff&size=128`}
                          alt={expert.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-primary-400">{expert.expert_profile?.price ? `${expert.expert_profile.price}€/h` : 'Sur devis'}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Tarif expert</p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <h3 className="font-black text-xl text-white tracking-tight">{expert.name}</h3>
                      <p className="text-xs text-gray-500 font-bold flex items-center gap-1.5 mt-1">
                        <MapPin className="h-3 w-3 text-primary-500/50" />
                        {expert.city || 'Casablanca'}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-primary-500/10 text-primary-400 border border-primary-500/10 uppercase tracking-tighter">
                        {expert.expert_profile?.specialty || 'Mécanique Générale'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-4 leading-relaxed line-clamp-3 italic">
                      "{expert.expert_profile?.bio || 'Aucune biographie disponible pour le moment.'}"
                    </p>
                  </div>
                  <button
                    onClick={() => handleBook(expert)}
                    className="w-full bg-white/5 hover:bg-primary-600 text-gray-300 hover:text-white border border-white/10 hover:border-primary-500 py-4 rounded-xl font-bold transition-all active:scale-95 text-sm"
                  >
                    Demander l'expertise
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Bottom Section: My Appointments */}
        <section className="glass-card rounded-[32px] p-10 shadow-2xl border border-white/5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black flex items-center gap-4 tracking-tighter">
              <Calendar className="h-8 w-8 text-primary-500" />
              Mes Rendez-vous
            </h2>
          </div>

          <div className="overflow-x-auto -mx-10 px-10">
            <table className="min-w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  <th className="px-6 py-2">Expert</th>
                  <th className="px-6 py-2">Date & Heure</th>
                  <th className="px-6 py-2">Véhicule</th>
                  <th className="px-6 py-2">Statut</th>
                  <th className="px-6 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center bg-white/2 rounded-3xl">
                      <Clock className="w-10 h-10 text-gray-800 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium italic">Aucun rendez-vous prévu pour le moment.</p>
                    </td>
                  </tr>
                ) : (
                  appointments.map(appt => {
                    const isCancelable = new Date(appt.scheduled_at).getTime() - new Date().getTime() > 24 * 60 * 60 * 1000;
                    return (
                      <tr key={appt.id} className="group">
                        <td className="px-6 py-5 bg-white/2 first:rounded-l-2xl border-y border-l border-white/5 group-hover:bg-white/5 transition-colors font-black text-white">
                          {appt.expert?.name}
                        </td>
                        <td className="px-6 py-5 bg-white/2 border-y border-white/5 group-hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-500/10 rounded-lg">
                              <Calendar className="h-4 w-4 text-primary-500" />
                            </div>
                            <span className="font-bold text-gray-300">
                              {format(new Date(appt.scheduled_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 bg-white/2 border-y border-white/5 group-hover:bg-white/5 transition-colors text-gray-400 font-medium max-w-xs truncate">
                          {appt.vehicle_details}
                        </td>
                        <td className="px-6 py-5 bg-white/2 border-y border-white/5 group-hover:bg-white/5 transition-colors">
                          <span className={`px-4 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-full 
                            ${appt.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              appt.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                            {appt.status === 'pending' ? 'Attente' : appt.status === 'confirmed' ? 'Confirmé' : appt.status === 'completed' ? 'Terminé' : 'Annulé'}
                          </span>
                        </td>
                        <td className="px-6 py-5 bg-white/2 last:rounded-r-2xl border-y border-r border-white/5 group-hover:bg-white/5 transition-colors text-right">
                          {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                            <button
                              onClick={() => cancelAppointment(appt.id)}
                              disabled={!isCancelable}
                              className={`p-2 rounded-xl transition-all ${isCancelable ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-700 opacity-50 cursor-not-allowed'}`}
                              title={!isCancelable ? "Impossible d'annuler à moins de 24h" : "Annuler le rendez-vous"}
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
