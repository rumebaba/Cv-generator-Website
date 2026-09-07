import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Layout } from '../components/layout/Layout';
import { FormLayout } from '../components/layout/Layout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { TemplateProvider } from '../hooks/useTemplate';
import { AboutPage } from '../pages/AboutPage';
import { AdminPage } from '../pages/AdminPage';
import { ContactPage } from '../pages/ContactPage';
import { FeaturesPage } from '../pages/FeaturesPage';
import { FormPage } from '../pages/FormPage';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PortfolioPage } from '../pages/PortfolioPage';
import { PricingPage } from '../pages/PricingPage';
import { PrivacyPage, TermsPage, CookiePolicyPage } from '../pages/PolicyPages';
import { TemplatesPage } from '../pages/TemplatesPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/templates" element={<TemplateProvider><TemplatesPage /></TemplateProvider>} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="/form/*" element={<FormLayout />}>
          <Route path="step/:step" element={<FormPage />} />
          <Route index element={<Navigate to="/form/step/1" replace />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
