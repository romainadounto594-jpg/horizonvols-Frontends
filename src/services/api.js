/**
 * Service API HorizonVols
 * Connecteur direct vers l'API Laravel 11 (http://127.0.0.1:8000/api)
 * Avec détection de connectivité en temps réel et bascule transparente en mode démo si le serveur local est éteint.
 */

import { BASE_FLIGHTS, searchFlights as mockSearchFlights } from '../data/flights.js';
import { AIRPORTS } from '../data/airports.js';
import { INITIAL_BOOKINGS } from '../data/bookings.js';

const DEFAULT_API_URL = 'http://127.0.0.1:8000/api';

export const getApiBaseUrl = () => {
  return localStorage.getItem('hz_api_url') || import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL;
};

export const setApiBaseUrl = (url) => {
  localStorage.setItem('hz_api_url', url);
};

const getAuthToken = () => {
  return localStorage.getItem('horizon_auth_token') || null;
};

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Normaliseur pour adapter les données Laravel vers la structure attendue par l'UI React
 */
export const normalizeLaravelFlight = (f) => {
  if (!f) return null;
  return {
    id: f.id,
    flightNumber: f.flight_number || f.flightNumber,
    airlineCode: f.airline?.code || f.airlineCode || 'AF',
    airlineName: f.airline?.name || f.airlineName || 'Compagnie',
    airlineLogoColor: f.airline?.logo_color || '#002157',
    airlineAccentColor: f.airline?.accent_color || '#3B82F6',
    from: f.departure_airport?.iata_code || f.from,
    fromCity: f.departure_airport?.city || f.fromCity,
    fromAirportName: f.departure_airport?.name || f.fromAirportName,
    to: f.arrival_airport?.iata_code || f.to,
    toCity: f.arrival_airport?.city || f.toCity,
    toAirportName: f.arrival_airport?.name || f.toAirportName,
    departureTime: f.departure_time ? f.departure_time.substring(0, 5) : (f.departureTime || '12:00'),
    arrivalTime: f.arrival_time ? f.arrival_time.substring(0, 5) : (f.arrivalTime || '16:00'),
    duration: f.duration_formatted || f.duration || '4h 00m',
    durationMinutes: f.duration_minutes || f.durationMinutes || 240,
    stops: f.stops ?? 0,
    stopDetails: f.stop_details || f.stopDetails || [],
    aircraft: f.aircraft || 'Airbus A350',
    cabinClass: f.cabin_class || f.cabinClass || 'economy',
    price: parseFloat(f.base_price ?? f.price ?? 400),
    taxes: parseFloat(f.taxes ?? 75),
    totalPrice: parseFloat(f.total_price ?? ((f.base_price || 0) + (f.taxes || 0))),
    baggage: {
      cabin: f.baggage_cabin || f.baggage?.cabin || '1x 12kg inclus',
      hold: f.baggage_hold || f.baggage?.hold || '2x 23kg inclus',
    },
    ticketPolicy: f.ticket_policy || f.ticketPolicy || 'Modifiable sous conditions',
    refundable: Boolean(f.is_refundable ?? f.refundable ?? false),
    services: f.services || ['Wi-Fi à bord', 'Repas chaud', 'Écran individuel'],
    seatsAvailable: f.seats_available ?? f.seatsAvailable ?? 20,
    seatsTotal: f.seats_total ?? f.seatsTotal ?? 180,
    recommended: Boolean(f.is_recommended ?? f.recommended ?? false),
    seats: f.seats || []
  };
};

