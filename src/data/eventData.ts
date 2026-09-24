/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventItem } from '../types';

export const mockEvents: EventItem[] = [
  {
    id: 'evt-01',
    title: 'Sunday Fellowship Service',
    category: 'Worship',
    location: "Sanctuary, St. Jude's Chapel, FUTA",
    startTime: '2026-10-19T08:00:00+01:00',
    endTime: '2026-10-19T11:00:00+01:00',
    mode: 'In-Person',
    speaker: 'Pastor Sarah Jenkins',
    speakerRole: 'Visiting Chaplain & Guest Speaker',
    theme: 'Standing Firm in Grace',
    description: 'Join us for our weekly Sunday gathering. This week we will be focusing on the themes of community and spiritual resilience. Following the service, we will have a time of fellowship with light refreshments in the main hall.',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
    status: 'Active',
    createdBy: 'admin-01',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
    shortDescription: 'Join us as we gather for a time of worship, reflection, and community fellowship.',
    venue: "Sanctuary, St. Jude's Chapel",
    address: 'Main Campus, FUTA, Akure',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
    organizer: 'ASF Executive Committee & Chapel Chaplaincy',
    isPrebundledOffline: true,
    agenda: [
      { time: '08:00 AM', title: 'Opening Prayer & Congregational Worship', description: 'Led by the ASF Voices of Praise Choir' },
      { time: '08:30 AM', title: 'Welcome of Guests & Testimonies', description: 'Celebrating God\'s faithfulness during the academic term' },
      { time: '09:15 AM', title: 'Sermon & Word Ministration', description: 'Pastor Sarah Jenkins on "Standing Firm in Grace"' },
      { time: '10:30 AM', title: 'Intercession & Benediction', description: 'Prayers for students, exams, and university administration' },
      { time: '10:45 AM', title: 'Post-Service Fellowship', description: 'Refreshments & new member reception in the chapel hall' }
    ]
  },
  {
    id: 'evt-02',
    title: 'Midweek Bible Study',
    category: 'Bible Study',
    location: 'Fellowship Hall, Behind Chapel Vestry, FUTA Campus',
    startTime: '2026-10-21T17:00:00+01:00',
    endTime: '2026-10-21T18:30:00+01:00',
    mode: 'In-Person',
    speaker: 'Bible Study Committee',
    speakerRole: 'Study Facilitators',
    theme: 'Kingdom Family & Godly Youth Relationships',
    description: 'An interactive Bible study session examining biblical marriage concepts, godly relationships, and kingdom lifestyle for youth.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    status: 'Active',
    createdBy: 'admin-01',
    createdAt: '2026-09-02T10:00:00.000Z',
    updatedAt: '2026-09-02T10:00:00.000Z',
    shortDescription: 'Deep dive into God\'s Word exploring "The Reign of God: Marriage And Christian Lifestyle".',
    venue: 'Fellowship Hall',
    address: 'Behind Chapel Vestry, FUTA Campus',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    isPrebundledOffline: true,
    agenda: [
      { time: '05:00 PM', title: 'Opening Hymn & Short Prayer', description: 'Hymn #142 - How Sweet the Name of Jesus Sounds' },
      { time: '05:15 PM', title: 'Interactive Scripture Exposition', description: 'Breakout group discussions on Ephesians 5 & Genesis 2' },
      { time: '06:00 PM', title: 'Plenary Q&A Session', description: 'Addressing student questions on courtship, purity, and career balance' },
      { time: '06:25 PM', title: 'Closing Prayer & Announcements', description: 'Fellowship benediction' }
    ]
  },
  {
    id: 'evt-03',
    title: 'Thursday Prayer Meeting: "Hour of Grace"',
    category: 'Prayer',
    location: 'New Lecture Theatre (NLT) Complex, FUTA',
    startTime: '2026-10-23T17:30:00+01:00',
    endTime: '2026-10-23T19:00:00+01:00',
    mode: 'Hybrid',
    speaker: 'Prayer Secretary & Intercessory Team',
    speakerRole: 'Prayer Leaders',
    theme: 'Breakthrough & Academic Excellence',
    description: 'Gathering for corporate prayer, warfare, and intercession for students, the campus community, and the nation.',
    imageUrl: 'https://images.unsplash.com/photo-1545232979-fbf34fe3781c?auto=format&fit=crop&w=1200&q=80',
    status: 'Active',
    createdBy: 'admin-01',
    createdAt: '2026-09-03T10:00:00.000Z',
    updatedAt: '2026-09-03T10:00:00.000Z',
    shortDescription: 'An hour of intense corporate prayer, intercession, and spiritual renewal.',
    venue: 'New Lecture Theatre (NLT) & Zoom',
    address: 'NLT Complex / Virtual Classroom',
    image: 'https://images.unsplash.com/photo-1545232979-fbf34fe3781c?auto=format&fit=crop&w=1200&q=80',
    isPrebundledOffline: true,
    agenda: [
      { time: '05:30 PM', title: 'Worship & Chants of Praise', description: 'Setting an altar of prayer' },
      { time: '05:50 PM', title: 'Session 1: Academic Wisdom & Retention', description: 'Interceding for exam success and focus' },
      { time: '06:20 PM', title: 'Session 2: Health, Safety & Protection', description: 'Covering students and campus hostels' },
      { time: '06:50 PM', title: 'Declarations & Grace', description: 'Personal prophetic prayer for the week' }
    ]
  },
  {
    id: 'evt-04',
    title: 'Night of Worship: "Arise & Shine"',
    category: 'Special Program',
    location: 'FUTA Central Auditorium Complex, Akure',
    startTime: '2026-10-24T21:00:00+01:00',
    endTime: null,
    mode: 'In-Person',
    speaker: 'Min. Jane Smith & Guest Worshippers',
    speakerRole: 'Guest Worship Leader',
    theme: 'Arise & Shine (Isaiah 60:1)',
    description: 'Join us for an unforgettable night themed "Arise and Shine." Lay down your burdens and lift your voice in unified praise alongside guest worshippers and the ASF Choir.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    status: 'Active',
    createdBy: 'admin-01',
    createdAt: '2026-09-04T10:00:00.000Z',
    updatedAt: '2026-09-04T10:00:00.000Z',
    shortDescription: 'An extraordinary night of non-stop worship, artistic praise, drama, and prophetic declarations.',
    venue: 'Main Auditorium',
    address: 'FUTA Central Auditorium Complex',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    isPrebundledOffline: true,
    agenda: [
      { time: '08:30 PM', title: 'Red Carpet & Arrival Photo Session', description: 'Welcome reception for students & alumni' },
      { time: '09:00 PM', title: 'Grand Opening & Invocation', description: 'Mass choir fanfare & processional hymn' },
      { time: '10:00 PM', title: 'Acoustic & Classical Worship Hour', description: 'Intimate worship session' },
      { time: '11:30 PM', title: 'Drama Ministration: "The Beacon"', description: 'Presented by the ASF Drama Troupe' },
      { time: '01:00 AM', title: 'Guest Ministration: Min. Jane Smith', description: 'High praise and prophetic ministration' },
      { time: '03:30 AM', title: 'Altar Call & Impartation', description: 'Prayer for spiritual awakening and empowerment' }
    ]
  },
  {
    id: 'evt-05',
    title: 'Foundational School Cohort B Orientation',
    category: 'Fellowship',
    location: "St. Jude's Chapel Vestry, FUTA",
    startTime: '2026-10-25T10:00:00+01:00',
    endTime: '2026-10-25T12:00:00+01:00',
    mode: 'In-Person',
    speaker: 'VP & FS Facilitators',
    speakerRole: 'Discipleship Mentors',
    theme: 'Rooted and Grounded in Faith',
    description: 'Systematic discipleship onboarding covering Christian doctrines, prayer life, and fellowship heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    status: 'Active',
    createdBy: 'admin-01',
    createdAt: '2026-09-05T10:00:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
    shortDescription: 'Discipleship orientation session for new members and freshers.',
    venue: 'Chapel Vestry',
    address: 'St. Jude\'s Chapel Vestry Room',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    isPrebundledOffline: true
  },
  {
    id: 'evt-06',
    title: 'Evangelism & Medical Outreach',
    category: 'Outreach',
    location: 'Akindeko Hall Square, FUTA Campus',
    startTime: '2026-11-01T09:00:00+01:00',
    endTime: '2026-11-01T15:00:00+01:00',
    mode: 'In-Person',
    speaker: 'Evangelism Director & Medical Team Lead',
    speakerRole: 'Mission Leaders',
    theme: 'Demonstrating Christ in Word and Deed',
    description: 'A practical demonstration of Christ\'s love through medical screening, free drug distribution, and personal evangelism.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    status: 'Active',
    createdBy: 'admin-01',
    createdAt: '2026-09-06T10:00:00.000Z',
    updatedAt: '2026-09-06T10:00:00.000Z',
    shortDescription: 'Community soul-winning and free basic health checkups for campus residents.',
    venue: 'Akindeko Hall Square',
    address: 'FUTA Student Residential Area',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    isPrebundledOffline: false
  },
  {
    id: 'evt-07',
    title: 'Freshers Welcome & Orientation Service',
    category: 'Fellowship',
    location: "Sanctuary, St. Jude's Chapel, FUTA",
    startTime: '2026-10-05T08:00:00+01:00',
    endTime: '2026-10-05T11:30:00+01:00',
    mode: 'In-Person',
    speaker: 'ASF President & Executive Board',
    speakerRole: 'Executive Council',
    theme: 'Welcome to the Household of Faith',
    description: 'Special thanksgiving service dedicated to welcoming all 100L freshers and direct-entry students to campus.',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    status: 'Active',
    createdBy: 'admin-01',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
    shortDescription: 'Welcoming new 100-level students into the ASF family with joy and warmth.',
    venue: "Sanctuary, St. Jude's Chapel",
    address: 'Main Campus, FUTA, Akure',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    isPrebundledOffline: true
  },
  {
    id: 'evt-08',
    title: 'Academic Seminar & Tutorial Workshop',
    category: 'Administrative',
    location: 'SEET Auditorium, FUTA',
    startTime: '2026-10-15T16:00:00+01:00',
    endTime: '2026-10-15T18:00:00+01:00',
    mode: 'In-Person',
    speaker: 'Academics Directorate',
    speakerRole: 'Tutors & Faculty Advisors',
    theme: 'Excelling in Your Studies',
    description: 'This workshop was cancelled due to university examinations rescheduling.',
    imageUrl: null,
    status: 'Cancelled',
    createdBy: 'admin-01',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
    shortDescription: 'Academic workshop covering study strategies and course revision.',
    venue: 'SEET Auditorium',
    address: 'FUTA Campus',
    isPrebundledOffline: false
  }
];

