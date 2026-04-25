import React from 'react';
import { Building2, CalendarClock, Mail, Settings2, Shield, UserCircle2 } from 'lucide-react';
import { api } from '../api';
import { Company, User, UserRole } from '../types';

interface ProfileProps {
  currentUser: User;
  onOpenSettings: () => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, onOpenSettings }) => {
  const [company, setCompany] = React.useState<Company | null>(null);
  const [loadingCompany, setLoadingCompany] = React.useState(false);
  const [companyError, setCompanyError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    const loadCompany = async () => {
      if (!currentUser.companyId) {
        setCompany(null);
        return;
      }

      setLoadingCompany(true);
      setCompanyError(null);
      try {
        const mine = await api.companies.getMine();
        if (!active) return;
        setCompany(mine);
      } catch (err: unknown) {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'Failed to load company details';
        setCompanyError(message);
      } finally {
        if (active) {
          setLoadingCompany(false);
        }
      }
    };

    void loadCompany();

    return () => {
      active = false;
    };
  }, [currentUser.companyId]);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 rounded-full flex items-center justify-center">
            <UserCircle2 size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{currentUser.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Mail size={14} /> {currentUser.email}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Shield size={14} /> {currentUser.role}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <CalendarClock size={14} /> Last login: {currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="text-blue-900 dark:text-blue-400" size={18} />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Company</h3>
        </div>

        {loadingCompany && <p className="text-sm text-slate-500 dark:text-slate-400">Loading company details...</p>}

        {!loadingCompany && companyError && (
          <p className="text-sm text-red-600 dark:text-red-400">{companyError}</p>
        )}

        {!loadingCompany && !companyError && !company && (
          <p className="text-sm text-slate-500 dark:text-slate-400">No company is linked to this account yet.</p>
        )}

        {!loadingCompany && !companyError && company && (
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p><span className="font-semibold">Name:</span> {company.name}</p>
            <p><span className="font-semibold">Industry:</span> {company.industry || 'Not set'}</p>
            <p><span className="font-semibold">Logo URL:</span> {company.logoUrl || 'Not set'}</p>
            <p><span className="font-semibold">Company ID:</span> {company.id}</p>
          </div>
        )}

        {currentUser.role === UserRole.ADMIN && (
          <div className="pt-5">
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition-colors"
            >
              <Settings2 size={16} />
              Manage Company Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
