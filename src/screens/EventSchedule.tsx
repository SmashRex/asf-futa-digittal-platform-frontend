/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Calendar, Sparkles } from 'lucide-react';
import { EventItem } from '../types';
import { eventsService } from '../services/events/events.service';
import { LoadingState } from '../components/common/LoadingState';

interface EventScheduleProps {
  isOfflineSimulated?: boolean;
}

export default function EventSchedule({ isOfflineSimulated }: EventScheduleProps = {}) {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    eventsService.getSemesterSchedule().then((data) => {
      setEvents(data);
      setIsLoading(false);
    });
  }, []);

  const octEvents = events.filter(e => e.month === 'OCT');
  const novEvents = events.filter(e => e.month === 'NOV');

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
              Semester Program
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Anglican Students' Fellowship FUTA • Academic Session Schedule
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Loading timetable schedule..." />
      ) : (
        <>
          {/* OCTOBER SECTION */}
          {octEvents.length > 0 && (
            <section className="mb-8" id="october-events-section">
              <div className="mb-4 pl-3 border-l-4 border-[var(--color-primary)]">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-[var(--color-text-primary)]">
                  October
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Current Semester Schedule
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {octEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => navigate(`/events/${evt.id}`)}
                    className="event-card group cursor-pointer"
                    id={`schedule-card-${evt.id}`}
                  >
                    {/* Date Block Box */}
                    <div className="event-card-date-box shrink-0">
                      <span className="event-card-month">{evt.month}</span>
                      <span className="event-card-day">{evt.dayNumber}</span>
                    </div>

                    {/* Details Block */}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-bold font-serif text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                          {evt.title}
                        </h3>
                        {evt.isSpecialEvent && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-700" />
                            <span>Special Event</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                          <span>{evt.startTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[var(--color-text-light)] shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* NOVEMBER SECTION */}
          {novEvents.length > 0 && (
            <section className="mb-8" id="november-events-section">
              <div className="mb-4 pl-3 border-l-4 border-[var(--color-primary)]">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-[var(--color-text-primary)]">
                  November
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Upcoming Month Schedule
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {novEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => navigate(`/events/${evt.id}`)}
                    className="event-card group cursor-pointer"
                    id={`schedule-card-${evt.id}`}
                  >
                    {/* Date Block Box */}
                    <div className="event-card-date-box shrink-0">
                      <span className="event-card-month">{evt.month}</span>
                      <span className="event-card-day">{evt.dayNumber}</span>
                    </div>

                    {/* Details Block */}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-bold font-serif text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                          {evt.title}
                        </h3>
                        {evt.isSpecialEvent && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-700" />
                            <span>Special Event</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                          <span>{evt.startTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[var(--color-text-light)] shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
