import React from 'react';
import { Users, Plus, Minus } from 'lucide-react';

export default function PassengerSelectPopover({
  passengers,
  onChange,
  isOpen,
  onClose
}) {
  if (!isOpen) return null;

  const updateCount = (type, delta) => {
    const current = passengers[type] || 0;
    const nextVal = Math.max(0, current + delta);

    if (type === 'adults' && nextVal < 1) return; // au moins 1 adulte
    if (type === 'infants' && nextVal > (passengers.adults || 1)) return; // 1 bébé max par adulte

    const nextPassengers = { ...passengers, [type]: nextVal };
    const total = nextPassengers.adults + nextPassengers.children + nextPassengers.infants;
    if (total > 9) return; // Limite 9 passagers par réservation

    onChange(nextPassengers);
  };

  return (
    <div
      id="passenger-popover-menu"
      className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95"
    >
      <div className="space-y-4">
        {/* Adultes */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800">Adultes</div>
            <div className="text-[11px] text-slate-400">12 ans et plus</div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="btn-adults-minus"
              onClick={() => updateCount('adults', -1)}
              disabled={passengers.adults <= 1}
              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-5 text-center text-xs font-bold text-slate-800">{passengers.adults}</span>
            <button
              type="button"
              id="btn-adults-plus"
              onClick={() => updateCount('adults', 1)}
              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Enfants */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-800">Enfants</div>
            <div className="text-[11px] text-slate-400">2 à 11 ans</div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="btn-children-minus"
              onClick={() => updateCount('children', -1)}
              disabled={passengers.children <= 0}
              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-5 text-center text-xs font-bold text-slate-800">{passengers.children}</span>
            <button
              type="button"
              id="btn-children-plus"
              onClick={() => updateCount('children', 1)}
              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bébés */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-800">Bébés</div>
            <div className="text-[11px] text-slate-400">Moins de 2 ans (sur les genoux)</div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="btn-infants-minus"
              onClick={() => updateCount('infants', -1)}
              disabled={passengers.infants <= 0}
              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-5 text-center text-xs font-bold text-slate-800">{passengers.infants}</span>
            <button
              type="button"
              id="btn-infants-plus"
              onClick={() => updateCount('infants', 1)}
              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          id="btn-confirm-passengers"
          onClick={onClose}
          className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition-colors"
        >
          Valider
        </button>
      </div>
    </div>
  );
}
