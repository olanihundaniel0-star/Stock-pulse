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
  <svg width="360" height="280" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-800 dark:text-slate-200">
    {/* Base Line */}
    <line x1="20" y1="200" x2="300" y2="200" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
    
    {/* Shelf */}
    <rect x="40" y="80" width="60" height="120" stroke="currentColor" strokeWidth="2" fill="transparent" />
    <line x1="40" y1="120" x2="100" y2="120" stroke="currentColor" strokeWidth="2" />
    <line x1="40" y1="160" x2="100" y2="160" stroke="currentColor" strokeWidth="2" />
    <rect x="48" y="88" width="24" height="16" stroke="currentColor" strokeWidth="2" fill="transparent" />
    <rect x="76" y="92" width="16" height="12" stroke="currentColor" strokeWidth="2" fill="transparent" />
    <rect x="48" y="128" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="transparent" />
    <circle cx="56" cy="136" r="4" stroke="currentColor" strokeWidth="2" />
    <rect x="72" y="128" width="20" height="16" stroke="currentColor" strokeWidth="2" fill="transparent" />
    <line x1="76" y1="134" x2="88" y2="134" stroke="currentColor" strokeWidth="2" />
    <rect x="46" y="168" width="28" height="20" stroke="currentColor" strokeWidth="2" fill="transparent" />
    <line x1="50" y1="176" x2="70" y2="176" stroke="currentColor" strokeWidth="2" />
    <line x1="50" y1="182" x2="64" y2="182" stroke="currentColor" strokeWidth="2" />
    <rect x="80" y="172" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="transparent" />
    <line x1="84" y1="178" x2="92" y2="178" stroke="currentColor" strokeWidth="2" />

    {/* Monitor */}
    <rect x="130" y="90" width="60" height="40" rx="6" stroke="currentColor" strokeWidth="2" fill="transparent" />
    <rect x="136" y="96" width="30" height="28" rx="2" stroke="currentColor" strokeWidth="2" fill="transparent" />
    <line x1="172" y1="100" x2="184" y2="100" stroke="currentColor" strokeWidth="2" />
    <line x1="172" y1="108" x2="180" y2="108" stroke="currentColor" strokeWidth="2" />
    <line x1="172" y1="116" x2="186" y2="116" stroke="currentColor" strokeWidth="2" />
    
    {/* Connection Line */}
    <line x1="160" y1="130" x2="160" y2="160" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
    <rect x="150" y="160" width="20" height="16" stroke="currentColor" strokeWidth="2" fill="transparent" />

    {/* Floating Elements */}
    <polygon points="210,80 230,80 220,60" stroke="currentColor" strokeWidth="2" fill="transparent" />
    <line x1="190" y1="70" x2="200" y2="66" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="192" y1="80" x2="202" y2="78" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    
    <circle cx="230" cy="120" r="10" stroke="currentColor" strokeWidth="2" fill="transparent" />
    <line x1="242" y1="116" x2="252" y2="112" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="244" y1="126" x2="254" y2="128" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />

    {/* List Document */}
    <rect x="210" y="150" width="18" height="24" stroke="currentColor" strokeWidth="2" fill="transparent" />
    <line x1="214" y1="156" x2="224" y2="156" stroke="currentColor" strokeWidth="2" />
    <line x1="214" y1="162" x2="220" y2="162" stroke="currentColor" strokeWidth="2" />
    <line x1="214" y1="168" x2="224" y2="168" stroke="currentColor" strokeWidth="2" />

    {/* Main List */}
    <rect x="168" y="180" width="36" height="44" rx="2" stroke="currentColor" strokeWidth="2" fill="white" />
    <rect x="168" y="180" width="36" height="12" rx="2" fill="#0f172a" />
    <text x="186" y="189" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">LIST</text>
    <circle cx="174" cy="198" r="1.5" fill="#3b82f6" />
    <line x1="178" y1="198" x2="198" y2="198" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="174" cy="206" r="1.5" fill="#3b82f6" />
    <line x1="178" y1="206" x2="194" y2="206" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="174" cy="214" r="1.5" fill="#3b82f6" />
    <line x1="178" y1="214" x2="198" y2="214" stroke="currentColor" strokeWidth="1.5" />
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
      content: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 22 20 2 20" /></svg>, 
      className: 'text-slate-300 dark:text-slate-700 w-8 h-8', 
      top: '15%', left: '10%', factor: 0.04, scatterX: -50, scatterY: -60 
    },
    { 
      id: 2, 
      content: <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800" />, 
      className: '', 
      top: '20%', left: '85%', factor: 0.06, scatterX: 60, scatterY: -20 
    },
    { 
      id: 3, 
      content: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><rect x="4" y="4" width="16" height="18" rx="2" ry="2" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="16" y2="14" /></svg>, 
      className: 'text-slate-300 dark:text-slate-700 w-8 h-8', 
      top: '80%', left: '15%', factor: 0.05, scatterX: -40, scatterY: 50 
    },
    { 
      id: 4, 
      content: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="4" y1="4" x2="4" y2="20" /><line x1="8" y1="4" x2="8" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /><line x1="16" y1="4" x2="16" y2="20" /><line x1="20" y1="4" x2="20" y2="20" /></svg>, 
      className: 'text-slate-300 dark:text-slate-700 w-8 h-8', 
      top: '85%', left: '85%', factor: 0.07, scatterX: 50, scatterY: 50 
    },
  ];

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Left Pane - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-[#f8f9fa] dark:bg-slate-900 relative items-center justify-center overflow-hidden bg-dot-pattern">
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
          <p className="mt-12 text-slate-500 dark:text-slate-400 font-serif italic text-xl tracking-wide">
            Every item. Every count. In control.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10">
        <div className="max-w-md w-full space-y-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] rounded-xl flex items-center justify-center font-bold text-xl italic">S</div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">StockPulse</span>
          </div>

          {/* Headings */}
          <div>
            <h1 className="text-4xl font-bold text-[#0f172a] dark:text-white tracking-tight">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 italic font-serif text-lg">Sign in to manage your inventory</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-3.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-5 py-3.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                <span className="text-slate-500 dark:text-slate-400">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              ref={buttonRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] font-semibold py-4 rounded-full flex items-center justify-center gap-2 btn-hover-effect disabled:opacity-50 mt-4 hover:bg-slate-800 dark:hover:bg-slate-200"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <span className="arrow-icon">→</span>}
            </button>
          </form>

          <div className="pt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have an account? <a href="#" className="text-blue-600 dark:text-blue-400 font-medium">Contact Administrator</a>
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
