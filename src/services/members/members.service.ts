/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from '../api/client';
import { APP_CONFIG } from '../../config/app.config';
import { AdminMember } from '../../types/adminTypes';
import { UserRole } from '../../types';

export interface GetMembersParams {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  role?: string;
}

export interface MembersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetMembersResult {
  data: AdminMember[];
  pagination: MembersPagination;
}

export interface UpdateRolePayload {
  action: 'assign' | 'remove';
  role: string;
}

export interface UpdateStatusPayload {
  status: 'Active' | 'Inactive';
}

export interface OverrideAcademicLevelPayload {
  newLevel: string;
  overrideReason: string;
}

export class MembersService {
  /**
   * Fetch members directory with pagination and privacy-scoped fields:
   * GET /api/members?page=1&limit=20
   */
  async getMembers(params?: GetMembersParams): Promise<GetMembersResult> {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const searchParams = new URLSearchParams();
    searchParams.set('page', String(page));
    searchParams.set('limit', String(limit));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.level && params.level !== 'All Academic Levels') searchParams.set('academicLevel', params.level);
    if (params?.role && params.role !== 'All Roles') searchParams.set('role', params.role);

    const queryString = searchParams.toString();
    const endpoint = `/members${queryString ? `?${queryString}` : ''}`;

    if (!APP_CONFIG.features.useMockServices) {
      const response = await apiClient.get<any>(endpoint);
      const raw = response.data;
      if (Array.isArray(raw)) {
        return {
          data: raw.map(m => this.normalizeMember(m)),
          pagination: {
            page,
            limit,
            total: raw.length,
            totalPages: Math.ceil(raw.length / limit) || 1,
          },
        };
      }
      const memberList: any[] = raw?.data || raw?.members || [];
      const pagination: MembersPagination = raw?.pagination || {
        page,
        limit,
        total: memberList.length,
        totalPages: Math.ceil(memberList.length / limit) || 1,
      };
      return {
        data: memberList.map(m => this.normalizeMember(m)),
        pagination,
      };
    }

