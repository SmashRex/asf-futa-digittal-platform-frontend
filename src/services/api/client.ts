/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { API_CONFIG } from '../../config/api.config';
import { APP_CONFIG } from '../../config/app.config';
import { ApiResponse, ApiError } from './types';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = { ...API_CONFIG.headers };
    // Production authentication is cookie-based via HttpOnly asf_session.
    // In mock/test simulation mode only, attach simulation token if present.
    if (APP_CONFIG.features.useMockServices) {
      const token = localStorage.getItem('asf_auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorCode = response.status === 401 
      ? 'UNAUTHENTICATED' 
      : response.status === 403 
      ? 'PERMISSION_DENIED' 
      : response.status === 429
      ? 'TOO_MANY_REQUESTS'
      : 'HTTP_ERROR';
    let errorMessage = response.status === 429
      ? 'Too many attempts. Please wait a while before trying again.'
      : `API Error ${response.status}: ${response.statusText}`;
    let errorDetails: unknown = undefined;

    try {
      const data = await response.json();
      if (data?.error?.code) {
        errorCode = data.error.code;
        errorMessage = data.error.message || errorMessage;
        errorDetails = data.error.details;
      } else if (data?.message) {
        errorMessage = data.message;
      }
    } catch {
      // Body was not JSON
    }

    const error: ApiError = {
      statusCode: response.status,
      code: errorCode,
      message: errorMessage,
      details: errorDetails,
    };
    throw error;
  }

  private async processResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      await this.handleErrorResponse(response);
    }
    const result = await response.json();
    if (result && result.success === false && result.error) {
      const error: ApiError = {
        statusCode: response.status || 400,
        code: result.error.code || 'API_ERROR',
        message: result.error.message || 'API request returned an error',
        details: result.error.details,
      };
      throw error;
    }
    return result;
  }

  private normalizeUrl(path: string): string {
    const cleanPath = path.startsWith('/api/') 
      ? path.replace(/^\/api/, '') 
      : path.startsWith('/api') 
      ? path.replace(/^\/api/, '') 
      : path;
    const formatted = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    return `${this.baseUrl}${formatted}`;
  }

  async get<T>(path: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.normalizeUrl(path), {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      return await this.processResponse<T>(response);
    } catch (err: any) {
      if (err.statusCode && err.code) {
        throw err;
      }
      throw {
        statusCode: 500,
        code: 'NETWORK_ERROR',
        message: err.message || 'Network request failed',
      } as ApiError;
    }
  }

  async post<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
      const headers: Record<string, string> = { ...(this.getHeaders() as Record<string, string>) };
      if (isFormData) {
        delete headers['Content-Type'];
      }
      const response = await fetch(this.normalizeUrl(path), {
        method: 'POST',
        headers,
        credentials: 'include',
        body: isFormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
      });
      return await this.processResponse<T>(response);
    } catch (err: any) {
      if (err.statusCode && err.code) {
        throw err;
      }
      throw {
        statusCode: 500,
        code: 'NETWORK_ERROR',
        message: err.message || 'Network request failed',
      } as ApiError;
    }
  }

  async put<T>(path: string, body: any): Promise<ApiResponse<T>> {
    try {
      const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
      const headers: Record<string, string> = { ...(this.getHeaders() as Record<string, string>) };
      if (isFormData) {
        delete headers['Content-Type'];
      }
      const response = await fetch(this.normalizeUrl(path), {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: isFormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
      });
      return await this.processResponse<T>(response);
    } catch (err: any) {
      if (err.statusCode && err.code) {
        throw err;
      }
      throw {
        statusCode: 500,
        code: 'NETWORK_ERROR',
        message: err.message || 'Network request failed',
      } as ApiError;
    }
  }

  async patch<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
      const headers: Record<string, string> = { ...(this.getHeaders() as Record<string, string>) };
      if (isFormData) {
        delete headers['Content-Type'];
      }
      const response = await fetch(this.normalizeUrl(path), {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: isFormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
      });
      return await this.processResponse<T>(response);
    } catch (err: any) {
      if (err.statusCode && err.code) {
        throw err;
      }
      throw {
        statusCode: 500,
        code: 'NETWORK_ERROR',
        message: err.message || 'Network request failed',
      } as ApiError;
    }
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.normalizeUrl(path), {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      return await this.processResponse<T>(response);
    } catch (err: any) {
      if (err.statusCode && err.code) {
        throw err;
      }
      throw {
        statusCode: 500,
        code: 'NETWORK_ERROR',
        message: err.message || 'Network request failed',
      } as ApiError;
    }
  }
}

export const apiClient = new ApiClient();
