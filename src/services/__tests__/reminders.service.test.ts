/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { remindersService } from '../reminders/reminders.service';

describe('Reminders Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return empty list when no reminders set', async () => {
    const list = await remindersService.getReminders();
    expect(list).toEqual([]);
  });

  it('should set, check, and remove a reminder for an event', async () => {
    expect(await remindersService.isReminderSet('evt-1')).toBe(false);

    await remindersService.setReminder('evt-1', '30m');
    expect(await remindersService.isReminderSet('evt-1')).toBe(true);

    const list = await remindersService.getReminders();
    expect(list).toContain('evt-1');

    await remindersService.removeReminder('evt-1');
    expect(await remindersService.isReminderSet('evt-1')).toBe(false);
  });
});
