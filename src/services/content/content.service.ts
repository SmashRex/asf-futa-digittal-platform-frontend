/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { APP_CONFIG } from '../../config/app.config';
import { API_CONFIG } from '../../config/api.config';
import { SITE_CONTENT } from '../../content/site-content';
import { EVENTS_CONTENT } from '../../content/events-content';

class ContentService {
  /**
   * Fetch editable CMS content blocks for publicity/admin tools.
   * Expected Backend Endpoint: GET /api/content
   */
  async getSiteContent(): Promise<typeof SITE_CONTENT> {
    if (!APP_CONFIG.features.useMockServices) {
      const response = await fetch(`${API_CONFIG.baseUrl}/content/site`);
      const data = await response.json();
      return data.data;
    }
    return SITE_CONTENT;
  }

  async getEventsContent(): Promise<typeof EVENTS_CONTENT> {
    if (!APP_CONFIG.features.useMockServices) {
      const response = await fetch(`${API_CONFIG.baseUrl}/content/events`);
      const data = await response.json();
      return data.data;
    }
    return EVENTS_CONTENT;
  }

  /**
   * Update CMS content block (PRO / Admin role required).
   * Expected Backend Endpoint: PUT /api/content
   */
  async updateContentBlock(section: string, data: any): Promise<boolean> {
    if (!APP_CONFIG.features.useMockServices) {
      await fetch(`${API_CONFIG.baseUrl}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      });
    }
    return true;
  }
}

export const contentService = new ContentService();
