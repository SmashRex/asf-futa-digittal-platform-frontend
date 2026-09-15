/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { membersService } from '../members/members.service';
import { academicSessionsService } from '../academicSessions/academicSessions.service';
import { apiClient } from '../api/client';
import { APP_CONFIG } from '../../config/app.config';

describe('Members Service and Academic Sessions Contract', () => {
  const originalUseMock = APP_CONFIG.features.useMockServices;

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    const testMembers = [
      {
        id: 'user_1',
        name: 'Samuel Adebayo',
        email: 'samuel@futa.edu.ng',
        department: 'Electrical Engineering',
        level: '300 Level',
        subgroup: 'Technical Team',
        role: 'Technical Administrator',
        status: 'Active',
        joinDate: '2023-11-12',
        lastActive: '10 mins ago',
      },
      {
        id: 'user_2',
        name: 'Grace Oladipo',
        email: 'grace@futa.edu.ng',
        department: 'Computer Science',
        level: '200 Level',
        subgroup: 'Publicity & Editorial',
        role: 'Member',
        status: 'Active',
        joinDate: '2024-02-15',
        lastActive: '1 hour ago',
      }
    ];
    localStorage.setItem('asf_admin_members', JSON.stringify(testMembers));
    APP_CONFIG.features.useMockServices = true;
  });

  afterEach(() => {
    APP_CONFIG.features.useMockServices = originalUseMock;
  });

  it('should fetch members directory with pagination', async () => {
    const res = await membersService.getMembers({ page: 1, limit: 10 });
    expect(res.data.length).toBe(2);
    expect(res.pagination.page).toBe(1);
    expect(res.pagination.total).toBe(2);
  });

  it('should fetch single member by id', async () => {
    const member = await membersService.getMemberById('user_2');
    expect(member.name).toBe('Grace Oladipo');
    expect(member.department).toBe('Computer Science');
  });

  it('should validate that overrideReason has at least 5 characters', async () => {
    await expect(
      membersService.overrideAcademicLevel('user_2', '300 Level', 'ok')
    ).rejects.toThrow('Please provide a reason of at least 5 characters.');

    await expect(
      membersService.overrideAcademicLevel('user_2', '300 Level', '')
    ).rejects.toThrow('Please provide a reason of at least 5 characters.');
  });

  it('should override academic level with valid reason (mock mode)', async () => {
    const updated = await membersService.overrideAcademicLevel('user_2', '300 Level', 'Promoted to next level');
    expect(updated.level).toBe('300 Level');
  });

  it('should send correct contract payload { newLevel, overrideReason } via PATCH /members/:id/academic-level', async () => {
    APP_CONFIG.features.useMockServices = false;
    const patchSpy = vi.spyOn(apiClient, 'patch').mockResolvedValueOnce({
      success: true,
      data: {
        id: 'user_2',
        name: 'Grace Oladipo',
        email: 'grace@futa.edu.ng',
        department: 'Computer Science',
        level: '300 Level',
        subgroup: 'Publicity & Editorial',
        role: 'Member',
        status: 'Active',
        joinDate: '2024-02-15',
        lastActive: '1 hour ago',
      },
      message: 'Academic level overridden successfully'
    });

    const updated = await membersService.overrideAcademicLevel('user_2', '300 Level', 'Correction of academic progression');
    expect(patchSpy).toHaveBeenCalledWith('/members/user_2/academic-level', {
      newLevel: '300 Level',
      overrideReason: 'Correction of academic progression'
    });
    expect(updated.level).toBe('300 Level');
  });

  it('should handle CANNOT_SELF_MODIFY (400) error when attempting to change own account status', async () => {
    APP_CONFIG.features.useMockServices = false;
    vi.spyOn(apiClient, 'patch').mockRejectedValueOnce({
      statusCode: 400,
      code: 'CANNOT_SELF_MODIFY',
      message: 'You cannot suspend or modify your own account status.'
    });

    await expect(
      membersService.updateStatus('user_1', 'Inactive')
    ).rejects.toMatchObject({
      statusCode: 400,
      code: 'CANNOT_SELF_MODIFY'
    });
  });

  it('should update member role with assign action', async () => {
    const updated = await membersService.updateRole('user_2', 'assign', 'Publicity Coordinator');
    expect(updated.role).toBe('Publicity Coordinator');
  });

  it('should update member status to Inactive / Suspended', async () => {
    const updated = await membersService.updateStatus('user_2', 'Inactive');
    expect(updated.status).toBe('Suspended');
  });

  it('should validate password length on resetPassword', async () => {
    await expect(
      membersService.resetPassword('user_2', 'short')
    ).rejects.toThrow('Password must be at least 8 characters long.');
  });

  it('should send correct contract payload { newPassword } via PATCH /members/:id/reset-password', async () => {
    APP_CONFIG.features.useMockServices = false;
    const patchSpy = vi.spyOn(apiClient, 'patch').mockResolvedValueOnce({
      success: true,
      data: { success: true },
      message: 'Password reset successfully'
    });

    const res = await membersService.resetPassword('user_2', 'NewPassword2026!');
    expect(patchSpy).toHaveBeenCalledWith('/members/user_2/reset-password', {
      newPassword: 'NewPassword2026!'
    });
    expect(res.success).toBe(true);
  });

  it('should get active academic session', async () => {
    const activeSession = await academicSessionsService.getActiveSession();
    expect(activeSession).toBeDefined();
    expect(activeSession?.isActive).toBe(true);
    expect(activeSession?.id).toBe('2025/2026');
  });
});
