import { useEffect } from "react";
import { supabase } from "./lib/supabase";

const AuthCallback = () => {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href);
        window.location.href = "/";
      } catch {
        window.location.href = "/";
      }
    };
    void handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f6]">
      <p className="text-[#0f1729] font-medium">Signing you in…</p>
    </div>
  );
};

export default AuthCallback;