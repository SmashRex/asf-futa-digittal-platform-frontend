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
  ChevronRight
} from 'lucide-react';
import { bibleStudyService } from '../../services/bibleStudy/bibleStudy.service';
import { BibleStudyItem } from '../../types';

export const AdminBibleStudyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [studies, setStudies] = useState<BibleStudyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewOutlineModal, setShowNewOutlineModal] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [newVerse, setNewVerse] = useState('');
  const [newSubTheme, setNewSubTheme] = useState('Discipleship');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadOutlines() {
      try {
        const data = await bibleStudyService.getStudies();
        if (isMounted) setStudies(data);
      } catch (err) {
        console.error('Failed to load Bible studies', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadOutlines();
    return () => {
      isMounted = false;
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCreateOutline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const newStudy: BibleStudyItem = {
      id: `bs-${Date.now()}`,
      lessonNumber: studies.length + 1,
      title: newTopic.trim(),
      subTheme: newSubTheme,
      keyScripture: newVerse.trim() || 'Romans 12:1-2',
      memoryVerse: {
        text: 'Let the word of Christ dwell in you richly in all wisdom.',
        reference: newVerse.trim() || 'Colossians 3:16'
      },
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      summary: 'Weekly fellowship discipleship study outline for cells.',
      introduction: 'Weekly discipleship study for fellowship cell units.',
      discussionQuestions: [
        'How does this scriptural principle apply to our campus walk?'
      ],
      prayerPoints: ['Pray for spiritual steadfastness and grace to walk in obedience.'],
      isCurrent: false,
      isPublished: true
    };

    setStudies(prev => [newStudy, ...prev]);
    setShowNewOutlineModal(false);
    setNewTopic('');
    setNewVerse('');
    triggerToast(`Created outline: "${newStudy.title}"`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none" id="bible-study-coordinator-workspace">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 bg-[#5B0617] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#7A1F2B] text-xs font-bold z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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
            Role-scoped workspace for Anglican Students' Fellowship Bible Study Ministry. Draft weekly study outlines, manage syllabi, and coordinate discussion facilitators.
          </p>
        </div>

        <button
          onClick={() => setShowNewOutlineModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-all shadow-sm shrink-0"
          id="bs-create-outline-btn"
        >
          <Plus className="w-4 h-4" />
          <span>New Study Outline</span>
        </button>
      </section>

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
            {isLoading ? '...' : Array.from(new Set(studies.map(s => s.subTheme))).length}
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
              Active & Draft Study Outlines
            </h2>
            <p className="text-xs text-[#52525B]">Curriculum topics prepared for fellowship weekly studies.</p>
          </div>
          <button
            onClick={() => setShowNewOutlineModal(true)}
            className="text-xs font-bold text-[#5B0617] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Draft Outline</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-[#52525B]">Loading study curriculum...</div>
        ) : (
          <div className="space-y-3">
            {studies.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#5B0617]/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {item.subTheme || 'Discipleship'}
                    </span>
                    <span className="text-xs text-[#52525B] font-semibold">{item.date} • Lesson {item.lessonNumber}</span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#18181B]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#52525B]">
                    Key Scripture: <strong className="text-[#5B0617]">{item.keyScripture}</strong>
                    {item.memoryVerse && <span> • Memory Verse: {item.memoryVerse.reference}</span>}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/bible-study/read/${item.id}`)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#E4E4E7] hover:bg-[#FAF8F5] text-xs font-medium text-[#18181B]"
                  >
                    Open Outline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Outline Modal */}
      {showNewOutlineModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E4E4E7] shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#18181B]">
              Draft New Bible Study Outline
            </h3>
            
            <form onSubmit={handleCreateOutline} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#18181B] mb-1">Outline Topic Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Walking in Holiness & Integrity"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] focus:outline-none focus:border-[#5B0617] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18181B] mb-1">Theme / Series</label>
                <input
                  type="text"
                  placeholder="e.g. Discipleship or Spiritual Growth"
                  value={newSubTheme}
                  onChange={(e) => setNewSubTheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] focus:outline-none focus:border-[#5B0617] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18181B] mb-1">Anchor Scripture Reference</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Peter 1:15-16"
                  value={newVerse}
                  onChange={(e) => setNewVerse(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] focus:outline-none focus:border-[#5B0617] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewOutlineModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E4E4E7] bg-white hover:bg-[#FAF8F5] font-bold text-[#18181B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white font-bold"
                >
                  Save Outline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
