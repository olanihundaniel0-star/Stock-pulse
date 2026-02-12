
import React, { useState } from 'react';
import { Building2, Globe, Mail, Phone, MapPin, Percent, Bell, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [config, setConfig] = useState({
    businessName: 'StockPulse Retailers',
    email: 'contact@stockpulse.com',
    phone: '+1 (555) 000-1234',
    address: '123 Warehouse St, Inventory City',
    currency: 'USD',
    taxRate: 7.5,
    lowStockThreshold: 10,
    emailAlerts: true
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <Building2 className="text-blue-900" />
          <h2 className="text-xl font-bold text-slate-800">Company Information</h2>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Business Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900"
                value={config.businessName}
                onChange={e => setConfig({ ...config, businessName: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Support Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900"
                value={config.email}
                onChange={e => setConfig({ ...config, email: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Contact Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900"
                value={config.phone}
                onChange={e => setConfig({ ...config, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900"
                value={config.address}
                onChange={e => setConfig({ ...config, address: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <Globe className="text-blue-900" />
          <h2 className="text-xl font-bold text-slate-800">Inventory & Financials</h2>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Default Low Stock Alert Threshold</label>
            <div className="relative">
              <Bell className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="number" 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900"
                value={config.lowStockThreshold}
                onChange={e => setConfig({ ...config, lowStockThreshold: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Sales Tax Rate (%)</label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="number" 
                step="0.1"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900"
                value={config.taxRate}
                onChange={e => setConfig({ ...config, taxRate: parseFloat(e.target.value) })}
              />
            </div>
          </div>
          <div className="col-span-full pt-4">
             <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded text-blue-900 border-slate-300 focus:ring-blue-900"
                  checked={config.emailAlerts}
                  onChange={e => setConfig({ ...config, emailAlerts: e.target.checked })}
                />
                <div>
                   <p className="font-bold text-slate-800">Enable Automated Email Alerts</p>
                   <p className="text-xs text-slate-500">Send notifications to staff when items fall below reorder levels.</p>
                </div>
             </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          <Save size={20} />
          Save Global Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
