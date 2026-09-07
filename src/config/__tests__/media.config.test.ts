/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { MEDIA_CONFIG } from '../media.config';

describe('Media & Cloudinary Configuration', () => {
  it('should generate fallback URLs when path is empty', () => {
    const fallback = MEDIA_CONFIG.getMediaUrl('', 'eventHero');
    expect(fallback).toBe(MEDIA_CONFIG.placeholders.eventHero);
  });

  it('should return external absolute URLs unchanged', () => {
    const external = 'https://images.unsplash.com/photo-example';
    expect(MEDIA_CONFIG.getMediaUrl(external)).toBe(external);
  });

  it('should build Cloudinary optimized URL with transformation presets', () => {
    const url = MEDIA_CONFIG.buildCloudinaryUrl('events/fellowship-banner.jpg', 'hero');
    expect(url).toContain(MEDIA_CONFIG.cloudinaryBaseUrl);
    expect(url).toContain(MEDIA_CONFIG.presets.hero);
    expect(url).toContain('events/fellowship-banner.jpg');
  });

  it('should support custom transformation options', () => {
    const url = MEDIA_CONFIG.buildCloudinaryUrl('avatars/john.jpg', {
      width: 200,
      height: 200,
      crop: 'fill',
      gravity: 'face',
      radius: 'max',
    });

    expect(url).toContain('w_200');
    expect(url).toContain('h_200');
    expect(url).toContain('c_fill');
    expect(url).toContain('g_face');
    expect(url).toContain('r_max');
    expect(url).toContain('f_auto');
    expect(url).toContain('q_auto');
  });

  it('should generate responsive srcset string for responsive widths', () => {
    const srcset = MEDIA_CONFIG.getSrcSet('events/freshers-welcome.jpg', [320, 640, 1024]);
    expect(srcset).toContain('320w');
    expect(srcset).toContain('640w');
    expect(srcset).toContain('1024w');
    expect(srcset).toContain('w_320');
    expect(srcset).toContain('w_640');
    expect(srcset).toContain('w_1024');
  });
});
