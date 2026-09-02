import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Layout } from '../components/layout/Layout';
import { FormLayout } from '../components/layout/Layout';
import { AdminPage } from '../pages/AdminPage';
import { FormPage } from '../pages/FormPage';
import { LandingPage } from '../pages/LandingPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/form/*" element={<FormLayout />}>
          <Route path="step/:step" element={<FormPage />} />
          <Route index element={<Navigate to="/form/step/1" replace />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
