import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
    <div className="text-center">
      <h1 className="text-8xl font-bold text-indigo-600">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700"
      >
        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
