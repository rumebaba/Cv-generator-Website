import React from 'react';
import type { FormStep } from '../../types/form';

import { useForm } from '../../hooks/useForm';
import { useTemplate, type TemplateId } from '../../hooks/useTemplate';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent } from '../common/Card';

const SECTION_LABELS: Record<string, { label: string; description: string }> = {
  personalData: { label: 'Personal Data', description: 'Name, contact info, photo, location' },
  introduction: { label: 'Professional Summary', description: 'Summary, objective, career milestones, target titles' },
  experiences: { label: 'Work Experience', description: 'Companies, positions, dates, descriptions, achievements' },
  educations: { label: 'Education', description: 'Degrees, institutions, dates, GPA, honors' },
  medicalScience: { label: 'Medical & Science', description: 'Clinical rotations, research, publications, licenses' },
  projects: { label: 'Projects', description: 'Project names, roles, descriptions, links' },
  skills: { label: 'Skills', description: 'Technical skills, soft skills, languages, proficiency' },
  credentials: { label: 'Credentials', description: 'Certificates, volunteer work, hobbies, military, references' },
  certifications: { label: 'Certifications', description: 'Certificate names, issuers, dates, credential IDs' },
  languages: { label: 'Languages', description: 'Spoken languages and proficiency levels' },
  references: { label: 'References', description: 'Reference names, titles, companies, contact info' },
};

const SECTION_ORDER: string[] = [
  'personalData',
  'introduction',
  'experiences',
  'educations',
  'medicalScience',
  'projects',
  'skills',
  'credentials',
  'certifications',
  'languages',
  'references',
];

const hasContent = (data: any, section: string): boolean => {
  const value = data[section];
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.values(value).some((v) => v && v !== '');
  return Boolean(value);
};

export const Step10Review: React.FC = () => {
  const {
    data,
    selectedSections,
    setSelectedSections,
    setStep,
    currentStep,
  } = useForm();
  const { selectedTemplate, setSelectedTemplate } = useTemplate();

  const toggleSection = (section: string) => {
    setSelectedSections({ [section]: !selectedSections[section as keyof typeof selectedSections] });
  };

  const selectAll = () => {
    const allSections: Record<string, boolean> = {};
    SECTION_ORDER.forEach((s) => {
      allSections[s] = true;
    });
    setSelectedSections(allSections);
  };

  const selectNone = () => {
    const allSections: Record<string, boolean> = {};
    SECTION_ORDER.forEach((s) => {
      allSections[s] = false;
    });
    setSelectedSections(allSections);
  };

  const handleFinish = () => {
    setStep(1);
  };

  const handleBack = () => {
    const prevStep = 9 as FormStep;
    setStep(prevStep);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Review & Customize</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Review your information and choose which sections to include in your final CV.
        </p>
      </div>

      <Card variant="default" padding="lg">
        <CardHeader
          title="Select Sections to Include"
          subtitle="Toggle sections on/off. Only enabled sections will appear in your final CV."
        />
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={selectNone}>
              Clear All
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {SECTION_ORDER.map((section: string) => {
              const label = SECTION_LABELS[section];
              const hasData = hasContent(data, section);
              const isEnabled = selectedSections[section as keyof typeof selectedSections] !== false;

              return (
                <label
                  key={section}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    isEnabled
                      ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20'
                      : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isEnabled && hasData}
                    onChange={() => toggleSection(section)}
                    disabled={!hasData}
                    className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {label.label}
                      </span>
                      {!hasData && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          No data
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {label.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card variant="default" padding="lg">
        <CardHeader title="Choose Template" subtitle="Select a template for your final CV" />
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {(['classic', 'modern', 'minimal', 'executive', 'creative', 'compact'] as TemplateId[]).map((template) => (
              <label
                key={template}
                className={`relative cursor-pointer p-3 rounded-lg border-2 transition-all ${
                  selectedTemplate === template
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 hover:border-indigo-300 dark:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  value={template}
                  checked={selectedTemplate === template}
                  onChange={() => setSelectedTemplate(template as TemplateId)}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="font-semibold text-slate-900 dark:text-white capitalize">
                    {template}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {template === 'classic' && 'Traditional, professional'}
                    {template === 'modern' && 'Two-column, bold sidebar'}
                    {template === 'minimal' && 'Clean, minimal, green accents'}
                    {template === 'executive' && 'Gold accents, formal'}
                    {template === 'creative' && 'Purple sidebar, bold'}
                    {template === 'compact' && 'Ultra-compact, dense'}
                  </div>
                </div>
                {selectedTemplate === template && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button variant="outline" onClick={handleBack} leftIcon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>}>
          Back
        </Button>
        <Button variant="primary" onClick={handleFinish} rightIcon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}>
          Finish & Generate CV
        </Button>
      </div>
    </div>
  );
};