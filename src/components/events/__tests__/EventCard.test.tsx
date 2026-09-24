/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventCard } from '../EventCard';
import { EventItem } from '../../../types';

const mockEvent: EventItem = {
  id: 'evt-test-1',
  title: 'Annual Harvest & Thanksgiving',
  category: 'Worship',
  location: 'Main Sanctuary, FUTA South Gate',
  startTime: '2026-11-24T09:00:00+01:00',
  endTime: '2026-11-24T13:00:00+01:00',
  mode: 'In-Person',
  speaker: null,
  speakerRole: null,
  theme: null,
  description: 'Join us for a glorious celebration of God faithfulness.',
  imageUrl: null,
  status: 'Active',
  createdBy: 'admin-01',
  createdAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-09-01T10:00:00.000Z',
};

const cancelledMockEvent: EventItem = {
  ...mockEvent,
  id: 'evt-test-cancelled',
  title: 'Cancelled Leadership Summit',
  status: 'Cancelled'
};

describe('EventCard Component', () => {
  it('renders event title, category, date, and location correctly', () => {
    const handleSelect = vi.fn();
    render(<EventCard event={mockEvent} onSelect={handleSelect} />);

    expect(screen.getByText('Annual Harvest & Thanksgiving')).toBeInTheDocument();
    expect(screen.getByText('Worship')).toBeInTheDocument();
    expect(screen.getByText('NOV')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('Main Sanctuary, FUTA South Gate')).toBeInTheDocument();
  });

  it('renders cancelled status badge for cancelled events', () => {
    const handleSelect = vi.fn();
    render(<EventCard event={cancelledMockEvent} onSelect={handleSelect} />);

    expect(screen.getByText('Cancelled Leadership Summit')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('triggers onSelect when card is clicked', () => {
    const handleSelect = vi.fn();
    render(<EventCard event={mockEvent} onSelect={handleSelect} />);

    fireEvent.click(screen.getByText('Annual Harvest & Thanksgiving'));
    expect(handleSelect).toHaveBeenCalledWith(mockEvent);
  });

  it('toggles reminder without propagating card select click', () => {
    const handleSelect = vi.fn();
    const handleToggleReminder = vi.fn();

    render(
      <EventCard
        event={mockEvent}
        onSelect={handleSelect}
        onToggleReminder={handleToggleReminder}
        isReminded={false}
      />
    );

    const remindBtn = screen.getByTitle('Set Reminder');
    fireEvent.click(remindBtn);

    expect(handleToggleReminder).toHaveBeenCalledWith(mockEvent);
    expect(handleSelect).not.toHaveBeenCalled();
  });
});
