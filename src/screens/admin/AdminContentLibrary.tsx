/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { ContentStatus, ContentType, AdminContentItem } from '../../types/adminTypes';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  FileEdit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  MoreVertical,
  ChevronDown,
  Archive,
  Copy,
  Layers,
  Upload,
  X,
  Sparkles,
  FileText,
  Calendar as CalendarIcon,
  Send,
  RefreshCw,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const AdminContentLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { contentItems, deleteContent, updateContentStatus, addContent, activeRole } = useOutletContext<AdminContextType>();

  const [activeTab, setActiveTab] = useState<ContentStatus | 'All'>('All');
  const [selectedType, setSelectedType] = useState<ContentType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfStep, setPdfStep] = useState<'upload' | 'extracting' | 'review'>('upload');
  const [extractionProgress, setExtractionProgress] = useState(0);

  // Extracted study form state
  const [extractedTitle, setExtractedTitle] = useState('Lesson 46: Parables of the Kingdom');
  const [extractedScripture, setExtractedScripture] = useState('Matthew 13:1-23');
  const [extractedMemoryVerse, setExtractedMemoryVerse] = useState('Matthew 13:9 - He that hath ears to hear, let him hear.');
  const [extractedIntro, setExtractedIntro] = useState('The parables of the kingdom reveal profound spiritual truths about God’s reign, human receptivity, and kingdom growth.');
  const [extractedQuestions, setExtractedQuestions] = useState([
    'What does the seed represent in Jesus’ parable of the sower?',
    'How do worldly cares choke the growth of the spiritual seed in our lives today?',
    'What practical steps can we take to ensure our hearts remain good soil?'
  ]);

  // Publish / Schedule Modal state
  const [publishModalItem, setPublishModalItem] = useState<AdminContentItem | null>(null);
  const [publishOption, setPublishOption] = useState<'now' | 'schedule'>('now');
  const [scheduleDate, setScheduleDate] = useState('2026-03-01');
  const [scheduleTime, setScheduleTime] = useState('18:00');

  // Deletion Approval Request Modal state
  const [deleteModalItem, setDeleteModalItem] = useState<AdminContentItem | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [confirmArchiveCheck, setConfirmArchiveCheck] = useState(false);

  // Handle query parameter trigger (e.g. ?action=upload or ?tab=Archived)
  useEffect(() => {
    const action = searchParams.get('action');
    const tabParam = searchParams.get('tab');
    if (action === 'upload') {
      setIsPdfModalOpen(true);
      setPdfStep('upload');
    }
    if (tabParam && ['All', 'Draft', 'Pending Review', 'Approved', 'Published', 'Archived'].includes(tabParam)) {
      setActiveTab(tabParam as ContentStatus | 'All');
    }
  }, [searchParams]);

  // Handle PDF Simulation Extraction Flow
  const startPdfExtraction = () => {
    setPdfStep('extracting');
    setExtractionProgress(10);
    const interval = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPdfStep('review');
          return 100;
        }
        return prev + 30;
      });
    }, 600);
  };

  const saveExtractedStudy = () => {
    const newItem: AdminContentItem = {
      id: `bs-${Date.now()}`,
      title: extractedTitle,
      type: 'Bible Study',
      status: 'Pending Review',
      author: 'Bible Study Coordinator',
      authorRole: 'Bible Study Coordinator',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      keyScripture: extractedScripture,
      introduction: extractedIntro,
      discussionQuestions: extractedQuestions,
      lessonNumber: 46
    };
    addContent(newItem);
    setIsPdfModalOpen(false);
    setPdfStep('upload');
    setExtractionProgress(0);
    navigate(`/admin/content/preview/${newItem.id}`);
  };

  // Filter items based on activeTab, selectedType, and searchQuery
  const filteredItems = contentItems.filter(item => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const matchesType = selectedType === 'All' || item.type === selectedType;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subTheme && item.subTheme.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6" id="admin-content-library-screen">
      
      {/* Content Breadcrumb & Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#52525B] mb-1">
            <span>{activeRole === 'Publicity Coordinator' ? 'Publicity' : 'Content'}</span>
            <span>/</span>
            <span className="text-[#5B0617] font-bold">
              {activeRole === 'Publicity Coordinator' ? 'Announcements & Publications' : 'Bible Study Outlines'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            {activeRole === 'Publicity Coordinator' ? 'Announcements & Fellowship News' : 'Bible Study Content Library'}
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-0.5">
            {activeRole === 'Publicity Coordinator'
              ? 'Create, edit, publish, schedule, and archive announcements and news for ASF members.'
              : 'Manage, review, publish, and schedule Bible Study materials for the ASF ecosystem.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setIsPdfModalOpen(true);
              setPdfStep('upload');
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#5B0617] text-[#5B0617] hover:bg-[#5B0617]/5 text-xs font-bold transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Study (PDF)</span>
          </button>

          <button
            onClick={() => navigate('/admin/content/new')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Study Outline</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Header */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 shadow-sm space-y-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#E4E4E7] no-scrollbar">
          {(['All', 'Draft', 'Pending Review', 'Approved', 'Published', 'Archived'] as const).map((status) => {
            const count = status === 'All' 
              ? contentItems.length 
              : contentItems.filter(i => i.status === status).length;

            return (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === status
                    ? 'bg-[#5B0617] text-white'
                    : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>{status}</span>
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                  activeTab === status ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#52525B]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Type Select Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, scripture reference, or author..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs sm:text-sm text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B0617]/20 transition-all"
            />
          </div>

          {/* Type Filter Dropdown */}
          <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#52525B] shrink-0 hidden sm:block" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ContentType | 'All')}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Bible Study">Bible Study Outlines</option>
              <option value="Announcement">Announcements</option>
              <option value="Event">Events</option>
              <option value="FS Material">Foundational School</option>
            </select>
          </div>

        </div>

      </div>

      {/* Content Table / Cards Container */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
          <p className="font-serif font-bold text-base text-[#18181B]">No Outlines Found</p>
          <p className="text-xs text-[#52525B] max-w-sm mx-auto">
            There are no items matching your criteria. Try adjusting search terms or upload a new Bible Study PDF.
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP DATA TABLE */}
          <div className="hidden lg:block bg-white rounded-2xl border border-[#E4E4E7] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E4E4E7] text-[11px] font-bold uppercase tracking-wider text-[#52525B]">
                  <th className="p-3.5 pl-5">Lesson & Title</th>
                  <th className="p-3.5">Key Scripture</th>
                  <th className="p-3.5">Prepared By</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right pr-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7] text-xs">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#5B0617]">
                          <span>LESSON {item.lessonNumber || 1}</span>
                          <span>•</span>
                          <span className="text-[#52525B]">{item.type}</span>
                        </div>
                        <p 
                          className="font-serif font-bold text-sm text-[#18181B] hover:text-[#5B0617] cursor-pointer" 
                          onClick={() => navigate(`/admin/content/preview/${item.id}`)}
                        >
                          {item.title}
                        </p>
                      </div>
                    </td>

                    <td className="p-3.5 font-medium text-[#18181B]">
                      {item.keyScripture || 'Matthew 5:1-12'}
                    </td>

                    <td className="p-3.5">
                      <p className="font-medium text-[#18181B]">{item.author}</p>
                      <p className="text-[10px] text-[#52525B]">{item.authorRole || 'Bible Study Coordinator'}</p>
                    </td>

                    <td className="p-3.5">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    <td className="p-3.5 text-[#52525B] whitespace-nowrap">
                      {item.date || 'Jan 2026'}
                    </td>

                    <td className="p-3.5 text-right pr-5 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/content/preview/${item.id}`)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#18181B] transition-colors"
                          title="Preview Member Experience"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => navigate(`/admin/content/edit/${item.id}`)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#18181B] transition-colors"
                          title="Edit Study Outline"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                        </button>

                        {item.status !== 'Published' && (
                          <button
                            onClick={() => setPublishModalItem(item)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px] transition-colors"
                          >
                            Publish / Schedule
                          </button>
                        )}

                        <button
                          onClick={() => setDeleteModalItem(item)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Archive / Delete Study"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE STACKED CARDS */}
          <div className="lg:hidden space-y-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E4E4E7] p-4 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} size="sm" />
                      <span className="text-[11px] font-bold text-[#5B0617]">LESSON {item.lessonNumber || 1}</span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#18181B]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#52525B]">Scripture: <strong className="text-[#18181B]">{item.keyScripture || 'Matthew 5:1-12'}</strong></p>
                  </div>
                </div>

                <div className="text-xs text-[#52525B] pt-2 border-t border-[#E4E4E7] flex items-center justify-between">
                  <span>Prepared: <strong className="text-[#18181B] font-medium">{item.author}</strong></span>
                  <span>{item.date || 'Jan 2026'}</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => navigate(`/admin/content/preview/${item.id}`)}
                    className="flex-1 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-semibold text-[#18181B] flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => navigate(`/admin/content/edit/${item.id}`)}
                    className="flex-1 py-2 rounded-xl bg-[#5B0617] text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 1. PDF UPLOAD & AI EXTRACTION MODAL */}
      {/* ========================================================= */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 border border-[#E4E4E7] shadow-2xl relative my-8">
            
            <button
              onClick={() => setIsPdfModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-[#52525B]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-[#5B0617] text-white rounded">
                  STUDY IMPORT PIPELINE
                </span>
                <span className="text-xs text-[#52525B] font-medium">Step {pdfStep === 'upload' ? '1' : pdfStep === 'extracting' ? '2' : '3'} of 3</span>
              </div>
              <h2 className="font-serif font-bold text-xl text-[#18181B]">
                {pdfStep === 'upload' && 'Upload Bible Study PDF'}
                {pdfStep === 'extracting' && 'Extracting Theology & Context...'}
                {pdfStep === 'review' && 'Review & Correct Extracted Outline'}
              </h2>
            </div>

            {/* Step 1: Upload Dropzone */}
            {pdfStep === 'upload' && (
              <div className="space-y-4">
                <div 
                  onClick={startPdfExtraction}
                  className="border-2 border-dashed border-[#5B0617]/30 bg-[#FAF8F5] rounded-2xl p-8 text-center cursor-pointer hover:bg-[#5B0617]/5 transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-[#5B0617]/10 text-[#5B0617] flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-base text-[#18181B]">
                      Click to upload or drag & drop Bible Study PDF
                    </p>
                    <p className="text-xs text-[#52525B] mt-1">
                      Supports PDF, DOCX, or scanned lesson manual outlines (Up to 25MB)
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E4E4E7] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#5B0617]" />
                    <span className="font-semibold text-[#18181B]">Sample_Lesson_46_Parables.pdf</span>
                  </div>
                  <button 
                    onClick={startPdfExtraction}
                    className="px-3 py-1.5 rounded-lg bg-[#5B0617] text-white font-bold text-xs hover:bg-[#7A1F2B]"
                  >
                    Process File
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Extracting Loader */}
            {pdfStep === 'extracting' && (
              <div className="py-8 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-[#805600] flex items-center justify-center mx-auto">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-lg text-[#18181B]">
                    Processing Document...
                  </h3>
                  <p className="text-xs text-[#52525B] max-w-sm mx-auto">
                    Analyzing scriptures, isolating memory verses, formatting study questions, and organizing outline sections.
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto space-y-1">
                  <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#5B0617] h-full transition-all duration-300" 
                      style={{ width: `${extractionProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#52525B] font-bold">{extractionProgress}% Complete</span>
                </div>
              </div>
            )}

            {/* Step 3: Extracted Content Review */}
            {pdfStep === 'review' && (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Text successfully extracted! Review and adjust content before adding to library.</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#18181B] mb-1">Lesson Title</label>
                    <input
                      type="text"
                      value={extractedTitle}
                      onChange={(e) => setExtractedTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-serif font-bold text-[#18181B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#18181B] mb-1">Primary Scripture</label>
                      <input
                        type="text"
                        value={extractedScripture}
                        onChange={(e) => setExtractedScripture(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#18181B] mb-1">Memory Verse</label>
                      <input
                        type="text"
                        value={extractedMemoryVerse}
                        onChange={(e) => setExtractedMemoryVerse(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18181B] mb-1">Introduction</label>
                    <textarea
                      rows={3}
                      value={extractedIntro}
                      onChange={(e) => setExtractedIntro(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-serif leading-relaxed text-[#18181B]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-[#18181B]">Discussion Guide Questions</label>
                      <button
                        onClick={() => setExtractedQuestions([...extractedQuestions, 'New discussion question...'])}
                        className="text-[11px] font-bold text-[#5B0617] hover:underline"
                      >
                        + Add Question
                      </button>
                    </div>

                    <div className="space-y-2">
                      {extractedQuestions.map((q, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-stone-200 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={q}
                            onChange={(e) => {
                              const updated = [...extractedQuestions];
                              updated[idx] = e.target.value;
                              setExtractedQuestions(updated);
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E4E4E7] text-xs text-[#18181B]"
                          />
                          <button
                            onClick={() => setExtractedQuestions(extractedQuestions.filter((_, i) => i !== idx))}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E4E4E7] flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsPdfModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-[#18181B]"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={saveExtractedStudy}
                    className="px-5 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold shadow-sm"
                  >
                    Save & Open Preview
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. PUBLISH & SCHEDULE MODAL */}
      {/* ========================================================= */}
      {publishModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-[#E4E4E7] shadow-2xl relative">
            <button
              onClick={() => setPublishModalItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-[#52525B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-700 text-white rounded">
                BROADCAST CONTROL
              </span>
              <h2 className="font-serif font-bold text-xl text-[#18181B] mt-1">
                Publish or Schedule Outline
              </h2>
              <p className="text-xs text-[#52525B] mt-0.5">
                Target: <strong className="text-[#18181B]">{publishModalItem.title}</strong>
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label 
                onClick={() => setPublishOption('now')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                  publishOption === 'now' 
                    ? 'border-[#5B0617] bg-[#5B0617]/5' 
                    : 'border-[#E4E4E7] bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="publishType"
                  checked={publishOption === 'now'}
                  onChange={() => setPublishOption('now')}
                  className="mt-1 accent-[#5B0617]"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#18181B]">Publish Immediately</h4>
                  <p className="text-xs text-[#52525B] mt-0.5">Make outline immediately visible on ASF Member App.</p>
                </div>
              </label>

              <label 
                onClick={() => setPublishOption('schedule')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                  publishOption === 'schedule' 
                    ? 'border-[#5B0617] bg-[#5B0617]/5' 
                    : 'border-[#E4E4E7] bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="publishType"
                  checked={publishOption === 'schedule'}
                  onChange={() => setPublishOption('schedule')}
                  className="mt-1 accent-[#5B0617]"
                />
                <div className="space-y-2 w-full">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#18181B]">Schedule Broadcast</h4>
                    <p className="text-xs text-[#52525B] mt-0.5">Set a future date for automatic release.</p>
                  </div>

                  {publishOption === 'schedule' && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#52525B]">Date</label>
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="w-full p-2 text-xs bg-white border border-[#E4E4E7] rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#52525B]">Time</label>
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full p-2 text-xs bg-white border border-[#E4E4E7] rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-[#E4E4E7] flex items-center justify-end gap-2">
              <button
                onClick={() => setPublishModalItem(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-[#18181B]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateContentStatus(publishModalItem.id, 'Published');
                  setPublishModalItem(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold shadow-sm"
              >
                {publishOption === 'now' ? 'Confirm & Publish' : 'Confirm Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DELETION & ARCHIVE APPROVAL REQUEST MODAL */}
      {/* ========================================================= */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#E4E4E7] shadow-2xl relative">
            <button
              onClick={() => setDeleteModalItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-[#52525B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>GOVERNANCE PROTOCOL</span>
              </div>
              <h2 className="font-serif font-bold text-xl text-[#18181B]">
                Archive or Delete Study Outline
              </h2>
              <p className="text-xs text-[#52525B] mt-1">
                Target: <strong className="text-[#18181B]">{deleteModalItem.title}</strong>
              </p>
            </div>

            {deleteModalItem.status === 'Published' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
                <p className="font-bold">⚠️ Dual Approval Requirement</p>
                <p className="text-[11px] leading-relaxed">
                  Published materials require approval from both the Bible Study Coordinator and Executive Committee before permanent removal.
                </p>
                <div className="pt-2 flex items-center justify-between font-bold text-[10px] text-amber-800 border-t border-amber-200/60">
                  <span>Approval Progress: 1 of 2 Signed</span>
                  <span className="px-2 py-0.5 bg-amber-200 rounded">Coordinator Pending</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">Reason for Archive / Removal</label>
                <textarea
                  rows={2}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="e.g. Content replaced by updated semester lesson..."
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs text-[#18181B]"
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer text-xs text-[#52525B]">
                <input
                  type="checkbox"
                  checked={confirmArchiveCheck}
                  onChange={(e) => setConfirmArchiveCheck(e.target.checked)}
                  className="mt-0.5 accent-[#5B0617]"
                />
                <span>I understand this outline will be moved to the official historical archive.</span>
              </label>
            </div>

            <div className="pt-4 border-t border-[#E4E4E7] flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteModalItem(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-[#18181B]"
              >
                Cancel
              </button>
              <button
                disabled={!confirmArchiveCheck}
                onClick={() => {
                  deleteContent(deleteModalItem.id);
                  setDeleteModalItem(null);
                }}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  confirmArchiveCheck 
                    ? 'bg-rose-700 hover:bg-rose-800 text-white shadow-sm' 
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                Confirm Archive
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
