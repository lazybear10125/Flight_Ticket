const airlines = [
  {
    id: 'vietnam-airlines',
    code: 'VN',
    name: 'Vietnam Airlines',
    shortName: 'VNA',
    color: '#004c8c',
    accentColor: '#c5a059',
    logoText: 'Vietnam Airlines',
    icon: 'Plane',
    baggageInfo: {
      cabin: '12 kg xách tay (1 kiện + 1 phụ kiện)',
      checked: '23 kg ký gửi tiêu chuẩn miễn phí',
    },
    amenities: ['Suất ăn nhẹ', 'Màn hình giải trí', 'Chỗ để chân rộng', 'Hành lý 23kg'],
    rating: 4.8
  },
  {
    id: 'vietjet-air',
    code: 'VJ',
    name: 'Vietjet Air',
    shortName: 'Vietjet',
    color: '#ea0029',
    accentColor: '#f9a01b',
    logoText: 'Vietjet Air',
    icon: 'Flame',
    baggageInfo: {
      cabin: '7 kg xách tay',
      checked: 'Chưa bao gồm (có thể mua thêm từ 20kg - 40kg)',
    },
    amenities: ['Giá tiết kiệm', 'Đồ ăn trả phí', 'Ghế ngồi linh hoạt'],
    rating: 4.3
  },
  {
    id: 'bamboo-airways',
    code: 'QH',
    name: 'Bamboo Airways',
    shortName: 'Bamboo',
    color: '#00703c',
    accentColor: '#1a4e8a',
    logoText: 'Bamboo Airways',
    icon: 'Trees',
    baggageInfo: {
      cabin: '7 kg xách tay',
      checked: '20 kg ký gửi miễn phí theo hạng vé',
    },
    amenities: ['Suất ăn nhẹ', 'Ghế êm ái', 'Đúng giờ cao', 'Hành lý 20kg'],
    rating: 4.6
  },
  {
    id: 'vietravel-airlines',
    code: 'VU',
    name: 'Vietravel Airlines',
    shortName: 'Vietravel',
    color: '#fdb913',
    accentColor: '#003e7e',
    logoText: 'Vietravel Airlines',
    icon: 'Compass',
    baggageInfo: {
      cabin: '7 kg xách tay',
      checked: 'Chưa bao gồm (có thể mua thêm)',
    },
    amenities: ['Hướng dẫn viên du lịch', 'Suất ăn nhẹ đặc sản', 'Nhiều ưu đãi tour'],
    rating: 4.4
  }
];

module.exports = airlines;
