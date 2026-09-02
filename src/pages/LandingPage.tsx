import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

const features = [
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    title: 'Professional Templates',
    description:
      'Choose from 20+ ATS-friendly templates designed by career experts for every industry and experience level.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    title: 'AI-Powered Suggestions',
    description:
      'Get real-time content recommendations, keyword optimization, and personalized phrasing powered by GPT-4.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
    ),
    title: 'Multi-Format Export',
    description:
      'Download your CV as PDF, Word, LaTeX, or plain text. Share a live link or embed on your portfolio.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    title: 'Privacy First',
    description:
      'Your data never leaves your browser. No account required, no tracking, no ads. Complete control over your information.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    ),
    title: 'Version Control',
    description:
      'Track changes, create multiple versions for different roles, and revert to previous drafts instantly.',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: 'Collaboration Ready',
    description:
      'Share with mentors for feedback, export for recruiters, or connect directly with job applications.',
  },
];

const stats = [
  { value: '50K+', label: 'CVs Created' },
  { value: '94%', label: 'Interview Rate' },
  { value: '20+', label: 'Templates' },
  { value: '180', label: 'Countries' },
];

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white px-4 pt-32 pb-20 sm:px-6 lg:px-8 dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-slide-up mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              New: AI-Powered Content Suggestions Now Available
            </div>

            <h1 className="animate-fade-in mb-6 text-5xl leading-tight font-bold text-slate-900 sm:text-6xl lg:text-7xl dark:text-white">
              Build a CV That Gets You
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Hired Faster
              </span>
            </h1>

            <p
              className="animate-slide-up mx-auto mb-10 max-w-3xl text-xl text-slate-600 sm:text-2xl dark:text-slate-300"
              style={{ animationDelay: '100ms' }}
            >
              Create a professional, ATS-optimized CV in minutes. No design skills needed.
              Completely free, privacy-first, and powered by AI.
            </p>

            <div
              className="animate-slide-up flex flex-col items-center justify-center gap-4 sm:flex-row"
              style={{ animationDelay: '200ms' }}
            >
              <Link to="/form/step/1">
                <Button size="xl" variant="primary" className="w-full px-10 py-4 text-lg sm:w-auto">
                  Start Building Your CV
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="w-full px-10 py-4 text-lg sm:w-auto">
                View Templates
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </Button>
            </div>

            <div
              className="animate-fade-in mt-10 flex items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400"
              style={{ animationDelay: '300ms' }}
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                GDPR compliant
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Export anytime
              </span>
            </div>
          </div>
        </div>

        {/* Floating CV Preview */}
        <div className="animate-fade-in relative mt-16" style={{ animationDelay: '400ms' }}>
          <div className="mx-auto max-w-4xl">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="p-8">
                  <div className="flex items-start gap-8">
                    <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                      <svg
                        className="h-12 w-12 text-indigo-600 dark:text-indigo-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="h-8 w-3/4 rounded-lg bg-slate-900 dark:bg-white" />
                      <div className="h-5 w-1/2 rounded bg-slate-400 dark:bg-slate-500" />
                      <div className="h-5 w-5/6 rounded bg-slate-300 dark:bg-slate-600" />
                      <div className="h-5 w-4/6 rounded bg-slate-300 dark:bg-slate-600" />
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="h-4 w-24 rounded bg-slate-900 dark:bg-white" />
                      <div className="h-4 w-32 rounded bg-slate-300 dark:bg-slate-600" />
                      <div className="h-4 w-28 rounded bg-slate-300 dark:bg-slate-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 rounded bg-slate-900 dark:bg-white" />
                      <div className="h-4 w-36 rounded bg-slate-300 dark:bg-slate-600" />
                      <div className="h-4 w-32 rounded bg-slate-300 dark:bg-slate-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-16 rounded bg-slate-900 dark:bg-white" />
                      <div className="h-4 w-40 rounded bg-slate-300 dark:bg-slate-600" />
                      <div className="h-4 w-36 rounded bg-slate-300 dark:bg-slate-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <dl className="grid grid-cols-2 gap-8 sm:gap-12 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="text-4xl font-bold text-indigo-600 sm:text-5xl dark:text-indigo-400">
                  {stat.value}
                </dt>
                <dd className="mt-2 font-medium text-slate-600 dark:text-slate-400">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl dark:text-white">
              Everything You Need to Stand Out
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Powerful features designed to help you create a winning CV that passes ATS scans and
              impresses hiring managers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="default"
                padding="lg"
                hover
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 px-4 py-24 sm:px-6 lg:px-8 dark:bg-indigo-700">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Ready to Build Your Best CV?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-indigo-100">
            Join thousands of professionals who've landed their dream jobs with our CV builder.
            Start free, upgrade anytime.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/form/step/1">
              <Button
                size="xl"
                variant="secondary"
                className="w-full bg-white px-10 py-4 text-lg text-indigo-600 hover:bg-indigo-50 sm:w-auto"
              >
                Get Started Free
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="xl"
              className="w-full border-white px-10 py-4 text-lg text-white hover:bg-indigo-500 sm:w-auto"
            >
              Watch Demo
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <p className="mb-8 text-center text-sm font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Trusted by professionals at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            <span className="text-xl font-bold text-slate-300 dark:text-slate-600">Google</span>
            <span className="text-xl font-bold text-slate-300 dark:text-slate-600">Microsoft</span>
            <span className="text-xl font-bold text-slate-300 dark:text-slate-600">Amazon</span>
            <span className="text-xl font-bold text-slate-300 dark:text-slate-600">Meta</span>
            <span className="text-xl font-bold text-slate-300 dark:text-slate-600">Apple</span>
            <span className="text-xl font-bold text-slate-300 dark:text-slate-600">Netflix</span>
            <span className="text-xl font-bold text-slate-300 dark:text-slate-600">Spotify</span>
            <span className="text-xl font-bold text-slate-300 dark:text-slate-600">Airbnb</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
