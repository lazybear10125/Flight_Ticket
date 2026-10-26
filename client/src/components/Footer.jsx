import React from 'react';
import { Plane, ShieldCheck, Headphones, CreditCard, Award, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value props */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-1">Giá vé minh bạch</h4>
              <p className="text-sm text-slate-400">Cam kết giá hiển thị là giá cuối cùng, đã bao gồm thuế và các loại phí.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-1">Đại lý chính hãng</h4>
              <p className="text-sm text-slate-400">Đối tác chiến lược của Vietnam Airlines, Vietjet, Bamboo Airways & Vietravel.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-1">Hỗ trợ 24/7</h4>
              <p className="text-sm text-slate-400">Đội ngũ chuyên viên tư vấn tận tâm hỗ trợ đổi vé, check-in, hoàn hủy vé nhanh chóng.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-1">Thanh toán an toàn</h4>
              <p className="text-sm text-slate-400">Hỗ trợ quét mã VietQR tức thì, thẻ ATM, Visa, MasterCard và ví điện tử bảo mật.</p>
            </div>
          </div>
        </div>

        {/* Main Footer columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white">
                <Plane className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">BAYVIET AIR</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Nền tảng tìm kiếm và đặt vé máy bay trực tuyến hàng đầu Việt Nam. Nhanh chóng, tiện lợi và tiết kiệm chi phí tối đa cho mọi hành trình.
            </p>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Tòa nhà Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Tổng đài đặt vé: 1900 6868 (1.000đ/phút)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@bayvietair.com.vn</span>
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Hãng bay đối tác</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="hover:text-white transition cursor-pointer">Vietnam Airlines (VNA)</li>
              <li className="hover:text-white transition cursor-pointer">Vietjet Air (VJ)</li>
              <li className="hover:text-white transition cursor-pointer">Bamboo Airways (QH)</li>
              <li className="hover:text-white transition cursor-pointer">Vietravel Airlines (VU)</li>
              <li className="hover:text-white transition cursor-pointer">Singapore Airlines & Qatar Airways</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Chặng bay phổ biến</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="hover:text-white transition cursor-pointer">Hà Nội (HAN) ➔ TP. Hồ Chí Minh (SGN)</li>
              <li className="hover:text-white transition cursor-pointer">TP. Hồ Chí Minh (SGN) ➔ Đà Nẵng (DAD)</li>
              <li className="hover:text-white transition cursor-pointer">Hà Nội (HAN) ➔ Phú Quốc (PQC)</li>
              <li className="hover:text-white transition cursor-pointer">TP. Hồ Chí Minh (SGN) ➔ Nha Trang (CXR)</li>
              <li className="hover:text-white transition cursor-pointer">Hà Nội (HAN) ➔ Bangkok (BKK)</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Điều khoản & Hỗ trợ</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="hover:text-white transition cursor-pointer">Hướng dẫn đặt vé trực tuyến</li>
              <li className="hover:text-white transition cursor-pointer">Chính sách hành lý & đổi trả vé</li>
              <li className="hover:text-white transition cursor-pointer">Quy định thủ tục check-in sân bay</li>
              <li className="hover:text-white transition cursor-pointer">Chính sách bảo mật thông tin</li>
              <li className="hover:text-white transition cursor-pointer">Điều khoản sử dụng dịch vụ</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© 2026 BayViet Air. Tất cả các quyền được bảo lưu. Dự án xây dựng website bán vé máy bay chất lượng cao.</p>
        </div>
      </div>
    </footer>
  );
}
