/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const EVENTS_CONTENT = {
  header: {
    badge: "Semester Schedule",
    title: "Gatherings & Events",
    description: "Join us for worship, Bible studies, prayer meetings, and special fellowship events across the semester.",
    scheduleButtonText: "Semester Schedule",
  },
  tabs: {
    all: "All Events",
    upcoming: "Upcoming",
    past: "Past Events",
  },
  categories: [
    'All',
    'Bible Study',
    'Prayer',
    'Worship',
    'Outreach',
    'Fellowship',
    'Special Program',
    'Administrative'
  ],
  emptyState: {
    upcoming: {
      title: "No Upcoming Events",
      description: "No upcoming events have been published yet.",
    },
    past: {
      title: "No Past Events",
      description: "No past events to show yet.",
    },
    featured: {
      title: "No Featured Event",
      description: "No featured event right now.",
    },
    filtered: {
      title: "No Events Found",
      description: "There are currently no events matching your selected category or search filter.",
      resetButtonText: "Reset Filters",
    }
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
