/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BibleReference } from './bible';

export interface StudyQuestionItem {
  id: string;
  number: number;
  question: string;
  scriptureRefs?: string[];
  structuredRefs?: BibleReference[];
}

export interface BibleStudySection {
  id: string;
  title: string;
  paragraphs: string[];
  scriptureRefs?: string[];
  structuredRefs?: BibleReference[];
  questions?: string[];
}

export interface BibleStudyMemoryVerse {
  reference: string;
  text: string;
  structuredRef?: BibleReference;
}

export interface BibleStudyItem {
  id: string;
  lessonNumber: number;
  title: string;
  theme?: string;
  annualTheme?: string;
  subTheme: string;
  date: string;
  keyScripture: string;
  textScriptures?: string[];
  references?: BibleReference[];
  summary: string;
  aims?: string[];
  aim?: string;
  introduction: string;
  sections?: BibleStudySection[];
  studyGuide?: StudyQuestionItem[];
  discussionQuestions: string[];
  conclusion?: string;
  foodForThought?: string;
  memoryVerse: BibleStudyMemoryVerse;
  prayerPoints: string[];
  prayerText?: string;
  author?: string;
  teacher?: string;
  documentUrl?: string;
  documentType?: 'pdf' | 'html' | 'external';
  metadata?: Record<string, any>;
  isCurrent: boolean;
  isPublished: boolean;
}

export interface DetectedScriptureReference {
  raw: string;
  recognized: boolean;
  bookId?: string;
  book?: string;
  chapter?: number;
  verseStart?: number;
  verseEnd?: number;
  translationId?: string;
}

export interface ExtractedStudyFields {
  theme?: string;
  subTheme?: string;
  title?: string;
  topic?: string;
  lessonNumber?: number | string;
  date?: string;
  keyScripture?: string;
  textScriptures?: string[];
  memoryVerse?: {
    reference?: string;
    text?: string;
  };
  aims?: string[];
  aim?: string;
  introduction?: string;
  sections?: Array<{
    title: string;
    paragraphs: string[];
    scriptureRefs?: string[];
  }>;
  studyGuide?: Array<{
    number?: number;
    question?: string;
    heading?: string;
    scriptureRefs?: string[];
    paragraphs?: string[];
  }>;
  discussionQuestions?: string[];
  conclusion?: string;
  prayerPoints?: string[];
  [key: string]: any;
}

export interface DetectedStudyItem {
  id?: string;
  lessonNumberGuess?: string | number;
  extracted: ExtractedStudyFields;
  rawBlockText?: string;
  scriptureReferences: DetectedScriptureReference[];
}

export interface UploadOutlineResponse {
  studiesFound: number;
  studies: DetectedStudyItem[];
}

export interface SectionAliasItem {
  alias: string;
  target: string;
}

export interface BookAliasItem {
  alias: string;
  bookId: string;
}
