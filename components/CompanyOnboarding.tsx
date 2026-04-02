import React, { useState } from 'react';
import { User } from '../types';

const INDUSTRIES = [
  'Retail',
  'Manufacturing',
  'Healthcare',
  'Food & Beverage',
  'Technology',
  'Other',
] as const;

type CompanyInput = {
  name: string;
  industry?: string;
  logoUrl?: string;
};

type CompanyOnboardingProps = {
  currentUser: User;
  onComplete: (company: CompanyInput) => Promise<void> | void;
};

const CompanyOnboarding: React.FC<CompanyOnboardingProps> = ({
  currentUser,
  onComplete,
}) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setLoading(true);
    setError('');
    try {
      await onComplete({
        name: trimmedName,
        industry: industry || undefined,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to complete onboarding. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1729] text-white relative overflow-hidden flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(71,85,105,0.35),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(30,41,59,0.45),transparent_50%)]" />

      <div className="relative w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-md shadow-[0_25px_80px_rgba(2,6,23,0.65)] p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 bg-white text-[#0f1729] rounded-xl flex items-center justify-center font-bold text-xl italic">
              S
            </div>
            <span className="font-bold text-2xl tracking-tight">StockPulse</span>
          </div>

          <p className="text-slate-300 text-sm uppercase tracking-[0.2em] mb-3">Step 1</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Let&apos;s set up your company
          </h1>
          <p className="text-slate-300 mb-8">
            Welcome, {currentUser.name}. Add your company details to continue to the dashboard.
          </p>

          {error && (
            <div className="mb-6 rounded-xl border border-red-400/40 bg-red-900/30 text-red-100 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-100">Company Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Inventory Ltd"
                className="w-full rounded-xl border border-slate-600 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-sky-400/70"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-100">Industry (Optional)</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-950/70 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-sky-400/70"
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-950 font-semibold py-3.5 transition-colors"
            >
              {loading ? 'Continuing...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyOnboarding;
