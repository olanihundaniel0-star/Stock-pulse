
import React from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { Product, UserRole } from '../types';

interface InventoryProps {
  products: Product[];
  currentUser: any;
  onAddProduct: () => void;
  onEditProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, currentUser, onAddProduct, onEditProduct, onDeleteProduct }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('All');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 10;

  const isAdmin = currentUser.role === UserRole.ADMIN;

  /**
   * Simple fuzzy matching helper
   * Checks for substring first, then allows for 1-2 character typos
   */
  const fuzzyMatch = (target: string, query: string): boolean => {
    if (!target || !query) return false;
    const t = target.toLowerCase();
    const q = query.toLowerCase();

    // 1. Direct inclusion (Fast path)
    if (t.includes(q)) return true;

    // 2. Simple typo tolerance for short queries (Levenshtein-ish logic)
    // If query is long enough, allow minor character differences
    if (q.length > 3) {
      const words = t.split(/\s+/);
      return words.some(word => {
        if (Math.abs(word.length - q.length) > 2) return false;
        
        let distance = 0;
        const maxLen = Math.max(word.length, q.length);
        const minLen = Math.min(word.length, q.length);
        
        // Count differing characters
        for (let i = 0; i < minLen; i++) {
          if (word[i] !== q[i]) distance++;
        }
        distance += maxLen - minLen;

        return distance <= Math.floor(q.length * 0.3); // 30% error margin
      });
    }

    return false;
  };

  const filteredProducts = React.useMemo(() => {
    return products.filter(p => {
      // Search across multiple fields
      const searchFields = [
        p.name, 
        p.sku, 
        p.supplierName, 
        p.description || '', 
        p.category
      ].join(' ');

      const matchesSearch = !searchTerm || fuzzyMatch(searchFields, searchTerm);
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || 
        (statusFilter === 'Low Stock' && p.quantity < p.reorderLevel && p.quantity > 0) ||
        (statusFilter === 'Critical' && p.quantity === 0) ||
        (statusFilter === 'In Stock' && p.quantity >= p.reorderLevel);
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const getStatusBadge = (p: Product) => {
    if (p.quantity === 0) return <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Critical</span>;
    if (p.quantity < p.reorderLevel) return <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Low Stock</span>;
    return <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">In Stock</span>;
  };

  // Reset page when search or filter changes
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products, suppliers, or descriptions..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button 
            onClick={onAddProduct}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 text-white rounded-xl hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Filters:</span>
        </div>
        <select 
          className="text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-slate-900 dark:text-white transition-colors"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select 
          className="text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-slate-900 dark:text-white transition-colors"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Critical">Critical</option>
        </select>
        {searchTerm && (
           <button 
            onClick={() => setSearchTerm('')}
            className="text-xs font-bold text-blue-900 dark:text-blue-400 hover:underline px-2"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                {isAdmin && <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cost</th>}
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} className="w-10 h-10 rounded-lg object-cover border border-slate-100 dark:border-slate-700" alt={p.name} />
                      <div className="max-w-[150px] md:max-w-xs">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{p.supplierName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="mono text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{p.sku}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">{p.category}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div>
                      <p className={`text-sm font-bold ${p.quantity < p.reorderLevel ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {p.quantity}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Min: {p.reorderLevel}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">${p.sellingPrice.toFixed(2)}</p>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">${p.costPrice.toFixed(2)}</p>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    {getStatusBadge(p)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEditProduct(p)}
                        className="p-2 text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      {isAdmin && (
                        <button 
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400 max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                        <AlertCircle size={32} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-800 dark:text-white">No items found</p>
                        <p className="text-sm mt-1">We couldn't find anything matching "<b>{searchTerm}</b>" across products, descriptions, or suppliers.</p>
                      </div>
                      <button 
                        onClick={() => { setSearchTerm(''); setCategoryFilter('All'); setStatusFilter('All'); }}
                        className="text-sm font-bold text-blue-900 dark:text-blue-400 hover:underline"
                      >
                        Reset all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-800 dark:text-white">{paginatedProducts.length}</span> of <span className="font-semibold text-slate-800 dark:text-white">{filteredProducts.length}</span> items
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    page === i + 1 ? 'bg-blue-900 text-white shadow-md' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(p => p + 1)}
              className="p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
