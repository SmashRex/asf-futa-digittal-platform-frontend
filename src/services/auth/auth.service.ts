/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, UserRole } from '../../types';
import { isAuthorizedAdminRole } from '../../types/adminTypes';
import { APP_CONFIG } from '../../config/app.config';
import { API_CONFIG } from '../../config/api.config';

export interface RegisterPayload {
  name: string;
  email: string;
  department: string;
  level: string;
  academicLevel?: string;
  programDurationYears?: 4 | 5;
  phoneNumber?: string;
  subgroup?: string;
}

export interface MagicLinkRequestPayload {
  email: string;
}

export interface VerifyTokenResponse {
  user: UserProfile;
  token?: string;
}

class AuthService {
  private normalizeUser(rawUser: any): UserProfile {
    if (!APP_CONFIG.features.useMockServices) {
      const missing: string[] = [];
      if (!rawUser?.id) missing.push('id');
      if (!rawUser?.email) missing.push('email');
      if (!rawUser?.name) missing.push('name');
      if (!rawUser?.department) missing.push('department');
      if (!rawUser?.academicLevel && !rawUser?.level) missing.push('academicLevel');
      if (!rawUser?.roles || !Array.isArray(rawUser.roles)) missing.push('roles (array)');
      if (!rawUser?.accountStatus) missing.push('accountStatus');
      if (!rawUser?.membershipStatus) missing.push('membershipStatus');

      if (missing.length > 0) {
        const error: any = new Error(`Contract violation: Backend response is missing required fields: ${missing.join(', ')}`);
        error.code = 'INVALID_USER_CONTRACT';
        throw error;
      }
    }

    const roles: string[] = Array.isArray(rawUser?.roles) && rawUser.roles.length > 0
      ? rawUser.roles 
      : (rawUser?.role ? [rawUser.role] : ['Member']);
    
    // For presentation-only legacy badge display, prioritize administrative role if present
    const presentationRole = (roles.find(r => isAuthorizedAdminRole(r)) || roles[0] || 'Member') as UserRole;
    const academicLevel = rawUser?.academicLevel || rawUser?.level || '400 Level';
    const membershipStatus = rawUser?.membershipStatus || (academicLevel === 'Alumni' ? 'Alumni' : 'Active Student');

    return {
      id: rawUser?.id || `usr_${Date.now()}`,
      name: rawUser?.name || '',
      email: rawUser?.email || '',
      department: rawUser?.department || '',
      academicLevel,
      level: academicLevel,
      subgroup: rawUser?.subgroup,
      phoneNumber: rawUser?.phoneNumber,
      accountStatus: rawUser?.accountStatus || 'Active',
      membershipStatus,
      avatarUrl: rawUser?.avatarUrl,
      roles,
      role: presentationRole,
      programDurationYears: rawUser?.programDurationYears,
      isAlumni: membershipStatus === 'Alumni' || academicLevel === 'Alumni',
    };
  }

