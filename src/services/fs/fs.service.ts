/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FSMaterial } from '../../types';
import { mockFSMaterials } from '../../data/fsData';
import { APP_CONFIG } from '../../config/app.config';
import { apiClient } from '../api/client';

export const fsService = {
  async getMaterials(): Promise<FSMaterial[]> {
    if (APP_CONFIG.features.useMockServices) {
      return mockFSMaterials;
    }
    const res = await apiClient.get<FSMaterial[]>('/api/fs/materials');
    return res.data;
  },

  async getMaterialById(id: string): Promise<FSMaterial | null> {
    if (APP_CONFIG.features.useMockServices) {
      return mockFSMaterials.find(m => m.id === id) || null;
    }
    const res = await apiClient.get<FSMaterial>(`/api/fs/materials/${id}`);
    return res.data;
  },
};
