/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, BookOpen, Globe2, AlertCircle } from 'lucide-react';
import { searchBible, mockBibleVersions } from '../data/bibleData';

interface BibleReferenceOverlayProps {
  reference: string;
  isOpen: boolean;
  onClose: () => void;
  initialVersionId?: string;
}

export default function BibleReferenceOverlay({ 
  reference, 
  isOpen, 
  onClose,
  initialVersionId = 'kjv'
}: BibleReferenceOverlayProps) {
  const [activeVersionId, setActiveVersionId] = useState(initialVersionId);
  const [passageVerses, setPassageVerses] = useState<any[]>([]);

  useEffect(() => {
    if (reference && isOpen) {
      const results = searchBible(reference, activeVersionId);
      setPassageVerses(results);
    }
  }, [reference, isOpen, activeVersionId]);

  if (!isOpen) return null;

  const currentVersion = mockBibleVersions.find(v => v.id === activeVersionId);

  return (
    <div 
      className="bible-reference-overlay-backdrop" 
      onClick={onClose}
      id="bible-overlay-backdrop-element"
    >
      <div 
        className="bible-reference-overlay" 
        onClick={(e) => e.stopPropagation()}
        id="bible-overlay-panel"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-background)]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="font-serif font-bold text-[var(--color-primary)] text-base">
              {reference}
            </h3>
          </div>
          
          <button 
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] -mr-2 rounded-full hover:bg-[var(--color-border)] transition-all text-[var(--color-text-secondary)] flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="Close passage overlay"
            id="bible-overlay-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable passage content */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-hidden">
          {passageVerses.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-2">
              <AlertCircle className="w-8 h-8 text-[var(--color-text-light)]" />
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Passage Not Found</p>
              <p className="text-xs text-[var(--color-text-secondary)]">The reference "{reference}" could not be loaded from our prebundled catalog.</p>
            </div>
          ) : (
            <div className="bible-reader leading-relaxed" id="bible-overlay-verse-list">
              {passageVerses.map((v, idx) => (
                <span key={idx} className="bible-verse">
                  <span className="bible-verse-number">{v.verse}</span>
                  <span className="text-[15px]">{v.text} </span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Version Switcher Bar */}
        <div className="px-5 py-2.5 border-t border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)] text-[10px] font-bold uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Bible Version</span>
          </div>

          <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-0.5" id="bible-overlay-version-pills">
            {mockBibleVersions.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVersionId(v.id)}
                className={`min-h-[36px] px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer active:scale-95 ${
                  activeVersionId === v.id
                    ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]'
                }`}
              >
                {v.shortName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
