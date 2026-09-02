import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useForm } from '../../hooks/useForm';
import type { Experience } from '../../types/form';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../common/Card';
import { Input, Textarea, Select } from '../common/Input';

const initialExperience: Experience = {
  id: '',
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  location: '',
  achievements: '',
  directReports: '',
  toolsUsed: '',
  reasonForLeaving: '',
  salaryHistory: '',
};

export const Step4Experience: React.FC = () => {
  const {
    data: { experiences },
    addExperience,
    updateExperience,
    removeExperience,
    clearError,
    errors,
  } = useForm();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Experience>(initialExperience);
  const [showForm, setShowForm] = useState(false);

  const experienceErrors = errors.experiences || {};

  const handleInputChange = (field: keyof Experience, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (editingId) {
      clearError('experiences', field);
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (editingId) {
      clearError('experiences', field);
    }
  };

  const handleCurrentChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, current: checked, endDate: checked ? '' : prev.endDate }));
  };

  const resetForm = () => {
    setFormData(initialExperience);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateExperience(editingId, formData);
    } else {
      addExperience({ ...formData, id: uuidv4() });
    }
    resetForm();
  };

  const handleEdit = (experience: Experience) => {
    setFormData(experience);
    setEditingId(experience.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience entry?')) {
      removeExperience(id);
    }
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <Card variant="default" padding="lg">
        <CardHeader
          title="Work Experience"
          subtitle="Add your professional experience. Focus on achievements and impact, not just responsibilities."
          action={
            !showForm && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddNew}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                }
              >
                Add Experience
              </Button>
            )
          }
        />
        <CardContent className="space-y-4">
          {showForm && (
            <Card variant="outlined" padding="lg" className="animate-slide-in">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Job Title *"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    error={experienceErrors.position}
                    placeholder="Senior Software Engineer"
                    required
                    autoComplete="organization-title"
                  />
                  <Input
                    label="Company *"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    error={experienceErrors.company}
                    placeholder="Google"
                    required
                    autoComplete="organization"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="San Francisco, CA (Hybrid)"
                    autoComplete="address-level2"
                  />
                  <div className="flex items-end">
                    <label className="flex w-full cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.current}
                        onChange={(e) => handleCurrentChange(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Current Position
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Start Date *"
                    type="month"
                    value={formData.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    error={experienceErrors.startDate}
                    required
                    max={new Date().toISOString().slice(0, 7)}
                  />
                  <Input
                    label="End Date"
                    type="month"
                    value={formData.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    disabled={formData.current}
                    max={new Date().toISOString().slice(0, 7)}
                    placeholder={formData.current ? 'Present' : ''}
                  />
                </div>

                <Textarea
                  label="Key Achievements & Impact *"
                  value={formData.achievements}
                  onChange={(e) => handleInputChange('achievements', e.target.value)}
                  error={experienceErrors.achievements}
                  placeholder="• Led migration of monolithic architecture to microservices, reducing deployment time by 75% and saving $200K/year
• Built real-time analytics platform processing 10M+ events/day with 99.99% uptime
• Mentored 5 junior engineers, 3 promoted within 18 months
• Designed and implemented CI/CD pipeline reducing release cycle from 2 weeks to 2 days"
                  rows={6}
                  maxLength={2000}
                  required
                  helperText="Use bullet points. Quantify with numbers, percentages, dollar amounts. Focus on RESULTS."
                />

                <Textarea
                  label="Role Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Full-stack development using React, Node.js, PostgreSQL. Collaborated with product and design teams. Participated in code reviews and architecture decisions."
                  rows={4}
                  maxLength={1000}
                  helperText="Brief overview of your day-to-day responsibilities"
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Direct Reports"
                    value={formData.directReports}
                    onChange={(e) => handleInputChange('directReports', e.target.value)}
                    placeholder="5 (2 Senior, 3 Junior Engineers)"
                    helperText="Number and level of people you managed"
                  />
                  <Input
                    label="Tools & Technologies"
                    value={formData.toolsUsed}
                    onChange={(e) => handleInputChange('toolsUsed', e.target.value)}
                    placeholder="React, TypeScript, Node.js, PostgreSQL, AWS, Docker, Kubernetes, GraphQL, Jest, GitHub Actions"
                    helperText="Comma-separated list of tools, languages, frameworks"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Textarea
                    label="Reason for Leaving"
                    value={formData.reasonForLeaving}
                    onChange={(e) => handleInputChange('reasonForLeaving', e.target.value)}
                    placeholder="Seeking growth opportunities, company restructuring, relocation, career pivot"
                    rows={3}
                    maxLength={500}
                    helperText="Optional: Keep it positive and professional"
                  />
                  <Textarea
                    label="Salary History"
                    value={formData.salaryHistory}
                    onChange={(e) => handleInputChange('salaryHistory', e.target.value)}
                    placeholder="$120K base + $30K bonus (2022) → $150K base + $40K bonus (2023)"
                    rows={3}
                    maxLength={500}
                    helperText="Optional: Base, bonus, equity progression. Useful for negotiations."
                  />
                </div>

                <CardFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    rightIcon={
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                    {editingId ? 'Update Experience' : 'Add Experience'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {experiences.length === 0 && !showForm ? (
            <div className="rounded-xl border-2 border-dashed border-slate-300 py-12 text-center dark:border-slate-600">
              <svg
                className="mx-auto h-16 w-16 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">
                No work experience yet
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-500">
                Add your first job, internship, or freelance project
              </p>
              <Button
                variant="primary"
                className="mt-6"
                onClick={handleAddNew}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                }
              >
                Add Experience
              </Button>
            </div>
          ) : (
            <>
              {experiences.map((exp) => (
                <Card key={exp.id} variant="outlined" padding="md" className="animate-fade-in">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        {exp.current && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            Current
                          </span>
                        )}
                      </div>
                      <h4 className="mt-2 truncate text-lg font-semibold text-slate-900 dark:text-white">
                        {exp.position}
                      </h4>
                      <p className="font-medium text-indigo-600 dark:text-indigo-400">
                        {exp.company}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {exp.startDate &&
                            `${new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                          {exp.endDate || exp.current
                            ? ` - ${exp.current ? 'Present' : new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                            : ''}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {exp.location}
                          </span>
                        )}
                        {exp.directReports && (
                          <span className="flex items-center gap-1">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            {exp.directReports} reports
                          </span>
                        )}
                      </div>
                      {exp.toolsUsed && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {exp.toolsUsed
                            .split(',')
                            .slice(0, 8)
                            .map((tool, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {tool.trim()}
                              </span>
                            ))}
                          {exp.toolsUsed.split(',').length > 8 && (
                            <span className="inline-flex items-center rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                              +{exp.toolsUsed.split(',').length - 8} more
                            </span>
                          )}
                        </div>
                      )}
                      {(exp.achievements || exp.description) && (
                        <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          {exp.achievements && (
                            <div>
                              <strong className="text-slate-900 dark:text-white">
                                Key Achievements:
                              </strong>
                              <p className="mt-1 whitespace-pre-line">{exp.achievements}</p>
                            </div>
                          )}
                          {exp.description && (
                            <div>
                              <strong className="text-slate-900 dark:text-white">
                                Description:
                              </strong>
                              <p className="mt-1">{exp.description}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(exp)}
                        className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                        aria-label={`Edit ${exp.position} at ${exp.company}`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(exp.id)}
                        className="text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                        aria-label={`Delete ${exp.position} at ${exp.company}`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10M7 7h10"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {experiences.length > 0 && !showForm && (
                <Button
                  variant="outline"
                  onClick={handleAddNew}
                  leftIcon={
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  }
                >
                  Add Another Experience
                </Button>
              )}
            </>
          )}
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
              Tips for Experience Section
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>
                • <strong>Achievements vs Responsibilities</strong> - "Increased revenue 25%" not
                "Responsible for sales"
              </li>
              <li>
                • <strong>Quantify everything</strong> - Numbers, percentages, dollar amounts, time
                saved
              </li>
              <li>
                • <strong>Use STAR method</strong> - Situation, Task, Action, Result
              </li>
              <li>
                • <strong>Tailor to target role</strong> - Mirror keywords from job descriptions
              </li>
              <li>
                • <strong>Show progression</strong> - Promotions, expanding scope, leadership growth
              </li>
              <li>
                • <strong>Tools & tech</strong> - Include relevant stack for ATS keyword matching
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Experience;
