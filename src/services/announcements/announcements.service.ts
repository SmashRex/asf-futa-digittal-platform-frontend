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

export interface CreateAnnouncementInput {
  title: string;
  message: string;
  priority?: 'Normal' | 'Important' | 'Urgent' | string;
  isUrgent?: boolean;
  expiresAt?: string;
  category?: string;
}

export interface EditRevisionAnnouncementInput {
  title: string;
  message: string;
}

/**
 * Helper to normalize raw backend announcement data into frontend Announcement type.
 */
function normalizeAnnouncement(item: any): Announcement {
  if (!item) return item;
  const raw = item.data || item;
  const message = raw.message || raw.content || raw.excerpt || '';
  const excerpt = raw.excerpt || (message.length > 140 ? `${message.slice(0, 137)}...` : message);
  const content = raw.content || message;

  return {
    id: raw.id || `ann-${Date.now()}`,
    title: raw.title || 'Untitled Announcement',
    message: message,
    content: content,
    excerpt: excerpt,
    category: raw.category || 'General',
    publishedAt: raw.publishedAt || raw.createdAt || new Date().toISOString(),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
    expiresAt: raw.expiresAt,
    author: raw.author || raw.authorName || 'Publicity Coordinator',
    authorRole: raw.authorRole || 'Publicity & Media',
    priority: raw.isUrgent ? 'Urgent' : (raw.priority || 'Normal'),
    isUrgent: Boolean(raw.isUrgent || raw.priority === 'Urgent'),
    status: raw.status || 'Published',
    notes: raw.notes || raw.reviewNotes,
    reviewNotes: raw.reviewNotes || raw.notes,
    imageUrl: raw.imageUrl,
    attachmentName: raw.attachmentName,
    attachmentSize: raw.attachmentSize,
    isPrebundledOffline: Boolean(raw.isPrebundledOffline)
  };
}

