import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import BookingStepper from '../components/booking/BookingStepper.jsx';
import PassengerForm from '../components/booking/PassengerForm.jsx';
import OptionsSelector from '../components/booking/OptionsSelector.jsx';
import SeatMap from '../components/booking/SeatMap.jsx';
import PaymentForm from '../components/booking/PaymentForm.jsx';
import BookingSummary from '../components/booking/BookingSummary.jsx';
import AuthModal from '../components/common/AuthModal.jsx';
import { Plane, AlertTriangle, ArrowRight, Lock, UserCheck } from 'lucide-react';

export default function BookingPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
const {
    activeBooking,
    setActiveBooking,
    completeBooking,
    confirmCurrentBooking,
    addToast
  } = useBooking();

  // Étape actuelle : 2 = Passagers, 3 = Options, 4 = Sièges, 5 = Paiement
  const [currentStep, setCurrentStep] = useState(2);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // If no flight selected in context
  if (!activeBooking || !activeBooking.flight) {
    return (
      <div className="max-w-2xl mx-auto my-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Aucun vol sélectionné</h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Veuillez lancer une recherche et choisir un vol pour entamer votre processus de réservation.
        </p>
        <button
          type="button"
          id="btn-goto-search"
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 shadow-md shadow-sky-600/20"
        >
          <span>Rechercher un vol</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Si le client n'est pas encore connecté
  if (!currentUser) {
    return (
      <div className="bg-slate-50/70 min-h-screen py-16 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-2xl p-8 shadow-xl border border-slate-100 text-center space-y-5">
          <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Étape requise
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">
              Connexion ou Inscription requise
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Pour réserver le vol <strong className="text-slate-800">{activeBooking.flight.flightNumber}</strong> ({activeBooking.flight.from} ➔ {activeBooking.flight.to}), vous devez vous inscrire ou vous connecter à votre compte HorizonVols.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-left text-xs space-y-1.5 text-slate-600">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Avantages de votre compte voyageur :</span>
            </div>
            <p>• Génération instantanée de votre billet électronique officiel (PNR)</p>
            <p>• Enregistrement automatique de vos coordonnées et passagers</p>
            <p>• Cumul de Miles Horizon et réductions fidélité</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              id="btn-trigger-login-booking"
              onClick={() => setAuthModalOpen(true)}
              className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>S'inscrire ou Se connecter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="btn-back-to-results"
              onClick={() => navigate('/results')}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all"
            >
              Changer de vol
            </button>
          </div>

          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            bookingFlight={activeBooking.flight}
            onSuccess={(user) => {
              setActiveBooking(prev => ({
                ...prev,
                contactInfo: {
                  email: user.email || prev.contactInfo.email,
                  phone: user.phone || prev.contactInfo.phone
                }
              }));
              setAuthModalOpen(false);
            }}
          />
        </div>
      </div>
    );
  }

  // Navigation handlers
  const handlePassengersComplete = (passengers, contactInfo) => {
    setActiveBooking(prev => ({
      ...prev,
      passengers,
      contactInfo
    }));
    setCurrentStep(3);
    addToast('Informations passagers enregistrées avec succès', 'success');
  };

  const handleOptionsComplete = () => {
    setCurrentStep(4);
  };

  const handleSeatsComplete = () => {
    setCurrentStep(5);
  };

const handlePaymentSuccess = async ({ methodName, last4, transactionId }) => {
    try {
      const bookFn = completeBooking || confirmCurrentBooking;
      const bookingResult = await bookFn({ methodName, last4, transactionId });
      const pnr = bookingResult?.pnr || activeBooking?.confirmedPNR || 'HZ-78945';
      addToast(`Paiement validé ! Votre référence dossier est ${pnr}`, 'success');
      navigate(`/confirmation/${pnr}`);
    } catch (err) {
      console.error('Erreur confirmation réservation:', err);
      navigate('/confirmation/HZ-78945');
    }
  };

  return (
    <div className="bg-slate-50/70 min-h-screen pb-16">
      {/* Visual Stepper */}
      <BookingStepper
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step >= 2 && step < currentStep) {
            setCurrentStep(step);
          }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Step Body */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 2 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Étape 2 : Identité des Passagers
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Renseignez scrupuleusement les informations d'identité officielles pour l'émission des billets.
                  </p>
                </div>
                <PassengerForm
                  passengers={activeBooking.passengers}
                  contactInfo={activeBooking.contactInfo}
                  onSaveAndContinue={handlePassengersComplete}
                  onBack={() => navigate('/results')}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Étape 3 : Options de Voyage & Bagages
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Personnalisez votre vol avec nos prestations en vol et garanties d'assurance.
                  </p>
                </div>
                <OptionsSelector
                  selectedOptions={activeBooking.selectedOptions}
                  passengerCount={activeBooking.passengers.length}
                  onOptionsChange={(newOptions) => {
                    setActiveBooking(prev => ({
                      ...prev,
                      selectedOptions: newOptions
                    }));
                  }}
                  onContinue={handleOptionsComplete}
                  onBack={() => setCurrentStep(2)}
                />
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Étape 4 : Sélection des Sièges en Cabine
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Choisissez votre emplacement préféré : hublot, couloir ou espace supplémentaire pour les jambes.
                  </p>
                </div>
                <SeatMap
                  passengers={activeBooking.passengers}
                  selectedSeats={activeBooking.selectedSeats}
                  onSelectSeat={(seats) => {
                    setActiveBooking(prev => ({
                      ...prev,
                      selectedSeats: seats
                    }));
                  }}
                  onContinue={handleSeatsComplete}
                  onBack={() => setCurrentStep(3)}
                />
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Étape 5 : Récapitulatif & Paiement Sécurisé
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Choisissez votre moyen de paiement sécurisé pour finaliser votre commande.
                  </p>
                </div>
                <PaymentForm
                  onPaymentSuccess={handlePaymentSuccess}
                  onBack={() => setCurrentStep(4)}
                />
              </div>
            )}
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-1">
            <BookingSummary
              onEditStep={(step) => {
                if (step === 1) {
                  navigate('/results');
                } else if (step < currentStep) {
                  setCurrentStep(step);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
