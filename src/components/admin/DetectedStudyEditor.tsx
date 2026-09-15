/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  AlertTriangle, 
  FileText, 
  Send, 
  Plus, 
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { 
  DetectedStudyItem, 
  ExtractedStudyFields, 
  DetectedScriptureReference 
} from '../../types';

interface DetectedStudyEditorProps {
  study: DetectedStudyItem;
  index: number;
  total: number;
  onSubmitStudy: (updated: ExtractedStudyFields) => Promise<void>;
  onOpenPassage: (ref: DetectedScriptureReference) => void;
  isSubmitted?: boolean;
}

export const DetectedStudyEditor: React.FC<DetectedStudyEditorProps> = ({
  study,
  index,
  total,
  onSubmitStudy,
  onOpenPassage,
  isSubmitted = false
}) => {
  const [fields, setFields] = useState<ExtractedStudyFields>({
    ...study.extracted,
    theme: study.extracted.theme || '',
    subTheme: study.extracted.subTheme || '',
    title: study.extracted.title || study.extracted.topic || '',
    lessonNumber: study.extracted.lessonNumber ?? study.lessonNumberGuess ?? (index + 1),
    date: study.extracted.date || '',
    keyScripture: study.extracted.keyScripture || '',
    textScriptures: study.extracted.textScriptures || [],
    memoryVerse: study.extracted.memoryVerse || { reference: '', text: '' },
    aim: study.extracted.aim || (Array.isArray(study.extracted.aims) ? study.extracted.aims[0] : ''),
    aims: Array.isArray(study.extracted.aims) ? study.extracted.aims : (study.extracted.aim ? [study.extracted.aim] : []),
    introduction: study.extracted.introduction || '',
    discussionQuestions: study.extracted.discussionQuestions || [],
    conclusion: study.extracted.conclusion || '',
    prayerPoints: study.extracted.prayerPoints || []
  });

  const [showRawText, setShowRawText] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(isSubmitted);
  const [newQuestion, setNewQuestion] = useState('');
  const [newPrayer, setNewPrayer] = useState('');

  const handleFieldChange = (key: keyof ExtractedStudyFields, value: any) => {
    setFields(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    setFields(prev => ({
      ...prev,
      discussionQuestions: [...(prev.discussionQuestions || []), newQuestion.trim()]
    }));
    setNewQuestion('');
  };

  const handleRemoveQuestion = (qIndex: number) => {
    setFields(prev => ({
      ...prev,
      discussionQuestions: (prev.discussionQuestions || []).filter((_, idx) => idx !== qIndex)
    }));
  };

  const handleAddPrayer = () => {
    if (!newPrayer.trim()) return;
    setFields(prev => ({
      ...prev,
      prayerPoints: [...(prev.prayerPoints || []), newPrayer.trim()]
    }));
    setNewPrayer('');
  };

  const handleRemovePrayer = (pIndex: number) => {
    setFields(prev => ({
      ...prev,
      prayerPoints: (prev.prayerPoints || []).filter((_, idx) => idx !== pIndex)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitStudy(fields);
      setSubmittedSuccess(true);
    } catch (err) {
      console.error('Failed to submit study:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // References list: preserve all entries without client-side deduplication
  const refs = study.scriptureReferences || [];
  const unrecognizedCount = refs.filter(r => r.recognized === false).length;

  return (
    <div className={`bg-white rounded-2xl border transition-all ${
      submittedSuccess 
        ? 'border-emerald-300 bg-emerald-50/10' 
        : 'border-[#E4E4E7] shadow-sm'
    } p-5 sm:p-6 space-y-6`} id={`detected-study-card-${index}`}>
      
      {/* Top Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E4E7] pb-4">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-[#5B0617] text-white">
            Study {index + 1} of {total}
          </span>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#18181B]">
              {fields.title || `Detected Lesson ${fields.lessonNumber}`}
            </h3>
            <p className="text-xs text-[#52525B]">
              Lesson {fields.lessonNumber} • {fields.date || 'Undated outline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {submittedSuccess ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Published to Studies</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <span>Ready for Review</span>
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Core Themes (Distinct Theme and SubTheme fields) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF8F5] p-4 rounded-xl border border-[#E4E4E7]">
          <div>
            <label className="block font-bold text-[#18181B] mb-1" htmlFor={`theme-input-${index}`}>
              Annual / General Theme (Primary) *
            </label>
            <input
              id={`theme-input-${index}`}
              type="text"
              required
              value={fields.theme || ''}
              onChange={(e) => handleFieldChange('theme', e.target.value)}
              placeholder="e.g. The Reign of God: Kingdom Living on Campus"
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] bg-white text-xs font-medium focus:outline-none focus:border-[#5B0617]"
            />
            <p className="text-[11px] text-[#71717A] mt-1">
              General umbrella theme for the semester or year
            </p>
          </div>

          <div>
            <label className="block font-bold text-[#18181B] mb-1" htmlFor={`subtheme-input-${index}`}>
              Sub-Theme / Topic Series *
            </label>
            <input
              id={`subtheme-input-${index}`}
              type="text"
              required
              value={fields.subTheme || ''}
              onChange={(e) => handleFieldChange('subTheme', e.target.value)}
              placeholder="e.g. Biblical Foundations of Faithful Discipleship"
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] bg-white text-xs font-medium focus:outline-none focus:border-[#5B0617]"
            />
            <p className="text-[11px] text-[#71717A] mt-1">
              Specific series or modular sub-theme for this lesson
            </p>
          </div>
        </div>

        {/* Title, Lesson Number, Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-bold text-[#18181B] mb-1">Lesson Topic / Title *</label>
            <input
              type="text"
              required
              value={fields.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Universal Concepts of Christian Calling"
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#5B0617] text-xs font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-[#18181B] mb-1">Lesson Number</label>
            <input
              type="number"
              value={fields.lessonNumber || ''}
              onChange={(e) => handleFieldChange('lessonNumber', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#5B0617] text-xs font-medium"
            />
          </div>
        </div>

        {/* Key Scripture & Memory Verse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-[#18181B] mb-1">Key Scripture *</label>
            <input
              type="text"
              required
              value={fields.keyScripture || ''}
              onChange={(e) => handleFieldChange('keyScripture', e.target.value)}
              placeholder="e.g. Genesis 2:18-24"
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#5B0617] text-xs font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-[#18181B] mb-1">Memory Verse Reference</label>
            <input
              type="text"
              value={fields.memoryVerse?.reference || ''}
              onChange={(e) => handleFieldChange('memoryVerse', {
                ...fields.memoryVerse,
                reference: e.target.value
              })}
              placeholder="e.g. Matthew 19:6"
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#5B0617] text-xs font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-[#18181B] mb-1">Memory Verse Text</label>
            <textarea
              rows={2}
              value={fields.memoryVerse?.text || ''}
              onChange={(e) => handleFieldChange('memoryVerse', {
                ...fields.memoryVerse,
                text: e.target.value
              })}
              placeholder="Enter verbatim text of memory verse..."
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#5B0617] text-xs"
            />
          </div>
        </div>

        {/* Aims & Introduction */}
        <div className="space-y-4">
          <div>
            <label className="block font-bold text-[#18181B] mb-1">Central Aim / Learning Objectives</label>
            <textarea
              rows={2}
              value={fields.aim || ''}
              onChange={(e) => {
                handleFieldChange('aim', e.target.value);
                handleFieldChange('aims', [e.target.value]);
              }}
              placeholder="What should members learn or apply from this study?"
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#5B0617] text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#18181B] mb-1">Introduction</label>
            <textarea
              rows={3}
              value={fields.introduction || ''}
              onChange={(e) => handleFieldChange('introduction', e.target.value)}
              placeholder="Introductory exposition setting context for cell discussion..."
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#5B0617] text-xs"
            />
          </div>
        </div>

        {/* Discussion Questions */}
        <div className="space-y-2">
          <label className="block font-bold text-[#18181B]">Discussion Guide Questions</label>
          <div className="space-y-2">
            {(fields.discussionQuestions || []).map((q, qIdx) => (
              <div key={qIdx} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#5B0617]/10 text-[#5B0617] font-bold text-[10px] flex items-center justify-center shrink-0">
                  {qIdx + 1}
                </span>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => {
                    const updated = [...(fields.discussionQuestions || [])];
                    updated[qIdx] = e.target.value;
                    handleFieldChange('discussionQuestions', updated);
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4E4E7] text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIdx)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors"
                  title="Remove question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add another discussion question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddQuestion();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-lg border border-dashed border-[#E4E4E7] text-xs"
              />
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[#18181B] font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Conclusion & Prayer Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-[#18181B] mb-1">Conclusion</label>
            <textarea
              rows={3}
              value={fields.conclusion || ''}
              onChange={(e) => handleFieldChange('conclusion', e.target.value)}
              placeholder="Closing remarks and summary takeaway..."
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#5B0617] text-xs"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-[#18181B] mb-1">Prayer Points</label>
            {(fields.prayerPoints || []).map((pt, pIdx) => (
              <div key={pIdx} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5B0617] shrink-0" />
                <input
                  type="text"
                  value={pt}
                  onChange={(e) => {
                    const updated = [...(fields.prayerPoints || [])];
                    updated[pIdx] = e.target.value;
                    handleFieldChange('prayerPoints', updated);
                  }}
                  className="flex-1 px-3 py-1 rounded-lg border border-[#E4E4E7] text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePrayer(pIdx)}
                  className="p-1 text-zinc-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add prayer focus..."
                value={newPrayer}
                onChange={(e) => setNewPrayer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPrayer();
                  }
                }}
                className="flex-1 px-3 py-1 rounded-lg border border-dashed border-[#E4E4E7] text-xs"
              />
              <button
                type="button"
                onClick={handleAddPrayer}
                className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[#18181B] font-bold text-xs"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Scripture References Inspection */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-[#E4E4E7] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#5B0617]" />
              <h4 className="font-bold text-[#18181B] text-xs">
                Detected Scripture References ({refs.length})
              </h4>
            </div>
            {unrecognizedCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                <span>{unrecognizedCount} Unrecognized</span>
              </span>
            )}
          </div>

          <p className="text-[11px] text-[#71717A]">
            Recognized references are clickable and query the Holy Bible reader directly. Unrecognized items are flagged for coordinator review.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {refs.map((refItem, rIdx) => {
              const isRec = refItem.recognized !== false;

              if (!isRec) {
                return (
                  <div
                    key={rIdx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold shadow-2xs"
                    title="Unrecognized reference: Backend could not resolve book or chapter. Please check outline text."
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{refItem.raw}</span>
                    <span className="text-[9px] bg-rose-200/80 text-rose-900 font-bold px-1 rounded uppercase tracking-wider">
                      Needs check
                    </span>
                  </div>
                );
              }

              return (
                <button
                  key={rIdx}
                  type="button"
                  onClick={() => onOpenPassage(refItem)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#5B0617]/30 text-[#5B0617] hover:bg-[#5B0617] hover:text-white transition-all text-xs font-bold shadow-2xs cursor-pointer group active:scale-95"
                  title={`Open ${refItem.raw} in Bible Reader`}
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{refItem.raw}</span>
                  {refItem.translationId && (
                    <span className="text-[9px] font-medium opacity-80 uppercase">
                      [{refItem.translationId}]
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Collapsible Raw Block Text */}
        {study.rawBlockText && (
          <div className="border border-[#E4E4E7] rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowRawText(!showRawText)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100 transition-colors text-xs font-bold text-[#18181B]"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#52525B]" />
                <span>Extracted Raw Document Text</span>
              </div>
              {showRawText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showRawText && (
              <div className="p-4 bg-white border-t border-[#E4E4E7] text-[11px] font-mono text-zinc-700 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                {study.rawBlockText}
              </div>
            )}
          </div>
        )}

        {/* Submission Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E4E4E7]">
          <span className="text-[11px] text-[#71717A]">
            Submitting writes this individual lesson to published curriculum.
          </span>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer ${
              submittedSuccess
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-[#5B0617] hover:bg-[#7A1F2B] text-white active:scale-95'
            }`}
            id={`submit-study-btn-${index}`}
          >
            {isSubmitting ? (
              <span>Publishing...</span>
            ) : submittedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Update Published Study</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Approve & Submit Study {index + 1}</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
