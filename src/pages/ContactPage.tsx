import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Contact Us</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          Have questions or feedback? We'd love to hear from you.
        </p>
        {submitted ? (
          <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-900/20">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">Message sent!</h3>
            <p className="mt-2 text-green-700 dark:text-green-300">We'll get back to you as soon as possible.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="mt-8 space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
              <input type="text" required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input type="email" required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
              <textarea rows={5} required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
            </div>
            <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700">
              Send Message
            </button>
          </form>
        )}
        <Link to="/" className="mt-8 inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ContactPage;
