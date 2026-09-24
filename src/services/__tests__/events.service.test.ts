/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { eventsService } from '../events/events.service';

describe('Events Service', () => {
  it('should fetch upcoming events in mock mode', async () => {
    const events = await eventsService.getUpcomingEvents();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
    events.forEach(ev => {
      expect(ev.location).toBeDefined();
      expect(ev.startTime).toBeDefined();
    });
  });

  it('should fetch past events in mock mode', async () => {
    const pastEvents = await eventsService.getPastEvents();
    expect(Array.isArray(pastEvents)).toBe(true);
  });

  it('should fetch featured event or return null gracefully', async () => {
    const featured = await eventsService.getFeaturedEvent();
    if (featured) {
      expect(featured.id).toBeDefined();
      expect(featured.title).toBeDefined();
      expect(featured.location).toBeDefined();
    }
  });

  it('should filter events by category', async () => {
    const worshipEvents = await eventsService.getEvents({ category: 'Worship' });
    worshipEvents.forEach(evt => {
      expect(evt.category).toBe('Worship');
    });
  });

  it('should filter events by search query', async () => {
    const results = await eventsService.getEvents({ searchQuery: 'worship' });
    expect(results.length).toBeGreaterThan(0);
    results.forEach(evt => {
      const match = 
        evt.title.toLowerCase().includes('worship') ||
        (evt.description && evt.description.toLowerCase().includes('worship')) ||
        evt.category.toLowerCase().includes('worship') ||
        (evt.location && evt.location.toLowerCase().includes('worship')) ||
        (evt.theme && evt.theme.toLowerCase().includes('worship'));
      expect(match).toBe(true);
    });
  });

  it('should retrieve event by ID or return null if not found', async () => {
    const existing = await eventsService.getEventById('evt-01');
    expect(existing).not.toBeNull();
    expect(existing?.id).toBe('evt-01');

    const nonExistent = await eventsService.getEventById('non-existent-id-999');
    expect(nonExistent).toBeNull();
  });

  it('should fetch calendar semester schedule items', async () => {
    const schedule = await eventsService.getSemesterSchedule();
    expect(Array.isArray(schedule)).toBe(true);
    expect(schedule.length).toBeGreaterThan(0);
  });

  it('should support cancellation of an event', async () => {
    const cancelled = await eventsService.cancelEvent('evt-02');
    expect(cancelled.status).toBe('Cancelled');
  });
});
