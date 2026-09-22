/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const API_CONFIG = {
  baseUrl: (import.meta.env.VITE_API_BASE_URL || 'https://asf-digital-platform-backend.onrender.com/api').replace(/\/+$/, ''),
  timeoutMs: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      magicLink: '/auth/magic-link',
      verify: '/auth/verify',
      me: '/auth/me',
      logout: '/auth/logout',
    },
    members: {
      base: '/members',
      detail: (id: string) => `/members/${id}`,
      role: (id: string) => `/members/${id}/role`,
      status: (id: string) => `/members/${id}/status`,
      academicLevel: (id: string) => `/members/${id}/academic-level`,
      resetPassword: (id: string) => `/members/${encodeURIComponent(id)}/reset-password`,
    },
    academicSessions: {
      base: '/academic-sessions',
      active: '/academic-sessions/active',
      progress: (id: string) => `/academic-sessions/${id}/progress`,
    },
    bible: {
      translations: '/bible/translations',
      books: '/bible/books',
      chapter: (translationId: string, bookId: string, chapter: number) => 
        `/bible/${encodeURIComponent(translationId)}/${encodeURIComponent(bookId)}/${encodeURIComponent(chapter)}`,
      search: '/bible/search',
    },
    users: {
      profile: '/users/profile',
      roles: '/users/roles',
    },
    events: {
      base: '/events',
      detail: (id: string) => `/events/${id}`,
      remind: (id: string) => `/events/${id}/remind`,
      schedule: '/events/schedule',
    },
    announcements: {
      base: '/announcements',
      detail: (id: string) => `/announcements/${id}`,
      read: (id: string) => `/announcements/${id}/read`,
    },
    hymns: {
      base: '/hymns',
      detail: (id: string | number) => `/hymns/${id}`,
      byNumber: (num: string | number) => `/hymns/number/${num}`,
      categories: '/hymns/categories',
      today: '/hymns/today',
      search: '/hymns/search',
      audio: (id: string | number) => `/hymns/${id}/audio`,
    },
    content: {
      cms: '/content',
    },
    departments: '/departments',
  }
};

