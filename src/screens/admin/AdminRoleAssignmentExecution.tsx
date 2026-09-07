/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { ROLE_PERMISSIONS_MATRIX } from '../../data/adminData';
import { 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  User, 
  Mail, 
  GraduationCap, 
  Shield, 
  FileText,
  Lock,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

export const AdminRoleAssignmentExecution: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeRole, roleAssignments, executeRoleAssignment } = useOutletContext<AdminContextType>();
  const permissions = ROLE_PERMISSIONS_MATRIX[activeRole];

  const [confirmationPhrase, setConfirmationPhrase] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionSuccess, setExecutionSuccess] = useState<boolean>(false);

  // Find assignment request by route param or fallback to first
  const assignment = roleAssignments.find(a => a.id === id) || roleAssignments[0];

  // RBAC Check
  if (!permissions.canAccessSettings) {
    return (
      <div className="role-assignment-page p-6 bg-white rounded-2xl border border-[#E4E4E7] shadow-xs text-center max-w-xl mx-auto my-12">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#18181B] mb-2">Access Restricted</h2>
        <p className="text-sm text-[#52525B] mb-6">
          Executing role assignments requires Technical Administrator or Executive privileges. Your active persona is <span className="font-semibold">{activeRole}</span>.
        </p>
        <button
          onClick={() => navigate('/admin/governance')}
          className="px-4 py-2 bg-[#5B0617] text-white rounded-xl text-sm font-semibold hover:bg-[#7A1F2B] transition-colors"
        >
          Return to Governance
        </button>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-[#E4E4E7] text-center space-y-4 max-w-lg mx-auto my-12">
        <p className="text-sm font-bold text-[#18181B]">Role assignment proposal not found.</p>
        <button
          onClick={() => navigate('/admin/governance')}
          className="px-4 py-2 bg-[#5B0617] text-white rounded-xl text-xs font-semibold"
        >
          Back to Governance Pipeline
        </button>
      </div>
    );
  }

  const isAlreadyExecuted = assignment.approvalStatus === 'Executed';
  const isConfirmValid = confirmationPhrase.trim().toUpperCase() === 'CONFIRM';

  const handleExecute = () => {
    if (!isConfirmValid || isAlreadyExecuted) return;
    setIsExecuting(true);

    setTimeout(() => {
      executeRoleAssignment(assignment.id);
      setIsExecuting(false);
      setExecutionSuccess(true);
    }, 800);
  };

  return (
    <div className="role-assignment-page space-y-6 max-w-4xl mx-auto">
      
      {/* Back navigation bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/governance')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52525B] hover:text-[#5B0617] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Governance & Approvals</span>
        </button>

        <span className="text-xs font-mono text-[#52525B]">ID: {assignment.id}</span>
      </div>

      {/* Main Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-[#5B0617]" />
          <h1 className="text-xl font-extrabold text-[#18181B] tracking-tight">Execute Administrative Role Assignment</h1>
        </div>
        <p className="text-xs text-[#52525B]">
          Controlled execution of approved role elevation proposals. High-privilege action requiring dual confirmation.
        </p>
      </div>

      {/* Success Banner if Executed */}
      {(executionSuccess || isAlreadyExecuted) && (
        <div className="execution-result p-5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>ROLE ASSIGNMENT EXECUTED SUCCESSFULLY!</span>
          </div>
          <p className="text-xs text-emerald-800">
            {assignment.targetMemberName} has been elevated to <strong className="text-emerald-950">{assignment.newRole}</strong>. Member permissions and access control tokens have been updated.
          </p>
          {assignment.executedAt && (
            <div className="text-[11px] font-mono text-emerald-700 pt-1">
              Executed at: {assignment.executedAt} by {assignment.executedBy}
            </div>
          )}
        </div>
      )}

      {/* Role Assignment Summary */}
      <div className="role-assignment-summary bg-white p-6 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
          <h2 className="font-bold text-[#18181B] text-base">Assignment Target & Scope</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
            assignment.approvalStatus === 'Executed'
              ? 'bg-emerald-100 text-emerald-900'
              : assignment.approvalStatus === 'Approved'
              ? 'bg-sky-100 text-sky-900'
              : 'bg-amber-100 text-amber-900'
          }`}>
            {assignment.approvalStatus}
          </span>
        </div>

        {/* Member & Role Transition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Target Member Card */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E4E4E7] space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#52525B] block">RECIPIENT MEMBER</span>
            <div className="space-y-1">
              <h3 className="font-extrabold text-[#18181B] text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-[#5B0617]" />
                <span>{assignment.targetMemberName}</span>
              </h3>
              <p className="text-xs text-[#52525B] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#9A9A9E]" />
                <span>{assignment.targetMemberEmail}</span>
              </p>
              <p className="text-xs text-[#52525B] flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#9A9A9E]" />
                <span>{assignment.department} ({assignment.level})</span>
              </p>
            </div>
          </div>

          {/* Role Elevation Scope Card */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E4E4E7] space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#52525B] block">ROLE ELEVATION</span>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-200/80 rounded-lg text-xs font-semibold text-stone-700">
                {assignment.currentRole}
              </div>
              <ArrowRight className="w-4 h-4 text-[#5B0617] shrink-0" />
              <div className="p-2 bg-[#5B0617] text-white rounded-lg text-xs font-extrabold shadow-xs">
                {assignment.newRole}
              </div>
            </div>
            <p className="text-[11px] text-[#52525B] leading-tight pt-1">
              Reason: {assignment.reason}
            </p>
          </div>

        </div>

        {/* Authorization & Approval Context */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
          <div className="font-bold text-[#18181B] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#5B0617]" />
            <span>Dual-Authorization Verification</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#52525B]">
            <div>Requested By: <strong className="text-[#18181B]">{assignment.requestedBy}</strong></div>
            <div>Approved By: <strong className="text-[#18181B]">{assignment.approvedBy}</strong></div>
          </div>
        </div>

        {/* Consequences Checklist */}
        <div className="space-y-2 pt-2">
          <h4 className="font-bold text-xs text-[#18181B] uppercase tracking-wider">System Execution Consequences</h4>
          <ul className="space-y-1.5 text-xs text-[#52525B]">
            {assignment.consequences.map((c, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E4E4E7]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Execution Confirmation Area */}
      {!isAlreadyExecuted && (
        <div className="execution-confirmation bg-white p-6 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-amber-950">Safety Confirmation Required</h4>
              <p>
                To execute this role elevation, type <strong className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-950">CONFIRM</strong> below. Single-click execution is disabled for platform security.
              </p>
            </div>
          </div>

          <div className="space-y-2 max-w-md">
            <label className="block text-xs font-bold text-[#18181B]">Type Confirmation Phrase</label>
            <div className="relative">
              <input
                type="text"
                value={confirmationPhrase}
                onChange={(e) => setConfirmationPhrase(e.target.value)}
                placeholder="Type CONFIRM to unlock..."
                className="w-full pl-3 pr-10 py-2.5 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-sm font-mono font-bold text-[#18181B] focus:outline-hidden focus:border-[#5B0617]"
              />
              {isConfirmValid && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute right-3 top-2.5" />
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => navigate('/admin/governance')}
              className="px-4 py-2.5 border border-[#E4E4E7] text-[#52525B] hover:bg-stone-50 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              onClick={handleExecute}
              disabled={!isConfirmValid || isExecuting}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-sm ${
                isConfirmValid
                  ? 'bg-[#5B0617] text-white hover:bg-[#7A1F2B] cursor-pointer'
                  : 'bg-stone-200 text-stone-500 cursor-not-allowed opacity-60'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isExecuting ? 'Executing...' : 'Execute Now'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
