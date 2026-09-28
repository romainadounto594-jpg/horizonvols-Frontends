import React from 'react';
import { formatPrice } from '../../utils/formatters.js';
import { useBooking } from '../../context/BookingContext.jsx';
import {
  Luggage,
  Utensils,
  Shield,
  Zap,
  Check,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export default function OptionsSelector({
  selectedOptions,
  passengerCount = 1,
  onOptionsChange,
  onContinue,
  onBack
}) {
  const { currency } = useBooking();

  const handleBaggageCount = (delta) => {
    const nextVal = Math.max(0, Math.min(3, (selectedOptions.extraBaggage || 0) + delta));
    onOptionsChange({ ...selectedOptions, extraBaggage: nextVal });
  };

  const handleMealChange = (meal) => {
    onOptionsChange({ ...selectedOptions, meal });
  };

  const handleInsuranceChange = (insurance) => {
    onOptionsChange({ ...selectedOptions, insurance });
  };

  const handlePriorityToggle = () => {
    onOptionsChange({
      ...selectedOptions,
      priorityBoarding: !selectedOptions.priorityBoarding
    });
  };

  return (
    <div className="space-y-6">
      {/* Bagages Supplémentaires */}
      <div id="option-baggage-card" className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Bagages en soute supplémentaires
                </h4>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  {formatPrice(60, currency)} / pièce (23kg)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
                Ajoutez une ou plusieurs valises de 23kg en soute à tarif réduit anticipé (jusqu'à 40% moins cher qu'à l'aéroport).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl self-start sm:self-center">
            <button
              type="button"
              id="btn-extra-baggage-minus"
              onClick={() => handleBaggageCount(-1)}
              disabled={(selectedOptions.extraBaggage || 0) <= 0}
              className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-black text-slate-900">
              {selectedOptions.extraBaggage || 0}
            </span>
            <button
              type="button"
              id="btn-extra-baggage-plus"
              onClick={() => handleBaggageCount(1)}
              disabled={(selectedOptions.extraBaggage || 0) >= 3}
              className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Repas à bord */}
      <div id="option-meal-card" className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
              Préférence de Repas à bord
            </h4>
            <p className="text-xs text-slate-500">
              Inclus gratuitement. Choisissez votre formule culinaire adaptée à vos régimes ou croyances.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {[
            { id: 'Standard gourmet', label: 'Standard Chef Gourmet', desc: 'Menu équilibré de saison' },
            { id: 'Halal Gourmet', label: 'Menu Halal certifié', desc: 'Viandes contrôlées et saveurs orientales' },
            { id: 'Végétarien', label: 'Menu Végétarien VGML', desc: 'Légumes frais, céréales & fruits' },
            { id: 'Casher', label: 'Menu Casher KSML', desc: 'Préparé sous supervision rabbinique' },
            { id: 'Sans gluten', label: 'Menu Sans Gluten GFML', desc: 'Garanti sans trace de blé ou gluten' },
            { id: 'Menu Enfant', label: 'Menu Spécial Jeune', desc: 'Saveurs douces et surprises' }
          ].map((meal) => {
            const isSelected = selectedOptions.meal === meal.id;
            return (
              <button
                key={meal.id}
                type="button"
                id={`option-meal-${meal.id.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleMealChange(meal.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{meal.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{meal.desc}</p>
                <span className="text-[10px] font-bold text-emerald-600 mt-2 block">Inclus (0 €)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Assurance Voyage */}
      <div id="option-insurance-card" className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
              Assurance & Protection Voyage
            </h4>
            <p className="text-xs text-slate-500">
              Protégez votre séjour contre les imprévus médicaux, retards et annulations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Pack Sérénité */}
          <div
            onClick={() => handleInsuranceChange('Pack Sérénité Horizon')}
            className={`p-4 rounded-xl border cursor-pointer relative transition-all ${
              selectedOptions.insurance === 'Pack Sérénité Horizon'
                ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-black text-slate-900">Pack Sérénité Intégral</span>
              <span className="text-xs font-extrabold text-emerald-600">
                {formatPrice(39, currency)} / pers.
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
              Annulation toute cause justifiée + Frais médicaux & Rapatriement jusqu'à 150 000 € + Bagages perdus.
            </p>
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Recommandé
            </div>
          </div>

          {/* Annulation Simple */}
          <div
            onClick={() => handleInsuranceChange('Annulation simple')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedOptions.insurance === 'Annulation simple'
                ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-black text-slate-900">Garantie Annulation Seule</span>
              <span className="text-xs font-extrabold text-emerald-600">
                {formatPrice(22, currency)} / pers.
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
              Remboursement de votre billet en cas de motif médical, professionnel ou familial impérieux.
            </p>
            <div className="text-[10px] text-slate-400 font-medium">Protection basique</div>
          </div>

          {/* Sans assurance */}
          <div
            onClick={() => handleInsuranceChange('none')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedOptions.insurance === 'none'
                ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-900">Sans assurance</span>
              <span className="text-xs font-bold text-slate-400">0 €</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
              Je voyage sans couverture HorizonVols et assume les frais en cas d'imprévu.
            </p>
            <div className="text-[10px] text-slate-400 font-medium">Aucun supplément</div>
          </div>
        </div>
      </div>

      {/* Priorité & Confort VIP */}
      <div id="option-priority-card" className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Embarquement Prioritaire & Coupe-File
                </h4>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {formatPrice(15, currency)} / pers.
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
                Passez les contrôles aéroportuaires en priorité et montez à bord sans file d'attente avec garantie d'espace bagage au-dessus de votre siège.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-toggle-priority"
            onClick={handlePriorityToggle}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedOptions.priorityBoarding
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {selectedOptions.priorityBoarding ? 'Ajouté ✓' : 'Ajouter (+15 €)'}
          </button>
        </div>
      </div>

      {/* Action navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          id="btn-back-from-options"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux passagers</span>
        </button>

        <button
          type="button"
          id="btn-continue-to-seats"
          onClick={onContinue}
          className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 flex items-center gap-2 transition-all"
        >
          <span>Continuer vers le Choix des Sièges</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
