import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../hooks/useForm';
import type { FormStep } from '../../types/form';

const steps: { number: FormStep; label: string; href: string }[] = [
  { number: 1, label: 'Personal Data', href: '/form/step/1' },
  { number: 2, label: 'Introduction', href: '/form/step/2' },
  { number: 3, label: 'Education', href: '/form/step/3' },
  { number: 4, label: 'Experience', href: '/form/step/4' },
  { number: 5, label: 'Medical & Science', href: '/form/step/5' },
  { number: 6, label: 'Projects', href: '/form/step/6' },
  { number: 7, label: 'Skills', href: '/form/step/7' },
  { number: 8, label: 'Credentials', href: '/form/step/8' },
  { number: 9, label: 'References', href: '/form/step/9' },
  { number: 10, label: 'Review', href: '/form/step/10' },
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
  const total = steps.length;

  return (
    <nav className={`w-full ${className}`} aria-label="Form progress">
      <ol className="flex w-full items-start" role="list">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = step.number === currentStep;
          const completion = getStepCompletion(step.number);
          const hasPrevious = index > 0;

          return (
            <li key={step.number} className="relative flex min-w-0 flex-1 flex-col items-center">
              {hasPrevious && (
                <div className="absolute top-5 left-0 z-0 h-0.5 w-1/2" aria-hidden="true">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      isCompleted || isCurrent ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                    style={{
                      width: `${isCompleted ? 100 : isCurrent ? completion : 0}%`,
                    }}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => navigate(step.href)}
                className={`relative z-10 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 hover:scale-110 ${
                  isCompleted
                    ? 'border-2 border-green-500 bg-green-500 text-white hover:bg-green-600'
                    : isCurrent
                      ? 'border-2 border-indigo-500 bg-indigo-500 text-white ring-4 ring-indigo-500/20'
                      : 'border-2 border-slate-300 bg-white text-slate-400 hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500 dark:hover:border-indigo-400 dark:hover:text-indigo-400'
                }`}
                title={`Go to ${step.label}`}
                aria-label={`Go to step ${step.number}: ${step.label}`}
                aria-current={isCurrent ? 'step' : undefined}
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
                <span
                  className={`mt-2 hidden w-full min-w-0 truncate px-1 text-center text-[11px] leading-tight font-medium sm:block ${
                    isCompleted || isCurrent
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                  title={step.label}
                >
                  {step.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-4 hidden sm:block">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / total) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-label="Form completion progress"
          />
        </div>
        <p className="mt-1 text-right text-xs text-slate-500 dark:text-slate-400">
          Step {currentStep} of {total} • {Math.round((currentStep / total) * 100)}% complete
        </p>
      </div>
    </nav>
  );
};
