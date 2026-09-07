import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Templates', to: '/templates' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Features', to: '/features' },
    ],
    company: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
    legal: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
      { label: 'Cookie Policy', to: '/cookies' },
    ],
  };

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2" aria-label="CV Generator Home">
              <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-xl font-bold text-slate-900 dark:text-white">CV Generator</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Build professional CVs in minutes. Modern templates and easy exports.
            </p>
          </div>

          <nav aria-label="Product links">
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company links">
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal links">
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              &copy; {currentYear} Rumman Hamid. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
