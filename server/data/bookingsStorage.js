const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'bookings.json');

// In-memory cache
let bookings = [];

// Load existing bookings from JSON file if available
function loadBookings() {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, 'utf-8');
      bookings = JSON.parse(data);
    } else {
      // Seed initial dummy booking for demo testing
      bookings = [
        {
          bookingCode: 'VN782910',
          createdAt: new Date().toISOString(),
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: 'VIETQR',
          contact: {
            fullName: 'Nguyễn Văn An',
            email: 'nguyenvanan@gmail.com',
            phone: '0987654321'
          },
          tripType: 'one-way',
          passengers: [
            {
              id: 'p1',
              title: 'Mr',
              fullName: 'NGUYEN VAN AN',
              type: 'adult',
              selectedSeat: '12A',
              extraBaggageKg: 20,
              meal: 'Cơm bò xào sả ớt'
            }
          ],
          outboundFlight: {
            flightNumber: 'VN 210',
            airlineName: 'Vietnam Airlines',
            aircraft: 'Boeing 787-9',
            origin: { code: 'HAN', city: 'Hà Nội', time: '07:30', date: '2026-10-30' },
            destination: { code: 'SGN', city: 'TP. Hồ Chí Minh', time: '09:40', date: '2026-10-30' },
            cabinClass: 'economy'
          },
          pricing: {
            flightFare: 1450000,
            taxesAndFees: 261000,
            seatsTotal: 60000,
            baggageTotal: 250000,
            totalAmount: 2021000,
            currency: 'VND'
          }
        }
      ];
      saveBookings();
    }
  } catch (err) {
    console.error('Error loading bookings:', err);
    bookings = [];
  }
}

function saveBookings() {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving bookings:', err);
  }
}

// Generate random 6-character PNR booking code like VJ8921, VN3482
function generateBookingCode(airlineCode = 'VN') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${airlineCode}-${randomPart}`;
}

function createBooking(bookingData) {
  const airlineCode = bookingData.outboundFlight?.airline?.code || 'TK';
  const bookingCode = generateBookingCode(airlineCode);
  
  const newBooking = {
    ...bookingData,
    bookingCode: bookingCode,
    createdAt: new Date().toISOString(),
    status: 'CONFIRMED',
    paymentStatus: 'PAID', // In this demo we automatically mark as paid on checkout confirmation
    eTicketNumber: `738-${Math.floor(1000000000 + Math.random() * 9000000000)}`
  };

  bookings.unshift(newBooking);
  saveBookings();
  return newBooking;
}

function getBookingByCode(bookingCode) {
  if (!bookingCode) return null;
  const cleanCode = bookingCode.trim().toUpperCase();
  return bookings.find(b => b.bookingCode.toUpperCase() === cleanCode || b.bookingCode.replace('-', '').toUpperCase() === cleanCode.replace('-', ''));
}

function getAllBookings() {
  return bookings;
}

// Initialize on require
loadBookings();

module.exports = {
  createBooking,
  getBookingByCode,
  getAllBookings
};
