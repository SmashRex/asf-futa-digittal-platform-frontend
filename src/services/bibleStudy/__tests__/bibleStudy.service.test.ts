/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { bibleStudyService } from '../bibleStudy.service';
import { apiClient } from '../../api/client';
import { APP_CONFIG } from '../../../config/app.config';

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
});
