import {
  createClient,
  type AuthChangeEvent,
  type Session,
} from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const isSupabaseConfigured = Boolean(url && anon);

if (!url || !anon) {
  console.warn(
    'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing; auth will not work until they are set.',
  );
}

const createNoopSupabaseClient = () => ({
  auth: {
    getSession: async () => ({
      data: { session: null },
      error: null,
    }),
    signInWithOAuth: async () => ({
      data: null,
      error: new Error('Supabase env is not configured.'),
    }),
    signInWithPassword: async () => ({
      data: null,
      error: new Error('Supabase env is not configured.'),
    }),
    signUp: async () => ({
      data: { session: null, user: null },
      error: new Error('Supabase env is not configured.'),
    }),
    signOut: async () => ({
      error: null,
    }),
    exchangeCodeForSession: async () => ({
      data: { session: null },
      error: new Error('Supabase env is not configured.'),
    }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => undefined,
        },
      },
    }),
  },
  storage: {
    from: () => ({
      upload: async () => ({
        data: null,
        error: new Error('Supabase env is not configured.'),
      }),
      remove: async () => ({
        data: null,
        error: new Error('Supabase env is not configured.'),
      }),
      getPublicUrl: () => ({
        data: { publicUrl: '' },
      }),
    }),
  },
});

export const supabase = isSupabaseConfigured
  ? createClient(url as string, anon as string, {
      auth: {
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        flowType: 'pkce',
      },
    })
  : (createNoopSupabaseClient() as any);

// NOTE: Access tokens are owned and refreshed by supabase-js; this module
// never stores or mutates them. Consumers should read
// `session.access_token` (or `useSession().accessToken`, which is trimmed)
// and send it as `Bearer <token>`. No trimming is applied here so the
// client behavior stays unchanged.

export type AuthStateCallback = (
  event: AuthChangeEvent,
  session: Session | null,
) => void;

/**
 * Subscribe to Supabase auth events. Returns an unsubscribe function.
 * Prefer this over calling `supabase.auth.onAuthStateChange` directly so listeners stay consistent.
 */
export function onAuthStateChange(callback: AuthStateCallback): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}
