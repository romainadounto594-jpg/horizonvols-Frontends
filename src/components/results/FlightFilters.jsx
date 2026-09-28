import React from 'react';
import { formatPrice } from '../../utils/formatters.js';
import { useBooking } from '../../context/BookingContext.jsx';
import { Filter, RotateCcw, X } from 'lucide-react';

export default function FlightFilters({
  filters,
  onChange,
  onReset,
  availableAirlines = [],
  minPrice = 200,
  maxPrice = 1500,
  isMobileModal = false,
  onCloseMobile
}) {
  const { currency } = useBooking();

  const handleAirlineToggle = (code) => {
    const current = filters.airlines || [];
    const next = current.includes(code)
      ? current.filter(c => c !== code)
      : [...current, code];
    onChange({ ...filters, airlines: next });
  };

  const handleStopToggle = (stopCount) => {
    const current = filters.stops || [];
    const next = current.includes(stopCount)
      ? current.filter(s => s !== stopCount)
      : [...current, stopCount];
    onChange({ ...filters, stops: next });
  };

  const handleTimeSlotToggle = (slot) => {
    const current = filters.timeSlots || [];
    const next = current.includes(slot)
      ? current.filter(s => s !== slot)
      : [...current, slot];
    onChange({ ...filters, timeSlots: next });
  };

  const content = (
    <div className="space-y-6">
      {/* Header with reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-600" />
          <h3 className="font-bold text-sm text-slate-900">Filtres de recherche</h3>
        </div>
        <button
          type="button"
          id="btn-reset-filters"
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-sky-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Réinitialiser</span>
        </button>
      </div>

      {/* Escales */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Escales
        </h4>
        <div className="space-y-2">
          {[
            { value: 0, label: 'Vols directs uniquement' },
            { value: 1, label: '1 escale maximum' },
            { value: 2, label: '2 escales et plus' }
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                id={`filter-stop-${item.value}`}
                type="checkbox"
                checked={filters.stops.includes(item.value)}
                onChange={() => handleStopToggle(item.value)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Prix Maximum */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Prix maximum
          </h4>
          <span className="text-xs font-extrabold text-sky-600">
            {formatPrice(filters.maxPrice, currency)}
          </span>
        </div>
        <input
          id="filter-price-slider"
          type="range"
          min={minPrice}
          max={maxPrice}
          step={20}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>{formatPrice(minPrice, currency)}</span>
          <span>{formatPrice(maxPrice, currency)}</span>
        </div>
      </div>

      {/* Horaires de départ */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Heure de départ
        </h4>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'morning', label: 'Matin', time: '00h - 12h' },
            { id: 'afternoon', label: 'Après-midi', time: '12h - 18h' },
            { id: 'evening', label: 'Soir', time: '18h - 24h' }
          ].map((slot) => {
            const isChecked = filters.timeSlots.includes(slot.id);
            return (
              <button
                key={slot.id}
                type="button"
                id={`filter-time-${slot.id}`}
                onClick={() => handleTimeSlotToggle(slot.id)}
                className={`p-2 rounded-xl border text-center transition-all ${
                  isChecked
                    ? 'bg-sky-50 border-sky-500 text-sky-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="text-[11px] leading-tight">{slot.label}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{slot.time}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compagnies aériennes */}
      {availableAirlines.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
            Compagnies Aériennes
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {availableAirlines.map((airline) => (
              <label key={airline.code} className="flex items-center justify-between text-xs text-slate-700 cursor-pointer select-none">
                <div className="flex items-center gap-2">
                  <input
                    id={`filter-airline-${airline.code}`}
                    type="checkbox"
                    checked={filters.airlines.includes(airline.code)}
                    onChange={() => handleAirlineToggle(airline.code)}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                  />
                  <span>{airline.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">({airline.code})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Bagages */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Bagages
        </h4>
        <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
          <input
            id="filter-baggage-included"
            type="checkbox"
            checked={filters.holdBaggageOnly}
            onChange={(e) => onChange({ ...filters, holdBaggageOnly: e.target.checked })}
            className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
          />
          <span>Bagages en soute inclus</span>
        </label>
      </div>
    </div>
  );

  if (isMobileModal) {
    return (
      <div id="mobile-filter-drawer" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <span className="font-bold text-base text-slate-900">Filtres</span>
              <button
                id="btn-close-mobile-filters"
                onClick={onCloseMobile}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
          <div className="pt-6 border-t border-slate-100 mt-6">
            <button
              id="btn-apply-mobile-filters"
              type="button"
              onClick={onCloseMobile}
              className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl text-sm shadow-md"
            >
              Afficher les résultats
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="flight-filters-card" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      {content}
    </div>
  );
}
