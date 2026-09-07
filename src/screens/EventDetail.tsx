/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Share2, 
  Bell, 
  Check, 
  Sparkles,
  BookOpen,
  Shirt,
  Navigation,
  Bus
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
import EventMapModal from '../components/EventMapModal';

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
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
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
          Gathering Not Found
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

  const handleShare = () => {
    const shareData = {
      title: event.title,
      text: `${event.title} - ${event.startDate} at ${event.venue}\n\nJoin us on ASF Platform:`,
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
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
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
            className="p-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            title="Share event link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsReminderModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isReminded
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-slate-300'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{isReminded ? 'Reminder Active' : 'Remind Me'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="card-surface p-0 overflow-hidden mb-6 border-2 border-[var(--color-primary-tint)]">
        <div className="relative h-56 sm:h-72 w-full">
          <ImageWithFallback
            src={event.image}
            fallbackType="eventHero"
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[var(--color-accent)] text-slate-950 font-sans">
                {event.category}
              </span>
              {event.mode && (
                <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-white/20 backdrop-blur-xs text-white">
                  {event.mode}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif leading-tight">
              {event.title}
            </h1>

            {event.theme && (
              <p className="text-xs sm:text-sm text-[var(--color-accent)] mt-1 font-medium">
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
          {/* Overview */}
          <div className="card-surface p-6 space-y-4">
            <h2 className="text-base font-bold font-serif text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
              About This Gathering
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {event.description}
            </p>

            {event.aboutContent && event.aboutContent.length > 0 && (
              <div className="space-y-3 pt-2">
                {event.aboutContent.map((para, idx) => (
                  <p key={idx} className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Agenda / Program Outline */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="card-surface p-6 space-y-4">
              <h2 className="text-base font-bold font-serif text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Order of Service & Schedule</span>
              </h2>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[var(--color-border)] pl-8">
                {event.agenda.map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-[var(--color-primary)] ring-4 ring-white"></span>
                    <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wide block">
                      {item.time}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)] mt-0.5">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {event.additionalInfo && (
            <div className="card-surface p-6 space-y-4">
              <h2 className="text-base font-bold font-serif text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
                Preparations & Guidelines
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {event.additionalInfo.bibleNote && (
                  <div className="p-3 bg-[var(--color-bg-subtle)] rounded-xl border border-[var(--color-border)] flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[var(--color-text-primary)] block mb-0.5">Scripture Notes</span>
                      <span className="text-[var(--color-text-secondary)]">{event.additionalInfo.bibleNote}</span>
                    </div>
                  </div>
                )}

                {event.additionalInfo.dressCode && (
                  <div className="p-3 bg-[var(--color-bg-subtle)] rounded-xl border border-[var(--color-border)] flex items-start gap-2.5">
                    <Shirt className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[var(--color-text-primary)] block mb-0.5">Recommended Dress Code</span>
                      <span className="text-[var(--color-text-secondary)]">{event.additionalInfo.dressCode}</span>
                    </div>
                  </div>
                )}

                {event.additionalInfo.transportInfo && (
                  <div className="p-3 bg-[var(--color-bg-subtle)] rounded-xl border border-[var(--color-border)] flex items-start gap-2.5 sm:col-span-2">
                    <Bus className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[var(--color-text-primary)] block mb-0.5">Shuttle & Transportation</span>
                      <span className="text-[var(--color-text-secondary)]">{event.additionalInfo.transportInfo}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Logistics Pane */}
        <div className="space-y-6">
          <EventMeta event={event} />

          {/* Map trigger card */}
          {event.mapCoordinates && (
            <div className="card-surface p-5 text-center">
              <Navigation className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">Campus Location Map</h4>
              <p className="text-xs text-[var(--color-text-secondary)] mb-4">{event.venue}</p>
              <button
                onClick={() => setIsMapModalOpen(true)}
                className="btn-secondary w-full text-xs flex items-center justify-center gap-2"
              >
                <span>View Campus Directions</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reminder Modal */}
      <EventReminderModal
        event={event}
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSaveReminder={handleSaveReminderOffset}
        onRemoveReminder={handleRemoveReminder}
        isReminded={isReminded}
      />

      {/* Campus Map Modal */}
      {isMapModalOpen && event.mapCoordinates && (
        <EventMapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          event={event}
        />
      )}
    </div>
  );
}
