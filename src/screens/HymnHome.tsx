/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { 
  Music, 
  Search, 
  Bookmark, 
  Sparkles, 
  WifiOff, 
  AlertCircle,
  Hash,
  Filter,
  Loader2,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { HymnItem, HymnCategorySummary } from '../types';
import { hymnsService } from '../services/hymns/hymns.service';
import { buildHymnRoute, HYMN_ROUTES } from '../config/hymns.config';
import { HymnCard, HymnSearchBar } from '../components/hymn';
import EmptyState from '../components/EmptyState';

interface HymnHomeProps {
  isOfflineSimulated: boolean;
  onToggleOffline: () => void;
  bookmarkedHymnIds: string[];
}

export default function HymnHome({
  isOfflineSimulated,
  onToggleOffline,
  bookmarkedHymnIds
}: HymnHomeProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'bookmarked'>(
    location.pathname.includes('/bookmarks') ? 'bookmarked' : 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Data state from hymns service
  const [hymns, setHymns] = useState<HymnItem[]>([]);
  const [categorySummaries, setCategorySummaries] = useState<HymnCategorySummary[]>([]);
  const [todayHymn, setTodayHymn] = useState<HymnItem | null>(null);
  const [quickNumbers, setQuickNumbers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync tab with URL location if path changes to bookmarks or search
  useEffect(() => {
    if (location.pathname.includes('/bookmarks')) {
      setActiveTab('bookmarked');
    }
  }, [location.pathname]);

  // Load initial hymns and categories via service
  const loadHymnData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allHymns, catSummaries, today, numbers] = await Promise.all([
        hymnsService.getHymns(),
        hymnsService.getCategorySummaries(),
        hymnsService.getTodayHymn(),
        hymnsService.getQuickNumbers(),
      ]);
      setHymns(allHymns);
      setCategorySummaries(catSummaries);
      setTodayHymn(today);
      setQuickNumbers(numbers);
    } catch (err: any) {
      console.error('Failed to load hymn data:', err);
      setError('Unable to load hymns. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHymnData();
  }, [loadHymnData]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  const handleHymnClick = (hymn: HymnItem) => {
    navigate(buildHymnRoute(hymn.id));
  };

  // Filter logic
  const isSearchActive = searchTerm.trim().length > 0;

  const filteredHymns = useMemo(() => {
    let list = hymns;

    // Apply category filter if not 'All'
    if (selectedCategory !== 'All') {
      list = list.filter(h => h.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Apply active search query
    if (isSearchActive) {
      const term = searchTerm.trim().toLowerCase();
      const isNum = /^\d+$/.test(term);
      if (isNum) {
        const num = parseInt(term, 10);
        return list.filter(h => h.number === num || h.number.toString().includes(term));
      }
      return list.filter(h => 
        h.title.toLowerCase().includes(term) ||
        h.category.toLowerCase().includes(term) ||
        (h.author && h.author.toLowerCase().includes(term)) ||
        (h.chorus && h.chorus.some(line => line.toLowerCase().includes(term))) ||
        h.stanzas.some(s => s.lines.some(l => l.toLowerCase().includes(term)))
      );
    }

    // Apply tabs when not searching
    if (activeTab === 'today') {
      return list.filter(h => h.isTodayService);
    }
    if (activeTab === 'bookmarked') {
      return list.filter(h => bookmarkedHymnIds.includes(h.id));
    }

    return list;
  }, [hymns, selectedCategory, isSearchActive, searchTerm, activeTab, bookmarkedHymnIds]);

  // Exact search match vs related matches when searching
  const exactMatch = useMemo(() => {
    if (!isSearchActive) return null;
    const term = searchTerm.trim().toLowerCase();
    return filteredHymns.find(h => 
      h.number.toString() === term || 
      h.title.toLowerCase() === term
    ) || null;
  }, [isSearchActive, searchTerm, filteredHymns]);

  const relatedMatches = useMemo(() => {
    if (!isSearchActive) return filteredHymns;
    return exactMatch 
      ? filteredHymns.filter(h => h.id !== exactMatch.id) 
      : filteredHymns;
  }, [isSearchActive, exactMatch, filteredHymns]);

  const featuredHymn = todayHymn || hymns[0];

  return (
    <div className="hymn-page select-none space-y-6 pb-12" id="hymn-home-screen">
      
      {/* Header & Page Title */}
      <div className="flex items-center justify-between" id="hymn-home-header">
        <div>
          <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider block">
            Anglican Students' Fellowship
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-primary)] mt-0.5 flex items-center gap-2">
            <Music className="w-6 h-6 text-[var(--color-primary)] shrink-0" />
            <span>Hymn Book (Song of Praise)</span>
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Praise and Worship Hymns Collection
          </p>
        </div>

        {/* Bookmarks quick link pill */}
        <button
          onClick={() => {
            setActiveTab('bookmarked');
            setSelectedCategory('All');
            handleClearSearch();
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 shadow-2xs cursor-pointer ${
            activeTab === 'bookmarked' && !isSearchActive
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
              : 'bg-white text-[var(--color-primary)] border-[var(--color-border)] hover:bg-[var(--color-primary-tint)]'
          }`}
          id="hymn-home-bookmarks-quick-btn"
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
          <span>Bookmarks ({bookmarkedHymnIds.length})</span>
        </button>
      </div>

      {/* TODAY'S FEATURED HYMN HERO CARD (When not actively searching) */}
      {!isSearchActive && activeTab !== 'bookmarked' && featuredHymn && (
        <section 
          className="bg-surface rounded-xl border border-[var(--color-border)] p-5 relative overflow-hidden shadow-2xs" 
          id="todays-hymn-hero-card"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary-tint)] px-2.5 py-1 rounded-full border border-[var(--color-primary)]/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>TODAY'S HYMN</span>
              </span>
              <span className="text-xs font-bold text-[var(--color-text-secondary)]">
                SOP {featuredHymn.number}
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-text-primary)]">
                {featuredHymn.title}
              </h2>
              {featuredHymn.stanzas?.[0]?.lines?.[0] && (
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-1 italic font-serif">
                  "{featuredHymn.stanzas[0].lines[0]}"
                </p>
              )}
            </div>

            <button
              onClick={() => handleHymnClick(featuredHymn)}
              className="w-full h-11 bg-[var(--color-primary)] text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold hover:bg-[#5B0617] transition-all shadow-2xs cursor-pointer active:scale-98"
              id="open-todays-hymn-btn"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Hymn</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </section>
      )}

      {/* Offline Alert Banner */}
      {isOfflineSimulated && (
        <div className="hymn-offline space-y-1 text-center" id="hymn-offline-alert">
          <div className="flex items-center justify-center gap-1.5 font-bold text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>You are offline — viewing prebundled local SOP hymns</span>
          </div>
          <p className="text-[11px] opacity-90 leading-relaxed">
            Bundled hymns ({quickNumbers.join(', ')}) are cached locally. Unbundled hymns will show offline indicators.
          </p>
        </div>
      )}

      {/* SEARCH BAR SECTION */}
      <section className="sticky top-16 z-30 pt-1 pb-1 bg-[var(--color-background)]" id="hymn-search-section">
        <HymnSearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
        />
      </section>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3" id="hymn-loading-state">
          <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
          <p className="text-xs text-[var(--color-text-secondary)] font-medium">Loading Hymn Book...</p>
        </div>
      )}

      {/* ERROR STATE */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-3" id="hymn-error-state">
          <AlertCircle className="w-8 h-8 text-[var(--color-error)] mx-auto" />
          <p className="text-xs text-red-800 font-semibold">{error}</p>
          <button
            onClick={loadHymnData}
            className="px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-lg hover:bg-[#5B0617] transition-all cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* SEARCH RESULTS VIEW (When query is present) */}
      {!isLoading && !error && isSearchActive && (
        <div className="space-y-6 pt-2" id="hymn-search-results-canvas">
          
          {/* Search Meta Summary */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
            <div>
              <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                Search Results
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Showing {filteredHymns.length} result{filteredHymns.length === 1 ? '' : 's'} for "<span className="font-bold text-[var(--color-primary)]">{searchTerm}</span>"
              </p>
            </div>

            <button
              onClick={handleClearSearch}
              className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Clear Search</span>
            </button>
          </div>

          {filteredHymns.length === 0 ? (
            <EmptyState
              iconName="Search"
              title="No Matching Hymns Found"
              description={`We couldn't find any hymn matching "${searchTerm}". Try searching by hymn number like "201" or title keywords like "Grace" or "Lord".`}
            />
          ) : (
            <div className="space-y-6">
              
              {/* EXACT MATCH GROUP */}
              {exactMatch && (
                <section className="space-y-3" id="hymn-exact-match-section">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>Exact Match</span>
                  </div>

                  <HymnCard
                    hymn={exactMatch}
                    onClick={handleHymnClick}
                    isBookmarked={bookmarkedHymnIds.includes(exactMatch.id)}
                    isOfflineSimulated={isOfflineSimulated}
                    className="border-2 border-[var(--color-primary)]"
                  />
                </section>
              )}

              {/* RELATED MATCHES GROUP */}
              {relatedMatches.length > 0 && (
                <section className="space-y-3" id="hymn-related-matches-section">
                  <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    {exactMatch ? 'Related Hymns' : 'Matching Hymns'} ({relatedMatches.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relatedMatches.map((hymn) => (
                      <HymnCard
                        key={hymn.id}
                        hymn={hymn}
                        variant="compact"
                        onClick={handleHymnClick}
                        isBookmarked={bookmarkedHymnIds.includes(hymn.id)}
                        isOfflineSimulated={isOfflineSimulated}
                      />
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}

        </div>
      )}

      {/* NORMAL HOME CONTENT (Tabs, Quick Lookup, Category Pills & Full List) */}
      {!isLoading && !error && !isSearchActive && (
        <div className="space-y-6">
          
          {/* Quick Number Lookup Chips */}
          {quickNumbers.length > 0 && (
            <section className="space-y-2" id="quick-number-jump-section">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                <Hash className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>Quick Number Lookup</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {quickNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => navigate(buildHymnRoute(num))}
                    className="px-3 py-1.5 bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-full text-xs font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary-tint)] transition-all shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                    id={`quick-hymn-btn-${num}`}
                  >
                    <span>SOP {num}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Filter Tabs Bar */}
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2 text-xs font-bold" id="hymn-tabs-bar">
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedCategory('All');
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                  : 'text-[var(--color-text-secondary)] hover:bg-white'
              }`}
              id="tab-all-hymns"
            >
              All Hymns ({hymns.length})
            </button>

            <button
              onClick={() => {
                setActiveTab('today');
                setSelectedCategory('All');
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                  : 'text-[var(--color-text-secondary)] hover:bg-white'
              }`}
              id="tab-today-hymns"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Today's Service ({hymns.filter(h => h.isTodayService).length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('bookmarked');
                setSelectedCategory('All');
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bookmarked'
                  ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                  : 'text-[var(--color-text-secondary)] hover:bg-white'
              }`}
              id="tab-bookmarked-hymns"
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Bookmarks ({bookmarkedHymnIds.length})</span>
            </button>
          </div>

          {/* Category Filter Chips (When on All tab) */}
          {activeTab === 'all' && categorySummaries.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" id="hymn-category-chips">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-[var(--color-text-primary)] text-white'
                    : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              {categorySummaries.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    selectedCategory === cat.name
                      ? 'bg-[var(--color-text-primary)] text-white'
                      : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-gray-50'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          )}

          {/* Hymn Cards List */}
          <section id="hymn-list-section">
            <h2 className="sr-only">Hymn List</h2>

            {filteredHymns.length === 0 ? (
              <EmptyState
                iconName="Music"
                title={
                  activeTab === 'bookmarked' 
                    ? 'No Bookmarked Hymns' 
                    : 'No Hymns Found'
                }
                description={
                  activeTab === 'bookmarked'
                    ? 'You have not bookmarked any SOP hymns yet. Tap the bookmark icon while reading a hymn to save it here for quick offline access.'
                    : 'No SOP hymns available under this filter.'
                }
              />
            ) : (
              <div className="hymn-list space-y-2.5" id="hymn-cards-container">
                {filteredHymns.map((hymn) => (
                  <HymnCard
                    key={hymn.id}
                    hymn={hymn}
                    onClick={handleHymnClick}
                    isBookmarked={bookmarkedHymnIds.includes(hymn.id)}
                    isOfflineSimulated={isOfflineSimulated}
                  />
                ))}
              </div>
            )}
          </section>

        </div>
      )}

    </div>
  );
}
