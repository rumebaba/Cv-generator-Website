import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useForm } from '../../hooks/useForm';
import type { Skill } from '../../types/form';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../common/Card';
import { Input, Textarea, Select } from '../common/Input';

const proficiencyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const initialSkill: Skill = {
  id: '',
  technicalSkills: '',
  softSkills: '',
  spokenLanguages: '',
  proficiencyLevel: 'beginner',
  yearsOfExperience: 0,
};

export const Step7Skills: React.FC = () => {
  const {
    data: { skills },
    addSkill,
    updateSkill,
    removeSkill,
    clearError,
    errors,
  } = useForm();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Skill>(initialSkill);
  const [showForm, setShowForm] = useState(false);

  const skillErrors = errors.skills || {};

  const handleInputChange = (field: keyof Skill, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (editingId) {
      clearError('skills', field);
    }
  };

  const handleNumberChange = (field: 'yearsOfExperience', value: string) => {
    const num = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(num)) {
      setFormData((prev) => ({ ...prev, [field]: num }));
    }
    if (editingId) {
      clearError('skills', field);
    }
  };

  const resetForm = () => {
    setFormData(initialSkill);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateSkill(editingId, formData);
    } else {
      addSkill({ ...formData, id: uuidv4() });
    }
    resetForm();
  };

  const handleEdit = (skill: Skill) => {
    setFormData(skill);
    setEditingId(skill.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill entry?')) {
      removeSkill(id);
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
          title="Skills & Competencies"
          subtitle="Add technical skills, soft skills, spoken languages with proficiency levels and years of experience."
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
                Add Skill Entry
              </Button>
            )
          }
        />
        <CardContent className="space-y-4">
          {showForm && (
            <Card variant="outlined" padding="lg" className="animate-slide-in">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Textarea
                  label="Technical Skills *"
                  value={formData.technicalSkills}
                  onChange={(e) => handleInputChange('technicalSkills', e.target.value)}
                  error={skillErrors.technicalSkills}
                  placeholder="React, TypeScript, Node.js, Python, PostgreSQL, AWS, Docker, Kubernetes, GraphQL, Jest, Git, CI/CD, Microservices, Redis, RabbitMQ"
                  rows={3}
                  maxLength={2000}
                  required
                  helperText="Comma-separated list of technical skills, languages, frameworks, tools"
                />

                <Textarea
                  label="Soft Skills"
                  value={formData.softSkills}
                  onChange={(e) => handleInputChange('softSkills', e.target.value)}
                  placeholder="Leadership, Communication, Problem Solving, Team Collaboration, Mentoring, Agile/Scrum, Time Management, Adaptability"
                  rows={3}
                  maxLength={1000}
                  helperText="Comma-separated list of soft skills and competencies"
                />

                <Textarea
                  label="Spoken Languages"
                  value={formData.spokenLanguages}
                  onChange={(e) => handleInputChange('spokenLanguages', e.target.value)}
                  placeholder="English (Native), Spanish (Fluent), French (Conversational), Mandarin (Basic)"
                  rows={2}
                  maxLength={500}
                  helperText="List languages with proficiency in parentheses"
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Select
                    label="Overall Proficiency Level *"
                    value={formData.proficiencyLevel}
                    onChange={(e) => handleInputChange('proficiencyLevel', e.target.value)}
                    options={proficiencyLevels}
                    placeholder="Select proficiency level"
                    required
                  />
                  <Input
                    label="Years of Experience *"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => handleNumberChange('yearsOfExperience', e.target.value)}
                    error={skillErrors.yearsOfExperience}
                    placeholder="5"
                    min="0"
                    max="50"
                    required
                    helperText="Total years of professional experience"
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
                    {editingId ? 'Update Skill Entry' : 'Add Skill Entry'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {skills.length === 0 && !showForm ? (
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">
                No skill entries yet
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-500">
                Add your technical skills, soft skills, and languages
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
                Add Skill Entry
              </Button>
            </div>
          ) : (
            <>
              {skills.map((skill) => (
                <Card key={skill.id} variant="outlined" padding="md" className="animate-fade-in">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                          {proficiencyLevels.find((p) => p.value === skill.proficiencyLevel)
                            ?.label || skill.proficiencyLevel}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {skill.yearsOfExperience} years exp
                        </span>
                      </div>
                      {skill.technicalSkills && (
                        <div className="mt-3">
                          <strong className="text-sm text-slate-900 dark:text-white">
                            Technical:
                          </strong>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {skill.technicalSkills}
                          </p>
                        </div>
                      )}
                      {skill.softSkills && (
                        <div className="mt-2">
                          <strong className="text-sm text-slate-900 dark:text-white">
                            Soft Skills:
                          </strong>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {skill.softSkills}
                          </p>
                        </div>
                      )}
                      {skill.spokenLanguages && (
                        <div className="mt-2">
                          <strong className="text-sm text-slate-900 dark:text-white">
                            Languages:
                          </strong>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {skill.spokenLanguages}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(skill)}
                        className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                        aria-label="Edit skill entry"
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
                        onClick={() => handleDelete(skill.id)}
                        className="text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                        aria-label="Delete skill entry"
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

              {skills.length > 0 && !showForm && (
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
                  Add Another Skill Entry
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
            <h4 className="font-medium text-slate-900 dark:text-white">Tips for Skills Section</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>
                • <strong>Group by category</strong> - Frontend, Backend, DevOps, Data, etc.
              </li>
              <li>
                • <strong>Be honest about proficiency</strong> - Interviewers will test you
              </li>
              <li>
                • <strong>Include years</strong> - Helps calibrate your experience level
              </li>
              <li>
                • <strong>Soft skills matter</strong> - Leadership, communication, problem-solving
              </li>
              <li>
                • <strong>Languages</strong> - Valuable for global/remote roles
              </li>
              <li>
                • <strong>ATS keywords</strong> - Match job description terminology
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step7Skills;
