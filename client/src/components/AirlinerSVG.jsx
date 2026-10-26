import React from 'react';

/**
 * High-fidelity 3D-styled commercial passenger jet SVG
 * Perspective: Top-down / 3/4 isometric aerodynamic view
 */
export default function AirlinerSVG({ 
  className = "w-16 h-16", 
  airlineColor = "#2563eb",
  showContrails = true,
  isCruising = false
}) {
  return (
    <div className={`relative inline-block ${className} select-none pointer-events-none`}>
      {/* Contrails / Vapor trails from twin jet engines */}
      {showContrails && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex justify-between w-8 opacity-70">
          {/* Left engine trail */}
          <div className="w-[1.5px] h-12 bg-gradient-to-b from-cyan-400 via-sky-300/60 to-transparent blur-[0.5px] animate-vapor-trail" />
          {/* Right engine trail */}
          <div className="w-[1.5px] h-12 bg-gradient-to-b from-cyan-400 via-sky-300/60 to-transparent blur-[0.5px] animate-vapor-trail" style={{ animationDelay: '0.1s' }} />
        </div>
      )}

      {/* Jet engine afterburner glow when actively cruising */}
      {isCruising && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex justify-between w-7 z-0">
          <span className="w-1.5 h-3 bg-gradient-to-b from-cyan-300 via-amber-400 to-transparent rounded-full animate-jet-flame blur-[0.5px]" />
          <span className="w-1.5 h-3 bg-gradient-to-b from-cyan-300 via-amber-400 to-transparent rounded-full animate-jet-flame blur-[0.5px]" style={{ animationDelay: '0.08s' }} />
        </div>
      )}

      {/* Main Airplane SVG */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(15,23,42,0.25)] relative z-10"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow layer underneath */}
        <ellipse cx="50" cy="55" rx="42" ry="22" fill="rgba(0,0,0,0.12)" filter="blur(4px)" />

        {/* Wings - Swept Back Aerodynamic */}
        <path 
          d="M 50 42 L 95 62 L 92 67 L 54 54 L 54 75 L 68 83 L 66 86 L 50 80 L 34 86 L 32 83 L 46 75 L 46 54 L 8 67 L 5 62 Z" 
          fill="#f1f5f9" 
          stroke="#cbd5e1" 
          strokeWidth="1"
        />

        {/* Wing accents / Flaps in airline color */}
        <path d="M 60 56 L 90 65 L 88 67 L 58 58 Z" fill={airlineColor} opacity="0.85" />
        <path d="M 40 56 L 10 65 L 12 67 L 42 58 Z" fill={airlineColor} opacity="0.85" />

        {/* Wingtips / Winglets (Sharklets) */}
        <path d="M 95 62 L 97 56 L 94 62 Z" fill={airlineColor} />
        <path d="M 5 62 L 3 56 L 6 62 Z" fill={airlineColor} />

        {/* Jet Engine Pods (Left & Right) */}
        <ellipse cx="36" cy="57" rx="3.5" ry="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
        <ellipse cx="36" cy="53" rx="2.5" ry="3" fill="#334155" />
        <ellipse cx="64" cy="57" rx="3.5" ry="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
        <ellipse cx="64" cy="53" rx="2.5" ry="3" fill="#334155" />

        {/* Fuselage / Main Body */}
        <path 
          d="M 50 8 C 55 18, 55 35, 55 70 C 55 78, 52 88, 50 92 C 48 88, 45 78, 45 70 C 45 35, 45 18, 50 8 Z" 
          fill="url(#fuselageGrad)" 
          stroke="#94a3b8" 
          strokeWidth="0.8"
        />

        {/* Cockpit Windshield */}
        <path 
          d="M 47 16 C 48 14, 52 14, 53 16 C 54 18, 53 19, 50 19 C 47 19, 46 18, 47 16 Z" 
          fill="#0f172a" 
        />

        {/* Fuselage Airline Livery Stripe */}
        <path d="M 46 35 Q 50 38 54 35 L 54 44 Q 50 46 46 44 Z" fill={airlineColor} opacity="0.9" />

        {/* Vertical Tail Fin (Vertical Stabilizer) */}
        <path 
          d="M 49 72 L 51 72 L 52 88 L 48 88 Z" 
          fill={airlineColor} 
          stroke="#1e3a8a" 
          strokeWidth="0.5" 
        />

        {/* Cabin Window Pinhole Lights */}
        {[24, 28, 32, 48, 52, 56, 60, 64].map((y) => (
          <g key={y}>
            <circle cx="47" cy={y} r="0.6" fill="#38bdf8" />
            <circle cx="53" cy={y} r="0.6" fill="#38bdf8" />
          </g>
        ))}

        {/* Gradients */}
        <defs>
          <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="35%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
