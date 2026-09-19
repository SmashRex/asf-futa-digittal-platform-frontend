/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventItem, EventCategory } from '../../types/event';
import { mockEvents } from '../../data/eventData';
import { APP_CONFIG } from '../../config/app.config';
import { apiClient } from '../api/client';

export interface EventFilterParams {
  filter?: 'upcoming' | 'past';
  category?: EventCategory | 'All';
  searchQuery?: string;
  isOfflineSimulated?: boolean;
}

function normalizeEvent(raw: any): EventItem {
  if (!raw) return raw;
  const item = raw.data || raw;

  return {
    id: item.id || `evt-${Date.now()}`,
    title: item.title || 'Untitled Gathering',
    shortDescription: item.shortDescription || item.description?.slice(0, 100) || '',
    description: item.description || '',
    category: item.category || 'Fellowship',
    startDate: item.startDate || 'Upcoming',
    endDate: item.endDate,
    startTime: item.startTime || '5:00 PM',
    endTime: item.endTime || '7:00 PM',
    month: item.month || 'OCT',
    dayNumber: item.dayNumber || '25',
    venue: item.venue || 'Sanctuary',
    address: item.address || 'FUTA Main Campus',
    mode: item.mode || 'In-Person',
    image: item.image,
    organizer: item.organizer || 'ASF Executive Committee',
    speaker: item.speaker,
    speakerRole: item.speakerRole,
    speakerBio: item.speakerBio,
    theme: item.theme,
    agenda: item.agenda,
    additionalInfo: item.additionalInfo,
    specialNotice: item.specialNotice,
    aboutContent: item.aboutContent,
    guestMinisters: item.guestMinisters,
    status: item.status || 'Upcoming',
    isPast: item.isPast || item.status === 'Past',
    isToday: item.isToday || item.status === 'Happening Today',
    isSoon: item.isSoon || item.status === 'Starting Soon',
    isSpecialEvent: item.isSpecialEvent,
    isNextEvent: item.isNextEvent,
    isPrebundledOffline: Boolean(item.isPrebundledOffline),
    mapCoordinates: item.mapCoordinates,
    directions: item.directions
  };
}

class EventsService {
  /**
   * Fetch all events with optional filtering.
   * Confirmed Endpoints:
   * GET /api/events
   * GET /api/events?filter=upcoming
   * GET /api/events?filter=past
   * Note: Category and search filtering are performed client-side on fetched data.
   */
  async getEvents(params: EventFilterParams = {}): Promise<EventItem[]> {
    let items: EventItem[] = [];

    if (!APP_CONFIG.features.useMockServices) {
      const queryParams = new URLSearchParams();
      // Only confirmed filter params: upcoming or past
      if (params.filter === 'upcoming' || params.filter === 'past') {
        queryParams.append('filter', params.filter);
      }

      const qs = queryParams.toString();
      const res = await apiClient.get<any>(`/api/events${qs ? `?${qs}` : ''}`);
      const rawItems = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      items = rawItems.map(normalizeEvent);
    } else {
      items = [...mockEvents];
      if (params.filter === 'upcoming') {
        items = items.filter(e => e.status !== 'Past' && e.status !== 'Cancelled');
      } else if (params.filter === 'past') {
        items = items.filter(e => e.status === 'Past' || e.isPast);
      }
    }

    // Client-side filtration for offline simulation, category, and search query
    if (params.isOfflineSimulated) {
      items = items.filter(e => e.isPrebundledOffline);
    }

    if (params.category && params.category !== 'All') {
      items = items.filter(e => e.category === params.category);
    }

    if (params.searchQuery && params.searchQuery.trim() !== '') {
      const query = params.searchQuery.toLowerCase();
      items = items.filter(e => 
        e.title.toLowerCase().includes(query) || 
        e.description.toLowerCase().includes(query) ||
        e.venue.toLowerCase().includes(query) ||
        (e.theme && e.theme.toLowerCase().includes(query))
      );
    }

    return items;
  }

  /**
   * Fetch single event details by ID.
   * Resolves from the confirmed event list (GET /api/events).
   */
  async getEventById(id: string): Promise<EventItem | null> {
    if (!APP_CONFIG.features.useMockServices) {
      const allEvents = await this.getEvents();
      const found = allEvents.find(e => e.id === id);
      return found || null;
    }

    const found = mockEvents.find(e => e.id === id);
    return found || null;
  }

