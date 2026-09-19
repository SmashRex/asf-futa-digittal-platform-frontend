/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  X, 
  Bell, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { EventItem } from '../types';
import { eventsService } from '../services/events/events.service';
import { remindersService } from '../services/reminders/reminders.service';
import { EVENTS_CONTENT } from '../content/events-content';
import { useDevState } from '../dev/simulations/devState';
import { EventCard } from '../components/events/EventCard';
import { EventHero } from '../components/events/EventHero';
import { EventReminderModal } from '../components/events/EventReminderModal';
import { EmptyState } from '../components/common/EmptyState';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { LoadingState } from '../components/common/LoadingState';

interface EventHomeProps {
  isOfflineSimulated?: boolean;
  onToggleOffline?: () => void;
  remindedEventIds?: string[];
  onToggleReminder?: (id: string) => boolean;
}

export default function EventHome({
  remindedEventIds: externalRemindedIds,
  onToggleReminder: externalToggleReminder,
}: EventHomeProps) {
  const navigate = useNavigate();
  const devState = useDevState();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<string>('Upcoming');

  const [localRemindedIds, setLocalRemindedIds] = useState<string[]>([]);
  const [selectedReminderEvent, setSelectedReminderEvent] = useState<EventItem | null>(null);

  // Load events via service
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const filter = activeTab === 'Past Events' ? 'past' : undefined;

    eventsService.getEvents({
      category: selectedCategory as any,
      filter: filter,
      searchQuery: searchQuery,
      isOfflineSimulated: devState.isOfflineSimulated,
    }).then((data) => {
      if (isMounted) {
        if (devState.isEmptyStateSimulated) {
          setEvents([]);
        } else {
          setEvents(data);
        }
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, activeTab, searchQuery, devState.isOfflineSimulated, devState.isEmptyStateSimulated]);

  // Load reminders
  useEffect(() => {
    remindersService.getActiveReminders().then(setLocalRemindedIds);
  }, []);

  const effectiveRemindedIds = externalRemindedIds || localRemindedIds;

  // Featured / Next event
  const featuredEvent = useMemo(() => {
    if (activeTab === 'Past Events' || events.length === 0) return undefined;
    return events.find(e => e.isNextEvent || e.isToday) || events[0];
  }, [events, activeTab]);

  const timelineEvents = useMemo(() => {
    if (!featuredEvent) return events;
    return events.filter(e => e.id !== featuredEvent.id);
  }, [events, featuredEvent]);

  const handleOpenReminderModal = (event: EventItem) => {
    setSelectedReminderEvent(event);
  };

  const handleSaveReminder = async (offset: any) => {
    if (!selectedReminderEvent) return;
    if (externalToggleReminder) {
      externalToggleReminder(selectedReminderEvent.id);
    } else {
      await remindersService.setEventReminder(selectedReminderEvent.id, offset);
      setLocalRemindedIds(await remindersService.getActiveReminders());
    }
    setSelectedReminderEvent(null);
  };

  const handleRemoveReminder = async () => {
    if (!selectedReminderEvent) return;
    if (externalToggleReminder) {
      externalToggleReminder(selectedReminderEvent.id);
    } else {
      await remindersService.removeEventReminder(selectedReminderEvent.id);
      setLocalRemindedIds(await remindersService.getActiveReminders());
    }
    setSelectedReminderEvent(null);
  };

  return (
    <div className="events-page select-none" id="events-home-screen">
      {/* Offline Alert Banner */}
      {devState.isOfflineSimulated && (
        <OfflineBanner message="Offline Mode Active: Showing cached pre-bundled events schedule." />
      )}

      {/* Page Header Introduction */}
      <header className="events-header bg-[var(--color-surface)] border border-[var(--color-border)] p-4 sm:p-5 rounded-2xl shadow-2xs mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-[var(--color-primary-tint)] text-[var(--color-primary)] font-bold text-[10px] uppercase tracking-wider rounded-full border border-[var(--color-primary)]/20">
                {EVENTS_CONTENT.header.badge}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[var(--color-text-primary)] tracking-tight">
              {EVENTS_CONTENT.header.title}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
              {EVENTS_CONTENT.header.description}
            </p>
          </div>

          <button
            onClick={() => navigate('/events/schedule')}
            className="btn-secondary text-xs shrink-0 flex items-center justify-center gap-2 self-start sm:self-auto"
            id="view-full-schedule-btn"
          >
            <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
            <span>{EVENTS_CONTENT.header.scheduleButtonText}</span>
          </button>
        </div>
      </header>

      {/* Search and Category Filter Controls */}
      <div className="space-y-3 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-secondary)]">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by event title, speaker, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-box pl-10 pr-9 text-xs sm:text-sm"
            id="events-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {EVENTS_CONTENT.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Horizon Tabs */}
        <div className="flex border-b border-[var(--color-border)]">
          {['Upcoming', 'This Week', 'This Month', 'Past Events'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Events Body */}
      {isLoading ? (
        <LoadingState message="Fetching events schedule..." />
      ) : events.length === 0 ? (
        <EmptyState
          title={EVENTS_CONTENT.emptyState.title}
          description={EVENTS_CONTENT.emptyState.description}
          onReset={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setActiveTab('Upcoming');
          }}
          resetText={EVENTS_CONTENT.emptyState.resetButtonText}
        />
      ) : (
        <div className="space-y-6">
          {/* Featured Hero Event */}
          {featuredEvent && (
            <EventHero
              event={featuredEvent}
              onSelect={(evt) => navigate(`/events/${evt.id}`)}
              onToggleReminder={handleOpenReminderModal}
              isReminded={effectiveRemindedIds.includes(featuredEvent.id)}
            />
          )}

          {/* Timeline Events List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
              {activeTab === 'Past Events' ? 'Archive of Events' : 'Upcoming Gatherings'} ({timelineEvents.length})
            </h3>
            {timelineEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onSelect={(selected) => navigate(`/events/${selected.id}`)}
                onToggleReminder={handleOpenReminderModal}
                isReminded={effectiveRemindedIds.includes(evt.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reminder Config Modal */}
      {selectedReminderEvent && (
        <EventReminderModal
          event={selectedReminderEvent}
          isOpen={Boolean(selectedReminderEvent)}
          onClose={() => setSelectedReminderEvent(null)}
          onSaveReminder={handleSaveReminder}
          onRemoveReminder={handleRemoveReminder}
          isReminded={effectiveRemindedIds.includes(selectedReminderEvent.id)}
        />
      )}
    </div>
  );
}
