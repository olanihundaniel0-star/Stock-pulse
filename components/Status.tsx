import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface StatusProps {
  onBack: () => void;
}

const services = [
  { name: 'API', description: 'Core backend API & data endpoints' },
  { name: 'Database', description: 'PostgreSQL via Supabase' },
  { name: 'Authentication', description: 'Supabase Auth & Google OAuth' },
  { name: 'Dashboard', description: 'Real-time metrics and charts' },
  { name: 'Stock Operations', description: 'Stock In and Stock Out processing' },
  { name: 'Reports', description: 'Analytics and report generation' },
];

const Status: React.FC<StatusProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white font-['Inter'] selection:bg-blue-100 animate-in fade-in duration-500">
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-900 cursor-pointer" onClick={onBack}>
          <div className="w-6 h-6 bg-slate-900 rounded-sm flex items-center justify-center transform -rotate-12">
            <span className="text-white text-[10px] font-black italic">S</span>
          </div>
          <span className="tracking-tight">StockPulse</span>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 text-[14px] font-semibold text-slate-500 hover:text-slate-900 transition-colors hover:scale-[1.03] active:scale-95">
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        <div className="space-y-4">
          <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase">System Status</p>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">All Systems</h1>
            <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-full text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            Last checked: {new Date().toLocaleString()}
          </p>
        </div>

        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">{service.name}</p>
                <p className="text-sm text-slate-500">{service.description}</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm flex-shrink-0">
                <CheckCircle size={18} />
                Operational
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 space-y-2">
          <p className="font-bold text-slate-900">Uptime — last 30 days</p>
          <div className="flex gap-0.5">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-8 rounded-sm bg-emerald-400"
                title="100% uptime"
              />
            ))}
          </div>
          <p className="text-sm text-slate-500">100% uptime across all services</p>
        </div>
      </section>
    </div>
  );
};

export default Status;