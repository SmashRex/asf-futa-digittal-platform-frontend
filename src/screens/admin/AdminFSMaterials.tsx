/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookMarked, 
  BookOpen, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  ArrowLeft, 
  FileText, 
  Sparkles,
  Plus
} from 'lucide-react';
import { mockFSMaterials } from '../../data/fsData';

export const AdminFSMaterials: React.FC = () => {
  const navigate = useNavigate();
  const [materials] = useState(mockFSMaterials);

  return (
    <div className="space-y-6 select-none" id="fs-materials-screen">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-purple-700 text-white rounded">
              STUDY RESOURCES
            </span>
            <span className="text-xs text-[#52525B] font-medium">• Foundational School Curriculum</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            FS Materials & Manuals
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1">
            Review and administer the official Foundational School textbooks, chapter outlines, scripture references, and offline bundles.
          </p>
        </div>

        <button
          onClick={() => navigate('/fs/materials')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#5B0617] text-[#5B0617] hover:bg-[#5B0617]/5 text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Preview Student App View</span>
        </button>
      </div>

      {/* Materials List */}
      <div className="space-y-4">
        {materials.map((mat) => (
          <div key={mat.id} className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B0617]">
                  {mat.academicYear} ACADEMIC EDITION
                </span>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[#18181B] mt-0.5">
                  {mat.title}
                </h2>
                {mat.subtitle && (
                  <p className="text-xs text-[#5B0617] font-semibold">{mat.subtitle}</p>
                )}
                <p className="text-xs sm:text-sm text-[#52525B] mt-1.5 leading-relaxed">
                  {mat.description}
                </p>
              </div>

              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold text-xs shrink-0 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Prebundled Offline</span>
              </span>
            </div>

            {/* Chapters Grid */}
            <div className="pt-3 border-t border-[#E4E4E7] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#18181B] block">
                Chapters & Doctrinal Sections ({mat.chapters.length} Chapters):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {mat.chapters.map((chap) => (
                  <div key={chap.id} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-[#5B0617] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {chap.chapterNumber}
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-[#18181B] line-clamp-1">{chap.title}</p>
                      {chap.subtitle && (
                        <p className="text-[11px] text-[#52525B] line-clamp-1">{chap.subtitle}</p>
                      )}
                      <p className="text-[10px] text-[#5B0617] mt-0.5 font-medium">
                        {chap.scriptureRefs?.length || 2} Scripture references
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
