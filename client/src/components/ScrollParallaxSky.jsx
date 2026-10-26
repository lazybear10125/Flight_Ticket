import React, { useEffect, useState, useRef } from 'react';
import { Plane } from 'lucide-react';

export default function ScrollParallaxSky() {
  const containerRef = useRef(null);
  const [planePositionX, setPlanePositionX] = useState(15); // in percentage (0 to 100)
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    let animId;
    let time = 0;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Section scroll visibility factor (0 when entering bottom, 1 when exiting top)
      const totalDistance = windowHeight + rect.height;
      const currentPassed = windowHeight - rect.top;
      const factor = Math.min(1, Math.max(0, currentPassed / totalDistance));

      // Smooth horizontal progress from -10% to 105%
      const targetX = -10 + factor * 115;
      setPlanePositionX(targetX);
    };

    const animateWave = () => {
      time += 0.03;
      // Gentle atmospheric bobbing (sin wave)
      setWaveOffset(Math.sin(time) * 4);
      animId = requestAnimationFrame(animateWave);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animId = requestAnimationFrame(animateWave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-16 overflow-hidden pointer-events-none my-6 select-none opacity-50 hover:opacity-85 transition-opacity duration-300"
    >
      {/* Soft dashed flight corridor baseline */}
      <div className="absolute top-1/2 left-0 right-0 h-px border-b border-dashed border-blue-200/60" />

      {/* Commercial Jet Airliner gliding horizontally */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 flex items-center will-change-transform transition-transform duration-200 ease-out"
        style={{
          left: `${planePositionX}%`,
          transform: `translate(-50%, calc(-50% + ${waveOffset}px)) rotate(${waveOffset * 0.5}deg)`
        }}
      >
        {/* Soft Vapor contrail fading behind */}
        <div className="w-56 h-[1.5px] bg-gradient-to-r from-transparent via-sky-300/30 to-blue-500/50 rounded-full blur-[0.5px]" />

        {/* Airplane Badge */}
        <div className="flex items-center gap-1.5 text-blue-700 bg-white/85 px-2.5 py-1 rounded-full shadow-sm border border-blue-100 backdrop-blur-xs">
          <Plane className="w-4 h-4 rotate-90 text-blue-600" />
          <span className="text-[10px] font-mono font-bold text-slate-700 tracking-wider">
            VN-A350 • 35,000 FT
          </span>
        </div>
      </div>
    </div>
  );
}
