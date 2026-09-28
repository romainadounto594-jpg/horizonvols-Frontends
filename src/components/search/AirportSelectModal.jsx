import React, { useState, useMemo } from 'react';
import { AIRPORTS } from '../../data/airports.js';
import { Search, X, MapPin, Check } from 'lucide-react';

export default function AirportSelectModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Sélectionner un aéroport',
  selectedCode = ''
}) {
  const [query, setQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Tous');

  const filteredAirports = useMemo(() => {
    return AIRPORTS.filter(airport => {
      const matchesRegion = selectedRegion === 'Tous' || airport.region === selectedRegion;
      const q = query.toLowerCase().trim();
      const matchesQuery = !q ||
        airport.code.toLowerCase().includes(q) ||
        airport.city.toLowerCase().includes(q) ||
        airport.country.toLowerCase().includes(q) ||
        airport.name.toLowerCase().includes(q);

      return matchesRegion && matchesQuery;
    });
  }, [query, selectedRegion]);

  if (!isOpen) return null;

  return (
    <div id="airport-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div
        id="airport-modal-container"
        className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">Recherchez par ville, aéroport ou code IATA (ex: CDG, DSS)</p>
          </div>
          <button
            id="btn-close-airport-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              id="airport-search-input"
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Paris, Dakar, Abidjan, CDG, Cotonou..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 placeholder:text-slate-400"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
            {['Tous', 'Afrique', 'Europe', 'Amérique', 'Moyen-Orient'].map((region) => (
              <button
                key={region}
                id={`btn-region-${region}`}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                  selectedRegion === region
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Airport list */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 flex-1">
          {filteredAirports.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <MapPin className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium">Aucun aéroport trouvé pour « {query} »</p>
              <p className="text-xs text-slate-400 mt-1">Essayez un autre code ou une autre ville.</p>
            </div>
          ) : (
            filteredAirports.map((airport) => {
              const isSelected = selectedCode === airport.code;
              return (
                <button
                  key={airport.code}
                  id={`airport-item-${airport.code}`}
                  onClick={() => {
                    onSelect(airport.code);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors ${
                    isSelected ? 'bg-sky-50 text-sky-900 font-semibold' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0" role="img" aria-label={airport.country}>
                      {airport.flag || '✈️'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{airport.city}</span>
                        <span className="text-xs text-slate-400">• {airport.country}</span>
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[280px] sm:max-w-md">
                        {airport.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-1 rounded bg-slate-100 font-mono text-xs font-bold text-slate-700">
                      {airport.code}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
