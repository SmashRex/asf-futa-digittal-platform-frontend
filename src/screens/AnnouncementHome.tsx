/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Search, WifiOff, Inbox, Filter, ShieldCheck, X } from 'lucide-react';
import { Announcement } from '../types';
import { announcementsService } from '../services/announcements/announcements.service';
import AnnouncementCard from '../components/AnnouncementCard';
import AnnouncementEmpty from '../components/AnnouncementEmpty';
import AnnouncementOffline from '../components/AnnouncementOffline';
import { useDevState } from '../dev/simulations/devState';
import { LoadingState } from '../components/common/LoadingState';

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
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch announcements
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    announcementsService.getAnnouncements({
      category: selectedCategory === 'Urgent' ? 'All' : selectedCategory,
      searchQuery: searchQuery,
      isOfflineSimulated: isOffline
    })
      .then((data) => {
        if (!isMounted) return;
        if (isEmptyState) {
          setAnnouncements([]);
        } else {
          setAnnouncements(data);
        }
      })
      .catch((err) => {
        console.warn('[AnnouncementHome] Error loading announcements:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery, isOffline, isEmptyState]);

  // Map dataset with read status overlay and urgent filter
  const announcementList: Announcement[] = useMemo(() => {
    let list = announcements.map(item => ({
      ...item,
      isRead: readAnnouncementIds.includes(item.id)
    }));

    if (selectedCategory === 'Urgent') {
      list = list.filter(item => item.priority === 'Urgent' || item.isUrgent);
    }

    return list;
  }, [announcements, readAnnouncementIds, selectedCategory]);

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
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-[var(--color-text-primary)]">
                  Fellowship Notices
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Official</span>
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Publicity & Media Committee • Anglican Students' Fellowship FUTA
              </p>
            </div>
          </div>

          {/* Unread Counter Badge */}
          {unreadCount > 0 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--color-primary)] text-white shadow-2xs shrink-0">
              {unreadCount} Unread
            </span>
          )}
        </div>
      </div>

      {/* Search and Category Filters Bar */}
      <div className="my-5 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--color-text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcements, tags, speakers..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs sm:text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all shadow-2xs"
            id="announcement-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Stream */}
      {isLoading ? (
        <LoadingState message="Loading fellowship announcements..." />
      ) : announcementList.length === 0 ? (
        <AnnouncementEmpty
          onResetFilter={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      ) : (
        <div className="space-y-4" id="announcements-feed-container">
          {announcementList.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      )}

    </div>
  );
}
