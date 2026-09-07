export interface WeeklyGathering {
  id: string;
  name: string;
  day: string;
  time: string;
  venue: string;
  description: string;
  category: 'worship' | 'word' | 'prayer' | 'fellowship';
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  category: string;
  imageUrl?: string;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  category: string;
}

export const weeklyGatherings: WeeklyGathering[] = [
  {
    id: 'sunday-service',
    name: 'Sunday Service',
    day: 'SUNDAY',
    time: '8:00 AM',
    venue: 'TBD (Official Venue)',
    description: 'We gather in worship, the Word, prayer, and fellowship.',
    category: 'worship'
  },
  {
    id: 'bible-study',
    name: 'Bible Study',
    day: 'TUESDAY',
    time: '5:30 PM',
    venue: 'TBD (Official Venue)',
    description: 'Opening God\'s Word together for practical Christian living.',
    category: 'word'
  },
  {
    id: 'prayer-meeting',
    name: 'Prayer Meeting',
    day: 'THURSDAY',
    time: '5:30 PM',
    venue: 'TBD (Official Venue)',
    description: 'A dedicated time of intercession and seeking God\'s presence together.',
    category: 'prayer'
  }
];

export const upcomingEvents: Event[] = [
  {
    id: 'freshers-welcome',
    title: 'Freshers\' Welcome',
    date: 'Saturday, Nov 12',
    time: '4:00 PM',
    venue: 'TBD (Official Venue)',
    description: 'A special evening to welcome all new students to the fellowship.',
    category: 'Special Service'
  }
];
