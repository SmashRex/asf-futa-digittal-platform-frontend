/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, Notification, BibleVerse } from '../types';

export const mockUsers: Record<string, UserProfile> = {
  member: {
    id: 'user_01',
    name: 'Temiloluwa Afolabi',
    email: 'member@asf-futa.org',
    department: 'Computer Science',
    level: '400 Level',
    subgroup: 'Technical Team',
    role: 'Member',
    isAlumni: false
  },
  admin: {
    id: 'user_02',
    name: 'Brother Samuel Adebayo',
    email: 'admin@asf-futa.org',
    department: 'Electrical Engineering',
    level: '500 Level',
    subgroup: 'Executives',
    role: 'Publicity Coordinator',
    isAlumni: false
  },
  president: {
    id: 'user_03',
    name: 'Brother David Olatunji',
    email: 'president@asf-futa.org',
    department: 'Mechanical Engineering',
    level: '500 Level',
    subgroup: 'Executives',
    role: 'President / Executive',
    isAlumni: false
  }
};

export const mockDailyVerse: BibleVerse = {
  reference: 'Isaiah 60:1',
  text: 'Arise, shine; for thy light is come, and the glory of the Lord is risen upon thee.'
};

export const mockNotifications: Notification[] = [
  {
    id: 'notif_01',
    title: 'Weekly Bible Study Outline: "The Power of Discipleship"',
    body: 'The outline for this Tuesday\'s Bible Study is now available in the platform. Let us prepare our hearts and scriptures ahead of the service. Time: 5:00 PM, Venue: Fellowship Hall.',
    timestamp: 'Today, 10:30 AM',
    category: 'Bible Study',
    priority: 'Normal',
    read: false
  },
  {
    id: 'notif_02',
    title: 'EMERGENCY: Shift in Thursday Prayer Meeting Venue',
    body: 'Please note that our Thursday Prayer Meeting will hold at the New Lecture Theatre (NLT) instead of the Fellowship Hall due to ongoing repairs. Time remains 5:30 PM. Tell other brethren.',
    timestamp: 'Yesterday, 4:15 PM',
    category: 'Meeting',
    priority: 'Urgent',
    read: false
  },
  {
    id: 'notif_03',
    title: 'FS Cohort B Registration Now Open',
    body: 'Brethren who have completed the preliminary orientation are requested to register for Foundational School Cohort B. Kindly visit the FS section or see the Vice President for enrollment.',
    timestamp: '2 days ago',
    category: 'FS',
    priority: 'Important',
    read: true
  },
  {
    id: 'notif_04',
    title: 'Anglican Students\' Fellowship FUTA: Theme for the Semester',
    body: 'Our President, David Olatunji, has officially released the spirit-led theme for this semester: "Arise, Shine!" Let us hold fast to this prophetic declaration.',
    timestamp: '4 days ago',
    category: 'General',
    priority: 'Important',
    read: true
  },
  {
    id: 'notif_05',
    title: 'Upcoming Choir Rehearsal',
    body: 'All members of the ASF Choir are reminded of the rehearsals preparing for the upcoming Special Joint Service. Venue: Chapel Vestry, Time: Saturday 4:00 PM.',
    timestamp: '5 days ago',
    category: 'Special Program',
    priority: 'Normal',
    read: true
  }
];

export interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  iconName: string;
  isMVP: boolean;
  requiresAuth: boolean;
}

export const memberModules: ModuleInfo[] = [
  {
    id: 'bible-study',
    name: 'Bible Study',
    description: 'Weekly interactive outlines',
    iconName: 'BookOpen',
    isMVP: true,
    requiresAuth: true
  },
  {
    id: 'bible',
    name: 'Holy Bible',
    description: 'Scripture reading and search',
    iconName: 'Book',
    isMVP: true,
    requiresAuth: true
  },
  {
    id: 'hymns',
    name: 'Hymn Book',
    description: 'Song of Praise (SOP) lyrics',
    iconName: 'Music',
    isMVP: true,
    requiresAuth: true
  },
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Official fellowship updates',
    iconName: 'Megaphone',
    isMVP: true,
    requiresAuth: true
  },
  {
    id: 'events',
    name: 'Events & Calendar',
    description: 'Semester programs and schedules',
    iconName: 'Calendar',
    isMVP: true,
    requiresAuth: true
  },
  {
    id: 'fs',
    name: 'Foundational School',
    description: 'Discipleship materials manual',
    iconName: 'GraduationCap',
    isMVP: true,
    requiresAuth: true
  },
  {
    id: 'library',
    name: 'Digital Library',
    description: 'Spiritual books and study tools',
    iconName: 'FolderClosed',
    isMVP: false,
    requiresAuth: true
  },
  {
    id: 'suggestions',
    name: 'Suggestion Box',
    description: 'Reach out for help or counseling',
    iconName: 'HelpCircle',
    isMVP: false,
    requiresAuth: true
  }
];
