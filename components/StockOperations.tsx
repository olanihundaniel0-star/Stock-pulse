
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

  const selectedProduct = products.find(p => p.id === selectedProductId);

  React.useEffect(() => {
    if (selectedProduct) {
      setUnitPrice(selectedProduct.sellingPrice);
      setUnitCost(selectedProduct.costPrice);
      if (isStockIn) setSupplier(selectedProduct.supplierName);
    }
  }, [selectedProductId, selectedProduct, isStockIn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    onSubmit({
      productId: selectedProductId,
      productName: selectedProduct?.name,
      type,
      quantity,
      reason: !isStockIn ? reason : undefined,
      notes,
      customer: !isStockIn && reason === StockOutReason.SALE ? customer : undefined,
      supplier: isStockIn ? supplier : undefined,
      unitCost: isStockIn ? unitCost : undefined,
      unitPrice: !isStockIn ? unitPrice : undefined,
      date,
      userId: currentUser.id,
      userName: currentUser.name
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-4 rounded-xl ${isStockIn ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {isStockIn ? <Package size={32} /> : <ShoppingCartIcon size={32} />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{isStockIn ? 'Restock Inventory' : 'Process Stock Out'}</h2>
          <p className="text-slate-500">{isStockIn ? 'Add items arriving from suppliers' : 'Record sales or damaged goods'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Product *</label>
            {products.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <Package className="mx-auto text-slate-400 mb-2" size={32} />
                <p className="text-sm font-semibold text-slate-600">No products available</p>
                <p className="text-xs text-slate-400 mt-1">Add products to your inventory first before recording stock movements.</p>
              </div>
            ) : (
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  <option value="">Search or select product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.quantity} in stock)</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity *</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="number" 
                required
                min="1"
                max={!isStockIn ? selectedProduct?.quantity : undefined}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>
            {!isStockIn && selectedProduct && (
              <p className="mt-1 text-xs text-slate-400">Available: {selectedProduct.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Date *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="date" 
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {isStockIn ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Supplier</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Unit Cost ($)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                    value={unitCost}
                    onChange={(e) => setUnitCost(parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Reason</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                  value={reason}
                  onChange={(e) => setReason(e.target.value as StockOutReason)}
                  disabled={!isAdmin && reason !== StockOutReason.SALE}
                >
                  <option value={StockOutReason.SALE}>Sale</option>
                  <option value={StockOutReason.DAMAGED}>Damaged</option>
                  <option value={StockOutReason.EXPIRED}>Expired</option>
                  <option value={StockOutReason.THEFT}>Theft/Loss</option>
                  <option value={StockOutReason.SAMPLE}>Sample/Giveaway</option>
                </select>
              </div>
              <div>
                {reason === StockOutReason.SALE && (
                  <>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Customer Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                        value={customer}
                        placeholder="John Doe"
                        onChange={(e) => setCustomer(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          <div className="col-span-full">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none resize-none"
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
            className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
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
