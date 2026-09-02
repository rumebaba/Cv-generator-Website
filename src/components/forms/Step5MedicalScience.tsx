import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useForm } from '../../hooks/useForm';
import type { MedicalScience } from '../../types/form';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../common/Card';
import { Textarea, Input } from '../common/Input';

const initialMedicalScience: MedicalScience = {
  id: '',
  clinicalRotations: '',
  researchGrants: '',
  publications: '',
  medicalLicenses: '',
};

export const Step5MedicalScience: React.FC = () => {
  const {
    data: { medicalScience },
    addMedicalScience,
    updateMedicalScience,
    removeMedicalScience,
    clearError,
    errors,
  } = useForm();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MedicalScience>(initialMedicalScience);
  const [showForm, setShowForm] = useState(false);

  const medicalErrors = errors.medicalScience || {};

  const handleInputChange = (field: keyof MedicalScience, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (editingId) {
      clearError('medicalScience', field);
    }
  };

  const resetForm = () => {
    setFormData(initialMedicalScience);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMedicalScience(editingId, formData);
    } else {
      addMedicalScience({ ...formData, id: uuidv4() });
    }
    resetForm();
  };

  const handleEdit = (ms: MedicalScience) => {
    setFormData(ms);
    setEditingId(ms.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this medical science entry?')) {
      removeMedicalScience(id);
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
          title="Medical and Science Background"
          subtitle="Add clinical rotations, research grants, publications, and medical licenses."
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
                Add Entry
              </Button>
            )
          }
        />
        <CardContent className="space-y-4">
          {showForm && (
            <Card variant="outlined" padding="lg" className="animate-slide-in">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Textarea
                  label="Clinical Rotations"
                  value={formData.clinicalRotations}
                  onChange={(e) => handleInputChange('clinicalRotations', e.target.value)}
                  placeholder="Internal Medicine (12 weeks), Surgery (8 weeks), Pediatrics (6 weeks), Emergency Medicine (4 weeks), Psychiatry (4 weeks), OB/GYN (6 weeks)"
                  rows={4}
                  maxLength={2000}
                  helperText="List rotations with duration and specialty"
                />

                <Textarea
                  label="Research Grants"
                  value={formData.researchGrants}
                  onChange={(e) => handleInputChange('researchGrants', e.target.value)}
                  placeholder="NIH R01 Grant - $2.5M (2020-2025), PI: Novel Biomarkers for Early Cancer Detection; NSF CAREER Award - $500K (2018-2022)"
                  rows={4}
                  maxLength={2000}
                  helperText="List grants with funding amount, dates, and role (PI/Co-PI)"
                />

                <Textarea
                  label="Publications"
                  value={formData.publications}
                  onChange={(e) => handleInputChange('publications', e.target.value)}
                  placeholder="1. Smith J, Doe A. Novel Biomarkers in Cancer Detection. Nature Medicine. 2023;29(5):1234-1245. PMID: 12345678
2. Johnson K, Williams L. Clinical Outcomes in Cardiac Surgery. JAMA. 2022;328(12):1189-1197. DOI: 10.1001/jama.2022.12345"
                  rows={6}
                  maxLength={3000}
                  helperText="List publications in standard citation format (authors, title, journal, year, PMID/DOI)"
                />

                <Textarea
                  label="Medical Licenses & Certifications"
                  value={formData.medicalLicenses}
                  onChange={(e) => handleInputChange('medicalLicenses', e.target.value)}
                  placeholder="California Medical License #A123456 (Active, Exp: 2026), DEA Registration #BS1234567 (Active), Board Certified - Internal Medicine (2019), Board Certified - Cardiology (2021)"
                  rows={4}
                  maxLength={2000}
                  helperText="List all active licenses, board certifications, and expiration dates"
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
                    {editingId ? 'Update Entry' : 'Add Entry'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {medicalScience.length === 0 && !showForm ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">
                No medical science entries yet
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-500">
                Add clinical rotations, research, publications, or licenses
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
                Add Entry
              </Button>
            </div>
          ) : (
            <>
              {medicalScience.map((ms) => (
                <Card key={ms.id} variant="outlined" padding="md" className="animate-fade-in">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
                        Medical & Science Entry
                      </h4>
                      <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        {ms.clinicalRotations && (
                          <div>
                            <strong className="text-slate-900 dark:text-white">
                              Clinical Rotations:
                            </strong>
                            <p className="mt-1 whitespace-pre-line">{ms.clinicalRotations}</p>
                          </div>
                        )}
                        {ms.researchGrants && (
                          <div>
                            <strong className="text-slate-900 dark:text-white">
                              Research Grants:
                            </strong>
                            <p className="mt-1 whitespace-pre-line">{ms.researchGrants}</p>
                          </div>
                        )}
                        {ms.publications && (
                          <div>
                            <strong className="text-slate-900 dark:text-white">
                              Publications:
                            </strong>
                            <p className="mt-1 whitespace-pre-line">{ms.publications}</p>
                          </div>
                        )}
                        {ms.medicalLicenses && (
                          <div>
                            <strong className="text-slate-900 dark:text-white">
                              Licenses & Certifications:
                            </strong>
                            <p className="mt-1 whitespace-pre-line">{ms.medicalLicenses}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(ms)}
                        className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                        aria-label="Edit medical science entry"
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
                        onClick={() => handleDelete(ms.id)}
                        className="text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                        aria-label="Delete medical science entry"
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

              {medicalScience.length > 0 && !showForm && (
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
                  Add Another Entry
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
              Tips for Medical & Science Section
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>
                • <strong>Clinical rotations</strong> - List specialty, duration, and institution
              </li>
              <li>
                • <strong>Research grants</strong> - Include funding agency, amount, dates, and your
                role
              </li>
              <li>
                • <strong>Publications</strong> - Use standard citation format with PMID/DOI
              </li>
              <li>
                • <strong>Licenses</strong> - Include state, number, status, and expiration
              </li>
              <li>
                • <strong>Board certifications</strong> - List specialty and certification year
              </li>
              <li>
                • <strong>Order by relevance</strong> - Most recent and relevant first
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5MedicalScience;
