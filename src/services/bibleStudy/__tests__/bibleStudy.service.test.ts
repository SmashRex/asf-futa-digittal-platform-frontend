/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { bibleStudyService, formatStudyDate, normalizeBibleStudyItem } from '../bibleStudy.service';
import { apiClient } from '../../api/client';
import { APP_CONFIG } from '../../../config/app.config';
import { publicMediaService } from '../../media/media.service';
import { bibleService } from '../../bible/bible.service';

describe('bibleStudyService', () => {
  const originalUseMock = APP_CONFIG.features.useMockServices;

  beforeEach(() => {
    vi.restoreAllMocks();
    APP_CONFIG.features.useMockServices = true;
  });

  afterEach(() => {
    APP_CONFIG.features.useMockServices = originalUseMock;
  });

  it('returns list of Bible studies', async () => {
    const studies = await bibleStudyService.getStudies();
    expect(studies.length).toBeGreaterThan(0);
    expect(studies[0]).toHaveProperty('id');
    expect(studies[0]).toHaveProperty('title');
    expect(studies[0]).toHaveProperty('keyScripture');
  });

  it('retrieves study by ID', async () => {
    const study = await bibleStudyService.getStudyById('study-01');
    expect(study).not.toBeNull();
    expect(study?.lessonNumber).toBe(1);
    expect(study?.title).toBeDefined();
  });

  it('retrieves latest study session', async () => {
    const latest = await bibleStudyService.getLatestStudy();
    expect(latest).not.toBeNull();
    expect(latest?.isCurrent).toBe(true);
  });

  it('retrieves document URL for a study guide', async () => {
    const docInfo = await bibleStudyService.getDocumentUrl('study-01');
    expect(docInfo).not.toBeNull();
    expect(docInfo?.url).toBeDefined();
  });

  it('uploads outline and detects multiple studies in mock mode', async () => {
    const file = new File(['%PDF-1.4 mock content'], 'outline.pdf', { type: 'application/pdf' });
    const result = await bibleStudyService.uploadOutline(file, { includeRawText: true });

    expect(result.studiesFound).toBeGreaterThanOrEqual(1);
    expect(result.studies.length).toBe(result.studiesFound);
    expect(result.studies[0].extracted.title).toBeDefined();
    expect(result.studies[0].extracted.theme).toBeDefined();
    expect(result.studies[0].extracted.subTheme).toBeDefined();
  });

  it('rejects invalid non-PDF file formats with user-friendly error', async () => {
    const txtFile = new File(['just plain text'], 'document.txt', { type: 'text/plain' });
    await expect(bibleStudyService.uploadOutline(txtFile)).rejects.toThrow(
      'Invalid file format: Please upload a valid PDF document.'
    );
  });

  it('posts multipart FormData to /bible-study/upload-outline in non-mock mode', async () => {
    APP_CONFIG.features.useMockServices = false;
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      success: true,
      data: {
        studiesFound: 2,
        studies: [
          {
            id: 'study-1',
            lessonNumberGuess: 1,
            extracted: {
              theme: 'Kingdom Living',
              subTheme: 'Discipleship',
              title: 'Lesson 1',
              keyScripture: 'Matthew 5:1-12'
            },
            scriptureReferences: [
              { raw: 'Matthew 5:1-12', recognized: true, bookId: 'mat', chapter: 5, verseStart: 1, verseEnd: 12 }
            ]
          }
        ]
      },
      message: 'Extracted'
    });

    const pdfFile = new File(['%PDF-1.4 dummy'], 'test.pdf', { type: 'application/pdf' });
    const result = await bibleStudyService.uploadOutline(pdfFile, { includeRawText: true });

    expect(postSpy).toHaveBeenCalledWith(
      '/bible-study/upload-outline?includeRawText=true',
      expect.any(FormData)
    );
    expect(result.studiesFound).toBe(2);
  });

  it('omits ?includeRawText=true by default when includeRawText is not requested', async () => {
    APP_CONFIG.features.useMockServices = false;
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      success: true,
      data: { studiesFound: 1, studies: [] },
      message: 'Extracted'
    });

    const pdfFile = new File(['%PDF-1.4 dummy'], 'test.pdf', { type: 'application/pdf' });
    await bibleStudyService.uploadOutline(pdfFile);

    expect(postSpy).toHaveBeenCalledWith(
      '/bible-study/upload-outline',
      expect.any(FormData)
    );
  });

  it('properly preserves backend INVALID_FILE error code', async () => {
    APP_CONFIG.features.useMockServices = false;
    const backendError: any = new Error('PDF stream is corrupted');
    backendError.code = 'INVALID_FILE';
    vi.spyOn(apiClient, 'post').mockRejectedValueOnce(backendError);

    const pdfFile = new File(['corrupted'], 'test.pdf', { type: 'application/pdf' });
    await expect(bibleStudyService.uploadOutline(pdfFile)).rejects.toMatchObject({
      code: 'INVALID_FILE'
    });
  });

  it('submits an individual study to POST /api/bible-study in non-mock mode', async () => {
    APP_CONFIG.features.useMockServices = false;
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      success: true,
      data: {
        id: 'study-real-123',
        title: 'Individual Lesson Test',
        theme: 'Kingdom Living',
        subTheme: 'Discipleship',
        lessonNumber: 5
      },
      message: 'Created'
    });

    const studyFields = {
      title: 'Individual Lesson Test',
      theme: 'Kingdom Living',
      subTheme: 'Discipleship',
      lessonNumber: 5
    };

    const created = await bibleStudyService.submitStudy(studyFields);
    expect(postSpy).toHaveBeenCalledWith('/bible-study', studyFields);
    expect(created.id).toBe('study-real-123');
    expect(created.title).toBe('Individual Lesson Test');
  });

  it('submits an individual study to POST /api/bible-study', async () => {
    const studyFields = {
      title: 'Individual Lesson Test',
      theme: 'Faithfulness',
      subTheme: 'Campus Living',
      lessonNumber: 5,
      keyScripture: 'Philippians 4:4-8',
      memoryVerse: { reference: 'Philippians 4:4', text: 'Rejoice in the Lord always.' }
    };

    const created = await bibleStudyService.submitStudy(studyFields);
    expect(created.title).toBe('Individual Lesson Test');
    expect(created.lessonNumber).toBe(5);
  });

  it('manages section and book aliases', async () => {
    const initialAliases = await bibleStudyService.getAliases();
    expect(initialAliases.length).toBeGreaterThan(0);

    const updated = await bibleStudyService.addAlias('Golden Text', 'Memory Verse');
    expect(updated.some(a => a.alias === 'Golden Text' && a.target === 'Memory Verse')).toBe(true);

    const bookAliases = await bibleStudyService.addBookAlias('Cant', 'sng');
    expect(Array.isArray(bookAliases)).toBe(true);
    expect(bookAliases.some(a => a.alias === 'Cant' && a.bookId === 'sng')).toBe(true);
  });

  describe('Phase 4: Contract and Normalization Robustness', () => {
    it('defensively formats dates without returning Invalid Date, null, or undefined', () => {
      expect(bibleStudyService).toBeDefined();
      expect(formatStudyDate(null)).toBe('');
      expect(formatStudyDate(undefined)).toBe('');
      expect(formatStudyDate('')).toBe('');
      expect(formatStudyDate('Invalid Date')).toBe('');
      expect(formatStudyDate('2026-09-22')).toBe('Tuesday, Sep 22');
    });

    it('normalizes real backend response with textContent: null and preserves nullability', () => {
      const backendPayload = {
        id: 'aa986505-64cf-40f2-88cc-7d3670085dee',
        lessonNumber: 1,
        title: 'Vitest Today Lesson',
        topic: 'Vitest Series Topic 1',
        theme: 'Vitest Test Theme',
        studyDate: '2026-09-22',
        scheduledDate: '2026-09-22',
        textRef: 'John 3:16',
        textContent: null,
        memoryVerseRef: 'John 3:16',
        memoryVerseText: 'For God so loved the world...',
        aim: 'To test the series creation flow end to end.',
        introduction: 'This is a test lesson introduction.',
        studyGuide: ['Test question 1'],
        discussionQuestions: ['Discussion question 1'],
        conclusion: 'This is a test lesson conclusion.',
        prayerPoints: ['Pray for peace'],
        publicationStatus: 'published',
        seriesId: 'f564c232-9731-40cc-a196-43dd24701b7a'
      };

      const normalized = normalizeBibleStudyItem(backendPayload);

      expect(normalized.textContent).toBeNull();
      expect(normalized.textRef).toBe('John 3:16');
      expect(normalized.theme).toBe('Vitest Test Theme');
      expect(normalized.scheduledDate).toBe('2026-09-22');
      expect(normalized.seriesId).toBe('f564c232-9731-40cc-a196-43dd24701b7a');
      expect(normalized.studyGuide).toHaveLength(1);
      expect(normalized.studyGuide?.[0].question).toBe('Test question 1');
      expect(normalized.discussionQuestions).toHaveLength(1);
      expect(normalized.discussionQuestions[0]).toBe('Discussion question 1');
      expect(normalized.aim).toBe('To test the series creation flow end to end.');
      expect(normalized.conclusion).toBe('This is a test lesson conclusion.');
      expect(normalized.prayerPoints).toEqual(['Pray for peace']);
      expect(normalized.memoryVerse.reference).toBe('John 3:16');
      expect(normalized.memoryVerse.text).toBe('For God so loved the world...');
    });

    it('fetches theme image placement via public.bible-study.theme when asset exists', async () => {
      APP_CONFIG.features.useMockServices = false;
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        success: true,
        data: {
          key: 'public.bible-study.theme',
          asset: {
            id: 'asset-theme-1',
            url: 'https://images.unsplash.com/photo-semester-theme.jpg',
            altText: 'Semester Theme Banner'
          }
        }
      });

      const asset = await publicMediaService.getPlacement('public.bible-study.theme');
      expect(asset).not.toBeNull();
      expect(asset?.url).toBe('https://images.unsplash.com/photo-semester-theme.jpg');
      expect(asset?.altText).toBe('Semester Theme Banner');
    });

    it('gracefully handles missing theme asset (null) without breaking', async () => {
      APP_CONFIG.features.useMockServices = false;
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        success: true,
        data: {
          key: 'public.bible-study.theme',
          asset: null
        }
      });

      const asset = await publicMediaService.getPlacement('public.bible-study.theme');
      expect(asset).toBeNull();
    });

    it('fetches current study via GET /api/bible-study/current in non-mock mode', async () => {
      APP_CONFIG.features.useMockServices = false;
      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        success: true,
        data: {
          id: 'study-current-today',
          lessonNumber: 3,
          title: 'Walking in the Spirit',
          scheduledDate: '2026-09-22',
          textRef: 'Galatians 5:16-26',
          textContent: null,
          isCurrent: true
        }
      });

      const current = await bibleStudyService.getCurrentStudy();
      expect(getSpy).toHaveBeenCalledWith('/bible-study/current');
      expect(current).not.toBeNull();
      expect(current?.id).toBe('study-current-today');
      expect(current?.lessonNumber).toBe(3);
      expect(current?.textContent).toBeNull();
    });

    it('returns null when backend returns 404 / NO_CURRENT_STUDY without substituting other studies', async () => {
      APP_CONFIG.features.useMockServices = false;
      const notFoundError: any = new Error('No current Bible Study scheduled for today');
      notFoundError.code = 'NO_CURRENT_STUDY';
      notFoundError.status = 404;
      vi.spyOn(apiClient, 'get').mockRejectedValueOnce(notFoundError);

      const current = await bibleStudyService.getCurrentStudy();
      expect(current).toBeNull();
    });

    it('resolves scripture verses dynamically via textRef when textContent is null', async () => {
      const passage = await bibleService.resolveReference('John 3:16', 'kjv');
      expect(passage).not.toBeNull();
      expect(passage?.reference).toBe('John 3:16');
      expect(passage?.verses.length).toBe(1);
      expect(passage?.verses[0].number).toBe(16);
      expect(passage?.verses[0].text).toContain('God');
    });

    it('handles legacy standalone studies with seriesId: null and scheduledDate: null', () => {
      const legacyPayload = {
        id: 'legacy-standalone-study',
        title: 'The Christian Walk',
        topic: 'Christian Living',
        studyDate: '2025-01-14',
        keyScripture: 'Colossians 2:6-7',
        textRef: 'Colossians 2:6-7',
        textContent: 'As ye have therefore received Christ Jesus the Lord, so walk ye in him:',
        seriesId: null,
        scheduledDate: null
      };

      const normalized = normalizeBibleStudyItem(legacyPayload);
      expect(normalized.seriesId).toBeNull();
      expect(normalized.scheduledDate).toBeNull();
      expect(normalized.studyDate).toBe('2025-01-14');
      expect(normalized.date).toBe('Tuesday, Jan 14');
      expect(normalized.textContent).toBe('As ye have therefore received Christ Jesus the Lord, so walk ye in him:');
    });

    it('prefers scheduledDate over studyDate for series lessons', () => {
      const seriesLessonPayload = {
        id: 'series-lesson-date-pref',
        lessonNumber: 2,
        title: 'Series Lesson 2',
        studyDate: '2026-09-15',
        scheduledDate: '2026-09-22',
        seriesId: 'series-123'
      };

      const normalized = normalizeBibleStudyItem(seriesLessonPayload);
      expect(normalized.scheduledDate).toBe('2026-09-22');
      expect(normalized.date).toBe('Tuesday, Sep 22');
    });
  });
});
