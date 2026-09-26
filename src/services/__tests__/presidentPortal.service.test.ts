/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../api/client';
import {
  presidentService,
  CANONICAL_EXECUTIVE_OFFICES,
  CANONICAL_SUBGROUPS,
  formatExecutiveOffices,
  normalizeDistribution,
} from '../president/president.service';
import {
  governanceService,
  formatGovernanceRequestTypeLabel,
  isGovernanceRequestPending,
  isGovernanceRequestApproved,
  isGovernanceRequestRejected,
} from '../governance/governance.service';
import {
  handoverService,
  isHandoverValidated,
  isHandoverApproved,
  isHandoverPublished,
  isHandoverInvalid,
} from '../handover/handover.service';
import { PRESIDENT_NAV_ITEMS } from '../../components/admin/AdminSidebar';
import { normalizeAdminRole, resolveUserAdminRoles } from '../../types/adminTypes';
import { authService } from '../auth/auth.service';

describe('President Portal Services & Role Boundaries', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('presidentService.getRoster (GET /api/president/roster)', () => {
    it('fetches the read-only fellowship roster with supported filter params and preserves backend response fields', async () => {
      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        status: 'success',
        data: [
          {
            id: 'mem-101',
            name: 'Adeola Ogunleye',
            department: 'Computer Science',
            departmentId: 'dept-csc',
            academicLevel: '500L',
            membershipStatus: 'Active',
            subgroup: 'Bible Study',
            avatarUrl: 'https://example.com/avatar.jpg',
            executiveOffices: ['President', { id: 'off-bs', name: 'Bible Study Coordinator' }],
          },
        ],
        meta: {
          total: 1,
          page: 2,
          limit: 20,
        },
      } as any);

      const response = await presidentService.getRoster({
        page: 2,
        limit: 20,
        search: 'Adeola',
        academicLevel: '500L',
        subgroup: 'Bible Study',
        office: 'President',
        departmentId: 'dept-csc',
      });

      expect(getSpy).toHaveBeenCalledWith(
        '/president/roster?page=2&limit=20&search=Adeola&academicLevel=500L&subgroup=Bible+Study&office=President&departmentId=dept-csc'
      );

      expect(response.total).toBe(1);
      expect(response.page).toBe(2);
      expect(response.limit).toBe(20);
      expect(response.data).toHaveLength(1);
      expect(response.data[0]).toEqual({
        id: 'mem-101',
        name: 'Adeola Ogunleye',
        department: 'Computer Science',
        departmentId: 'dept-csc',
        academicLevel: '500L',
        membershipStatus: 'Active',
        subgroup: 'Bible Study',
        avatarUrl: 'https://example.com/avatar.jpg',
        executiveOffices: ['President', { id: 'off-bs', name: 'Bible Study Coordinator' }],
      });

      expect(formatExecutiveOffices(response.data[0].executiveOffices)).toEqual([
        'President',
        'Bible Study Coordinator',
      ]);
    });

    it('propagates 403 Forbidden errors without downgrading to mock data', async () => {
      vi.spyOn(apiClient, 'get').mockRejectedValueOnce({
        statusCode: 403,
        code: 'FORBIDDEN',
        message: 'President authorization required',
      });

      await expect(presidentService.getRoster()).rejects.toMatchObject({
        statusCode: 403,
        code: 'FORBIDDEN',
      });
    });
  });

  describe('presidentService.getAnalytics (GET /api/president/analytics)', () => {
    it('calls /president/analytics with optional academicSession, subgroup, and office filters', async () => {
      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        status: 'success',
        data: {
          totalMembers: 145,
          eventCount: 12,
          subgroupDistribution: {
            'Bible Study': 50,
            Prayer: 45,
            Choir: 50,
          },
          academicLevelDistribution: {
            '100L': 30,
            '200L': 25,
            '300L': 30,
            '400L': 20,
            '500L': 25,
            Alumni: 15,
          },
          officeDistribution: {
            President: 1,
            'Vice President': 1,
          },
        },
      } as any);

      const analytics = await presidentService.getAnalytics({
        academicSession: '2025/2026',
        subgroup: 'Bible Study',
        office: 'President',
      });

      expect(getSpy).toHaveBeenCalledWith(
        '/president/analytics?academicSession=2025%2F2026&subgroup=Bible+Study&office=President'
      );

      expect(analytics.totalMembers).toBe(145);
      expect(analytics.eventCount).toBe(12);
      expect(normalizeDistribution(analytics.subgroupDistribution)).toEqual([
        { label: 'Bible Study', count: 50 },
        { label: 'Prayer', count: 45 },
        { label: 'Choir', count: 50 },
      ]);
      expect(normalizeDistribution(analytics.academicLevelDistribution)).toContainEqual({
        label: 'Alumni',
        count: 15,
      });
      expect(normalizeDistribution(analytics.officeDistribution)).toContainEqual({
        label: 'President',
        count: 1,
      });
    });
  });

  describe('governanceService (Governance Request & Review APIs)', () => {
    it('creates a governance request via POST /api/governance/requests', async () => {
      const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        status: 'success',
        data: {
          id: 'gov-req-1',
          requestType: 'office_assignment',
          status: 'Pending',
          payload: {
            userId: 'mem-200',
            officeId: 'General Secretary',
          },
          createdAt: '2026-09-26T10:00:00Z',
        },
      } as any);

      const created = await governanceService.createRequest({
        requestType: 'office_assignment',
        payload: {
          userId: 'mem-200',
          officeId: 'General Secretary',
        },
      });

      expect(postSpy).toHaveBeenCalledWith('/governance/requests', {
        requestType: 'office_assignment',
        payload: {
          userId: 'mem-200',
          officeId: 'General Secretary',
        },
      });
      expect(created.id).toBe('gov-req-1');
      expect(created.requestType).toBe('office_assignment');
      expect(isGovernanceRequestPending(created.status)).toBe(true);
      expect(formatGovernanceRequestTypeLabel(created.requestType)).toBe('Office Assignment');
    });

    it('fetches President governance requests via GET /api/president/governance/requests', async () => {
      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        status: 'success',
        data: [
          {
            id: 'gov-99',
            requestType: 'dashboard_grant',
            status: 'Pending',
            requesterName: 'Technical Head',
            targetUserName: 'General Secretary',
            createdAt: '2026-09-26T09:00:00Z',
          },
        ],
      } as any);

      const list = await governanceService.getPresidentRequests();

      expect(getSpy).toHaveBeenCalledWith('/president/governance/requests');
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe('gov-99');
      expect(list[0].requestType).toBe('dashboard_grant');
    });

    it('approves and rejects governance requests with URL-encoded IDs', async () => {
      const postSpy = vi
        .spyOn(apiClient, 'post')
        .mockResolvedValueOnce({
          status: 'success',
          data: {
            id: 'req/special#1',
            requestType: 'office_assignment',
            status: 'Approved',
            reviewedBy: 'President',
            reviewedAt: '2026-09-26T11:00:00Z',
          },
        } as any)
        .mockResolvedValueOnce({
          status: 'success',
          data: {
            id: 'req/special#2',
            requestType: 'capability_grant',
            status: 'Rejected',
            rejectionReason: 'Insufficient justification',
            reviewedBy: 'President',
            reviewedAt: '2026-09-26T11:05:00Z',
          },
        } as any);

      const approved = await governanceService.approveRequest('req/special#1');
      expect(postSpy).toHaveBeenCalledWith(
        '/president/governance/requests/req%2Fspecial%231/approve',
        {}
      );
      expect(isGovernanceRequestApproved(approved.status)).toBe(true);

      const rejected = await governanceService.rejectRequest(
        'req/special#2',
        'Insufficient justification'
      );
      expect(postSpy).toHaveBeenCalledWith(
        '/president/governance/requests/req%2Fspecial%232/reject',
        { reason: 'Insufficient justification' }
      );
      expect(isGovernanceRequestRejected(rejected.status)).toBe(true);
    });

    it('requires a non-empty rejection reason before calling the backend', async () => {
      await expect(governanceService.rejectRequest('req-1', '   ')).rejects.toMatchObject({
        statusCode: 422,
        code: 'VALIDATION_ERROR',
      });
    });
  });

  describe('handoverService (Executive Handover Lifecycle APIs)', () => {
    it('uploads and validates a handover CSV via POST /api/president/handovers without modifying raw CSV', async () => {
      const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        status: 'success',
        data: {
          id: 'ho-2026-01',
          status: 'Validated',
          assignments: [
            {
              memberId: 'mem-101',
              officeId: 'President',
              memberName: 'John Doe',
              officeName: 'President',
              department: 'Computer Science',
            },
          ],
          validationErrors: [],
        },
      } as any);

      const csvContent = 'memberId,officeId\nmem-101,President';
      const result = await handoverService.uploadHandover(csvContent);

      expect(postSpy).toHaveBeenCalledWith('/president/handovers', {
        csv: csvContent,
      });
      expect(result.id).toBe('ho-2026-01');
      expect(isHandoverValidated(result.status)).toBe(true);
      expect(result.assignments).toHaveLength(1);
      expect(result.assignments[0].officeId).toBe('President');
      expect(result.validationErrors).toHaveLength(0);
    });

    it('surfaces backend row validation errors clearly when handover CSV is invalid', async () => {
      vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        status: 'success',
        data: {
          id: 'ho-invalid-1',
          status: 'Invalid',
          assignments: [],
          validationErrors: [
            {
              row: 2,
              memberId: 'mem-unknown',
              officeId: 'Unknown Office',
              message: 'Unrecognized executive office',
            },
          ],
        },
      } as any);

      const result = await handoverService.uploadHandover(
        'memberId,officeId\nmem-unknown,Unknown Office'
      );

      expect(isHandoverInvalid(result.status)).toBe(true);
      expect(result.validationErrors).toHaveLength(1);
      expect(result.validationErrors[0].message).toContain('Unrecognized executive office');
    });

    it('inspects, approves, and publishes a handover with URL-encoded IDs', async () => {
      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        status: 'success',
        data: {
          id: 'ho/100',
          status: 'Validated',
          assignments: [
            {
              memberId: 'mem-101',
              officeId: 'President',
            },
          ],
          validationErrors: [],
        },
      } as any);

      const postSpy = vi
        .spyOn(apiClient, 'post')
        .mockResolvedValueOnce({
          status: 'success',
          data: {
            id: 'ho/100',
            status: 'Approved',
            approvedAt: '2026-09-26T12:00:00Z',
            assignments: [],
            validationErrors: [],
          },
        } as any)
        .mockResolvedValueOnce({
          status: 'success',
          data: {
            id: 'ho/100',
            status: 'Published',
            publishedAt: '2026-09-26T12:05:00Z',
            assignments: [],
            validationErrors: [],
          },
        } as any);

      const inspected = await handoverService.getHandoverById('ho/100');
      expect(getSpy).toHaveBeenCalledWith('/president/handovers/ho%2F100');
      expect(isHandoverValidated(inspected.status)).toBe(true);

      const approved = await handoverService.approveHandover('ho/100');
      expect(postSpy).toHaveBeenCalledWith('/president/handovers/ho%2F100/approve', {});
      expect(isHandoverApproved(approved.status)).toBe(true);

      const published = await handoverService.publishHandover('ho/100');
      expect(postSpy).toHaveBeenCalledWith('/president/handovers/ho%2F100/publish', {});
      expect(isHandoverPublished(published.status)).toBe(true);
    });
  });

  describe('President Role Boundaries & Canonical Registries', () => {
    it('maintains the 23 canonical executive offices and 9 canonical subgroups', () => {
      expect(CANONICAL_EXECUTIVE_OFFICES).toHaveLength(23);
      expect(CANONICAL_EXECUTIVE_OFFICES).toContain('President');
      expect(CANONICAL_EXECUTIVE_OFFICES).toContain('Vice President');
      expect(CANONICAL_EXECUTIVE_OFFICES).toContain('General Secretary');

      expect(CANONICAL_SUBGROUPS).toHaveLength(9);
      expect(CANONICAL_SUBGROUPS).toContain('Bible Study');
      expect(CANONICAL_SUBGROUPS).toContain('Publicity');
    });

    it('restricts President navigation to the 6 oversight routes', () => {
      const presidentRoutes = PRESIDENT_NAV_ITEMS.map((item) => item.path);
      expect(presidentRoutes).toEqual([
        '/admin/dashboard',
        '/admin/members',
        '/admin/programs',
        '/admin/governance',
        '/admin/handover',
        '/admin/analytics',
      ]);
    });

    it('normalizes canonical backend role and office identifiers without conflating Technical Head with President', () => {
      expect(normalizeAdminRole('President')).toBe('President / Executive');
      expect(normalizeAdminRole('president_dashboard')).toBe('President / Executive');
      expect(normalizeAdminRole('Vice President')).toBe('VP / FS Coordinator');
      expect(normalizeAdminRole('Public Relation Officer (PRO)/Publicity Coordinator')).toBe(
        'Publicity Coordinator'
      );
      expect(normalizeAdminRole('Technical Head')).toBe('Technical Administrator');
      expect(normalizeAdminRole('technical_head')).toBe('Technical Administrator');
      expect(normalizeAdminRole('Member')).toBeNull();

      const presidentSession = authService.normalizeUser({
        id: 'usr-pres-1',
        name: 'Bro. President',
        email: 'president@asf-futa.org',
        department: 'Computer Science',
        departmentId: 'dept-csc',
        academicLevel: '500L',
        roles: ['President', 'Member'],
        executiveOffices: [{ id: 'off-1', name: 'President' }],
        dashboards: ['president_dashboard'],
      });

      expect(presidentSession.roles).toContain('President / Executive');
      expect(presidentSession.role).toBe('President / Executive');
      expect(resolveUserAdminRoles(presidentSession)).toEqual(['President / Executive']);
    });
  });
});