export function getNextEvent(events: EventItem[] = mockEvents): EventItem | undefined {
  return events.find(e => e.status === 'Active');
}

export function searchEvents(
  query: string,
  category: string = 'All',
  source: EventItem[] = mockEvents,
  tab: string = 'Upcoming'
): EventItem[] {
  let results = source;

  // Filter by tab
  const now = new Date();
  if (tab === 'Past Events') {
    results = results.filter(e => new Date(e.startTime) < now);
  } else if (tab === 'Upcoming') {
    results = results.filter(e => new Date(e.startTime) >= now);
  }

  // Filter by category
  if (category !== 'All') {
    results = results.filter(e => e.category === category);
  }

  // Filter by search query
  const term = query.trim().toLowerCase();
  if (!term) return results;

  return results.filter(e => 
    e.title.toLowerCase().includes(term) ||
    (e.description && e.description.toLowerCase().includes(term)) ||
    (e.location && e.location.toLowerCase().includes(term)) ||
    (e.speaker && e.speaker.toLowerCase().includes(term)) ||
    (e.theme && e.theme.toLowerCase().includes(term))
  );
}

// Local storage reminder preference helpers
export const REMINDER_STORAGE_KEY = 'asf_event_reminders_map_v2';

export interface StoredReminderMap {
  [eventId: string]: {
    enabled: boolean;
    offset: '15m' | '30m' | '1h' | '1d';
    savedAt: string;
  };
}

export function getStoredReminders(): StoredReminderMap {
  try {
    const data = localStorage.getItem(REMINDER_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return {
    'evt-01': { enabled: true, offset: '30m', savedAt: new Date().toISOString() },
    'evt-04': { enabled: true, offset: '1h', savedAt: new Date().toISOString() }
  };
}

export function saveStoredReminders(map: StoredReminderMap): void {
  try {
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}
