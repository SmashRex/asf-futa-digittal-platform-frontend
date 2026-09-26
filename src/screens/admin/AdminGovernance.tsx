/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import {
  governanceService,
  GovernanceRequestItem,
  formatGovernanceRequestTypeLabel,
  isGovernanceRequestPending,
  isGovernanceRequestApproved,
  isGovernanceRequestRejected,
} from '../../services/governance/governance.service';
import { 
  Scale, 
  ArrowLeft, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle,
  RefreshCw,
  AlertCircle,
  Eye,
  X,
  UserCheck
} from 'lucide-react';

function renderActorDisplay(actor: unknown, fallbackName?: string | null, fallbackEmail?: string | null, fallbackId?: string | null): string {
  if (typeof actor === 'string' && actor.trim()) return actor.trim();
  if (actor && typeof actor === 'object') {
    const obj = actor as Record<string, any>;
    const name = obj.name || obj.fullName || fallbackName;
    const email = obj.email || fallbackEmail;
    const id = obj.id || fallbackId;
    if (name && email) return `${name} (${email})`;
    if (name) return String(name);
    if (email) return String(email);
    if (id) return String(id);
  }
  if (fallbackName && fallbackEmail) return `${fallbackName} (${fallbackEmail})`;
  if (fallbackName) return fallbackName;
  if (fallbackEmail) return fallbackEmail;
  if (fallbackId) return fallbackId;
  return 'Not specified';
}

