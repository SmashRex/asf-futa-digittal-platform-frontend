/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  UserCheck, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  X, 
  ChevronRight, 
  GraduationCap, 
  Calendar, 
  FileText, 
  Edit3, 
  Award, 
  UserPlus, 
  CheckCircle,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MoreVertical,
  MessageSquare,
  Upload,
  UserMinus,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { FSStudent, FSTeacher, FSStudentStatus, FSAdminNote } from '../../types/fsAdminTypes';
import { initialFSStudents, initialFSTeachers } from '../../data/fsAdminData';
import { fsService } from '../../services/fs/fs.service';
import { FSBulkGraduationItemResult } from '../../types';
import { APP_CONFIG } from '../../config/app.config';

export const AdminFSStudents: React.FC = () => {
  const navigate = useNavigate();

  // State for FS students
  const [students, setStudents] = useState<FSStudent[]>(() => {
    if (!APP_CONFIG.features.useMockServices) {
      return [];
    }
    try {
      const saved = localStorage.getItem('asf_fs_students');
      return saved ? JSON.parse(saved) : initialFSStudents;
    } catch {
      return initialFSStudents;
    }
  });

  // State for FS teachers
  const [teachers] = useState<FSTeacher[]>(() => {
    try {
      const saved = localStorage.getItem('asf_fs_teachers');
      return saved ? JSON.parse(saved) : initialFSTeachers;
    } catch {
      return initialFSTeachers;
    }
  });

  useEffect(() => {
    if (APP_CONFIG.features.useMockServices) {
      localStorage.setItem('asf_fs_students', JSON.stringify(students));
    }
  }, [students]);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'ATTENTION'>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [teacherFilter, setTeacherFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modal / Drawer Selection
  const [selectedStudent, setSelectedStudent] = useState<FSStudent | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [assignmentNote, setAssignmentNote] = useState('');

  // Admin note form inside modal
  const [newNoteText, setNewNoteText] = useState('');

  // Filtered Students Calculation
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Tab filter
      if (selectedTab === 'ACTIVE' && student.status !== 'Active') return false;
      if (selectedTab === 'COMPLETED' && student.status !== 'Completed') return false;
      if (selectedTab === 'ATTENTION' && student.status !== 'Needs Attention' && student.status !== 'Pending Review') return false;

      // Level filter
      if (levelFilter !== 'ALL' && student.foundationalLevel !== levelFilter) return false;

      // Teacher filter
      if (teacherFilter === 'UNASSIGNED' && student.assignedTeacherId) return false;
      if (teacherFilter !== 'ALL' && teacherFilter !== 'UNASSIGNED' && student.assignedTeacherId !== teacherFilter) return false;

      // Search query (name, fsIdNumber, department, previousAffiliation)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesId = student.fsIdNumber.toLowerCase().includes(q);
        const matchesDept = student.department.toLowerCase().includes(q);
        const matchesAffil = student.previousAffiliation.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesDept && !matchesAffil) return false;
      }

      return true;
    });
  }, [students, selectedTab, levelFilter, teacherFilter, searchQuery]);

  // Backend Action States
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Bulk Graduation Modal State
  const [isBulkGradModalOpen, setIsBulkGradModalOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);
  const [bulkResults, setBulkResults] = useState<FSBulkGraduationItemResult[] | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);

  // Load real student roster from backend
  const loadRoster = async () => {
    setIsLoadingRoster(true);
    setActionError(null);
    try {
      const roster = await fsService.getStudentRoster();
      if (!APP_CONFIG.features.useMockServices) {
        // Map authoritative backend roster records directly without fake mock records
        const mappedStudents: FSStudent[] = (roster || []).map(item => {
          const mappedStatus: FSStudentStatus = item.status === 'Graduated' ? 'Completed' : (item.status === 'Withdrawn' ? ('Withdrawn' as any) : 'Active');
          return {
            id: item.id,
            fsIdNumber: `FS-${item.id.substring(0, 8).toUpperCase()}`,
            name: item.studentName || 'Student',
            email: item.studentEmail || '',
            phone: '',
            department: 'General Enrollee',
            academicLevel: 'Undergraduate',
            foundationalLevel: 'Level 1: Basic Doctrines',
            status: mappedStatus,
            previousAffiliation: 'New Enrollee',
            enrollmentDate: item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
            completedChaptersCount: mappedStatus === 'Completed' ? 6 : 0,
            totalChaptersCount: 6,
            attendancePercent: 100,
            verificationNotes: 'Enrolled in Foundational School.',
            isVerified: true,
            completionCertified: mappedStatus === 'Completed',
            chapterProgress: [],
            adminNotes: []
          };
        });
        setStudents(mappedStudents);
      } else {
        if (roster && roster.length > 0) {
          setStudents(prev => {
            const updated = [...prev];
            roster.forEach(item => {
              const idx = updated.findIndex(s => s.id === item.id || s.email.toLowerCase() === item.studentEmail.toLowerCase());
              const mappedStatus: FSStudentStatus = item.status === 'Graduated' ? 'Completed' : (item.status === 'Withdrawn' ? ('Withdrawn' as any) : 'Active');
              if (idx >= 0) {
                updated[idx] = {
                  ...updated[idx],
                  id: item.id,
                  name: item.studentName || updated[idx].name,
                  email: item.studentEmail || updated[idx].email,
                  status: mappedStatus,
                  completionCertified: mappedStatus === 'Completed',
                };
              } else {
                updated.push({
                  id: item.id,
                  fsIdNumber: `FS-${item.id.substring(0, 6).toUpperCase()}`,
                  name: item.studentName || 'Student',
                  email: item.studentEmail || '',
                  phone: '',
                  department: 'General Enrollee',
                  academicLevel: 'Undergraduate',
                  foundationalLevel: 'Level 1: Basic Doctrines',
                  status: mappedStatus,
                  previousAffiliation: 'New Enrollee',
                  enrollmentDate: item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
                  completedChaptersCount: mappedStatus === 'Completed' ? 6 : 0,
                  totalChaptersCount: 6,
                  attendancePercent: 100,
                  verificationNotes: 'Enrolled in Foundational School.',
                  isVerified: true,
                  completionCertified: mappedStatus === 'Completed',
                  chapterProgress: [],
                  adminNotes: []
                });
              }
            });
            return updated;
          });
        }
      }
    } catch (err: any) {
      if (!APP_CONFIG.features.useMockServices) {
        setActionError(err.message || 'Failed to load Foundational School roster from server.');
        setStudents([]);
      } else {
        console.warn('Unable to load backend student roster:', err);
      }
    } finally {
      setIsLoadingRoster(false);
    }
  };

  useEffect(() => {
    loadRoster();
  }, []);

  // Handler: Assign Teacher
  const handleAssignTeacher = (studentId: string) => {
    const teacher = teachers.find(t => t.id === selectedTeacherId);
    if (!teacher) return;

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const updatedNotes: FSAdminNote[] = assignmentNote.trim() ? [
        {
          id: `note-${Date.now()}`,
          author: 'Sister Mary Bamidele',
          authorRole: 'VP / FS Coordinator',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          text: `Teacher Assignment Note: ${assignmentNote.trim()}`
        },
        ...s.adminNotes
      ] : s.adminNotes;

      return {
        ...s,
        assignedTeacherId: teacher.id,
        assignedTeacherName: teacher.name,
        adminNotes: updatedNotes
      };
    }));

    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent(prev => prev ? {
        ...prev,
        assignedTeacherId: teacher.id,
        assignedTeacherName: teacher.name
      } : null);
    }

    setIsAssignModalOpen(false);
    setSelectedTeacherId('');
    setAssignmentNote('');
  };

  // Handler: Update Student Status
  const handleUpdateStatus = (studentId: string, newStatus: FSStudentStatus) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        status: newStatus,
        completionCertified: newStatus === 'Completed' ? true : s.completionCertified,
        completionCertifiedDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : s.completionCertifiedDate
      };
    }));

    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent(prev => prev ? {
        ...prev,
        status: newStatus,
        completionCertified: newStatus === 'Completed' ? true : prev.completionCertified,
        completionCertifiedDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : prev.completionCertifiedDate
      } : null);
    }
  };

  // Handler: Record Completion / Graduation (PATCH /api/fs/students/:id/record-completion)
  const handleRecordCompletion = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (!window.confirm(`Are you sure you want to record Foundational School completion and graduate ${student.name}?`)) {
      return;
    }

    setIsProcessingAction(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fsService.recordStudentCompletion(studentId);
      const isGrad = res.status === 'Graduated' || res.status === 'Completed';

      setStudents(prev => prev.map(s => s.id === studentId ? {
        ...s,
        status: 'Completed',
        completionCertified: true,
        completionCertifiedDate: res.completionRecordedAt ? res.completionRecordedAt.split('T')[0] : new Date().toISOString().split('T')[0]
      } : s));

      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(prev => prev ? {
          ...prev,
          status: 'Completed',
          completionCertified: true,
          completionCertifiedDate: res.completionRecordedAt ? res.completionRecordedAt.split('T')[0] : new Date().toISOString().split('T')[0]
        } : null);
      }

      setActionSuccess(`Foundational School graduation recorded for ${student.name}.`);
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err: any) {
      if (err.statusCode === 409 || err.code === 'STUDENT_NOT_ACTIVE') {
        setActionError('Cannot record completion: Only currently Active students can be marked as Graduated.');
      } else {
        setActionError(err.message || 'Failed to record student completion.');
      }
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Handler: Withdraw Student (PATCH /api/fs/students/:id/withdraw)
  const handleWithdrawStudent = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (!window.confirm(`Are you sure you want to withdraw ${student.name} from the Foundational School?`)) {
      return;
    }

    setIsProcessingAction(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      await fsService.withdrawStudent(studentId);

      setStudents(prev => prev.map(s => s.id === studentId ? {
        ...s,
        status: 'Withdrawn' as any,
        completionCertified: false,
      } : s));

      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(prev => prev ? {
          ...prev,
          status: 'Withdrawn' as any,
          completionCertified: false,
        } : null);
      }

      setActionSuccess(`${student.name} has been withdrawn from Foundational School.`);
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err: any) {
      if (err.statusCode === 409 || err.code === 'STUDENT_NOT_ACTIVE') {
        setActionError('Cannot withdraw student: Student is not currently Active or has already been withdrawn.');
      } else {
        setActionError(err.message || 'Failed to withdraw student.');
      }
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Handler: Submit Bulk Graduation CSV (POST /api/fs/students/bulk-graduate)
  const handleBulkGraduateSubmit = async () => {
    if (!bulkFile) {
      setBulkError('Please choose a CSV file to upload.');
      return;
    }

    setIsUploadingBulk(true);
    setBulkError(null);
    setBulkResults(null);

    try {
      const results = await fsService.bulkGraduate(bulkFile);
      setBulkResults(results);
      // Reload roster to reflect any updated records
      await loadRoster();
    } catch (err: any) {
      setBulkError(err.message || 'Failed to process bulk graduation CSV.');
    } finally {
      setIsUploadingBulk(false);
    }
  };

  // Handler: Add Admin Note
  const handleAddAdminNote = (studentId: string) => {
    if (!newNoteText.trim()) return;

    const newNote: FSAdminNote = {
      id: `note-${Date.now()}`,
      author: 'Sister Mary Bamidele',
      authorRole: 'VP / FS Coordinator',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      text: newNoteText.trim()
    };

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        adminNotes: [newNote, ...s.adminNotes]
      };
    }));

    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent(prev => prev ? {
        ...prev,
        adminNotes: [newNote, ...prev.adminNotes]
      } : null);
    }

    setNewNoteText('');
  };

  // Form State for Adding a New Student
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    academicLevel: '100 Level',
    foundationalLevel: 'Level 1: Basic Doctrines',
    previousAffiliation: '',
    assignedTeacherId: '',
    verificationNotes: ''
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name.trim() || !newStudentForm.department.trim()) return;

    const count = students.length + 1;
    const newFsId = `FS-2025-${count.toString().padStart(3, '0')}`;
    const assignedTeacher = teachers.find(t => t.id === newStudentForm.assignedTeacherId);

    const newStudent: FSStudent = {
      id: `fs-stud-${Date.now()}`,
      fsIdNumber: newFsId,
      name: newStudentForm.name.trim(),
      email: newStudentForm.email.trim() || `${newStudentForm.name.toLowerCase().replace(/\s+/g, '.')}@futa.edu.ng`,
      phone: newStudentForm.phone.trim() || '+234 800 000 0000',
      department: newStudentForm.department.trim(),
      academicLevel: newStudentForm.academicLevel,
      foundationalLevel: newStudentForm.foundationalLevel,
      status: 'Active',
      previousAffiliation: newStudentForm.previousAffiliation.trim() || 'General Enrollee',
      enrollmentDate: new Date().toISOString().split('T')[0],
      assignedTeacherId: assignedTeacher?.id,
      assignedTeacherName: assignedTeacher?.name,
      completedChaptersCount: 0,
      totalChaptersCount: 6,
      attendancePercent: 100,
      verificationNotes: newStudentForm.verificationNotes.trim() || 'Inducted into Foundational School cohort.',
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
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          text: 'Newly enrolled and inducted into Foundational School.'
        }
      ]
    };

    setStudents(prev => [newStudent, ...prev]);
    setIsAddStudentModalOpen(false);
    setNewStudentForm({
      name: '',
      email: '',
      phone: '',
      department: '',
      academicLevel: '100 Level',
      foundationalLevel: 'Level 1: Basic Doctrines',
      previousAffiliation: '',
      assignedTeacherId: '',
      verificationNotes: ''
    });
  };

  return (
    <div className="space-y-6 select-none" id="manage-fs-students-screen">
      
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-[#5B0617] text-white rounded">
              DISCIPLESHIP ROSTER
            </span>
            <span className="text-xs text-[#52525B] font-medium">• Foundational School Administration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Manage FS Students
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1">
            Oversee enrolled discipleship students, track module completion, certify graduation, and manage session withdrawals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadRoster}
            disabled={isLoadingRoster}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] hover:bg-white text-[#18181B] text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            id="refresh-fs-roster-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRoster ? 'animate-spin text-[#5B0617]' : ''}`} />
            <span>{isLoadingRoster ? 'Syncing...' : 'Sync Roster'}</span>
          </button>

          <button
            onClick={() => setIsBulkGradModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
            id="bulk-graduate-csv-btn"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Bulk Graduate (CSV)</span>
          </button>

          <button
            onClick={() => setIsAddStudentModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* Action Error / Success Banners */}
      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2.5 animate-in fade-in" id="fs-student-action-error">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Student Administration Notice</p>
            <p className="mt-0.5">{actionError}</p>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between gap-2.5 animate-in fade-in" id="fs-student-action-success">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* Top Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E4E7] pb-3">
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E4E4E7] overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedTab === 'ALL'
                  ? 'bg-white text-[#5B0617] shadow-xs'
                  : 'text-[#52525B] hover:text-[#18181B]'
              }`}
            >
              All Students ({students.length})
            </button>
            <button
              onClick={() => setSelectedTab('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedTab === 'ACTIVE'
                  ? 'bg-white text-[#5B0617] shadow-xs'
                  : 'text-[#52525B] hover:text-[#18181B]'
              }`}
            >
              Active ({students.filter(s => s.status === 'Active').length})
            </button>
            <button
              onClick={() => setSelectedTab('COMPLETED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedTab === 'COMPLETED'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-[#52525B] hover:text-[#18181B]'
              }`}
            >
              Completed ({students.filter(s => s.status === 'Completed').length})
            </button>
            <button
              onClick={() => setSelectedTab('ATTENTION')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedTab === 'ATTENTION'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-[#52525B] hover:text-[#18181B]'
              }`}
            >
              Needs Attention ({students.filter(s => s.status === 'Needs Attention' || s.status === 'Pending Review').length})
            </button>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 text-xs text-[#52525B]">
            <span>Showing: <strong className="text-[#18181B]">{filteredStudents.length}</strong> students</span>
          </div>
        </div>

        {/* Search & Select Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#52525B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, FS ID, department, or background..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#18181B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Foundational Level Filter */}
          <div className="sm:col-span-3">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] focus:bg-white transition-all"
            >
              <option value="ALL">All Foundational Levels</option>
              <option value="Level 1: Basic Doctrines">Level 1: Basic Doctrines</option>
              <option value="Level 2: Spiritual Growth">Level 2: Spiritual Growth</option>
              <option value="Level 3: Christian Stewardship">Level 3: Christian Stewardship</option>
            </select>
          </div>

          {/* Facilitator Filter */}
          <div className="sm:col-span-3">
            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] focus:bg-white transition-all"
            >
              <option value="ALL">All Facilitators</option>
              <option value="UNASSIGNED">Unassigned Only</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Students List / Cards View */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E4E4E7] text-[#52525B] flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#18181B]">No FS Students Found</h3>
          <p className="text-xs text-[#52525B] max-w-sm mx-auto">
            No enrolled students match your search criteria or active filters. Try adjusting your search query.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedTab('ALL'); setLevelFilter('ALL'); setTeacherFilter('ALL'); }}
            className="px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-bold text-[#5B0617] hover:bg-[#5B0617]/10 transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const progressPercent = Math.round((student.completedChaptersCount / student.totalChaptersCount) * 100);
            const isCompleted = student.status === 'Completed';
            const isAttention = student.status === 'Needs Attention';
            const isPending = student.status === 'Pending Review';

            return (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all cursor-pointer group ${
                  isAttention 
                    ? 'border-rose-300 hover:border-rose-500' 
                    : isCompleted 
                      ? 'border-emerald-200 hover:border-emerald-400' 
                      : 'border-[#E4E4E7] hover:border-[#5B0617]'
                }`}
              >
                {/* Card Top: Name, ID, Badge */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E4E4E7] text-[#52525B]">
                        {student.fsIdNumber}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-[#18181B] mt-1 group-hover:text-[#5B0617] transition-colors">
                        {student.name}
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : isAttention
                          ? 'bg-rose-100 text-rose-800'
                          : isPending
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                      {student.status}
                    </span>
                  </div>

                  {/* Academic Profile & Level */}
                  <div className="text-[11px] text-[#52525B] mt-1.5 space-y-0.5">
                    <p className="font-medium text-[#18181B]">{student.department} • {student.academicLevel}</p>
                    <p className="text-[#5B0617] font-semibold">{student.foundationalLevel}</p>
                    <p className="text-[10px] text-[#52525B] truncate">Church Background: {student.previousAffiliation}</p>
                  </div>
                </div>

                {/* Progress Bar & Attendance */}
                <div className="space-y-2 pt-2 border-t border-[#E4E4E7]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#52525B]">Curriculum Progress:</span>
                    <span className="font-bold text-[#18181B]">
                      {student.completedChaptersCount}/{student.totalChaptersCount} Modules ({progressPercent}%)
                    </span>
                  </div>

                  {/* Progress Meter Bar */}
                  <div className="w-full h-2 rounded-full bg-[#FAF8F5] border border-[#E4E4E7] overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isCompleted ? 'bg-emerald-600' : isAttention ? 'bg-rose-500' : 'bg-[#5B0617]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#52525B] pt-1">
                    <span>Attendance: <strong className={student.attendancePercent < 70 ? 'text-rose-700 font-bold' : 'text-[#18181B] font-semibold'}>{student.attendancePercent}%</strong></span>
                    <span>Enrolled: {student.enrollmentDate}</span>
                  </div>
                </div>

                {/* Facilitator Assignment Info */}
                <div className="pt-2 border-t border-[#E4E4E7] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#52525B]" />
                    <span className="text-[#52525B]">
                      {student.assignedTeacherName ? (
                        <strong className="text-[#18181B]">{student.assignedTeacherName}</strong>
                      ) : (
                        <span className="text-rose-600 font-semibold italic">Unassigned Facilitator</span>
                      )}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-[#5B0617] group-hover:underline flex items-center gap-0.5">
                    <span>View Profile</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Student Inspection Modal / Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl border border-[#E4E4E7] shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E4E4E7] bg-[#FAF8F5] flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-[#E4E4E7] text-[#52525B]">
                    {selectedStudent.fsIdNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedStudent.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedStudent.status === 'Needs Attention'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedStudent.status}
                  </span>
                </div>
                <h2 className="text-xl font-serif font-bold text-[#18181B]">{selectedStudent.name}</h2>
                <p className="text-xs text-[#52525B] mt-0.5">
                  {selectedStudent.department} • {selectedStudent.academicLevel} • {selectedStudent.foundationalLevel}
                </p>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full bg-white border border-[#E4E4E7] flex items-center justify-center text-[#52525B] hover:text-[#18181B] hover:bg-[#FAF8F5] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* Profile & Affiliation Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F5] p-4 rounded-xl border border-[#E4E4E7] text-xs">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#52525B]">
                    CONTACT & ACADEMIC DETAILS
                  </span>
                  <div className="flex items-center gap-1.5 text-[#18181B]">
                    <Mail className="w-3.5 h-3.5 text-[#5B0617]" />
                    <span>{selectedStudent.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#18181B]">
                    <Phone className="w-3.5 h-3.5 text-[#5B0617]" />
                    <span>{selectedStudent.phone}</span>
                  </div>
                  <div className="text-[#52525B] pt-1">
                    Enrolled on: <strong className="text-[#18181B] font-semibold">{selectedStudent.enrollmentDate}</strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#52525B]">
                    CHURCH BACKGROUND & DISCIPLINE
                  </span>
                  <p className="text-[#18181B] font-medium">{selectedStudent.previousAffiliation}</p>
                  <p className="text-[#52525B] italic text-[11px] bg-white p-2 rounded-lg border border-[#E4E4E7]/60">
                    "{selectedStudent.verificationNotes}"
                  </p>
                </div>
              </div>

              {/* Facilitator Assignment Section */}
              <div className="bg-white rounded-xl border border-[#E4E4E7] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#5B0617]" />
                    <span className="text-xs font-bold text-[#18181B]">Assigned FS Facilitator</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTeacherId(selectedStudent.assignedTeacherId || '');
                      setIsAssignModalOpen(true);
                    }}
                    className="px-3 py-1 rounded-lg bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#5B0617] text-xs font-bold text-[#5B0617] transition-all"
                  >
                    {selectedStudent.assignedTeacherId ? 'Change Facilitator' : 'Assign Facilitator'}
                  </button>
                </div>

                {selectedStudent.assignedTeacherName ? (
                  <div className="flex items-center justify-between text-xs bg-[#FAF8F5] p-3 rounded-lg border border-[#E4E4E7]">
                    <div>
                      <p className="font-bold text-[#18181B]">{selectedStudent.assignedTeacherName}</p>
                      <p className="text-[11px] text-[#52525B]">Primary Discipleship Facilitator & Mentor</p>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold text-[10px]">
                      Assigned Mentor
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center justify-between">
                    <span>No facilitator assigned to this student yet.</span>
                    <button
                      onClick={() => {
                        setSelectedTeacherId('');
                        setIsAssignModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded bg-rose-700 text-white font-bold text-[10px]"
                    >
                      Assign Now
                    </button>
                  </div>
                )}
              </div>

              {/* Discipleship Curriculum Modules Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                    Foundational Curriculum Progress ({selectedStudent.completedChaptersCount}/{selectedStudent.totalChaptersCount} Modules)
                  </h3>
                  <span className="text-xs font-bold text-[#5B0617]">
                    Attendance: {selectedStudent.attendancePercent}%
                  </span>
                </div>

                <div className="divide-y divide-[#E4E4E7] border border-[#E4E4E7] rounded-xl overflow-hidden">
                  {selectedStudent.chapterProgress.map((chap) => (
                    <div key={chap.chapterNumber} className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          chap.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : chap.status === 'In Progress'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-500'
                        }`}>
                          {chap.chapterNumber}
                        </span>
                        <div>
                          <p className="font-bold text-[#18181B]">{chap.title}</p>
                          {chap.facilitatorFeedback && (
                            <p className="text-[11px] text-[#52525B] italic mt-0.5">Feedback: "{chap.facilitatorFeedback}"</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-[11px]">
                        {chap.score && (
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Score: {chap.score}%
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          chap.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : chap.status === 'In Progress'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          {chap.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Administrative Status & Certification Actions */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E4E4E7] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#18181B]">Administrative Status & Actions</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateStatus(selectedStudent.id, 'Active')}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                        selectedStudent.status === 'Active'
                          ? 'bg-[#5B0617] text-white border-[#5B0617]'
                          : 'bg-white text-[#52525B] border-[#E4E4E7] hover:border-[#5B0617]'
                      }`}
                    >
                      Set Active
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedStudent.id, 'Needs Attention')}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                        selectedStudent.status === 'Needs Attention'
                          ? 'bg-rose-700 text-white border-rose-700'
                          : 'bg-white text-[#52525B] border-[#E4E4E7] hover:border-rose-400'
                      }`}
                    >
                      Flag Attention
                    </button>
                  </div>
                </div>

                {/* Completion / Graduation Certification */}
                {selectedStudent.completionCertified || selectedStudent.status === 'Completed' ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-900 text-xs">
                      <Award className="w-4 h-4 text-emerald-700" />
                      <div>
                        <p className="font-bold">FS Discipleship Certified</p>
                        <p className="text-[10px] text-emerald-700">Certified by FS Coordinator • {selectedStudent.completionCertifiedDate || 'Current Session'}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 font-bold text-[10px] rounded">
                      Graduated
                    </span>
                  </div>
                ) : (selectedStudent.status as any) === 'Withdrawn' ? (
                  <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700 text-xs">
                      <UserMinus className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-bold">Student Withdrawn</p>
                        <p className="text-[10px] text-gray-500">Student is withdrawn from the current Foundational School cohort.</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-800 font-bold text-[10px] rounded">
                      Withdrawn
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isProcessingAction}
                      onClick={() => handleRecordCompletion(selectedStudent.id)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                      id="record-student-completion-btn"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>{isProcessingAction ? 'Recording...' : 'Mark as Graduated'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isProcessingAction}
                      onClick={() => handleWithdrawStudent(selectedStudent.id)}
                      className="py-2.5 px-3 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                      id="withdraw-fs-student-btn"
                    >
                      <UserMinus className="w-4 h-4 text-rose-600" />
                      <span>{isProcessingAction ? 'Processing...' : 'Withdraw Student'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Administrative Notes Log */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                  Administrative Notes & Follow-up History
                </h3>

                {/* Add Note Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add follow-up notes, test scores, or counseling remarks..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E4E4E7] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
                  />
                  <button
                    onClick={() => handleAddAdminNote(selectedStudent.id)}
                    disabled={!newNoteText.trim()}
                    className="px-4 py-2 rounded-xl bg-[#5B0617] text-white text-xs font-bold hover:bg-[#7A1F2B] disabled:opacity-50 transition-all"
                  >
                    Post Note
                  </button>
                </div>

                <div className="space-y-2 mt-2">
                  {selectedStudent.adminNotes.length === 0 ? (
                    <div className="text-xs text-[#52525B] italic p-3 bg-[#FAF8F5] rounded-lg text-center">
                      No administrative notes logged for this student yet.
                    </div>
                  ) : (
                    selectedStudent.adminNotes.map(note => (
                      <div key={note.id} className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E4E4E7] text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-[#52525B]">
                          <span className="font-bold text-[#18181B]">{note.author} ({note.authorRole})</span>
                          <span>{note.timestamp}</span>
                        </div>
                        <p className="text-[#18181B] leading-relaxed">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E4E4E7] bg-[#FAF8F5] flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-[#5B0617] text-white text-xs font-bold hover:bg-[#7A1F2B] transition-all"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Assign Teacher Modal */}
      {isAssignModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl border border-[#E4E4E7] shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#18181B]">Assign Facilitator / Teacher</h3>
                <p className="text-xs text-[#52525B]">For student: {selectedStudent.name} ({selectedStudent.fsIdNumber})</p>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-[#52525B] hover:text-[#18181B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-bold text-[#18181B] block">
                Select FS Facilitator:
              </label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
              >
                <option value="">-- Choose Facilitator --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.department} • {t.assignedStudentsCount} students)
                  </option>
                ))}
              </select>

              <label className="font-bold text-[#18181B] block mt-2">
                Assignment Note / Mentorship Instructions:
              </label>
              <textarea
                rows={2}
                placeholder="Optional assignment note or spiritual follow-up focus..."
                value={assignmentNote}
                onChange={(e) => setAssignmentNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs text-[#18181B] focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E4E4E7]">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E4E4E7] text-xs font-bold text-[#52525B] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAssignTeacher(selectedStudent.id)}
                disabled={!selectedTeacherId}
                className="px-4 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold disabled:opacity-50 shadow-sm"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll New Student Modal */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-[#E4E4E7] shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <div>
                <h3 className="font-bold text-base text-[#18181B]">Enroll New FS Student</h3>
                <p className="text-xs text-[#52525B]">Induct student into Foundational School discipleship roster</p>
              </div>
              <button
                onClick={() => setIsAddStudentModalOpen(false)}
                className="text-[#52525B] hover:text-[#18181B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#18181B] block mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oluwatosin Emmanuel"
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#18181B] block mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={newStudentForm.department}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#18181B] block mb-1">Academic Level</label>
                  <select
                    value={newStudentForm.academicLevel}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, academicLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
                  >
                    <option value="100 Level">100 Level</option>
                    <option value="200 Level">200 Level</option>
                    <option value="300 Level">300 Level</option>
                    <option value="400 Level">400 Level</option>
                    <option value="500 Level">500 Level</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#18181B] block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+234 800..."
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#18181B] block mb-1">Foundational Level</label>
                  <select
                    value={newStudentForm.foundationalLevel}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, foundationalLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
                  >
                    <option value="Level 1: Basic Doctrines">Level 1: Basic Doctrines</option>
                    <option value="Level 2: Spiritual Growth">Level 2: Spiritual Growth</option>
                    <option value="Level 3: Christian Stewardship">Level 3: Christian Stewardship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#18181B] block mb-1">Church Background / Affiliation</label>
                <input
                  type="text"
                  placeholder="e.g. St. Peter's Cathedral Akure / New Convert"
                  value={newStudentForm.previousAffiliation}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, previousAffiliation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-[#18181B] block mb-1">Assign Facilitator (Optional)</label>
                <select
                  value={newStudentForm.assignedTeacherId}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, assignedTeacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
                >
                  <option value="">-- Assign Later --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#18181B] block mb-1">Verification / Initial Notes</label>
                <textarea
                  rows={2}
                  placeholder="Baptism verification, testimony remarks, or onboarding instructions..."
                  value={newStudentForm.verificationNotes}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, verificationNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] text-xs focus:outline-hidden focus:border-[#5B0617] focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E4E7]">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E4E4E7] text-xs font-bold text-[#52525B] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold shadow-sm"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Graduation CSV Modal */}
      {isBulkGradModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" id="fs-bulk-graduate-modal">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl border border-[#E4E4E7] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#18181B]">Bulk Graduate Students (CSV)</h3>
                  <p className="text-[11px] text-[#52525B]">Batch graduate discipleship candidates and update church records</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsBulkGradModalOpen(false);
                  setBulkFile(null);
                  setBulkResults(null);
                  setBulkError(null);
                }}
                className="p-1 hover:bg-[#FAF8F5] rounded-lg text-[#71717A] hover:text-[#18181B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CSV Instructions */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E4E4E7] text-xs space-y-2">
              <p className="font-bold text-[#18181B] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#5B0617]" />
                <span>Required CSV Header Specification</span>
              </p>
              <div className="bg-white p-2 rounded border border-[#E4E4E7] font-mono text-[11px] text-[#5B0617]">
                name,academicLevel,subgroup
              </div>
              <p className="text-[11px] text-[#52525B]">
                Each row matches a candidate by name and applies graduation status. If a student is found, their record is updated to <span className="font-semibold text-emerald-700">Graduated</span>.
              </p>
            </div>

            {/* File Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#18181B]">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setBulkFile(e.target.files[0]);
                    setBulkError(null);
                  }
                }}
                className="w-full text-xs text-[#52525B] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#5B0617] file:text-white hover:file:bg-[#7A1F2B] file:cursor-pointer p-2 border border-[#E4E4E7] rounded-xl bg-[#FAF8F5]"
                id="fs-bulk-csv-input"
              />
            </div>

            {/* Bulk Upload Error Banner */}
            {bulkError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2" id="bulk-upload-error-msg">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{bulkError}</span>
              </div>
            )}

            {/* Upload Results Table */}
            {bulkResults && (
              <div className="space-y-2 border-t border-[#E4E4E7] pt-3 max-h-48 overflow-y-auto" id="bulk-graduation-results-list">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#18181B]">Processing Results</span>
                  <span className="text-[11px] text-[#52525B]">{bulkResults.length} records processed</span>
                </div>
                <div className="divide-y divide-[#E4E4E7] border border-[#E4E4E7] rounded-xl overflow-hidden">
                  {bulkResults.map((res, idx) => (
                    <div key={idx} className="p-2.5 bg-white flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#18181B]">{res.name}</p>
                        {res.reason && <p className="text-[10px] text-[#71717A]">{res.reason}</p>}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        res.status === 'UPDATED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E4E7]">
              <button
                type="button"
                onClick={() => {
                  setIsBulkGradModalOpen(false);
                  setBulkFile(null);
                  setBulkResults(null);
                  setBulkError(null);
                }}
                className="px-4 py-2 rounded-xl border border-[#E4E4E7] text-xs font-bold text-[#52525B] hover:bg-[#FAF8F5] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                disabled={!bulkFile || isUploadingBulk}
                onClick={handleBulkGraduateSubmit}
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                id="submit-bulk-graduate-csv-btn"
              >
                {isUploadingBulk ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing CSV...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Graduate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
