/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventItem, EventCategory, EventMode, CreateEventDto, UpdateEventDto } from '../../types/event';
import { mockEvents } from '../../data/eventData';
import { APP_CONFIG } from '../../config/app.config';
import { apiClient } from '../api/client';

export interface EventFilterParams {
  filter?: 'upcoming' | 'past';
  category?: EventCategory | 'All';
  searchQuery?: string;
  isOfflineSimulated?: boolean;
}

export function normalizeEvent(raw: any): EventItem {
  if (!raw) return raw;
  const item = raw.data || raw;

  const location = item.location || item.venue || 'Fellowship Sanctuary, FUTA';
  const startTime = item.startTime || '';
  const endTime = item.endTime || null;
  const category = (item.category as EventCategory) || 'Fellowship';
  const status = item.status === 'Cancelled' ? 'Cancelled' : 'Active';
  const mode = (item.mode as EventMode) || 'In-Person';

  return {
    id: item.id || `evt-${Date.now()}`,
    title: item.title || 'Untitled Gathering',
    category,
    description: item.description ?? null,
    location,
    startTime,
    endTime,
    speaker: item.speaker ?? null,
    speakerRole: item.speakerRole ?? null,
    mode,
    theme: item.theme ?? null,
    imageUrl: item.imageUrl || item.image || null,
    status,
    createdBy: item.createdBy || 'asf-technical-admin',
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),

    // View presentation conveniences:
    venue: location,
    image: item.imageUrl || item.image || undefined,
    shortDescription: item.shortDescription || (item.description ? item.description.slice(0, 140) : ''),

    // Optional attributes:
    agenda: item.agenda,
    additionalInfo: item.additionalInfo,
    specialNotice: item.specialNotice,
    aboutContent: item.aboutContent,
    guestMinisters: item.guestMinisters,
    mapCoordinates: item.mapCoordinates,
    directions: item.directions,
    isPrebundledOffline: Boolean(item.isPrebundledOffline),
  };
}

