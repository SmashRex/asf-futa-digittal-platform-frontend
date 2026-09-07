/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Centralized configuration, endpoints, and route builders for the Song of Praise (SOP) Hymn Book.
 */
export const HYMN_CONFIG = {
  name: 'Song of Praise (SOP)',
  shortName: 'SOP Hymn Book',
  publisher: "Anglican Students' Fellowship (ASF FUTA)",
  totalPrebundled: 10,
  prebundledHymnNumbers: [1, 2, 3, 12, 15, 20, 45, 103, 142, 201],
  storageKeys: {
    bookmarks: 'asf_bookmarked_hymns',
    recentSearches: 'asf_hymn_recent_searches',
    lastRead: 'asf_hymn_last_read',
  }
};

export const HYMN_API_ENDPOINTS = {
  LIST: '/api/hymns',
  DETAIL: (idOrNumber: string | number) => `/api/hymns/${idOrNumber}`,
  BY_NUMBER: (num: number | string) => `/api/hymns/number/${num}`,
  CATEGORIES: '/api/hymns/categories',
  TODAY: '/api/hymns/today',
  SEARCH: (query: string) => `/api/hymns/search?q=${encodeURIComponent(query)}`,
  AUDIO: (idOrNumber: string | number) => `/api/hymns/${idOrNumber}/audio`,
};

export const HYMN_ROUTES = {
  HOME: '/hymns',
  SEARCH: '/hymns/search',
  BOOKMARKS: '/hymns/bookmarks',
  READER: (idOrNumber: string | number = ':hymnId') => `/hymns/read/${idOrNumber}`,
  DIRECT: (idOrNumber: string | number = ':hymnId') => `/hymns/${idOrNumber}`,
};

/**
 * Builds a standardized URL route to view a specific hymn.
 * Accepts either an explicit ID (e.g. "sop-201") or a numeric hymn number (e.g. 201 or "201").
 */
export function buildHymnRoute(idOrNumber: string | number): string {
  const clean = String(idOrNumber).trim().toLowerCase().replace(/^sop\s*[-_]?/i, '');
  if (/^\d+$/.test(clean)) {
    return `/hymns/read/sop-${clean}`;
  }
  return `/hymns/read/${String(idOrNumber).trim()}`;
}

/**
 * Parses user input or text references (e.g., "SOP 201", "Hymn 45", "sop-3") into a standardized identifier.
 */
export function parseHymnReference(ref: string): { id: string; number: number } | null {
  const clean = ref.trim();
  const match = clean.match(/(?:sop|hymn)?\s*[-_#]?\s*(\d+)/i);
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    return {
      id: `sop-${num}`,
      number: num,
    };
  }
  return null;
}
