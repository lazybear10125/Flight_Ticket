import React, { useState, useRef, useEffect } from 'react';
import { 
  PlaneTakeoff, 
  PlaneLanding, 
  Calendar, 
  Users, 
  ArrowLeftRight, 
  Search, 
  Check, 
  ChevronDown,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function SearchBox({ airports = [], onSearch }) {
  const [tripType, setTripType] = useState('one-way'); // 'one-way' | 'round-trip'
  const [origin, setOrigin] = useState('HAN');
  const [destination, setDestination] = useState('SGN');
  
  // Default to today + 2 days for realistic booking dates
  const today = new Date();
  const formatYMD = (d) => d.toISOString().split('T')[0];
  const nextDate = (days) => {
    const d = new Date();
    d.setDate(today.getDate() + days);
    return formatYMD(d);
  };

  const [depDate, setDepDate] = useState(nextDate(2));
  const [retDate, setRetDate] = useState(nextDate(5));

  // Passengers & Cabin class
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState('economy');

  // Dropdown open states
  const [openOrigin, setOpenOrigin] = useState(false);
  const [openDest, setOpenDest] = useState(false);
  const [openPax, setOpenPax] = useState(false);

  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [swapAngle, setSwapAngle] = useState(0);

  const originRef = useRef(null);
  const destRef = useRef(null);
  const paxRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (originRef.current && !originRef.current.contains(e.target)) setOpenOrigin(false);
      if (destRef.current && !destRef.current.contains(e.target)) setOpenDest(false);
      if (paxRef.current && !paxRef.current.contains(e.target)) setOpenPax(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const originAirport = airports.find(a => a.code === origin) || { code: origin, city: 'Hà Nội', name: 'Nội Bài' };
  const destAirport = airports.find(a => a.code === destination) || { code: destination, city: 'TP. Hồ Chí Minh', name: 'Tân Sơn Nhất' };

  const handleSwapAirports = () => {
    setSwapAngle(prev => prev + 180);
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const filteredOriginAirports = airports.filter(a => 
    a.city.toLowerCase().includes(originSearch.toLowerCase()) || 
    a.code.toLowerCase().includes(originSearch.toLowerCase()) ||
    a.name.toLowerCase().includes(originSearch.toLowerCase())
  );

  const filteredDestAirports = airports.filter(a => 
    a.city.toLowerCase().includes(destSearch.toLowerCase()) || 
    a.code.toLowerCase().includes(destSearch.toLowerCase()) ||
    a.name.toLowerCase().includes(destSearch.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin === destination) {
      alert('Điểm đi và điểm đến không được trùng nhau!');
      return;
    }
    const totalPassengers = adults + children + infants;
    onSearch({
      tripType,
      from: origin,
      to: destination,
      departureDate: depDate,
      returnDate: tripType === 'round-trip' ? retDate : null,
      passengers: totalPassengers,
      passengerBreakdown: { adults, children, infants },
      cabinClass
    });
  };

  const totalPassengers = adults + children + infants;

  return (
    <div className="relative bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 max-w-6xl mx-auto -mt-12 z-20">
      
      {/* Tab selection: Trip Type + Cabin Class */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-2xl">
          <button
            type="button"
            onClick={() => setTripType('one-way')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
              tripType === 'one-way'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Một chiều
          </button>
          <button
            type="button"
            onClick={() => setTripType('round-trip')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
              tripType === 'round-trip'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Khứ hồi
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
            <input 
              type="radio" 
              name="cabin" 
              checked={cabinClass === 'economy'} 
              onChange={() => setCabinClass('economy')}
              className="accent-blue-600 w-4 h-4"
            />
            Phổ thông (Economy)
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
            <input 
              type="radio" 
              name="cabin" 
              checked={cabinClass === 'business'} 
              onChange={() => setCabinClass('business')}
              className="accent-blue-600 w-4 h-4"
            />
            <span className="text-amber-600 flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Thương gia (Business)
            </span>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
          
          {/* Origin & Destination Container */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2 relative">
            
            {/* Origin */}
            <div ref={originRef} className="relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Điểm khởi hành
              </label>
              <div 
                onClick={() => setOpenOrigin(!openOrigin)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-500 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <PlaneTakeoff className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-base font-extrabold text-slate-800 leading-tight">
                      {originAirport.city} <span className="text-xs text-blue-600 font-black">({originAirport.code})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[130px]">
                      {originAirport.name}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              {/* Origin Dropdown modal */}
              {openOrigin && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="relative mb-2">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                      type="text"
                      placeholder="Tìm thành phố hoặc mã sân bay..."
                      value={originSearch}
                      onChange={(e) => setOriginSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {filteredOriginAirports.map(airport => (
                      <div
                        key={airport.code}
                        onClick={() => {
                          setOrigin(airport.code);
                          setOpenOrigin(false);
                          setOriginSearch('');
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition ${
                          origin === airport.code ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <div>
                            <span className="font-semibold">{airport.city}</span>
                            <span className="text-[10px] text-slate-400 block">{airport.name}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {airport.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Organic Spring Swap Button */}
            <button
              type="button"
              onClick={handleSwapAirports}
              aria-label="Đổi chiều đi và về"
              style={{
                transform: `translateX(-50%) rotate(${swapAngle}deg)`
              }}
              className="absolute left-1/2 top-9 z-10 hidden sm:flex w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center text-blue-600 hover:text-white hover:bg-blue-600 hover:scale-110 active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>

            {/* Destination */}
            <div ref={destRef} className="relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Điểm đến
              </label>
              <div 
                onClick={() => setOpenDest(!openDest)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-500 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <PlaneLanding className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-base font-extrabold text-slate-800 leading-tight">
                      {destAirport.city} <span className="text-xs text-indigo-600 font-black">({destAirport.code})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[130px]">
                      {destAirport.name}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              {/* Destination Dropdown modal */}
              {openDest && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="relative mb-2">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                      type="text"
                      placeholder="Tìm thành phố hoặc mã sân bay..."
                      value={destSearch}
                      onChange={(e) => setDestSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {filteredDestAirports.map(airport => (
                      <div
                        key={airport.code}
                        onClick={() => {
                          setDestination(airport.code);
                          setOpenDest(false);
                          setDestSearch('');
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition ${
                          destination === airport.code ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <div>
                            <span className="font-semibold">{airport.city}</span>
                            <span className="text-[10px] text-slate-400 block">{airport.name}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {airport.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Dates Selection */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Departure Date */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Ngày đi
              </label>
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-500 transition">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                <input 
                  type="date"
                  value={depDate}
                  min={formatYMD(today)}
                  onChange={(e) => setDepDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Return Date */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Ngày về {tripType === 'one-way' && <span className="text-slate-400 font-normal">(Một chiều)</span>}
              </label>
              <div className={`flex items-center gap-2.5 p-3.5 rounded-2xl border transition ${
                tripType === 'round-trip' 
                  ? 'bg-slate-50 border-slate-200 hover:border-blue-500' 
                  : 'bg-slate-100/60 border-slate-200 opacity-60 cursor-not-allowed'
              }`}>
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                <input 
                  type="date"
                  value={retDate}
                  disabled={tripType === 'one-way'}
                  min={depDate}
                  onChange={(e) => setRetDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Passengers & Search button */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {/* Passengers dropdown trigger */}
            <div ref={paxRef} className="relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Hành khách
              </label>
              <div 
                onClick={() => setOpenPax(!openPax)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-500 cursor-pointer transition"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="text-sm font-bold text-slate-800">
                    {totalPassengers} khách
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              {/* Passengers dropdown menu */}
              {openPax && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 space-y-4">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Người lớn</div>
                      <div className="text-[10px] text-slate-400">Từ 12 tuổi trở lên</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        disabled={adults <= 1}
                        onClick={() => setAdults(adults - 1)}
                        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-sm font-bold">{adults}</span>
                      <button
                        type="button"
                        disabled={adults >= 9}
                        onClick={() => setAdults(adults + 1)}
                        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Trẻ em</div>
                      <div className="text-[10px] text-slate-400">2 - 11 tuổi</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        disabled={children <= 0}
                        onClick={() => setChildren(children - 1)}
                        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-sm font-bold">{children}</span>
                      <button
                        type="button"
                        disabled={children >= 4}
                        onClick={() => setChildren(children + 1)}
                        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Em bé</div>
                      <div className="text-[10px] text-slate-400">Dưới 2 tuổi</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        disabled={infants <= 0}
                        onClick={() => setInfants(infants - 1)}
                        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-sm font-bold">{infants}</span>
                      <button
                        type="button"
                        disabled={infants >= adults}
                        onClick={() => setInfants(infants + 1)}
                        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpenPax(false)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
                  >
                    Xác nhận
                  </button>
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-[52px] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition duration-200 hover:scale-[1.02] active:scale-95"
              >
                <Search className="w-5 h-5" />
                <span>Tìm Chuyến Bay</span>
              </button>
            </div>

          </div>

        </div>
      </form>

      {/* Quick popular routes pills */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Tuyến bay gợi ý:</span>
        {[
          { from: 'HAN', to: 'SGN', label: 'Hà Nội ➔ Sài Gòn' },
          { from: 'HAN', to: 'DAD', label: 'Hà Nội ➔ Đà Nẵng' },
          { from: 'SGN', to: 'PQC', label: 'Sài Gòn ➔ Phú Quốc' },
          { from: 'HAN', to: 'CXR', label: 'Hà Nội ➔ Nha Trang' },
          { from: 'SGN', to: 'BKK', label: 'Sài Gòn ➔ Bangkok' },
        ].map(route => (
          <button
            key={`${route.from}-${route.to}`}
            type="button"
            onClick={() => {
              setOrigin(route.from);
              setDestination(route.to);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition"
          >
            {route.label}
          </button>
        ))}
      </div>

    </div>
  );
}
