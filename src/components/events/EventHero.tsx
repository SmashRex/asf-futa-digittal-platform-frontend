/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EventItem } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { Calendar, Clock, MapPin, Sparkles, Bell } from 'lucide-react';

interface EventHeroProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
  onToggleReminder?: (event: EventItem) => void;
  isReminded?: boolean;
}

export const EventHero: React.FC<EventHeroProps> = ({
  event,
  onSelect,
  onToggleReminder,
  isReminded = false,
}) => {
  return (
    <div
      onClick={() => onSelect(event)}
      className="card-surface p-0 overflow-hidden hover:shadow-lg transition-all cursor-pointer group border-2 border-[var(--color-primary-tint)] mb-6"
    >
      <div className="relative h-48 sm:h-64 w-full overflow-hidden">
        <ImageWithFallback
          src={event.image}
          fallbackType="eventHero"
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[var(--color-accent)] text-slate-950 font-sans shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Next Featured Event</span>
            </span>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-xs text-white">
              {event.category}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif leading-tight">
            {event.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 mt-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[var(--color-accent)]" />
              <span>{event.startDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[var(--color-accent)]" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
              <span>{event.venue}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