  /**
   * Register a new member account for the first time.
   * Connects to backend: POST /api/auth/register
   */
  async register(payload: RegisterPayload): Promise<VerifyTokenResponse> {
    if (payload.programDurationYears !== undefined && payload.programDurationYears !== 4 && payload.programDurationYears !== 5) {
      const error: any = new Error('Program duration must be either 4 or 5 years');
      error.code = 'INVALID_PROGRAM_DURATION';
      throw error;
    }

    const effectiveDuration: 4 | 5 = payload.programDurationYears === 5 ? 5 : 4;
    const requestPayload = {
      ...payload,
      programDurationYears: effectiveDuration,
    };

    if (!APP_CONFIG.features.useMockServices) {
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestPayload),
      });
      if (!response.ok) {
        let errCode = 'REGISTRATION_FAILED';
        let errMsg = `Registration failed with status ${response.status}`;
        let errDetails: unknown = undefined;
        try {
          const errData = await response.json();
          if (errData?.error?.code) {
            errCode = errData.error.code;
            errMsg = errData.error.message || errMsg;
            errDetails = errData.error.details;
          } else if (errData?.message) {
            errMsg = errData.message;
          }
        } catch {}
        const error: any = new Error(errMsg);
        error.code = errCode;
        error.details = errDetails;
        throw error;
      }
      const data = await response.json();
      const rawUser = data?.data?.user || data?.data || data?.user;
      if (rawUser && (rawUser.id || rawUser.email)) {
        const normalized = this.normalizeUser(rawUser);
        // Note: Production session is managed via HttpOnly asf_session cookie.
        localStorage.setItem(APP_CONFIG.storageKeys.userSession, JSON.stringify(normalized));
        return { user: normalized, token: data.token || data.data?.token };
      }
      // Standard registration dispatches magic link (no immediate session)
      return { user: undefined as any, token: undefined };
    }

    // Fallback simulation mode for development environment before backend is deployed
    return new Promise((resolve) => {
      setTimeout(() => {
        const rawUser = {
          id: `usr_${Date.now()}`,
          name: payload.name.trim(),
          email: payload.email.trim().toLowerCase(),
          department: payload.department.trim(),
          academicLevel: payload.level,
          subgroup: payload.subgroup?.trim() || 'General Assembly',
          phoneNumber: payload.phoneNumber?.trim() || undefined,
          programDurationYears: effectiveDuration,
          roles: ['Member'],
          accountStatus: 'Active',
          membershipStatus: payload.level === 'Alumni' ? 'Alumni' : 'Active Student',
        };

        const user = this.normalizeUser(rawUser);
        const token = `asf_jwt_active_${Date.now()}`;
        localStorage.setItem(APP_CONFIG.storageKeys.authToken, token);
        localStorage.setItem(APP_CONFIG.storageKeys.userSession, JSON.stringify(user));

        resolve({ user, token });
      }, 700);
    });
  }

  /**
   * Request a passwordless magic link to be sent to user's email for login.
   * Connects to backend: POST /api/auth/magic-link
   */
  async requestMagicLink(payload: MagicLinkRequestPayload): Promise<{ success: boolean; message: string }> {
    if (!APP_CONFIG.features.useMockServices) {
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let errCode = 'MAGIC_LINK_FAILED';
        let errMsg = 'Failed to request login link';
        let errDetails: unknown = undefined;
        try {
          const errData = await response.json();
          if (errData?.error?.code) {
            errCode = errData.error.code;
            errMsg = errData.error.message || errMsg;
            errDetails = errData.error.details;
          } else if (errData?.message) {
            errMsg = errData.message;
          }
        } catch {}
        const error: any = new Error(errMsg);
        error.code = errCode;
        error.details = errDetails;
        throw error;
      }
      return await response.json();
    }

    // Fallback simulation mode until backend endpoint is connected
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Magic login link dispatched to ${payload.email}`,
        });
      }, 600);
    });
  }

  /**
   * Verify token from magic link callback URL.
   * Connects to backend: POST /api/auth/verify with payload { token: "RAW_TOKEN" }
   */
  async verifyMagicLinkToken(tokenPayload: { email?: string; token?: string }): Promise<VerifyTokenResponse> {
    const rawToken = tokenPayload.token;

    if (!APP_CONFIG.features.useMockServices) {
      if (!rawToken) {
        const err: any = new Error('Magic link token is missing or invalid.');
        err.code = 'TOKEN_REQUIRED';
        throw err;
      }

      const response = await fetch(`${API_CONFIG.baseUrl}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: rawToken }),
      });

      if (!response.ok) {
        let errCode = 'VERIFICATION_FAILED';
        let errMsg = 'Token verification failed';
        let errDetails: unknown = undefined;
        try {
          const errData = await response.json();
          if (errData?.error?.code) {
            errCode = errData.error.code;
            errMsg = errData.error.message || errMsg;
            errDetails = errData.error.details;
          } else if (errData?.message) {
            errMsg = errData.message;
          }
        } catch {}
        const error: any = new Error(errMsg);
        error.code = errCode;
        error.details = errDetails;
        throw error;
      }

      const data = await response.json();
      const rawUser = data?.data?.user || data?.data || data?.user || data;
      const normalizedUser = this.normalizeUser(rawUser);

      // Note: Production session is managed via HttpOnly asf_session cookie.
      localStorage.setItem(APP_CONFIG.storageKeys.userSession, JSON.stringify(normalizedUser));

      return { user: normalizedUser, token: data.token || data?.data?.token };
    }

    // Fallback / simulation verification for development
    return new Promise((resolve) => {
      let roleList: string[] = ['Member'];
      const email = (tokenPayload.email || 'member@asf-futa.org').toLowerCase();
      if (email === 'admin@asf-futa.org') {
        roleList = ['Publicity Coordinator', 'Member'];
      } else if (email === 'president@asf-futa.org') {
        roleList = ['President / Executive', 'Member'];
      } else if (email === 'biblestudy@asf-futa.org') {
        roleList = ['Bible Study Coordinator', 'Member'];
      } else if (email === 'fs@asf-futa.org') {
        roleList = ['VP / FS Coordinator', 'Member'];
      } else if (email === 'tech@asf-futa.org') {
        roleList = ['Technical Administrator', 'Member'];
      }

      const user = this.normalizeUser({
        id: `usr_${Date.now()}`,
        name: email.startsWith('admin') ? 'ASF Admin' : (email.startsWith('president') ? 'Bro. President' : 'Fellowship Member'),
        email: email,
        department: 'Computer Science',
        academicLevel: '400 Level',
        subgroup: 'General Assembly',
        roles: roleList,
        accountStatus: 'Active',
        membershipStatus: 'Active Student',
      });

      const token = `mock_jwt_token_${Date.now()}`;
      localStorage.setItem(APP_CONFIG.storageKeys.authToken, token);
      localStorage.setItem(APP_CONFIG.storageKeys.userSession, JSON.stringify(user));

      resolve({ user, token });
    });
  }

  /**
   * Asynchronously fetch current authenticated user profile from backend: GET /api/auth/me
   */
  async fetchCurrentUser(): Promise<UserProfile | null> {
    if (!APP_CONFIG.features.useMockServices) {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/auth/me`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (response.ok) {
          const rawData = await response.json();
          const rawUser = rawData?.data?.user || rawData?.data || rawData?.user || rawData;
          const user = this.normalizeUser(rawUser);
          localStorage.setItem(APP_CONFIG.storageKeys.userSession, JSON.stringify(user));
          return user;
        }
      } catch (e) {
        console.warn('Unable to reach backend /api/auth/me; falling back to cached session', e);
      }
    }

    return this.getCurrentUser();
  }

  /**
   * Get current authenticated user session from memory / localStorage / API.
   */
  getCurrentUser(): UserProfile | null {
    try {
      const saved = localStorage.getItem(APP_CONFIG.storageKeys.userSession);
      if (!saved) return null;
      return this.normalizeUser(JSON.parse(saved));
    } catch {
      return null;
    }
  }

  /**
   * Update current user profile.
   */
  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    const normalized = this.normalizeUser(profile);
    localStorage.setItem(APP_CONFIG.storageKeys.userSession, JSON.stringify(normalized));
    return normalized;
  }

  /**
   * Alias for requestMagicLink to support alternative service naming.
   */
  async sendMagicLink(payload: MagicLinkRequestPayload): Promise<{ success: boolean; message: string }> {
    return this.requestMagicLink(payload);
  }

  /**
   * Get stored auth token.
   */
  getToken(): string | null {
    return localStorage.getItem(APP_CONFIG.storageKeys.authToken);
  }

  /**
   * Logout user and clear tokens.
   */
  async logout(): Promise<void> {
    if (!APP_CONFIG.features.useMockServices) {
      try {
        await fetch(`${API_CONFIG.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
      } catch (e) {
        console.warn('Logout endpoint call failed:', e);
      }
    }
    localStorage.removeItem(APP_CONFIG.storageKeys.userSession);
    localStorage.removeItem(APP_CONFIG.storageKeys.authToken);
  }
}

export const authService = new AuthService();
