import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useForm } from '../../hooks/useForm';
import type { Project } from '../../types/form';
import { Button } from '../common/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../common/Card';
import { Input, Textarea } from '../common/Input';

const initialProject: Project = {
  id: '',
  name: '',
  role: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  codeRepositoryUrl: '',
  liveDemoUrl: '',
  technicalArchitecture: '',
};

export const Step6Projects: React.FC = () => {
  const {
    data: { projects },
    addProject,
    updateProject,
    removeProject,
    clearError,
    errors,
  } = useForm();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Project>(initialProject);
  const [showForm, setShowForm] = useState(false);

  const projectErrors = errors.projects || {};

  const handleInputChange = (field: keyof Project, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (editingId) {
      clearError('projects', field);
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (editingId) {
      clearError('projects', field);
    }
  };

  const handleCurrentChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, current: checked, endDate: checked ? '' : prev.endDate }));
  };

  const resetForm = () => {
    setFormData(initialProject);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProject(editingId, formData);
    } else {
      addProject({ ...formData, id: uuidv4() });
    }
    resetForm();
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      removeProject(id);
    }
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <Card variant="default" padding="lg">
        <CardHeader
          title="Projects"
          subtitle="Showcase your technical projects with repository links, live demos, and architecture details."
          action={
            !showForm && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddNew}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                }
              >
                Add Project
              </Button>
            )
          }
        />
        <CardContent className="space-y-4">
          {showForm && (
            <Card variant="outlined" padding="lg" className="animate-slide-in">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Project Name *"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={projectErrors.name}
                    placeholder="E-Commerce Platform"
                    required
                  />
                  <Input
                    label="Your Role *"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    error={projectErrors.role}
                    placeholder="Full Stack Developer / Tech Lead"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Start Date *"
                    type="month"
                    value={formData.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    error={projectErrors.startDate}
                    required
                    max={new Date().toISOString().slice(0, 7)}
                  />
                  <Input
                    label="End Date"
                    type="month"
                    value={formData.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    disabled={formData.current}
                    max={new Date().toISOString().slice(0, 7)}
                    placeholder={formData.current ? 'Present' : ''}
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex w-full cursor-pointer items-center gap-2 md:w-auto">
                    <input
                      type="checkbox"
                      checked={formData.current}
                      onChange={(e) => handleCurrentChange(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Currently Active
                    </span>
                  </label>
                </div>

                <Textarea
                  label="Project Description *"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  error={projectErrors.description}
                  placeholder="Built a scalable e-commerce platform handling 10K+ daily transactions. Implemented microservices architecture with event-driven communication. Integrated payment gateways, inventory management, and real-time analytics dashboard."
                  rows={4}
                  maxLength={2000}
                  required
                  helperText="Describe the project scope, your contributions, and key outcomes"
                />

                <Textarea
                  label="Technical Architecture"
                  value={formData.technicalArchitecture}
                  onChange={(e) => handleInputChange('technicalArchitecture', e.target.value)}
                  placeholder="Frontend: React, TypeScript, Next.js, Tailwind CSS, Redux Toolkit
Backend: Node.js, NestJS, PostgreSQL, Redis, RabbitMQ
Infrastructure: AWS (ECS, RDS, ElastiCache, S3), Docker, Kubernetes, GitHub Actions CI/CD
Monitoring: Datadog, ELK Stack, Prometheus/Grafana"
                  rows={5}
                  maxLength={2000}
                  helperText="Detail the tech stack, architecture patterns, infrastructure, and tools used"
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Code Repository URL"
                    value={formData.codeRepositoryUrl}
                    onChange={(e) => handleInputChange('codeRepositoryUrl', e.target.value)}
                    placeholder="https://github.com/username/project-repo"
                    type="url"
                    helperText="GitHub, GitLab, or Bitbucket repository link"
                  />
                  <Input
                    label="Live Demo URL"
                    value={formData.liveDemoUrl}
                    onChange={(e) => handleInputChange('liveDemoUrl', e.target.value)}
                    placeholder="https://project-demo.example.com"
                    type="url"
                    helperText="Deployed application or demo link"
                  />
                </div>

                <CardFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    rightIcon={
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    }
                  >
                    {editingId ? 'Update Project' : 'Add Project'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {projects.length === 0 && !showForm ? (
            <div className="rounded-xl border-2 border-dashed border-slate-300 py-12 text-center dark:border-slate-600">
              <svg
                className="mx-auto h-16 w-16 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10 20l4-16m4 16l4-16M6 9l14 1M6 15l14 1M6 21l14 1"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">
                No projects yet
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-500">
                Showcase your technical projects and portfolio work
              </p>
              <Button
                variant="primary"
                className="mt-6"
                onClick={handleAddNew}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                }
              >
                Add Project
              </Button>
            </div>
          ) : (
            <>
              {projects.map((project) => (
                <Card key={project.id} variant="outlined" padding="md" className="animate-fade-in">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        {project.current && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </div>
                      <h4 className="mt-2 truncate text-lg font-semibold text-slate-900 dark:text-white">
                        {project.name}
                      </h4>
                      <p className="font-medium text-indigo-600 dark:text-indigo-400">
                        {project.role}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {project.startDate &&
                            `${new Date(project.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                          {project.endDate || project.current
                            ? ` - ${project.current ? 'Present' : new Date(project.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                            : ''}
                        </span>
                      </div>
                      {project.description && (
                        <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                          {project.description}
                        </p>
                      )}
                      {project.technicalArchitecture && (
                        <div className="mt-3">
                          <strong className="text-sm text-slate-900 dark:text-white">
                            Architecture:
                          </strong>
                          <p className="mt-1 line-clamp-2 text-sm whitespace-pre-line text-slate-600 dark:text-slate-400">
                            {project.technicalArchitecture}
                          </p>
                        </div>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.codeRepositoryUrl && (
                          <a
                            href={project.codeRepositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                            Code
                          </a>
                        )}
                        {project.liveDemoUrl && (
                          <a
                            href={project.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(project)}
                        className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                        aria-label={`Edit ${project.name}`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                        aria-label={`Delete ${project.name}`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10M7 7h10"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {projects.length > 0 && !showForm && (
                <Button
                  variant="outline"
                  onClick={handleAddNew}
                  leftIcon={
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  }
                >
                  Add Another Project
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-900/20">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
            <svg
              className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-slate-900 dark:text-white">
              Tips for Projects Section
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>
                • <strong>Include live links</strong> - Deployed demos and code repos build
                credibility
              </li>
              <li>
                • <strong>Detail architecture</strong> - Show system design thinking and tech
                choices
              </li>
              <li>
                • <strong>Quantify impact</strong> - Users served, performance metrics, revenue
                generated
              </li>
              <li>
                • <strong>Highlight your role</strong> - What did YOU specifically build/lead?
              </li>
              <li>
                • <strong>Open source counts</strong> - Contributions to popular projects are
                valuable
              </li>
              <li>
                • <strong>Keep it relevant</strong> - Tailor projects to target role
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step6Projects;
