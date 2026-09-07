import React from 'react';
import { Link } from 'react-router-dom';

const PolicyPage: React.FC<{ title: string; sections: { heading: string; content: string }[] }> = ({ title, sections }) => (
  <div className="min-h-screen bg-slate-50 pt-24 pb-16 dark:bg-slate-950">
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{section.heading}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">{section.content}</p>
          </div>
        ))}
      </div>
      <Link to="/" className="mt-8 inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
    </div>
  </div>
);

export const PrivacyPage: React.FC = () => (
  <PolicyPage
    title="Privacy Policy"
    sections={[
      { heading: 'Information We Collect', content: 'We collect information you provide directly, such as your name, email, and CV data. We do not sell your personal information to third parties.' },
      { heading: 'How We Use Your Information', content: 'We use your information to provide and improve our services, generate your CV, and communicate with you about your account.' },
      { heading: 'Data Storage', content: 'Your CV data is stored securely in Firebase. PDFs are stored in Firebase Storage. You can delete your data at any time by contacting us.' },
      { heading: 'Cookies', content: 'We use essential cookies to maintain your session and preferences. We do not use tracking cookies.' },
      { heading: 'Contact', content: 'For privacy-related inquiries, please contact us through our contact page.' },
    ]}
  />
);

export const TermsPage: React.FC = () => (
  <PolicyPage
    title="Terms of Service"
    sections={[
      { heading: 'Acceptance of Terms', content: 'By using CV Generator, you agree to these terms of service. If you do not agree, please do not use our service.' },
      { heading: 'Use of Service', content: 'You may use CV Generator to create, edit, and export CVs for personal and professional use. You may not use the service for any illegal purpose.' },
      { heading: 'Intellectual Property', content: 'Templates and designs are owned by CV Generator. You retain full ownership of the content you create using our service.' },
      { heading: 'Limitation of Liability', content: 'CV Generator is provided "as is" without warranties. We are not liable for any damages arising from use of the service.' },
      { heading: 'Changes to Terms', content: 'We may update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.' },
    ]}
  />
);

export const CookiePolicyPage: React.FC = () => (
  <PolicyPage
    title="Cookie Policy"
    sections={[
      { heading: 'What Are Cookies', content: 'Cookies are small text files stored on your device when you visit our website.' },
      { heading: 'Essential Cookies', content: 'We use essential cookies for authentication, session management, and storing your preferences (theme, template selection, form progress).' },
      { heading: 'Third-Party Cookies', content: 'We do not use third-party tracking cookies or advertising cookies.' },
      { heading: 'Managing Cookies', content: 'You can manage cookies through your browser settings. Disabling essential cookies may affect the functionality of the service.' },
    ]}
  />
);

export default PrivacyPage;
