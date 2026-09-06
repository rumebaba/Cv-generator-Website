import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useForm } from '../../hooks/useForm';
import type { Reference } from '../../types/form';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../common/Card';
import { Input } from '../common/Input';

const initialReference: Reference = {
  id: '',
  name: '',
  title: '',
  company: '',
  email: '',
  phone: '',
  relationship: '',
};

export const Step9References: React.FC = () => {
  const {
    data: { references },
    addReference,
    updateReference,
    removeReference,
    errors,
  } = useForm();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Reference>(initialReference);
  const [showForm, setShowForm] = useState(false);

  const referenceErrors = errors.references || {};

  const handleInputChange = (field: keyof Reference, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialReference);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateReference(editingId, formData);
    } else {
      addReference({ ...formData, id: uuidv4() });
    }
    resetForm();
  };

  const handleEdit = (reference: Reference) => {
    setFormData(reference);
    setEditingId(reference.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reference?')) {
      removeReference(id);
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
          title="Professional References"
          subtitle="Add professional references who can vouch for your skills and experience. 3-5 references recommended."
          action={
            !showForm && (
              <Button variant="primary" size="sm" onClick={handleAddNew}>
                Add Reference
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
                    label="Full Name *"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={referenceErrors.name}
                    placeholder="John Smith"
                    required
                    autoComplete="name"
                  />
                  <Input
                    label="Job Title *"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    error={referenceErrors.title}
                    placeholder="Senior Engineering Manager"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Company *"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    error={referenceErrors.company}
                    placeholder="Acme Corporation"
                    required
                  />
                  <Input
                    label="Relationship *"
                    value={formData.relationship}
                    onChange={(e) => handleInputChange('relationship', e.target.value)}
                    error={referenceErrors.relationship}
                    placeholder="Former Manager"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={referenceErrors.email}
                    placeholder="john.smith@company.com"
                    required
                    autoComplete="email"
                  />
                  <Input
                    label="Phone *"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={referenceErrors.phone}
                    placeholder="+1 (555) 123-4567"
                    required
                    autoComplete="tel"
                  />
                </div>

                <CardFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingId ? 'Update Reference' : 'Add Reference'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {references.length === 0 && !showForm ? (
            <div className="rounded-xl border-2 border-dashed border-slate-300 py-12 text-center dark:border-slate-600">
              <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">
                No references added yet
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-500">
                Add 3-5 professional references who can speak to your qualifications
              </p>
              <Button variant="primary" className="mt-6" onClick={handleAddNew}>
                Add First Reference
              </Button>
            </div>
          ) : (
            <>
              {references.map((ref) => (
                <Card key={ref.id} variant="outlined" padding="md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {ref.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
                            {ref.name}
                          </h4>
                          <p className="font-medium text-indigo-600 dark:text-indigo-400">
                            {ref.title}
                          </p>
                          <p className="text-slate-600 dark:text-slate-400">{ref.company}</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">{ref.email}</div>
                        <div className="flex items-center gap-1">{ref.phone}</div>
                        <div className="flex items-center gap-1">{ref.relationship}</div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(ref)}
                        aria-label={`Edit ${ref.name}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(ref.id)}
                        aria-label={`Delete ${ref.name}`}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {references.length > 0 && !showForm && (
                <Button variant="outline" onClick={handleAddNew}>
                  Add Another Reference
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-900/20">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h4 className="font-medium text-slate-900 dark:text-white">Tips for References</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>
                • <strong>Choose wisely</strong> - Former managers, supervisors, or colleagues who
                know your work well
              </li>
              <li>
                • <strong>Ask permission</strong> - Always ask before listing someone as a reference
              </li>
              <li>
                • <strong>Provide context</strong> - Share your CV and the job description with your
                references
              </li>
              <li>
                • <strong>3-5 references</strong> - Quality over quantity; 3-5 strong references are
                ideal
              </li>
              <li>
                • <strong>Diverse perspectives</strong> - Mix of managers, peers, and
                cross-functional partners
              </li>
              <li>
                • <strong>Keep updated</strong> - Verify contact info and remind them before
                interviews
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step9References;
