/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  MessageSquare, 
  ChevronRight, 
  ShieldCheck, 
  ArrowLeft,
  X,
  Mail,
  Phone
} from 'lucide-react';
import { FSAdmissionApplication } from '../../types/fsAdminTypes';
import { initialFSAdmissions } from '../../data/fsAdminData';

export const AdminFSAdmissions: React.FC = () => {
  const navigate = useNavigate();

  const [admissions, setAdmissions] = useState<FSAdmissionApplication[]>(() => {
    try {
      const saved = localStorage.getItem('asf_fs_admissions');
      return saved ? JSON.parse(saved) : initialFSAdmissions;
    } catch {
      return initialFSAdmissions;
    }
  });

  useEffect(() => {
    localStorage.setItem('asf_fs_admissions', JSON.stringify(admissions));
  }, [admissions]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedApplication, setSelectedApplication] = useState<FSAdmissionApplication | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const filteredAdmissions = admissions.filter(app => {
    if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.applicantName.toLowerCase().includes(q);
      const matchDept = app.department.toLowerCase().includes(q);
      const matchAffil = app.previousChurchAffiliation.toLowerCase().includes(q);
      if (!matchName && !matchDept && !matchAffil) return false;
    }
    return true;
  });

  const handleUpdateStatus = (appId: string, newStatus: FSAdmissionApplication['status']) => {
    const targetApp = admissions.find(a => a.id === appId);
    const updatedNote = reviewNote.trim() ? reviewNote.trim() : (targetApp?.reviewerNotes || '');

    setAdmissions(prev => prev.map(a => {
      if (a.id !== appId) return a;
      return {
        ...a,
        status: newStatus,
        reviewerNotes: updatedNote,
        reviewedBy: 'Sister Mary Bamidele (VP / FS Coordinator)'
      };
    }));

    if (selectedApplication && selectedApplication.id === appId) {
      setSelectedApplication(prev => prev ? {
        ...prev,
        status: newStatus,
        reviewerNotes: updatedNote,
        reviewedBy: 'Sister Mary Bamidele (VP / FS Coordinator)'
      } : null);
    }

    // If Approved, sync with students roster in localStorage
    if (newStatus === 'Approved' && targetApp) {
      try {
        const currentStudentsRaw = localStorage.getItem('asf_fs_students');
        const students = currentStudentsRaw ? JSON.parse(currentStudentsRaw) : [];
        const existingStudentIndex = students.findIndex((s: any) => 
          (s.email && s.email.toLowerCase() === targetApp.email.toLowerCase()) ||
          (s.name && s.name.toLowerCase() === targetApp.applicantName.toLowerCase())
        );

        if (existingStudentIndex >= 0) {
          students[existingStudentIndex].isVerified = true;
          students[existingStudentIndex].status = 'Active';
        } else {
          const newStudent = {
            id: `fs-stud-${Date.now().toString().slice(-4)}`,
            fsIdNumber: `FS-2026-${String(students.length + 1).padStart(3, '0')}`,
            name: targetApp.applicantName,
            email: targetApp.email,
            phone: targetApp.phone,
            department: targetApp.department,
            academicLevel: targetApp.academicLevel,
            foundationalLevel: targetApp.assignedFoundationalLevel || 'Level 1: Basic Doctrines',
            status: 'Active',
            previousAffiliation: targetApp.previousChurchAffiliation,
            enrollmentDate: new Date().toISOString().split('T')[0],
            completedChaptersCount: 0,
            totalChaptersCount: 6,
            attendancePercent: 100,
            verificationNotes: updatedNote || 'Verified and onboarded by FS Coordinator Sister Mary Bamidele.',
            isVerified: true,
            completionCertified: false,
            chapterProgress: [
              { chapterNumber: 1, title: 'Salvation and the New Birth', status: 'Not Started' },
              { chapterNumber: 2, title: 'The Authority of the Scriptures', status: 'Not Started' },
              { chapterNumber: 3, title: 'The Trinity & Person of the Holy Spirit', status: 'Not Started' },
              { chapterNumber: 4, title: 'Water Baptism & The Lord’s Supper', status: 'Not Started' },
              { chapterNumber: 5, title: 'Prayer and Daily Quiet Time', status: 'Not Started' },
              { chapterNumber: 6, title: 'Christian Fellowship and Evangelism', status: 'Not Started' }
            ],
            adminNotes: [
              {
                id: `note-${Date.now()}`,
                author: 'Sister Mary Bamidele',
                authorRole: 'VP / FS Coordinator',
                timestamp: new Date().toISOString().split('T')[0],
                text: 'Admission application approved and student officially inducted into Foundational School cohort.'
              }
            ]
          };
          students.unshift(newStudent);
        }
        localStorage.setItem('asf_fs_students', JSON.stringify(students));
      } catch (err) {
        console.error('Error syncing student roster on approval', err);
      }
    }

    setReviewNote('');
  };

  return (
    <div className="space-y-6 select-none" id="fs-admissions-screen">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-amber-700 text-white rounded">
              ADMISSIONS QUEUE
            </span>
            <span className="text-xs text-[#52525B] font-medium">• Foundational School Applications</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Student Applications & Admissions
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1">
            Review incoming student admission requests, verify salvation testimonies, schedule intake interviews, and onboard to Foundational School.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/fs/students')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-[#18181B] text-xs font-bold hover:bg-white transition-all shadow-xs shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students Roster</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-[#52525B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applications by applicant name, department, or previous church..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
            >
              <option value="ALL">All Application Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredAdmissions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-12 text-center text-xs text-[#52525B]">
            No admission applications found.
          </div>
        ) : (
          filteredAdmissions.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApplication(app)}
              className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-xs hover:border-[#5B0617] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#18181B] group-hover:text-[#5B0617] transition-colors">
                    {app.applicantName}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    app.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : app.status === 'Interview Scheduled'
                        ? 'bg-indigo-100 text-indigo-800'
                        : app.status === 'Declined'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="text-[11px] text-[#52525B] flex flex-wrap items-center gap-x-3">
                  <span>{app.department} ({app.academicLevel})</span>
                  <span>• Target: <strong>{app.assignedFoundationalLevel}</strong></span>
                  <span>• Applied: {app.applicationDate}</span>
                </div>

                <p className="text-xs text-[#52525B] line-clamp-2 italic bg-[#FAF8F5] p-2 rounded-lg border border-[#E4E4E7]/60">
                  "{app.salvationTestimonySummary}"
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedApplication(app);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-[#18181B] text-xs font-bold hover:bg-white hover:border-[#5B0617] transition-all"
                >
                  Review Application
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl border border-[#E4E4E7] shadow-2xl p-5 sm:p-6 space-y-4 overflow-y-auto">
            
            <div className="flex items-start justify-between pb-3 border-b border-[#E4E4E7]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800">
                  STUDENT ADMISSION DOSSIER
                </span>
                <h2 className="text-lg font-serif font-bold text-[#18181B] mt-0.5">
                  {selectedApplication.applicantName}
                </h2>
                <p className="text-xs text-[#52525B]">
                  {selectedApplication.department} • {selectedApplication.academicLevel}
                </p>
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E4E4E7] flex items-center justify-center text-[#52525B] hover:text-[#18181B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#E4E4E7]">
                <div>
                  <span className="text-[10px] font-bold text-[#52525B] uppercase block">Email:</span>
                  <span className="font-semibold text-[#18181B]">{selectedApplication.email}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#52525B] uppercase block">Phone:</span>
                  <span className="font-semibold text-[#18181B]">{selectedApplication.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#52525B] uppercase block">Church Background:</span>
                  <span className="font-semibold text-[#18181B]">{selectedApplication.previousChurchAffiliation}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#52525B] uppercase block">Target Level:</span>
                  <span className="font-bold text-[#5B0617]">{selectedApplication.assignedFoundationalLevel}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#18181B] uppercase text-[10px] tracking-wider">Salvation Testimony:</span>
                <p className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E4E4E7] text-[#18181B] leading-relaxed">
                  {selectedApplication.salvationTestimonySummary}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#18181B] uppercase text-[10px] tracking-wider">Reason for Joining FS:</span>
                <p className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E4E4E7] text-[#18181B] leading-relaxed">
                  {selectedApplication.reasonForJoining}
                </p>
              </div>

              {selectedApplication.reviewerNotes && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900">
                  <span className="font-bold uppercase text-[10px] block">Reviewer Notes ({selectedApplication.reviewedBy || 'FS Coordinator'}):</span>
                  <p className="mt-0.5">{selectedApplication.reviewerNotes}</p>
                </div>
              )}

              {/* Reviewer Note Input */}
              <div className="space-y-1 pt-2 border-t border-[#E4E4E7]">
                <label className="font-bold text-[#18181B] block">Add Coordinator Review Note / Interview Instructions:</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Schedule interview Wednesday 4pm, verify baptism status..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
                />
              </div>

            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E4E4E7]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedApplication.id, 'Declined')}
                  className="px-3 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold"
                >
                  Decline
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedApplication.id, 'Interview Scheduled')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 hover:bg-indigo-100 text-xs font-bold"
                >
                  Schedule Interview
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedApplication.id, 'Approved')}
                  className="px-4 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold shadow-sm"
                >
                  Approve & Onboard
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