export const announcementsService = {
  /**
   * Fetch list of announcements.
   * In live mode: GET /api/announcements.
   * Regular members receive only Published & non-expired items (enforced by backend).
   * Publicity Coordinator, President, and General Secretary receive all.
   */
  async getAnnouncements(options: GetAnnouncementsOptions = {}): Promise<Announcement[]> {
    if (APP_CONFIG.features.useMockServices || options.isOfflineSimulated) {
      let data = mockAnnouncements;
      if (options.isOfflineSimulated) {
        data = data.filter(item => item.isPrebundledOffline);
      }
      return searchAnnouncements(options.searchQuery || '', options.category || 'All', data);
    }

    const query = options.searchQuery ? `?searchQuery=${encodeURIComponent(options.searchQuery)}` : '';
    const res = await apiClient.get<any>(`/api/announcements${query}`);
    const items = Array.isArray(res.data) ? res.data : (res.data?.data || []);
    const normalized = items.map(normalizeAnnouncement);

    if (options.category && options.category !== 'All') {
      return normalized.filter(a => a.category.toLowerCase() === options.category?.toLowerCase());
    }

    return normalized;
  },

  /**
   * Fetch single announcement by ID.
   * Resolves from the confirmed announcement list (GET /api/announcements).
   * Backend contract dependency: individual announcement detail endpoint (GET /api/announcements/:id) is not confirmed.
   */
  async getAnnouncementById(id: string): Promise<Announcement | null> {
    if (APP_CONFIG.features.useMockServices) {
      return mockAnnouncements.find(a => a.id === id) || null;
    }

    try {
      const list = await this.getAnnouncements();
      return list.find(a => a.id === id) || null;
    } catch (err: any) {
      console.warn(`[announcementsService] Failed to find announcement ${id}:`, err);
      return null;
    }
  },

  /**
   * Create new announcement.
   * In live mode: POST /api/announcements.
   * If isUrgent is true, status is directly 'Published'.
   */
  async createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
    const payload = {
      title: input.title,
      message: input.message,
      priority: input.isUrgent ? 'Urgent' : (input.priority || 'Normal'),
      isUrgent: Boolean(input.isUrgent),
      ...(input.expiresAt ? { expiresAt: input.expiresAt } : {}),
      ...(input.category ? { category: input.category } : {})
    };

    if (APP_CONFIG.features.useMockServices) {
      const mockItem: Announcement = {
        id: `ann-mock-${Date.now()}`,
        title: input.title,
        message: input.message,
        content: input.message,
        excerpt: input.message.length > 140 ? `${input.message.slice(0, 137)}...` : input.message,
        category: (input.category as any) || 'General',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'Publicity Coordinator',
        priority: input.isUrgent ? 'Urgent' : (input.priority || 'Normal'),
        isUrgent: Boolean(input.isUrgent),
        status: input.isUrgent ? 'Published' : 'Draft',
        expiresAt: input.expiresAt
      };
      return mockItem;
    }

    const res = await apiClient.post<any>('/api/announcements', payload);
    return normalizeAnnouncement(res.data);
  },

  /**
   * Submit announcement for review: Draft -> Pending Review.
   * In live mode: PATCH /api/announcements/:id/submit-review.
   */
  async submitForReview(id: string): Promise<Announcement> {
    if (APP_CONFIG.features.useMockServices) {
      return {
        id,
        title: 'Mock Announcement',
        message: '',
        content: '',
        excerpt: '',
        category: 'General',
        publishedAt: new Date().toISOString(),
        author: 'Publicity Coordinator',
        status: 'Pending Review'
      };
    }

    const res = await apiClient.patch<any>(`/api/announcements/${id}/submit-review`);
    return normalizeAnnouncement(res.data);
  },

  /**
   * Approve announcement: Pending Review -> Approved.
   * In live mode: PATCH /api/announcements/:id/approve.
   */
  async approve(id: string): Promise<Announcement> {
    if (APP_CONFIG.features.useMockServices) {
      return {
        id,
        title: 'Mock Announcement',
        message: '',
        content: '',
        excerpt: '',
        category: 'General',
        publishedAt: new Date().toISOString(),
        author: 'Publicity Coordinator',
        status: 'Approved'
      };
    }

    const res = await apiClient.patch<any>(`/api/announcements/${id}/approve`);
    return normalizeAnnouncement(res.data);
  },

  /**
   * Request revision on announcement: Pending Review -> Revision Requested.
   * In live mode: PATCH /api/announcements/:id/request-revision.
   */
  async requestRevision(id: string, notes?: string): Promise<Announcement> {
    if (APP_CONFIG.features.useMockServices) {
      return {
        id,
        title: 'Mock Announcement',
        message: '',
        content: '',
        excerpt: '',
        category: 'General',
        publishedAt: new Date().toISOString(),
        author: 'Publicity Coordinator',
        status: 'Revision Requested',
        notes: notes
      };
    }

    const res = await apiClient.patch<any>(`/api/announcements/${id}/request-revision`, { notes });
    return normalizeAnnouncement(res.data);
  },

  /**
   * Edit revision: Revision Requested -> Draft.
   * In live mode: PUT /api/announcements/:id.
   */
  async editRevision(id: string, data: EditRevisionAnnouncementInput): Promise<Announcement> {
    if (APP_CONFIG.features.useMockServices) {
      return {
        id,
        title: data.title,
        message: data.message,
        content: data.message,
        excerpt: data.message.length > 140 ? `${data.message.slice(0, 137)}...` : data.message,
        category: 'General',
        publishedAt: new Date().toISOString(),
        author: 'Publicity Coordinator',
        status: 'Draft'
      };
    }

    const res = await apiClient.put<any>(`/api/announcements/${id}`, data);
    return normalizeAnnouncement(res.data);
  },

  /**
   * Publish announcement: Approved -> Published.
   * In live mode: PATCH /api/announcements/:id/publish.
   */
  async publish(id: string): Promise<Announcement> {
    if (APP_CONFIG.features.useMockServices) {
      return {
        id,
        title: 'Mock Announcement',
        message: '',
        content: '',
        excerpt: '',
        category: 'General',
        publishedAt: new Date().toISOString(),
        author: 'Publicity Coordinator',
        status: 'Published'
      };
    }

    const res = await apiClient.patch<any>(`/api/announcements/${id}/publish`);
    return normalizeAnnouncement(res.data);
  },

  /**
   * Archive announcement: Published -> Archived.
   * In live mode: PATCH /api/announcements/:id/archive.
   */
  async archive(id: string): Promise<Announcement> {
    if (APP_CONFIG.features.useMockServices) {
      return {
        id,
        title: 'Mock Announcement',
        message: '',
        content: '',
        excerpt: '',
        category: 'General',
        publishedAt: new Date().toISOString(),
        author: 'Publicity Coordinator',
        status: 'Archived'
      };
    }

    const res = await apiClient.patch<any>(`/api/announcements/${id}/archive`);
    return normalizeAnnouncement(res.data);
  }
};
