/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../auth/auth.service';

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should dispatch magic link request successfully', async () => {
    const res = await authService.sendMagicLink({ email: 'student@futa.edu.ng' });
    expect(res.success).toBe(true);
    expect(res.message).toContain('Magic login link dispatched');
  });

  it('should register a new member and create an active session', async () => {
    const res = await authService.register({
      name: 'John Doe',
      email: 'student@futa.edu.ng',
      department: 'Computer Science',
      level: '400 Level',
      subgroup: 'Technical Team',
    });

    expect(res.token).toBeDefined();
    expect(res.user.email).toBe('student@futa.edu.ng');
    expect(res.user.name).toBe('John Doe');
    expect(res.user.department).toBe('Computer Science');
    expect(authService.getToken()).toBe(res.token);
  });

  it('should verify valid magic link token and persist session token with roles array', async () => {
    const res = await authService.verifyMagicLinkToken({
      email: 'student@futa.edu.ng',
      token: 'test_raw_token_123',
    });

    expect(res.token).toBeDefined();
    expect(res.user.email).toBe('student@futa.edu.ng');
    expect(Array.isArray(res.user.roles)).toBe(true);
    expect(res.user.roles).toContain('Member');
    expect(authService.getToken()).toBe(res.token);
  });

  it('should fetch current authenticated user profile', async () => {
    // Before login
    expect(await authService.getCurrentUser()).toBeNull();

    // After login
    await authService.verifyMagicLinkToken({ email: 'member@asf-futa.org' });
    const user = await authService.getCurrentUser();
    expect(user).not.toBeNull();
    expect(user?.email).toBe('member@asf-futa.org');
  });

  it('should clear stored session token on logout', async () => {
    await authService.verifyMagicLinkToken({ email: 'test@futa.edu.ng' });
    expect(authService.getToken()).toBeTruthy();

    await authService.logout();
    expect(authService.getToken()).toBeNull();
    expect(await authService.getCurrentUser()).toBeNull();
  });
});
