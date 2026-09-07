/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BibleBookDetail, BibleReference, BibleVersion } from '../types';

export interface BibleBookMeta {
  id: string; // e.g. "GEN"
  name: string; // e.g. "Genesis"
  testament: 'Old' | 'New';
  chaptersCount: number;
  abbreviations: string[];
}

export const BIBLE_BOOKS_CATALOG: BibleBookMeta[] = [
  // Old Testament
  { id: 'GEN', name: 'Genesis', testament: 'Old', chaptersCount: 50, abbreviations: ['gen', 'ge', 'gn'] },
  { id: 'EXO', name: 'Exodus', testament: 'Old', chaptersCount: 40, abbreviations: ['exo', 'ex', 'exod'] },
  { id: 'LEV', name: 'Leviticus', testament: 'Old', chaptersCount: 27, abbreviations: ['lev', 'le', 'lv'] },
  { id: 'NUM', name: 'Numbers', testament: 'Old', chaptersCount: 36, abbreviations: ['num', 'nu', 'nm', 'nb'] },
  { id: 'DEU', name: 'Deuteronomy', testament: 'Old', chaptersCount: 34, abbreviations: ['deu', 'dt', 'deut'] },
  { id: 'JOS', name: 'Joshua', testament: 'Old', chaptersCount: 24, abbreviations: ['jos', 'josh'] },
  { id: 'JDG', name: 'Judges', testament: 'Old', chaptersCount: 21, abbreviations: ['jdg', 'judg', 'jgs'] },
  { id: 'RUT', name: 'Ruth', testament: 'Old', chaptersCount: 4, abbreviations: ['rut', 'rth', 'ru'] },
  { id: '1SA', name: '1 Samuel', testament: 'Old', chaptersCount: 31, abbreviations: ['1sa', '1sam', '1 s', '1 samuel'] },
  { id: '2SA', name: '2 Samuel', testament: 'Old', chaptersCount: 24, abbreviations: ['2sa', '2sam', '2 s', '2 samuel'] },
  { id: '1KI', name: '1 Kings', testament: 'Old', chaptersCount: 22, abbreviations: ['1ki', '1kgs', '1 kings'] },
  { id: '2KI', name: '2 Kings', testament: 'Old', chaptersCount: 25, abbreviations: ['2ki', '2kgs', '2 kings'] },
  { id: '1CH', name: '1 Chronicles', testament: 'Old', chaptersCount: 29, abbreviations: ['1ch', '1chr', '1 chron'] },
  { id: '2CH', name: '2 Chronicles', testament: 'Old', chaptersCount: 36, abbreviations: ['2ch', '2chr', '2 chron'] },
  { id: 'EZR', name: 'Ezra', testament: 'Old', chaptersCount: 10, abbreviations: ['ezr', 'ez'] },
  { id: 'NEH', name: 'Nehemiah', testament: 'Old', chaptersCount: 13, abbreviations: ['neh', 'ne'] },
  { id: 'EST', name: 'Esther', testament: 'Old', chaptersCount: 10, abbreviations: ['est', 'esth'] },
  { id: 'JOB', name: 'Job', testament: 'Old', chaptersCount: 42, abbreviations: ['job', 'jb'] },
  { id: 'PSA', name: 'Psalms', testament: 'Old', chaptersCount: 150, abbreviations: ['psa', 'ps', 'psalm', 'psalms'] },
  { id: 'PRO', name: 'Proverbs', testament: 'Old', chaptersCount: 31, abbreviations: ['pro', 'prv', 'prov'] },
  { id: 'ECC', name: 'Ecclesiastes', testament: 'Old', chaptersCount: 12, abbreviations: ['ecc', 'eccl', 'qoh'] },
  { id: 'SNG', name: 'Song of Solomon', testament: 'Old', chaptersCount: 8, abbreviations: ['sng', 'song', 'canticles'] },
  { id: 'ISA', name: 'Isaiah', testament: 'Old', chaptersCount: 66, abbreviations: ['isa', 'is'] },
  { id: 'JER', name: 'Jeremiah', testament: 'Old', chaptersCount: 52, abbreviations: ['jer', 'jr'] },
  { id: 'LAM', name: 'Lamentations', testament: 'Old', chaptersCount: 5, abbreviations: ['lam', 'la'] },
  { id: 'EZK', name: 'Ezekiel', testament: 'Old', chaptersCount: 48, abbreviations: ['ezk', 'ezek', 'eze'] },
  { id: 'DAN', name: 'Daniel', testament: 'Old', chaptersCount: 12, abbreviations: ['dan', 'da', 'dn'] },
  { id: 'HOS', name: 'Hosea', testament: 'Old', chaptersCount: 14, abbreviations: ['hos', 'ho'] },
  { id: 'JOL', name: 'Joel', testament: 'Old', chaptersCount: 3, abbreviations: ['jol', 'joe', 'jl'] },
  { id: 'AMO', name: 'Amos', testament: 'Old', chaptersCount: 9, abbreviations: ['amo', 'am'] },
  { id: 'OBA', name: 'Obadiah', testament: 'Old', chaptersCount: 1, abbreviations: ['oba', 'ob'] },
  { id: 'JON', name: 'Jonah', testament: 'Old', chaptersCount: 4, abbreviations: ['jon', 'jnh'] },
  { id: 'MIC', name: 'Micah', testament: 'Old', chaptersCount: 7, abbreviations: ['mic', 'mc'] },
  { id: 'NAM', name: 'Nahum', testament: 'Old', chaptersCount: 3, abbreviations: ['nam', 'nah', 'na'] },
  { id: 'HAB', name: 'Habakkuk', testament: 'Old', chaptersCount: 3, abbreviations: ['hab', 'hb'] },
  { id: 'ZEP', name: 'Zephaniah', testament: 'Old', chaptersCount: 3, abbreviations: ['zep', 'zeph', 'zp'] },
  { id: 'HAG', name: 'Haggai', testament: 'Old', chaptersCount: 2, abbreviations: ['hag', 'hg'] },
  { id: 'ZEC', name: 'Zechariah', testament: 'Old', chaptersCount: 14, abbreviations: ['zec', 'zech', 'zc'] },
  { id: 'MAL', name: 'Malachi', testament: 'Old', chaptersCount: 4, abbreviations: ['mal', 'ml'] },

  // New Testament
  { id: 'MAT', name: 'Matthew', testament: 'New', chaptersCount: 28, abbreviations: ['mat', 'matt', 'mt'] },
  { id: 'MRK', name: 'Mark', testament: 'New', chaptersCount: 16, abbreviations: ['mrk', 'mark', 'mk'] },
  { id: 'LUK', name: 'Luke', testament: 'New', chaptersCount: 24, abbreviations: ['luk', 'lk'] },
  { id: 'JHN', name: 'John', testament: 'New', chaptersCount: 21, abbreviations: ['jhn', 'john', 'jn'] },
  { id: 'ACT', name: 'Acts', testament: 'New', chaptersCount: 28, abbreviations: ['act', 'acts', 'ac'] },
  { id: 'ROM', name: 'Romans', testament: 'New', chaptersCount: 16, abbreviations: ['rom', 'ro', 'rm'] },
  { id: '1CO', name: '1 Corinthians', testament: 'New', chaptersCount: 16, abbreviations: ['1co', '1cor', '1 corinthians'] },
  { id: '2CO', name: '2 Corinthians', testament: 'New', chaptersCount: 13, abbreviations: ['2co', '2cor', '2 corinthians'] },
  { id: 'GAL', name: 'Galatians', testament: 'New', chaptersCount: 6, abbreviations: ['gal', 'ga'] },
  { id: 'EPH', name: 'Ephesians', testament: 'New', chaptersCount: 6, abbreviations: ['eph', 'ep'] },
  { id: 'PHP', name: 'Philippians', testament: 'New', chaptersCount: 4, abbreviations: ['php', 'phil', 'pp'] },
  { id: 'COL', name: 'Colossians', testament: 'New', chaptersCount: 4, abbreviations: ['col', 'co'] },
  { id: '1TH', name: '1 Thessalonians', testament: 'New', chaptersCount: 5, abbreviations: ['1th', '1thess', '1 thessalonians'] },
  { id: '2TH', name: '2 Thessalonians', testament: 'New', chaptersCount: 3, abbreviations: ['2th', '2thess', '2 thessalonians'] },
  { id: '1TI', name: '1 Timothy', testament: 'New', chaptersCount: 6, abbreviations: ['1ti', '1tim', '1 timothy'] },
  { id: '2TI', name: '2 Timothy', testament: 'New', chaptersCount: 4, abbreviations: ['2ti', '2tim', '2 timothy'] },
  { id: 'TIT', name: 'Titus', testament: 'New', chaptersCount: 3, abbreviations: ['tit', 'ti'] },
  { id: 'PHM', name: 'Philemon', testament: 'New', chaptersCount: 1, abbreviations: ['phm', 'phlm'] },
  { id: 'HEB', name: 'Hebrews', testament: 'New', chaptersCount: 13, abbreviations: ['heb', 'he'] },
  { id: 'JAS', name: 'James', testament: 'New', chaptersCount: 5, abbreviations: ['jas', 'jam', 'jm'] },
  { id: '1PE', name: '1 Peter', testament: 'New', chaptersCount: 5, abbreviations: ['1pe', '1pet', '1 peter'] },
  { id: '2PE', name: '2 Peter', testament: 'New', chaptersCount: 3, abbreviations: ['2pe', '2pet', '2 peter'] },
  { id: '1JN', name: '1 John', testament: 'New', chaptersCount: 5, abbreviations: ['1jn', '1john', '1 jn'] },
  { id: '2JN', name: '2 John', testament: 'New', chaptersCount: 1, abbreviations: ['2jn', '2john', '2 jn'] },
  { id: '3JN', name: '3 John', testament: 'New', chaptersCount: 1, abbreviations: ['3jn', '3john', '3 jn'] },
  { id: 'JUD', name: 'Jude', testament: 'New', chaptersCount: 1, abbreviations: ['jud', 'jude', 'jd'] },
  { id: 'REV', name: 'Revelation', testament: 'New', chaptersCount: 22, abbreviations: ['rev', 're', 'apocalypse'] }
];

