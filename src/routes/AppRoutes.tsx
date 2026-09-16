import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { Layout } from '../components/layout/Layout';
import { FormLayout } from '../components/layout/Layout';
import { FormProvider, useForm } from '../hooks/useForm';
import { TemplateProvider } from '../hooks/useTemplate';
import { AboutPage } from '../pages/AboutPage';
import { AdminPage } from '../pages/AdminPage';
import { ContactPage } from '../pages/ContactPage';
import { FeaturesPage } from '../pages/FeaturesPage';
import { FormPage } from '../pages/FormPage';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import MyCVs from '../pages/MyCVs';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PrivacyPage, TermsPage, CookiePolicyPage } from '../pages/PolicyPages';
import { PortfolioPage } from '../pages/PortfolioPage';
import { PricingPage } from '../pages/PricingPage';
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
        <Route
          path="/templates"
          element={
            <FormProvider>
              <TemplateProvider>
                <TemplatesPage />
              </TemplateProvider>
            </FormProvider>
          }
        />
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
        <Route path="/my-cvs" element={<MyCVs />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
