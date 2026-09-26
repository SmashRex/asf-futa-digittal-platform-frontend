/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Search,
  RefreshCw,
  Download,
  Lock,
  ArrowRight,
  ArrowLeft,
  Info,
  XCircle,
  Check,
  Sparkles,
  Building2,
  User,
  Award,
  Repeat
} from 'lucide-react';
import {
  handoverService,
  HandoverRecord,
  HandoverValidationErrorItem,
  HandoverAssignmentItem,
  extractHandoverValidationErrors,
  isHandoverValidated,
  isHandoverApproved,
  isHandoverPublished,
  isHandoverInvalid,
} from '../../services/handover/handover.service';
import { CANONICAL_EXECUTIVE_OFFICES } from '../../services/president/president.service';
import { ApiError } from '../../services/api/types';

function renderOfficeLabel(row: HandoverAssignmentItem): string {
  if (row.officeName) return row.officeName;
  const rawOffice: unknown = row.office;
  if (rawOffice && typeof rawOffice === 'object') {
    const obj = rawOffice as { id?: string; name?: string };
    return obj.name || obj.id || row.officeId || '—';
  }
  if (typeof rawOffice === 'string' && rawOffice.trim()) {
    return rawOffice.trim();
  }
  return row.officeId || '—';
}

function renderMemberLabel(row: HandoverAssignmentItem): string {
  if (row.memberName) return row.memberName;
  if (row.member && typeof row.member === 'object') {
    return row.member.name || row.member.email || row.member.id || row.memberId || '—';
  }
  if (typeof (row as any).name === 'string' && (row as any).name.trim()) {
    return (row as any).name.trim();
  }
  return row.memberId || '—';
}

function renderDepartmentLabel(row: HandoverAssignmentItem): string {
  if (row.department) return row.department;
  if (row.member && typeof row.member === 'object' && row.member.department) {
    return row.member.department;
  }
  return '—';
}

function renderAcademicLevelLabel(row: HandoverAssignmentItem): string {
  if (row.academicLevel) return row.academicLevel;
  if (row.member && typeof row.member === 'object' && row.member.academicLevel) {
    return row.member.academicLevel;
  }
  return '—';
}

