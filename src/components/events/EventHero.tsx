/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EventItem } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { Calendar, Clock, MapPin, Sparkles, Ban } from 'lucide-react';
import { formatEventDate, formatEventTime } from '../../utils/eventDate';

interface EventHeroProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
  onToggleReminder?: (event: EventItem) => void;
  isReminded?: boolean;
}

export const EventHero: React.FC<EventHeroProps> = ({
  event,
  onSelect,
}) => {
  const isCancelled = event.status === 'Cancelled';
  const displayDate = formatEventDate(event.startTime);
  const displayTime = formatEventTime(event.startTime, event.endTime);
  const location = event.location || event.venue || 'Fellowship Sanctuary, FUTA';
  const heroImage = event.imageUrl || event.image;

  return (
    <div
      onClick={() => onSelect(event)}
      className="card-surface p-0 overflow-hidden hover:shadow-lg transition-all cursor-pointer group border-2 border-[var(--color-primary-tint)] mb-6 relative"
    >
      <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-stone-900">
        {heroImage ? (
          <ImageWithFallback
            src={heroImage}
            fallbackType="eventHero"
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#5B0617] via-[#480512] to-stone-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[var(--color-accent)] text-amber-950 font-sans shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Next Featured Gathering</span>
            </span>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-xs text-white">
              {event.category}
            </span>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-xs text-white">
              {event.mode}
            </span>
            {isCancelled && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-600 text-white flex items-center gap-1">
                <Ban className="w-3 h-3" />
                <span>Cancelled</span>
              </span>
            )}
          </div>

          <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold font-serif leading-tight ${isCancelled ? 'line-through opacity-80' : ''}`}>
            {event.title}
          </h2>

          {event.theme && (
            <p className="text-xs sm:text-sm text-amber-200 font-medium italic mt-1">
              Theme: "{event.theme}"
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-200 mt-2">
            {displayDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[var(--color-accent)]" />
                <span>{displayDate}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[var(--color-accent)]" />
              <span>{displayTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
