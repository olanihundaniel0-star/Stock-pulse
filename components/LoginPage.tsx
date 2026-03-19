import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
    <div className="min-h-screen bg-[#f8f8f6] font-['Inter'] flex selection:bg-blue-100">
      {/* Floating Geometric Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top left triangle */}
        <svg className="absolute top-24 left-8 w-6 h-6 opacity-[0.15]" viewBox="0 0 24 24" fill="none" stroke="#0f1729" strokeWidth="1.5">
          <path d="M12 3L22 21H2L12 3Z" />
        </svg>
        {/* Top right dot */}
        <div className="absolute top-32 right-16 w-3 h-3 rounded-full bg-[#0f1729] opacity-[0.1]" />
        {/* Bottom left clipboard */}
        <svg className="absolute bottom-32 left-16 w-8 h-8 opacity-[0.12]" viewBox="0 0 24 24" fill="none" stroke="#0f1729" strokeWidth="1.5" strokeLinecap="round">
          <rect x="5" y="4" width="14" height="18" rx="2" />
          <path d="M9 2h6v4H9z" />
          <path d="M9 12h6M9 16h4" />
        </svg>
        {/* Bottom right barcode lines */}
        <svg className="absolute bottom-24 right-24 w-10 h-6 opacity-[0.1]" viewBox="0 0 40 24" fill="none" stroke="#0f1729" strokeWidth="2">
          <path d="M2 2v20M8 2v20M12 2v20M18 2v14M24 2v20M30 2v20M36 2v16" />
        </svg>
      </div>

      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden">
        {/* Subtle dot pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#0f1729 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
        
        <div className="flex flex-col items-center justify-center w-full p-12">
          {/* Hand-drawn Line Art Illustration */}
          <svg viewBox="0 0 400 350" className="w-full max-w-md h-auto select-none">
            <defs>
              <pattern id="shelfPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M0 20L20 20" stroke="#0f1729" strokeWidth="0.5" opacity="0.1" />
              </pattern>
            </defs>

            {/* Background subtle grid */}
            <rect x="50" y="50" width="300" height="250" fill="url(#shelfPattern)" opacity="0.5" />

            <g stroke="#0f1729" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Main Warehouse Shelf Structure */}
              {/* Left shelf unit */}
              <path d="M60,280 L60,80 L160,80 L160,280" />
              <path d="M60,120 L160,120" />
              <path d="M60,170 L160,170" />
              <path d="M60,220 L160,220" />
              
              {/* Shelf supports */}
              <path d="M80,280 L80,270" strokeWidth="3" />
              <path d="M140,280 L140,270" strokeWidth="3" />

              {/* Boxes on shelves - Top shelf */}
              <rect x="70" y="90" width="30" height="25" rx="2" fill="#ffffff" />
              <path d="M75,100 L95,100" strokeWidth="1.5" />
              <rect x="110" y="95" width="40" height="20" rx="2" fill="#ffffff" />
              <path d="M115,105 L140,105" strokeWidth="1.5" />

              {/* Boxes on shelves - Middle shelf */}
              <rect x="75" y="130" width="25" height="35" rx="2" fill="#ffffff" />
              <circle cx="87" cy="147" r="6" strokeWidth="1.5" />
              <rect x="110" y="135" width="35" height="30" rx="2" fill="#ffffff" />
              <path d="M115,150 L140,150 M115,157 L132,157" strokeWidth="1.5" />

              {/* Boxes on shelves - Lower shelf */}
              <rect x="68" y="178" width="45" height="38" rx="2" fill="#ffffff" />
              <path d="M73,195 L108,195 M73,203 L98,203" strokeWidth="1.5" />
              <rect x="120" y="185" width="30" height="30" rx="2" fill="#ffffff" />
              <path d="M125,195 L145,195 M125,203 L140,203 M125,211 L138,211" strokeWidth="1.5" />

              {/* Right side - Barcode Scanner */}
              <g transform="translate(200, 100)">
                <rect x="0" y="0" width="80" height="50" rx="8" fill="#ffffff" strokeWidth="2.5" />
                <rect x="10" y="10" width="40" height="30" rx="4" fill="none" />
                <path d="M55,15 L70,15 M55,22 L65,22 M55,29 L70,29 M55,36 L62,36" strokeWidth="1.5" />
                {/* Scanner beam */}
                <path d="M40,55 L40,90" stroke="#3b4fd8" strokeWidth="2" strokeDasharray="4 4" />
                <rect x="25" y="92" width="30" height="25" rx="2" fill="#ffffff" />
              </g>

              {/* Floating geometric shapes */}
              {/* Triangle */}
              <path d="M320,70 L335,95 L305,95 Z" fill="none" strokeWidth="1.5" />
              
              {/* Circle */}
              <circle cx="340" cy="150" r="12" fill="none" strokeWidth="1.5" />
              
              {/* Small document icon */}
              <g transform="translate(310, 200)">
                <rect x="0" y="0" width="24" height="30" rx="2" fill="#ffffff" />
                <path d="M4,8 L16,8 M4,14 L20,14 M4,20 L14,20" strokeWidth="1" />
                <path d="M16,0 L16,8 L24,8" fill="none" strokeWidth="1.5" />
              </g>

              {/* Inventory checklist floating */}
              <g transform="translate(250, 230)">
                <rect x="0" y="0" width="50" height="60" rx="4" fill="#ffffff" strokeWidth="2" />
                <rect x="0" y="0" width="50" height="15" rx="4" fill="#0f1729" />
                <text x="25" y="11" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" stroke="none">LIST</text>
                <path d="M8,25 L15,25 M20,25 L42,25" strokeWidth="1.5" />
                <path d="M8,35 L15,35 M20,35 L38,35" strokeWidth="1.5" />
                <path d="M8,45 L15,45 M20,45 L35,45" strokeWidth="1.5" />
                <circle cx="11" cy="25" r="3" fill="#3b4fd8" stroke="none" />
                <circle cx="11" cy="35" r="3" fill="#3b4fd8" stroke="none" />
                <circle cx="11" cy="45" r="3" fill="none" stroke="#3b4fd8" strokeWidth="1.5" />
              </g>

              {/* Small action lines for energy */}
              <g opacity="0.4">
                <path d="M280,85 L290,80" strokeWidth="1" />
                <path d="M285,95 L295,92" strokeWidth="1" />
                <path d="M350,140 L360,138" strokeWidth="1" />
                <path d="M352,160 L362,162" strokeWidth="1" />
              </g>

              {/* Floor line */}
              <path d="M40,280 L360,280" strokeWidth="1" opacity="0.3" />
            </g>
          </svg>

          {/* Brand tagline */}
          <p className="mt-8 text-[#0f1729] text-lg font-serif italic opacity-70 text-center">
            Every item. Every count. In control.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#0f1729] rounded-lg flex items-center justify-center transform -rotate-6">
              <span className="text-white text-sm font-black italic">S</span>
            </div>
            <span className="text-[#0f1729] text-xl font-bold tracking-tight">StockPulse</span>
          </div>

          {/* Headline */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-[#0f1729] tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-[#0f1729]/60 font-serif italic text-lg">
              Sign in to manage your inventory
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0f1729] mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3.5 bg-white border-2 border-[#0f1729]/10 rounded-full focus:border-[#3b4fd8] focus:ring-0 outline-none text-[#0f1729] placeholder:text-[#0f1729]/30 transition-colors"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1729] mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3.5 bg-white border-2 border-[#0f1729]/10 rounded-full focus:border-[#3b4fd8] focus:ring-0 outline-none text-[#0f1729] placeholder:text-[#0f1729]/30 transition-colors"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 border-2 border-[#0f1729]/20 rounded-md peer-checked:bg-[#0f1729] peer-checked:border-[#0f1729] transition-all">
                    {rememberMe && (
                      <svg className="w-5 h-5 text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[#0f1729]/60 group-hover:text-[#0f1729] transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-[#3b4fd8] font-semibold hover:text-[#2a3db8] transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f1729] text-white font-bold py-4 rounded-full shadow-lg hover:bg-[#1a2744] transition-all flex items-center justify-center gap-2 group mt-8"
            >
              Sign In
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#0f1729]/10"></div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-[#0f1729]/50">
            Don't have an account?{' '}
            <button 
              type="button"
              onClick={onBack}
              className="text-[#3b4fd8] font-semibold hover:text-[#2a3db8] transition-colors"
            >
              Contact Administrator
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
