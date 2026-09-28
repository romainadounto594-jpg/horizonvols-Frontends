import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext.jsx';
import { getAirportByCode } from '../../data/airports.js';
import AirportSelectModal from './AirportSelectModal.jsx';
import PassengerSelectPopover from './PassengerSelectPopover.jsx';
import {
  ArrowLeftRight,
  Calendar,
  Users,
  Search,
  Sparkles,
  PlaneTakeoff,
  PlaneLanding
} from 'lucide-react';

export default function FlightSearch({ className = '' }) {
  const navigate = useNavigate();
  const { searchParams, setSearchParams } = useBooking();

  // Modals / Popovers states
  const [modalOriginOpen, setModalOriginOpen] = useState(false);
  const [modalDestOpen, setModalDestOpen] = useState(false);
  const [passengerPopoverOpen, setPassengerPopoverOpen] = useState(false);

  // Local copy of form state
  const [tripType, setTripType] = useState(searchParams.tripType || 'roundtrip');
  const [fromCode, setFromCode] = useState(searchParams.from || 'CDG');
  const [toCode, setToCode] = useState(searchParams.to || 'DSS');
  const [departureDate, setDepartureDate] = useState(searchParams.departureDate || '2026-10-15');
  const [returnDate, setReturnDate] = useState(searchParams.returnDate || '2026-10-25');
  const [cabinClass, setCabinClass] = useState(searchParams.cabinClass || 'economy');
  const [passengers, setPassengers] = useState(searchParams.passengers || { adults: 1, children: 0, infants: 0 });
  const [directOnly, setDirectOnly] = useState(searchParams.directOnly || false);

  const originAirport = getAirportByCode(fromCode);
  const destAirport = getAirportByCode(toCode);

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  const handleSwapAirports = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({
      tripType,
      from: fromCode,
      to: toCode,
      departureDate,
      returnDate: tripType === 'roundtrip' ? returnDate : null,
      cabinClass,
      passengers,
      directOnly
    });
    navigate('/vols');
  };

  return (
    <div id="flight-search-widget" className={`bg-white rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-100 p-5 sm:p-7 ${className}`}>
      {/* Trip Type & Class Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center bg-slate-100/80 p-1 rounded-xl">
          <button
            type="button"
            id="tab-roundtrip"
            onClick={() => setTripType('roundtrip')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tripType === 'roundtrip'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aller-retour
          </button>
          <button
            type="button"
            id="tab-oneway"
            onClick={() => setTripType('oneway')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tripType === 'oneway'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aller simple
          </button>
          <button
            type="button"
            id="tab-multicity"
            onClick={() => setTripType('multicity')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tripType === 'multicity'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Multidestination
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Passenger Selector Trigger */}
          <div className="relative">
            <button
              type="button"
              id="btn-trigger-passengers"
              onClick={() => setPassengerPopoverOpen(!passengerPopoverOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-sky-600" />
              <span>
                {totalPassengers} {totalPassengers > 1 ? 'passagers' : 'passager'}
              </span>
            </button>
            <PassengerSelectPopover
              passengers={passengers}
              onChange={setPassengers}
              isOpen={passengerPopoverOpen}
              onClose={() => setPassengerPopoverOpen(false)}
            />
          </div>

          {/* Cabin Class Selector */}
          <select
            id="select-cabin-class"
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
          >
            <option value="economy">Économique</option>
            <option value="premium">Premium Economy</option>
            <option value="business">Affaires (Business)</option>
            <option value="first">Première Classe</option>
          </select>
        </div>
      </div>

      {/* Main Form Fields */}
      <form onSubmit={handleSearch} className="mt-5 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Origine & Destination Container */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-2 relative">
            {/* Origine */}
            <div
              id="field-origin-airport"
              onClick={() => setModalOriginOpen(true)}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-sky-400 bg-slate-50/50 hover:bg-white cursor-pointer transition-all flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                <PlaneTakeoff className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Départ
                </span>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-extrabold text-sm text-slate-900 truncate">
                    {originAirport.city}
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-1.5 py-0.2 rounded">
                    {originAirport.code}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate block">
                  {originAirport.name}
                </span>
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              id="btn-swap-airports"
              onClick={(e) => {
                e.stopPropagation();
                handleSwapAirports();
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-sky-600 hover:scale-110 hidden sm:flex items-center justify-center transition-all"
              title="Inverser départ et arrivée"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>

            {/* Destination */}
            <div
              id="field-destination-airport"
              onClick={() => setModalDestOpen(true)}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-sky-400 bg-slate-50/50 hover:bg-white cursor-pointer transition-all flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <PlaneLanding className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Destination
                </span>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-extrabold text-sm text-slate-900 truncate">
                    {destAirport.city}
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                    {destAirport.code}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate block">
                  {destAirport.name}
                </span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Date Départ */}
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus-within:border-sky-400 focus-within:bg-white transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Date de départ
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                <input
                  id="input-departure-date"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Date Retour (si aller-retour) */}
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                tripType === 'roundtrip'
                  ? 'border-slate-200 bg-slate-50/50 focus-within:border-sky-400 focus-within:bg-white'
                  : 'border-slate-100 bg-slate-100/50 opacity-40 cursor-not-allowed'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Date de retour
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  id="input-return-date"
                  type="date"
                  disabled={tripType !== 'roundtrip'}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none w-full disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Bouton Rechercher */}
          <div className="lg:col-span-2 flex flex-col justify-end">
            <button
              id="btn-search-flights"
              type="submit"
              className="w-full h-full min-h-[52px] px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Rechercher</span>
            </button>
          </div>
        </div>

        {/* Options secondaires */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              id="checkbox-direct-only"
              type="checkbox"
              checked={directOnly}
              onChange={(e) => setDirectOnly(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
            />
            <span className="font-medium">Vols directs uniquement</span>
          </label>

          <div className="flex items-center gap-1.5 text-sky-600 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Garantie du meilleur prix HorizonVols</span>
          </div>
        </div>
      </form>

      {/* Airport modals */}
      <AirportSelectModal
        isOpen={modalOriginOpen}
        onClose={() => setModalOriginOpen(false)}
        onSelect={(code) => setFromCode(code)}
        title="Aéroport de départ"
        selectedCode={fromCode}
      />

      <AirportSelectModal
        isOpen={modalDestOpen}
        onClose={() => setModalDestOpen(false)}
        onSelect={(code) => setToCode(code)}
        title="Aéroport de destination"
        selectedCode={toCode}
      />
    </div>
  );
}
