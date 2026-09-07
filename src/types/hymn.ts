/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HymnStanza {
  number: number;
  lines: string[];
}

export interface HymnItem {
  id: string; // e.g. "sop-201"
  number: number; // e.g. 201
  title: string; // e.g. "Arise, Shine!"
  category: string; // e.g. "Praise & Renewal"
  author?: string;
  composer?: string;
  tune?: string;
  meter?: string;
  stanzas: HymnStanza[];
  chorus?: string[];
  isTodayService?: boolean;
  isPrebundledOffline?: boolean;
  audioUrl?: string;
  coverImageUrl?: string;
  keySignature?: string;
  scriptureReferences?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface HymnSearchResult {
  hymn: HymnItem;
  matchedField: 'number' | 'title' | 'author' | 'category' | 'lyrics' | 'chorus';
  snippet?: string;
}

export interface HymnCategorySummary {
  name: string;
  count: number;
}

export interface HymnFilterParams {
  query?: string;
  category?: string;
  onlyToday?: boolean;
  onlyBookmarked?: boolean;
}
