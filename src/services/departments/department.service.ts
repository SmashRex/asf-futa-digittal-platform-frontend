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

    // 1. Primary: apiClient /departments (resolves to ${API_CONFIG.baseUrl}/departments)
    try {
      const response = await apiClient.get<Department[]>('/departments');
      if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
        this.cache = response.data;
        return response.data;
      }
    } catch (err) {
      console.warn('apiClient.get(/departments) error, falling back to direct fetch:', err);
    }

    // 2. Relative direct fetch: /api/departments
    try {
      const res = await fetch('/api/departments', {
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const json: ApiResponse<Department[]> = await res.json();
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          this.cache = json.data;
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Direct relative /api/departments fetch error:', err);
    }

    // 3. Fallback to API_CONFIG.baseUrl /departments
    try {
      const fallbackUrl = `${API_CONFIG.baseUrl}/departments`;
      const res = await fetch(fallbackUrl, {
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const json: ApiResponse<Department[]> = await res.json();
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          this.cache = json.data;
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Fallback backend /departments fetch error:', err);
    }

    return this.cache || [];
  }

  /**
   * Clear cached departments (e.g. for retrying after network failure)
   */
  clearCache(): void {
    this.cache = null;
  }
}

export const departmentService = new DepartmentService();
