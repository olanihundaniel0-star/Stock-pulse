
import React, { useState, useEffect } from 'react';
import { AppState, UserRole, TransactionType, Product, Transaction, User } from './types';
import { loadDB, saveDB } from './db';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import StockOperations from './components/StockOperations';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ProductForm from './components/ProductForm';
import Reports from './components/Reports';
import UserManagement from './components/UserManagement';
import Settings from './components/Settings';

// Simple Auth Screen
const Login: React.FC<{ onLogin: (role: UserRole) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@stockpulse.com' && password === 'admin123') {
      onLogin(UserRole.ADMIN);
    } else if (email === 'staff@stockpulse.com' && password === 'staff123') {
      onLogin(UserRole.STAFF);
    } else {
      setError('Invalid credentials. Use admin@stockpulse.com / admin123 or staff@stockpulse.com / staff123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-4">S</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in to StockPulse</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your credentials to manage inventory</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-slate-900 dark:text-white"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-slate-900 dark:text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-blue-900" />
              <span className="text-slate-600 dark:text-slate-400">Remember me</span>
            </label>
            <a href="#" className="text-blue-900 dark:text-blue-400 font-semibold hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-800 transition-all">
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Don't have an account? <a href="#" className="text-blue-900 dark:text-blue-400 font-semibold">Contact Administrator</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(loadDB());
  const [activePage, setActivePage] = useState('landing');
  const [showToast, setShowToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null | undefined>(undefined);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('stockpulse_theme') as 'light' | 'dark' || 'light';
  });

  useEffect(() => {
    saveDB(state);
  }, [state]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('stockpulse_theme', theme);
  }, [theme]);

  // Network listener
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setState(prev => ({ ...prev, isOffline: true }));
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = (role: UserRole) => {
    const user = state.users.find(u => u.role === role) || state.users[0];
    setState(prev => ({ ...prev, currentUser: user }));
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    setActivePage('landing');
  };

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleAddTransaction = (tx: Partial<Transaction>) => {
    const newTx: Transaction = {
      ...tx as Transaction,
      id: `tx-${Date.now()}`
    };

    const updatedProducts = state.products.map(p => {
      if (p.id === tx.productId) {
        const delta = tx.type === TransactionType.STOCK_IN ? (tx.quantity || 0) : -(tx.quantity || 0);
        const newQty = p.quantity + delta;
        
        // Update product metadata if stock-in
        if (tx.type === TransactionType.STOCK_IN && tx.unitCost) {
          return { ...p, quantity: newQty, costPrice: tx.unitCost };
        }
        return { ...p, quantity: newQty };
      }
      return p;
    });

    setState(prev => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
      products: updatedProducts
    }));

    notify(`${tx.type === TransactionType.STOCK_IN ? 'Added' : 'Removed'} ${tx.quantity} units of ${tx.productName}`);
    setActivePage('dashboard');
  };

  const handleSaveProduct = (p: Partial<Product>) => {
    if (editingProduct) {
      // Update
      setState(prev => ({
        ...prev,
        products: prev.products.map(item => item.id === editingProduct.id ? { ...item, ...p } as Product : item)
      }));
      notify('Product updated successfully');
    } else {
      // Create
      const newProduct: Product = {
        ...p as Product,
        id: `p-${Date.now()}`
      };
      setState(prev => ({
        ...prev,
        products: [...prev.products, newProduct]
      }));
      notify('Product added to inventory');
    }
    setEditingProduct(undefined);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (activePage === 'landing') return <LandingPage onLogin={() => setActivePage('login')} />;
  if (activePage === 'login') return <LoginPage onLogin={handleLogin} onBack={() => setActivePage('landing')} />;
  if (!state.currentUser) return <LoginPage onLogin={handleLogin} onBack={() => setActivePage('landing')} />;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard 
          products={state.products} 
          transactions={state.transactions} 
          currentUser={state.currentUser}
          onFilterLowStock={() => setActivePage('inventory')}
        />;
      case 'inventory':
        return <Inventory 
          products={state.products} 
          currentUser={state.currentUser}
          onAddProduct={() => setEditingProduct(null)}
          onEditProduct={(p) => setEditingProduct(p)}
          onDeleteProduct={(id) => {
            if (confirm('Are you sure you want to delete this product?')) {
              setState(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id)}));
              notify('Product deleted', 'error');
            }
          }}
        />;
      case 'stock-in':
        return <StockOperations 
          type={TransactionType.STOCK_IN} 
          products={state.products} 
          currentUser={state.currentUser}
          onSubmit={handleAddTransaction}
          onCancel={() => setActivePage('dashboard')}
        />;
      case 'stock-out':
        return <StockOperations 
          type={TransactionType.STOCK_OUT} 
          products={state.products} 
          currentUser={state.currentUser}
          onSubmit={handleAddTransaction}
          onCancel={() => setActivePage('dashboard')}
        />;
      case 'reports':
        return <Reports 
          products={state.products} 
          transactions={state.transactions} 
          currentUser={state.currentUser} 
        />;
      case 'users':
        return <UserManagement 
          users={state.users}
          onAddUser={(u) => setState(prev => ({ ...prev, users: [...prev.users, u as User]}))}
          onUpdateUser={(u) => setState(prev => ({ ...prev, users: prev.users.map(item => item.id === u.id ? u : item)}))}
          onDeleteUser={(id) => setState(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id)}))}
        />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard products={state.products} transactions={state.transactions} currentUser={state.currentUser} onFilterLowStock={() => setActivePage('inventory')} />;
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
        <div className={`fixed top-6 right-6 z-[60] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-[slideIn_0.3s_ease-out] ${
          showToast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            {showToast.type === 'success' ? '✓' : '!'}
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
