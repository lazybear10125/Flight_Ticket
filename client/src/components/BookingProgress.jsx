import React from 'react';
import { Check, Plane, Users, CreditCard, Ticket } from 'lucide-react';

const STEPS = [
  { id: 'FLIGHTS', label: '1. Chọn chuyến bay', icon: Plane },
  { id: 'PASSENGERS', label: '2. Thông tin & Ghế', icon: Users },
  { id: 'PAYMENT', label: '3. Thanh toán', icon: CreditCard },
  { id: 'ETICKET', label: '4. Nhận vé điện tử', icon: Ticket }
];

export default function BookingProgress({ currentStep }) {
  // Map internal views to step indexes
  const getStepIndex = (step) => {
    if (step === 'FLIGHTS_OUTBOUND' || step === 'FLIGHTS_RETURN') return 0;
    if (step === 'PASSENGERS') return 1;
    if (step === 'PAYMENT') return 2;
    if (step === 'ETICKET') return 3;
    return -1;
  };

  const activeIndex = getStepIndex(currentStep);
  if (activeIndex === -1) return null;

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 py-4 shadow-xs sticky top-20 z-30 transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between relative">
          
          {/* Progress bar background line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps nodes */}
          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const IconComponent = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center relative z-10 group">
                {/* Node Circle */}
                <div 
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-4 ring-emerald-100'
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-4 ring-blue-100 scale-110'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 animate-in zoom-in-50" />
                  ) : (
                    <IconComponent className={`w-4 h-4 ${isCurrent ? 'animate-pulse' : ''}`} />
                  )}
                </div>

                {/* Step Label */}
                <span 
                  className={`text-[11px] sm:text-xs font-bold mt-1.5 transition-colors whitespace-nowrap ${
                    isCurrent 
                      ? 'text-blue-700 font-black' 
                      : isCompleted 
                      ? 'text-emerald-700' 
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
