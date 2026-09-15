/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MEDIA_CONFIG, MediaPreset } from '../../config/media.config';
import { imageCacheService } from '../../services/image/imageCache.service';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackType?: 'eventHero' | 'bibleStudy' | 'worship' | 'userAvatar' | 'announcementBanner' | 'logoSeal';
  preset?: MediaPreset;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  alt: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackType = 'eventHero',
  preset = 'raw',
  aspectRatio = 'aspect-auto',
  objectFit = 'cover',
  alt,
  className = '',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displaySrc, setDisplaySrc] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    setError(false);
    setLoading(true);

    if (!src) {
      setLoading(false);
      setDisplaySrc('');
      setError(true);
      return;
    }

    const resolvedInitialSrc = MEDIA_CONFIG.getMediaUrl(
      src, 
      fallbackType as 'eventHero' | 'bibleStudy' | 'worship' | 'userAvatar' | 'announcementBanner',
      preset
    );

    async function loadOfflineFirst() {
      // 1. Try to find local cached image
      const cached = await imageCacheService.getCachedImage(resolvedInitialSrc);
      
      if (!isMounted) return;

      if (cached) {
        setDisplaySrc(cached);
        setLoading(false);

        // If online, check for updated remote content and refresh local cached version
        if (imageCacheService.isOnline()) {
          try {
            const fresh = await imageCacheService.cacheImage(resolvedInitialSrc);
            if (fresh && fresh !== cached && isMounted) {
              setDisplaySrc(fresh);
            }
          } catch (e) {
            console.warn('[ImageWithFallback] Background update failed:', e);
          }
        }
      } else {
        // 2. Try to fetch remote image and cache if online
        if (imageCacheService.isOnline()) {
          try {
            const fresh = await imageCacheService.cacheImage(resolvedInitialSrc);
            if (!isMounted) return;
            if (fresh) {
              setDisplaySrc(fresh);
              setLoading(false);
            } else {
              // Fetch failed, try raw remote source directly
              setDisplaySrc(resolvedInitialSrc);
            }
          } catch (e) {
            if (isMounted) {
              setDisplaySrc(resolvedInitialSrc);
            }
          }
        } else {
          // Offline and uncached - render fallback placeholder
          if (isMounted) {
            setError(true);
            setLoading(false);
          }
        }
      }
    }

    loadOfflineFirst();

    // Monitor online network changes to trigger sync
    const unsubscribe = imageCacheService.onConnectivityChange((online) => {
      if (online && !displaySrc && src) {
        loadOfflineFirst();
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [src, fallbackType, preset]);

  const handleLoadComplete = () => {
    setLoading(false);
  };

  const handleError = () => {
    // If the image fails to load, mark error to display fallback
    setError(true);
    setLoading(false);
  };

  const objectFitClass = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none'
  }[objectFit];

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`} id={`img-container-${Math.random().toString(36).substr(2, 5)}`}>
      {/* Shimmer skeleton loader */}
      {loading && (
        <div className="absolute inset-0 bg-[#E4E4E7] animate-pulse flex items-center justify-center text-[var(--color-text-light)]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>
      )}

      {/* Error state layout preservation */}
      {error ? (
        <div className="absolute inset-0 bg-[#FAF8F5] border border-[var(--color-border)] flex flex-col items-center justify-center p-3 text-center">
          <ImageOff className="w-5 h-5 mb-1.5 text-[var(--color-text-light)] opacity-75" />
          <span className="text-[10px] font-medium text-[var(--color-text-secondary)] line-clamp-1 px-2" title={alt}>
            {alt || 'Asset unavailable'}
          </span>
        </div>
      ) : (
        displaySrc && (
          <img
            src={displaySrc}
            alt={alt}
            onLoad={handleLoadComplete}
            onError={handleError}
            referrerPolicy="no-referrer"
            className={`w-full h-full transition-all duration-300 ${objectFitClass} ${
              loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
            {...props}
          />
        )
      )}
    </div>
  );
};

