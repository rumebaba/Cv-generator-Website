import React, { useState } from 'react';

export const CookieConsent: React.FC = () => {
  // Read localStorage lazily during init rather than in an effect: this avoids a
  // flash of nothing on first paint and avoids a synchronous setState in an effect.
  const [visible, setVisible] = useState(() => !localStorage.getItem('cookie-consent'));

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-[90] border-t border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          We use cookies to improve your experience. By continuing, you agree to our cookie policy.
        </p>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
