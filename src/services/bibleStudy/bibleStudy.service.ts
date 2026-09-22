/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  BibleStudyItem, 
  BibleStudyMemoryVerse,
  BibleReference, 
  UploadOutlineResponse, 
  DetectedStudyItem,
  SectionAliasItem,
  BookAliasItem,
  ExtractedStudyFields,
  CreateBibleStudySeriesPayload,
  BibleStudySeriesResponseData,
  BibleStudySeriesDetail
} from '../../types';
import { mockBibleStudies } from '../../data/bibleStudyData';
import { parseBibleReference } from '../../config/bible.config';
import { APP_CONFIG } from '../../config/app.config';
import { apiClient } from '../api/client';
import { ApiError } from '../api/types';

/**
 * Format ISO YYYY-MM-DD or date string to readable Tuesday, Mon DD format
 */
export function formatStudyDate(isoDateStr?: string): string {
  if (!isoDateStr) return '';
  if (isoDateStr.includes(',')) return isoDateStr;
  try {
    const parts = isoDateStr.split('-');
    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);
      const d = new Date(Date.UTC(year, month, day, 12, 0, 0));
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      });
    }
    const d = new Date(isoDateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  } catch {
    // fallback
  }
  return isoDateStr;
}

/**
 * Helper to check whether a YYYY-MM-DD date falls on a Tuesday (UTC safe).
 */
export function isDateTuesday(dateStr: string): boolean {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  return dateObj.getUTCDay() === 2;
}

/**
 * Returns the upcoming Tuesday in YYYY-MM-DD format (including today if today is Tuesday).
 */
