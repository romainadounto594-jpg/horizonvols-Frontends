import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { getAirportByCode } from '../data/airports.js';
import { formatPrice, formatDateFr } from '../utils/formatters.js';
import {
  User,
  Plane,
  Calendar,
  Award,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user, updateUser } = useAuth();
  const { bookings, currency } = useBooking();

  const [activeTab, setActiveTab] = useState('bookings'); // bookings, profile, miles
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || 'Moussa',
    lastName: user?.lastName || 'Diop',
    email: user?.email || 'moussa.diop@exemple.sn',
    phone: user?.phone || '+221 77 654 32 10'
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUser(profileForm);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-slate-50/70 min-h-screen pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500 text-white font-black text-2xl flex items-center justify-center shadow-lg">
              {user?.firstName?.charAt(0) || 'M'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Bonjour, {user?.firstName || 'Moussa'} {user?.lastName || 'Diop'}
                </h1>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full">
                  Membre Gold
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Espace personnel voyageur HorizonVols • {bookings.length} voyage(s) enregistré(s)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 self-start sm:self-center">
            <Award className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Solde Horizon Miles</div>
              <div className="text-lg font-black text-amber-400">18 450 Miles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-1.5 inline-flex gap-1">
          <button
            type="button"
            id="tab-my-bookings"
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Mes Réservations ({bookings.length})</span>
          </button>

          <button
            type="button"
            id="tab-my-profile"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Mon Profil</span>
          </button>

          <button
            type="button"
            id="tab-my-miles"
            onClick={() => setActiveTab('miles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'miles'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Programme Fidélité</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900">Historique de vos vols</h2>
              <Link
                to="/"
                className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
              >
                <span>Nouvelle réservation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
                <Plane className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Aucune réservation pour l'instant</p>
                <Link to="/" className="text-xs text-sky-600 font-semibold hover:underline mt-1 inline-block">
                  Explorer les vols pas chers
                </Link>
              </div>
            ) : (
              bookings.map((b) => {
                const fromAirport = getAirportByCode(b.flight.from);
                const toAirport = getAirportByCode(b.flight.to);

                return (
                  <div
                    key={b.pnr}
                    id={`booking-item-${b.pnr}`}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 hover:border-sky-300 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left flight summary */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-black bg-sky-50 text-sky-700 px-2.5 py-1 rounded-md border border-sky-100">
                            PNR: {b.pnr}
                          </span>
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {b.status === 'confirmed' ? 'Confirmé ✓' : 'Effectué'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            Vol {b.flight.airlineCode} {b.flight.flightNumber}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-slate-900 font-bold">
                          <div className="text-base sm:text-lg">
                            {fromAirport.city} ({b.flight.from})
                          </div>
                          <Plane className="w-4 h-4 text-sky-600" />
                          <div className="text-base sm:text-lg">
                            {toAirport.city} ({b.flight.to})
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Départ : {formatDateFr(b.flight.departureDate)} à {b.flight.departureTime}</span>
                          </div>
                          <span>•</span>
                          <span>Passager(s) : {b.passengers.length} ({b.passengers[0]?.firstName} {b.passengers[0]?.lastName})</span>
                          <span>•</span>
                          <span>Siège : <strong>{b.passengers[0]?.seat || '12A'}</strong></span>
                        </div>
                      </div>

                      {/* Right actions & price */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 gap-3">
                        <div className="text-left lg:text-right">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                            Montant réglé
                          </span>
                          <span className="text-xl font-black text-slate-900">
                            {formatPrice(b.pricing.total, b.pricing.currency || currency)}
                          </span>
                        </div>

                        <Link
                          to={`/confirmation/${b.pnr}`}
                          id={`btn-view-ticket-${b.pnr}`}
                          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Voir le billet électronique</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 max-w-2xl">
            <h2 className="text-lg font-black text-slate-900 mb-1">Mes Informations Personnelles</h2>
            <p className="text-xs text-slate-500 mb-6">
              Mettez à jour vos coordonnées pour pré-remplir automatiquement vos futures réservations.
            </p>

            {isSaved && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-3 rounded-xl mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Vos modifications ont été enregistrées avec succès !</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom</label>
                  <input
                    id="profile-firstname"
                    type="text"
                    required
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nom</label>
                  <input
                    id="profile-lastname"
                    type="text"
                    required
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="profile-email"
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone mobile</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="profile-phone"
                    type="tel"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-save-profile"
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'miles' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 mb-1">Programme Horizon Miles</h2>
              <p className="text-xs text-slate-500">
                Cumulez des miles à chaque voyage et échangez-les contre des surclassements, des bagages gratuits ou des billets prime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Votre Statut Actuel</div>
                <div className="text-2xl font-black text-amber-900 mt-1">Horizon Gold</div>
                <p className="text-[11px] text-amber-700 mt-2">
                  Avantages : +50% de miles bonus, accès coupe-file et salon VIP offert.
                </p>
              </div>

              <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-800">Solde disponible</div>
                <div className="text-2xl font-black text-sky-900 mt-1">18 450 Miles</div>
                <p className="text-[11px] text-sky-700 mt-2">
                  Suffisant pour 1 surclassement en Classe Affaires sur vol moyen-courrier.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Prochain Palier</div>
                <div className="text-2xl font-black text-slate-900 mt-1">Platinum (25 000)</div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Il vous manque 6 550 Miles pour atteindre le statut d'élite Horizon Platinum.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
