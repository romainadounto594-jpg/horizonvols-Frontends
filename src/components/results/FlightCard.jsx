import React from 'react';
import { getAirportByCode } from '../../data/airports.js';
import { getAirlineByCode } from '../../data/airlines.js';
import { formatPrice } from '../../utils/formatters.js';
import { useBooking } from '../../context/BookingContext.jsx';
import {
  Plane,
  Clock,
  Luggage,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';

export default function FlightCard({
  flight,
  onSelect,
  onViewDetails
}) {
  const { currency, searchParams } = useBooking();

  const fromAirport = getAirportByCode(flight.from);
  const toAirport = getAirportByCode(flight.to);
  const airline = getAirlineByCode(flight.airlineCode);

  const passengerCount = (searchParams.passengers.adults || 1) + (searchParams.passengers.children || 0);
  const totalPrice = flight.price * passengerCount;

  return (
    <div
      id={`flight-card-${flight.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-900/5 transition-all p-4 sm:p-6 group relative"
    >
      {flight.recommended && (
        <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider py-0.5 px-2.5 rounded-full shadow-xs flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Meilleur choix Horizon</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Airline info & Times */}
        <div className="flex-1 space-y-4">
          {/* Airline Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-xs"
                style={{ backgroundColor: airline.logoColor || '#0284c7' }}
              >
                {flight.airlineCode}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {flight.airlineName}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Vol {flight.flightNumber} • {flight.aircraft}
                </span>
              </div>
            </div>

            {/* Refundable tag */}
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{flight.ticketPolicy}</span>
            </div>
          </div>

          {/* Schedule Journey Line */}
          <div className="grid grid-cols-7 items-center gap-2 pt-1">
            {/* Departure */}
            <div className="col-span-2 text-left">
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {flight.departureTime}
              </div>
              <div className="text-xs font-bold text-slate-700">{flight.from}</div>
              <div className="text-[11px] text-slate-400 truncate">{fromAirport.city}</div>
            </div>

            {/* Flight Path Graphic */}
            <div className="col-span-3 text-center px-1">
              <div className="text-[11px] text-slate-500 font-medium mb-1">
                {flight.duration}
              </div>
              <div className="relative flex items-center justify-center">
                <div className="w-full h-0.5 bg-slate-200"></div>
                <div className="absolute w-2 h-2 rounded-full bg-sky-500 left-0"></div>
                <Plane className="w-3.5 h-3.5 text-sky-600 absolute rotate-90 bg-white px-0.5" />
                <div className="absolute w-2 h-2 rounded-full bg-slate-900 right-0"></div>
              </div>
              <div className="mt-1.5">
                {flight.stops === 0 ? (
                  <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Vol direct
                  </span>
                ) : (
                  <span className="inline-block text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    1 escale ({flight.stopDetails[0]?.city})
                  </span>
                )}
              </div>
            </div>

            {/* Arrival */}
            <div className="col-span-2 text-right">
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {flight.arrivalTime}
              </div>
              <div className="text-xs font-bold text-slate-700">{flight.to}</div>
              <div className="text-[11px] text-slate-400 truncate">{toAirport.city}</div>
            </div>
          </div>

          {/* Amenities & Baggage Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Luggage className="w-3.5 h-3.5 text-slate-400" />
              <span>{flight.baggage?.hold || '2x 23kg inclus'}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1 text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
              <span>{flight.cabinClass === 'business' ? 'Cabine Affaires' : 'Cabine Éco Standard'}</span>
            </div>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              id={`btn-details-${flight.id}`}
              onClick={() => onViewDetails(flight)}
              className="text-sky-600 hover:text-sky-700 font-semibold hover:underline flex items-center gap-0.5 ml-auto"
            >
              <Info className="w-3 h-3" />
              <span>Détails de l'itinéraire</span>
            </button>
          </div>
        </div>

        {/* Right: Pricing & Select CTA */}
        <div className="lg:w-48 lg:border-l lg:border-slate-100 lg:pl-6 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div className="text-left lg:text-right">
            <div className="text-[11px] text-slate-400 font-medium">Prix par passager</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatPrice(flight.price, currency)}
            </div>
            {passengerCount > 1 && (
              <div className="text-[10px] text-slate-500 font-medium">
                Total: {formatPrice(totalPrice, currency)} ({passengerCount} pers.)
              </div>
            )}
            <div className="text-[10px] text-emerald-600 font-medium">Taxes aéroportuaires incluses</div>
          </div>

          <button
            type="button"
            id={`btn-select-flight-${flight.id}`}
            onClick={() => onSelect(flight)}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
          >
            <span>Sélectionner</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
