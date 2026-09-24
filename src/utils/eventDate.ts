/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const LAGOS_TIMEZONE = 'Africa/Lagos';

/**
 * Format date in Africa/Lagos timezone (e.g. "Sunday, October 4" or "Sunday, October 4, 2026")
 */
export function formatEventDate(isoString: string, includeYear = false, fallback = ''): string {
  if (!isoString) return fallback;
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return fallback || isoString;

  return new Intl.DateTimeFormat('en-US', {
    timeZone: LAGOS_TIMEZONE,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {})
  }).format(date);
}

/**
 * Format time in Africa/Lagos timezone (WAT / UTC+1).
 * If endTime is provided: "5:00 PM – 7:30 PM"
 * If endTime is null/undefined: "5:00 PM"
 */
export function formatEventTime(startTimeIso: string, endTimeIso?: string | null, fallback = ''): string {
  if (!startTimeIso) return fallback;

  const startDate = new Date(startTimeIso);
  const isValidStart = !isNaN(startDate.getTime());

  const startFormatted = isValidStart
    ? new Intl.DateTimeFormat('en-US', {
        timeZone: LAGOS_TIMEZONE,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(startDate)
    : startTimeIso;

  if (!endTimeIso) {
    return startFormatted;
  }

  const endDate = new Date(endTimeIso);
  const isValidEnd = !isNaN(endDate.getTime());

  const endFormatted = isValidEnd
    ? new Intl.DateTimeFormat('en-US', {
        timeZone: LAGOS_TIMEZONE,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(endDate)
    : endTimeIso;

  return `${startFormatted} – ${endFormatted}`;
}

/**
 * Combined Date + Time presentation (e.g. "Sunday, October 4 • 5:00 PM")
 */
export function formatEventDateTime(startTimeIso: string, endTimeIso?: string | null): string {
  const dateStr = formatEventDate(startTimeIso);
  const timeStr = formatEventTime(startTimeIso, endTimeIso);
  if (!dateStr && !timeStr) return '';
  if (!dateStr) return timeStr;
  if (!timeStr) return dateStr;
  return `${dateStr} • ${timeStr}`;
}

/**
 * Returns 3-letter month (e.g. "OCT", "NOV") in Africa/Lagos timezone
 */
export function getEventMonth(startTimeIso: string, fallback = ''): string {
  if (!startTimeIso) return fallback;
  const date = new Date(startTimeIso);
  if (isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat('en-US', {
    timeZone: LAGOS_TIMEZONE,
    month: 'short'
  }).format(date).toUpperCase();
}

/**
 * Returns day number (e.g. "4", "25") in Africa/Lagos timezone
 */
export function getEventDay(startTimeIso: string, fallback = ''): string {
  if (!startTimeIso) return fallback;
  const date = new Date(startTimeIso);
  if (isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat('en-US', {
    timeZone: LAGOS_TIMEZONE,
    day: 'numeric'
  }).format(date);
}

/**
 * Returns full month name (e.g. "October", "November") in Africa/Lagos timezone
 */
export function getEventMonthLong(startTimeIso: string, fallback = ''): string {
  if (!startTimeIso) return fallback;
  const date = new Date(startTimeIso);
  if (isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat('en-US', {
    timeZone: LAGOS_TIMEZONE,
    month: 'long'
  }).format(date);
}

/**
 * Helper to check if an event falls in the current calendar week for presentation grouping
 */
export function isEventThisWeek(startTimeIso: string): boolean {
  if (!startTimeIso) return false;
  const date = new Date(startTimeIso);
  if (isNaN(date.getTime())) return false;

  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay(); // 0 is Sunday
  startOfWeek.setDate(now.getDate() - day);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return date >= startOfWeek && date < endOfWeek;
}

/**
 * Extract YYYY-MM-DD in Africa/Lagos timezone for HTML date input
 */
export function getLagosDateInput(isoString?: string | null): string {
  const date = isoString ? new Date(isoString) : new Date();
  if (isNaN(date.getTime())) return '';

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: LAGOS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  return `${year}-${month}-${day}`;
}

/**
 * Extract HH:mm in Africa/Lagos timezone for HTML time input (24-hour)
 */
export function getLagosTimeInput(isoString?: string | null): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: LAGOS_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date);

  const hour = parts.find(p => p.type === 'hour')?.value;
  const minute = parts.find(p => p.type === 'minute')?.value;
  return `${hour}:${minute}`;
}

/**
 * Combine YYYY-MM-DD and HH:mm from Africa/Lagos into an authoritative UTC ISO string.
 * Example: 2026-10-19 + 17:00 WAT -> 2026-10-19T16:00:00.000Z
 */
export function buildLagosIso(dateStr: string, timeStr: string): string {
  if (!dateStr || !timeStr) return '';
  const d = new Date(`${dateStr}T${timeStr}:00+01:00`);
  return isNaN(d.getTime()) ? '' : d.toISOString();
}

