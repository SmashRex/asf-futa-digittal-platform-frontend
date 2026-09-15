/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BibleVerse {
  reference: string;
  text: string;
}

export interface BibleReference {
  book: string;
  bookId?: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
  raw?: string;
  translationId?: string;
  recognized?: boolean;
}

export interface BibleVerseDetail {
  number: number;
  text: string;
}

export interface BibleChapterDetail {
  number: number;
  verses: BibleVerseDetail[];
}

export interface BibleBookDetail {
  id: string; // e.g. "GEN", "JHN"
  name: string; // e.g. "Genesis", "John"
  testament: 'Old' | 'New';
  chapters: BibleChapterDetail[];
  totalChapters?: number;
  abbreviations?: string[];
}

export interface BibleVersion {
  id: string;
  name: string;
  shortName: string;
  isPrebundled: boolean;
  isDefault: boolean;
  language?: string;
}

export interface BibleSearchResult {
  reference: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleResolvedPassage {
  reference: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verses: BibleVerseDetail[];
  versionId: string;
}
