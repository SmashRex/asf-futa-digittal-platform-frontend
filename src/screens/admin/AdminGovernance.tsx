/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { GovernanceRequest } from '../../types/adminTypes';
import { 
  Scale, 
  ShieldAlert, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowRight, 
  AlertTriangle,
  FileText,
  UserCheck
} from 'lucide-react';

export const AdminGovernance: React.FC = () => {
  const { governanceRequests } = useOutletContext<AdminContextType>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredRequests = governanceRequests.filter(req => {
    const matchesSearch = req.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.requester.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || req.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: GovernanceRequest['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pending Initial Review
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            Under Dual Review
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case 'Completed/Deleted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Executed & Completed
          </span>
        );
    }
  };

  return (
    <div className="governance-page space-y-6 max-w-7xl mx-auto pb-12" id="governance-requests-view">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E4E4E7] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#52525B] mb-1 font-medium">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#7A1F2B] font-semibold">Governance & Approvals</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-[#7A1F2B]" />
            Governance & Approval Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl">
            Review critical action proposals, content modifications, and role elevation requests. Final executive approvals are governed under the fellowship's authority framework.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card-surface p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search governance requests..."
            className="input-box pl-10 text-xs sm:text-sm py-2"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
          {['All', 'Pending', 'Approved', 'Rejected', 'Completed/Deleted'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-[#5B0617] text-white'
                  : 'bg-stone-100 text-[#52525B] hover:bg-stone-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="card-surface p-8 text-center text-xs text-[#52525B]">
            No governance proposals found matching criteria.
          </div>
        ) : (
          filteredRequests.map(req => (
            <div
              key={req.id}
              className="governance-request card-surface p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#5B0617] transition-all"
              id={`gov-card-${req.id}`}
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    req.isDestructive
                      ? 'bg-rose-100 text-rose-900 border border-rose-200'
                      : 'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}>
                    {req.type}
                  </span>

                  {req.isDestructive && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      Destructive Action
                    </span>
                  )}

                  {getStatusBadge(req.status)}
                </div>

                <h3 className="text-base font-bold text-[#18181B]">
                  {req.target}
                </h3>

                <p className="text-xs text-[#52525B] line-clamp-2">
                  <span className="font-semibold text-[#18181B]">Reason: </span>
                  {req.reason}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#52525B] pt-1">
                  <span>Requester: <strong className="text-[#18181B]">{req.requester.name}</strong> ({req.requester.role})</span>
                  <span>Approvals: <strong className="text-[#18181B]">{req.currentApprovals.length} of {req.requiredApprovals}</strong></span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => navigate(`/admin/governance/${req.id}`)}
                  className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
                >
                  <span>Review Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
