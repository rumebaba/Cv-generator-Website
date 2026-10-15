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
  const { canProceed, getStepErrors } = useForm();

  const handleNext = () => {
    if (canProceed()) {
      onNext?.();
    }
  };

  // When the step cannot be completed, say why. Previously the primary button
  // was simply disabled with no explanation, which read as the app being stuck.
  const stepErrors = canProceed() ? [] : getStepErrors();
  const blockedByValidation = !disabled && stepErrors.length > 0;

  return (
    <div>
      {blockedByValidation && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <p className="font-medium">
            {stepErrors.length === 1
              ? 'Before you can continue:'
              : 'Before you can continue, fix the following:'}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {stepErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

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
    </div>
  );
};
