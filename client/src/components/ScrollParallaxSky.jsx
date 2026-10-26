import React, { useEffect, useState, useRef } from 'react';
import AirlinerSVG from './AirlinerSVG';
import { Cloud } from 'lucide-react';

export default function ScrollParallaxSky() {
  const containerRef = useRef(null);
  const [planePositionX, setPlanePositionX] = useState(15);
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    let animId;
    let time = 0;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Section scroll visibility factor (0 to 1)
      const totalDistance = windowHeight + rect.height;
      const currentPassed = windowHeight - rect.top;
      const factor = Math.min(1, Math.max(0, currentPassed / totalDistance));

      // Glide smoothly from -15% on left across to 110% on right
      const targetX = -15 + factor * 125;
      setPlanePositionX(targetX);
    };

    const animateWave = () => {
      time += 0.025;
      // Gentle atmospheric buoyancy bobbing (sine wave)
      setWaveOffset(Math.sin(time) * 5);
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
      className="relative w-full h-24 overflow-hidden pointer-events-none my-8 select-none opacity-85 transition-opacity duration-300"
    >
      {/* Background Soft Sky Corridor with subtle clouds */}
      <div className="absolute top-1/2 left-0 right-0 h-px border-b border-dashed border-blue-200/50" />
      <div className="absolute top-4 left-1/4 opacity-25">
        <Cloud className="w-16 h-16 text-blue-300 animate-cloud-slow" />
      </div>
      <div className="absolute bottom-2 right-1/3 opacity-20">
        <Cloud className="w-20 h-20 text-indigo-300 animate-cloud-slow" style={{ animationDelay: '10s' }} />
      </div>

      {/* Commercial Passenger Jet Airliner cruising through */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 flex items-center will-change-transform transition-transform duration-150 ease-out"
        style={{
          left: `${planePositionX}%`,
          transform: `translate(-50%, calc(-50% + ${waveOffset}px)) rotate(${90 + waveOffset * 0.4}deg)`
        }}
      >
        <AirlinerSVG 
          className="w-24 h-24 drop-shadow-[0_16px_32px_rgba(30,58,138,0.25)]"
          airlineColor="#004c8c"
          showContrails={true}
          isCruising={true}
        />
      </div>

      {/* Flight info tag floating near right corner */}
      <div className="absolute bottom-2 right-8 text-[11px] font-mono text-slate-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>RADAR 24/7 • ĐỘ CAO 35,000 FT</span>
      </div>
    </div>
  );
}
