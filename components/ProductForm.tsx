
import React, { useState, useEffect, useRef } from 'react';
import { Product, UserRole } from '../types';
import { X, Save, RefreshCw, Camera, Upload, Trash2, Phone, MapPin, Scan, Tag, Box, Info, Truck } from 'lucide-react';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Partial<Product>) => void;
  onClose: () => void;
  existingProducts: Product[];
  isAdmin: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onClose, existingProducts, isAdmin }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: 'Food & Beverages',
    description: '',
    costPrice: 0,
    sellingPrice: 0,
    quantity: 0,
    reorderLevel: 10,
    supplierName: '',
    supplierContact: '',
    location: '',
    image: '',
    unit: 'pcs',
    status: 'Published'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const generateSKU = () => {
    const catCode = formData.category?.substring(0, 3).toUpperCase() || 'GEN';
    const random = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, sku: `${catCode}-${random}` }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setUploadError('Only .jpg and .png files are allowed');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (formData.sku && !product && existingProducts.some(p => p.sku === formData.sku)) {
      newErrors.sku = 'SKU must be unique';
    }
    if (isAdmin && (formData.costPrice === undefined || formData.costPrice < 0)) newErrors.costPrice = 'Valid cost price is required';
    if (formData.sellingPrice === undefined || formData.sellingPrice < (formData.costPrice || 0)) {
      newErrors.sellingPrice = 'Selling price cannot be less than cost price';
    }
    if (formData.quantity === undefined || formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAction = (status: 'Published' | 'Draft') => {
    if (validate()) {
      onSave({ ...formData, status });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl transition-all border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900 dark:bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <PlusSquare size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {product ? 'Modify Inventory Item' : 'Create New Product'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fill in the details below to update your stock pulse.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={(e) => e.preventDefault()} className="flex-1 overflow-y-auto p-8 space-y-10">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Info size={18} className="text-blue-900 dark:text-blue-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                 <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border-2 border-dashed transition-all flex items-center justify-center group cursor-pointer ${
                    uploadError ? 'border-red-500' : 'border-slate-200 dark:border-slate-700 hover:border-blue-900 dark:hover:border-blue-500'
                  }`}
                >
                  {formData.image ? (
                    <>
                      <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="text-white" size={24} />
                      </div>
                      <button 
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Camera size={32} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Product Image</span>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg" onChange={handleImageChange} />
                </div>
                {uploadError && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-tight">{uploadError}</p>}
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Name*</label>
                  <input
                    type="text"
                    required
                    className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-colors ${
                      errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                    }`}
                    placeholder="e.g. Premium Basmati Rice"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">SKU / Barcode*</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Scan className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          required
                          className={`w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none mono text-slate-900 dark:text-white transition-colors ${
                            errors.sku ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                          }`}
                          value={formData.sku}
                          onChange={e => setFormData({ ...formData, sku: e.target.value })}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={generateSKU}
                        className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-all active:scale-95"
                        title="Generate SKU"
                      >
                        <RefreshCw size={18} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Category*</label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-colors"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option>Food & Beverages</option>
                      <option>Household</option>
                      <option>Electronics</option>
                      <option>Stationery</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Stock */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Tag size={18} className="text-blue-900 dark:text-blue-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Pricing & Stock</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {isAdmin && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Cost Price (₦)*</label>
                  <input
                    type="number"
                    step="0.01"
                    className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-colors ${
                      errors.costPrice ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                    }`}
                    value={formData.costPrice}
                    onChange={e => setFormData({ ...formData, costPrice: parseFloat(e.target.value) })}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Selling Price (₦)*</label>
                <input
                  type="number"
                  step="0.01"
                  className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-colors ${
                    errors.sellingPrice ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                  value={formData.sellingPrice}
                  onChange={e => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Stock Level*</label>
                <input
                  type="number"
                  className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-colors ${
                    errors.quantity ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit</label>
                <select
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-colors"
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="ltr">Liters (ltr)</option>
                  <option value="box">Boxes (box)</option>
                  <option value="pk">Packets (pk)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Reorder Level*</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-colors"
                  value={formData.reorderLevel}
                  onChange={e => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Supplier & Logistics */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Truck size={18} className="text-blue-900 dark:text-blue-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Supplier & Logistics</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Supplier Name*</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-colors"
                  value={formData.supplierName}
                  onChange={e => setFormData({ ...formData, supplierName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Supplier Contact</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-colors"
                    placeholder="+1 (555) 000-0000"
                    value={formData.supplierContact}
                    onChange={e => setFormData({ ...formData, supplierContact: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Warehouse Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-colors"
                    placeholder="Aisle 3, Shelf B"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Description</label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 outline-none resize-none text-slate-900 dark:text-white transition-colors"
                placeholder="Brief details about the item's features, dimensions, or usage..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-slate-600 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAction('Draft')}
              className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleAction('Published')}
              className="px-8 py-2.5 bg-blue-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-800 dark:hover:bg-blue-500 flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 transition-all transform active:scale-95"
            >
              <Save size={18} />
              {product ? 'Update Inventory' : 'Publish Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlusSquare = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

export default ProductForm;