export const AdminGovernance: React.FC = () => {
  const navigate = useNavigate();
  const { activeRole } = useOutletContext<AdminContextType>();

  // President is the sole approval authority (Technical Head is NOT President authority)
  const isPresidentAuthority = activeRole === 'President / Executive';

  const [requests, setRequests] = useState<GovernanceRequestItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Approved' | 'Rejected'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'office_assignment' | 'dashboard_grant' | 'capability_grant'>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<{ statusCode?: number; code?: string; message: string } | null>(null);

  // Selected request for inspection / review
  const [selectedRequest, setSelectedRequest] = useState<GovernanceRequestItem | null>(null);

  // Action feedback & processing lock
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Rejection modal state
  const [rejectingRequest, setRejectingRequest] = useState<GovernanceRequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectValidationError, setRejectValidationError] = useState<string | null>(null);

  const loadGovernanceRequests = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const list = await governanceService.getPresidentRequests();
      setRequests(list);
      // Keep inspected request synced with refreshed state if open
      setSelectedRequest((prev) => {
        if (!prev) return null;
        return list.find((item) => item.id === prev.id) || prev;
      });
    } catch (err: any) {
      setRequests([]);
      setFetchError({
        statusCode: err?.statusCode,
        code: err?.code,
        message: err?.message || 'Unable to load governance requests from the backend.',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGovernanceRequests();
  }, [loadGovernanceRequests]);

  const handleApprove = async (req: GovernanceRequestItem) => {
    if (isProcessingAction || !isPresidentAuthority) return;
    setIsProcessingAction(true);
    setActionFeedback(null);
    try {
      await governanceService.approveRequest(req.id);
      await loadGovernanceRequests();
      setActionFeedback({
        type: 'success',
        message: `Governance request #${req.id} (${formatGovernanceRequestTypeLabel(req.requestType)}) has been approved.`,
      });
    } catch (err: any) {
      const statusPrefix = err?.statusCode ? `[HTTP ${err.statusCode}] ` : '';
      setActionFeedback({
        type: 'error',
        message: `${statusPrefix}${err?.message || 'Backend rejected the approval request.'}`,
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const openRejectModal = (req: GovernanceRequestItem) => {
    setRejectingRequest(req);
    setRejectReason('');
    setRejectValidationError(null);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingRequest || isProcessingAction || !isPresidentAuthority) return;

    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      setRejectValidationError('Please provide a reason for rejecting this governance request.');
      return;
    }

    setIsProcessingAction(true);
    setRejectValidationError(null);
    setActionFeedback(null);

    try {
      await governanceService.rejectRequest(rejectingRequest.id, trimmedReason);
      const rejectedId = rejectingRequest.id;
      const rejectedType = rejectingRequest.requestType;
      setRejectingRequest(null);
      setRejectReason('');
      await loadGovernanceRequests();
      setActionFeedback({
        type: 'success',
        message: `Governance request #${rejectedId} (${formatGovernanceRequestTypeLabel(rejectedType)}) has been rejected.`,
      });
    } catch (err: any) {
      const statusPrefix = err?.statusCode ? `[HTTP ${err.statusCode}] ` : '';
      const message = `${statusPrefix}${err?.message || 'Failed to reject governance request.'}`;
      setRejectValidationError(message);
      setActionFeedback({
        type: 'error',
        message,
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'Pending' && !isGovernanceRequestPending(req.status)) return false;
      if (statusFilter === 'Approved' && !isGovernanceRequestApproved(req.status)) return false;
      if (statusFilter === 'Rejected' && !isGovernanceRequestRejected(req.status)) return false;
    }
    if (typeFilter !== 'ALL' && req.requestType !== typeFilter) {
      return false;
    }
    return true;
  });

  const pendingCount = requests.filter((r) => isGovernanceRequestPending(r.status)).length;
  const approvedCount = requests.filter((r) => isGovernanceRequestApproved(r.status)).length;
  const rejectedCount = requests.filter((r) => isGovernanceRequestRejected(r.status)).length;

  return (
    <div className="governance-page space-y-6 max-w-7xl mx-auto pb-12" id="governance-requests-view">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E4E4E7] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#52525B] mb-1 font-medium">
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="hover:text-[#5B0617] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Presidential Portal</span>
            </button>
            <span>/</span>
            <span className="text-[#5B0617] font-semibold">Governance & Approvals</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight flex items-center gap-2.5">
            <Scale className="w-6 h-6 text-[#5B0617]" />
            Governance & Executive Approvals
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-3xl">
            Presidential review and approval of governance requests for executive office assignments, dashboard grants, and capability elevations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadGovernanceRequests}
            disabled={isLoading || isProcessingAction}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E4E4E7] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#18181B] transition-colors shadow-xs"
            id="refresh-governance-requests-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#5B0617]' : 'text-[#52525B]'}`} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Non-President Authority Notice (Technical Head is NOT President Authority) */}
      {!isPresidentAuthority && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900" id="non-president-governance-notice">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Presidential Approval Authority Required</p>
            <p>
              Governance approval and rejection require explicit President dashboard authorization. Technical Head or other administrative capabilities cannot substitute for Presidential sign-off.
            </p>
          </div>
        </div>
      )}

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div
          className={`p-4 rounded-2xl border flex items-start justify-between gap-3 text-xs ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
          id="governance-action-feedback"
        >
          <div className="flex items-start gap-2.5">
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            )}
            <span className="font-medium">{actionFeedback.message}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-[#52525B] hover:text-[#18181B]"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Backend Fetch Error Banner (401/403/500) */}
      {fetchError && (
        <div
          className={`p-5 rounded-2xl border flex items-start gap-3 text-xs ${
            fetchError.statusCode === 403 || fetchError.statusCode === 401
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
          id="governance-fetch-error"
        >
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-[#5B0617]" />
          <div className="space-y-1">
            <p className="font-bold text-sm">
              {fetchError.statusCode === 403
                ? 'Access Denied (HTTP 403): President Dashboard Access Required'
                : fetchError.statusCode === 401
                ? 'Unauthenticated Session (HTTP 401)'
                : 'Unable to Load Governance Requests'}
            </p>
            <p>{fetchError.message}</p>
          </div>
        </div>
      )}

      {/* Summary Counters & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#52525B]">Pending Review</span>
            <p className="text-2xl font-bold text-amber-800 mt-1">{pendingCount}</p>
          </div>
          <Clock className="w-5 h-5 text-amber-700" />
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#52525B]">Approved</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{approvedCount}</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#52525B]">Rejected</span>
            <p className="text-2xl font-bold text-rose-700 mt-1">{rejectedCount}</p>
          </div>
          <XCircle className="w-5 h-5 text-rose-700" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'Pending', 'Approved', 'Rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? 'bg-[#5B0617] text-white'
                  : 'bg-[#FAF8F5] text-[#52525B] hover:text-[#18181B] border border-[#E4E4E7]'
              }`}
            >
              {status === 'ALL' ? 'All Statuses' : status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold uppercase text-[#52525B]">Request Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
            id="governance-type-filter"
          >
            <option value="ALL">All Types</option>
            <option value="office_assignment">Office Assignment</option>
            <option value="dashboard_grant">Dashboard Grant</option>
            <option value="capability_grant">Capability Grant</option>
          </select>
        </div>
      </div>

      {/* Governance Requests List */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-xs text-[#52525B]">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#5B0617] mb-2" />
            Loading governance requests from backend...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Scale className="w-8 h-8 text-[#52525B] mx-auto opacity-50" />
            <p className="text-sm font-bold text-[#18181B]">No Governance Requests Found</p>
            <p className="text-xs text-[#52525B]">
              {fetchError
                ? 'Governance requests could not be loaded from the backend.'
                : 'There are currently no governance requests matching the selected filters.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E4E4E7]">
            {filteredRequests.map((req) => {
              const isPending = isGovernanceRequestPending(req.status);
              const isApproved = isGovernanceRequestApproved(req.status);
              const isRejected = isGovernanceRequestRejected(req.status);

              const requesterDisplay = renderActorDisplay(
                req.requester || req.requestedBy,
                req.requesterName,
                req.requesterEmail,
                req.requesterId
              );
              const targetDisplay = renderActorDisplay(
                req.targetUser || req.target,
                req.targetUserName,
                req.targetUserEmail,
                req.targetUserId || req.payload?.userId
              );

              return (
                <div
                  key={req.id}
                  className="p-5 hover:bg-[#FAF8F5]/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  data-testid={`governance-request-row-${req.id}`}
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isRejected
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                      >
                        {req.status}
                      </span>

                      <span className="px-2.5 py-0.5 rounded bg-[#5B0617]/10 text-[#5B0617] text-[11px] font-bold">
                        {formatGovernanceRequestTypeLabel(req.requestType)}
                      </span>

                      <code className="text-[11px] font-mono text-[#52525B]">#{req.id}</code>

                      {req.createdAt && (
                        <span className="text-[11px] text-[#52525B]">
                          • {new Date(req.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-[#52525B] font-semibold">Requester: </span>
                        <span className="text-[#18181B] font-medium">{requesterDisplay}</span>
                      </div>
                      <div>
                        <span className="text-[#52525B] font-semibold">Target Member: </span>
                        <span className="text-[#18181B] font-medium">{targetDisplay}</span>
                      </div>
                    </div>

                    {/* Safely display payload details when available */}
                    {req.payload && typeof req.payload === 'object' && Object.keys(req.payload).length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 text-xs bg-[#FAF8F5] px-3 py-2 rounded-xl border border-[#E4E4E7]">
                        {Object.entries(req.payload).map(([k, v]) => (
                          <span key={k} className="text-[#52525B]">
                            <strong className="text-[#18181B]">{k}:</strong>{' '}
                            <code className="font-mono text-[11px] text-[#5B0617]">
                              {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                            </code>
                          </span>
                        ))}
                      </div>
                    )}

                    {req.reason && (
                      <p className="text-xs text-[#52525B]">
                        <strong className="text-[#18181B]">Reason:</strong> {req.reason}
                      </p>
                    )}

                    {req.rejectionReason && (
                      <p className="text-xs text-rose-800 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                        <strong>Rejection Reason:</strong> {req.rejectionReason}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(req)}
                      className="px-3 py-2 rounded-xl border border-[#E4E4E7] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#18181B] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#52525B]" />
                      <span>Inspect</span>
                    </button>

                    {isPending && isPresidentAuthority && (
                      <>
                        <button
                          type="button"
                          disabled={isProcessingAction}
                          onClick={() => handleApprove(req)}
                          className="px-3.5 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          data-testid={`approve-request-btn-${req.id}`}
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{isProcessingAction ? 'Processing...' : 'Approve'}</span>
                        </button>

                        <button
                          type="button"
                          disabled={isProcessingAction}
                          onClick={() => openRejectModal(req)}
                          className="px-3.5 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          data-testid={`reject-request-btn-${req.id}`}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inspect Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-[#E4E4E7] shadow-2xl relative" id="governance-inspect-modal">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-[#52525B]"
              aria-label="Close inspection modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-[#5B0617] text-white rounded">
                  {formatGovernanceRequestTypeLabel(selectedRequest.requestType)}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-stone-100 text-[#18181B] border border-[#E4E4E7]">
                  {selectedRequest.status}
                </span>
              </div>
              <h2 className="font-serif font-bold text-lg text-[#18181B] pt-1">
                Governance Request #{selectedRequest.id}
              </h2>
              <p className="text-xs text-[#52525B]">
                Request Type Code: <code className="font-mono">{selectedRequest.requestType}</code>
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E4E4E7] space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#52525B]">Requester:</span>
                <strong className="text-[#18181B] text-right">
                  {renderActorDisplay(
                    selectedRequest.requester || selectedRequest.requestedBy,
                    selectedRequest.requesterName,
                    selectedRequest.requesterEmail,
                    selectedRequest.requesterId
                  )}
                </strong>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-[#52525B]">Target Member:</span>
                <strong className="text-[#18181B] text-right">
                  {renderActorDisplay(
                    selectedRequest.targetUser || selectedRequest.target,
                    selectedRequest.targetUserName,
                    selectedRequest.targetUserEmail,
                    selectedRequest.targetUserId || selectedRequest.payload?.userId
                  )}
                </strong>
              </div>

              {selectedRequest.createdAt && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#52525B]">Submitted At:</span>
                  <span className="text-[#18181B]">{new Date(selectedRequest.createdAt).toLocaleString()}</span>
                </div>
              )}

              {selectedRequest.reason && (
                <div className="pt-2 border-t border-[#E4E4E7]">
                  <span className="text-[#52525B] block mb-1">Reason / Notes:</span>
                  <p className="text-[#18181B] font-medium">{selectedRequest.reason}</p>
                </div>
              )}

              {selectedRequest.rejectionReason && (
                <div className="pt-2 border-t border-[#E4E4E7]">
                  <span className="text-rose-800 font-bold block mb-1">Rejection Reason:</span>
                  <p className="text-rose-900">{selectedRequest.rejectionReason}</p>
                </div>
              )}
            </div>

            {selectedRequest.payload && typeof selectedRequest.payload === 'object' && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B]">
                  Request Payload Details
                </h3>
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E4E4E7] text-xs space-y-1.5">
                  {Object.entries(selectedRequest.payload).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#52525B]">{k}:</span>
                      <code className="font-mono text-[11px] text-[#5B0617]">
                        {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#E4E4E7] flex flex-wrap items-center justify-end gap-2">
              {isGovernanceRequestPending(selectedRequest.status) && isPresidentAuthority && (
                <>
                  <button
                    type="button"
                    disabled={isProcessingAction}
                    onClick={() => {
                      const reqToReject = selectedRequest;
                      setSelectedRequest(null);
                      openRejectModal(reqToReject);
                    }}
                    className="px-4 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold disabled:opacity-50"
                  >
                    Reject Request
                  </button>

                  <button
                    type="button"
                    disabled={isProcessingAction}
                    onClick={() => handleApprove(selectedRequest)}
                    className="px-4 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold disabled:opacity-50"
                  >
                    {isProcessingAction ? 'Approving...' : 'Approve Request'}
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs font-semibold text-[#18181B]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Governance Request Modal (Requires Reason) */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#E4E4E7] shadow-2xl relative" id="governance-reject-modal">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <h3 className="text-base font-serif font-bold text-[#18181B]">
                Reject Governance Request
              </h3>
              <button
                type="button"
                onClick={() => setRejectingRequest(null)}
                disabled={isProcessingAction}
                aria-label="Close rejection modal"
              >
                <X className="w-5 h-5 text-[#52525B]" />
              </button>
            </div>

            <p className="text-xs text-[#52525B]">
              Provide an explicit reason for rejecting request{' '}
              <strong className="text-[#18181B]">#{rejectingRequest.id}</strong> (
              {formatGovernanceRequestTypeLabel(rejectingRequest.requestType)}).
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">
                  Rejection Reason <span className="text-rose-600">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => {
                    setRejectReason(e.target.value);
                    if (rejectValidationError) setRejectValidationError(null);
                  }}
                  placeholder="Enter reason for rejecting this governance request..."
                  className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs text-[#18181B] h-24 focus:bg-white focus:outline-none focus:border-[#5B0617]"
                  id="governance-reject-reason-input"
                  required
                />
                {rejectValidationError && (
                  <p className="text-xs text-rose-700 font-medium mt-1.5 flex items-center gap-1" id="governance-reject-error">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{rejectValidationError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isProcessingAction}
                  onClick={() => setRejectingRequest(null)}
                  className="px-4 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs font-semibold text-[#18181B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingAction}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold disabled:opacity-50"
                  id="confirm-governance-reject-btn"
                >
                  {isProcessingAction ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
