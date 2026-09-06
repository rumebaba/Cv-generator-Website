import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

const showcaseItems = [
  {
    name: 'Sarah Chen',
    role: 'Senior Software Engineer',
    company: 'Google',
    template: 'Modern',
    color: 'from-blue-500 to-indigo-600',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager',
    company: 'Microsoft',
    template: 'Classic',
    color: 'from-purple-500 to-pink-600',
    skills: ['Strategy', 'Agile', 'Data Analysis', 'Leadership'],
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    company: 'Figma',
    template: 'Minimal',
    color: 'from-emerald-500 to-teal-600',
    skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
  },
  {
    name: 'David Kim',
    role: 'Data Scientist',
    company: 'Netflix',
    template: 'Modern',
    color: 'from-red-500 to-orange-600',
    skills: ['Python', 'ML', 'TensorFlow', 'SQL'],
  },
  {
    name: 'Aisha Patel',
    role: 'DevOps Engineer',
    company: 'Amazon',
    template: 'Classic',
    color: 'from-amber-500 to-yellow-600',
    skills: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
  },
  {
    name: 'James Wilson',
    role: 'Full Stack Developer',
    company: 'Stripe',
    template: 'Minimal',
    color: 'from-cyan-500 to-blue-600',
    skills: ['React', 'Go', 'PostgreSQL', 'Redis'],
  },
];

export const PortfolioPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">CV Portfolio</h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            See what others have built with our CV Generator. Real examples from real professionals.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcaseItems.map((item) => (
            <Card
              key={item.name}
              variant="default"
              padding="none"
              className="overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className={`h-32 bg-gradient-to-br ${item.color} p-6`}>
                <div className="flex h-full flex-col justify-end text-white">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-sm opacity-90">{item.role}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{item.company}</span>
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {item.template}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to Build Your CV?</h2>
          <p className="mt-3 text-lg text-indigo-100">
            Join thousands of professionals who landed their dream jobs.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/templates">
              <Button variant="secondary" size="lg">
                Browse Templates
              </Button>
            </Link>
            <Link to="/form/step/1">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50"
              >
                Start Building
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
