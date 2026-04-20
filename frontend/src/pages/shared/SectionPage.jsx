import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SectionPage({ title, subtitle, description, actions = [], children }) {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">{subtitle}</p>
        </div>
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                {action.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {description && (
        <div className="rounded-4xl border border-slate-200 bg-slate-50 p-8 text-slate-600">
          <p>{description}</p>
        </div>
      )}

      {children}
    </div>
  );
}
