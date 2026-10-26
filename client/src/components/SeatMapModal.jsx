import React, { useState, useEffect } from 'react';
import { Plane, X, Check, Users, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { fetchFlightSeats, formatVND } from '../services/api';

export default function SeatMapModal({ 
  flight, 
  passengers = [], 
  selectedSeats = {}, 
  onConfirmSeats, 
  onClose 
}) {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePassengerIndex, setActivePassengerIndex] = useState(0);
  const [currentSelections, setCurrentSelections] = useState({ ...selectedSeats });
  const [hoveredSeat, setHoveredSeat] = useState(null);

  useEffect(() => {
    async function loadSeats() {
      try {
        setLoading(true);
        const data = await fetchFlightSeats(flight.id);
        setSeats(data);
      } catch (err) {
        console.error('Error loading seats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSeats();
  }, [flight.id]);

  const activePax = passengers[activePassengerIndex] || { id: 'p0', fullName: 'Hành khách 1' };

  const handleSeatClick = (seat) => {
    if (seat.status === 'occupied') return;

    // Check if this seat is already taken by another passenger in current draft
    const paxIdUsingThisSeat = Object.keys(currentSelections).find(
      pId => currentSelections[pId]?.id === seat.id && pId !== activePax.id
    );

    if (paxIdUsingThisSeat) {
      alert(`Ghế ${seat.id} đã được chọn cho hành khách khác!`);
      return;
    }

    // Toggle seat for active passenger
    const newSelections = { ...currentSelections };
    if (newSelections[activePax.id]?.id === seat.id) {
      delete newSelections[activePax.id];
    } else {
      newSelections[activePax.id] = seat;
      // Auto advance to next passenger if not last
      if (activePassengerIndex < passengers.length - 1) {
        setActivePassengerIndex(activePassengerIndex + 1);
      }
    }
    setCurrentSelections(newSelections);
  };

  const handleConfirm = () => {
    onConfirmSeats(currentSelections);
    onClose();
  };

  // Group seats by row
  const rowsMap = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const totalExtraSeatPrice = Object.values(currentSelections).reduce(
    (sum, seat) => sum + (seat?.price || 0), 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white leading-tight">
                Chọn Chỗ Ngồi Trực Quan
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {flight.airline.name} • {flight.flightNumber} • {flight.aircraft}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Passenger selection tabs */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {passengers.map((pax, index) => {
              const assignedSeat = currentSelections[pax.id];
              const isActive = index === activePassengerIndex;

              return (
                <button
                  key={pax.id || index}
                  onClick={() => setActivePassengerIndex(index)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{pax.fullName || `Hành khách ${index + 1}`}</span>
                  {assignedSeat ? (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[10px]">
                      {assignedSeat.id}
                    </span>
                  ) : (
                    <span className="text-[10px] opacity-75">(Chưa chọn)</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Đang chọn cho: <strong className="text-blue-600">{activePax.fullName || `Hành khách ${activePassengerIndex + 1}`}</strong>
          </div>
        </div>

        {/* Body: Seat legend + Aircraft Canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left: Seat Legend & Guide */}
          <div className="w-full md:w-64 bg-white rounded-2xl p-5 border border-slate-200 shrink-0 space-y-4">
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Chú thích sơ đồ ghế</h4>
            
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  ✓
                </div>
                <span>Ghế bạn đang chọn</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-300"></div>
                <span>Ghế trống tiêu chuẩn (Miễn phí)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-bold flex items-center justify-center">
                  VIP
                </div>
                <span>Hạng Thương gia (+500k)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                  EX
                </div>
                <span>Cửa thoát hiểm / Rộng chân (+100k)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-slate-200 border border-slate-300 opacity-60"></div>
                <span>Ghế đã có người đặt</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Ghế A & F là ghế cạnh cửa sổ ngắm mây trời; Ghế C & D là ghế cạnh lối đi tiện di chuyển.</span>
            </div>
          </div>

          {/* Right: Airplane Fuselage Visualizer */}
          <div className="flex-1 flex flex-col items-center w-full">
            
            {/* Live Hover Info Pill */}
            <div className="h-8 mb-2 flex items-center justify-center">
              {hoveredSeat ? (
                <div className="bg-slate-900 text-white px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in zoom-in-95">
                  <span className="font-mono font-black text-amber-400">{hoveredSeat.id}</span>
                  <span>•</span>
                  <span>{hoveredSeat.class === 'business' ? 'Hạng Thương gia' : 'Hạng Phổ thông'}</span>
                  <span>•</span>
                  <span>
                    {hoveredSeat.type === 'window' ? 'Cửa sổ 🪟' : hoveredSeat.type === 'aisle' ? 'Lối đi 🚶' : 'Ghế giữa'}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-emerald-400">
                    {hoveredSeat.price > 0 ? `+${formatVND(hoveredSeat.price)}` : 'Miễn phí'}
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">
                  Rê chuột vào ghế để xem vị trí và tiện ích chi tiết
                </span>
              )}
            </div>

            <div className="w-full max-w-md bg-white rounded-t-[100px] rounded-b-3xl border-2 border-slate-200 p-6 shadow-sm relative">
              
              {/* Cockpit / Airplane nose */}
              <div className="text-center pb-6 border-b border-slate-100">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2">
                  <Plane className="w-6 h-6 -rotate-45" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Buồng lái Cockpit
                </span>
              </div>

              {/* Column labels: A B C   D E F */}
              <div className="grid grid-cols-7 gap-1 text-center py-3 text-xs font-black text-slate-400 border-b border-slate-100 mb-3">
                <div>A</div>
                <div>B</div>
                <div>C</div>
                <div className="text-[10px] text-slate-300 flex items-center justify-center">Lối đi</div>
                <div>D</div>
                <div>E</div>
                <div>F</div>
              </div>

              {/* Rows */}
              {loading ? (
                <div className="py-16 text-center">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span className="text-xs text-slate-500">Đang tải sơ đồ ghế ngồi...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.keys(rowsMap).map(rowNumber => {
                    const rowSeats = rowsMap[rowNumber];
                    const isBusiness = parseInt(rowNumber, 10) <= 3;
                    const isExitRow = parseInt(rowNumber, 10) === 10 || parseInt(rowNumber, 10) === 11;

                    return (
                      <div key={rowNumber} className="relative">
                        {/* Emergency exit row indicator */}
                        {isExitRow && rowNumber === '10' && (
                          <div className="text-center my-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-md uppercase tracking-wider border border-dashed border-emerald-300">
                            🚪 Cửa thoát hiểm khẩn cấp (Emergency Exit)
                          </div>
                        )}

                        <div className="grid grid-cols-7 gap-1.5 items-center">
                          {/* Left Seats: A, B, C */}
                          {['A', 'B', 'C'].map(col => {
                            const seat = rowSeats.find(s => s.col === col);
                            if (!seat) return <div key={col} />;

                            const isSelectedByActivePax = currentSelections[activePax.id]?.id === seat.id;
                            const isSelectedByOtherPax = Object.keys(currentSelections).some(
                              pId => pId !== activePax.id && currentSelections[pId]?.id === seat.id
                            );
                            const isOccupied = seat.status === 'occupied';

                            let seatClass = 'bg-slate-100 border-slate-300 text-slate-700 hover:border-blue-500';
                            if (isBusiness) seatClass = 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100';
                            if (isExitRow) seatClass = 'bg-emerald-50 border-emerald-300 text-emerald-900';
                            if (isOccupied) seatClass = 'bg-slate-200 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed';
                            if (isSelectedByOtherPax) seatClass = 'bg-indigo-600 text-white border-indigo-600 font-bold';
                            if (isSelectedByActivePax) seatClass = 'bg-blue-600 text-white border-blue-600 font-black scale-105 shadow-md';

                            return (
                              <button
                                key={seat.id}
                                disabled={isOccupied}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                onClick={() => handleSeatClick(seat)}
                                title={`${seat.id} - ${seat.class === 'business' ? 'Thương gia' : 'Phổ thông'} (${seat.price > 0 ? '+' + formatVND(seat.price) : 'Miễn phí'})`}
                                className={`h-8 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all duration-200 active:scale-90 ${seatClass} ${isSelectedByActivePax ? 'animate-seat-pop' : ''}`}
                              >
                                {isSelectedByActivePax ? <Check className="w-3.5 h-3.5" /> : seat.id}
                              </button>
                            );
                          })}

                          {/* Row number in aisle */}
                          <div className="text-[11px] font-extrabold text-slate-400 text-center select-none">
                            {rowNumber}
                          </div>

                          {/* Right Seats: D, E, F */}
                          {['D', 'E', 'F'].map(col => {
                            const seat = rowSeats.find(s => s.col === col);
                            if (!seat) return <div key={col} />;

                            const isSelectedByActivePax = currentSelections[activePax.id]?.id === seat.id;
                            const isSelectedByOtherPax = Object.keys(currentSelections).some(
                              pId => pId !== activePax.id && currentSelections[pId]?.id === seat.id
                            );
                            const isOccupied = seat.status === 'occupied';

                            let seatClass = 'bg-slate-100 border-slate-300 text-slate-700 hover:border-blue-500';
                            if (isBusiness) seatClass = 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100';
                            if (isExitRow) seatClass = 'bg-emerald-50 border-emerald-300 text-emerald-900';
                            if (isOccupied) seatClass = 'bg-slate-200 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed';
                            if (isSelectedByOtherPax) seatClass = 'bg-indigo-600 text-white border-indigo-600 font-bold';
                            if (isSelectedByActivePax) seatClass = 'bg-blue-600 text-white border-blue-600 font-black scale-105 shadow-md';

                            return (
                              <button
                                key={seat.id}
                                disabled={isOccupied}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                onClick={() => handleSeatClick(seat)}
                                title={`${seat.id} - ${seat.class === 'business' ? 'Thương gia' : 'Phổ thông'} (${seat.price > 0 ? '+' + formatVND(seat.price) : 'Miễn phí'})`}
                                className={`h-8 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all duration-200 active:scale-90 ${seatClass} ${isSelectedByActivePax ? 'animate-seat-pop' : ''}`}
                              >
                                {isSelectedByActivePax ? <Check className="w-3.5 h-3.5" /> : seat.id}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 font-medium">Ghế đã chọn:</div>
            <div className="flex items-center gap-2 mt-0.5">
              {Object.keys(currentSelections).length === 0 ? (
                <span className="text-sm font-semibold text-slate-400">Chưa chọn ghế</span>
              ) : (
                Object.entries(currentSelections).map(([pId, s]) => (
                  <span key={pId} className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-black">
                    {s.id}
                  </span>
                ))
              )}
              {totalExtraSeatPrice > 0 && (
                <span className="text-xs font-bold text-amber-600 ml-2">
                  (+{formatVND(totalExtraSeatPrice)})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
            >
              Để hệ thống tự xếp ghế
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
            >
              Xác nhận chọn ghế
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
