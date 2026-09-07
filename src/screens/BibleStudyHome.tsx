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
  WifiOff, 
  AlertCircle,
  Bookmark,
  ChevronRight,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { bibleStudyService } from '../services/bibleStudy/bibleStudy.service';
import { BibleStudyItem } from '../types';
import { buildBibleStudyRoute } from '../config/bible.config';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface BibleStudyHomeProps {
  isOfflineSimulated: boolean;
  onToggleOffline: () => void;
  bookmarkedStudyIds: string[];
}

export default function BibleStudyHome({
  isOfflineSimulated,
  onToggleOffline,
  bookmarkedStudyIds
}: BibleStudyHomeProps) {
  const navigate = useNavigate();
  const [isStudyPublished, setIsStudyPublished] = useState(true);
  const [studies, setStudies] = useState<BibleStudyItem[]>([]);
  const [currentStudy, setCurrentStudy] = useState<BibleStudyItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function loadBibleStudies() {
      try {
        const [allList, latest] = await Promise.all([
          bibleStudyService.getStudies(),
          bibleStudyService.getLatestStudy()
        ]);
        if (!isMounted) return;
        setStudies(allList);
        setCurrentStudy(latest || allList[0] || null);
      } catch (err) {
        console.error('Failed to load Bible studies:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadBibleStudies();
    return () => { isMounted = false; };
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
          
          {/* TODAY'S BIBLE STUDY CARD */}
          <section className="bg-white border border-[var(--color-border)] p-6 rounded-2xl space-y-4 shadow-2xs" id="todays-study-section">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Today's Bible Study</span>
              </div>

              {currentStudy && isStudyPublished && (
                <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary-tint)] px-3 py-1 rounded-full border border-[var(--color-primary)]/20">
                  Lesson {currentStudy.lessonNumber}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-2">
                <div className="animate-spin rounded-full h-7 w-7 border-2 border-[var(--color-primary)] border-t-transparent" />
                <span className="text-xs text-[var(--color-text-secondary)]">Loading current session...</span>
              </div>
            ) : !isStudyPublished || !currentStudy ? (
              /* Empty State: No study published for today */
              <div className="p-8 text-center space-y-3 bg-[var(--color-background)] rounded-xl border border-dashed border-[var(--color-border)]" id="study-unpublished-empty-state">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                  <Clock className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--color-text-primary)]">No Study Published for Today</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-sm mx-auto leading-relaxed">
                    The Bible Study Coordinator has not published an outline for today yet. Kindly check back later or review previous lessons in the Archive.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/bible-study/archive')}
                  className="px-4 py-2 bg-white border border-[var(--color-border)] text-xs font-bold text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-tint)] transition-all cursor-pointer shadow-2xs"
                >
                  Browse Study Archive
                </button>
              </div>
            ) : (
              /* Published Today's Study Content */
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)]">
                    <span>Study {currentStudy.lessonNumber}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-border)]"></span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {currentStudy.date}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[var(--color-text-primary)] mt-1">
                    {currentStudy.title}
                  </h3>

                  <p className="text-xs font-medium text-[var(--color-text-secondary)] mt-0.5">
                    Sub-Theme: <span className="text-[var(--color-primary)] font-semibold">{currentStudy.subTheme}</span>
                  </p>
                </div>

                {/* Key Scripture Badge */}
                <div className="bg-[var(--color-background)] p-3.5 rounded-xl border border-[var(--color-border)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span className="font-bold text-[var(--color-text-primary)]">
                      Key Scripture: {currentStudy.keyScripture}
                    </span>
                  </div>
                  {bookmarkedStudyIds.includes(currentStudy.id) && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary)]">
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                      Saved
                    </span>
                  )}
                </div>

                {/* Summary snippet */}
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2 font-sans">
                  {currentStudy.summary}
                </p>

                {/* Prominent Action Button */}
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

            <div className="space-y-2.5">
              {studies.map((study) => {
                const isActive = currentStudy ? study.id === currentStudy.id && isStudyPublished : false;
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
                          {study.title}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-max shrink-0 ${
                          isActive 
                            ? 'bg-[var(--color-primary)] text-white' 
                            : 'bg-[var(--color-background)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                        }`}>
                          {study.date}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--color-text-secondary)] font-sans">
                        {study.subTheme}
                      </p>

                      <p className="text-[11px] font-semibold text-[var(--color-primary)] flex items-center gap-1">
                        <span>Key Text:</span>
                        <span>{study.keyScripture}</span>
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[var(--color-text-secondary)] shrink-0 self-center" />
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: SERIES CONTEXT & CONTROLS (4 COLS) */}
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

          {/* SIMULATOR CONTROLS PANEL */}
          <section className="bg-white border border-[var(--color-border)] p-4 rounded-2xl space-y-3 text-xs shadow-2xs" id="study-simulator-panel">
            <h4 className="font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[var(--color-primary)]" />
              <span>State Simulator Controls</span>
            </h4>

            {/* Offline toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WifiOff className={`w-4 h-4 ${isOfflineSimulated ? 'text-[var(--color-error)]' : 'text-[var(--color-text-secondary)]'}`} />
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)]">Offline Mode</p>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">Cached outlines</p>
                </div>
              </div>
              <button
                onClick={onToggleOffline}
                className={`px-3 py-1 rounded-lg font-bold transition-all border cursor-pointer ${
                  isOfflineSimulated 
                    ? 'bg-red-50 text-[var(--color-error)] border-red-200' 
                    : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)]'
                }`}
                id="study-offline-toggle-btn"
              >
                {isOfflineSimulated ? 'Offline' : 'Online'}
              </button>
            </div>

            {/* Publication toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)]">Publication State</p>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">Simulate empty state</p>
                </div>
              </div>
              <button
                onClick={() => setIsStudyPublished(!isStudyPublished)}
                className={`px-3 py-1 rounded-lg font-bold transition-all border cursor-pointer ${
                  !isStudyPublished
                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                    : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)]'
                }`}
                id="study-published-toggle-btn"
              >
                {isStudyPublished ? 'Published' : 'Unpublished'}
              </button>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
