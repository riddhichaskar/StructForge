import { ChevronRight, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface GuideStep {
  title: string;
  description: string;
  image?: any; 
}

interface GuideModalProps {
  title: string;
  steps: GuideStep[];
}

export const GuideModal = ({ title, steps }: GuideModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsOpen(false);
      setCurrentStep(0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    setCurrentStep(0);
  };

  const step = steps[currentStep];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
      >
        <HelpCircle size={16} />
        <span>Guide</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={handleSkip}
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {title} • Step {currentStep + 1}/{steps.length}
              </span>
              <button 
                onClick={handleSkip}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                SKIP
              </button>
            </div>

            <div className="p-6">
              {/* ----- FIX IS HERE ----- */}
              {/* We keep aspect-video for consistent container size, but change object-cover to object-contain */}
              <div className="aspect-video w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 p-2">
                {step.image ? (
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    // Changed object-cover to object-contain
                    className="w-full h-full object-contain rounded-lg shadow-sm" 
                  />
                ) : (
                  <span className="text-slate-400 text-sm">Add Screenshot Here</span>
                )}
              </div>
              {/* ----------------------- */}

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
              
              <div className="flex gap-1.5">
                {steps.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      idx === currentStep 
                        ? "bg-blue-600 dark:bg-blue-500" 
                        : "bg-slate-300 dark:bg-slate-700"
                    )} 
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all active:scale-95"
                >
                  {currentStep === steps.length - 1 ? "Finish" : "Next"}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};