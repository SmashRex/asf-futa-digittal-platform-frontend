/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { EventItem } from '../../../types';
import { eventsService } from '../../../services/events/events.service';
import { formatEventDate, formatEventTime } from '../../../utils/eventDate';

export interface ScheduleSectionProps {
  thisWeekBackgroundImage?: string;
  thisWeekImageAlt?: string;
}

export default function ScheduleSection({
  thisWeekBackgroundImage,
  thisWeekImageAlt = 'ASF Fellowship Gathering'
}: ScheduleSectionProps = {}) {
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.allSettled([
      eventsService.getUpcomingEvents(),
      eventsService.getFeaturedEvent()
    ]).then(([eventsRes, featuredRes]) => {
      if (!isMounted) return;

      if (eventsRes.status === 'fulfilled') {
        // Filter out cancelled events for the regular public weekly rhythm display
        setUpcomingEvents(eventsRes.value.filter(e => e.status !== 'Cancelled'));
      }
      if (featuredRes.status === 'fulfilled') {
        setFeaturedEvent(featuredRes.value);
      }
      setIsLoading(false);
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Primary event to spotlight in "This Week at ASF"
  const spotlightEvent = featuredEvent || (upcomingEvents.length > 0 ? upcomingEvents[0] : null);

  const activeBackgroundImage = thisWeekBackgroundImage || spotlightEvent?.imageUrl || spotlightEvent?.image;

  return (
    <section data-section-id="schedule" className="py-24 bg-[#FDFBF9] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* A Week at ASF (Weekly Gatherings Rhythm) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5B0617] bg-[#5B0617]/10 px-2.5 py-0.5 rounded-full">
                  Semester Schedule
                </span>
              </div>
              <h2 className="font-display-reading text-3xl sm:text-4xl text-[#18181B] mb-4">
                A Week at ASF
              </h2>
              <p className="font-body-reading text-lg text-stone-600">
                Every gathering has its own rhythm, but they all point us back to Christ.
              </p>
            </div>

            {isLoading ? (
              <div className="py-8 text-stone-500 text-sm">
                Loading scheduled fellowship gatherings...
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center text-stone-600 space-y-2">
                <Calendar className="w-8 h-8 text-[#5B0617] mx-auto opacity-70" />
                <p className="font-medium text-base text-[#18181B]">No fellowship gatherings published yet</p>
                <p className="text-sm text-stone-500">
                  Semester schedule updates will appear here once published by the fellowship secretariat.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {upcomingEvents.slice(0, 4).map((gathering) => {
                  const dayName = formatEventDate(gathering.startTime);
                  const displayTime = formatEventTime(gathering.startTime, gathering.endTime);
                  const location = gathering.location || gathering.venue || 'Fellowship Sanctuary, FUTA';

                  return (
                    <div 
                      key={gathering.id} 
                      className="bg-white p-6 rounded-2xl shadow-xs border border-stone-100 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-3 sm:w-36">
                        <span className="font-label-caps text-xs font-bold text-[#5B0617] uppercase tracking-wider">
                          {dayName ? dayName.split(',')[0] : gathering.category}
                        </span>
                        <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                          {gathering.mode}
                        </span>
                        <div className="hidden sm:block h-px w-full bg-stone-100" />
                      </div>
                      
                      <div className="flex flex-col gap-3 flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-headline-md text-xl font-bold text-[#18181B]">
                            {gathering.title}
                          </h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                            {gathering.category}
                          </span>
                        </div>

                        {gathering.theme && (
                          <p className="text-xs text-[#5B0617] font-medium italic">
                            Theme: "{gathering.theme}"
                          </p>
                        )}

                        {gathering.description && (
                          <p className="font-body-md text-stone-600 leading-relaxed text-sm line-clamp-2">
                            {gathering.description}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-stone-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#5B0617]" />
                            <span>{displayTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[#5B0617]" />
                            <span>{location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* This Week at ASF (Authoritative Featured Gathering) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-8 sm:p-10 text-white shadow-xl sticky top-24 overflow-hidden bg-[#5B0617]">
              {/* Background Image Layer */}
              {activeBackgroundImage ? (
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img
                    src={activeBackgroundImage}
                    alt={thisWeekImageAlt}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D040F]/95 via-[#5B0617]/90 to-[#5B0617]/80 backdrop-blur-[1px]" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#5B0617] via-[#5B0617] to-[#430411] z-0 pointer-events-none" />
              )}

              <div className="relative z-10">
                <h3 className="font-display-reading text-2xl mb-8">This Week at ASF</h3>
                
                <div className="flex flex-col gap-8">
                  {spotlightEvent ? (
                    <div className="flex flex-col gap-4">
                      <span className="inline-flex self-start px-2.5 py-1 bg-white/20 text-white rounded-full font-label-caps text-[10px] tracking-wider uppercase backdrop-blur-sm">
                        Up Next
                      </span>
                      <div>
                        <h4 className="font-headline-md text-xl font-bold mb-2">
                          {spotlightEvent.title}
                        </h4>

                        {spotlightEvent.theme && (
                          <p className="text-amber-200 text-xs italic mb-2">
                            "{spotlightEvent.theme}"
                          </p>
                        )}

                        {spotlightEvent.description && (
                          <p className="text-white/80 font-body-md text-sm mb-4 leading-relaxed line-clamp-2">
                            {spotlightEvent.description}
                          </p>
                        )}

                        <div className="space-y-2 text-sm text-white/90 font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 opacity-70" />
                            <span>
                              {formatEventDate(spotlightEvent.startTime)} • {formatEventTime(spotlightEvent.startTime, spotlightEvent.endTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 opacity-70" />
                            <span>{spotlightEvent.location || spotlightEvent.venue || 'Fellowship Sanctuary, FUTA'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-white/70 font-body-md italic">
                      No upcoming fellowship events scheduled right now.
                    </div>
                  )}
                  
                  <div className="pt-8 border-t border-white/20">
                    <a 
                      href="/events" 
                      className="inline-flex items-center gap-2 text-white font-body-md font-semibold hover:text-white/80 transition-colors"
                    >
                      <span>View full semester schedule</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
