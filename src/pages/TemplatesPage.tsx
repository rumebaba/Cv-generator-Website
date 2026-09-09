import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useTemplate, type TemplateId } from '../hooks/useTemplate';

const ClassicPreview: React.FC = () => (
  <div className="rounded-lg bg-white overflow-hidden text-[11px] leading-snug text-slate-800 shadow-inner" style={{ fontFamily: 'Georgia, serif' }}>
    <div className="bg-[#1e3a5f] p-6 text-center">
      <div className="text-[18px] font-bold text-white uppercase tracking-wider">John Smith</div>
      <div className="text-[10px] text-blue-200 italic">Developer</div>
      <div className="text-[8px] text-blue-100 mt-1">john@email.com | +1 555 0123 | New York, NY</div>
    </div>
    <div className="p-4 space-y-3">
      <div>
        <div className="mb-1 text-[10px] font-bold uppercase text-[#1e3a5f]">Professional Summary</div>
        <div className="text-[9px] text-slate-600">Experienced software engineer with 8+ years building scalable web applications and leading cross-functional teams.</div>
      </div>
      <div>
        <div className="mb-1 text-[10px] font-bold uppercase text-[#1e3a5f]">Experience</div>
        <div className="font-semibold text-[10px]">Senior Developer — Google (2020-Present)</div>
        <div className="text-[9px] text-slate-600">Led team of 5 engineers, improved performance by 40%. Architected microservices infrastructure.</div>
      </div>
      <div>
        <div className="mb-1 text-[10px] font-bold uppercase text-[#1e3a5f]">Education</div>
        <div className="font-semibold text-[10px]">BS Computer Science — MIT (2016)</div>
      </div>
    </div>
  </div>
);

const ModernPreview: React.FC = () => (
  <div className="flex overflow-hidden rounded-lg bg-slate-900 text-[11px] leading-snug text-white shadow-inner">
    <div className="w-1/3 bg-slate-800 p-3">
      <div className="mb-3 text-center text-[13px] font-bold">John Smith</div>
      <div className="mb-3 text-[8px] text-slate-400">john@email.com</div>
      <div className="mb-3">
        <div className="mb-1 text-[9px] font-bold uppercase text-indigo-400">Skills</div>
        <div className="space-y-0.5 text-[8px] text-slate-300">
          <div>React, TypeScript</div>
          <div>Node.js, Python</div>
          <div>AWS, Docker</div>
        </div>
      </div>
      <div>
        <div className="mb-1 text-[9px] font-bold uppercase text-indigo-400">Contact</div>
        <div className="text-[8px] text-slate-400">+1 555 0123</div>
        <div className="text-[8px] text-slate-400">New York, NY</div>
      </div>
    </div>
    <div className="w-2/3 p-4">
      <div className="mb-3">
        <div className="mb-1 text-[10px] font-bold uppercase text-indigo-400">Summary</div>
        <div className="text-[9px] text-slate-300">Experienced software engineer with 8+ years building scalable web applications.</div>
      </div>
      <div className="mb-3">
        <div className="mb-1 text-[10px] font-bold uppercase text-indigo-400">Experience</div>
        <div className="font-semibold text-[10px]">Senior Developer — Google</div>
        <div className="text-[8px] text-slate-400">2020-Present</div>
        <div className="text-[9px] text-slate-300">Led team of 5 engineers, improved performance by 40%.</div>
      </div>
      <div>
        <div className="mb-1 text-[10px] font-bold uppercase text-indigo-400">Education</div>
        <div className="font-semibold text-[10px]">BS Computer Science — MIT</div>
      </div>
    </div>
  </div>
);

const MinimalPreview: React.FC = () => (
  <div className="rounded-lg bg-white p-5 text-[11px] leading-snug text-slate-800 shadow-inner">
    <div className="mb-3">
      <div className="text-[15px] font-bold text-slate-900">John Smith</div>
      <div className="text-[9px] text-emerald-600">john@email.com · +1 555 0123 · New York, NY</div>
    </div>
    <div className="mb-3 border-l-2 border-emerald-500 pl-3">
      <div className="text-[10px] font-bold uppercase text-emerald-700">Summary</div>
      <div className="text-[9px] text-slate-600">Experienced software engineer with 8+ years building scalable web applications.</div>
    </div>
    <div className="mb-3 border-l-2 border-emerald-500 pl-3">
      <div className="text-[10px] font-bold uppercase text-emerald-700">Experience</div>
      <div className="font-semibold">Senior Developer — Google (2020-Present)</div>
      <div className="text-[9px] text-slate-600">Led team of 5 engineers, improved performance by 40%.</div>
    </div>
    <div className="border-l-2 border-emerald-500 pl-3">
      <div className="text-[10px] font-bold uppercase text-emerald-700">Education</div>
      <div className="font-semibold">BS Computer Science — MIT (2016)</div>
    </div>
  </div>
);

const ExecutivePreview: React.FC = () => (
  <div className="rounded-lg bg-[#1a1a2e] p-5 text-[11px] leading-snug text-white shadow-inner">
    <div className="mb-3 border-b border-[#c9a84c] pb-2 text-center">
      <div className="text-[15px] font-bold uppercase tracking-widest text-[#c9a84c]">John Smith</div>
      <div className="text-[9px] text-slate-400">Senior Executive | john@email.com | New York, NY</div>
    </div>
    <div className="mb-3">
      <div className="mb-1 text-[10px] font-bold uppercase text-[#c9a84c]">Professional Summary</div>
      <div className="text-[9px] text-slate-300">15+ years leading Fortune 500 teams and driving strategic growth initiatives across global markets.</div>
    </div>
    <div className="mb-3">
      <div className="mb-1 text-[10px] font-bold uppercase text-[#c9a84c]">Experience</div>
      <div className="font-semibold">VP of Engineering — Microsoft (2018-Present)</div>
      <div className="text-[9px] text-slate-300">Managed 200+ engineers across 3 global offices.</div>
    </div>
    <div>
      <div className="mb-1 text-[10px] font-bold uppercase text-[#c9a84c]">Education</div>
      <div className="font-semibold">MBA — Harvard Business School (2010)</div>
    </div>
  </div>
);

