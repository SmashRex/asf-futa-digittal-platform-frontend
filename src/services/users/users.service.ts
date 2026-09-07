/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, UserRole } from '../../types';
import { APP_CONFIG } from '../../config/app.config';

class UsersService {
  async getProfile(): Promise<UserProfile | null> {
    try {
      const saved = localStorage.getItem(APP_CONFIG.storageKeys.userSession);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  async updateRole(role: UserRole): Promise<UserProfile | null> {
    const profile = await this.getProfile();
    if (profile) {
      const updated = { ...profile, role };
      localStorage.setItem(APP_CONFIG.storageKeys.userSession, JSON.stringify(updated));
      return updated;
    }
    return null;
  }
}

export const usersService = new UsersService();
