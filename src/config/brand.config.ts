/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Central configuration for official Anglican Students' Fellowship (ASF) branding.
 * 
 * When the official high-resolution raster or vector logo asset is supplied,
 * set `officialLogoUrl` to that asset path (e.g. '/brand/asf-official-logo.svg').
 * When undefined or null, the application renders the authoritative SVG crest.
 */
export const BRAND_CONFIG = {
  name: "Anglican Students' Fellowship",
  shortName: 'ASF',
  chapter: 'FUTA Chapter',
  chapterIdentifier: 'FUTA',
  fullIdentifier: 'ASF FUTA',
  institution: 'Federal University of Technology, Akure',
  motto: 'Arise, Shine!',
  scriptureMotto: '"For the glory of the Lord is risen upon thee." - Isaiah 60:1',
  /**
   * Path to official ASF logo asset.
   * When an official asset file is placed in /public or hosted via CDN, configure here:
   */
  officialLogoUrl: undefined as string | undefined,
};
