/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from '../api/client';
import { API_CONFIG } from '../../config/api.config';
import { ApiResponse } from '../api/types';

export interface Department {
  id: string;
  name: string;
  school?: string;
  createdAt?: string;
}

export class DepartmentService {
  private cache: Department[] | null = null;

  /**
   * Fetch canonical list of academic departments: GET /api/departments
   * Public endpoint, requires no authentication/session.
   * Returns authoritative departments list including 'other'.
   */
  async getDepartments(): Promise<Department[]> {
    if (this.cache && this.cache.length > 0) {
      return this.cache;
    }

    // Strictly route via centralized apiClient with API_CONFIG.endpoints.departments
    // Endpoint resolves to ${API_CONFIG.baseUrl}/departments (e.g. https://asf-digital-platform-backend.onrender.com/api/departments)
    const response = await apiClient.get<Department[]>(API_CONFIG.endpoints.departments);
    if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
      this.cache = response.data;
      return response.data;
    }

    throw new Error(response?.message || 'Unable to retrieve departments from backend');
  }

  /**
   * Clear cached departments (e.g. for retrying after network failure)
   */
  clearCache(): void {
    this.cache = null;
  }
}

export const departmentService = new DepartmentService();
