// Utilitaires de formatage de prix, devises, dates et statuts

export const CURRENCIES = {
  EUR: { symbol: '€', label: 'EUR (€)', rate: 1 },
  XOF: { symbol: 'FCFA', label: 'XOF (FCFA)', rate: 655.957 },
  USD: { symbol: '$', label: 'USD ($)', rate: 1.08 },
  GBP: { symbol: '£', label: 'GBP (£)', rate: 0.85 }
};

export function formatPrice(amountInEur, currencyCode = 'EUR') {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.EUR;
  const converted = amountInEur * currency.rate;

  if (currencyCode === 'XOF') {
    return `${Math.round(converted).toLocaleString('fr-FR')} ${currency.symbol}`;
  }
  return `${Math.round(converted).toLocaleString('fr-FR')} ${currency.symbol}`;
}

export function formatDateFr(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(d);
}

export function formatTime(timeStr) {
  return timeStr || '--:--';
}

export function getStatusBadge(status) {
  switch (status) {
    case 'CONFIRMED':
      return { label: 'Confirmée', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'PENDING':
      return { label: 'En attente', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'CANCELLED':
      return { label: 'Annulée', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'COMPLETED':
      return { label: 'Terminée', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
    default:
      return { label: status, bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
  }
}
