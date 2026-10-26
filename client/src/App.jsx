import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBox from './components/SearchBox';
import PopularDestinations from './components/PopularDestinations';
import FlightResults from './components/FlightResults';
import SeatMapModal from './components/SeatMapModal';
import PassengerForm from './components/PassengerForm';
import PaymentModal from './components/PaymentModal';
import ETicketView from './components/ETicketView';
import LookupModal from './components/LookupModal';
import BookingProgress from './components/BookingProgress';
import LiveBookingTicker from './components/LiveBookingTicker';
import ScrollFlightIndicator from './components/ScrollFlightIndicator';
import ScrollParallaxSky from './components/ScrollParallaxSky';
import AirlinerSVG from './components/AirlinerSVG';
import IntroScreen from './components/IntroScreen';
import { fetchAirports, searchFlights, createBooking } from './services/api';
import { 
  Plane, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Award, 
  Headphones, 
  Zap, 
  CreditCard 
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState('HOME'); // 'HOME' | 'FLIGHTS_OUTBOUND' | 'FLIGHTS_RETURN' | 'PASSENGERS' | 'PAYMENT' | 'ETICKET'
  const [showIntro, setShowIntro] = useState(true);
  const [airports, setAirports] = useState([]);
  
  // Search state
  const [searchParams, setSearchParams] = useState(null);
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(false);

  // Selection state
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState({}); // { paxId: seatObj }
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);

  // Booking payload and completed booking
  const [bookingDraft, setBookingDraft] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Lookup modal
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  // Load airports on initial mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await fetchAirports();
        setAirports(data);
      } catch (err) {
        console.error('Failed to load airports:', err);
      }
    }
    loadInitialData();
  }, []);

  // Handle Search Submission
  const handleSearch = async (params) => {
    setSearchParams(params);
    setLoadingFlights(true);
    setView('FLIGHTS_OUTBOUND');
    setSelectedOutbound(null);
    setSelectedReturn(null);
    setSelectedSeats({});

    try {
      const flights = await searchFlights({
        from: params.from,
        to: params.to,
        date: params.departureDate,
        passengers: params.passengers,
        cabinClass: params.cabinClass
      });
      setOutboundFlights(flights);
    } catch (err) {
      console.error('Error fetching outbound flights:', err);
    } finally {
      setLoadingFlights(false);
    }
  };

  // Handle Outbound Flight Selected
  const handleSelectOutbound = async (flight) => {
    setSelectedOutbound(flight);

    // If round-trip, fetch return flights and change view
    if (searchParams.tripType === 'round-trip' && searchParams.returnDate) {
      setLoadingFlights(true);
      setView('FLIGHTS_RETURN');
      try {
        const rFlights = await searchFlights({
          from: searchParams.to,
          to: searchParams.from,
          date: searchParams.returnDate,
          passengers: searchParams.passengers,
          cabinClass: searchParams.cabinClass
        });
        setReturnFlights(rFlights);
      } catch (err) {
        console.error('Error fetching return flights:', err);
      } finally {
        setLoadingFlights(false);
      }
    } else {
      // Proceed directly to passenger information
      setView('PASSENGERS');
    }
  };

  // Handle Return Flight Selected
  const handleSelectReturn = (flight) => {
    setSelectedReturn(flight);
    setView('PASSENGERS');
  };

  // Handle Proceed to Payment from Passenger Form
  const handleProceedToPayment = (payload) => {
    const fullDraft = {
      ...payload,
      tripType: searchParams.tripType,
      outboundFlight: selectedOutbound,
      returnFlight: selectedReturn
    };
    setBookingDraft(fullDraft);
    setView('PAYMENT');
  };

  // Handle Payment Successful
  const handlePaymentSuccess = async (completedPayload) => {
    try {
      const res = await createBooking(completedPayload);
      if (res.success && res.data) {
        setConfirmedBooking(res.data);
        setView('ETICKET');
      } else {
        alert('Có lỗi khi tạo mã vé. Vui lòng thử lại!');
      }
    } catch (err) {
      console.error('Error saving booking:', err);
      alert('Không thể kết nối đến máy chủ. Vui lòng thử lại!');
    }
  };

  // Handle Booking Found from Lookup Modal
  const handleBookingFound = (booking) => {
    setConfirmedBooking(booking);
    setView('ETICKET');
  };

  // Reset to Home
  const handleGoHome = () => {
    setView('HOME');
    setSearchParams(null);
    setSelectedOutbound(null);
    setSelectedReturn(null);
    setSelectedSeats({});
    setBookingDraft(null);
    setConfirmedBooking(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Cinematic Airport Takeoff Splash Intro */}
      {showIntro && (
        <IntroScreen onFinish={() => setShowIntro(false)} />
      )}

      {/* Scroll-Driven Flight Path & Altitude Indicator */}
      <ScrollFlightIndicator />

      {/* Global Navigation Header */}
      <Header 
        onOpenLookup={() => setIsLookupOpen(true)}
        onGoHome={handleGoHome}
      />

      {/* Step Progress Stepper Bar (Active when booking flow is ongoing) */}
      <BookingProgress currentStep={view} />

      {/* Main Content Area based on View state */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {view === 'HOME' && (
          <div>
            {/* Hero Banner with Flying Airplane & Cloud Drift Effects */}
            <div className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
              
              {/* Background glowing aviation orbs */}
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
              <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl -z-0 pointer-events-none" />

              {/* High-Fidelity Commercial Airliner Soaring Across Sky */}
              <div className="absolute top-12 left-0 pointer-events-none animate-plane-fly z-0">
                <div className="flex items-center -rotate-12">
                  <div className="w-72 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/30 to-white/80 rounded-full blur-[0.5px]" />
                  <AirlinerSVG 
                    className="w-20 h-20 -rotate-45 drop-shadow-[0_0_20px_rgba(56,189,248,0.6)]" 
                    airlineColor="#38bdf8"
                    showContrails={true}
                    isCruising={true}
                  />
                </div>
              </div>

              {/* Floating Cloud Silhouette Layer */}
              <div className="absolute -bottom-6 left-0 right-0 h-28 pointer-events-none overflow-hidden opacity-15">
                <div className="w-[200%] h-full flex animate-cloud-slow">
                  <svg className="w-1/2 h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path d="M0,50 Q150,10 300,40 T600,30 T900,50 T1000,40 L1000,100 L0,100 Z" fill="#ffffff" />
                  </svg>
                  <svg className="w-1/2 h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path d="M0,50 Q150,10 300,40 T600,30 T900,50 T1000,40 L1000,100 L0,100 Z" fill="#ffffff" />
                  </svg>
                </div>
              </div>

              <div className="max-w-5xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold mb-6 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ưu Đãi Đặc Quyền Mùa Du Lịch 2026 - Giảm tới 30% giá vé</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none mb-6">
                  Bay Muôn Nơi <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-blue-300 via-sky-200 to-amber-200 bg-clip-text text-transparent">
                    Với Giá Tốt Nhất Hôm Nay
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto font-medium">
                  Hệ thống so sánh và đặt vé máy bay nội địa & quốc tế nhanh chóng, giữ chỗ tức thì, xuất vé điện tử tự động chỉ trong 30 giây.
                </p>
              </div>
            </div>

            {/* Flight Search Widget */}
            <div className="px-4 sm:px-6 lg:px-8">
              <SearchBox 
                airports={airports}
                onSearch={handleSearch}
              />
            </div>

            {/* Partner Airlines Badges */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
              <div className="text-center mb-6">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Đối tác hàng không hàng đầu Việt Nam
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'Vietnam Airlines', desc: 'Hãng Hàng Không Quốc Gia 4 Sao', color: '#004c8c', code: 'VN' },
                  { name: 'Vietjet Air', desc: 'Bay Là Thích Ngay - Giá Tiết Kiệm', color: '#ea0029', code: 'VJ' },
                  { name: 'Bamboo Airways', desc: 'Hơn Cả Một Chuyến Bay', color: '#00703c', code: 'QH' },
                  { name: 'Vietravel Airlines', desc: 'Hãng Hàng Không Du Lịch Đầu Tiên', color: '#fdb913', code: 'VU' },
                ].map(airline => (
                  <div 
                    key={airline.code}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-md transition"
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0"
                      style={{ backgroundColor: airline.color }}
                    >
                      {airline.code}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs leading-tight">{airline.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{airline.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Parallax Flying Airliner Across Screen */}
            <ScrollParallaxSky />

            {/* Popular Destinations Showcase */}
            <PopularDestinations 
              onSelectRoute={(from, to) => {
                handleSearch({
                  tripType: 'one-way',
                  from,
                  to,
                  departureDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                  passengers: 1,
                  passengerBreakdown: { adults: 1, children: 0, infants: 0 },
                  cabinClass: 'economy'
                });
              }}
            />

            {/* Why choose us feature highlights */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
              <div className="bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-xl">
                <div className="max-w-2xl mb-10">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2">
                    Lý do chọn BayViet Air
                  </span>
                  <h3 className="text-3xl font-black tracking-tight text-white">
                    Trải Nghiệm Đặt Vé Thông Minh & An Tâm Tuyệt Đối
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white">Xuất vé điện tử tức thì</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Hệ thống đồng bộ trực tiếp với các hãng hàng không, mã đặt chỗ PNR có hiệu lực check-in ngay sau khi thanh toán.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white">Không phí ẩn, giá trọn gói</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Mức giá bạn thấy đã bao gồm toàn bộ thuế, phí sân bay và phụ phí dịch vụ. Minh bạch 100%.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white">Đổi vé & Hoàn vé thuận tiện</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Đội ngũ tổng đài viên sẵn sàng hỗ trợ giải quyết thay đổi lịch bay, hoàn vé nhanh chóng 24/7.
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: OUTBOUND FLIGHT SELECTION */}
        {view === 'FLIGHTS_OUTBOUND' && (
          <FlightResults 
            flights={outboundFlights}
            loading={loadingFlights}
            searchParams={searchParams}
            isSelectingReturn={false}
            onSelectFlight={handleSelectOutbound}
            onBackToSearch={handleGoHome}
          />
        )}

        {/* VIEW 3: RETURN FLIGHT SELECTION */}
        {view === 'FLIGHTS_RETURN' && (
          <FlightResults 
            flights={returnFlights}
            loading={loadingFlights}
            searchParams={searchParams}
            isSelectingReturn={true}
            outboundFlight={selectedOutbound}
            onSelectFlight={handleSelectReturn}
            onBackToSearch={() => setView('FLIGHTS_OUTBOUND')}
          />
        )}

        {/* VIEW 4: PASSENGERS & ADD-ONS FORM */}
        {view === 'PASSENGERS' && (
          <PassengerForm 
            searchParams={searchParams}
            outboundFlight={selectedOutbound}
            returnFlight={selectedReturn}
            selectedSeats={selectedSeats}
            onOpenSeatMap={() => setIsSeatModalOpen(true)}
            onProceedToPayment={handleProceedToPayment}
            onBack={() => setView(selectedReturn ? 'FLIGHTS_RETURN' : 'FLIGHTS_OUTBOUND')}
          />
        )}

        {/* VIEW 5: PAYMENT */}
        {view === 'PAYMENT' && bookingDraft && (
          <PaymentModal 
            bookingPayload={bookingDraft}
            onBack={() => setView('PASSENGERS')}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {/* VIEW 6: E-TICKET & BOARDING PASS */}
        {view === 'ETICKET' && confirmedBooking && (
          <ETicketView 
            booking={confirmedBooking}
            onNewBooking={handleGoHome}
          />
        )}

      </main>

      {/* Global Aircraft Seat Map Selection Modal */}
      {isSeatModalOpen && (
        <SeatMapModal 
          flight={selectedOutbound}
          passengers={bookingDraft?.passengers || Array.from({ length: searchParams?.passengers || 1 }).map((_, i) => ({
            id: `pax-${i + 1}`,
            fullName: `Hành khách ${i + 1}`
          }))}
          selectedSeats={selectedSeats}
          onConfirmSeats={(seats) => setSelectedSeats(seats)}
          onClose={() => setIsSeatModalOpen(false)}
        />
      )}

      {/* Global Lookup Booking Modal */}
      <LookupModal 
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onBookingFound={handleBookingFound}
      />

      {/* Real-time Booking Ticker Notification Toast */}
      <LiveBookingTicker />

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
