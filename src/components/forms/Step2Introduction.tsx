import React from 'react';

import { useForm } from '../../hooks/useForm';
import type { Introduction } from '../../types/form';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Textarea, Input } from '../common/Input';

export const Step2Introduction: React.FC = () => {
  const {
    data: { introduction },
    setIntroduction,
    clearError,
    errors,
  } = useForm();

  const handleChange = (field: keyof Introduction, value: string) => {
    setIntroduction({ [field]: value });
    clearError('introduction', field);
  };

  const introErrors = errors.introduction || {};

  const characterCount = (text: string, max: number) => {
    return `${text.length}/${max}`;
  };

  return (
    <div className="space-y-6">
      <Card variant="default" padding="lg">
        <CardHeader
          title="Professional Summary *"
          subtitle="A concise overview of your professional background, key achievements, and what you bring to the table (2-3 sentences)"
        />
        <CardContent className="space-y-4">
          <Textarea
            label=""
            value={introduction.professionalSummary}
            onChange={(e) => handleChange('professionalSummary', e.target.value)}
            error={introErrors.professionalSummary}
            placeholder="Results-driven Software Engineer with 8+ years of experience building scalable web applications. Proven track record of leading cross-functional teams, delivering complex projects on time, and implementing innovative solutions that improve system performance by 40%+..."
            rows={4}
            maxLength={500}
            helperText={characterCount(introduction.professionalSummary, 500)}
          />
        </CardContent>
      </Card>

      <Card variant="default" padding="lg">
        <CardHeader
          title="Career Objective"
          subtitle="Your career goals and what you're looking for in your next role (optional)"
        />
        <CardContent className="space-y-4">
          <Textarea
            label=""
            value={introduction.objectiveStatement}
            onChange={(e) => handleChange('objectiveStatement', e.target.value)}
            placeholder="Seeking a Senior Engineering role where I can leverage my expertise in distributed systems and cloud architecture to drive technical excellence and mentor junior engineers..."
            rows={3}
            maxLength={300}
            helperText={characterCount(introduction.objectiveStatement, 300)}
          />
        </CardContent>
      </Card>

      <Card variant="default" padding="lg">
        <CardHeader
          title="Key Career Milestones"
          subtitle="Highlight your most significant achievements, awards, promotions, or impactful projects (optional)"
        />
        <CardContent className="space-y-4">
          <Textarea
            label=""
            value={introduction.keyCareerMilestones}
            onChange={(e) => handleChange('keyCareerMilestones', e.target.value)}
            placeholder="• Led migration of monolithic architecture to microservices, reducing deployment time by 75%
• Awarded 'Engineer of the Year' 2022 for building real-time analytics platform serving 10M+ users
• Published 3 technical papers on distributed systems at top-tier conferences
• Mentored 15+ engineers, with 5 promoted to senior roles under my guidance
• Architected CI/CD pipeline reducing release cycle from 2 weeks to 2 days..."
            rows={6}
            maxLength={1000}
            helperText={characterCount(introduction.keyCareerMilestones, 1000)}
          />
        </CardContent>
      </Card>

      <Card variant="default" padding="lg">
        <CardHeader
          title="Target Job Titles"
          subtitle="List the job titles you're targeting, separated by commas (optional)"
        />
        <CardContent className="space-y-4">
          <Input
            label=""
            value={introduction.targetJobTitles}
            onChange={(e) => handleChange('targetJobTitles', e.target.value)}
            placeholder="Senior Software Engineer, Staff Engineer, Engineering Lead, Technical Architect"
            helperText="Separate multiple titles with commas"
            maxLength={200}
          />
        </CardContent>
      </Card>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-900/20">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
            <svg
              className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-slate-900 dark:text-white">
              Tips for a compelling introduction
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>
                • <strong>Quantify achievements</strong> with specific numbers and percentages
              </li>
              <li>
                • <strong>Use action verbs</strong> like "Led," "Architected," "Delivered,"
                "Optimized"
              </li>
              <li>
                • <strong>Tailor to target roles</strong> - mirror keywords from job descriptions
              </li>
              <li>
                • <strong>Keep it concise</strong> - recruiters spend ~6 seconds scanning this
                section
              </li>
              <li>
                • <strong>Show, don't just tell</strong> - demonstrate impact through concrete
                examples
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Introduction;
