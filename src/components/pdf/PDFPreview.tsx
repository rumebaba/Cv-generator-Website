import { PDFViewer, pdf } from '@react-pdf/renderer';
import React, { useState, useEffect, useCallback, useRef } from 'react';

import type { TemplateId } from '../../hooks/useTemplate';
import type { FormState } from '../../types/form';
import { Button } from '../common/Button';
import { generateDocxBlob } from '../../services/generateDocx';

import CVTemplate from './CVTemplate';
import CVTemplateCompact from './CVTemplateCompact';
import CVTemplateCreative from './CVTemplateCreative';
import CVTemplateExecutive from './CVTemplateExecutive';
import CVTemplateMinimal from './CVTemplateMinimal';
import CVTemplateModern from './CVTemplateModern';

interface PDFPreviewProps {
  formState: FormState;
  isOpen: boolean;
  onClose: () => void;
  template?: TemplateId;
  onTemplateChange?: (template: TemplateId) => void;
}

const templateMap = {
  classic: CVTemplate,
  modern: CVTemplateModern,
  minimal: CVTemplateMinimal,
  executive: CVTemplateExecutive,
  creative: CVTemplateCreative,
  compact: CVTemplateCompact,
} as const;

const templateNames: Record<TemplateId, string> = {
  classic: 'Classic',
  modern: 'Modern',
  minimal: 'Minimal',
  executive: 'Executive',
  creative: 'Creative',
  compact: 'Compact',
};

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  formState,
  isOpen,
  onClose,
  template = 'classic',
  onTemplateChange,
}) => {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const pdfUrlRef = useRef<string | null>(null);
  const formStateRef = useRef(formState);
  formStateRef.current = formState;

  const TemplateComponent = templateMap[template];

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const generatePDF = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    setPdfBlob(null);
    try {
      const blob = await pdf(<TemplateComponent formState={formStateRef.current} />).toBlob();
      if (mountedRef.current) {
        setPdfBlob(blob);
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to generate PDF');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [TemplateComponent, isOpen]);

  useEffect(() => {
    generatePDF();
  }, [isOpen, template, generatePDF]);

  useEffect(() => {
    return () => {
      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleDownloadDocx = async () => {
    setDownloadingDocx(true);
    try {
      const blob = await generateDocxBlob(formStateRef.current.data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formStateRef.current.data.personalData.fullName.replace(/\s+/g, '_') || 'cv'}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('DOCX generation failed:', err);
    } finally {
      setDownloadingDocx(false);
    }
  };

  const getPdfUrl = () => {
    if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    if (!pdfBlob) return '';
    pdfUrlRef.current = URL.createObjectURL(pdfBlob);
    return pdfUrlRef.current;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">CV Preview</h2>
            {onTemplateChange && (
              <select
                value={template}
                onChange={(e) => onTemplateChange(e.target.value as TemplateId)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {(Object.keys(templateNames) as TemplateId[]).map((id) => (
                  <option key={id} value={id}>
                    {templateNames[id]}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadDocx}
              disabled={downloadingDocx}
            >
              {downloadingDocx ? 'Generating...' : 'Download DOCX'}
            </Button>
            {pdfBlob && (
              <a href={getPdfUrl()} download="cv.pdf">
                <Button variant="primary" size="sm">
                  Download PDF
                </Button>
              </a>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-red-500 dark:text-red-400">
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">Failed to generate PDF</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Check the browser console for details.
                </p>
              </div>
            </div>
          ) : pdfBlob ? (
            <PDFViewer width="100%" height="100%" showToolbar={false}>
              <TemplateComponent formState={formStateRef.current} />
            </PDFViewer>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
              Generating PDF preview...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
