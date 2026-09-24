/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { 
  formatEventDate, 
  formatEventTime, 
  formatEventDateTime,
  getEventMonth,
  getEventDay,
  getLagosDateInput,
  getLagosTimeInput,
  buildLagosIso
} from '../eventDate';

describe('eventDate timezone utilities (Africa/Lagos / WAT / UTC+1)', () => {
  it('correctly maps 5:00 PM WAT to 16:00:00.000Z UTC ISO string', () => {
    const iso = buildLagosIso('2026-10-19', '17:00');
    expect(iso).toBe('2026-10-19T16:00:00.000Z');
  });

  it('correctly maps midnight rollover in WAT (00:30 WAT on Oct 20 -> 23:30Z on Oct 19)', () => {
    const iso = buildLagosIso('2026-10-20', '00:30');
    expect(iso).toBe('2026-10-19T23:30:00.000Z');
  });

  it('extracts date and time strictly in Africa/Lagos timezone for HTML inputs', () => {
    // 23:30 UTC on Oct 19 is 00:30 WAT on Oct 20
    const utcIso = '2026-10-19T23:30:00.000Z';
    const lagosDate = getLagosDateInput(utcIso);
    const lagosTime = getLagosTimeInput(utcIso);

    expect(lagosDate).toBe('2026-10-20');
    expect(lagosTime).toBe('00:30');
  });

  it('formats time with null endTime as single start time without trailing dashes', () => {
    const startIso = '2026-10-19T16:00:00.000Z'; // 5:00 PM WAT
    const formatted = formatEventTime(startIso, null);
    expect(formatted).toBe('5:00 PM');
  });

  it('formats time with endTime as a range in Africa/Lagos', () => {
    const startIso = '2026-10-19T16:00:00.000Z'; // 5:00 PM WAT
    const endIso = '2026-10-19T18:00:00.000Z';   // 7:00 PM WAT
    const formatted = formatEventTime(startIso, endIso);
    expect(formatted).toBe('5:00 PM – 7:00 PM');
  });

  it('formats event date with correct day and month in Africa/Lagos', () => {
    const startIso = '2026-10-19T16:00:00.000Z';
    expect(getEventMonth(startIso)).toBe('OCT');
    expect(getEventDay(startIso)).toBe('19');
    expect(formatEventDate(startIso, false)).toBe('Monday, October 19');
  });
});
