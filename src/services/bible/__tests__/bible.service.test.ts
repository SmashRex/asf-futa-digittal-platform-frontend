/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { bibleService } from '../bible.service';
import { apiClient } from '../../api/client';
import { APP_CONFIG } from '../../../config/app.config';

describe('bibleService', () => {
  const originalUseMock = APP_CONFIG.features.useMockServices;

  beforeEach(() => {
    vi.restoreAllMocks();
    APP_CONFIG.features.useMockServices = true;
  });

  afterEach(() => {
    APP_CONFIG.features.useMockServices = originalUseMock;
  });

  it('returns all available Bible books', async () => {
    const books = await bibleService.getBooks('kjv');
    expect(books.length).toBeGreaterThan(0);
    expect(books[0]).toHaveProperty('id');
    expect(books[0]).toHaveProperty('name');
    expect(books[0]).toHaveProperty('chapters');
  });

  it('retrieves a book by id or name', async () => {
    const gen = await bibleService.getBookById('genesis');
    expect(gen).not.toBeNull();
    expect(gen?.name).toBe('Genesis');

    const jhn = await bibleService.getBookById('John');
    expect(jhn).not.toBeNull();
    expect(jhn?.id).toBe('john');
  });

  it('resolves a reference string into structured passage data', async () => {
    const passage = await bibleService.resolveReference('John 3:16', 'kjv');
    expect(passage).not.toBeNull();
    expect(passage?.bookName).toBe('John');
    expect(passage?.chapter).toBe(3);
    expect(passage?.verses.length).toBe(1);
    expect(passage?.verses[0].number).toBe(16);
  });

  it('searches scripture passages by keyword', async () => {
    const results = await bibleService.searchBible('light', 'kjv');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('reference');
    expect(results[0]).toHaveProperty('text');
  });

  it('retrieves available translations/versions (mock mode)', async () => {
    const versions = await bibleService.getTranslations();
    expect(versions.length).toBeGreaterThan(0);
    expect(versions.some(v => v.id === 'kjv')).toBe(true);
  });

  it('requests GET /api/bible/:translationId/:bookId/:chapter using apiClient in non-mock mode', async () => {
    APP_CONFIG.features.useMockServices = false;
    const mockChapter = {
      number: 3,
      verses: [{ number: 16, text: 'For God so loved the world...' }]
    };
    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      success: true,
      data: mockChapter,
      message: 'Chapter retrieved'
    });

    const result = await bibleService.getChapter('john', 3, 'KJV');
    expect(getSpy).toHaveBeenCalledWith('/bible/KJV/john/3');
    expect(result?.number).toBe(3);
  });

  it('uses exact bookId for hyphenated books like song-of-solomon and 1-corinthians', async () => {
    APP_CONFIG.features.useMockServices = false;
    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
      success: true,
      data: { number: 1, verses: [] },
      message: 'Chapter retrieved'
    });

    await bibleService.getChapter('song-of-solomon', 1, 'KJV');
    expect(getSpy).toHaveBeenCalledWith('/bible/KJV/song-of-solomon/1');

    await bibleService.getChapter('1-corinthians', 13, 'KJV');
    expect(getSpy).toHaveBeenCalledWith('/bible/KJV/1-corinthians/13');
  });

  it('omits verseEnd for single-verse lookup and includes verseEnd for verse range', async () => {
    APP_CONFIG.features.useMockServices = false;
    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
      success: true,
      data: { number: 3, verses: [] },
      message: 'Chapter retrieved'
    });

    // Single verse
    await bibleService.lookupScripture({
      bookId: 'john',
      chapter: 3,
      verseStart: 16,
      translationId: 'KJV'
    });
    expect(getSpy).toHaveBeenCalledWith('/bible/KJV/john/3?verseStart=16');

    // Range
    await bibleService.lookupScripture({
      bookId: 'daniel',
      chapter: 1,
      verseStart: 8,
      verseEnd: 17,
      translationId: 'KJV'
    });
    expect(getSpy).toHaveBeenCalledWith('/bible/KJV/daniel/1?verseStart=8&verseEnd=17');
  });

  it('retrieves authoritative translations via GET /api/bible/translations in non-mock mode', async () => {
    APP_CONFIG.features.useMockServices = false;
    const mockTranslations = [
      { id: 'kjv', name: 'King James Version', shortName: 'KJV', isPrebundled: true, isDefault: true, language: 'en' },
      { id: 'bsb', name: 'Berean Standard Bible', shortName: 'BSB', isPrebundled: false, isDefault: false, language: 'en' },
      { id: 'asv', name: 'American Standard Version', shortName: 'ASV', isPrebundled: false, isDefault: false, language: 'en' },
      { id: 'web', name: 'World English Bible', shortName: 'WEB', isPrebundled: false, isDefault: false, language: 'en' }
    ];
    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      success: true,
      data: mockTranslations,
      message: 'Translations retrieved'
    });

    const result = await bibleService.getTranslations();
    expect(getSpy).toHaveBeenCalledWith('/bible/translations');
    expect(result).toHaveLength(4);
    expect(result.map(t => t.id)).toEqual(['kjv', 'bsb', 'asv', 'web']);
  });

  it('throws network error and does not silently fall back to mock data when real backend fails', async () => {
    APP_CONFIG.features.useMockServices = false;
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('Network offline'));

    await expect(bibleService.getChapter('GEN', 1, 'KJV')).rejects.toThrow('Network offline');
  });
});
