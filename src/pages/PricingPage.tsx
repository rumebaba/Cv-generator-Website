import React from 'react';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 pt-24 pb-16 dark:bg-slate-950">
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Simple, Transparent Pricing</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">Start for free. Upgrade when you need more.</p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {[
          { name: 'Free', price: '$0', period: 'forever', features: ['3 CV templates', 'PDF export', 'Basic AI suggestions', '1 CV at a time'], cta: 'Get Started', highlighted: false },
          { name: 'Pro', price: '$9', period: '/month', features: ['All templates', 'PDF + DOCX export', 'Advanced AI suggestions', 'Unlimited CVs', 'Priority support', 'Custom branding'], cta: 'Start Free Trial', highlighted: true },
          { name: 'Team', price: '$29', period: '/month', features: ['Everything in Pro', 'Team collaboration', 'ATS optimization', 'Analytics dashboard', 'Dedicated support'], cta: 'Contact Sales', highlighted: false },
        ].map((plan) => (
          <div key={plan.name} className={`rounded-2xl border p-8 ${plan.highlighted ? 'border-indigo-500 bg-white shadow-xl dark:bg-slate-900' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
              <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/form/step/1" className={`mt-8 block rounded-lg py-3 text-center font-medium transition-colors ${plan.highlighted ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PricingPage;
