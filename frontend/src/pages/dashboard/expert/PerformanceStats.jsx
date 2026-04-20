import SectionPage from '../../shared/SectionPage';
import { TrendingUp, BarChart3, ShieldCheck } from 'lucide-react';

const stats = [
  { label: 'Taux de conversion', value: '76%', icon: TrendingUp },
  { label: 'Avis 5 étoiles', value: '4.9 / 5', icon: ShieldCheck },
  { label: 'Réservations ce mois', value: '28', icon: BarChart3 },
];

export default function PerformanceStats() {
  return (
    <SectionPage
      title="Statistiques"
      subtitle="Analysez votre performance et identifiez les leviers pour augmenter vos revenus."
      description="Suivez les indicateurs clés comme les avis, le taux de conversion et les réservations en cours." 
    >
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
            <div className="flex items-center gap-3 text-slate-700 mb-4">
              <item.icon className="w-6 h-6 text-primary-500" />
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400 font-semibold">{item.label}</p>
            </div>
            <p className="text-4xl font-black text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>
    </SectionPage>
  );
}
