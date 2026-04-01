
import React from 'react';
import { Product, TransactionType, StockOutReason, UserRole } from '../types';
import { Package, Truck, User, Hash, Calendar, FileText, CheckCircle } from 'lucide-react';

interface StockOpsProps {
  type: TransactionType;
  products: Product[];
  currentUser: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const StockOperations: React.FC<StockOpsProps> = ({ type, products, currentUser, onSubmit, onCancel }) => {
  const isStockIn = type === TransactionType.STOCK_IN;
  const isAdmin = currentUser.role === UserRole.ADMIN;

  const [selectedProductId, setSelectedProductId] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [reason, setReason] = React.useState(StockOutReason.SALE);
  const [notes, setNotes] = React.useState('');
  const [customer, setCustomer] = React.useState('');
  const [supplier, setSupplier] = React.useState('');
  const [unitCost, setUnitCost] = React.useState(0);
  const [unitPrice, setUnitPrice] = React.useState(0);
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [formError, setFormError] = React.useState<string | null>(null);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  React.useEffect(() => {
    if (selectedProduct) {
      setUnitPrice(selectedProduct.sellingPrice);
      setUnitCost(selectedProduct.costPrice);
      if (isStockIn) setSupplier(selectedProduct.supplierName);
    }
  }, [selectedProductId, selectedProduct, isStockIn]);

  React.useEffect(() => {
    setFormError(null);
  }, [selectedProductId, quantity, reason, unitPrice, date, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      setFormError('Please select a product before submitting.');
      return;
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      setFormError('Quantity must be at least 1.');
      return;
    }
    if (!isStockIn) {
      if (!selectedProduct) {
        setFormError('Selected product could not be found.');
        return;
      }
      if (quantity > selectedProduct.quantity) {
        setFormError(`Cannot stock out ${quantity} units. Only ${selectedProduct.quantity} available.`);
        return;
      }
      if (reason === StockOutReason.SALE && (!Number.isFinite(unitPrice) || unitPrice <= 0)) {
        setFormError('Unit price must be greater than 0 for sales.');
        return;
      }
    }

    setFormError(null);
    const effectiveReason = !isStockIn ? (isAdmin ? reason : StockOutReason.SALE) : undefined;

    onSubmit({
      productId: selectedProductId,
      productName: selectedProduct?.name,
      type,
      quantity,
      reason: effectiveReason,
      notes,
      customer: !isStockIn && effectiveReason === StockOutReason.SALE ? customer : undefined,
      supplier: isStockIn ? supplier : undefined,
      unitCost: isStockIn ? unitCost : undefined,
      unitPrice: !isStockIn ? unitPrice : undefined,
      date,
      userId: currentUser.id,
      userName: currentUser.name
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-4 rounded-xl ${isStockIn ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {isStockIn ? <Package size={32} /> : <ShoppingCartIcon size={32} />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{isStockIn ? 'Restock Inventory' : 'Process Stock Out'}</h2>
          <p className="text-slate-500 dark:text-slate-400">{isStockIn ? 'Add items arriving from suppliers' : 'Record sales or damaged goods'}</p>
        </div>
      </div>
      {formError && (
        <div className="mb-6 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Product *</label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <select 
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-slate-900 dark:text-white"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">Search or select product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.quantity} in stock)</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Quantity *</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input 
                type="number" 
                required
                min="1"
                max={!isStockIn ? selectedProduct?.quantity : undefined}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-slate-900 dark:text-white"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setQuantity(Number.isNaN(value) ? 0 : value);
                }}
              />
            </div>
            {!isStockIn && selectedProduct && (
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Available: {selectedProduct.quantity}</p>
            )}
            {!isStockIn && selectedProduct && quantity > 0 && quantity <= selectedProduct.quantity && (
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">After this transaction: {selectedProduct.quantity - quantity} left</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input 
                type="date" 
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-slate-900 dark:text-white"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {isStockIn ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Supplier</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-slate-900 dark:text-white"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Unit Cost (₦)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-slate-900 dark:text-white"
                    value={unitCost}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setUnitCost(Number.isNaN(value) ? 0 : value);
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Reason</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-slate-900 dark:text-white"
                  value={reason}
                  onChange={(e) => setReason(e.target.value as StockOutReason)}
                  disabled={!isAdmin}
                >
                  {isAdmin ? (
                    <>
                      <option value={StockOutReason.SALE}>Sale</option>
                      <option value={StockOutReason.DAMAGED}>Damaged</option>
                      <option value={StockOutReason.EXPIRED}>Expired</option>
                      <option value={StockOutReason.THEFT}>Theft/Loss</option>
                      <option value={StockOutReason.SAMPLE}>Sample/Giveaway</option>
                    </>
                  ) : (
                    <option value={StockOutReason.SALE}>Sale</option>
                  )}
                </select>
              </div>
              <div>
                {reason === StockOutReason.SALE && (
                  <>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Customer Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                      <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-slate-900 dark:text-white"
                        value={customer}
                        placeholder="John Doe"
                        onChange={(e) => setCustomer(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Unit Price (₦)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input
                    type="number"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                    value={unitPrice}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setUnitPrice(Number.isNaN(value) ? 0 : value);
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Auto-filled from product. Editable if needed.</p>
              </div>
            </>
          )}

          <div className="col-span-full">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Notes</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none resize-none text-slate-900 dark:text-white"
              placeholder="Any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-semibold shadow-lg transition-all ${
              isStockIn ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <CheckCircle size={20} />
            {isStockIn ? 'Confirm Stock In' : 'Confirm Stock Out'}
          </button>
        </div>
      </form>
    </div>
  );
};

const ShoppingCartIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

export default StockOperations;
