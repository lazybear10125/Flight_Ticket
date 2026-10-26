import React, { useState } from 'react';
import { Search, X, Ticket, AlertCircle, Plane } from 'lucide-react';
import { lookupBooking } from '../services/api';

export default function LookupModal({ isOpen, onClose, onBookingFound }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await lookupBooking(code.trim());
      if (res.success && res.data) {
        onBookingFound(res.data);
        onClose();
      } else {
        setError(res.message || 'Không tìm thấy mã đặt vé này.');
      }
    } catch (err) {
      setError('Lỗi khi tra cứu mã đặt chỗ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-900 leading-tight">
              Tra Cứu Mã Đặt Chỗ
            </h3>
            <p className="text-xs text-slate-500">
              Nhập mã PNR để xem lại vé điện tử & tình trạng chuyến bay
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Mã đặt chỗ (PNR Code)
            </label>
            <input 
              type="text"
              required
              placeholder="VD: VN-8921 hoặc VN782910"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-base font-extrabold text-blue-700 outline-none focus:border-blue-500 uppercase tracking-wider placeholder:normal-case placeholder:font-normal placeholder:text-sm"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500">
            💡 Gợi ý: Bạn có thể nhập mã đặt chỗ mẫu có sẵn: <strong className="text-blue-700 font-mono">VN782910</strong> để kiểm tra thử!
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang tra cứu...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Kiểm tra vé điện tử</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
