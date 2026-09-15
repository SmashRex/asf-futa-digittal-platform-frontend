/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authService } from '../auth/auth.service';
import { APP_CONFIG } from '../../config/app.config';

describe('Auth Service', () => {
  const originalUseMock = APP_CONFIG.features.useMockServices;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    APP_CONFIG.features.useMockServices = originalUseMock;
  });

  afterEach(() => {
    APP_CONFIG.features.useMockServices = originalUseMock;
  });

  it('should dispatch magic link request successfully', async () => {
    const res = await authService.sendMagicLink({ email: 'student@futa.edu.ng' });
    expect(res.success).toBe(true);
    expect(res.message).toContain('Magic login link dispatched');
  });

  it('should register a new member and create an active session with valid programDurationYears', async () => {
    const res = await authService.register({
      name: 'John Doe',
      email: 'student@futa.edu.ng',
      password: 'StrongPassword123',
      department: 'Computer Science',
      level: '400 Level',
      programDurationYears: 5,
      subgroup: 'Technical Team',
    });

    expect(res.token).toBeDefined();
    expect(res.user.email).toBe('student@futa.edu.ng');
    expect(res.user.name).toBe('John Doe');
    expect(res.user.department).toBe('Computer Science');
    expect(res.user.programDurationYears).toBe(5);
    expect(authService.getToken()).toBe(res.token);
  });

  it('should default programDurationYears to 4 if not provided or for alumni', async () => {
    const res = await authService.register({
      name: 'Alumni Member',
      email: 'alumni@futa.edu.ng',
      password: 'StrongPassword123',
      department: 'Architecture',
      level: 'Alumni',
    });

    expect(typeof res.user.programDurationYears).toBe('number');
    expect(res.user.programDurationYears).toBe(4);
  });

  it('should default programDurationYears to 4 for postgraduate registration', async () => {
    const res = await authService.register({
      name: 'Postgraduate Member',
      email: 'pg@futa.edu.ng',
      password: 'StrongPassword123',
      department: 'Physics',
      level: 'Postgraduate',
    });

    expect(typeof res.user.programDurationYears).toBe('number');
    expect(res.user.programDurationYears).toBe(4);
  });

  it('should authenticate user with email and password via login', async () => {
    const res = await authService.login({
      email: 'student@futa.edu.ng',
      password: 'StrongPassword123',
    });

    expect(res.token).toBeDefined();
    expect(res.user.email).toBe('student@futa.edu.ng');
    expect(authService.getToken()).toBe(res.token);
  });

  it('should reject invalid programDurationYears if specified as non 4 or 5', async () => {
    await expect(
      authService.register({
        name: 'Invalid Year',
        email: 'invalid@futa.edu.ng',
        department: 'Science',
        level: '200 Level',
        programDurationYears: 3 as any,
      })
    ).rejects.toThrow('Program duration must be either 4 or 5 years');
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

  describe('normalizeUser - Authoritative Auth Contract', () => {
    beforeEach(() => {
      APP_CONFIG.features.useMockServices = false;
    });

    it('should successfully normalize a valid backend auth user without membershipStatus or accountStatus', () => {
      const backendUser = {
        id: 'usr_backend_123',
        email: 'test@example.com',
        name: 'Test User',
        department: 'Computer Science',
        academicLevel: '100 Level',
        subgroup: 'Technical Team',
        roles: ['Member'],
      };

      const normalized = authService.normalizeUser(backendUser);

      expect(normalized.id).toBe('usr_backend_123');
      expect(normalized.email).toBe('test@example.com');
      expect(normalized.name).toBe('Test User');
      expect(normalized.department).toBe('Computer Science');
      expect(normalized.academicLevel).toBe('100 Level');
      expect(normalized.subgroup).toBe('Technical Team');
      expect(Array.isArray(normalized.roles)).toBe(true);
      expect(normalized.roles).toEqual(['Member']);
      // Fallback derivation for UI compatibility
      expect(normalized.membershipStatus).toBe('Active Student');
      expect(normalized.accountStatus).toBe('Active');
    });

    it('should accept empty roles array and preserve it as an array', () => {
      const backendUser = {
        id: 'usr_backend_456',
        email: 'noroles@example.com',
        name: 'No Roles User',
        department: 'Physics',
        academicLevel: '200 Level',
        subgroup: 'Choir',
        roles: [],
      };

      const normalized = authService.normalizeUser(backendUser);
      expect(Array.isArray(normalized.roles)).toBe(true);
    });

    it('should reject rawUser missing required id field with INVALID_USER_CONTRACT', () => {
      const invalidUser = {
        email: 'test@example.com',
        name: 'Test User',
        department: 'Computer Science',
        academicLevel: '100 Level',
        roles: ['Member'],
      };

      expect(() => authService.normalizeUser(invalidUser)).toThrowError(
        /Contract violation: Backend response is missing required fields: id/
      );
    });

    it('should reject rawUser missing required department field with INVALID_USER_CONTRACT', () => {
      const invalidUser = {
        id: 'usr_1',
        email: 'test@example.com',
        name: 'Test User',
        academicLevel: '100 Level',
        roles: ['Member'],
      };

      expect(() => authService.normalizeUser(invalidUser)).toThrowError(
        /Contract violation: Backend response is missing required fields: department/
      );
    });

    it('should reject rawUser when roles is not an array with INVALID_USER_CONTRACT', () => {
      const invalidUser = {
        id: 'usr_1',
        email: 'test@example.com',
        name: 'Test User',
        department: 'Computer Science',
        academicLevel: '100 Level',
        roles: 'invalid_string' as any,
      };

      expect(() => authService.normalizeUser(invalidUser)).toThrowError(
        /Contract violation: Backend response is missing required fields: roles \(array\)/
      );
    });

    it('should not require membershipStatus or accountStatus to pass normalization', () => {
      const minimalAuthoritativeUser = {
        id: 'usr_minimal',
        email: 'minimal@futa.edu.ng',
        name: 'Minimal User',
        department: 'Architecture',
        academicLevel: '500 Level',
        roles: ['Member'],
      };

      expect(() => authService.normalizeUser(minimalAuthoritativeUser)).not.toThrow();
    });

    it('should derive membershipStatus as Alumni when academicLevel is Alumni and default accountStatus to Active', () => {
      const alumniUser = {
        id: 'usr_alumni',
        email: 'alumni@futa.edu.ng',
        name: 'Alumni Member',
        department: 'Agricultural Engineering',
        academicLevel: 'Alumni',
        roles: ['Member'],
      };

      const normalized = authService.normalizeUser(alumniUser);
      expect(normalized.membershipStatus).toBe('Alumni');
      expect(normalized.isAlumni).toBe(true);
      expect(normalized.accountStatus).toBe('Active');
    });

    it('should derive membershipStatus as Active Student when academicLevel is undergraduate level', () => {
      const studentUser = {
        id: 'usr_student',
        email: 'student@futa.edu.ng',
        name: 'Active Student Member',
        department: 'Electrical Engineering',
        academicLevel: '300 Level',
        roles: ['Member'],
      };

      const normalized = authService.normalizeUser(studentUser);
      expect(normalized.membershipStatus).toBe('Active Student');
      expect(normalized.isAlumni).toBe(false);
      expect(normalized.accountStatus).toBe('Active');
    });

    it('should successfully resolve getMe() from backend without membershipStatus or accountStatus', async () => {
      const liveBackendResponse = {
        status: 'success',
        data: {
          id: 'usr_live_999',
          email: 'live@futa.edu.ng',
          name: 'Live Staging User',
          department: 'Computer Science',
          academicLevel: '400 Level',
          subgroup: 'Media & Publicity',
          roles: ['Member'],
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => liveBackendResponse,
      } as Response);

      const user = await authService.getMe();
      expect(user).not.toBeNull();
      expect(user?.id).toBe('usr_live_999');
      expect(user?.membershipStatus).toBe('Active Student');
      expect(user?.accountStatus).toBe('Active');
      expect(user?.roles).toEqual(['Member']);
    });
  });
});
