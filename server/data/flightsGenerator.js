const airlines = require('./airlines');
const airports = require('./airports');

// Calculate flight duration in minutes based on route
function getRouteDurationMinutes(fromCode, toCode) {
  const pair = [fromCode, toCode].sort().join('-');
  const durationMap = {
    'HAN-SGN': 130, // 2h 10m
    'DAD-HAN': 80,  // 1h 20m
    'DAD-SGN': 85,  // 1h 25m
    'HAN-PQC': 135, // 2h 15m
    'PQC-SGN': 60,  // 1h 00m
    'CXR-HAN': 115, // 1h 55m
    'CXR-SGN': 65,  // 1h 05m
    'DLI-HAN': 110,
    'DLI-SGN': 55,
    'HAN-HPH': 45,
    'HAN-VDO': 40,
    'BKK-HAN': 120,
    'BKK-SGN': 95,
    'HAN-SIN': 200,
    'SGN-SIN': 125,
    'HAN-ICN': 260,
    'SGN-ICN': 320,
    'HAN-NRT': 330,
    'SGN-NRT': 350
  };

  return durationMap[pair] || 90; // default 1h 30m
}

// Generate realistic seat map for an aircraft
function generateSeatMap(flightNumber) {
  const rows = 18;
  const seats = [];
  const bookedSeed = (flightNumber.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 100;

  for (let r = 1; r <= rows; r++) {
    const isBusiness = r <= 3;
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

    seatLetters.forEach((col, cIdx) => {
      // Deterministic fake occupancy
      const isBooked = ((r * 7 + cIdx * 13 + bookedSeed) % 10 < 4);
      const isExitRow = r === 10 || r === 11;

      seats.push({
        id: `${r}${col}`,
        row: r,
        col: col,
        class: isBusiness ? 'business' : 'economy',
        type: (col === 'A' || col === 'F') ? 'window' : (col === 'C' || col === 'D') ? 'aisle' : 'middle',
        isExitRow,
        price: isBusiness ? 500000 : (isExitRow ? 100000 : (col === 'A' || col === 'F') ? 60000 : 0),
        status: isBooked ? 'occupied' : 'available'
      });
    });
  }

  return seats;
}

function generateFlights(from, to, date, passengers = 1, cabinClass = 'economy') {
  if (!from || !to || !date) return [];

  const fromAirport = airports.find(a => a.code === from) || { code: from, city: from, name: from };
  const toAirport = airports.find(a => a.code === to) || { code: to, city: to, name: to };
  const duration = getRouteDurationMinutes(from, to);

  // Flight schedule templates
  const flightSlots = [
    { hour: 6, min: 15, airlineId: 'vietjet-air', flightNum: 'VJ120', aircraft: 'Airbus A321', basePrice: 890000 },
    { hour: 7, min: 30, airlineId: 'vietnam-airlines', flightNum: 'VN210', aircraft: 'Boeing 787-9', basePrice: 1450000 },
    { hour: 9, min: 0, airlineId: 'bamboo-airways', flightNum: 'QH204', aircraft: 'Airbus A321neo', basePrice: 1190000 },
    { hour: 11, min: 20, airlineId: 'vietravel-airlines', flightNum: 'VU301', aircraft: 'Airbus A320', basePrice: 920000 },
    { hour: 13, min: 45, airlineId: 'vietjet-air', flightNum: 'VJ142', aircraft: 'Airbus A321neo', basePrice: 980000 },
    { hour: 15, min: 10, airlineId: 'vietnam-airlines', flightNum: 'VN248', aircraft: 'Airbus A350-900', basePrice: 1680000 },
    { hour: 17, min: 30, airlineId: 'bamboo-airways', flightNum: 'QH218', aircraft: 'Boeing 787-9', basePrice: 1350000 },
    { hour: 19, min: 0, airlineId: 'vietjet-air', flightNum: 'VJ168', aircraft: 'Airbus A321', basePrice: 850000 },
    { hour: 20, min: 45, airlineId: 'vietnam-airlines', flightNum: 'VN286', aircraft: 'Airbus A321', basePrice: 1390000 },
    { hour: 22, min: 15, airlineId: 'vietravel-airlines', flightNum: 'VU355', aircraft: 'Airbus A320', basePrice: 790000 }
  ];

  // Helper date formatter
  const [year, month, day] = date.split('-').map(Number);

  return flightSlots.map((slot, index) => {
    const airline = airlines.find(a => a.id === slot.airlineId);
    
    // Departure time
    const depTime = new Date(year, month - 1, day, slot.hour, slot.min);
    // Arrival time
    const arrTime = new Date(depTime.getTime() + duration * 60000);

    const pad = (n) => String(n).padStart(2, '0');
    const depTimeString = `${pad(depTime.getHours())}:${pad(depTime.getMinutes())}`;
    const arrTimeString = `${pad(arrTime.getHours())}:${pad(arrTime.getMinutes())}`;

    const durHours = Math.floor(duration / 60);
    const durMins = duration % 60;
    const durationText = `${durHours}h ${durMins > 0 ? durMins + 'm' : ''}`;

    // Pricing adjusted for cabin class
    const multiplier = cabinClass === 'business' ? 2.8 : 1.0;
    const finalPrice = Math.round((slot.basePrice * multiplier) / 10000) * 10000;
    const taxAndFees = Math.round(finalPrice * 0.18 / 1000) * 1000;

    const flightId = `${airline.code}-${slot.flightNum}-${date.replace(/-/g, '')}-${index + 1}`;

    return {
      id: flightId,
      flightNumber: `${airline.code} ${slot.flightNum}`,
      airline: {
        id: airline.id,
        code: airline.code,
        name: airline.name,
        color: airline.color,
        accentColor: airline.accentColor,
        baggageInfo: airline.baggageInfo,
        amenities: airline.amenities,
        rating: airline.rating
      },
      aircraft: slot.aircraft,
      origin: {
        code: fromAirport.code,
        city: fromAirport.city,
        name: fromAirport.name,
        time: depTimeString,
        date: date
      },
      destination: {
        code: toAirport.code,
        city: toAirport.city,
        name: toAirport.name,
        time: arrTimeString,
        date: arrTime.getDate() !== depTime.getDate() ? 
              `${arrTime.getFullYear()}-${pad(arrTime.getMonth()+1)}-${pad(arrTime.getDate())}` : date
      },
      duration: duration,
      durationText: durationText,
      cabinClass: cabinClass,
      seatsAvailable: Math.floor(15 + ((index * 7 + 11) % 45)),
      pricing: {
        basePrice: finalPrice,
        taxAndFees: taxAndFees,
        totalPrice: finalPrice + taxAndFees,
        currency: 'VND'
      },
      stops: 0,
      refundable: cabinClass === 'business' || airline.code === 'VN',
      mealIncluded: cabinClass === 'business' || airline.code === 'VN' || airline.code === 'QH'
    };
  });
}

module.exports = {
  generateFlights,
  generateSeatMap,
  getRouteDurationMinutes
};
