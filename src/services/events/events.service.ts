/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventItem, EventCategory } from '../../types/event';
import { mockEvents } from '../../data/eventData';
import { APP_CONFIG } from '../../config/app.config';
import { API_CONFIG } from '../../config/api.config';

export interface EventFilterParams {
  category?: EventCategory | 'All';
  horizon?: 'all' | 'upcoming' | 'today' | 'past';
  searchQuery?: string;
  isOfflineSimulated?: boolean;
}

class EventsService {
  /**
   * Fetch all events with optional filtering.
   * Expected Backend Endpoint: GET /api/events?category=...&horizon=...
   */
  async getEvents(params: EventFilterParams = {}): Promise<EventItem[]> {
    if (!APP_CONFIG.features.useMockServices) {
      const queryParams = new URLSearchParams();
      if (params.category && params.category !== 'All') queryParams.append('category', params.category);
      if (params.horizon && params.horizon !== 'all') queryParams.append('horizon', params.horizon);
      if (params.searchQuery) queryParams.append('search', params.searchQuery);

      const response = await fetch(`${API_CONFIG.baseUrl}/events?${queryParams.toString()}`);
      const result = await response.json();
      return result.data || [];
    }

    // Client-side filtration over canonical event dataset
    let events = [...mockEvents];

    if (params.isOfflineSimulated) {
      events = events.filter(e => e.isPrebundledOffline);
    }

    if (params.category && params.category !== 'All') {
      events = events.filter(e => e.category === params.category);
    }

    if (params.horizon) {
      switch (params.horizon) {
        case 'upcoming':
          events = events.filter(e => e.status === 'Upcoming' || e.status === 'Starting Soon' || e.status === 'Tomorrow');
          break;
        case 'today':
          events = events.filter(e => e.status === 'Happening Today' || e.isToday);
          break;
        case 'past':
          events = events.filter(e => e.status === 'Past' || e.isPast);
          break;
      }
    }

    if (params.searchQuery && params.searchQuery.trim() !== '') {
      const query = params.searchQuery.toLowerCase();
      events = events.filter(e => 
        e.title.toLowerCase().includes(query) || 
        e.description.toLowerCase().includes(query) ||
        e.venue.toLowerCase().includes(query) ||
        (e.theme && e.theme.toLowerCase().includes(query))
      );
    }

    return events;
  }

  /**
   * Fetch single event details by ID.
   * Expected Backend Endpoint: GET /api/events/:id
   */
  async getEventById(id: string): Promise<EventItem | null> {
    if (!APP_CONFIG.features.useMockServices) {
      const response = await fetch(`${API_CONFIG.baseUrl}/events/${id}`);
      if (!response.ok) return null;
      const result = await response.json();
      return result.data || null;
    }

    const found = mockEvents.find(e => e.id === id);
    return found || null;
  }

  /**
   * Get featured next event.
   * Expected Backend Endpoint: GET /api/events/featured
   */
  async getFeaturedEvent(): Promise<EventItem | null> {
    const events = await this.getEvents();
    const featured = events.find(e => e.isNextEvent || e.isToday || e.status === 'Happening Today') || events[0];
    return featured || null;
  }

  /**
   * Get semester schedule timetable events.
   * Expected Backend Endpoint: GET /api/events/schedule
   */
  async getSemesterSchedule(): Promise<EventItem[]> {
    const events = await this.getEvents();
    return events;
  }

  /**
   * Alias for getSemesterSchedule.
   */
  async getSchedule(): Promise<EventItem[]> {
    return this.getSemesterSchedule();
  }

  /**
   * Create new event (PRO / Executive / Admin).
   * Expected Backend Endpoint: POST /api/events
   */
  async createEvent(eventData: Partial<EventItem>): Promise<EventItem> {
    if (!APP_CONFIG.features.useMockServices) {
      const response = await fetch(`${API_CONFIG.baseUrl}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      const result = await response.json();
      return result.data;
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
}

export const eventsService = new EventsService();
