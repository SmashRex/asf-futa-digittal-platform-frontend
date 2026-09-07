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
import { normalizeBookId, parseBibleReference } from '../../config/bible.config';
import { APP_CONFIG } from '../../config/app.config';
import { apiClient } from '../api/client';

export const bibleService = {
  /**
   * Fetch list of available Bible books with chapter counts.
   */
  async getBooks(versionId: string = 'kjv'): Promise<BibleBookDetail[]> {
    if (APP_CONFIG.features.useMockServices) {
      return versionId === 'web' ? mockBibleBooksWEB : mockBibleBooks;
    }
    const res = await apiClient.get<BibleBookDetail[]>(`/api/bible/books?version=${versionId}`);
    return res.data;
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
    const res = await apiClient.get<BibleBookDetail>(`/api/bible/books/${normId}?version=${versionId}`);
    return res.data;
  },

  /**
   * Fetch verses for a specific chapter within a book.
   */
  async getChapter(bookIdOrName: string, chapterNum: number, versionId: string = 'kjv'): Promise<BibleChapterDetail | null> {
    const normId = normalizeBookId(bookIdOrName);
    if (APP_CONFIG.features.useMockServices) {
      const book = await this.getBookById(normId, versionId);
      if (!book) return null;
      return book.chapters.find(c => c.number === chapterNum) || null;
    }
    const res = await apiClient.get<BibleChapterDetail>(`/api/bible/books/${normId}/chapters/${chapterNum}?version=${versionId}`);
    return res.data;
  },

  /**
   * Fetch a specific single verse.
   */
  async getVerse(bookIdOrName: string, chapterNum: number, verseNum: number, versionId: string = 'kjv'): Promise<BibleVerseDetail | null> {
    const chapter = await this.getChapter(bookIdOrName, chapterNum, versionId);
    if (!chapter) return null;
    return chapter.verses.find(v => v.number === verseNum) || null;
  },

  /**
   * Fetch available Bible translations (e.g. KJV, WEB, AMP).
   */
  async getVersions(): Promise<BibleVersion[]> {
    if (APP_CONFIG.features.useMockServices) {
      return mockBibleVersions;
    }
    const res = await apiClient.get<BibleVersion[]>('/api/bible/versions');
    return res.data;
  },

  /**
   * Execute full text or reference-based search across Scripture.
   */
  async searchBible(query: string, versionId: string = 'kjv'): Promise<BibleSearchResult[]> {
    if (APP_CONFIG.features.useMockServices) {
      return searchBible(query, versionId);
    }
    const res = await apiClient.get<BibleSearchResult[]>(`/api/bible/search?q=${encodeURIComponent(query)}&version=${versionId}`);
    return res.data;
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

    const book = await this.getBookById(parsedRef.bookId || parsedRef.book, versionId);
    if (!book) return null;

    const chapter = book.chapters.find(c => c.number === parsedRef.chapter);
    if (!chapter) return null;

    let targetVerses = chapter.verses;
    if (parsedRef.verseStart !== undefined) {
      const vStart = parsedRef.verseStart;
      const vEnd = parsedRef.verseEnd || vStart;
      targetVerses = chapter.verses.filter(v => v.number >= vStart && v.number <= vEnd);
    }

    return {
      reference: typeof reference === 'string' ? reference : `${book.name} ${parsedRef.chapter}`,
      bookId: book.id,
      bookName: book.name,
      chapter: chapter.number,
      verses: targetVerses,
      versionId
    };
  }
};
