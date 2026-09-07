/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  Plus, 
  ArrowRight, 
  Clock, 
  Layers, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Megaphone, 
  UserPlus, 
  BookMarked,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Send,
  Calendar
} from 'lucide-react';
import { FSStudent, FSTeacher, FSAdmissionApplication, FSClassLevel, FSActivityLog } from '../../types/fsAdminTypes';
import { initialFSStudents, initialFSTeachers, initialFSAdmissions, initialFSClasses, initialFSActivityLogs } from '../../data/fsAdminData';

export const AdminFSCoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Load state from local storage or initial mock data
  const [students] = useState<FSStudent[]>(() => {
    try {
      const saved = localStorage.getItem('asf_fs_students');
      return saved ? JSON.parse(saved) : initialFSStudents;
    } catch {
      return initialFSStudents;
    }
  });

  const [teachers] = useState<FSTeacher[]>(() => {
    try {
      const saved = localStorage.getItem('asf_fs_teachers');
      return saved ? JSON.parse(saved) : initialFSTeachers;
    } catch {
      return initialFSTeachers;
    }
  });

  const [admissions] = useState<FSAdmissionApplication[]>(() => {
    try {
      const saved = localStorage.getItem('asf_fs_admissions');
      return saved ? JSON.parse(saved) : initialFSAdmissions;
    } catch {
      return initialFSAdmissions;
    }
  });

  const [classes] = useState<FSClassLevel[]>(() => {
    try {
      const saved = localStorage.getItem('asf_fs_classes');
      return saved ? JSON.parse(saved) : initialFSClasses;
    } catch {
      return initialFSClasses;
    }
  });

  const [activities] = useState<FSActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('asf_fs_activities');
      return saved ? JSON.parse(saved) : initialFSActivityLogs;
    } catch {
      return initialFSActivityLogs;
    }
  });

  // Calculate Metrics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const completedStudents = students.filter(s => s.status === 'Completed').length;
  const needsAttentionStudents = students.filter(s => s.status === 'Needs Attention');
  const pendingAdmissions = admissions.filter(a => a.status === 'Pending Review' || a.status === 'Interview Scheduled');
  const unassignedStudents = students.filter(s => !s.assignedTeacherId);

  return (
    <div className="space-y-6 sm:space-y-8 select-none" id="fs-coordinator-dashboard-screen">
      
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-[#5B0617] text-white rounded">
              FOUNDATIONAL SCHOOL
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FAF8F5] text-[#5B0617] rounded border border-[#E4E4E7]">
              FS COORDINATOR WORKSPACE
            </span>
            <span className="text-xs text-[#52525B] font-medium hidden sm:inline">• Vice President Executive Domain</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Foundational School Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl">
            Lead and administer student induction, discipleship curriculum progression, facilitator assignments, and spiritual follow-up across all cohorts.
          </p>
        </div>

        {/* Primary Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/admin/fs/students')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Users className="w-4 h-4" />
            <span>Manage FS Students</span>
          </button>

          <button
            onClick={() => navigate('/admin/fs/admissions')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#5B0617] text-[#5B0617] hover:bg-[#5B0617]/5 text-xs font-bold transition-all relative"
          >
            <UserPlus className="w-4 h-4" />
            <span>Review Applications</span>
            {pendingAdmissions.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-1 -right-1" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#E4E4E7] p-3 sm:p-4">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#52525B] px-1 mb-2">
          FOUNDATIONAL SCHOOL OPERATIONS
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            onClick={() => navigate('/admin/fs/students')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-center transition-all group"
          >
            <Users className="w-4 h-4 text-[#5B0617] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-[#18181B]">Students</span>
            <span className="text-[10px] text-[#52525B]">{totalStudents} Enrolled</span>
          </button>

          <button
            onClick={() => navigate('/admin/fs/admissions')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-center transition-all group"
          >
            <UserPlus className="w-4 h-4 text-amber-700 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-[#18181B]">Admissions</span>
            <span className="text-[10px] text-[#52525B]">{pendingAdmissions.length} Pending</span>
          </button>

          <button
            onClick={() => navigate('/admin/fs/teachers')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-center transition-all group"
          >
            <UserCheck className="w-4 h-4 text-indigo-700 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-[#18181B]">Facilitators</span>
            <span className="text-[10px] text-[#52525B]">{teachers.length} Active</span>
          </button>

          <button
            onClick={() => navigate('/admin/fs/classes')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-center transition-all group"
          >
            <Layers className="w-4 h-4 text-teal-700 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-[#18181B]">Classes & Levels</span>
            <span className="text-[10px] text-[#52525B]">{classes.length} Levels</span>
          </button>

          <button
            onClick={() => navigate('/admin/fs/materials')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-center transition-all group"
          >
            <BookMarked className="w-4 h-4 text-purple-700 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-[#18181B]">FS Materials</span>
            <span className="text-[10px] text-[#52525B]">Syllabi & Outlines</span>
          </button>

          <button
            onClick={() => navigate('/admin/fs/activity')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-center transition-all group"
          >
            <Clock className="w-4 h-4 text-[#52525B] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-[#18181B]">FS Activity</span>
            <span className="text-[10px] text-[#52525B]">Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Core FS Metrics Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Stat 1: Registered Students */}
        <div 
          onClick={() => navigate('/admin/fs/students')}
          className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#5B0617] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#5B0617]">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Registered Students</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#52525B] group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#18181B]">{totalStudents}</div>
            <span className="text-[11px] text-[#52525B]">{activeStudents} actively progressing</span>
          </div>
        </div>

        {/* Stat 2: Pending Applications */}
        <div 
          onClick={() => navigate('/admin/fs/admissions')}
          className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-700">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <UserPlus className="w-4 h-4" />
              <span>Admissions Queue</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-900 rounded font-bold">{pendingAdmissions.length}</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#18181B]">{pendingAdmissions.length}</div>
            <span className="text-[11px] text-[#52525B]">Awaiting review & onboarding</span>
          </div>
        </div>

        {/* Stat 3: Requiring Attention */}
        <div 
          onClick={() => navigate('/admin/fs/students')}
          className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-700">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>Needs Attention</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#18181B]">{needsAttentionStudents.length}</div>
            <span className="text-[11px] text-[#52525B]">Attendance / Assignment lag</span>
          </div>
        </div>

        {/* Stat 4: Completed Students */}
        <div 
          onClick={() => navigate('/admin/fs/students')}
          className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-800">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Certified Graduates</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#18181B]">{completedStudents}</div>
            <span className="text-[11px] text-[#52525B]">Completed discipleship path</span>
          </div>
        </div>

      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Students Requiring Attention & Level Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Attention Queue */}
          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#18181B]">Students Requiring Attention</h3>
                  <p className="text-xs text-[#52525B]">Follow-up required for attendance drops or module lags</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/fs/students')}
                className="text-xs font-bold text-[#5B0617] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#E4E4E7] mt-3">
              {needsAttentionStudents.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#52525B]">
                  All enrolled students are progressing on schedule.
                </div>
              ) : (
                needsAttentionStudents.map((student) => (
                  <div key={student.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5] p-2 rounded-xl transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#18181B]">{student.name}</span>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E4E4E7] text-[#52525B]">
                          {student.fsIdNumber}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800">
                          {student.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#52525B] mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>{student.department} ({student.academicLevel})</span>
                        <span>• {student.foundationalLevel}</span>
                        <span>• Attendance: <strong className="text-rose-700 font-semibold">{student.attendancePercent}%</strong></span>
                      </div>
                      <p className="text-xs text-rose-800 bg-rose-50/70 p-1.5 rounded-lg mt-1.5 border border-rose-100">
                        {student.verificationNotes}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => navigate('/admin/fs/students')}
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#E4E4E7] hover:border-[#5B0617] text-xs font-bold text-[#18181B] transition-all"
                      >
                        Inspect Profile
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Classes & Levels Overview */}
          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#5B0617]/10 text-[#5B0617] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#18181B]">Discipleship Cohorts by Level</h3>
                  <p className="text-xs text-[#52525B]">Active class cohorts and meeting schedules</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/fs/classes')}
                className="text-xs font-bold text-[#5B0617] hover:underline flex items-center gap-1"
              >
                <span>Manage Levels</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
              {classes.map((lvl) => (
                <div key={lvl.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#52525B] mb-1">
                      <span>{lvl.code}</span>
                      <span className="px-1.5 py-0.2 text-[10px] bg-emerald-100 text-emerald-800 rounded font-bold">Active</span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#18181B] line-clamp-2">{lvl.levelName}</h4>
                    <p className="text-[11px] text-[#52525B] mt-1.5 line-clamp-2">{lvl.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#E4E4E7] text-[11px] text-[#52525B] space-y-1">
                    <div className="flex justify-between font-semibold text-[#18181B]">
                      <span>Enrolled:</span>
                      <span>{lvl.enrolledCount} Students</span>
                    </div>
                    <div className="text-[10px] text-[#52525B]">
                      {lvl.meetingSchedule}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Pending FS Operations & Recent Stream */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Pending Admissions & Actions */}
          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-700" />
                <h3 className="font-bold text-xs sm:text-sm text-[#18181B]">Pending Admissions</h3>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">
                {pendingAdmissions.length} Action{pendingAdmissions.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingAdmissions.map((adm) => (
                <div key={adm.id} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:border-amber-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#18181B]">{adm.applicantName}</span>
                    <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-semibold">
                      {adm.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#52525B] mt-0.5">{adm.department} • {adm.academicLevel}</p>
                  <p className="text-[11px] text-[#52525B] italic line-clamp-1 mt-1">"{adm.salvationTestimonySummary}"</p>
                  <button
                    onClick={() => navigate('/admin/fs/admissions')}
                    className="mt-2 text-[11px] font-bold text-[#5B0617] hover:underline flex items-center gap-1"
                  >
                    <span>Review Application</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {unassignedStudents.length > 0 && (
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Unassigned Facilitators</span>
                </div>
                <p className="text-[11px] text-indigo-800">
                  {unassignedStudents.length} student(s) currently require a designated FS facilitator.
                </p>
                <button
                  onClick={() => navigate('/admin/fs/students')}
                  className="mt-2 px-2.5 py-1 rounded bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700 transition-all"
                >
                  Assign Facilitators
                </button>
              </div>
            )}
          </div>

          {/* Recent FS Activity Stream */}
          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5B0617]" />
                <h3 className="font-bold text-xs sm:text-sm text-[#18181B]">Recent FS Activity</h3>
              </div>
              <button
                onClick={() => navigate('/admin/fs/activity')}
                className="text-[10px] font-bold text-[#5B0617] hover:underline"
              >
                View History
              </button>
            </div>

            <div className="space-y-3">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="text-xs space-y-0.5">
                  <div className="flex items-center justify-between text-[#52525B] text-[10px]">
                    <span className="font-bold text-[#18181B]">{act.title}</span>
                    <span>{act.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#52525B]">{act.description}</p>
                  {act.studentName && (
                    <span className="text-[10px] text-[#5B0617] font-semibold">
                      Student: {act.studentName}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
