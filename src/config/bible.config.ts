/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BibleBookDetail, BibleReference, BibleVersion } from '../types';

export interface BibleBookMeta {
  id: string; // e.g. "genesis", "song-of-solomon", "1-corinthians"
  name: string; // e.g. "Genesis"
  testament: 'Old' | 'New';
  chapterCount: number;
  chaptersCount?: number;
  abbreviations: string[];
}

export const BIBLE_BOOKS_CATALOG: BibleBookMeta[] = [
  // Old Testament (39 books)
  { id: 'genesis', name: 'Genesis', testament: 'Old', chapterCount: 50, chaptersCount: 50, abbreviations: ['gen', 'ge', 'gn'] },
  { id: 'exodus', name: 'Exodus', testament: 'Old', chapterCount: 40, chaptersCount: 40, abbreviations: ['exo', 'ex', 'exod'] },
  { id: 'leviticus', name: 'Leviticus', testament: 'Old', chapterCount: 27, chaptersCount: 27, abbreviations: ['lev', 'le', 'lv'] },
  { id: 'numbers', name: 'Numbers', testament: 'Old', chapterCount: 36, chaptersCount: 36, abbreviations: ['num', 'nu', 'nm', 'nb'] },
  { id: 'deuteronomy', name: 'Deuteronomy', testament: 'Old', chapterCount: 34, chaptersCount: 34, abbreviations: ['deu', 'dt', 'deut'] },
  { id: 'joshua', name: 'Joshua', testament: 'Old', chapterCount: 24, chaptersCount: 24, abbreviations: ['jos', 'josh'] },
  { id: 'judges', name: 'Judges', testament: 'Old', chapterCount: 21, chaptersCount: 21, abbreviations: ['jdg', 'judg', 'jgs'] },
  { id: 'ruth', name: 'Ruth', testament: 'Old', chapterCount: 4, chaptersCount: 4, abbreviations: ['rut', 'rth', 'ru'] },
  { id: '1-samuel', name: '1 Samuel', testament: 'Old', chapterCount: 31, chaptersCount: 31, abbreviations: ['1sa', '1sam', '1 s', '1 samuel', '1-samuel', '1 sam', '1samuel'] },
  { id: '2-samuel', name: '2 Samuel', testament: 'Old', chapterCount: 24, chaptersCount: 24, abbreviations: ['2sa', '2sam', '2 s', '2 samuel', '2-samuel', '2 sam', '2samuel'] },
  { id: '1-kings', name: '1 Kings', testament: 'Old', chapterCount: 22, chaptersCount: 22, abbreviations: ['1ki', '1kgs', '1 kings', '1-kings', '1 kgs', '1kings'] },
  { id: '2-kings', name: '2 Kings', testament: 'Old', chapterCount: 25, chaptersCount: 25, abbreviations: ['2ki', '2kgs', '2 kings', '2-kings', '2 kgs', '2kings'] },
  { id: '1-chronicles', name: '1 Chronicles', testament: 'Old', chapterCount: 29, chaptersCount: 29, abbreviations: ['1ch', '1chr', '1 chron', '1 chronicles', '1-chronicles', '1chronicles'] },
  { id: '2-chronicles', name: '2 Chronicles', testament: 'Old', chapterCount: 36, chaptersCount: 36, abbreviations: ['2ch', '2chr', '2 chron', '2 chronicles', '2-chronicles', '2chronicles'] },
  { id: 'ezra', name: 'Ezra', testament: 'Old', chapterCount: 10, chaptersCount: 10, abbreviations: ['ezr', 'ez'] },
  { id: 'nehemiah', name: 'Nehemiah', testament: 'Old', chapterCount: 13, chaptersCount: 13, abbreviations: ['neh', 'ne'] },
  { id: 'esther', name: 'Esther', testament: 'Old', chapterCount: 10, chaptersCount: 10, abbreviations: ['est', 'esth'] },
  { id: 'job', name: 'Job', testament: 'Old', chapterCount: 42, chaptersCount: 42, abbreviations: ['job', 'jb'] },
  { id: 'psalms', name: 'Psalms', testament: 'Old', chapterCount: 150, chaptersCount: 150, abbreviations: ['psa', 'ps', 'psalm', 'psalms'] },
  { id: 'proverbs', name: 'Proverbs', testament: 'Old', chapterCount: 31, chaptersCount: 31, abbreviations: ['pro', 'prv', 'prov'] },
  { id: 'ecclesiastes', name: 'Ecclesiastes', testament: 'Old', chapterCount: 12, chaptersCount: 12, abbreviations: ['ecc', 'eccl', 'qoh'] },
  { id: 'song-of-solomon', name: 'Song of Solomon', testament: 'Old', chapterCount: 8, chaptersCount: 8, abbreviations: ['sng', 'song', 'canticles', 'song of songs', 'song-of-solomon', 'sos'] },
  { id: 'isaiah', name: 'Isaiah', testament: 'Old', chapterCount: 66, chaptersCount: 66, abbreviations: ['isa', 'is'] },
  { id: 'jeremiah', name: 'Jeremiah', testament: 'Old', chapterCount: 52, chaptersCount: 52, abbreviations: ['jer', 'jr'] },
  { id: 'lamentations', name: 'Lamentations', testament: 'Old', chapterCount: 5, chaptersCount: 5, abbreviations: ['lam', 'la'] },
  { id: 'ezekiel', name: 'Ezekiel', testament: 'Old', chapterCount: 48, chaptersCount: 48, abbreviations: ['ezk', 'ezek', 'eze'] },
  { id: 'daniel', name: 'Daniel', testament: 'Old', chapterCount: 12, chaptersCount: 12, abbreviations: ['dan', 'da', 'dn'] },
  { id: 'hosea', name: 'Hosea', testament: 'Old', chapterCount: 14, chaptersCount: 14, abbreviations: ['hos', 'ho'] },
  { id: 'joel', name: 'Joel', testament: 'Old', chapterCount: 3, chaptersCount: 3, abbreviations: ['jol', 'joe', 'jl'] },
  { id: 'amos', name: 'Amos', testament: 'Old', chapterCount: 9, chaptersCount: 9, abbreviations: ['amo', 'am'] },
  { id: 'obadiah', name: 'Obadiah', testament: 'Old', chapterCount: 1, chaptersCount: 1, abbreviations: ['oba', 'ob'] },
  { id: 'jonah', name: 'Jonah', testament: 'Old', chapterCount: 4, chaptersCount: 4, abbreviations: ['jon', 'jnh'] },
  { id: 'micah', name: 'Micah', testament: 'Old', chapterCount: 7, chaptersCount: 7, abbreviations: ['mic', 'mc'] },
  { id: 'nahum', name: 'Nahum', testament: 'Old', chapterCount: 3, chaptersCount: 3, abbreviations: ['nam', 'nah', 'na'] },
  { id: 'habakkuk', name: 'Habakkuk', testament: 'Old', chapterCount: 3, chaptersCount: 3, abbreviations: ['hab', 'hb'] },
  { id: 'zephaniah', name: 'Zephaniah', testament: 'Old', chapterCount: 3, chaptersCount: 3, abbreviations: ['zep', 'zeph', 'zp'] },
  { id: 'haggai', name: 'Haggai', testament: 'Old', chapterCount: 2, chaptersCount: 2, abbreviations: ['hag', 'hg'] },
  { id: 'zechariah', name: 'Zechariah', testament: 'Old', chapterCount: 14, chaptersCount: 14, abbreviations: ['zec', 'zech', 'zc'] },
  { id: 'malachi', name: 'Malachi', testament: 'Old', chapterCount: 4, chaptersCount: 4, abbreviations: ['mal', 'ml'] },

  // New Testament (27 books)
  { id: 'matthew', name: 'Matthew', testament: 'New', chapterCount: 28, chaptersCount: 28, abbreviations: ['mat', 'matt', 'mt'] },
  { id: 'mark', name: 'Mark', testament: 'New', chapterCount: 16, chaptersCount: 16, abbreviations: ['mrk', 'mark', 'mk'] },
  { id: 'luke', name: 'Luke', testament: 'New', chapterCount: 24, chaptersCount: 24, abbreviations: ['luk', 'lk'] },
  { id: 'john', name: 'John', testament: 'New', chapterCount: 21, chaptersCount: 21, abbreviations: ['jhn', 'john', 'jn'] },
  { id: 'acts', name: 'Acts', testament: 'New', chapterCount: 28, chaptersCount: 28, abbreviations: ['act', 'acts', 'ac'] },
  { id: 'romans', name: 'Romans', testament: 'New', chapterCount: 16, chaptersCount: 16, abbreviations: ['rom', 'ro', 'rm'] },
  { id: '1-corinthians', name: '1 Corinthians', testament: 'New', chapterCount: 16, chaptersCount: 16, abbreviations: ['1co', '1cor', '1 cor', '1 corinthians', '1-corinthians', '1corinthians'] },
  { id: '2-corinthians', name: '2 Corinthians', testament: 'New', chapterCount: 13, chaptersCount: 13, abbreviations: ['2co', '2cor', '2 cor', '2 corinthians', '2-corinthians', '2corinthians'] },
  { id: 'galatians', name: 'Galatians', testament: 'New', chapterCount: 6, chaptersCount: 6, abbreviations: ['gal', 'ga'] },
  { id: 'ephesians', name: 'Ephesians', testament: 'New', chapterCount: 6, chaptersCount: 6, abbreviations: ['eph', 'ep'] },
  { id: 'philippians', name: 'Philippians', testament: 'New', chapterCount: 4, chaptersCount: 4, abbreviations: ['php', 'phil', 'pp'] },
  { id: 'colossians', name: 'Colossians', testament: 'New', chapterCount: 4, chaptersCount: 4, abbreviations: ['col', 'co'] },
  { id: '1-thessalonians', name: '1 Thessalonians', testament: 'New', chapterCount: 5, chaptersCount: 5, abbreviations: ['1th', '1thess', '1 thess', '1 thessalonians', '1-thessalonians', '1thessalonians'] },
  { id: '2-thessalonians', name: '2 Thessalonians', testament: 'New', chapterCount: 3, chaptersCount: 3, abbreviations: ['2th', '2thess', '2 thess', '2 thessalonians', '2-thessalonians', '2thessalonians'] },
  { id: '1-timothy', name: '1 Timothy', testament: 'New', chapterCount: 6, chaptersCount: 6, abbreviations: ['1ti', '1tim', '1 tim', '1 timothy', '1-timothy', '1timothy'] },
  { id: '2-timothy', name: '2 Timothy', testament: 'New', chapterCount: 4, chaptersCount: 4, abbreviations: ['2ti', '2tim', '2 tim', '2 timothy', '2-timothy', '2timothy'] },
  { id: 'titus', name: 'Titus', testament: 'New', chapterCount: 3, chaptersCount: 3, abbreviations: ['tit', 'ti'] },
  { id: 'philemon', name: 'Philemon', testament: 'New', chapterCount: 1, chaptersCount: 1, abbreviations: ['phm', 'phlm'] },
  { id: 'hebrews', name: 'Hebrews', testament: 'New', chapterCount: 13, chaptersCount: 13, abbreviations: ['heb', 'he'] },
  { id: 'james', name: 'James', testament: 'New', chapterCount: 5, chaptersCount: 5, abbreviations: ['jas', 'jam', 'jm'] },
  { id: '1-peter', name: '1 Peter', testament: 'New', chapterCount: 5, chaptersCount: 5, abbreviations: ['1pe', '1pet', '1 pet', '1 peter', '1-peter', '1peter'] },
  { id: '2-peter', name: '2 Peter', testament: 'New', chapterCount: 3, chaptersCount: 3, abbreviations: ['2pe', '2pet', '2 pet', '2 peter', '2-peter', '2peter'] },
  { id: '1-john', name: '1 John', testament: 'New', chapterCount: 5, chaptersCount: 5, abbreviations: ['1jn', '1john', '1 jn', '1 jhn', '1 john', '1-john', '1john'] },
  { id: '2-john', name: '2 John', testament: 'New', chapterCount: 1, chaptersCount: 1, abbreviations: ['2jn', '2john', '2 jn', '2 jhn', '2 john', '2-john', '2john'] },
  { id: '3-john', name: '3 John', testament: 'New', chapterCount: 1, chaptersCount: 1, abbreviations: ['3jn', '3john', '3 jn', '3 jhn', '3 john', '3-john', '3john'] },
  { id: 'jude', name: 'Jude', testament: 'New', chapterCount: 1, chaptersCount: 1, abbreviations: ['jud', 'jude', 'jd'] },
  { id: 'revelation', name: 'Revelation', testament: 'New', chapterCount: 22, chaptersCount: 22, abbreviations: ['rev', 're', 'apocalypse'] }
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
 * Normalizes a book name or abbreviation to its canonical lowercase hyphenated Bible book ID.
 * Examples: "Genesis" -> "genesis", "GEN" -> "genesis", "1 Corinthians" -> "1-corinthians", "Song of Solomon" -> "song-of-solomon"
 */
export function normalizeBookId(bookNameOrId: string): string {
  if (!bookNameOrId) return 'genesis';
  const clean = bookNameOrId.trim().toLowerCase().replace(/\./g, '');

  const exactMatch = BIBLE_BOOKS_CATALOG.find(b => 
    b.id.toLowerCase() === clean || 
    b.name.toLowerCase() === clean ||
    b.abbreviations.map(a => a.toLowerCase()).includes(clean)
  );
  if (exactMatch) return exactMatch.id;

  // Prefix match
  const prefixMatch = BIBLE_BOOKS_CATALOG.find(b => 
    b.name.toLowerCase().startsWith(clean) ||
    clean.startsWith(b.name.toLowerCase())
  );
  if (prefixMatch) return prefixMatch.id;

  return clean.replace(/\s+/g, '-');
}

/**
 * Returns human-readable book name for a given book ID or name.
 */
export function getBookNameById(bookIdOrName: string): string {
  if (!bookIdOrName) return 'Genesis';
  const normId = normalizeBookId(bookIdOrName);
  const found = BIBLE_BOOKS_CATALOG.find(b => b.id === normId);
  return found ? found.name : bookIdOrName;
}

/**
 * Returns testament ('Old' | 'New') for a given book ID or name.
 */
export function getTestamentByBookId(bookIdOrName: string): 'Old' | 'New' {
  const normId = normalizeBookId(bookIdOrName);
  const found = BIBLE_BOOKS_CATALOG.find(b => b.id === normId);
  return found ? found.testament : 'Old';
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
  const regex = /^((?:[1-3]\s+)?[a-zA-Z\s\-]+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/i;
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
  const bookName = ref.book || getBookNameById(ref.bookId || 'genesis');
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
 * buildBibleRoute("genesis") -> "/bible/genesis/1"
 * buildBibleRoute("John", 3) -> "/bible/john/3"
 * buildBibleRoute("John", 3, 16) -> "/bible/john/3/16"
 * buildBibleRoute(referenceObject) -> "/bible/john/3/16"
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
