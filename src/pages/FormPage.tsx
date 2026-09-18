import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';

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
import { Step10Review } from '../components/forms/Step10Review';
import { PDFPreview } from '../components/pdf/PDFPreview';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { FormProvider, useForm } from '../hooks/useForm';
import type { TemplateId } from '../hooks/useTemplate';
import { TemplateProvider, useTemplate } from '../hooks/useTemplate';
import { auth } from '../lib/firebase';
import { generateDocxBlob } from '../services/generateDocx';
import { createClientId, loadCV, saveCV, submitClient } from '../services/submitClient';
import { normalizeFormData } from '../types/form';
import type { FormStep } from '../types/form';

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
  { number: 10, label: 'Review & Customize', component: Step10Review },
];

const stepComponents: Record<number, React.ComponentType> = steps.reduce(
  (acc, step) => {
    acc[step.number] = step.component;
    return acc;
  },
  {} as Record<number, React.ComponentType>
);

const FormPageInner: React.FC = () => {
  const { step } = useParams<{ step: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const form = useForm();
  const { data, setSubmitting, isSubmitting, loadData, setStep } = form;
  const { selectedTemplate, setSelectedTemplate } = useTemplate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitProgress, setSubmitProgress] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [savedToCloud, setSavedToCloud] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cloudDocIdRef = useRef<string | null>(null);
  const busyRef = useRef(false);
  const completedRef = useRef(false);
  const savedSnapshotRef = useRef('');
  const [cloudStatus, setCloudStatus] = useState('');
  const [saveRevision, setSaveRevision] = useState(0);
  const resumeId = searchParams.get('resume');
  const scopeRef = useRef(0);
  const downloadingRef = useRef(false);
  const templateSetterRef = useRef(setSelectedTemplate);
  const latestSnapshotRef = useRef('');
  const loadDataRef = useRef(loadData);

  useEffect(() => {
    loadDataRef.current = loadData;
  }, [loadData]);

  useLayoutEffect(() => {
    templateSetterRef.current = setSelectedTemplate;
  }, [setSelectedTemplate]);

  useLayoutEffect(() => {
    scopeRef.current += 1;
    busyRef.current = false;
    downloadingRef.current = false;
    return () => {
      scopeRef.current += 1;
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
  }, [resumeId, user?.uid]);

  useEffect(() => {
    cloudDocIdRef.current = null;
    completedRef.current = false;
    savedSnapshotRef.current = '';
  }, [user?.uid]);

  useEffect(() => {
    if (!resumeId || !user) return;
    let cancelled = false;
    const scope = scopeRef.current;
    loadCV(user.uid, resumeId)
      .then((cv) => {
        if (cancelled || scope !== scopeRef.current || user !== auth.currentUser) return;
        const restored = normalizeFormData(cv);
        cloudDocIdRef.current = cv.id;
        completedRef.current = !cv.isDraft;
        savedSnapshotRef.current = JSON.stringify([restored, cv.template]);
        loadDataRef.current(restored);
        templateSetterRef.current(cv.template);
        setSubmitError(null);
        setCloudStatus('Loaded from My CVs');
        navigate('/form/step/1', { replace: true });
      })
      .catch((error) => {
        if (!cancelled)
          setSubmitError(error instanceof Error ? error.message : 'Unable to load CV.');
      });
    return () => {
      cancelled = true;
    };
  }, [resumeId, user, navigate]);

  useEffect(() => {
    if (!user || resumeId || !data.personalData.fullName?.trim()) return;
    const pendingSnapshot = JSON.stringify([normalizeFormData(data), selectedTemplate]);
    latestSnapshotRef.current = pendingSnapshot;
    if (busyRef.current || savedSnapshotRef.current === pendingSnapshot) return;
    autoSaveTimeoutRef.current = setTimeout(async () => {
      if (busyRef.current) return;
      busyRef.current = true;
      setAutoSaving(true);
      setCloudStatus('Saving to My CVs...');
      const targetSnapshot = latestSnapshotRef.current;
      const scope = scopeRef.current;
      cloudDocIdRef.current ??= createClientId();
      try {
        await saveCV(
          data,
          selectedTemplate,
          user.uid,
          cloudDocIdRef.current,
          !completedRef.current
        );
        if (scope !== scopeRef.current || user.uid !== auth.currentUser?.uid) return;
        if (latestSnapshotRef.current === targetSnapshot) {
          savedSnapshotRef.current = targetSnapshot;
          setCloudStatus('Saved to My CVs');
          setSavedToCloud(true);
        }
        setSaveRevision((value) => value + 1);
      } catch (error) {
        if (scope === scopeRef.current && user.uid === auth.currentUser?.uid)
          setCloudStatus(
            error instanceof Error ? error.message : 'Cloud save failed. Retry using Save to Cloud.'
          );
      } finally {
        if (scope === scopeRef.current) {
          busyRef.current = false;
          setAutoSaving(false);
        }
      }
    }, 3000);
    return () => {
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
  }, [data, selectedTemplate, user, resumeId, saveRevision]);

  const currentStepRaw = parseInt(step || '1', 10);
  const validStep: FormStep = (
    Number.isFinite(currentStepRaw) && currentStepRaw >= 1 && currentStepRaw <= 10
      ? currentStepRaw
      : 1
  ) as FormStep;

  useEffect(() => {
    setStep(validStep);
  }, [validStep, setStep]);

  const currentStepData = steps.find((s) => s.number === validStep);
  const isFirstStep = validStep === 1;
  const isLastStep = validStep === 10;
  const StepComponent = stepComponents[validStep] || null;

  const handleNext = () => {
    if (validStep < 10) {
      navigate(`/form/step/${validStep + 1}`);
    }
  };

  const handlePrev = () => {
    if (validStep > 1) {
      navigate(`/form/step/${validStep - 1}`);
    }
  };

  const handleSubmit = async () => {
    if (busyRef.current || resumeId) return;
    if (!user) {
      setSubmitError('Sign in to save to My CVs. PDF and DOCX downloads work without an account.');
      return;
    }
    busyRef.current = true;
    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    setSubmitError(null);
    setSubmitProgress('Saving to My CVs...');
    setSubmitting(true);
    cloudDocIdRef.current ??= createClientId();
    try {
      await submitClient(data, selectedTemplate, user.uid, cloudDocIdRef.current);
      completedRef.current = true;
      savedSnapshotRef.current = JSON.stringify([normalizeFormData(data), selectedTemplate]);
      setCloudStatus('Saved to My CVs. PDF and DOCX downloads are generated on your device.');
      setSavedToCloud(true);
      setSaveRevision((value) => value + 1);
      addToast('CV saved to My CVs', 'success');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Cloud save failed. Local downloads are still available.';
      setSubmitError(message);
      setCloudStatus(message);
      addToast(message, 'error');
    } finally {
      busyRef.current = false;
      setSubmitProgress(null);
      setSubmitting(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (downloadingRef.current) return;
    downloadingRef.current = true;
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
      downloadingRef.current = false;
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
          {savedToCloud && (
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
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving draft...
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300" role="status">
        {cloudStatus ||
          'Cloud saves store CV data in Firestore. PDF and DOCX exports stay on your device.'}{' '}
        <Link to="/my-cvs" className="text-indigo-600 underline dark:text-indigo-300">
          My CVs
        </Link>
      </p>
      <StepProgress currentStep={validStep} />

      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {submitError}
        </div>
      )}

      <div className="animate-fade-in">
        <StepComponent />
      </div>

      {validStep === 9 && (
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
              onChange={(e) => setSelectedTemplate(e.target.value as TemplateId)}
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
          <div className="flex flex-col gap-2">
            {submitProgress && (
              <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {submitProgress}
              </div>
            )}
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
              <Button
                variant="outline"
                onClick={handleSubmit}
                disabled={isSubmitting || autoSaving || !!resumeId || !user}
              >
                {isSubmitting ? 'Saving to Cloud...' : 'Save to Cloud'}
              </Button>
            </div>
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
        disabled={isSubmitting}
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
