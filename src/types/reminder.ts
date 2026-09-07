/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ReminderOffset = '15m' | '30m' | '1h' | '1d';

export interface EventReminderConfig {
  eventId: string;
  enabled: boolean;
  offset: ReminderOffset;
  savedAt: string;
}
