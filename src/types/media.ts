/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MediaAsset {
  id?: string;
  url: string;
  format?: string;
  mimeType?: string;
  bytes?: number;
  width?: number;
  height?: number;
  altText?: string | null;
}

export interface MediaPlacement {
  key: string;
  asset: MediaAsset | null;
}
