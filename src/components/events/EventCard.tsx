/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EventItem } from '../../types';
import { Calendar, Clock, MapPin, ChevronRight, Bell, Sparkles } from 'lucide-react';

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
  return (
    <div
      onClick={() => onSelect(event)}
      className="card-surface p-5 hover:border-[var(--color-primary)] transition-all cursor-pointer group flex flex-col sm:flex-row gap-4 items-start relative overflow-hidden"
    >
      {/* Date Badge */}
      <div className="flex sm:flex-col items-center justify-center bg-[var(--color-primary-tint)] text-[var(--color-primary)] rounded-xl p-3 sm:w-20 shrink-0 text-center border border-[var(--color-primary-tint)]">
        <span className="text-xs font-bold uppercase tracking-wide">{event.month}</span>
        <span className="text-2xl font-bold font-serif leading-none mt-0.5">{event.dayNumber}</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
            {event.category}
          </span>
          {event.isToday && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse">
              Today
            </span>
          )}
          {event.isSoon && !event.isToday && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Soon
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
          {event.title}
        </h3>

        <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2 leading-relaxed">
          {event.shortDescription || event.description}
        </p>

        {/* Metadata grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--color-text-secondary)] pt-3 mt-3 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
            <span className="truncate">{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center sm:flex-col justify-between w-full sm:w-auto sm:self-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--color-border)]">
        {onToggleReminder && (
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
