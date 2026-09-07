/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from '../types/role';

export type Permission = 
  | 'view_member_content'
  | 'view_fs_materials'
  | 'manage_fs_school'
  | 'create_events'
  | 'edit_events'
  | 'delete_events'
  | 'publish_announcements'
  | 'manage_members'
  | 'manage_leadership'
  | 'access_admin_dashboard'
  | 'manage_system_settings';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'Member': ['view_member_content', 'view_fs_materials'],
  'Regular Member': ['view_member_content', 'view_fs_materials'],
  'FS Student': ['view_member_content', 'view_fs_materials'],
  'FS Teacher': ['view_member_content', 'view_fs_materials', 'manage_fs_school'],
  'VP / FS Coordinator': ['view_member_content', 'view_fs_materials', 'manage_fs_school', 'access_admin_dashboard'],
  'Bible Study Coordinator': ['view_member_content', 'view_fs_materials', 'publish_announcements', 'access_admin_dashboard'],
  'Choir Coordinator': ['view_member_content', 'view_fs_materials', 'publish_announcements', 'access_admin_dashboard'],
  'Publicity Coordinator': ['view_member_content', 'view_fs_materials', 'create_events', 'edit_events', 'publish_announcements', 'manage_members', 'access_admin_dashboard'],
  'General Secretary': ['view_member_content', 'view_fs_materials', 'create_events', 'edit_events', 'publish_announcements', 'access_admin_dashboard'],
  'Organizing Coordinator': ['view_member_content', 'view_fs_materials', 'create_events', 'edit_events', 'access_admin_dashboard'],
  'Drama Coordinator': ['view_member_content', 'view_fs_materials', 'access_admin_dashboard'],
  'Prayer Coordinator': ['view_member_content', 'view_fs_materials', 'access_admin_dashboard'],
  'Financial Secretary': ['view_member_content', 'view_fs_materials', 'access_admin_dashboard'],
  'Treasurer': ['view_member_content', 'view_fs_materials', 'access_admin_dashboard'],
  'Librarian': ['view_member_content', 'view_fs_materials', 'access_admin_dashboard'],
  'President / Executive': [
    'view_member_content', 'view_fs_materials', 'manage_fs_school', 
    'create_events', 'edit_events', 'delete_events', 'publish_announcements', 
    'manage_members', 'manage_leadership', 'access_admin_dashboard', 'manage_system_settings'
  ],
  'Technical Administrator': [
    'view_member_content', 'view_fs_materials', 'access_admin_dashboard', 'manage_system_settings'
  ],
  'Alumni': ['view_member_content'],
};

export const hasPermission = (userRole: UserRole | undefined, permission: Permission): boolean => {
  if (!userRole) return false;
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};

export const isAdminRole = (userRole: UserRole | undefined): boolean => {
  return hasPermission(userRole, 'access_admin_dashboard');
};
