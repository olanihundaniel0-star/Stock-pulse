import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { API_BASE } from '../api';

interface StatusProps {
  onBack: () => void;
}

type ApiState = 'checking' | 'up' | 'down';

const clientServices = [
  { name: 'Dashboard', description: 'Real-time metrics and charts' },
  { name: 'Stock Operations', description: 'Stock In and Stock Out processing' },
  { name: 'Reports', description: 'Analytics and report generation' },
];

const Status: React.FC<StatusProps> = ({ onBack }) => {
  const [apiState, setApiState] = useState<ApiState>('checking');
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/health`, { signal: ctrl.signal });
        if (!cancelled) {
          setApiState(res.ok ? 'up' : 'down');
          setCheckedAt(new Date());
        }
      } catch {
        if (!cancelled) {
          setApiState('down');
          setCheckedAt(new Date());
        }
      } finally {
        clearTimeout(timer);
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      ctrl.abort();
    };
  }, []);

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
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">System Status</h1>
            {apiState === 'checking' ? (
              <span className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-full text-sm">
                <Loader2 size={14} className="animate-spin" />
                Checking…
              </span>
            ) : apiState === 'up' ? (
              <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-full text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                API Reachable
              </span>
            ) : (
              <span className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 font-bold rounded-full text-sm">
                <AlertCircle size={14} />
                API Unreachable
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm">
            {checkedAt ? `Last checked: ${checkedAt.toLocaleString()}` : 'Contacting API…'}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900">API</p>
              <p className="text-sm text-slate-500">Core backend API & data endpoints (live check above)</p>
            </div>
            {apiState === 'checking' ? (
              <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm flex-shrink-0">
                <Loader2 size={18} className="animate-spin" />
                Checking…
              </div>
            ) : apiState === 'up' ? (
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm flex-shrink-0">
                <CheckCircle size={18} />
                Reachable
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 font-semibold text-sm flex-shrink-0">
                <AlertCircle size={18} />
                Unreachable
              </div>
            )}
          </div>
          {clientServices.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">{service.name}</p>
                <p className="text-sm text-slate-500">{service.description}</p>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm flex-shrink-0">
                <CheckCircle size={18} />
                Included in this build
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 space-y-2">
          <p className="font-bold text-slate-900">Uptime history</p>
          <p className="text-sm text-slate-500">Uptime tracking is not enabled yet. This page reports a live reachability check only.</p>
        </div>
      </section>
    </div>
  );
};

export default Status;