/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EventItem } from '../../types';
import { EventCard } from './EventCard';
import { EmptyState } from '../common/EmptyState';

interface EventListProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onToggleReminder?: (event: EventItem) => void;
  remindedEventIds?: string[];
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  onSelectEvent,
  onToggleReminder,
  remindedEventIds = [],
  emptyTitle,
  emptyDescription,
  onResetFilters,
}) => {
  if (events.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No Events Found'}
        description={emptyDescription || 'There are no fellowship events matching your current filters.'}
        onReset={onResetFilters}
      />
    );
  }

  return (
    <div className="space-y-4" id="event-list-container">
      {events.map((evt) => (
        <EventCard
          key={evt.id}
          event={evt}
          onSelect={onSelectEvent}
          onToggleReminder={onToggleReminder}
          isReminded={remindedEventIds.includes(evt.id)}
        />
      ))}
    </div>
  );
};
