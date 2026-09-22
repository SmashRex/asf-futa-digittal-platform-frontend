/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from './role';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  departmentId?: string; // Authoritative department identifier e.g. "computer-science"
  department?: string | null; // Display department name (nullable per backend contract)
  gender?: 'Male' | 'Female' | null; // Authoritative member gender
  academicLevel: string; // Authoritative backend contract property e.g. "400 Level"
  level?: string; // UI alias for academicLevel
  phoneNumber?: string;
  subgroup?: string;
  accountStatus?: 'Active' | 'Suspended' | 'Deactivated';
  membershipStatus?: 'Active Student' | 'Alumni' | 'Visiting';
  avatarUrl?: string;
  roles: string[]; // Authoritative backend contract property: array of additive role strings
  role?: UserRole; // Derived primary role for existing UI component display
  programDurationYears?: number; // 4 or 5 for undergraduate programmes
  isAlumni?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  category: 'General' | 'Service' | 'Bible Study' | 'FS' | 'Meeting' | 'Special Program' | 'Important';
  priority: 'Normal' | 'Important' | 'Urgent';
  read: boolean;
}
