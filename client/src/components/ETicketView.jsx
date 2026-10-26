import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Plane, 
  Printer, 
  Share2, 
  Download, 
  Calendar, 
  Clock, 
  Copy, 
  Sparkles, 
  ArrowRight,
  Luggage,
  ShieldCheck,
  Home
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatVND } from '../services/api';

export default function ETicketView({ booking, onNewBooking }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Multi-cannon celebration fireworks sequence
    const count = 200;
    const defaults = {
      origin: { y: 0.6 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    // Additional side cannons
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 }
      });
    }, 400);
  }, []);

  const copyBookingCode = () => {
    navigator.clipboard?.writeText(booking.bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const outbound = booking.outboundFlight;
  const paxList = booking.passengers || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      
      {/* Top Success Banner */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Đặt Vé Máy Bay Thành Công!
        </h2>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Mã đặt chỗ và vé điện tử đã được xác nhận thanh toán và gửi tới email{' '}
          <strong className="text-slate-900">{booking.contact?.email}</strong>.
        </p>

        {/* PNR Code Pill */}
        <div className="inline-flex items-center gap-3 mt-4 px-6 py-2.5 rounded-2xl bg-blue-50 border border-blue-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mã đặt chỗ (PNR):</span>
          <span className="font-mono text-xl font-black text-blue-700 tracking-wider">
            {booking.bookingCode}
          </span>
          <button
            onClick={copyBookingCode}
            className="p-1 rounded-lg hover:bg-blue-200 text-blue-700 transition"
            title="Sao chép mã đặt chỗ"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {copied && (
          <div className="text-xs text-emerald-600 font-bold mt-1">
            ✓ Đã sao chép mã đặt chỗ!
          </div>
        )}
      </div>

      {/* Action Bar (Print / Share / New Booking) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
        <button
          onClick={onNewBooking}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
        >
          <Home className="w-4 h-4" />
          <span>Đặt chuyến bay mới</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>In thẻ lên máy bay / Lưu PDF</span>
          </button>
        </div>
      </div>

      {/* Boarding Passes (One for each passenger) */}
      <div className="space-y-8">
        {paxList.map((pax, index) => {
          return (
            <div 
              key={pax.id || index}
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden print:shadow-none print:border-black"
            >
              {/* Header ribbon with Holographic Luxury Shimmer Effect */}
              <div 
                className="px-6 py-4 flex items-center justify-between text-white relative overflow-hidden group"
                style={{ backgroundColor: outbound?.airline?.color || '#004c8c' }}
              >
                {/* Holographic sweep overlay */}
                <div className="absolute inset-0 animate-shimmer pointer-events-none" />
                <div className="flex items-center gap-3">
                  <Plane className="w-6 h-6 -rotate-45" />
                  <div>
                    <h3 className="font-black text-base tracking-wide leading-tight uppercase">
                      {outbound?.airline?.name || 'Hàng không Quốc Gia'}
                    </h3>
                    <span className="text-[10px] text-white/80 font-mono">
                      THẺ LÊN MÁY BAY / BOARDING PASS
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-white/70 block">Hạng vé</span>
                  <span className="text-sm font-black uppercase">
                    {outbound?.cabinClass === 'business' ? 'Thương gia (Business)' : 'Phổ thông (Economy)'}
                  </span>
                </div>
              </div>

              {/* Main Ticket Body */}
              <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                
                {/* Left Ticket Details (8 cols) */}
                <div className="md:col-span-8 p-6 sm:p-8 space-y-6">
                  {/* Passenger Name & Flight Number */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Tên hành khách / Passenger Name
                      </span>
                      <span className="text-lg font-black text-slate-900 font-mono">
                        {pax.fullName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Số hiệu chuyến bay / Flight No.
                      </span>
                      <span className="text-lg font-black text-blue-700 font-mono">
                        {outbound?.flightNumber}
                      </span>
                    </div>
                  </div>

                  {/* Route & Times */}
                  <div className="grid grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Khởi hành (From)</span>
                      <span className="text-2xl font-black text-slate-900">{outbound?.origin?.code}</span>
                      <span className="text-xs text-slate-600 block">{outbound?.origin?.city}</span>
                      <span className="text-sm font-black text-blue-600 mt-1 block">{outbound?.origin?.time}</span>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">
                        {outbound?.durationText}
                      </span>
                      <div className="flex items-center justify-center">
                        <div className="w-full h-0.5 bg-slate-300 relative">
                          <Plane className="w-3.5 h-3.5 text-blue-600 absolute left-1/2 -top-1.5 -translate-x-1/2 rotate-90" />
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-1">Bay thẳng</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Đến (To)</span>
                      <span className="text-2xl font-black text-slate-900">{outbound?.destination?.code}</span>
                      <span className="text-xs text-slate-600 block">{outbound?.destination?.city}</span>
                      <span className="text-sm font-black text-blue-600 mt-1 block">{outbound?.destination?.time}</span>
                    </div>
                  </div>

                  {/* Gate, Boarding, Seat */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Cửa (Gate)</span>
                      <span className="text-base font-black text-slate-800 font-mono">08A</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Lên máy bay</span>
                      <span className="text-base font-black text-amber-600 font-mono">
                        {/* 40 mins prior */}
                        {outbound?.origin?.time}
                      </span>
                    </div>
                    <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                      <span className="text-[10px] text-blue-600 font-bold uppercase block">Số ghế (Seat)</span>
                      <span className="text-xl font-black text-blue-700 font-mono">
                        {pax.selectedSeat || pax.seat || '12A'}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Ngày bay</span>
                      <span className="text-xs font-bold text-slate-700 mt-1 block">
                        {outbound?.origin?.date}
                      </span>
                    </div>
                  </div>

                  {/* Add-on reminder */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
                    <span className="flex items-center gap-1 font-semibold">
                      <Luggage className="w-3.5 h-3.5 text-blue-600" />
                      Hành lý: {pax.extraBaggageKg || pax.baggageKg || 0}kg ký gửi
                    </span>
                    {pax.meal && pax.meal !== 'none' && (
                      <span className="text-amber-600 font-semibold">
                        Suất ăn: {pax.meal}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Tear-off Stub with Barcode & QR (4 cols) */}
                <div className="md:col-span-4 p-6 sm:p-8 bg-slate-50/70 flex flex-col items-center justify-between text-center relative border-dashed md:border-l-2 border-slate-300">
                  
                  {/* Decorative notch cutouts */}
                  <div className="hidden md:block absolute -left-3 -top-3 w-6 h-6 rounded-full bg-slate-100 border border-slate-300" />
                  <div className="hidden md:block absolute -left-3 -bottom-3 w-6 h-6 rounded-full bg-slate-100 border border-slate-300" />

                  <div className="w-full">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      MÃ QR CHECK-IN SÂN BAY
                    </span>

                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        `PNR:${booking.bookingCode}|PAX:${pax.fullName}|FLIGHT:${outbound?.flightNumber}|SEAT:${pax.selectedSeat || pax.seat || '12A'}`
                      )}`}
                      alt="Airport Checkin QR" 
                      className="w-36 h-36 mx-auto rounded-xl p-2 bg-white border border-slate-200 shadow-xs"
                    />

                    <span className="text-[10px] font-mono font-bold text-slate-500 block mt-2">
                      PNR: {booking.bookingCode}
                    </span>
                  </div>

                  <div className="w-full mt-4 pt-4 border-t border-slate-200 text-left text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trạng thái:</span>
                      <span className="text-emerald-600 font-black">ĐÃ XÁC NHẬN</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vé điện tử:</span>
                      <span className="font-mono text-slate-700 font-bold">{booking.eTicketNumber || '738-92182019'}</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Instructions */}
      <div className="mt-8 bg-blue-50/80 rounded-3xl p-6 border border-blue-200 text-xs text-blue-900 space-y-2">
        <h4 className="font-black text-sm flex items-center gap-1.5 text-blue-950">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Lưu ý quan trọng cho chuyến bay của bạn
        </h4>
        <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
          <li>Vui lòng có mặt tại sân bay ít nhất <strong>90 phút</strong> trước giờ khởi hành đối với chuyến bay nội địa và <strong>120 phút</strong> đối với quốc tế.</li>
          <li>Xuất trình mã QR trên thẻ lên máy bay này cùng bản gốc CCCD/Hộ chiếu tại quầy thủ tục hoặc kiosk tự động.</li>
          <li>Cửa khởi hành sẽ đóng <strong>15 phút</strong> trước giờ bay dự kiến.</li>
        </ul>
      </div>

    </div>
  );
}