export const AdminHandover: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<AdminContextType | undefined>();
  const activeRole = context?.activeRole ?? 'President / Executive';
  const isPresidentAuthority = activeRole === 'President / Executive';

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvRawText, setCsvRawText] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Lookup by ID state
  const [lookupId, setLookupId] = useState<string>('');
  const [isLoadingHandover, setIsLoadingHandover] = useState(false);

  // Active Handover Record from backend
  const [handover, setHandover] = useState<HandoverRecord | null>(null);
  const [standaloneValidationErrors, setStandaloneValidationErrors] = useState<
    HandoverValidationErrorItem[]
  >([]);

  // Lifecycle mutation state
  const [isApproving, setIsApproving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Feedback messages
  const [errorBanner, setErrorBanner] = useState<{
    title: string;
    message: string;
    isForbidden?: boolean;
  } | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [showOfficesReference, setShowOfficesReference] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setErrorBanner(null);
    setActionSuccess(null);
    setStandaloneValidationErrors([]);

    try {
      const text = await file.text();
      // Preserve exact raw CSV text without silent repairs
      setCsvRawText(text);
    } catch {
      setCsvRawText('');
    }
  };

  const handleDownloadTemplate = () => {
    const sampleRows = [
      'memberId,officeId',
      'member-uuid-1,President',
      'member-uuid-2,Vice President',
      'member-uuid-3,General Secretary',
    ].join('\n');

    const blob = new Blob([sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'asf_executive_handover_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const extractApiError = (err: unknown, fallbackTitle: string) => {
    const apiErr = err as ApiError;
    if (apiErr?.statusCode === 401 || apiErr?.statusCode === 403) {
      return {
        title:
          apiErr.statusCode === 401
            ? 'Authentication Required (HTTP 401)'
            : 'President Authorization Required (HTTP 403)',
        message:
          apiErr.message ||
          'Only an authenticated President account can perform Executive Handover operations.',
        isForbidden: true,
      };
    }
    return {
      title: fallbackTitle,
      message:
        err instanceof Error
          ? err.message
          : apiErr?.message || 'An unexpected backend error occurred.',
      isForbidden: false,
    };
  };

  const handleUploadAndValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPresidentAuthority) return;

    if (!selectedFile && !csvRawText.trim()) {
      setErrorBanner({
        title: 'CSV Input Required',
        message: 'Please select a CSV file or provide raw CSV content with headers: memberId,officeId',
      });
      return;
    }

    setIsUploading(true);
    setErrorBanner(null);
    setActionSuccess(null);
    setStandaloneValidationErrors([]);

    try {
      // Pass exact file or raw CSV text without silently modifying invalid rows
      const payload = selectedFile || csvRawText;
      const result = await handoverService.uploadHandover(payload);
      setHandover(result);
      if (result.id) {
        setLookupId(result.id);
      }

      if (isHandoverInvalid(result.status) || result.validationErrors.length > 0) {
        setErrorBanner({
          title: 'Handover CSV Validation Issues Reported',
          message:
            'The backend reported validation errors in the uploaded CSV. Review the row-level validation details below.',
        });
      } else {
        setActionSuccess(
          `Handover #${result.id || 'record'} uploaded and validated by the backend. Inspect the assignments below before approving.`
        );
      }
    } catch (err: any) {
      const extractedErrors = extractHandoverValidationErrors(err);
      if (extractedErrors.length > 0) {
        setStandaloneValidationErrors(extractedErrors);
      }
      setErrorBanner(extractApiError(err, 'Handover Upload & Validation Failed'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleInspectById = async (idToFetch?: string) => {
    const targetId = (idToFetch ?? lookupId).trim();
    if (!targetId) {
      setErrorBanner({
        title: 'Handover ID Required',
        message: 'Enter a valid Handover ID to inspect its validation state and assignments.',
      });
      return;
    }

    setIsLoadingHandover(true);
    setErrorBanner(null);
    setActionSuccess(null);
    setStandaloneValidationErrors([]);

    try {
      const record = await handoverService.getHandoverById(targetId);
      setHandover(record);
      setLookupId(record.id || targetId);
    } catch (err) {
      setErrorBanner(extractApiError(err, 'Failed to Load Handover Record'));
    } finally {
      setIsLoadingHandover(false);
    }
  };

  const handleApproveHandover = async () => {
    if (!handover?.id || !isPresidentAuthority) return;
    if (!isHandoverValidated(handover.status)) return;

    setIsApproving(true);
    setErrorBanner(null);
    setActionSuccess(null);

    try {
      const updated = await handoverService.approveHandover(handover.id);
      setHandover(updated);
      setActionSuccess(
        `Executive Handover #${updated.id || handover.id} has been officially Approved. You may now Publish the handover to execute the transition.`
      );
    } catch (err) {
      setErrorBanner(extractApiError(err, 'Handover Approval Failed'));
    } finally {
      setIsApproving(false);
    }
  };

  const handlePublishHandover = async () => {
    if (!handover?.id || !isPresidentAuthority) return;
    if (!isHandoverApproved(handover.status)) return;

    setIsPublishing(true);
    setErrorBanner(null);
    setActionSuccess(null);

    try {
      const updated = await handoverService.publishHandover(handover.id);
      setHandover(updated);
      setActionSuccess(
        `Executive Handover #${updated.id || handover.id} Published! The backend has executed the executive office transition.`
      );
    } catch (err) {
      setErrorBanner(extractApiError(err, 'Handover Publication Failed'));
    } finally {
      setIsPublishing(false);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    if (isHandoverPublished(status)) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
    if (isHandoverApproved(status)) {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    if (isHandoverValidated(status)) {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    if (isHandoverInvalid(status)) {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    return 'bg-stone-100 text-stone-700 border-stone-300';
  };

  const canApprove =
    isPresidentAuthority &&
    Boolean(handover?.id) &&
    isHandoverValidated(handover?.status) &&
    (handover?.validationErrors?.length ?? 0) === 0;

  const canPublish =
    isPresidentAuthority &&
    Boolean(handover?.id) &&
    isHandoverApproved(handover?.status);

  const combinedValidationErrors = [
    ...(handover?.validationErrors ?? []),
    ...standaloneValidationErrors,
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12" id="executive-handover-view">
      {/* Header */}
      <div className="bg-white rounded-[2rem] p-8 border border-stone-200/80 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 font-medium">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="hover:text-[#5B0617] flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Presidential Portal</span>
              </button>
              <span>/</span>
              <span className="text-[#5B0617] font-semibold">Executive Handover</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1917] text-white text-[10px] font-bold uppercase tracking-widest mb-3">
              <Repeat size={12} className="text-[#E11D48]" />
              Presidential Executive Transition
            </div>
            <h1 className="font-serif text-3xl text-[#1C1917]">
              Executive Handover & Tenure Transition
            </h1>
            <p className="text-sm text-stone-500 mt-1 max-w-2xl">
              Upload, validate, inspect, approve, and publish the incoming executive leadership slate via the authoritative backend transition workflow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-bold text-[#1C1917] transition-colors"
            >
              <Download size={15} className="text-[#E11D48]" />
              Download CSV Template
            </button>
            <button
              type="button"
              onClick={() => setShowOfficesReference((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 transition-colors"
            >
              <Info size={15} className="text-stone-500" />
              {showOfficesReference
                ? 'Hide Canonical Offices'
                : `View Canonical Offices (${CANONICAL_EXECUTIVE_OFFICES.length})`}
            </button>
          </div>
        </div>

        {/* Lifecycle Stepper */}
        <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            {
              step: '1',
              title: 'Upload & Validate',
              endpoint: 'POST /api/president/handovers',
              active: !handover || isHandoverInvalid(handover.status),
              done:
                Boolean(handover) &&
                (isHandoverValidated(handover?.status) ||
                  isHandoverApproved(handover?.status) ||
                  isHandoverPublished(handover?.status)),
            },
            {
              step: '2',
              title: 'Inspect Slate',
              endpoint: 'GET /api/president/handovers/:id',
              active: isHandoverValidated(handover?.status),
              done:
                Boolean(handover) &&
                (isHandoverValidated(handover?.status) ||
                  isHandoverApproved(handover?.status) ||
                  isHandoverPublished(handover?.status)),
            },
            {
              step: '3',
              title: 'Approve Handover',
              endpoint: 'POST /api/president/handovers/:id/approve',
              active: isHandoverValidated(handover?.status),
              done:
                Boolean(handover) &&
                (isHandoverApproved(handover?.status) ||
                  isHandoverPublished(handover?.status)),
            },
            {
              step: '4',
              title: 'Publish Transition',
              endpoint: 'POST /api/president/handovers/:id/publish',
              active: isHandoverApproved(handover?.status),
              done: isHandoverPublished(handover?.status),
            },
          ].map((item) => (
            <div
              key={item.step}
              className={`p-4 rounded-2xl border transition-all ${
                item.done
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : item.active
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 border-stone-200/70 text-stone-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${
                    item.done
                      ? 'text-emerald-700'
                      : item.active
                      ? 'text-amber-400'
                      : 'text-stone-400'
                  }`}
                >
                  Step {item.step}
                </span>
                {item.done && <CheckCircle2 size={15} className="text-emerald-600" />}
              </div>
              <p
                className={`text-sm font-bold ${
                  item.done
                    ? 'text-emerald-950'
                    : item.active
                    ? 'text-white'
                    : 'text-stone-700'
                }`}
              >
                {item.title}
              </p>
              <p
                className={`text-[11px] font-mono mt-1 truncate ${
                  item.done
                    ? 'text-emerald-700'
                    : item.active
                    ? 'text-stone-300'
                    : 'text-stone-400'
                }`}
              >
                {item.endpoint}
              </p>
            </div>
          ))}
        </div>

        {/* Canonical Offices Reference Drawer */}
        {showOfficesReference && (
          <div className="mt-6 p-6 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1917]">
                Canonical Executive Offices ({CANONICAL_EXECUTIVE_OFFICES.length}) & Strict CSV Contract
              </h3>
              <span className="text-[11px] font-mono bg-white px-2.5 py-1 rounded-lg border border-stone-200 text-stone-700">
                Strict CSV Header: memberId,officeId
              </span>
            </div>
            <p className="text-xs text-stone-600 mb-4">
              The backend validates every row against canonical executive offices and active fellowship members. Invalid CSV data is never silently repaired on the frontend.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {CANONICAL_EXECUTIVE_OFFICES.map((office) => (
                <div
                  key={office}
                  className="px-3 py-2 rounded-xl bg-white border border-stone-200/80 text-xs font-medium text-[#1C1917] flex items-center gap-1.5"
                >
                  <Award size={12} className="text-[#E11D48] shrink-0" />
                  <span className="truncate" title={office}>
                    {office}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Non-President Notice */}
      {!isPresidentAuthority && (
        <div
          role="alert"
          className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3 text-xs"
        >
          <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">President Authorization Required</p>
            <p className="mt-0.5">
              Uploading, approving, and publishing an Executive Handover requires explicit President authority. Technical Head or other offices cannot substitute for Presidential sign-off.
            </p>
          </div>
        </div>
      )}

      {/* Feedback Banners */}
      {errorBanner && (
        <div
          role="alert"
          className={`p-6 rounded-2xl border flex items-start gap-4 ${
            errorBanner.isForbidden
              ? 'bg-red-950 text-white border-red-800'
              : 'bg-red-50 text-red-950 border-red-200'
          }`}
          id="handover-error-banner"
        >
          <AlertTriangle
            size={22}
            className={
              errorBanner.isForbidden ? 'text-red-400 shrink-0 mt-0.5' : 'text-red-600 shrink-0 mt-0.5'
            }
          />
          <div className="flex-1">
            <h3 className="text-sm font-bold">{errorBanner.title}</h3>
            <p
              className={`text-xs mt-1 leading-relaxed ${
                errorBanner.isForbidden ? 'text-red-200' : 'text-red-800'
              }`}
            >
              {errorBanner.message}
            </p>
          </div>
        </div>
      )}

      {actionSuccess && (
        <div
          role="status"
          className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3"
          id="handover-success-banner"
        >
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs font-medium leading-relaxed">{actionSuccess}</div>
        </div>
      )}

      {/* Standalone Backend Validation Errors (if upload threw 400/422 with row errors) */}
      {!handover && standaloneValidationErrors.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50/50 overflow-hidden">
          <div className="px-6 py-4 bg-red-100/80 border-b border-red-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <XCircle size={18} className="text-red-600" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-red-950">
                Backend CSV Validation Errors ({standaloneValidationErrors.length})
              </h3>
            </div>
            <span className="text-xs text-red-800 font-medium">
              Fix errors in CSV and upload again
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-red-200/70 text-[10px] font-bold uppercase tracking-widest text-red-800">
                  <th className="py-3 px-6">Row</th>
                  <th className="py-3 px-6">Field / Code</th>
                  <th className="py-3 px-6">Member / Office</th>
                  <th className="py-3 px-6">Error Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-200/50 text-xs text-red-950">
                {standaloneValidationErrors.map((errItem, idx) => (
                  <tr key={idx} className="hover:bg-red-100/40">
                    <td className="py-3 px-6 font-mono font-bold">
                      {errItem.row !== undefined ? `Row ${errItem.row}` : '—'}
                    </td>
                    <td className="py-3 px-6 font-mono">
                      {errItem.field || errItem.code || '—'}
                    </td>
                    <td className="py-3 px-6 font-mono text-red-800">
                      {[errItem.memberId, errItem.officeId].filter(Boolean).join(' / ') || '—'}
                    </td>
                    <td className="py-3 px-6 font-medium">{errItem.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload & Inspect Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step 1: Upload Handover CSV */}
        <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E11D48]">
                  Step 1 • Upload & Validate
                </span>
                <h2 className="font-serif text-xl text-[#1C1917] mt-0.5">
                  Submit Executive Handover CSV
                </h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#1C1917]">
                <Upload size={18} />
              </div>
            </div>

            <form onSubmit={handleUploadAndValidate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Handover CSV File (<code className="text-[#E11D48]">memberId,officeId</code>)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-200 hover:border-[#1C1917] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-stone-50/50"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    className="hidden"
                    data-testid="handover-csv-input"
                  />
                  <FileText size={28} className="mx-auto text-stone-400 mb-2" />
                  {selectedFile ? (
                    <div>
                      <p className="text-sm font-bold text-[#1C1917]">{selectedFile.name}</p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Click to replace file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-bold text-[#1C1917]">
                        Click to select CSV file
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        Strict header contract: <span className="font-mono">memberId,officeId</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                    Raw CSV Content (Sent Unmodified to Backend)
                  </label>
                  <span className="text-[11px] text-stone-400">
                    No client-side silent repairs
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={csvRawText}
                  onChange={(e) => {
                    setCsvRawText(e.target.value);
                    if (selectedFile) {
                      setSelectedFile(null);
                    }
                  }}
                  placeholder={'memberId,officeId\nmem-uuid-01,President\nmem-uuid-02,Vice President'}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 font-mono text-xs text-stone-800 focus:outline-none focus:border-[#1C1917]"
                  id="handover-csv-textarea"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <p className="text-[11px] text-stone-500">
                  Uploading validates the CSV via <code className="font-mono">POST /api/president/handovers</code>. It will <strong>not</strong> publish changes until you explicitly approve and publish.
                </p>
                <button
                  type="submit"
                  disabled={
                    !isPresidentAuthority ||
                    isUploading ||
                    (!selectedFile && !csvRawText.trim())
                  }
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1C1917] hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  id="upload-handover-btn"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Upload size={15} />
                      Upload & Validate
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Step 2: Inspect Existing Handover & Publication Rules */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-stone-200/80 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Step 2 • Inspect Handover Record
            </span>
            <h2 className="font-serif text-xl text-[#1C1917] mt-0.5 mb-4">
              Load Handover by ID
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Retrieve an existing handover record from <code className="font-mono text-stone-700">GET /api/president/handovers/:id</code> to inspect validation results or complete approval and publication.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="text"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  placeholder="Enter Handover ID..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none focus:border-[#1C1917]"
                  id="handover-lookup-id-input"
                />
              </div>
              <button
                type="button"
                onClick={() => handleInspectById()}
                disabled={isLoadingHandover || !lookupId.trim()}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                id="inspect-handover-btn"
              >
                {isLoadingHandover ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <ArrowRight size={14} />
                )}
                Inspect
              </button>
            </div>
          </div>

          {/* Backend Publication Authority Notice */}
          <div className="bg-[#1C1917] text-white rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <Lock size={16} className="text-[#E11D48]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-300">
                Authoritative Handover Lifecycle Rules
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-stone-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict CSV Validation:</strong> Backend validates <code className="text-amber-300 font-mono">memberId,officeId</code> rows, checking member eligibility, canonical offices, and duplicate assignments.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Two-Stage Presidential Sign-Off:</strong> A handover must first be <code className="text-amber-300 font-mono">Validated</code>, then explicitly <code className="text-amber-300 font-mono">Approved</code> before <code className="text-amber-300 font-mono">Publish</code> is enabled.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Atomic Tenure Transition:</strong> Publishing ends outgoing executive assignments, activates incoming executive offices, and logs a permanent audit trail on the backend.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Active Handover Inspection & Lifecycle Controls */}
      {handover && (
        <div
          className="bg-white rounded-[2rem] p-8 border border-stone-200/80 shadow-sm space-y-8"
          id="handover-detail-panel"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-100">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                    handover.status
                  )}`}
                  data-testid="handover-status-badge"
                >
                  {isHandoverInvalid(handover.status) ? (
                    <XCircle size={14} />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  {handover.status}
                </span>
                <span className="text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1 rounded-lg">
                  ID: {handover.id || 'N/A'}
                </span>
                {handover.academicSessionId && (
                  <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-lg">
                    Session: {handover.academicSessionId}
                  </span>
                )}
              </div>
              <h2 className="font-serif text-2xl text-[#1C1917]">
                Handover Verification & Lifecycle Control
              </h2>
              <div className="flex flex-wrap gap-4 text-xs text-stone-500 mt-1">
                {handover.createdAt && (
                  <span>Uploaded: {new Date(handover.createdAt).toLocaleString()}</span>
                )}
                {handover.approvedAt && (
                  <span>Approved: {new Date(handover.approvedAt).toLocaleString()}</span>
                )}
                {handover.publishedAt && (
                  <span>Published: {new Date(handover.publishedAt).toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Step 3 & Step 4 Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {handover.id && (
                <button
                  type="button"
                  onClick={() => handleInspectById(handover.id)}
                  disabled={isLoadingHandover}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 inline-flex items-center gap-1.5"
                >
                  <RefreshCw size={14} className={isLoadingHandover ? 'animate-spin' : ''} />
                  Refresh State
                </button>
              )}

              <button
                type="button"
                onClick={handleApproveHandover}
                disabled={!canApprove || isApproving || isPublishing}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-stone-200 disabled:text-stone-400 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                id="approve-handover-btn"
              >
                {isApproving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} />
                    Approve Handover
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePublishHandover}
                disabled={!canPublish || isPublishing || isApproving}
                className="px-5 py-2.5 rounded-xl bg-[#E11D48] hover:bg-rose-700 disabled:bg-stone-200 disabled:text-stone-400 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                id="publish-handover-btn"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Publish Handover
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Backend Validation Errors Section */}
          {handover.validationErrors.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50/50 overflow-hidden">
              <div className="px-6 py-4 bg-red-100/80 border-b border-red-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <XCircle size={18} className="text-red-600" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-red-950">
                    Backend Validation Errors ({handover.validationErrors.length})
                  </h3>
                </div>
                <span className="text-xs text-red-800 font-medium">
                  Approval & publication are blocked until all validation errors are resolved
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-red-200/70 text-[10px] font-bold uppercase tracking-widest text-red-800">
                      <th className="py-3 px-6">Row</th>
                      <th className="py-3 px-6">Field / Code</th>
                      <th className="py-3 px-6">Member / Office</th>
                      <th className="py-3 px-6">Error Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-200/50 text-xs text-red-950">
                    {handover.validationErrors.map((errItem, idx) => (
                      <tr key={idx} className="hover:bg-red-100/40">
                        <td className="py-3 px-6 font-mono font-bold">
                          {errItem.row !== undefined ? `Row ${errItem.row}` : '—'}
                        </td>
                        <td className="py-3 px-6 font-mono">
                          {errItem.field || errItem.code || '—'}
                        </td>
                        <td className="py-3 px-6 font-mono text-red-800">
                          {[errItem.memberId, errItem.officeId].filter(Boolean).join(' / ') || '—'}
                        </td>
                        <td className="py-3 px-6 font-medium">{errItem.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Validated / Incoming Assignments Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">
                Incoming Executive Assignments ({handover.assignments.length})
              </h3>
              {isHandoverValidated(handover.status) && (
                <span className="text-xs text-amber-700 font-medium">
                  Validated • Ready for Presidential Approval
                </span>
              )}
              {isHandoverApproved(handover.status) && (
                <span className="text-xs text-blue-700 font-medium">
                  Approved • Ready to Publish
                </span>
              )}
              {isHandoverPublished(handover.status) && (
                <span className="text-xs text-emerald-700 font-bold">
                  Published & Active
                </span>
              )}
            </div>

            {handover.assignments.length === 0 ? (
              <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200/60 text-center text-xs text-stone-500">
                No validated executive assignment rows returned for this handover record.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      <th className="py-3.5 px-6">Executive Office</th>
                      <th className="py-3.5 px-6">Incoming Member</th>
                      <th className="py-3.5 px-6">Member ID</th>
                      <th className="py-3.5 px-6">Department / Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/70 text-xs">
                    {handover.assignments.map((row, idx) => (
                      <tr
                        key={`${row.officeId}-${row.memberId}-${idx}`}
                        className="hover:bg-stone-50/80"
                      >
                        <td className="py-3.5 px-6 font-bold text-[#1C1917]">
                          <div className="flex items-center gap-2">
                            <Award size={14} className="text-[#E11D48] shrink-0" />
                            <span>{renderOfficeLabel(row)}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 font-medium text-stone-800">
                          <div className="flex items-center gap-2">
                            <User size={13} className="text-stone-400 shrink-0" />
                            <span>{renderMemberLabel(row)}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 font-mono text-stone-600">
                          {row.memberId || '—'}
                        </td>
                        <td className="py-3.5 px-6 text-stone-600">
                          <div className="flex items-center gap-2">
                            <Building2 size={13} className="text-stone-400 shrink-0" />
                            <span>
                              {renderDepartmentLabel(row)}
                              {renderAcademicLevelLabel(row) !== '—'
                                ? ` (${renderAcademicLevelLabel(row)})`
                                : ''}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
