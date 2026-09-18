/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  FSMaterial, 
  FSAdmission, 
  FSAdmissionAdminView, 
  ApplyFSAdmissionPayload,
  ReviewFSAdmissionPayload,
  FSManualUploadResult,
  FSStudentRosterItem,
  FSStudentCompletionResult,
  FSStudentWithdrawResult,
  FSBulkGraduationItemResult,
} from '../../types';
import { mockFSMaterials } from '../../data/fsData';
import { initialFSAdmissions, initialFSStudents } from '../../data/fsAdminData';
import { APP_CONFIG } from '../../config/app.config';
import { apiClient } from '../api/client';

export const fsService = {
  /**
   * Apply for Foundational School (Student)
   * Connects to backend: POST /api/fs/admissions
   */
  async applyForAdmission(payload: ApplyFSAdmissionPayload = {}): Promise<FSAdmission> {
    if (APP_CONFIG.features.useMockServices) {
      const mockResult: FSAdmission = {
        id: `adm-${Date.now()}`,
        userId: 'usr-mock-student',
        testimony: payload.testimony ? payload.testimony.trim() : null,
        status: 'Pending',
        assignedClassId: null,
        reviewedBy: null,
        reviewedAt: null,
        reviewNotes: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return mockResult;
    }

    const body: { testimony?: string } = {};
    if (payload.testimony && payload.testimony.trim().length > 0) {
      body.testimony = payload.testimony.trim();
    }

    const res = await apiClient.post<FSAdmission>('/api/fs/admissions', body);
    return res.data;
  },

  /**
   * View FS Applications (Coordinator / Admin)
   * Connects to backend: GET /api/fs/admissions/admin
   * Backend requires permission: fs.admissions.review
   * Query: ?status=Pending | Approved | Rejected (optional)
   */
  async getAdminAdmissions(statusFilter?: string): Promise<FSAdmissionAdminView[]> {
    if (APP_CONFIG.features.useMockServices) {
      const mapped: FSAdmissionAdminView[] = initialFSAdmissions.map(adm => {
        let mappedStatus: 'Pending' | 'Approved' | 'Rejected' | string = adm.status;
        if (adm.status === 'Pending Review' || adm.status === 'Interview Scheduled') {
          mappedStatus = 'Pending';
        } else if (adm.status === 'Declined') {
          mappedStatus = 'Rejected';
        }

        return {
          id: adm.id,
          userId: `usr-${adm.id}`,
          applicantName: adm.applicantName,
          applicantEmail: adm.email,
          applicantLevel: adm.academicLevel,
          testimony: adm.salvationTestimonySummary || null,
          status: mappedStatus,
          assignedClassId: null,
          reviewedBy: adm.reviewedBy || null,
          reviewedAt: adm.reviewedBy ? new Date().toISOString() : null,
          reviewNotes: adm.reviewerNotes || null,
          createdAt: adm.applicationDate,
        };
      });

      if (statusFilter && statusFilter !== 'ALL') {
        return mapped.filter(a => a.status.toLowerCase() === statusFilter.toLowerCase());
      }
      return mapped;
    }

    let url = '/api/fs/admissions/admin';
    if (statusFilter && statusFilter !== 'ALL') {
      const params = new URLSearchParams({ status: statusFilter });
      url += `?${params.toString()}`;
    }

    const res = await apiClient.get<FSAdmissionAdminView[]>(url);
    return res.data;
  },

  /**
   * Review FS Admission Application (Coordinator / Admin)
   * PATCH /api/fs/admissions/admin/:id/review
   * Permission: fs.admissions.review
   */
  async reviewAdmission(id: string, payload: ReviewFSAdmissionPayload): Promise<FSAdmission> {
    if (APP_CONFIG.features.useMockServices) {
      return {
        id,
        userId: `usr-${id}`,
        testimony: null,
        status: payload.action === 'approve' ? 'Approved' : 'Rejected',
        assignedClassId: payload.classId || null,
        reviewedBy: 'admin-mock',
        reviewedAt: new Date().toISOString(),
        reviewNotes: payload.notes || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const res = await apiClient.patch<FSAdmission>(`/api/fs/admissions/admin/${encodeURIComponent(id)}/review`, payload);
    return res.data;
  },

  /**
   * Upload FS Manual (PDF)
   * POST /api/fs/manual (multipart/form-data: file = PDF)
   * Authorized: VP / FS Coordinator, President / Executive, Technical Administrator
   */
  async uploadManual(file: File): Promise<FSManualUploadResult> {
    if (APP_CONFIG.features.useMockServices) {
      return {
        id: `manual-${Date.now()}`,
        fileName: file.name,
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<FSManualUploadResult>('/api/fs/manual', formData);
    return res.data;
  },

  /**
   * Download / Stream FS Manual (PDF Binary Blob)
   * GET /api/fs/manual
   * Authorized: currently active FS students, FS teachers
   * Returns: raw PDF binary (Blob)
   * Errors: 403 MANUAL_ACCESS_DENIED, 404 MANUAL_NOT_FOUND
   */
  async getManualBlob(): Promise<Blob> {
    if (APP_CONFIG.features.useMockServices) {
      return new Blob(['%PDF-1.4 Mock Foundational School Manual Content'], { type: 'application/pdf' });
    }

    return await apiClient.getBlob('/api/fs/manual');
  },

  /**
   * Retrieve Student Roster
   * GET /api/fs/students (optional ?classId=<uuid>)
   */
  async getStudentRoster(classId?: string): Promise<FSStudentRosterItem[]> {
    if (APP_CONFIG.features.useMockServices) {
      return initialFSStudents.map(s => ({
        id: s.id,
        userId: `usr-${s.id}`,
        studentName: s.name,
        studentEmail: s.email,
        classId: classId || 'class-2025-a',
        status: s.status === 'Completed' ? 'Graduated' : s.status,
        createdAt: s.enrollmentDate,
      }));
    }

    let url = '/api/fs/students';
    if (classId) {
      const params = new URLSearchParams({ classId });
      url += `?${params.toString()}`;
    }

    const res = await apiClient.get<FSStudentRosterItem[]>(url);
    return res.data;
  },

  /**
   * Record Completion / Graduation for an Active FS Student
   * PATCH /api/fs/students/:id/record-completion
   * Error: 409 STUDENT_NOT_ACTIVE
   */
  async recordStudentCompletion(studentId: string): Promise<FSStudentCompletionResult> {
    if (APP_CONFIG.features.useMockServices) {
      return {
        id: studentId,
        status: 'Graduated',
        completionRecordedBy: 'admin-mock-uuid',
        completionRecordedAt: new Date().toISOString(),
      };
    }

    const res = await apiClient.patch<FSStudentCompletionResult>(`/api/fs/students/${encodeURIComponent(studentId)}/record-completion`);
    return res.data;
  },

  /**
   * Withdraw an Active FS Student
   * PATCH /api/fs/students/:id/withdraw
   * Error: 409 STUDENT_NOT_ACTIVE
   */
  async withdrawStudent(studentId: string): Promise<FSStudentWithdrawResult> {
    if (APP_CONFIG.features.useMockServices) {
      return {
        id: studentId,
        status: 'Withdrawn',
        withdrawnAt: new Date().toISOString(),
      };
    }

    const res = await apiClient.patch<FSStudentWithdrawResult>(`/api/fs/students/${encodeURIComponent(studentId)}/withdraw`);
    return res.data;
  },

  /**
   * Bulk Graduate Students via CSV Upload
   * POST /api/fs/students/bulk-graduate (multipart/form-data: file = CSV)
   * CSV headers: name,academicLevel,subgroup
   */
  async bulkGraduate(file: File): Promise<FSBulkGraduationItemResult[]> {
    if (APP_CONFIG.features.useMockServices) {
      return [
        { name: 'John Doe', status: 'UPDATED' },
        { name: 'Jane Smith', status: 'NOT_FOUND' },
      ];
    }

    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<FSBulkGraduationItemResult[]>('/api/fs/students/bulk-graduate', formData);
    return res.data;
  },

  async getMaterials(): Promise<FSMaterial[]> {
    if (APP_CONFIG.features.useMockServices) {
      return mockFSMaterials;
    }
    const res = await apiClient.get<FSMaterial[]>('/api/fs/materials');
    return res.data;
  },

  async getMaterialById(id: string): Promise<FSMaterial | null> {
    if (APP_CONFIG.features.useMockServices) {
      return mockFSMaterials.find(m => m.id === id) || null;
    }
    const res = await apiClient.get<FSMaterial>(`/api/fs/materials/${id}`);
    return res.data;
  },
};

