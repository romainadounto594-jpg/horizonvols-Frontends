import React from 'react';
import { useNavigate } from 'react-router-dom';
import FlightSearch from '../components/search/FlightSearch.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { AIRPORTS } from '../data/airports.js';
import { AIRLINES } from '../data/airlines.js';
import { formatPrice } from '../utils/formatters.js';
import {
  ShieldCheck,
  Zap,
  Headphones,
  CreditCard,
  Star,
  ChevronRight,
  TrendingDown,
  Sparkles,
  PlaneTakeoff,
  Globe2
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { setSearchParams, currency } = useBooking();

  const popularDestinations = [
    {
      city: 'Dakar',
      country: 'Sénégal',
      code: 'DSS',
      from: 'CDG',
      price: 490,
      image: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=600&q=80',
      badge: 'Très demandé'
    },
    {
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      code: 'ABJ',
      from: 'CDG',
      price: 520,
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80',
      badge: 'Promo'
    },
    {
      city: 'Paris',
      country: 'France',
      code: 'CDG',
      from: 'DSS',
      price: 510,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      badge: 'Incontournable'
    },
    {
      city: 'Dubaï',
      country: 'Émirats Arabes Unis',
      code: 'DXB',
      from: 'CDG',
      price: 580,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
      badge: 'Luxe & Soleil'
    },
    {
      city: 'Casablanca',
      country: 'Maroc',
      code: 'CMN',
      from: 'CDG',
      price: 210,
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80',
      badge: 'Petit prix'
    },
    {
      city: 'New York',
      country: 'États-Unis',
      code: 'JFK',
      from: 'CDG',
      price: 430,
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
      badge: 'Best-Seller'
    }
  ];

  const handleDestinationClick = (dest) => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 14);

    const depStr = today.toISOString().split('T')[0];
    const retStr = nextWeek.toISOString().split('T')[0];

    setSearchParams({
      tripType: 'roundTrip',
      from: dest.from,
      to: dest.code,
      departureDate: depStr,
      returnDate: retStr,
      passengers: { adults: 1, children: 0, infants: 0 },
      cabinClass: 'economy'
    });

    navigate(`/results?from=${dest.from}&to=${dest.code}&date=${depStr}&return=${retStr}&class=economy`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section with Flight Search */}
      <section className="relative bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 text-white pt-12 sm:pt-20 pb-28 sm:pb-36 px-4 sm:px-6 overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comparateur & Billetterie Aérienne Intelligente</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-3xl mx-auto leading-tight sm:leading-none">
            Explorez le monde aux <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">meilleurs tarifs</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
            Des milliers de vols directs et correspondances vers l'Afrique, l'Europe et le monde.
            Réservation instantanée sécurisée par Carte Bancaire et Mobile Money.
          </p>
        </div>

        {/* Floating Search Card */}
        <div className="max-w-5xl mx-auto relative z-20">
          <FlightSearch />
        </div>
      </section>

      {/* Trust & Guarantees Strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1">Meilleurs Prix Garantis</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Algorithmes de comparaison temps réel sans frais cachés à l'étape finale.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1">Paiement 100% Sécurisé</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Visa, Mastercard et Mobile Money (Wave, Orange Money, MTN MoMo).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1">Billet Émis en 1 Minute</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Billet électronique avec PNR officiel transmis immédiatement par email.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1">Assistance Clientèle 24/7</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Conseillers experts joignables par téléphone et messagerie instantanée.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Destinations Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
              Inspirations d'évasion
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Destinations les plus plébiscitées
            </h2>
          </div>
          <span className="text-xs text-slate-500 mt-2 sm:mt-0">
            Tarifs aller simple indicatifs avec taxes incluses
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((dest) => (
            <div
              key={dest.code}
              id={`card-dest-${dest.code}`}
              onClick={() => handleDestinationClick(dest)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold uppercase tracking-wider py-1 px-2.5 rounded-full shadow-xs">
                  {dest.badge}
                </span>
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-xl font-black block">{dest.city}</span>
                  <span className="text-xs text-slate-300">{dest.country}</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-between mt-auto bg-white">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">À partir de</span>
                  <div className="text-lg font-black text-slate-900">
                    {formatPrice(dest.price, currency)}
                  </div>
                </div>

                <span className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center transition-all">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partner Airlines */}
      <section className="bg-slate-50 py-12 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
            Plus de 500 compagnies aériennes mondiales référencées
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {AIRLINES.slice(0, 7).map((airline) => (
              <div
                key={airline.code}
                className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs"
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
                  style={{ backgroundColor: airline.logoColor }}
                >
                  {airline.code}
                </div>
                <span className="text-xs font-bold text-slate-800">{airline.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            La confiance de plus de 120 000 voyageurs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Note moyenne de 4.9/5 basée sur plus de 14 000 avis certifiés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 italic">
              « Réservation fluide de mon Paris - Dakar pour les vacances. Le paiement par Wave m'a évité les complications de carte et j'ai reçu le billet en PDF dans la minute ! »
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
                MD
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Moussa Diop</span>
                <span className="text-[10px] text-slate-400">Vol Paris ➔ Dakar • Air Sénégal</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 italic">
              « Très impressionné par la clarté du plan de cabine pour choisir nos sièges familiaux. Le comparateur m'a fait économiser 180 € sur nos billets vers Abidjan. »
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                CB
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Camille Bernard</span>
                <span className="text-[10px] text-slate-400">Vol Paris ➔ Abidjan • Corsair</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 italic">
              « Service client impeccable ! J'avais une question sur les bagages en soute, répondu en 3 minutes sur le chat. Je recommande vivement HorizonVols. »
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                FK
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Fatou Kouamé</span>
                <span className="text-[10px] text-slate-400">Vol Abidjan ➔ Paris • Air France</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
