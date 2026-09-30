import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../hooks/useForm';
import { useTemplate, type TemplateId } from '../../hooks/useTemplate';
import type { FormData } from '../../types/form';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent } from '../common/Card';

const SECTION_LABELS: Record<string, { label: string; description: string }> = {
  personalData: { label: 'Personal Data', description: 'Name, contact info, photo, location' },
  introduction: {
    label: 'Professional Summary',
    description: 'Summary, objective, career milestones, target titles',
  },
  experiences: {
    label: 'Work Experience',
    description: 'Companies, positions, dates, descriptions, achievements',
  },
  educations: { label: 'Education', description: 'Degrees, institutions, dates, GPA, honors' },
  medicalScience: {
    label: 'Medical & Science',
    description: 'Clinical rotations, research, publications, licenses',
  },
  projects: { label: 'Projects', description: 'Project names, roles, descriptions, links' },
  skills: { label: 'Skills', description: 'Technical skills, soft skills, proficiency' },
  credentials: {
    label: 'Credentials & Extras',
    description: 'Certificates, volunteer work, hobbies, military, references',
  },
  references: {
    label: 'References',
    description: 'Reference names, titles, companies, contact info',
  },
  certifications: {
    label: 'Certifications',
    description: 'Certificate names, issuers, dates, credential IDs, verification links',
  },
  languages: { label: 'Languages', description: 'Spoken languages and proficiency levels' },
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
  'references',
  'certifications',
  'languages',
];

const hasContent = (data: FormData, section: string): boolean => {
  const value = (data as unknown as Record<string, unknown>)[section];
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.values(value).some((v) => v && v !== '');
  return Boolean(value);
};

interface Step12ReviewProps {
  onGenerate?: () => void;
}

export const Step12Review: React.FC<Step12ReviewProps> = ({ onGenerate }) => {
  const { data, selectedSections, setSelectedSections } = useForm();
  const { selectedTemplate, setSelectedTemplate } = useTemplate();
  const navigate = useNavigate();

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

  const handleBack = () => {
    navigate('/form/step/9');
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
          <div className="mb-4 flex flex-wrap gap-2">
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
              const isEnabled =
                selectedSections[section as keyof typeof selectedSections] !== false;

              return (
                <label
                  key={section}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                    isEnabled
                      ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20'
                      : 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-700 dark:bg-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isEnabled && hasData}
                    onChange={() => toggleSection(section)}
                    disabled={!hasData}
                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {label.label}
                      </span>
                      {!hasData && (
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                          No data
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
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
            {(
              ['classic', 'modern', 'minimal', 'executive', 'creative', 'compact'] as TemplateId[]
            ).map((template) => (
              <label
                key={template}
                className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all ${
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
                  <div className="font-semibold text-slate-900 capitalize dark:text-white">
                    {template}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {template === 'classic' && 'Traditional, professional'}
                    {template === 'modern' && 'Two-column, bold sidebar'}
                    {template === 'minimal' && 'Clean, minimal, green accents'}
                    {template === 'executive' && 'Gold accents, formal'}
                    {template === 'creative' && 'Purple sidebar, bold'}
                    {template === 'compact' && 'Ultra-compact, dense'}
                  </div>
                </div>
                {selectedTemplate === template && (
                  <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">
                    ✓
                  </div>
                )}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={handleBack}
          leftIcon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          }
        >
          Back
        </Button>
        <Button
          variant="secondary"
          onClick={onGenerate}
          leftIcon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          }
        >
          Preview PDF
        </Button>
        <Button
          variant="primary"
          onClick={onGenerate}
          rightIcon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          }
        >
          Finish &amp; Generate CV
        </Button>
      </div>
    </div>
  );
};
