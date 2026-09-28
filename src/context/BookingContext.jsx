import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_BOOKINGS, generatePNR } from '../data/bookings.js';
import { BASE_FLIGHTS, searchFlights } from '../data/flights.js';
import { apiService } from '../services/api.js';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  // Devises
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('hz_currency') || 'EUR';
  });

  useEffect(() => {
    localStorage.setItem('hz_currency', currency);
  }, [currency]);

  // Critères de recherche par défaut
  const [searchParams, setSearchParams] = useState({
    tripType: 'roundtrip', // roundtrip, oneway, multicity
    from: 'CDG',
    to: 'DSS',
    departureDate: '2026-10-15',
    returnDate: '2026-10-25',
    cabinClass: 'economy',
    passengers: { adults: 1, children: 0, infants: 0 },
    directOnly: false
  });

  // Liste de toutes les réservations
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('hz_bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem('hz_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // État de la réservation en cours (Work-in-progress booking)
  const [activeBooking, setActiveBooking] = useState({
    flight: null, // vol aller sélectionné
    returnFlight: null,
    passengers: [],
    contactInfo: {
      email: '',
      phone: ''
    },
    selectedOptions: {
      extraBaggage: 0, // nombre de bagages soute supp
      meal: 'Standard gourmet',
      insurance: 'Pack Sérénité Horizon', // 'none', 'Annulation', 'Pack Sérénité Horizon'
      premiumSeat: false,
      priorityBoarding: false
    },
    selectedSeats: {},
    paymentDetails: {
      method: 'card', // card, wave, orangemoney, mtn
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCvv: '',
      phone: ''
    },
    pricing: {
      basePrice: 0,
      taxes: 0,
      extraBaggagePrice: 0,
      insurancePrice: 0,
      seatPrice: 0,
      priorityPrice: 0,
      total: 0
    },
    confirmedPNR: null,
    confirmedBooking: null
  });

  // Recalcul du prix total à chaque changement d'options ou de passagers
  useEffect(() => {
    if (!activeBooking.flight) return;

    const passengerCount = (activeBooking.passengers && activeBooking.passengers.length > 0)
      ? activeBooking.passengers.length
      : 1;

    const basePerPax = activeBooking.flight.price || 400;
    const taxesPerPax = activeBooking.flight.taxes || 75;

    // Options
    const baggagePerItem = 60;
    const extraBaggageCost = (activeBooking.selectedOptions.extraBaggage || 0) * baggagePerItem;

    let insuranceCost = 0;
    if (activeBooking.selectedOptions.insurance === 'Pack Sérénité Horizon') {
      insuranceCost = 39 * passengerCount;
    } else if (activeBooking.selectedOptions.insurance === 'Annulation simple') {
      insuranceCost = 22 * passengerCount;
    }

    let seatCost = 0;
    if (activeBooking.selectedOptions.premiumSeat) {
      seatCost = 25 * passengerCount;
    }

    let priorityCost = 0;
    if (activeBooking.selectedOptions.priorityBoarding) {
      priorityCost = 15 * passengerCount;
    }

    const baseTotal = basePerPax * passengerCount;
    const taxesTotal = taxesPerPax * passengerCount;
    const grandTotal = baseTotal + taxesTotal + extraBaggageCost + insuranceCost + seatCost + priorityCost;

    setActiveBooking(prev => ({
      ...prev,
      pricing: {
        basePrice: baseTotal,
        taxes: taxesTotal,
        extraBaggagePrice: extraBaggageCost,
        insurancePrice: insuranceCost,
        seatPrice: seatCost,
        priorityPrice: priorityCost,
        total: grandTotal
      }
    }));
  }, [
    activeBooking.flight,
    activeBooking.passengers?.length,
    activeBooking.selectedOptions
  ]);

  // Système de Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sélectionner un vol pour démarrer la réservation
  const selectFlightForBooking = (flight, user = null) => {
    const passengerCount = (searchParams.passengers.adults || 1) + (searchParams.passengers.children || 0);
    const initialPassengers = Array.from({ length: passengerCount }, (_, i) => ({
      id: `p-${i + 1}`,
      civility: i === 0 ? 'M.' : 'Mme',
      firstName: i === 0 ? (user?.firstName || '') : `Passager ${i + 1}`,
      lastName: i === 0 ? (user?.lastName || '') : '',
      birthDate: i === 0 ? '1990-05-15' : '1995-08-20',
      nationality: user?.country || 'Française',
      gender: i % 2 === 0 ? 'M' : 'F',
      documentType: 'Passeport',
      documentNumber: `A${Math.floor(1000000 + Math.random() * 9000000)}`,
      documentExpiry: '2032-10-10',
      seat: `${10 + i}A`
    }));

    const initialSeats = {};
    initialPassengers.forEach((p, idx) => {
      initialSeats[idx] = p.seat;
    });

    setActiveBooking(prev => ({
      ...prev,
      flight,
      passengers: initialPassengers,
      contactInfo: {
        email: user?.email || '',
        phone: user?.phone || ''
      },
      selectedSeats: initialSeats,
      selectedOptions: {
        extraBaggage: 0,
        meal: 'Standard gourmet',
        insurance: 'Pack Sérénité Horizon',
        premiumSeat: false,
        priorityBoarding: false
      }
    }));
  };

  // Finaliser la réservation
  const completeBooking = async (paymentInfo) => {
    let pnr = generatePNR();

    // 1. Préparer le payload compatible avec Laravel BookingController@store
    const numericFlightId = typeof activeBooking.flight?.id === 'number' 
      ? activeBooking.flight.id 
      : parseInt(String(activeBooking.flight?.id || '').replace(/\D/g, ''), 10) || 1;

    const payload = {
      flight_id: numericFlightId,
      return_flight_id: null,
      departure_date: searchParams.departureDate || '2026-10-15',
      return_date: searchParams.returnDate || null,
      customer_first_name: activeBooking.passengers[0]?.firstName || 'Voyageur',
      customer_last_name: activeBooking.passengers[0]?.lastName || 'Horizon',
      customer_email: activeBooking.contactInfo?.email || 'voyageur@horizonvols.com',
      customer_phone: activeBooking.contactInfo?.phone || '+221 77 000 00 00',
      passengers: activeBooking.passengers.map((p, idx) => ({
        civility: p.civility || 'M.',
        first_name: p.firstName,
        last_name: p.lastName,
        birth_date: p.birthDate || '1990-01-01',
        nationality: p.nationality || 'Française',
        gender: p.gender || 'M',
        document_type: p.documentType || 'Passeport',
        document_number: p.documentNumber || 'AB123456',
        document_expiry: p.documentExpiry || '2030-01-01',
        seat_number: activeBooking.selectedSeats[idx] || `${12 + idx}A`
      })),
      options: {
        extra_baggage_count: activeBooking.selectedOptions.extraBaggage || 0,
        meal_preference: activeBooking.selectedOptions.meal || 'Standard',
        insurance_plan: activeBooking.selectedOptions.insurance !== 'none' ? activeBooking.selectedOptions.insurance : null,
        has_priority_boarding: Boolean(activeBooking.selectedOptions.priorityBoarding),
        has_lounge_access: Boolean(activeBooking.selectedOptions.premiumSeat),
      },
      payment_method: paymentInfo.method || 'card'
    };

    // Appel optionnel API Laravel en arrière-plan
    try {
      const apiRes = await apiService.createBooking(payload);
      if (apiRes.success && apiRes.booking) {
        pnr = apiRes.booking.pnr || pnr;
      }
    } catch {
      // Si hors ligne, conserver le PNR généré localement
    }

    const newRecord = {
      id: `BK-${Date.now().toString().slice(-5)}`,
      pnr,
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
      customer: {
        firstName: activeBooking.passengers[0]?.firstName || 'Voyageur',
        lastName: activeBooking.passengers[0]?.lastName || 'Horizon',
        email: activeBooking.contactInfo?.email || 'voyageur@horizonvols.com',
        phone: activeBooking.contactInfo?.phone || '+221 77 000 00 00'
      },
      flight: {
        id: activeBooking.flight.id,
        flightNumber: activeBooking.flight.flightNumber,
        airlineCode: activeBooking.flight.airlineCode,
        airlineName: activeBooking.flight.airlineName,
        from: activeBooking.flight.from,
        to: activeBooking.flight.to,
        departureDate: searchParams.departureDate || '2026-10-15',
        departureTime: activeBooking.flight.departureTime,
        arrivalDate: searchParams.departureDate || '2026-10-15',
        arrivalTime: activeBooking.flight.arrivalTime,
        aircraft: activeBooking.flight.aircraft,
        cabinClass: activeBooking.flight.cabinClass || searchParams.cabinClass,
        duration: activeBooking.flight.duration,
        terminal: 'Terminal 2E',
        gate: 'K' + (Math.floor(Math.random() * 40) + 10)
      },
      passengers: activeBooking.passengers.map((p, idx) => ({
        ...p,
        seat: activeBooking.selectedSeats[idx] || `${12 + idx}A`
      })),
      selectedOptions: { ...activeBooking.selectedOptions },
      pricing: {
        ...activeBooking.pricing,
        currency
      },
      payment: {
        method: paymentInfo.methodName || 'Carte Bancaire',
        last4: paymentInfo.last4 || '4242',
        status: 'Payé',
        paidAt: new Date().toISOString()
      }
    };

    setBookings(prev => [newRecord, ...prev]);
    setActiveBooking(prev => ({
      ...prev,
      confirmedPNR: pnr,
      confirmedBooking: newRecord
    }));

    addToast('success', `Réservation enregistrée avec succès ! Référence PNR : ${pnr}`);
    return newRecord;
  };

  // Mettre à jour le statut d'une réservation (ex: Annuler)
  const updateBookingStatus = (pnr, newStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.pnr === pnr) {
        return { ...b, status: newStatus };
      }
      return b;
    }));
    addToast('info', `Statut de la réservation ${pnr} mis à jour : ${newStatus}`);
  };

  return (
    <BookingContext.Provider
      value={{
        currency,
        setCurrency,
        searchParams,
        setSearchParams,
        bookings,
        setBookings,
        activeBooking,
        setActiveBooking,
        selectFlightForBooking,
        startBookingFlight: selectFlightForBooking,
        completeBooking,
        confirmCurrentBooking: completeBooking,
        updateBookingStatus,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
