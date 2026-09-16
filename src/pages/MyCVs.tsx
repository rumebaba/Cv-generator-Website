import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';
import { getUserCVs } from '../services/submitClient';

const MyCVs: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [cvs, setCVs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!user) {
      navigate('/');
      return;
    }

    setLoading(true);
    getUserCVs(user.uid)
      .then((cvs) => {
        setCVs(cvs);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching CVs:', err);
        setError('Failed to load your CVs');
        setLoading(false);
      });
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <Card padding="lg" className="text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm text-slate-600 dark:text-slate-400">Checking authentication...</p>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Card padding="lg" className="text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm text-slate-600 dark:text-slate-400">Loading your CVs...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card padding="lg" className="text-center text-red-500">
        <p className="text-lg font-medium">Failed to load your CVs</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
        <Button variant="outline" onClick={() => setError(null)}>
          Retry
        </Button>
      </Card>
    );
  }

  // Separate drafts and completed CVs
  const drafts = cvs.filter((cv) => cv.isDraft);
  const completed = cvs.filter((cv) => !cv.isDraft);
  const allEmpty = drafts.length === 0 && completed.length === 0;

  if (allEmpty) {
    return (
      <Card padding="lg" className="text-center">
        <p className="text-slate-500 dark:text-slate-400">No CVs generated yet</p>
        <Button variant="outline" onClick={() => navigate('/form/step/1')}>
          Create your first CV
        </Button>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">My CVs</h2>
      {drafts.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Drafts ({drafts.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {drafts.map((cv) => {
              const template = cv.template || 'classic';
              const createdAt = cv.createdAt?.toDate
                ? cv.createdAt.toDate()
                : new Date(cv.createdAt?.seconds * 1000 || Date.now());
              const formattedDate = createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'day',
              });

              return (
                <Card key={cv.id} className="hover:shadow-lg hover:transition-shadow border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-start p-4">
                    <div className="flex-shrink-0">
                      <Card padding="sm" className="bg-indigo-50 dark:bg-indigo-900/30">
                        <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">DRAFT</span>
                      </Card>
                    </div>
                    <div className="flex-1 px-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {cv.personalData?.fullName || 'Unknown'}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {cv.personalData?.email}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Last edited: {formattedDate}
                      </p>
                    </div>
                    <div className="flex justify-end pt-2 gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/form/step/1?resume=${cv.id}`)}
                      >
                        Continue Editing
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
      {completed.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-400 flex items-center gap-2">
            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Completed CVs ({completed.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {completed.map((cv) => {
              const pdfUrl = cv.pdfUrl;
              const template = cv.template || 'classic';
              const createdAt = cv.createdAt?.toDate
                ? cv.createdAt.toDate()
                : new Date(cv.createdAt?.seconds * 1000 || Date.now());
              const formattedDate = createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'day',
              });

              return (
                <Card key={cv.id} className="hover:shadow-lg hover:transition-shadow">
                  <div className="flex items-start p-4">
                    <div className="flex-shrink-0">
                      <Card padding="sm" className="bg-slate-50 dark:bg-slate-800">
                        {cv.template === 'executive' ? (
                          <div className="text-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              {cv.personalData?.fullName}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {cv.personalData?.email}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <img
                              src={cv.pdfUrl}
                              alt={cv.personalData?.fullName}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          </div>
                        )}
                      </Card>
                    </div>
                    <div className="flex-1 px-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {cv.personalData?.fullName || 'Unknown'}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {cv.personalData?.email}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{formattedDate}</p>
                    </div>
                    <div className="flex justify-end pt-2 gap-2">
                      <a href={cv.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" size="sm">
                          Download PDF
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};

export default MyCVs;
