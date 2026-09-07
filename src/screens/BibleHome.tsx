/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Book, 
  Search, 
  Globe2, 
  WifiOff, 
  ChevronRight, 
  X 
} from 'lucide-react';
import { bibleService } from '../services/bible/bible.service';
import { BibleBookDetail, BibleVersion } from '../types';
import { buildBibleRoute } from '../config/bible.config';
import { useDevState } from '../dev/simulations/devState';

interface BibleHomeProps {
  isOfflineSimulated: boolean;
  onToggleOffline: () => void;
  activeVersionId: string;
  onVersionChange: (id: string) => void;
}

export default function BibleHome({
  isOfflineSimulated: propOffline,
  onToggleOffline,
  activeVersionId,
  onVersionChange
}: BibleHomeProps) {
  const navigate = useNavigate();
  const devState = useDevState();
  const [selectedBook, setSelectedBook] = useState<BibleBookDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<BibleBookDetail[]>([]);
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isOfflineSimulated = propOffline || devState.isOfflineSimulated;

  // Fallback to KJV if offline and trying to load non-prebundled translation
  const effectiveVersionId = (isOfflineSimulated && activeVersionId === 'web') ? 'kjv' : activeVersionId;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function loadData() {
      try {
        const [bookList, versionList] = await Promise.all([
          bibleService.getBooks(effectiveVersionId),
          bibleService.getVersions()
        ]);
        if (!isMounted) return;
        setBooks(bookList);
        setVersions(versionList);
      } catch (err) {
        console.error('Failed to load Bible catalog:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [effectiveVersionId]);

  const handleBookClick = (book: BibleBookDetail) => {
    setSelectedBook(book);
  };

  const handleChapterClick = (chapterNum: number) => {
    if (selectedBook) {
      navigate(buildBibleRoute(selectedBook.id, chapterNum));
      setSelectedBook(null); // close selection overlay
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/bible/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const oldTestamentBooks = books.filter(b => b.testament === 'Old');
  const newTestamentBooks = books.filter(b => b.testament === 'New');

  return (
    <div className="bible-page select-none space-y-6 max-w-4xl mx-auto" id="bible-home-screen">
      
      {/* Search Header Bar */}
      <form onSubmit={handleSearchSubmit} className="relative" id="bible-search-form">
        <input
          type="text"
          placeholder="Search scripture by keyword, phrase, or reference (e.g. John 3:16)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-[var(--color-border)] pl-11 pr-24 rounded-xl py-3.5 shadow-2xs text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/70 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
          id="bible-search-input"
        />
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[var(--color-text-secondary)] pointer-events-none">
          <Search className="w-4 h-4 text-[var(--color-primary)]" />
        </span>
        <button
          type="submit"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-lg hover:bg-[var(--color-primary-hover)] transition-all cursor-pointer shadow-2xs"
        >
          Search
        </button>
      </form>

      {/* Offline Status Warning Callout when Simulated Offline */}
      {isOfflineSimulated && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2.5 text-[#52525B]">
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <p className="font-bold text-[#18181B]">Simulated Offline Mode</p>
              <p className="text-[10px] text-[#52525B]">Showing cached scriptures and pre-bundled Bible chapters</p>
            </div>
          </div>
          <button
            onClick={onToggleOffline}
            className="text-xs font-bold underline hover:text-amber-950 shrink-0 cursor-pointer"
            id="bible-offline-toggle-btn"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Primary Version Settings Selector banner */}
      <div className="bg-white border border-[#E4E4E7] p-4 rounded-xl flex flex-col xs:flex-row xs:items-center justify-between gap-3.5 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="bg-[#7A1F2B]/10 p-2 rounded-lg text-[#7A1F2B] shrink-0">
            <Globe2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[#18181B] truncate">Active Bible Translation</h4>
            <p className="text-[10px] text-[#52525B] truncate">Switch standard translation library</p>
          </div>
        </div>

        <select
          value={activeVersionId}
          onChange={(e) => onVersionChange(e.target.value)}
          className="bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-bold py-1.5 px-3 rounded-lg text-[#7A1F2B] outline-none hover:border-[#7A1F2B] cursor-pointer w-full xs:w-auto shrink-0"
          id="bible-version-dropdown"
        >
          {versions.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.shortName})
            </option>
          ))}
        </select>
      </div>

      {/* Reassuring Quiet Offline Status Message */}
      {isOfflineSimulated && (
        <div className="p-3.5 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-center space-y-1.5" id="bible-offline-alert">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#7A1F2B]">
            <WifiOff className="w-4 h-4 text-[#7A1F2B]" />
            <span>You are offline, but your Bible is still available.</span>
          </div>
          <p className="text-xs text-[#52525B] max-w-sm mx-auto leading-relaxed">
            Prebundled King James Version (KJV) Scripture is fully ready for offline reading anytime.
          </p>
        </div>
      )}

      {/* Scripture Books Browser Catalog */}
      <div className="space-y-6" id="bible-books-catalog">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent" />
            <span className="text-xs text-[var(--color-text-secondary)] font-medium">Loading Bible Catalog...</span>
          </div>
        ) : (
          <>
            {/* Old Testament Section */}
            {oldTestamentBooks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></span>
                    <span>Old Testament</span>
                  </h4>
                  <span className="text-[10px] font-semibold text-[var(--color-text-secondary)]">
                    {oldTestamentBooks.length} Books
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {oldTestamentBooks.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => handleBookClick(book)}
                      className="flex items-center justify-between p-3.5 bg-white border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] hover:shadow-2xs transition-all text-left cursor-pointer group"
                      id={`book-card-${book.id}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[var(--color-background)] text-[var(--color-text-secondary)] group-hover:bg-[var(--color-primary-tint)] group-hover:text-[var(--color-primary)] transition-colors">
                          <Book className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                          {book.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] font-medium">
                        <span>{book.chapters.length} ch</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* New Testament Section */}
            {newTestamentBooks.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></span>
                    <span>New Testament</span>
                  </h4>
                  <span className="text-[10px] font-semibold text-[var(--color-text-secondary)]">
                    {newTestamentBooks.length} Books
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {newTestamentBooks.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => handleBookClick(book)}
                      className="flex items-center justify-between p-3.5 bg-white border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] hover:shadow-2xs transition-all text-left cursor-pointer group"
                      id={`book-card-${book.id}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[var(--color-background)] text-[var(--color-text-secondary)] group-hover:bg-[var(--color-primary-tint)] group-hover:text-[var(--color-primary)] transition-colors">
                          <Book className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                          {book.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] font-medium">
                        <span>{book.chapters.length} ch</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Structured Selection overlay Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setSelectedBook(null)} id="chapter-selector-overlay">
          <div 
            className="bg-white border border-[var(--color-border)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            id="chapter-selector-card"
          >
            <div className="flex justify-between items-start border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[var(--color-primary-tint)] text-[var(--color-primary)]">
                  <Book className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[var(--color-text-primary)]">
                    {selectedBook.name}
                  </h3>
                  <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">
                    Select a Chapter
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBook(null)}
                className="p-1 rounded-full hover:bg-[var(--color-background)] text-[var(--color-text-secondary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chapter Selection Matrix grid */}
            <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto p-1" id="chapter-selection-grid">
              {selectedBook.chapters.map((ch) => (
                <button
                  key={ch.number}
                  onClick={() => handleChapterClick(ch.number)}
                  className="py-2.5 text-center font-bold text-xs rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all cursor-pointer shadow-2xs"
                  id={`chapter-btn-${ch.number}`}
                >
                  {ch.number}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
