import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useTemplate, type TemplateId } from '../hooks/useTemplate';

const templates = [
  {
    id: 'classic' as TemplateId,
    name: 'Classic',
    description: 'Traditional single-column layout. Clean, professional, ATS-friendly.',
    color: 'from-indigo-500 to-purple-600',
    features: ['Single column', 'ATS-friendly', 'Traditional layout', 'Best for corporate roles'],
  },
  {
    id: 'modern' as TemplateId,
    name: 'Modern',
    description: 'Two-column design with dark sidebar. Bold, contemporary, stands out.',
    color: 'from-slate-700 to-slate-900',
    features: ['Two-column layout', 'Dark sidebar', 'Skills in sidebar', 'Best for creative roles'],
  },
  {
    id: 'minimal' as TemplateId,
    name: 'Minimal',
    description: 'Clean, elegant design with green accents. Focus on content over style.',
    color: 'from-emerald-500 to-teal-600',
    features: ['Clean lines', 'Green accents', 'Minimalist design', 'Best for any industry'],
  },
];

export const TemplatesPage: React.FC = () => {
  const { selectedTemplate, setSelectedTemplate } = useTemplate();

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">CV Templates</h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Choose from professionally designed templates. All templates are ATS-friendly and fully
            customizable.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              variant={selectedTemplate === template.id ? 'elevated' : 'default'}
              padding="none"
              className={`overflow-hidden transition-all ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950'
                  : 'hover:shadow-lg'
              }`}
            >
              <div className={`h-48 bg-gradient-to-br ${template.color} p-6`}>
                <div className="flex h-full flex-col justify-end text-white">
                  <h3 className="text-2xl font-bold">{template.name}</h3>
                  {selectedTemplate === template.id && (
                    <span className="mt-1 inline-flex w-fit items-center rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">
                      Selected
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <p className="mb-4 text-slate-600 dark:text-slate-400">{template.description}</p>
                <ul className="mb-6 space-y-1">
                  {template.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <svg
                        className="h-4 w-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Button
                    variant={selectedTemplate === template.id ? 'primary' : 'outline'}
                    className="flex-1"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    {selectedTemplate === template.id ? 'Selected' : 'Select Template'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/form/step/1">
            <Button size="lg" variant="primary">
              Start Building Your CV
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
