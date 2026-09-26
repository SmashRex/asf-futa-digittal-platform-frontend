/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { departmentService } from '../departments/department.service';
import { apiClient } from '../api/client';

describe('Department Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    departmentService.clearCache();
  });

  it('should fetch canonical departments from GET /departments via apiClient', async () => {
    const mockDepartments = [
      {
        id: 'agric-resource-econ',
        name: 'Agricultural & Resource Economics',
        school: 'School of Agriculture and Agricultural Technology',
        createdAt: '2026-09-21T05:51:07.520Z'
      },
      {
        id: 'computer-science',
        name: 'Computer Science',
        school: 'School of Computing',
        createdAt: '2026-09-21T05:51:07.520Z'
      },
      {
        id: 'other',
        name: 'Other',
        school: 'Other',
        createdAt: '2026-09-21T05:51:07.520Z'
      }
    ];

    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      success: true,
      data: mockDepartments,
      message: 'Operation completed successfully'
    });

    const result = await departmentService.getDepartments();
    expect(apiClient.get).toHaveBeenCalledWith('/departments');
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('agric-resource-econ');
    expect(result[0].name).toBe('Agricultural & Resource Economics');
    expect(result[0].school).toBe('School of Agriculture and Agricultural Technology');
    // Verify 'other' option is present and preserved
    expect(result.some(d => d.id === 'other')).toBe(true);
  });

  it('should cache departments on subsequent calls', async () => {
    const mockDepartments = [
      { id: 'software-engineering', name: 'Software Engineering', school: 'School of Computing' }
    ];

    const spy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      success: true,
      data: mockDepartments,
      message: 'Operation completed successfully'
    });

    const first = await departmentService.getDepartments();
    const second = await departmentService.getDepartments();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(first).toEqual(second);
  });

  it('should propagate error when backend fails and never construct relative URL', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('Network error'));

    await expect(departmentService.getDepartments()).rejects.toThrow('Network error');
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
