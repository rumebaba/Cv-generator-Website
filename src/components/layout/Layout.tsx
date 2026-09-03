import type { ReactNode } from 'react';
import React from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16 pb-8" id="main-content">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export const FormLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16 pb-8" id="main-content">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          {children || <Outlet />}
        </div>
      </main>
      <Footer />
    </div>
  );
};
