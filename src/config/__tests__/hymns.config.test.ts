/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { 
  buildHymnRoute, 
  parseHymnReference, 
  HYMN_CONFIG, 
  HYMN_API_ENDPOINTS, 
  HYMN_ROUTES 
} from '../hymns.config';

describe('Hymn Config & Route Builders', () => {
  it('builds standard hymn reader routes from numbers and IDs', () => {
    expect(buildHymnRoute(201)).toBe('/hymns/read/sop-201');
    expect(buildHymnRoute('201')).toBe('/hymns/read/sop-201');
    expect(buildHymnRoute('sop-201')).toBe('/hymns/read/sop-201');
    expect(buildHymnRoute('SOP 45')).toBe('/hymns/read/sop-45');
    expect(buildHymnRoute('custom-hymn-id')).toBe('/hymns/read/custom-hymn-id');
  });

  it('parses hymn references from various text formats', () => {
    expect(parseHymnReference('SOP 201')).toEqual({ id: 'sop-201', number: 201 });
    expect(parseHymnReference('Hymn 45')).toEqual({ id: 'sop-45', number: 45 });
    expect(parseHymnReference('sop-103')).toEqual({ id: 'sop-103', number: 103 });
    expect(parseHymnReference('201')).toEqual({ id: 'sop-201', number: 201 });
    expect(parseHymnReference('#12')).toEqual({ id: 'sop-12', number: 12 });
    expect(parseHymnReference('non-numeric')).toBeNull();
  });

  it('provides complete and valid API endpoints', () => {
    expect(HYMN_API_ENDPOINTS.LIST).toBe('/api/hymns');
    expect(HYMN_API_ENDPOINTS.DETAIL('sop-201')).toBe('/api/hymns/sop-201');
    expect(HYMN_API_ENDPOINTS.BY_NUMBER(201)).toBe('/api/hymns/number/201');
    expect(HYMN_API_ENDPOINTS.CATEGORIES).toBe('/api/hymns/categories');
    expect(HYMN_API_ENDPOINTS.TODAY).toBe('/api/hymns/today');
    expect(HYMN_API_ENDPOINTS.SEARCH('grace')).toBe('/api/hymns/search?q=grace');
  });

  it('contains expected configuration constants', () => {
    expect(HYMN_CONFIG.shortName).toBe('SOP Hymn Book');
    expect(HYMN_CONFIG.prebundledHymnNumbers).toContain(201);
    expect(HYMN_CONFIG.prebundledHymnNumbers).toContain(1);
    expect(HYMN_ROUTES.HOME).toBe('/hymns');
  });
});
