/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventItem } from '../types';

export const mockEvents: EventItem[] = [
  {
    id: 'evt-01',
    title: 'Sunday Fellowship Service',
    shortDescription: 'Join us as we gather for a time of worship, reflection, and community fellowship.',
    description: 'Join us for our weekly Sunday gathering. This week we will be focusing on the themes of community and spiritual resilience. Following the service, we will have a time of fellowship with light refreshments in the main hall.',
    category: 'Worship',
    startDate: 'Sunday, Oct 19, 2026',
    startTime: '8:00 AM',
    endTime: '11:00 AM',
    month: 'OCT',
    dayNumber: '19',
    venue: "Sanctuary, St. Jude's Chapel",
    address: 'Main Campus, FUTA, Akure',
    mode: 'In-Person',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
    organizer: 'ASF Executive Committee & Chapel Chaplaincy',
    speaker: 'Pastor Sarah Jenkins',
    speakerRole: 'Visiting Chaplain & Guest Speaker',
    speakerBio: 'Pastor Sarah has been leading student ministry for over a decade, bringing messages of hope, holiness, and practical spiritual guidance.',
    theme: 'Standing Firm in Grace',
    status: 'Happening Today',
    isToday: true,
    isNextEvent: true,
    isSpecialEvent: false,
    isPrebundledOffline: true,
    agenda: [
      { time: '08:00 AM', title: 'Opening Prayer & Congregational Worship', description: 'Led by the ASF Voices of Praise Choir' },
      { time: '08:30 AM', title: 'Welcome of Guests & Testimonies', description: 'Celebrating God\'s faithfulness during the academic term' },
      { time: '09:15 AM', title: 'Sermon & Word Ministration', description: 'Pastor Sarah Jenkins on "Standing Firm in Grace"' },
      { time: '10:30 AM', title: 'Intercession & Benediction', description: 'Prayers for students, exams, and university administration' },
      { time: '10:45 AM', title: 'Post-Service Fellowship', description: 'Refreshments & new member reception in the chapel hall' }
    ],
    additionalInfo: {
      bibleNote: 'Come with your printed/digital Holy Bible, notebook, and a receptive heart.',
      dressCode: 'Formal Church Attire / ASF Fellowship Uniform',
      transportInfo: 'Free campus shuttle buses depart North Gate & South Gate every 15 mins from 7:30 AM.',
      attendanceRequirements: 'Open to all FUTA students, staff, and visitors.',
      specialNotice: {
        title: 'Shuttle Bus Schedule',
        description: 'Shuttle buses will be available from the North Gate and South Gate starting at 7:30 AM. Please arrive early to secure a seat.',
        icon: 'bus'
      }
    },
    specialNotice: {
      title: 'Shuttle Bus Schedule',
      description: 'Shuttle buses will be available from the North Gate and South Gate starting at 7:30 AM. Please arrive early to secure a seat.',
      icon: 'bus'
    },
    aboutContent: [
      'Join us for an extraordinary Sunday Fellowship Service themed "Standing Firm in Grace." This service is designed to bring students together across all faculties for uplifting congregational worship, word ministration, and fellowship.',
      'We will celebrate divine goodness with testimonies, choir ministrations by the ASF Voices of Praise, and intercessory prayers for the upcoming semester examinations.',
      'After the main service, student executives and unit leaders will be available at the hospitality desk for new members and freshers.'
    ],
    guestMinisters: [
      'Pastor Sarah Jenkins (Lead Speaker)',
      'The ASF Voices of Praise Choir',
      'Brother David Olatunji (ASF President)'
    ],
    mapCoordinates: { lat: 7.3005, lng: 5.1382 },
    directions: 'Located directly behind the Administrative Building near FUTA Main Gate.'
  },
  {
    id: 'evt-02',
    title: 'Midweek Bible Study',
    shortDescription: 'Deep dive into God\'s Word exploring "The Reign of God: Marriage And Christian Lifestyle".',
    description: 'An interactive Bible study session examining biblical marriage concepts, godly relationships, and kingdom lifestyle for youth.',
    category: 'Bible Study',
    startDate: 'Tuesday, Oct 21, 2026',
    startTime: '5:00 PM',
    endTime: '6:30 PM',
    month: 'OCT',
    dayNumber: '21',
    venue: 'Fellowship Hall',
    address: 'Behind Chapel Vestry, FUTA Campus',
    mode: 'In-Person',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    organizer: 'ASF Bible Study Directorate',
    speaker: 'Bible Study Committee',
    theme: 'Kingdom Family & Godly Youth Relationships',
    status: 'Starting Soon',
    isSoon: true,
    isNextEvent: false,
    isSpecialEvent: false,
    isPrebundledOffline: true,
    agenda: [
      { time: '05:00 PM', title: 'Opening Hymn & Short Prayer', description: 'Hymn #142 - How Sweet the Name of Jesus Sounds' },
      { time: '05:15 PM', title: 'Interactive Scripture Exposition', description: 'Breakout group discussions on Ephesians 5 & Genesis 2' },
      { time: '06:00 PM', title: 'Plenary Q&A Session', description: 'Addressing student questions on courtship, purity, and career balance' },
      { time: '06:25 PM', title: 'Closing Prayer & Announcements', description: 'Fellowship benediction' }
    ],
    additionalInfo: {
      bibleNote: 'Please download or bring Bible Study Outline #08.',
      dressCode: 'Smart Casual / Academic Attire',
      specialNotice: {
        title: 'Study Outlines Provided',
        description: 'Printed outlines will be distributed at the entrance. Digital copies are available on the Bible Study tab.',
        icon: 'file'
      }
    },
    specialNotice: {
      title: 'Study Outlines Provided',
      description: 'Printed outlines will be distributed at the entrance. Digital copies are available on the Bible Study tab.',
      icon: 'file'
    },
    aboutContent: [
      'Every Tuesday evening, the fellowship gathers to study the Scriptures systematically. This week\'s topic centers on biblical foundations for marriage and singlehood.',
      'Bring along your Bible, notebook, and open questions for the interactive Q&A session.'
    ],
    mapCoordinates: { lat: 7.3012, lng: 5.1390 },
    directions: 'Adjacent to St. Jude\'s Chapel Vestry building.'
  },
  {
    id: 'evt-03',
    title: 'Thursday Prayer Meeting: "Hour of Grace"',
    shortDescription: 'An hour of intense corporate prayer, intercession, and spiritual renewal.',
    description: 'Gathering for corporate prayer, warfare, and intercession for students, the campus community, and the nation.',
    category: 'Prayer',
    startDate: 'Thursday, Oct 23, 2026',
    startTime: '5:30 PM',
    endTime: '7:00 PM',
    month: 'OCT',
    dayNumber: '23',
    venue: 'New Lecture Theatre (NLT) & Zoom',
    address: 'NLT Complex / Virtual Classroom',
    mode: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1545232979-fbf34fe3781c?auto=format&fit=crop&w=1200&q=80',
    organizer: 'ASF Prayer Subgroup',
    speaker: 'Prayer Secretary & Intercessory Team',
    theme: 'Breakthrough & Academic Excellence',
    status: 'Upcoming',
    isNextEvent: false,
    isSpecialEvent: false,
    isPrebundledOffline: true,
    agenda: [
      { time: '05:30 PM', title: 'Worship & Chants of Praise', description: 'Setting an altar of prayer' },
      { time: '05:50 PM', title: 'Session 1: Academic Wisdom & Retention', description: 'Interceding for exam success and focus' },
      { time: '06:20 PM', title: 'Session 2: Health, Safety & Protection', description: 'Covering students and campus hostels' },
      { time: '06:50 PM', title: 'Declarations & Grace', description: 'Personal prophetic prayer for the week' }
    ],
    additionalInfo: {
      bibleNote: 'Focus scriptures: James 1:5, Psalm 121, Philippians 4:6-7.',
      dressCode: 'Comfortable Prayer Attire',
      transportInfo: 'Zoom link will be shared in the ASF Official WhatsApp channel 15 mins prior.'
    },
    aboutContent: [
      'Please note the temporary venue change to the New Lecture Theatre (NLT) due to facility maintenance.',
      'We will be praying for spiritual awakening, academic breakthroughs, and divine protection across the university.'
    ],
    mapCoordinates: { lat: 7.2990, lng: 5.1410 },
    directions: 'NLT Complex, School of Engineering quadrangle.'
  },
  {
    id: 'evt-04',
    title: 'Night of Worship: "Arise & Shine"',
    shortDescription: 'An extraordinary night of non-stop worship, artistic praise, drama, and prophetic declarations.',
    description: 'Join us for an unforgettable night themed "Arise and Shine." Lay down your burdens and lift your voice in unified praise alongside guest worshippers and the ASF Choir.',
    category: 'Special Program',
    startDate: 'Friday, Oct 24, 2026',
    startTime: '9:00 PM',
    endTime: 'Till Dawn',
    month: 'OCT',
    dayNumber: '24',
    venue: 'Main Auditorium',
    address: 'FUTA Central Auditorium Complex',
    mode: 'In-Person',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    organizer: 'ASF Choir & Evangelism Directorate',
    speaker: 'Min. Jane Smith & Guest Worshippers',
    speakerRole: 'Guest Worship Leader',
    theme: 'Arise & Shine (Isaiah 60:1)',
    status: 'Upcoming',
    isSpecialEvent: true,
    isNextEvent: false,
    isPrebundledOffline: true,
    agenda: [
      { time: '08:30 PM', title: 'Red Carpet & Arrival Photo Session', description: 'Welcome reception for students & alumni' },
      { time: '09:00 PM', title: 'Grand Opening & Invocation', description: 'Mass choir fanfare & processional hymn' },
      { time: '10:00 PM', title: 'Acoustic & Classical Worship Hour', description: 'Intimate worship session' },
      { time: '11:30 PM', title: 'Drama Ministration: "The Beacon"', description: 'Presented by the ASF Drama Troupe' },
      { time: '01:00 AM', title: 'Guest Ministration: Min. Jane Smith', description: 'High praise and prophetic ministration' },
      { time: '03:30 AM', title: 'Altar Call & Impartation', description: 'Prayer for spiritual awakening and empowerment' },
      { time: '05:00 AM', title: 'Dawn Breakfast & Departure', description: 'Hot tea and snacks for attendees' }
    ],
    additionalInfo: {
      bibleNote: 'Main scripture: Isaiah 60:1-3',
      dressCode: 'All-White or Royal Blue Elegant Attire',
      transportInfo: 'Free shuttle buses operating continuously from Obanla Hostels, North Gate, and South Gate from 8:15 PM.',
      specialNotice: {
        title: 'Free Campus Shuttles Available',
        description: 'Shuttle buses will be running from North Gate, South Gate, and Obanla hostels starting at 8:30 PM. Please arrive early.',
        icon: 'bus'
      }
    },
    specialNotice: {
      title: 'Free Campus Shuttles Available',
      description: 'Shuttle buses will be running from North Gate, South Gate, and Obanla hostels starting at 8:30 PM. Please arrive early.',
      icon: 'bus'
    },
    aboutContent: [
      'Join us for an extraordinary Night of Worship themed "Arise and Shine." This is not just an event; it\'s a dedicated time to gather as a fellowship, lay down our burdens, and lift our voices in unified praise.',
      'Expect a powerful atmosphere filled with inspiring music, deeply moving testimonies, and an undeniable sense of divine presence. It is an opportunity to recharge spiritually and connect with fellow students on a deeper level.',
      'Red carpet and arrival photos commence at 8:30 PM. Hot tea and light breakfast will be served at dawn.'
    ],
    guestMinisters: [
      'Min. Jane Smith (Guest Worshipper)',
      'The ASF Voices of Praise Choir',
      'ASF Drama & Choreography Troupe',
      'Brother David Olatunji (Host)'
    ],
    mapCoordinates: { lat: 7.3020, lng: 5.1370 },
    directions: 'FUTA Central Auditorium, opposite the Senate Building.'
  },
  {
    id: 'evt-05',
    title: 'Foundational School Cohort B Orientation',
    shortDescription: 'Discipleship orientation session for new members and freshers.',
    description: 'Systematic discipleship onboarding covering Christian doctrines, prayer life, and fellowship heritage.',
    category: 'Fellowship',
    startDate: 'Saturday, Oct 25, 2026',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    month: 'OCT',
    dayNumber: '25',
    venue: 'Chapel Vestry',
    address: 'St. Jude\'s Chapel Vestry Room',
    mode: 'In-Person',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Foundational School Coordination Desk',
    speaker: 'VP & FS Facilitators',
    theme: 'Rooted and Grounded in Faith',
    status: 'Upcoming',
    isNextEvent: false,
    isSpecialEvent: false,
    isPrebundledOffline: true,
    agenda: [
      { time: '10:00 AM', title: 'Welcome & Icebreaker', description: 'Introduction of facilitators and student cohorts' },
      { time: '10:30 AM', title: 'Module 1 Overview: Christian Doctrines', description: 'Understanding the core pillars of faith' },
      { time: '11:15 AM', title: 'Distribution of Study Study Kits', description: 'Receiving coursebooks and reading assignments' }
    ],
    additionalInfo: {
      bibleNote: 'Bring your FS Coursebook or notepad.',
      dressCode: 'Casual & Comfortable'
    },
    aboutContent: [
      'Foundational School orientation for all newly registered students in Cohort B.',
      'Learn about the 6-module discipleship curriculum and meet your class facilitators.'
    ],
    mapCoordinates: { lat: 7.3006, lng: 5.1384 },
    directions: 'St. Jude\'s Chapel Vestry (Right Wing entrance).'
  },
  {
    id: 'evt-06',
    title: 'Evangelism & Medical Outreach',
    shortDescription: 'Community soul-winning and free basic health checkups for campus residents.',
    description: 'A practical demonstration of Christ\'s love through medical screening, free drug distribution, and personal evangelism.',
    category: 'Outreach',
    startDate: 'Saturday, Nov 01, 2026',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    month: 'NOV',
    dayNumber: '01',
    venue: 'Akindeko Hall Square',
    address: 'FUTA Student Residential Area',
    mode: 'In-Person',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Evangelism Unit & Medical Team',
    speaker: 'Evangelism Director & Medical Team Lead',
    theme: 'Demonstrating Christ in Word and Deed',
    status: 'Upcoming',
    isSpecialEvent: true,
    isNextEvent: false,
    isPrebundledOffline: false,
    agenda: [
      { time: '09:00 AM', title: 'Briefing & Prayer', description: 'Assigning teams to hostel blocks' },
      { time: '09:30 AM', title: 'Medical Screening & Consultations', description: 'Free BP check, blood sugar test, and eye tests' },
      { time: '01:00 PM', title: 'Personal Evangelism & Tract Distribution', description: 'Sharing the Gospel across Akindeko and Jibowu Halls' },
      { time: '02:30 PM', title: 'Debriefing & Thanksgiving Prayer', description: 'Rejoining at the square' }
    ],
    additionalInfo: {
      bibleNote: 'Matthew 25:35-40, Mark 16:15',
      dressCode: 'ASF Outreach T-shirt / Comfortable Sneakers',
      specialNotice: {
        title: 'Volunteers Needed',
        description: 'Medical students, nurses, and eager soul-winners are invited to register at the publicity desk.',
        icon: 'heart'
      }
    },
    specialNotice: {
      title: 'Volunteers Needed',
      description: 'Medical students, nurses, and eager soul-winners are invited to register at the publicity desk.',
      icon: 'heart'
    },
    aboutContent: [
      'Our annual outreach program brings practical healthcare and the gospel of salvation to the student body.',
      'Free medications, consultations, and counseling will be available throughout the day.'
    ],
    mapCoordinates: { lat: 7.2980, lng: 5.1430 },
    directions: 'Square between Akindeko Hall and Jibowu Hostel.'
  },
  {
    id: 'evt-07',
    title: 'Freshers Welcome & Orientation Service',
    shortDescription: 'Welcoming new 100-level students into the ASF family with joy and warmth.',
    description: 'Special thanksgiving service dedicated to welcoming all 100L freshers and direct-entry students to campus.',
    category: 'Fellowship',
    startDate: 'Sunday, Oct 05, 2026',
    startTime: '8:00 AM',
    endTime: '11:30 AM',
    month: 'OCT',
    dayNumber: '05',
    venue: "Sanctuary, St. Jude's Chapel",
    address: 'Main Campus, FUTA, Akure',
    mode: 'In-Person',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Publicity & Welfare Units',
    speaker: 'ASF President & Executive Board',
    theme: 'Welcome to the Household of Faith',
    status: 'Past',
    isPast: true,
    isNextEvent: false,
    isSpecialEvent: false,
    isPrebundledOffline: true,
    aboutContent: [
      'This event has passed. We welcomed over 250 freshers into the fellowship with gift packages and mentor pairing.'
    ],
    mapCoordinates: { lat: 7.3005, lng: 5.1382 }
  }
];

export function getNextEvent(events: EventItem[] = mockEvents): EventItem | undefined {
  return events.find(e => e.isNextEvent) || events.find(e => !e.isPast) || events[0];
}

export function searchEvents(
  query: string,
  category: string = 'All',
  source: EventItem[] = mockEvents,
  tab: string = 'Upcoming'
): EventItem[] {
  let results = source;

  // Filter by tab
  if (tab === 'Past Events') {
    results = results.filter(e => e.isPast || e.status === 'Past');
  } else if (tab === 'This Week') {
    results = results.filter(e => !e.isPast && (e.isToday || e.isSoon || e.month === 'OCT'));
  } else if (tab === 'This Month') {
    results = results.filter(e => !e.isPast && e.month === 'OCT');
  } else if (tab === 'Upcoming') {
    results = results.filter(e => !e.isPast);
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
    e.shortDescription.toLowerCase().includes(term) ||
    e.venue.toLowerCase().includes(term) ||
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
