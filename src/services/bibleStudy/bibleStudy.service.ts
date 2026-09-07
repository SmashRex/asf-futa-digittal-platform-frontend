/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BibleStudyItem, BibleReference } from '../../types';
import { mockBibleStudies } from '../../data/bibleStudyData';
import { parseBibleReference } from '../../config/bible.config';
import { APP_CONFIG } from '../../config/app.config';
import { apiClient } from '../api/client';

export const bibleStudyService = {
  /**
   * Fetch all published Bible study outlines.
   */
  async getStudies(): Promise<BibleStudyItem[]> {
    if (APP_CONFIG.features.useMockServices) {
      return mockBibleStudies.filter(s => s.isPublished);
    }
    const res = await apiClient.get<BibleStudyItem[]>('/api/bible-studies');
    return res.data;
  },

  /**
   * Fetch a specific Bible study by its unique ID.
   */
  async getStudyById(id: string): Promise<BibleStudyItem | null> {
    if (APP_CONFIG.features.useMockServices) {
      return mockBibleStudies.find(s => s.id === id) || null;
    }
    const res = await apiClient.get<BibleStudyItem>(`/api/bible-studies/${id}`);
    return res.data;
  },

  /**
   * Fetch current/latest active Bible study session.
   */
  async getLatestStudy(): Promise<BibleStudyItem | null> {
    if (APP_CONFIG.features.useMockServices) {
      return mockBibleStudies.find(s => s.isCurrent && s.isPublished) || mockBibleStudies[0] || null;
    }
    const res = await apiClient.get<BibleStudyItem>('/api/bible-studies/latest');
    return res.data;
  },

  /**
   * Fetch attached document / manual URL for a given study ID.
   */
  async getStudyDocument(id: string): Promise<{ documentUrl: string; documentType: 'pdf' | 'html' | 'external' } | null> {
    if (APP_CONFIG.features.useMockServices) {
      const study = mockBibleStudies.find(s => s.id === id);
      if (study && study.documentUrl) {
        return {
          documentUrl: study.documentUrl,
          documentType: study.documentType || 'pdf'
        };
      }
      return null;
    }
    const res = await apiClient.get<{ documentUrl: string; documentType: 'pdf' | 'html' | 'external' }>(`/api/bible-studies/${id}/document`);
    return res.data;
  },

  /**
   * Convenient helper method to fetch document URL and type.
   */
  async getDocumentUrl(id: string): Promise<{ url: string; type: 'pdf' | 'html' | 'external' } | null> {
    const doc = await this.getStudyDocument(id);
    if (!doc) return null;
    return { url: doc.documentUrl, type: doc.documentType };
  },

  /**
   * Extracts and returns all structured Scripture references associated with a study.
   */
  async getStudyReferences(id: string): Promise<BibleReference[]> {
    const study = await this.getStudyById(id);
    if (!study) return [];

    const refs: BibleReference[] = [];

    // Key scripture
    if (study.keyScripture) {
      const parsed = parseBibleReference(study.keyScripture);
      if (parsed) refs.push(parsed);
    }

    // Text scriptures
    if (study.textScriptures) {
      study.textScriptures.forEach(ts => {
        const parsed = parseBibleReference(ts);
        if (parsed && !refs.some(r => r.raw === parsed.raw)) {
          refs.push(parsed);
        }
      });
    }

    // Memory verse
    if (study.memoryVerse?.reference) {
      const parsed = parseBibleReference(study.memoryVerse.reference);
      if (parsed && !refs.some(r => r.raw === parsed.raw)) {
        refs.push(parsed);
      }
    }

    // Sections
    if (study.sections) {
      study.sections.forEach(sec => {
        sec.scriptureRefs?.forEach(sr => {
          const parsed = parseBibleReference(sr);
          if (parsed && !refs.some(r => r.raw === parsed.raw)) {
            refs.push(parsed);
          }
        });
      });
    }

    // Study guide questions
    if (study.studyGuide) {
      study.studyGuide.forEach(sg => {
        sg.scriptureRefs?.forEach(sr => {
          const parsed = parseBibleReference(sr);
          if (parsed && !refs.some(r => r.raw === parsed.raw)) {
            refs.push(parsed);
          }
        });
      });
    }

    return refs;
  }
};
