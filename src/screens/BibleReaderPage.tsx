/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Type, 
  Sparkles, 
  Bookmark, 
  BookMarked, 
  Volume2, 
  WifiOff, 
  CheckCircle2, 
  BookOpen 
} from 'lucide-react';
import { bibleService } from '../services/bible/bible.service';
import { BibleBookDetail, BibleChapterDetail, BibleVerseDetail } from '../types';
import { normalizeBookId, buildBibleRoute } from '../config/bible.config';
import BibleVerseList from '../components/bible/BibleVerseList';

interface BibleReaderPageProps {
  isOfflineSimulated: boolean;
  activeVersionId: string;
}

export default function BibleReaderPage({
  isOfflineSimulated,
  activeVersionId
}: BibleReaderPageProps) {
  const { bookId, chapterId, verseId } = useParams();
  const navigate = useNavigate();

  // Reading Experience Settings
  const [fontSize, setFontSize] = useState(18); // Default 18px optimal body scale
  const [theme, setTheme] = useState<'white' | 'cream' | 'dark'>('cream');
  const [showSettings, setShowSettings] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Loaded data state
  const [book, setBook] = useState<BibleBookDetail | null>(null);
  const [chapter, setChapter] = useState<BibleChapterDetail | null>(null);
  const [allBooks, setAllBooks] = useState<BibleBookDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const rawBookParam = (bookId || 'genesis').trim();
  const currentChapterNum = parseInt(chapterId || '1', 10);
  const targetVerseNum = verseId ? parseInt(verseId, 10) : undefined;

  // Fallback to KJV if offline and trying to load non-prebundled translation
  const effectiveVersionId = (isOfflineSimulated && activeVersionId === 'web') ? 'kjv' : activeVersionId;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function loadScripture() {
      try {
        const books = await bibleService.getBooks(effectiveVersionId);
        if (!isMounted) return;
        setAllBooks(books);

        // Find book by canonical ID, rawBookParam, display name, abbreviations, or fallback normalization
        const normParam = normalizeBookId(rawBookParam);
        const currentBook = books.find(b => 
          b.id.toLowerCase() === normParam.toLowerCase() ||
          b.id.toLowerCase() === rawBookParam.toLowerCase() ||
          b.name.toLowerCase() === rawBookParam.toLowerCase() ||
          (b.abbreviations && b.abbreviations.some(a => a.toLowerCase() === rawBookParam.toLowerCase()))
        ) || null;

        if (!isMounted) return;
        setBook(currentBook);

        const authoritativeBookId = currentBook ? currentBook.id : normParam;

        try {
          const ch = await bibleService.getChapter(authoritativeBookId, currentChapterNum, effectiveVersionId);
          if (!isMounted) return;
          setChapter(ch);
        } catch {
          if (!isMounted) return;
          setChapter(null);
        }
      } catch (err) {
        console.error('Failed to load scripture:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadScripture();
    return () => { isMounted = false; };
  }, [rawBookParam, currentChapterNum, effectiveVersionId]);

  // Handle previous chapter action
  const handlePrevChapter = () => {
    if (!book) return;
    if (currentChapterNum > 1) {
      navigate(buildBibleRoute(book.id, currentChapterNum - 1));
    } else {
      // Previous book
      const activeBookId = book.id;
      const bookIdx = allBooks.findIndex(b => b.id.toLowerCase() === activeBookId.toLowerCase());
      if (bookIdx > 0) {
        const prevBook = allBooks[bookIdx - 1];
        const lastChNum = prevBook.totalChapters || prevBook.chapterCount || prevBook.chapters[prevBook.chapters.length - 1]?.number || 1;
        navigate(buildBibleRoute(prevBook.id, lastChNum));
      }
    }
  };

  // Handle next chapter action
  const handleNextChapter = () => {
    if (!book) return;
    const maxChapters = book.totalChapters || book.chapterCount || book.chapters.length || 1;
    if (currentChapterNum < maxChapters) {
      navigate(buildBibleRoute(book.id, currentChapterNum + 1));
    } else {
      // Next book
      const activeBookId = book.id;
      const bookIdx = allBooks.findIndex(b => b.id.toLowerCase() === activeBookId.toLowerCase());
      if (bookIdx < allBooks.length - 1) {
        const nextBook = allBooks[bookIdx + 1];
        navigate(buildBibleRoute(nextBook.id, 1));
      }
    }
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    setToastMessage(!isBookmarked ? 'Scripture passage bookmarked successfully.' : 'Bookmark removed.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Theme styling helpers
  const getContainerBg = () => {
    switch (theme) {
      case 'dark': return 'bg-[#1C1917] text-[#FAF8F5]';
      case 'white': return 'bg-white text-[#18181B]';
      case 'cream':
      default: return 'bg-[#FDFBF9] text-[#18181B]';
    }
  };

  const getHeaderClasses = () => {
    switch (theme) {
      case 'dark': return 'bg-[#1C1917]/95 border-[#2D2A26] text-[#FAF8F5]';
      case 'white': return 'bg-white/95 border-[#E4E4E7] text-[#18181B]';
      case 'cream':
      default: return 'bg-[#FDFBF9]/95 border-[#E4E4E7] text-[#18181B]';
    }
  };

  return (
    <div className={`flex-1 flex flex-col min-h-screen transition-colors select-none ${getContainerBg()}`} id="bible-reader-page">
      
      {/* Dynamic Navigation Header */}
      <div className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 py-3 flex items-center justify-between transition-colors ${getHeaderClasses()}`} id="bible-reader-top-controls">
        <button
          onClick={() => navigate('/bible')}
          className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#7A1F2B] transition-colors py-1"
          id="reader-back-home-btn"
        >
          <ArrowLeft className="w-4 h-4 text-[#7A1F2B]" />
          <span>Scripture Home</span>
        </button>

        {/* Center Chapter Indicator */}
        {book && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold font-serif text-[#7A1F2B]">
            <span>{book.name} {chapter?.number}</span>
            {targetVerseNum && <span>: {targetVerseNum}</span>}
          </div>
        )}

        {/* Header Tools */}
        <div className="flex items-center gap-1.5">
          {/* Audio Tool */}
          <button
            onClick={() => {
              setToastMessage('Audio text-to-speech rendering is designated for future updates.');
              setTimeout(() => setToastMessage(''), 3000);
            }}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors text-current"
            aria-label="Listen to scripture"
          >
            <Volume2 className="w-4 h-4 text-[#52525B]" />
          </button>

          {/* Bookmarks */}
          <button
            onClick={handleBookmarkToggle}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors"
            id="reader-bookmark-btn"
            aria-label="Bookmark chapter"
          >
            {isBookmarked ? (
              <BookMarked className="w-4 h-4 text-[#7A1F2B]" />
            ) : (
              <Bookmark className="w-4 h-4 text-[#52525B]" />
            )}
          </button>

          {/* Aa Reading Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-[#E4E4E7] text-xs font-bold bg-white hover:bg-[#FAF8F5] transition-colors shadow-xs"
            id="reader-aa-trigger-btn"
          >
            <Type className="w-4 h-4 text-[#7A1F2B]" />
            <span className="text-[#18181B]">Aa</span>
          </button>
        </div>
      </div>

      {/* Reassuring Quiet Offline Indicator Banner */}
      {isOfflineSimulated && (
        <div className="bg-[#FAF8F5] border-b border-[#E4E4E7] px-4 py-2.5 text-center flex items-center justify-center gap-2 text-xs text-[#52525B]" id="reader-offline-reassurance-bar">
          <WifiOff className="w-3.5 h-3.5 text-[#7A1F2B] shrink-0" />
          <span className="font-medium">
            You are offline, but your Bible is still available.
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>KJV Offline Ready</span>
          </span>
        </div>
      )}

      {/* Floating Reading Settings Panel */}
      {showSettings && (
        <div className="max-w-md mx-auto w-[92%] mt-3 p-4 rounded-xl border border-[#E4E4E7] bg-white shadow-lg space-y-4 text-[#18181B] z-40 transition-all" id="reader-aa-settings-panel">
          {/* Font Size Adjuster */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#52525B]">Text Size</span>
            <div className="flex items-center gap-3 bg-[#FAF8F5] border border-[#E4E4E7] rounded-lg px-2 py-1">
              <button
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                className="px-2 py-1 text-xs font-bold hover:bg-black/5 rounded text-[#7A1F2B]"
              >
                A-
              </button>
              <span className="text-xs font-semibold text-[#18181B]">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(26, fontSize + 2))}
                className="px-2 py-1 text-xs font-bold hover:bg-black/5 rounded text-[#7A1F2B]"
              >
                A+
              </button>
            </div>
          </div>

          {/* Background Themes */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#52525B]">Theme</span>
            <div className="flex bg-[#FAF8F5] border border-[#E4E4E7] rounded-lg p-1 gap-1">
              <button
                onClick={() => setTheme('white')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  theme === 'white' ? 'bg-white text-[#18181B] shadow-xs font-bold border border-[#E4E4E7]' : 'text-[#52525B]'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('cream')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  theme === 'cream' ? 'bg-[#FDFBF9] text-[#18181B] shadow-xs font-bold border border-[#E4E4E7]' : 'text-[#52525B]'
                }`}
              >
                Warm
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  theme === 'dark' ? 'bg-[#1C1917] text-white shadow-xs font-bold' : 'text-[#52525B]'
                }`}
              >
                Dark
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Scripture Reader Container */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 overflow-y-auto" id="reader-content-area">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#7A1F2B] border-t-transparent" />
            <span className="text-xs text-[#52525B] font-medium">Loading scripture...</span>
          </div>
        ) : book && chapter ? (
          <div className="space-y-8">
            
            {/* Reverent Chapter Title & Hierarchy Header */}
            <div className="text-center space-y-2 border-b border-dashed border-[#E4E4E7] pb-6" id="reader-chapter-title-panel">
              <p className="text-xs uppercase tracking-widest font-bold text-[#7A1F2B]">
                {book.name}
              </p>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#18181B] tracking-tight">
                Chapter {chapter.number}
              </h1>
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-[11px] text-[#52525B] font-semibold bg-white border border-[#E4E4E7] px-3 py-0.5 rounded-full shadow-xs">
                  {effectiveVersionId === 'web' ? 'World English Bible (WEB)' : 'King James Version (KJV)'}
                </span>
                {targetVerseNum && (
                  <span className="text-[11px] text-[#7A1F2B] font-semibold bg-[#7A1F2B]/10 border border-[#7A1F2B]/20 px-3 py-0.5 rounded-full">
                    Focus: Verse {targetVerseNum}
                  </span>
                )}
              </div>
            </div>

            {/* Offline Auto-Fallback Reassurance Note */}
            {isOfflineSimulated && activeVersionId === 'web' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-900 space-y-1">
                <p className="font-bold">Offline Translation Switch</p>
                <p className="text-amber-800">
                  World English Bible requires internet. Showing prebundled King James Version (KJV) for offline reading.
                </p>
              </div>
            )}

            {/* Pure Scripture Text Content using Source Serif 4 */}
            <BibleVerseList
              verses={chapter.verses}
              targetVerse={targetVerseNum}
              fontSize={fontSize}
              theme={theme}
            />

            {/* Chapter Navigation Controls */}
            <div className="flex items-center justify-between border-t border-[#E4E4E7] pt-6 mt-10" id="reader-chapter-nav">
              <button
                onClick={handlePrevChapter}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-[#E4E4E7] bg-white text-xs font-bold text-[#18181B] hover:border-[#7A1F2B] hover:text-[#7A1F2B] transition-all shadow-xs active:scale-95 cursor-pointer"
                id="reader-prev-chapter-btn"
              >
                <ChevronLeft className="w-4 h-4 text-[#7A1F2B]" />
                <span>Previous Chapter</span>
              </button>

              <button
                onClick={handleNextChapter}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-[#E4E4E7] bg-white text-xs font-bold text-[#18181B] hover:border-[#7A1F2B] hover:text-[#7A1F2B] transition-all shadow-xs active:scale-95 cursor-pointer"
                id="reader-next-chapter-btn"
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4 text-[#7A1F2B]" />
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-10 h-10 text-[#52525B] mx-auto mb-3" />
            <p className="text-sm text-[#52525B] font-semibold">Book or Chapter Unavailable</p>
            <button 
              onClick={() => navigate('/bible')} 
              className="mt-4 px-4 py-2 bg-[#7A1F2B] text-white text-xs font-bold rounded-xl hover:bg-[#5B0617] transition-colors cursor-pointer"
            >
              Return to Catalog
            </button>
          </div>
        )}
      </div>

      {/* Toast Popup Notification */}
      {toastMessage && (
        <div 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#18181B] text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-white/10 max-w-sm w-[90%] flex items-center gap-2.5 z-50 leading-relaxed"
          id="reader-toast-popup"
        >
          <div className="p-1 rounded-full bg-[#7A1F2B] text-white shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
