/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EventItem } from '../../types';
import { Calendar, Clock, MapPin, User, Globe, AlertCircle, Ban } from 'lucide-react';
import { formatEventDate, formatEventTime } from '../../utils/eventDate';

interface EventMetaProps {
  event: EventItem;
}

export const EventMeta: React.FC<EventMetaProps> = ({ event }) => {
  const isCancelled = event.status === 'Cancelled';
  const displayDate = formatEventDate(event.startTime, true);
  const displayTime = formatEventTime(event.startTime, event.endTime);
  const location = event.location || event.venue || 'Fellowship Sanctuary, FUTA';

  return (
    <div className="card-surface p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
          Gathering Logistics
        </h3>
        {isCancelled && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <Ban className="w-3.5 h-3.5 text-rose-700" />
            <span>Cancelled</span>
          </span>
        )}
      </div>

      {isCancelled && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
          <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">This gathering has been cancelled.</p>
            <p className="text-[11px] text-rose-700 mt-0.5">Please check fellowship announcements for rescheduling or alternative programs.</p>
          </div>
        </div>
      )}

      <div className="space-y-3 text-xs sm:text-sm">
        {displayDate && (
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[var(--color-text-primary)] block">Date & Timezone</span>
              <span className="text-[var(--color-text-secondary)]">{displayDate} (WAT)</span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[var(--color-text-primary)] block">Time Window</span>
            <span className="text-[var(--color-text-secondary)]">{displayTime}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[var(--color-text-primary)] block">Location</span>
            <span className="text-[var(--color-text-secondary)]">{location}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Globe className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[var(--color-text-primary)] block">Attendance Mode</span>
            <span className="text-[var(--color-text-secondary)]">{event.mode}</span>
          </div>
        </div>

        {event.speaker && (
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[var(--color-text-primary)] block">Speaker / Minister</span>
              <span className="text-[var(--color-text-secondary)]">
                {event.speaker}
                {event.speakerRole ? ` (${event.speakerRole})` : ''}
              </span>
            </div>
          </div>
        )}

        {event.theme && (
          <div className="flex items-start gap-3">
            <span className="w-4 h-4 text-[var(--color-primary)] font-bold text-center mt-0.5">✦</span>
            <div>
              <span className="font-semibold text-[var(--color-text-primary)] block">Theme</span>
              <span className="text-[var(--color-text-secondary)] italic">"{event.theme}"</span>
            </div>
          </div>
        )}
      </div>

      {event.specialNotice && (
        <div className="event-special-notice mt-4">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-xs uppercase tracking-wide">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{event.specialNotice.title}</span>
          </div>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            {event.specialNotice.description}
          </p>
        </div>
      )}
    </div>
  );
};