export const BIBLE_CONFIG = {
  defaultVersion: 'kjv',
  supportedVersions: [
    {
      id: 'kjv',
      name: 'King James Version',
      shortName: 'KJV',
      isPrebundled: true,
      isDefault: true,
      language: 'en'
    },
    {
      id: 'web',
      name: 'World English Bible',
      shortName: 'WEB',
      isPrebundled: false,
      isDefault: false,
      language: 'en'
    }
  ] as BibleVersion[],
  
  fontSizeLimits: {
    min: 14,
    max: 28,
    default: 18
  },

  readingThemes: ['white', 'cream', 'dark'] as const
};

/**
 * Normalizes a book name or abbreviation to its canonical 3-letter Bible book ID.
 * Examples: "Genesis" -> "GEN", "John" -> "JHN", "1 Cor" -> "1CO", "Gen" -> "GEN"
 */
export function normalizeBookId(bookNameOrId: string): string {
  if (!bookNameOrId) return 'GEN';
  const clean = bookNameOrId.trim().toLowerCase().replace(/\./g, '');

  const exactMatch = BIBLE_BOOKS_CATALOG.find(b => 
    b.id.toLowerCase() === clean || 
    b.name.toLowerCase() === clean ||
    b.abbreviations.includes(clean)
  );
  if (exactMatch) return exactMatch.id;

  // Prefix match
  const prefixMatch = BIBLE_BOOKS_CATALOG.find(b => 
    b.name.toLowerCase().startsWith(clean) ||
    clean.startsWith(b.name.toLowerCase())
  );
  if (prefixMatch) return prefixMatch.id;

  return bookNameOrId.toUpperCase().slice(0, 3);
}

