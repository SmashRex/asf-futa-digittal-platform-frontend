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
  annualTheme?: string;
  subTheme: string;
  date: string;
  keyScripture: string;
  textScriptures?: string[];
  references?: BibleReference[];
  summary: string;
  aims?: string[];
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
