/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventCategory = 
  | 'Worship' 
  | 'Service' 
  | 'Bible Study' 
  | 'Prayer' 
  | 'Fellowship' 
  | 'Outreach' 
  | 'Seminar' 
  | 'Conference' 
  | 'Youth' 
  | 'Special Program';

export interface AgendaItem {
  time: string;
  title: string;
  description?: string;
}

export interface AdditionalEventInfo {
  bibleNote?: string;
  dressCode?: string;
  registrationUrl?: string;
  attendanceRequirements?: string;
  transportInfo?: string;
  specialNotice?: {
    title: string;
    description: string;
    icon?: string;
  };
}

export interface EventItem {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  month: string;
  dayNumber: string;
  venue: string;
  address: string;
  mode: 'In-Person' | 'Online / Zoom' | 'Hybrid';
  image?: string;
  organizer: string;
  speaker?: string;
  speakerRole?: string;
  speakerBio?: string;
  theme?: string;
  agenda?: AgendaItem[];
  additionalInfo?: AdditionalEventInfo;
  specialNotice?: {
    title: string;
    description: string;
    icon?: string;
  };
  aboutContent?: string[];
  guestMinisters?: string[];
  status?: 'Upcoming' | 'Happening Today' | 'Starting Soon' | 'Tomorrow' | 'Past';
  isPast?: boolean;
  isToday?: boolean;
  isSoon?: boolean;
  isSpecialEvent?: boolean;
  isNextEvent?: boolean;
  isPrebundledOffline?: boolean;
  mapCoordinates?: {
    lat: number;
    lng: number;
  };
  directions?: string;
}
