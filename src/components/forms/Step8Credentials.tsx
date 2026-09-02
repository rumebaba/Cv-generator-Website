import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useForm } from '../../hooks/useForm';
import type { Credential } from '../../types/form';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../common/Card';
import { Input, Textarea } from '../common/Input';

const initialCredential: Credential = {
  id: '',
  certificateName: '',
  issuer: '',
  dateIssued: '',
  credentialId: '',
  expirationDate: '',
  volunteerWork: '',
  hobbies: '',
  militaryService: '',
  references: '',
  securityClearance: '',
};

export const Step8Credentials: React.FC = () => {
  const {
    data: { credentials },
    addCredential,
    updateCredential,
    removeCredential,
    clearError,
    errors,
  } = useForm();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Credential>(initialCredential);
  const [showForm, setShowForm] = useState(false);

  const credentialErrors = errors.credentials || {};

  const handleInputChange = (field: keyof Credential, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (editingId) {
      clearError('credentials', field);
    }
  };

  const handleDateChange = (field: 'dateIssued' | 'expirationDate', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (editingId) {
      clearError('credentials', field);
    }
  };

  const resetForm = () => {
    setFormData(initialCredential);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCredential(editingId, formData);
    } else {
      addCredential({ ...formData, id: uuidv4() });
    }
    resetForm();
  };

  const handleEdit = (cred: Credential) => {
    setFormData(cred);
    setEditingId(cred.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this credential entry?')) {
      removeCredential(id);
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
          title="Credentials & Extras"
          subtitle="Certificates, volunteer work, hobbies, military service, references, and security clearance."
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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Certificate Name *"
                    value={formData.certificateName}
                    onChange={(e) => handleInputChange('certificateName', e.target.value)}
                    error={credentialErrors.certificateName}
                    placeholder="AWS Certified Solutions Architect - Professional"
                    required
                  />
                  <Input
                    label="Issuer *"
                    value={formData.issuer}
                    onChange={(e) => handleInputChange('issuer', e.target.value)}
                    error={credentialErrors.issuer}
                    placeholder="Amazon Web Services"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Date Issued *"
                    type="month"
                    value={formData.dateIssued}
                    onChange={(e) => handleDateChange('dateIssued', e.target.value)}
                    error={credentialErrors.dateIssued}
                    required
                    max={new Date().toISOString().slice(0, 7)}
                  />
                  <Input
                    label="Expiration Date"
                    type="month"
                    value={formData.expirationDate}
                    onChange={(e) => handleDateChange('expirationDate', e.target.value)}
                    max={new Date().toISOString().slice(0, 7)}
                    placeholder="Optional"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Credential ID"
                    value={formData.credentialId}
                    onChange={(e) => handleInputChange('credentialId', e.target.value)}
                    placeholder="AWS-SA-PRO-12345678"
                    helperText="Certificate/credential number if applicable"
                  />
                  <Input
                    label="Security Clearance"
                    value={formData.securityClearance}
                    onChange={(e) => handleInputChange('securityClearance', e.target.value)}
                    placeholder="Top Secret / SCI, Secret, Public Trust, None"
                    helperText="Government security clearance level"
                  />
                </div>

                <Textarea
                  label="Volunteer Work"
                  value={formData.volunteerWork}
                  onChange={(e) => handleInputChange('volunteerWork', e.target.value)}
                  placeholder="Habitat for Humanity - Volunteer Builder (2020-Present), 50+ hours/year
Code for America - Technical Mentor (2021-2022)
Local Food Bank - Board Member (2019-2021)"
                  rows={4}
                  maxLength={2000}
                  helperText="Organization, role, dates, and impact"
                />

                <Textarea
                  label="Hobbies & Interests"
                  value={formData.hobbies}
                  onChange={(e) => handleInputChange('hobbies', e.target.value)}
                  placeholder="Marathon Running (3:45 PR), Landscape Photography, Open Source Contribution, Chess (1800 rating), Hiking, Cooking"
                  rows={3}
                  maxLength={1000}
                  helperText="Personal interests that show personality and soft skills"
                />

                <Textarea
                  label="Military Service"
                  value={formData.militaryService}
                  onChange={(e) => handleInputChange('militaryService', e.target.value)}
                  placeholder="US Army - Captain (2015-2020), Logistics Officer, Afghanistan Deployment (2017-2018), Honorable Discharge"
                  rows={3}
                  maxLength={1000}
                  helperText="Branch, rank, dates, role, deployments, discharge status"
                />

                <Textarea
                  label="Professional References"
                  value={formData.references}
                  onChange={(e) => handleInputChange('references', e.target.value)}
                  placeholder="1. Dr. Jane Smith - Former Supervisor, Mayo Clinic - jane.smith@mayo.edu - (555) 123-4567
2. Prof. Robert Johnson - Academic Advisor, Stanford University - r.johnson@stanford.edu - (555) 987-6543
3. Michael Chen - Senior Engineering Manager, Google - mchen@google.com - (555) 246-8135"
                  rows={5}
                  maxLength={2000}
                  helperText="Name, title, organization, email, phone - 3 references recommended"
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
                    {editingId ? 'Update Credential' : 'Add Credential'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {credentials.length === 0 && !showForm ? (
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">
                No credential entries yet
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-500">
                Add certificates, volunteer work, hobbies, and references
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
                Add Credential
              </Button>
            </div>
          ) : (
            <>
              {credentials.map((cred) => (
                <Card key={cred.id} variant="outlined" padding="md" className="animate-fade-in">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
                        {cred.certificateName}
                      </h4>
                      <p className="font-medium text-indigo-600 dark:text-indigo-400">
                        {cred.issuer}
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
                          {cred.dateIssued &&
                            `${new Date(cred.dateIssued + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                          {cred.expirationDate
                            ? ` - Exp: ${new Date(cred.expirationDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                            : ' - No Expiration'}
                        </span>
                        {cred.credentialId && (
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
                            {cred.credentialId}
                          </span>
                        )}
                        {cred.securityClearance && cred.securityClearance !== 'None' && (
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
                            {cred.securityClearance}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        {cred.volunteerWork && (
                          <div>
                            <strong className="text-slate-900 dark:text-white">Volunteer:</strong>
                            <p className="mt-1 whitespace-pre-line">{cred.volunteerWork}</p>
                          </div>
                        )}
                        {cred.hobbies && (
                          <div>
                            <strong className="text-slate-900 dark:text-white">Hobbies:</strong>
                            <p className="mt-1">{cred.hobbies}</p>
                          </div>
                        )}
                        {cred.militaryService && (
                          <div>
                            <strong className="text-slate-900 dark:text-white">Military:</strong>
                            <p className="mt-1 whitespace-pre-line">{cred.militaryService}</p>
                          </div>
                        )}
                        {cred.references && (
                          <div>
                            <strong className="text-slate-900 dark:text-white">References:</strong>
                            <p className="mt-1 whitespace-pre-line">{cred.references}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(cred)}
                        className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                        aria-label={`Edit ${cred.certificateName}`}
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
                        onClick={() => handleDelete(cred.id)}
                        className="text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                        aria-label={`Delete ${cred.certificateName}`}
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

              {credentials.length > 0 && !showForm && (
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
                  Add Another Credential
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
              Tips for Credentials & Extras
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>
                • <strong>Certificates</strong> - Include issuer, date, ID, and expiration
              </li>
              <li>
                • <strong>Volunteer work</strong> - Shows character, leadership, community
                involvement
              </li>
              <li>
                • <strong>Hobbies</strong> - Relevant interests can spark interview conversation
              </li>
              <li>
                • <strong>Military service</strong> - Valued by many employers, highlight
                transferable skills
              </li>
              <li>
                • <strong>References</strong> - 3 professional contacts with current info
              </li>
              <li>
                • <strong>Security clearance</strong> - Critical for government/defense roles
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step8Credentials;
