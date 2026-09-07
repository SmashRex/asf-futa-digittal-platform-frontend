/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { bibleService } from '../bible.service';

describe('bibleService', () => {
  it('returns all available Bible books', async () => {
    const books = await bibleService.getBooks('kjv');
    expect(books.length).toBeGreaterThan(0);
    expect(books[0]).toHaveProperty('id');
    expect(books[0]).toHaveProperty('name');
    expect(books[0]).toHaveProperty('chapters');
  });

  it('retrieves a book by id or name', async () => {
    const gen = await bibleService.getBookById('GEN');
    expect(gen).not.toBeNull();
    expect(gen?.name).toBe('Genesis');

    const jhn = await bibleService.getBookById('John');
    expect(jhn).not.toBeNull();
    expect(jhn?.id).toBe('JHN');
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
});
