import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { FormNavigation } from '../components/common/FormNavigation';
import { StepProgress } from '../components/common/StepProgress';
import { Step1PersonalData } from '../components/forms/Step1PersonalData';
import { Step2Introduction } from '../components/forms/Step2Introduction';
import { Step3Education } from '../components/forms/Step3Education';
import { Step4Experience } from '../components/forms/Step4Experience';
import { Step5MedicalScience } from '../components/forms/Step5MedicalScience';
import { Step6Projects } from '../components/forms/Step6Projects';
import { Step7Skills } from '../components/forms/Step7Skills';
import { Step8Credentials } from '../components/forms/Step8Credentials';
import { Step9References } from '../components/forms/Step9References';
import { PDFPreview } from '../components/pdf/PDFPreview';
import { useAuth } from '../contexts/AuthContext';
import { FormProvider, useForm } from '../hooks/useForm';
import { TemplateProvider, useTemplate } from '../hooks/useTemplate';
import { generateDocxBlob } from '../services/generateDocx';
import { submitClient } from '../services/submitClient';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

const stepComponents: Record<number, React.ComponentType> = steps.reduce((acc, step) => {
  acc[step.number] = step.component;
  return acc;
}, {} as Record<number, React.ComponentType>);

const FormPageInner: React.FC = () => {
  const { step } = useParams<{ step: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const form = useForm();
  const { data, setSubmitting, isSubmitting, loadData } = form;
  const { selectedTemplate, setSelectedTemplate } = useTemplate();
  const { user } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const prevDataRef = useRef(data);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cloudDocIdRef = useRef<string | null>(null);
  const isResumingRef = useRef(false);

  // Load draft data when resume parameter is present
  useEffect(() => {
    const resumeId = searchParams.get('resume');
    if (resumeId && !isResumingRef.current) {
      isResumingRef.current = true;
      loadDraftData(resumeId);
    }
  }, [searchParams]);

  const loadDraftData = async (docId: string) => {
    try {
      const docRef = doc(db, 'clients', docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const draftData = docSnap.data();
        // Load the draft data into the form
        loadData(draftData as any);
        cloudDocIdRef.current = docId;
        // Set the template if saved
        if (draftData.template) {
          setSelectedTemplate(draftData.template);
        }
        // Navigate to step 1 to start editing
        navigate('/form/step/1', { replace: true });
      }
    } catch (err) {
      console.error('Failed to load draft:', err);
    }
  };

  // Auto-save indicator
  useEffect(() => {
    if (prevDataRef.current !== data) {
      prevDataRef.current = data;
      setSavedIndicator(true);
      const timer = setTimeout(() => setSavedIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [data]);

  // Auto-save to cloud (debounced)
  useEffect(() => {
    if (!user || !data.personalData.fullName?.trim()) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      setAutoSaving(true);
      try {
        // Check if we have an existing cloud doc ID for this session
        let docId = cloudDocIdRef.current;

        const serialized = (await import('../services/submitClient')).serializeFormData(data);

        if (docId) {
          // Update existing document
          const { updateDoc, doc } = await import('firebase/firestore');
          const { db } = await import('../lib/firebase');
          await updateDoc(doc(db, 'clients', docId), {
            ...serialized,
            template: selectedTemplate,
            updatedAt: (await import('firebase/firestore')).serverTimestamp(),
          });
        } else {
          // Create new document
          const { addDoc, collection } = await import('firebase/firestore');
          const { db } = await import('../lib/firebase');
          const docRef = await addDoc(collection(db, 'clients'), {
            ...serialized,
            template: selectedTemplate,
            userId: user.uid,
            createdAt: (await import('firebase/firestore')).serverTimestamp(),
            updatedAt: (await import('firebase/firestore')).serverTimestamp(),
            isDraft: true,
          });
          docId = docRef.id;
          cloudDocIdRef.current = docId;
        }
      } catch (err) {
        console.error('Auto-save to cloud failed:', err);
      } finally {
        setAutoSaving(false);
      }
    }, 3000); // Debounce 3 seconds

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [data, selectedTemplate, user]);

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
      const result = await submitClient(data, selectedTemplate, user?.uid || '');
      window.open(result.pdfUrl, '_blank');
      alert(`CV submitted successfully!\n\nPDF: ${result.pdfUrl}`);
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Cloud submission failed. You can still download your CV locally using the buttons below.'
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Saved
            </span>
          )}
          {autoSaving && (
            <span className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400">
              <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving draft...
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
        <StepComponent />
      </div>

      {isLastStep && (
        <Card variant="elevated" padding="lg">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Export Your CV
          </h3>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Choose Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) =>
                setSelectedTemplate(e.target.value as import('../hooks/useTemplate').TemplateId)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="executive">Executive</option>
              <option value="creative">Creative</option>
              <option value="compact">Compact</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setShowPreview(true)}>
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview &amp; Download PDF
            </Button>
            <Button variant="secondary" onClick={handleDownloadDocx} disabled={downloadingDocx}>
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {downloadingDocx ? 'Generating...' : 'Download DOCX'}
            </Button>
            <Button variant="outline" onClick={handleSubmit} disabled={isSubmitting}>
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
