/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FSStudentStatus = 'Active' | 'Completed' | 'Pending Review' | 'Needs Attention';

export interface FSChapterProgress {
  chapterNumber: number;
  title: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
  completedDate?: string;
  score?: number; // e.g. 85%
  facilitatorFeedback?: string;
}

export interface FSAdminNote {
  id: string;
  author: string;
  authorRole: string;
  timestamp: string;
  text: string;
}

export interface FSStudent {
  id: string;
  fsIdNumber: string; // e.g. "FS-2025-001"
  name: string;
  email: string;
  phone: string;
  department: string;
  academicLevel: string; // e.g. "200 Level", "300 Level"
  foundationalLevel: string; // e.g. "Level 1: Basic Doctrines", "Level 2: Spiritual Growth", "Level 3: Christian Stewardship"
  status: FSStudentStatus;
  previousAffiliation: string; // e.g. "Anglican Youth Fellowship, St. Peter's Akure"
  enrollmentDate: string;
  assignedTeacherId?: string;
  assignedTeacherName?: string;
  completedChaptersCount: number;
  totalChaptersCount: number;
  attendancePercent: number;
  verificationNotes: string;
  isVerified: boolean;
  completionCertified: boolean;
  completionCertifiedDate?: string;
  chapterProgress: FSChapterProgress[];
  adminNotes: FSAdminNote[];
}

export interface FSTeacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  academicLevel: string;
  assignedStudentsCount: number;
  assignedFoundationalLevel: string;
  status: 'Active' | 'On Leave';
  specialization: string;
}

export interface FSAdmissionApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  department: string;
  academicLevel: string;
  previousChurchAffiliation: string;
  salvationTestimonySummary: string;
  reasonForJoining: string;
  applicationDate: string;
  status: 'Pending Review' | 'Approved' | 'Interview Scheduled' | 'Declined';
  assignedFoundationalLevel?: string;
  reviewerNotes?: string;
  reviewedBy?: string;
}

export interface FSClassLevel {
  id: string;
  levelName: string;
  code: string;
  description: string;
  enrolledCount: number;
  facilitatorLead: string;
  meetingSchedule: string;
  curriculumModules: string[];
  status: 'Active' | 'Upcoming' | 'Archived';
}

export interface FSActivityLog {
  id: string;
  timestamp: string;
  studentName?: string;
  studentId?: string;
  actor: string;
  actorRole: string;
  type: 'submission' | 'attendance' | 'assignment' | 'admission' | 'status_change' | 'teacher_assigned' | 'completion';
  title: string;
  description: string;
  severity: 'normal' | 'attention' | 'success';
}
