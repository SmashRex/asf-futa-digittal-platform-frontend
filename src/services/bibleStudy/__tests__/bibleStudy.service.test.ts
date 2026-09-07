/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { bibleStudyService } from '../bibleStudy.service';

describe('bibleStudyService', () => {
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
});
