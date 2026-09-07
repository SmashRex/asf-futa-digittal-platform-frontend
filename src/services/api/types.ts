/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    total?: number;
    limit?: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  code?: string;
}
