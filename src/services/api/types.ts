/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BackendErrorResponseBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiErrorResponse extends BackendErrorResponseBody {}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    total?: number;
    limit?: number;
    [key: string]: any;
  };
}

export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
}
