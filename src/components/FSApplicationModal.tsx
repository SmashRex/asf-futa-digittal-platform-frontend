/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Sparkles, Send } from 'lucide-react';
import { useFSAdmissions } from '../hooks/useFSAdmissions';
import { FSAdmission } from '../types';

interface FSApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (admission: FSAdmission) => void;
}

export const FSApplicationModal: React.FC<FSApplicationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    isSubmitting,
    submittedAdmission,
    submitError,
    submitErrorCode,
    applyForAdmission,
    resetSubmitState,
  } = useFSAdmissions();

  const [testimony, setTestimony] = useState('');
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    resetSubmitState();
    setTestimony('');
    setValidationMsg(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationMsg(null);

    // Presentation validation
    if (testimony.length > 2000) {
      setValidationMsg('Testimony cannot exceed 2000 characters.');
      return;
    }

    const payload = testimony.trim() ? { testimony: testimony.trim() } : {};
    const result = await applyForAdmission(payload);
    if (result && onSuccess) {
      onSuccess(result);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      id="fs-application-modal-overlay"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl border border-[#E4E4E7] shadow-2xl p-6 sm:p-7 space-y-5 overflow-y-auto max-h-[90vh]"
        id="fs-application-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#E4E4E7]">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-[#805600]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#805600]">
                FOUNDATIONAL SCHOOL ADMISSIONS
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#18181B] tracking-tight">
              Apply for Foundational School
            </h2>
            <p className="text-xs text-[#52525B] mt-0.5">
              Submit your discipleship application to be enrolled in the upcoming cohort.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E4E4E7] flex items-center justify-center text-[#52525B] hover:text-[#18181B] transition-colors shrink-0"
            aria-label="Close application modal"
            id="fs-modal-close-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {submittedAdmission ? (
          <div className="space-y-5 py-2 text-center" id="fs-application-success-view">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-serif font-bold text-[#18181B]">
                Application Submitted Successfully
              </h3>
              <p className="text-xs text-[#52525B] max-w-sm mx-auto leading-relaxed">
                Your application has been received and is currently under review by the Foundational School coordinator.
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#52525B]">Application Status:</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[11px]">
                  {submittedAdmission.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#52525B]">Application Reference:</span>
                <span className="font-mono text-[#18181B] text-[11px] font-semibold">
                  {submittedAdmission.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#52525B]">Submitted Date:</span>
                <span className="text-[#18181B] font-medium">
                  {new Date(submittedAdmission.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full h-11 bg-[#5B0617] hover:bg-[#7A1F2B] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
              id="fs-modal-done-btn"
            >
              Done
            </button>
          </div>
        ) : (
          /* Application Form View */
          <form onSubmit={handleSubmit} className="space-y-4" id="fs-application-form">
            {/* Error Banners with specific code branching */}
            {submitError && (
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                  submitErrorCode === 'ALREADY_IN_SUBGROUP'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : submitErrorCode === 'ADMISSION_ALREADY_PENDING'
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
                id="fs-application-error-banner"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">
                    {submitErrorCode === 'ALREADY_IN_SUBGROUP'
                      ? 'Subgroup Member Ineligible'
                      : submitErrorCode === 'ADMISSION_ALREADY_PENDING'
                      ? 'Application Already Pending'
                      : submitErrorCode === 'VALIDATION_ERROR'
                      ? 'Validation Error'
                      : 'Submission Error'}
                  </span>
                  <p className="leading-relaxed">{submitError}</p>
                </div>
              </div>
            )}

            {validationMsg && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="fs-testimony-input"
                  className="text-xs font-semibold text-[#18181B]"
                >
                  Personal Salvation Testimony & Motivation <span className="text-[#52525B] font-normal">(Optional)</span>
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    testimony.length > 2000 ? 'text-rose-600 font-bold' : 'text-[#52525B]'
                  }`}
                >
                  {testimony.length} / 2000
                </span>
              </div>

              <textarea
                id="fs-testimony-input"
                rows={5}
                value={testimony}
                onChange={(e) => setTestimony(e.target.value)}
                placeholder="Share briefly about your salvation experience, spiritual background, or what you desire to learn in Foundational School..."
                className="w-full px-3.5 py-3 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-hidden focus:border-[#5B0617] focus:bg-white transition-all leading-relaxed"
                disabled={isSubmitting}
                maxLength={2000}
              />
              <p className="text-[11px] text-[#52525B]">
                You can leave this blank if you prefer. Maximum 2000 characters.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E4E4E7]">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs font-bold text-[#52525B] hover:text-[#18181B] hover:bg-white transition-colors"
                id="fs-modal-cancel-btn"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || testimony.length > 2000}
                className="px-6 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] active:scale-98 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs"
                id="fs-modal-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
