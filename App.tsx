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
      type: "circle",
      className: "w-24 h-24 rounded-full bg-blue-500/10",
      top: "15%",
      left: "20%",
      factor: 0.04,
      scatterX: -50,
      scatterY: -60,
    },
    {
      id: 2,
      type: "square",
      className: "w-32 h-32 rounded-3xl bg-indigo-500/10 rotate-12",
      top: "65%",
      left: "15%",
      factor: 0.06,
      scatterX: -40,
      scatterY: 50,
    },
    {
      id: 3,
      type: "triangle",
      className:
        "w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[69px] border-b-purple-500/10 -rotate-12",
      top: "25%",
      left: "75%",
      factor: 0.05,
      scatterX: 60,
      scatterY: -40,
    },
    {
      id: 4,
      type: "circle",
      className: "w-16 h-16 rounded-full bg-sky-500/10",
      top: "70%",
      left: "80%",
      factor: 0.07,
      scatterX: 50,
      scatterY: 50,
    },
    {
      id: 5,
      type: "square",
      className: "w-20 h-20 rounded-2xl bg-blue-400/10 rotate-45",
      top: "45%",
      left: "10%",
      factor: 0.08,
      scatterX: -60,
      scatterY: 0,
    },
    {
      id: 6,
      type: "circle",
      className: "w-12 h-12 rounded-full bg-purple-400/10",
      top: "30%",
      left: "60%",
      factor: 0.12,
      scatterX: 30,
      scatterY: -30,
    },
    {
      id: 7,
      type: "square",
      className: "w-16 h-16 rounded-xl bg-indigo-400/10 rotate-12",
      top: "60%",
      left: "70%",
      factor: 0.15,
      scatterX: 40,
      scatterY: 30,
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300 overflow-hidden">
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
              <div className={obj.className}></div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-4">
            S
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Sign in to StockPulse
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Enter your credentials to manage inventory
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-slate-900 dark:text-white"
              placeholder="admin@stockpulse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-slate-900 dark:text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 btn-hover-effect disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <span className="arrow-icon">→</span>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Default Admin: admin@stockpulse.com / admin123
          </p>
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