export const apiService = {
  /**
   * Vérifie si le backend Laravel répond
   */
  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${getApiBaseUrl()}/airports`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  },

  // --- AÉROPORTS ---
  async getAirports(search = '') {
    try {
      const url = `${getApiBaseUrl()}/airports${search ? `?search=${encodeURIComponent(search)}` : ''}`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) throw new Error('API non joignable');
      const data = await res.json();
      return data.data || [];
    } catch {
      if (!search) return AIRPORTS;
      const lower = search.toLowerCase();
      return AIRPORTS.filter(
        a => a.code.toLowerCase().includes(lower) ||
             a.city.toLowerCase().includes(lower) ||
             a.name.toLowerCase().includes(lower)
      );
    }
  },

  // --- AUTHENTIFICATION ---
  async login(email, password) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('horizon_auth_token', data.token);
        return { success: true, user: data.user, token: data.token };
      }
      let errorMsg = data.message || 'Identifiants invalides';
      if (data.errors && typeof data.errors === 'object') {
        const firstErr = Object.values(data.errors).flat()[0];
        if (firstErr) errorMsg = firstErr;
      }
      return { success: false, error: errorMsg };
    } catch (err) {
      return { success: false, error: err.message, isOffline: true };
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('horizon_auth_token', data.token);
        return { success: true, user: data.user, token: data.token };
      }
      let errorMsg = data.message || "Erreur lors de l'inscription";
      if (data.errors && typeof data.errors === 'object') {
        const firstErr = Object.values(data.errors).flat()[0];
        if (firstErr) errorMsg = firstErr;
      }
      return { success: false, error: errorMsg };
    } catch (err) {
      return { success: false, error: err.message, isOffline: true };
    }
  },

  async getMe() {
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/user`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Non authentifié');
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  },

  async logout() {
    try {
      await fetch(`${getApiBaseUrl()}/auth/logout`, {
        method: 'POST',
        headers: getHeaders(),
      });
    } catch {
      // Ignorer si hors ligne
    } finally {
      localStorage.removeItem('horizon_auth_token');
    }
  },

  // --- RECHERCHE & VOLS ---
  async searchFlights(params = {}) {
    try {
      const queryObj = {};
      if (params.from) queryObj.from = params.from;
      if (params.to) queryObj.to = params.to;
      if (params.cabinClass && params.cabinClass !== 'all') queryObj.cabin_class = params.cabinClass;
      if (params.stops !== undefined && params.stops !== 'all') queryObj.stops = params.stops;
      if (params.maxPrice) queryObj.max_price = params.maxPrice;
      if (params.sortBy) queryObj.sort_by = params.sortBy;

      const queryString = new URLSearchParams(queryObj).toString();
      const res = await fetch(`${getApiBaseUrl()}/flights?${queryString}`, {
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error('Erreur API');
      const data = await res.json();
      if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map(normalizeLaravelFlight);
      }
      // Si la recherche filtrée est vide en BDD, vérifier s'il faut élargir ou fallback
      return (data.data || []).map(normalizeLaravelFlight);
    } catch (err) {
      console.warn('API Laravel indisponible, utilisation du cache local:', err.message);
      return mockSearchFlights(params);
    }
  },

  async getFlight(id) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/flights/${id}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Vol non trouvé');
      const data = await res.json();
      return normalizeLaravelFlight(data.data);
    } catch {
      return BASE_FLIGHTS.find(f => f.id === id || f.id === `FL-${id}`) || BASE_FLIGHTS[0];
    }
  },

  // --- RÉSERVATIONS ---
  async createBooking(bookingPayload) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/bookings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bookingPayload),
      });
      const data = await res.json();
      if (res.ok && data.booking) {
        return { success: true, booking: data.booking, pnr: data.booking.pnr };
      }
      return { success: false, error: data.message || 'Erreur réservation' };
    } catch (err) {
      return { success: false, error: err.message, isOffline: true };
    }
  },

  async getBookingByPnr(pnr) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/bookings/${encodeURIComponent(pnr)}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Réservation introuvable');
      const data = await res.json();
      return data.booking;
    } catch {
      const local = INITIAL_BOOKINGS.find(b => b.pnr.toUpperCase() === (pnr || '').toUpperCase());
      return local || null;
    }
  },

  async getUserBookings() {
    try {
      const res = await fetch(`${getApiBaseUrl()}/user/bookings`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Erreur récupération réservations');
      const data = await res.json();
      return data.data || [];
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  // --- ADMINISTRATION ---
  async getAdminStats() {
    try {
      const res = await fetch(`${getApiBaseUrl()}/admin/stats`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Erreur API Admin');
      return await res.json();
    } catch {
      return null;
    }
  },

  async getAdminFlights() {
    try {
      const res = await fetch(`${getApiBaseUrl()}/admin/flights`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Erreur API Admin');
      const data = await res.json();
      return (data.data || []).map(normalizeLaravelFlight);
    } catch {
      return BASE_FLIGHTS;
    }
  },

  // --- PAIEMENT STRIPE ---
  async createPaymentIntent({ amount, currency, pnr, customer_email }) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/payments/create-intent`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ amount, currency, pnr, customer_email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur Stripe Intent');
      return { success: true, ...data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async verifyPayment({ payment_intent_id, booking_id }) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/payments/verify`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ payment_intent_id, booking_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur vérification');
      return { success: true, ...data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
