/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Announcement } from '../../types';
import { mockAnnouncements, searchAnnouncements } from '../../data/announcementData';
import { APP_CONFIG } from '../../config/app.config';
import { apiClient } from '../api/client';

export interface GetAnnouncementsOptions {
  category?: string;
  searchQuery?: string;
  isOfflineSimulated?: boolean;
}

export const announcementsService = {
  async getAnnouncements(options: GetAnnouncementsOptions = {}): Promise<Announcement[]> {
    if (APP_CONFIG.features.useMockServices || options.isOfflineSimulated) {
      let data = mockAnnouncements;
      if (options.isOfflineSimulated) {
        data = data.filter(item => item.isPrebundledOffline);
      }
      return searchAnnouncements(options.searchQuery || '', options.category || 'All', data);
    }
    const query = options.searchQuery ? `?searchQuery=${encodeURIComponent(options.searchQuery)}` : '';
    const res = await apiClient.get<Announcement[]>(`/api/announcements${query}`);
    return res.data;
  },

  async getAnnouncementById(id: string): Promise<Announcement | null> {
    if (APP_CONFIG.features.useMockServices) {
      return mockAnnouncements.find(a => a.id === id) || null;
    }
    const res = await apiClient.get<Announcement>(`/api/announcements/${id}`);
    return res.data;
  },
};
