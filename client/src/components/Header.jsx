import React from 'react';
import { Plane, Phone, Search, ShieldCheck, Ticket, Sparkles } from 'lucide-react';

export default function Header({ onOpenLookup, onGoHome }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={onGoHome}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Plane className="w-7 h-7 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-900 via-blue-700 to-sky-600 bg-clip-text text-transparent">
                  BAYVIET
                </span>
                <span className="text-xs uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  Air
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-wider uppercase">
                Hệ thống đặt vé máy bay trực tuyến
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button 
              onClick={onGoHome}
              className="text-blue-600 hover:text-blue-700 transition flex items-center gap-1.5"
            >
              <Plane className="w-4 h-4" />
              Đặt vé máy bay
            </button>
            <a 
              href="#promotions" 
              className="hover:text-blue-600 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Ưu đãi & Khuyến mãi
            </a>
            <a 
              href="#destinations" 
              className="hover:text-blue-600 transition"
            >
              Điểm đến hot
            </a>
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
              Bảo đảm giá tốt
            </div>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Lookup booking */}
            <button
              onClick={onOpenLookup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-sm font-semibold transition shadow-xs"
            >
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">Tra cứu vé</span>
            </button>

            {/* Hotline 24/7 */}
            <a 
              href="tel:19006868"
              className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-pulse">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block leading-tight">Hotline 24/7</span>
                <span className="font-bold text-slate-800">1900 6868</span>
              </div>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
