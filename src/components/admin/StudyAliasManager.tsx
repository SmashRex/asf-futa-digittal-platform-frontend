/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Settings, Plus, BookMarked, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { bibleStudyService } from '../../services/bibleStudy/bibleStudy.service';
import { SectionAliasItem } from '../../types';

export const StudyAliasManager: React.FC = () => {
  const [aliases, setAliases] = useState<SectionAliasItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sectionAlias, setSectionAlias] = useState('');
  const [sectionTarget, setSectionTarget] = useState('Memory Verse');
  
  const [bookAlias, setBookAlias] = useState('');
  const [bookTargetId, setBookTargetId] = useState('mat');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadAliases = async () => {
    setIsLoading(true);
    try {
      const list = await bibleStudyService.getAliases();
      setAliases(list);
    } catch (err: any) {
      console.error('Failed to load aliases:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAliases();
  }, []);

  const handleAddSectionAlias = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionAlias.trim()) return;

    try {
      const updated = await bibleStudyService.addAlias(sectionAlias.trim(), sectionTarget);
      setAliases(updated);
      setSectionAlias('');
      setFeedback({ type: 'success', message: `Added section alias: "${sectionAlias.trim()}" -> "${sectionTarget}"` });
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to add section alias.' });
    }
  };

  const handleAddBookAlias = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookAlias.trim() || !bookTargetId.trim()) return;

    try {
      await bibleStudyService.addBookAlias(bookAlias.trim(), bookTargetId.trim());
      setBookAlias('');
      setFeedback({ type: 'success', message: `Added book alias: "${bookAlias.trim()}" -> "${bookTargetId.trim()}"` });
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to add book alias.' });
    }
  };

  const STANDARD_SECTIONS = [
    'Memory Verse',
    'Key Scripture',
    'Introduction',
    'Aims / Objectives',
    'Discussion Questions',
    'Conclusion',
    'Prayer Points'
  ];

  const COMMON_BOOKS = [
    { id: 'gen', name: 'Genesis' },
    { id: 'exo', name: 'Exodus' },
    { id: 'psa', name: 'Psalms' },
    { id: 'mat', name: 'Matthew' },
    { id: 'mrk', name: 'Mark' },
    { id: 'luk', name: 'Luke' },
    { id: 'jhn', name: 'John' },
    { id: 'act', name: 'Acts' },
    { id: 'rom', name: 'Romans' },
    { id: '1co', name: '1 Corinthians' },
    { id: '2co', name: '2 Corinthians' },
    { id: 'gal', name: 'Galatians' },
    { id: 'eph', name: 'Ephesians' },
    { id: 'col', name: 'Colossians' },
    { id: '1th', name: '1 Thessalonians' },
    { id: 'heb', name: 'Hebrews' },
    { id: 'rev', name: 'Revelation' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-5" id="study-alias-manager-card">
      <div className="border-b border-[#E4E4E7] pb-3">
        <h3 className="font-serif font-bold text-base text-[#18181B] flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#5B0617]" />
          <span>Curriculum Parser Aliases & Terminology</span>
        </h3>
        <p className="text-xs text-[#52525B]">
          Configure custom chapter outline section headers and abbreviation aliases to help the backend PDF extractor map terms accurately.
        </p>
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section Terminology Aliases */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#18181B]">
            <Layers className="w-4 h-4 text-[#5B0617]" />
            <span>Section Header Aliases</span>
          </div>

          <form onSubmit={handleAddSectionAlias} className="space-y-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E4E4E7]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#18181B] mb-1">
                  Outline Heading Variant
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verse to Memorize"
                  value={sectionAlias}
                  onChange={(e) => setSectionAlias(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-white text-xs font-medium focus:outline-none focus:border-[#5B0617]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#18181B] mb-1">
                  Maps To Standard Section
                </label>
                <select
                  value={sectionTarget}
                  onChange={(e) => setSectionTarget(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-white text-xs font-medium focus:outline-none focus:border-[#5B0617]"
                >
                  {STANDARD_SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Section Alias</span>
            </button>
          </form>

          {/* Current Aliases List */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
              Active Section Mappings ({aliases.length})
            </span>
            {isLoading ? (
              <div className="text-xs text-zinc-500 py-2">Loading aliases...</div>
            ) : aliases.length === 0 ? (
              <div className="text-xs text-zinc-400 italic py-2">No custom aliases defined.</div>
            ) : (
              aliases.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs"
                >
                  <span className="font-semibold text-[#18181B]">"{item.alias}"</span>
                  <span className="text-[11px] text-[#5B0617] font-medium bg-[#5B0617]/10 px-2 py-0.5 rounded">
                    → {item.target}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bible Book Aliases */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#18181B]">
            <BookMarked className="w-4 h-4 text-[#5B0617]" />
            <span>Bible Book Abbreviation Aliases</span>
          </div>

          <form onSubmit={handleAddBookAlias} className="space-y-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E4E4E7]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#18181B] mb-1">
                  Book Name or Abbreviation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Canticles, Mat, 1 Cor"
                  value={bookAlias}
                  onChange={(e) => setBookAlias(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-white text-xs font-medium focus:outline-none focus:border-[#5B0617]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#18181B] mb-1">
                  Canonical Book
                </label>
                <select
                  value={bookTargetId}
                  onChange={(e) => setBookTargetId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-white text-xs font-medium focus:outline-none focus:border-[#5B0617]"
                >
                  {COMMON_BOOKS.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.id.toUpperCase()})</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Book Alias</span>
            </button>
          </form>

          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-blue-900 text-xs space-y-1">
            <span className="font-bold block">Authoritative Mapping</span>
            <p className="text-[11px] text-blue-800/80 leading-relaxed">
              Book aliases ensure non-standard names used in fellowship outlines (e.g. "Song of Songs" vs "Canticles") resolve accurately into authoritative scripture references.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
