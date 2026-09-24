/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Share2, 
  Bell, 
  Check, 
  Ban,
  User,
  Clock,
  MapPin
} from 'lucide-react';
import { EventItem, ReminderOffset } from '../types';
import { eventsService } from '../services/events/events.service';
import { remindersService } from '../services/reminders/reminders.service';
import { useDevState } from '../dev/simulations/devState';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { EventMeta } from '../components/events/EventMeta';
import { EventReminderModal } from '../components/events/EventReminderModal';
import { LoadingState } from '../components/common/LoadingState';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { formatEventDate, formatEventTime } from '../utils/eventDate';

interface EventDetailProps {
  isOfflineSimulated?: boolean;
  remindedEventIds?: string[];
  onToggleReminder?: (eventId: string, offset?: ReminderOffset) => boolean;
}

export default function EventDetail({
  remindedEventIds: externalRemindedIds,
  onToggleReminder: externalToggleReminder,
}: EventDetailProps) {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const devState = useDevState();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [localRemindedIds, setLocalRemindedIds] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (eventId) {
      eventsService.getEventById(eventId).then((data) => {
        if (isMounted) {
          setEvent(data);
          setIsLoading(false);
        }
      });
      remindersService.getActiveReminders().then((ids) => {
        if (isMounted) setLocalRemindedIds(ids);
      });
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const effectiveRemindedIds = externalRemindedIds || localRemindedIds;
  const isReminded = eventId ? effectiveRemindedIds.includes(eventId) : false;

  if (isLoading) {
    return (
      <div className="events-page py-12">
        <LoadingState message="Loading gathering details..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="events-page text-center py-12" id="event-not-found">
        <div className="bg-amber-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-amber-800">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[var(--color-text-primary)] mb-2">
          Event not found
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
          The requested program could not be located or may have been updated in the calendar.
        </p>
        <button
          onClick={() => navigate('/events')}
          className="btn-primary inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Events Schedule</span>
        </button>
      </div>
    );
  }

  const isCancelled = event.status === 'Cancelled';
  const displayDate = formatEventDate(event.startTime, true);
  const displayTime = formatEventTime(event.startTime, event.endTime);
  const location = event.location || event.venue || 'Fellowship Sanctuary, FUTA';
  const heroImage = event.imageUrl || event.image;

  const handleShare = () => {
    const shareData = {
      title: event.title,
      text: `${event.title} - ${displayDate} at ${location}\n\nJoin us on ASF Platform:`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveReminderOffset = async (offset: ReminderOffset) => {
    if (!eventId) return;
    setIsReminderModalOpen(false);

    if (externalToggleReminder) {
      externalToggleReminder(eventId, offset);
    } else {
      await remindersService.setEventReminder(eventId, offset);
      setLocalRemindedIds(await remindersService.getActiveReminders());
    }

    setToastMessage(`Reminder activated for ${event.title}`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleRemoveReminder = async () => {
    if (!eventId) return;
    setIsReminderModalOpen(false);

    if (externalToggleReminder) {
      externalToggleReminder(eventId);
    } else {
      await remindersService.removeEventReminder(eventId);
      setLocalRemindedIds(await remindersService.getActiveReminders());
    }

    setToastMessage('Reminder cancelled.');
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="events-page select-none pb-12" id="event-detail-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-full shadow-lg border border-stone-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Offline Banner */}
      {devState.isOfflineSimulated && (
        <OfflineBanner message="Offline Mode Active: Event details loaded from cached bundle." />
      )}

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-background)] transition-colors shadow-2xs cursor-pointer"
          id="event-detail-back-btn"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Back to Schedule</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            title="Share event link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          {!isCancelled && (
            <button
              onClick={() => setIsReminderModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isReminded
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-stone-300'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isReminded ? 'Reminder Active' : 'Remind Me'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Prominent Cancellation Banner if Cancelled */}
      {isCancelled && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-xs">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-rose-900">This gathering has been cancelled</h3>
            <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
              This event will not hold as previously scheduled. Please monitor fellowship announcements for rescheduling or other programs.
            </p>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="card-surface p-0 overflow-hidden mb-6 border-2 border-[var(--color-primary-tint)] relative">
        <div className="relative h-56 sm:h-72 w-full bg-stone-900">
          {heroImage ? (
            <ImageWithFallback
              src={heroImage}
              fallbackType="eventHero"
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#5B0617] via-[#480512] to-stone-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[var(--color-accent)] text-amber-950 font-sans">
                {event.category}
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-white/20 backdrop-blur-xs text-white">
                {event.mode}
              </span>
              {isCancelled && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-600 text-white flex items-center gap-1">
                  <Ban className="w-3 h-3" />
                  <span>Cancelled</span>
                </span>
              )}
            </div>

            <h1 className={`text-2xl sm:text-3xl font-bold font-serif leading-tight ${isCancelled ? 'line-through opacity-80' : ''}`}>
              {event.title}
            </h1>

            {event.theme && (
              <p className="text-xs sm:text-sm text-amber-200 mt-1 font-medium italic">
                Theme: "{event.theme}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Pane */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview - only shown if description is non-null and non-empty */}
          {event.description && (
            <div className="card-surface p-6 space-y-3">
              <h2 className="text-base font-bold font-serif text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
                About This Gathering
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          )}

          {/* Speaker / Minister Profile if available */}
          {event.speaker && (
            <div className="card-surface p-6 space-y-3">
              <h2 className="text-base font-bold font-serif text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Guest Minister / Speaker</span>
              </h2>
              <div>
                <p className="font-bold text-sm text-[var(--color-text-primary)]">
                  {event.speaker}
                </p>
                {event.speakerRole && (
                  <p className="text-xs text-[var(--color-primary)] font-medium mt-0.5">
                    {event.speakerRole}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Agenda / Program of Service if available */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="card-surface p-6 space-y-4">
              <h2 className="text-base font-bold font-serif text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
                Program of Event
              </h2>
              <div className="space-y-3">
                {event.agenda.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                    <span className="font-bold text-[var(--color-primary)] shrink-0 w-20">
                      {item.time}
                    </span>
                    <div>
                      <span className="font-semibold text-[var(--color-text-primary)] block">
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="text-[var(--color-text-secondary)] block text-xs mt-0.5">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Logistics */}
        <div className="space-y-6">
          <EventMeta event={event} />

          {/* Location Summary */}
          <div className="card-surface p-5 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Location Details</span>
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {location}
            </p>
            <p className="text-[11px] text-stone-500">
              Anglican Students' Fellowship, Federal University of Technology, Akure.
            </p>
          </div>
        </div>
      </div>

      {/* Reminder Config Modal */}
      {isReminderModalOpen && (
        <EventReminderModal
          event={event}
          isOpen={isReminderModalOpen}
          onClose={() => setIsReminderModalOpen(false)}
          onSaveReminder={handleSaveReminderOffset}
          onRemoveReminder={handleRemoveReminder}
          isReminded={isReminded}
        />
      )}
    </div>
  );
}
