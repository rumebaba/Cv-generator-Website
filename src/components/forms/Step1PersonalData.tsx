import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useForm } from '../../hooks/useForm';
import type { PersonalData, SocialLink } from '../../types/form';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Input, Textarea, Select } from '../common/Input';

const countries = [
  { value: '', label: 'Select country' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IN', label: 'India' },
  { value: 'CN', label: 'China' },
  { value: 'JP', label: 'Japan' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'SE', label: 'Sweden' },
  { value: 'NO', label: 'Norway' },
  { value: 'DK', label: 'Denmark' },
  { value: 'FI', label: 'Finland' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'AE', label: 'UAE' },
  { value: 'SG', label: 'Singapore' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'OTHER', label: 'Other' },
];

const visaStatusOptions = [
  { value: '', label: 'Select visa status' },
  { value: 'citizen', label: 'Citizen' },
  { value: 'permanent_resident', label: 'Permanent Resident / Green Card' },
  { value: 'work_visa', label: 'Work Visa (H1B, L1, etc.)' },
  { value: 'student_visa', label: 'Student Visa (F1, etc.)' },
  { value: 'dependent_visa', label: 'Dependent Visa' },
  { value: 'requires_sponsorship', label: 'Requires Sponsorship' },
  { value: 'other', label: 'Other' },
];

const socialPlatforms = [
  { value: 'github', label: 'GitHub', placeholder: 'github.com/username' },
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
  { value: 'twitter', label: 'Twitter/X', placeholder: 'twitter.com/username' },
  { value: 'portfolio', label: 'Portfolio', placeholder: 'yourportfolio.com' },
  { value: 'dribbble', label: 'Dribbble', placeholder: 'dribbble.com/username' },
  { value: 'behance', label: 'Behance', placeholder: 'behance.net/username' },
  { value: 'medium', label: 'Medium', placeholder: 'medium.com/@username' },
  { value: 'youtube', label: 'YouTube', placeholder: 'youtube.com/@username' },
  { value: 'custom', label: 'Custom', placeholder: 'Enter custom label' },
];

export const Step1PersonalData: React.FC = () => {
  const {
    data: { personalData },
    setPersonalData,
    clearError,
    errors,
  } = useForm();

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    personalData.customSocialLinks || []
  );
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [newSocialLabel, setNewSocialLabel] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialPlatform, setNewSocialPlatform] = useState('custom');

  const handleSocialLinksChange = (links: SocialLink[]) => {
    setSocialLinks(links);
    setPersonalData({ customSocialLinks: links });
  };

  const addSocialLink = () => {
    if (newSocialLabel.trim() && newSocialUrl.trim()) {
      const newLink: SocialLink = {
        id: uuidv4(),
        label: newSocialLabel.trim(),
        url: newSocialUrl.trim(),
        icon: newSocialPlatform,
      };
      handleSocialLinksChange([...socialLinks, newLink]);
      setNewSocialLabel('');
      setNewSocialUrl('');
      setShowAddSocial(false);
    }
  };

  const removeSocialLink = (id: string) => {
    handleSocialLinksChange(socialLinks.filter((link) => link.id !== id));
  };

  const handleInputChange = (field: keyof PersonalData, value: string) => {
    setPersonalData({ [field]: value });
    clearError('personalData', field);
  };

  const personalErrors = errors.personalData || {};

  return (
    <div className="space-y-6">
      <Card variant="default" padding="lg">
        <CardHeader
          title="Personal Information"
          subtitle="Enter your basic contact details and personal information"
        />
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Full Name *"
              value={personalData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              error={personalErrors.fullName}
              placeholder="John Doe"
              autoComplete="name"
              required
            />
            <Input
              label="Email Address *"
              type="email"
              value={personalData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={personalErrors.email}
              placeholder="john.doe@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Phone Number"
              type="tel"
              value={personalData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              autoComplete="tel"
            />
            <Input
              label="LinkedIn Profile URL"
              value={personalData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
              autoComplete="url"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="City"
              value={personalData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="San Francisco"
              autoComplete="address-level2"
            />
            <Select
              label="Country"
              value={personalData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              options={countries}
              placeholder="Select country"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Nationality"
              value={personalData.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              placeholder="American"
            />
            <Select
              label="Visa Status"
              value={personalData.visaStatus}
              onChange={(e) => handleInputChange('visaStatus', e.target.value)}
              options={visaStatusOptions}
              placeholder="Select visa status"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Date of Birth"
              type="date"
              value={personalData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            <Input
              label="Profile Photo URL"
              value={personalData.profilePhotoUrl}
              onChange={(e) => handleInputChange('profilePhotoUrl', e.target.value)}
              placeholder="https://example.com/photo.jpg"
              autoComplete="url"
              helperText="Optional: Link to a professional headshot"
            />
          </div>
        </CardContent>
      </Card>

      <Card variant="default" padding="lg">
        <CardHeader
          title="Social Links"
          subtitle="Add your professional social media profiles and portfolio links"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddSocial(true)}
              leftIcon={
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              }
            >
              Add Social Link
            </Button>
          }
        />
        <CardContent className="space-y-4">
          {socialLinks.length === 0 && !showAddSocial ? (
            <div className="rounded-lg border-2 border-dashed border-slate-300 py-8 text-center dark:border-slate-600">
              <svg
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <p className="mt-2 text-slate-600 dark:text-slate-400">No social links added yet</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowAddSocial(true)}>
                Add Your First Link
              </Button>
            </div>
          ) : (
            <>
              {socialLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <svg
                      className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900 dark:text-white">
                      {link.label}
                    </p>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                      {link.url}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSocialLink(link.id)}
                    className="text-red-600 hover:text-red-700"
                    aria-label={`Remove ${link.label}`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                </div>
              ))}

              {showAddSocial && (
                <div className="animate-slide-in space-y-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Select
                      label="Platform"
                      value={newSocialPlatform}
                      onChange={(e) => setNewSocialPlatform(e.target.value)}
                      options={socialPlatforms}
                      placeholder="Select platform"
                    />
                    <Input
                      label="Custom Label"
                      value={newSocialLabel}
                      onChange={(e) => setNewSocialLabel(e.target.value)}
                      placeholder="e.g., My Blog"
                      disabled={newSocialPlatform !== 'custom'}
                    />
                    <Input
                      label="URL"
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      placeholder="https://..."
                      type="url"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowAddSocial(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={addSocialLink}>
                      Add Link
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Step1PersonalData;
