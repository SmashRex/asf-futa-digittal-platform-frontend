/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HymnItem, HymnFilterParams, HymnCategorySummary } from '../../types';
import { mockHymns, searchHymns as localSearchHymns } from '../../data/hymnData';
import { HYMN_API_ENDPOINTS, parseHymnReference } from '../../config/hymns.config';
import { APP_CONFIG } from '../../config/app.config';
import { apiClient } from '../api/client';

export const hymnsService = {
  /**
   * Fetch a list of hymns, optionally filtered by search query, category, or flags.
   */
  async getHymns(params?: HymnFilterParams): Promise<HymnItem[]> {
    if (APP_CONFIG.features.useMockServices) {
      let result = [...mockHymns];

      if (params?.query && params.query.trim()) {
        result = localSearchHymns(params.query.trim(), result);
      }

      if (params?.category && params.category !== 'All') {
        result = result.filter(h => h.category.toLowerCase() === params.category!.toLowerCase());
      }

      if (params?.onlyToday) {
        result = result.filter(h => h.isTodayService);
      }

      return result;
    }

    const queryParams = new URLSearchParams();
    if (params?.query) queryParams.set('q', params.query);
    if (params?.category && params.category !== 'All') queryParams.set('category', params.category);
    if (params?.onlyToday) queryParams.set('today', 'true');

    const url = `${HYMN_API_ENDPOINTS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const res = await apiClient.get<HymnItem[]>(url);
    return res.data;
  },

  /**
   * Fetch a hymn by its explicit identifier (e.g. "sop-201" or numeric ID).
   */
  async getHymnById(id: string): Promise<HymnItem | null> {
    if (APP_CONFIG.features.useMockServices) {
      const cleanId = id.trim().toLowerCase();
      // Try exact ID match
      let hymn = mockHymns.find(h => h.id.toLowerCase() === cleanId);
      if (hymn) return hymn;

      // Try numeric match
      const parsed = parseHymnReference(id);
      if (parsed) {
        hymn = mockHymns.find(h => h.number === parsed.number || h.id === parsed.id);
        if (hymn) return hymn;
      }
      return null;
    }

    const res = await apiClient.get<HymnItem>(HYMN_API_ENDPOINTS.DETAIL(id));
    return res.data;
  },

  /**
   * Fetch a hymn by its hymn number (e.g. 201 or "201").
   */
  async getHymnByNumber(num: number | string): Promise<HymnItem | null> {
    const numVal = typeof num === 'string' ? parseInt(num.replace(/\D/g, ''), 10) : num;
    if (isNaN(numVal)) return null;

    if (APP_CONFIG.features.useMockServices) {
      return mockHymns.find(h => h.number === numVal) || null;
    }

    const res = await apiClient.get<HymnItem>(HYMN_API_ENDPOINTS.BY_NUMBER(numVal));
    return res.data;
  },

  /**
   * Flexible helper to resolve a hymn by either ID or numeric string / number.
   */
  async getHymnByIdOrNumber(idOrNumber: string | number): Promise<HymnItem | null> {
    if (typeof idOrNumber === 'number') {
      return this.getHymnByNumber(idOrNumber);
    }
    return this.getHymnById(idOrNumber);
  },

  /**
   * Search hymns across numbers, titles, authors, chorus, and lyrics.
   */
  async searchHymns(query: string): Promise<HymnItem[]> {
    if (APP_CONFIG.features.useMockServices) {
      return localSearchHymns(query, mockHymns);
    }

    const res = await apiClient.get<HymnItem[]>(HYMN_API_ENDPOINTS.SEARCH(query));
    return res.data;
  },

  /**
   * Get all distinct categories of hymns.
   */
  async getCategories(): Promise<string[]> {
    if (APP_CONFIG.features.useMockServices) {
      const categories = Array.from(new Set(mockHymns.map(h => h.category)));
      return categories.sort();
    }

    const res = await apiClient.get<string[]>(HYMN_API_ENDPOINTS.CATEGORIES);
    return res.data;
  },

  /**
   * Get category summaries with item counts.
   */
  async getCategorySummaries(): Promise<HymnCategorySummary[]> {
    const hymns = await this.getHymns();
    const map = new Map<string, number>();

    hymns.forEach(h => {
      const cat = h.category || 'General';
      map.set(cat, (map.get(cat) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => a.name.localeCompare(b.name));
  },

  /**
   * Get today's featured / service hymn.
   */
  async getTodayHymn(): Promise<HymnItem | null> {
    if (APP_CONFIG.features.useMockServices) {
      return mockHymns.find(h => h.isTodayService) || mockHymns[0] || null;
    }

    const res = await apiClient.get<HymnItem>(HYMN_API_ENDPOINTS.TODAY);
    return res.data;
  },

  /**
   * Get adjacent (previous and next) hymns in sequential order.
   */
  async getAdjacentHymns(currentIdOrNumber: string | number): Promise<{ prev: HymnItem | null; next: HymnItem | null }> {
    const hymns = await this.getHymns();
    const sorted = [...hymns].sort((a, b) => a.number - b.number);

    let currentIndex = -1;
    if (typeof currentIdOrNumber === 'number') {
      currentIndex = sorted.findIndex(h => h.number === currentIdOrNumber);
    } else {
      const clean = currentIdOrNumber.trim().toLowerCase();
      currentIndex = sorted.findIndex(h => h.id.toLowerCase() === clean || h.number.toString() === clean);
    }

    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
    const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

    return { prev, next };
  },

  /**
   * Get list of available hymn numbers for quick navigation chips.
   */
  async getQuickNumbers(): Promise<number[]> {
    const hymns = await this.getHymns();
    return hymns.map(h => h.number).sort((a, b) => a - b);
  }
};
