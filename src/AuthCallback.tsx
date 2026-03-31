import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href);
        if (!cancelled) {
          window.location.href = "/";
        }
      } catch (err) {
        console.error("Auth callback failed", err);
        window.location.href = "/";
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading ? (
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800" />
      ) : null}
    </div>
  );
};

export default AuthCallback;
