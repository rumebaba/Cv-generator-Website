import React, { createContext, useContext, useState } from 'react';

export type TemplateId = 'classic' | 'modern' | 'minimal';

interface TemplateContextValue {
  selectedTemplate: TemplateId;
  setSelectedTemplate: (id: TemplateId) => void;
}

const TemplateContext = createContext<TemplateContextValue | null>(null);

export const TemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(
    () => (localStorage.getItem('cv-template') as TemplateId) || 'classic'
  );

  const handleSetTemplate = (id: TemplateId) => {
    setSelectedTemplate(id);
    localStorage.setItem('cv-template', id);
  };

  return (
    <TemplateContext.Provider value={{ selectedTemplate, setSelectedTemplate: handleSetTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = (): TemplateContextValue => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};
