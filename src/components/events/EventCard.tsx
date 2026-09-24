/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EventItem } from '../../types';
import { Clock, MapPin, ChevronRight, Bell, User, Ban } from 'lucide-react';
import { getEventMonth, getEventDay, formatEventTime } from '../../utils/eventDate';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
  onToggleReminder?: (event: EventItem) => void;
  isReminded?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onToggleReminder,
  isReminded = false,
}) => {
  const isCancelled = event.status === 'Cancelled';
  const month = getEventMonth(event.startTime);
  const dayNumber = getEventDay(event.startTime);
  const displayTime = formatEventTime(event.startTime, event.endTime);
  const location = event.location || event.venue || 'Fellowship Sanctuary, FUTA';

  return (
    <div
      onClick={() => onSelect(event)}
      className={`card-surface p-5 transition-all cursor-pointer group flex flex-col sm:flex-row gap-4 items-start relative overflow-hidden ${
        isCancelled 
          ? 'border-stone-200 bg-stone-50/75 opacity-75 hover:border-stone-300' 
          : 'hover:border-[var(--color-primary)]'
      }`}
    >
      {/* Date Box */}
      <div 
        className={`flex sm:flex-col items-center justify-center rounded-xl p-3 sm:w-20 shrink-0 text-center border ${
          isCancelled 
            ? 'bg-stone-200/60 text-stone-600 border-stone-200' 
            : 'bg-[var(--color-primary-tint)] text-[var(--color-primary)] border-[var(--color-primary-tint)]'
        }`}
      >
        <span className="text-xs font-bold uppercase tracking-wide">{month || 'DATE'}</span>
        <span className="text-2xl font-bold font-serif leading-none mt-0.5">{dayNumber || '—'}</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
            {event.category}
          </span>

          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            {event.mode}
          </span>

          {isCancelled && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              <Ban className="w-3 h-3 text-rose-700" />
              <span>Cancelled</span>
            </span>
          )}
        </div>

        <h3 className={`text-base sm:text-lg font-bold transition-colors line-clamp-1 ${
          isCancelled
            ? 'text-stone-500 line-through'
            : 'text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]'
        }`}>
          {event.title}
        </h3>

        {event.theme && (
          <p className="text-xs text-[var(--color-primary)] font-medium mt-0.5 line-clamp-1 italic">
            Theme: "{event.theme}"
          </p>
        )}

        {(event.shortDescription || event.description) && (
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2 leading-relaxed">
            {event.shortDescription || event.description}
          </p>
        )}

        {/* Metadata grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--color-text-secondary)] pt-3 mt-3 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
            <span className="truncate">{displayTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          {event.speaker && (
            <div className="flex items-center gap-1.5 sm:col-span-2">
              <User className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
              <span className="truncate">{event.speaker}{event.speakerRole ? ` • ${event.speakerRole}` : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action / Chevron */}
      <div className="flex items-center sm:flex-col justify-between w-full sm:w-auto sm:self-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--color-border)]">
        {onToggleReminder && !isCancelled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleReminder(event);
            }}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all ${
              isReminded
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] border-[var(--color-border)]'
            }`}
            title={isReminded ? 'Reminder Set' : 'Set Reminder'}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="sm:hidden">{isReminded ? 'Reminded' : 'Remind'}</span>
          </button>
        )}
        <div className="p-2 rounded-full text-[var(--color-text-light)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all hidden sm:block">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
