import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useForm } from '../../hooks/useForm';
import { scrollToRef } from '../../lib/scroll';
import type { Certification } from '../../types/form';
import { initialCertification } from '../../types/form';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../common/Card';
import { Input } from '../common/Input';

const emptyCertification: Certification = initialCertification;

const formatMonth = (value: string) =>
  value
    ? new Date(value + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';

export const Step10Certifications: React.FC = () => {
  const {
    data: { certifications },
    addCertification,
    updateCertification,
    removeCertification,
    errors,
  } = useForm();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Certification>(emptyCertification);
  const [showForm, setShowForm] = useState(false);
  const formCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showForm) return;
    formCardRef.current
      ?.querySelector<HTMLInputElement>('form input:not([disabled])')
      ?.focus({ preventScroll: true });
    scrollToRef(formCardRef);
  }, [showForm, editingId]);

  const certificationErrors = errors.certifications || {};

  const handleInputChange = (field: keyof Certification, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(emptyCertification);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCertification(editingId, formData);
    } else {
      addCertification({ ...formData, id: uuidv4() });
    }
    resetForm();
  };

  const handleEdit = (certification: Certification) => {
    setFormData(certification);
    setEditingId(certification.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      removeCertification(id);
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
          title="Certifications"
          subtitle="Add professional certifications and licensures, including the issuing body and a verification link."
          action={
            !showForm && (
              <Button variant="primary" size="sm" onClick={handleAddNew}>
                Add Certification
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
                    label="Certification Name *"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={certificationErrors.name}
                    placeholder="AWS Certified Solutions Architect - Professional"
                    required
                  />
                  <Input
                    label="Issuing Organization *"
                    value={formData.issuer}
                    onChange={(e) => handleInputChange('issuer', e.target.value)}
                    error={certificationErrors.issuer}
                    placeholder="Amazon Web Services"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Issue Date *"
                    type="month"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                    error={certificationErrors.issueDate}
                    required
                    max={new Date().toISOString().slice(0, 7)}
                  />
                  <Input
                    label="Expiry Date"
                    type="month"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    error={certificationErrors.expiryDate}
                    placeholder="Optional"
                    helperText="Leave blank if it never expires"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Credential ID"
                    value={formData.credentialId}
                    onChange={(e) => handleInputChange('credentialId', e.target.value)}
                    error={certificationErrors.credentialId}
                    placeholder="AWS-SA-PRO-12345678"
                    helperText="Verification or certificate number"
                  />
                  <Input
                    label="Credential URL"
                    type="url"
                    value={formData.credentialUrl}
                    onChange={(e) => handleInputChange('credentialUrl', e.target.value)}
                    error={certificationErrors.credentialUrl}
                    placeholder="https://verify.certificate.com/abc123"
                    helperText="Link an employer can use to verify"
                  />
                </div>

                <CardFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingId ? 'Update Certification' : 'Add Certification'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {certifications.length === 0 && !showForm ? (
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
                No certifications added yet
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-500">
                This step is optional. Add certifications to include a verification link
              </p>
              <Button variant="primary" className="mt-6" onClick={handleAddNew}>
                Add First Certification
              </Button>
            </div>
          ) : (
            <>
              {certifications.map((cert) => (
                <Card key={cert.id} variant="outlined" padding="md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
                        {cert.name}
                      </h4>
                      <p className="font-medium text-indigo-600 dark:text-indigo-400">
                        {cert.issuer}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        {cert.issueDate && <span>Issued: {formatMonth(cert.issueDate)}</span>}
                        <span>
                          {cert.expiryDate
                            ? `Expires: ${formatMonth(cert.expiryDate)}`
                            : 'No expiry'}
                        </span>
                        {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-sm break-all text-indigo-600 underline hover:text-indigo-700 dark:text-indigo-400"
                        >
                          {cert.credentialUrl}
                        </a>
                      )}
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(cert)}
                        aria-label={`Edit ${cert.name}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(cert.id)}
                        aria-label={`Delete ${cert.name}`}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {certifications.length > 0 && !showForm && (
                <Button variant="outline" onClick={handleAddNew}>
                  Add Another Certification
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-900/20">
        <h4 className="font-medium text-slate-900 dark:text-white">Tips for Certifications</h4>
        <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <li>
            • <strong>Include the credential URL</strong> - Lets employers verify instantly and
            signals the certification is genuine
          </li>
          <li>
            • <strong>Track expiry dates</strong> - Renew before they lapse to keep the CV accurate
          </li>
          <li>
            • <strong>Only relevant ones</strong> - List certifications tied to the roles you are
            targeting
          </li>
          <li>
            • <strong>Not the same as credentials</strong> - Use the previous step for volunteer
            work, hobbies, military service and security clearance
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Step10Certifications;
