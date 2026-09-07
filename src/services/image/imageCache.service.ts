/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const CACHE_NAME = 'asf-image-cache';

export interface CacheStats {
  sizeInMb: number;
  itemCount: number;
}

class ImageCacheService {
  private inMemoryFallback = new Map<string, string>();
  private cacheListeners = new Set<(online: boolean) => void>();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleConnectivityChange(true));
      window.addEventListener('offline', () => this.handleConnectivityChange(false));
    }
  }

  /**
   * Listen for network connectivity changes
   */
  public onConnectivityChange(callback: (online: boolean) => void): () => void {
    this.cacheListeners.add(callback);
    return () => {
      this.cacheListeners.delete(callback);
    };
  }

  private handleConnectivityChange(online: boolean) {
    this.cacheListeners.forEach((listener) => listener(online));
  }

  /**
   * Checks if the browser is currently online
   */
  public isOnline(): boolean {
    if (typeof navigator === 'undefined') return true;
    return navigator.onLine;
  }

  /**
   * Checks if the given URL is already cached.
   * If cached, returns a local object URL (blob:) to render instantly offline.
   * Otherwise returns null.
   */
  public async getCachedImage(url: string): Promise<string | null> {
    if (!url) return null;

    // Check in-memory fallback first
    if (this.inMemoryFallback.has(url)) {
      return this.inMemoryFallback.get(url) || null;
    }

    if (typeof window === 'undefined' || !('caches' in window)) {
      return null;
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(url);
      
      if (cachedResponse) {
        const blob = await cachedResponse.blob();
        const blobUrl = URL.createObjectURL(blob);
        this.inMemoryFallback.set(url, blobUrl); // cache locally in memory for performance
        return blobUrl;
      }
    } catch (error) {
      console.warn('[ImageCacheService] Failed to check Cache Storage:', error);
    }

    return null;
  }

  /**
   * Fetches an image from remote and caches it locally.
   * If offline or fetch fails, falls back gracefully.
   */
  public async cacheImage(url: string): Promise<string | null> {
    if (!url) return null;

    if (typeof window === 'undefined' || !('caches' in window)) {
      return url;
    }

    // Don't cache local/bundled resources (starts with /src, data: or /)
    if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      
      // Fetch fresh image from remote
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });

      if (response.ok) {
        // Cache the response clone
        await cache.put(url, response.clone());
        
        // Convert to local blob url
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        this.inMemoryFallback.set(url, blobUrl);
        return blobUrl;
      }
    } catch (error) {
      console.warn(`[ImageCacheService] Failed to fetch and cache image (${url}):`, error);
    }

    return null;
  }

  /**
   * Pre-caches a list of remote image URLs
   */
  public async cacheImages(urls: string[]): Promise<void> {
    if (typeof window === 'undefined' || !('caches' in window) || !this.isOnline()) {
      return;
    }

    const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
    const promises = uniqueUrls.map(url => this.cacheImage(url).catch(err => {
      console.warn(`[ImageCacheService] Pre-cache failed for ${url}:`, err);
    }));

    await Promise.all(promises);
  }

  /**
   * Remove a specific cached image
   */
  public async removeCachedImage(url: string): Promise<void> {
    if (!url) return;

    // Clear in-memory
    const blobUrl = this.inMemoryFallback.get(url);
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      this.inMemoryFallback.delete(url);
    }

    if (typeof window === 'undefined' || !('caches' in window)) {
      return;
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(url);
    } catch (error) {
      console.warn('[ImageCacheService] Failed to delete cached asset:', error);
    }
  }

  /**
   * Gets stats about the image cache store
   */
  public async getCacheStats(): Promise<CacheStats> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return { sizeInMb: 0, itemCount: 0 };
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      let totalBytes = 0;

      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalBytes += blob.size;
        }
      }

      const sizeInMb = Number((totalBytes / (1024 * 1024)).toFixed(2));
      return { sizeInMb, itemCount: keys.length };
    } catch (error) {
      console.warn('[ImageCacheService] Failed to calculate cache stats:', error);
      return { sizeInMb: 0, itemCount: 0 };
    }
  }

  /**
   * Clear the entire image cache
   */
  public async clearImageCache(): Promise<void> {
    // Clear blob URLs in memory
    this.inMemoryFallback.forEach((blobUrl) => {
      try {
        URL.revokeObjectURL(blobUrl);
      } catch (e) {}
    });
    this.inMemoryFallback.clear();

    if (typeof window === 'undefined' || !('caches' in window)) {
      return;
    }

    try {
      await caches.delete(CACHE_NAME);
    } catch (error) {
      console.warn('[ImageCacheService] Failed to clear image cache:', error);
    }
  }
}

export const imageCacheService = new ImageCacheService();
