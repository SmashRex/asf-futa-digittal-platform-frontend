/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  BookOpen, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { FSClassLevel } from '../../types/fsAdminTypes';
import { initialFSClasses } from '../../data/fsAdminData';

export const AdminFSClasses: React.FC = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState<FSClassLevel[]>(() => {
    try {
      const saved = localStorage.getItem('asf_fs_classes');
      return saved ? JSON.parse(saved) : initialFSClasses;
    } catch {
      return initialFSClasses;
    }
  });

  const [selectedClass, setSelectedClass] = useState<FSClassLevel | null>(classes[0]);

  return (
    <div className="space-y-6 select-none" id="fs-classes-screen">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-teal-700 text-white rounded">
              CURRICULUM STRUCTURE
            </span>
            <span className="text-xs text-[#52525B] font-medium">• Foundational School Discipleship Levels</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Classes & Discipleship Levels
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1">
            Organize Foundational School levels, syllabus progression modules, meeting schedules, and cohort enrollments.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/fs/students')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-all shadow-sm shrink-0"
        >
          <Users className="w-4 h-4" />
          <span>View Enrolled Students</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {classes.map((cls) => {
          const isSelected = selectedClass?.id === cls.id;
          return (
            <div
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all cursor-pointer ${
                isSelected ? 'border-[#5B0617] ring-1 ring-[#5B0617]' : 'border-[#E4E4E7]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#52525B] mb-2">
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E4E4E7]">
                    {cls.code}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                    {cls.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#18181B]">{cls.levelName}</h3>
                <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">{cls.description}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#E4E4E7] text-xs">
                <div className="flex items-center justify-between text-[#52525B]">
                  <span>Lead Facilitator:</span>
                  <span className="font-bold text-[#18181B] text-right truncate max-w-[160px]">{cls.facilitatorLead}</span>
                </div>
                <div className="flex items-center justify-between text-[#52525B]">
                  <span>Enrolled Cohort:</span>
                  <span className="font-bold text-[#5B0617]">{cls.enrolledCount} Active Students</span>
                </div>
                <div className="text-[11px] text-[#52525B] bg-[#FAF8F5] p-2 rounded-lg border border-[#E4E4E7]/60">
                  📅 {cls.meetingSchedule}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Level Syllabus Detail */}
      {selectedClass && (
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#5B0617]" />
              <div>
                <h3 className="font-bold text-base text-[#18181B]">{selectedClass.levelName} — Syllabus Breakdown</h3>
                <p className="text-xs text-[#52525B]">Standard discipleship teaching modules and memory verses</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {selectedClass.curriculumModules.map((moduleName, index) => (
              <div key={index} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#5B0617] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#18181B]">{moduleName}</h4>
                  <span className="text-[10px] text-[#52525B]">Core Foundational Module</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
