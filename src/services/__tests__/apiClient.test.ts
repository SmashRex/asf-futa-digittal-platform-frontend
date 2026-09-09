/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient } from '../api/client';

describe('API Client Central Error Handling', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle HTTP 401 as UNAUTHENTICATED error', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: { get: () => 'application/json' },
      json: async () => ({
        success: false,
        error: { code: 'UNAUTHENTICATED', message: 'Session expired or unauthenticated.' }
      })
    });

    await expect(apiClient.get('/api/protected-resource')).rejects.toMatchObject({
      code: 'UNAUTHENTICATED',
      statusCode: 401
    });
  });

  it('should handle HTTP 403 as PERMISSION_DENIED without clearing auth', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 403,
      headers: { get: () => 'application/json' },
      json: async () => ({
        success: false,
        error: { code: 'PERMISSION_DENIED', message: 'You do not have permission to access this resource.' }
      })
    });

    await expect(apiClient.get('/api/admin/restricted-resource')).rejects.toMatchObject({
      code: 'PERMISSION_DENIED',
      statusCode: 403
    });
  });
});
