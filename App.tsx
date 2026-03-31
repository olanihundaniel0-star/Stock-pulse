import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  AppState,
  UserRole,
  TransactionType,
  Product,
  Transaction,
  User,
} from "./types";
import { api } from "./api";
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
import AuthCallback from "./AuthCallback";

// Simple Auth Screen
const MainIllustration = () => (
  <svg width="400" height="320" viewBox="0 0 400 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white w-full h-auto opacity-90 drop-shadow-2xl">
    <g stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Floating Elements (Boxes & Tags) */}
      <g strokeWidth="4">
        {/* Floating Box 1 */}
        <path d="M 280 40 L 300 35 L 310 45 L 290 50 Z" fill="white" />
        <path d="M 280 40 L 285 30 L 305 25 L 300 35" fill="white" />
        <path d="M 305 25 L 315 35 L 310 45 L 300 35 Z" fill="white" />
        
        {/* Floating Tag 1 */}
        <path d="M 360 130 L 375 115 L 385 125 L 370 140 Z" fill="white" />
        <path d="M 365 125 L 375 120" strokeWidth="2.5" />
        <circle cx="370" cy="120" r="1.5" fill="#1e3a8a" stroke="none" />
        
        {/* Floating Tag 2 */}
        <path d="M 50 110 L 70 100 L 80 115 L 60 125 Z" fill="white" />
        <path d="M 55 115 L 65 110" strokeWidth="2.5" />
      </g>

      {/* Warehouse Manager Character */}
      {/* Back arm sleeve (Solid depth fill) */}
      <path d="M 90 200 C 60 210, 50 260, 80 290" fill="transparent" />
      <path d="M 85 240 C 120 255, 140 230, 160 180 Z" fill="currentColor" />
      
      {/* Torso/Apron Outline */}
      <path d="M 120 140 C 80 150, 90 220, 110 290 L 220 290 C 235 220, 230 160, 180 140" fill="#1e3a8a" stroke="none" />
      <path d="M 120 140 C 80 150, 90 220, 110 290 L 220 290 C 235 220, 230 160, 180 140 Z" fill="transparent" />

      {/* Collar lines */}
      <path d="M 120 140 C 140 155, 165 150, 180 140" fill="transparent" />
      <path d="M 145 150 L 140 180 M 150 170 L 160 175" strokeWidth="3" fill="transparent" />

      {/* Squiggly fabric fold lines */}
      <path d="M 115 180 C 130 185, 140 175, 145 185" strokeWidth="4" fill="transparent" />
      <path d="M 195 210 C 180 220, 185 230, 175 235" strokeWidth="4" fill="transparent" />

      {/* Head and Hat */}
      <path d="M 135 145 C 130 110, 160 100, 180 120 C 170 145, 150 148, 135 145 Z" fill="#1e3a8a" />
      <path d="M 140 145 C 130 110, 160 100, 180 120" />
      <path d="M 110 90 C 140 75, 170 70, 200 80" fill="#1e3a8a" />
      <path d="M 110 90 C 140 75, 170 70, 200 80" />
      {/* Hat top (Solid Fill) */}
      <path d="M 130 85 C 130 55, 170 50, 180 75 Z" fill="currentColor" stroke="none" />
      <path d="M 130 85 C 130 55, 170 50, 180 75" />

      {/* Face Features */}
      {/* Nose */}
      <path d="M 175 100 C 182 100, 185 105, 178 110" strokeWidth="4" fill="transparent" />
      {/* Eye dot */}
      <circle cx="160" cy="95" r="4" fill="currentColor" stroke="none" />
      {/* Mustache (Solid Fill) */}
      <path d="M 165 110 C 180 105, 195 112, 195 120 C 180 122, 170 120, 165 115 Z" fill="currentColor" stroke="none" />

      {/* Hand 1 (Holding Clipboard) */}
      <path d="M 160 180 C 190 210, 220 180, 235 160" fill="currentColor" strokeLinejoin="round" />
      <path d="M 230 165 C 245 160, 255 170, 245 180 C 235 185, 230 180, 225 170" fill="#1e3a8a" />

      {/* Clipboard */}
      <path d="M 230 170 L 265 95 L 325 120 L 290 195 Z" fill="#1e3a8a" strokeLinejoin="miter" />
      <path d="M 235 170 L 270 100 L 315 120" />
      <path d="M 270 95 C 280 90, 290 95, 285 105" fill="currentColor" strokeLinejoin="round" />
      {/* Clipboard Notes (loose squiggles) */}
      <path d="M 265 125 L 290 135 M 260 140 L 285 150 M 275 150 L 280 160 M 255 155 L 270 160" strokeWidth="3.5" fill="transparent" />

      {/* Arm 2 (Front Arm across) */}
      <path d="M 205 230 C 240 250, 270 240, 290 200" fill="currentColor" />
      <path d="M 280 210 C 295 210, 310 190, 295 185 C 285 185, 275 195, 285 205" fill="#1e3a8a" />

      {/* Foreground Box/Shelf */}
      {/* Front Face (Solid bright white fill to match the dark box in the reference) */}
      <path d="M 120 290 L 310 290 L 310 360 L 120 360 Z" fill="currentColor" />
      
      {/* Woodgrain details inside the pure white box - drawn in background navy blue */}
      <path d="M 120 305 C 180 295, 230 335, 310 305 M 120 350 C 200 365, 260 325, 310 340" stroke="#1e3a8a" strokeWidth="4.5" fill="transparent" />
      <path d="M 200 320 C 230 315, 250 335, 280 315" stroke="#1e3a8a" strokeWidth="4.5" fill="transparent" />

      {/* Secondary Shelf Element / Rack */}
      <path d="M 310 290 L 380 290 L 380 360 L 310 360 Z" fill="#1e3a8a" strokeLinejoin="miter" />
      {/* Handle cutout */}
      <path d="M 330 300 L 360 300 M 330 320 L 360 320 M 345 300 L 345 320" strokeWidth="3.5" fill="transparent" />
      <path d="M 335 340 C 335 355, 355 355, 355 340 Z" fill="currentColor" stroke="none" />
    </g>
  </svg>
);

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [magneticPull, setMagneticPull] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isScattered, setIsScattered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    setMagneticPull({ x: deltaX, y: deltaY });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setMagneticPull({ x: 0, y: 0 });
    setIsHovering(false);
  };

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
    setIsScattered(true);
    setTimeout(() => setIsScattered(false), 600);

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
          setError(
            "Check your email to confirm your account, then sign in.",
          );
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

  const floatingObjects = [
    {
      id: 1,
      content: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 22 20 2 20" /></svg>,
      className: 'text-white opacity-20 w-6 h-6',
      top: '15%', left: '10%', factor: 0.04, scatterX: -50, scatterY: -60
    },
    {
      id: 2,
      content: <div className="w-2 h-2 rounded-full border border-white opacity-30" />,
      className: '',
      top: '25%', left: '85%', factor: 0.06, scatterX: 60, scatterY: -20
    },
    {
      id: 3,
      content: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="2" width="12" height="20" rx="2" ry="2" /><line x1="10" y1="6" x2="14" y2="6" /><line x1="10" y1="10" x2="14" y2="10" /></svg>,
      className: 'text-white opacity-20 w-6 h-6',
      top: '75%', left: '15%', factor: 0.05, scatterX: -40, scatterY: 50
    },
    {
      id: 4,
      content: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="6" y1="4" x2="6" y2="20" /><line x1="10" y1="4" x2="10" y2="20" /><line x1="14" y1="4" x2="14" y2="20" /><line x1="18" y1="4" x2="18" y2="20" /></svg>,
      className: 'text-white opacity-20 w-6 h-6',
      top: '80%', left: '80%', factor: 0.07, scatterX: 50, scatterY: 50
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8f8f6] transition-colors duration-300">
      {/* Left Pane - Illustration */}
      <div className="hidden lg:flex w-[45%] bg-white relative items-center justify-center overflow-hidden p-8">
        {/* Image wrapper to contain the illustration and absolute overlay boxes */}
        <div className="relative w-full max-w-[500px] flex flex-col items-center">
          <div className="relative w-full">
            <img 
              src="/theme-illustration.jpg" 
              alt="Inventory Manager" 
              className="w-full h-auto object-contain"
            />
            
            {/* Box 1: Small package icon (Top Left) */}
            <div 
              className="absolute pointer-events-none" 
              style={{ top: '13%', left: '15.5%', width: '12%', height: '12%', animation: 'float 3s ease-in-out infinite' }}
            >
              {/* Opaque SVG to hide the underlying box */}
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#1e40af" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="white">
                  <path d="M 50 15 L 85 30 L 50 45 L 15 30 Z" />
                  <path d="M 15 30 L 15 65 L 50 80 L 50 45" />
                  <path d="M 85 30 L 85 65 L 50 80 L 50 45" />
                  <path d="M 33 22 L 67 37 M 15 30 L 50 45 L 85 30" strokeWidth="3" />
                  <path d="M 65 60 C 70 65, 75 60, 70 55" strokeWidth="3" fill="transparent" />{/* Mock Arrow */}
                </g>
              </svg>
            </div>

            {/* Box 2: Package icon (Mid Left) */}
            <div 
              className="absolute pointer-events-none" 
              style={{ top: '30%', left: '8%', width: '13%', height: '13%', animation: 'float 4s ease-in-out infinite 0.5s' }}
            >
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#1e40af" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="white">
                  <path d="M 50 20 L 80 32 L 50 45 L 20 32 Z" />
                  <path d="M 20 32 L 20 65 L 50 78 L 50 45" />
                  <path d="M 80 32 L 80 65 L 50 78 L 50 45" />
                  <path d="M 35 26 L 65 39 M 20 32 L 50 45 L 80 32" strokeWidth="3" />
                  {/* Mock Label */}
                  <path d="M 60 50 L 70 55 L 70 65 L 60 60 Z" fill="transparent" />
                  <line x1="62" y1="54" x2="68" y2="57" strokeWidth="2" />
                  <line x1="62" y1="58" x2="68" y2="61" strokeWidth="2" />
                </g>
              </svg>
            </div>

            {/* Box 3: Up Arrow Box Icon (Bottom Left) */}
            <div 
              className="absolute pointer-events-none" 
              style={{ top: '76%', left: '2%', width: '14%', height: '14%', animation: 'float 5s ease-in-out infinite 1s' }}
            >
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#1e40af" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="white">
                  <rect x="20" y="20" width="60" height="60" rx="4" transform="rotate(-15 50 50)" />
                  <g transform="rotate(-15 50 50)">
                    <path d="M 40 60 L 40 40 M 35 45 L 40 40 L 45 45" strokeWidth="4" />
                    <path d="M 60 60 L 60 40 M 55 45 L 60 40 L 65 45" strokeWidth="4" />
                  </g>
                </g>
              </svg>
            </div>
            
            {/* Box 4: Barcode Tag (Top Middle) */}
            <div 
              className="absolute pointer-events-none" 
              style={{ top: '7.5%', left: '42%', width: '18%', height: '18%', animation: 'float 6s ease-in-out infinite 0.2s' }}
            >
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#1e40af" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="white">
                  {/* String */}
                  <path d="M 38 38 C 30 20, 10 10, 15 30 C 20 50, 40 60, 40 40" strokeWidth="3" fill="transparent" />
                  {/* Tag Body */}
                  <path d="M 45 25 L 75 55 L 55 75 L 25 45 L 30 30 Z" />
                  {/* Hole */}
                  <circle cx="35" cy="40" r="3" fill="#1e40af" stroke="none" />
                  {/* Barcode lines */}
                  <path d="M 45 40 L 60 55" strokeWidth="3" fill="transparent"/>
                  <path d="M 50 37 L 65 52" strokeWidth="4" fill="transparent"/>
                  <path d="M 55 34 L 70 49" strokeWidth="2" fill="transparent"/>
                  <path d="M 60 31 L 75 46" strokeWidth="3" fill="transparent"/>
                </g>
              </svg>
            </div>
          </div>
          
          <p className="mt-8 text-[#0f1729] font-serif italic text-xl tracking-wide font-medium opacity-90 drop-shadow-sm">
            Every item. Every count. In control.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10 bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-md w-full space-y-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[#0f1729] text-white rounded-xl flex items-center justify-center font-bold text-xl italic">S</div>
            <span className="font-bold text-xl text-[#0f1729]">StockPulse</span>
          </div>

          {/* Headings */}
          <div>
            <h1 className="text-4xl font-bold text-[#0f1729] tracking-tight">{isSignUp ? 'Create an account' : 'Welcome back'}</h1>
            <p className="text-[#0f1729] opacity-60 mt-3 italic font-serif text-lg">{isSignUp ? 'Sign up to manage your inventory' : 'Sign in to manage your inventory'}</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
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
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full bg-[#0f1729] text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 btn-hover-effect disabled:opacity-50 mt-4 hover:bg-[#1a243d] transition-colors"
            >
              {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
              {!loading && <span className="arrow-icon">→</span>}
            </button>
          </form>

          <button
            type="button"
            disabled={loading}
            onClick={() => void handleGoogle()}
            className="w-full mt-4 py-3.5 rounded-full border-2 border-slate-200 text-[#0f1729] font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
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

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const App: React.FC = () => {
  const { isReady: authReady, accessToken } = useSession();
  const [state, setState] = useState<AppState>({
    currentUser: null,
    products: [],
    transactions: [],
    users: [],
    isOffline: !navigator.onLine,
  });
  const [activePage, setActivePage] = useState("landing");
  const [showToast, setShowToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [editingProduct, setEditingProduct] = useState<
    Product | null | undefined
  >(undefined);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (
      (localStorage.getItem("stockpulse_theme") as "light" | "dark") || "light"
    );
  });

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (active && session) {
        setActivePage("dashboard");
      }
    };

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setActivePage("dashboard");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const syncUserFromApi = useCallback(async (accessToken: string | undefined) => {
    if (!accessToken) {
      setState((prev) => ({ ...prev, currentUser: null }));
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 401 || res.status === 403) {
        await supabase.auth.signOut();
        setState((prev) => ({ ...prev, currentUser: null }));
        setActivePage("login");
        return;
      }
      if (!res.ok) return;
      const body = await res.json();
      const user = body.user as User;
      setState((prev) => ({ ...prev, currentUser: user }));
      setActivePage((p) => (p === "landing" || p === "login" ? "dashboard" : p));
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    if (!authReady) return;
    void syncUserFromApi(accessToken);
  }, [authReady, accessToken, syncUserFromApi]);

  const fetchData = useCallback(async () => {
    if (!state.currentUser) return;
    try {
      const promises: Promise<unknown>[] = [
        api.products.getAll(),
        api.transactions.getAll(),
      ];
      if (state.currentUser.role === UserRole.ADMIN) {
        promises.push(api.users.getAll());
      }
      const data = await Promise.all(promises);
      setState((prev) => ({
        ...prev,
        products: data[0] as Product[],
        transactions: data[1] as Transaction[],
        ...(data[2] && { users: data[2] as User[] }),
      }));
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  }, [state.currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("stockpulse_theme", theme);
  }, [theme]);

  // Network listener
  useEffect(() => {
    const handleOnline = () =>
      setState((prev) => ({ ...prev, isOffline: false }));
    const handleOffline = () =>
      setState((prev) => ({ ...prev, isOffline: true }));
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setState((prev) => ({ ...prev, currentUser: null }));
    setActivePage("landing");
  };

  const notify = (message: string, type: "success" | "error" = "success") => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleAddTransaction = async (tx: Partial<Transaction>) => {
    try {
      await api.transactions.create(tx);
      await fetchData();
      notify(
        `${tx.type === TransactionType.STOCK_IN ? "Added" : "Removed"} ${tx.quantity} units of ${tx.productName}`,
      );
      setActivePage("dashboard");
    } catch (err) {
      notify("Failed to process transaction", "error");
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
    } catch (err) {
      notify("Failed to save product", "error");
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  if (window.location.pathname === "/auth/callback") {
    return <AuthCallback />;
  }

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f6] text-[#0f1729]">
        <p className="font-medium">Loading…</p>
      </div>
    );
  }
  if (activePage === "landing")
    return <LandingPage onLogin={() => setActivePage("login")} />;
  if (activePage === "login") return <Login />;
  if (!state.currentUser) return <Login />;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <Dashboard
            products={state.products}
            transactions={state.transactions}
            currentUser={state.currentUser}
            onFilterLowStock={() => setActivePage("inventory")}
          />
        );
      case "inventory":
        return (
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
                } catch (err) {
                  notify("Failed to delete product", "error");
                }
              }
            }}
          />
        );
      case "stock-in":
        return (
          <StockOperations
            type={TransactionType.STOCK_IN}
            products={state.products}
            currentUser={state.currentUser}
            onSubmit={handleAddTransaction}
            onCancel={() => setActivePage("dashboard")}
          />
        );
      case "stock-out":
        return (
          <StockOperations
            type={TransactionType.STOCK_OUT}
            products={state.products}
            currentUser={state.currentUser}
            onSubmit={handleAddTransaction}
            onCancel={() => setActivePage("dashboard")}
          />
        );
      case "reports":
        return (
          <Reports
            products={state.products}
            transactions={state.transactions}
            currentUser={state.currentUser}
          />
        );
      case "users":
        return (
          <UserManagement
            users={state.users}
            onAddUser={async (user) => {
              try {
                await api.users.create(user);
                await fetchData();
                notify("User created successfully");
              } catch (err) {
                notify("Failed to create user", "error");
              }
            }}
            onUpdateUser={async (user) => {
              try {
                await api.users.update(user.id, user);
                await fetchData();
                notify("User updated successfully");
              } catch (err) {
                notify("Failed to update user", "error");
              }
            }}
            onDeleteUser={async (id) => {
              if (confirm("Are you sure you want to delete this user?")) {
                try {
                  await api.users.delete(id);
                  await fetchData();
                  notify("User deleted");
                } catch (err) {
                  notify("Failed to delete user", "error");
                }
              }
            }}
          />
        );
      case "settings":
        return <Settings />;
      default:
        return (
          <Dashboard
            products={state.products}
            transactions={state.transactions}
            currentUser={state.currentUser}
            onFilterLowStock={() => setActivePage("inventory")}
          />
        );
    }
  };

  return (
    <Layout
      activePage={activePage}
      setActivePage={setActivePage}
      currentUser={state.currentUser}
      onLogout={handleLogout}
      isOffline={state.isOffline}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      {renderPage()}

      {editingProduct !== undefined && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => setEditingProduct(undefined)}
          existingProducts={state.products}
          isAdmin={state.currentUser.role === UserRole.ADMIN}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-6 right-6 z-[60] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-[slideIn_0.3s_ease-out] ${showToast.type === "success"
            ? "bg-emerald-600 text-white"
            : "bg-red-600 text-white"
            }`}
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            {showToast.type === "success" ? "✓" : "!"}
          </div>
          <span className="font-semibold">{showToast.message}</span>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </Layout>
  );
};

export default App;
