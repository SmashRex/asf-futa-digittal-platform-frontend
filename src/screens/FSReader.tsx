/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Type, BookOpen, X, ChevronRight, Check } from 'lucide-react';
import { getFSMaterialById, mockFSMaterials } from '../data/fsData';
import { ScriptureRef } from '../types';

export const FSReader: React.FC = () => {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();

  const material = getFSMaterialById(materialId || 'fs-01') || mockFSMaterials[0];
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const activeChapter = material.chapters[activeChapterIndex] || material.chapters[0];

  // Bookmarking state with local persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('asf_fs_bookmarks');
      return saved ? JSON.parse(saved) : ['fs-01'];
    } catch {
      return ['fs-01'];
    }
  });

  const isBookmarked = bookmarkedIds.includes(material.id);

  const toggleBookmark = () => {
    let updated: string[];
    if (isBookmarked) {
      updated = bookmarkedIds.filter(id => id !== material.id);
      setToastMsg(`Removed "${material.title}" from your bookmarks.`);
    } else {
      updated = [...bookmarkedIds, material.id];
      setToastMsg(`Bookmarked "${material.title}" for offline reading.`);
    }
    setBookmarkedIds(updated);
    localStorage.setItem('asf_fs_bookmarks', JSON.stringify(updated));
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Font size state
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Selected Scripture Modal
  const [selectedScripture, setSelectedScripture] = useState<ScriptureRef | null>(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState('');

  // Map font size to Tailwind typography class
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-sm md:text-base leading-relaxed';
      case 'md': return 'text-base md:text-[17px] leading-relaxed';
      case 'lg': return 'text-[17px] md:text-lg leading-loose';
      default: return 'text-base md:text-[17px] leading-relaxed';
    }
  };

  // Function to render text with interactive inline Scripture Reference chips
  const renderParagraphWithChips = (text: string) => {
    // Regex matches [[Ref]] patterns
    const parts = text.split(/(\[\[.*?\]\])/g);

    return parts.map((part, index) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const refStr = part.slice(2, -2).trim();
        // Find matching scripture reference object
        const scriptureObj = activeChapter.scriptureRefs?.find(
          s => s.ref.toLowerCase() === refStr.toLowerCase()
        ) || {
          ref: refStr,
          bookId: 'JHN',
          chapter: 3,
          verse: 16,
          text: `Scripture passage for ${refStr}. For God so loved the world, that he gave his only begotten Son...`
        };

        return (
          <button
            key={index}
            onClick={() => setSelectedScripture(scriptureObj)}
            className="inline-flex items-center px-2 py-0.5 mx-1 rounded bg-[#7A1F2B]/10 hover:bg-[#5B0617] text-[#5B0617] hover:text-white font-sans text-xs font-bold transition-all cursor-pointer align-baseline select-none"
            aria-label={`Read reference ${refStr}`}
          >
            <span>{refStr}</span>
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#FDFBF9] text-[#18181B] relative pb-8" id="fs-reader-screen">
      
      {/* Top Contextual Reader Navigation Bar */}
      <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-[#E4E4E7] h-16 flex items-center justify-between px-4 md:px-8 transition-all">
        <button
          onClick={() => navigate('/fs/materials')}
          className="p-2 -ml-2 text-[#52525B] hover:bg-[#FDFBF9] rounded-full transition-colors text-[#5B0617]"
          aria-label="Back to Materials"
          id="reader-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center justify-center text-center px-2 min-w-0">
          <span className="font-semibold text-sm md:text-base text-[#18181B] truncate max-w-[220px] md:max-w-xs">
            {activeChapter.title}
          </span>
          <span className="text-[11px] font-bold text-[#805600] uppercase tracking-wider mt-0.5 truncate max-w-[200px]">
            {material.title}
          </span>
        </div>

        <button
          onClick={toggleBookmark}
          className={`p-2 -mr-2 rounded-full transition-colors ${
            isBookmarked ? 'text-[#5B0617] bg-[#5B0617]/10' : 'text-[#52525B] hover:bg-[#FDFBF9]'
          }`}
          aria-label="Bookmark Material"
          id="reader-bookmark-btn"
        >
          {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Reading Area */}
      <main className="pt-24 px-4 md:px-8 max-w-2xl mx-auto w-full space-y-8 flex-1">
        
        {/* Chapter Header */}
        <header className="border-b border-[#E4E4E7] pb-6">
          <p className="font-bold text-xs uppercase tracking-widest text-[#5B0617] mb-2">
            CHAPTER {activeChapter.chapterNumber}
          </p>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#18181B] leading-tight mb-2">
            {activeChapter.title}
          </h1>
          {activeChapter.subtitle && (
            <p className="font-serif italic text-base text-[#52525B]">
              {activeChapter.subtitle}
            </p>
          )}
        </header>

        {/* Editorial Reading Content */}
        <article className={`font-serif text-[#18181B] space-y-6 ${getFontSizeClass()}`}>
          {activeChapter.paragraphs.map((para, idx) => (
            <p key={idx} className="leading-relaxed">
              {renderParagraphWithChips(para)}
            </p>
          ))}
        </article>

        {/* Chapter Switcher Controls */}
        {material.chapters.length > 1 && (
          <div className="pt-8 border-t border-[#E4E4E7] flex items-center justify-between gap-4">
            <button
              disabled={activeChapterIndex === 0}
              onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl border border-[#E4E4E7] text-xs font-bold text-[#5B0617] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
            >
              Previous Chapter
            </button>
            <span className="text-xs font-semibold text-[#52525B]">
              Chapter {activeChapterIndex + 1} of {material.chapters.length}
            </span>
            <button
              disabled={activeChapterIndex === material.chapters.length - 1}
              onClick={() => setActiveChapterIndex(prev => Math.min(material.chapters.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl bg-[#5B0617] text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#7A1F2B]"
            >
              Next Chapter
            </button>
          </div>
        )}

      </main>

      {/* Floating Text Settings Control Button (Aa) */}
      <button
        onClick={() => setShowSettingsModal(true)}
        className="fixed bottom-8 md:bottom-8 right-5 md:right-8 w-14 h-14 bg-white rounded-full shadow-[0px_4px_20px_rgba(122,31,43,0.12)] border border-[#E4E4E7] flex items-center justify-center text-[#5B0617] hover:bg-[#FAF8F5] transition-all z-40 active:scale-95"
        aria-label="Text & Chapter Settings"
        id="reader-settings-btn"
      >
        <Type className="w-6 h-6" />
      </button>

      {/* Reading Preferences Modal */}
      {showSettingsModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={() => setShowSettingsModal(false)}
          id="reader-settings-modal-overlay"
        >
          <div 
            className="w-full max-w-md bg-white rounded-t-2xl md:rounded-2xl p-6 space-y-6 shadow-2xl border border-[#E4E4E7] animate-slide-up"
            onClick={e => e.stopPropagation()}
            id="reader-settings-modal-panel"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2 text-[#5B0617]">
                <Type className="w-5 h-5" />
                <h3 className="font-bold text-base text-[#18181B]">Reading Preferences</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-full text-[#52525B] hover:bg-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#52525B]">
                Text Size
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-1 transition-all ${
                    fontSize === 'sm' 
                      ? 'bg-[#5B0617] text-white border-[#5B0617]' 
                      : 'bg-white text-[#18181B] border-[#E4E4E7] hover:border-[#5B0617]'
                  }`}
                >
                  <span>Small</span>
                </button>
                <button
                  onClick={() => setFontSize('md')}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-1 transition-all ${
                    fontSize === 'md' 
                      ? 'bg-[#5B0617] text-white border-[#5B0617]' 
                      : 'bg-white text-[#18181B] border-[#E4E4E7] hover:border-[#5B0617]'
                  }`}
                >
                  <span>Medium</span>
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-1 transition-all ${
                    fontSize === 'lg' 
                      ? 'bg-[#5B0617] text-white border-[#5B0617]' 
                      : 'bg-white text-[#18181B] border-[#E4E4E7] hover:border-[#5B0617]'
                  }`}
                >
                  <span>Large</span>
                </button>
              </div>
            </div>

            {/* Chapter Selection */}
            {material.chapters.length > 1 && (
              <div className="space-y-2 pt-2 border-t border-[#E4E4E7]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#52525B]">
                  Select Chapter
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {material.chapters.map((ch, idx) => (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setActiveChapterIndex(idx);
                        setShowSettingsModal(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                        activeChapterIndex === idx 
                          ? 'bg-[#5B0617]/10 border-[#5B0617] text-[#5B0617]' 
                          : 'bg-white border-[#E4E4E7] text-[#18181B] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <span>Chapter {ch.chapterNumber}: {ch.title}</span>
                      {activeChapterIndex === idx && <Check className="w-4 h-4 text-[#5B0617]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-3 bg-[#5B0617] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#7A1F2B]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Interactive Scripture Popover Modal */}
      {selectedScripture && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4"
          onClick={() => setSelectedScripture(null)}
          id="scripture-popover-overlay"
        >
          <div 
            className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-2xl border border-[#E4E4E7] animate-scale-up"
            onClick={e => e.stopPropagation()}
            id="scripture-popover-panel"
          >
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <div className="flex items-center gap-2 text-[#5B0617]">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold text-base text-[#5B0617] font-serif">
                  {selectedScripture.ref}
                </h3>
              </div>
              <button
                onClick={() => setSelectedScripture(null)}
                className="p-1 rounded-full text-[#52525B] hover:bg-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <blockquote className="font-serif italic text-base text-[#18181B] bg-[#FAF8F5] p-4 rounded-xl border border-[#E4E4E7] leading-relaxed">
              "{selectedScripture.text || 'In the beginning was the Word, and the Word was with God, and the Word was God.'}"
            </blockquote>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedScripture(null);
                  navigate(`/bible/read/${selectedScripture.bookId}/${selectedScripture.chapter}`);
                }}
                className="flex-1 py-3 bg-[#5B0617] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#7A1F2B] flex items-center justify-center gap-1"
              >
                <span>Read Full Chapter in Bible</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Toast popup */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#18181B] text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-white/10 max-w-sm w-[90%] flex items-center justify-center gap-2 z-50 animate-bounce">
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};

export default FSReader;
