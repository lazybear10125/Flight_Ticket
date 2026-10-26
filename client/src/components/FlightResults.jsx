import React, { useState, useMemo } from 'react';
import { 
  Plane, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Luggage, 
  Utensils, 
  Tv, 
  SlidersHorizontal, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown,
  Sparkles,
  Info
} from 'lucide-react';
import { formatVND } from '../services/api';

export default function FlightResults({ 
  flights = [], 
  loading = false, 
  searchParams, 
  isSelectingReturn = false,
  outboundFlight = null,
  onSelectFlight,
  onBackToSearch
}) {
  const [selectedAirlineFilter, setSelectedAirlineFilter] = useState('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('all'); // all, morning, noon, afternoon, evening
  const [sortBy, setSortBy] = useState('price-asc'); // price-asc, dep-asc, duration-asc
  const [expandedFlightId, setExpandedFlightId] = useState(null);

  // Filtered and sorted flights
  const filteredFlights = useMemo(() => {
    let list = [...flights];

    // Airline filter
    if (selectedAirlineFilter !== 'all') {
      list = list.filter(f => f.airline.id === selectedAirlineFilter);
    }

    // Departure time filter
    if (selectedTimeSlot !== 'all') {
      list = list.filter(f => {
        const hour = parseInt(f.origin.time.split(':')[0], 10);
        if (selectedTimeSlot === 'early') return hour >= 0 && hour < 6;
        if (selectedTimeSlot === 'morning') return hour >= 6 && hour < 12;
        if (selectedTimeSlot === 'afternoon') return hour >= 12 && hour < 18;
        if (selectedTimeSlot === 'evening') return hour >= 18 && hour < 24;
        return true;
      });
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricing.totalPrice - b.pricing.totalPrice;
      if (sortBy === 'dep-asc') return a.origin.time.localeCompare(b.origin.time);
      if (sortBy === 'duration-asc') return a.duration - b.duration;
      return 0;
    });

    return list;
  }, [flights, selectedAirlineFilter, selectedTimeSlot, sortBy]);

  const toggleExpand = (id) => {
    setExpandedFlightId(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Plane className="w-3.5 h-3.5" />
            {isSelectingReturn ? 'Bước 2: Chọn chuyến bay về' : 'Bước 1: Chọn chuyến bay đi'}
          </div>

          <div className="flex items-center gap-3 text-2xl sm:text-3xl font-black">
            <span>{isSelectingReturn ? searchParams.to : searchParams.from}</span>
            <ArrowRight className="w-6 h-6 text-blue-300" />
            <span>{isSelectingReturn ? searchParams.from : searchParams.to}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-blue-200 mt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {isSelectingReturn ? searchParams.returnDate : searchParams.departureDate}
            </span>
            <span>•</span>
            <span>{searchParams.passengers} Hành khách</span>
            <span>•</span>
            <span className="capitalize">{searchParams.cabinClass === 'business' ? 'Hạng Thương gia' : 'Hạng Phổ thông'}</span>
          </div>
        </div>

        <button
          onClick={onBackToSearch}
          className="self-start md:self-center px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-sm transition"
        >
          Thay đổi tìm kiếm
        </button>
      </div>

      {/* If choosing return flight, show Outbound Flight brief reminder */}
      {isSelectingReturn && outboundFlight && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              ĐI
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500">Chuyến đi đã chọn:</div>
              <div className="text-sm font-extrabold text-blue-900">
                {outboundFlight.airline.name} ({outboundFlight.flightNumber}) • {outboundFlight.origin.time} ➔ {outboundFlight.destination.time}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Giá chiều đi:</span>
            <span className="text-base font-black text-blue-700">
              {formatVND(outboundFlight.pricing.totalPrice)}
            </span>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                Bộ lọc tìm kiếm
              </div>
              <button
                onClick={() => {
                  setSelectedAirlineFilter('all');
                  setSelectedTimeSlot('all');
                }}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Đặt lại
              </button>
            </div>

            {/* Filter: Airlines */}
            <div className="py-4 border-b border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Hãng hàng không
              </label>
              <div className="space-y-2">
                {[
                  { id: 'all', name: 'Tất cả các hãng' },
                  { id: 'vietnam-airlines', name: 'Vietnam Airlines' },
                  { id: 'vietjet-air', name: 'Vietjet Air' },
                  { id: 'bamboo-airways', name: 'Bamboo Airways' },
                  { id: 'vietravel-airlines', name: 'Vietravel Airlines' }
                ].map(item => (
                  <label 
                    key={item.id} 
                    className="flex items-center justify-between text-xs font-medium text-slate-700 hover:text-blue-600 cursor-pointer p-1.5 rounded-xl hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="radio" 
                        name="airline-filter"
                        checked={selectedAirlineFilter === item.id}
                        onChange={() => setSelectedAirlineFilter(item.id)}
                        className="accent-blue-600 w-4 h-4"
                      />
                      <span>{item.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Departure Time slot */}
            <div className="pt-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Khung giờ cất cánh
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'morning', label: '06:00 - 12:00' },
                  { id: 'afternoon', label: '12:00 - 18:00' },
                  { id: 'evening', label: '18:00 - 24:00' }
                ].map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot.id)}
                    className={`py-2 px-2.5 text-center rounded-xl font-bold border transition ${
                      selectedTimeSlot === slot.id 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Flights List */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Sorting tabs */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-500 pl-2">
              Tìm thấy <strong className="text-slate-900">{filteredFlights.length}</strong> chuyến bay phù hợp
            </span>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Sắp xếp theo:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setSortBy('price-asc')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    sortBy === 'price-asc' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Giá thấp nhất
                </button>
                <button
                  onClick={() => setSortBy('dep-asc')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    sortBy === 'dep-asc' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cất cánh sớm nhất
                </button>
                <button
                  onClick={() => setSortBy('duration-asc')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    sortBy === 'duration-asc' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bay nhanh nhất
                </button>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-xs">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600 font-bold">Đang tìm các chuyến bay giá tốt nhất...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredFlights.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-xs p-8">
              <Plane className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-800 mb-1">Không tìm thấy chuyến bay nào</h4>
              <p className="text-sm text-slate-500 mb-4">Vui lòng điều chỉnh lại bộ lọc hoặc chọn ngày bay khác.</p>
              <button
                onClick={() => {
                  setSelectedAirlineFilter('all');
                  setSelectedTimeSlot('all');
                }}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Flight Card List */}
          {!loading && filteredFlights.map(flight => {
            const isExpanded = expandedFlightId === flight.id;

            return (
              <div 
                key={flight.id}
                className="bg-white rounded-3xl border border-slate-200/80 hover:border-blue-400 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {/* Main Card Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Airline & Aircraft info (Col 3) */}
                    <div className="md:col-span-3 flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-xs"
                        style={{ backgroundColor: flight.airline.color }}
                      >
                        {flight.airline.code}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm leading-tight">
                          {flight.airline.name}
                        </h4>
                        <div className="text-xs text-slate-500 font-mono font-medium mt-0.5">
                          {flight.flightNumber}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {flight.aircraft}
                        </div>
                      </div>
                    </div>

                    {/* Flight Times & Duration (Col 5) */}
                    <div className="md:col-span-5 flex items-center justify-between gap-4">
                      {/* Origin */}
                      <div className="text-left">
                        <div className="text-2xl font-black text-slate-900">
                          {flight.origin.time}
                        </div>
                        <div className="text-xs font-bold text-slate-600">
                          {flight.origin.code}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[80px]">
                          {flight.origin.city}
                        </div>
                      </div>

                      {/* Flight Route Line with Animated SVG & Radar Pulse */}
                      <div className="flex-1 flex flex-col items-center px-2">
                        <span className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-500" />
                          {flight.durationText}
                        </span>
                        
                        <div className="w-full relative flex items-center justify-center my-1">
                          {/* Animated SVG Path */}
                          <svg className="w-full h-5 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                            {/* Base track */}
                            <path d="M 0,10 Q 50,-2 100,10" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                            {/* Animated glowing flight path */}
                            <path 
                              d="M 0,10 Q 50,-2 100,10" 
                              fill="none" 
                              stroke="#3b82f6" 
                              strokeWidth="2.5" 
                              className="animate-flight-dash"
                            />
                          </svg>

                          {/* Left origin pulse */}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 relative z-10" />
                            <span className="w-4 h-4 rounded-full bg-blue-400 absolute animate-radar-ping opacity-60" />
                          </div>

                          {/* Center Flying Airplane Icon with gentle aerodynamic float */}
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1.5 py-0.5 rounded-full shadow-xs border border-blue-200 animate-float">
                            <Plane className="w-3.5 h-3.5 text-blue-600 rotate-90" />
                          </div>

                          {/* Right destination pulse */}
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 relative z-10" />
                            <span className="w-4 h-4 rounded-full bg-indigo-400 absolute animate-radar-ping opacity-60" />
                          </div>
                        </div>

                        <span className="text-[10px] text-emerald-600 font-extrabold mt-0.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Bay thẳng
                        </span>
                      </div>

                      {/* Destination */}
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900">
                          {flight.destination.time}
                        </div>
                        <div className="text-xs font-bold text-slate-600">
                          {flight.destination.code}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[80px]">
                          {flight.destination.city}
                        </div>
                      </div>
                    </div>

                    {/* Price & Select Button (Col 4) */}
                    <div className="md:col-span-4 flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      <div className="text-left md:text-right">
                        <span className="text-[11px] text-slate-400 block font-medium">
                          Giá cho 1 khách (đã gồm thuế phí)
                        </span>
                        <div className="text-xl sm:text-2xl font-black text-blue-600">
                          {formatVND(flight.pricing.totalPrice)}
                        </div>
                        <div className="text-[10px] text-amber-600 font-semibold">
                          Còn {flight.seatsAvailable} ghế giá này
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectFlight(flight)}
                        className="mt-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 transition duration-200 hover:scale-105 active:scale-95"
                      >
                        Chọn chuyến
                      </button>
                    </div>

                  </div>

                  {/* Included perks tags */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Luggage className="w-3.5 h-3.5 text-blue-600" />
                        {flight.airline.baggageInfo.cabin}
                      </span>
                      {flight.mealIncluded && (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <Utensils className="w-3.5 h-3.5" />
                          Bao gồm suất ăn
                        </span>
                      )}
                      {flight.cabinClass === 'business' && (
                        <span className="flex items-center gap-1 text-amber-600 font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          Hạng vé VIP Thương gia
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleExpand(flight.id)}
                      className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 text-xs"
                    >
                      <span>{isExpanded ? 'Thu gọn chi tiết' : 'Chi tiết vé & Điều kiện'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-200/80 p-6 space-y-4 text-xs animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Column 1: Journey Details */}
                      <div>
                        <h5 className="font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Plane className="w-3.5 h-3.5 text-blue-600" />
                          Thông tin hành trình
                        </h5>
                        <ul className="space-y-1.5 text-slate-600">
                          <li><strong>Khởi hành:</strong> {flight.origin.time} - {flight.origin.name} ({flight.origin.code})</li>
                          <li><strong>Hạ cánh:</strong> {flight.destination.time} - {flight.destination.name} ({flight.destination.code})</li>
                          <li><strong>Thời gian bay:</strong> {flight.durationText}</li>
                          <li><strong>Hãng khai thác:</strong> {flight.airline.name}</li>
                          <li><strong>Dòng máy bay:</strong> {flight.aircraft}</li>
                        </ul>
                      </div>

                      {/* Column 2: Baggage & Services */}
                      <div>
                        <h5 className="font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Luggage className="w-3.5 h-3.5 text-blue-600" />
                          Hành lý & Tiện ích
                        </h5>
                        <ul className="space-y-1.5 text-slate-600">
                          <li><strong>Xách tay:</strong> {flight.airline.baggageInfo.cabin}</li>
                          <li><strong>Ký gửi:</strong> {flight.airline.baggageInfo.checked}</li>
                          <li><strong>Suất ăn:</strong> {flight.mealIncluded ? 'Phục vụ suất ăn nhẹ và nước khoáng' : 'Có bán suất ăn nóng trên chuyến bay'}</li>
                          <li><strong>Giải trí:</strong> Màn hình giải trí & Cổng sạc USB</li>
                        </ul>
                      </div>

                      {/* Column 3: Fare Breakdown */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                        <h5 className="font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-blue-600" />
                          Chi tiết giá vé
                        </h5>
                        <div className="space-y-1 text-slate-600">
                          <div className="flex justify-between">
                            <span>Giá vé cơ bản:</span>
                            <span>{formatVND(flight.pricing.basePrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Thuế & Phí sân bay:</span>
                            <span>{formatVND(flight.pricing.taxAndFees)}</span>
                          </div>
                          <div className="border-t border-slate-100 pt-1 mt-1 flex justify-between font-bold text-blue-700 text-sm">
                            <span>Tổng cộng:</span>
                            <span>{formatVND(flight.pricing.totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}
