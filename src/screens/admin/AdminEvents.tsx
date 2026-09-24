/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  RefreshCw, 
  Ban, 
  User, 
  X, 
  AlertCircle,
  Clock,
  Edit2
} from 'lucide-react';
import { EventItem, EventCategory, EventMode } from '../../types/event';
import { eventsService } from '../../services/events/events.service';
import { AdminContextType } from './AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { 
  formatEventDate, 
  formatEventTime, 
  getLagosDateInput, 
  getLagosTimeInput, 
  buildLagosIso 
} from '../../utils/eventDate';

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
  const [actionError, setActionError] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Fellowship');
  const [eventDate, setEventDate] = useState(() => getLagosDateInput());
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('19:00');
  const [location, setLocation] = useState('Fellowship Sanctuary, FUTA');
  const [mode, setMode] = useState<EventMode>('In-Person');
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [speakerRole, setSpeakerRole] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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
      setError(err?.message || 'Failed to load events.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents(activeFilter);
  }, [activeFilter]);

  const resetForm = () => {
    setTitle('');
    setCategory('Fellowship');
    setEventDate(getLagosDateInput());
    setStartTime('17:00');
    setEndTime('19:00');
    setLocation('Fellowship Sanctuary, FUTA');
    setMode('In-Person');
    setTheme('');
    setDescription('');
    setSpeaker('');
    setSpeakerRole('');
    setImageUrl('');
    setEditingEvent(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (ev: EventItem) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setCategory(ev.category);
    setLocation(ev.location || ev.venue || 'Fellowship Sanctuary, FUTA');
    setMode(ev.mode);
    setTheme(ev.theme || '');
    setDescription(ev.description || '');
    setSpeaker(ev.speaker || '');
    setSpeakerRole(ev.speakerRole || '');
    setImageUrl(ev.imageUrl || ev.image || '');

    // Parse existing start & end time strictly in Africa/Lagos
    if (ev.startTime) {
      setEventDate(getLagosDateInput(ev.startTime));
      setStartTime(getLagosTimeInput(ev.startTime));
    }
    if (ev.endTime) {
      setEndTime(getLagosTimeInput(ev.endTime));
    } else {
      setEndTime('');
    }

    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !eventDate || !startTime || !canManageEvents) return;

    setIsSubmitting(true);
    setActionError(null);

    try {
      // Build authoritative timezone-aware ISO string for Africa/Lagos (WAT, UTC+1)
      const startIso = buildLagosIso(eventDate, startTime);
      const endIso = endTime ? buildLagosIso(eventDate, endTime) : null;

      if (editingEvent) {
        // PUT /api/events/:id
        const updated = await eventsService.updateEvent(editingEvent.id, {
          title: title.trim(),
          category,
          location: location.trim(),
          startTime: startIso,
          endTime: endIso,
          mode,
          theme: theme.trim() || null,
          description: description.trim() || null,
          speaker: speaker.trim() || null,
          speakerRole: speakerRole.trim() || null,
          imageUrl: imageUrl.trim() || null,
        });

        setEvents(prev => prev.map(item => item.id === updated.id ? updated : item));
      } else {
        // POST /api/events
        const created = await eventsService.createEvent({
          title: title.trim(),
          location: location.trim(),
          startTime: startIso,
          endTime: endIso,
          category,
          mode,
          theme: theme.trim() || null,
          description: description.trim() || null,
          speaker: speaker.trim() || null,
          speakerRole: speakerRole.trim() || null,
          imageUrl: imageUrl.trim() || null,
        });

        setEvents(prev => [created, ...prev]);
      }

      setIsCreateModalOpen(false);
      resetForm();
    } catch (err: any) {
      setActionError(err?.message || 'Failed to save event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // PATCH /api/events/:id/cancel
  const handleCancelEvent = async (id: string) => {
    if (!canManageEvents) return;
    setActionError(null);
    try {
      await eventsService.cancelEvent(id);
      setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, status: 'Cancelled' } : ev));
    } catch (err: any) {
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
              Events & Semester Schedule
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#5B0617]/10 text-[#5B0617]">
              {events.length} Gatherings
            </span>
          </div>
          <p className="text-xs text-[#52525B] mt-1">
            Authoritative scheduling and management for ASF fellowship programs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadEvents(activeFilter)}
            disabled={isLoading}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#52525B] transition-colors"
            title="Refresh Events"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {canManageEvents && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#5B0617] text-white text-xs font-bold hover:bg-[#480512] transition-colors shadow-xs"
              id="admin-create-event-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Role Notice */}
      {isPresident && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>President role has review-only oversight. Modification rights belong to Publicity and General Secretary.</span>
        </div>
      )}

      {/* Action Error Banner */}
      {actionError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-rose-600 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filtering Horizon Bar */}
      <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === 'upcoming' 
                ? 'bg-[#5B0617] text-white' 
                : 'text-[#52525B] hover:bg-stone-100'
            }`}
          >
            Upcoming Gatherings
          </button>
          <button
            onClick={() => setActiveFilter('past')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === 'past' 
                ? 'bg-[#5B0617] text-white' 
                : 'text-[#52525B] hover:bg-stone-100'
            }`}
          >
            Past Gatherings
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === 'all' 
                ? 'bg-[#5B0617] text-white' 
                : 'text-[#52525B] hover:bg-stone-100'
            }`}
          >
            All Gatherings
          </button>
        </div>

        <span className="text-[11px] text-[#52525B]">
          Timezone: Africa/Lagos (WAT)
        </span>
      </div>

      {/* Events Grid / List */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-[#52525B]">
          Loading fellowship gatherings...
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center">
          {error}
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#E4E4E7] space-y-2">
          <Calendar className="w-8 h-8 text-[#52525B] mx-auto" />
          <h3 className="font-serif font-bold text-sm text-[#18181B]">
            {activeFilter === 'past' ? 'No past events to show yet.' : 'No upcoming events have been published yet.'}
          </h3>
          <p className="text-xs text-[#52525B] max-w-sm mx-auto">
            {canManageEvents ? 'Click "Create Event" above to schedule a new fellowship gathering.' : 'Check back later for newly scheduled programs.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => {
            const isCancelled = ev.status === 'Cancelled';
            const displayDate = formatEventDate(ev.startTime, true);
            const displayTime = formatEventTime(ev.startTime, ev.endTime);
            const locationStr = ev.location || ev.venue || 'Fellowship Sanctuary, FUTA';

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
                    <StatusBadge status={ev.status} size="sm" />
                  </div>

                  <h3 className={`font-serif font-bold text-base leading-tight ${isCancelled ? 'line-through text-[#71717A]' : 'text-[#18181B]'}`}>
                    {ev.title}
                  </h3>

                  {ev.theme && (
                    <p className="text-[11px] font-medium text-[#5B0617] italic line-clamp-1">
                      Theme: "{ev.theme}"
                    </p>
                  )}

                  <div className="space-y-1.5 text-xs text-[#52525B] pt-2 border-t border-[#E4E4E7]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#5B0617] shrink-0" />
                      <span className="truncate">{displayDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#5B0617] shrink-0" />
                      <span className="truncate">{displayTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#805600] shrink-0" />
                      <span className="truncate">{locationStr} • <strong className="text-[#18181B]">{ev.mode}</strong></span>
                    </div>
                    {ev.speaker && (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span className="truncate">{ev.speaker} {ev.speakerRole ? `(${ev.speakerRole})` : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4E4E7] flex items-center justify-between">
                  <span className={`text-[11px] font-semibold ${isCancelled ? 'text-stone-500' : 'text-emerald-700'}`}>
                    {isCancelled ? 'Event Cancelled' : 'Active Calendar Event'}
                  </span>

                  <div className="flex items-center gap-1">
                    {canManageEvents && (
                      <button
                        onClick={() => openEditModal(ev)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-stone-700 hover:bg-stone-100 text-[11px] font-semibold transition-colors"
                        title="Edit Gathering"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}

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
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT EVENT MODAL */}
      {isCreateModalOpen && canManageEvents && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E4E4E7] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#18181B]">
                {editingEvent ? 'Edit Fellowship Gathering' : 'Schedule Fellowship Gathering'}
              </h3>
              <button 
                onClick={() => { setIsCreateModalOpen(false); resetForm(); }} 
                className="p-1 rounded-lg text-[#52525B] hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#18181B]">Gathering Title *</label>
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
                  <label className="font-semibold text-[#18181B]">Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#18181B]">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#18181B]">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#18181B]">Location / Venue *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Fellowship Sanctuary, FUTA South Gate"
                  className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#18181B]">Theme</label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Standing Firm in Grace"
                  className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#18181B]">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of the program, expectations, and instructions..."
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
                    placeholder="e.g. Pastor Sarah Jenkins"
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#18181B]">Speaker Role / Title</label>
                  <input
                    type="text"
                    value={speakerRole}
                    onChange={(e) => setSpeakerRole(e.target.value)}
                    placeholder="e.g. Visiting Chaplain"
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#18181B]">Header Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                />
              </div>

              <div className="pt-3 border-t border-[#E4E4E7] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsCreateModalOpen(false); resetForm(); }}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-[#18181B] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#5B0617] text-white font-bold hover:bg-[#480512] transition-colors cursor-pointer"
                >
                  {isSubmitting ? (editingEvent ? 'Updating...' : 'Creating...') : (editingEvent ? 'Update Gathering' : 'Schedule Gathering')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
