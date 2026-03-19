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
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import StockOperations from "./components/StockOperations";
import LandingPage from "./components/LandingPage";
import ProductForm from "./components/ProductForm";
import Reports from "./components/Reports";
import UserManagement from "./components/UserManagement";
import Settings from "./components/Settings";

// Simple Auth Screen
const MainIllustration = () => (
  <svg width="400" height="320" viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0f1729]">
    {/* Subtle Grid Background */}
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
    </pattern>
    <rect width="400" height="320" fill="url(#grid)" />

    {/* Base Line */}
    <line x1="40" y1="280" x2="360" y2="280" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />
    
    {/* Warehouse Shelf */}
    <rect x="60" y="120" width="100" height="160" stroke="currentColor" strokeWidth="1.5" fill="transparent" />
    <line x1="60" y1="170" x2="160" y2="170" stroke="currentColor" strokeWidth="1.5" />
    <line x1="60" y1="220" x2="160" y2="220" stroke="currentColor" strokeWidth="1.5" />
    
    {/* Boxes on Shelf */}
    <rect x="70" y="130" width="30" height="40" stroke="currentColor" strokeWidth="1.5" fill="transparent" />
    <line x1="70" y1="145" x2="100" y2="145" stroke="currentColor" strokeWidth="1.5" />
    
    <rect x="110" y="140" width="40" height="30" stroke="currentColor" strokeWidth="1.5" fill="transparent" />
    <circle cx="130" cy="155" r="4" stroke="currentColor" strokeWidth="1.5" fill="transparent" />
    
    <rect x="65" y="180" width="45" height="40" stroke="currentColor" strokeWidth="1.5" fill="transparent" />
    <line x1="75" y1="190" x2="95" y2="190" stroke="currentColor" strokeWidth="1.5" />
    <line x1="75" y1="200" x2="90" y2="200" stroke="currentColor" strokeWidth="1.5" />
    
    <rect x="120" y="190" width="30" height="30" stroke="currentColor" strokeWidth="1.5" fill="transparent" />
    <line x1="125" y1="195" x2="145" y2="215" stroke="currentColor" strokeWidth="1.5" />
    
    <rect x="80" y="240" width="60" height="40" stroke="currentColor" strokeWidth="1.5" fill="transparent" />
    <rect x="90" y="250" width="40" height="20" stroke="currentColor" strokeWidth="1.5" fill="transparent" strokeDasharray="2 2" />

    {/* Barcode Scanner */}
    <path d="M 220 180 L 240 180 L 250 200 L 250 240 L 220 240 Z" stroke="currentColor" strokeWidth="1.5" fill="transparent" />
    <rect x="225" y="190" width="20" height="15" stroke="currentColor" strokeWidth="1.5" fill="transparent" />
    <line x1="235" y1="215" x2="235" y2="230" stroke="currentColor" strokeWidth="1.5" />
    
    {/* Scanner Beam */}
    <path d="M 200 190 L 170 170 L 170 210 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
    
    {/* Document/Clipboard */}
    <rect x="270" y="100" width="60" height="80" stroke="currentColor" strokeWidth="1.5" fill="transparent" />
    <line x1="285" y1="100" x2="315" y2="100" stroke="currentColor" strokeWidth="3" />
    <line x1="285" y1="120" x2="315" y2="120" stroke="currentColor" strokeWidth="1.5" />
    <line x1="285" y1="135" x2="305" y2="135" stroke="currentColor" strokeWidth="1.5" />
    <line x1="285" y1="150" x2="315" y2="150" stroke="currentColor" strokeWidth="1.5" />
    <rect x="285" y="165" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="transparent" />
    
    {/* Floating Decorative Elements (Line Art) */}
    <circle cx="200" cy="80" r="12" stroke="currentColor" strokeWidth="1.5" fill="transparent" />
    <polygon points="240,50 255,75 225,75" stroke="currentColor" strokeWidth="1.5" fill="transparent" />
    
    {/* Barcode Motif */}
    <line x1="300" y1="220" x2="300" y2="250" stroke="currentColor" strokeWidth="2" />
    <line x1="306" y1="220" x2="306" y2="250" stroke="currentColor" strokeWidth="1" />
    <line x1="310" y1="220" x2="310" y2="250" stroke="currentColor" strokeWidth="3" />
    <line x1="316" y1="220" x2="316" y2="250" stroke="currentColor" strokeWidth="1.5" />
    <line x1="322" y1="220" x2="322" y2="250" stroke="currentColor" strokeWidth="1" />
    <line x1="326" y1="220" x2="326" y2="250" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const Login: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScattered(true);
    setTimeout(() => setIsScattered(false), 600);

    setLoading(true);
    setError("");
    try {
      const data = await api.auth.login(email, password);
      setTimeout(() => onLogin(data.user), 300);
    } catch (err) {
      setError("Invalid credentials. Please check your email and password.");
      setLoading(false);
    }
  };

  const floatingObjects = [
    { 
      id: 1, 
      content: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 22 20 2 20" /></svg>, 
      className: 'text-[#0f1729] opacity-20 w-6 h-6', 
      top: '15%', left: '10%', factor: 0.04, scatterX: -50, scatterY: -60 
    },
    { 
      id: 2, 
      content: <div className="w-2 h-2 rounded-full border border-[#0f1729] opacity-30" />, 
      className: '', 
      top: '25%', left: '85%', factor: 0.06, scatterX: 60, scatterY: -20 
    },
    { 
      id: 3, 
      content: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="2" width="12" height="20" rx="2" ry="2" /><line x1="10" y1="6" x2="14" y2="6" /><line x1="10" y1="10" x2="14" y2="10" /></svg>, 
      className: 'text-[#0f1729] opacity-20 w-6 h-6', 
      top: '75%', left: '15%', factor: 0.05, scatterX: -40, scatterY: 50 
    },
    { 
      id: 4, 
      content: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="6" y1="4" x2="6" y2="20" /><line x1="10" y1="4" x2="10" y2="20" /><line x1="14" y1="4" x2="14" y2="20" /><line x1="18" y1="4" x2="18" y2="20" /></svg>, 
      className: 'text-[#0f1729] opacity-20 w-6 h-6', 
      top: '80%', left: '80%', factor: 0.07, scatterX: 50, scatterY: 50 
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8f8f6] transition-colors duration-300">
      {/* Left Pane - Illustration */}
      <div className="hidden lg:flex w-[45%] relative items-center justify-center overflow-hidden">
        {/* Faint grid pattern behind */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#0f1729 0.5px, transparent 0.5px)', backgroundSize: '24px 24px', opacity: 0.05 }}></div>
        
        {/* Floating Objects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {floatingObjects.map((obj, index) => {
            let transform = "";
            if (isScattered) {
              transform = `translate(${obj.scatterX}px, ${obj.scatterY}px) scale(0.8)`;
            } else if (isHovering) {
              transform = `translate(${magneticPull.x * obj.factor}px, ${magneticPull.y * obj.factor}px)`;
            }

            return (
              <div
                key={obj.id}
                className={`absolute magnetic-object ${!isHovering && !isScattered ? "float-idle-" + (index + 1) : ""} ${isScattered ? "scattered" : ""}`}
                style={{
                  top: obj.top,
                  left: obj.left,
                  transform: transform || undefined,
                }}
              >
                <div className={obj.className}>{obj.content}</div>
              </div>
            );
          })}
        </div>

        {/* Main Illustration */}
        <div className="relative z-10 flex flex-col items-center">
          <MainIllustration />
          <p className="mt-8 text-[#0f1729] font-serif italic text-xl tracking-wide opacity-80">
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
            <h1 className="text-4xl font-bold text-[#0f1729] tracking-tight">Welcome back</h1>
            <p className="text-[#0f1729] opacity-60 mt-3 italic font-serif text-lg">Sign in to manage your inventory</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
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

            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0f1729] focus:ring-[#0f1729]" />
                <span className="text-[#0f1729] opacity-70">Remember me</span>
              </label>
              <a href="#" className="text-[#3b4fd8] hover:text-[#2a3bb8] font-medium transition-colors">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              ref={buttonRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full bg-[#0f1729] text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 btn-hover-effect disabled:opacity-50 mt-4 hover:bg-[#1a243d] transition-colors"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <span className="arrow-icon">→</span>}
            </button>
          </form>

          <div className="pt-8 text-center border-t border-slate-100">
            <p className="text-sm text-[#0f1729] opacity-60">
              Don't have an account? <a href="#" className="text-[#3b4fd8] font-medium hover:text-[#2a3bb8] transition-colors">Contact Administrator</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
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

  const fetchData = useCallback(async () => {
    if (!state.currentUser) return;
    try {
      const [products, transactions] = await Promise.all([
        api.products.getAll(),
        api.transactions.getAll(),
      ]);
      setState((prev) => ({ ...prev, products, transactions }));
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

  const handleLogin = (user: User) => {
    setState((prev) => ({ ...prev, currentUser: user }));
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    api.auth.logout();
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

  if (activePage === "landing")
    return <LandingPage onLogin={() => setActivePage("login")} />;
  if (activePage === "login") return <Login onLogin={handleLogin} />;
  if (!state.currentUser) return <Login onLogin={handleLogin} />;

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
                  notify("Product deleted", "error");
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
            onAddUser={() => {}} // TODO: Implement user management API
            onUpdateUser={() => {}}
            onDeleteUser={() => {}}
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
          className={`fixed top-6 right-6 z-[60] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-[slideIn_0.3s_ease-out] ${
            showToast.type === "success"
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
