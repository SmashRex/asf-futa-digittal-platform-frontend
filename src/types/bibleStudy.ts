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
  topic?: string;
  theme?: string;
  annualTheme?: string;
  subTheme?: string;
  date: string;
  scheduledDate?: string | null;
  studyDate?: string | null;
  keyScripture: string;
  textRef?: string;
  textScriptures?: string[];
  textContent?: string | null;
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
  publicationStatus?: 'draft' | 'published';
  seriesId?: string | null;
  seriesTitle?: string | null;
  academicSessionId?: string | null;
}

export interface BibleStudySeriesLessonPayload {
  lessonNumber: number;
  title?: string;
  topic: string;
  theme?: string;
  textRef?: string;
  textContent?: string;
  aim?: string;
  introduction?: string;
  studyGuide?: string[];
  discussionQuestions?: string[];
  conclusion?: string;
  memoryVerse?: {
    text: string;
    reference: string;
  };
  memoryVerseRef?: string;
  memoryVerseText?: string;
  prayerPoints?: string[];
}

export interface CreateBibleStudySeriesPayload {
  title?: string;
  theme: string;
  startDate: string; // YYYY-MM-DD (must be a Tuesday)
  academicSessionId?: string;
  lessons: BibleStudySeriesLessonPayload[];
}

export interface BibleStudySeriesLessonResponse {
  id: string;
  lessonNumber: number;
  title: string;
  topic?: string;
  scheduledDate: string;
  publicationStatus: 'draft' | 'published';
}

export interface BibleStudySeriesResponseData {
  series: {
    id: string;
    title?: string;
    startDate: string;
    status: string;
    theme?: string;
    academicSessionId?: string;
  };
  theme?: string;
  lessons: BibleStudySeriesLessonResponse[];
}

export interface BibleStudySeriesDetail {
  id: string;
  title?: string;
  theme?: string;
  startDate: string;
  status: string;
  academicSessionId?: string;
  lessons: BibleStudySeriesLessonResponse[];
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