/**
 * Returns human-readable book name for a given book ID or name.
 */
export function getBookNameById(bookIdOrName: string): string {
  const normId = normalizeBookId(bookIdOrName);
  const found = BIBLE_BOOKS_CATALOG.find(b => b.id === normId);
  return found ? found.name : bookIdOrName;
}

/**
 * Parses raw scripture text reference into a structured BibleReference object.
 * Handles patterns like:
 * - "John 3:16"
 * - "Gen 2:23-24"
 * - "Romans 8:28"
 * - "1 Corinthians 13:4-7"
 * - "Psalm 23:1-6"
 * - "Amos 3:3"
 * - "Matthew 5"
 */
export function parseBibleReference(refString: string): BibleReference | null {
  if (!refString || typeof refString !== 'string') return null;
  const clean = refString.trim();
  if (!clean) return null;

  // Regular expression capturing book (with optional number prefix like '1 John'), chapter, and verse range
  const regex = /^((?:[1-3]\s+)?[a-zA-Z\s]+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/i;
  const match = clean.match(regex);

  if (!match) {
    // If it's just a book name
    const norm = normalizeBookId(clean);
    const bookObj = BIBLE_BOOKS_CATALOG.find(b => b.id === norm);
    if (bookObj) {
      return {
        book: bookObj.name,
        bookId: bookObj.id,
        chapter: 1,
        raw: clean
      };
    }
    return null;
  }

  const bookPart = match[1].trim();
  const chapter = parseInt(match[2], 10);
  const verseStart = match[3] ? parseInt(match[3], 10) : undefined;
  const verseEnd = match[4] ? parseInt(match[4], 10) : (verseStart !== undefined ? verseStart : undefined);

  const bookId = normalizeBookId(bookPart);
  const bookName = getBookNameById(bookId);

  return {
    book: bookName,
    bookId: bookId,
    chapter: isNaN(chapter) ? 1 : chapter,
    verseStart: verseStart && !isNaN(verseStart) ? verseStart : undefined,
    verseEnd: verseEnd && !isNaN(verseEnd) ? verseEnd : undefined,
    raw: clean
  };
}

/**
 * Formats a structured BibleReference into a canonical string like "John 3:16" or "Gen 2:23-24".
 */
export function formatBibleReference(ref: BibleReference): string {
  if (ref.raw && !ref.book) return ref.raw;
  const bookName = ref.book || getBookNameById(ref.bookId || 'GEN');
  if (ref.verseStart !== undefined) {
    if (ref.verseEnd !== undefined && ref.verseEnd !== ref.verseStart) {
      return `${bookName} ${ref.chapter}:${ref.verseStart}-${ref.verseEnd}`;
    }
    return `${bookName} ${ref.chapter}:${ref.verseStart}`;
  }
  return `${bookName} ${ref.chapter}`;
}

/**
 * Centralized Bible Route Builder:
 * Constructs standard Bible path without manual string concatenation.
 *
 * Examples:
 * buildBibleRoute() -> "/bible"
 * buildBibleRoute("John") -> "/bible/JHN/1"
 * buildBibleRoute("John", 3) -> "/bible/JHN/3"
 * buildBibleRoute("John", 3, 16) -> "/bible/JHN/3/16"
 * buildBibleRoute(referenceObject) -> "/bible/JHN/3/16"
 */
export function buildBibleRoute(
  bookOrRef?: string | BibleReference,
  chapter?: number,
  verse?: number
): string {
  if (!bookOrRef) {
    return '/bible';
  }

  if (typeof bookOrRef === 'object') {
    const bookId = normalizeBookId(bookOrRef.bookId || bookOrRef.book);
    const ch = bookOrRef.chapter || 1;
    if (bookOrRef.verseStart) {
      return `/bible/${bookId}/${ch}/${bookOrRef.verseStart}`;
    }
    return `/bible/${bookId}/${ch}`;
  }

  // If passed a reference string like "John 3:16"
  if (bookOrRef.includes(' ') || bookOrRef.includes(':')) {
    const parsed = parseBibleReference(bookOrRef);
    if (parsed) {
      return buildBibleRoute(parsed);
    }
  }

  const bookId = normalizeBookId(bookOrRef);
  const ch = chapter || 1;
  if (verse) {
    return `/bible/${bookId}/${ch}/${verse}`;
  }
  return `/bible/${bookId}/${ch}`;
}

/**
 * Centralized Bible Study Route Builder.
 */
export function buildBibleStudyRoute(studyId?: string): string {
  if (!studyId) {
    return '/bible-study';
  }
  return `/bible-study/read/${studyId}`;
}
