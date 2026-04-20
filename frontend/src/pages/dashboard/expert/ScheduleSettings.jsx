import { useState } from 'react';
import SectionPage from '../../shared/SectionPage';
import { Calendar, Clock, Repeat, Save, CheckCircle } from 'lucide-react';
import { api } from '../../../context/AuthContext';

export default function ScheduleSettings() {
  const [settings, setSettings] = useState({
    min_delay: 24,
    allow_reschedule: true,
    auto_accept: false
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/expert/settings/schedule', { schedule: settings });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <SectionPage
      title="Préférences agenda"
      subtitle="Personnalisez votre calendrier et les règles de réservation."
      description="Définissez vos règles pour optimiser vos créneaux et réduire les imprévus." 
    >
      <div className="max-w-4xl space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-xl shadow-slate-200/50">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-50 text-primary-500 rounded-xl">
                      <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Délai de réservation</h3>
               </div>
               <p className="text-slate-500 text-sm mb-6">Fixez un délai minimum (en heures) avant qu'un client ne puisse réserver.</p>
               <select 
                 value={settings.min_delay}
                 onChange={(e) => setSettings({...settings, min_delay: e.target.value})}
                 className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none"
               >
                  <option value={12}>12 heures</option>
                  <option value={24}>24 heures (1 jour)</option>
                  <option value={48}>48 heures (2 jours)</option>
                  <option value={72}>72 heures (3 jours)</option>
               </select>
            </div>

            <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-xl shadow-slate-200/50">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-50 text-primary-500 rounded-xl">
                      <Repeat className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Replanification</h3>
               </div>
               <p className="text-slate-500 text-sm mb-6">Autorisez les clients à modifier la date après le paiement initial.</p>
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSettings({...settings, allow_reschedule: true})}
                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${settings.allow_reschedule ? 'bg-primary-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                  >
                    Oui
                  </button>
                  <button 
                    onClick={() => setSettings({...settings, allow_reschedule: false})}
                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${!settings.allow_reschedule ? 'bg-primary-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                  >
                    Non
                  </button>
               </div>
            </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[35px] flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white">
                    <Calendar className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="text-white font-bold">Acceptation automatique</h4>
                   <p className="text-slate-400 text-xs font-medium">Les rendez-vous sont validés sans confirmation manuelle.</p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.auto_accept} onChange={(e) => setSettings({...settings, auto_accept: e.target.checked})} className="sr-only peer" />
                <div className="w-14 h-8 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
        </div>

        <div className="flex justify-end pt-6">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-10 py-5 bg-primary-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-primary-600 transition-all flex items-center gap-3 active:scale-95"
            >
               {saving ? 'Sauvegarde...' : success ? <><CheckCircle className="w-4 h-4" /> Enregistré</> : <><Save className="w-4 h-4" /> Enregistrer les règles</>}
            </button>
        </div>
      </div>
    </SectionPage>
  );
}
