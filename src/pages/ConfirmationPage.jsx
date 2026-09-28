import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { apiService } from '../services/api.js';
import ETicket from '../components/ticket/ETicket.jsx';
import BookingStepper from '../components/booking/BookingStepper.jsx';
import { CheckCircle2, Home, UserCheck, Calendar, AlertCircle, Loader2 } from 'lucide-react';

function normalizeBooking(b) {
  if (!b) return null;
  const flight = b.flight || {};
  return {
    ...b,
    pnr: b.pnr || 'HZV-00000',
    flight: {
      from: flight.from || flight.departure_airport?.code || flight.departure_airport_code || 'CDG',
      to: flight.to || flight.arrival_airport?.code || flight.arrival_airport_code || 'DSS',
      flightNumber: flight.flightNumber || flight.flight_number || 'HZ-101',
      airlineCode: flight.airlineCode || flight.airline_code || 'AF',
      departureDate: flight.departureDate || b.departure_date || (flight.departure_time ? String(flight.departure_time).slice(0, 10) : '2026-10-15'),
      departureTime: flight.departureTime || (flight.departure_time ? String(flight.departure_time).slice(11, 16) : '10:30'),
      arrivalTime: flight.arrivalTime || (flight.arrival_time ? String(flight.arrival_time).slice(11, 16) : '15:45'),
      duration: flight.duration || '5h 15m',
      cabinClass: flight.cabinClass || flight.cabin_class || 'Économique',
    },
    passengers: (b.passengers && b.passengers.length > 0)
      ? b.passengers.map(p => ({
          ...p,
          firstName: p.firstName || p.first_name || 'Voyageur',
          lastName: p.lastName || p.last_name || 'Horizon',
          civility: p.civility || 'M.',
          seat: p.seat || p.seat_number || '12A'
        }))
      : [
          {
            firstName: b.customer?.firstName || b.customer_first_name || 'Voyageur',
            lastName: b.customer?.lastName || b.customer_last_name || 'Horizon',
            civility: 'M.',
            seat: '12A'
          }
        ],
    pricing: b.pricing || {
      total: b.total_price || b.totalAmount || 0,
      currency: b.currency || 'XOF'
    },
    payment: b.payment || {
      method: b.payment_method || 'Carte Bancaire (Stripe)',
      status: b.payment_status || 'Payé'
    }
  };
}

export default function ConfirmationPage() {
  const { pnr } = useParams();
  const navigate = useNavigate();
  const { getBookingByPNR, activeBooking } = useBooking();

  const [booking, setBooking] = useState(() => {
    const local = getBookingByPNR ? getBookingByPNR(pnr) : null;
    if (local) return normalizeBooking(local);
    if (activeBooking?.confirmedBooking?.pnr?.toUpperCase() === (pnr || '').toUpperCase()) {
      return normalizeBooking(activeBooking.confirmedBooking);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(!booking);

  useEffect(() => {
    let isMounted = true;

    async function fetchBooking() {
      if (booking) return;

      try {
        setIsLoading(true);
        const remote = await apiService.getBookingByPnr(pnr);
        if (isMounted && remote) {
          setBooking(normalizeBooking(remote));
        }
      } catch (err) {
        console.error('Erreur récupération réservation:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchBooking();
    return () => { isMounted = false; };
  }, [pnr, booking]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-sky-600 animate-spin" />
        <p className="text-sm font-bold text-slate-700">Chargement de votre billet électronique...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto my-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Réservation introuvable</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Aucun dossier de réservation n'a été trouvé avec la référence <strong>{pnr}</strong>.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl"
        >
          <Home className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/70 min-h-screen pb-16">
      {/* Visual Stepper at Step 6 */}
      <BookingStepper currentStep={6} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="inline-block text-[11px] font-extrabold uppercase tracking-widest bg-emerald-700/60 px-3 py-1 rounded-full border border-emerald-400/30 mb-2">
                Paiement Validé & Confirmé
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Félicitations, bon voyage !
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md">
                Votre réservation a été confirmée avec succès. Votre billet électronique a été transmis à l'adresse{' '}
                <strong>{booking.contactInfo?.email || booking.customer?.email || 'votre email'}</strong>.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 block">
              Code de Réservation (PNR)
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-widest block mt-0.5">
              {booking.pnr}
            </span>
          </div>
        </div>

        {/* Boarding Pass / E-Ticket Component */}
        <ETicket booking={booking} />

        {/* Post-Booking Helpful Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 no-print bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
          <Link
            to="/customer"
            id="btn-goto-customer-dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-xs"
          >
            <UserCheck className="w-4 h-4 text-sky-400" />
            <span>Accéder à mon Espace Client</span>
          </Link>

          <button
            type="button"
            id="btn-book-another-flight"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
          >
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>Effectuer une autre réservation</span>
          </button>
        </div>
      </div>
    </div>
  );
}