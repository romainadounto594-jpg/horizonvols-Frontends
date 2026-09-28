import React from 'react';
import { ArrowUpDown, Zap, DollarSign, Award, Clock } from 'lucide-react';

export default function FlightSort({ sortBy, onChange, resultsCount = 0 }) {
  const options = [
    { id: 'best', label: 'Meilleur choix', icon: Award, desc: 'Équilibre prix / durée' },
    { id: 'cheapest', label: 'Le moins cher', icon: DollarSign, desc: 'Économie maximale' },
    { id: 'fastest', label: 'Le plus rapide', icon: Zap, desc: 'Temps de trajet minimal' },
    { id: 'departure', label: 'Heure de départ', icon: Clock, desc: 'Partir au plus tôt' }
  ];

  return (
    <div id="flight-sort-bar" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-5">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
        <ArrowUpDown className="w-4 h-4 text-sky-600" />
        <span>
          <strong className="text-slate-900">{resultsCount}</strong> vols trouvés
        </span>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = sortBy === opt.id;
          return (
            <button
              key={opt.id}
              id={`sort-btn-${opt.id}`}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
