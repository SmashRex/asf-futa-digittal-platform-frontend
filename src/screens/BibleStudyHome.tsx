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
  RefreshCw
} from 'lucide-react';
import { bibleStudyService, formatStudyDate } from '../services/bibleStudy/bibleStudy.service';
import { BibleStudyItem } from '../types';
import { buildBibleStudyRoute } from '../config/bible.config';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

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
  const isTodayTuesday = new Date().getDay() === 2;
  const [studies, setStudies] = useState<BibleStudyItem[]>([]);
  const [currentStudy, setCurrentStudy] = useState<BibleStudyItem | null>(null);
  const [isLoadingStudies, setIsLoadingStudies] = useState(true);
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(true);
  const [currentStudyError, setCurrentStudyError] = useState<string | null>(null);
  const [studiesError, setStudiesError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoadingStudies(true);
    setIsLoadingCurrent(true);
    setCurrentStudyError(null);
    setStudiesError(null);

    // 1. Fetch current study (GET /api/bible-study/current)
    try {
      const current = await bibleStudyService.getCurrentStudy();
      setCurrentStudy(current);
    } catch (err: any) {
      console.warn('Failed to load current study:', err);
      setCurrentStudyError(err?.message || 'Unable to check today\'s Bible study schedule.');
      setCurrentStudy(null);
    } finally {
      setIsLoadingCurrent(false);
    }

    // 2. Fetch all published studies (GET /api/bible-study)
    try {
      const allStudies = await bibleStudyService.getStudies();
      setStudies(allStudies);
    } catch (err: any) {
      console.warn('Failed to load published studies:', err);
      setStudiesError(err?.message || 'Unable to load study collection.');
    } finally {
      setIsLoadingStudies(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bible-study-page select-none space-y-6 max-w-5xl mx-auto" id="bible-study-home-screen">
      
      {/* Module Title Banner & Navigation */}
      <div className="flex items-center justify-between" id="study-home-header">
        <div>
          <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
            Anglican Students' Fellowship
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-primary)] mt-0.5">
            Bible Study Manual
          </h1>
        </div>

        <button
          onClick={() => navigate('/bible-study/archive')}
          className="py-2 px-3.5 bg-white border border-[var(--color-border)] rounded-xl text-xs font-bold text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          id="study-home-archive-btn"
        >
          <Archive className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>Study Archive</span>
        </button>
      </div>

      {/* EDITORIAL COVER HERO BANNER */}
      <section className="relative overflow-hidden rounded-2xl bg-[#5B0617] text-white p-6 sm:p-8 shadow-sm group" id="bible-study-hero-banner">
        {/* Background Editorial Image with Overlay */}
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=1200" 
          fallbackType="bibleStudy"
          preset="hero"
          alt="The Reign of God: Marriage and Christian Lifestyle" 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-25 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#5B0617]/95 via-[#7A1F2B]/85 to-transparent z-10" />

        <div className="relative z-20 space-y-2 max-w-xl">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-bold tracking-wider uppercase text-amber-200 border border-white/10">
            Annual Theme 2026
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold tracking-tight text-white leading-tight">
            The Reign of God: Marriage and Christian Lifestyle
          </h2>

          <p className="text-xs sm:text-sm text-white/90 font-sans leading-relaxed pt-1">
            Exploring the biblical blueprint for godly lifestyle, covenant relationships, and campus discipleship as Anglican Students' Fellowship (ASF FUTA).
          </p>
        </div>
      </section>

      {/* Offline Alert Banner */}
      {isOfflineSimulated && (
        <div className="bg-[#FAF8F5] border border-[#E4E4E7] p-3 rounded-xl space-y-1 text-center shadow-2xs" id="study-offline-alert">
          <div className="flex items-center justify-center gap-1.5 font-bold text-xs text-[#7A1F2B]">
            <AlertCircle className="w-4 h-4" />
            <span>You are offline — viewing cached local study outlines</span>
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
          
          {/* CURRENT / TODAY'S STUDY CARD */}
          <section className="bg-white border border-[var(--color-border)] p-6 rounded-2xl space-y-4 shadow-2xs" id="todays-study-section">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                <span>{(currentStudy || isTodayTuesday) ? "Today's Bible Study" : "Weekly Fellowship Study"}</span>
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
            ) : isTodayTuesday && !currentStudy ? (
              /* Tuesday Empty State: NO_CURRENT_STUDY */
              <div className="p-8 text-center space-y-3 bg-[var(--color-background)] rounded-xl border border-dashed border-[var(--color-border)]" id="study-unpublished-empty-state">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                  <Clock className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--color-text-primary)]">No Bible Study is scheduled for today.</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-sm mx-auto leading-relaxed">
                    Today is Tuesday, but no Bible study lesson is scheduled or published for today. You can read published lessons from our curriculum below.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/bible-study/archive')}
                  className="px-4 py-2 bg-white border border-[var(--color-border)] text-xs font-bold text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-tint)] transition-all cursor-pointer shadow-2xs"
                >
                  Browse Study Archive
                </button>
              </div>
            ) : !isTodayTuesday && !currentStudy ? (
              /* Non-Tuesday Info State */
              <div className="p-6 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-tint)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-[var(--color-text-primary)]">
                      Fellowship Bible Study meets every Tuesday
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      Our weekly chapter Bible Study convenes on Tuesdays at 5:00 PM. Explore the curriculum collection below to prepare ahead or review past lessons.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentStudy ? (
              /* Active Study Details */
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)]">
                    <span>Lesson {currentStudy.lessonNumber}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-border)]"></span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {currentStudy.scheduledDate ? formatStudyDate(currentStudy.scheduledDate) : currentStudy.date}
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
                    <span>{isTodayTuesday ? "Go to Today's Study" : "Open Scheduled Lesson"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </section>

          {/* BIBLE STUDY COLLECTION (Ordered Timeline) */}
          <section className="space-y-3 pt-2" id="study-collection-section">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Bible Study Collection
              </h3>
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
                  const isActive = currentStudy ? study.id === currentStudy.id : false;
                  return (
                    <div
                      key={study.id}
                      onClick={() => navigate(buildBibleStudyRoute(study.id))}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer bg-white hover:border-[var(--color-primary)] hover:shadow-2xs ${
                        isActive ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20' : 'border-[var(--color-border)]'
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
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-max shrink-0 ${
                            isActive 
                              ? 'bg-[var(--color-primary)] text-white' 
                              : 'bg-[var(--color-background)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                          }`}>
                            {study.scheduledDate ? formatStudyDate(study.scheduledDate) : study.date}
                          </span>
                        </div>

                        {(study.subTheme || study.theme) && (
                          <p className="text-xs text-[var(--color-text-secondary)] font-sans">
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

        {/* RIGHT COLUMN: SERIES CONTEXT (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* ABOUT THIS SERIES CARD */}
          <section className="bg-white border border-[var(--color-border)] p-5 rounded-2xl space-y-3 shadow-2xs" id="about-series-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
              <span>About this Series</span>
            </h3>

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              This semester's study manual explores the profound connection between the Reign of God and our daily lives, focusing on Christian discipleship, academic excellence, moral integrity, and radiating Christ's light across the FUTA campus.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full text-[11px] font-semibold text-[var(--color-text-primary)]">
                Discipleship
              </span>
              <span className="px-2.5 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full text-[11px] font-semibold text-[var(--color-text-primary)]">
                Campus Witness
              </span>
              <span className="px-2.5 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full text-[11px] font-semibold text-[var(--color-text-primary)]">
                Academic Integrity
              </span>
              <span className="px-2.5 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full text-[11px] font-semibold text-[var(--color-text-primary)]">
                2026 Theme
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
                <strong className="text-[var(--color-text-primary)]">When:</strong> Every Tuesday at 5:00 PM (Prompt)
              </p>
              <p>
                <strong className="text-[var(--color-text-primary)]">Where:</strong> Fellowship Auditorium & designated campus centers
              </p>
              <p className="text-[11px] pt-1">
                Bring your Holy Bible, writing materials, and an open heart to be transformed by God's Word.
              </p>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
