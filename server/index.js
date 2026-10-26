const express = require('express');
const cors = require('cors');
const airports = require('./data/airports');
const airlines = require('./data/airlines');
const { generateFlights, generateSeatMap } = require('./data/flightsGenerator');
const { createBooking, getBookingByCode, getAllBookings } = require('./data/bookingsStorage');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Flight Ticket Booking API', timestamp: new Date() });
});

// 2. Airports list
app.get('/api/airports', (req, res) => {
  res.json({ success: true, data: airports });
});

// 3. Airlines list
app.get('/api/airlines', (req, res) => {
  res.json({ success: true, data: airlines });
});

// 4. Search flights
app.get('/api/flights', (req, res) => {
  try {
    const { from, to, date, passengers, cabinClass, airline } = req.query;

    if (!from || !to) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp điểm đi và điểm đến (from, to)' });
    }

    const searchDate = date || new Date().toISOString().split('T')[0];
    let flights = generateFlights(from, to, searchDate, Number(passengers) || 1, cabinClass || 'economy');

    // Filter by airline if specified
    if (airline && airline !== 'all') {
      flights = flights.filter(f => f.airline.id === airline || f.airline.code === airline);
    }

    res.json({
      success: true,
      query: { from, to, date: searchDate, passengers, cabinClass },
      count: flights.length,
      data: flights
    });
  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tìm kiếm chuyến bay' });
  }
});

// 5. Get seat map for a flight
app.get('/api/flights/:flightId/seats', (req, res) => {
  try {
    const { flightId } = req.params;
    const seats = generateSeatMap(flightId);
    res.json({ success: true, flightId, data: seats });
  } catch (error) {
    console.error('Error generating seat map:', error);
    res.status(500).json({ success: false, message: 'Lỗi tải sơ đồ ghế' });
  }
});

// 6. Create booking
app.post('/api/bookings', (req, res) => {
  try {
    const bookingPayload = req.body;

    if (!bookingPayload.contact || !bookingPayload.passengers || !bookingPayload.outboundFlight) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ. Cần thông tin người liên hệ, hành khách và chuyến bay.'
      });
    }

    const newBooking = createBooking(bookingPayload);
    res.status(201).json({
      success: true,
      message: 'Đặt vé thành công!',
      data: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Lỗi tạo đơn đặt vé' });
  }
});

// 7. Lookup booking by code (PNR)
app.get('/api/bookings/:bookingCode', (req, res) => {
  try {
    const { bookingCode } = req.params;
    const booking = getBookingByCode(bookingCode);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy mã đặt chỗ "${bookingCode}". Vui lòng kiểm tra lại.`
      });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, message: 'Lỗi tra cứu đơn vé' });
  }
});

// 8. Admin / debug: List all bookings
app.get('/api/bookings', (req, res) => {
  try {
    const bookings = getAllBookings();
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách vé' });
  }
});

app.listen(PORT, () => {
  console.log(`✈️ Flight Ticket Server running on http://localhost:${PORT}`);
});
