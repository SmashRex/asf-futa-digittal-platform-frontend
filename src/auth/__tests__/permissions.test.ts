/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { hasPermission, isAdminRole, ROLE_PERMISSIONS } from '../permissions';
import { UserRole } from '../../types';

describe('Role & Permission Authorization Matrix', () => {
  it('should grant member permissions to standard Member', () => {
    expect(hasPermission('Member', 'view_member_content')).toBe(true);
    expect(hasPermission('Member', 'view_fs_materials')).toBe(true);
    expect(hasPermission('Member', 'create_events')).toBe(false);
    expect(hasPermission('Member', 'access_admin_dashboard')).toBe(false);
    expect(isAdminRole('Member')).toBe(false);
  });

  it('should grant FS management to FS Teacher and coordinators', () => {
    expect(hasPermission('FS Student', 'view_fs_materials')).toBe(true);
    expect(hasPermission('FS Student', 'manage_fs_school')).toBe(false);
    expect(isAdminRole('FS Student')).toBe(false);

    expect(hasPermission('FS Teacher', 'view_fs_materials')).toBe(true);
    expect(hasPermission('FS Teacher', 'manage_fs_school')).toBe(true);
  });

  it('should grant event and announcement publishing to Publicity Coordinator', () => {
    expect(hasPermission('Publicity Coordinator', 'create_events')).toBe(true);
    expect(hasPermission('Publicity Coordinator', 'edit_events')).toBe(true);
    expect(hasPermission('Publicity Coordinator', 'publish_announcements')).toBe(true);
    expect(hasPermission('Publicity Coordinator', 'access_admin_dashboard')).toBe(true);
    expect(isAdminRole('Publicity Coordinator')).toBe(true);
  });

  it('should grant full executive and admin privileges to President / Executive', () => {
    const execPermissions = ROLE_PERMISSIONS['President / Executive'];
    expect(execPermissions).toContain('manage_system_settings');
    expect(execPermissions).toContain('manage_leadership');
    expect(execPermissions).toContain('delete_events');
    expect(hasPermission('President / Executive', 'manage_system_settings')).toBe(true);
    expect(isAdminRole('President / Executive')).toBe(true);
  });

  it('should grant permissions additively when user has multiple roles', () => {
    const multiRoles = ['Member', 'FS Teacher', 'Publicity Coordinator'];
    expect(hasPermission(multiRoles, 'view_member_content')).toBe(true);
    expect(hasPermission(multiRoles, 'manage_fs_school')).toBe(true);
    expect(hasPermission(multiRoles, 'create_events')).toBe(true);
    expect(isAdminRole(multiRoles)).toBe(true);
  });

  it('should safely return false when role is undefined', () => {
    expect(hasPermission(undefined, 'view_member_content')).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
  });
});
