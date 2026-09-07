/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const APP_CONFIG = {
  name: "Anglican Students' Fellowship",
  shortName: 'ASF FUTA',
  chapter: 'FUTA Chapter',
  description: 'Digital Fellowship Portal for ASF FUTA - Outlines, Hymns, Events & Announcements',
  version: '1.0.0',
  theme: {
    primaryColor: '#800000', // Maroon
    accentColor: '#DAA520',  // Gold
  },
  features: {
    enableDevSimulations: import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true',
    useMockServices: import.meta.env.VITE_USE_MOCK_SERVICES !== 'false', // Default true until backend is connected
    enableOfflineCache: true,
  },
  storageKeys: {
    userSession: 'asf_user_session',
    authToken: 'asf_auth_token',
    notifications: 'asf_notifications',
    eventReminders: 'asf_event_reminders',
    bookmarkedStudies: 'asf_bookmarked_studies',
    bookmarkedHymns: 'asf_bookmarked_hymns',
    readAnnouncements: 'asf_read_announcements',
  }
};