const CreativePreview: React.FC = () => (
  <div className="flex overflow-hidden rounded-lg text-[11px] leading-snug text-white shadow-inner">
    <div className="w-1/3 bg-[#6c3ce0] p-3">
      <div className="mb-3 text-center text-[13px] font-bold">John Smith</div>
      <div className="mb-3 text-[9px] font-bold uppercase text-[#d4c4f7]">Skills</div>
      <div className="mb-3 space-y-0.5 text-[8px] text-[#e8e0ff]">
        <div>React, TypeScript</div>
        <div>Node.js, Python</div>
      </div>
      <div className="mb-1 text-[9px] font-bold uppercase text-[#d4c4f7]">Contact</div>
      <div className="text-[8px] text-[#e8e0ff]">john@email.com</div>
      <div className="text-[8px] text-[#e8e0ff]">New York, NY</div>
    </div>
    <div className="w-2/3 bg-white p-4 text-slate-800">
      <div className="mb-3">
        <div className="mb-1 text-[10px] font-bold uppercase text-[#6c3ce0]">About Me</div>
        <div className="text-[9px] text-slate-600">Creative full-stack developer with 8+ years experience building beautiful web apps.</div>
      </div>
      <div className="mb-3">
        <div className="mb-1 text-[10px] font-bold uppercase text-[#6c3ce0]">Experience</div>
        <div className="font-semibold text-[10px]">Senior Developer — Google</div>
        <div className="text-[9px] text-slate-600">Led team of 5 engineers, improved performance by 40%.</div>
      </div>
      <div>
        <div className="mb-1 text-[10px] font-bold uppercase text-[#6c3ce0]">Education</div>
        <div className="font-semibold text-[10px]">BS Computer Science — MIT</div>
      </div>
    </div>
  </div>
);

const CompactPreview: React.FC = () => (
  <div className="rounded-lg bg-white p-4 text-[11px] leading-snug text-slate-800 shadow-inner">
    <div className="mb-2 flex items-end justify-between border-b-2 border-slate-800 pb-1">
      <div className="text-[15px] font-bold">John Smith</div>
      <div className="text-[8px] text-slate-500">john@email.com | +1 555 0123</div>
    </div>
    <div className="mb-2">
      <div className="bg-slate-100 px-1 text-[9px] font-bold uppercase text-slate-700">Experience</div>
      <div className="flex justify-between">
        <div className="font-semibold">Senior Developer — Google</div>
        <div className="text-[8px] text-slate-400">2020-Present</div>
      </div>
      <div className="text-[9px] text-slate-600">Led team of 5 engineers, improved performance by 40%.</div>
    </div>
    <div className="mb-2">
      <div className="bg-slate-100 px-1 text-[9px] font-bold uppercase text-slate-700">Education</div>
      <div className="flex justify-between">
        <div className="font-semibold">BS Computer Science — MIT</div>
        <div className="text-[8px] text-slate-400">2016</div>
      </div>
    </div>
    <div>
      <div className="bg-slate-100 px-1 text-[9px] font-bold uppercase text-slate-700">Skills</div>
      <div className="flex gap-1 text-[8px]">
        <span className="rounded bg-slate-100 px-1">React</span>
        <span className="rounded bg-slate-100 px-1">TypeScript</span>
        <span className="rounded bg-slate-100 px-1">Node.js</span>
      </div>
    </div>
  </div>
);

const previewMap: Record<TemplateId, React.FC> = {
  classic: ClassicPreview,
  modern: ModernPreview,
  minimal: MinimalPreview,
  executive: ExecutivePreview,
  creative: CreativePreview,
  compact: CompactPreview,
};

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
  {
    id: 'executive' as TemplateId,
    name: 'Executive',
    description: 'Dark navy header with gold accents. Formal and authoritative — for senior leaders.',
    color: 'from-slate-800 to-slate-900',
    features: ['Gold accents', 'Dark header', 'Professional tone', 'Best for executives & managers'],
  },
  {
    id: 'creative' as TemplateId,
    name: 'Creative',
    description: 'Two-column layout with purple sidebar. Bold, colorful, and visually striking.',
    color: 'from-purple-500 to-violet-700',
    features: ['Purple sidebar', 'Two-column layout', 'Skills in sidebar', 'Best for designers & creatives'],
  },
  {
    id: 'compact' as TemplateId,
    name: 'Compact',
    description: 'Maximum density, minimal whitespace. Fits more content on a single page.',
    color: 'from-slate-500 to-slate-700',
    features: ['Ultra-compact', 'Max content density', 'Row-based layout', 'Best for detailed CVs'],
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
          {templates.map((template) => {
            const Preview = previewMap[template.id];
            return (
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
                {/* Small header with template name */}
                <div className={`flex items-center justify-between bg-gradient-to-r ${template.color} px-5 py-3`}>
                  <h3 className="text-lg font-bold text-white">{template.name}</h3>
                  {selectedTemplate === template.id && (
                    <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                      Selected
                    </span>
                  )}
                </div>

                {/* Large template preview */}
                <div className="border-b border-slate-200 bg-slate-100 p-5 dark:border-slate-700 dark:bg-slate-800">
                  <Preview />
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
            );
          })}
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
