import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, FileText, Globe, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function PassengerForm({
  passengers,
  contactInfo,
  onSaveAndContinue,
  onBack
}) {
  const [localPassengers, setLocalPassengers] = useState(passengers || []);
  const [localContact, setLocalContact] = useState(contactInfo || { email: '', phone: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (passengers && passengers.length > 0) {
      setLocalPassengers(passengers);
    }
  }, [passengers]);

  useEffect(() => {
    if (contactInfo && (contactInfo.email || contactInfo.phone)) {
      setLocalContact(contactInfo);
    }
  }, [contactInfo]);

  const handlePassengerChange = (index, field, value) => {
    const updated = [...localPassengers];
    updated[index] = { ...updated[index], [field]: value };
    setLocalPassengers(updated);

    // Clear error for that field
    if (errors[`${index}_${field}`]) {
      const nextErrors = { ...errors };
      delete nextErrors[`${index}_${field}`];
      setErrors(nextErrors);
    }
  };

  const handleContactChange = (field, value) => {
    setLocalContact(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const nextErrors = { ...errors };
      delete nextErrors[field];
      setErrors(nextErrors);
    }
  };

  const validate = () => {
    const newErrors = {};

    // Validation passagers
    localPassengers.forEach((p, idx) => {
      if (!p.firstName?.trim()) newErrors[`${idx}_firstName`] = 'Prénom obligatoire';
      if (!p.lastName?.trim()) newErrors[`${idx}_lastName`] = 'Nom obligatoire';
      if (!p.birthDate) newErrors[`${idx}_birthDate`] = 'Date de naissance obligatoire';
      if (!p.nationality?.trim()) newErrors[`${idx}_nationality`] = 'Nationalité requise';
      if (!p.documentNumber?.trim()) newErrors[`${idx}_documentNumber`] = 'Numéro de pièce requis';
      if (!p.documentExpiry) newErrors[`${idx}_documentExpiry`] = "Date d'expiration requise";
    });

    // Validation contact
    if (!localContact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localContact.email)) {
      newErrors['email'] = 'Adresse email valide requise';
    }
    if (!localContact.phone || localContact.phone.trim().length < 8) {
      newErrors['phone'] = 'Numéro de téléphone complet requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSaveAndContinue(localPassengers, localContact);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Liste des passagers */}
      <div className="space-y-6">
        {localPassengers.map((passenger, index) => (
          <div
            key={passenger.id || index}
            id={`passenger-card-${index}`}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Passager {index + 1} ({index === 0 ? 'Adulte principal' : 'Passager'})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Les informations doivent être strictement identiques à votre document d'identité.
                  </p>
                </div>
              </div>
            </div>

            {/* Champs passager */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Civilité */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Civilité *</label>
                <select
                  id={`pax-${index}-civility`}
                  value={passenger.civility || 'M.'}
                  onChange={(e) => handlePassengerChange(index, 'civility', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  <option value="M.">M. (Monsieur)</option>
                  <option value="Mme">Mme (Madame)</option>
                  <option value="Mlle">Mlle (Mademoiselle)</option>
                </select>
              </div>

              {/* Sexe */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Genre *</label>
                <select
                  id={`pax-${index}-gender`}
                  value={passenger.gender || 'M'}
                  onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom(s) *</label>
                <input
                  id={`pax-${index}-firstname`}
                  type="text"
                  placeholder="Ex: Amadou"
                  value={passenger.firstName || ''}
                  onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                    errors[`${index}_firstName`] ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {errors[`${index}_firstName`] && (
                  <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors[`${index}_firstName`]}
                  </span>
                )}
              </div>

              {/* Nom */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom de famille *</label>
                <input
                  id={`pax-${index}-lastname`}
                  type="text"
                  placeholder="Ex: Diallo"
                  value={passenger.lastName || ''}
                  onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                    errors[`${index}_lastName`] ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {errors[`${index}_lastName`] && (
                  <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors[`${index}_lastName`]}
                  </span>
                )}
              </div>

              {/* Date de naissance */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date de naissance *</label>
                <input
                  id={`pax-${index}-birthdate`}
                  type="date"
                  value={passenger.birthDate || ''}
                  onChange={(e) => handlePassengerChange(index, 'birthDate', e.target.value)}
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                    errors[`${index}_birthDate`] ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {errors[`${index}_birthDate`] && (
                  <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors[`${index}_birthDate`]}
                  </span>
                )}
              </div>

              {/* Nationalité */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nationalité *</label>
                <input
                  id={`pax-${index}-nationality`}
                  type="text"
                  placeholder="Ex: Sénégalaise, Française, Ivoirienne..."
                  value={passenger.nationality || ''}
                  onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                    errors[`${index}_nationality`] ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {errors[`${index}_nationality`] && (
                  <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors[`${index}_nationality`]}
                  </span>
                )}
              </div>

              {/* Type de document */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document de voyage *</label>
                <select
                  id={`pax-${index}-doctype`}
                  value={passenger.documentType || 'Passeport'}
                  onChange={(e) => handlePassengerChange(index, 'documentType', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  <option value="Passeport">Passeport biométrique</option>
                  <option value="CNI">Carte Nationale d'Identité</option>
                </select>
              </div>

              {/* Numéro de document */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro du document *</label>
                <input
                  id={`pax-${index}-docnumber`}
                  type="text"
                  placeholder="Ex: A12894562"
                  value={passenger.documentNumber || ''}
                  onChange={(e) => handlePassengerChange(index, 'documentNumber', e.target.value)}
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                    errors[`${index}_documentNumber`] ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {errors[`${index}_documentNumber`] && (
                  <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors[`${index}_documentNumber`]}
                  </span>
                )}
              </div>

              {/* Date d'expiration */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date d'expiration du document *</label>
                <input
                  id={`pax-${index}-docexpiry`}
                  type="date"
                  value={passenger.documentExpiry || ''}
                  onChange={(e) => handlePassengerChange(index, 'documentExpiry', e.target.value)}
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                    errors[`${index}_documentExpiry`] ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {errors[`${index}_documentExpiry`] && (
                  <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors[`${index}_documentExpiry`]}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coordonnées de contact */}
      <div id="contact-info-card" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7">
        <div className="pb-4 border-b border-slate-100 mb-5">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
            Coordonnées de Réception des Billets
          </h3>
          <p className="text-xs text-slate-400">
            Le billet électronique, le numéro PNR et les notifications de vol seront envoyés à ces coordonnées.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="contact-email"
                type="email"
                placeholder="votre.email@exemple.com"
                value={localContact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                  errors['email'] ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-sky-500'
                }`}
              />
            </div>
            {errors['email'] && (
              <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors['email']}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro de Téléphone Mobile *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="contact-phone"
                type="tel"
                placeholder="+221 77 654 32 10 ou +33 6 12 34 56 78"
                value={localContact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                  errors['phone'] ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-sky-500'
                }`}
              />
            </div>
            {errors['phone'] && (
              <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors['phone']}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          id="btn-back-from-passenger"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au vol</span>
        </button>

        <button
          type="submit"
          id="btn-submit-passengers"
          className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 flex items-center gap-2 transition-all"
        >
          <span>Continuer vers les Options</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
