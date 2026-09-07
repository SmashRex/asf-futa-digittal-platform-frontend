/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { MobilePreviewFrame } from '../../components/admin/MobilePreviewFrame';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { 
  ArrowLeft, 
  FileEdit, 
  CheckCircle2, 
  BookOpen, 
  Quote, 
  Sparkles, 
  Share2, 
  Bookmark, 
  Calendar as CalendarIcon, 
  MapPin,
  Megaphone,
  Archive,
  Send,
  Eye,
  Clock,
  X
} from 'lucide-react';

export const AdminContentPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contentItems, updateContentStatus } = useOutletContext<AdminContextType>();

  const item = contentItems.find(i => i.id === id) || contentItems[0];
  const isAnnouncement = item?.type === 'Announcement';

  // Publish / Schedule Modal
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishOption, setPublishOption] = useState<'now' | 'schedule'>('now');
  const [scheduleDate, setScheduleDate] = useState('2026-03-01');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleConfirmPublish = () => {
    updateContentStatus(item.id, 'Published');
    setIsPublishModalOpen(false);
    setToastMessage(publishOption === 'now' ? 'Announcement Published Successfully' : 'Announcement Scheduled Successfully');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleArchive = () => {
    updateContentStatus(item.id, 'Archived');
    setToastMessage('Announcement moved to archives.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 relative select-none" id="admin-content-preview-screen">
      
      {/* Preview Mode Banner */}
      <div className="bg-amber-100/80 border border-amber-300 text-amber-900 rounded-xl px-4 py-2 flex items-center justify-center gap-2 text-xs font-semibold shadow-xs">
        <Eye className="w-4 h-4 text-amber-800" />
        <span>Preview Mode: This is how members will see the {isAnnouncement ? 'announcement' : 'study outline'}.</span>
      </div>

      {/* Top Header & Admin Actions */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/content')}
            className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:bg-[#F3EFEA] text-[#18181B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B0617]">
                MEMBER EXPERIENCE PREVIEW
              </span>
              <StatusBadge status={item.status} size="sm" />
            </div>
            <h1 className="text-base sm:text-lg font-serif font-bold text-[#18181B] truncate max-w-md">
              {item.title}
            </h1>
          </div>
        </div>

        {/* Quick Admin Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/content/edit/${item.id}`)}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E4E4E7] hover:bg-[#FAF8F5] text-xs font-semibold text-[#18181B] flex items-center gap-1.5 transition-colors"
          >
            <FileEdit className="w-4 h-4 text-[#5B0617]" />
            <span>Edit</span>
          </button>

          {item.status !== 'Published' && (
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Publish / Schedule</span>
            </button>
          )}
        </div>
      </div>

      {/* Member Mirror Frame Wrapper */}
      <MobilePreviewFrame title={item.title} category={item.type}>
        
        {isAnnouncement ? (
          /* ANNOUNCEMENT PREVIEW STYLING */
          <div className="space-y-5 text-[#18181B]">
            
            {/* Hero Banner Image */}
            <div className="w-full h-48 rounded-xl overflow-hidden relative bg-stone-100 border border-[#E4E4E7]">
              <img 
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80" 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/95 text-[#18181B] px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs">
                <Megaphone className="w-3 h-3 text-[#5B0617]" />
                <span>Announcement</span>
              </div>
            </div>

            {/* Announcement Header */}
            <div className="space-y-2 border-b border-[#E4E4E7] pb-3">
              <h1 className="font-serif font-bold text-xl text-[#18181B] leading-tight">
                {item.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#52525B]">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#5B0617]" />
                  <span>{item.date || 'Next Saturday, 11:00 AM'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#5B0617]" />
                  <span>Fellowship Auditorium / Main Pavilion</span>
                </div>
              </div>
            </div>

            {/* Body Content */}
            <div className="font-serif text-sm leading-relaxed text-[#18181B] space-y-3 whitespace-pre-line">
              <p>
                {item.introduction || item.summary || 'Join us for our upcoming fellowship gathering! It is a wonderful time to connect, share a meal, and grow together in Christian fellowship.'}
              </p>
              
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E4E4E7] space-y-2 font-sans not-italic">
                <h3 className="font-bold text-xs text-[#5B0617] uppercase tracking-wider">
                  Important Notes & Guidelines:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#52525B]">
                  <li>Arrival and seating commences 15 minutes before the session.</li>
                  <li>Brethren are encouraged to invite friends and fellowship members.</li>
                  <li>Transportation arrangements are coordinated through department leads.</li>
                </ul>
              </div>
            </div>

          </div>
        ) : (
          /* BIBLE STUDY OUTLINE PREVIEW STYLING */
          <div className="space-y-6 text-[#18181B]">
            
            {/* Member Header Tag & Slogan */}
            <div className="space-y-2 border-b border-[#E4E4E7] pb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B0617] bg-[#5B0617]/10 px-2 py-0.5 rounded">
                  ASF BIBLE STUDY • LESSON {item.lessonNumber || 1}
                </span>
                <span className="text-xs text-[#52525B] font-medium">{item.date || 'Jan 2026'}</span>
              </div>

              <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#5B0617] leading-tight">
                {item.title}
              </h1>

              {item.subTheme && (
                <p className="text-xs sm:text-sm font-semibold text-[#805600]">
                  {item.subTheme}
                </p>
              )}

              <div className="text-[11px] text-[#52525B] pt-1">
                Annual Theme: <span className="font-medium text-[#18181B]">{item.annualTheme || 'The Reign of God'}</span>
              </div>
            </div>

            {/* Key Scripture Badge */}
            {item.keyScripture && (
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#52525B] block">
                    KEY SCRIPTURE READING
                  </span>
                  <span className="font-serif font-bold text-sm text-[#5B0617]">
                    {item.keyScripture}
                  </span>
                </div>
                <BookOpen className="w-5 h-5 text-[#5B0617]/60" />
              </div>
            )}

            {/* Learning Aims */}
            {item.aims && item.aims.length > 0 && (
              <div className="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-amber-900">
                  STUDY AIMS & OUTCOMES
                </h3>
                <ul className="space-y-1.5 text-xs text-[#18181B] pl-4 list-disc">
                  {item.aims.map((aim, idx) => (
                    <li key={idx} className="leading-relaxed">{aim}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Introduction */}
            {item.introduction && (
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-sm text-[#5B0617] uppercase tracking-wider">
                  INTRODUCTION
                </h3>
                <p className="font-serif text-sm leading-relaxed text-[#18181B] whitespace-pre-line">
                  {item.introduction}
                </p>
              </div>
            )}

            {/* Memory Verse Callout Box */}
            {item.memoryVerse && (
              <div className="p-4 rounded-2xl bg-[#5B0617] text-white space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-amber-300">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">
                    MEMORY VERSE • {item.memoryVerse.reference}
                  </span>
                  <Quote className="w-4 h-4 opacity-80" />
                </div>
                <p className="font-serif italic text-sm leading-relaxed text-white">
                  "{item.memoryVerse.text}"
                </p>
              </div>
            )}

            {/* Discussion Questions */}
            {item.discussionQuestions && item.discussionQuestions.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="font-serif font-bold text-sm text-[#5B0617] uppercase tracking-wider">
                  STUDY GUIDE & QUESTIONS
                </h3>
                <div className="space-y-2">
                  {item.discussionQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs space-y-1">
                      <span className="font-bold text-[#5B0617]">Question {idx + 1}:</span>
                      <p className="text-[#18181B] font-medium leading-relaxed">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member App Action Simulator */}
            <div className="pt-4 border-t border-[#E4E4E7] flex items-center justify-between text-xs text-[#52525B]">
              <button className="flex items-center gap-1 hover:text-[#5B0617]">
                <Bookmark className="w-4 h-4" />
                <span>Bookmark Study</span>
              </button>
              <button className="flex items-center gap-1 hover:text-[#5B0617]">
                <Share2 className="w-4 h-4" />
                <span>Share Outline</span>
              </button>
            </div>

          </div>
        )}

      </MobilePreviewFrame>

      {/* Sticky Bottom Action Bar for Desktop/Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E4E4E7] p-4 flex items-center justify-between max-w-4xl mx-auto shadow-lg z-30 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/content/edit/${item.id}`)}
            className="px-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#18181B] flex items-center gap-1.5 transition-colors"
          >
            <FileEdit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          
          <button
            onClick={handleArchive}
            className="px-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#52525B] flex items-center gap-1.5 transition-colors"
          >
            <Archive className="w-4 h-4" />
            <span>Archive</span>
          </button>
        </div>

        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Send className="w-4 h-4" />
          <span>Publish Now</span>
        </button>
      </div>

      {/* PUBLISH / SCHEDULE MODAL */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl border border-[#E4E4E7] shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-[#E4E4E7] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FFDADA] text-[#5B0617] flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#18181B]">Publish Announcement</h3>
                  <p className="text-[11px] text-[#52525B]">Make visible to ASF congregation</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1 rounded-lg text-[#52525B] hover:bg-stone-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-[#52525B]">
                Your announcement "<strong className="text-[#18181B]">{item.title}</strong>" is ready to go. How would you like to publish it?
              </p>

              {/* Option 1: Publish Immediately */}
              <label 
                onClick={() => setPublishOption('now')}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  publishOption === 'now' 
                    ? 'border-[#5B0617] bg-[#5B0617]/5' 
                    : 'border-[#E4E4E7] hover:bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="publish_option"
                  checked={publishOption === 'now'}
                  onChange={() => setPublishOption('now')}
                  className="mt-0.5 text-[#5B0617] focus:ring-[#5B0617]"
                />
                <div>
                  <span className="text-xs font-bold text-[#18181B] block">Publish Immediately</span>
                  <span className="text-[11px] text-[#52525B]">Make visible to all fellowship members right now.</span>
                </div>
              </label>

              {/* Option 2: Schedule for Later */}
              <label 
                onClick={() => setPublishOption('schedule')}
                className={`p-3.5 rounded-xl border flex flex-col gap-3 cursor-pointer transition-all ${
                  publishOption === 'schedule' 
                    ? 'border-[#5B0617] bg-[#5B0617]/5' 
                    : 'border-[#E4E4E7] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="publish_option"
                    checked={publishOption === 'schedule'}
                    onChange={() => setPublishOption('schedule')}
                    className="mt-0.5 text-[#5B0617] focus:ring-[#5B0617]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#18181B] block">Schedule for Later</span>
                    <span className="text-[11px] text-[#52525B]">Set a specific date and time to broadcast.</span>
                  </div>
                </div>

                {publishOption === 'schedule' && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E4E4E7]">
                    <div>
                      <label className="text-[10px] font-bold text-[#52525B] uppercase block mb-1">Date</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4E4E7] text-xs text-[#18181B] bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#52525B] uppercase block mb-1">Time</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4E4E7] text-xs text-[#18181B] bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E4E4E7] bg-[#FAF8F5] flex items-center justify-end gap-2">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#52525B] hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                className="px-4 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{publishOption === 'now' ? 'Publish Now' : 'Schedule Publish'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Success Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#18181B] text-white px-4 py-2.5 rounded-xl shadow-lg border border-white/10 flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