export function getUpcomingTuesday(): string {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 2 is Tuesday
  const diff = (2 - day + 7) % 7;
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const dayStr = String(target.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayStr}`;
}

// In-memory mock storage for aliases when in mock mode
let mockSectionAliases: SectionAliasItem[] = [
  { alias: 'Verse to Memorize', target: 'Memory Verse' },
  { alias: 'Central Truth', target: 'Introduction' },
  { alias: 'Daily Living Application', target: 'Discussion Questions' },
];

let mockBookAliases: BookAliasItem[] = [
  { alias: 'Mat', bookId: 'mat' },
  { alias: 'Matt', bookId: 'mat' },
  { alias: 'Mt', bookId: 'mat' },
  { alias: '1 Cor', bookId: '1co' },
  { alias: 'Canticles', bookId: 'sng' },
];

export function normalizeBibleStudyItem(raw: any): BibleStudyItem {
  if (!raw || typeof raw !== 'object') {
    return {
      id: '',
      lessonNumber: 1,
      title: 'Untitled Lesson',
      topic: '',
      theme: '',
      annualTheme: '',
      subTheme: '',
      date: '',
      scheduledDate: undefined,
      studyDate: undefined,
      keyScripture: '',
      textRef: '',
      textScriptures: [],
      textContent: null,
      summary: '',
      aims: [],
      aim: '',
      introduction: '',
      sections: [],
      studyGuide: undefined,
      discussionQuestions: [],
      conclusion: '',
      foodForThought: '',
      memoryVerse: { reference: '', text: '' },
      prayerPoints: [],
      prayerText: '',
      author: '',
      teacher: '',
      documentUrl: '',
      documentType: 'pdf',
      isCurrent: false,
      isPublished: true,
      publicationStatus: 'published'
    };
  }

  // Authoritative date resolution: prefer scheduledDate
  const scheduledDate = raw.scheduledDate || raw.scheduled_date || undefined;
  const legacyStudyDate = raw.studyDate || raw.study_date || raw.date || undefined;
  const displayDate = scheduledDate ? formatStudyDate(scheduledDate) : String(legacyStudyDate || '').trim();

  // Memory verse normalization
  const rawMv = raw.memoryVerse || raw.memory_verse;
  let normalizedMv: BibleStudyMemoryVerse = { reference: '', text: '' };
  if (typeof rawMv === 'string') {
    normalizedMv = { reference: rawMv.trim(), text: '' };
  } else if (rawMv && typeof rawMv === 'object') {
    normalizedMv = {
      reference: String(raw.memoryVerseRef || raw.memory_verse_ref || rawMv.reference || rawMv.ref || rawMv.verse || '').trim(),
      text: String(raw.memoryVerseText || raw.memory_verse_text || rawMv.text || rawMv.content || rawMv.quote || '').trim(),
    };
  } else if (raw.memoryVerseRef || raw.memoryVerseText) {
    normalizedMv = {
      reference: String(raw.memoryVerseRef || '').trim(),
      text: String(raw.memoryVerseText || '').trim()
    };
  }

  // Scripture references & textRef normalization
  const rawTextRef = String(raw.textRef || raw.text_ref || '').trim();
  const rawKeyScripture = String(raw.keyScripture || raw.key_scripture || raw.key_verse || rawTextRef || '').trim();
  const rawTextScriptures = raw.textScriptures || raw.text_scriptures;
  const normalizedTextScriptures: string[] = Array.isArray(rawTextScriptures) && rawTextScriptures.length > 0
    ? rawTextScriptures.map((s: any) => String(s).trim()).filter(Boolean)
    : (rawTextRef ? [rawTextRef] : (rawKeyScripture ? [rawKeyScripture] : []));

  // Study guide normalization: handles array of strings or array of objects
  const rawStudyGuide = raw.studyGuide || raw.study_guide;
  let normalizedStudyGuide = undefined;
  if (Array.isArray(rawStudyGuide) && rawStudyGuide.length > 0) {
    normalizedStudyGuide = rawStudyGuide.map((sg: any, idx: number) => {
      if (typeof sg === 'string') {
        return {
          id: `sg-${idx + 1}`,
          number: idx + 1,
          question: sg.trim(),
          scriptureRefs: []
        };
      }
      return {
        id: sg.id || `sg-${idx + 1}`,
        number: sg.number || idx + 1,
        question: sg.question || sg.text || '',
        scriptureRefs: Array.isArray(sg.scriptureRefs || sg.scripture_refs) ? (sg.scriptureRefs || sg.scripture_refs) : []
      };
    });
  }

  // Questions normalization
  const rawQuestions = raw.discussionQuestions || raw.discussion_questions || raw.questions;
  const normalizedQuestions: string[] = Array.isArray(rawQuestions)
    ? rawQuestions.map((q: any) => typeof q === 'string' ? q.trim() : String(q?.question || q?.text || '')).filter(Boolean)
    : [];

  // Prayer points normalization
  const rawPrayers = raw.prayerPoints || raw.prayer_points || raw.prayers;
  const normalizedPrayers: string[] = Array.isArray(rawPrayers)
    ? rawPrayers.map((p: any) => typeof p === 'string' ? p.trim() : String(p?.point || p?.text || '')).filter(Boolean)
    : [];

  // Aims normalization
  const rawAims = raw.aims || (raw.aim ? [raw.aim] : []);
  const normalizedAims: string[] = Array.isArray(rawAims)
    ? rawAims.map((a: any) => String(a).trim()).filter(Boolean)
    : [];

  // Lesson number
  const parsedLessonNumber = Number(raw.lessonNumber ?? raw.lesson_number ?? raw.lesson ?? 1);

  // Publication status normalization
  const rawPubStatus = raw.publicationStatus || raw.publication_status;
  const publicationStatus: 'draft' | 'published' = rawPubStatus 
    ? (String(rawPubStatus).toLowerCase() === 'published' ? 'published' : 'draft')
    : (raw.isPublished === false ? 'draft' : 'published');

  return {
    id: String(raw.id || raw._id || raw.studyId || raw.study_id || '').trim(),
    lessonNumber: Number.isNaN(parsedLessonNumber) || parsedLessonNumber <= 0 ? 1 : parsedLessonNumber,
    title: String(raw.title || raw.topic || raw.name || 'Untitled Lesson').trim(),
    topic: String(raw.topic || raw.title || '').trim(),
    theme: raw.theme || raw.annualTheme || raw.annual_theme || '',
    annualTheme: raw.annualTheme || raw.annual_theme || raw.theme || '',
    subTheme: String(raw.subTheme || raw.sub_theme || raw.subtheme || '').trim(),
    date: displayDate,
    scheduledDate,
    studyDate: legacyStudyDate,
    keyScripture: rawKeyScripture,
    textRef: rawTextRef || rawKeyScripture,
    textScriptures: normalizedTextScriptures,
    textContent: raw.textContent !== undefined ? raw.textContent : null,
    summary: String(raw.summary || raw.description || raw.intro || raw.introduction || '').trim(),
    aims: normalizedAims,
    aim: raw.aim || normalizedAims[0] || '',
    introduction: String(raw.introduction || raw.intro || '').trim(),
    sections: Array.isArray(raw.sections) ? raw.sections.map((s: any, idx: number) => ({
      id: s.id || `sec-${idx + 1}`,
      title: s.title || '',
      paragraphs: Array.isArray(s.paragraphs) ? s.paragraphs : (s.content ? [s.content] : []),
      scriptureRefs: Array.isArray(s.scriptureRefs || s.scripture_refs) ? (s.scriptureRefs || s.scripture_refs) : []
    })) : [],
    studyGuide: normalizedStudyGuide,
    discussionQuestions: normalizedQuestions,
    conclusion: raw.conclusion || raw.summaryConclusion || '',
    foodForThought: raw.foodForThought || raw.food_for_thought || '',
    memoryVerse: normalizedMv,
    prayerPoints: normalizedPrayers,
    prayerText: raw.prayerText || raw.prayer_text || '',
    author: raw.author || '',
    teacher: raw.teacher || '',
    documentUrl: raw.documentUrl || raw.document_url || raw.file_url || raw.pdf_url || '',
    documentType: raw.documentType || raw.document_type || 'pdf',
    isCurrent: Boolean(raw.isCurrent ?? raw.is_current ?? false),
    isPublished: publicationStatus === 'published',
    publicationStatus,
    seriesId: raw.seriesId || raw.series_id || undefined,
    seriesTitle: raw.seriesTitle || raw.series_title || undefined
  };
}

export const bibleStudyService = {
  /**
   * Fetch all published Bible study outlines: GET /api/bible-study
   */
  async getStudies(): Promise<BibleStudyItem[]> {
    if (APP_CONFIG.features.useMockServices) {
      return mockBibleStudies.filter(s => s.isPublished);
    }
    try {
      const res = await apiClient.get<any>('/bible-study');
      const rawList = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : res.data?.studies || []);
      if (Array.isArray(rawList)) {
        return rawList.map(normalizeBibleStudyItem);
      }
    } catch (err) {
      console.warn('Failed to fetch studies:', err);
    }
    return [];
  },

  /**
   * Fetch a specific Bible study by its unique ID: GET /api/bible-study/:id
   */
  async getStudyById(id: string): Promise<BibleStudyItem | null> {
    if (APP_CONFIG.features.useMockServices) {
      return mockBibleStudies.find(s => s.id === id) || null;
    }
    try {
      const res = await apiClient.get<any>(`/bible-study/${encodeURIComponent(id)}`);
      const raw = res.data?.data || res.data;
      if (raw) {
        return normalizeBibleStudyItem(raw);
      }
    } catch (err) {
      console.warn(`Failed to fetch study with id ${id}:`, err);
    }
    return null;
  },

  /**
   * Fetch today's scheduled and published Bible study lesson:
   * GET /api/bible-study/current
   * 
   * Strict Tuesday-only contract:
   * Returns 200 with study only if scheduledDate is exactly today and published.
   * Throws on network/server error.
   * Returns null on 404 or NO_CURRENT_STUDY.
   */
  async getCurrentStudy(): Promise<BibleStudyItem | null> {
    if (APP_CONFIG.features.useMockServices) {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const todayIso = `${y}-${m}-${d}`;

      // In mock mode, find published study scheduled for today, or fallback to isCurrent flag on Tuesday
      const match = mockBibleStudies.find(s => 
        s.isPublished && (s.scheduledDate === todayIso || (s.isCurrent && now.getDay() === 2))
      );
      return match || null;
    }

    try {
      const res = await apiClient.get<any>('/bible-study/current');
      const raw = res.data?.data || res.data;
      if (raw && (raw.id || raw.title || raw.topic)) {
        return normalizeBibleStudyItem(raw);
      }
      return null;
    } catch (err: any) {
      // Backend returns 404 or NO_CURRENT_STUDY when no study is scheduled for today
      if (
        err?.code === 'NO_CURRENT_STUDY' || 
        err?.statusCode === 404 || 
        err?.message?.includes('No current Bible Study')
      ) {
        return null;
      }
      throw err;
    }
  },

  /**
   * Fetch current/latest active Bible study session:
   * Backward-compatible wrapper around getCurrentStudy.
   */
  async getLatestStudy(): Promise<BibleStudyItem | null> {
    try {
      return await this.getCurrentStudy();
    } catch {
      return null;
    }
  },

  /**
   * Upload study outline PDF document.
   * Endpoint: POST /api/bible-study/upload-outline
   * Supports optional query parameter ?includeRawText=true
   * Returns multiple detected studies:
   *   { studiesFound: N, studies: DetectedStudyItem[] }
   * Properly validates PDF and handles backend INVALID_FILE response.
   */
  async uploadOutline(
    file: File, 
    options?: { includeRawText?: boolean }
  ): Promise<UploadOutlineResponse> {
    // Client-side MIME check before sending, rejecting non-PDFs
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      const error: ApiError = {
        statusCode: 400,
        code: 'INVALID_FILE',
        message: 'Invalid file format: Please upload a valid PDF document.',
      };
      throw error;
    }

    if (APP_CONFIG.features.useMockServices) {
      // Simulate multi-study extraction with 2 studies, separate theme/subTheme, and resolved scripture references
      const mockResult: UploadOutlineResponse = {
        studiesFound: 2,
        studies: [
          {
            id: 'detected-study-01',
            lessonNumberGuess: 1,
            extracted: {
              theme: 'The Reign of God: Kingdom Living on Campus',
              subTheme: 'Biblical Foundations of Faithful Discipleship',
              title: 'Universal Concepts of Christian Calling',
              topic: 'Universal Concepts of Christian Calling',
              lessonNumber: 1,
              date: 'Sunday, October 12, 2026',
              keyScripture: 'Genesis 2:18-24',
              textScriptures: ['Genesis 2:18-24', 'Matthew 19:3-9'],
              memoryVerse: {
                reference: 'Matthew 19:6',
                text: 'Wherefore they are no more twain, but one flesh. What therefore God hath joined together, let not man put asunder.'
              },
              aim: 'To understand the divine calling and intentional kingdom walk as students in the university.',
              aims: [
                'To understand the divine calling of discipleship.',
                'To grasp kingdom principles applicable in academic environments.'
              ],
              introduction: 'In a university environment filled with competing voices, God calls His children to distinct and holy living.',
              discussionQuestions: [
                'What does it mean to walk worthy of our high calling as students?',
                'How can we demonstrate kingdom holiness in our academic pursuits?'
              ],
              conclusion: 'Total obedience to the counsel of God provides enduring peace and victory.',
              prayerPoints: [
                'Father, grant me the courage to stand firm in my calling on campus.',
                'Lord, let my academics radiate your glory and righteousness.'
              ]
            },
            rawBlockText: options?.includeRawText ? 'LESSON 1: Universal Concepts of Christian Calling. Text: Genesis 2:18-24...' : undefined,
            scriptureReferences: [
              {
                raw: 'Genesis 2:18-24',
                recognized: true,
                bookId: 'gen',
                book: 'Genesis',
                chapter: 2,
                verseStart: 18,
                verseEnd: 24,
                translationId: 'KJV'
              },
              {
                raw: 'Matthew 19:3-9',
                recognized: true,
                bookId: 'mat',
                book: 'Matthew',
                chapter: 19,
                verseStart: 3,
                verseEnd: 9,
                translationId: 'KJV'
              },
              {
                raw: 'John 3:16',
                recognized: true,
                bookId: 'john',
                book: 'John',
                chapter: 3,
                verseStart: 16,
                translationId: 'KJV'
              },
              {
                raw: 'Hebr 99:99',
                recognized: false
              }
            ]
          },
          {
            id: 'detected-study-02',
            lessonNumberGuess: 2,
            extracted: {
              theme: 'The Reign of God: Kingdom Living on Campus',
              subTheme: 'Integrity and Excellence in Academics',
              title: 'The Steward of Mind and Time',
              topic: 'The Steward of Mind and Time',
              lessonNumber: 2,
              date: 'Sunday, October 19, 2026',
              keyScripture: 'Colossians 3:23-24',
              textScriptures: ['Colossians 3:23-24', 'Daniel 1:8-17'],
              memoryVerse: {
                reference: 'Colossians 3:23',
                text: 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men.'
              },
              aim: 'To embrace academic diligence and moral excellence as acts of worship to God.',
              aims: [
                'To recognise intellectual capabilities as divine stewardship.',
                'To reject examination malpractices and fraudulent shortcuts.'
              ],
              introduction: 'Academic work is not secular; to the Christian student, studying is sacred stewardship.',
              discussionQuestions: [
                'How does our study habit reflect our reverence for God?',
                'What boundaries must a believer establish during exam periods?'
              ],
              conclusion: 'God is glorified when Christian students excel with untainted integrity.',
              prayerPoints: [
                'Holy Spirit, endow me with wisdom and understanding like Daniel.',
                'Deliver me from the temptation of academic compromise.'
              ]
            },
            rawBlockText: options?.includeRawText ? 'LESSON 2: The Steward of Mind and Time. Text: Colossians 3:23-24...' : undefined,
            scriptureReferences: [
              {
                raw: 'Colossians 3:23-24',
                recognized: true,
                bookId: 'col',
                book: 'Colossians',
                chapter: 3,
                verseStart: 23,
                verseEnd: 24,
                translationId: 'KJV'
              },
              {
                raw: 'Daniel 1:8-17',
                recognized: true,
                bookId: 'dan',
                book: 'Daniel',
                chapter: 1,
                verseStart: 8,
                verseEnd: 17,
                translationId: 'KJV'
              },
              {
                raw: 'UnknownSection 1:1',
                recognized: false
              }
            ]
          }
        ]
      };
      return mockResult;
    }

    const formData = new FormData();
    formData.append('file', file);

    let url = '/bible-study/upload-outline';
    if (options?.includeRawText) {
      url += '?includeRawText=true';
    }

    try {
      const res = await apiClient.post<any>(url, formData);
      const data = res.data?.data || res.data;

      // Validate and shape response
      const studies = Array.isArray(data?.studies) ? data.studies : (Array.isArray(data) ? data : []);
      const studiesFound = typeof data?.studiesFound === 'number' ? data.studiesFound : studies.length;

      return {
        studiesFound,
        studies: studies.map((s: any, idx: number) => ({
          id: s.id || `detected-study-${idx + 1}`,
          lessonNumberGuess: s.lessonNumberGuess ?? s.extracted?.lessonNumber ?? idx + 1,
          extracted: {
            theme: s.extracted?.theme || '',
            subTheme: s.extracted?.subTheme || '',
            title: s.extracted?.title || s.extracted?.topic || '',
            topic: s.extracted?.topic || s.extracted?.title || '',
            lessonNumber: s.extracted?.lessonNumber ?? s.lessonNumberGuess ?? idx + 1,
            date: s.extracted?.date || '',
            keyScripture: s.extracted?.keyScripture || '',
            textScriptures: Array.isArray(s.extracted?.textScriptures) ? s.extracted.textScriptures : [],
            memoryVerse: s.extracted?.memoryVerse || { reference: '', text: '' },
            aim: s.extracted?.aim || (Array.isArray(s.extracted?.aims) ? s.extracted.aims[0] : ''),
            aims: Array.isArray(s.extracted?.aims) ? s.extracted.aims : (s.extracted?.aim ? [s.extracted.aim] : []),
            introduction: s.extracted?.introduction || '',
            sections: Array.isArray(s.extracted?.sections) ? s.extracted.sections : [],
            studyGuide: Array.isArray(s.extracted?.studyGuide) ? s.extracted.studyGuide : [],
            discussionQuestions: Array.isArray(s.extracted?.discussionQuestions) ? s.extracted.discussionQuestions : [],
            conclusion: s.extracted?.conclusion || '',
            prayerPoints: Array.isArray(s.extracted?.prayerPoints) ? s.extracted.prayerPoints : []
          },
          rawBlockText: s.rawBlockText,
          scriptureReferences: Array.isArray(s.scriptureReferences) ? s.scriptureReferences : []
        }))
      };
    } catch (err: any) {
      // In real backend mode, propagate actionable error (especially INVALID_FILE)
      if (err.code === 'INVALID_FILE') {
        const customErr: ApiError = {
          statusCode: 400,
          code: 'INVALID_FILE',
          message: err.message || 'Invalid file format: Please upload a valid PDF document.',
          details: err.details
        };
        throw customErr;
      }
      throw err;
    }
  },

  /**
   * Create an entire Bible Study Series:
   * POST /api/bible-study/series
   * 
   * Authoritative backend contract:
   * - startDate must be YYYY-MM-DD and must be a Tuesday.
   * - lessons must have at least one lesson with sequential lessonNumbers starting from 1.
   * - Does NOT send studyDate.
   * - Backend generates weekly Tuesday scheduledDate values.
   * - Returned lessons all start with publicationStatus: 'draft'.
   */
  async createSeries(payload: CreateBibleStudySeriesPayload): Promise<BibleStudySeriesResponseData> {
    if (!payload.theme?.trim()) {
      throw new Error('Series theme is required.');
    }
    if (!payload.startDate?.trim()) {
      throw new Error('Start date is required.');
    }
    if (!Array.isArray(payload.lessons) || payload.lessons.length === 0) {
      throw new Error('Series must contain at least one lesson.');
    }

    // Clean lessons payload strictly adhering to contract
    const cleanLessons = payload.lessons.map((lesson, idx) => {
      const cleanLesson: Record<string, any> = {
        lessonNumber: lesson.lessonNumber ?? (idx + 1),
        topic: lesson.topic?.trim() || lesson.title?.trim() || `Lesson ${idx + 1}`
      };
      if (lesson.title?.trim()) cleanLesson.title = lesson.title.trim();
      if (lesson.theme?.trim()) cleanLesson.theme = lesson.theme.trim();
      if (lesson.textRef?.trim()) cleanLesson.textRef = lesson.textRef.trim();
      
      const mvRef = lesson.memoryVerseRef?.trim() || lesson.memoryVerse?.reference?.trim();
      const mvText = lesson.memoryVerseText?.trim() || lesson.memoryVerse?.text?.trim();
      if (mvRef) cleanLesson.memoryVerseRef = mvRef;
      if (mvText) cleanLesson.memoryVerseText = mvText;

      if (lesson.aim?.trim()) cleanLesson.aim = lesson.aim.trim();
      if (lesson.introduction?.trim()) cleanLesson.introduction = lesson.introduction.trim();
      if (Array.isArray(lesson.studyGuide) && lesson.studyGuide.length > 0) {
        cleanLesson.studyGuide = lesson.studyGuide.map(s => String(s).trim()).filter(Boolean);
      }
      if (Array.isArray(lesson.discussionQuestions) && lesson.discussionQuestions.length > 0) {
        cleanLesson.discussionQuestions = lesson.discussionQuestions.map(q => String(q).trim()).filter(Boolean);
      }
      if (lesson.conclusion?.trim()) cleanLesson.conclusion = lesson.conclusion.trim();
      if (Array.isArray(lesson.prayerPoints) && lesson.prayerPoints.length > 0) {
        cleanLesson.prayerPoints = lesson.prayerPoints.map(p => String(p).trim()).filter(Boolean);
      }
      return cleanLesson;
    });

    const cleanPayload: Record<string, any> = {
      theme: payload.theme.trim(),
      startDate: payload.startDate.trim(),
      lessons: cleanLessons
    };
    if (payload.title?.trim()) {
      cleanPayload.title = payload.title.trim();
    }
    if (payload.academicSessionId?.trim()) {
      cleanPayload.academicSessionId = payload.academicSessionId.trim();
    }

    if (APP_CONFIG.features.useMockServices) {
      const [y, m, d] = payload.startDate.split('-').map(Number);
      const baseDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
      const seriesId = `series-${Date.now()}`;

      const generatedLessons = cleanLessons.map((l, idx) => {
        const lessonDate = new Date(baseDate.getTime() + idx * 7 * 24 * 60 * 60 * 1000);
        const yStr = lessonDate.getUTCFullYear();
        const mStr = String(lessonDate.getUTCMonth() + 1).padStart(2, '0');
        const dStr = String(lessonDate.getUTCDate()).padStart(2, '0');
        const scheduledDate = `${yStr}-${mStr}-${dStr}`;

        const newLessonItem: BibleStudyItem = {
          id: `lesson-${seriesId}-${idx + 1}`,
          lessonNumber: l.lessonNumber,
          title: l.title || l.topic,
          topic: l.topic,
          theme: l.theme || payload.theme,
          annualTheme: payload.theme,
          subTheme: l.theme || payload.theme,
          date: formatStudyDate(scheduledDate),
          scheduledDate,
          studyDate: scheduledDate,
          keyScripture: l.textRef || '',
          textRef: l.textRef || '',
          textScriptures: l.textRef ? [l.textRef] : [],
          textContent: null,
          summary: l.introduction ? l.introduction.slice(0, 140) : '',
          aims: l.aim ? [l.aim] : [],
          aim: l.aim || '',
          introduction: l.introduction || '',
          studyGuide: (l.studyGuide || []).map((sg: string, sIdx: number) => ({
            id: `sg-${idx + 1}-${sIdx + 1}`,
            number: sIdx + 1,
            question: sg,
            scriptureRefs: []
          })),
          discussionQuestions: l.discussionQuestions || [],
          conclusion: l.conclusion || '',
          memoryVerse: {
            reference: l.memoryVerseRef || '',
            text: l.memoryVerseText || ''
          },
          prayerPoints: l.prayerPoints || [],
          isCurrent: false,
          isPublished: false,
          publicationStatus: 'draft',
          seriesId,
          seriesTitle: payload.title
        };
        mockBibleStudies.push(newLessonItem);

        return {
          id: newLessonItem.id,
          lessonNumber: l.lessonNumber,
          title: newLessonItem.title,
          topic: l.topic,
          scheduledDate,
          publicationStatus: 'draft' as const
        };
      });

      return {
        series: {
          id: seriesId,
          title: payload.title,
          startDate: payload.startDate,
          status: 'Draft',
          theme: payload.theme,
          academicSessionId: payload.academicSessionId
        },
        lessons: generatedLessons
      };
    }

    const res = await apiClient.post<any>('/bible-study/series', cleanPayload);
    return res.data?.data || res.data;
  },

  /**
   * Fetch a specific Bible study series by its ID:
   * GET /api/bible-study/series/:id
   */
  async getSeriesById(id: string): Promise<BibleStudySeriesDetail | null> {
    if (APP_CONFIG.features.useMockServices) {
      const seriesLessons = mockBibleStudies.filter(s => s.seriesId === id);
      return {
        id,
        title: seriesLessons[0]?.seriesTitle || 'Curriculum Series',
        startDate: seriesLessons[0]?.scheduledDate || '2026-09-29',
        status: 'Draft',
        academicSessionId: seriesLessons[0]?.academicSessionId,
        lessons: seriesLessons.map(s => ({
          id: s.id,
          lessonNumber: s.lessonNumber,
          title: s.title,
          topic: s.topic,
          scheduledDate: s.scheduledDate || '2026-09-29',
          publicationStatus: s.publicationStatus || 'draft'
        }))
      };
    }
    try {
      const res = await apiClient.get<any>(`/bible-study/series/${encodeURIComponent(id)}`);
      return res.data?.data || res.data || null;
    } catch (err) {
      console.warn(`Failed to fetch series with id ${id}:`, err);
      return null;
    }
  },

  /**
   * Explicitly publish a lesson outline:
   * PATCH /api/bible-study/:id/publish
   */
  async publishStudy(id: string): Promise<BibleStudyItem> {
    if (APP_CONFIG.features.useMockServices) {
      const study = mockBibleStudies.find(s => s.id === id);
      if (study) {
        study.isPublished = true;
        study.publicationStatus = 'published';
        return study;
      }
      throw new Error(`Study with id ${id} not found.`);
    }

    const res = await apiClient.patch<any>(`/bible-study/${encodeURIComponent(id)}/publish`);
    return normalizeBibleStudyItem(res.data?.data || res.data);
  },

  /**
   * Reschedule an individual lesson:
   * PUT /api/bible-study/:id
   * with payload { scheduledDate: "YYYY-MM-DD" }
   */
  async rescheduleStudy(id: string, scheduledDate: string): Promise<BibleStudyItem> {
    if (!scheduledDate?.trim()) {
      throw new Error('Scheduled date is required.');
    }

    if (APP_CONFIG.features.useMockServices) {
      const study = mockBibleStudies.find(s => s.id === id);
      if (study) {
        study.scheduledDate = scheduledDate.trim();
        study.studyDate = scheduledDate.trim();
        study.date = formatStudyDate(scheduledDate.trim());
        return study;
      }
      throw new Error(`Study with id ${id} not found.`);
    }

    const res = await apiClient.put<any>(`/bible-study/${encodeURIComponent(id)}`, {
      scheduledDate: scheduledDate.trim()
    });
    return normalizeBibleStudyItem(res.data?.data || res.data);
  },

  /**
   * Submit an individual reviewed study:
   * POST /api/bible-study
   */
  async submitStudy(studyData: Partial<BibleStudyItem> | ExtractedStudyFields): Promise<BibleStudyItem> {
    if (APP_CONFIG.features.useMockServices) {
      const newStudy: BibleStudyItem = {
        id: `study-${Date.now()}`,
        lessonNumber: Number((studyData as any).lessonNumber) || mockBibleStudies.length + 1,
        title: studyData.title || (studyData as any).topic || 'New Bible Study Lesson',
        theme: studyData.theme || '',
        annualTheme: studyData.theme || (studyData as any).annualTheme || '',
        subTheme: studyData.subTheme || '',
        date: studyData.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        keyScripture: studyData.keyScripture || '',
        textScriptures: studyData.textScriptures || [],
        summary: (studyData as any).summary || studyData.introduction?.slice(0, 120) || '',
        aims: Array.isArray(studyData.aims) ? studyData.aims : (studyData.aim ? [studyData.aim] : []),
        aim: studyData.aim || (Array.isArray(studyData.aims) ? studyData.aims[0] : ''),
        introduction: studyData.introduction || '',
        sections: (studyData.sections || []).map((s, idx) => ({
          id: (s as any).id || `sec-${idx + 1}`,
          title: s.title,
          paragraphs: s.paragraphs || [],
          scriptureRefs: s.scriptureRefs || []
        })),
        studyGuide: (studyData as any).studyGuide || [],
        discussionQuestions: studyData.discussionQuestions || [],
        conclusion: studyData.conclusion || '',
        memoryVerse: {
          reference: studyData.memoryVerse?.reference || '',
          text: studyData.memoryVerse?.text || ''
        },
        prayerPoints: studyData.prayerPoints || [],
        isCurrent: Boolean((studyData as any).isCurrent),
        isPublished: (studyData as any).isPublished ?? true
      };
      mockBibleStudies.unshift(newStudy);
      return newStudy;
    }

    const res = await apiClient.post<any>('/bible-study', studyData);
    return res.data?.data || res.data;
  },

  /**
   * Fetch section terminology aliases:
   * GET /api/bible-study/aliases
   */
  async getAliases(): Promise<SectionAliasItem[]> {
    if (APP_CONFIG.features.useMockServices) {
      return [...mockSectionAliases];
    }
    const res = await apiClient.get<any>('/bible-study/aliases');
    const raw = res.data?.data || res.data;
    if (Array.isArray(raw)) {
      return raw.map((item: any) => ({
        alias: item.alias || item.name || '',
        target: item.target || item.section || ''
      }));
    } else if (raw && typeof raw === 'object') {
      return Object.entries(raw).map(([alias, target]) => ({
        alias,
        target: String(target)
      }));
    }
    return [];
  },

  /**
   * Add a new section terminology alias (additive, keeps existing aliases):
   * POST /api/bible-study/aliases
   */
  async addAlias(alias: string, target: string): Promise<SectionAliasItem[]> {
    const trimmedAlias = alias.trim();
    const trimmedTarget = target.trim();
    if (!trimmedAlias || !trimmedTarget) {
      throw new Error('Alias and target section are required.');
    }

    if (APP_CONFIG.features.useMockServices) {
      const existing = mockSectionAliases.find(a => a.alias.toLowerCase() === trimmedAlias.toLowerCase());
      if (existing) {
        existing.target = trimmedTarget;
      } else {
        mockSectionAliases.push({ alias: trimmedAlias, target: trimmedTarget });
      }
      return [...mockSectionAliases];
    }

    const res = await apiClient.post<any>('/bible-study/aliases', {
      alias: trimmedAlias,
      target: trimmedTarget
    });
    return res.data?.data || res.data || [];
  },

  /**
   * Add a new Bible book alias (additive, keeps existing aliases):
   * POST /api/bible-study/book-aliases
   */
  async addBookAlias(alias: string, bookId: string): Promise<BookAliasItem[]> {
    const trimmedAlias = alias.trim();
    const trimmedBookId = bookId.trim().toLowerCase();
    if (!trimmedAlias || !trimmedBookId) {
      throw new Error('Book alias and bookId are required.');
    }

    if (APP_CONFIG.features.useMockServices) {
      const existing = mockBookAliases.find(a => a.alias.toLowerCase() === trimmedAlias.toLowerCase());
      if (existing) {
        existing.bookId = trimmedBookId;
      } else {
        mockBookAliases.push({ alias: trimmedAlias, bookId: trimmedBookId });
      }
      return [...mockBookAliases];
    }

    const res = await apiClient.post<any>('/bible-study/book-aliases', {
      alias: trimmedAlias,
      bookId: trimmedBookId
    });
    return res.data?.data || res.data || [];
  },

  /**
   * Fetch attached document / manual URL for a given study ID.
   */
  async getStudyDocument(id: string): Promise<{ documentUrl: string; documentType: 'pdf' | 'html' | 'external' } | null> {
    if (APP_CONFIG.features.useMockServices) {
      const study = mockBibleStudies.find(s => s.id === id);
      if (study && study.documentUrl) {
        return {
          documentUrl: study.documentUrl,
          documentType: study.documentType || 'pdf'
        };
      }
      return null;
    }
    const res = await apiClient.get<{ documentUrl: string; documentType: 'pdf' | 'html' | 'external' }>(`/bible-study/${encodeURIComponent(id)}/document`);
    return res.data;
  },

  /**
   * Convenient helper method to fetch document URL and type.
   */
  async getDocumentUrl(id: string): Promise<{ url: string; type: 'pdf' | 'html' | 'external' } | null> {
    const doc = await this.getStudyDocument(id);
    if (!doc) return null;
    return { url: doc.documentUrl, type: doc.documentType };
  },

  /**
   * Extracts and returns all structured Scripture references associated with a study.
   */
  async getStudyReferences(id: string): Promise<BibleReference[]> {
    const study = await this.getStudyById(id);
    if (!study) return [];

    const refs: BibleReference[] = [];

    // Key scripture
    if (study.keyScripture) {
      const parsed = parseBibleReference(study.keyScripture);
      if (parsed) refs.push(parsed);
    }

    // Text scriptures
    if (study.textScriptures) {
      study.textScriptures.forEach(ts => {
        const parsed = parseBibleReference(ts);
        if (parsed && !refs.some(r => r.raw === parsed.raw)) {
          refs.push(parsed);
        }
      });
    }

    // Memory verse
    if (study.memoryVerse?.reference) {
      const parsed = parseBibleReference(study.memoryVerse.reference);
      if (parsed && !refs.some(r => r.raw === parsed.raw)) {
        refs.push(parsed);
      }
    }

    // Sections
    if (study.sections) {
      study.sections.forEach(sec => {
        sec.scriptureRefs?.forEach(sr => {
          const parsed = parseBibleReference(sr);
          if (parsed && !refs.some(r => r.raw === parsed.raw)) {
            refs.push(parsed);
          }
        });
      });
    }

    // Study guide questions
    if (study.studyGuide) {
      study.studyGuide.forEach(sg => {
        sg.scriptureRefs?.forEach(sr => {
          const parsed = parseBibleReference(sr);
          if (parsed && !refs.some(r => r.raw === parsed.raw)) {
            refs.push(parsed);
          }
        });
      });
    }

    return refs;
  }
};
