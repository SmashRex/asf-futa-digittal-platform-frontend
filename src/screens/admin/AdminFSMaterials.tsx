/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
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
  Plus,
  Upload,
  AlertCircle,
  FileCheck,
  RefreshCw,
  Eye
} from 'lucide-react';
import { mockFSMaterials } from '../../data/fsData';
import { fsService } from '../../services/fs/fs.service';

export const AdminFSMaterials: React.FC = () => {
  const navigate = useNavigate();
  const [materials] = useState(mockFSMaterials);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Manual Preview / Test state
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setUploadError('Only PDF documents are accepted for the Foundational School manual.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const handleUploadManual = async () => {
    if (!selectedFile) {
      setUploadError('Please select a PDF manual file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const res = await fsService.uploadManual(selectedFile);
      setUploadSuccess(`Official Foundational School manual "${res.fileName || selectedFile.name}" successfully uploaded and published.`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      if (err.statusCode === 403 || err.code === 'PERMISSION_DENIED') {
        setUploadError('Access Denied: You must be a VP / FS Coordinator, President, or Technical Administrator to upload the FS manual.');
      } else {
        setUploadError(err.message || 'Failed to upload the FS manual.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleTestDownloadManual = async () => {
    setIsPreviewing(true);
    setPreviewError(null);
    try {
      const blob = await fsService.getManualBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err: any) {
      if (err.statusCode === 403 || err.code === 'MANUAL_ACCESS_DENIED') {
        setPreviewError('Access Denied: Only active FS students and teachers can access the published manual.');
      } else if (err.statusCode === 404 || err.code === 'MANUAL_NOT_FOUND') {
        setPreviewError('No manual found. Upload a manual first to make it available to enrolled students.');
      } else {
        setPreviewError(err.message || 'Unable to retrieve manual.');
      }
    } finally {
      setIsPreviewing(false);
    }
  };

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
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#5B0617] text-[#5B0617] hover:bg-[#5B0617]/5 text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Preview Student App View</span>
        </button>
      </div>

      {/* Official FS PDF Manual Publication Card */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4" id="fs-manual-upload-card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B0617]">
              OFFICIAL DISCIPLINE MANUAL (PDF)
            </span>
            <h2 className="text-lg font-serif font-bold text-[#18181B] mt-0.5">
              Upload Official FS Manual
            </h2>
            <p className="text-xs text-[#52525B] mt-1">
              Authorized coordinators can upload the canonical PDF manual (POST /api/fs/manual). Uploading a new manual automatically replaces the existing session manual.
            </p>
          </div>

          <button
            type="button"
            disabled={isPreviewing}
            onClick={handleTestDownloadManual}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#5B0617] text-[#18181B] text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
            id="test-manual-access-btn"
          >
            {isPreviewing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#5B0617]" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-[#5B0617]" />
            )}
            <span>Verify Published Manual</span>
          </button>
        </div>

        {previewError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{previewError}</span>
          </div>
        )}

        <div className="border border-dashed border-[#E4E4E7] hover:border-[#5B0617] rounded-xl p-5 bg-[#FAF8F5] transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="fs-manual-file-input"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5B0617]/10 flex items-center justify-center text-[#5B0617] shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#18181B]">
                  {selectedFile ? selectedFile.name : 'Select Foundational School Manual (PDF)'}
                </p>
                <p className="text-[11px] text-[#71717A]">
                  {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload` : 'PDF format up to 20MB'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#5B0617] text-xs font-bold text-[#18181B] transition-all cursor-pointer"
                id="choose-fs-manual-btn"
              >
                {selectedFile ? 'Change File' : 'Choose PDF File'}
              </button>

              {selectedFile && (
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={handleUploadManual}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  id="upload-fs-manual-btn"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Manual</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {uploadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2" id="fs-manual-upload-success">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {uploadError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-2" id="fs-manual-upload-error">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{uploadError}</span>
          </div>
        )}
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

