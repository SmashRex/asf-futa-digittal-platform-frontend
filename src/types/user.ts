/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from './role';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  level: string; // e.g. "400 Level"
  subgroup?: string; // optional subgroup e.g. "Choir"
  role: UserRole;
  isAlumni: boolean;
  avatarUrl?: string;
  phoneNumber?: string;
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
