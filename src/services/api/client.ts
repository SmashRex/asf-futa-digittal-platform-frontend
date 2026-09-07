/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { API_CONFIG } from '../../config/api.config';
import { ApiResponse, ApiError } from './types';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = { ...API_CONFIG.headers };
    const token = localStorage.getItem('asf_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async get<T>(path: string): Promise<ApiResponse<T>> {
    // If backend isn't live yet, callers will catch or fallback to mock data via service layer abstraction
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err: any) {
      throw {
        statusCode: 500,
        message: err.message || 'Network request failed',
      } as ApiError;
    }
  }

  async post<T>(path: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err: any) {
      throw {
        statusCode: 500,
        message: err.message || 'Network request failed',
      } as ApiError;
    }
  }

  async put<T>(path: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err: any) {
      throw {
        statusCode: 500,
        message: err.message || 'Network request failed',
      } as ApiError;
    }
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err: any) {
      throw {
        statusCode: 500,
        message: err.message || 'Network request failed',
      } as ApiError;
    }
  }
}

export const apiClient = new ApiClient();
