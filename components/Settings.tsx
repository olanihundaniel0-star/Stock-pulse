
import React from 'react';
import { Building2, Globe, Save, Shield } from 'lucide-react';
import { api } from '../api';
import { Company, User, UserRole } from '../types';

interface SettingsProps {
  currentUser: User;
}

const Settings: React.FC<SettingsProps> = ({ currentUser }) => {
  const [company, setCompany] = React.useState<Company | null>(null);
  const [form, setForm] = React.useState({
    name: '',
    industry: '',
    logoUrl: '',
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const isAdmin = currentUser.role === UserRole.ADMIN;

  const applyCompanyToForm = React.useCallback((value: Company | null) => {
    setCompany(value);
    setForm({
      name: value?.name ?? '',
      industry: value?.industry ?? '',
      logoUrl: value?.logoUrl ?? '',
    });
  }, []);

  const loadCompany = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const mine = await api.companies.getMine();
      applyCompanyToForm(mine);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load company settings';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [applyCompanyToForm]);

  React.useEffect(() => {
    void loadCompany();
  }, [loadCompany]);

  const handleSave = async () => {
    if (!isAdmin) return;
    if (!company) {
      setError('Company setup required before editing settings');
      return;
    }

    const name = form.name.trim();
    if (!name) {
      setError('Company name is required');
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const updated = await api.companies.updateMine({
        name,
        industry: form.industry.trim() || undefined,
        logoUrl: form.logoUrl.trim() || undefined,
      });
      applyCompanyToForm(updated);
      setMessage('Company settings updated');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update company settings';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-900 dark:text-blue-400" size={18} />
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Access Level</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAdmin ? 'Admin access: you can update company details for your workspace.' : 'Read-only access: only admins can update company details.'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Building2 className="text-blue-900 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Company Details</h2>
        </div>

        {loading ? (
          <div className="p-8 text-sm text-slate-500 dark:text-slate-400">Loading company settings...</div>
        ) : !company ? (
          <div className="p-8 space-y-2">
            <p className="font-semibold text-slate-800 dark:text-white">No company found for this account.</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Complete company onboarding first, then return to this section.</p>
          </div>
        ) : (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Company Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 dark:text-white disabled:opacity-70"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                disabled={!isAdmin || saving}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Industry</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 dark:text-white disabled:opacity-70"
                value={form.industry}
                onChange={(e) => setForm((prev) => ({ ...prev, industry: e.target.value }))}
                disabled={!isAdmin || saving}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Logo URL</label>
              <input
                type="url"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 dark:text-white disabled:opacity-70"
                value={form.logoUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, logoUrl: e.target.value }))}
                disabled={!isAdmin || saving}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Globe className="text-blue-900 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Workspace</h2>
        </div>
        <div className="p-8 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <p><span className="font-semibold">Company ID:</span> {company?.id ?? 'Not set'}</p>
          <p><span className="font-semibold">Role:</span> {currentUser.role}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm dark:bg-red-900/20 dark:border-red-900/40 dark:text-red-300">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm dark:bg-emerald-900/20 dark:border-emerald-900/40 dark:text-emerald-300">
          {message}
        </div>
      )}

      {isAdmin && (
        <div className="flex justify-end pt-2">
          <button
            onClick={() => void handleSave()}
            disabled={saving || loading || !company}
            className="flex items-center gap-2 px-8 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Company Settings'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
