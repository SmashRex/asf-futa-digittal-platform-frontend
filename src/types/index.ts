/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export * from './role';
export * from './user';
export * from './reminder';
export * from './event';
export * from './bible';
export * from './bibleStudy';
export * from './hymn';
export * from './academicSession';
export * from './fs';

export type AnnouncementCategory = 'General' | 'Service' | 'Bible Study' | 'Program' | 'Administrative' | 'Fellowship';

export interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: AnnouncementCategory;
  publishedAt: string;
  author: string;
  isRead?: boolean;
  priority?: 'Normal' | 'Important' | 'Urgent';
  isPrebundledOffline?: boolean;
  imageUrl?: string;
  attachmentName?: string;
  attachmentSize?: string;
}

export interface ScriptureRef {
  ref: string;
  bookId: string;
  chapter: number;
  verse?: number;
  text?: string;
}

export interface FSChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  scriptureRefs?: ScriptureRef[];
}

export interface FSMaterial {
  id: string;
  title: string;
  subtitle?: string;
  academicYear: string;
  description: string;
  isAvailableOffline: boolean;
  requiresRestrictedAuth?: boolean;
  chapters: FSChapter[];
}
