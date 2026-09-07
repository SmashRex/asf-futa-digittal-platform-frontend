/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  AlertCircle, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export interface StudyDocumentViewerProps {
  documentUrl?: string;
  documentType?: 'pdf' | 'html' | 'external';
  title: string;
  lessonNumber?: number;
  author?: string;
  className?: string;
}

export const StudyDocumentViewer: React.FC<StudyDocumentViewerProps> = ({
  documentUrl,
  documentType = 'pdf',
  title,
  lessonNumber,
  author,
  className = ''
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!documentUrl) {
    return (
      <div className={`p-8 bg-white border border-[var(--color-border)] rounded-xl text-center space-y-3 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center mx-auto text-[var(--color-text-secondary)]">
          <FileText className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
            No Study Manual Document Attached
          </h4>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
            The full PDF study manual for {lessonNumber ? `Lesson ${lessonNumber}` : 'this session'} is currently provided in structured text outline view above.
          </p>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = `ASF_BibleStudy_Lesson_${lessonNumber || 'Manual'}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenExternal = () => {
    window.open(documentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className={`study-document-container flex flex-col bg-white border border-[var(--color-border)] rounded-xl overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'shadow-xs'
      } ${className}`}
      id="study-document-viewer"
    >
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-background)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-lg bg-[var(--color-primary-tint)] text-[var(--color-primary)] shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[var(--color-text-primary)] truncate">
              {lessonNumber ? `Lesson ${lessonNumber}: ` : ''}{title}
            </h4>
            <p className="text-[10px] text-[var(--color-text-secondary)] truncate">
              {author ? `Prepared by: ${author}` : 'Official Fellowship Study Manual'} • {documentType.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all text-xs flex items-center gap-1"
            title="Download Study Document"
            id="download-study-doc-btn"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-semibold">Download</span>
          </button>

          <button
            type="button"
            onClick={handleOpenExternal}
            className="p-1.5 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all text-xs"
            title="Open in new tab"
            id="open-external-doc-btn"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all text-xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            id="toggle-fullscreen-doc-btn"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Viewer Content Canvas */}
      <div className={`relative flex-1 bg-zinc-100 min-h-[420px] ${isFullscreen ? 'h-full' : 'h-[540px]'}`}>
        {isLoading && !loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 z-10">
            <div className="animate-spin rounded-full h-7 w-7 border-2 border-[var(--color-primary)] border-t-transparent" />
            <span className="text-xs text-[var(--color-text-secondary)] font-medium">Loading manual document...</span>
          </div>
        )}

        {loadError ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-3 bg-white">
            <AlertCircle className="w-8 h-8 text-[var(--color-error)]" />
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-[var(--color-text-primary)]">
                Document Preview Unavailable
              </h5>
              <p className="text-xs text-[var(--color-text-secondary)] max-w-sm">
                Your browser or network prevented embedding this document directly. You can still download or open it directly in a new window.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setLoadError(false);
                  setIsLoading(true);
                }}
                className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <button
                onClick={handleOpenExternal}
                className="px-3.5 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </button>
            </div>
          </div>
        ) : (
          <iframe
            src={`${documentUrl}#toolbar=0`}
            title={`Document for ${title}`}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setLoadError(true);
            }}
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Backend document connector verified</span>
        </div>
        <span>Bible references available in Outline tab</span>
      </div>
    </div>
  );
};

export default StudyDocumentViewer;
