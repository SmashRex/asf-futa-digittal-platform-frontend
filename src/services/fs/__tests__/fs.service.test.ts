/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fsService } from '../fs.service';
import { apiClient } from '../../api/client';
import { APP_CONFIG } from '../../../config/app.config';
import { ApiError } from '../../api/types';

describe('Foundational School (FS) Service', () => {
  const originalUseMock = APP_CONFIG.features.useMockServices;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    APP_CONFIG.features.useMockServices = originalUseMock;
  });

  describe('Student FS Application (POST /api/fs/admissions)', () => {
    it('submits a successful FS application with testimony in real API mode', async () => {
      APP_CONFIG.features.useMockServices = false;

      const mockResponse = {
        success: true,
        data: {
          id: 'adm-uuid-1234',
          userId: 'user-uuid-5678',
          testimony: 'I surrendered my life to Christ in 2024.',
          status: 'Pending',
          assignedClassId: null,
          reviewedBy: null,
          reviewedAt: null,
          reviewNotes: null,
          createdAt: '2026-03-01T10:00:00.000Z',
          updatedAt: '2026-03-01T10:00:00.000Z',
        },
        message: 'Application submitted',
      };

      const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValue(mockResponse as any);

      const result = await fsService.applyForAdmission({
        testimony: 'I surrendered my life to Christ in 2024.',
      });

      expect(postSpy).toHaveBeenCalledWith('/api/fs/admissions', {
        testimony: 'I surrendered my life to Christ in 2024.',
      });
      expect(result.id).toBe('adm-uuid-1234');
      expect(result.status).toBe('Pending');
      expect(result.testimony).toBe('I surrendered my life to Christ in 2024.');
    });

    it('submits application without testimony and omits empty/whitespace field in payload', async () => {
      APP_CONFIG.features.useMockServices = false;

      const mockResponse = {
        success: true,
        data: {
          id: 'adm-uuid-no-testimony',
          userId: 'user-uuid-999',
          testimony: null,
          status: 'Pending',
          assignedClassId: null,
          reviewedBy: null,
          reviewedAt: null,
          reviewNotes: null,
          createdAt: '2026-03-01T10:00:00.000Z',
          updatedAt: '2026-03-01T10:00:00.000Z',
        },
        message: 'Application submitted',
      };

      const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValue(mockResponse as any);

      // Omitting testimony
      const result1 = await fsService.applyForAdmission({});
      expect(postSpy).toHaveBeenCalledWith('/api/fs/admissions', {});
      expect(result1.status).toBe('Pending');

      // Whitespace testimony
      await fsService.applyForAdmission({ testimony: '   ' });
      expect(postSpy).toHaveBeenLastCalledWith('/api/fs/admissions', {});
    });

    it('handles ALREADY_IN_SUBGROUP (403) error and propagates error code', async () => {
      APP_CONFIG.features.useMockServices = false;

      const subgroupError: ApiError = {
        message: 'Member already assigned to subgroup',
        statusCode: 403,
        code: 'ALREADY_IN_SUBGROUP',
      };

      vi.spyOn(apiClient, 'post').mockRejectedValue(subgroupError);

      try {
        await fsService.applyForAdmission({ testimony: 'Test' });
        expect.unreachable('Should have thrown error');
      } catch (err: any) {
        expect(err.code).toBe('ALREADY_IN_SUBGROUP');
        expect(err.statusCode).toBe(403);
      }
    });

    it('handles ADMISSION_ALREADY_PENDING (409) error and propagates error code', async () => {
      APP_CONFIG.features.useMockServices = false;

      const pendingError: ApiError = {
        message: 'Admission application already pending',
        statusCode: 409,
        code: 'ADMISSION_ALREADY_PENDING',
      };

      vi.spyOn(apiClient, 'post').mockRejectedValue(pendingError);

      try {
        await fsService.applyForAdmission({ testimony: 'Second attempt' });
        expect.unreachable('Should have thrown error');
      } catch (err: any) {
        expect(err.code).toBe('ADMISSION_ALREADY_PENDING');
        expect(err.statusCode).toBe(409);
      }
    });

    it('handles VALIDATION_ERROR (400) error and propagates error code', async () => {
      APP_CONFIG.features.useMockServices = false;

      const validationError: ApiError = {
        message: 'Invalid testimony format or length',
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      };

      vi.spyOn(apiClient, 'post').mockRejectedValue(validationError);

      try {
        await fsService.applyForAdmission({ testimony: 'x'.repeat(2500) });
        expect.unreachable('Should have thrown error');
      } catch (err: any) {
        expect(err.code).toBe('VALIDATION_ERROR');
        expect(err.statusCode).toBe(400);
      }
    });
  });

  describe('Coordinator FS Application List (GET /api/fs/admissions/admin)', () => {
    it('retrieves all FS admission applications in real API mode', async () => {
      APP_CONFIG.features.useMockServices = false;

      const mockAdminAdmissions = [
        {
          id: 'adm-01',
          userId: 'usr-01',
          applicantName: 'Gbenga Daniel Alabi',
          applicantEmail: 'gbenga.alabi@futa.edu.ng',
          applicantLevel: '100 Level',
          testimony: 'Born again believer.',
          status: 'Pending',
          assignedClassId: null,
          reviewedBy: null,
          reviewedAt: null,
          reviewNotes: null,
          createdAt: '2026-01-10T08:00:00.000Z',
        },
      ];

      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: mockAdminAdmissions,
        message: 'Operation completed successfully',
      } as any);

      const result = await fsService.getAdminAdmissions();

      expect(getSpy).toHaveBeenCalledWith('/api/fs/admissions/admin');
      expect(result).toHaveLength(1);
      expect(result[0].applicantName).toBe('Gbenga Daniel Alabi');
      expect(result[0].applicantEmail).toBe('gbenga.alabi@futa.edu.ng');
      expect(result[0].applicantLevel).toBe('100 Level');
      expect(result[0].status).toBe('Pending');
    });

    it('passes status query filter when status is specified (Pending/Approved/Rejected)', async () => {
      APP_CONFIG.features.useMockServices = false;

      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: [],
        message: 'Operation completed successfully',
      } as any);

      await fsService.getAdminAdmissions('Pending');
      expect(getSpy).toHaveBeenCalledWith('/api/fs/admissions/admin?status=Pending');

      await fsService.getAdminAdmissions('Approved');
      expect(getSpy).toHaveBeenCalledWith('/api/fs/admissions/admin?status=Approved');

      await fsService.getAdminAdmissions('Rejected');
      expect(getSpy).toHaveBeenCalledWith('/api/fs/admissions/admin?status=Rejected');

      // 'ALL' should not append a status query param
      await fsService.getAdminAdmissions('ALL');
      expect(getSpy).toHaveBeenCalledWith('/api/fs/admissions/admin');
    });

    it('propagates 403 PERMISSION_DENIED without falling back to mock data', async () => {
      APP_CONFIG.features.useMockServices = false;

      const permissionError: ApiError = {
        message: 'User lacks permission: fs.admissions.review',
        statusCode: 403,
        code: 'PERMISSION_DENIED',
      };

      vi.spyOn(apiClient, 'get').mockRejectedValue(permissionError);

      try {
        await fsService.getAdminAdmissions();
        expect.unreachable('Should have thrown error');
      } catch (err: any) {
        expect(err.code).toBe('PERMISSION_DENIED');
        expect(err.statusCode).toBe(403);
      }
    });

    it('strictly enforces no silent fallback to mock data when useMockServices is false', async () => {
      APP_CONFIG.features.useMockServices = false;

      const networkError = new Error('Network error');
      vi.spyOn(apiClient, 'get').mockRejectedValue(networkError);

      await expect(fsService.getAdminAdmissions()).rejects.toThrow('Network error');
    });
  });

  describe('Mock Mode Compatibility', () => {
    it('returns structured mock admission for apply in mock mode', async () => {
      APP_CONFIG.features.useMockServices = true;

      const result = await fsService.applyForAdmission({
        testimony: 'Offline mock testimony',
      });

      expect(result.id).toBeDefined();
      expect(result.status).toBe('Pending');
      expect(result.testimony).toBe('Offline mock testimony');
    });

    it('returns filtered mock admissions in mock mode', async () => {
      APP_CONFIG.features.useMockServices = true;

      const all = await fsService.getAdminAdmissions('ALL');
      expect(all.length).toBeGreaterThan(0);

      const pending = await fsService.getAdminAdmissions('Pending');
      expect(pending.every(a => a.status === 'Pending')).toBe(true);
    });
  });
});
