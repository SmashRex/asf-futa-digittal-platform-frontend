/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
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
  ArrowLeft, 
  CheckCircle2, 
  UserCheck, 
  X,
  RefreshCw,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';

export const AdminGovernanceDetail: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { activeRole } = useOutletContext<AdminContextType>();

  const isPresidentAuthority = activeRole === 'President / Executive';

  const [request, setRequest] = useState<GovernanceRequestItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const loadRequestDetail = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const list = await governanceService.getPresidentRequests();
      const found = list.find((r) => r.id === requestId) || null;
      setRequest(found);
      if (!found) {
        setErrorMsg('Requested governance record was not found.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to retrieve governance request from backend.');
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    loadRequestDetail();
  }, [loadRequestDetail]);

  const handleApprove = async () => {
    if (!request || isProcessing || !isPresidentAuthority) return;
    setIsProcessing(true);
    setFeedback(null);
    try {
      await governanceService.approveRequest(request.id);
      await loadRequestDetail();
      setFeedback({ type: 'success', message: 'Governance request approved.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Approval failed.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !rejectReason.trim() || isProcessing || !isPresidentAuthority) return;
    setIsProcessing(true);
    setFeedback(null);
    try {
      await governanceService.rejectRequest(request.id, rejectReason.trim());
      setIsRejectModalOpen(false);
      setRejectReason('');
      await loadRequestDetail();
      setFeedback({ type: 'success', message: 'Governance request rejected.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Rejection failed.' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-xs text-[#52525B]">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#5B0617] mb-2" />
        Loading governance request from backend...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-8 text-center space-y-4">
        <ShieldAlert className="w-8 h-8 text-[#5B0617] mx-auto" />
        <h2 className="text-xl font-serif font-bold text-[#18181B]">
          {errorMsg || 'Governance Request Not Found'}
        </h2>
        <button
          onClick={() => navigate('/admin/governance')}
          className="px-4 py-2 rounded-xl bg-[#5B0617] text-white text-xs font-bold"
        >
          Back to Governance Requests
        </button>
      </div>
    );
  }

  const isPending = isGovernanceRequestPending(request.status);
  const isApproved = isGovernanceRequestApproved(request.status);
  const isRejected = isGovernanceRequestRejected(request.status);

  return (
    <div className="governance-detail-page space-y-6 max-w-5xl mx-auto pb-12" id="governance-detail-view">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4">
        <button
          onClick={() => navigate('/admin/governance')}
          className="text-xs flex items-center gap-2 text-[#52525B] hover:text-[#5B0617] font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Governance Pipeline</span>
        </button>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            isApproved
              ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
              : isRejected
              ? 'bg-rose-100 text-rose-900 border-rose-200'
              : 'bg-amber-100 text-amber-900 border-amber-200'
          }`}
        >
          {request.status}
        </span>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-2 text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Request Information Card */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 space-y-6 shadow-xs">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#5B0617]">
            REQUEST #{request.id}
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] mt-1">
            {formatGovernanceRequestTypeLabel(request.requestType)}
          </h1>
          <p className="text-xs text-[#52525B] mt-1">
            Request Type: <strong>{request.requestType}</strong>
          </p>
        </div>

        {request.payload && typeof request.payload === 'object' && (
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E4E4E7] space-y-2 text-xs">
            <span className="font-bold text-[#52525B] uppercase tracking-wider block">Request Payload</span>
            {Object.entries(request.payload).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-2">
                <span className="text-[#52525B]">{k}:</span>
                <code className="font-mono text-[#5B0617]">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</code>
              </div>
            ))}
          </div>
        )}

        {isPending && isPresidentAuthority && (
          <div className="border-t border-[#E4E4E7] pt-5 flex items-center justify-end gap-2">
            <button
              onClick={() => setIsRejectModalOpen(true)}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 text-xs font-bold disabled:opacity-50"
            >
              Reject Request
            </button>
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isProcessing ? 'Processing...' : 'Approve Request'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#E4E4E7] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <h3 className="text-base font-bold text-[#18181B]">Reject Governance Request</h3>
              <button onClick={() => setIsRejectModalOpen(false)}>
                <X className="w-5 h-5 text-[#52525B]" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">Reason for Rejection</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide explicit reasons for declining this request..."
                  className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs h-24"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E4E4E7] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !rejectReason.trim()}
                  className="px-4 py-2 rounded-xl bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
