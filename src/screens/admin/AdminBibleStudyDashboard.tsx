/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Users, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Settings,
  Sparkles,
  Calendar,
  Clock,
  Send,
  AlertCircle,
  Loader2,
  Trash2,
  Globe
} from 'lucide-react';
import { 
  bibleStudyService, 
  isDateTuesday, 
  getUpcomingTuesday, 
  formatStudyDate 
} from '../../services/bibleStudy/bibleStudy.service';
import { 
  BibleStudyItem, 
  UploadOutlineResponse, 
  ExtractedStudyFields, 
  DetectedScriptureReference,
  BibleStudySeriesLessonPayload
} from '../../types';
import { StudyOutlineUpload } from '../../components/admin/StudyOutlineUpload';
import { DetectedStudyEditor } from '../../components/admin/DetectedStudyEditor';
import { StudyAliasManager } from '../../components/admin/StudyAliasManager';
import BibleReferenceOverlay from '../../components/BibleReferenceOverlay';

export const AdminBibleStudyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [studies, setStudies] = useState<BibleStudyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAliasManager, setShowAliasManager] = useState(false);
  
  // Multi-study upload and review state
  const [detectedUpload, setDetectedUpload] = useState<UploadOutlineResponse | null>(null);
  const [submittedStudyIds, setSubmittedStudyIds] = useState<Set<number>>(new Set());
  const [reviewedLessons, setReviewedLessons] = useState<BibleStudySeriesLessonPayload[]>([]);

  // Series Commit State
  const [seriesTheme, setSeriesTheme] = useState('');
  const [seriesStartDate, setSeriesStartDate] = useState(getUpcomingTuesday());
  const [isSavingSeries, setIsSavingSeries] = useState(false);
  const [seriesError, setSeriesError] = useState<string | null>(null);

  // Manual Series Creation Modal State
  const [showNewSeriesModal, setShowNewSeriesModal] = useState(false);
  const [manualTheme, setManualTheme] = useState('');
  const [manualStartDate, setManualStartDate] = useState(getUpcomingTuesday());
  const [manualLessons, setManualLessons] = useState<BibleStudySeriesLessonPayload[]>([
    {
      lessonNumber: 1,
      topic: '',
      textRef: '',
      aim: '',
      introduction: '',
      studyGuide: [''],
      conclusion: '',
      memoryVerse: { text: '', reference: '' },
      prayerPoints: ['']
    }
  ]);
  const [isCreatingManualSeries, setIsCreatingManualSeries] = useState(false);
  const [manualSeriesError, setManualSeriesError] = useState<string | null>(null);

  // Reschedule Modal State
  const [reschedulingStudy, setReschedulingStudy] = useState<BibleStudyItem | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState(getUpcomingTuesday());
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // Publishing State
  const [publishingId, setPublishingId] = useState<string | null>(null);

  // Scripture overlay viewer state
  const [activeOverlayRef, setActiveOverlayRef] = useState<string | null>(null);
  const [activeOverlayObj, setActiveOverlayObj] = useState<DetectedScriptureReference | null>(null);

  const [toastMsg, setToastMsg] = useState('');

  const loadOutlines = async () => {
    setIsLoading(true);
    try {
      const data = await bibleStudyService.getStudies();
      setStudies(data);
    } catch (err) {
      console.error('Failed to load Bible studies', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOutlines();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleUploadSuccess = (response: UploadOutlineResponse) => {
    setDetectedUpload(response);
    setSubmittedStudyIds(new Set());
    
    // Extract first non-empty theme as default series theme
    const foundTheme = response.studies.find(s => s.extracted.theme || s.extracted.subTheme);
    setSeriesTheme(foundTheme?.extracted.theme || foundTheme?.extracted.subTheme || 'The Reign of God: Marriage and Christian Lifestyle');
    setSeriesStartDate(getUpcomingTuesday());
    setSeriesError(null);

    // Convert detected studies into series lesson payloads
    const initialLessons: BibleStudySeriesLessonPayload[] = response.studies.map((s, idx) => ({
      lessonNumber: Number(s.extracted.lessonNumber) || (idx + 1),
      topic: s.extracted.title || s.extracted.topic || `Lesson ${idx + 1}`,
      textRef: s.extracted.keyScripture || (s.extracted.textScriptures && s.extracted.textScriptures[0]) || '',
      textContent: s.extracted.textContent || undefined,
      aim: s.extracted.aim || (Array.isArray(s.extracted.aims) ? s.extracted.aims[0] : ''),
      introduction: s.extracted.introduction || '',
      studyGuide: (s.extracted.studyGuide && s.extracted.studyGuide.length > 0)
        ? s.extracted.studyGuide.map(g => g.question || '')
        : (s.extracted.discussionQuestions && s.extracted.discussionQuestions.length > 0)
          ? s.extracted.discussionQuestions
          : [],
      conclusion: s.extracted.conclusion || '',
      memoryVerse: s.extracted.memoryVerse ? {
        text: s.extracted.memoryVerse.text || '',
        reference: s.extracted.memoryVerse.reference || ''
      } : undefined,
      prayerPoints: s.extracted.prayerPoints || []
    }));

    setReviewedLessons(initialLessons);
    triggerToast(`Detected ${response.studiesFound} study outline ${response.studiesFound === 1 ? 'lesson' : 'lessons'} for review.`);
  };

  const handleUpdateReviewedLesson = (index: number, updatedFields: ExtractedStudyFields) => {
    setReviewedLessons(prev => {
      const copy = [...prev];
      copy[index] = {
        lessonNumber: Number(updatedFields.lessonNumber) || (index + 1),
        topic: updatedFields.title || updatedFields.topic || `Lesson ${index + 1}`,
        textRef: updatedFields.keyScripture || (updatedFields.textScriptures && updatedFields.textScriptures[0]) || '',
        textContent: updatedFields.textContent || undefined,
        aim: updatedFields.aim || (Array.isArray(updatedFields.aims) ? updatedFields.aims[0] : ''),
        introduction: updatedFields.introduction || '',
        studyGuide: (updatedFields.studyGuide && updatedFields.studyGuide.length > 0)
          ? updatedFields.studyGuide.map(g => g.question || '')
          : (updatedFields.discussionQuestions && updatedFields.discussionQuestions.length > 0)
            ? updatedFields.discussionQuestions
            : [],
        conclusion: updatedFields.conclusion || '',
        memoryVerse: updatedFields.memoryVerse ? {
          text: updatedFields.memoryVerse.text || '',
          reference: updatedFields.memoryVerse.reference || ''
        } : undefined,
        prayerPoints: updatedFields.prayerPoints || []
      };
      return copy;
    });
  };

  const handleSubmitIndividualStudy = async (index: number, updatedFields: ExtractedStudyFields) => {
    try {
      handleUpdateReviewedLesson(index, updatedFields);
      const submitted = await bibleStudyService.submitStudy(updatedFields);
      setSubmittedStudyIds(prev => new Set(prev).add(index));
      triggerToast(`Published Lesson ${updatedFields.lessonNumber || index + 1}: "${submitted.title}"`);
      await loadOutlines();
    } catch (err: any) {
      console.error('Failed to submit individual study:', err);
      triggerToast(err?.message || 'Failed to submit study outline.');
      throw err;
    }
  };

  const handleCommitEntireSeries = async () => {
    setSeriesError(null);

    if (!seriesTheme.trim()) {
      setSeriesError('Series theme is required.');
      return;
    }

    if (!seriesStartDate) {
      setSeriesError('Series start date is required.');
      return;
    }

    if (!isDateTuesday(seriesStartDate)) {
      setSeriesError('Series start date must fall on a Tuesday (the backend uses this Tuesday to schedule subsequent weekly lessons).');
      return;
    }

    if (reviewedLessons.length === 0) {
      setSeriesError('No lessons available in this series to save.');
      return;
    }

    setIsSavingSeries(true);
    try {
      const response = await bibleStudyService.createSeries({
        title: seriesTheme.trim(),
        theme: seriesTheme.trim(),
        startDate: seriesStartDate,
        lessons: reviewedLessons
      });

      const returnedTheme = response.theme || response.series?.title || seriesTheme;
      triggerToast(`Successfully created series "${returnedTheme}" with ${response.lessons.length} scheduled lessons!`);
      setDetectedUpload(null);
      setReviewedLessons([]);
      await loadOutlines();
    } catch (err: any) {
      console.error('Failed to create series:', err);
      setSeriesError(err?.message || 'Failed to save Bible Study Series. Please check inputs.');
    } finally {
      setIsSavingSeries(false);
    }
  };

  const handleManualAddLesson = () => {
    setManualLessons(prev => [
      ...prev,
      {
        lessonNumber: prev.length + 1,
        topic: '',
        textRef: '',
        aim: '',
        introduction: '',
        studyGuide: [''],
        conclusion: '',
        memoryVerse: { text: '', reference: '' },
        prayerPoints: ['']
      }
    ]);
  };

  const handleManualRemoveLesson = (idx: number) => {
    if (manualLessons.length <= 1) return;
    setManualLessons(prev => prev.filter((_, i) => i !== idx).map((l, i) => ({ ...l, lessonNumber: i + 1 })));
  };

  const handleManualLessonChange = (idx: number, field: keyof BibleStudySeriesLessonPayload, value: any) => {
    setManualLessons(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleCreateManualSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualSeriesError(null);

    if (!manualTheme.trim()) {
      setManualSeriesError('Series theme is required.');
      return;
    }

    if (!isDateTuesday(manualStartDate)) {
      setManualSeriesError('Series start date must fall on a Tuesday.');
      return;
    }

    for (let i = 0; i < manualLessons.length; i++) {
      if (!manualLessons[i].topic.trim()) {
        setManualSeriesError(`Lesson ${i + 1} requires a topic title.`);
        return;
      }
      if (!manualLessons[i].textRef.trim()) {
        setManualSeriesError(`Lesson ${i + 1} requires a scripture reference.`);
        return;
      }
    }

    setIsCreatingManualSeries(true);
    try {
      const response = await bibleStudyService.createSeries({
        title: manualTheme.trim(),
        theme: manualTheme.trim(),
        startDate: manualStartDate,
        lessons: manualLessons
      });

      const returnedTheme = response.theme || response.series?.title || manualTheme;
      triggerToast(`Series "${returnedTheme}" created with ${response.lessons.length} scheduled lessons!`);
      setShowNewSeriesModal(false);
      setManualTheme('');
      setManualStartDate(getUpcomingTuesday());
      setManualLessons([
        {
          lessonNumber: 1,
          topic: '',
          textRef: '',
          aim: '',
          introduction: '',
          studyGuide: [''],
          conclusion: '',
          memoryVerse: { text: '', reference: '' },
          prayerPoints: ['']
        }
      ]);
      await loadOutlines();
    } catch (err: any) {
      setManualSeriesError(err?.message || 'Failed to create Bible Study series.');
    } finally {
      setIsCreatingManualSeries(false);
    }
  };

  const handlePublishStudy = async (studyId: string, title: string) => {
    setPublishingId(studyId);
    try {
      const updated = await bibleStudyService.publishStudy(studyId);
      setStudies(prev => prev.map(s => s.id === studyId ? { ...s, publicationStatus: 'published', isPublished: true } : s));
      triggerToast(`Published lesson: "${title}"`);
    } catch (err: any) {
      triggerToast(err?.message || 'Failed to publish lesson.');
    } finally {
      setPublishingId(null);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingStudy) return;
    setRescheduleError(null);

    if (!isDateTuesday(newRescheduleDate)) {
      setRescheduleError('Scheduled date must fall on a Tuesday.');
      return;
    }

    setIsRescheduling(true);
    try {
      const updated = await bibleStudyService.rescheduleStudy(reschedulingStudy.id, newRescheduleDate);
      setStudies(prev => prev.map(s => s.id === reschedulingStudy.id ? { 
        ...s, 
        scheduledDate: newRescheduleDate,
        date: formatStudyDate(newRescheduleDate)
      } : s));
      triggerToast(`Rescheduled lesson to ${formatStudyDate(newRescheduleDate)}`);
      setReschedulingStudy(null);
    } catch (err: any) {
      setRescheduleError(err?.message || 'Failed to reschedule lesson.');
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleOpenPassage = (ref: DetectedScriptureReference) => {
    setActiveOverlayRef(ref.raw);
    setActiveOverlayObj(ref);
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none" id="bible-study-coordinator-workspace">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 bg-[#5B0617] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#7A1F2B] text-xs font-bold z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-blue-900 text-white rounded">
              BIBLE STUDY WORKSPACE
            </span>
            <span className="text-xs text-[#52525B] font-medium">• Curriculum & Outlines Desk</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Welcome, Bible Study Coordinator
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl">
            Role-scoped workspace for Anglican Students' Fellowship Bible Study Ministry. Create entire curriculum series, upload multi-study syllabus PDFs, review extracted lessons, and manage weekly scheduled studies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowAliasManager(!showAliasManager)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-[#18181B] text-xs font-bold transition-all cursor-pointer"
            id="bs-toggle-aliases-btn"
          >
            <Settings className="w-4 h-4 text-[#52525B]" />
            <span>Parser Aliases</span>
          </button>

          <button
            onClick={() => setShowNewSeriesModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
            id="bs-create-series-btn"
          >
            <Plus className="w-4 h-4" />
            <span>New Study Series</span>
          </button>
        </div>
      </section>

      {/* Optional Aliases Manager Accordion */}
      {showAliasManager && (
        <StudyAliasManager />
      )}

      {/* PDF Multi-Study Upload Component */}
      <StudyOutlineUpload onUploadSuccess={handleUploadSuccess} />

      {/* Multi-Study Review Section */}
      {detectedUpload && detectedUpload.studies.length > 0 && (
        <section className="space-y-4" id="detected-studies-review-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#5B0617] text-white p-4 sm:p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base tracking-tight">
                  Multi-Study Review ({detectedUpload.studiesFound} {detectedUpload.studiesFound === 1 ? 'Study' : 'Studies'} Detected)
                </h2>
                <p className="text-xs text-white/80">
                  Inspect and edit fields for each study. Then save the entire series with scheduled Tuesday dates, or approve individual lessons.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setDetectedUpload(null);
                setReviewedLessons([]);
              }}
              className="text-xs font-medium text-white/70 hover:text-white underline self-start sm:self-auto cursor-pointer"
            >
              Dismiss Review
            </button>
          </div>

          {/* SAVE ENTIRE SERIES CONTROL PANEL */}
          <div className="bg-[#FAF8F5] border-2 border-[#5B0617]/20 p-5 rounded-2xl space-y-4 shadow-2xs" id="commit-series-panel">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#18181B] flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#5B0617]" />
                  <span>Save Entire Series at Once</span>
                </h3>
                <p className="text-xs text-[#52525B] mt-0.5">
                  Submits all {reviewedLessons.length} reviewed lessons to <code className="bg-white px-1.5 py-0.5 rounded text-[11px] font-mono border">POST /api/bible-study/series</code>. The backend schedules each lesson 7 days apart starting from your chosen Tuesday.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#18181B] mb-1">
                  Series Theme *
                </label>
                <input
                  type="text"
                  value={seriesTheme}
                  onChange={(e) => setSeriesTheme(e.target.value)}
                  placeholder="e.g. The Reign of God: Marriage and Christian Lifestyle"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E4E4E7] focus:outline-none focus:border-[#5B0617] font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#18181B]">
                    Series Start Date (Must be a Tuesday) *
                  </label>
                  {!isDateTuesday(seriesStartDate) && (
                    <button
                      type="button"
                      onClick={() => setSeriesStartDate(getUpcomingTuesday())}
                      className="text-[10px] text-[#5B0617] font-bold hover:underline cursor-pointer"
                    >
                      Use Next Tuesday
                    </button>
                  )}
                </div>
                <input
                  type="date"
                  value={seriesStartDate}
                  onChange={(e) => setSeriesStartDate(e.target.value)}
                  className={`w-full px-3 py-2 bg-white rounded-xl border font-medium focus:outline-none ${
                    isDateTuesday(seriesStartDate) 
                      ? 'border-[#E4E4E7] focus:border-[#5B0617]' 
                      : 'border-amber-400 bg-amber-50 focus:border-amber-500'
                  }`}
                />
                {!isDateTuesday(seriesStartDate) ? (
                  <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Selected date is not a Tuesday. The backend requires start date to fall on a Tuesday.</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valid Tuesday start date ({formatStudyDate(seriesStartDate)}).</span>
                  </p>
                )}
              </div>
            </div>

            {seriesError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{seriesError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E4E4E7]">
              <button
                type="button"
                onClick={handleCommitEntireSeries}
                disabled={isSavingSeries || !isDateTuesday(seriesStartDate)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                id="commit-series-submit-btn"
              >
                {isSavingSeries ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Series...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Save & Schedule Series ({reviewedLessons.length} Lessons)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {detectedUpload.studies.map((studyItem, idx) => (
              <DetectedStudyEditor
                key={studyItem.id || idx}
                study={studyItem}
                index={idx}
                total={detectedUpload.studies.length}
                isSubmitted={submittedStudyIds.has(idx)}
                onSubmitStudy={(updated) => handleSubmitIndividualStudy(idx, updated)}
                onOpenPassage={handleOpenPassage}
              />
            ))}
          </div>
        </section>
      )}

      {/* Scripture Reference Viewer Overlay */}
      {activeOverlayRef && (
        <BibleReferenceOverlay
          reference={activeOverlayRef}
          referenceObj={activeOverlayObj || undefined}
          isOpen={Boolean(activeOverlayRef)}
          onClose={() => {
            setActiveOverlayRef(null);
            setActiveOverlayObj(null);
          }}
          initialVersionId={activeOverlayObj?.translationId || 'KJV'}
        />
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E4E4E7] shadow-xs">
          <span className="text-[10px] font-bold uppercase text-[#52525B] block mb-1">Total Study Outlines</span>
          <div className="text-2xl font-bold text-[#18181B]">
            {isLoading ? '...' : studies.length}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Authoritative curriculum items</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E4E4E7] shadow-xs">
          <span className="text-[10px] font-bold uppercase text-[#52525B] block mb-1">Study Categories</span>
          <div className="text-2xl font-bold text-blue-900">
            {isLoading ? '...' : Array.from(new Set(studies.map(s => s.subTheme || s.theme))).length}
          </div>
          <span className="text-[11px] text-[#52525B] font-medium">Distinct series & themes</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E4E4E7] shadow-xs col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold uppercase text-[#52525B] block mb-1">Cell Facilitators</span>
          <div className="text-2xl font-bold text-[#5B0617]">Active</div>
          <span className="text-[11px] text-[#52525B]">Assigned via Member Directory</span>
        </div>
      </div>

      {/* Primary Task Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-serif font-bold text-[#18181B]">
          Bible Study Operations Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Module 1: Weekly Study Outlines */}
          <div 
            onClick={() => navigate('/bible-study')}
            className="group bg-white p-5 rounded-2xl border border-[#E4E4E7] hover:border-[#5B0617] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                  CURRICULUM
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#18181B] group-hover:text-[#5B0617] transition-colors">
                Bible Study Reader & Outlines
              </h3>
              <p className="text-xs text-[#52525B]">
                View published study materials as members see them, inspect discussion questions, and test scripture references.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-xs font-bold text-[#5B0617]">
              <span>Open Member Bible Study</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 2: Facilitators Registry */}
          <div 
            onClick={() => navigate('/admin/members')}
            className="group bg-white p-5 rounded-2xl border border-[#E4E4E7] hover:border-[#5B0617] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  FACILITATORS
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#18181B] group-hover:text-[#5B0617] transition-colors">
                Discussion Facilitators & Member Directory
              </h3>
              <p className="text-xs text-[#52525B]">
                Assign appointed cell leaders and study facilitators across chapter subgroups and hostel fellowships.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-xs font-bold text-[#5B0617]">
              <span>View Roster & Directory</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* Outlines List */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
          <div>
            <h2 className="font-serif font-bold text-base text-[#18181B]">
              Active & Published Study Outlines
            </h2>
            <p className="text-xs text-[#52525B]">Curriculum topics prepared for fellowship weekly studies.</p>
          </div>
          <button
            onClick={() => setShowNewSeriesModal(true)}
            className="text-xs font-bold text-[#5B0617] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Series</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-[#52525B]">Loading study curriculum...</div>
        ) : studies.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#71717A]">
            No study outlines published yet. Upload a syllabus PDF or create a series above.
          </div>
        ) : (
          <div className="space-y-3">
            {studies.map((item) => {
              const isDraft = item.publicationStatus === 'draft' || !item.isPublished;
              const formattedDate = item.scheduledDate ? formatStudyDate(item.scheduledDate) : item.date;

              return (
                <div 
                  key={item.id}
                  className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#5B0617]/30 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                        {item.subTheme || item.theme || 'Curriculum'}
                      </span>

                      {/* Publication Status Badge */}
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                        isDraft 
                          ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {isDraft ? 'Draft' : 'Published'}
                      </span>

                      <span className="text-xs text-[#52525B] font-semibold">
                        Lesson {item.lessonNumber} • {formattedDate}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-sm text-[#18181B]">
                      {item.title || item.topic}
                    </h3>

                    <p className="text-xs text-[#52525B]">
                      Scripture: <strong className="text-[#5B0617]">{item.keyScripture || item.textRef}</strong>
                      {item.memoryVerse?.reference && <span> • Memory Verse: {item.memoryVerse.reference}</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Publish Button for Drafts */}
                    {isDraft && (
                      <button
                        onClick={() => handlePublishStudy(item.id, item.title || item.topic)}
                        disabled={publishingId === item.id}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                        title="Publish this lesson to members"
                      >
                        {publishingId === item.id ? 'Publishing...' : 'Publish'}
                      </button>
                    )}

                    {/* Reschedule Button */}
                    <button
                      onClick={() => {
                        setReschedulingStudy(item);
                        setNewRescheduleDate(item.scheduledDate || getUpcomingTuesday());
                        setRescheduleError(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E4E4E7] hover:bg-zinc-100 text-xs font-medium text-[#18181B] cursor-pointer"
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => navigate(`/bible-study/read/${item.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E4E4E7] hover:bg-[#FAF8F5] text-xs font-medium text-[#18181B] cursor-pointer"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RESCHEDULE LESSON MODAL */}
      {reschedulingStudy && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E4E4E7] shadow-xl max-w-md w-full p-6 space-y-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#18181B]">
                Reschedule Lesson {reschedulingStudy.lessonNumber}
              </h3>
              <p className="text-xs text-[#52525B] mt-0.5">
                "{reschedulingStudy.title || reschedulingStudy.topic}"
              </p>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#18181B] mb-1">
                  New Scheduled Date (Must be a Tuesday) *
                </label>
                <input
                  type="date"
                  required
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-medium ${
                    isDateTuesday(newRescheduleDate)
                      ? 'border-[#E4E4E7] focus:border-[#5B0617]'
                      : 'border-amber-400 bg-amber-50'
                  }`}
                />
                {!isDateTuesday(newRescheduleDate) ? (
                  <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Date must fall on a Tuesday.</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valid: {formatStudyDate(newRescheduleDate)}</span>
                  </p>
                )}
              </div>

              {rescheduleError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {rescheduleError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReschedulingStudy(null)}
                  className="px-4 py-2 rounded-xl border border-[#E4E4E7] bg-white hover:bg-[#FAF8F5] font-bold text-[#18181B] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRescheduling || !isDateTuesday(newRescheduleDate)}
                  className="px-4 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  {isRescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MANUAL SERIES MODAL */}
      {showNewSeriesModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E4E4E7] shadow-xl max-w-2xl w-full p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#18181B]">
                  Create Bible Study Series
                </h3>
                <p className="text-xs text-[#52525B]">
                  Prepares an entire curriculum series with scheduled draft lessons via <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono">POST /api/bible-study/series</code>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewSeriesModal(false)}
                className="text-xs text-[#52525B] hover:text-[#18181B] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateManualSeries} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#18181B] mb-1">Series Theme *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Walking in Divine Alignment"
                    value={manualTheme}
                    onChange={(e) => setManualTheme(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] focus:outline-none focus:border-[#5B0617] text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#18181B] mb-1">
                    Start Date (Must be a Tuesday) *
                  </label>
                  <input
                    type="date"
                    required
                    value={manualStartDate}
                    onChange={(e) => setManualStartDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-medium ${
                      isDateTuesday(manualStartDate) ? 'border-[#E4E4E7]' : 'border-amber-400 bg-amber-50'
                    }`}
                  />
                  {!isDateTuesday(manualStartDate) && (
                    <p className="text-[11px] text-amber-700 mt-1">Start date must fall on a Tuesday.</p>
                  )}
                </div>
              </div>

              {/* Dynamic Lessons Container */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#18181B] uppercase tracking-wider text-[11px]">
                    Lessons in this Series ({manualLessons.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleManualAddLesson}
                    className="flex items-center gap-1 text-[#5B0617] font-bold hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Lesson</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {manualLessons.map((lesson, idx) => (
                    <div key={idx} className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E4E4E7] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#5B0617] text-xs">
                          Lesson {idx + 1}
                        </span>
                        {manualLessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleManualRemoveLesson(idx)}
                            className="text-red-600 hover:text-red-700 p-1 cursor-pointer"
                            title="Remove lesson"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#52525B] mb-0.5">Topic Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Faith and Obedience"
                            value={lesson.topic}
                            onChange={(e) => handleManualLessonChange(idx, 'topic', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#E4E4E7] text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#52525B] mb-0.5">Scripture Reference *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. James 2:14-26"
                            value={lesson.textRef}
                            onChange={(e) => handleManualLessonChange(idx, 'textRef', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#E4E4E7] text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#52525B] mb-0.5">Lesson Aim</label>
                        <input
                          type="text"
                          placeholder="e.g. To understand faith demonstrated by works"
                          value={lesson.aim || ''}
                          onChange={(e) => handleManualLessonChange(idx, 'aim', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#E4E4E7] text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {manualSeriesError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {manualSeriesError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E4E7]">
                <button
                  type="button"
                  onClick={() => setShowNewSeriesModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E4E4E7] bg-white hover:bg-[#FAF8F5] font-bold text-[#18181B] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingManualSeries || !isDateTuesday(manualStartDate)}
                  className="px-5 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  {isCreatingManualSeries ? 'Creating Series...' : 'Save & Schedule Series'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
