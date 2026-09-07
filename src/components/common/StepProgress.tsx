import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../hooks/useForm';

const steps = [
  { number: 1, label: 'Personal Data', href: '/form/step/1' },
  { number: 2, label: 'Introduction', href: '/form/step/2' },
  { number: 3, label: 'Education', href: '/form/step/3' },
  { number: 4, label: 'Experience', href: '/form/step/4' },
  { number: 5, label: 'Medical & Science', href: '/form/step/5' },
  { number: 6, label: 'Projects', href: '/form/step/6' },
  { number: 7, label: 'Skills', href: '/form/step/7' },
  { number: 8, label: 'Credentials', href: '/form/step/8' },
  { number: 9, label: 'References', href: '/form/step/9' },
];

interface StepProgressProps {
  currentStep: number;
  className?: string;
  showLabels?: boolean;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  className = '',
  showLabels = true,
}) => {
  const { getStepCompletion, completedSteps } = useForm();
  const navigate = useNavigate();

  return (
    <nav className={`w-full ${className}`} aria-label="Form progress">
      <ol className="flex items-center" role="list">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(
            step.number as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
          );
          const isCurrent = step.number === currentStep;
          const isFuture = step.number > currentStep;
          const completion = getStepCompletion(step.number as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9);

          return (
            <li key={step.number} className="flex flex-1 items-center">
              <div className="flex items-center">
                <div className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => navigate(step.href)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer hover:scale-110 ${
                      isCompleted
                        ? 'border-2 border-green-500 bg-green-500 text-white hover:bg-green-600'
                        : isCurrent
                          ? 'border-2 border-indigo-500 bg-indigo-500 text-white ring-4 ring-indigo-500/20'
                          : 'border-2 border-slate-300 bg-white text-slate-400 hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500 dark:hover:border-indigo-400 dark:hover:text-indigo-400'
                    }`}
                    title={`Go to ${step.label}`}
                    aria-label={`Go to step ${step.number}: ${step.label}`}
                  >
                    {isCompleted ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </button>

                  {showLabels && (
                    <button
                      type="button"
                      onClick={() => navigate(step.href)}
                      className={`ml-2 hidden text-sm font-medium transition-colors sm:block cursor-pointer hover:underline ${
                        isCompleted || isCurrent
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                      aria-label={`Go to step ${step.number}: ${step.label}`}
                    >
                      {step.label}
                    </button>
                  )}

                  <div
                    className="absolute top-1/2 left-1/2 -ml-5 h-0.5 w-full -translate-y-1/2 transform-gpu"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        isCompleted || isCurrent
                          ? 'bg-indigo-500'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                      style={{
                        width: `${isCompleted ? 100 : isCurrent ? (completion / 100) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 hidden sm:block">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-label="Form completion progress"
          />
        </div>
        <p className="mt-1 text-right text-xs text-slate-500 dark:text-slate-400">
          Step {currentStep} of {steps.length} • {Math.round((currentStep / steps.length) * 100)}%
          complete
        </p>
      </div>
    </nav>
  );
};
