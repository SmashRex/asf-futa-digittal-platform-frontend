/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ContentStatus } from '../../types/adminTypes';
import { CheckCircle2, Clock, FileEdit, AlertCircle, Archive, ShieldCheck, UserCheck, UserX, UserPlus } from 'lucide-react';

interface StatusBadgeProps {
  status: ContentStatus | 'Active' | 'Pending Approval' | 'Suspended' | 'Alumni';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getSizeClasses = () => {
    return size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';
  };

  const baseClasses = "inline-flex items-center gap-1 rounded-full whitespace-nowrap shrink-0";

  switch (status) {
    case 'Published':
    case 'Active':
      return (
        <span className={`${baseClasses} bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${getSizeClasses()}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Approved':
      return (
        <span className={`${baseClasses} bg-blue-50 text-blue-800 border border-blue-200/80 ${getSizeClasses()}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Approved</span>
        </span>
      );
    case 'Pending Review':
    case 'Pending Approval':
      const displayStatus = status === 'Pending Approval' ? 'Pending' : 'Reviewing';
      return (
        <span className={`${baseClasses} bg-amber-50 text-amber-900 border border-amber-200/80 ${getSizeClasses()}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{displayStatus}</span>
        </span>
      );
    case 'Draft':
      return (
        <span className={`${baseClasses} bg-stone-100 text-stone-700 border border-stone-200 ${getSizeClasses()}`}>
          <FileEdit className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span>Draft</span>
        </span>
      );
    case 'Revision Requested':
    case 'Suspended':
      const dangerStatus = status === 'Revision Requested' ? 'Needs Revision' : status;
      return (
        <span className={`${baseClasses} bg-rose-50 text-rose-800 border border-rose-200/80 ${getSizeClasses()}`}>
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>{dangerStatus}</span>
        </span>
      );
    case 'Archived':
    case 'Alumni':
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-600 border border-gray-200 ${getSizeClasses()}`}>
          <Archive className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <span>{status}</span>
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-stone-100 text-stone-800 ${getSizeClasses()}`}>
          <span>{status}</span>
        </span>
      );
  }
};
