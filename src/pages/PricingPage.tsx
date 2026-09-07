import React from 'react';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 pt-24 pb-16 dark:bg-slate-950">
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Currently Free
        </span>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">Simple, Transparent Pricing</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          Everything is free right now. Build unlimited CVs at no cost.
        </p>
      </div>

      {/* Current: Everything Free */}
      <div className="mx-auto mt-12 max-w-2xl">
        <div className="rounded-2xl border-2 border-indigo-500 bg-white p-8 shadow-xl dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Plan</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Everything included, no limits</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              '3 professional CV templates',
              'PDF export',
              'DOCX export',
              'Step-by-step builder (9 steps)',
              'Smart content suggestions',
              'Dark mode',
              'Auto-save progress',
              'No account required',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg className="h-4 w-4 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </div>
            ))}
          </div>

          <Link
            to="/form/step/1"
            className="mt-8 block rounded-lg bg-indigo-600 py-3 text-center font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Start Building Your CV
          </Link>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">Coming Soon</h2>
        <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
          We're working on premium features. Want early access?
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              name: 'Pro',
              price: '$9',
              period: '/month',
              features: ['Additional templates', 'Priority support', 'Custom branding', 'Cover letter builder'],
              status: 'Coming Soon',
            },
            {
              name: 'Team',
              price: '$29',
              period: '/month',
              features: ['Team collaboration', 'Shared templates', 'Analytics dashboard', 'Dedicated support'],
              status: 'Planned',
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              period: '',
              features: ['White-label solution', 'API access', 'SSO integration', 'SLA guarantee'],
              status: 'Planned',
            },
          ].map((plan) => (
            <div key={plan.name} className="rounded-2xl border border-slate-200 bg-white p-6 opacity-75 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {plan.status}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                {plan.period && <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>}
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-6 block rounded-lg border border-slate-300 py-2.5 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Get Notified
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default PricingPage;
