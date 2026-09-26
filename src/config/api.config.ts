/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

function getApiBaseUrl(): string {
  // In development mode (AI Studio dev preview on *.run.app or local Vite dev server),
  // route through Vite's dev server proxy (/api) to prevent browser cross-origin CORS rejections from Render.
  // In production builds (Vercel deployment), strictly route directly to the authoritative backend.
  if (import.meta.env.DEV) {
    return '/api';
  }
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
  if (envUrl && envUrl !== '/' && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'https://asf-digital-platform-backend.onrender.com/api';
}

export const API_CONFIG = {
  baseUrl: getApiBaseUrl(),
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
      detail: (id: string) => `/members/${encodeURIComponent(id)}`,
      role: (id: string) => `/members/${encodeURIComponent(id)}/role`,
      status: (id: string) => `/members/${encodeURIComponent(id)}/status`,
      academicLevel: (id: string) => `/members/${encodeURIComponent(id)}/academic-level`,
      resetPassword: (id: string) => `/members/${encodeURIComponent(id)}/reset-password`,
    },
    president: {
      roster: '/president/roster',
      analytics: '/president/analytics',
      governanceRequests: '/president/governance/requests',
      approveGovernanceRequest: (id: string) => `/president/governance/requests/${encodeURIComponent(id)}/approve`,
      rejectGovernanceRequest: (id: string) => `/president/governance/requests/${encodeURIComponent(id)}/reject`,
      handovers: '/president/handovers',
      handoverDetail: (id: string) => `/president/handovers/${encodeURIComponent(id)}`,
      approveHandover: (id: string) => `/president/handovers/${encodeURIComponent(id)}/approve`,
      publishHandover: (id: string) => `/president/handovers/${encodeURIComponent(id)}/publish`,
    },
    governance: {
      requests: '/governance/requests',
    },
    academicSessions: {
      base: '/academic-sessions',
      active: '/academic-sessions/active',
      progress: (id: string) => `/academic-sessions/${encodeURIComponent(id)}/progress`,
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

