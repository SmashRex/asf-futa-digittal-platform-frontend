/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { GovernanceRequest } from '../../types/adminTypes';
import { 
  ArrowLeft, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserCheck, 
  FileText, 
  Trash2, 
  ShieldCheck, 
  X
} from 'lucide-react';

export const AdminGovernanceDetail: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { 
    governanceRequests, 
    approveGovernanceRequest, 
    rejectGovernanceRequest, 
    executeGovernanceAction,
    activeRole,
    addAuditLog 
  } = useOutletContext<AdminContextType>();

  const request = governanceRequests.find(r => r.id === requestId);

  // Modal states
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [isDestructiveModalOpen, setIsDestructiveModalOpen] = useState(false);
  const [confirmationPhrase, setConfirmationPhrase] = useState('');
  const [approvalComment, setApprovalComment] = useState('');

  if (!request) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#18181B]">Governance Proposal Not Found</h2>
        <button onClick={() => navigate('/admin/governance')} className="btn-primary text-xs py-2 px-4">
          Back to Governance List
        </button>
      </div>
    );
  }

  const handleApprove = () => {
    approveGovernanceRequest(request.id, approvalComment || 'Approved by administrator.');
    setApprovalComment('');
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    rejectGovernanceRequest(request.id, rejectReason.trim());
    setIsRejectModalOpen(false);
    setRejectReason('');
  };

  const handleExecuteDestructive = () => {
    if (confirmationPhrase.trim().toUpperCase() !== 'DELETE' && confirmationPhrase.trim().toUpperCase() !== 'CONFIRM') return;
    executeGovernanceAction(request.id);
    setIsDestructiveModalOpen(false);
    setConfirmationPhrase('');
    navigate('/admin/governance');
  };

  const isAlreadyApprovedByRole = request.currentApprovals.some(a => a.approverRole === activeRole);

  return (
    <div className="governance-detail-page space-y-6 max-w-5xl mx-auto pb-12" id="governance-detail-view">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4">
        <button
          onClick={() => navigate('/admin/governance')}
          className="btn-tertiary text-xs flex items-center gap-2 text-[#52525B] hover:text-[#5B0617]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Governance Pipeline</span>
        </button>

        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
          request.status === 'Approved'
            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
            : request.status === 'Rejected'
            ? 'bg-rose-100 text-rose-900 border border-rose-200'
            : request.status === 'Completed/Deleted'
            ? 'bg-stone-200 text-stone-800'
            : 'bg-amber-100 text-amber-900 border border-amber-200'
        }`}>
          {request.status}
        </span>
      </div>

      {/* Destructive Action Warning Banner */}
      {request.isDestructive && (
        <div className="bg-rose-900 text-white p-5 rounded-2xl shadow-md border border-rose-800 space-y-2">
          <div className="flex items-center gap-2.5 font-black text-rose-200 uppercase tracking-widest text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-300" />
            <span>CRITICAL: DESTRUCTIVE ACTION GOVERNANCE PROPOSAL</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-100 leading-relaxed">
            This request involves a permanent or high-stakes system modification. Executing this request requires dual executive authorization and a confirmed verification phrase.
          </p>
        </div>
      )}

      {/* Main Request Information Card */}
      <div className="card-surface p-6 space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#5B0617]">
            PROPOSAL #{request.id}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            {request.target}
          </h1>
          <p className="text-xs text-[#52525B] mt-1">
            Request Type: <strong>{request.type}</strong>
          </p>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F5] p-4 rounded-xl border border-[#E4E4E7] text-xs">
          <div>
            <span className="font-bold text-[#52525B] uppercase tracking-wider block mb-0.5">Submitted By</span>
            <p className="font-bold text-[#18181B]">{request.requester.name}</p>
            <p className="text-[#52525B]">{request.requester.role} • {request.requester.email}</p>
          </div>

          <div>
            <span className="font-bold text-[#52525B] uppercase tracking-wider block mb-0.5">Submission Timestamp</span>
            <p className="font-bold text-[#18181B]">{new Date(request.createdAt).toLocaleString()}</p>
            <p className="text-[#52525B]">Dual-Approval Threshold: {request.requiredApprovals} Signatures</p>
          </div>
        </div>

        {/* Reason / Justification */}
        <div>
          <h3 className="text-xs font-bold text-[#52525B] uppercase tracking-wider mb-2">
            Justification & Context
          </h3>
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-[#18181B] leading-relaxed">
            {request.reason}
          </div>
        </div>

        {/* Consequences List */}
        <div>
          <h3 className="text-xs font-bold text-[#52525B] uppercase tracking-wider mb-2">
            Consequences & System Impacts
          </h3>
          <ul className="space-y-2">
            {request.consequences.map((c, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#18181B] bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dual-Approval Signatures Timeline */}
        <div className="border-t border-[#E4E4E7] pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#52525B] uppercase tracking-wider">
              Governance Approvals ({request.currentApprovals.length} / {request.requiredApprovals} Signatures)
            </h3>
            <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
              Executive Council Governance
            </span>
          </div>

          {request.currentApprovals.length === 0 ? (
            <p className="text-xs text-[#52525B] italic">No signatures recorded yet. Requires review and final sign-off.</p>
          ) : (
            <div className="space-y-2">
              {request.currentApprovals.map((app, idx) => {
                const isGlobalApprover = app.approverRole === 'President / Executive';
                const isFSApprover = app.approverRole === 'VP / FS Coordinator';
                return (
                  <div key={idx} className={`p-3 rounded-xl flex items-start gap-3 border ${
                    isGlobalApprover 
                      ? 'bg-purple-50/80 border-purple-300 text-purple-950' 
                      : isFSApprover
                      ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  }`}>
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isGlobalApprover ? 'text-purple-700' : isFSApprover ? 'text-amber-700' : 'text-emerald-700'
                    }`} />
                    <div className="text-xs space-y-0.5">
                      <p className="font-bold flex items-center gap-1.5">
                        <span>Signed by {app.approverName} ({app.approverRole})</span>
                        {isGlobalApprover && (
                          <span className="text-[9px] font-black uppercase bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded">
                            Presidential Sign-off
                          </span>
                        )}
                        {isFSApprover && (
                          <span className="text-[9px] font-black uppercase bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                            FS Authority Sign-off
                          </span>
                        )}
                      </p>
                      <p className={isGlobalApprover ? 'text-purple-900' : isFSApprover ? 'text-amber-900' : 'text-emerald-800'}>{app.comments}</p>
                      <p className="text-[10px] opacity-75">
                        Signed on: {new Date(app.approvedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Governance Controls Bar */}
        <div className="approval-actions border-t border-[#E4E4E7] pt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#52525B] flex items-center gap-1.5">
            <span>Current Role:</span>
            <strong className="text-[#18181B]">{activeRole}</strong>
            {activeRole === 'President / Executive' && (
              <span className="text-[9px] font-black uppercase bg-purple-200 text-purple-950 px-1.5 py-0.5 rounded">
                Global Authority (President)
              </span>
            )}
            {activeRole === 'VP / FS Coordinator' && (
              <span className="text-[9px] font-black uppercase bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded">
                FS Authority (Head of FS)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {request.status !== 'Completed/Deleted' && request.status !== 'Rejected' && (
              <>
                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="btn-danger text-xs py-2 px-4"
                >
                  Reject Proposal
                </button>

                {!isAlreadyApprovedByRole && request.status !== 'Approved' && (
                  <button
                    onClick={handleApprove}
                    className={`text-xs py-2 px-4 flex items-center gap-1.5 rounded-xl font-bold transition-all ${
                      activeRole === 'President / Executive'
                        ? 'bg-purple-900 hover:bg-purple-950 text-white shadow-xs'
                        : activeRole === 'VP / FS Coordinator'
                        ? 'bg-amber-700 hover:bg-amber-800 text-white shadow-xs'
                        : 'btn-primary'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>
                      {activeRole === 'President / Executive' ? 'Authorize (Presidential Approval)' : activeRole === 'VP / FS Coordinator' ? 'Authorize (FS Authority)' : 'Co-sign & Endorse'}
                    </span>
                  </button>
                )}

                {request.isDestructive && (request.status === 'Approved' || request.currentApprovals.length >= request.requiredApprovals) && (
                  <button
                    onClick={() => setIsDestructiveModalOpen(true)}
                    className="btn-danger text-xs py-2 px-4 flex items-center gap-1.5 bg-rose-700 hover:bg-rose-800"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Execute Destructive Action</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <h3 className="text-base font-bold text-[#18181B]">Reject Governance Proposal</h3>
              <button onClick={() => setIsRejectModalOpen(false)}>
                <X className="w-5 h-5 text-[#52525B]" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="input-label text-xs">Reason for Rejection</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide explicit reasons for declining this request..."
                  className="input-box text-xs py-2 h-24"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="btn-tertiary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-danger text-xs py-2 px-4"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Destructive Action Confirmation Modal */}
      {isDestructiveModalOpen && (
        <div className="modal-overlay" id="destructive-confirmation-modal">
          <div className="modal-content p-6 space-y-5 border-2 border-rose-600 bg-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-rose-700 font-black">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold">CONFIRM DESTRUCTIVE ACTION</h3>
              </div>
              <button onClick={() => setIsDestructiveModalOpen(false)}>
                <X className="w-5 h-5 text-[#52525B]" />
              </button>
            </div>

            <p className="text-xs text-[#18181B] leading-relaxed">
              You are about to permanently execute the destructive action: <strong className="text-rose-700">{request.target}</strong>. This action will unpublish content and archive records across the platform.
            </p>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
              <p className="font-bold text-rose-900">Safety Verification</p>
              <p className="text-rose-800">To confirm, type <strong className="text-rose-950 font-black">DELETE</strong> below:</p>
            </div>

            <div>
              <input
                type="text"
                value={confirmationPhrase}
                onChange={(e) => setConfirmationPhrase(e.target.value)}
                placeholder="Type DELETE to enable execution"
                className="input-box text-xs py-2.5 border-rose-300 focus:border-rose-600 focus:ring-rose-200 font-mono text-center tracking-widest uppercase font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDestructiveModalOpen(false)}
                className="btn-tertiary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDestructive}
                disabled={confirmationPhrase.trim().toUpperCase() !== 'DELETE' && confirmationPhrase.trim().toUpperCase() !== 'CONFIRM'}
                className="btn-danger text-xs py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed bg-rose-700 hover:bg-rose-800"
              >
                Permanently Execute Action
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
