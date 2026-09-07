/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles, BellRing } from 'lucide-react';
import { EventItem } from '../types';
import { ImageWithFallback } from './common/ImageWithFallback';

interface NextEventCardProps {
  event: EventItem;
  isReminded?: boolean;
}

export default function NextEventCard({ event, isReminded }: NextEventCardProps) {
  const navigate = useNavigate();

  // Status Badge styling helper
  const getStatusBadge = () => {
    if (event.isToday || event.status === 'Happening Today') {
      return (
        <span className="px-2.5 py-1 bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-full shadow-2xs animate-pulse flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>Happening Today</span>
        </span>
      );
    }
    if (event.isSoon || event.status === 'Starting Soon') {
      return (
        <span className="px-2.5 py-1 bg-amber-500 text-amber-950 font-bold text-[10px] uppercase tracking-wider rounded-full shadow-2xs flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-950" />
          <span>Starting Soon</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-[var(--color-primary-tint)] text-[var(--color-primary)] font-bold text-[10px] uppercase tracking-wider rounded-full border border-[var(--color-primary)]/20">
        Next Featured Gathering
      </span>
    );
  };

  return (
    <section className="mb-6" id="next-event-section">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-primary)]"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Featured Gathering</span>
          </span>
        </div>

        <div className="shrink-0">
          {getStatusBadge()}
        </div>
      </div>

      <article 
        onClick={() => navigate(`/events/${event.id}`)}
        className="next-event-card group cursor-pointer transition-all hover:border-[var(--color-primary)]/40"
        id={`next-event-card-${event.id}`}
      >
        {/* Hero Image Container */}
        <div className="next-event-image-container">
          <ImageWithFallback
            src={event.image}
            fallbackType="eventHero"
            preset="card"
            alt={event.title}
            className="next-event-image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[var(--color-accent)] text-amber-950 font-bold text-[11px] uppercase tracking-wider rounded-full shadow-2xs">
                {event.category}
              </span>
              <span className="px-3 py-1 bg-black/60 text-white font-semibold text-[11px] rounded-full backdrop-blur-md border border-white/20">
                {event.mode}
              </span>
              {isReminded && (
                <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[11px] rounded-full inline-flex items-center gap-1 shadow-2xs">
                  <BellRing className="w-3 h-3" />
                  <span>Reminder Active</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Body Details */}
        <div className="next-event-content">
          <div>
            {event.theme && (
              <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-0.5">
                Theme: "{event.theme}"
              </span>
            )}
            <h2 className="text-lg sm:text-xl font-bold font-serif text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors leading-snug mb-1.5">
              {event.title}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
              {event.shortDescription}
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-primary)]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <span className="font-semibold">{event.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/events/${event.id}`);
            }}
            className="w-full py-2.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl hover:bg-[var(--color-primary-dark)] transition-all flex items-center justify-center gap-2 shadow-2xs group-hover:gap-3 cursor-pointer"
            id="view-next-event-details-btn"
          >
            <span>View Details & Reminder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </article>
    </section>
  );
}
