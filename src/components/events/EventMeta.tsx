/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EventItem } from '../../types';
import { Calendar, Clock, MapPin, User, Globe, AlertCircle } from 'lucide-react';

interface EventMetaProps {
  event: EventItem;
}

export const EventMeta: React.FC<EventMetaProps> = ({ event }) => {
  return (
    <div className="card-surface p-5 space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
        Gathering Logistics
      </h3>

      <div className="space-y-3 text-xs sm:text-sm">
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[var(--color-text-primary)] block">Date & Horizon</span>
            <span className="text-[var(--color-text-secondary)]">{event.startDate}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[var(--color-text-primary)] block">Time Window</span>
            <span className="text-[var(--color-text-secondary)]">{event.startTime} - {event.endTime}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[var(--color-text-primary)] block">Venue</span>
            <span className="text-[var(--color-text-secondary)]">{event.venue} ({event.address})</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Globe className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[var(--color-text-primary)] block">Format</span>
            <span className="text-[var(--color-text-secondary)]">{event.mode}</span>
          </div>
        </div>

        {event.speaker && (
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[var(--color-text-primary)] block">Speaker / Minister</span>
              <span className="text-[var(--color-text-secondary)]">{event.speaker} ({event.speakerRole})</span>
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
