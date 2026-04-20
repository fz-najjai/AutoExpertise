import SectionPage from '../../shared/SectionPage';
import { FileText, CreditCard, Download } from 'lucide-react';

const invoices = [
  { id: 'INV-2026-001', amount: '230€', date: '15 mars 2026', status: 'Payée' },
  { id: 'INV-2026-002', amount: '410€', date: '28 février 2026', status: 'En attente' },
  { id: 'INV-2026-003', amount: '180€', date: '09 février 2026', status: 'Payée' },
];

export default function ClientInvoices() {
  return (
    <SectionPage
      title="Factures & avis"
      subtitle="Consultez vos factures, téléchargez vos documents et suivez l’état de vos paiements."
      description="Toutes vos transactions liées aux demandes d’expertise sont centralisées ici pour un suivi clair et rapide."
    >
      <div className="grid gap-5">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-slate-700">
                <FileText className="w-6 h-6 text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{invoice.id}</p>
                  <p className="text-sm text-slate-500">{invoice.date}</p>
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{invoice.status}</span>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Montant</p>
                <p className="text-2xl font-black text-slate-900">{invoice.amount}</p>
              </div>
              <button className="btn-secondary inline-flex items-center gap-2 px-4 py-3">
                Télécharger
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </SectionPage>
  );
}
