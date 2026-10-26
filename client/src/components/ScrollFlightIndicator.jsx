import React, { useState, useEffect, useRef } from 'react';
import AirlinerSVG from './AirlinerSVG';
import { Gauge, Compass, ChevronUp, Wind } from 'lucide-react';

export default function ScrollFlightIndicator() {
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [smoothAltitude, setSmoothAltitude] = useState(0);
  const [smoothSpeed, setSmoothSpeed] = useState(0);
  const [pitchAngle, setPitchAngle] = useState(0);
  const [isActivelyCruising, setIsActivelyCruising] = useState(false);
  const [isSuperBoost, setIsSuperBoost] = useState(false);
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
      }, 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Physics animation loop with Smooth Damping (Lerp = 0.08)
    const updatePhysics = () => {
      const prevProgress = currentProgress.current;
      const diff = targetProgress.current - currentProgress.current;
      
      currentProgress.current += diff * 0.085;
      currentVelocity.current = currentProgress.current - prevProgress;

      const progress = currentProgress.current;
      setSmoothProgress(progress);

      // Natural aerodynamic bank/tilt:
      // When scrolling down (positive velocity), plane pitches down slightly (-10deg to 15deg)
      const rawTilt = currentVelocity.current * 650;
      const clampedTilt = Math.max(-16, Math.min(16, rawTilt));
      setPitchAngle(clampedTilt);

      // Smooth altitude calculation:
      // From 0 to 36,000 FT at cruising altitude
      const targetAlt = Math.round(
        progress < 0.12
          ? (progress / 0.12) * 26000
          : progress < 0.88
          ? 26000 + Math.sin((progress - 0.12) / 0.76 * Math.PI) * 10000
          : (1 - (progress - 0.88) / 0.12) * 36000
      );
      setSmoothAltitude(prev => Math.round(prev + (targetAlt - prev) * 0.08));

      // Speed calculation (840 - 920 KM/H when cruising)
      const targetSpd = Math.abs(currentVelocity.current) > 0.0002 ? 890 : 740;
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

  const handleReturnToTop = () => {
    setIsSuperBoost(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setTimeout(() => {
      setIsSuperBoost(false);
    }, 1200);
  };

  return (
    <>
      {/* 1. TOP MINIMALIST AIRLINE FLIGHT LINE */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-200/30 backdrop-blur-xs pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-blue-700 via-sky-400 to-cyan-300 relative will-change-transform shadow-[0_0_10px_rgba(56,189,248,0.6)] transition-all duration-75"
          style={{ width: `${smoothProgress * 100}%` }}
        >
          {/* Glowing pulse at the leading tip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#38bdf8]" />
        </div>
      </div>

      {/* 2. DELUXE 3D FLYING JET COMPANION (Fixed Right Screen Edge) */}
      <div 
        className="fixed right-6 bottom-8 z-40 flex flex-col items-end gap-3 select-none"
        onMouseEnter={() => setShowHUD(true)}
        onMouseLeave={() => setShowHUD(false)}
      >
        {/* Cockpit Flight Deck Telemetry Ribbon */}
        <div 
          className={`bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-blue-500/30 text-xs font-mono transition-all duration-400 ease-out flex items-center gap-4 ${
            isActivelyCruising || showHUD || smoothProgress > 0.08
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
          }`}
        >
          {/* Compass & Callsign */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-sky-400 flex items-center justify-center shrink-0 border border-blue-400/20">
              <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '18s' }} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Chuyến bay BV-2026</div>
              <div className="text-xs font-black text-cyan-300">
                {smoothAltitude > 1000 ? `${smoothAltitude.toLocaleString()} FT` : 'Đang cất cánh'}
              </div>
            </div>
          </div>

          <div className="w-px h-7 bg-slate-700/80" />

          {/* Speed & Progress */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Vận tốc</div>
            <div className="text-xs font-bold text-amber-400">{smoothSpeed} KM/H</div>
          </div>

          <div className="w-px h-7 bg-slate-700/80" />

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Lộ trình</div>
            <div className="text-xs font-black text-emerald-400">{Math.round(smoothProgress * 100)}%</div>
          </div>
        </div>

        {/* The Interactive Flying Airliner */}
        <div 
          onClick={handleReturnToTop}
          title="Nhấn để vút bay về đầu trang!"
          className="group relative cursor-pointer p-2 flex flex-col items-center"
        >
          {/* The Aircraft Body with Aerodynamic Pitch & Supersonic Boost */}
          <div 
            className="transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform: isSuperBoost
                ? 'translateY(-30px) rotate(-35deg) scale(1.25)'
                : `rotate(${pitchAngle}deg) translateY(${isActivelyCruising ? -4 : 0}px)`
            }}
          >
            <AirlinerSVG 
              className="w-20 h-20 group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_24px_rgba(37,99,235,0.3)]" 
              airlineColor="#2563eb"
              showContrails={isActivelyCruising || isSuperBoost}
              isCruising={isActivelyCruising || isSuperBoost}
            />
          </div>

          {/* Return-to-top Pill Label */}
          {smoothProgress > 0.1 && (
            <button
              onClick={handleReturnToTop}
              className="mt-1 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md hover:bg-blue-600 hover:text-white border border-slate-200 text-slate-700 font-bold text-[10px] shadow-md flex items-center gap-1 transition-all duration-200 group-hover:scale-105 active:scale-95"
            >
              <ChevronUp className="w-3 h-3 text-blue-600 group-hover:text-white transition-colors" />
              <span>Về đầu trang</span>
            </button>
          )}
        </div>

      </div>
    </>
  );
}
