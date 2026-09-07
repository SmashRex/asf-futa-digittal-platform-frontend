/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const ROUTES = {
  PUBLIC_HOME: '/',
  PORTAL: '/portal',
  SIGN_IN: '/sign-in',
  REGISTER: '/register',
  CHECK_EMAIL: '/check-email',
  WELCOME_BACK: '/welcome-back',
  AUTH_VERIFY: '/auth/verify',
  
  HOME: '/home',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  ABOUT: '/about',
  BOOKMARKS: '/bookmarks',
  HELP_SUPPORT: '/help-support',
  OFFLINE_SYNC: '/offline-sync',
  
  EVENTS: '/events',
  EVENT_DETAIL: (id: string = ':id') => `/events/${id}`,
  EVENT_SCHEDULE: '/events/schedule',
  
  BIBLE: '/bible',
  BIBLE_BOOK: (book: string = ':bookId') => `/bible/${book}`,
  BIBLE_CHAPTER: (book: string = ':bookId', chapter: string | number = ':chapterId') => `/bible/${book}/${chapter}`,
  BIBLE_VERSE: (book: string = ':bookId', chapter: string | number = ':chapterId', verse: string | number = ':verseId') => `/bible/${book}/${chapter}/${verse}`,
  BIBLE_READER: (book: string = ':bookId', chapter: string | number = ':chapterId') => `/bible/read/${book}/${chapter}`,
  BIBLE_SEARCH: '/bible/search',
  BIBLE_STUDY: '/bible-study',
  BIBLE_STUDY_READER: (id: string = ':id') => `/bible-study/read/${id}`,
  BIBLE_STUDY_DETAIL: (id: string = ':id') => `/bible-study/${id}`,
  BIBLE_STUDY_ARCHIVE: '/bible-study/archive',
  
  HYMNS: '/hymns',
  HYMNS_SEARCH: '/hymns/search',
  HYMNS_BOOKMARKS: '/hymns/bookmarks',
  HYMN_READER: (id: string | number = ':hymnId') => `/hymns/read/${id}`,
  HYMN_DIRECT: (id: string | number = ':hymnId') => `/hymns/${id}`,
  
  ANNOUNCEMENTS: '/announcements',
  ANNOUNCEMENT_DETAIL: (id: string = ':id') => `/announcements/${id}`,
  
  FS_HOME: '/foundational-school',
  FS_MATERIALS: '/foundational-school/materials',
  FS_READER: (id: string = ':id') => `/foundational-school/reader/${id}`,
  FS_RESTRICTED: '/foundational-school/restricted',
  FS_OFFLINE: '/foundational-school/offline',
  
  ADMIN_ENTRY: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_MEMBERS: '/admin/members',
  ADMIN_CONTENT: '/admin/content',
  ADMIN_CONTENT_EDITOR: '/admin/content/editor',
  ADMIN_CONTENT_PREVIEW: '/admin/content/preview',
  ADMIN_MEDIA: '/admin/media',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_LEADERSHIP: '/admin/leadership',
  ADMIN_HANDOVER: '/admin/handover',
  ADMIN_GOVERNANCE: '/admin/governance',
  ADMIN_SYSTEM_HEALTH: '/admin/system-health',
  ADMIN_LOGS: '/admin/logs',
  ADMIN_FS_STUDENTS: '/admin/fs/students',
  ADMIN_FS_ADMISSIONS: '/admin/fs/admissions',
  ADMIN_FS_TEACHERS: '/admin/fs/teachers',
  ADMIN_FS_CLASSES: '/admin/fs/classes',
  ADMIN_FS_MATERIALS: '/admin/fs/materials',
  ADMIN_FS_ACTIVITY: '/admin/fs/activity',
} as const;
