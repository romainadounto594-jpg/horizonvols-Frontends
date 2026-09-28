import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { apiService } from '../../services/api.js';
import { formatPrice } from '../../utils/formatters.js';
import { Lock, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

// Style personnalisé pour le composant CardElement de Stripe
const cardElementOptions = {
  style: {
    base: {
      fontSize: '15px',
      color: '#1e293b',
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': {
        color: '#94a3b8',
      },
      iconColor: '#0284c7',
    },
    invalid: {
      color: '#e11d48',
      iconColor: '#e11d48',
    },
  },
  hidePostalCode: true,
};

function CheckoutForm({ amount, currency, passengerName, passengerEmail, onPaymentSuccess, isProcessing, setIsProcessing }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [cardHolder, setCardHolder] = useState(passengerName || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Demande d'un PaymentIntent au backend Laravel
      const intentRes = await apiService.createPaymentIntent({
        amount,
        currency,
        customer_email: passengerEmail,
      });

      if (!intentRes.success || !intentRes.clientSecret) {
        throw new Error(intentRes.error || "Impossible d'initialiser le paiement Stripe auprès du serveur.");
      }

      // 2. Confirmation sécurisée de la carte via le SDK Stripe (gère automatiquement le 3D-Secure)
      const { error, paymentIntent } = await stripe.confirmCardPayment(intentRes.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardHolder || passengerName || 'Passager HorizonVols',
            email: passengerEmail || undefined,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Le paiement par carte bancaire a échoué.');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // 3. Paiement réussi avec succès
        onPaymentSuccess({
          methodName: 'Carte Bancaire (Stripe 3DS)',
          last4: '4242',
          transactionId: paymentIntent.id,
        });
      } else {
        setErrorMessage(`Statut du paiement : ${paymentIntent?.status}`);
        setIsProcessing(false);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Une erreur est survenue lors de la communication bancaire.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Titulaire de la carte */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
          Nom sur la carte
        </label>
        <input
          type="text"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          placeholder="Ex: AMADOU DIALLO"
          required
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
        />
      </div>

      {/* Champ Stripe CardElement sécurisé */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
          Numéro, Expiration & Cryptogramme (CVC)
        </label>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 transition-all">
          <CardElement
            options={cardElementOptions}
            onChange={(e) => {
              if (e.error) setErrorMessage(e.error.message);
              else setErrorMessage('');
            }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" /> Chiffré de bout en bout PCI-DSS
          </span>
          <span className="font-medium text-slate-500">Stripe Secure Elements</span>
        </div>
      </div>

      {/* Bouton de confirmation Stripe */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-extrabold text-sm shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Traitement sécurisé Stripe...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>Régler {formatPrice(amount, currency)} par Stripe</span>
          </>
        )}
      </button>

      {/* Indication des numéros de test */}
      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Carte de test Stripe : <strong className="text-slate-700 font-mono">4242 4242 4242 4242</strong></span>
        <span>Exp : <strong className="text-slate-700 font-mono">12/34</strong> • CVC : <strong className="text-slate-700 font-mono">123</strong></span>
      </div>
    </form>
  );
}

export default function StripeCardForm(props) {
  if (!stripePublicKey || !stripePromise) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-2">
        <p className="font-bold flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          Clé publique Stripe en attente
        </p>
        <p>
          Pour activer le paiement par carte bancaire Stripe, vérifiez que votre variable{' '}
          <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">VITE_STRIPE_PUBLIC_KEY=pk_test_...</code>{' '}
          est bien présente dans votre fichier <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">.env</code> de React.
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}