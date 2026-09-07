import React from 'react';
import { Link } from 'react-router-dom';

export const FeaturesPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 pt-24 pb-16 dark:bg-slate-950">
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Features</h1>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">Everything you need to build the perfect CV.</p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Professional Templates', desc: 'Choose from multiple ATS-friendly templates designed by professionals.' },
          { title: 'Step-by-Step Builder', desc: 'Guided 9-step process ensures you never miss important information.' },
          { title: 'PDF Export', desc: 'Download your CV as a high-quality, print-ready PDF file.' },
          { title: 'DOCX Export', desc: 'Export to Word format for easy editing and sharing.' },
          { title: 'AI Suggestions', desc: 'Get smart suggestions for your professional summary and experience.' },
          { title: 'Dark Mode', desc: 'Easy on the eyes with full dark mode support.' },
          { title: 'Auto-Save', desc: 'Your progress is automatically saved. Never lose your work.' },
          { title: 'Mobile Friendly', desc: 'Build your CV on any device, anywhere.' },
          { title: 'Rich Text Editor', desc: 'Format your descriptions with bold, italic, lists, and more.' },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
      <Link to="/" className="mt-12 inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
    </div>
  </div>
);

export default FeaturesPage;
