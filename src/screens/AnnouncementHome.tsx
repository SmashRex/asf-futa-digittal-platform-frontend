/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Search, Wifi, WifiOff, Inbox, Filter, ShieldCheck, X } from 'lucide-react';
import { Announcement, AnnouncementCategory } from '../types';
import { mockAnnouncements, searchAnnouncements } from '../data/announcementData';
import AnnouncementCard from '../components/AnnouncementCard';
import AnnouncementEmpty from '../components/AnnouncementEmpty';
import AnnouncementOffline from '../components/AnnouncementOffline';
import { useDevState } from '../dev/simulations/devState';

interface AnnouncementHomeProps {
  isOfflineSimulated: boolean;
  onToggleOffline: () => void;
  readAnnouncementIds: string[];
  onMarkAsRead: (id: string) => void;
}

export default function AnnouncementHome({
  isOfflineSimulated: propOffline,
  onToggleOffline,
  readAnnouncementIds,
  onMarkAsRead
}: AnnouncementHomeProps) {
  const navigate = useNavigate();
  const devState = useDevState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const isOffline = propOffline || devState.isOfflineSimulated;
  const isEmptyState = devState.isEmptyStateSimulated;

  // Categories list
  const categories: Array<{ id: string; label: string }> = [
    { id: 'All', label: 'All Notices' },
    { id: 'Urgent', label: 'Urgent & Important' },
    { id: 'Service', label: 'Services' },
    { id: 'Bible Study', label: 'Bible Study' },
    { id: 'Program', label: 'Programs' },
    { id: 'Administrative', label: 'Administrative' },
    { id: 'Fellowship', label: 'Fellowship' }
  ];

  // Map mock dataset with read status overlay
  const announcementList: Announcement[] = useMemo(() => {
    return mockAnnouncements.map(item => ({
      ...item,
      isRead: readAnnouncementIds.includes(item.id)
    }));
  }, [readAnnouncementIds]);

  // Filtered list calculation
  const filteredAnnouncements = useMemo(() => {
    if (isEmptyState) return [];

    let source = announcementList;

    // If offline simulated, only prebundled items are visible
    if (isOffline) {
      source = source.filter(item => item.isPrebundledOffline);
    }

    return searchAnnouncements(searchQuery, selectedCategory, source);
  }, [announcementList, searchQuery, selectedCategory, isOffline, isEmptyState]);

  const unreadCount = useMemo(() => {
    return announcementList.filter(a => !a.isRead).length;
  }, [announcementList]);

  return (
    <div className="announcements-page select-none" id="announcements-home-screen">
      
      {/* Offline Status Warning Callout when Simulated Offline */}
      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl mb-4 text-xs flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Offline Mode Active:</strong> Showing cached pre-bundled announcements.
            </span>
          </div>
          <button
            onClick={onToggleOffline}
            className="text-xs font-bold underline hover:text-amber-950 shrink-0 cursor-pointer"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Official Channel Header */}
      <div className="announcement-header bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl shadow-2xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--color-primary-tint)] p-3 rounded-2xl text-[var(--color-primary)] border border-amber-200/50">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)] font-serif">
                Official Announcements
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Anglican Students' Fellowship Publicity & Executive Desk
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <span className="bg-[var(--color-primary)] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 shadow-2xs">
              {unreadCount} Unread
            </span>
          )}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notices by title, keyword, or author..."
          className="w-full pl-10 pr-9 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-tint)] transition-all"
          id="announcement-search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-light)] hover:text-[var(--color-text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills Filter Bar */}
      <div className="announcement-filter-bar no-scrollbar" id="announcement-categories-bar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-background)]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Announcements List / Empty State / Offline State */}
      {isEmptyState ? (
        <AnnouncementEmpty />
      ) : isOffline && filteredAnnouncements.length === 0 ? (
        <AnnouncementOffline onRetry={onToggleOffline} />
      ) : filteredAnnouncements.length === 0 ? (
        <AnnouncementEmpty
          onResetFilter={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}
          resetButtonText="Clear Filters & Search"
        />
      ) : (
        <div className="announcement-list" id="announcement-feed-list">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] font-semibold px-1 mb-1">
            <span>
              Showing {filteredAnnouncements.length} {filteredAnnouncements.length === 1 ? 'Notice' : 'Notices'}
            </span>
            {selectedCategory !== 'All' && (
              <span className="text-[var(--color-primary)]">
                Filter: {selectedCategory}
              </span>
            )}
          </div>

          {filteredAnnouncements.map((ann) => (
            <AnnouncementCard
              key={ann.id}
              announcement={ann}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
