/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReminderOffset, EventReminderConfig } from '../../types/reminder';
import { APP_CONFIG } from '../../config/app.config';
import { API_CONFIG } from '../../config/api.config';

class RemindersService {
  /**
   * Get all active reminders.
   * Expected Backend Endpoint: GET /api/reminders
   */
  async getActiveReminders(): Promise<string[]> {
    try {
      const saved = localStorage.getItem(APP_CONFIG.storageKeys.eventReminders);
      return saved !== null ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  /**
   * Check if a specific event has active reminder set.
   */
  async isEventReminded(eventId: string): Promise<boolean> {
    const reminders = await this.getActiveReminders();
    return reminders.includes(eventId);
  }

  /**
   * Set reminder for an event.
   * Expected Backend Endpoint: POST /api/events/:id/remind
   */
  async setEventReminder(eventId: string, offset: ReminderOffset = '30m'): Promise<boolean> {
    if (!APP_CONFIG.features.useMockServices) {
      await fetch(`${API_CONFIG.baseUrl}/events/${eventId}/remind`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ offset }),
      });
    }

    const reminders = await this.getActiveReminders();
    if (!reminders.includes(eventId)) {
      reminders.push(eventId);
      localStorage.setItem(APP_CONFIG.storageKeys.eventReminders, JSON.stringify(reminders));
    }
    return true;
  }

  /**
   * Remove reminder for an event.
   * Expected Backend Endpoint: DELETE /api/events/:id/remind
   */
  async removeEventReminder(eventId: string): Promise<boolean> {
    if (!APP_CONFIG.features.useMockServices) {
      await fetch(`${API_CONFIG.baseUrl}/events/${eventId}/remind`, {
        method: 'DELETE',
        credentials: 'include',
      });
    }

    const reminders = await this.getActiveReminders();
    const updated = reminders.filter(id => id !== eventId);
    localStorage.setItem(APP_CONFIG.storageKeys.eventReminders, JSON.stringify(updated));
    return false;
  }

  // Aliases for unified service interface
  async getReminders(): Promise<string[]> {
    return this.getActiveReminders();
  }

  async isReminderSet(eventId: string): Promise<boolean> {
    return this.isEventReminded(eventId);
  }

  async setReminder(eventId: string, offset: ReminderOffset = '30m'): Promise<boolean> {
    return this.setEventReminder(eventId, offset);
  }

  async removeReminder(eventId: string): Promise<boolean> {
    return this.removeEventReminder(eventId);
  }

  /**
   * Toggle event reminder.
   */
  async toggleEventReminder(eventId: string, offset?: ReminderOffset): Promise<boolean> {
    const isReminded = await this.isEventReminded(eventId);
    if (isReminded && !offset) {
      await this.removeEventReminder(eventId);
      return false;
    } else {
      await this.setEventReminder(eventId, offset || '30m');
      return true;
    }
  }
}

export const remindersService = new RemindersService();
