/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Calendar, Ban } from 'lucide-react';
import { EventItem } from '../types';
import { eventsService } from '../services/events/events.service';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { 
  getEventMonth, 
  getEventDay, 
  getEventMonthLong, 
  formatEventTime 
} from '../utils/eventDate';

interface EventScheduleProps {
  isOfflineSimulated?: boolean;
}

export default function EventSchedule({ isOfflineSimulated }: EventScheduleProps = {}) {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    eventsService.getSemesterSchedule()
      .then((data) => {
        if (isMounted) {
          setEvents(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setEvents([]);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamically group events chronologically by month in Africa/Lagos timezone
  const groupedEvents = useMemo(() => {
    const groups: { monthKey: string; monthName: string; items: EventItem[] }[] = [];

    events.forEach((evt) => {
      const monthName = getEventMonthLong(evt.startTime) || 'Scheduled Gatherings';
      let group = groups.find(g => g.monthName === monthName);
      if (!group) {
        group = {
          monthKey: monthName.toLowerCase().replace(/\s+/g, '-'),
          monthName,
          items: []
        };
        groups.push(group);
      }
      group.items.push(evt);
    });

    return groups;
  }, [events]);

  return (
    <div className="events-page select-none" id="semester-program-screen">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-background)] transition-colors shadow-2xs cursor-pointer"
          id="schedule-back-btn"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Back to Events</span>
        </button>

        <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary-tint)] px-3 py-1 rounded-full border border-[var(--color-primary)]/20">
          Semester Schedule
        </span>
      </div>

      {/* Main Title Banner */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl mb-8 shadow-2xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-[var(--color-primary-tint)] text-[var(--color-primary)] rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[var(--color-text-primary)]">
              Semester Schedule
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Anglican Students' Fellowship FUTA • Timetable of Fellowship Gatherings
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Loading semester timetable..." />
      ) : events.length === 0 ? (
        <EmptyState
          title="No Upcoming Events"
          description="No upcoming events have been published yet."
          onReset={() => navigate('/events')}
          resetText="Return to Events"
        />
      ) : (
        <div className="space-y-8">
          {groupedEvents.map((group) => (
            <section key={group.monthKey} className="space-y-3" id={`${group.monthKey}-events-section`}>
              <div className="mb-3 pl-3 border-l-4 border-[var(--color-primary)]">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-[var(--color-text-primary)]">
                  {group.monthName}
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {group.items.length} {group.items.length === 1 ? 'gathering' : 'gatherings'} scheduled
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {group.items.map((evt) => {
                  const isCancelled = evt.status === 'Cancelled';
                  const month = getEventMonth(evt.startTime);
                  const dayNumber = getEventDay(evt.startTime);
                  const displayTime = formatEventTime(evt.startTime, evt.endTime);
                  const location = evt.location || evt.venue || 'Fellowship Sanctuary, FUTA';

                  return (
                    <div
                      key={evt.id}
                      onClick={() => navigate(`/events/${evt.id}`)}
                      className={`event-card group cursor-pointer ${
                        isCancelled ? 'opacity-70 bg-stone-50 border-stone-200' : ''
                      }`}
                      id={`schedule-card-${evt.id}`}
                    >
                      {/* Date Block Box */}
                      <div className={`event-card-date-box shrink-0 ${isCancelled ? 'bg-stone-200 text-stone-600' : ''}`}>
                        <span className="event-card-month">{month || 'DATE'}</span>
                        <span className="event-card-day">{dayNumber || '—'}</span>
                      </div>

                      {/* Details Block */}
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className={`text-base font-bold font-serif transition-colors ${
                            isCancelled 
                              ? 'text-stone-500 line-through' 
                              : 'text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]'
                          }`}>
                            {evt.title}
                          </h3>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                            {evt.category}
                          </span>

                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                            {evt.mode}
                          </span>

                          {isCancelled && (
                            <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 inline-flex items-center gap-1">
                              <Ban className="w-3 h-3 text-rose-700" />
                              <span>Cancelled</span>
                            </span>
                          )}
                        </div>

                        {evt.theme && (
                          <p className="text-xs text-[var(--color-primary)] font-medium italic mb-1 line-clamp-1">
                            Theme: "{evt.theme}"
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-secondary)]">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                            <span>{displayTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[var(--color-text-light)] shrink-0" />
                            <span className="truncate">{location}</span>
                          </div>
                          {evt.speaker && (
                            <div className="flex items-center gap-1 text-stone-600">
                              <span>• Minister: {evt.speaker}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
