import React, { useState, useEffect } from 'react';
import AirlinerSVG from './AirlinerSVG';
import { Plane, Sparkles, ArrowRight } from 'lucide-react';

export default function IntroScreen({ onFinish }) {
  // Animation phases: 'ALIGN' (0-700ms) -> 'TAKEOFF' (700-1900ms) -> 'FADE_OUT' (1900-2400ms)
  const [phase, setPhase] = useState('ALIGN');
  const [statusText, setStatusText] = useState('Chuẩn bị cất cánh tại đường băng 07L...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress counter
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    // Sequence timing
    const t1 = setTimeout(() => {
      setPhase('TAKEOFF');
      setStatusText('Tăng tốc phản lực • Đạt vận tốc cất cánh 290 km/h');
    }, 800);

    const t2 = setTimeout(() => {
      setPhase('FADE_OUT');
      setStatusText('Cất cánh thành công • Chào mừng bạn đến với BayViet Air');
    }, 2000);

    const t3 = setTimeout(() => {
      onFinish();
    }, 2600);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white select-none transition-all duration-700 ease-in-out ${
        phase === 'FADE_OUT' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Runway Perspective & Starlight Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Converging Runway Perspective Lines */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-3/4 flex justify-center">
          {/* Center runway centerline dashes */}
          <div className="w-1 h-full bg-gradient-to-t from-amber-400 via-amber-200 to-transparent flex flex-col justify-between py-4 opacity-75">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="w-1 h-8 bg-white/90 rounded-full" />
            ))}
          </div>

          {/* Left runway edge lights */}
          <div className="absolute left-1/4 bottom-0 top-1/3 w-px bg-gradient-to-t from-emerald-400 via-sky-300 to-transparent flex flex-col justify-between py-2 opacity-60">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 -ml-0.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            ))}
          </div>

          {/* Right runway edge lights */}
          <div className="absolute right-1/4 bottom-0 top-1/3 w-px bg-gradient-to-t from-emerald-400 via-sky-300 to-transparent flex flex-col justify-between py-2 opacity-60">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 -ml-0.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            ))}
          </div>
        </div>

        {/* Ambient celestial blue glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Brand Logo Banner */}
      <div className="relative z-10 pt-16 flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Plane className="w-7 h-7 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black tracking-widest bg-gradient-to-r from-white via-sky-200 to-blue-300 bg-clip-text text-transparent">
                BAYVIET
              </span>
              <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-blue-500/30 text-sky-300 border border-blue-400/30">
                Air
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
              Hệ thống đặt vé máy bay trực tuyến
            </p>
          </div>
        </div>
      </div>

      {/* Center Cinematic Aircraft Takeoff Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full">
        
        {/* The Aircraft with Takeoff Physics */}
        <div 
          className="transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-1000 will-change-transform"
          style={{
            transform: phase === 'ALIGN'
              ? 'translateY(40px) scale(0.9) rotate(0deg)'
              : phase === 'TAKEOFF'
              ? 'translateY(-140px) scale(1.35) rotate(-4deg)'
              : 'translateY(-380px) scale(1.8) rotate(-8deg)',
            opacity: phase === 'FADE_OUT' ? 0.3 : 1
          }}
        >
          {/* Twin glowing contrails behind */}
          <div className="relative">
            <AirlinerSVG 
              className="w-32 h-32 drop-shadow-[0_20px_35px_rgba(56,189,248,0.4)]"
              airlineColor="#2563eb"
              showContrails={phase !== 'ALIGN'}
              isCruising={phase !== 'ALIGN'}
            />

            {/* Jet Heat Distortion Wave */}
            {phase !== 'ALIGN' && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-16 h-12 bg-gradient-to-b from-sky-400/40 via-cyan-400/20 to-transparent blur-md rounded-full pointer-events-none animate-pulse" />
            )}
          </div>
        </div>

        {/* Telemetry info line */}
        <div className="mt-8 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-sky-300 font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{statusText}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-56 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300 transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>

      {/* Bottom Controls (Skip action) */}
      <div className="relative z-10 pb-12 w-full max-w-4xl px-8 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono text-[11px] text-slate-400">
          Chuyến bay BV-2026 • Hệ thống đã sẵn sàng
        </span>

        <button
          onClick={onFinish}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition flex items-center gap-1.5 backdrop-blur-sm cursor-pointer hover:scale-105 active:scale-95"
        >
          <span>Vào trang ngay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
