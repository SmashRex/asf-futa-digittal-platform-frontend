/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowLeft,
  X,
  Mail,
  GraduationCap,
  Calendar,
  AlertCircle,
  Loader2,
  RefreshCw,
  Info,
  Clock,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { FSAdmissionAdminView, FSAdmissionStatusFilter } from '../../types';
import { fsService } from '../../services/fs/fs.service';

export const AdminFSAdmissions: React.FC = () => {
  const navigate = useNavigate();

  const [admissions, setAdmissions] = useState<FSAdmissionAdminView[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FSAdmissionStatusFilter>('ALL');
  const [selectedApplication, setSelectedApplication] = useState<FSAdmissionAdminView | null>(null);

  // Review Form State
  const [reviewDecision, setReviewDecision] = useState<'Approved' | 'Rejected'>('Approved');
  const [assignedClassId, setAssignedClassId] = useState<string>('');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  const loadAdmissions = async (filter: FSAdmissionStatusFilter) => {
    setIsLoading(true);
    setError(null);
    setErrorCode(null);

    try {
      const data = await fsService.getAdminAdmissions(filter === 'ALL' ? undefined : filter);
      setAdmissions(data);
    } catch (err: any) {
      const code = err.code || (err.statusCode === 403 ? 'PERMISSION_DENIED' : 'FETCH_ERROR');
      setErrorCode(code);
      if (code === 'PERMISSION_DENIED' || err.statusCode === 403) {
        setError('You lack permission to review Foundational School admission applications.');
      } else {
        setError(err.message || 'Failed to load admission applications from the server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplication) return;

    if (reviewDecision === 'Approved' && !assignedClassId.trim()) {
      setReviewError('A valid FS Class ID is required when approving an application.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      const updated = await fsService.reviewAdmission(selectedApplication.id, {
        status: reviewDecision,
        classId: reviewDecision === 'Approved' ? assignedClassId.trim() : undefined,
        reviewNotes: reviewNotes.trim() || undefined
      });

      // Update in local state
      setAdmissions(prev => prev.map(a => a.id === selectedApplication.id ? {
        ...a,
        status: updated.status as any,
        assignedClassId: updated.assignedClassId || assignedClassId.trim(),
        reviewedAt: updated.reviewedAt || new Date().toISOString(),
        reviewNotes: updated.reviewNotes || reviewNotes.trim()
      } : a));

      setSelectedApplication(prev => prev ? {
        ...prev,
        status: updated.status as any,
        assignedClassId: updated.assignedClassId || assignedClassId.trim(),
        reviewedAt: updated.reviewedAt || new Date().toISOString(),
        reviewNotes: updated.reviewNotes || reviewNotes.trim()
      } : null);

      setReviewSuccess(`Application ${reviewDecision.toLowerCase()} successfully.`);
      setTimeout(() => {
        setReviewSuccess(null);
      }, 4000);
    } catch (err: any) {
      if (err.statusCode === 409 || err.code === 'ADMISSION_ALREADY_REVIEWED') {
        setReviewError('This application has already been reviewed.');
      } else if (err.statusCode === 400) {
        setReviewError(err.message || 'Invalid review submission data.');
      } else {
        setReviewError(err.message || 'Failed to submit admission review.');
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    loadAdmissions(statusFilter);
  }, [statusFilter]);

  const filteredAdmissions = admissions.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = app.applicantName?.toLowerCase().includes(q) || false;
    const matchEmail = app.applicantEmail?.toLowerCase().includes(q) || false;
    const matchLevel = app.applicantLevel?.toLowerCase().includes(q) || false;
    const matchTestimony = app.testimony?.toLowerCase().includes(q) || false;
    return matchName || matchEmail || matchLevel || matchTestimony;
  });

  return (
    <div className="space-y-6 select-none" id="fs-admissions-screen">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-[#5B0617] text-white rounded">
              ADMISSIONS QUEUE
            </span>
            <span className="text-xs text-[#52525B] font-medium">• Foundational School Applications</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Student Applications & Admissions
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1">
            Review incoming Foundational School student admission requests, verify salvation testimonies, and monitor application statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadAdmissions(statusFilter)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-[#18181B] text-xs font-bold hover:bg-white transition-all shadow-xs shrink-0 disabled:opacity-50"
            id="fs-admissions-refresh-btn"
            title="Refresh application queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => navigate('/admin/fs/students')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-[#18181B] text-xs font-bold hover:bg-white transition-all shadow-xs shrink-0"
            id="fs-admissions-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Students Roster</span>
          </button>
        </div>
      </div>

      {/* Permission / Fetch Error Banner */}
      {error && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
            errorCode === 'PERMISSION_DENIED'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
          id="fs-admissions-error-banner"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-sm block">
              {errorCode === 'PERMISSION_DENIED' ? 'Access Restricted' : 'Error Loading Applications'}
            </span>
            <p className="leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-[#52525B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applications by applicant name, email, level, or testimony..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] focus:bg-white transition-all"
              id="fs-admissions-search-input"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FSAdmissionStatusFilter)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] focus:bg-white transition-all"
              id="fs-admissions-status-filter"
            >
              <option value="ALL">All Application Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3" id="fs-admissions-list-container">
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#5B0617]" />
            <span className="text-xs text-[#52525B]">Loading applications from backend...</span>
          </div>
        ) : filteredAdmissions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-12 text-center text-xs text-[#52525B]" id="fs-admissions-empty-state">
            {searchQuery.trim()
              ? 'No admission applications match your search query.'
              : statusFilter !== 'ALL'
              ? `No applications found with status "${statusFilter}".`
              : 'No Foundational School admission applications found in the queue.'}
          </div>
        ) : (
          filteredAdmissions.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApplication(app)}
              className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-xs hover:border-[#5B0617] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              id={`fs-admission-card-${app.id}`}
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm sm:text-base text-[#18181B] group-hover:text-[#5B0617] transition-colors">
                    {app.applicantName}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    app.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : app.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="text-[11px] text-[#52525B] flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#52525B]" />
                    {app.applicantEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-[#52525B]" />
                    {app.applicantLevel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#52525B]" />
                    Applied: {new Date(app.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {app.testimony ? (
                  <p className="text-xs text-[#52525B] line-clamp-2 italic bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E4E4E7]/60">
                    "{app.testimony}"
                  </p>
                ) : (
                  <p className="text-[11px] text-[#A1A1AA] italic">
                    No personal testimony provided.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedApplication(app);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-[#18181B] text-xs font-bold hover:bg-white hover:border-[#5B0617] transition-all"
                  id={`review-app-btn-${app.id}`}
                >
                  View Dossier
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Application Dossier Modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          id="fs-application-dossier-modal"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl border border-[#E4E4E7] shadow-2xl p-5 sm:p-6 space-y-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#E4E4E7]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#805600]">
                  FOUNDATIONAL SCHOOL ADMISSION DOSSIER
                </span>
                <h2 className="text-lg font-serif font-bold text-[#18181B] mt-0.5">
                  {selectedApplication.applicantName}
                </h2>
                <p className="text-xs text-[#52525B]">
                  {selectedApplication.applicantLevel} • Ref: <span className="font-mono">{selectedApplication.id}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E4E4E7] flex items-center justify-center text-[#52525B] hover:text-[#18181B] transition-colors"
                aria-label="Close dossier"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dossier Content */}
            <div className="space-y-4 text-xs">
              
              {/* Applicant Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E4E4E7]">
                <div>
                  <span className="text-[10px] font-bold text-[#52525B] uppercase block">Email Address:</span>
                  <span className="font-semibold text-[#18181B]">{selectedApplication.applicantEmail}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#52525B] uppercase block">Academic Level:</span>
                  <span className="font-semibold text-[#18181B]">{selectedApplication.applicantLevel}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#52525B] uppercase block">Application Status:</span>
                  <span className={`inline-block px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-bold ${
                    selectedApplication.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedApplication.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedApplication.status}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#52525B] uppercase block">Submission Date:</span>
                  <span className="font-semibold text-[#18181B]">
                    {new Date(selectedApplication.createdAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {selectedApplication.assignedClassId && (
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold text-[#52525B] uppercase block">Assigned Class ID:</span>
                    <span className="font-mono text-[#18181B]">{selectedApplication.assignedClassId}</span>
                  </div>
                )}
              </div>

              {/* Personal Testimony */}
              <div className="space-y-1">
                <span className="font-bold text-[#18181B] uppercase text-[10px] tracking-wider">
                  Salvation Testimony & Motivation:
                </span>
                <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E4E4E7] text-[#18181B] leading-relaxed">
                  {selectedApplication.testimony ? (
                    selectedApplication.testimony
                  ) : (
                    <span className="text-[#A1A1AA] italic">No testimony text was submitted with this application.</span>
                  )}
                </div>
              </div>

              {/* Review History where available */}
              {(selectedApplication.reviewedBy || selectedApplication.reviewedAt || selectedApplication.reviewNotes) && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-indigo-950 space-y-1">
                  <span className="font-bold uppercase text-[10px] block text-indigo-900">
                    Coordinator Review Record:
                  </span>
                  {selectedApplication.reviewedBy && (
                    <p className="text-[11px]"><strong>Reviewed By:</strong> {selectedApplication.reviewedBy}</p>
                  )}
                  {selectedApplication.reviewedAt && (
                    <p className="text-[11px]">
                      <strong>Reviewed At:</strong> {new Date(selectedApplication.reviewedAt).toLocaleString()}
                    </p>
                  )}
                  {selectedApplication.reviewNotes && (
                    <p className="text-[11px] mt-1"><strong>Notes:</strong> {selectedApplication.reviewNotes}</p>
                  )}
                </div>
              )}

              {/* Interactive Coordinator Review Form (Only for Pending applications) */}
              {selectedApplication.status === 'Pending' ? (
                <form onSubmit={handleReviewSubmit} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E4E4E7] space-y-3" id="fs-admission-review-form">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#5B0617]" />
                      <span>Review & Adjudicate Application</span>
                    </span>
                    <span className="text-[10px] text-[#5B0617] font-bold uppercase tracking-wider">
                      FS Coordinator Authority
                    </span>
                  </div>

                  {/* Decision selector */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReviewDecision('Approved');
                        setReviewError(null);
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        reviewDecision === 'Approved'
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                          : 'bg-white text-[#52525B] border-[#E4E4E7] hover:border-emerald-600'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Admission</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setReviewDecision('Rejected');
                        setReviewError(null);
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        reviewDecision === 'Rejected'
                          ? 'bg-rose-700 text-white border-rose-800 shadow-xs'
                          : 'bg-white text-[#52525B] border-[#E4E4E7] hover:border-rose-600'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Application</span>
                    </button>
                  </div>

                  {/* Assigned Class ID (Required when Approved) */}
                  {reviewDecision === 'Approved' && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717A] mb-1">
                        Assigned Class ID (UUID) <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={assignedClassId}
                        onChange={(e) => {
                          setAssignedClassId(e.target.value);
                          if (reviewError) setReviewError(null);
                        }}
                        placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000 or Class Code"
                        className="w-full p-2 rounded-lg bg-white border border-[#E4E4E7] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] font-mono"
                        id="fs-assigned-class-id-input"
                      />
                      <p className="text-[10px] text-[#71717A] mt-0.5">
                        Specify the class identifier this enrollee will be allocated to upon approval.
                      </p>
                    </div>
                  )}

                  {/* Review Notes */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717A] mb-1">
                      Coordinator Review Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Remarks, salvation interview confirmation, or batch cohort details..."
                      className="w-full p-2 rounded-lg bg-white border border-[#E4E4E7] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617]"
                      id="fs-review-notes-input"
                    />
                  </div>

                  {/* Review Error & Success Messages */}
                  {reviewError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 flex items-start gap-2" id="fs-review-error-msg">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  {reviewSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2" id="fs-review-success-msg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{reviewSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className={`w-full py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer ${
                      reviewDecision === 'Approved' ? 'bg-emerald-800 hover:bg-emerald-900' : 'bg-rose-800 hover:bg-rose-900'
                    }`}
                    id="submit-fs-admission-review-btn"
                  >
                    {isSubmittingReview ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting Adjudication...</span>
                      </>
                    ) : (
                      <>
                        {reviewDecision === 'Approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>Confirm & Submit {reviewDecision}</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-white border border-[#E4E4E7] rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#52525B]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>This application has been adjudicated with status: <strong className="text-[#18181B]">{selectedApplication.status}</strong></span>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E4E7]">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-[#18181B] text-xs font-bold hover:bg-white transition-all"
                id="fs-dossier-close-btn"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFSAdmissions;
