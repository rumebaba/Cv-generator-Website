import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useForm } from '../../hooks/useForm';
import type { Education } from '../../types/form';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../common/Card';
import { Input, Textarea, Select } from '../common/Input';

const degreeTypes = [
  { value: '', label: 'Select degree type' },
  { value: 'high_school', label: 'High School Diploma' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'phd', label: 'PhD / Doctorate' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'other', label: 'Other' },
];

const classRanks = [
  { value: '', label: 'Select class rank' },
  { value: 'top_1', label: 'Top 1%' },
  { value: 'top_5', label: 'Top 5%' },
  { value: 'top_10', label: 'Top 10%' },
  { value: 'top_25', label: 'Top 25%' },
  { value: 'top_50', label: 'Top 50%' },
  { value: 'not_ranked', label: 'Not Ranked' },
];

const initialEducation: Education = {
  id: '',
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  location: '',
  gpa: '',
  thesisTopic: '',
  academicHonors: '',
  relevantClasses: '',
  classRank: '',
};

export const Step3Education: React.FC = () => {
  const {
    data: { educations },
    addEducation,
    updateEducation,
    removeEducation,
    clearError,
    errors,
  } = useForm();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Education>(initialEducation);
  const [showForm, setShowForm] = useState(false);

  const educationErrors = errors.educations || {};

  const handleInputChange = (field: keyof Education, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (editingId) {
      clearError('educations', field);
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (editingId) {
      clearError('educations', field);
    }
  };

  const handleCurrentChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, current: checked, endDate: checked ? '' : prev.endDate }));
  };

  const resetForm = () => {
    setFormData(initialEducation);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateEducation(editingId, formData);
    } else {
      addEducation({ ...formData, id: uuidv4() });
    }
    resetForm();
  };

  const handleEdit = (education: Education) => {
    setFormData(education);
    setEditingId(education.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      removeEducation(id);
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
          title="Education History"
          subtitle="Add your academic background. Include degrees, certifications, and relevant coursework."
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
                Add Education
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
                    label="Institution / University *"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    error={educationErrors.institution}
                    placeholder="Stanford University"
                    required
                    autoComplete="organization"
                  />
                  <Select
                    label="Degree Type *"
                    value={formData.degree}
                    onChange={(e) => handleInputChange('degree', e.target.value)}
                    options={degreeTypes}
                    placeholder="Select degree type"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Major / Field of Study *"
                    value={formData.fieldOfStudy}
                    onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                    error={educationErrors.fieldOfStudy}
                    placeholder="Computer Science"
                    required
                    autoComplete="off"
                  />
                  <Input
                    label="Location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Stanford, CA, USA"
                    autoComplete="address-level2"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <Input
                    label="Start Date *"
                    type="month"
                    value={formData.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    error={educationErrors.startDate}
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
                  <div className="flex items-end">
                    <label className="flex w-full cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.current}
                        onChange={(e) => handleCurrentChange(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Currently Studying
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="GPA / Grade"
                    value={formData.gpa}
                    onChange={(e) => handleInputChange('gpa', e.target.value)}
                    placeholder="3.8 / 4.0"
                    helperText="e.g., 3.8/4.0, 85%, First Class Honours"
                  />
                  <Select
                    label="Class Rank"
                    value={formData.classRank}
                    onChange={(e) => handleInputChange('classRank', e.target.value)}
                    options={classRanks}
                    placeholder="Select class rank"
                  />
                </div>

                <Textarea
                  label="Thesis / Dissertation Topic"
                  value={formData.thesisTopic}
                  onChange={(e) => handleInputChange('thesisTopic', e.target.value)}
                  placeholder="Machine Learning Applications in Healthcare Diagnostics"
                  rows={3}
                  maxLength={500}
                  helperText="Optional: Title of your thesis, dissertation, or capstone project"
                />

                <Textarea
                  label="Academic Honors & Awards"
                  value={formData.academicHonors}
                  onChange={(e) => handleInputChange('academicHonors', e.target.value)}
                  placeholder="Dean's List (2020-2022), Magna Cum Laude, Rhodes Scholarship Finalist, Best Thesis Award"
                  rows={3}
                  maxLength={500}
                  helperText="Optional: Honors, awards, scholarships, Dean's List, etc."
                />

                <Textarea
                  label="Relevant Coursework"
                  value={formData.relevantClasses}
                  onChange={(e) => handleInputChange('relevantClasses', e.target.value)}
                  placeholder="Advanced Algorithms, Machine Learning, Distributed Systems, Database Design, Computer Networks"
                  rows={3}
                  maxLength={500}
                  helperText="Optional: List relevant courses separated by commas"
                />

                <Textarea
                  label="Additional Details"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Research projects, study abroad, extracurricular leadership, publications, etc."
                  rows={4}
                  maxLength={1000}
                />

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
                    {editingId ? 'Update Education' : 'Add Education'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {educations.length === 0 && !showForm ? (
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">
                No education entries yet
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-500">
                Add your first degree or certification
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
                Add Education
              </Button>
            </div>
          ) : (
            <>
              {educations.map((edu) => (
                <Card key={edu.id} variant="outlined" padding="md" className="animate-fade-in">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                          {degreeTypes.find((d) => d.value === edu.degree)?.label || edu.degree}
                        </span>
                        {edu.current && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            Current
                          </span>
                        )}
                      </div>
                      <h4 className="mt-2 truncate text-lg font-semibold text-slate-900 dark:text-white">
                        {edu.institution}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400">{edu.fieldOfStudy}</p>
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {edu.startDate &&
                            `${new Date(edu.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                          {edu.endDate || edu.current
                            ? ` - ${edu.current ? 'Present' : new Date(edu.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                            : ''}
                        </span>
                        {edu.location && (
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
                            {edu.location}
                          </span>
                        )}
                        {edu.gpa && (
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            GPA: {edu.gpa}
                          </span>
                        )}
                        {edu.classRank && (
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
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                            {classRanks.find((r) => r.value === edu.classRank)?.label ||
                              edu.classRank}
                          </span>
                        )}
                      </div>
                      {(edu.thesisTopic || edu.academicHonors || edu.relevantClasses) && (
                        <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          {edu.thesisTopic && (
                            <p>
                              <strong>Thesis:</strong> {edu.thesisTopic}
                            </p>
                          )}
                          {edu.academicHonors && (
                            <p>
                              <strong>Honors:</strong> {edu.academicHonors}
                            </p>
                          )}
                          {edu.relevantClasses && (
                            <p>
                              <strong>Courses:</strong> {edu.relevantClasses}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(edu)}
                        className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                        aria-label={`Edit ${edu.institution}`}
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
                        onClick={() => handleDelete(edu.id)}
                        className="text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                        aria-label={`Delete ${edu.institution}`}
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

              {educations.length > 0 && !showForm && (
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
                  Add Another Education
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
              Tips for Education Section
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>
                • <strong>Reverse chronological order</strong> - Most recent degree first
              </li>
              <li>
                • <strong>Include GPA</strong> only if 3.5+ or required by industry
              </li>
              <li>
                • <strong>Relevant coursework</strong> matters most for recent grads
              </li>
              <li>
                • <strong>Thesis topic</strong> shows research depth for academic/research roles
              </li>
              <li>
                • <strong>Honors & awards</strong> differentiate you from other candidates
              </li>
              <li>
                • <strong>Class rank</strong> provides context for your GPA
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Education;
