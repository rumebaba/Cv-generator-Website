import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useForm } from '../../hooks/useForm';
import { scrollToRef } from '../../lib/scroll';
import type { Language } from '../../types/form';
import { initialLanguage } from '../../types/form';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../common/Card';
import { Input } from '../common/Input';

const PROFICIENCY_LEVELS: { value: Language['proficiency']; label: string }[] = [
  { value: 'native', label: 'Native' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'basic', label: 'Basic' },
];

const emptyLanguage: Language = initialLanguage;

const proficiencyLabel = (value: Language['proficiency']) =>
  PROFICIENCY_LEVELS.find((level) => level.value === value)?.label ?? value;

export const Step11Languages: React.FC = () => {
  const {
    data: { languages },
    addLanguage,
    updateLanguage,
    removeLanguage,
    errors,
  } = useForm();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Language>(emptyLanguage);
  const [showForm, setShowForm] = useState(false);
  const formCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showForm) return;
    formCardRef.current
      ?.querySelector<HTMLInputElement>('form input:not([disabled])')
      ?.focus({ preventScroll: true });
    scrollToRef(formCardRef);
  }, [showForm, editingId]);

  const languageErrors = errors.languages || {};

  const handleInputChange = (field: keyof Language, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }) as Language);
  };

  const resetForm = () => {
    setFormData(emptyLanguage);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateLanguage(editingId, formData);
    } else {
      addLanguage({ ...formData, id: uuidv4() });
    }
    resetForm();
  };

  const handleEdit = (language: Language) => {
    setFormData(language);
    setEditingId(language.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this language?')) {
      removeLanguage(id);
    }
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="space-y-6" ref={formCardRef}>
      <Card variant="default" padding="lg">
        <CardHeader
          title="Languages"
          subtitle="Add the languages you speak and your proficiency level in each. This step is optional."
          action={
            !showForm && (
              <Button variant="primary" size="sm" onClick={handleAddNew}>
                Add Language
              </Button>
            )
          }
        />
        <CardContent className="space-y-4">
          {showForm && (
            <Card variant="outlined" padding="lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Language *"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={languageErrors.name}
                    placeholder="English"
                    required
                  />
                  <div>
                    <label
                      htmlFor="language-proficiency"
                      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Proficiency *
                    </label>
                    <select
                      id="language-proficiency"
                      value={formData.proficiency}
                      onChange={(e) =>
                        handleInputChange('proficiency', e.target.value as Language['proficiency'])
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    >
                      {PROFICIENCY_LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                    {languageErrors.proficiency && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {languageErrors.proficiency}
                      </p>
                    )}
                  </div>
                </div>

                <CardFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingId ? 'Update Language' : 'Add Language'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {languages.length === 0 && !showForm ? (
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
                  d="M3 5h18M3 12h18M3 19h18M8 5v14"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">
                No languages added yet
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-500">
                This step is optional. Adding languages helps for global and remote roles
              </p>
              <Button variant="primary" className="mt-6" onClick={handleAddNew}>
                Add First Language
              </Button>
            </div>
          ) : (
            <>
              {languages.map((lang) => (
                <Card key={lang.id} variant="outlined" padding="md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                        <span className="text-xl font-bold text-indigo-600 uppercase dark:text-indigo-400">
                          {lang.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
                          {lang.name}
                        </h4>
                        <p className="font-medium text-indigo-600 dark:text-indigo-400">
                          {proficiencyLabel(lang.proficiency)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(lang)}
                        aria-label={`Edit ${lang.name}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(lang.id)}
                        aria-label={`Delete ${lang.name}`}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {languages.length > 0 && !showForm && (
                <Button variant="outline" onClick={handleAddNew}>
                  Add Another Language
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-900/20">
        <h4 className="font-medium text-slate-900 dark:text-white">Tips for Languages</h4>
        <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <li>
            • <strong>Be accurate</strong> - Overstating proficiency is easy for an interviewer to
            probe
          </li>
          <li>
            • <strong>Include your native language</strong> - Common in many regions and expected on
            local applications
          </li>
          <li>
            • <strong>Separate step from skills</strong> - This step is for spoken languages; the
            Skills step holds technical skills and any free-text language notes
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Step11Languages;
