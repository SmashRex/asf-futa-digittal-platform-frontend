/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from '../api/client';
import { API_CONFIG } from '../../config/api.config';
import { ApiError } from '../api/types';

export type GovernanceRequestType =
  | 'office_assignment'
  | 'dashboard_grant'
  | 'capability_grant';

export type GovernanceRequestStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'pending'
  | 'approved'
  | 'rejected'
  | string;

export type CreateGovernanceRequestPayload =
  | {
      requestType: 'office_assignment';
      payload: {
        userId: string;
        officeId: string;
      };
    }
  | {
      requestType: 'dashboard_grant';
      payload: {
        userId: string;
        dashboardId: string;
      };
    }
  | {
      requestType: 'capability_grant';
      payload: {
        userId: string;
        capabilityId: string;
      };
    };

export interface GovernanceActorInfo {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  academicLevel?: string;
}

export interface GovernanceRequestItem {
  id: string;
  requestType: GovernanceRequestType | string;
  status: GovernanceRequestStatus;
  payload?: Record<string, any> | null;
  requesterId?: string | null;
  requesterName?: string | null;
  requesterEmail?: string | null;
  requester?: GovernanceActorInfo | string | null;
  requestedBy?: GovernanceActorInfo | string | null;
  targetUserId?: string | null;
  targetUserName?: string | null;
  targetUserEmail?: string | null;
  targetUser?: GovernanceActorInfo | null;
  target?: GovernanceActorInfo | string | null;
  reason?: string | null;
  rejectionReason?: string | null;
  reviewedBy?: GovernanceActorInfo | string | null;
  approvedBy?: GovernanceActorInfo | string | null;
  rejectedBy?: GovernanceActorInfo | string | null;
  reviewedAt?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: any;
}

function normalizeGovernanceRequest(raw: any): GovernanceRequestItem {
  if (!raw || typeof raw !== 'object') {
    return {
      id: '',
      requestType: '',
      status: 'Pending',
      payload: null,
    };
  }

  return {
    ...raw,
    id: String(raw.id ?? ''),
    requestType: String(raw.requestType ?? raw.type ?? ''),
    status: String(raw.status ?? 'Pending'),
    payload: raw.payload !== undefined ? raw.payload : (raw.details !== undefined ? raw.details : null),
  };
}

export function formatGovernanceRequestTypeLabel(requestType: string): string {
  switch (requestType) {
    case 'office_assignment':
      return 'Office Assignment';
    case 'dashboard_grant':
      return 'Dashboard Access Grant';
    case 'capability_grant':
      return 'Capability Grant';
    default:
      return requestType || 'Governance Request';
  }
}

export function isGovernanceRequestPending(status: string | undefined | null): boolean {
  return String(status || '').trim().toLowerCase() === 'pending';
}

export function isGovernanceRequestApproved(status: string | undefined | null): boolean {
  return String(status || '').trim().toLowerCase() === 'approved';
}

export function isGovernanceRequestRejected(status: string | undefined | null): boolean {
  return String(status || '').trim().toLowerCase() === 'rejected';
}

export class GovernanceService {
  /**
   * Create a governance request:
   * POST /api/governance/requests
   */
  async createRequest(input: CreateGovernanceRequestPayload): Promise<GovernanceRequestItem> {
    const response = await apiClient.post<any>(API_CONFIG.endpoints.governance.requests, input);
    const data = response?.data?.data ?? response?.data ?? response;
    return normalizeGovernanceRequest(data);
  }

  /**
   * Retrieve governance requests for Presidential review:
   * GET /api/president/governance/requests
   */
  async getPresidentRequests(): Promise<GovernanceRequestItem[]> {
    const response = await apiClient.get<any>(API_CONFIG.endpoints.president.governanceRequests);
    const payload = response?.data;

    let rawList: any[] = [];
    if (Array.isArray(payload)) {
      rawList = payload;
    } else if (payload && typeof payload === 'object') {
      if (Array.isArray(payload.requests)) rawList = payload.requests;
      else if (Array.isArray(payload.data)) rawList = payload.data;
      else if (Array.isArray(payload.items)) rawList = payload.items;
    }

    return rawList.map(normalizeGovernanceRequest);
  }

  /**
   * Approve a pending governance request (President only):
   * POST /api/president/governance/requests/:id/approve
   */
  async approveRequest(id: string): Promise<GovernanceRequestItem> {
    const trimmedId = (id || '').trim();
    if (!trimmedId) {
      const err: ApiError = {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Governance request ID is required.',
      };
      throw err;
    }

    const response = await apiClient.post<any>(
      API_CONFIG.endpoints.president.approveGovernanceRequest(trimmedId),
      {}
    );
    const data = response?.data?.data ?? response?.data ?? response;
    return normalizeGovernanceRequest(data);
  }

  /**
   * Reject a pending governance request (President only):
   * POST /api/president/governance/requests/:id/reject
   * Requires an explicit rejection reason.
   */
  async rejectRequest(id: string, reason: string): Promise<GovernanceRequestItem> {
    const trimmedId = (id || '').trim();
    if (!trimmedId) {
      const err: ApiError = {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Governance request ID is required.',
      };
      throw err;
    }

    const trimmedReason = (reason || '').trim();
    if (!trimmedReason) {
      const err: ApiError = {
        statusCode: 422,
        code: 'VALIDATION_ERROR',
        message: 'A rejection reason is required.',
      };
      throw err;
    }

    const response = await apiClient.post<any>(
      API_CONFIG.endpoints.president.rejectGovernanceRequest(trimmedId),
      { reason: trimmedReason }
    );
    const data = response?.data?.data ?? response?.data ?? response;
    return normalizeGovernanceRequest(data);
  }
}

export const governanceService = new GovernanceService();
