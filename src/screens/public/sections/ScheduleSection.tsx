import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { weeklyGatherings, upcomingEvents } from '../data/mockData';

export default function ScheduleSection() {
  return (
    <section data-section-id="schedule" className="py-24 bg-[#FDFBF9] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* A Week at ASF (Weekly Gatherings) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <div>
              <h2 className="font-display-reading text-3xl sm:text-4xl text-[#18181B] mb-4">
                A Week at ASF
              </h2>
              <p className="font-body-reading text-lg text-stone-600">
                Every gathering has its own rhythm, but they all point us back to Christ.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {weeklyGatherings.map((gathering) => (
                <div key={gathering.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-3 sm:w-32">
                    <span className="font-label-caps text-xs font-bold text-[#5B0617] uppercase tracking-wider">{gathering.day}</span>
                    <div className="hidden sm:block h-px w-full bg-stone-100" />
                  </div>
                  <div className="flex flex-col gap-3 flex-grow">
                    <h3 className="font-headline-md text-xl font-bold text-[#18181B]">{gathering.name}</h3>
                    <p className="font-body-md text-stone-600 leading-relaxed">
                      {gathering.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-stone-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {gathering.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {gathering.venue}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* This Week at ASF (Dynamic/Upcoming) */}
          <div className="lg:col-span-5">
            <div className="bg-[#5B0617] rounded-3xl p-8 sm:p-10 text-white shadow-xl sticky top-24">
              <h3 className="font-display-reading text-2xl mb-8">This Week at ASF</h3>
              
              <div className="flex flex-col gap-8">
                {/* Example of dynamic rendering. If there's an event this week, show it. Otherwise show next gathering. */}
                {upcomingEvents.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    <span className="inline-flex self-start px-2.5 py-1 bg-white/20 text-white rounded-full font-label-caps text-[10px] tracking-wider uppercase backdrop-blur-sm">
                      Up Next
                    </span>
                    <div>
                      <h4 className="font-headline-md text-xl font-bold mb-2">{upcomingEvents[0].title}</h4>
                      <p className="text-white/80 font-body-md text-sm mb-4 leading-relaxed line-clamp-2">
                        {upcomingEvents[0].description}
                      </p>
                      <div className="space-y-2 text-sm text-white/90 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 opacity-70" />
                          {upcomingEvents[0].date} • {upcomingEvents[0].time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 opacity-70" />
                          {upcomingEvents[0].venue}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-white/70 font-body-md italic">
                    Regular schedule continues this week.
                  </div>
                )}
                
                <div className="pt-8 border-t border-white/20">
                  <a href="#visit" className="inline-flex items-center gap-2 text-white font-body-md font-semibold hover:text-white/80 transition-colors">
                    Join us this week <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
