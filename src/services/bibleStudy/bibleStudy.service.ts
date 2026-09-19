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
  ExtractedStudyFields
} from '../../types';
import { mockBibleStudies } from '../../data/bibleStudyData';
import { parseBibleReference } from '../../config/bible.config';
import { APP_CONFIG } from '../../config/app.config';
import { apiClient } from '../api/client';
import { ApiError } from '../api/types';

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
      title: '',
      subTheme: '',
      date: '',
      keyScripture: '',
      summary: '',
      introduction: '',
      discussionQuestions: [],
      memoryVerse: { reference: '', text: '' },
      prayerPoints: [],
      isCurrent: false,
      isPublished: false,
    };
  }

  // Memory verse normalization
  const rawMv = raw.memoryVerse || raw.memory_verse;
  let normalizedMv: BibleStudyMemoryVerse = { reference: '', text: '' };
  if (typeof rawMv === 'string') {
    normalizedMv = { reference: rawMv.trim(), text: '' };
  } else if (rawMv && typeof rawMv === 'object') {
    normalizedMv = {
      reference: String(rawMv.reference || rawMv.ref || rawMv.verse || '').trim(),
      text: String(rawMv.text || rawMv.content || rawMv.quote || '').trim(),
    };
  }

  // Scripture references normalization
  const rawKeyScripture = String(raw.keyScripture || raw.key_scripture || raw.key_verse || '').trim();
  const rawTextScriptures = raw.textScriptures || raw.text_scriptures;
  const normalizedTextScriptures: string[] = Array.isArray(rawTextScriptures)
    ? rawTextScriptures.map((s: any) => String(s).trim()).filter(Boolean)
    : (rawKeyScripture ? [rawKeyScripture] : []);

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

  return {
    id: String(raw.id || raw._id || raw.studyId || raw.study_id || '').trim(),
    lessonNumber: Number.isNaN(parsedLessonNumber) || parsedLessonNumber <= 0 ? 1 : parsedLessonNumber,
    title: String(raw.title || raw.topic || raw.name || 'Untitled Lesson').trim(),
    theme: raw.theme || raw.annualTheme || raw.annual_theme || '',
    annualTheme: raw.annualTheme || raw.annual_theme || raw.theme || '',
    subTheme: String(raw.subTheme || raw.sub_theme || raw.subtheme || '').trim(),
    date: String(raw.date || raw.study_date || raw.studyDate || '').trim(),
    keyScripture: rawKeyScripture,
    textScriptures: normalizedTextScriptures,
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
    studyGuide: Array.isArray(raw.studyGuide || raw.study_guide) ? (raw.studyGuide || raw.study_guide).map((sg: any, idx: number) => ({
      id: sg.id || `sg-${idx + 1}`,
      number: sg.number || idx + 1,
      question: sg.question || sg.text || '',
      scriptureRefs: Array.isArray(sg.scriptureRefs || sg.scripture_refs) ? (sg.scriptureRefs || sg.scripture_refs) : []
    })) : undefined,
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
    isPublished: Boolean(raw.isPublished ?? raw.is_published ?? true),
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
   * Fetch current/latest active Bible study session: GET /api/bible-study/current
   */
  async getLatestStudy(): Promise<BibleStudyItem | null> {
    if (APP_CONFIG.features.useMockServices) {
      return mockBibleStudies.find(s => s.isCurrent && s.isPublished) || mockBibleStudies[0] || null;
    }
    try {
      const res = await apiClient.get<any>('/bible-study/current');
      const raw = res.data?.data || res.data;
      if (raw) {
        return normalizeBibleStudyItem(raw);
      }
      return null;
    } catch (err) {
      // Return null cleanly when no study is published for today (do not call invented endpoints)
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
