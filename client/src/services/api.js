const API_BASE = '/api';

export async function fetchAirports() {
  const res = await fetch(`${API_BASE}/airports`);
  const data = await res.json();
  return data.data || [];
}

export async function fetchAirlines() {
  const res = await fetch(`${API_BASE}/airlines`);
  const data = await res.json();
  return data.data || [];
}

export async function searchFlights(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/flights?${query}`);
  const data = await res.json();
  return data.data || [];
}

export async function fetchFlightSeats(flightId) {
  const res = await fetch(`${API_BASE}/flights/${flightId}/seats`);
  const data = await res.json();
  return data.data || [];
}

export async function createBooking(bookingPayload) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload)
  });
  return await res.json();
}

export async function lookupBooking(bookingCode) {
  const res = await fetch(`${API_BASE}/bookings/${bookingCode}`);
  return await res.json();
}

export function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
