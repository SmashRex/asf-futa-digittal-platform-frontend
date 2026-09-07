/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale' | 'pad';
  gravity?: 'face' | 'center' | 'auto';
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  radius?: 'max' | number;
}

export type MediaPreset = 'hero' | 'card' | 'thumbnail' | 'avatar' | 'banner' | 'raw';

export const MEDIA_CONFIG = {
  cloudinaryBaseUrl: import.meta.env.VITE_CLOUDINARY_BASE_URL || 'https://res.cloudinary.com/asf-futa/image/upload',
  
  // Transformation Presets for Automatic Asset Optimization
  presets: {
    hero: 'f_auto,q_auto,w_1200,c_fill',
    card: 'f_auto,q_auto,w_600,c_fill',
    thumbnail: 'f_auto,q_auto,w_300,c_thumb,g_face',
    avatar: 'f_auto,q_auto,w_150,h_150,c_fill,g_face,r_max',
    banner: 'f_auto,q_auto,w_1600,c_limit',
    raw: 'f_auto,q_auto',
  } as Record<MediaPreset, string>,

  // Standard responsive breakpoints for srcset generation
  responsiveWidths: [320, 640, 768, 1024, 1280, 1600],

  placeholders: {
    eventHero: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    bibleStudy: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80',
    worship: 'https://images.unsplash.com/photo-1510561195210-915995574045?auto=format&fit=crop&w=1200&q=80',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    announcementBanner: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
    logoSeal: '/logo.png',
  },

  /**
   * Generates a Cloudinary transformation string based on options
   */
  buildTransformString: (options: CloudinaryTransformOptions = {}): string => {
    const parts: string[] = [];
    parts.push(`f_${options.format || 'auto'}`);
    parts.push(`q_${options.quality || 'auto'}`);
    if (options.width) parts.push(`w_${options.width}`);
    if (options.height) parts.push(`h_${options.height}`);
    if (options.crop) parts.push(`c_${options.crop}`);
    if (options.gravity) parts.push(`g_${options.gravity}`);
    if (options.radius) parts.push(`r_${options.radius}`);
    return parts.join(',');
  },

  /**
   * Constructs an optimized Cloudinary media URL with preset transformations
   */
  buildCloudinaryUrl: (publicId: string, preset: MediaPreset | CloudinaryTransformOptions = 'raw'): string => {
    if (!publicId) return '';
    const cleanId = publicId.replace(/^\//, '');
    const transform = typeof preset === 'string' 
      ? MEDIA_CONFIG.presets[preset] || MEDIA_CONFIG.presets.raw 
      : MEDIA_CONFIG.buildTransformString(preset);

    return `${MEDIA_CONFIG.cloudinaryBaseUrl}/${transform}/${cleanId}`;
  },

  /**
   * Generates a responsive srcset string for Cloudinary images
   */
  getSrcSet: (publicId: string, widths: number[] = MEDIA_CONFIG.responsiveWidths): string => {
    if (!publicId || publicId.startsWith('http')) return '';
    return widths
      .map(w => `${MEDIA_CONFIG.buildCloudinaryUrl(publicId, { width: w, crop: 'fill' })} ${w}w`)
      .join(', ');
  },

  /**
   * Transforms image paths or handles Cloudinary URL construction with fallbacks.
   */
  getMediaUrl: (
    pathOrUrl?: string, 
    fallbackType: 'eventHero' | 'bibleStudy' | 'worship' | 'userAvatar' | 'announcementBanner' = 'eventHero',
    preset: MediaPreset = 'raw'
  ): string => {
    if (!pathOrUrl || pathOrUrl.trim() === '') {
      return MEDIA_CONFIG.placeholders[fallbackType];
    }
    
    // If it's already a full HTTP URL or data URI, return as-is
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || pathOrUrl.startsWith('data:')) {
      return pathOrUrl;
    }

    // If it's a relative path/public ID intended for Cloudinary
    return MEDIA_CONFIG.buildCloudinaryUrl(pathOrUrl, preset);
  }
};
