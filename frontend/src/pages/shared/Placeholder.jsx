import { Construction } from 'lucide-react';

export default function Placeholder({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-slate-100 rounded-[35px] flex items-center justify-center text-slate-400">
           <Construction className="w-12 h-12" />
        </div>
        <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto">{subtitle || "Cette fonctionnalité est en cours de développement pour la prochaine itération."}</p>
        </div>
    </div>
  )
}
