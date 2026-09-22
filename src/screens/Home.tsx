/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Book, 
  Music, 
  Megaphone, 
  Calendar, 
  GraduationCap, 
  Sparkles,
  ArrowRight,
  BookMarked,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { UserProfile, BibleStudyItem, Announcement } from '../types';
import { EventItem } from '../types/event';
import { bibleStudyService } from '../services/bibleStudy/bibleStudy.service';
import { eventsService } from '../services/events/events.service';
import { announcementsService } from '../services/announcements/announcements.service';

interface HomeProps {
  currentUser: UserProfile | null;
}

export default function Home({ currentUser }: HomeProps) {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');

  // Live personalized data states
  const [latestStudy, setLatestStudy] = useState<BibleStudyItem | null>(null);
  const [upcomingEvent, setUpcomingEvent] = useState<EventItem | null>(null);
  const [latestAnnouncement, setLatestAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPersonalizedDashboard() {
      try {
        const [studyRes, eventsRes, announcementsRes] = await Promise.allSettled([
          bibleStudyService.getLatestStudy(),
          eventsService.getEvents({ filter: 'upcoming' }),
          announcementsService.getAnnouncements(),
        ]);

        if (!isMounted) return;

        if (studyRes.status === 'fulfilled' && studyRes.value) {
          setLatestStudy(studyRes.value);
        }

        if (eventsRes.status === 'fulfilled' && eventsRes.value && eventsRes.value.length > 0) {
          setUpcomingEvent(eventsRes.value[0]);
        }

        if (announcementsRes.status === 'fulfilled' && announcementsRes.value && announcementsRes.value.length > 0) {
          setLatestAnnouncement(announcementsRes.value[0]);
        }
      } catch (err) {
        console.error('Error loading personalized member dashboard', err);
      }
    }

    loadPersonalizedDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  // Time-relative greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Greeting name logic: Bro [First Name] | Sis [First Name] | [First Name] | Fellowship Member
  const getGreetingName = () => {
    if (!currentUser?.name) {
      return 'Fellowship Member';
    }
    const firstName = currentUser.name.trim().split(/\s+/)[0];
    if (currentUser.gender === 'Male') {
      return `Bro ${firstName}`;
    }
    if (currentUser.gender === 'Female') {
      return `Sis ${firstName}`;
    }
    return firstName;
  };

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-6 select-none" id="member-home-screen">
      
      {/* Warm Personal Greeting & Profile Context */}
      <section className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-sm space-y-3" id="home-greeting-panel">
        <div>
          <p className="text-xs text-[var(--color-text-secondary)] font-medium">
            {getGreeting()},
          </p>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-primary)] mt-0.5" id="home-greeting-heading">
            {getGreetingName()}
          </h1>
        </div>

        {/* Member fellowship context badges */}
        {(currentUser?.department || currentUser?.level || currentUser?.subgroup) && (
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-[var(--color-text-secondary)]">
            {currentUser?.department && (
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E4E4E7] font-medium text-[var(--color-text-primary)]">
                {currentUser.department}
              </span>
            )}
            {currentUser?.level && (
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E4E4E7] font-medium text-[var(--color-text-primary)]">
                {currentUser.level}
              </span>
            )}
            {currentUser?.subgroup && (
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E4E4E7] font-medium text-[#5B0617]">
                {currentUser.subgroup}
              </span>
            )}
          </div>
        )}
      </section>

      {/* Active Study Outline & Memory Verse Card */}
      {latestStudy && (
        <section 
          onClick={() => navigate(`/bible-study/read/${latestStudy.id}`)}
          className="relative bg-[#5B0617] text-white p-5 sm:p-6 rounded-2xl cursor-pointer hover:bg-[#7A1F2B] transition-all shadow-sm space-y-3 overflow-hidden group"
          id="home-current-study-card"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BookMarked className="w-24 h-24 text-white" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider">
                ACTIVE BIBLE STUDY OUTLINE
              </span>
            </div>
            <span className="text-[11px] font-semibold text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
              Lesson {latestStudy.lessonNumber}
            </span>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-white leading-snug group-hover:text-amber-200 transition-colors">
              {latestStudy.title}
            </h2>
            {latestStudy.subTheme && (
              <p className="text-xs text-amber-200 font-medium mt-0.5">
                {latestStudy.subTheme}
              </p>
            )}
            {latestStudy.memoryVerse && (
              <p className="text-xs text-white/90 italic mt-2 leading-relaxed font-serif">
                "{latestStudy.memoryVerse.text}" — <strong className="font-sans text-amber-300">{latestStudy.memoryVerse.reference}</strong>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-amber-200 font-semibold border-t border-white/15 pt-3">
            <span>Passage: {latestStudy.keyScripture || 'Scripture Reading'}</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Study</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </section>
      )}

      {/* Primary Fellowship Navigation Tiles */}
      <section className="space-y-3" id="home-modules-section">
        <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider px-1">
          Fellowship Digital Services
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Scripture Reader */}
          <div
            onClick={() => navigate('/bible')}
            className="bg-white rounded-2xl border border-[#E4E4E7] p-4 flex flex-col justify-between h-32 hover:border-[#5B0617] hover:shadow-sm transition-all cursor-pointer group"
            id="tile-bible"
          >
            <div className="w-9 h-9 rounded-xl bg-[#5B0617]/10 text-[#5B0617] flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--color-text-primary)] group-hover:text-[#5B0617] transition-colors">
                Holy Bible
              </h4>
              <p className="text-[10px] text-[var(--color-text-secondary)]">KJV & WEB Offline</p>
            </div>
          </div>

          {/* Hymn Book */}
          <div
            onClick={() => navigate('/hymns')}
            className="bg-white rounded-2xl border border-[#E4E4E7] p-4 flex flex-col justify-between h-32 hover:border-[#5B0617] hover:shadow-sm transition-all cursor-pointer group"
            id="tile-hymns"
          >
            <div className="w-9 h-9 rounded-xl bg-[#5B0617]/10 text-[#5B0617] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--color-text-primary)] group-hover:text-[#5B0617] transition-colors">
                Hymn Book
              </h4>
              <p className="text-[10px] text-[var(--color-text-secondary)]">Ancient & Modern</p>
            </div>
          </div>

          {/* Bible Study Outlines */}
          <div
            onClick={() => navigate('/bible-study')}
            className="bg-white rounded-2xl border border-[#E4E4E7] p-4 flex flex-col justify-between h-32 hover:border-[#5B0617] hover:shadow-sm transition-all cursor-pointer group"
            id="tile-bible-study"
          >
            <div className="w-9 h-9 rounded-xl bg-[#5B0617]/10 text-[#5B0617] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Book className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--color-text-primary)] group-hover:text-[#5B0617] transition-colors">
                Bible Study
              </h4>
              <p className="text-[10px] text-[var(--color-text-secondary)]">Weekly Outlines</p>
            </div>
          </div>

          {/* Foundational School */}
          <div
            onClick={() => navigate('/fs')}
            className="bg-white rounded-2xl border border-[#E4E4E7] p-4 flex flex-col justify-between h-32 hover:border-[#5B0617] hover:shadow-sm transition-all cursor-pointer group"
            id="tile-foundational-school"
          >
            <div className="w-9 h-9 rounded-xl bg-[#5B0617]/10 text-[#5B0617] flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--color-text-primary)] group-hover:text-[#5B0617] transition-colors">
                FS Discipleship
              </h4>
              <p className="text-[10px] text-[var(--color-text-secondary)]">Class Modules</p>
            </div>
          </div>

          {/* Events Calendar */}
          <div
            onClick={() => navigate('/events')}
            className="bg-white rounded-2xl border border-[#E4E4E7] p-4 flex flex-col justify-between h-32 hover:border-[#5B0617] hover:shadow-sm transition-all cursor-pointer group"
            id="tile-events"
          >
            <div className="w-9 h-9 rounded-xl bg-[#5B0617]/10 text-[#5B0617] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--color-text-primary)] group-hover:text-[#5B0617] transition-colors">
                Events & Programs
              </h4>
              <p className="text-[10px] text-[var(--color-text-secondary)]">Schedule & Roster</p>
            </div>
          </div>

          {/* Announcements */}
          <div
            onClick={() => navigate('/announcements')}
            className="bg-white rounded-2xl border border-[#E4E4E7] p-4 flex flex-col justify-between h-32 hover:border-[#5B0617] hover:shadow-sm transition-all cursor-pointer group"
            id="tile-announcements"
          >
            <div className="w-9 h-9 rounded-xl bg-[#5B0617]/10 text-[#5B0617] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--color-text-primary)] group-hover:text-[#5B0617] transition-colors">
                Announcements
              </h4>
              <p className="text-[10px] text-[var(--color-text-secondary)]">Notices & Updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Event Preview */}
      {upcomingEvent && (
        <section className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#5B0617]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#18181B]">
                Upcoming Fellowship Gathering
              </h3>
            </div>
            <button 
              onClick={() => navigate('/events')}
              className="text-xs font-semibold text-[#5B0617] hover:underline"
            >
              All Events
            </button>
          </div>

          <div 
            onClick={() => navigate(`/events/${upcomingEvent.id}`)}
            className="flex items-start justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5] p-2 rounded-xl transition-colors"
          >
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#18181B]">{upcomingEvent.title}</h4>
              <p className="text-xs text-[#52525B] line-clamp-1">{upcomingEvent.shortDescription || upcomingEvent.description}</p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-[#52525B]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#5B0617]" />
                  <span>{upcomingEvent.startTime}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#5B0617]" />
                  <span>{upcomingEvent.venue || upcomingEvent.address}</span>
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#52525B] shrink-0 mt-1" />
          </div>
        </section>
      )}

      {/* Latest Broadcast Notice */}
      {latestAnnouncement && (
        <section className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#5B0617]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#18181B]">
                Latest Broadcast Notice
              </h3>
            </div>
            <button 
              onClick={() => navigate('/announcements')}
              className="text-xs font-semibold text-[#5B0617] hover:underline"
            >
              View All
            </button>
          </div>

          <div 
            onClick={() => navigate(`/announcements/${latestAnnouncement.id}`)}
            className="flex items-start justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5] p-2 rounded-xl transition-colors"
          >
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF8F5] border border-[#E4E4E7] text-[#5B0617]">
                {latestAnnouncement.category}
              </span>
              <h4 className="font-bold text-sm text-[#18181B] mt-1">{latestAnnouncement.title}</h4>
              <p className="text-xs text-[#52525B] line-clamp-1 mt-0.5">{latestAnnouncement.excerpt || latestAnnouncement.content}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#52525B] shrink-0 mt-1" />
          </div>
        </section>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 left-1/2 -translate-x-1/2 bg-[var(--color-text-primary)] text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-white/10 max-w-sm w-[90%] flex items-start gap-2 z-50 leading-relaxed"
          id="home-toast-popup"
        >
          <div className="bg-white/10 p-1 rounded-full text-[var(--color-accent)] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
