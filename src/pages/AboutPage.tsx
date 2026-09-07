import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 pt-24 pb-16 dark:bg-slate-950">
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">About CV Generator</h1>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">RH</span>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Rumman Hamid</h2>
            <p className="text-indigo-600 dark:text-indigo-400">Creator &amp; Developer</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">BSCS Graduate</p>
          </div>
        </div>
      </div>

      <div className="prose prose-slate mt-10 max-w-none dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">About This Project</h2>
        <p className="text-slate-600 dark:text-slate-400">
          CV Generator was built by Rumman Hamid as a passion project to help job seekers create professional, ATS-friendly resumes in minutes. The platform combines modern design templates with an intuitive step-by-step builder.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What It Offers</h2>
        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
          <li>Professional, ATS-friendly templates</li>
          <li>Step-by-step guided builder</li>
          <li>PDF and DOCX export</li>
          <li>Smart content suggestions</li>
          <li>Dark mode support</li>
          <li>Free to use</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tech Stack</h2>
        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
          <li>React + TypeScript</li>
          <li>Vite</li>
          <li>Tailwind CSS</li>
          <li>Firebase (Auth, Firestore, Storage)</li>
          <li>react-pdf for PDF generation</li>
          <li>docx for DOCX export</li>
          <li>TipTap rich text editor</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ownership</h2>
        <p className="text-slate-600 dark:text-slate-400">
          This website is created and owned by <strong className="text-slate-900 dark:text-white">Rumman Hamid</strong>. All rights reserved.未经授权，禁止复制或分发本项目的任何部分。
        </p>
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
