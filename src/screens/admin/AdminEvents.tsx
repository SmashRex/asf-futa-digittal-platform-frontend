/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Clock, 
  User, 
  FileEdit, 
  Trash2, 
  Sparkles, 
  X,
  CheckCircle2
} from 'lucide-react';

interface EventItemMock {
  id: string;
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  speaker: string;
  speakerRole: string;
  mode: 'In-Person' | 'Online / Zoom' | 'Hybrid';
  status: 'Published' | 'Draft';
}

const INITIAL_ADMIN_EVENTS: EventItemMock[] = [
  {
    id: 'ev-1',
    title: 'Special Joint Service & Praise Night',
    category: 'Special Program',
    date: 'Mar 15, 2026',
    startTime: '5:00 PM',
    endTime: '8:30 PM',
    venue: 'ASF Fellowship Hall, FUTA',
    speaker: 'Venerable Dr. J. A. Adediran',
    speakerRole: 'Chaplain & Diocesan Missioner',
    mode: 'Hybrid',
    status: 'Published'
  },
  {
    id: 'ev-2',
    title: 'Semester Spiritual Revival & Prayer Retreat',
    category: 'Prayer',
    date: 'Feb 20, 2026',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    venue: 'Prayer Mountain, Akure',
    speaker: 'Pastor Timothy Folorunsho',
    speakerRole: 'Guest Revivalist',
    mode: 'In-Person',
    status: 'Published'
  },
  {
    id: 'ev-3',
    title: 'Bible Study Leader Workshop',
    category: 'Bible Study',
    date: 'Apr 02, 2026',
    startTime: '4:00 PM',
    endTime: '6:00 PM',
    venue: 'Chapel Vestry',
    speaker: 'Brother Samuel Adebayo',
    speakerRole: 'Bible Study Coordinator',
    mode: 'In-Person',
    status: 'Draft'
  }
];

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItemMock[]>(INITIAL_ADMIN_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past' | 'Drafts'>('Upcoming');

  // New Event Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Special Program');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('5:00 PM');
  const [endTime, setEndTime] = useState('7:00 PM');
  const [venue, setVenue] = useState('ASF Fellowship Hall, FUTA');
  const [speaker, setSpeaker] = useState('');
  const [speakerRole, setSpeakerRole] = useState('');
  const [mode, setMode] = useState<'In-Person' | 'Online / Zoom' | 'Hybrid'>('Hybrid');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEv: EventItemMock = {
      id: `ev-${Date.now()}`,
      title,
      category,
      date: date || 'Upcoming 2026',
      startTime,
      endTime,
      venue,
      speaker: speaker || 'Fellowship Excos',
      speakerRole: speakerRole || 'Ministers',
      mode,
      status: 'Published'
    };

    setEvents([newEv, ...events]);
    setIsModalOpen(false);
    setTitle('');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6" id="admin-events-screen">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Events & Calendar Management
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-0.5">
            Schedule fellowship services, joint revival nights, and retreat programs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => (
          <div key={ev.id} className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B0617] bg-[#5B0617]/10 px-2 py-0.5 rounded">
                  {ev.category}
                </span>
                <StatusBadge status={ev.status} size="sm" />
              </div>

              <h3 className="font-serif font-bold text-base text-[#18181B] leading-tight">
                {ev.title}
              </h3>

              <div className="space-y-1.5 text-xs text-[#52525B] pt-2 border-t border-[#E4E4E7]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#5B0617]" />
                  <span>{ev.date} ({ev.startTime} - {ev.endTime})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#805600]" />
                  <span>{ev.venue} • <strong className="text-[#18181B]">{ev.mode}</strong></span>
                </div>
                {ev.speaker && (
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-blue-700" />
                    <span>{ev.speaker} ({ev.speakerRole})</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E4E4E7] flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-semibold">Active Calendar Event</span>
              <button
                onClick={() => handleDeleteEvent(ev.id)}
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove Event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E4E4E7] shadow-2xl p-6 space-y-4">
            
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
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  >
                    <option value="Special Program">Special Program</option>
                    <option value="Worship">Worship Service</option>
                    <option value="Bible Study">Bible Study</option>
                    <option value="Prayer">Prayer Meeting</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#18181B]">Attendance Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7]"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Online / Zoom">Online / Zoom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-[#18181B]">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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
                  className="px-4 py-2 rounded-xl bg-stone-100 text-[#18181B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5B0617] text-white font-bold"
                >
                  Publish Event
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
