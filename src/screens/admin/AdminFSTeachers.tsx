/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  BookOpen, 
  Layers, 
  ArrowLeft, 
  CheckCircle2, 
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { FSTeacher } from '../../types/fsAdminTypes';
import { initialFSTeachers } from '../../data/fsAdminData';

export const AdminFSTeachers: React.FC = () => {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState<FSTeacher[]>(() => {
    try {
      const saved = localStorage.getItem('asf_fs_teachers');
      return saved ? JSON.parse(saved) : initialFSTeachers;
    } catch {
      return initialFSTeachers;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');

  const filteredTeachers = teachers.filter(t => {
    if (levelFilter !== 'ALL' && t.assignedFoundationalLevel !== levelFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchDept = t.department.toLowerCase().includes(q);
      const matchSpec = t.specialization.toLowerCase().includes(q);
      if (!matchName && !matchDept && !matchSpec) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 select-none" id="fs-teachers-screen">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-indigo-700 text-white rounded">
              DISCIPLESHIP FACILITATORS
            </span>
            <span className="text-xs text-[#52525B] font-medium">• Foundational School Faculty</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Teachers & Facilitators
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1">
            Manage Foundational School discipleship facilitators, assign student cohorts, and monitor teaching team coverage.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/admin/fs/students')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Users className="w-4 h-4" />
            <span>Manage Student Assignments</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-[#52525B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facilitators by name, department, or doctrinal specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
            >
              <option value="ALL">All Foundational Levels</option>
              <option value="Level 1: Basic Doctrines">Level 1: Basic Doctrines</option>
              <option value="Level 2: Spiritual Growth">Level 2: Spiritual Growth</option>
              <option value="Level 3: Christian Stewardship">Level 3: Christian Stewardship</option>
            </select>
          </div>

        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#5B0617] transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-[#18181B] group-hover:text-[#5B0617] transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-[#52525B] font-medium mt-0.5">
                    {teacher.department} • {teacher.academicLevel}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {teacher.status}
                </span>
              </div>

              <div className="mt-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] space-y-1 text-xs">
                <span className="text-[10px] font-extrabold uppercase text-[#5B0617] block">
                  ASSIGNED TEACHING LEVEL:
                </span>
                <p className="font-bold text-[#18181B]">{teacher.assignedFoundationalLevel}</p>
                <p className="text-[11px] text-[#52525B] italic mt-1">Specialization: {teacher.specialization}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E4E4E7] text-xs">
              <div className="flex items-center justify-between text-[#52525B]">
                <span>Mentoring Load:</span>
                <span className="font-bold text-[#18181B] px-2 py-0.5 bg-indigo-50 text-indigo-900 rounded">
                  {teacher.assignedStudentsCount} Enrolled Students
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#52525B] pt-1">
                <Mail className="w-3.5 h-3.5 text-[#5B0617]" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#52525B]">
                <Phone className="w-3.5 h-3.5 text-[#5B0617]" />
                <span>{teacher.phone}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E4E4E7]">
              <button
                onClick={() => navigate('/admin/fs/students')}
                className="w-full py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#5B0617] hover:text-white border border-[#E4E4E7] text-xs font-bold text-[#18181B] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Assign Students</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