    // Mock fallback
    return this.getMockMembers(params);
  }

  /**
   * Fetch individual member details: GET /api/members/:id
   */
  async getMemberById(id: string): Promise<AdminMember> {
    if (!APP_CONFIG.features.useMockServices) {
      const response = await apiClient.get<any>(`/members/${encodeURIComponent(id)}`);
      const raw = response.data?.data || response.data;
      return this.normalizeMember(raw);
    }

    const { data } = await this.getMockMembers();
    const found = data.find(m => m.id === id);
    if (!found) {
      const error: any = new Error(`Member with ID ${id} not found`);
      error.code = 'NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }
    return found;
  }

  /**
   * Override member academic level:
   * PATCH /api/members/:id/academic-level
   * Allowed roles: Technical Administrator, General Secretary, President / Executive
   * Payload: { newLevel, overrideReason }
   * Minimum overrideReason length: 5 characters
   */
  async overrideAcademicLevel(id: string, newLevel: string, overrideReason: string): Promise<AdminMember> {
    const trimmedReason = (overrideReason || '').trim();
    if (trimmedReason.length < 5) {
      const err: any = new Error('Please provide a reason of at least 5 characters.');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    const payload: OverrideAcademicLevelPayload = { 
      newLevel: newLevel.trim(),
      overrideReason: trimmedReason,
    };

    if (!APP_CONFIG.features.useMockServices) {
      const response = await apiClient.patch<any>(`/members/${encodeURIComponent(id)}/academic-level`, payload);
      const raw = response.data?.data || response.data;
      return this.normalizeMember(raw);
    }

    const member = await this.getMemberById(id);
    const updated: AdminMember = {
      ...member,
      level: newLevel.trim(),
    };
    return updated;
  }

  /**
   * Update member role with assign / remove actions:
   * PATCH /api/members/:id/role
   * Body: { action: 'assign' | 'remove', roleId: string }
   */
  async updateRole(id: string, action: 'assign' | 'remove', role: string): Promise<AdminMember> {
    const payload = { action, roleId: role, role };

    if (!APP_CONFIG.features.useMockServices) {
      const response = await apiClient.patch<any>(`/members/${encodeURIComponent(id)}/role`, payload);
      const raw = response.data?.data || response.data;
      return this.normalizeMember(raw);
    }

    const member = await this.getMemberById(id);
    const updated: AdminMember = {
      ...member,
      role: (action === 'assign' ? role : 'Member') as UserRole,
      office: action === 'assign' ? role : undefined,
    };
    return updated;
  }

  /**
   * Update account status (Active | Inactive):
   * PATCH /api/members/:id/status
   * Body: { accountStatus: 'Active' | 'Inactive', reason?: string }
   * Note: Backend rejects self-status-modification with 400 / CANNOT_SELF_MODIFY
   */
  async updateStatus(id: string, status: 'Active' | 'Inactive', reason?: string): Promise<AdminMember> {
    const payload = { accountStatus: status, status, ...(reason ? { reason } : {}) };

    if (!APP_CONFIG.features.useMockServices) {
      try {
        const response = await apiClient.patch<any>(`/members/${encodeURIComponent(id)}/status`, payload);
        const raw = response.data?.data || response.data;
        return this.normalizeMember(raw);
      } catch (err: any) {
        if (err.code === 'CANNOT_SELF_MODIFY' || err.message?.includes('CANNOT_SELF_MODIFY')) {
          const selfErr: any = new Error('You cannot modify your own account status.');
          selfErr.code = 'CANNOT_SELF_MODIFY';
          selfErr.statusCode = 400;
          throw selfErr;
        }
        throw err;
      }
    }

    const member = await this.getMemberById(id);
    const updated: AdminMember = {
      ...member,
      status: status === 'Active' ? 'Active' : 'Suspended',
    };
    return updated;
  }

  /**
   * Update member subgroup:
   * PATCH /api/members/:id/subgroup
   * Allowed roles: Publicity Coordinator, President / Executive, Technical Administrator
   * Payload: { subgroup: string }
   */
  async updateSubgroup(id: string, subgroup: string): Promise<AdminMember> {
    const trimmed = (subgroup || '').trim();
    const payload = { subgroup: trimmed };

    if (!APP_CONFIG.features.useMockServices) {
      const response = await apiClient.patch<any>(`/members/${encodeURIComponent(id)}/subgroup`, payload);
      const raw = response.data?.data || response.data;
      return this.normalizeMember(raw);
    }

    const member = await this.getMemberById(id);
    const updated: AdminMember = {
      ...member,
      subgroup: trimmed || 'General Assembly',
    };
    return updated;
  }

  /**
   * Reset member password:
   * PATCH /api/members/:id/reset-password
   * Allowed roles: Technical Administrator, President / Executive
   * Payload: { newPassword: string }
   * Minimum length: 8 characters
   */
  async resetPassword(id: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    const trimmed = (newPassword || '').trim();
    if (trimmed.length < 8) {
      const err: any = new Error('Password must be at least 8 characters long.');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    const payload = { newPassword: trimmed };

    if (!APP_CONFIG.features.useMockServices) {
      const response = await apiClient.patch<any>(`/members/${encodeURIComponent(id)}/reset-password`, payload);
      return { success: response.success ?? true, message: response.message || 'Password reset successfully' };
    }

    return { success: true, message: 'Password reset successfully' };
  }

  private normalizeMember(raw: any): AdminMember {
    const statusVal = raw.status || raw.accountStatus || 'Active';
    const normalizedStatus = statusVal === 'Inactive' ? 'Suspended' : (statusVal === 'Suspended' ? 'Suspended' : 'Active');

    return {
      id: String(raw.id || raw._id || `user_${Date.now()}`),
      name: raw.name || 'Fellowship Member',
      email: raw.email || '',
      department: raw.department || 'Not specified',
      level: raw.academicLevel || raw.level || '100 Level',
      subgroup: raw.subgroup || 'General Assembly',
      office: raw.office || raw.role,
      isExecutive: Boolean(raw.isExecutive),
      role: (raw.role || (Array.isArray(raw.roles) ? raw.roles[0] : 'Member')) as UserRole,
      status: normalizedStatus as any,
      joinDate: raw.joinDate || raw.createdAt || new Date().toISOString().split('T')[0],
      lastActive: raw.lastActive || 'Recently',
      phone: raw.phone || raw.phoneNumber,
      permissionOverrides: raw.permissionOverrides,
    };
  }

  private async getMockMembers(params?: GetMembersParams): Promise<GetMembersResult> {
    const saved = localStorage.getItem('asf_admin_members');
    let members: AdminMember[] = [];
    if (saved) {
      try {
        members = JSON.parse(saved);
      } catch {
        members = [];
      }
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;

    let filtered = [...members];
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q)
      );
    }
    if (params?.level && params.level !== 'All Academic Levels') {
      filtered = filtered.filter(m => m.level === params.level);
    }
    if (params?.role && params.role !== 'All Roles') {
      filtered = filtered.filter(m => m.role === params.role);
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    };
  }
}

export const membersService = new MembersService();
