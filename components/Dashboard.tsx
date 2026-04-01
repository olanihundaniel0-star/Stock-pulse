import React, { useEffect, useState } from 'react';
import {
  Package,
  DollarSign,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  History,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { api } from '../api';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Product, Transaction, UserRole, TransactionType, DashboardStats } from '../types';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
  currentUser: any;
  onFilterLowStock: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ products, transactions, currentUser, onFilterLowStock }) => {
  const isAdmin = currentUser.role === UserRole.ADMIN;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await api.stats.getDashboard();
        if (!cancelled) {
          setStats(data);
          setStatsError(null);
        }
      } catch {
        if (!cancelled) {
          setStats(null);
          setStatsError('Could not load dashboard metrics.');
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [products, transactions]);

  const todayUtc = new Date().toISOString().split('T')[0];
  const fallbackTodayOut = transactions.filter(
    (t) => t.date.split('T')[0] === todayUtc && t.type === TransactionType.STOCK_OUT,
  );

  const totalItems = stats?.totalItems ?? products.length;
  const lowStockItems = stats?.lowStockItems ?? products.filter((p) => p.quantity < p.reorderLevel).length;
  const inventoryValue = isAdmin
    ? (stats?.inventoryValueCost ??
      products.reduce((acc, p) => acc + p.costPrice * p.quantity, 0))
    : (stats?.inventoryValueRetail ??
      products.reduce((acc, p) => acc + p.sellingPrice * p.quantity, 0));

  const todaySalesCount =
    stats?.todaySalesCount ?? fallbackTodayOut.reduce((acc, t) => acc + t.quantity, 0);
  const todaySalesValue =
    stats?.todaySalesValue ??
    fallbackTodayOut.reduce((acc, t) => acc + (t.unitPrice || 0) * t.quantity, 0);

  const fallbackChart = React.useMemo(() => {
    const data: { name: string; sales: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayTransactions = transactions.filter((t) => t.date.split('T')[0] === dateStr);
      data.push({
        name: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        sales: dayTransactions
          .filter((t) => t.type === TransactionType.STOCK_OUT)
          .reduce((acc, t) => acc + (t.unitPrice || 0) * t.quantity, 0),
      });
    }
    return data;
  }, [transactions]);

  const chartData =
    stats?.chart && stats.chart.length > 0
      ? stats.chart.map((p) => ({ name: p.label, sales: p.sales }))
      : fallbackChart;

  return (
    <div className="space-y-6">
      {statsError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
          {statsError} Showing figures from cached inventory where possible.
        </div>
      )}
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Items</p>
              <h3 className="text-2xl font-bold mt-1 dark:text-white">{totalItems}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">Unique Products</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Inventory Value</p>
              <h3 className="text-2xl font-bold mt-1 dark:text-white">₦{inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">{isAdmin ? 'Current Stock Worth (Cost)' : 'Potential Revenue'}</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <button 
          onClick={onFilterLowStock}
          className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{lowStockItems}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">Items Need Restocking</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg group-hover:scale-110 transition-transform">
              <AlertTriangle size={24} />
            </div>
          </div>
        </button>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Today's Sales</p>
              <h3 className="text-2xl font-bold mt-1 dark:text-white">₦{todaySalesValue.toLocaleString()}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">{todaySalesCount} units sold</p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <ShoppingCart size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-900 dark:text-blue-400" />
              Stock Movement Trends
            </h3>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1 text-sm outline-none text-slate-900 dark:text-white transition-colors">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#0f172a', color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <History size={20} className="text-blue-900 dark:text-blue-400" />
              Recent Activity
            </h3>
            <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full animate-pulse">Live</span>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-80 pr-2">
            {transactions.slice(0, 10).map((t) => (
              <div key={t.id} className="flex gap-4 items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  t.type === TransactionType.STOCK_IN ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'
                }`}>
                  {t.type === TransactionType.STOCK_IN ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{t.productName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className={t.type === TransactionType.STOCK_IN ? 'text-emerald-600' : 'text-red-600'}>
                      {t.type === TransactionType.STOCK_IN ? '+' : '-'}{t.quantity} units
                    </span>
                    <span>•</span>
                    <span>{new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 text-sm font-semibold text-blue-900 dark:text-blue-400 flex items-center gap-2 hover:gap-3 transition-all">
            View all transactions <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
