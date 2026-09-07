/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, UserRole } from '../../types';
import { APP_CONFIG } from '../../config/app.config';
import { API_CONFIG } from '../../config/api.config';

export interface RegisterPayload {
  name: string;
  email: string;
  department: string;
  level: string;
  phoneNumber?: string;
  subgroup?: string;
}

export interface MagicLinkRequestPayload {
  email: string;
}

export interface VerifyTokenResponse {
  user: UserProfile;
  token: string;
}

class AuthService {
  /**
   * Register a new member account for the first time.
   * A successful registration immediately creates an active member account.
   * Connects to backend: POST /api/auth/register
   */
  async register(payload: RegisterPayload): Promise<VerifyTokenResponse> {
    if (!APP_CONFIG.features.useMockServices) {
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Registration failed with status ${response.status}`);
      }
      const data = await response.json();
      if (data.token) {
        localStorage.setItem(APP_CONFIG.storageKeys.authToken, data.token);
        localStorage.setItem(APP_CONFIG.storageKeys.userSession, JSON.stringify(data.user));
      }
      return data;
    }

    // Fallback simulation mode for development environment before backend is deployed
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: UserProfile = {
          id: `usr_${Date.now()}`,
          name: payload.name.trim(),
          email: payload.email.trim().toLowerCase(),
          department: payload.department.trim(),
          level: payload.level,
          subgroup: payload.subgroup?.trim() || 'General Assembly',
          phoneNumber: payload.phoneNumber?.trim() || undefined,
          role: 'Member',
          isAlumni: payload.level === 'Alumni',
        };

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
      // Real backend endpoint call
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to request login link');
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
   * Connects to backend: POST /api/auth/verify
   */
  async verifyMagicLinkToken(tokenPayload: { email: string; token?: string }): Promise<VerifyTokenResponse> {
    if (!APP_CONFIG.features.useMockServices) {
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokenPayload),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Token verification failed');
      }
      const data = await response.json();
      if (data.token) {
        localStorage.setItem(APP_CONFIG.storageKeys.authToken, data.token);
        localStorage.setItem(APP_CONFIG.storageKeys.userSession, JSON.stringify(data.user));
      }
      return data;
    }

    // Fallback / simulation verification for development
    return new Promise((resolve) => {
      let role: UserRole = 'Member';
      const email = tokenPayload.email.toLowerCase();
      if (email === 'admin@asf-futa.org') {
        role = 'Publicity Coordinator';
      } else if (email === 'president@asf-futa.org') {
        role = 'President / Executive';
      } else if (email === 'biblestudy@asf-futa.org') {
        role = 'Bible Study Coordinator';
      } else if (email === 'fs@asf-futa.org') {
        role = 'VP / FS Coordinator';
      } else if (email === 'tech@asf-futa.org') {
        role = 'Technical Administrator';
      }

      const user: UserProfile = {
        id: `usr_${Date.now()}`,
        name: email.startsWith('admin') ? 'ASF Admin' : (email.startsWith('president') ? 'Bro. President' : 'Fellowship Member'),
        email: tokenPayload.email,
        department: 'Computer Science',
        level: '400 Level',
        subgroup: 'General Assembly',
        role: role,
        isAlumni: false,
      };

      const token = `mock_jwt_token_${Date.now()}`;
      localStorage.setItem(APP_CONFIG.storageKeys.authToken, token);
      localStorage.setItem(APP_CONFIG.storageKeys.userSession, JSON.stringify(user));

      resolve({ user, token });
    });
  }

  /**
   * Asynchronously fetch current authenticated user profile from the backend:
   * GET /api/auth/me or GET /api/users/me
   */
  async fetchCurrentUser(): Promise<UserProfile | null> {
    const token = this.getToken();
    if (!token) return null;

    if (!APP_CONFIG.features.useMockServices) {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const user: UserProfile = await response.json();
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
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  /**
   * Update current user profile.
   */
  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    localStorage.setItem(APP_CONFIG.storageKeys.userSession, JSON.stringify(profile));
    return profile;
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
  logout(): void {
    localStorage.removeItem(APP_CONFIG.storageKeys.userSession);
    localStorage.removeItem(APP_CONFIG.storageKeys.authToken);
  }
}

export const authService = new AuthService();
