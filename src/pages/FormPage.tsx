import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { FormNavigation } from '../components/common/FormNavigation';
import { StepProgress } from '../components/common/StepProgress';
import { Step1PersonalData } from '../components/forms/Step1PersonalData';
import { Step2Introduction } from '../components/forms/Step2Introduction';
import { FormProvider } from '../hooks/useForm';

const steps = [
  { number: 1, label: 'Personal Data', component: Step1PersonalData },
  { number: 2, label: 'Introduction', component: Step2Introduction },
  { number: 3, label: 'Experience', component: null },
  { number: 4, label: 'Education', component: null },
  { number: 5, label: 'Skills', component: null },
  { number: 6, label: 'Projects', component: null },
  { number: 7, label: 'Certifications', component: null },
  { number: 8, label: 'Languages', component: null },
  { number: 9, label: 'References', component: null },
];

const stepComponents: Record<number, React.ComponentType> = {
  1: Step1PersonalData,
  2: Step2Introduction,
};

const ComingSoonStep: React.FC<{ stepNumber: number; stepLabel: string }> = ({
  stepNumber,
  stepLabel,
}) => (
  <Card variant="default" padding="lg" className="py-16 text-center">
    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
      <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stepNumber}</span>
    </div>
    <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">{stepLabel}</h3>
    <p className="mx-auto mb-6 max-w-md text-slate-600 dark:text-slate-400">
      This step is coming soon! We're building out the complete CV builder experience.
    </p>
    <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
      <span className="flex items-center gap-1">
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        Under Development
      </span>
    </div>
  </Card>
);

export const FormPage: React.FC = () => {
  const { step } = useParams<{ step: string }>();
  const navigate = useNavigate();
  const currentStep = parseInt(step || '1', 10);

  const validStep = Math.max(1, Math.min(9, currentStep));

  useEffect(() => {
    if (currentStep !== validStep) {
      navigate(`/form/step/${validStep}`, { replace: true });
    }
  }, [currentStep, validStep, navigate]);

  const currentStepData = steps.find((s) => s.number === validStep);
  const isFirstStep = validStep === 1;
  const isLastStep = validStep === 9;
  const StepComponent = stepComponents[validStep] || null;

  const handleNext = () => {
    if (validStep < 9) {
      navigate(`/form/step/${validStep + 1}`);
    }
  };

  const handlePrev = () => {
    if (validStep > 1) {
      navigate(`/form/step/${validStep - 1}`);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted!');
    alert('CV Generated Successfully! (Demo)');
  };

  return (
    <FormProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Build Your CV</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Step {validStep} of 9: {currentStepData?.label}
            </p>
          </div>
          <div className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Save Draft
            </Button>
          </div>
        </div>

        <StepProgress currentStep={validStep} />

        <div className="animate-fade-in">
          {StepComponent ? (
            <StepComponent />
          ) : (
            <ComingSoonStep stepNumber={validStep} stepLabel={currentStepData?.label || 'Step'} />
          )}
        </div>

        <FormNavigation
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleSubmit}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          nextLabel={isLastStep ? 'Generate CV' : 'Continue'}
          submitLabel="Generate CV"
        />
      </div>
    </FormProvider>
  );
};

export default FormPage;
