import React, { useState } from 'react';
import { 
  Users, 
  Luggage, 
  Utensils, 
  Mail, 
  Phone, 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Armchair,
  Plane
} from 'lucide-react';
import { formatVND } from '../services/api';

const BAGGAGE_OPTIONS = [
  { kg: 0, price: 0, label: 'Mặc định (Theo hạng vé)' },
  { kg: 20, price: 220000, label: '+20 kg Ký gửi (220.000 ₫)' },
  { kg: 30, price: 350000, label: '+30 kg Ký gửi (350.000 ₫)' },
  { kg: 40, price: 480000, label: '+40 kg Ký gửi (480.000 ₫)' }
];

const MEAL_OPTIONS = [
  { id: 'none', name: 'Không chọn suất ăn', price: 0 },
  { id: 'beef', name: 'Cơm bò xào sả ớt & Trà đào', price: 65000 },
  { id: 'chicken', name: 'Cơm gà nướng mật ong sốt nấm', price: 65000 },
  { id: 'pasta', name: 'Mì Ý sốt bò bằm phô mai parmesan', price: 65000 },
  { id: 'vegan', name: 'Cơm chay nấm đông cô hạt sen', price: 60000 }
];

export default function PassengerForm({ 
  searchParams, 
  outboundFlight, 
  returnFlight, 
  selectedSeats = {}, 
  onOpenSeatMap,
  onProceedToPayment, 
  onBack 
}) {
  // Generate initial passengers based on passenger counts
  const totalPax = searchParams.passengers || 1;
  const breakdown = searchParams.passengerBreakdown || { adults: 1, children: 0, infants: 0 };

  const [passengers, setPassengers] = useState(() => {
    const list = [];
    let pCount = 1;
    for (let i = 0; i < breakdown.adults; i++) {
      list.push({
        id: `pax-${pCount}`,
        index: pCount++,
        type: 'adult',
        title: 'Ông (Mr)',
        fullName: i === 0 ? 'NGUYEN VAN AN' : `HANH KHACH ${i + 1}`,
        dob: '1995-05-15',
        idNumber: i === 0 ? '001095012345' : '',
        baggageKg: 0,
        meal: 'none'
      });
    }
    for (let i = 0; i < breakdown.children; i++) {
      list.push({
        id: `pax-${pCount}`,
        index: pCount++,
        type: 'child',
        title: 'Bé trai (Mstr)',
        fullName: `TRE EM ${i + 1}`,
        dob: '2018-08-20',
        idNumber: '',
        baggageKg: 0,
        meal: 'none'
      });
    }
    for (let i = 0; i < breakdown.infants; i++) {
      list.push({
        id: `pax-${pCount}`,
        index: pCount++,
        type: 'infant',
        title: 'Em bé',
        fullName: `EM BE ${i + 1}`,
        dob: '2025-01-10',
        idNumber: '',
        baggageKg: 0,
        meal: 'none'
      });
    }
    return list;
  });

  const [contact, setContact] = useState({
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan.flight@gmail.com',
    phone: '0988776655'
  });

  const handlePaxChange = (id, field, value) => {
    setPassengers(prev => prev.map(p => {
      if (p.id === id) {
        if (field === 'fullName') {
          // Normalize to upper case
          return { ...p, [field]: value.toUpperCase() };
        }
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  // Pricing calculations
  const outboundBase = (outboundFlight?.pricing?.totalPrice || 0) * passengers.length;
  const returnBase = returnFlight ? (returnFlight.pricing.totalPrice * passengers.length) : 0;
  const flightsSubtotal = outboundBase + returnBase;

  const seatsExtra = Object.values(selectedSeats).reduce((sum, s) => sum + (s?.price || 0), 0);

  const baggageExtra = passengers.reduce((sum, p) => {
    const opt = BAGGAGE_OPTIONS.find(b => b.kg === Number(p.baggageKg));
    return sum + (opt ? opt.price : 0);
  }, 0);

  const mealExtra = passengers.reduce((sum, p) => {
    const opt = MEAL_OPTIONS.find(m => m.id === p.meal);
    return sum + (opt ? opt.price : 0);
  }, 0);

  const grandTotal = flightsSubtotal + seatsExtra + baggageExtra + mealExtra;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!contact.fullName || !contact.email || !contact.phone) {
      alert('Vui lòng điền đầy đủ thông tin người liên hệ!');
      return;
    }

    const payload = {
      contact,
      passengers: passengers.map(p => ({
        ...p,
        seat: selectedSeats[p.id]?.id || null,
        seatDetails: selectedSeats[p.id] || null
      })),
      pricing: {
        flightsSubtotal,
        seatsExtra,
        baggageExtra,
        mealExtra,
        grandTotal,
        currency: 'VND'
      }
    };

    onProceedToPayment(payload);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách chuyến bay
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-bold text-blue-600">Thông tin hành khách & Dịch vụ</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Passengers + Add-ons + Contact */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Contact Information Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 leading-tight">
                    Thông tin liên hệ nhận vé
                  </h3>
                  <p className="text-xs text-slate-500">
                    Vé điện tử và thông báo chuyến bay sẽ được gửi tới Email & Số điện thoại này
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Họ và tên người đặt *
                  </label>
                  <input 
                    type="text"
                    required
                    value={contact.fullName}
                    onChange={(e) => setContact({ ...contact, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                    placeholder="Nguyễn Văn An"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email nhận vé điện tử *
                  </label>
                  <input 
                    type="email"
                    required
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Số điện thoại di động *
                  </label>
                  <input 
                    type="tel"
                    required
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                    placeholder="0988776655"
                  />
                </div>
              </div>
            </div>

            {/* 2. Passengers Details List */}
            {passengers.map((pax, index) => {
              const assignedSeat = selectedSeats[pax.id];

              return (
                <div key={pax.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-base leading-tight">
                          Hành khách {index + 1}: {pax.type === 'adult' ? 'Người lớn' : pax.type === 'child' ? 'Trẻ em' : 'Em bé'}
                        </h4>
                        <span className="text-xs text-slate-400">
                          Vui lòng nhập tên in hoa không dấu theo CCCD/Hộ chiếu
                        </span>
                      </div>
                    </div>

                    {/* Seat status badge */}
                    <div className="flex items-center gap-2">
                      {assignedSeat ? (
                        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-black">
                          <Armchair className="w-4 h-4" />
                          <span>Ghế: {assignedSeat.id} ({assignedSeat.class === 'business' ? 'Thương gia' : 'Phổ thông'})</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenSeatMap(passengers)}
                          className="flex items-center gap-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-slate-200"
                        >
                          <Armchair className="w-4 h-4" />
                          <span>Chọn ghế ngay</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Passenger Basic Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Danh xưng
                      </label>
                      <select
                        value={pax.title}
                        onChange={(e) => handlePaxChange(pax.id, 'title', e.target.value)}
                        className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                      >
                        <option value="Ông (Mr)">Ông (Mr)</option>
                        <option value="Bà (Mrs)">Bà (Mrs)</option>
                        <option value="Cô/Chị (Ms)">Cô/Chị (Ms)</option>
                        <option value="Bé trai (Mstr)">Bé trai (Mstr)</option>
                        <option value="Bé gái (Miss)">Bé gái (Miss)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-5">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Họ và Tên (Không dấu) *
                      </label>
                      <input 
                        type="text"
                        required
                        value={pax.fullName}
                        onChange={(e) => handlePaxChange(pax.id, 'fullName', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500 uppercase"
                        placeholder="NGUYEN VAN AN"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Số CCCD / Hộ chiếu
                      </label>
                      <input 
                        type="text"
                        value={pax.idNumber}
                        onChange={(e) => handlePaxChange(pax.id, 'idNumber', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-800 outline-none focus:border-blue-500"
                        placeholder="001095012345"
                      />
                    </div>
                  </div>

                  {/* Add-on services: Baggage & Meals */}
                  <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Extra Baggage */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                        <Luggage className="w-4 h-4 text-blue-600" />
                        Mua thêm hành lý ký gửi
                      </label>
                      <select
                        value={pax.baggageKg}
                        onChange={(e) => handlePaxChange(pax.id, 'baggageKg', Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                      >
                        {BAGGAGE_OPTIONS.map(opt => (
                          <option key={opt.kg} value={opt.kg}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Meal Option */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                        <Utensils className="w-4 h-4 text-amber-600" />
                        Đặt trước suất ăn nóng trên mây
                      </label>
                      <select
                        value={pax.meal}
                        onChange={(e) => handlePaxChange(pax.id, 'meal', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                      >
                        {MEAL_OPTIONS.map(opt => (
                          <option key={opt.id} value={opt.id}>
                            {opt.name} {opt.price > 0 ? `(+${formatVND(opt.price)})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>
              );
            })}

          </div>

          {/* Right Summary Sidebar (Sticky) */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
              <h4 className="font-black text-slate-900 text-base mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Tóm tắt chi phí</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {passengers.length} Khách
                </span>
              </h4>

              {/* Flight Summary info */}
              <div className="space-y-3 pb-4 border-b border-slate-100 text-xs">
                {/* Outbound */}
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-blue-600" />
                    Chuyến đi: {outboundFlight.origin.code} ➔ {outboundFlight.destination.code}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {outboundFlight.airline.name} • {outboundFlight.flightNumber} • {outboundFlight.origin.date}
                  </div>
                  <div className="text-right font-bold text-slate-900 mt-1">
                    {formatVND(outboundFlight.pricing.totalPrice * passengers.length)}
                  </div>
                </div>

                {/* Return if applicable */}
                {returnFlight && (
                  <div className="pt-2 border-t border-slate-100">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 text-indigo-600 rotate-180" />
                      Chuyến về: {returnFlight.origin.code} ➔ {returnFlight.destination.code}
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      {returnFlight.airline.name} • {returnFlight.flightNumber} • {returnFlight.origin.date}
                    </div>
                    <div className="text-right font-bold text-slate-900 mt-1">
                      {formatVND(returnFlight.pricing.totalPrice * passengers.length)}
                    </div>
                  </div>
                )}
              </div>

              {/* Add-ons Breakdown */}
              <div className="py-4 border-b border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Phí chọn chỗ ngồi:</span>
                  <span className="font-bold text-slate-800">{formatVND(seatsExtra)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hành lý ký gửi bổ sung:</span>
                  <span className="font-bold text-slate-800">{formatVND(baggageExtra)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Suất ăn nóng & Đồ uống:</span>
                  <span className="font-bold text-slate-800">{formatVND(mealExtra)}</span>
                </div>
              </div>

              {/* Total Price */}
              <div className="pt-4 mb-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Tổng tiền thanh toán</span>
                  <span className="text-2xl font-black text-blue-600">
                    {formatVND(grandTotal)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 text-right mt-1">
                  Đã bao gồm thuế giá trị gia tăng và mọi loại phí sân bay
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>Tiến hành thanh toán</span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Bảo mật dữ liệu chuẩn PCI-DSS 256-bit</span>
              </div>
            </div>
          </div>

        </div>
      </form>

    </div>
  );
}
