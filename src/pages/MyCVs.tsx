import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { PDFPreview } from '../components/pdf/PDFPreview';
import { useAuth } from '../contexts/AuthContext';
import type { TemplateId } from '../hooks/useTemplate';
import { getUserCVs } from '../services/submitClient';
import type { SavedCV } from '../services/submitClient';
import { initialFormState } from '../types/form';

const TEMPLATE_LABELS: Record<TemplateId, string> = {
  classic: 'Classic',
  modern: 'Modern',
  minimal: 'Minimal',
  executive: 'Executive',
  creative: 'Creative',
  compact: 'Compact',
};

const formatDate = (ts: SavedCV['updatedAt']): string => {
  if (!ts) return 'Date unavailable';
  const date = new Date(ts.toMillis());
  if (!Number.isFinite(date.getTime())) return 'Date unavailable';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const SavedCVList: React.FC<{ userId: string }> = ({ userId }) => {
  const navigate = useNavigate();
  const [cvs, setCVs] = useState<SavedCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const [previewCv, setPreviewCv] = useState<SavedCV | null>(null);

  useEffect(() => {
    let cancelled = false;
    getUserCVs(userId)
      .then((result) => {
        if (!cancelled) {
          setCVs(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching CVs:', err);
        if (!cancelled) {
          setError('Failed to load your CVs. Please try again.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId, retryToken]);

  const previewFormState = useMemo(
    () => (previewCv ? { ...initialFormState, data: previewCv } : null),
    [previewCv]
  );
  const drafts = useMemo(() => cvs.filter((cv) => cv.isDraft), [cvs]);
  const completed = useMemo(() => cvs.filter((cv) => !cv.isDraft), [cvs]);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryToken((token) => token + 1);
  }, []);

  const openPreview = useCallback((cv: SavedCV) => {
    setPreviewCv(cv);
  }, []);

  const closePreview = useCallback(() => setPreviewCv(null), []);

  const handleContinueEditing = useCallback(
    (cvId: string) => {
      navigate(`/form/step/1?resume=${encodeURIComponent(cvId)}`);
    },
    [navigate]
  );

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Card padding="lg" className="text-center">
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading your CVs...</p>
        </Card>
        <PrivacyNotice />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Card padding="lg" className="text-center">
          <p className="text-lg font-medium text-red-600 dark:text-red-400">{error}</p>
          <Button variant="outline" className="mt-4" onClick={handleRetry}>
            Retry
          </Button>
        </Card>
        <PrivacyNotice />
      </div>
    );
  }

  if (drafts.length === 0 && completed.length === 0) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Card padding="lg" className="text-center">
          <p className="text-slate-500 dark:text-slate-400">No CVs generated yet</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/form/step/1')}>
            Create your first CV
          </Button>
        </Card>
        <PrivacyNotice />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">My CVs</h2>
      {drafts.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-indigo-700 dark:text-indigo-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Drafts ({drafts.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {drafts.map((cv) => (
              <Card
                key={cv.id}
                className="border-indigo-200 hover:shadow-lg hover:transition-shadow dark:border-indigo-800"
              >
                <div className="flex flex-col gap-4 p-4">
                  <div className="flex-shrink-0">
                    <Card padding="sm" className="bg-indigo-50 dark:bg-indigo-900/30">
                      <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
                        DRAFT
                      </span>
                    </Card>
                  </div>
                  <div className="flex-1 px-4">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {cv.personalData?.fullName || 'Unnamed CV'}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {cv.personalData?.email || 'No email'}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Last edited: {formatDate(cv.updatedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleContinueEditing(cv.id)}
                    >
                      Continue Editing
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openPreview(cv)}>
                      Preview &amp; Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {completed.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-700 dark:text-slate-400">
            <svg
              className="h-5 w-5 text-green-500"
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
            Completed CVs ({completed.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {completed.map((cv) => (
              <Card key={cv.id} className="hover:shadow-lg hover:transition-shadow">
                <div className="flex flex-col gap-4 p-4">
                  <div className="flex-shrink-0">
                    <Card padding="sm" className="bg-slate-50 dark:bg-slate-800">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {TEMPLATE_LABELS[cv.template]}
                      </span>
                    </Card>
                  </div>
                  <div className="flex-1 px-4">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {cv.personalData?.fullName || 'Unnamed CV'}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {cv.personalData?.email || 'No email'}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Completed: {formatDate(cv.updatedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleContinueEditing(cv.id)}
                    >
                      Continue Editing
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => openPreview(cv)}>
                      Preview &amp; Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      <PrivacyNotice />
      {previewCv && previewFormState && (
        <PDFPreview
          key={previewCv.id}
          formState={previewFormState}
          isOpen
          onClose={closePreview}
          template={previewCv.template}
        />
      )}
    </div>
  );
};

const PrivacyNotice: React.FC = () => (
  <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
    Your CV data is saved to your account in the cloud for free. Preview &amp; Download generates
    PDF and DOCX files locally in your browser from that saved data, without uploading export files.
  </p>
);

const MyCVs: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Card padding="lg" className="text-center">
        <p role="status" className="text-sm text-slate-600 dark:text-slate-400">
          Checking authentication...
        </p>
      </Card>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return <SavedCVList key={user.uid} userId={user.uid} />;
};

export default MyCVs;
