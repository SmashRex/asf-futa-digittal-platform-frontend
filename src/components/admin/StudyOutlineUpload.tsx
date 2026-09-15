/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { bibleStudyService } from '../../services/bibleStudy/bibleStudy.service';
import { UploadOutlineResponse } from '../../types';

interface StudyOutlineUploadProps {
  onUploadSuccess: (result: UploadOutlineResponse) => void;
}

export const StudyOutlineUpload: React.FC<StudyOutlineUploadProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [includeRawText, setIncludeRawText] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setSuccessInfo(null);

    // Validate client-side extension / mime
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      setErrorMessage('Invalid file format: Please upload a valid PDF document.');
      return;
    }

    setIsUploading(true);

    try {
      const response = await bibleStudyService.uploadOutline(file, { includeRawText });
      setSuccessInfo(`Outline processed: ${response.studiesFound} study ${response.studiesFound === 1 ? 'lesson' : 'lessons'} detected.`);
      onUploadSuccess(response);
    } catch (err: any) {
      console.error('PDF outline upload failed:', err);
      if (err.code === 'INVALID_FILE') {
        setErrorMessage(err.message || 'Invalid file format: Please upload a valid PDF document.');
      } else {
        setErrorMessage(err.message || 'Failed to parse study outline PDF. Please check file format.');
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4" id="bs-upload-outline-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E4E7] pb-3">
        <div>
          <h2 className="font-serif font-bold text-base text-[#18181B] flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#5B0617]" />
            <span>Upload Multi-Study Curriculum PDF</span>
          </h2>
          <p className="text-xs text-[#52525B]">
            Upload a syllabus PDF containing one or multiple Bible study outlines. The backend parses each lesson into structured fields.
          </p>
        </div>

        {/* Options */}
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#52525B] select-none shrink-0">
          <input
            type="checkbox"
            checked={includeRawText}
            onChange={(e) => setIncludeRawText(e.target.checked)}
            className="rounded border-[#E4E4E7] text-[#5B0617] focus:ring-[#5B0617] h-3.5 w-3.5"
          />
          <span className="font-medium">Include raw text in review</span>
        </label>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
          isDragging 
            ? 'border-[#5B0617] bg-[#5B0617]/5' 
            : 'border-[#E4E4E7] hover:border-[#5B0617]/40 hover:bg-[#FAF8F5]'
        }`}
        id="bs-dropzone"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="bs-file-input"
        />

        <div className="w-12 h-12 rounded-full bg-[#5B0617]/10 text-[#5B0617] flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <FileText className="w-6 h-6" />
          )}
        </div>

        <div>
          <p className="text-sm font-bold text-[#18181B]">
            {isUploading ? 'Extracting outline lessons...' : 'Click to select PDF or drag & drop outline file'}
          </p>
          <p className="text-xs text-[#71717A] mt-1">
            Accepts PDF syllabus manuals containing single or multiple studies
          </p>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-in fade-in" id="bs-upload-error-alert">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Upload Error: </span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {successInfo && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in" id="bs-upload-success-alert">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successInfo}</span>
        </div>
      )}
    </div>
  );
};
