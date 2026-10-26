import React, { useState, useEffect } from 'react';
import { Plane, Zap, CheckCircle2, X } from 'lucide-react';

const NOTIFICATIONS = [
  { name: 'Anh Nguyễn V. T.', from: 'Hà Nội (HAN)', to: 'Phú Quốc (PQC)', airline: 'Vietnam Airlines', time: '1 phút trước' },
  { name: 'Chị Lê Thị H.', from: 'TP.HCM (SGN)', to: 'Đà Nẵng (DAD)', airline: 'Vietjet Air', time: 'Vừa xong' },
  { name: 'Anh Trần Quốc B.', from: 'Hà Nội (HAN)', to: 'TP.HCM (SGN)', airline: 'Bamboo Airways', time: '3 phút trước' },
  { name: 'Chị Phạm Mai A.', from: 'TP.HCM (SGN)', to: 'Bangkok (BKK)', airline: 'Vietravel Airlines', time: '5 phút trước' },
  { name: 'Anh Đỗ Minh K.', from: 'Hà Nội (HAN)', to: 'Nha Trang (CXR)', airline: 'Vietnam Airlines', time: 'Vừa xong' },
  { name: 'Gia đình chị Vy', from: 'Đà Nẵng (DAD)', to: 'Hà Nội (HAN)', airline: 'Bamboo Airways', time: '2 phút trước' }
];

export default function LiveBookingTicker() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;

    const interval = setInterval(() => {
      // Fade out
      setVisible(false);
      setTimeout(() => {
        // Switch next
        setCurrentIdx(prev => (prev + 1) % NOTIFICATIONS.length);
        setVisible(true);
      }, 500);
    }, 7000);

    return () => clearInterval(interval);
  }, [closed]);

  if (closed) return null;

  const notif = NOTIFICATIONS[currentIdx];

  return (
    <div 
      className={`fixed bottom-6 left-6 z-40 transition-all duration-500 transform ${
        visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-blue-100 flex items-center gap-3.5 max-w-sm relative group hover:shadow-blue-500/20">
        
        {/* Pulsing beacon & avatar */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
        </div>

        {/* Content */}
        <div className="text-left text-xs pr-4">
          <div className="font-extrabold text-slate-800 flex items-center gap-1.5 leading-tight">
            <span>{notif.name}</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
              Đã đặt vé
            </span>
          </div>

          <div className="text-slate-600 font-medium mt-0.5 text-[11px]">
            {notif.from} ➔ {notif.to}
          </div>

          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
            <span className="font-semibold text-blue-600">{notif.airline}</span>
            <span>•</span>
            <span>{notif.time}</span>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setClosed(true)}
          className="absolute top-2 right-2 text-slate-300 hover:text-slate-600 transition"
          title="Đóng thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
}
