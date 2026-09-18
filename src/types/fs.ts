/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ApplyFSAdmissionPayload {
  testimony?: string;
}

/**
 * Authoritative Student FS Admission response shape from POST /api/fs/admissions
 */
export interface FSAdmission {
  id: string;
  userId: string;
  testimony: string | null;
  status: 'Pending' | 'Approved' | 'Rejected' | string;
  assignedClassId: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authoritative Coordinator FS Admission response shape from GET /api/fs/admissions/admin
 * Backend already joins applicantName, applicantEmail, and applicantLevel.
 */
export interface FSAdmissionAdminView {
  id: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  applicantLevel: string;
  testimony: string | null;
  status: 'Pending' | 'Approved' | 'Rejected' | string;
  assignedClassId: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  createdAt: string;
}

export type FSAdmissionStatusFilter = 'ALL' | 'Pending' | 'Approved' | 'Rejected';

export interface ReviewFSAdmissionPayload {
  action?: 'approve' | 'reject';
  status?: 'Approved' | 'Rejected';
  classId?: string;
  notes?: string;
  reviewNotes?: string;
}

export interface FSManualUploadResult {
  id: string;
  fileName: string;
}

export interface FSStudentRosterItem {
  id: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  classId: string;
  status: 'Active' | 'Graduated' | 'Withdrawn' | string;
  createdAt: string;
}

export interface FSStudentCompletionResult {
  id: string;
  status: 'Graduated' | string;
  completionRecordedBy?: string;
  completionRecordedAt?: string;
}

export interface FSStudentWithdrawResult {
  id: string;
  status: 'Withdrawn' | string;
  withdrawnBy?: string;
  withdrawnAt?: string;
  [key: string]: any;
}

export interface FSBulkGraduationItemResult {
  name: string;
  status: 'UPDATED' | 'NOT_FOUND' | string;
  reason?: string;
}

