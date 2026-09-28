import React from 'react';
import { Check, Plane, Users, Sliders, Armchair, CreditCard, Award } from 'lucide-react';

export default function BookingStepper({ currentStep = 1, onStepClick }) {
  const steps = [
    { number: 1, title: 'Vol', icon: Plane },
    { number: 2, title: 'Passagers', icon: Users },
    { number: 3, title: 'Options', icon: Sliders },
    { number: 4, title: 'Sièges', icon: Armchair },
    { number: 5, title: 'Paiement', icon: CreditCard },
    { number: 6, title: 'Confirmation', icon: Award }
  ];

  return (
    <div id="booking-stepper-container" className="w-full bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 shadow-xs sticky top-16 sm:top-20 z-30">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Progress bar line */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0">
            <div
              className="h-full bg-sky-600 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {/* Step points */}
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                id={`step-indicator-${step.number}`}
                onClick={() => {
                  // On permet de revenir sur les étapes passées
                  if (isCompleted && onStepClick) onStepClick(step.number);
                }}
                className={`flex flex-col items-center relative z-10 ${
                  isCompleted ? 'cursor-pointer group' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                    isCompleted
                      ? 'bg-sky-600 text-white group-hover:bg-sky-700'
                      : isCurrent
                      ? 'bg-sky-600 text-white ring-4 ring-sky-100'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  )}
                </div>
                <span
                  className={`mt-1.5 text-[10px] sm:text-xs font-semibold whitespace-nowrap hidden sm:block ${
                    isCurrent
                      ? 'text-sky-600 font-bold'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
