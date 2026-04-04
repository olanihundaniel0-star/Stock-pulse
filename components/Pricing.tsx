import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface PricingProps {
  onBack: () => void;
  onLogin: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onBack, onLogin }) => {
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

      <section className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        <div className="text-center space-y-4">
          <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Pricing</p>
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">Simple, transparent pricing</h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">No hidden fees. No per-seat gotchas. Pick the plan that fits your operation.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Starter */}
          <div className="rounded-3xl border border-slate-200 p-8 space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Starter</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900">Free</span>
              </div>
              <p className="text-slate-500 text-sm">Perfect for small teams getting started.</p>
            </div>
            <ul className="space-y-3">
              {[
                'Up to 3 users',
                'Up to 100 products',
                'Basic reports',
                'Stock In & Stock Out',
                'Email support',
                'Dark mode',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-slate-700 text-[15px]">
                  <Check size={16} className="text-emerald-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={onLogin}
              className="w-full py-3.5 rounded-full border-2 border-slate-900 text-slate-900 font-bold text-[15px] hover:bg-slate-50 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Get started free
            </button>
          </div>

          {/* Pro */}
          <div className="rounded-3xl border-2 border-slate-900 p-8 space-y-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-slate-900 text-white text-xs font-bold px-4 py-1.5 rounded-full">Most Popular</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Pro</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900">₦20,000</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>
              <p className="text-slate-500 text-sm">For growing businesses that need more power.</p>
            </div>
            <ul className="space-y-3">
              {[
                'Unlimited users',
                'Unlimited products',
                'Advanced analytics & profit reports',
                'CSV export for inventory & reports',
                'Low stock notifications',
                'Priority support',
                'Multi-location support',
                'Everything in Starter',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-slate-700 text-[15px]">
                  <Check size={16} className="text-emerald-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={onLogin}
              className="w-full py-3.5 rounded-full bg-slate-900 text-white font-bold text-[15px] hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Start Pro trial <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="text-center text-slate-500 text-sm">
          All plans include a 14-day free trial. No credit card required.
        </div>
      </section>
    </div>
  );
};

export default Pricing;