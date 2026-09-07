/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HymnCard from '../HymnCard';
import HymnLyrics from '../HymnLyrics';
import HymnHeader from '../HymnHeader';
import HymnReferenceLink from '../HymnReferenceLink';
import { HymnItem } from '../../../types';

const sampleHymn: HymnItem = {
  id: 'sop-201',
  number: 201,
  title: 'Arise, Shine!',
  category: 'Praise & Renewal',
  author: 'Scriptural Hymn (Isaiah 60:1-4)',
  meter: 'Irregular',
  isTodayService: true,
  isPrebundledOffline: true,
  stanzas: [
    {
      number: 1,
      lines: [
        'Arise, shine! for thy light is come,',
        'And the glory of the Lord is risen upon thee.'
      ]
    },
    {
      number: 2,
      lines: [
        'For, behold, the darkness shall cover the earth,',
        'And gross darkness the people.'
      ]
    }
  ],
  chorus: [
    'Arise and give glory,',
    'Praise His holy name.'
  ]
};

describe('Hymn Components', () => {
  it('renders HymnCard with title, number and triggers click', () => {
    const handleClick = vi.fn();
    render(
      <MemoryRouter>
        <HymnCard hymn={sampleHymn} onClick={handleClick} />
      </MemoryRouter>
    );

    expect(screen.getByText('Arise, Shine!')).toBeDefined();
    expect(screen.getByText('201')).toBeDefined();
    
    const card = screen.getByText('Arise, Shine!').closest('.hymn-card');
    if (card) fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledWith(sampleHymn);
  });

  it('renders HymnLyrics stanzas and chorus correctly', () => {
    render(
      <HymnLyrics 
        stanzas={sampleHymn.stanzas} 
        chorus={sampleHymn.chorus} 
      />
    );

    expect(screen.getByText('Arise, shine! for thy light is come,')).toBeDefined();
    expect(screen.getByText('Refrain / Chorus')).toBeDefined();
    expect(screen.getByText('Arise and give glory,')).toBeDefined();
  });

  it('renders HymnHeader with title, author and category', () => {
    render(<HymnHeader hymn={sampleHymn} />);
    expect(screen.getByText('Arise, Shine!')).toBeDefined();
    expect(screen.getByText('Praise & Renewal')).toBeDefined();
    expect(screen.getByText('HYMN 201')).toBeDefined();
  });

  it('renders HymnReferenceLink and formats label', () => {
    render(
      <MemoryRouter>
        <HymnReferenceLink hymnNumber={201} title="Arise, Shine!" />
      </MemoryRouter>
    );
    expect(screen.getByText('SOP 201 — Arise, Shine!')).toBeDefined();
  });
});
