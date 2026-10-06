import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { onAuthStateChange, supabase } from '../../lib/supabase';

type SessionContextValue = {
  session: Session | null;
  accessToken: string | undefined;
  isReady: boolean;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const {
          data: { session: initial },
        } = await supabase.auth.getSession();
        if (!cancelled) {
          setSession(initial);
        }
      } catch (err) {
        console.error('Failed to initialize Supabase session', err);
        if (!cancelled) {
          setSession(null);
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    })();

    const unsubscribe = onAuthStateChange((_event, next) => {
      if (!cancelled) setSession(next);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const value = useMemo<SessionContextValue>(
    () => {
      // No behavior change: supabase-js tokens carry no whitespace. Trim
      // defensively and normalize empty strings to undefined so consumers
      // never send `Bearer ` / `Bearer undefined`.
      const raw = session?.access_token;
      const trimmed = raw?.trim();
      return {
        session,
        accessToken: trimmed ? trimmed : undefined,
        isReady,
      };
    },
    [session, isReady],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return ctx;
}
