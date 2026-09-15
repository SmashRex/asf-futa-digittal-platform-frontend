/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  BibleBookDetail, 
  BibleChapterDetail, 
  BibleVerseDetail, 
  BibleVersion, 
  BibleSearchResult, 
  BibleResolvedPassage, 
  BibleReference 
} from '../../types';
import { mockBibleBooks, mockBibleBooksWEB, mockBibleVersions, searchBible } from '../../data/bibleData';
import { normalizeBookId, parseBibleReference, BIBLE_BOOKS_CATALOG } from '../../config/bible.config';
import { APP_CONFIG } from '../../config/app.config';
import { apiClient } from '../api/client';

export const bibleService = {
  /**
   * Fetch list of available Bible books with chapter counts: GET /api/bible/books
   * The backend's /api/bible/books is the authoritative source for the 66-book structure.
   * There is intentionally no per-translation book endpoint.
   */
  async getBooks(_versionId?: string): Promise<BibleBookDetail[]> {
    if (APP_CONFIG.features.useMockServices) {
      return mockBibleBooks;
    }
    const res = await apiClient.get<any>('/bible/books');
    const rawList = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : res.data?.books || []);
    if (Array.isArray(rawList) && rawList.length > 0) {
      return rawList.map((b: any) => ({
        id: b.bookId || b.id || b.code || normalizeBookId(b.name),
        name: b.name || b.title,
        testament: b.testament || 'Old',
        chapters: Array.isArray(b.chapters) ? b.chapters : Array.from({ length: b.chaptersCount || b.totalChapters || 1 }, (_, i) => ({
          number: i + 1,
          verses: []
        })),
        totalChapters: b.chaptersCount || b.totalChapters || (Array.isArray(b.chapters) ? b.chapters.length : 1),
      }));
    }
    return [];
  },

  /**
   * Fetch details for a specific book by ID or canonical name.
   */
  async getBookById(bookIdOrName: string, versionId: string = 'kjv'): Promise<BibleBookDetail | null> {
    const normId = normalizeBookId(bookIdOrName);
    if (APP_CONFIG.features.useMockServices) {
      const source = versionId === 'web' ? mockBibleBooksWEB : mockBibleBooks;
      return source.find(b => b.id.toLowerCase() === normId.toLowerCase() || b.name.toLowerCase() === bookIdOrName.toLowerCase()) || null;
    }
    const books = await this.getBooks(versionId);
    return books.find(b => b.id.toLowerCase() === normId.toLowerCase() || b.id.toLowerCase() === bookIdOrName.toLowerCase() || b.name.toLowerCase() === bookIdOrName.toLowerCase()) || null;
  },

  /**
   * Fetch verses for a specific chapter within a book:
   * GET /api/bible/:translationId/:bookId/:chapter
   * Supports optional query parameters:
   *   ?verseStart={verseStart}
   *   ?verseStart={verseStart}&verseEnd={verseEnd} (single verse omits verseEnd)
   * Example: GET /api/bible/KJV/john/3
   */
  async getChapter(
    bookIdOrName: string, 
    chapterNum: number, 
    versionId: string = 'KJV',
    options?: { verseStart?: number; verseEnd?: number }
  ): Promise<BibleChapterDetail | null> {
    const translationId = (versionId || 'KJV').toUpperCase();

    // Use the exact book ID without reconstructing or overwriting with 3-letter catalog ID
    let authoritativeBookId = bookIdOrName.trim();
    if (authoritativeBookId.includes(' ')) {
      const matchedCatalog = BIBLE_BOOKS_CATALOG.find(b => 
        b.name.toLowerCase() === authoritativeBookId.toLowerCase()
      );
      if (matchedCatalog) {
        authoritativeBookId = matchedCatalog.name.toLowerCase().replace(/\s+/g, '-');
      }
    }

    if (APP_CONFIG.features.useMockServices) {
      const book = await this.getBookById(authoritativeBookId, versionId);
      if (!book) return null;
      const ch = book.chapters.find(c => c.number === chapterNum) || null;
      if (!ch) return null;
      if (options?.verseStart !== undefined) {
        const vStart = options.verseStart;
        const vEnd = (options.verseEnd !== undefined && options.verseEnd !== vStart) ? options.verseEnd : vStart;
        return {
          number: ch.number,
          verses: ch.verses.filter(v => v.number >= vStart && v.number <= vEnd)
        };
      }
      return ch;
    }

    // Build URL with query params
    let url = `/bible/${encodeURIComponent(translationId)}/${encodeURIComponent(authoritativeBookId)}/${encodeURIComponent(chapterNum)}`;
    const queryParams: string[] = [];
    if (options?.verseStart !== undefined) {
      queryParams.push(`verseStart=${encodeURIComponent(options.verseStart)}`);
      // Omit verseEnd for a single verse! Only include if verseEnd is distinct from verseStart
      if (options.verseEnd !== undefined && options.verseEnd !== options.verseStart) {
        queryParams.push(`verseEnd=${encodeURIComponent(options.verseEnd)}`);
      }
    }
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    const cacheKey = `asf_real_bible_chapter_${translationId}_${authoritativeBookId}_${chapterNum}_${options?.verseStart || ''}_${options?.verseEnd || ''}`;

    try {
      const res = await apiClient.get<any>(url);
      const raw = res.data?.data || res.data;
      if (raw) {
        const formatted: BibleChapterDetail = {
          number: raw.number || raw.chapter || chapterNum,
          verses: Array.isArray(raw.verses) ? raw.verses : (Array.isArray(raw) ? raw : [])
        };
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            isRealBackendData: true,
            cachedAt: Date.now(),
            chapter: formatted
          }));
        } catch {}
        return formatted;
      }
    } catch (networkErr: any) {
      // Offline fallback: check for previously cached real backend scripture
      try {
        const cachedStr = localStorage.getItem(cacheKey);
        if (cachedStr) {
          const cached = JSON.parse(cachedStr);
          if (cached && cached.isRealBackendData && cached.chapter) {
            return cached.chapter;
          }
        }
      } catch {}

      // If real backend request fails, do NOT silently fall back to mock data
      throw networkErr;
    }

    return null;
  },

  /**
   * Clickable scripture references lookup using the shared chapter endpoint:
   * GET /api/bible/:translationId/:bookId/:chapter?verseStart=X&verseEnd=Y
   */
  async lookupScripture(params: {
    bookId: string;
    chapter: number;
    verseStart?: number;
    verseEnd?: number;
    translationId?: string;
  }): Promise<BibleChapterDetail | null> {
    const translationId = params.translationId || 'KJV';
    return this.getChapter(params.bookId, params.chapter, translationId, {
      verseStart: params.verseStart,
      verseEnd: params.verseEnd,
    });
  },

  /**
   * Fetch a specific single verse.
   */
  async getVerse(bookIdOrName: string, chapterNum: number, verseNum: number, versionId: string = 'kjv'): Promise<BibleVerseDetail | null> {
    const chapter = await this.getChapter(bookIdOrName, chapterNum, versionId, { verseStart: verseNum });
    if (!chapter) return null;
    return chapter.verses.find(v => v.number === verseNum) || chapter.verses[0] || null;
  },

  /**
   * Authoritative Bible translations endpoint:
   * GET /api/bible/translations
   * Dynamically fetches whatever translations the backend currently returns.
   * Does NOT hardcode a static list or limit to 3 or 4 versions.
   */
  async getTranslations(): Promise<BibleVersion[]> {
    if (APP_CONFIG.features.useMockServices) {
      return mockBibleVersions;
    }

    try {
      const res = await apiClient.get<any>('/bible/translations');
      const list = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : res.data?.translations || [];
      if (Array.isArray(list) && list.length > 0) {
        return list.map((t: any) => ({
          id: String(t.id || t.shortName || t.code).toLowerCase(),
          name: t.name || t.title || t.id,
          shortName: (t.shortName || t.id || '').toUpperCase(),
          isPrebundled: Boolean(t.isPrebundled ?? (String(t.id).toLowerCase() === 'kjv')),
          isDefault: Boolean(t.isDefault ?? (String(t.id).toLowerCase() === 'kjv')),
          language: t.language || 'en'
        }));
      }
      return [];
    } catch (err) {
      // In real backend mode, do NOT silently fall back to mock data
      throw err;
    }
  },

  /**
   * Backward-compatible alias for getTranslations.
   */
  async getVersions(): Promise<BibleVersion[]> {
    return this.getTranslations();
  },

  /**
   * Execute full text or reference-based search across Scripture:
   * GET /api/bible/search?q=<term>&translationId=<id>&limit=<n>
   */
  async searchBible(query: string, versionId: string = 'kjv', limit: number = 50): Promise<BibleSearchResult[]> {
    if (APP_CONFIG.features.useMockServices) {
      return searchBible(query, versionId);
    }
    const translationId = (versionId || 'KJV').toUpperCase();
    const res = await apiClient.get<any>(`/bible/search?q=${encodeURIComponent(query)}&translationId=${encodeURIComponent(translationId)}&limit=${limit}`);
    const results = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : res.data?.results || []);
    return results;
  },

  async search(query: string, versionId: string = 'kjv'): Promise<BibleSearchResult[]> {
    return this.searchBible(query, versionId);
  },

  /**
   * Resolves a scripture reference string or BibleReference object into structured passage details.
   */
  async resolveReference(reference: string | BibleReference, versionId: string = 'kjv'): Promise<BibleResolvedPassage | null> {
    const parsedRef = typeof reference === 'string' ? parseBibleReference(reference) : reference;
    if (!parsedRef) return null;

    const bookId = parsedRef.bookId || parsedRef.book;
    const chapterNum = parsedRef.chapter;

    const chapter = await this.getChapter(bookId, chapterNum, versionId, {
      verseStart: parsedRef.verseStart,
      verseEnd: parsedRef.verseEnd
    });
    if (!chapter) return null;

    return {
      reference: typeof reference === 'string' ? reference : `${parsedRef.book || parsedRef.bookId} ${parsedRef.chapter}`,
      bookId,
      bookName: parsedRef.book || bookId,
      chapter: chapter.number,
      verses: chapter.verses,
      versionId
    };
  }
};
