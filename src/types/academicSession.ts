/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AcademicSession {
  id: string; // e.g. "2024/2025" or "2027/2028"
  name?: string;
  isActive?: boolean;
  status?: 'active' | 'archived' | 'upcoming' | string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface CreateAcademicSessionPayload {
  id: string; // e.g. "2027/2028"
  name?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

export interface ActivateAndProgressResult {
  success?: boolean;
  session?: AcademicSession;
  progressedCount?: number;
  message?: string;
  [key: string]: any;
}
