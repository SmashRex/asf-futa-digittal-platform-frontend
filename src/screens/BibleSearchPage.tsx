/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  ArrowLeft, 
  X, 
  Clock, 
  BookMarked, 
  BookOpen, 
  ChevronRight, 
  AlertCircle, 
  Tag 
} from 'lucide-react';
import { bibleService } from '../services/bible/bible.service';
import { BibleSearchResult } from '../types';
import { buildBibleRoute } from '../config/bible.config';
import BibleReferenceOverlay from '../components/BibleReferenceOverlay';
import BibleReferenceLink from '../components/bible/BibleReferenceLink';

interface BibleSearchPageProps {
  activeVersionId: string;
}

export default function BibleSearchPage({ activeVersionId }: BibleSearchPageProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(query);
  const [results, setResults] = useState<BibleSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Recent Searches State
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('asf_bible_recent_searches');
    return saved ? JSON.parse(saved) : ['Romans 8:28', 'Faith', 'John 3:16'];
  });

  // Suggested Topics List
  const suggestedTopics = ['Love', 'Hope', 'Grace', 'Forgiveness', 'Peace', 'Discipleship'];

  // Reusable Reference Overlay State
  const [overlayRef, setOverlayRef] = useState('');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setInputVal(query);
    if (query.trim()) {
      setIsLoading(true);
      bibleService.searchBible(query, activeVersionId)
        .then(searchRes => {
          if (isMounted) {
            setResults(searchRes);
            setIsLoading(false);
          }
        })
        .catch(err => {
          console.error('Search error:', err);
          if (isMounted) {
            setResults([]);
            setIsLoading(false);
          }
        });
    } else {
      setResults([]);
    }
    return () => { isMounted = false; };
  }, [query, activeVersionId]);

  const executeSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    
    setInputVal(trimmed);
    setSearchParams({ q: trimmed });

    // Update recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem('asf_bible_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      executeSearch(inputVal);
    }
  };

  const handleClearInput = () => {
    setInputVal('');
    setSearchParams({});
    setResults([]);
  };

  const handleRemoveRecentItem = (e: React.MouseEvent, itemToRemove: string) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(item => item !== itemToRemove);
      localStorage.setItem('asf_bible_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllRecents = () => {
    setRecentSearches([]);
    localStorage.removeItem('asf_bible_recent_searches');
  };

  const handleResultClick = (bookId: string, chapterNum: number, verseNum?: number) => {
    navigate(buildBibleRoute(bookId, chapterNum, verseNum));
  };

  const handleLaunchOverlay = (ref: string) => {
    setOverlayRef(ref);
    setIsOverlayOpen(true);
  };

  return (
    <div className="bible-page select-none space-y-6 max-w-2xl mx-auto px-4 py-3" id="bible-search-screen">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
        <button
          onClick={() => navigate('/bible')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#52525B] hover:text-[#7A1F2B] transition-colors py-1 cursor-pointer"
          id="search-back-home-btn"
        >
          <ArrowLeft className="w-4 h-4 text-[#7A1F2B]" />
          <span>Back to Scripture Home</span>
        </button>

        <h1 className="text-sm font-bold uppercase tracking-wider text-[#18181B]">
          Search Bible
        </h1>
      </div>

      {/* Prominent Search Bar */}
      <form onSubmit={handleSubmit} className="relative" id="bible-search-page-form">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-[#52525B] pointer-events-none">
            <Search className="w-5 h-5 text-[#7A1F2B]" />
          </span>

          <input
            type="text"
            placeholder="Search word, phrase, or reference (e.g. John 3:16)..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full pl-12 pr-20 py-3.5 bg-white border border-[#E4E4E7] rounded-xl text-sm font-sans text-[#18181B] placeholder-[#52525B]/60 shadow-2xs focus:outline-none focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/10 transition-all"
            id="bible-search-page-input"
            autoFocus
          />

          {/* Action buttons inside search box */}
          <div className="absolute right-3 flex items-center gap-1.5">
            {inputVal && (
              <button
                type="button"
                onClick={handleClearInput}
                className="p-1 rounded-full text-[#52525B] hover:text-[#18181B] hover:bg-[#E4E4E7]/50 transition-colors cursor-pointer"
                aria-label="Clear search text"
                id="search-clear-input-btn"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#7A1F2B] text-white text-xs font-bold rounded-lg hover:bg-[#5B0617] active:scale-95 transition-all shadow-2xs cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* When no query is active: Show Recent Searches & Suggested Topics */}
      {!query.trim() ? (
        <div className="space-y-6 pt-1">

          {/* Recent Searches Section */}
          {recentSearches.length > 0 && (
            <div className="space-y-3" id="recent-searches-section">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#7A1F2B]" />
                  <span>Recent Searches</span>
                </h2>
                <button
                  onClick={handleClearAllRecents}
                  className="text-[11px] font-medium text-[#52525B] hover:text-[#7A1F2B] transition-colors cursor-pointer"
                  id="clear-all-recents-btn"
                >
                  Clear history
                </button>
              </div>

              <div className="bg-white border border-[#E4E4E7] rounded-xl divide-y divide-[#E4E4E7] overflow-hidden shadow-2xs">
                {recentSearches.map((item) => (
                  <div
                    key={item}
                    onClick={() => executeSearch(item)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-[#FDFBF9] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#52525B] group-hover:text-[#7A1F2B] transition-colors" />
                      <span className="text-sm font-medium text-[#18181B] group-hover:text-[#7A1F2B] transition-colors">
                        {item}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleRemoveRecentItem(e, item)}
                        className="p-1 rounded-full text-[#52525B] hover:text-[#7A1F2B] hover:bg-[#E4E4E7]/50 transition-colors cursor-pointer"
                        title="Remove from history"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-[#E4E4E7] group-hover:text-[#7A1F2B] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Topics Section */}
          <div className="space-y-3" id="suggested-topics-section">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#7A1F2B]" />
              <span>Suggested Topics</span>
            </h2>

            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => executeSearch(topic)}
                  className="px-3.5 py-1.5 bg-white border border-[#E4E4E7] text-[#18181B] text-xs font-medium rounded-full hover:border-[#7A1F2B]/40 hover:bg-[#7A1F2B]/5 hover:text-[#7A1F2B] transition-all shadow-2xs active:scale-95 cursor-pointer"
                  id={`topic-chip-${topic.toLowerCase()}`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Reference Overlay Tester Panel */}
          <div className="bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl p-4 space-y-3 mt-6 shadow-2xs" id="bible-overlay-tester-section">
            <div className="flex gap-2.5 text-[#18181B]">
              <BookMarked className="w-5 h-5 text-[#7A1F2B] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A1F2B]">Direct Reference Links</h4>
                <p className="text-xs mt-1 text-[#52525B] leading-relaxed">
                  Tap a scripture reference below to navigate directly to Holy Bible reader.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {['John 3:16', 'Genesis 1:1', 'Romans 8:28', 'Matthew 6:33'].map((ref) => (
                <BibleReferenceLink
                  key={ref}
                  reference={ref}
                  variant="badge"
                  mode="navigate"
                  showIcon={true}
                />
              ))}
            </div>
          </div>

        </div>
      ) : isLoading ? (
        /* Loading State */
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#7A1F2B] border-t-transparent"></div>
          <span className="text-xs text-[#52525B] font-medium">Searching scripture records...</span>
        </div>
      ) : results.length === 0 ? (
        /* No Results State */
        <div className="bg-white border border-[#E4E4E7] rounded-xl p-8 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E4E4E7] flex items-center justify-center mx-auto text-[#52525B]">
            <AlertCircle className="w-6 h-6 text-[#7A1F2B]" />
          </div>
          <h3 className="text-sm font-bold text-[#18181B]">No matches found</h3>
          <p className="text-xs text-[#52525B] max-w-sm mx-auto leading-relaxed">
            We couldn't find matches for "{query}". Try searching for keywords like "light", "beginning", "love", or references like "John 3:16".
          </p>
          <button
            onClick={handleClearInput}
            className="px-4 py-2 bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-bold text-[#7A1F2B] rounded-lg hover:bg-[#E4E4E7]/40 transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* Search Results Listing */
        <div className="space-y-4" id="bible-search-results-container">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-[#52525B] uppercase tracking-wider">
              {results.length} Matches Found
            </span>
            <span className="text-[10px] text-[#52525B] uppercase font-semibold bg-white px-2 py-0.5 rounded-full border border-[#E4E4E7]">
              {activeVersionId === 'web' ? 'World English Bible (WEB)' : 'King James Version (KJV)'}
            </span>
          </div>

          <div className="space-y-3">
            {results.map((res, idx) => {
              const displayRef = res.reference || `${res.bookName || res.bookId} ${res.chapter}:${res.verse}`;
              return (
                <div
                  key={idx}
                  onClick={() => handleResultClick(res.bookId, res.chapter, res.verse)}
                  className="bg-white border border-[#E4E4E7] rounded-xl p-4 hover:border-[#7A1F2B]/40 hover:shadow-2xs transition-all cursor-pointer group"
                  id={`search-result-item-${idx}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#7A1F2B]" />
                      <span className="text-sm font-bold text-[#7A1F2B]">
                        {displayRef}
                      </span>
                    </div>
                    <span className="text-xs text-[#52525B] font-medium group-hover:text-[#7A1F2B] flex items-center gap-1 transition-colors">
                      <span>Read in Bible</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <p className="font-serif text-sm text-[#18181B] leading-relaxed pl-6 border-l-2 border-[#7A1F2B]/20 group-hover:border-[#7A1F2B] transition-colors">
                    "{res.text}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Global reusable Bible Reference Overlay modal popup */}
      <BibleReferenceOverlay
        reference={overlayRef}
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        initialVersionId={activeVersionId}
      />
    </div>
  );
}
