/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  Archive, 
  AlertCircle,
  Bookmark,
  ChevronRight,
  Clock,
  Sparkles,
  RefreshCw,
  Home
} from 'lucide-react';
import { bibleStudyService, formatStudyDate } from '../services/bibleStudy/bibleStudy.service';
import { BibleStudyItem } from '../types';
import { buildBibleStudyRoute } from '../config/bible.config';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { useMediaPlacement } from '../hooks/useMediaPlacement';

interface BibleStudyHomeProps {
  isOfflineSimulated?: boolean;
  onToggleOffline?: () => void;
  bookmarkedStudyIds: string[];
}

export default function BibleStudyHome({
  isOfflineSimulated,
  bookmarkedStudyIds
}: BibleStudyHomeProps) {
  const navigate = useNavigate();
  const [studies, setStudies] = useState<BibleStudyItem[]>([]);
  const [currentStudy, setCurrentStudy] = useState<BibleStudyItem | null>(null);
  const [semesterTheme, setSemesterTheme] = useState<string | null>(null);
  const [seriesTitle, setSeriesTitle] = useState<string | null>(null);
  const [isLoadingStudies, setIsLoadingStudies] = useState(true);
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(true);
  const [currentStudyError, setCurrentStudyError] = useState<string | null>(null);
  const [studiesError, setStudiesError] = useState<string | null>(null);

  // Global theme image placement
  const { asset: themeAsset } = useMediaPlacement('public.bible-study.theme');

  const loadData = async () => {
    setIsLoadingStudies(true);
    setIsLoadingCurrent(true);
    setCurrentStudyError(null);
    setStudiesError(null);

    let activeCurrent: BibleStudyItem | null = null;
    let activeStudies: BibleStudyItem[] = [];

    // 1. Fetch current study (GET /api/bible-study/current)
    try {
      activeCurrent = await bibleStudyService.getCurrentStudy();
      setCurrentStudy(activeCurrent);
    } catch (err: any) {
      console.warn('Failed to load current study:', err);
      setCurrentStudyError(err?.message || 'Unable to check today\'s Bible study schedule.');
      setCurrentStudy(null);
    } finally {
      setIsLoadingCurrent(false);
    }

    // 2. Fetch all published studies (GET /api/bible-study)
    try {
      activeStudies = await bibleStudyService.getStudies();
      setStudies(activeStudies);
    } catch (err: any) {
      console.warn('Failed to load published studies:', err);
      setStudiesError(err?.message || 'Unable to load study collection.');
    } finally {
      setIsLoadingStudies(false);
    }

    // 3. Resolve Semester Theme and Series Title dynamically
    let resolvedTheme: string | null = null;
    let resolvedTitle: string | null = null;

    const targetSeriesId = activeCurrent?.seriesId || activeStudies.find(s => Boolean(s.seriesId))?.seriesId;
    if (targetSeriesId) {
      try {
        const seriesData = await bibleStudyService.getSeriesById(targetSeriesId);
        if (seriesData?.theme) {
          resolvedTheme = seriesData.theme;
        }
        if (seriesData?.title) {
          resolvedTitle = seriesData.title;
        }
      } catch (err) {
        console.warn('Failed to load series details for theme:', err);
      }
    }

    if (!resolvedTheme) {
      resolvedTheme = activeCurrent?.theme || activeStudies.find(s => Boolean(s.theme))?.theme || null;
    }
    if (!resolvedTitle) {
      resolvedTitle = activeCurrent?.seriesTitle || activeStudies.find(s => Boolean(s.seriesTitle))?.seriesTitle || null;
    }

    setSemesterTheme(resolvedTheme);
    setSeriesTitle(resolvedTitle);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bible-study-page select-none space-y-6 max-w-5xl mx-auto" id="bible-study-home-screen">
      
      {/* Breadcrumb Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3" id="study-home-header">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] font-medium">
            <button 
              onClick={() => navigate('/')} 
              className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-[var(--color-text-primary)] font-semibold">Bible Study</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-primary)]">
            Bible Study Manual
          </h1>
        </div>

        <button
          onClick={() => navigate('/bible-study/archive')}
          className="py-2 px-3.5 bg-white border border-[var(--color-border)] rounded-xl text-xs font-bold text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto"
          id="study-home-archive-btn"
        >
          <Archive className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>Study Archive</span>
        </button>
      </div>

      {/* SEMESTER THEME & THEME IMAGE HERO BANNER */}
      <section 
        className="relative overflow-hidden rounded-2xl bg-[#5B0617] text-white p-6 sm:p-8 shadow-sm group" 
        id="bible-study-hero-banner"
      >
        {/* Background Theme Image via placement public.bible-study.theme */}
        {themeAsset?.url && (
          <ImageWithFallback 
            src={themeAsset.url} 
            fallbackType="bibleStudy"
            preset="hero"
            alt={themeAsset.altText || semesterTheme || "Bible Study Semester Theme"} 
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* High-Contrast Gradient Overlay for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5B0617]/95 via-[#7A1F2B]/85 to-transparent z-10" />

        {/* Decorative ASF Watermark Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none z-10 flex items-center justify-end pr-6">
          <svg viewBox="0 0 200 200" className="w-56 h-56 text-amber-200 fill-current">
            <path d="M100 15 L108 85 L178 93 L108 101 L100 171 L92 101 L22 93 L92 85 Z" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 space-y-2 max-w-xl">
          {semesterTheme ? (
            <>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-bold tracking-wider uppercase text-amber-200 border border-white/10">
                Semester Theme
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold tracking-tight text-white leading-tight">
                {semesterTheme}
              </h2>

              {seriesTitle && seriesTitle.toLowerCase() !== semesterTheme.toLowerCase() && (
                <p className="text-xs sm:text-sm text-white/90 font-sans leading-relaxed pt-1">
                  Series: {seriesTitle}
                </p>
              )}
            </>
          ) : (
            <>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-bold tracking-wider uppercase text-amber-200 border border-white/10">
                Bible Study Manual
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold tracking-tight text-white leading-tight">
                Anglican Students' Fellowship Bible Study
              </h2>

              <p className="text-xs sm:text-sm text-white/90 font-sans leading-relaxed pt-1">
                Weekly fellowship outlines, structured study guides, and scripture meditation for campus discipleship.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Offline Alert Banner (No em dashes) */}
      {isOfflineSimulated && (
        <div className="bg-[#FAF8F5] border border-[#E4E4E7] p-3 rounded-xl space-y-1 text-center shadow-2xs" id="study-offline-alert">
          <div className="flex items-center justify-center gap-1.5 font-bold text-xs text-[#7A1F2B]">
            <AlertCircle className="w-4 h-4" />
            <span>You are offline (viewing cached local study outlines)</span>
          </div>
          <p className="text-[11px] text-[#52525B] leading-relaxed">
            Previously cached study outlines remain fully accessible for offline fellowship reading.
          </p>
        </div>
      )}

      {/* MAIN TWO-COLUMN GRID ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="bible-study-main-grid">
        
        {/* LEFT COLUMN: TODAY'S STUDY & STUDY COLLECTION (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TODAY'S BIBLE STUDY (PRIORITIZED) */}
          <section className="bg-white border border-[var(--color-border)] p-6 rounded-2xl space-y-4 shadow-2xs" id="todays-study-section">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Today's Bible Study</span>
              </div>

              {currentStudy && (
                <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary-tint)] px-3 py-1 rounded-full border border-[var(--color-primary)]/20">
                  Lesson {currentStudy.lessonNumber}
                </span>
              )}
            </div>

            {isLoadingCurrent ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-2">
                <div className="animate-spin rounded-full h-7 w-7 border-2 border-[var(--color-primary)] border-t-transparent" />
                <span className="text-xs text-[var(--color-text-secondary)]">Checking fellowship schedule...</span>
              </div>
            ) : currentStudyError ? (
              /* Network or Server Error State */
              <div className="p-8 text-center space-y-3 bg-[var(--color-background)] rounded-xl border border-dashed border-[var(--color-border)]">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600 border border-red-100">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Unable to Check Study Schedule</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-sm mx-auto leading-relaxed">
                    {currentStudyError}
                  </p>
                </div>
                <button
                  onClick={loadData}
                  className="px-4 py-2 bg-white border border-[var(--color-border)] text-xs font-bold text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-tint)] transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            ) : !currentStudy ? (
              /* Intentional Empty State: No Study Scheduled Today */
              <div className="p-6 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] space-y-3" id="study-no-current-state">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-tint)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-[var(--color-text-primary)]">
                      No Bible Study is scheduled for today.
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      Active fellowship outlines are published according to the official curriculum calendar. You can explore the full curriculum collection below to read past outlines and prepare for upcoming lessons.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Active Current Study Card */
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)]">
                    <span>Lesson {currentStudy.lessonNumber}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-border)]"></span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {currentStudy.scheduledDate 
                        ? formatStudyDate(currentStudy.scheduledDate) 
                        : (currentStudy.studyDate ? formatStudyDate(currentStudy.studyDate) : currentStudy.date)}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[var(--color-text-primary)] mt-1">
                    {currentStudy.title || currentStudy.topic}
                  </h3>

                  {(currentStudy.subTheme || currentStudy.theme) && (
                    <p className="text-xs font-medium text-[var(--color-text-secondary)] mt-0.5">
                      Theme: <span className="text-[var(--color-primary)] font-semibold">{currentStudy.subTheme || currentStudy.theme}</span>
                    </p>
                  )}
                </div>

                {/* Key Scripture Badge */}
                {(currentStudy.textRef || currentStudy.keyScripture) && (
                  <div className="bg-[var(--color-background)] p-3.5 rounded-xl border border-[var(--color-border)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                      <span className="font-bold text-[var(--color-text-primary)]">
                        Scripture Reading: {currentStudy.textRef || currentStudy.keyScripture}
                      </span>
                    </div>
                    {bookmarkedStudyIds.includes(currentStudy.id) && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary)]">
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                        Saved
                      </span>
                    )}
                  </div>
                )}

                {/* Summary or introduction snippet */}
                {(currentStudy.summary || currentStudy.introduction) && (
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2 font-sans">
                    {currentStudy.summary || currentStudy.introduction}
                  </p>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => navigate(buildBibleStudyRoute(currentStudy.id))}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-[#5B0617] transition-all min-h-[44px] shadow-xs cursor-pointer active:scale-95"
                    id="go-to-todays-study-btn"
                  >
                    <span>Go to Today's Study</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* BIBLE STUDY COLLECTION (Entire Curriculum Accessible) */}
          <section className="space-y-3 pt-2" id="study-collection-section">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Bible Study Collection
                </h3>
              </div>
              <button
                onClick={() => navigate('/bible-study/archive')}
                className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Full Archive</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {isLoadingStudies ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-2">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-[var(--color-primary)] border-t-transparent" />
                <span className="text-xs text-[var(--color-text-secondary)]">Loading curriculum lessons...</span>
              </div>
            ) : studiesError ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 text-center">
                {studiesError}
              </div>
            ) : studies.length === 0 ? (
              <div className="p-8 text-center bg-white border border-[var(--color-border)] rounded-2xl space-y-2">
                <BookOpen className="w-8 h-8 text-[var(--color-text-secondary)] mx-auto opacity-50" />
                <h4 className="font-bold text-sm text-[var(--color-text-primary)]">No Published Lessons Yet</h4>
                <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                  Curriculum outlines will appear here once published by the Bible Study unit.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {studies.map((study) => {
                  const isCurrent = currentStudy ? study.id === currentStudy.id : false;
                  const displayDate = study.scheduledDate 
                    ? formatStudyDate(study.scheduledDate) 
                    : (study.studyDate ? formatStudyDate(study.studyDate) : formatStudyDate(study.date));

                  return (
                    <div
                      key={study.id}
                      onClick={() => navigate(buildBibleStudyRoute(study.id))}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer bg-white hover:border-[var(--color-primary)] hover:shadow-2xs ${
                        isCurrent ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20' : 'border-[var(--color-border)]'
                      }`}
                      id={`study-item-${study.id}`}
                    >
                      {/* Numbered Circle Badge */}
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary-tint)] text-[var(--color-primary)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {study.lessonNumber}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-sm font-bold font-serif text-[var(--color-text-primary)] truncate">
                            {study.title || study.topic}
                          </h4>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white">
                                Today's Study
                              </span>
                            )}
                            {displayDate && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-background)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                                {displayDate}
                              </span>
                            )}
                          </div>
                        </div>

                        {(study.subTheme || study.theme) && (
                          <p className="text-xs text-[var(--color-text-secondary)] font-sans truncate">
                            {study.subTheme || study.theme}
                          </p>
                        )}

                        {(study.textRef || study.keyScripture) && (
                          <p className="text-[11px] font-semibold text-[var(--color-primary)] flex items-center gap-1">
                            <span>Key Text:</span>
                            <span>{study.textRef || study.keyScripture}</span>
                          </p>
                        )}
                      </div>

                      <ChevronRight className="w-4 h-4 text-[var(--color-text-secondary)] shrink-0 self-center" />
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>

        {/* RIGHT COLUMN: SERIES & FELLOWSHIP CONTEXT (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* ABOUT THIS SERIES / CURRICULUM */}
          <section className="bg-white border border-[var(--color-border)] p-5 rounded-2xl space-y-3 shadow-2xs" id="about-series-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
              <span>About this Curriculum</span>
            </h3>

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              {semesterTheme 
                ? `Our current semester curriculum centers on "${semesterTheme}", guiding students through scriptural foundations, moral integrity, academic discipline, and Christlike character across campus life.`
                : `The ASF FUTA Bible Study curriculum guides students through scriptural foundations, moral integrity, academic discipline, and Christlike character across campus life.`}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full text-[11px] font-semibold text-[var(--color-text-primary)]">
                Discipleship
              </span>
              <span className="px-2.5 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full text-[11px] font-semibold text-[var(--color-text-primary)]">
                Campus Witness
              </span>
              <span className="px-2.5 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full text-[11px] font-semibold text-[var(--color-text-primary)]">
                Scripture Study
              </span>
            </div>
          </section>

          {/* FELLOWSHIP SCHEDULE INFORMATION */}
          <section className="bg-[var(--color-background)] border border-[var(--color-border)] p-5 rounded-2xl space-y-3 text-xs" id="fellowship-schedule-card">
            <h4 className="font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Weekly Bible Study Meetings</span>
            </h4>
            <div className="space-y-2 text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                <strong className="text-[var(--color-text-primary)]">When:</strong> Weekly Tuesday fellowship schedule
              </p>
              <p>
                <strong className="text-[var(--color-text-primary)]">Where:</strong> Fellowship Auditorium and campus fellowship centers
              </p>
              <p className="text-[11px] pt-1">
                Bring your Holy Bible, writing materials, and a heart ready to receive God's Word.
              </p>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
