import React, { useState } from 'react';
import { formatPrice } from '../../utils/formatters.js';
import { useBooking } from '../../context/BookingContext.jsx';
import { Armchair, Check, Sparkles, ArrowRight, ArrowLeft, Info, User } from 'lucide-react';

export default function SeatMap({
  passengers = [],
  selectedSeats = {},
  onSelectSeat,
  onContinue,
  onBack
}) {
  const { currency, activeBooking, setActiveBooking } = useBooking();
  const [activePassengerIndex, setActivePassengerIndex] = useState(0);

  // Configuration de la cabine
  // Rangées 1-4 : Affaires / Premium (+25€)
  // Rangées 5-18 : Économique standard
  const rows = Array.from({ length: 18 }, (_, i) => i + 1);
  const leftCols = ['A', 'B', 'C'];
  const rightCols = ['D', 'E', 'F'];

  // Sièges déjà occupés par d'autres passagers (simulation réaliste)
  const occupiedSeats = new Set([
    '1B', '1C', '2D', '3A', '3B', '4E', '4F',
    '5B', '6A', '6C', '7D', '8A', '8B', '9E', '10C', '11A', '12B', '14D', '15F', '16A', '17C', '18B'
  ]);

  const handleSeatClick = (seatCode, isPremium) => {
    if (occupiedSeats.has(seatCode)) return;

    // Assigner le siège au passager actif
    const updatedSeats = { ...selectedSeats, [activePassengerIndex]: seatCode };
    onSelectSeat(updatedSeats);

    // Vérifier si un des sièges choisis est Premium pour ajuster les options
    const hasAnyPremium = Object.values(updatedSeats).some(s => {
      const row = parseInt(s.slice(0, -1), 10);
      return row <= 4 || row === 12; // Issue de secours ou business
    });

    setActiveBooking(prev => ({
      ...prev,
      selectedOptions: {
        ...prev.selectedOptions,
        premiumSeat: hasAnyPremium
      }
    }));

    // Passer automatiquement au passager suivant s'il y en a un
    if (activePassengerIndex < passengers.length - 1) {
      setActivePassengerIndex(activePassengerIndex + 1);
    }
  };

  const getSeatStatus = (seatCode) => {
    if (occupiedSeats.has(seatCode)) return 'occupied';
    const isSelectedByCurrent = selectedSeats[activePassengerIndex] === seatCode;
    if (isSelectedByCurrent) return 'selected-current';

    const isSelectedByOther = Object.entries(selectedSeats).some(
      ([idx, s]) => s === seatCode && Number(idx) !== activePassengerIndex
    );
    if (isSelectedByOther) return 'selected-other';

    const row = parseInt(seatCode.slice(0, -1), 10);
    if (row <= 4 || row === 12) return 'premium';
    return 'available';
  };

  return (
    <div className="space-y-6">
      {/* Passenger selector pill tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Attribuer un siège à :
        </div>
        <div className="flex flex-wrap gap-2">
          {passengers.map((p, idx) => {
            const assignedSeat = selectedSeats[idx];
            const isActive = activePassengerIndex === idx;

            return (
              <button
                key={idx}
                type="button"
                id={`btn-select-pax-seat-${idx}`}
                onClick={() => setActivePassengerIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{p.firstName || `Passager ${idx + 1}`}</span>
                <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                  isActive ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-800'
                }`}>
                  {assignedSeat || 'Non choisi'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Cabin & Legend Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        {/* Visual Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pb-6 mb-6 border-b border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white border-2 border-slate-300"></div>
            <span>Standard (Inclus)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-50 border-2 border-amber-400 flex items-center justify-center text-[10px] text-amber-600">
              💎
            </div>
            <span>Confort / Extra Leg (+25 €)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-600 border-2 border-sky-600 flex items-center justify-center text-white">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Votre sélection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-slate-200 border-2 border-slate-300 opacity-50 cursor-not-allowed"></div>
            <span>Occupé</span>
          </div>
        </div>

        {/* Airplane Fuselage container */}
        <div className="max-w-md mx-auto relative bg-slate-50/80 rounded-t-[120px] rounded-b-3xl border-2 border-slate-200 p-4 sm:p-6 shadow-inner">
          {/* Cockpit tip */}
          <div className="w-20 h-8 mx-auto -mt-2 bg-slate-800 rounded-t-full flex items-center justify-center text-[10px] font-mono text-sky-400 font-bold tracking-widest uppercase">
            COCKPIT
          </div>

          <div className="text-center text-[10px] font-bold text-slate-400 tracking-wider uppercase my-4">
            Avion {activeBooking.flight?.aircraft || 'Boeing 777-300ER'} • Cabine Principale
          </div>

          {/* Column letters */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs font-bold text-slate-400 mb-3">
            <div>A</div>
            <div>B</div>
            <div>C</div>
            <div className="text-[10px] text-slate-300">Allée</div>
            <div>D</div>
            <div>E</div>
            <div>F</div>
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {rows.map((rowNum) => {
              const isPremiumRow = rowNum <= 4;
              const isExitRow = rowNum === 12;

              return (
                <div key={rowNum} className="relative">
                  {/* Exit row indicator */}
                  {isExitRow && (
                    <div className="text-[9px] font-bold text-emerald-700 bg-emerald-100/60 text-center py-0.5 rounded my-1">
                      ⬅ Issue de secours (Espace jambes +20cm) ➡
                    </div>
                  )}

                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2 items-center">
                    {/* Left seats (A, B, C) */}
                    {leftCols.map((col) => {
                      const code = `${rowNum}${col}`;
                      const status = getSeatStatus(code);
                      const isOccupied = status === 'occupied';
                      const isSelectedCurrent = status === 'selected-current';
                      const isSelectedOther = status === 'selected-other';
                      const isPrem = status === 'premium';

                      return (
                        <button
                          key={code}
                          type="button"
                          id={`seat-btn-${code}`}
                          disabled={isOccupied || isSelectedOther}
                          onClick={() => handleSeatClick(code, isPrem)}
                          title={`Siège ${code} ${isPrem ? '(Confort +25€)' : ''}`}
                          className={`h-8 sm:h-9 rounded-lg font-mono text-[10px] font-bold transition-all flex items-center justify-center relative ${
                            isOccupied
                              ? 'bg-slate-200 text-slate-400 border border-slate-300 opacity-60 cursor-not-allowed'
                              : isSelectedCurrent
                              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-2 ring-sky-400 scale-105'
                              : isSelectedOther
                              ? 'bg-sky-100 text-sky-800 border border-sky-300 opacity-80 cursor-not-allowed'
                              : isPrem
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 hover:border-sky-400'
                          }`}
                        >
                          {isSelectedCurrent ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : isPrem ? (
                            '💎'
                          ) : (
                            code
                          )}
                        </button>
                      );
                    })}

                    {/* Aisle Row Number */}
                    <div className="text-center font-mono text-[11px] font-bold text-slate-400">
                      {rowNum}
                    </div>

                    {/* Right seats (D, E, F) */}
                    {rightCols.map((col) => {
                      const code = `${rowNum}${col}`;
                      const status = getSeatStatus(code);
                      const isOccupied = status === 'occupied';
                      const isSelectedCurrent = status === 'selected-current';
                      const isSelectedOther = status === 'selected-other';
                      const isPrem = status === 'premium';

                      return (
                        <button
                          key={code}
                          type="button"
                          id={`seat-btn-${code}`}
                          disabled={isOccupied || isSelectedOther}
                          onClick={() => handleSeatClick(code, isPrem)}
                          title={`Siège ${code} ${isPrem ? '(Confort +25€)' : ''}`}
                          className={`h-8 sm:h-9 rounded-lg font-mono text-[10px] font-bold transition-all flex items-center justify-center relative ${
                            isOccupied
                              ? 'bg-slate-200 text-slate-400 border border-slate-300 opacity-60 cursor-not-allowed'
                              : isSelectedCurrent
                              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-2 ring-sky-400 scale-105'
                              : isSelectedOther
                              ? 'bg-sky-100 text-sky-800 border border-sky-300 opacity-80 cursor-not-allowed'
                              : isPrem
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 hover:border-sky-400'
                          }`}
                        >
                          {isSelectedCurrent ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : isPrem ? (
                            '💎'
                          ) : (
                            code
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center text-[10px] text-slate-400 mt-6 pt-3 border-t border-slate-200">
            Queue de l'appareil • Toilettes & Galley arrière
          </div>
        </div>
      </div>

      {/* Navigation CTA */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          id="btn-back-from-seats"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux options</span>
        </button>

        <button
          type="button"
          id="btn-continue-to-payment"
          onClick={onContinue}
          className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 flex items-center gap-2 transition-all"
        >
          <span>Continuer vers le Paiement</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
