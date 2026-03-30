import {
  createClient,
  type AuthChangeEvent,
  type Session,
} from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anon) {
  console.warn(
    'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing; auth will not work until they are set.',
  );
}

export const supabase = createClient(url ?? '', anon ?? '');

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
