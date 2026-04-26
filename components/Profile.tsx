import React from 'react';
import {
  Building2,
  CalendarClock,
  Camera,
  Mail,
  Settings2,
  Shield,
  Trash2,
  X,
} from 'lucide-react';
import { api } from '../api';
import { supabase } from '../lib/supabase';
import { Company, User, UserRole } from '../types';

interface ProfileProps {
  currentUser: User;
  onOpenSettings: () => void;
  onAvatarUpdate: (avatarUrl: string | null) => void;
}

const MAX_FILE_SIZE_MB = 2;

const Profile: React.FC<ProfileProps> = ({
  currentUser,
  onOpenSettings,
  onAvatarUpdate,
}) => {
  const [company, setCompany] = React.useState<Company | null>(null);
  const [loadingCompany, setLoadingCompany] = React.useState(false);
  const [companyError, setCompanyError] = React.useState<string | null>(null);

  // Avatar upload state
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);
  const [removing, setRemoving] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const extractStoragePath = (publicUrl: string): string | null => {
    const marker = '/object/public/avatars/';
    const idx = publicUrl.indexOf(marker);
    return idx !== -1 ? publicUrl.slice(idx + marker.length) : null;
  };

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
        const message =
          err instanceof Error ? err.message : 'Failed to load company details';
        setCompanyError(message);
      } finally {
        if (active) setLoadingCompany(false);
      }
    };

    void loadCompany();
    return () => {
      active = false;
    };
  }, [currentUser.companyId]);

  // Clean up local preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!fileInputRef.current) return;
    fileInputRef.current.value = '';

    if (!file) return;

    setUploadError(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPEG, PNG, WebP, etc.).');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadError(`Image must be smaller than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploading(true);

    try {
      // 1. Get current session for user id
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated. Please sign in again.');

      // 2. Delete old file from storage if one exists
      if (currentUser.avatarUrl) {
        const oldPath = extractStoragePath(currentUser.avatarUrl);
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      const ext = file.name.split('.').pop() ?? 'jpg';
      const filePath = `${session.user.id}/${Date.now()}.${ext}`;

      // 3. Upload to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (storageError) throw new Error(storageError.message);

      // 4. Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // 5. Persist URL via backend
      await api.users.updateAvatar(publicUrl);

      // 6. Notify parent so currentUser in App state is updated
      onAvatarUpdate(publicUrl);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setUploadError(message);
      // Revert preview on failure
      setLocalPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setUploadError(null);
    setRemoving(true);
    try {
      if (currentUser.avatarUrl) {
        const path = extractStoragePath(currentUser.avatarUrl);
        if (path) {
          await supabase.storage.from('avatars').remove([path]);
        }
      }
      await api.users.removeAvatar();
      setLocalPreview(null);
      onAvatarUpdate(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to remove photo. Please try again.';
      setUploadError(message);
    } finally {
      setRemoving(false);
    }
  };

  const avatarSrc = localPreview ?? currentUser.avatarUrl ?? null;

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0 group">
            <div
              className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-900 shadow-md cursor-pointer"
              onClick={() => !uploading && fileInputRef.current?.click()}
              title="Change profile picture"
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold select-none">
                  {initials}
                </div>
              )}

              {/* Upload overlay */}
              <div
                className={`absolute inset-0 rounded-full flex items-center justify-center transition-opacity duration-200 ${
                  uploading
                    ? 'bg-black/50 opacity-100'
                    : 'bg-black/0 group-hover:bg-black/40 opacity-0 group-hover:opacity-100'
                }`}
              >
                {uploading ? (
                  <svg
                    className="animate-spin w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void handleFileChange(e)}
              disabled={uploading}
            />

            {/* Change photo button */}
            {!uploading && !removing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-900 dark:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors border-2 border-white dark:border-slate-900"
                title="Upload new photo"
              >
                <Camera size={13} />
              </button>
            )}

            {/* Remove photo button — only shown when an avatar is set */}
            {!uploading && !removing && avatarSrc && (
              <button
                type="button"
                onClick={() => void handleRemovePhoto()}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors border-2 border-white dark:border-slate-900"
                title="Remove photo"
              >
                <Trash2 size={11} />
              </button>
            )}

            {/* Removing spinner */}
            {removing && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                <svg className="animate-spin w-3 h-3 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white truncate">
              {currentUser.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Mail size={14} className="flex-shrink-0" />
              <span className="truncate">{currentUser.email}</span>
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Shield size={14} className="flex-shrink-0" />
              <span className="capitalize">{currentUser.role}</span>
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <CalendarClock size={14} className="flex-shrink-0" />
              Last login:{' '}
              {currentUser.lastLogin
                ? new Date(currentUser.lastLogin).toLocaleString()
                : 'Never'}
            </p>

            {/* Upload hint */}
            <p className="text-xs text-slate-400 dark:text-slate-500 pt-1">
              Click your avatar to change your profile picture · Max {MAX_FILE_SIZE_MB} MB
            </p>
          </div>
        </div>

        {/* Upload error banner */}
        {uploadError && (
          <div className="mt-4 flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800">
            <span className="flex-1">{uploadError}</span>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Upload progress */}
        {uploading && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-sm rounded-xl border border-blue-200 dark:border-blue-800">
            <svg className="animate-spin w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Uploading profile picture…
          </div>
        )}
      </div>

      {/* Company Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="text-blue-900 dark:text-blue-400" size={18} />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Company</h3>
        </div>

        {loadingCompany && (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading company details...</p>
        )}

        {!loadingCompany && companyError && (
          <p className="text-sm text-red-600 dark:text-red-400">{companyError}</p>
        )}

        {!loadingCompany && !companyError && !company && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No company is linked to this account yet.
          </p>
        )}

        {!loadingCompany && !companyError && company && (
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>
              <span className="font-semibold">Name:</span> {company.name}
            </p>
            <p>
              <span className="font-semibold">Industry:</span>{' '}
              {company.industry || 'Not set'}
            </p>
            <p>
              <span className="font-semibold">Logo URL:</span>{' '}
              {company.logoUrl || 'Not set'}
            </p>
            <p>
              <span className="font-semibold">Company ID:</span> {company.id}
            </p>
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
