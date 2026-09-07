/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  Bookmark,
  Archive
} from 'lucide-react';
import { bibleStudyService } from '../services/bibleStudy/bibleStudy.service';
import { BibleStudyItem } from '../types';
import { buildBibleStudyRoute } from '../config/bible.config';
import EmptyState from '../components/EmptyState';

interface BibleStudyArchiveProps {
  bookmarkedStudyIds: string[];
}

export default function BibleStudyArchive({ bookmarkedStudyIds }: BibleStudyArchiveProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [studies, setStudies] = useState<BibleStudyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function loadArchive() {
      try {
        const data = await bibleStudyService.getStudies();
        if (!isMounted) return;
        setStudies(data);
      } catch (err) {
        console.error('Failed to load study archive:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadArchive();
    return () => { isMounted = false; };
  }, []);

  const filteredStudies = studies.filter(study => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      study.title.toLowerCase().includes(term) ||
      study.keyScripture.toLowerCase().includes(term) ||
      study.summary.toLowerCase().includes(term) ||
      study.subTheme.toLowerCase().includes(term) ||
      `lesson ${study.lessonNumber}`.includes(term)
    );
  });

  return (
    <div className="study-page select-none space-y-6 max-w-4xl mx-auto" id="bible-study-archive-screen">
      
      {/* Back button */}
      <button
        onClick={() => navigate('/bible-study')}
        className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors self-start cursor-pointer"
        id="archive-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Bible Study Home</span>
      </button>

      {/* Header title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[var(--color-primary)]">
          <Archive className="w-5 h-5" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">Fellowship Manual</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-primary)]">
          Bible Study Archive
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Browse previous weekly outlines, topics, study manuals, and scripture references
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative" id="archive-search-form">
        <input
          type="text"
          placeholder="Search studies by topic, scripture, or lesson number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-[var(--color-border)] pl-10 pr-4 py-3 rounded-xl text-xs shadow-2xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/70 focus:outline-none focus:border-[var(--color-primary)]"
          id="archive-search-input"
        />
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--color-text-secondary)] pointer-events-none">
          <Search className="w-4 h-4 text-[var(--color-primary)]" />
        </span>
      </div>

      {/* Studies List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent" />
          <span className="text-xs text-[var(--color-text-secondary)]">Loading archive...</span>
        </div>
      ) : filteredStudies.length === 0 ? (
        <EmptyState
          iconName="Search"
          title="No Studies Match Your Search"
          description={`We couldn't find any archived lessons matching "${searchTerm}". Try searching for 'discipleship', 'faith', or 'Genesis'.`}
        />
      ) : (
        <div className="space-y-3.5" id="archive-studies-list">
          <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider px-1 block">
            {filteredStudies.length} Archived {filteredStudies.length === 1 ? 'Lesson' : 'Lessons'}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredStudies.map((study) => {
              const isBookmarked = bookmarkedStudyIds.includes(study.id);
              return (
                <div
                  key={study.id}
                  onClick={() => navigate(buildBibleStudyRoute(study.id))}
                  className="bg-white border border-[var(--color-border)] p-4 rounded-xl space-y-3 hover:border-[var(--color-primary)] hover:shadow-2xs transition-all relative cursor-pointer group flex flex-col justify-between"
                  id={`archive-card-${study.id}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-primary)]">
                          <span className="bg-[var(--color-primary-tint)] px-2 py-0.5 rounded-md">
                            Lesson {study.lessonNumber}
                          </span>
                          <span>•</span>
                          <span className="text-[var(--color-text-secondary)] flex items-center gap-1 font-medium">
                            <Calendar className="w-3 h-3" />
                            {study.date}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-base text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                          {study.title}
                        </h3>
                      </div>

                      {isBookmarked && (
                        <Bookmark className="w-4 h-4 text-[var(--color-primary)] fill-current shrink-0 mt-1" />
                      )}
                    </div>

                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed font-sans">
                      {study.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold pt-2.5 border-t border-[var(--color-border)]">
                    <span className="text-[var(--color-primary)] flex items-center gap-1 text-[11px]">
                      <BookOpen className="w-3.5 h-3.5" />
                      Key Text: {study.keyScripture}
                    </span>
                    <span className="text-[var(--color-text-secondary)] flex items-center gap-0.5 text-[11px] group-hover:text-[var(--color-primary)] transition-colors">
                      <span>Read</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
