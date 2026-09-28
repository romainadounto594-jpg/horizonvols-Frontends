import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useBooking } from '../../context/BookingContext.jsx';
import {
  X,
  UserCheck,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  Plane,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  bookingFlight = null,
  initialMode = 'register'
}) {
  const { login, register } = useAuth();
  const { addToast } = useBooking();

  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Champs Inscription
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Sénégal');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (isRegister) {
        if (!email || !password || !firstName || !lastName) {
          setErrorMessage('Veuillez renseigner vos nom, prénom, email et mot de passe.');
          setIsSubmitting(false);
          return;
        }

        if (password.length < 6) {
          setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
          setIsSubmitting(false);
          return;
        }

        const res = await register({
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
          phone,
          city,
          country
        });

        if (res.success) {
          addToast(
            'success',
            `Félicitations ${res.user.firstName} ! Votre compte a été enregistré en base de données.`
          );
          if (onSuccess) onSuccess(res.user);
          onClose();
        } else {
          setErrorMessage(res.error || "Une erreur est survenue lors de l'enregistrement.");
        }
      } else {
        // Connexion
        if (!email || !password) {
          setErrorMessage('Veuillez renseigner votre email et mot de passe.');
          setIsSubmitting(false);
          return;
        }

        const res = await login(email, password);
        if (res.success) {
          addToast('success', `Bon retour parmi nous, ${res.user.firstName} !`);
          if (onSuccess) onSuccess(res.user);
          onClose();
        } else {
          setErrorMessage(res.error || 'Email ou mot de passe incorrect.');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Erreur technique. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      if (role === 'admin') {
        const res = await login('admin@horizonvols.com', 'password', 'admin');
        if (res.success) {
          addToast('success', 'Connecté en tant qu’Administrateur');
          if (onSuccess) onSuccess(res.user);
          onClose();
        } else {
          setErrorMessage(res.error);
        }
      } else {
        const res = await login('amadou.diallo@horizonvols.com', 'password', 'client');
        if (res.success) {
          addToast('success', 'Connecté en tant que Amadou Diallo (Horizon Gold)');
          if (onSuccess) onSuccess(res.user);
          onClose();
        } else {
          setErrorMessage(res.error);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="auth-modal-card"
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Bannière si vol sélectionné en cours */}
        {bookingFlight && (
          <div className="mb-5 p-3.5 bg-sky-50 border border-sky-200 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Plane className="w-4 h-4 -rotate-45" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-sky-950 flex items-center gap-1.5">
                <span>{bookingFlight.from}</span>
                <span>➔</span>
                <span>{bookingFlight.to}</span>
                <span className="text-[10px] text-sky-700 font-normal">
                  ({bookingFlight.flightNumber || bookingFlight.airlineName})
                </span>
              </div>
              <p className="text-sky-800 text-[11px] mt-0.5 font-medium">
                Veuillez vous inscrire ou vous connecter pour réserver ce vol.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 text-sky-600 mb-2 font-bold text-xl">
            ✈
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {isRegister ? 'Créer un compte HorizonVols' : 'Connexion Voyageur'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRegister
              ? 'Enregistrez-vous en base de données pour gérer vos billets et cumuler des miles.'
              : 'Accédez à votre espace voyageur, vos billets électroniques et vos réductions.'}
          </p>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Boutons de connexion rapide démo */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Accès rapide Seeder BDD
            </span>
            <span className="text-[10px] text-slate-400">Comptes pré-configurés</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-quick-client"
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickLogin('client')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs font-semibold text-slate-700 hover:text-sky-700 rounded-lg shadow-xs transition-all disabled:opacity-50"
            >
              <UserCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Client (Diallo)</span>
            </button>
            <button
              id="btn-quick-admin"
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickLogin('admin')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs font-semibold text-slate-700 hover:text-indigo-700 rounded-lg shadow-xs transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin Démo</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prénom <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="auth-input-firstname"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex: Romain"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom de famille <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="auth-input-lastname"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Dubois"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="auth-input-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ville / Pays
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="auth-input-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Paris, France"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Adresse email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="auth-input-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Mot de passe <span className="text-rose-500">*</span>
              </label>
              {!isRegister && (
                <span className="text-xs text-sky-600 hover:underline cursor-pointer">
                  Mot de passe oublié ?
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="auth-input-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enregistrement en cours...</span>
              </>
            ) : (
              <>
                <span>{isRegister ? 'Créer mon compte et continuer' : 'Se connecter et continuer'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          {isRegister ? (
            <p>
              Déjà un compte inscrit ?{' '}
              <button
                id="btn-switch-to-login"
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMessage('');
                }}
                className="font-bold text-sky-600 hover:underline"
              >
                Connectez-vous
              </button>
            </p>
          ) : (
            <p>
              Pas encore de compte ?{' '}
              <button
                id="btn-switch-to-register"
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMessage('');
                }}
                className="font-bold text-sky-600 hover:underline"
              >
                Inscrivez-vous gratuitement
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
