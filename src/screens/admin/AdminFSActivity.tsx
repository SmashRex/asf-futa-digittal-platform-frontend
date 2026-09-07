/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  GraduationCap, 
  FileText, 
  UserPlus, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { FSActivityLog } from '../../types/fsAdminTypes';
import { initialFSActivityLogs } from '../../data/fsAdminData';

export const AdminFSActivity: React.FC = () => {
  const navigate = useNavigate();

  const [activities, setActivities] = useState<FSActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('asf_fs_activities');
      return saved ? JSON.parse(saved) : initialFSActivityLogs;
    } catch {
      return initialFSActivityLogs;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredActivities = activities.filter(a => {
    if (typeFilter !== 'ALL' && a.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchDesc = a.description.toLowerCase().includes(q);
      const matchStudent = a.studentName?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchStudent) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 select-none" id="fs-activity-screen">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-[#5B0617] text-white rounded">
              OPERATIONAL LOGS
            </span>
            <span className="text-xs text-[#52525B] font-medium">• Foundational School Audit Trail</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            FS Activity & Action History
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1">
            Immutable log of student evaluations, facilitator assignments, admission determinations, and graduation certifications.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-[#18181B] text-xs font-bold hover:bg-white transition-all shadow-xs shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to FS Dashboard</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-[#52525B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search activity log by title, description, or student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
            >
              <option value="ALL">All Activity Types</option>
              <option value="submission">Assignment Submissions</option>
              <option value="status_change">Status Changes</option>
              <option value="admission">Admissions</option>
              <option value="teacher_assigned">Teacher Assignments</option>
              <option value="completion">Completion Certifications</option>
            </select>
          </div>

        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm">
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#52525B]">
              No activity logs match your filter criteria.
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div key={act.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#18181B] text-sm">{act.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      act.severity === 'attention'
                        ? 'bg-rose-100 text-rose-800'
                        : act.severity === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {act.type}
                    </span>
                  </div>

                  <p className="text-[#18181B]">{act.description}</p>

                  <div className="text-[11px] text-[#52525B] flex flex-wrap items-center gap-x-3 pt-1">
                    <span>Actor: <strong className="text-[#18181B]">{act.actor}</strong> ({act.actorRole})</span>
                    {act.studentName && (
                      <span>• Target Student: <strong className="text-[#5B0617]">{act.studentName}</strong></span>
                    )}
                  </div>
                </div>

                <span className="text-[11px] text-[#52525B] shrink-0 font-medium">
                  {act.timestamp}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
