/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard, ShieldCheck, BookOpen } from 'lucide-react';
import { AdminRole, getAuthorityScopeForRole } from '../../types/adminTypes';

interface AdminAccessDeniedProps {
  activeRole: AdminRole;
  requiredScope?: string;
  moduleName?: string;
}

export const AdminAccessDenied: React.FC<AdminAccessDeniedProps> = ({
  activeRole,
  requiredScope = 'Global Executive Oversight',
  moduleName = 'This Executive Module'
}) => {
  const navigate = useNavigate();
  const authority = getAuthorityScopeForRole(activeRole);
  const isVP = activeRole === 'VP / FS Coordinator';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 sm:p-8 select-none" id="admin-access-denied-screen">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-[#E4E4E7] shadow-sm p-6 sm:p-8 text-center space-y-6">
        
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Header Content */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase tracking-wider">
            <span>DOMAIN ACCESS BOUNDARY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Restricted Executive Module
          </h2>
          <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
            {moduleName} requires <strong className="text-[#18181B] font-semibold">{requiredScope}</strong>, which is reserved for the <strong className="text-[#5B0617] font-semibold">President & Executive Council</strong>.
          </p>
        </div>

        {/* Current Active Persona Scope Card */}
        <div className="bg-[#FAF8F5] rounded-xl border border-[#E4E4E7] p-4 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B0617]">
              YOUR ACTIVE EXECUTIVE DOMAIN
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active Persona
            </span>
          </div>
          <p className="text-sm font-bold text-[#18181B]">{activeRole}</p>
          <p className="text-xs text-[#52525B] leading-relaxed">
            {isVP ? (
              <>
                As the <strong>Vice President & Foundational School Coordinator</strong>, your executive authority is concentrated over the <strong>Foundational School</strong> (student induction, discipleship curriculum, facilitator assignments, and spiritual follow-up).
              </>
            ) : (
              authority.subtitle
            )}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#18181B] transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          
          {isVP ? (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-xs font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>FS Coordinator Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-xs font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
