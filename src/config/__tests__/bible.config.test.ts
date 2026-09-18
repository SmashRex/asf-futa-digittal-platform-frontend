/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { 
  parseBibleReference, 
  formatBibleReference, 
  normalizeBookId, 
  buildBibleRoute, 
  buildBibleStudyRoute 
} from '../bible.config';

describe('bible.config utilities', () => {
  it('parses standard scripture reference with single verse', () => {
    const ref = parseBibleReference('John 3:16');
    expect(ref).not.toBeNull();
    expect(ref?.book).toBe('John');
    expect(ref?.bookId).toBe('john');
    expect(ref?.chapter).toBe(3);
    expect(ref?.verseStart).toBe(16);
    expect(ref?.verseEnd).toBe(16);
  });

  it('parses scripture reference with verse range', () => {
    const ref = parseBibleReference('Matthew 5:14-16');
    expect(ref).not.toBeNull();
    expect(ref?.book).toBe('Matthew');
    expect(ref?.bookId).toBe('matthew');
    expect(ref?.chapter).toBe(5);
    expect(ref?.verseStart).toBe(14);
    expect(ref?.verseEnd).toBe(16);
  });

  it('formats structured BibleReference correctly', () => {
    const formatted = formatBibleReference({
      book: 'Genesis',
      chapter: 1,
      verseStart: 1,
      verseEnd: 3
    });
    expect(formatted).toBe('Genesis 1:1-3');
  });

  it('normalizes book names and abbreviations to standard IDs', () => {
    expect(normalizeBookId('Genesis')).toBe('genesis');
    expect(normalizeBookId('gen')).toBe('genesis');
    expect(normalizeBookId('1 Corinthians')).toBe('1-corinthians');
    expect(normalizeBookId('1Cor')).toBe('1-corinthians');
    expect(normalizeBookId('Rev')).toBe('revelation');
  });

  it('builds canonical routing paths for Holy Bible', () => {
    expect(buildBibleRoute('john', 3)).toBe('/bible/john/3');
    expect(buildBibleRoute('John', 3, 16)).toBe('/bible/john/3/16');
  });

  it('builds canonical routing paths for Bible Study', () => {
    expect(buildBibleStudyRoute('study-01')).toBe('/bible-study/read/study-01');
  });
});
