/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventCategory = 
  | 'Bible Study' 
  | 'Prayer' 
  | 'Worship' 
  | 'Outreach' 
  | 'Fellowship' 
  | 'Special Program'
  | 'Administrative';

export type EventMode = 'In-Person' | 'Online / Zoom' | 'Hybrid';

export type EventStatus = 'Active' | 'Cancelled';

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

/**
 * Frontend Event Object.
 * Reflects backend schema faithfully:
 * - id: string
 * - title: string
 * - category: EventCategory
 * - description: string | null
 * - location: string
 * - startTime: string (ISO 8601 with timezone)
 * - endTime: string | null (ISO 8601 with timezone)
 * - speaker: string | null
 * - speakerRole: string | null
 * - mode: EventMode
 * - theme: string | null
 * - imageUrl: string | null
 * - status: EventStatus ("Active" | "Cancelled")
 * - createdBy: string
 * - createdAt: string
 * - updatedAt: string
 */
export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  description: string | null;
  location: string;
  startTime: string;
  endTime: string | null;
  speaker: string | null;
  speakerRole: string | null;
  mode: EventMode;
  theme: string | null;
  imageUrl: string | null;
  status: EventStatus;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;

  // View presentation conveniences (derived during normalization)
  venue?: string; // alias for location
  address?: string;
  organizer?: string;
  image?: string; // alias for imageUrl
  shortDescription?: string;

  // Optional attributes for UI details
  agenda?: AgendaItem[];
  additionalInfo?: AdditionalEventInfo;
  specialNotice?: {
    title: string;
    description: string;
    icon?: string;
  };
  aboutContent?: string[];
  guestMinisters?: string[];
  mapCoordinates?: {
    lat: number;
    lng: number;
  };
  directions?: string;
  isPrebundledOffline?: boolean;
}

export interface CreateEventDto {
  title: string;
  location: string;
  startTime: string; // ISO string
  category?: EventCategory;
  description?: string | null;
  endTime?: string | null; // ISO string
  speaker?: string | null;
  speakerRole?: string | null;
  mode?: EventMode;
  theme?: string | null;
  imageUrl?: string | null;
}

export interface UpdateEventDto {
  title?: string;
  category?: EventCategory;
  description?: string | null;
  location?: string;
  startTime?: string;
  endTime?: string | null;
  speaker?: string | null;
  speakerRole?: string | null;
  mode?: EventMode;
  theme?: string | null;
  imageUrl?: string | null;
}
