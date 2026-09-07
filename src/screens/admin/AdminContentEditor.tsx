/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { AdminContentItem, ContentStatus, ContentType } from '../../types/adminTypes';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  BookOpen, 
  Bold, 
  Italic, 
  List, 
  Quote, 
  Check, 
  FileCheck,
  Megaphone,
  ImageIcon,
  Link,
  ChevronDown
} from 'lucide-react';

export const AdminContentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contentItems, addContent, updateContent, activeRole } = useOutletContext<AdminContextType>();

  const isEditing = Boolean(id);

  // Form State
  const [type, setType] = useState<ContentType>(activeRole === 'Publicity Coordinator' ? 'Announcement' : 'Bible Study');
  const [title, setTitle] = useState('');
  const [announcementCategory, setAnnouncementCategory] = useState<'general' | 'ministry' | 'events' | 'urgent'>('general');
  const [priority, setPriority] = useState<'standard' | 'high'>('standard');
  const [subTheme, setSubTheme] = useState('');
  const [annualTheme, setAnnualTheme] = useState('The Reign of God: Marriage And Christian Lifestyle');
  const [author, setAuthor] = useState(activeRole === 'Publicity Coordinator' ? 'Publicity Coordinator' : 'Brother Samuel Adebayo');
  const [status, setStatus] = useState<ContentStatus>('Draft');
  const [lessonNumber, setLessonNumber] = useState<number>(1);
  const [keyScripture, setKeyScripture] = useState('');
  const [summary, setSummary] = useState('');
  const [aims, setAims] = useState<string[]>(['To understand the scriptural blueprint for Christian living.']);
  const [introduction, setIntroduction] = useState('');
  const [memoryVerseRef, setMemoryVerseRef] = useState('Amos 3:3');
  const [memoryVerseText, setMemoryVerseText] = useState('Can two walk together, except they agree?');
  const [discussionQuestions, setDiscussionQuestions] = useState<string[]>([
    'What key principles stand out from our primary scripture reading today?'
  ]);
  const [prayerPoints, setPrayerPoints] = useState<string[]>([
    'Lord Jesus, anchor our hearts in Your eternal truth and holiness.'
  ]);

  const [scriptureVerified, setScriptureVerified] = useState(false);
  const [savingSuccess, setSavingSuccess] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const existing = contentItems.find(i => i.id === id);
      if (existing) {
        setType(existing.type);
        setTitle(existing.title || '');
        setSubTheme(existing.subTheme || '');
        setAnnualTheme(existing.annualTheme || 'The Reign of God: Marriage And Christian Lifestyle');
        setAuthor(existing.author || '');
        setStatus(existing.status);
        setLessonNumber(existing.lessonNumber || 1);
        setKeyScripture(existing.keyScripture || '');
        setSummary(existing.summary || '');
        setAims(existing.aims && existing.aims.length > 0 ? existing.aims : ['To understand scriptural principles.']);
        setIntroduction(existing.introduction || '');
        if (existing.memoryVerse) {
          setMemoryVerseRef(existing.memoryVerse.reference);
          setMemoryVerseText(existing.memoryVerse.text);
        }
        if (existing.discussionQuestions && existing.discussionQuestions.length > 0) {
          setDiscussionQuestions(existing.discussionQuestions);
        }
        if (existing.prayerPoints && existing.prayerPoints.length > 0) {
          setPrayerPoints(existing.prayerPoints);
        }
      }
    }
  }, [id, isEditing, contentItems]);

  const handleVerifyScripture = () => {
    if (!keyScripture.trim()) return;
    setScriptureVerified(true);
  };

  const handleAddAim = () => {
    setAims(prev => [...prev, '']);
  };

  const handleUpdateAim = (index: number, val: string) => {
    setAims(prev => prev.map((a, i) => i === index ? val : a));
  };

  const handleRemoveAim = (index: number) => {
    setAims(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddQuestion = () => {
    setDiscussionQuestions(prev => [...prev, '']);
  };

  const handleUpdateQuestion = (index: number, val: string) => {
    setDiscussionQuestions(prev => prev.map((q, i) => i === index ? val : q));
  };

  const handleRemoveQuestion = (index: number) => {
    setDiscussionQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = (targetStatus: ContentStatus = status) => {
    if (!title.trim()) {
      alert('Please enter a title for the content.');
      return null;
    }

    const payload: Omit<AdminContentItem, 'id' | 'createdAt' | 'updatedAt'> = {
      type,
      title,
      subTheme,
      annualTheme,
      author,
      authorRole: activeRole,
      status: targetStatus,
      lessonNumber,
      keyScripture,
      summary,
      aims: aims.filter(a => a.trim() !== ''),
      introduction,
      memoryVerse: {
        reference: memoryVerseRef,
        text: memoryVerseText
      },
      discussionQuestions: discussionQuestions.filter(q => q.trim() !== ''),
      prayerPoints: prayerPoints.filter(p => p.trim() !== ''),
      isPublished: targetStatus === 'Published'
    };

    let targetId = id;
    if (isEditing && id) {
      updateContent({
        ...payload,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } else {
      targetId = addContent(payload);
    }

    setSavingSuccess(true);
    setTimeout(() => setSavingSuccess(false), 2000);
    return targetId;
  };

  const handleContinueToPreview = () => {
    const savedId = handleSave();
    if (savedId) {
      navigate(`/admin/content/preview/${savedId}`);
    }
  };

  const isAnnouncement = type === 'Announcement';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 select-none" id="admin-content-editor-screen">
      
      {/* Top Header & Navigation Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E4E7] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/content')}
            className="p-2 rounded-xl bg-white border border-[#E4E4E7] hover:bg-[#FAF8F5] text-[#18181B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5B0617]">
              {isAnnouncement ? 'PUBLICITY DRAFTING DESK' : 'BIBLE STUDY EDITORIAL WORKSPACE'}
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B]">
              {isEditing ? `Edit: ${title || 'Content'}` : (isAnnouncement ? 'Create Announcement' : 'Create New Outline')}
            </h1>
          </div>
        </div>

        {/* Workflow Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave('Draft')}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E4E4E7] hover:bg-[#FAF8F5] text-xs font-semibold text-[#18181B] flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4 text-[#52525B]" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handleContinueToPreview}
            className="px-4 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
            id="continue-to-preview-btn"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {savingSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{isAnnouncement ? 'Announcement' : 'Outline'} saved successfully!</span>
        </div>
      )}

      {/* FORM FIELDS */}
      {isAnnouncement ? (
        /* ANNOUNCEMENT FORM */
        <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-[#E4E4E7] shadow-sm">
          
          {/* Content Type Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#52525B]">Content Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ContentType)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
            >
              <option value="Announcement">Announcement</option>
              <option value="Bible Study">Bible Study Outline</option>
              <option value="Event">Event Program</option>
              <option value="FS Material">FS Material</option>
            </select>
          </div>

          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#52525B]">Announcement Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Upcoming Summer Retreat / Shift in Prayer Meeting Venue"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4E4E7] text-sm font-semibold text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#5B0617]/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#52525B]">Category</label>
              <div className="relative">
                <select
                  value={announcementCategory}
                  onChange={(e) => setAnnouncementCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none pr-8 appearance-none"
                >
                  <option value="general">General News</option>
                  <option value="ministry">Ministry Updates</option>
                  <option value="events">Upcoming Events</option>
                  <option value="urgent">Urgent Alerts</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#52525B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Priority Toggle */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#52525B]">Priority</label>
              <div className="flex bg-[#FAF8F5] rounded-xl p-1 border border-[#E4E4E7]">
                <button
                  type="button"
                  onClick={() => setPriority('standard')}
                  className={`flex-1 py-1.5 text-center rounded-lg text-xs font-semibold transition-all ${
                    priority === 'standard'
                      ? 'bg-white text-[#5B0617] shadow-xs border border-[#E4E4E7]'
                      : 'text-[#52525B] hover:text-[#18181B]'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('high')}
                  className={`flex-1 py-1.5 text-center rounded-lg text-xs font-semibold transition-all ${
                    priority === 'high'
                      ? 'bg-[#5B0617] text-white shadow-xs'
                      : 'text-[#52525B] hover:text-[#18181B]'
                  }`}
                >
                  High Priority
                </button>
              </div>
            </div>
          </div>

          {/* Cover Image Drag & Drop Simulation */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#52525B]">Cover Image</label>
            <div className="border-2 border-dashed border-[#E4E4E7] hover:border-[#5B0617] rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-[#FAF8F5] cursor-pointer group transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#FFDADA] flex items-center justify-center text-[#5B0617] mb-2 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-[#18181B]">Click to upload an announcement banner</p>
              <p className="text-[11px] text-[#52525B]">or drag and drop. Recommended ratio 16:9.</p>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#52525B]">Body Content</label>
            <div className="border border-[#E4E4E7] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#5B0617]/20 transition-all">
              <div className="bg-[#FAF8F5] border-b border-[#E4E4E7] px-3 py-1.5 flex items-center gap-2">
                <button type="button" className="p-1 text-[#52525B] hover:text-[#18181B] hover:bg-stone-200 rounded">
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 text-[#52525B] hover:text-[#18181B] hover:bg-stone-200 rounded">
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 text-[#52525B] hover:text-[#18181B] hover:bg-stone-200 rounded">
                  <List className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 text-[#52525B] hover:text-[#18181B] hover:bg-stone-200 rounded">
                  <Link className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={6}
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                placeholder="Start writing the announcement details here..."
                className="w-full p-4 text-xs font-serif leading-relaxed text-[#18181B] border-none focus:outline-none resize-y"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#E4E4E7] flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => handleSave('Draft')}
              className="px-5 py-2.5 rounded-xl border border-[#5B0617] text-[#5B0617] hover:bg-[#5B0617]/5 text-xs font-bold transition-all"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleContinueToPreview}
              className="px-6 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </div>

        </div>
      ) : (
        /* BIBLE STUDY OUTLINE FORM */
        <div className="space-y-6">
          {/* SECTION 1: Theme & Topic */}
          <section className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="border-b border-[#E4E4E7] pb-3">
              <h2 className="font-serif font-bold text-base text-[#18181B] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#5B0617] text-white text-xs font-sans flex items-center justify-center font-bold">1</span>
                <span>Theme & Topic Overview</span>
              </h2>
              <p className="text-xs text-[#52525B]">Define title, series categorization, and core lesson details.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#18181B]">Content Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ContentType)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
                >
                  <option value="Bible Study">Bible Study Outline</option>
                  <option value="Announcement">Announcement</option>
                  <option value="Event">Event Program</option>
                  <option value="FS Material">FS Material</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#18181B]">Lesson / Outline Number</label>
                <input
                  type="number"
                  value={lessonNumber}
                  onChange={(e) => setLessonNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-[#18181B]">Study Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Universal Concepts of Marriage"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-sm font-serif font-bold text-[#18181B] focus:outline-none focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#18181B]">Sub-Theme / Series</label>
                <input
                  type="text"
                  value={subTheme}
                  onChange={(e) => setSubTheme(e.target.value)}
                  placeholder="e.g. The Concept of Marriage (1)"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#18181B]">Author / Contributor</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-[#18181B]">Annual / Semester Theme</label>
                <input
                  type="text"
                  value={annualTheme}
                  onChange={(e) => setAnnualTheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-[#18181B]">Brief Executive Summary</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Summarize the core theme of this outline for members..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs text-[#18181B] focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: Scripture & Learning Aims */}
          <section className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="border-b border-[#E4E4E7] pb-3">
              <h2 className="font-serif font-bold text-base text-[#18181B] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#5B0617] text-white text-xs font-sans flex items-center justify-center font-bold">2</span>
                <span>Scripture & Learning Aims</span>
              </h2>
              <p className="text-xs text-[#52525B]">Specify key scriptures and define learning objectives.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#18181B]">Primary Key Scripture Reference</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={keyScripture}
                    onChange={(e) => {
                      setKeyScripture(e.target.value);
                      setScriptureVerified(false);
                    }}
                    placeholder="e.g. Gen 2:24 or Eph 5:22-33"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyScripture}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      scriptureVerified
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-[#FAF8F5] text-[#18181B] border-[#E4E4E7] hover:bg-[#F3EFEA]'
                    }`}
                  >
                    {scriptureVerified ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-3.5 h-3.5 text-[#5B0617]" />
                        <span>Verify Scripture</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dynamic Learning Aims */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#18181B]">Lesson Aims / Learning Outcomes</label>
                  <button
                    type="button"
                    onClick={handleAddAim}
                    className="text-xs font-semibold text-[#5B0617] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Aim</span>
                  </button>
                </div>

                {aims.map((aim, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#52525B] w-5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={aim}
                      onChange={(e) => handleUpdateAim(idx, e.target.value)}
                      placeholder="e.g. To understand the divine covenant of marriage..."
                      className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs text-[#18181B] focus:outline-none"
                    />
                    {aims.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAim(idx)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 3: Main Lesson Content & Toolbar */}
          <section className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="border-b border-[#E4E4E7] pb-3">
              <h2 className="font-serif font-bold text-base text-[#18181B] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#5B0617] text-white text-xs font-sans flex items-center justify-center font-bold">3</span>
                <span>Main Lesson Content</span>
              </h2>
              <p className="text-xs text-[#52525B]">Editorial text, memory verse, and discussion guide.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#18181B]">Introduction Text</label>
                <textarea
                  rows={4}
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="Write the introduction for the study outline..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-serif leading-relaxed text-[#18181B] focus:outline-none focus:bg-white"
                />
              </div>

              {/* Memory Verse Block */}
              <div className="p-4 rounded-xl bg-[#5B0617]/5 border border-[#5B0617]/20 space-y-3">
                <div className="flex items-center gap-2 text-[#5B0617]">
                  <Quote className="w-4 h-4" />
                  <h3 className="font-bold text-xs">Memory Verse</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#52525B]">Scripture Reference</label>
                    <input
                      type="text"
                      value={memoryVerseRef}
                      onChange={(e) => setMemoryVerseRef(e.target.value)}
                      placeholder="e.g. Amos 3:3"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E4E4E7] text-xs text-[#18181B] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-semibold text-[#52525B]">Memory Verse Text</label>
                    <input
                      type="text"
                      value={memoryVerseText}
                      onChange={(e) => setMemoryVerseText(e.target.value)}
                      placeholder="Can two walk together, except they agree?"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E4E4E7] text-xs font-serif italic text-[#18181B] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Discussion Questions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#18181B]">Discussion Questions</label>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="text-xs font-semibold text-[#5B0617] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                {discussionQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#5B0617] w-5">Q{idx + 1}.</span>
                    <input
                      type="text"
                      value={q}
                      onChange={(e) => handleUpdateQuestion(idx, e.target.value)}
                      placeholder="e.g. How does Christian marriage reflect Christ and the Church?"
                      className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs text-[#18181B] focus:outline-none"
                    />
                    {discussionQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

    </div>
  );
};
