/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from '../api/client';

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

    const response = await apiClient.get<Department[]>('/departments');
    if (response && response.success && Array.isArray(response.data)) {
      this.cache = response.data;
      return response.data;
    }

    throw new Error('Departments endpoint returned an invalid response.');
  }

  /**
   * Clear cached departments (e.g. for retrying after network failure)
   */
  clearCache(): void {
    this.cache = null;
  }
}

export const departmentService = new DepartmentService();
