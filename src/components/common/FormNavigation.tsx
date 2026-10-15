import React from 'react';

import { useForm } from '../../hooks/useForm';

import { Button } from './Button';

interface FormNavigationProps {
  onNext?: () => void;
  onPrev?: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
  nextLabel?: string;
  prevLabel?: string;
  submitLabel?: string;
  disabled?: boolean;
  className?: string;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  onNext,
  onPrev,
  onSubmit,
  isLastStep = false,
  isFirstStep = false,
  nextLabel = 'Next',
  prevLabel = 'Back',
  submitLabel = 'Submit',
  disabled = false,
  className = '',
}) => {
  const { canProceed, currentStep } = useForm();

  const handleNext = () => {
    if (canProceed()) {
      onNext?.();
    }
  };

  return (
    <div
      className={`flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-700 ${className}`}
    >
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={isFirstStep || disabled}
        leftIcon={
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        }
      >
        {prevLabel}
      </Button>

      <div className="flex items-center gap-3">
        {isLastStep ? (
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={disabled || !canProceed()}
            rightIcon={
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            }
          >
            {submitLabel}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={disabled || !canProceed()}
            rightIcon={
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            }
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
