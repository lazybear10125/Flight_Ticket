import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  QrCode, 
  Clock, 
  ShieldCheck, 
  Tag, 
  Check, 
  ArrowLeft, 
  Sparkles,
  Smartphone,
  Building2,
  Copy,
  AlertCircle
} from 'lucide-react';
import { formatVND } from '../services/api';

export default function PaymentModal({ 
  bookingPayload, 
  onBack, 
  onPaymentSuccess 
}) {
  const [selectedMethod, setSelectedMethod] = useState('vietqr'); // 'vietqr', 'atm', 'visa', 'momo'
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // 15-minute countdown timer
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'BAYVIET2026') {
      setDiscountAmount(100000);
      setCouponApplied(true);
      setCouponError('');
    } else if (clean === 'VIPFLIGHT') {
      setDiscountAmount(200000);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  };

  const originalTotal = bookingPayload.pricing.grandTotal;
  const finalTotal = Math.max(0, originalTotal - discountAmount);

  // Simulated payment processing
  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        ...bookingPayload,
        paymentMethod: selectedMethod.toUpperCase(),
        pricing: {
          ...bookingPayload.pricing,
          discountAmount,
          finalAmount: finalTotal
        }
      });
    }, 1800);
  };

  // Mock bank transfer details
  const bankInfo = {
    bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
    accountNumber: '99882026888',
    accountName: 'CONG TY CP VE MAY BAY BAYVIET AIR',
    transferContent: `BV ${Math.floor(100000 + Math.random() * 900000)}`
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Top Banner with Countdown */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 text-white shadow-lg mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Clock className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base leading-tight">
              Đang giữ chỗ giá tốt cho chuyến bay của bạn!
            </h4>
            <p className="text-xs text-amber-100">
              Vui lòng hoàn tất thanh toán trước khi thời gian giữ chỗ kết thúc.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl font-mono text-lg font-black tracking-widest">
          <span>{formatTime(secondsLeft)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Payment Method Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h3 className="font-black text-slate-900 text-lg mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <span>Phương thức thanh toán</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Bảo mật SSL 256-bit
              </span>
            </h3>

            {/* Methods list */}
            <div className="space-y-3">
              {/* Option 1: VietQR */}
              <label 
                onClick={() => setSelectedMethod('vietqr')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  selectedMethod === 'vietqr' 
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span>Quét mã VietQR chuyển khoản</span>
                      <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                        Khuyên dùng
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Tự động xác nhận trong 3 giây qua bất kỳ app ngân hàng nào
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedMethod === 'vietqr' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'vietqr' && <Check className="w-3 h-3" />}
                </div>
              </label>

              {/* Option 2: Thẻ ATM Napas */}
              <label 
                onClick={() => setSelectedMethod('atm')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  selectedMethod === 'atm' 
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      Thẻ ATM Nội địa (Napas / Internet Banking)
                    </div>
                    <p className="text-xs text-slate-500">Hỗ trợ hơn 40 ngân hàng tại Việt Nam</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedMethod === 'atm' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'atm' && <Check className="w-3 h-3" />}
                </div>
              </label>

              {/* Option 3: Visa / Master */}
              <label 
                onClick={() => setSelectedMethod('visa')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  selectedMethod === 'visa' 
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      Thẻ Quốc tế (Visa, MasterCard, JCB)
                    </div>
                    <p className="text-xs text-slate-500">Miễn phí thanh toán quốc tế</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedMethod === 'visa' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'visa' && <Check className="w-3 h-3" />}
                </div>
              </label>

              {/* Option 4: Ví điện tử MoMo */}
              <label 
                onClick={() => setSelectedMethod('momo')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  selectedMethod === 'momo' 
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      Ví điện tử MoMo / ZaloPay
                    </div>
                    <p className="text-xs text-slate-500">Quét mã thanh toán tức thời qua ứng dụng Ví</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedMethod === 'momo' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'momo' && <Check className="w-3 h-3" />}
                </div>
              </label>
            </div>

            {/* If VietQR selected, render QR Code Card */}
            {selectedMethod === 'vietqr' && (
              <div className="mt-6 p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center animate-in fade-in">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Quét mã VietQR bằng ứng dụng Ngân hàng của bạn
                </div>

                {/* Simulated VietQR visual with High-Tech Laser Scanning Effect */}
                <div className="inline-block p-4 bg-white rounded-3xl shadow-lg border border-slate-200 relative group overflow-hidden">
                  
                  {/* Scanner Laser Beam */}
                  <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-qr-laser z-20 pointer-events-none" />

                  {/* Corner Target Reticles */}
                  <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-blue-600 z-10" />
                  <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-blue-600 z-10" />
                  <div className="absolute bottom-10 left-6 w-4 h-4 border-b-2 border-l-2 border-blue-600 z-10" />
                  <div className="absolute bottom-10 right-6 w-4 h-4 border-b-2 border-r-2 border-blue-600 z-10" />

                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                      `https://bayvietair.vn/pay?acc=${bankInfo.accountNumber}&amount=${finalTotal}&msg=${bankInfo.transferContent}`
                    )}`}
                    alt="VietQR Payment Code" 
                    className="w-48 h-48 mx-auto rounded-xl relative z-0"
                  />
                  <div className="text-[11px] font-extrabold text-blue-700 mt-2 flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    VIETQR CHUẨN NAPAS247
                  </div>
                </div>

                {/* Account details */}
                <div className="mt-4 max-w-sm mx-auto bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ngân hàng:</span>
                    <span className="font-bold text-slate-800">Vietcombank</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Số tài khoản:</span>
                    <span className="font-mono font-bold text-blue-700 flex items-center gap-1">
                      {bankInfo.accountNumber}
                      <button 
                        type="button" 
                        onClick={() => copyToClipboard(bankInfo.accountNumber)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Chủ tài khoản:</span>
                    <span className="font-bold text-slate-800">{bankInfo.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Nội dung CK:</span>
                    <span className="font-mono font-black text-amber-600 flex items-center gap-1">
                      {bankInfo.transferContent}
                      <button 
                        type="button" 
                        onClick={() => copyToClipboard(bankInfo.transferContent)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>
                </div>

                {copied && (
                  <div className="text-xs text-emerald-600 font-bold mt-2">
                    ✓ Đã sao chép vào bộ nhớ tạm!
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right: Order Summary + Voucher + Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg">
            <h4 className="font-black text-slate-900 text-base mb-4 pb-3 border-b border-slate-100">
              Chi tiết thanh toán
            </h4>

            {/* Voucher input form */}
            <form onSubmit={handleApplyCoupon} className="mb-6">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                Mã giảm giá / Voucher ưu đãi
              </label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Nhập BAYVIET2026 hoặc VIPFLIGHT"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold uppercase outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  Áp dụng
                </button>
              </div>

              {couponApplied && (
                <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Đã áp dụng mã giảm giá {formatVND(discountAmount)}!
                </div>
              )}

              {couponError && (
                <div className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {couponError}
                </div>
              )}
            </form>

            {/* Detailed price breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 pb-4 border-b border-slate-100">
              <div className="flex justify-between">
                <span>Giá vé máy bay ({bookingPayload.passengers.length} khách):</span>
                <span className="font-bold text-slate-900">{formatVND(bookingPayload.pricing.flightsSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí chọn chỗ ngồi:</span>
                <span className="font-bold text-slate-900">{formatVND(bookingPayload.pricing.seatsExtra)}</span>
              </div>
              <div className="flex justify-between">
                <span>Hành lý ký gửi:</span>
                <span className="font-bold text-slate-900">{formatVND(bookingPayload.pricing.baggageExtra)}</span>
              </div>
              <div className="flex justify-between">
                <span>Suất ăn nóng:</span>
                <span className="font-bold text-slate-900">{formatVND(bookingPayload.pricing.mealExtra)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold pt-1">
                  <span>Mã giảm giá ưu đãi:</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Final Total */}
            <div className="pt-4 mb-6">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Thành tiền cuối cùng</span>
                <span className="text-3xl font-black text-blue-600">
                  {formatVND(finalTotal)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 text-right mt-1">
                Không phát sinh phụ phí ẩn nào khác
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xác thực giao dịch...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Xác nhận đã thanh toán ({formatVND(finalTotal)})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={onBack}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition"
              >
                Quay lại chỉnh sửa thông tin
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
