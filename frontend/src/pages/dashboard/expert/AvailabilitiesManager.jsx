import { useState, useEffect, useRef } from 'react';
import { api } from '../../../context/AuthContext';
import { 
  Calendar as CalendarIcon, 
  Trash2, 
  Clock, 
  PlusCircle, 
  Zap,
  Info,
  CalendarCheck,
  X
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function AvailabilitiesManager() {
  const calendarRef = useRef(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAvail, setNewAvail] = useState({ start_time: '', end_time: '' });

  const fetchAvailabilities = async () => {
    try {
      const res = await api.get('/expert/availabilities');
      setAvailabilities(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const addAvailability = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.post('/expert/availabilities', newAvail);
      setNewAvail({ start_time: '', end_time: '' });
      setShowAddModal(false);
      fetchAvailabilities();
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || 'Problème lors de la création'));
    }
  };

  const deleteAvailability = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette disponibilité ?')) return;
    try {
      await api.delete(`/expert/availabilities/${id}`);
      fetchAvailabilities();
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || 'Impossible de supprimer ce créneau'));
    }
  };

  const handleDateSelect = (selectInfo) => {
    setNewAvail({
      start_time: selectInfo.startStr.substring(0, 16),
      end_time: selectInfo.endStr.substring(0, 16)
    });
    setShowAddModal(true);
  };

  const handleEventClick = (clickInfo) => {
    const isBooked = clickInfo.event.extendedProps.is_booked;
    if (isBooked) {
      alert('Ce créneau est déjà réservé par un client.');
    } else {
      deleteAvailability(clickInfo.event.id);
    }
  };

  const events = availabilities.map(a => ({
    id: a.id,
    title: a.is_booked ? 'RÉSERVÉ' : 'LIBRE',
    start: a.start_time,
    end: a.end_time,
    backgroundColor: a.is_booked ? '#10B981' : '#0F172A',
    borderColor: 'transparent',
    extendedProps: { is_booked: a.is_booked }
  }));

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Chargement de votre agenda...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <CalendarIcon className="w-7 h-7" />
            </div>
            Mon Agenda Expert
          </h2>
          <p className="text-slate-500 font-medium tracking-tight text-lg">Gérez vos disponibilités en cliquant ou faisant glisser sur le calendrier.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <PlusCircle className="w-5 h-5" /> Ajouter un créneau
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-card p-8 rounded-[40px] border border-slate-100 bg-white shadow-xl space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                 <Zap className="w-5 h-5 text-primary-500" /> Astuces Agenda
              </h3>
              <ul className="space-y-6">
                 <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex-shrink-0 flex items-center justify-center text-slate-400 font-bold text-xs italic">01</div>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Maintenez le clic et faites glisser sur les heures pour créer un créneau personnalisé.
                    </p>
                 </li>
                 <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex-shrink-0 flex items-center justify-center text-slate-400 font-bold text-xs italic">02</div>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Les créneaux <span className="text-emerald-500 font-black">Emeraude</span> sont ceux déjà réservés par des clients.
                    </p>
                 </li>
                 <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex-shrink-0 flex items-center justify-center text-slate-400 font-bold text-xs italic">03</div>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Cliquez sur un créneau <span className="text-slate-900 font-black">Noir</span> pour le supprimer de vos disponibilités.
                    </p>
                 </li>
              </ul>
           </div>

           <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16 group-hover:scale-125 transition-transform duration-700"></div>
              <div className="relative z-10 space-y-4">
                 <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Info className="w-6 h-6 text-primary-400" />
                 </div>
                 <h4 className="font-black text-lg">Synchronisation</h4>
                 <p className="text-slate-400 text-xs font-medium leading-relaxed">Vos modifications sont répercutées instantanément sur votre profil public client.</p>
              </div>
           </div>
        </div>

        {/* Calendar Column */}
        <div className="lg:col-span-3">
          <div className="glass-card p-6 md:p-10 rounded-[45px] border border-slate-100 bg-white shadow-2xl shadow-slate-200/40">
             <div className="calendar-container">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  locale={fr}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  weekends={true}
                  events={events}
                  select={handleDateSelect}
                  eventClick={handleEventClick}
                  height="700px"
                  slotMinTime="07:00:00"
                  slotMaxTime="21:00:00"
                  allDaySlot={false}
                  slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    omitZeroMinute: false,
                    meridiem: 'short'
                  }}
                />
             </div>
          </div>
        </div>
      </div>

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowAddModal(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[45px] shadow-2xl overflow-hidden animate-zoom-in border border-slate-200">
             <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                   <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
                      <CalendarCheck className="w-6 h-6" />
                   </div>
                   <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                      <X className="w-6 h-6" />
                   </button>
                </div>
                
                <div className="space-y-2">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">Ajouter un créneau</h3>
                   <p className="text-slate-500 font-medium text-sm">Veuillez confirmer l'horaire pour ce nouveau créneau.</p>
                </div>

                <form onSubmit={addAvailability} className="space-y-6">
                   <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Début de disponibilité</label>
                        <input 
                          type="datetime-local" 
                          className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all"
                          value={newAvail.start_time}
                          onChange={e => setNewAvail({...newAvail, start_time: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fin de disponibilité</label>
                        <input 
                          type="datetime-local" 
                          className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all"
                          value={newAvail.end_time}
                          onChange={e => setNewAvail({...newAvail, end_time: e.target.value})}
                          required
                        />
                      </div>
                   </div>
                   <button type="submit" className="w-full py-6 bg-primary-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[28px] shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                      Confirmer le créneau
                   </button>
                </form>
             </div>
          </div>
        </div>
      )}

      {/* Calendar Style Overrides */}
      <style>{`
        .fc { font-family: 'Inter', sans-serif; --fc-border-color: #f1f5f9; --fc-today-bg-color: #f8fafc; }
        .fc .fc-toolbar-title { font-weight: 900 !important; color: #0f172a; text-transform: uppercase; letter-spacing: -0.02em; font-size: 1.25rem; }
        .fc .fc-button-primary { background: #fff !important; color: #0f172a !important; border: 1px solid #e2e8f0 !important; font-weight: 800 !important; font-size: 11px !important; text-transform: uppercase !important; border-radius: 14px !important; padding: 10px 18px !important; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important; }
        .fc .fc-button-primary:hover { background: #f8fafc !important; }
        .fc .fc-button-active { background: #0f172a !important; color: #fff !important; border-color: #0f172a !important; }
        .fc .fc-col-header-cell-cushion { color: #64748b; font-weight: 800; text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; padding: 15px 0 !important; }
        .fc .fc-timegrid-slot-label-cushion { font-weight: 700; color: #94a3b8; font-size: 10px; }
        .fc-event { cursor: pointer; padding: 4px 6px; border-radius: 10px !important; border: none !important; }
        .fc-event-main { font-weight: 800; font-size: 9px; letter-spacing: 0.1em; }
        .fc-v-event { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .fc .fc-highlight { background: rgba(59, 130, 246, 0.1) !important; }
      `}</style>
    </div>
  );
}

