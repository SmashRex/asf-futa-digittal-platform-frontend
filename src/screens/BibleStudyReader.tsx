/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  BookMarked, 
  BookOpen, 
  Flag, 
  Share2, 
  Sparkles, 
  HeartHandshake,
  UtensilsCrossed,
  FileText,
  AlignLeft,
  User,
  Compass,
  MessageSquare
} from 'lucide-react';
import { bibleStudyService, formatStudyDate } from '../services/bibleStudy/bibleStudy.service';
import { bibleService } from '../services/bible/bible.service';
import { BibleStudyItem, BibleResolvedPassage } from '../types';
import BibleReferenceOverlay from '../components/BibleReferenceOverlay';
import BibleReferenceLink from '../components/bible/BibleReferenceLink';
import StudyDocumentViewer from '../components/bibleStudy/StudyDocumentViewer';

interface BibleStudyReaderProps {
  bookmarkedStudyIds: string[];
  onToggleBookmark: (studyId: string) => void;
  activeVersionId: string;
}

export default function BibleStudyReader({
  bookmarkedStudyIds,
  onToggleBookmark,
  activeVersionId
}: BibleStudyReaderProps) {
  const { studyId } = useParams();
  const navigate = useNavigate();

  // Active view tab: 'outline' | 'document'
  const [activeTab, setActiveTab] = useState<'outline' | 'document'>('outline');

  // Study state
  const [study, setStudy] = useState<BibleStudyItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Scripture resolution state (when textContent is null)
  const [resolvedPassage, setResolvedPassage] = useState<BibleResolvedPassage | null>(null);
  const [isLoadingPassage, setIsLoadingPassage] = useState(false);

  // Overlay state
  const [overlayRef, setOverlayRef] = useState('');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Local state for user study guide notes (persisted in localStorage)
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function loadStudy() {
      try {
        const data = await bibleStudyService.getStudyById(studyId || 'study-01');
        if (!isMounted) return;
        setStudy(data);
      } catch (err) {
        console.error('Failed to load study outline:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadStudy();
    return () => { isMounted = false; };
  }, [studyId]);

  // Dynamically resolve Scripture text when textContent is null/empty
  useEffect(() => {
    if (!study) {
      setResolvedPassage(null);
      setIsLoadingPassage(false);
      return;
    }

    // If textContent is already provided directly by backend, no need to query Bible API
    if (study.textContent && study.textContent.trim().length > 0) {
      setResolvedPassage(null);
      setIsLoadingPassage(false);
      return;
    }

    const primaryRef = study.textRef || (Array.isArray(study.textScriptures) && study.textScriptures[0]) || study.keyScripture;
    if (!primaryRef) {
      setResolvedPassage(null);
      setIsLoadingPassage(false);
      return;
    }

    let isMounted = true;
    setIsLoadingPassage(true);

    bibleService.resolveReference(primaryRef, activeVersionId || 'kjv')
      .then((passage) => {
        if (isMounted) {
          setResolvedPassage(passage);
          setIsLoadingPassage(false);
        }
      })
      .catch((err) => {
        console.warn('Could not auto-resolve Scripture text for textRef:', primaryRef, err);
        if (isMounted) {
          setResolvedPassage(null);
          setIsLoadingPassage(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [study, activeVersionId]);

  useEffect(() => {
    if (!study) return;
    try {
      const savedNotes = localStorage.getItem(`asf_study_notes_${study.id}`);
      if (savedNotes) {
        setUserNotes(JSON.parse(savedNotes));
      } else {
        setUserNotes({});
      }
    } catch {
      setUserNotes({});
    }
  }, [study]);

  const isBookmarked = study ? bookmarkedStudyIds.includes(study.id) : false;

  const handleNoteChange = (qId: string, text: string) => {
    if (!study) return;
    const updated = { ...userNotes, [qId]: text };
    setUserNotes(updated);
    try {
      localStorage.setItem(`asf_study_notes_${study.id}`, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const handleBookmarkClick = () => {
    if (!study) return;
    onToggleBookmark(study.id);
    setToastMessage(!isBookmarked ? 'Study outline bookmarked!' : 'Bookmark removed.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleShareClick = () => {
    if (!study) return;
    if (navigator.share) {
      navigator.share({
        title: study.title,
        text: `ASF FUTA Bible Study: ${study.title}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage('Link copied to clipboard!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  // Helper to parse scripture references inside text and make them interactive
  const renderTextWithRefs = (text: string, refs?: string[]) => {
    if (!refs || refs.length === 0) return <span>{text}</span>;

    const escapedRefs = refs.map(r => r.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
    const regex = new RegExp(`(${escapedRefs.join('|')})`, 'gi');

    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, idx) => {
          const matchedRef = refs.find(r => r.toLowerCase() === part.toLowerCase());
          if (matchedRef) {
            return (
              <BibleReferenceLink
                key={idx}
                reference={matchedRef}
                variant="inline"
                mode="navigate"
                className="mx-0.5"
              >
                {part}
              </BibleReferenceLink>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-3 bg-[var(--color-background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent" />
        <span className="text-xs text-[var(--color-text-secondary)] font-medium">Loading Bible Study Outline...</span>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4 bg-[var(--color-background)]" id="study-not-found-state">
        <BookOpen className="w-10 h-10 text-[var(--color-text-secondary)]" />
        <h3 className="text-base font-bold text-[var(--color-text-primary)]">Bible Study Outline Not Found</h3>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-sm">The requested Bible study manual outline could not be loaded or is not published yet.</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] text-xs font-bold rounded-xl cursor-pointer hover:bg-black/5 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => navigate('/bible-study')}
            className="px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#5B0617] transition-colors"
          >
            Return to Bible Study Home
          </button>
        </div>
      </div>
    );
  }

  const textScripturesList = Array.isArray(study.textScriptures) && study.textScriptures.length > 0
    ? study.textScriptures
    : (study.keyScripture ? [study.keyScripture] : (study.textRef ? [study.textRef] : []));

  const displayStudyDate = study.scheduledDate 
    ? formatStudyDate(study.scheduledDate) 
    : (study.studyDate ? formatStudyDate(study.studyDate) : formatStudyDate(study.date));

  const seriesContextTheme = study.theme || study.seriesTitle || (study.annualTheme && study.annualTheme !== study.title ? study.annualTheme : null);

  return (
    <div className="flex-1 flex flex-col bg-[var(--color-background)] select-none" id="bible-study-reader-screen">
      
      {/* Sticky Controls Header Bar */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)] p-3 px-4 sm:px-5 flex items-center justify-between shadow-2xs" id="study-reader-controls">
        <button
          onClick={() => navigate('/bible-study')}
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          id="study-reader-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bible Study</span>
        </button>

        {/* View Switcher Tabs (if documentUrl exists) */}
        {study.documentUrl && (
          <div className="flex items-center bg-[var(--color-background)] p-0.5 rounded-lg border border-[var(--color-border)] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('outline')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'outline'
                  ? 'bg-white text-[var(--color-primary)] shadow-2xs font-bold'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              id="tab-study-outline"
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Outline</span>
            </button>
            <button
              onClick={() => setActiveTab('document')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'document'
                  ? 'bg-white text-[var(--color-primary)] shadow-2xs font-bold'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
              id="tab-study-document"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Manual</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShareClick}
            className="p-2 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-text-secondary)] border border-[var(--color-border)] cursor-pointer"
            title="Share outline link"
            id="study-share-btn"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleBookmarkClick}
            className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
              isBookmarked
                ? 'bg-[var(--color-primary-tint)] border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
            }`}
            id="study-bookmark-btn"
          >
            {isBookmarked ? (
              <BookMarked className="w-4 h-4 fill-current text-[var(--color-primary)]" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
        </div>
      </header>

      {/* Main Study Reader Canvas */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:py-10" id="study-reader-workspace">
        {activeTab === 'document' && study.documentUrl ? (
          <div className="max-w-4xl mx-auto w-full">
            <StudyDocumentViewer
              documentUrl={study.documentUrl}
              documentType={study.documentType || 'pdf'}
              title={study.title}
              lessonNumber={study.lessonNumber}
              author={study.author}
            />
          </div>
        ) : (
          <article className="study-reader select-text max-w-3xl mx-auto">
            
            {/* Metadata Header with Series Context */}
            <div className="study-reader-header" id="study-metadata-header">
              <span className="study-reader-badge">
                Lesson {study.lessonNumber}
              </span>

              {/* Dynamic Semester Theme / Series Context (Omitted if unavailable) */}
              {seriesContextTheme && (
                <div className="study-reader-theme font-medium text-xs sm:text-sm text-[var(--color-primary)] tracking-wide uppercase">
                  {seriesContextTheme}
                </div>
              )}

              {study.subTheme && study.subTheme !== seriesContextTheme && (
                <div className="study-reader-subtheme font-medium">
                  {study.subTheme}
                </div>
              )}

              {displayStudyDate && (
                <div className="study-reader-date">
                  {displayStudyDate}
                </div>
              )}

              {/* Study Title Topic */}
              <h1 className="study-reader-title" id="study-topic-headline">
                {study.title || study.topic}
              </h1>

              {/* Author / Teacher Credits */}
              {(study.author || study.teacher) && (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-[var(--color-text-secondary)] font-sans">
                  {study.author && (
                    <span className="inline-flex items-center gap-1 bg-white border border-[var(--color-border)] px-2.5 py-1 rounded-md shadow-2xs">
                      <User className="w-3 h-3 text-[var(--color-primary)]" />
                      <span>{study.author}</span>
                    </span>
                  )}
                  {study.teacher && (
                    <span className="inline-flex items-center gap-1 bg-white border border-[var(--color-border)] px-2.5 py-1 rounded-md shadow-2xs">
                      <Compass className="w-3 h-3 text-[var(--color-primary)]" />
                      <span>Teacher: {study.teacher}</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Scripture TEXT Box with Inline Dynamic Scripture Resolution */}
            <div className="study-text-card" id="study-text-box">
              <div className="flex items-center justify-between mb-2">
                <h2 className="study-text-label">Text Scripture Passages</h2>
                <span className="text-[10px] text-[var(--color-text-secondary)] font-sans">
                  Tap to open Holy Bible
                </span>
              </div>

              {/* Interactive Reference Buttons */}
              <div className="flex flex-wrap gap-2">
                {textScripturesList.map((ref) => (
                  <BibleReferenceLink
                    key={ref}
                    reference={ref}
                    variant="button"
                    mode="navigate"
                    showIcon={true}
                  />
                ))}
              </div>

              {/* Directly provided text content */}
              {study.textContent && study.textContent.trim().length > 0 && (
                <div className="mt-3.5 p-4 bg-white rounded-xl border border-[var(--color-border)] text-base font-serif leading-relaxed text-[var(--color-text-primary)] whitespace-pre-line shadow-2xs">
                  {study.textContent}
                </div>
              )}

              {/* Dynamically resolved Scripture passage from Bible API when textContent is null */}
              {!study.textContent && (
                <>
                  {isLoadingPassage && (
                    <div className="mt-3.5 p-4 bg-white/70 rounded-xl border border-[var(--color-border)] flex items-center justify-center gap-2 text-xs text-[var(--color-text-secondary)]">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--color-primary)] border-t-transparent" />
                      <span>Retrieving Scripture passage...</span>
                    </div>
                  )}

                  {!isLoadingPassage && resolvedPassage && resolvedPassage.verses && resolvedPassage.verses.length > 0 && (
                    <div className="mt-3.5 p-4 sm:p-5 bg-white rounded-xl border border-[var(--color-border)] shadow-2xs space-y-3" id="resolved-scripture-box">
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                        <span className="text-xs font-bold text-[var(--color-primary)] font-sans tracking-wide">
                          {resolvedPassage.reference}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase bg-[var(--color-background)] px-2 py-0.5 rounded border border-[var(--color-border)] font-sans">
                          {resolvedPassage.versionId.toUpperCase()}
                        </span>
                      </div>
                      <div className="font-serif text-base sm:text-lg leading-relaxed text-[var(--color-text-primary)]">
                        {resolvedPassage.verses.map((v) => (
                          <span key={v.number} className="inline mr-1.5">
                            <sup className="text-xs font-bold text-[var(--color-primary)] mr-0.5 select-none font-sans">
                              {v.number}
                            </sup>
                            <span>{v.text}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* AIMS SECTION (Conditionally rendered) */}
            {((study.aims && study.aims.length > 0) || (study.aim && study.aim.trim().length > 0)) && (
              <section className="mb-8" id="study-aims-section">
                <h2 className="study-section-heading">
                  <Flag className="w-5 h-5 text-[#fabb53] fill-current" />
                  <span>Aim{study.aims && study.aims.length > 1 ? 's' : ''}</span>
                </h2>
                {study.aims && study.aims.length > 0 ? (
                  <ol className="study-aims-list">
                    {study.aims.map((aim, idx) => (
                      <li key={idx}>
                        {aim}
                      </li>
                    ))}
                  </ol>
                ) : study.aim ? (
                  <p className="font-serif text-lg leading-relaxed text-[var(--color-text-primary)]">
                    {study.aim}
                  </p>
                ) : null}
              </section>
            )}

            {/* INTRODUCTION SECTION (Conditionally rendered) */}
            {study.introduction && study.introduction.trim().length > 0 && (
              <>
                <div className="section-divider" />
                <section className="mb-8" id="study-introduction-section">
                  <h2 className="study-section-heading">Introduction</h2>
                  <div className="space-y-4 font-serif text-lg leading-relaxed text-[var(--color-text-primary)]">
                    <p>{study.introduction}</p>
                  </div>
                </section>
              </>
            )}

            {/* LESSON SECTIONS (IF PRESENT) */}
            {study.sections && study.sections.length > 0 && (
              <section className="mb-8 space-y-6" id="study-sections-block">
                {study.sections.map((sec) => (
                  <div key={sec.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-sans font-bold text-base text-[var(--color-text-primary)]">
                        {sec.title}
                      </h3>
                      {sec.scriptureRefs && sec.scriptureRefs.length > 0 && (
                        <div className="flex gap-1.5">
                          {sec.scriptureRefs.map(sr => (
                            <BibleReferenceLink
                              key={sr}
                              reference={sr}
                              variant="badge"
                              mode="navigate"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="font-serif text-lg leading-relaxed text-[var(--color-text-primary)]">
                        {renderTextWithRefs(p, sec.scriptureRefs)}
                      </p>
                    ))}
                  </div>
                ))}
              </section>
            )}

            {/* STUDY GUIDE SECTION (Questions with Interactive Notes) */}
            {study.studyGuide && study.studyGuide.length > 0 && (
              <section className="mb-8" id="study-guide-section">
                <h2 className="study-section-heading">
                  <BookOpen className="w-5 h-5 text-[#fabb53] fill-current" />
                  <span>Study Guide</span>
                </h2>

                <div className="space-y-4 mt-4">
                  {study.studyGuide.map((item) => (
                    <div key={item.id} className="study-question-card">
                      <div className="flex items-start gap-2">
                        <span className="study-question-number">
                          {item.number}.
                        </span>
                        <div className="flex-1 font-serif text-lg leading-relaxed text-[var(--color-text-primary)]">
                          <p>
                            {renderTextWithRefs(item.question, item.scriptureRefs)}
                          </p>

                          <textarea
                            className="study-notes-textarea mt-3 font-sans text-xs"
                            placeholder="Add your study notes or answers here..."
                            rows={3}
                            value={userNotes[item.id] || ''}
                            onChange={(e) => handleNoteChange(item.id, e.target.value)}
                            id={`note-textarea-${item.id}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* DISCUSSION QUESTIONS (Kept Separate from Study Guide) */}
            {Array.isArray(study.discussionQuestions) && study.discussionQuestions.length > 0 && (
              <section className="mb-8" id="study-discussion-questions-section">
                <h2 className="study-section-heading">
                  <MessageSquare className="w-5 h-5 text-[var(--color-primary)]" />
                  <span>Discussion Questions</span>
                </h2>

                <div className="space-y-3 mt-4">
                  {study.discussionQuestions.map((question, idx) => (
                    <div key={`dq-${idx}`} className="p-4 bg-white rounded-xl border border-[var(--color-border)] shadow-2xs flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[var(--color-primary-tint)] text-[var(--color-primary)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="font-serif text-base sm:text-lg leading-relaxed text-[var(--color-text-primary)] flex-1">
                        {question}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CONCLUSION SECTION (Conditionally rendered) */}
            {study.conclusion && study.conclusion.trim().length > 0 && (
              <>
                <div className="section-divider" />
                <section className="mb-8" id="study-conclusion-section">
                  <h2 className="study-section-heading">Conclusion</h2>
                  <p className="font-serif text-lg leading-relaxed text-[var(--color-text-primary)]">
                    {study.conclusion}
                  </p>
                </section>
              </>
            )}

            {/* FOOD FOR THOUGHT (Conditionally rendered) */}
            {study.foodForThought && study.foodForThought.trim().length > 0 && (
              <section className="study-food-for-thought" id="study-food-for-thought-section">
                <h2 className="study-section-heading text-[var(--color-primary)] mb-2">
                  <UtensilsCrossed className="w-5 h-5 fill-current" />
                  <span>Food for Thought</span>
                </h2>
                <p className="font-serif italic text-lg text-[var(--color-text-primary)] leading-relaxed">
                  {study.foodForThought}
                </p>
              </section>
            )}

            {/* MEMORY VERSE (Structured: Title, "Verse text", Reference - No em dashes) */}
            {study.memoryVerse && (Boolean(study.memoryVerse.reference) || Boolean(study.memoryVerse.text)) && (
              <section className="study-memory-verse-section" id="study-memory-verse-section">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="study-text-label">Memory Verse</h2>
                  {study.memoryVerse.reference && (
                    <BibleReferenceLink
                      reference={study.memoryVerse.reference}
                      variant="badge"
                      mode="navigate"
                      showIcon={true}
                    />
                  )}
                </div>
                {study.memoryVerse.text && (
                  <blockquote className="study-memory-verse-quote">
                    "{study.memoryVerse.text}"
                  </blockquote>
                )}
                {study.memoryVerse.reference && (
                  <cite className="study-memory-verse-cite not-italic block mt-2 text-sm font-semibold text-[var(--color-primary)] font-sans">
                    <BibleReferenceLink
                      reference={study.memoryVerse.reference}
                      variant="inline"
                      mode="navigate"
                    />
                  </cite>
                )}
              </section>
            )}

            {/* CLOSING PRAYER & PRAYER POINTS */}
            {(Boolean(study.prayerText) || (Array.isArray(study.prayerPoints) && study.prayerPoints.length > 0)) && (
              <>
                <div className="section-divider" />
                <section className="mb-12 text-center" id="study-prayer-section">
                  <h2 className="study-section-heading justify-center mb-4">
                    <HeartHandshake className="w-5 h-5 text-[var(--color-primary)]" />
                    <span>Closing Prayer</span>
                  </h2>

                  <div className="study-prayer-card">
                    {study.prayerText && (
                      <p className="font-serif italic text-lg text-[var(--color-text-primary)] leading-relaxed">
                        {study.prayerText}
                      </p>
                    )}
                    {Array.isArray(study.prayerPoints) && study.prayerPoints.length > 0 && (
                      <div className={`space-y-2.5 text-left ${study.prayerText ? 'mt-4 pt-3 border-t border-[var(--color-border)]' : ''}`}>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] font-sans">
                          Prayer Points
                        </h4>
                        {study.prayerPoints.map((p, idx) => (
                          <p key={idx} className="font-serif italic text-base text-[var(--color-text-primary)] leading-relaxed flex items-start gap-2">
                            <span className="text-[var(--color-primary)] font-bold">•</span>
                            <span>{p}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

          </article>
        )}
      </main>

      {/* Dynamic Toast Popup */}
      {toastMessage && (
        <div 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--color-text-primary)] text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-white/10 max-w-sm w-[90%] flex items-start gap-2 animate-bounce z-50 leading-relaxed"
          id="study-reader-toast"
        >
          <div className="bg-white/10 p-1 rounded-full text-[#fabb53] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reused Bible Reference Overlay */}
      <BibleReferenceOverlay
        reference={overlayRef}
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        initialVersionId={activeVersionId}
      />
    </div>
  );
}
