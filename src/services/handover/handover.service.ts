/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from '../api/client';
import { API_CONFIG } from '../../config/api.config';
import { ApiError } from '../api/types';

export type HandoverStatus =
  | 'Validated'
  | 'Approved'
  | 'Published'
  | 'Invalid'
  | 'validated'
  | 'approved'
  | 'published'
  | 'invalid'
  | string;

export interface HandoverValidationErrorItem {
  row?: number;
  line?: number;
  field?: string;
  code?: string;
  message: string;
  memberId?: string;
  officeId?: string;
  [key: string]: any;
}

export interface HandoverAssignmentItem {
  id?: string;
  memberId: string;
  officeId: string;
  memberName?: string;
  memberEmail?: string;
  department?: string;
  academicLevel?: string;
  officeName?: string;
  member?: {
    id?: string;
    name?: string;
    email?: string;
    department?: string;
    academicLevel?: string;
  } | null;
  office?: {
    id?: string;
    name?: string;
  } | null;
  [key: string]: any;
}

export interface HandoverRecord {
  id: string;
  status: HandoverStatus;
  assignments: HandoverAssignmentItem[];
  validationErrors: HandoverValidationErrorItem[];
  academicSessionId?: string | null;
  createdBy?: string | Record<string, any> | null;
  approvedBy?: string | Record<string, any> | null;
  publishedBy?: string | Record<string, any> | null;
  createdAt?: string | null;
  approvedAt?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  [key: string]: any;
}

function normalizeValidationErrors(rawErrors: unknown): HandoverValidationErrorItem[] {
  if (!Array.isArray(rawErrors)) return [];
  return rawErrors.map((err: any) => {
    if (typeof err === 'string') {
      return { message: err };
    }
    if (err && typeof err === 'object') {
      return {
        ...err,
        row: typeof err.row === 'number' ? err.row : (typeof err.line === 'number' ? err.line : undefined),
        field: err.field || (Array.isArray(err.path) ? err.path.join('.') : undefined),
        code: err.code,
        message: String(err.message || err.error || 'Validation error on row'),
        memberId: err.memberId,
        officeId: err.officeId,
      };
    }
    return { message: String(err) };
  });
}

function normalizeAssignments(rawList: unknown): HandoverAssignmentItem[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map((item: any) => ({
    ...item,
    memberId: String(item?.memberId ?? item?.userId ?? item?.member?.id ?? ''),
    officeId: String(item?.officeId ?? item?.office?.id ?? ''),
    memberName: item?.memberName ?? item?.member?.name,
    memberEmail: item?.memberEmail ?? item?.member?.email,
    department: item?.department ?? item?.member?.department,
    academicLevel: item?.academicLevel ?? item?.member?.academicLevel,
    officeName: item?.officeName ?? item?.office?.name,
  }));
}

export function normalizeHandoverRecord(raw: any): HandoverRecord {
  const source = raw?.handover ?? raw?.data ?? raw ?? {};
  const rawAssignments =
    source.assignments ??
    source.incomingAssignments ??
    source.entries ??
    source.rows ??
    source.items ??
    [];
  const rawValidationErrors =
    source.validationErrors ??
    source.errors ??
    raw?.validationErrors ??
    raw?.errors ??
    [];

  return {
    ...source,
    id: String(source.id ?? source.handoverId ?? ''),
    status: String(source.status ?? 'Validated'),
    assignments: normalizeAssignments(rawAssignments),
    validationErrors: normalizeValidationErrors(rawValidationErrors),
  };
}

export function extractHandoverValidationErrors(error: any): HandoverValidationErrorItem[] {
  if (!error) return [];
  const details = error.details ?? error.error?.details ?? error.data?.validationErrors ?? error.data?.errors;
  if (Array.isArray(details)) {
    return normalizeValidationErrors(details);
  }
  if (details && typeof details === 'object') {
    if (Array.isArray(details.errors)) return normalizeValidationErrors(details.errors);
    if (Array.isArray(details.validationErrors)) return normalizeValidationErrors(details.validationErrors);
    if (Array.isArray(details.issues)) return normalizeValidationErrors(details.issues);
  }
  return [];
}

async function readFileAsText(file: File): Promise<string> {
  if (typeof file.text === 'function') {
    return await file.text();
  }
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Failed to read CSV file'));
    reader.readAsText(file);
  });
}

