/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { hymnsService } from '../hymns.service';

describe('Hymns Service', () => {
  it('retrieves all hymns', async () => {
    const hymns = await hymnsService.getHymns();
    expect(hymns).toBeDefined();
    expect(hymns.length).toBeGreaterThan(0);
    expect(hymns.some(h => h.number === 201)).toBe(true);
  });

  it('retrieves hymn by ID and by Number', async () => {
    const hymnById = await hymnsService.getHymnById('sop-201');
    expect(hymnById).not.toBeNull();
    expect(hymnById?.title).toBe('Arise, Shine!');
    expect(hymnById?.number).toBe(201);

    const hymnByNum = await hymnsService.getHymnByNumber(201);
    expect(hymnByNum).not.toBeNull();
    expect(hymnByNum?.id).toBe('sop-201');

    const flexible = await hymnsService.getHymnByIdOrNumber('201');
    expect(flexible?.id).toBe('sop-201');
  });

  it('searches hymns by title and lyrics', async () => {
    const resultsTitle = await hymnsService.searchHymns('Arise');
    expect(resultsTitle.some(h => h.id === 'sop-201')).toBe(true);

    const resultsLyric = await hymnsService.searchHymns('cherubim');
    expect(resultsLyric.some(h => h.number === 1)).toBe(true);

    const resultsNumber = await hymnsService.searchHymns('201');
    expect(resultsNumber.some(h => h.number === 201)).toBe(true);
  });

  it('retrieves category summaries and distinct categories', async () => {
    const categories = await hymnsService.getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain('Praise & Renewal');

    const summaries = await hymnsService.getCategorySummaries();
    expect(summaries.length).toBeGreaterThan(0);
    expect(summaries.find(s => s.name === 'Praise & Renewal')?.count).toBeGreaterThan(0);
  });

  it('retrieves today featured hymn', async () => {
    const today = await hymnsService.getTodayHymn();
    expect(today).not.toBeNull();
    expect(today?.isTodayService).toBe(true);
  });

  it('calculates adjacent hymns correctly for sequential browsing', async () => {
    const hymns = await hymnsService.getHymns();
    const sorted = [...hymns].sort((a, b) => a.number - b.number);
    const middleHymn = sorted[1];

    const adjacent = await hymnsService.getAdjacentHymns(middleHymn.number);
    expect(adjacent.prev).not.toBeNull();
    expect(adjacent.prev?.number).toBe(sorted[0].number);
    expect(adjacent.next).not.toBeNull();
    expect(adjacent.next?.number).toBe(sorted[2].number);
  });

  it('retrieves quick navigation numbers', async () => {
    const numbers = await hymnsService.getQuickNumbers();
    expect(numbers.length).toBeGreaterThan(0);
    expect(numbers).toContain(201);
    expect(numbers).toContain(1);
  });
});
