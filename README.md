# ✈️ BayViet Air - Hệ Thống Website Đặt Vé Máy Bay Trực Tuyến

Website thương mại điện tử chuyên biệt cho việc tìm kiếm, so sánh và đặt vé máy bay nội địa & quốc tế với giao diện hiện đại, mượt mà và trực quan.

---

## 🌟 Tính Năng Nổi Bật

### 1. 🔍 Tìm Kiếm & So Sánh Chuyến Bay Toàn Diện
- **Loại hình hành trình:** Hỗ trợ vé **Một chiều (One-way)** và **Khứ hồi (Round-trip)**.
- **Hệ thống sân bay phong phú:** Tích hợp đầy đủ các sân bay nội địa (Hà Nội - HAN, TP.HCM - SGN, Đà Nẵng - DAD, Phú Quốc - PQC, Nha Trang - CXR, Đà Lạt - DLI, Hải Phòng - HPH...) và các điểm đến quốc tế phổ biến (Bangkok, Singapore, Seoul, Tokyo).
- **Phân loại hành khách:** Người lớn (Adults), Trẻ em (Children), Em bé (Infants) với chính sách giá và chỗ ngồi riêng.
- **Hạng vé linh hoạt:** Phổ thông (Economy Class) & Thương gia (Business Class).

### 2. 🎯 Bộ Lọc & Sắp Xếp Chuyến Bay Nâng Cao
- Lọc theo từng hãng hàng không: **Vietnam Airlines (VN)**, **Vietjet Air (VJ)**, **Bamboo Airways (QH)**, **Vietravel Airlines (VU)**.
- Lọc theo khung giờ khởi hành: Sáng sớm (00:00-06:00), Sáng (06:00-12:00), Chiều (12:00-18:00), Tối (18:00-24:00).
- Sắp xếp thông minh: Giá thấp nhất, Cất cánh sớm nhất, Thời gian bay nhanh nhất.
- Bảng chi tiết minh bạch: Giá cơ bản, thuế VAT & phí dịch vụ cảng hàng không, điều kiện hoàn vé và đổi vé.

### 3. 💺 Sơ Đồ Chọn Ghế Ngồi Trực Quan (Aircraft Seat Map)
- Mô phỏng chính xác thân máy bay phản lực (Cockpit, lối đi giữa 3-3, cửa thoát hiểm khẩn cấp).
- Phân biệt trực quan: Ghế Thương gia (VIP Gold), Ghế tiêu chuẩn, Ghế cạnh cửa sổ / cạnh lối đi, Ghế đã có người đặt (Occupied).
- Chọn riêng từng vị trí ghế cho từng thành viên trong đoàn hành khách.

### 4. 🧳 Tiện Ích Bổ Sung & Điền Thông Tin Hành Khách
- Tự động chuẩn hóa họ tên hành khách theo tiêu chuẩn vé điện tử hàng không (In hoa không dấu).
- Đăng ký mua thêm hành lý ký gửi: +20kg, +30kg, +40kg.
- Đặt trước suất ăn nóng trên mây: Cơm bò xào sả ớt, Cơm gà nướng mật ong, Mì Ý sốt bò bằm, Cơm chay thanh đạm.

### 5. 💳 Thanh Toán & Mã Giảm Giá Ưu Đãi
- Đồng hồ đếm ngược giữ chỗ đảm bảo giá vé (15 phút).
- Tích hợp quét mã **VietQR Napas247** hiển thị mã QR kèm nội dung chuyển khoản tự động.
- Hỗ trợ thẻ ATM Napas, thẻ quốc tế Visa / MasterCard, ví điện tử MoMo / ZaloPay.
- **Mã Voucher giảm giá dùng thử:**
  - `BAYVIET2026`: Giảm ngay 100.000 ₫
  - `VIPFLIGHT`: Giảm ngay 200.000 ₫

