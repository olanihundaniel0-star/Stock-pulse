
import React, { useState } from 'react';
import { Star, ArrowRight, Package, ShieldCheck, Zap, BarChart3, Users, Globe } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showAbout, setShowAbout] = useState(false);

  if (showAbout) {
    return (
      <div className="min-h-screen bg-white font-['Inter'] selection:bg-blue-100 animate-in fade-in duration-500">
        <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900 cursor-pointer" onClick={() => setShowAbout(false)}>
            <div className="w-6 h-6 bg-slate-900 rounded-sm flex items-center justify-center transform -rotate-12">
              <span className="text-white text-[10px] font-black italic">S</span>
            </div>
            <span className="tracking-tight">StockPulse</span>
          </div>
          <button onClick={() => setShowAbout(false)} className="text-[14px] font-semibold text-slate-900 hover:text-blue-700 transition-colors flex items-center gap-2">
            ← Back to Home
          </button>
        </nav>

        <section className="max-w-4xl mx-auto px-6 py-20 space-y-16">
          <div className="space-y-6 text-center">
            <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight">The Future of <span className="text-blue-600">Inventory Intelligence</span></h2>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
              StockPulse was born out of a simple observation: retail growth is often throttled by manual, error-prone tracking. We built a system that feels like second nature.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4 p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Real-Time Sync</h3>
              <p className="text-slate-500">Every sale, every restock, and every adjustment is reflected across your entire organization instantly. No more double-counts.</p>
            </div>
            <div className="space-y-4 p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Role-Based Security</h3>
              <p className="text-slate-500">Protect your sensitive financial data. Admins see margins; staff see stock. Granular control for modern teams.</p>
            </div>
            <div className="space-y-4 p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Predictive Alerts</h3>
              <p className="text-slate-500">Our smart engine alerts you before you run out. StockPulse analyzes your velocity to keep your shelves profitable.</p>
            </div>
            <div className="space-y-4 p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Global Accessibility</h3>
              <p className="text-slate-500">Cloud-native architecture means you can check your warehouse status from the office or the beach. Total visibility.</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[40px] p-12 text-center text-white space-y-8">
            <h3 className="text-3xl font-bold">Ready to modernize your warehouse?</h3>
            <button onClick={onLogin} className="bg-white text-slate-900 font-bold px-10 py-4 rounded-full text-lg hover:bg-slate-100 transition-all inline-flex items-center gap-2 shadow-2xl">
              Get Started <ArrowRight size={20} />
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Inter'] selection:bg-blue-100 overflow-x-hidden">
      <style>{`
        @keyframes conveyorFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(80px); }
        }
        @keyframes bobbing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes entry {
          0% { transform: scale(1) translateY(0); opacity: 1; }
          90% { transform: scale(0.4) translateY(10px); opacity: 0.5; }
          100% { transform: scale(0) translateY(20px); opacity: 0; }
        }
        .animate-conveyor { animation: conveyorFlow 3s linear infinite; }
        .animate-bob { animation: bobbing 2s ease-in-out infinite; }
        .animate-entry-machine { animation: entry 4s infinite cubic-bezier(0.4, 0, 1, 1); }
      `}</style>

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div className="w-6 h-6 bg-slate-900 rounded-sm flex items-center justify-center transform -rotate-12">
            <span className="text-white text-[10px] font-black italic">S</span>
          </div>
          <span className="tracking-tight">StockPulse</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 text-[14px] text-slate-500 font-medium">
          <a href="#" className="hover:text-slate-900 transition-colors" onClick={(e) => {e.preventDefault(); setShowAbout(true)}}>Features</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Enterprise</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Download</a>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={onLogin} className="bg-slate-900 text-white text-[14px] font-semibold px-5 py-2.5 rounded-full hover:bg-slate-800 flex items-center gap-2 group transition-all">
            Log-in <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="pt-12 space-y-10">
            <div className="space-y-6">
              <h1 className="text-[72px] font-bold text-slate-900 leading-[1.1] tracking-tight">
                Ditch the Paper, <br />
                <span className="italic font-serif font-medium text-slate-800">Master Inventory.</span>
              </h1>
              <p className="text-[17px] text-slate-500 leading-relaxed max-w-lg font-medium">
                StockPulse is the all-in-one digital system for retailers and wholesalers. 
                Stop manual counting and start gaining accurate, real-time insights into 
                your stock levels and valuation in one powerful space.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={onLogin} className="bg-slate-900 text-white font-bold px-8 py-4 rounded-full text-[15px] hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
                Get Started <ArrowRight size={18} />
              </button>
              <button onClick={() => setShowAbout(true)} className="bg-white border border-slate-200 text-slate-600 font-bold px-8 py-4 rounded-full text-[15px] hover:bg-slate-50 transition-colors">
                Learn About Us
              </button>
            </div>

            <div className="pt-8 space-y-3 border-t border-slate-100 max-w-sm">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
                <Star size={16} fill="currentColor" stroke="none" />
                <span className="ml-2 text-slate-900 font-bold text-sm">4.9/5</span>
              </div>
              <p className="text-slate-400 text-[13px] font-medium">on Product Hunt, G2, and Capterra</p>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                Trusted by 12,000+ creators, developers, and startups in over 40 countries. <a href="#" onClick={(e) => {e.preventDefault(); setShowAbout(true)}} className="text-slate-900 underline underline-offset-4 decoration-slate-300 font-bold">See Stories →</a>
              </p>
            </div>
          </div>

          {/* Interactive Hand-drawn Sketch Style Illustration */}
          <div className="relative lg:pt-20">
            <svg viewBox="0 0 600 500" className="w-full h-auto drop-shadow-sm select-none">
              <ellipse cx="300" cy="420" rx="250" ry="40" fill="url(#grad1)" opacity="0.1" />
              <defs>
                <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" style={{stopColor:'rgb(0,0,0)', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'rgb(255,255,255)', stopOpacity:0}} />
                </radialGradient>
              </defs>

              <g stroke="#1a1a1a" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Main Machine Body */}
                <path d="M430,300 L560,300 L560,430 L430,430 Z" fill="#ffffff" />
                <path d="M560,300 L580,285 L580,415 L560,430" fill="#fcfcfc" />
                <path d="M430,300 L450,285 L580,285" />
                
                {/* Details on Machine */}
                <circle cx="455" cy="325" r="10" className="animate-pulse" />
                <path d="M455,320 L455,325 L460,325" />
                <rect x="475" y="320" width="30" height="4" rx="2" />
                <rect x="475" y="330" width="20" height="4" rx="2" />
                
                {/* The "Brain" or Processor */}
                <rect x="525" y="315" width="20" height="20" rx="4" fill="#1e3a8a" />
                <text x="531" y="330" fill="white" stroke="none" fontSize="12" fontWeight="bold" className="animate-pulse">S</text>
                
                {/* Dashboard Screen Area */}
                <rect x="490" y="360" width="45" height="45" rx="4" fill="#f8f8f8" />
                <path d="M495,370 L530,370 M495,380 L520,380 M495,390 L525,390" strokeWidth="1.5" className="animate-pulse" />
                
                {/* Exhaust/Outputs */}
                <path d="M580,350 L600,350 L600,390 L590,390" />
                <rect x="585" y="390" width="10" height="25" rx="2" className="animate-bounce" />

                {/* The Conveyor Belt Structure */}
                <path d="M160,320 L430,320 M160,345 L430,345" />
                <path d="M160,320 L160,360 L430,360" />
                <path d="M180,360 L180,390 M280,360 L280,390 M380,360 L380,395" />
                
                {/* ANIMATED PACKAGES: Moving into the computer */}
                {/* Package Group 1 */}
                <g className="animate-entry-machine" style={{ animationDelay: '0s' }}>
                  <rect x="200" y="275" width="40" height="45" rx="2" fill="white" className="animate-bob" />
                  <path d="M210,285 L230,285 M210,295 L225,295" strokeWidth="1.5" />
                  <circle cx="220" cy="245" r="8" fill="#1e3a8a" stroke="none" />
                </g>

                {/* Package Group 2 */}
                <g className="animate-entry-machine" style={{ animationDelay: '1.3s' }}>
                  <rect x="280" y="265" width="50" height="55" rx="2" fill="white" className="animate-bob" style={{ animationDelay: '0.5s' }} />
                  <circle cx="305" cy="292" r="10" stroke="#1e3a8a" />
                  <path d="M300,292 L303,295 L310,288" strokeWidth="2" stroke="#1e3a8a" />
                  <rect x="295" y="235" width="20" height="15" rx="2" fill="#e2e8f0" stroke="none" />
                </g>

                {/* Package Group 3 */}
                <g className="animate-entry-machine" style={{ animationDelay: '2.6s' }}>
                  <rect x="360" y="280" width="35" height="40" rx="2" fill="white" className="animate-bob" style={{ animationDelay: '1s' }} />
                  <path d="M365,290 L390,290 M365,300 L385,300" strokeWidth="1.5" />
                  <path d="M365,245 L390,245 L377,225 Z" fill="#1e3a8a" stroke="none" />
                </g>

                {/* The Monitor Interface */}
                <rect x="450" y="215" width="85" height="65" rx="6" fill="white" strokeWidth="3" className="animate-bob" />
                <path d="M460,260 L475,235 L490,250 L515,225 L525,240" stroke="#1e3a8a" strokeWidth="4" className="animate-pulse" />
                <path d="M485,280 L480,300 M505,280 L510,300" strokeWidth="2" />
                
                {/* Excitement Action Lines */}
                <g className="animate-pulse">
                  <path d="M440,220 L425,210" strokeWidth="1" />
                  <path d="M445,200 L435,185" strokeWidth="1" />
                  <path d="M545,225 L560,215" strokeWidth="1" />
                  <path d="M540,205 L555,190" strokeWidth="1" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <footer className="bg-slate-50 border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="text-[14px] font-bold tracking-widest text-slate-400">TRUSTED BY</div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            <div className="text-xl font-black text-slate-800 tracking-tighter italic">LogisticsCo</div>
            <div className="text-xl font-bold text-slate-800">FreshDaily</div>
            <div className="text-xl font-serif text-slate-800">WAREHOUSE.OS</div>
            <div className="text-xl font-mono font-black text-slate-800">SHIPIT</div>
            <div className="text-xl font-bold italic text-slate-800">R•Supply</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