class EventsService {
  /**
   * Fetch events with optional filter parameters.
   * Confirmed Backend Endpoints:
   * GET /api/events
   * GET /api/events?filter=upcoming
   * GET /api/events?filter=past
   */
  async getEvents(params: EventFilterParams = {}): Promise<EventItem[]> {
    let items: EventItem[] = [];

    if (!APP_CONFIG.features.useMockServices) {
      const queryParams = new URLSearchParams();
      if (params.filter === 'upcoming' || params.filter === 'past') {
        queryParams.append('filter', params.filter);
      }

      const qs = queryParams.toString();
      const res = await apiClient.get<any>(`/events${qs ? `?${qs}` : ''}`);
      const rawItems = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      items = rawItems.map(normalizeEvent);
    } else {
      items = mockEvents.map(normalizeEvent);
      if (params.filter === 'upcoming') {
        // Backend returns upcoming events including cancelled ones, ordered chronologically
        items = items.filter(e => {
          if (!e.startTime) return true;
          const dt = new Date(e.startTime);
          return isNaN(dt.getTime()) || dt >= new Date(Date.now() - 24 * 3600 * 1000);
        });
      } else if (params.filter === 'past') {
        items = items.filter(e => {
          if (!e.startTime) return false;
          const dt = new Date(e.startTime);
          return !isNaN(dt.getTime()) && dt < new Date(Date.now() - 24 * 3600 * 1000);
        });
      }
    }

    // Client-side filtering for offline simulation, category, and search query
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
        (e.description && e.description.toLowerCase().includes(query)) ||
        e.location.toLowerCase().includes(query) ||
        (e.theme && e.theme.toLowerCase().includes(query)) ||
        (e.speaker && e.speaker.toLowerCase().includes(query))
      );
    }

    return items;
  }

  /**
   * Fetch upcoming events directly via backend GET /api/events?filter=upcoming
   */
  async getUpcomingEvents(params: Omit<EventFilterParams, 'filter'> = {}): Promise<EventItem[]> {
    return this.getEvents({ ...params, filter: 'upcoming' });
  }

  /**
   * Fetch past events directly via backend GET /api/events?filter=past
   */
  async getPastEvents(params: Omit<EventFilterParams, 'filter'> = {}): Promise<EventItem[]> {
    return this.getEvents({ ...params, filter: 'past' });
  }

  /**
   * Fetch featured next event directly via backend GET /api/events/featured.
   * If 404 NO_UPCOMING_EVENT is returned, safely treats as empty state and returns null.
   */
  async getFeaturedEvent(): Promise<EventItem | null> {
    if (!APP_CONFIG.features.useMockServices) {
      try {
        const res = await apiClient.get<any>('/events/featured');
        if (res.data) {
          return normalizeEvent(res.data);
        }
        return null;
      } catch (err: any) {
        // 404 NO_UPCOMING_EVENT is a legitimate empty state, NOT a failure
        if (
          err?.statusCode === 404 || 
          err?.status === 404 || 
          err?.code === 'NO_UPCOMING_EVENT' ||
          err?.message?.includes('NO_UPCOMING_EVENT')
        ) {
          return null;
        }
        throw err;
      }
    }

    // In mock simulation mode: return first active upcoming gathering
    const active = mockEvents.find(e => e.status !== 'Cancelled');
    return active ? normalizeEvent(active) : null;
  }

  /**
   * Fetch single event details by ID.
   * Resolves from the confirmed event list (GET /api/events).
   */
  async getEventById(id: string): Promise<EventItem | null> {
    if (!APP_CONFIG.features.useMockServices) {
      try {
        const allEvents = await this.getEvents();
        const found = allEvents.find(e => e.id === id);
        return found || null;
      } catch (err) {
        return null;
      }
    }

    const found = mockEvents.find(e => e.id === id);
    return found ? normalizeEvent(found) : null;
  }

  /**
   * Fetch semester schedule timetable (based on upcoming events).
   */
  async getSemesterSchedule(): Promise<EventItem[]> {
    return this.getUpcomingEvents();
  }

  /**
   * Alias for getSemesterSchedule.
   */
  async getSchedule(): Promise<EventItem[]> {
    return this.getSemesterSchedule();
  }

  /**
   * Create new event.
   * Confirmed Endpoint: POST /api/events
   * Required: title, location, startTime
   */
  async createEvent(eventData: CreateEventDto): Promise<EventItem> {
    const payload: Record<string, any> = {
      title: eventData.title,
      location: eventData.location,
      startTime: eventData.startTime,
    };

    if (eventData.category) payload.category = eventData.category;
    if (eventData.description !== undefined) payload.description = eventData.description;
    if (eventData.endTime !== undefined) payload.endTime = eventData.endTime;
    if (eventData.speaker !== undefined) payload.speaker = eventData.speaker;
    if (eventData.speakerRole !== undefined) payload.speakerRole = eventData.speakerRole;
    if (eventData.mode) payload.mode = eventData.mode;
    if (eventData.theme !== undefined) payload.theme = eventData.theme;
    if (eventData.imageUrl !== undefined) payload.imageUrl = eventData.imageUrl;

    if (!APP_CONFIG.features.useMockServices) {
      const res = await apiClient.post<any>('/events', payload);
      return normalizeEvent(res.data);
    }

    const newEvent: EventItem = normalizeEvent({
      id: `evt-${Date.now()}`,
      status: 'Active',
      ...payload
    });
    mockEvents.unshift(newEvent);
    return newEvent;
  }

  /**
   * Update existing event.
   * Confirmed Endpoint: PUT /api/events/:id
   */
  async updateEvent(id: string, eventData: UpdateEventDto): Promise<EventItem> {
    const payload: Record<string, any> = {};
    if (eventData.title !== undefined) payload.title = eventData.title;
    if (eventData.category !== undefined) payload.category = eventData.category;
    if (eventData.description !== undefined) payload.description = eventData.description;
    if (eventData.location !== undefined) payload.location = eventData.location;
    if (eventData.startTime !== undefined) payload.startTime = eventData.startTime;
    if (eventData.endTime !== undefined) payload.endTime = eventData.endTime;
    if (eventData.speaker !== undefined) payload.speaker = eventData.speaker;
    if (eventData.speakerRole !== undefined) payload.speakerRole = eventData.speakerRole;
    if (eventData.mode !== undefined) payload.mode = eventData.mode;
    if (eventData.theme !== undefined) payload.theme = eventData.theme;
    if (eventData.imageUrl !== undefined) payload.imageUrl = eventData.imageUrl;

    if (!APP_CONFIG.features.useMockServices) {
      const res = await apiClient.put<any>(`/events/${id}`, payload);
      return normalizeEvent(res.data);
    }

    const idx = mockEvents.findIndex(e => e.id === id);
    if (idx !== -1) {
      const updated = normalizeEvent({ ...mockEvents[idx], ...payload });
      mockEvents[idx] = updated;
      return updated;
    }
    return normalizeEvent({ id, ...payload });
  }

  /**
   * Soft cancel an event.
   * Confirmed Endpoint: PATCH /api/events/:id/cancel (no body)
   * 409 ALREADY_CANCELLED handled cleanly.
   */
  async cancelEvent(id: string): Promise<EventItem> {
    if (!APP_CONFIG.features.useMockServices) {
      try {
        const res = await apiClient.patch<any>(`/events/${id}/cancel`);
        return normalizeEvent(res.data);
      } catch (err: any) {
        if (
          err?.statusCode === 409 || 
          err?.status === 409 || 
          err?.code === 'ALREADY_CANCELLED' ||
          err?.message?.includes('ALREADY_CANCELLED')
        ) {
          // Already cancelled: return existing event with Cancelled status
          const existing = await this.getEventById(id);
          if (existing) {
            return { ...existing, status: 'Cancelled' };
          }
          return normalizeEvent({
            id,
            status: 'Cancelled',
            title: 'Cancelled Event',
            location: 'Fellowship Sanctuary, FUTA',
            startTime: new Date().toISOString(),
            mode: 'In-Person',
            category: 'Fellowship'
          });
        }
        throw err;
      }
    }

    const idx = mockEvents.findIndex(e => e.id === id);
    if (idx !== -1) {
      mockEvents[idx] = { ...mockEvents[idx], status: 'Cancelled' };
      return normalizeEvent(mockEvents[idx]);
    }
    return normalizeEvent({
      id,
      title: 'Cancelled Event',
      status: 'Cancelled',
      location: 'Fellowship Sanctuary, FUTA',
      startTime: new Date().toISOString(),
      mode: 'In-Person',
      category: 'Fellowship'
    });
  }
}

export const eventsService = new EventsService();
