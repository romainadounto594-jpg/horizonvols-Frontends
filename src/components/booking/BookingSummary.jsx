import React from 'react';
import { getAirportByCode } from '../../data/airports.js';
import { getAirlineByCode } from '../../data/airlines.js';
import { formatPrice } from '../../utils/formatters.js';
import { useBooking } from '../../context/BookingContext.jsx';
import { Plane, Users, Luggage, Shield, Armchair, ChevronRight, Edit2 } from 'lucide-react';

export default function BookingSummary({ onEditStep }) {
  const { activeBooking, currency, searchParams } = useBooking();
  const { flight, passengers, selectedOptions, selectedSeats, pricing } = activeBooking;

  if (!flight) return null;

  const fromAirport = getAirportByCode(flight.from);
  const toAirport = getAirportByCode(flight.to);
  const airline = getAirlineByCode(flight.airlineCode);

  return (
    <div id="booking-summary-sidebar" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-5 sticky top-28">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-extrabold text-base text-slate-900">Récapitulatif du voyage</h3>
        <span className="text-[11px] font-mono font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded">
          {flight.cabinClass ? flight.cabinClass.toUpperCase() : 'ECONOMY'}
        </span>
      </div>

      {/* Flight info */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-black"
              style={{ backgroundColor: airline.logoColor || '#0284c7' }}
            >
              {flight.airlineCode}
            </div>
            <span className="text-xs font-bold text-slate-800">{flight.airlineName}</span>
          </div>
          {onEditStep && (
            <button
              type="button"
              id="btn-edit-flight-step"
              onClick={() => onEditStep(1)}
              className="text-[11px] text-sky-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <Edit2 className="w-3 h-3" /> Modifier
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
          <div>
            <div className="text-base font-black">{flight.departureTime}</div>
            <div>{flight.from} ({fromAirport.city})</div>
          </div>
          <div className="flex flex-col items-center px-2 text-[10px] text-slate-400 font-normal">
            <span>{flight.duration}</span>
            <div className="w-12 h-0.5 bg-slate-300 relative my-0.5">
              <Plane className="w-2.5 h-2.5 text-sky-600 absolute -top-1 left-1/2 -translate-x-1/2" />
            </div>
            <span className="text-emerald-600 font-semibold">{flight.stops === 0 ? 'Direct' : 'Escale'}</span>
          </div>
          <div className="text-right">
            <div className="text-base font-black">{flight.arrivalTime}</div>
            <div>{flight.to} ({toAirport.city})</div>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 mt-2">
          Départ le {searchParams.departureDate || 'Date choisie'} • Vol {flight.flightNumber}
        </div>
      </div>

      {/* Passengers & Seats */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-sky-600" />
            <span>Passagers & Sièges ({passengers.length})</span>
          </span>
          {onEditStep && (
            <button
              type="button"
              id="btn-edit-passengers-step"
              onClick={() => onEditStep(2)}
              className="text-[11px] text-sky-600 hover:underline font-semibold"
            >
              Modifier
            </button>
          )}
        </div>
        <div className="bg-slate-50 rounded-xl p-3 divide-y divide-slate-100">
          {passengers.map((p, idx) => (
            <div key={idx} className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
              <span className="text-slate-800 font-medium">
                {p.civility} {p.firstName} {p.lastName}
              </span>
              <span className="font-mono font-bold text-sky-700 bg-sky-100/60 px-2 py-0.5 rounded text-[11px]">
                Siège {selectedSeats[idx] || 'Non choisi'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Options Summary */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Luggage className="w-3.5 h-3.5 text-sky-600" />
            <span>Options retenues</span>
          </span>
          {onEditStep && (
            <button
              type="button"
              id="btn-edit-options-step"
              onClick={() => onEditStep(3)}
              className="text-[11px] text-sky-600 hover:underline font-semibold"
            >
              Modifier
            </button>
          )}
        </div>
        <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Bagage supplémentaire :</span>
            <span className="font-semibold text-slate-800">
              {selectedOptions.extraBaggage > 0 ? `${selectedOptions.extraBaggage} x 23kg` : 'Aucun'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Repas à bord :</span>
            <span className="font-semibold text-slate-800">{selectedOptions.meal || 'Standard'}</span>
          </div>
          <div className="flex justify-between">
            <span>Assurance voyage :</span>
            <span className="font-semibold text-slate-800">
              {selectedOptions.insurance === 'none' ? 'Sans assurance' : selectedOptions.insurance}
            </span>
          </div>
          {selectedOptions.priorityBoarding && (
            <div className="flex justify-between text-indigo-600 font-semibold">
              <span>Embarquement prioritaire</span>
              <span>Inclus ✓</span>
            </div>
          )}
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Tarif vol ({passengers.length} passagers)</span>
          <span className="font-semibold text-slate-900">{formatPrice(pricing.basePrice, currency)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Taxes et redevances aéroport</span>
          <span className="font-semibold text-slate-900">{formatPrice(pricing.taxes, currency)}</span>
        </div>
        {pricing.extraBaggagePrice > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Supplément bagages en soute</span>
            <span className="font-semibold text-slate-900">{formatPrice(pricing.extraBaggagePrice, currency)}</span>
          </div>
        )}
        {pricing.insurancePrice > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Assurance voyage</span>
            <span className="font-semibold text-slate-900">{formatPrice(pricing.insurancePrice, currency)}</span>
          </div>
        )}
        {pricing.seatPrice > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Siège Confort / Issue</span>
            <span className="font-semibold text-slate-900">{formatPrice(pricing.seatPrice, currency)}</span>
          </div>
        )}
        {pricing.priorityPrice > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Embarquement prioritaire</span>
            <span className="font-semibold text-slate-900">{formatPrice(pricing.priorityPrice, currency)}</span>
          </div>
        )}

        <div className="border-t border-slate-200 pt-3 flex items-baseline justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800">Total à régler TTC</div>
            <div className="text-[10px] text-emerald-600 font-medium">Paiement sécurisé garanti</div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-sky-600">
            {formatPrice(pricing.total, currency)}
          </div>
        </div>
      </div>
    </div>
  );
}
