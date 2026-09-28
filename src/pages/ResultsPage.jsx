import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { searchFlights } from '../data/flights.js';
import { apiService } from '../services/api.js';
import { getAirportByCode } from '../data/airports.js';
import { AIRLINES } from '../data/airlines.js';
import FlightCard from '../components/results/FlightCard.jsx';
import FlightFilters from '../components/results/FlightFilters.jsx';
import FlightSort from '../components/results/FlightSort.jsx';
import FlightDetailModal from '../components/results/FlightDetailModal.jsx';
import SkeletonLoader from '../components/results/SkeletonLoader.jsx';
import FlightSearch from '../components/search/FlightSearch.jsx';
import AuthModal from '../components/common/AuthModal.jsx';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Plane,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ResultsPage() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { searchParams, setSearchParams, startBookingFlight, addToast } = useBooking();

  const [isLoading, setIsLoading] = useState(true);
  const [allFlights, setAllFlights] = useState([]);
  const [selectedDetailFlight, setSelectedDetailFlight] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isModifySearchOpen, setIsModifySearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingFlightForBooking, setPendingFlightForBooking] = useState(null);

  // Filter and Sort states
  const [sortBy, setSortBy] = useState('best');
  const [filters, setFilters] = useState({
    maxPrice: 1600,
    stops: [],
    airlines: [],
    timeSlots: [],
    holdBaggageOnly: false
  });

  // Sync from URL if accessed directly with query string
  useEffect(() => {
    const from = urlParams.get('from');
    const to = urlParams.get('to');
    const date = urlParams.get('date');
    const retDate = urlParams.get('return');
    const cabin = urlParams.get('class');

    if (from && to) {
      setSearchParams(prev => ({
        ...prev,
        from,
        to,
        departureDate: date || prev.departureDate,
        returnDate: retDate || prev.returnDate,
        cabinClass: cabin || prev.cabinClass
      }));
    }
  }, [urlParams]);

  // Load flights based on searchParams (via Laravel API with fallback)
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    apiService.searchFlights(searchParams)
      .then((results) => {
        if (isMounted) {
          setAllFlights(results && results.length > 0 ? results : searchFlights(searchParams));
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAllFlights(searchFlights(searchParams));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams.from, searchParams.to, searchParams.departureDate, searchParams.cabinClass]);

  // Filter logic
  const filteredFlights = useMemo(() => {
    return allFlights.filter((flight) => {
      // Prix max
      if (flight.price > filters.maxPrice) return false;

      // Escales
      if (filters.stops.length > 0) {
        if (!filters.stops.includes(flight.stops)) {
          // If filtering 2+ stops
          if (!(filters.stops.includes(2) && flight.stops >= 2)) {
            return false;
          }
        }
      }

      // Compagnies
      if (filters.airlines.length > 0) {
        if (!filters.airlines.includes(flight.airlineCode)) return false;
      }

      // Time slots
      if (filters.timeSlots.length > 0) {
        const hour = parseInt(flight.departureTime.split(':')[0], 10);
        let slot = 'morning';
        if (hour >= 12 && hour < 18) slot = 'afternoon';
        else if (hour >= 18) slot = 'evening';

        if (!filters.timeSlots.includes(slot)) return false;
      }

      // Baggage
      if (filters.holdBaggageOnly && flight.baggage?.hold?.includes('0')) {
        return false;
      }

      return true;
    });
  }, [allFlights, filters]);

  // Sort logic
  const sortedFlights = useMemo(() => {
    const list = [...filteredFlights];
    switch (sortBy) {
      case 'cheapest':
        return list.sort((a, b) => a.price - b.price);
      case 'fastest':
        return list.sort((a, b) => a.durationMinutes - b.durationMinutes);
      case 'departure':
        return list.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
      case 'best':
      default:
        return list.sort((a, b) => {
          if (a.recommended && !b.recommended) return -1;
          if (!a.recommended && b.recommended) return 1;
          return a.price - b.price;
        });
    }
  }, [filteredFlights, sortBy]);

  const handleSelectFlight = (flight) => {
    setIsDetailOpen(false);
    // Si le client n'est pas encore connecté ou inscrit, on lui demande avant de continuer
    if (!currentUser) {
      setPendingFlightForBooking(flight);
      setAuthModalOpen(true);
      if (addToast) {
        addToast('info', 'Veuillez vous inscrire ou vous connecter pour réserver ce vol.');
      }
      return;
    }

    startBookingFlight(flight, currentUser);
    navigate('/booking');
  };

  const handleAuthSuccess = (user) => {
    if (pendingFlightForBooking) {
      const flight = pendingFlightForBooking;
      setPendingFlightForBooking(null);
      startBookingFlight(flight, user);
      navigate('/booking');
    }
  };

  const handleViewDetails = (flight) => {
    setSelectedDetailFlight(flight);
    setIsDetailOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      maxPrice: 1600,
      stops: [],
      airlines: [],
      timeSlots: [],
      holdBaggageOnly: false
    });
  };

  const fromAirport = getAirportByCode(searchParams.from);
  const toAirport = getAirportByCode(searchParams.to);

  return (
    <div className="bg-slate-50/60 min-h-screen pb-16">
      {/* Top Search Context Bar */}
      <div className="bg-slate-900 text-white py-4 px-4 sm:px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shrink-0">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm sm:text-base font-black">
                <span>{fromAirport.city} ({fromAirport.code})</span>
                <span className="text-sky-400">➔</span>
                <span>{toAirport.city} ({toAirport.code})</span>
              </div>
              <div className="text-xs text-slate-400">
                {searchParams.departureDate} • {searchParams.passengers.adults + searchParams.passengers.children} passager(s) • Classe {searchParams.cabinClass}
              </div>
            </div>
          </div>

          <button
            type="button"
            id="btn-toggle-modify-search"
            onClick={() => setIsModifySearchOpen(!isModifySearchOpen)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center justify-center gap-1.5 transition-all self-start md:self-center border border-slate-700"
          >
            <span>Modifier la recherche</span>
            {isModifySearchOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Search Widget */}
      {isModifySearchOpen && (
        <div className="bg-slate-900/95 border-b border-slate-800 p-4 sm:p-6 animate-in slide-in-from-top duration-300">
          <div className="max-w-5xl mx-auto">
            <FlightSearch />
          </div>
        </div>
      )}

      {/* Main Results Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Mobile Filter Trigger Button */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <button
            type="button"
            id="btn-open-mobile-filters"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-sky-600" />
            <span>Filtrer les résultats</span>
          </button>

          <span className="text-xs font-bold text-slate-600">
            {sortedFlights.length} vol(s)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <FlightFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              availableAirlines={AIRLINES}
            />
          </div>

          {/* Results List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Sorting Controls Bar */}
            <FlightSort
              sortBy={sortBy}
              onChange={setSortBy}
              resultsCount={sortedFlights.length}
            />

            {/* Content Switcher */}
            {isLoading ? (
              <SkeletonLoader />
            ) : sortedFlights.length > 0 ? (
              <div className="space-y-3.5">
                {sortedFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onSelect={handleSelectFlight}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div
                id="no-flights-found"
                className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-4 shadow-xs"
              >
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Aucun vol ne correspond exactement à vos critères
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Essayez d'élargir vos filtres (prix maximum, compagnies ou nombre d'escales) pour trouver des options de voyage disponibles.
                </p>
                <button
                  type="button"
                  id="btn-empty-reset-filters"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 shadow-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Réinitialiser les filtres</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flight Detail Modal */}
      <FlightDetailModal
        flight={selectedDetailFlight}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSelect={handleSelectFlight}
      />

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <FlightFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          availableAirlines={AIRLINES}
          isMobileModal={true}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />
      )}

      {/* Modal d'inscription / connexion requis avant réservation */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingFlightForBooking(null);
        }}
        onSuccess={handleAuthSuccess}
        bookingFlight={pendingFlightForBooking}
        initialMode="register"
      />
    </div>
  );
}
