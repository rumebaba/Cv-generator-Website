import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 pt-24 pb-16 dark:bg-slate-950">
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">About CV Generator</h1>
      <div className="prose prose-slate mt-8 max-w-none dark:prose-invert">
        <p className="text-lg text-slate-600 dark:text-slate-400">
          CV Generator was built to help job seekers create professional, ATS-friendly resumes in minutes. Our platform combines modern design templates with an intuitive step-by-step builder.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
        <p className="text-slate-600 dark:text-slate-400">
          We believe everyone deserves a great resume. Our tools make it easy to showcase your skills and experience in the best possible light.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What We Offer</h2>
        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
          <li>Professional, ATS-friendly templates</li>
          <li>Step-by-step guided builder</li>
          <li>PDF and DOCX export</li>
          <li>AI-powered suggestions</li>
          <li>Free to use</li>
        </ul>
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

export default AboutPage;
