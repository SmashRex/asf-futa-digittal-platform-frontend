/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ChevronRight, AlertTriangle, Info, Paperclip, CheckCircle2 } from 'lucide-react';
import { Announcement } from '../types';

interface AnnouncementCardProps {
  key?: string;
  announcement: Announcement;
  onMarkAsRead?: (id: string) => void;
}

export default function AnnouncementCard({ announcement, onMarkAsRead }: AnnouncementCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onMarkAsRead && !announcement.isRead) {
      onMarkAsRead(announcement.id);
    }
    navigate(`/announcements/${announcement.id}`);
  };

  // Badge styling
  const getBadgeStyle = () => {
    if (announcement.priority === 'Urgent') {
      return 'announcement-badge-urgent';
    }
    if (announcement.priority === 'Important') {
      return 'announcement-badge-important';
    }
    return 'announcement-badge-normal';
  };

  return (
    <article 
      onClick={handleCardClick}
      className={`announcement-card group ${!announcement.isRead ? 'border-l-4 border-l-[var(--color-primary)]' : ''}`}
      id={`announcement-card-${announcement.id}`}
    >
      {/* Top Header: Badge & Read Dot */}
      <div className="announcement-card-header">
        <div className="flex items-center gap-2">
          <span className={`announcement-badge ${getBadgeStyle()}`}>
            {announcement.priority === 'Urgent' && <AlertTriangle className="w-3 h-3 shrink-0" />}
            {announcement.priority === 'Important' && <Info className="w-3 h-3 shrink-0" />}
            <span>{announcement.category}</span>
          </span>
          {announcement.attachmentName && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-text-secondary)] bg-[var(--color-background)] px-2 py-0.5 rounded-md border border-[var(--color-border)]">
              <Paperclip className="w-3 h-3" />
              <span>Attachment</span>
            </span>
          )}
        </div>

        {/* Read / Unread Indicator */}
        <div className="flex items-center gap-1.5">
          {!announcement.isRead ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary)] bg-[var(--color-primary-tint)] px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
              <span>New</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Read</span>
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="announcement-card-title group-hover:text-[var(--color-primary)] transition-colors">
        {announcement.title}
      </h3>

      {/* Excerpt */}
      <p className="announcement-card-excerpt line-clamp-2">
        {announcement.excerpt}
      </p>

      {/* Meta Footer */}
      <div className="announcement-card-meta">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 truncate max-w-[180px] sm:max-w-none">
            <User className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-light)]" />
            <span className="truncate">{announcement.author}</span>
          </span>
          <span className="text-[var(--color-border)]">•</span>
          <span className="flex items-center gap-1 shrink-0">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-light)]" />
            <span>{announcement.publishedAt}</span>
          </span>
        </div>

        <span className="flex items-center text-xs font-semibold text-[var(--color-primary)] group-hover:translate-x-0.5 transition-transform shrink-0">
          <span>Read</span>
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </span>
      </div>
    </article>
  );
}
