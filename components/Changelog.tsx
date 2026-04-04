import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ChangelogProps {
  onBack: () => void;
}

const entries = [
  {
    version: 'v1.4.0',
    date: 'April 2026',
    title: 'Animated Loading Screen & Navigation',
    items: [
      'Added character loading screen with smooth walking animation',
      'Implemented full React Router for back-button support and deep linking',
      'Added Changelog, Pricing, and Status pages to landing navigation',
    ],
  },
  {
    version: 'v1.3.0',
    date: 'March 2026',
    title: 'Company Multi-Tenancy',
    items: [
      'Each admin now creates their own company workspace on signup',
      'All products, transactions, and staff are scoped to their company',
      'New company onboarding flow with animated DotGrid background',
    ],
  },
  {
    version: 'v1.2.0',
    date: 'March 2026',
    title: 'Animations & Dark Mode Polish',
    items: [
      'Added BlurText hero animation to landing page',
      'Added BorderGlow effect on CTA buttons',
      'Fixed dark mode on Stock In, Stock Out, Users, and Settings pages',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'February 2026',
    title: 'Naira Currency & Export Features',
    items: [
      'Switched all currency displays from USD to Naira (₦)',
      'Added CSV export to Inventory and Reports pages',
      'Implemented low stock notifications with bell indicator',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'January 2026',
    title: 'Initial Launch',
    items: [
      'Full inventory management with Stock In and Stock Out operations',
      'Role-based access — Admins see cost prices and margins, staff see stock levels',
      'Real-time dashboard with sales chart and activity feed',
    ],
  },
];

const Changelog: React.FC<ChangelogProps> = ({ onBack }) => {
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

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-4">
        <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase">What's New</p>
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">Changelog</h1>
        <p className="text-lg text-slate-500">Every update, fix, and feature we've shipped.</p>

        <div className="pt-12 space-y-0">
          {entries.map((entry, i) => (
            <div key={entry.version} className="relative flex gap-8 pb-12">
              {/* Timeline line */}
              {i < entries.length - 1 && (
                <div className="absolute left-[19px] top-8 bottom-0 w-px bg-slate-100" />
              )}
              {/* Dot */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center mt-1 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              </div>
              {/* Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                    {entry.version}
                  </span>
                  <span className="text-sm text-slate-400 font-medium">{entry.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{entry.title}</h3>
                <ul className="space-y-2">
                  {entry.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-slate-600 text-[15px]">
                      <span className="text-indigo-400 mt-1 flex-shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Changelog;