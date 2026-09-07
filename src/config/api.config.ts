/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  timeoutMs: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  endpoints: {
    auth: {
      magicLink: '/auth/magic-link',
      verify: '/auth/verify',
      me: '/auth/me',
      logout: '/auth/logout',
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
    users: {
      profile: '/users/profile',
      roles: '/users/roles',
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
    }
  }
};
