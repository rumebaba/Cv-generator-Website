import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { FormNavigation } from '../components/common/FormNavigation';
import { StepProgress } from '../components/common/StepProgress';
import { PDFPreview } from '../components/pdf/PDFPreview';
import { Step1PersonalData } from '../components/forms/Step1PersonalData';
import { Step2Introduction } from '../components/forms/Step2Introduction';
import { Step3Education } from '../components/forms/Step3Education';
import { Step4Experience } from '../components/forms/Step4Experience';
import { Step5MedicalScience } from '../components/forms/Step5MedicalScience';
import { Step6Projects } from '../components/forms/Step6Projects';
import { Step7Skills } from '../components/forms/Step7Skills';
import { Step8Credentials } from '../components/forms/Step8Credentials';
import { Step9References } from '../components/forms/Step9References';
import { FormProvider, useForm } from '../hooks/useForm';
import { TemplateProvider, useTemplate } from '../hooks/useTemplate';
import { submitClient } from '../services/submitClient';
import { generateDocxBlob } from '../services/generateDocx';

const steps = [
  { number: 1, label: 'Personal Data', component: Step1PersonalData },
  { number: 2, label: 'Introduction', component: Step2Introduction },
  { number: 3, label: 'Education', component: Step3Education },
  { number: 4, label: 'Experience', component: Step4Experience },
  { number: 5, label: 'Medical & Science', component: Step5MedicalScience },
  { number: 6, label: 'Projects', component: Step6Projects },
  { number: 7, label: 'Skills', component: Step7Skills },
  { number: 8, label: 'Credentials & Extras', component: Step8Credentials },
  { number: 9, label: 'References', component: Step9References },
];

const stepComponents: Record<number, React.ComponentType> = {
  1: Step1PersonalData,
  2: Step2Introduction,
  3: Step3Education,
  4: Step4Experience,
  5: Step5MedicalScience,
  6: Step6Projects,
  7: Step7Skills,
  8: Step8Credentials,
  9: Step9References,
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
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Under Development
      </span>
    </div>
  </Card>
);

const FormPageInner: React.FC = () => {
  const { step } = useParams<{ step: string }>();
  const navigate = useNavigate();
  const form = useForm();
  const { data, setSubmitting, isSubmitting } = form;
  const { selectedTemplate } = useTemplate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const prevDataRef = useRef(data);

  // Auto-save indicator
  useEffect(() => {
    if (prevDataRef.current !== data) {
      prevDataRef.current = data;
      setSavedIndicator(true);
      const timer = setTimeout(() => setSavedIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [data]);

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

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const result = await submitClient(data, selectedTemplate);
      window.open(result.pdfUrl, '_blank');
      alert(`CV submitted successfully!\n\nPDF: ${result.pdfUrl}`);
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitError(
        err instanceof Error ? err.message : 'Cloud submission failed. You can still download your CV locally using the buttons below.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadDocx = async () => {
    setDownloadingDocx(true);
    try {
      const blob = await generateDocxBlob(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.personalData.fullName.replace(/\s+/g, '_') || 'cv'}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('DOCX generation failed:', error);
    } finally {
      setDownloadingDocx(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Build Your CV</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Step {validStep} of 9: {currentStepData?.label}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedIndicator && (
            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
        </div>
      </div>

      <StepProgress currentStep={validStep} />

      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {submitError}
        </div>
      )}

      <div className="animate-fade-in">
        {StepComponent ? (
          <StepComponent />
        ) : (
          <ComingSoonStep stepNumber={validStep} stepLabel={currentStepData?.label || 'Step'} />
        )}
      </div>

      {isLastStep && (
        <Card variant="elevated" padding="lg">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Export Your CV</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setShowPreview(true)}>
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview &amp; Download PDF
            </Button>
            <Button variant="secondary" onClick={handleDownloadDocx} disabled={downloadingDocx}>
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {downloadingDocx ? 'Generating...' : 'Download DOCX'}
            </Button>
            <Button
              variant="outline"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving to Cloud...' : 'Save to Cloud'}
            </Button>
          </div>
        </Card>
      )}

      <FormNavigation
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={isLastStep ? handleSubmit : undefined}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        nextLabel="Continue"
        submitLabel={isSubmitting ? 'Saving...' : 'Save to Cloud'}
      />

      <PDFPreview
        formState={form}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        template={selectedTemplate}
      />
    </div>
  );
};

export const FormPage: React.FC = () => (
  <FormProvider>
    <TemplateProvider>
      <FormPageInner />
    </TemplateProvider>
  </FormProvider>
);

export default FormPage;
