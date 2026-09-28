import React from 'react';
import { getAirportByCode } from '../../data/airports.js';
import { getAirlineByCode } from '../../data/airlines.js';
import { formatPrice } from '../../utils/formatters.js';
import { useBooking } from '../../context/BookingContext.jsx';
import {
  X,
  Plane,
  Clock,
  Luggage,
  ShieldCheck,
  CheckCircle,
  Wifi,
  Coffee,
  Tv,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function FlightDetailModal({ flight, isOpen, onClose, onSelect }) {
  const { currency, searchParams } = useBooking();

  if (!isOpen || !flight) return null;

  const fromAirport = getAirportByCode(flight.from);
  const toAirport = getAirportByCode(flight.to);
  const airline = getAirlineByCode(flight.airlineCode);
  const passengerCount = (searchParams.passengers.adults || 1) + (searchParams.passengers.children || 0);

  const baseTotal = flight.price * passengerCount;
  const taxesTotal = flight.taxes * passengerCount;
  const grandTotal = baseTotal + taxesTotal;

  return (
    <div id="flight-detail-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div
        id="flight-detail-modal-card"
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md"
              style={{ backgroundColor: airline.logoColor || '#0284c7' }}
            >
              {flight.airlineCode}
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                <span>{flight.airlineName}</span>
                <span className="text-xs font-mono font-normal text-sky-400 bg-slate-800 px-2 py-0.5 rounded">
                  {flight.flightNumber}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Appareil : <span className="text-white font-medium">{flight.aircraft}</span> • Classe {flight.cabinClass}
              </p>
            </div>
          </div>

          <button
            id="btn-close-flight-detail-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Detailed Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Itinéraire et Horaires
            </h4>

            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {/* Departure Node */}
              <div className="relative flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center z-10 shrink-0 font-bold text-xs shadow-xs">
                  🛫
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-black text-slate-900">{flight.departureTime}</span>
                    <span className="text-xs font-bold text-slate-700">{searchParams.departureDate || 'Date du vol'}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{fromAirport.city} ({fromAirport.code})</p>
                  <p className="text-xs text-slate-500">{fromAirport.name} • Terminal 2E</p>
                </div>
              </div>

              {/* Transit / In-Flight Info */}
              <div className="pl-11 py-1">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-sky-600" />
                    <span>Durée de vol estimée : <strong>{flight.duration}</strong></span>
                  </div>
                  {flight.stops > 0 ? (
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                      Escale à {flight.stopDetails[0]?.city} ({flight.stopDetails[0]?.duration})
                    </span>
                  ) : (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                      Vol direct sans escale
                    </span>
                  )}
                </div>
              </div>

              {/* Arrival Node */}
              <div className="relative flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center z-10 shrink-0 font-bold text-xs shadow-xs">
                  🛬
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-black text-slate-900">{flight.arrivalTime}</span>
                    <span className="text-xs font-bold text-slate-700">{searchParams.departureDate || 'Date du vol'}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{toAirport.city} ({toAirport.code})</p>
                  <p className="text-xs text-slate-500">{toAirport.name} • Hall Principal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Baggage Policy */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-2">
              <Luggage className="w-4 h-4 text-sky-600" />
              <span>Franchise Bagages Inclus</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-base">🎒</span>
                <div>
                  <div className="font-bold text-slate-800">Bagage Cabine</div>
                  <div className="text-slate-500">{flight.baggage?.cabin || '1x 12kg en cabine'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-base">🧳</span>
                <div>
                  <div className="font-bold text-slate-800">Bagage en Soute</div>
                  <div className="text-slate-500">{flight.baggage?.hold || '2x 23kg inclus'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Services on board */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Services inclus à bord
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {flight.services?.map((srv, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{srv}</span>
                </div>
              )) || (
                <>
                  <div className="flex items-center gap-2 text-slate-700"><Wifi className="w-3.5 h-3.5 text-sky-500" /> Wi-Fi à bord</div>
                  <div className="flex items-center gap-2 text-slate-700"><Coffee className="w-3.5 h-3.5 text-sky-500" /> Repas & Boissons</div>
                  <div className="flex items-center gap-2 text-slate-700"><Tv className="w-3.5 h-3.5 text-sky-500" /> Écran HD individuel</div>
                  <div className="flex items-center gap-2 text-slate-700"><Zap className="w-3.5 h-3.5 text-sky-500" /> Prises USB / 220V</div>
                </>
              )}
            </div>
          </div>

          {/* Fare breakdown */}
          <div className="bg-sky-50/50 rounded-2xl p-4 border border-sky-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-3">
              Détail & Décomposition Tarifaire ({passengerCount} passager{passengerCount > 1 ? 's' : ''})
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tarif de base HT ({passengerCount} x {formatPrice(flight.price, currency)})</span>
                <span className="font-semibold text-slate-900">{formatPrice(baseTotal, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes d'aéroport & redevances de sécurité</span>
                <span className="font-semibold text-slate-900">{formatPrice(taxesTotal, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Frais de réservation HorizonVols</span>
                <span className="font-semibold text-emerald-600">OFFERTS (0 €)</span>
              </div>
              <div className="border-t border-sky-200/60 pt-2 mt-2 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Montant Total TTC</span>
                <span className="text-lg text-sky-600">{formatPrice(grandTotal, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500">Total pour la sélection</div>
            <div className="text-xl font-black text-slate-900">
              {formatPrice(grandTotal, currency)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-modal-cancel"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs"
            >
              Fermer
            </button>
            <button
              type="button"
              id="btn-modal-start-booking"
              onClick={() => {
                onClose();
                onSelect(flight);
              }}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
            >
              <span>Continuer la réservation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
