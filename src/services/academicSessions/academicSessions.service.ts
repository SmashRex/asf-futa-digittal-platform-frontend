/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from '../api/client';
import { APP_CONFIG } from '../../config/app.config';
import { 
  AcademicSession, 
  CreateAcademicSessionPayload, 
  ActivateAndProgressResult 
} from '../../types/academicSession';

export class AcademicSessionsService {
  /**
   * Fetch all academic sessions: GET /api/academic-sessions
   */
  async getAcademicSessions(): Promise<AcademicSession[]> {
    if (!APP_CONFIG.features.useMockServices) {
      const response = await apiClient.get<AcademicSession[]>('/academic-sessions');
      return response.data || [];
    }
    return this.getMockSessions();
  }

  /**
   * Create a new academic session: POST /api/academic-sessions
   */
  async createAcademicSession(payload: CreateAcademicSessionPayload): Promise<AcademicSession> {
    if (!payload.id || !payload.id.trim()) {
      const err: any = new Error('Session ID is required (e.g. 2027/2028)');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    if (!APP_CONFIG.features.useMockServices) {
      const response = await apiClient.post<AcademicSession>('/academic-sessions', payload);
      return response.data;
    }

    const newSession: AcademicSession = {
      id: payload.id.trim(),
      name: payload.name?.trim() || `${payload.id.trim()} Academic Session`,
      isActive: false,
      status: 'upcoming',
      startDate: payload.startDate,
      endDate: payload.endDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newSession;
  }

  /**
   * Activate academic session and trigger student academic progression:
   * POST /api/academic-sessions/:id/activate-and-progress
   * 
   * CRITICAL REQUIREMENT: Academic session IDs contain slashes (e.g. "2027/2028").
   * The sessionId MUST be safely URL encoded via encodeURIComponent.
   */
  async activateAndProgress(sessionId: string): Promise<ActivateAndProgressResult> {
    if (!sessionId || !sessionId.trim()) {
      const err: any = new Error('Session ID is required to execute progression');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    const encodedSessionId = encodeURIComponent(sessionId.trim());

    if (!APP_CONFIG.features.useMockServices) {
      const response = await apiClient.post<ActivateAndProgressResult>(
        `/academic-sessions/${encodedSessionId}/activate-and-progress`,
        {}
      );
      return response.data;
    }

    // Mock response
    return {
      success: true,
      session: {
        id: sessionId.trim(),
        name: `${sessionId.trim()} Academic Session`,
        isActive: true,
        status: 'active',
      },
      progressedCount: 142,
      message: `Academic session ${sessionId.trim()} activated and student progression completed successfully.`,
    };
  }

  private getMockSessions(): AcademicSession[] {
    return [
      {
        id: '2025/2026',
        name: '2025/2026 Academic Session',
        isActive: true,
        status: 'active',
        startDate: '2025-10-01',
        endDate: '2026-07-31',
        createdAt: '2025-09-01T00:00:00Z',
      },
      {
        id: '2024/2025',
        name: '2024/2025 Academic Session',
        isActive: false,
        status: 'archived',
        startDate: '2024-10-01',
        endDate: '2025-07-31',
        createdAt: '2024-09-01T00:00:00Z',
      },
      {
        id: '2026/2027',
        name: '2026/2027 Academic Session',
        isActive: false,
        status: 'upcoming',
        startDate: '2026-10-01',
        endDate: '2027-07-31',
        createdAt: '2026-01-15T00:00:00Z',
      },
    ];
  }
}

export const academicSessionsService = new AcademicSessionsService();