export function isHandoverValidated(status: string | undefined | null): boolean {
  return String(status || '').trim().toLowerCase() === 'validated';
}

export function isHandoverApproved(status: string | undefined | null): boolean {
  return String(status || '').trim().toLowerCase() === 'approved';
}

export function isHandoverPublished(status: string | undefined | null): boolean {
  return String(status || '').trim().toLowerCase() === 'published';
}

export function isHandoverInvalid(status: string | undefined | null): boolean {
  const s = String(status || '').trim().toLowerCase();
  return s === 'invalid' || s === 'failed' || s === 'failed validation';
}

export class HandoverService {
  /**
   * Upload & validate Executive Handover CSV:
   * POST /api/president/handovers
   *
   * Strict CSV contract:
   * memberId,officeId
   *
   * Do NOT silently repair invalid CSV data. Pass exact raw CSV content to backend.
   */
  async uploadHandover(input: File | string | { csv: string }): Promise<HandoverRecord> {
    let csvContent = '';
    let originalFile: File | null = null;

    if (typeof input === 'string') {
      csvContent = input;
    } else if (typeof File !== 'undefined' && input instanceof File) {
      originalFile = input;
      csvContent = await readFileAsText(input);
    } else if (input && typeof input === 'object' && 'csv' in input) {
      csvContent = input.csv;
    }

    try {
      const response = await apiClient.post<any>(API_CONFIG.endpoints.president.handovers, {
        csv: csvContent,
      });
      return normalizeHandoverRecord(response?.data ?? response);
    } catch (err: any) {
      // If the backend route uses multipart/form-data file upload instead of JSON { csv },
      // transparently send FormData without modifying the CSV content.
      const isMissingMultipartFile =
        err?.code === 'MISSING_FILE' ||
        err?.code === 'NO_FILE' ||
        err?.code === 'FILE_REQUIRED' ||
        (typeof err?.message === 'string' && /no file|file is required|multipart/i.test(err.message));

      if (isMissingMultipartFile) {
        const formData = new FormData();
        const fileToUpload =
          originalFile ||
          new Blob([csvContent], { type: 'text/csv' });
        formData.append('file', fileToUpload, originalFile?.name || 'handover.csv');
        const retryResponse = await apiClient.post<any>(API_CONFIG.endpoints.president.handovers, formData);
        return normalizeHandoverRecord(retryResponse?.data ?? retryResponse);
      }

      throw err;
    }
  }

  /**
   * Retrieve Executive Handover details by ID:
   * GET /api/president/handovers/:id
   */
  async getHandoverById(id: string): Promise<HandoverRecord> {
    const trimmedId = (id || '').trim();
    if (!trimmedId) {
      const err: ApiError = {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Handover ID is required.',
      };
      throw err;
    }

    const response = await apiClient.get<any>(API_CONFIG.endpoints.president.handoverDetail(trimmedId));
    return normalizeHandoverRecord(response?.data ?? response);
  }

  async getHandover(id: string): Promise<HandoverRecord> {
    return this.getHandoverById(id);
  }

  /**
   * Approve a Validated Executive Handover:
   * POST /api/president/handovers/:id/approve
   */
  async approveHandover(id: string): Promise<HandoverRecord> {
    const trimmedId = (id || '').trim();
    if (!trimmedId) {
      const err: ApiError = {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Handover ID is required.',
      };
      throw err;
    }

    const response = await apiClient.post<any>(
      API_CONFIG.endpoints.president.approveHandover(trimmedId),
      {}
    );
    return normalizeHandoverRecord(response?.data ?? response);
  }

  /**
   * Publish an Approved Executive Handover (executes office transition on backend):
   * POST /api/president/handovers/:id/publish
   */
  async publishHandover(id: string): Promise<HandoverRecord> {
    const trimmedId = (id || '').trim();
    if (!trimmedId) {
      const err: ApiError = {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Handover ID is required.',
      };
      throw err;
    }

    const response = await apiClient.post<any>(
      API_CONFIG.endpoints.president.publishHandover(trimmedId),
      {}
    );
    return normalizeHandoverRecord(response?.data ?? response);
  }
}

export const handoverService = new HandoverService();
