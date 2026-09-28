import React from 'react';
import { getAirportByCode } from '../../data/airports.js';
import { getAirlineByCode } from '../../data/airlines.js';
import { formatPrice, formatDateFr } from '../../utils/formatters.js';
import { Plane, Download, Printer, QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ETicket({ booking }) {
  if (!booking) return null;

  const { pnr, flight, passengers, pricing, payment } = booking;
  const fromAirport = getAirportByCode(flight.from);
  const toAirport = getAirportByCode(flight.to);
  const airline = getAirlineByCode(flight.airlineCode);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Simulation téléchargement PDF
    const dummyBlob = new Blob([
      `BILLET ELECTRONIQUE HORIZONVOLS\nPNR: ${pnr}\nVol: ${flight.flightNumber}\nDate: ${flight.departureDate}\nDepart: ${flight.from} - Arrivee: ${flight.to}`
    ], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(dummyBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Billet_HorizonVols_${pnr}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Toolbar (hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Billet officiel émis et validé par HorizonVols</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-print-ticket"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer le billet</span>
          </button>
          <button
            type="button"
            id="btn-download-ticket"
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger (PDF)</span>
          </button>
        </div>
      </div>

      {/* High-Fidelity Boarding Pass / E-Ticket Card */}
      <div
        id={`eticket-card-${pnr}`}
        className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:shadow-none print:border-slate-800"
      >
        {/* Ticket Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center text-white font-black text-xl shadow-md">
              <Plane className="w-6 h-6 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight">Horizon<span className="text-sky-400">Vols</span></span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
                  Electronic Ticket / Billet Électronique
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Opéré par <strong className="text-white">{airline.name}</strong> • Vol {flight.flightNumber}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-slate-800/80 sm:bg-transparent p-3 sm:p-0 rounded-xl">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              Référence dossier (PNR)
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-sky-400 tracking-wider">
              {pnr}
            </div>
          </div>
        </div>

        {/* Ticket Route Section */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50/50 to-white border-b border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-6">
            {/* Origin */}
            <div className="md:col-span-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Départ
              </span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                {flight.from}
              </div>
              <div className="text-base font-extrabold text-slate-800 mt-1">{fromAirport.city}</div>
              <div className="text-xs text-slate-500">{fromAirport.name}</div>
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                <span>🕒 {flight.departureTime}</span>
                <span>•</span>
                <span>📅 {formatDateFr(flight.departureDate)}</span>
              </div>
            </div>

            {/* Flight Path icon */}
            <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-medium text-slate-400 mb-1">{flight.duration}</span>
              <div className="w-full flex items-center justify-center relative">
                <div className="w-20 h-0.5 bg-sky-200"></div>
                <Plane className="w-5 h-5 text-sky-600 absolute rotate-90" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 mt-2 bg-emerald-50 px-2 py-0.5 rounded">
                Direct
              </span>
            </div>

            {/* Destination */}
            <div className="md:col-span-3 text-left md:text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Arrivée
              </span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                {flight.to}
              </div>
              <div className="text-base font-extrabold text-slate-800 mt-1">{toAirport.city}</div>
              <div className="text-xs text-slate-500">{toAirport.name}</div>
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                <span>🕒 {flight.arrivalTime}</span>
                <span>•</span>
                <span>📅 {formatDateFr(flight.arrivalDate || flight.departureDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger & Flight Details Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 uppercase tracking-wider font-bold block mb-1">Passager</span>
            <span className="text-sm font-extrabold text-slate-900 block">
              {passengers[0]?.civility} {passengers[0]?.firstName} {passengers[0]?.lastName}
            </span>
            <span className="text-slate-500 text-[11px]">
              {passengers[0]?.documentType} {passengers[0]?.documentNumber}
            </span>
          </div>

          <div>
            <span className="text-slate-400 uppercase tracking-wider font-bold block mb-1">Siège</span>
            <span className="text-xl font-mono font-black text-sky-600 block">
              {passengers[0]?.seat || '12A'}
            </span>
            <span className="text-slate-500 text-[11px]">Cabine {flight.cabinClass || 'Économique'}</span>
          </div>

          <div>
            <span className="text-slate-400 uppercase tracking-wider font-bold block mb-1">Embarquement</span>
            <span className="text-sm font-extrabold text-slate-900 block">
              {flight.gate || 'K42'} • Terminal 2E
            </span>
            <span className="text-amber-600 font-semibold text-[11px]">Fermeture H-20min</span>
          </div>

          <div>
            <span className="text-slate-400 uppercase tracking-wider font-bold block mb-1">Bagages autorisés</span>
            <span className="text-sm font-extrabold text-slate-900 block">2x 23kg Soute</span>
            <span className="text-slate-500 text-[11px]">1x 12kg en Cabine</span>
          </div>
        </div>

        {/* Barcode & Simulated QR Code Footer */}
        <div className="p-6 sm:p-8 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Simulated QR Code box */}
            <div className="w-20 h-20 bg-white border-2 border-slate-300 rounded-xl p-1.5 flex flex-col items-center justify-center shadow-xs">
              <QrCode className="w-16 h-16 text-slate-900" />
            </div>

            <div>
              <div className="text-xs font-extrabold text-slate-900">Code d'accès sécurisé IATA</div>
              <div className="font-mono text-xs text-slate-500 mt-0.5 tracking-wider">
                M1{passengers[0]?.lastName?.toUpperCase()}/{passengers[0]?.firstName?.toUpperCase()} E{pnr}
              </div>
              <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Billet Confirmé & Payé via {payment.method}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Montant total acquitté
            </span>
            <span className="text-2xl font-black text-slate-900">
              {formatPrice(pricing.total, pricing.currency || 'EUR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
