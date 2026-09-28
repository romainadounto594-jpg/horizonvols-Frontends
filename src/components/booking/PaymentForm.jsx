import React, { useState } from 'react';
import { formatPrice } from '../../utils/formatters.js';
import { useBooking } from '../../context/BookingContext.jsx';
import StripeCardForm from './StripeCardForm.jsx';
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  Lock,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

export default function PaymentForm({ onPaymentSuccess, onBack }) {
  const { activeBooking, currency } = useBooking();
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, wave, orangemoney, mtn
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // Mobile money details
  const [mobilePhone, setMobilePhone] = useState(activeBooking.contactInfo?.phone || '+221 77 654 32 10');

  const passenger0 = activeBooking.passengers[0];
  const passengerName = passenger0 ? `${passenger0.firstName} ${passenger0.lastName}` : 'Passager HorizonVols';
  const passengerEmail = activeBooking.contactInfo?.email || '';

  const handleMobileMoneyPay = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep('Initialisation du protocole sécurisé...');

    setTimeout(() => {
      setProcessingStep('Envoi de la notification de paiement Mobile Money au client...');
    }, 1000);

    setTimeout(() => {
      setProcessingStep('Validation du prélèvement réseau opérateur...');
    }, 2000);

    setTimeout(() => {
      setIsProcessing(false);
      let methodName = 'Mobile Money (Wave Pay)';
      if (paymentMethod === 'orangemoney') methodName = 'Orange Money CI/SN';
      if (paymentMethod === 'mtn') methodName = 'MTN Mobile Money';

      onPaymentSuccess({
        methodName,
        last4: mobilePhone.slice(-4),
        transactionId: `MM-${Date.now()}`
      });
    }, 3200);
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="bg-sky-50 border border-sky-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-sky-800">
        <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Paiement Chiffré & Sécurisé :</strong> Les cartes bancaires sont traitées directement par le protocole bancaire Stripe avec authentification 3D-Secure.
        </div>
      </div>

      {/* Main Payment Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-2">
          Choisissez votre mode de paiement
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Toutes les transactions sont chiffrées selon les normes bancaires internationales.
        </p>

        {/* Payment Method Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {/* Carte Bancaire (Stripe) */}
          <button
            type="button"
            id="tab-pay-card"
            onClick={() => setPaymentMethod('card')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col items-center sm:items-start text-center sm:text-left gap-2 cursor-pointer ${
              paymentMethod === 'card'
                ? 'bg-sky-50/70 border-sky-500 ring-2 ring-sky-500/20 text-sky-950 font-bold'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Carte Bancaire</div>
              <div className="text-[10px] text-slate-400">Stripe 3D-Secure</div>
            </div>
          </button>

          {/* Wave */}
          <button
            type="button"
            id="tab-pay-wave"
            onClick={() => setPaymentMethod('wave')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col items-center sm:items-start text-center sm:text-left gap-2 cursor-pointer ${
              paymentMethod === 'wave'
                ? 'bg-sky-50/70 border-sky-500 ring-2 ring-sky-500/20 text-sky-950 font-bold'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-800 font-black text-xs">
              🌊
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Wave Money</div>
              <div className="text-[10px] text-slate-400">Paiement 0% frais</div>
            </div>
          </button>

          {/* Orange Money */}
          <button
            type="button"
            id="tab-pay-orange"
            onClick={() => setPaymentMethod('orangemoney')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col items-center sm:items-start text-center sm:text-left gap-2 cursor-pointer ${
              paymentMethod === 'orangemoney'
                ? 'bg-orange-50/70 border-orange-500 ring-2 ring-orange-500/20 text-orange-950 font-bold'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs">
              OM
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Orange Money</div>
              <div className="text-[10px] text-slate-400">Validation mobile</div>
            </div>
          </button>

          {/* MTN MoMo */}
          <button
            type="button"
            id="tab-pay-mtn"
            onClick={() => setPaymentMethod('mtn')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col items-center sm:items-start text-center sm:text-left gap-2 cursor-pointer ${
              paymentMethod === 'mtn'
                ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 text-amber-950 font-bold'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-black text-xs">
              MTN
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">MTN MoMo</div>
              <div className="text-[10px] text-slate-400">Validation mobile</div>
            </div>
          </button>
        </div>

        {/* Dynamic Payment Body */}
        {paymentMethod === 'card' ? (
          <div className="space-y-4">
            <StripeCardForm
              amount={activeBooking.pricing.total}
              currency={currency}
              passengerName={passengerName}
              passengerEmail={passengerEmail}
              onPaymentSuccess={onPaymentSuccess}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                id="btn-back-from-card"
                disabled={isProcessing}
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour aux sièges</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleMobileMoneyPay}>
            <div className="space-y-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numéro de téléphone du compte Mobile Money
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="input-mobile-money-phone"
                    type="tel"
                    required
                    value={mobilePhone}
                    onChange={(e) => setMobilePhone(e.target.value)}
                    placeholder="+221 77 000 00 00 ou +225 07 00 00 00"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Un push de confirmation sera envoyé sur votre téléphone pour valider le débit de{' '}
                  <strong className="text-slate-700 font-bold">{formatPrice(activeBooking.pricing.total, currency)}</strong>.
                </p>
              </div>
            </div>

            {/* Reassurance points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 pb-6 border-b border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cryptage SSL 256 bits</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Conforme PCI-DSS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Billet émis instantanément</span>
              </div>
            </div>

            {/* Processing State Overlay */}
            {isProcessing && (
              <div className="bg-slate-900 text-white p-5 rounded-2xl my-4 flex items-center gap-4 animate-in fade-in">
                <Loader2 className="w-6 h-6 text-sky-400 animate-spin shrink-0" />
                <div>
                  <p className="text-sm font-bold">Traitement de votre commande en cours...</p>
                  <p className="text-xs text-sky-300 mt-0.5">{processingStep}</p>
                </div>
              </div>
            )}

            {/* Submit Actions */}
            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                id="btn-back-from-payment"
                disabled={isProcessing}
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour aux sièges</span>
              </button>

              <button
                type="submit"
                id="btn-submit-payment"
                disabled={isProcessing}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Validation en cours...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Régler {formatPrice(activeBooking.pricing.total, currency)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}