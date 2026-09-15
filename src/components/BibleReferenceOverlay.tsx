/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, BookOpen, Globe2, AlertCircle, Loader2 } from 'lucide-react';
import { bibleService } from '../services/bible/bible.service';
import { BibleVersion, BibleReference } from '../types';
import { parseBibleReference } from '../config/bible.config';

interface BibleReferenceOverlayProps {
  reference: string;
  referenceObj?: BibleReference | {
    bookId?: string;
    book?: string;
    chapter?: number;
    verseStart?: number;
    verseEnd?: number;
    translationId?: string;
    raw?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  initialVersionId?: string;
}

export default function BibleReferenceOverlay({ 
  reference, 
  referenceObj,
  isOpen, 
  onClose,
  initialVersionId = 'KJV'
}: BibleReferenceOverlayProps) {
  const [activeVersionId, setActiveVersionId] = useState(initialVersionId);
  const [passageVerses, setPassageVerses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [translations, setTranslations] = useState<BibleVersion[]>([]);

  // Load available translations dynamically
  useEffect(() => {
    let isMounted = true;
    async function loadTranslations() {
      try {
        const list = await bibleService.getTranslations();
        if (isMounted && list && list.length > 0) {
          setTranslations(list);
          if (!list.some(t => t.id.toLowerCase() === activeVersionId.toLowerCase())) {
            const defaultVer = list.find(t => t.isDefault) || list[0];
            setActiveVersionId(defaultVer.id);
          }
        }
      } catch (err) {
        console.warn('Failed to dynamically load translations:', err);
      }
    }
    loadTranslations();
    return () => { isMounted = false; };
  }, []);

  // Fetch passage whenever reference, referenceObj, or activeVersionId changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    async function loadPassage() {
      try {
        // Priority 1: Use backend-resolved referenceObj directly without re-parsing
        if (referenceObj && referenceObj.chapter) {
          const bookId = referenceObj.bookId || referenceObj.book || '';
          const result = await bibleService.lookupScripture({
            bookId,
            chapter: referenceObj.chapter,
            verseStart: referenceObj.verseStart,
            verseEnd: referenceObj.verseEnd,
            translationId: activeVersionId
          });
          if (!isMounted) return;
          if (result && Array.isArray(result.verses)) {
            setPassageVerses(result.verses);
            return;
          }
        }

        // Priority 2: If reference is string, parse and resolve
        if (reference) {
          const parsed = parseBibleReference(reference);
          if (parsed && parsed.bookId && parsed.chapter) {
            const result = await bibleService.lookupScripture({
              bookId: parsed.bookId,
              chapter: parsed.chapter,
              verseStart: parsed.verseStart,
              verseEnd: parsed.verseEnd,
              translationId: activeVersionId
            });
            if (!isMounted) return;
            if (result && Array.isArray(result.verses)) {
              setPassageVerses(result.verses);
              return;
            }
          }

          // Fallback to resolveReference
          const resolved = await bibleService.resolveReference(reference, activeVersionId);
          if (!isMounted) return;
          if (resolved && Array.isArray(resolved.verses)) {
            setPassageVerses(resolved.verses);
            return;
          }
        }

        if (isMounted) {
          setPassageVerses([]);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Failed to load scripture passage:', err);
        setErrorMessage(err?.message || 'Failed to load scripture passage from the Bible API.');
        setPassageVerses([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPassage();
    return () => { isMounted = false; };
  }, [reference, referenceObj, isOpen, activeVersionId]);

  if (!isOpen) return null;

  const displayRef = referenceObj?.raw || reference || 'Scripture Passage';

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
            <BookOpen className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
            <h3 className="font-serif font-bold text-[var(--color-primary)] text-base truncate">
              {displayRef}
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#52525B]">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#7A1F2B]" />
              <p className="text-xs font-semibold">Loading scripture passage...</p>
            </div>
          ) : errorMessage ? (
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-500" />
              <p className="text-sm font-semibold text-[#18181B]">Passage Unavailable</p>
              <p className="text-xs text-[#71717A] max-w-xs">{errorMessage}</p>
            </div>
          ) : passageVerses.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-2">
              <AlertCircle className="w-8 h-8 text-[var(--color-text-light)]" />
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Passage Not Found</p>
              <p className="text-xs text-[var(--color-text-secondary)]">The reference "{displayRef}" could not be loaded from the Bible catalog.</p>
            </div>
          ) : (
            <div className="bible-reader leading-relaxed" id="bible-overlay-verse-list">
              {passageVerses.map((v, idx) => (
                <span key={idx} className="bible-verse">
                  <span className="bible-verse-number">{v.number || v.verse}</span>
                  <span className="text-[15px]">{v.text} </span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Translation Switcher Bar */}
        <div className="px-5 py-2.5 border-t border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)] text-[10px] font-bold uppercase tracking-wider shrink-0">
            <Globe2 className="w-3.5 h-3.5 text-[#7A1F2B]" />
            <span>Translation</span>
          </div>

          <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-0.5 overflow-x-auto" id="bible-overlay-version-pills">
            {translations.map((v) => {
              const isSelected = activeVersionId.toLowerCase() === v.id.toLowerCase() || activeVersionId.toUpperCase() === v.shortName.toUpperCase();
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveVersionId(v.shortName || v.id)}
                  className={`min-h-[32px] px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer shrink-0 active:scale-95 ${
                    isSelected
                      ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]'
                  }`}
                >
                  {v.shortName || v.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