  /**
   * Get featured next event.
   * Confirmed Endpoint: GET /api/events/featured
   * When 404 NO_UPCOMING_EVENT is returned, treats as valid empty state and returns null.
   */
  async getFeaturedEvent(): Promise<EventItem | null> {
    if (!APP_CONFIG.features.useMockServices) {
      try {
        const res = await apiClient.get<any>('/api/events/featured');
        if (res.data) {
          return normalizeEvent(res.data);
        }
        return null;
      } catch (err: any) {
        // 404 NO_UPCOMING_EVENT is a legitimate empty state, NOT a failure
        if (err?.response?.status === 404 || err?.status === 404 || err?.message?.includes('NO_UPCOMING_EVENT')) {
          return null;
        }
        throw err;
      }
    }

    const featured = mockEvents.find(e => e.isNextEvent || e.isToday || e.status === 'Happening Today') || mockEvents[0];
    return featured || null;
  }

  /**
   * Get semester schedule timetable events (client-side helper using upcoming filter).
   */
  async getSemesterSchedule(): Promise<EventItem[]> {
    return this.getEvents({ filter: 'upcoming' });
  }

  /**
   * Alias for getSemesterSchedule.
   */
  async getSchedule(): Promise<EventItem[]> {
    return this.getSemesterSchedule();
  }

  /**
   * Create new event (Publicity Coordinator / General Secretary / Technical Admin).
   * Confirmed Endpoint: POST /api/events
   */
  async createEvent(eventData: Partial<EventItem>): Promise<EventItem> {
    if (!APP_CONFIG.features.useMockServices) {
      const res = await apiClient.post<any>('/api/events', eventData);
      return normalizeEvent(res.data);
    }

    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      title: eventData.title || 'Untitled Gathering',
      shortDescription: eventData.shortDescription || '',
      description: eventData.description || '',
      category: eventData.category || 'Worship',
      startDate: eventData.startDate || 'Upcoming',
      startTime: eventData.startTime || '5:00 PM',
      endTime: eventData.endTime || '7:00 PM',
      month: 'OCT',
      dayNumber: '25',
      venue: eventData.venue || 'Sanctuary',
      address: 'FUTA Main Campus',
      mode: eventData.mode || 'In-Person',
      organizer: 'ASF Executive Committee',
      status: 'Upcoming',
      ...eventData,
    };
    mockEvents.unshift(newEvent);
    return newEvent;
  }

  /**
   * Update existing event.
   * Confirmed Endpoint: PUT /api/events/:id
   */
  async updateEvent(id: string, eventData: Partial<EventItem>): Promise<EventItem> {
    if (!APP_CONFIG.features.useMockServices) {
      const res = await apiClient.put<any>(`/api/events/${id}`, eventData);
      return normalizeEvent(res.data);
    }

    const idx = mockEvents.findIndex(e => e.id === id);
    if (idx !== -1) {
      mockEvents[idx] = { ...mockEvents[idx], ...eventData };
      return mockEvents[idx];
    }
    return normalizeEvent(eventData);
  }

  /**
   * Soft cancel an event.
   * Confirmed Endpoint: PATCH /api/events/:id/cancel
   * The event remains visible with status = 'Cancelled'.
   * 409 ALREADY_CANCELLED is handled gracefully.
   */
  async cancelEvent(id: string): Promise<EventItem> {
    if (!APP_CONFIG.features.useMockServices) {
      try {
        const res = await apiClient.patch<any>(`/api/events/${id}/cancel`);
        return normalizeEvent(res.data);
      } catch (err: any) {
        if (err?.response?.status === 409 || err?.status === 409 || err?.message?.includes('ALREADY_CANCELLED')) {
          // Already cancelled: return item with status Cancelled
          return {
            id,
            title: 'Cancelled Event',
            shortDescription: '',
            description: '',
            category: 'Fellowship',
            startDate: '',
            startTime: '',
            endTime: '',
            month: '',
            dayNumber: '',
            venue: '',
            address: '',
            mode: 'In-Person',
            organizer: '',
            status: 'Cancelled'
          };
        }
        throw err;
      }
    }

    const idx = mockEvents.findIndex(e => e.id === id);
    if (idx !== -1) {
      mockEvents[idx] = { ...mockEvents[idx], status: 'Cancelled' };
      return mockEvents[idx];
    }
    return {
      id,
      title: 'Cancelled Event',
      shortDescription: '',
      description: '',
      category: 'Fellowship',
      startDate: '',
      startTime: '',
      endTime: '',
      month: '',
      dayNumber: '',
      venue: '',
      address: '',
      mode: 'In-Person',
      organizer: '',
      status: 'Cancelled'
    };
  }
}

export const eventsService = new EventsService();
