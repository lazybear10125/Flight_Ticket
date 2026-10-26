import React, { useState, useEffect, useRef } from 'react';
import { Plane, ChevronUp, Gauge, Compass } from 'lucide-react';

export default function ScrollFlightIndicator() {
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [smoothAltitude, setSmoothAltitude] = useState(0);
  const [smoothSpeed, setSmoothSpeed] = useState(0);
  const [pitchAngle, setPitchAngle] = useState(0);
  const [isActivelyCruising, setIsActivelyCruising] = useState(false);
  const [showHUD, setShowHUD] = useState(false);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const currentVelocity = useRef(0);
  const animFrameId = useRef(null);
  const idleTimeout = useRef(null);

  useEffect(() => {
    // 1. Capture raw scroll target
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, currentScrollY / docHeight)) : 0;
      targetProgress.current = progress;

      setIsActivelyCruising(true);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => {
        setIsActivelyCruising(false);
      }, 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Physics animation loop with Lerp & Momentum
    const updatePhysics = () => {
      // Aerodynamic interpolation (Lerp with dampening factor 0.08)
      const prevProgress = currentProgress.current;
      const diff = targetProgress.current - currentProgress.current;
      
      currentProgress.current += diff * 0.085;
      currentVelocity.current = currentProgress.current - prevProgress;

      const progress = currentProgress.current;
      setSmoothProgress(progress);

      // Smooth aerodynamic bank/pitch tilt:
      // When scrolling down, plane banks down (positive pitch); when scrolling up, banks up.
      // Velocity is typically around 0.001 - 0.015. Multiply by 600 for natural degrees.
      const rawTilt = currentVelocity.current * 750;
      const clampedTilt = Math.max(-18, Math.min(18, rawTilt));
      setPitchAngle(clampedTilt);

      // Smooth altitude calculation: 0 -> 36,000 FT -> 0 (descent at end of page)
      const targetAlt = Math.round(
        progress < 0.15
          ? (progress / 0.15) * 28000
          : progress < 0.85
          ? 28000 + Math.sin((progress - 0.15) / 0.7 * Math.PI) * 8000
          : (1 - (progress - 0.85) / 0.15) * 36000
      );
      setSmoothAltitude(prev => Math.round(prev + (targetAlt - prev) * 0.1));

      // Smooth speed calculation (cruising 860 km/h)
      const targetSpd = Math.abs(currentVelocity.current) > 0.0003 ? 880 : 720;
      setSmoothSpeed(prev => Math.round(prev + (targetSpd - prev) * 0.05));

      animFrameId.current = requestAnimationFrame(updatePhysics);
    };

    animFrameId.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* 1. TOP HORIZONTAL FLIGHT PATH WITH SILKY GLIDING JET */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-200/40 backdrop-blur-xs pointer-events-none"
        onMouseEnter={() => setShowHUD(true)}
        onMouseLeave={() => setShowHUD(false)}
      >
        {/* Soft Glowing Gradient Trail */}
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 relative will-change-transform shadow-[0_0_8px_rgba(56,189,248,0.5)]"
          style={{ width: `${smoothProgress * 100}%` }}
        >
          {/* Plane Container with Organic Rotation & Smooth Translation */}
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 pointer-events-auto cursor-pointer group"
            style={{
              transform: `translate(50%, -50%) rotate(${pitchAngle * 0.6}deg)`
            }}
            title="Đang bay theo tiến trình trang - Bấm để về đầu trang"
            onClick={scrollToTop}
          >
            {/* Jet Engine Soft Afterburner Flame */}
            {isActivelyCruising && (
              <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-opacity duration-300">
                <span className="w-4 h-1.5 bg-gradient-to-l from-amber-400 via-sky-300 to-transparent rounded-full animate-jet-flame opacity-90 shadow-[0_0_6px_#38bdf8]" />
              </div>
            )}

            {/* Jet Airplane Icon */}
            <div className="w-6 h-6 rounded-full bg-white shadow-md border border-sky-300/80 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 ease-out">
              <Plane className="w-3.5 h-3.5 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MINIMALIST & REFINED VERTICAL FLIGHT HUD (Right side) */}
      <div className="hidden lg:flex fixed right-5 bottom-8 z-40 flex-col items-end gap-2 select-none">
        
        {/* Flight HUD telemetry badge */}
        <div 
          className={`bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-200/80 text-xs font-mono transition-all duration-500 ease-out flex items-center gap-3 ${
            isActivelyCruising || showHUD || smoothProgress > 0.1
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
          }`}
          onMouseEnter={() => setShowHUD(true)}
          onMouseLeave={() => setShowHUD(false)}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '14s' }} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Độ cao bay</div>
              <div className="text-xs font-black text-slate-800">
                {smoothAltitude > 0 ? `${smoothAltitude.toLocaleString()} FT` : 'Mặt đất'}
              </div>
            </div>
          </div>

          <div className="w-px h-6 bg-slate-200" />

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Lộ trình</div>
            <div className="text-xs font-black text-blue-600">
              {Math.round(smoothProgress * 100)}%
            </div>
          </div>
        </div>

        {/* Floating Return-To-Top Jet Button */}
        {smoothProgress > 0.08 && (
          <button
            onClick={scrollToTop}
            title="Bay vút về đầu trang"
            className="group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 animate-in fade-in zoom-in-75"
          >
            <Plane className="w-4 h-4 -rotate-45 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            <span>Về đầu trang</span>
            <ChevronUp className="w-3.5 h-3.5 opacity-70 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        )}

      </div>
    </>
  );
}
