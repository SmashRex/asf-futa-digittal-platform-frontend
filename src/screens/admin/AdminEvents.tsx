/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { eventsService } from '../../services/events/events.service';
import { EventItem, EventCategory, EventMode } from '../../types/event';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Clock, 
  User, 
  Sparkles, 
  X,
  AlertCircle,
  Ban,
  RefreshCw,
  Eye
} from 'lucide-react';

const EVENT_CATEGORIES: EventCategory[] = [
  'Bible Study',
  'Prayer',
  'Worship',
  'Outreach',
  'Fellowship',
  'Special Program',
  'Administrative'
];

const EVENT_MODES: EventMode[] = [
  'In-Person',
  'Online / Zoom',
  'Hybrid'
];

export const AdminEvents: React.FC = () => {
  const { activeRole } = useOutletContext<AdminContextType>();

  // Role permissions: President is VIEW ONLY.
  // Publicity Coordinator, General Secretary, Technical Administrator have full management permissions.
  const isPresident = activeRole === 'President / Executive';
  const canManageEvents = !isPresident && (
    activeRole === 'Publicity Coordinator' ||
    activeRole === 'General Secretary' ||
    activeRole === 'Technical Administrator'
  );

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Special Program');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('5:00 PM');
  const [endTime, setEndTime] = useState('7:00 PM');
  const [venue, setVenue] = useState('ASF Fellowship Hall, FUTA');
  const [speaker, setSpeaker] = useState('');
  const [speakerRole, setSpeakerRole] = useState('');
  const [mode, setMode] = useState<EventMode>('Hybrid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadEvents = async (filter: 'all' | 'upcoming' | 'past' = activeFilter) => {
    setIsLoading(true);
    setError(null);
    setActionError(null);
    try {
      const data = await eventsService.getEvents(
        filter === 'all' ? {} : { filter }
      );
      setEvents(data);
    } catch (err: any) {
      console.warn('[AdminEvents] Failed to load events:', err);
      setError(err?.message || 'Failed to load events.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents(activeFilter);
  }, [activeFilter]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !canManageEvents) return;

    setIsSubmitting(true);
    setActionError(null);
    try {
      const created = await eventsService.createEvent({
        title,
        category,
        startDate: startDate || 'Upcoming 2026',
        startTime,
        endTime,
        venue,
        speaker: speaker || undefined,
        speakerRole: speakerRole || undefined,
        mode,
        month: 'OCT',
        dayNumber: '25',
        status: 'Upcoming'
      });
      setEvents(prev => [created, ...prev]);
      setIsModalOpen(false);
      setTitle('');
      setSpeaker('');
      setSpeakerRole('');
      setStartDate('');
    } catch (err: any) {
      console.error('[AdminEvents] Failed to create event:', err);
      setActionError(err?.message || 'Failed to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEvent = async (id: string) => {
    if (!canManageEvents) return;
    setActionError(null);
    try {
      const cancelled = await eventsService.cancelEvent(id);
      setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, status: 'Cancelled' } : ev));
    } catch (err: any) {
      console.error('[AdminEvents] Failed to cancel event:', err);
      setActionError(err?.message || 'Failed to cancel event.');
    }
  };

  return (
    <div className="space-y-6" id="admin-events-screen">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
              Events & Calendar Management
            </h1>
            {isPresident && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                <Eye className="w-3 h-3 text-stone-500" />
                View Only
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#52525B] mt-0.5">
            Schedule fellowship services, revival nights, and retreat gatherings across the semester.
          </p>
        </div>

        {canManageEvents && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        )}
      </div>

      {/* Action Error Banner */}
      {actionError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-700 hover:text-rose-900 font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
        <div className="flex items-center gap-2">
          {(['upcoming', 'past', 'all'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeFilter === filter
                  ? 'bg-[#5B0617] text-white shadow-xs'
                  : 'text-[#52525B] hover:text-[#18181B] hover:bg-stone-100'
              }`}
            >
              {filter === 'all' ? 'All Events' : `${filter} Events`}
            </button>
          ))}
        </div>
        <button
          onClick={() => loadEvents(activeFilter)}
          disabled={isLoading}
          className="p-1.5 rounded-lg text-[#52525B] hover:bg-stone-100 transition-colors"
          title="Refresh Events"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Events List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#52525B] bg-white rounded-2xl border border-[#E4E4E7]">
          <RefreshCw className="w-6 h-6 text-[#5B0617] animate-spin mx-auto mb-2" />
          <p>Loading events timetable...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-xs bg-rose-50 rounded-2xl border border-rose-200 text-rose-800 p-6 space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <p className="font-semibold">{error}</p>
          <button
            onClick={() => loadEvents(activeFilter)}
            className="px-3 py-1.5 bg-rose-700 text-white rounded-xl font-bold hover:bg-rose-800"
          >
            Retry Loading
          </button>
        </div>
      ) : events.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#71717A] bg-white rounded-2xl border border-[#E4E4E7] space-y-2">
          <Calendar className="w-8 h-8 text-stone-300 mx-auto" />
          <p className="font-semibold text-stone-700">No events found for this filter</p>
          <p className="text-[11px] text-stone-500">There are no calendar entries matching the selected criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => {
            const isCancelled = ev.status === 'Cancelled';

            return (
              <div 
                key={ev.id} 
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                  isCancelled ? 'border-stone-200 opacity-60 bg-stone-50' : 'border-[#E4E4E7]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B0617] bg-[#5B0617]/10 px-2 py-0.5 rounded">
                      {ev.category}
                    </span>
                    <StatusBadge status={ev.status || 'Upcoming'} size="sm" />
                  </div>

                  <h3 className={`font-serif font-bold text-base leading-tight ${isCancelled ? 'line-through text-[#71717A]' : 'text-[#18181B]'}`}>
                    {ev.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-[#52525B] pt-2 border-t border-[#E4E4E7]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#5B0617]" />
                      <span>{ev.startDate} ({ev.startTime} - {ev.endTime})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#805600]" />
                      <span>{ev.venue} • <strong className="text-[#18181B]">{ev.mode}</strong></span>
                    </div>
                    {ev.speaker && (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-blue-700" />
                        <span>{ev.speaker} {ev.speakerRole ? `(${ev.speakerRole})` : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4E4E7] flex items-center justify-between">
                  <span className={`text-[11px] font-semibold ${isCancelled ? 'text-stone-500' : 'text-emerald-700'}`}>
                    {isCancelled ? 'Event Cancelled' : 'Active Calendar Event'}
                  </span>

                  {canManageEvents && !isCancelled && (
                    <button
                      onClick={() => handleCancelEvent(ev.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition-colors"
                      title="Cancel Event (Soft Cancellation)"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {isModalOpen && canManageEvents && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E4E4E7] shadow-2xl p-6 space-y-4 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#18181B]">Add Fellowship Event</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-[#52525B] hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#18181B]">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Special Joint Revival Night"
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-semibold text-[#18181B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#18181B]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  >
                    {EVENT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#18181B]">Attendance Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as EventMode)}
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  >
                    {EVENT_MODES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-[#18181B]">Date</label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="e.g. Mar 15, 2026"
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#18181B]">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#18181B]">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#18181B]">Venue Location</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#18181B]">Guest Minister / Speaker</label>
                  <input
                    type="text"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    placeholder="e.g. Venerable Dr. Adediran"
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#18181B]">Speaker Title / Role</label>
                  <input
                    type="text"
                    value={speakerRole}
                    onChange={(e) => setSpeakerRole(e.target.value)}
                    placeholder="e.g. Chaplain"
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E4E4E7] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-[#18181B] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#5B0617] text-white font-bold hover:bg-[#480512] transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
