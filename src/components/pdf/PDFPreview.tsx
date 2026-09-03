import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import CVTemplate from './CVTemplate';
import { Button } from '../common/Button';
import type { FormState } from '../../types/form';

interface PDFPreviewProps {
  formState: FormState;
  isOpen: boolean;
  onClose: () => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ formState, isOpen, onClose }) => {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const generatingRef = useRef(false);

  const generatePDF = useCallback(async () => {
    if (generatingRef.current) return;
    generatingRef.current = true;

    try {
      const { renderToStream } = await import('@react-pdf/renderer');
      const stream = await renderToStream(<CVTemplate formState={formState} />);

      const chunks: BlobPart[] = [];
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const blob = new Blob(chunks, { type: 'application/pdf' });
      setPdfBlob(blob);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      generatingRef.current = false;
    }
  }, [formState]);

  useEffect(() => {
    if (isOpen && !pdfBlob && !loading && !generatingRef.current) {
      generatePDF().then(() => {});
    }
  }, [isOpen, formState, generatePDF, pdfBlob, loading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-xl bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">CV Preview</h2>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
              <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close
            </Button>
            {pdfBlob && (
              <a href={URL.createObjectURL(pdfBlob)} download="cv.pdf">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  }
                >
                  Download PDF
                </Button>
              </a>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden p-4">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
          ) : pdfBlob ? (
            <PDFViewer width="100%" height="100%">
              <CVTemplate formState={formState} />
            </PDFViewer>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
              Failed to generate PDF preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
