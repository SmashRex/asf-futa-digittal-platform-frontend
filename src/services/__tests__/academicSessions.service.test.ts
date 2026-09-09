/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { academicSessionsService } from '../academicSessions/academicSessions.service';
import { apiClient } from '../api/client';
import { APP_CONFIG } from '../../config/app.config';

describe('Academic Sessions Service', () => {
  const originalUseMock = APP_CONFIG.features.useMockServices;

  beforeEach(() => {
    vi.restoreAllMocks();
    APP_CONFIG.features.useMockServices = false;
  });

  afterEach(() => {
    APP_CONFIG.features.useMockServices = originalUseMock;
  });

  it('should fetch all academic sessions via GET /academic-sessions', async () => {
    const mockSessions = [
      { id: '2025/2026', name: '2025/2026 Session', status: 'active' },
      { id: '2024/2025', name: '2024/2025 Session', status: 'archived' }
    ];

    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      success: true,
      data: mockSessions,
      message: 'Sessions retrieved'
    });

    const sessions = await academicSessionsService.getAcademicSessions();
    expect(apiClient.get).toHaveBeenCalledWith('/academic-sessions');
    expect(sessions).toEqual(mockSessions);
  });

  it('should create an academic session via POST /academic-sessions', async () => {
    const payload = {
      id: '2027/2028',
      name: '2027/2028 Academic Session',
      startDate: '2027-10-01',
      endDate: '2028-07-31'
    };

    const mockResponse = {
      ...payload,
      status: 'upcoming' as const
    };

    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      success: true,
      data: mockResponse,
      message: 'Session created'
    });

    const result = await academicSessionsService.createAcademicSession(payload);
    expect(apiClient.post).toHaveBeenCalledWith('/academic-sessions', payload);
    expect(result.id).toBe('2027/2028');
    expect(result.status).toBe('upcoming');
  });

  it('should URL-encode session ID when calling activate-and-progress', async () => {
    const sessionId = '2027/2028';
    const encodedId = encodeURIComponent(sessionId);

    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      success: true,
      data: {
        success: true,
        session: { id: '2027/2028', status: 'active' },
        message: 'Session 2027/2028 activated and students progressed.'
      },
      message: 'Session activated'
    });

    const result = await academicSessionsService.activateAndProgress(sessionId);
    expect(apiClient.post).toHaveBeenCalledWith(`/academic-sessions/${encodedId}/activate-and-progress`, {});
    expect(result.success).toBe(true);
    expect(result.session?.status).toBe('active');
  });
});
