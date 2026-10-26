import React from 'react';
import { Plane, ArrowRight, Tag, Star } from 'lucide-react';
import { formatVND } from '../services/api';

const destinations = [
  {
    id: 1,
    city: 'Phú Quốc',
    from: 'HAN',
    to: 'PQC',
    subtitle: 'Thiên đường đảo ngọc biển xanh cát trắng',
    price: 890000,
    tag: 'Siêu rẻ mùa hè',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    city: 'Đà Nẵng',
    from: 'HAN',
    to: 'DAD',
    subtitle: 'Thành phố đáng sống với biển Mỹ Khê & Cầu Vàng',
    price: 690000,
    tag: 'Bán chạy nhất',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    city: 'Nha Trang',
    from: 'SGN',
    to: 'CXR',
    subtitle: 'Vịnh biển quyến rũ cùng các khu nghỉ dưỡng cao cấp',
    price: 620000,
    tag: 'Ưu đãi cuối tuần',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    city: 'Đà Lạt',
    from: 'HAN',
    to: 'DLI',
    subtitle: 'Thành phố ngàn hoa với khí hậu se lạnh mộng mơ',
    price: 790000,
    tag: 'Hot trend 2026',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  }
];

export default function PopularDestinations({ onSelectRoute }) {
  return (
    <section id="destinations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
            <Tag className="w-4 h-4" />
            Khám phá điểm đến hàng đầu
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Chặng Bay Được Yêu Thích Nhất
          </h3>
        </div>
        <p className="text-sm text-slate-500 mt-2 sm:mt-0 max-w-md">
          Săn ngay vé máy bay giá rẻ hôm nay cùng BayViet Air với nhiều chương trình khuyến mãi độc quyền.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map(item => (
          <div 
            key={item.id}
            onClick={() => onSelectRoute(item.from, item.to)}
            className="group relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.city} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
              
              {/* Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-blue-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs">
                {item.tag}
              </div>

              {/* Rating */}
              <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{item.rating}</span>
              </div>

              {/* City Title */}
              <div className="absolute bottom-3 left-4 right-4">
                <h4 className="text-2xl font-black text-white leading-tight">{item.city}</h4>
                <p className="text-xs text-slate-200 line-clamp-1">{item.subtitle}</p>
              </div>
            </div>

            {/* Bottom info */}
            <div className="p-4 flex items-center justify-between mt-auto bg-white">
              <div>
                <span className="text-[11px] text-slate-400 block">Giá vé từ</span>
                <span className="text-lg font-black text-blue-600">
                  {formatVND(item.price)}
                </span>
              </div>

              <div className="w-9 h-9 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
