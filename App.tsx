import React, { useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import {
  AppState,
  UserRole,
  TransactionType,
  Product,
  Transaction,
  User,
} from "./types";
import { api, API_BASE } from "./api";
import { supabase } from "./lib/supabase";
import { useSession } from "./features/auth/SessionProvider";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import StockOperations from "./components/StockOperations";
import LandingPage from "./components/LandingPage";
import ProductForm from "./components/ProductForm";
import Reports from "./components/Reports";
import UserManagement from "./components/UserManagement";
import Settings from "./components/Settings";
import CompanyOnboarding from "./components/CompanyOnboarding";
import AuthCallback from "./AuthCallback";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    const { error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthErr) {
      setError(oauthErr.message || "Google sign-in failed.");
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        const { error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name, name } },
        });
        if (signUpErr) throw signUpErr;
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setError("Check your email to confirm your account, then sign in.");
        }
      } else {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInErr) throw signInErr;
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : isSignUp
            ? "Sign up failed. Please try again."
            : "Invalid credentials. Please check your email and password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f8f6] transition-colors duration-300">
      <div className="hidden lg:flex w-[45%] bg-[#0f1729] relative items-center justify-center overflow-hidden p-8">
        <div className="relative w-full max-w-[500px] flex flex-col items-center">
          <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[450px]">
            <g stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M 40 380 L 460 380" strokeWidth="12" />
              <path d="M 60 180 L 140 180 M 60 280 L 140 280 M 80 180 L 80 380 M 120 180 L 120 380" />
              <rect x="70" y="240" width="40" height="40" rx="6" fill="#0f1729" />
              <rect x="85" y="150" width="45" height="30" rx="4" fill="#0f1729" />
              <g transform="translate(80, 80) rotate(-15)">
                <g style={{ animation: 'float 4s ease-in-out infinite' }}>
                  <path d="M 0 20 L 20 0 L 80 0 L 80 80 L 0 80 Z" fill="#0f1729" />
                  <circle cx="20" cy="25" r="6" fill="#0f1729" />
                  <path d="M 40 25 L 60 25 M 25 45 L 60 45 M 25 60 L 50 60" strokeWidth="6" />
                </g>
              </g>
              <g transform="translate(330, 80) rotate(15)">
                <g style={{ animation: 'float 5s ease-in-out infinite 0.5s' }}>
                  <path d="M 0 30 L 40 0 L 80 30 L 80 70 L 40 100 L 0 70 Z" fill="#0f1729" />
                  <path d="M 0 30 L 40 60 L 80 30" />
                  <path d="M 40 60 L 40 100" />
                </g>
              </g>
              <g transform="translate(360, 240) rotate(-10)">
                <g style={{ animation: 'float 6s ease-in-out infinite 1s' }}>
                  <rect x="0" y="0" width="60" height="90" rx="8" fill="#0f1729" />
                  <path d="M 15 25 L 45 25 M 15 45 L 45 45 M 15 65 L 35 65" strokeWidth="6" />
                  <path d="M 20 0 L 40 0" strokeWidth="10" />
                </g>
              </g>
              <g transform="translate(250, 380)">
                <path d="M -30 0 L -40 -100 M 30 0 L 40 -100" />
                <path d="M -50 0 L -10 0 M 10 0 L 50 0" strokeWidth="12" />
                <path d="M -60 -100 C -70 -220, 70 -220, 60 -100 Z" fill="#0f1729" />
                <path d="M -40 -200 L -40 -100 M 40 -200 L 40 -100" strokeWidth="6" strokeDasharray="12 12" />
                <circle cx="0" cy="-260" r="45" fill="#0f1729" />
                <path d="M -15 -270 Q -10 -280 -5 -270 M 15 -270 Q 10 -280 5 -270" strokeWidth="6" strokeLinecap="round" />
                <path d="M -15 -245 Q 0 -225 15 -245" strokeWidth="6" strokeLinecap="round" />
                <path d="M -45 -270 C -45 -320, 45 -320, 45 -270 Z" fill="#0f1729" />
                <path d="M 30 -275 L 70 -265" strokeWidth="10" />
                <g transform="translate(-50, -180)">
                  <rect x="0" y="0" width="100" height="90" rx="10" fill="#0f1729" />
                  <path d="M 0 45 L 100 45" strokeWidth="6" strokeDasharray="15 10" />
                  <path d="M 30 15 L 70 15 M 30 75 L 50 75" strokeWidth="6" />
                  <rect x="70" y="60" width="20" height="20" rx="4" fill="white" stroke="none" />
                </g>
                <path d="M -55 -200 C -90 -160, -80 -110, -30 -110" fill="none" />
                <path d="M 55 -200 C 90 -160, 80 -110, 30 -110" fill="none" />
                <circle cx="-30" cy="-110" r="12" fill="#0f1729" />
                <circle cx="30" cy="-110" r="12" fill="#0f1729" />
              </g>
              <path d="M 100 120 L 130 140 M 400 140 L 370 120 M 160 70 L 170 40 M 340 40 L 350 70" strokeWidth="6" strokeLinecap="round" />
            </g>
          </svg>
          <p className="mt-8 text-white font-serif italic text-xl tracking-wide font-medium opacity-90 drop-shadow-sm text-center">
            Every item. Every count. In control.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10 bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-md w-full space-y-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[#0f1729] text-white rounded-xl flex items-center justify-center font-bold text-xl italic">S</div>
            <span className="font-bold text-xl text-[#0f1729]">StockPulse</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#0f1729] tracking-tight">{isSignUp ? 'Create an account' : 'Welcome back'}</h1>
            <p className="text-[#0f1729] opacity-60 mt-3 italic font-serif text-lg">{isSignUp ? 'Sign up to manage your inventory' : 'Sign in to manage your inventory'}</p>
          </div>
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
              {error}
            </div>
          )}
          <form onSubmit={handleAuth} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0f1729]">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-transparent focus:border-[#0f1729] focus:ring-1 focus:ring-[#0f1729] outline-none transition-all text-[#0f1729] placeholder:text-slate-400"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0f1729]">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-transparent focus:border-[#0f1729] focus:ring-1 focus:ring-[#0f1729] outline-none transition-all text-[#0f1729] placeholder:text-slate-400"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0f1729]">Password</label>
              <input
                type="password"
                required
                className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-transparent focus:border-[#0f1729] focus:ring-1 focus:ring-[#0f1729] outline-none transition-all text-[#0f1729] placeholder:text-slate-400"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isSignUp && (
              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0f1729] focus:ring-[#0f1729]" />
                  <span className="text-[#0f1729] opacity-70">Remember me</span>
                </label>
                <a href="#" className="text-[#3b4fd8] hover:text-[#2a3bb8] font-medium transition-colors">Forgot password?</a>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              ref={buttonRef}
              className="w-full bg-[#0f1729] text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 disabled:opacity-50 mt-4 hover:bg-[#1a243d] hover:scale-[1.03] active:scale-95 transition-all"
            >
              {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
              {!loading && <span>→</span>}
            </button>
          </form>
          <button
            type="button"
            disabled={loading}
            onClick={() => void handleGoogle()}
            className="w-full mt-4 py-3.5 rounded-full border-2 border-slate-200 text-[#0f1729] font-semibold hover:bg-slate-50 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50"
          >
            Continue with Google
          </button>
          <div className="pt-8 text-center border-t border-slate-100">
            <p className="text-sm text-[#0f1729] opacity-60">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#3b4fd8] font-medium hover:text-[#2a3bb8] transition-colors bg-transparent border-none cursor-pointer"
              >
                {isSignUp ? "Sign In" : "Create one"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StockPulseLoader: React.FC = () => {
  const phrasesRef = React.useRef(['Syncing your inventory...', 'Connecting to your workspace...', 'Loading your dashboard...', 'Almost there...']);
  const tagRef = React.useRef<HTMLDivElement>(null);
  const piRef = React.useRef(0);

  React.useEffect(() => {
    const tel = tagRef.current;
    if (!tel) return;
    const interval = setInterval(() => {
      tel.style.opacity = '0';
      tel.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        piRef.current = (piRef.current + 1) % phrasesRef.current.length;
        if (!tel) return;
        tel.textContent = phrasesRef.current[piRef.current];
        tel.style.transition = 'none';
        tel.style.transform = 'translateY(6px)';
        tel.style.opacity = '0';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          tel.style.transition = 'opacity 0.38s ease,transform 0.38s ease';
          tel.style.opacity = '1';
          tel.style.transform = 'translateY(0)';
        }));
      }, 380);
    }, 2900);
    return () => clearInterval(interval);
  }, []);

  const lFRef = React.useRef<SVGPathElement>(null);
  const lBRef = React.useRef<SVGPathElement>(null);
  const bGRef = React.useRef<SVGGElement>(null);
  const rafRef = React.useRef<number>(0);

  React.useEffect(() => {
    const HX = 20, HY = 34, TL = 13, CL = 11, FL = 4.5, MX = 26, CMS = 980;
    function getLeg(phase: number) {
      const a = Math.sin(phase * Math.PI * 2);
      const tDeg = a * MX;
      const lift = Math.max(0, Math.cos(phase * Math.PI * 2)) * 15;
      const cDeg = tDeg * 0.62 - 5 - lift;
      const tR = tDeg * Math.PI / 180, cR = cDeg * Math.PI / 180;
      const kx = HX + Math.sin(tR) * TL, ky = HY + Math.cos(tR) * TL;
      const fx = kx + Math.sin(cR) * CL, fy = ky + Math.cos(cR) * CL;
      const fex = fx + FL, fey = fy + 1;
      return { kx, ky, fx, fy, fex, fey };
    }
    function mkP(l: ReturnType<typeof getLeg>) {
      return `M${HX} ${HY} L${l.kx.toFixed(1)} ${l.ky.toFixed(1)} L${l.fx.toFixed(1)} ${l.fy.toFixed(1)} L${l.fex.toFixed(1)} ${l.fey.toFixed(1)}`;
    }
    let t0: number | null = null;
    function frame(ts: number) {
      if (!t0) t0 = ts;
      const ph = ((ts - t0) % CMS) / CMS;
      const lA = getLeg(ph), lBl = getLeg((ph + 0.5) % 1);
      if (lFRef.current) lFRef.current.setAttribute('d', mkP(lA));
      if (lBRef.current) lBRef.current.setAttribute('d', mkP(lBl));
      if (bGRef.current) bGRef.current.style.transform = `translateY(${(-Math.cos(ph * Math.PI * 4) * 1.8).toFixed(2)}px)`;
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0b1323', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '2.5rem 1.5rem' }}>
      <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(80px)', top: -80, left: -60, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'rgba(59,130,246,0.07)', filter: 'blur(70px)', bottom: -50, right: -30, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 540, background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 28, padding: '3rem 2.5rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#f1f5f9', fontSize: 26, fontWeight: 700, letterSpacing: '-0.4px' }}>
          <div style={{ width: 34, height: 34, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0b1323', fontWeight: 900, fontStyle: 'italic', fontSize: 17 }}>S</div>
          StockPulse
        </div>
        <div ref={tagRef} style={{ fontSize: 15, color: 'rgba(148,163,184,0.85)', minHeight: 22, transition: 'opacity 0.35s ease,transform 0.35s ease' }}>
          Syncing your inventory...
        </div>
        <div style={{ width: '78%', position: 'relative', paddingTop: 84 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 78, overflow: 'visible' }}>
            <div style={{ position: 'absolute', top: 0, width: 96, height: 78, animation: 'spM 9s cubic-bezier(0.2,0,0.8,1) infinite' }}>
              <svg viewBox="0 0 96 74" width="96" height="74" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path ref={lBRef} stroke="rgba(130,150,180,0.5)" strokeWidth="1.65" fill="none" />
                <g stroke="rgba(148,163,184,0.72)" strokeWidth="1.6">
                  <rect x="42" y="24" width="38" height="20" rx="2" />
                  <rect x="48" y="12" width="26" height="13" rx="1.5" />
                  <line x1="48" y1="18.5" x2="74" y2="18.5" strokeWidth="1" />
                  <circle cx="50" cy="46" r="4" />
                  <circle cx="72" cy="46" r="4" />
                  <path d="M42 30 C37 30 34 32 31 33" fill="none" />
                </g>
                <g ref={bGRef} stroke="rgba(226,232,240,0.92)" strokeWidth="1.8">
                  <circle cx="20" cy="9" r="5.5" />
                  <path d="M14 7.5 L26 7.5" strokeWidth="1.5" />
                  <path d="M15.5 7.5 L17 3 L23 3 L24.5 7.5" />
                  <line x1="20" y1="15" x2="21" y2="34" />
                  <path d="M20 22 L31 30" fill="none" />
                  <path d="M20 26 L31 33" fill="none" />
                </g>
                <path ref={lFRef} stroke="rgba(226,232,240,0.9)" strokeWidth="1.8" fill="none" />
              </svg>
            </div>
          </div>
          <div style={{ height: 10, width: '100%', background: 'rgba(15,23,42,0.9)', borderRadius: 99, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#4f46e5,#818cf8)', borderRadius: 99, boxShadow: '0 0 18px rgba(99,102,241,0.65)', animation: 'spF 9s cubic-bezier(0.2,0,0.8,1) infinite' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 0.23, 0.46].map((delay, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(99,102,241,0.4)', animation: `spD 1.4s ease-in-out ${delay}s infinite` }} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes spM { 0%{left:0} 74%{left:calc(100% - 96px)} 100%{left:calc(100% - 96px)} }
        @keyframes spF { 0%{width:0} 74%{width:100%} 100%{width:100%} }
        @keyframes spD { 0%,100%{background:rgba(99,102,241,0.28);transform:scale(1)} 50%{background:rgba(99,102,241,0.9);transform:scale(1.32)} }
      `}</style>
    </div>
  );
};

type NotificationItem = {
  id: string;
  message: string;
  read: boolean;
  type: "warning" | "info" | "success";
};

// Protected route wrapper
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  authReady: boolean;
  hasSession: boolean;
  currentUser: User | null;
  activePage: string;
  setActivePage: (p: string) => void;
  onLogout: () => void;
  isOffline: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notifications: NotificationItem[];
  markAllRead: () => void;
}> = ({ children, authReady, hasSession, currentUser, ...layoutProps }) => {
  if (!authReady || (authReady && hasSession && !currentUser)) {
    return <StockPulseLoader />;
  }
  if (!hasSession) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser && !currentUser.companyId) {
    return <Navigate to="/onboarding" replace />;
  }
  return (
    <Layout {...layoutProps} currentUser={currentUser}>
      {children}
    </Layout>
  );
};

const App: React.FC = () => {
  const { isReady: authReady, accessToken } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasSession, setHasSession] = useState(false);
  const [state, setState] = useState<AppState>({
    currentUser: null,
    products: [],
    transactions: [],
    users: [],
    isOffline: !navigator.onLine,
  });
  const [showToast, setShowToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null | undefined>(undefined);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("stockpulse_theme") as "light" | "dark") || "light";
  });

  const activePage = location.pathname.replace('/', '') || 'dashboard';
  const setActivePage = (page: string) => navigate('/' + page);

  useEffect(() => {
    let active = true;
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      setHasSession(Boolean(session));
    };
    void checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setHasSession(Boolean(session));
      if (event === "SIGNED_OUT") {
        setState((prev) => ({ ...prev, currentUser: null }));
      }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const syncUserFromApi = useCallback(async (token: string | undefined, currentPath?: string) => {
    if (!token) {
      setState((prev) => ({ ...prev, currentUser: null }));
      setHasSession(false);
      return;
    }
    setHasSession(true);
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          await supabase.auth.signOut();
          setHasSession(false);
          navigate('/login');
        }
        setState((prev) => ({ ...prev, currentUser: null }));
        return;
      }
      const body = await res.json();
      const user = body.user as User | undefined;
      if (!user) {
        setState((prev) => ({ ...prev, currentUser: null }));
        return;
      }
      setState((prev) => ({ ...prev, currentUser: user }));
      // Only redirect if currently at root or login
      const path = currentPath ?? window.location.pathname;
      if (path === '/' || path === '/login') {
        navigate(user.companyId ? '/dashboard' : '/onboarding');
      }
    } catch {
      setState((prev) => ({ ...prev, currentUser: null }));
      setHasSession(false);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!authReady) return;
    void syncUserFromApi(accessToken, window.location.pathname);
  }, [authReady, accessToken, syncUserFromApi]);

  useEffect(() => {
    if (!authReady) return;
    setHasSession(Boolean(accessToken));
  }, [authReady, accessToken]);

  const fetchData = useCallback(async () => {
    if (!state.currentUser || !state.currentUser.companyId) return;
    try {
      const promises: Promise<unknown>[] = [
        api.products.getAll(),
        api.transactions.getAll(),
      ];
      if (state.currentUser.role === UserRole.ADMIN) {
        promises.push(api.users.getAll());
      }
      const data = await Promise.all(promises);
      const productsData = data[0] as Product[];
      const transactionsData = data[1] as Transaction[];
      const usersData = data[2] as User[] | undefined;

      setState((prev) => ({
        ...prev,
        products: productsData,
        transactions: transactionsData,
        ...(usersData && { users: usersData }),
      }));

      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const lowStock = productsData
          .filter((p) => p.quantity < p.reorderLevel)
          .filter((p) => !existingIds.has(p.id))
          .map((p) => ({
            id: p.id,
            message: `${p.name} is running low (${p.quantity} left)`,
            read: false,
            type: "warning" as const,
          }));
        if (lowStock.length === 0) return prev;
        return [...prev, ...lowStock];
      });
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  }, [state.currentUser]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("stockpulse_theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleOnline = () => setState((prev) => ({ ...prev, isOffline: false }));
    const handleOffline = () => setState((prev) => ({ ...prev, isOffline: true }));
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setHasSession(false);
    setState((prev) => ({ ...prev, currentUser: null }));
    navigate('/');
  };

  const notify = (message: string, type: "success" | "error" = "success") => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleAddTransaction = async (tx: Partial<Transaction>) => {
    try {
      await api.transactions.create(tx);
      await fetchData();
      notify(`${tx.type === TransactionType.STOCK_IN ? "Added" : "Removed"} ${tx.quantity} units of ${tx.productName}`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to process transaction";
      notify(message, "error");
    }
  };

  const handleSaveProduct = async (p: Partial<Product>) => {
    try {
      if (editingProduct) {
        await api.products.update(editingProduct.id, p);
        notify("Product updated successfully");
      } else {
        await api.products.create(p);
        notify("Product added to inventory");
      }
      await fetchData();
      setEditingProduct(undefined);
    } catch {
      notify("Failed to save product", "error");
    }
  };

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const protectedProps = {
    authReady,
    hasSession,
    currentUser: state.currentUser,
    activePage,
    setActivePage,
    onLogout: handleLogout,
    isOffline: state.isOffline,
    theme,
    toggleTheme,
    notifications,
    markAllRead,
  };

  if (!authReady) return <StockPulseLoader />;

  return (
    <>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<LandingPage onLogin={() => navigate('/login')} />} />
        <Route path="/login" element={
          hasSession && state.currentUser
            ? <Navigate to="/dashboard" replace />
            : <Login />
        } />
        <Route path="/onboarding" element={
          hasSession && !state.currentUser
            ? <StockPulseLoader />
            : !hasSession
              ? <Navigate to="/login" replace />
              : state.currentUser
                ? <CompanyOnboarding
                    currentUser={state.currentUser}
                    onComplete={async (company) => {
                      await api.companies.create(company);
                      await syncUserFromApi(accessToken, '/onboarding');
                      navigate('/dashboard');
                    }}
                  />
                : <StockPulseLoader />
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute {...protectedProps}>
            <Dashboard
              products={state.products}
              transactions={state.transactions}
              currentUser={state.currentUser}
              onFilterLowStock={() => navigate('/inventory')}
              onViewTransactions={() => navigate('/reports')}
            />
          </ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute {...protectedProps}>
            <Inventory
              products={state.products}
              currentUser={state.currentUser}
              onAddProduct={() => setEditingProduct(null)}
              onEditProduct={(p) => setEditingProduct(p)}
              onDeleteProduct={async (id) => {
                if (confirm("Are you sure you want to delete this product?")) {
                  try {
                    await api.products.delete(id);
                    await fetchData();
                    notify("Product deleted");
                  } catch {
                    notify("Failed to delete product", "error");
                  }
                }
              }}
            />
          </ProtectedRoute>
        } />
        <Route path="/stock-in" element={
          <ProtectedRoute {...protectedProps}>
            <StockOperations
              type={TransactionType.STOCK_IN}
              products={state.products}
              currentUser={state.currentUser}
              onSubmit={handleAddTransaction}
              onCancel={() => navigate('/dashboard')}
            />
          </ProtectedRoute>
        } />
        <Route path="/stock-out" element={
          <ProtectedRoute {...protectedProps}>
            <StockOperations
              type={TransactionType.STOCK_OUT}
              products={state.products}
              currentUser={state.currentUser}
              onSubmit={handleAddTransaction}
              onCancel={() => navigate('/dashboard')}
            />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute {...protectedProps}>
            <Reports
              products={state.products}
              transactions={state.transactions}
              currentUser={state.currentUser}
            />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute {...protectedProps}>
            <UserManagement
              users={state.users}
              onAddUser={async (user) => {
                try { await api.users.create(user); await fetchData(); notify("User created successfully"); }
                catch { notify("Failed to create user", "error"); }
              }}
              onUpdateUser={async (user) => {
                try { await api.users.update(user.id, user); await fetchData(); notify("User updated successfully"); }
                catch { notify("Failed to update user", "error"); }
              }}
              onDeleteUser={async (id) => {
                if (confirm("Are you sure you want to delete this user?")) {
                  try { await api.users.delete(id); await fetchData(); notify("User deleted"); }
                  catch { notify("Failed to delete user", "error"); }
                }
              }}
            />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute {...protectedProps}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global overlays — render once outside Routes so they persist across navigation */}
      {editingProduct !== undefined && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => setEditingProduct(undefined)}
          existingProducts={state.products}
          isAdmin={state.currentUser?.role === UserRole.ADMIN}
        />
      )}
      {showToast && (
        <div className={`fixed top-6 right-6 z-[60] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-[slideIn_0.3s_ease-out] ${showToast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            {showToast.type === "success" ? "✓" : "!"}
          </div>
          <span className="font-semibold">{showToast.message}</span>
        </div>
      )}
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </>
  );
};

export default App;
