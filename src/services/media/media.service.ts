/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from '../api/client';
import { MediaAsset, MediaPlacement } from '../../types/media';

export class PublicMediaService {
  /**
   * Fetch a single media placement by key.
   * GET /api/media/placements/:key
   */
  async getPlacement(key: string): Promise<MediaAsset | null> {
    if (!key) return null;
    try {
      const response = await apiClient.get<MediaPlacement | { key: string; asset: MediaAsset | null } | MediaAsset>(
        `/media/placements/${encodeURIComponent(key)}`
      );

      if (response && response.success && response.data) {
        const data = response.data as any;
        if ('asset' in data) {
          return data.asset || null;
        }
        if ('url' in data) {
          return data as MediaAsset;
        }
      }
      return null;
    } catch (error) {
      console.warn(`[PublicMediaService] Failed to fetch placement "${key}":`, error);
      return null;
    }
  }

  /**
   * Fetch multiple media placements by keys.
   * GET /api/media/placements?keys=key1,key2,...
   */
  async getPlacements(keys: string[]): Promise<Record<string, MediaAsset | null>> {
    const result: Record<string, MediaAsset | null> = {};
    keys.forEach((k) => {
      result[k] = null;
    });

    if (!keys || keys.length === 0) return result;

    try {
      const queryKeys = keys.join(',');
      const response = await apiClient.get<any>(
        `/media/placements?keys=${encodeURIComponent(queryKeys)}`
      );

      if (response && response.success && response.data) {
        const data = response.data;
        if (Array.isArray(data)) {
          data.forEach((item: any) => {
            if (item && item.key) {
              result[item.key] = item.asset || null;
            }
          });
        } else if (typeof data === 'object') {
          Object.keys(data).forEach((k) => {
            const val = data[k];
            if (!val) {
              result[k] = null;
            } else if (typeof val === 'object' && 'asset' in val) {
              result[k] = val.asset || null;
            } else if (typeof val === 'object' && 'url' in val) {
              result[k] = val as MediaAsset;
            }
          });
        }
      }
    } catch (error) {
      console.warn(`[PublicMediaService] Failed to fetch placements [${keys.join(', ')}]:`, error);
    }

    return result;
  }
}

export const publicMediaService = new PublicMediaService();
