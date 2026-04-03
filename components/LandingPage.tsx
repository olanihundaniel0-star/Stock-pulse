import React, { useState, useEffect, useRef, useMemo, useCallback, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Star, ArrowRight, Package, ShieldCheck, Zap, BarChart3, Users, Globe } from 'lucide-react';

const buildKeyframes = (from: any, steps: any[]) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((s: any) => Object.keys(s))]);
  const keyframes: any = {};
  keys.forEach(k => { keyframes[k] = [from[k], ...steps.map((s: any) => s[k])]; });
  return keyframes;
};

const BlurText = ({ text = '', delay = 200, className = '', animateBy = 'words', direction = 'top', stepDuration = 0.35 }: any) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const from = useMemo(() => direction === 'top'
    ? { filter: 'blur(10px)', opacity: 0, y: -40 }
    : { filter: 'blur(10px)', opacity: 0, y: 40 }, [direction]);
  const to = useMemo(() => [
    { filter: 'blur(5px)', opacity: 0.5, y: direction === 'top' ? 5 : -5 },
    { filter: 'blur(0px)', opacity: 1, y: 0 }
  ], [direction]);
  const times = [0, 0.5, 1];
  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.map((segment: string, index: number) => (
        <motion.span
          className="inline-block will-change-[transform,filter,opacity]"
          key={index}
          initial={from}
          animate={inView ? buildKeyframes(from, to) : from}
          transition={{ duration: stepDuration * 2, times, delay: (index * delay) / 1000 }}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </p>
  );
};

interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
}

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true], [0, 0, 1, 0, 60, true], [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true], [0, 0, 15, 0, 30, true], [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false], [0, 0, 3, 0, 50, false], [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false], [0, 0, 25, 2, 20, false], [0, 0, 50, 2, 10, false],
  ];
  return layers.map(([x, y, blur, spread, alpha, inset]) => {
    const a = Math.min(alpha * intensity, 100);
    return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
  }).join(', ');
}

function easeOutCubic(x: number) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x: number) { return x * x * x; }

interface AnimateOpts {
  start?: number; end?: number; duration?: number; delay?: number;
  ease?: (t: number) => number; onUpdate: (v: number) => void; onEnd?: () => void;
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }: AnimateOpts) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#060010',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorAngle, setCursorAngle] = useState(45);
  const [edgeProximity, setEdgeProximity] = useState(0);
  const [sweepActive, setSweepActive] = useState(false);

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setEdgeProximity(getEdgeProximity(card, x, y));
    setCursorAngle(getCursorAngle(card, x, y));
  }, [getEdgeProximity, getCursorAngle]);

  useEffect(() => {
    if (!animated) return;
    const angleStart = 110;
    const angleEnd = 465;
    setSweepActive(true);
    setCursorAngle(angleStart);

    animateValue({ duration: 500, onUpdate: v => setEdgeProximity(v / 100) });
    animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: v => {
      setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart);
    }});
    animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: v => {
      setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart);
    }});
    animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
      onUpdate: v => setEdgeProximity(v / 100),
      onEnd: () => setSweepActive(false),
    });
  }, [animated]);

  const colorSensitivity = edgeSensitivity + 20;
  const isVisible = isHovered || sweepActive;
  const borderOpacity = isVisible
    ? Math.max(0, (edgeProximity * 100 - colorSensitivity) / (100 - colorSensitivity))
    : 0;
  const glowOpacity = isVisible
    ? Math.max(0, (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity))
    : 0;

  const meshGradients = buildMeshGradients(colors);
  const borderBg = meshGradients.map(g => `${g} border-box`);
  const fillBg = meshGradients.map(g => `${g} padding-box`);
  const angleDeg = `${cursorAngle.toFixed(3)}deg`;

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={`relative grid isolate border border-white/15 ${className}`}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: 'translate3d(0, 0, 0.01px)',
        boxShadow: 'rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px, rgba(0,0,0,0.1) 0 8px 16px, rgba(0,0,0,0.1) 0 16px 32px, rgba(0,0,0,0.1) 0 32px 64px',
      }}
    >
      <div
        className="absolute inset-0 rounded-[inherit] -z-[1]"
        style={{
          border: '1px solid transparent',
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
            ...borderBg,
          ].join(', '),
          opacity: borderOpacity,
          maskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out',
        }}
      />

      <div
        className="absolute inset-0 rounded-[inherit] -z-[1]"
        style={{
          border: '1px solid transparent',
          background: fillBg.join(', '),
          maskImage: [
            'linear-gradient(to bottom, black, black)',
            'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
            'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
            `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
          ].join(', '),
          WebkitMaskImage: [
            'linear-gradient(to bottom, black, black)',
            'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
            'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
            `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
          ].join(', '),
          maskComposite: 'subtract, add, add, add, add, add',
          WebkitMaskComposite: 'source-out, source-over, source-over, source-over, source-over, source-over',
          opacity: borderOpacity * fillOpacity,
          mixBlendMode: 'soft-light',
          transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out',
        } as React.CSSProperties}
      />

      <span
        className="absolute pointer-events-none z-[1] rounded-[inherit]"
        style={{
          inset: `${-glowRadius}px`,
          maskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          opacity: glowOpacity,
          mixBlendMode: 'plus-lighter',
          transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out',
        } as React.CSSProperties}
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: buildBoxShadow(glowColor, glowIntensity),
          }}
        />
      </span>

      <div className="flex flex-col relative overflow-auto z-[1]">
        {children}
      </div>
    </div>
  );
};

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
            <BlurText
              text="The Future of Inventory Intelligence"
              delay={100}
              animateBy="words"
              direction="top"
              stepDuration={0.35}
              className="text-5xl font-extrabold text-slate-900 tracking-tight justify-center"
            />
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
            <button onClick={onLogin} className="bg-white text-slate-900 font-bold px-10 py-4 rounded-full text-lg hover:bg-slate-100 transition-all inline-flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95">
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
