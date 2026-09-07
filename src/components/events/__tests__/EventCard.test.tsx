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
  month: 'NOV',
  dayNumber: '24',
  startDate: 'Sunday, November 24, 2026',
  startTime: '9:00 AM',
  endTime: '1:00 PM',
  venue: 'Main Sanctuary, FUTA South Gate',
  address: 'Main Campus, FUTA, Akure',
  mode: 'In-Person',
  organizer: 'ASF Executive Committee',
  category: 'Worship',
  status: 'Upcoming',
  description: 'Join us for a glorious celebration of God faithfulness.',
  shortDescription: 'Join us for a glorious celebration of God faithfulness.',
};

describe('EventCard Component', () => {
  it('renders event title, category, date, and venue correctly', () => {
    const handleSelect = vi.fn();
    render(<EventCard event={mockEvent} onSelect={handleSelect} />);

    expect(screen.getByText('Annual Harvest & Thanksgiving')).toBeInTheDocument();
    expect(screen.getByText('Worship')).toBeInTheDocument();
    expect(screen.getByText('NOV')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('Main Sanctuary, FUTA South Gate')).toBeInTheDocument();
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
