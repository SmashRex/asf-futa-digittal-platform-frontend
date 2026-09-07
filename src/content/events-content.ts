/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const EVENTS_CONTENT = {
  header: {
    badge: "FUTA Chapter Schedule",
    title: "Gatherings & Events",
    description: "Join us for worship, Bible studies, prayer meetings, and special fellowship events.",
    scheduleButtonText: "Semester Schedule",
  },
  tabs: {
    all: "All Events",
    upcoming: "Upcoming",
    today: "Happening Today",
    past: "Past Events",
  },
  categories: [
    'All',
    'Worship',
    'Service',
    'Bible Study',
    'Prayer',
    'Fellowship',
    'Outreach',
    'Seminar',
    'Conference',
    'Youth',
    'Special Program'
  ],
  emptyState: {
    title: "No Events Found",
    description: "There are currently no events matching your selected time horizon or category filter.",
    resetButtonText: "Reset Filters",
  },
  offlineState: {
    title: "Working Offline",
    description: "Showing pre-bundled events available without network connection.",
  },
  reminderModal: {
    title: "Set Event Reminder",
    subtitle: "Get notified prior to the commencement of this gathering",
    offsets: [
      { id: '15m', label: '15 Minutes Before', desc: 'Quick alert for immediate preparation' },
      { id: '30m', label: '30 Minutes Before', desc: 'Ideal for commuting to venue' },
      { id: '1h', label: '1 Hour Before', desc: 'Standard reminder for scheduling ahead' },
      { id: '1d', label: '1 Day Before', desc: 'Advance notification for special events' },
    ],
    confirmText: "Activate Reminder",
    cancelText: "Remove Reminder",
  }
};