### 6. 🎫 Thẻ Lên Máy Bay & Vé Điện Tử (Boarding Pass & E-Ticket)
- Hiệu ứng pháo hoa chúc mừng đặt vé thành công.
- Cấp mã đặt chỗ (PNR) độc nhất (Ví dụ: `VN-8921`, `VJ-4712`).
- Thẻ Boarding Pass đẹp mắt có mã QR Check-in quét trực tiếp tại sân bay.
- Tính năng in vé / Lưu PDF (`window.print()`).

### 7. 🔎 Tra Cứu Mã Đặt Chỗ (PNR Lookup)
- Khách hàng có thể tra cứu lại vé điện tử bất kỳ lúc nào bằng mã PNR.
- Có sẵn mã vé demo để thử nghiệm: `VN782910`.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React (Icons), Canvas-Confetti.
- **Backend:** Node.js, Express.js, CORS, RESTful API.
- **Lưu trữ dữ liệu:** Lưu trữ JSON linh hoạt (`server/data/bookings.json`).

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Động

### Cách 1: Khởi động nhanh (Khuyên dùng trên Windows)
Nhấp đúp chuột vào file `start.bat` trong thư mục dự án. Hệ thống sẽ tự động khởi chạy cả Backend và Frontend, đồng thời mở trình duyệt tới `http://localhost:5173`.

### Cách 2: Khởi động qua dòng lệnh (Terminal)

1. **Khởi động Backend Server:**
   ```bash
   cd server
   node index.js
   ```
   *Máy chủ API sẽ chạy tại: `http://localhost:5000`*

2. **Khởi động Frontend React Client:**
   Mở thêm một cửa sổ terminal mới:
   ```bash
   cd client
   npm run dev
   ```
   *Website sẽ chạy tại: `http://localhost:5173`*

---

## 📂 Cấu Trúc Thư Mục Dự Án

```
Flight_Ticket/
├── client/                     # Mã nguồn Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx             # Thanh điều hướng, logo, hotline, tra cứu vé
│   │   │   ├── Footer.jsx             # Thông tin đối tác hãng bay, cam kết dịch vụ
│   │   │   ├── SearchBox.jsx          # Khung tìm kiếm vé khứ hồi / một chiều
│   │   │   ├── FlightResults.jsx      # Danh sách chuyến bay, bộ lọc hãng & giờ bay
│   │   │   ├── SeatMapModal.jsx       # Sơ đồ máy bay chọn ghế trực quan 3-3
│   │   │   ├── PassengerForm.jsx      # Điền tên khách, thêm hành lý, chọn suất ăn
│   │   │   ├── PaymentModal.jsx       # Quét mã VietQR, thanh toán, mã coupon
│   │   │   ├── ETicketView.jsx        # Thẻ lên máy bay Boarding pass & QR check-in
│   │   │   ├── LookupModal.jsx        # Tra cứu thông tin vé qua mã PNR
│   │   │   └── PopularDestinations.jsx# Các chặng bay du lịch nổi bật
│   │   ├── services/
│   │   │   └── api.js                 # Kết nối gọi API backend
│   │   ├── App.jsx                    # Luồng điều hướng chính toàn bộ trang web
│   │   ├── main.jsx                   # Điểm khởi chạy React app
│   │   └── index.css                  # Cấu hình Tailwind CSS v4
│   └── vite.config.js                 # Cấu hình Vite & Proxy tới API backend
├── server/                     # Mã nguồn Backend (Express.js)
│   ├── data/
│   │   ├── airports.js                # Dữ liệu các sân bay nội địa & quốc tế
│   │   ├── airlines.js                # Vietnam Airlines, Vietjet, Bamboo, Vietravel
│   │   ├── flightsGenerator.js        # Thuật toán sinh lịch bay, giá vé và sơ đồ ghế
│   │   └── bookingsStorage.js         # Quản lý lưu trữ đơn vé (PNR)
│   └── index.js                       # Điểm khởi chạy Express Server (Port 5000)
├── start.bat                   # File khởi động nhanh 1-click trên Windows
├── package.json                # Root package configuration
└── README.md                   # Hướng dẫn chi tiết dự án
```
