import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { BASE_FLIGHTS } from '../data/flights.js';
import { apiService } from '../services/api.js';
import { AIRLINES } from '../data/airlines.js';
import { AIRPORTS } from '../data/airports.js';
import { formatPrice } from '../utils/formatters.js';
import {
  BarChart3,
  TrendingUp,
  Users,
  Plane,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Filter,
  Eye,
  Trash2,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { bookings, cancelBooking, currency, addToast } = useBooking();
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, flights, stats
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Flight states for admin
  const [flightList, setFlightList] = useState(BASE_FLIGHTS);

  useEffect(() => {
    apiService.getAdminFlights().then((flights) => {
      if (flights && flights.length > 0) {
        setFlightList(flights);
      }
    }).catch(() => {});
  }, []);
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);
  const [newFlightForm, setNewFlightForm] = useState({
    airlineCode: 'AF',
    flightNumber: 'AF 820',
    from: 'CDG',
    to: 'DSS',
    departureTime: '14:30',
    arrivalTime: '19:15',
    duration: '5h45',
    price: 540,
    aircraft: 'Airbus A350-900',
    cabinClass: 'economy'
  });

  // Calculate high-level KPIs
  const totalBookingsCount = bookings.length;
  const totalRevenue = bookings.reduce((acc, b) => acc + (b.pricing?.total || 0), 0);
  const activeFlightsCount = flightList.length;
  const averageLoadFactor = '84.6%';

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.passengers[0]?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.passengers[0]?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.flight?.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const handleCancelBooking = (pnr) => {
    if (window.confirm(`Confirmez-vous l'annulation de la réservation PNR ${pnr} ?`)) {
      cancelBooking(pnr);
      addToast(`La réservation ${pnr} a été annulée`, 'info');
    }
  };

  const handleAddFlightSubmit = (e) => {
    e.preventDefault();
    const airline = AIRLINES.find(a => a.code === newFlightForm.airlineCode);
    const flightObj = {
      id: `fl-${Date.now()}`,
      airlineCode: newFlightForm.airlineCode,
      airlineName: airline?.name || 'Air France',
      flightNumber: newFlightForm.flightNumber,
      from: newFlightForm.from,
      to: newFlightForm.to,
      departureTime: newFlightForm.departureTime,
      arrivalTime: newFlightForm.arrivalTime,
      duration: newFlightForm.duration,
      durationMinutes: 345,
      price: Number(newFlightForm.price),
      aircraft: newFlightForm.aircraft,
      stops: 0,
      stopDetails: [],
      cabinClass: newFlightForm.cabinClass,
      baggage: { cabin: '1x 12kg', hold: '2x 23kg inclus' },
      services: ['Repas chaud', 'Divertissement HD', 'Wi-Fi haut débit'],
      ticketPolicy: 'Modifiable',
      recommended: false
    };

    setFlightList([flightObj, ...flightList]);
    setShowAddFlightModal(false);
    addToast(`Nouveau vol ${newFlightForm.flightNumber} ajouté au catalogue`, 'success');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Header */}
      <div className="bg-slate-900 text-white py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-400 text-xs font-mono font-bold px-2.5 py-0.5 rounded-md mb-2">
              <span>ADMINISTRATION CENTRALE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Tableau de Bord Commercial
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Supervision des flux de réservations, inventaire des vols et indicateurs de performance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-admin-add-flight"
              onClick={() => setShowAddFlightModal(true)}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Créer un vol</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Réservations</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalBookingsCount}</div>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" /> +14% ce mois
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Chiffre d'Affaires</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {formatPrice(totalRevenue, currency)}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" /> Objectif trimestriel atteint
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remplissage Moyen</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{averageLoadFactor}</div>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">Sur 30 derniers jours</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vols au Catalogue</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{activeFlightsCount}</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">100% opérationnels</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Plane className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search Bar Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
            <button
              type="button"
              id="admin-tab-bookings"
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Gestion des Réservations ({bookings.length})
            </button>
            <button
              type="button"
              id="admin-tab-flights"
              onClick={() => setActiveTab('flights')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'flights'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Catalogue des Vols ({flightList.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-admin-search"
              type="text"
              placeholder="Rechercher par PNR, passager, vol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>
        </div>

        {/* Tab 1: Bookings Management */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Liste des dossiers ({filteredBookings.length} affichés)
              </span>

              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 mr-2">Filtrer statut :</span>
                {['all', 'confirmed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                      statusFilter === st
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {st === 'all' ? 'Tous' : st === 'confirmed' ? 'Confirmés' : 'Annulés'}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">PNR</th>
                    <th className="py-3 px-4">Passager Principal</th>
                    <th className="py-3 px-4">Vol & Itinéraire</th>
                    <th className="py-3 px-4">Date de départ</th>
                    <th className="py-3 px-4">Montant Payé</th>
                    <th className="py-3 px-4">Mode de Paiement</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredBookings.map((b) => (
                    <tr key={b.pnr} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-700">
                        {b.pnr}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {b.passengers[0]?.civility} {b.passengers[0]?.firstName} {b.passengers[0]?.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">{b.contactInfo?.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">
                          {b.flight.from} ➔ {b.flight.to}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {b.flight.flightNumber} ({b.flight.airlineCode})
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {b.flight.departureDate} à {b.flight.departureTime}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {formatPrice(b.pricing.total, b.pricing.currency || currency)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {b.payment?.method || 'Carte'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {b.status === 'confirmed' ? 'Confirmé' : 'Annulé'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/confirmation/${b.pnr}`}
                            title="Voir le billet"
                            className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {b.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleCancelBooking(b.pnr)}
                              title="Annuler la réservation"
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Flights Catalog */}
        {activeTab === 'flights' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Catalogue actif des vols ({flightList.length} liaisons régulières)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Vol</th>
                    <th className="py-3 px-4">Compagnie</th>
                    <th className="py-3 px-4">Départ</th>
                    <th className="py-3 px-4">Arrivée</th>
                    <th className="py-3 px-4">Durée</th>
                    <th className="py-3 px-4">Appareil</th>
                    <th className="py-3 px-4">Tarif de base</th>
                    <th className="py-3 px-4">Escales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {flightList.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {f.flightNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800">{f.airlineName}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{f.from}</div>
                        <div className="text-[11px] text-slate-400">{f.departureTime}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{f.to}</div>
                        <div className="text-[11px] text-slate-400">{f.arrivalTime}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{f.duration}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{f.aircraft}</td>
                      <td className="py-3.5 px-4 font-bold text-sky-600">
                        {formatPrice(f.price, currency)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          f.stops === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {f.stops === 0 ? 'Direct' : `${f.stops} escale`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add Flight */}
      {showAddFlightModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-black text-base text-slate-900">Créer un nouveau vol régulier</h3>
              <button
                onClick={() => setShowAddFlightModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs"
              >
                Fermer
              </button>
            </div>

            <form onSubmit={handleAddFlightSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Compagnie</label>
                  <select
                    value={newFlightForm.airlineCode}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, airlineCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {AIRLINES.map((a) => (
                      <option key={a.code} value={a.code}>{a.name} ({a.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro de vol</label>
                  <input
                    type="text"
                    required
                    value={newFlightForm.flightNumber}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, flightNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Départ (Aéroport)</label>
                  <select
                    value={newFlightForm.from}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, from: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  >
                    {AIRPORTS.map((a) => (
                      <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Arrivée (Aéroport)</label>
                  <select
                    value={newFlightForm.to}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, to: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  >
                    {AIRPORTS.map((a) => (
                      <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Heure de départ</label>
                  <input
                    type="time"
                    required
                    value={newFlightForm.departureTime}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, departureTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Heure d'arrivée</label>
                  <input
                    type="time"
                    required
                    value={newFlightForm.arrivalTime}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, arrivalTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tarif de base (€)</label>
                  <input
                    type="number"
                    required
                    value={newFlightForm.price}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Appareil</label>
                  <input
                    type="text"
                    required
                    value={newFlightForm.aircraft}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, aircraft: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddFlightModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-600/20"
                >
                  Enregistrer le vol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
