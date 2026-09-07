/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Notification } from '../types';
import { mockNotifications } from '../data/mockData';
import EmptyState from '../components/EmptyState';
import { 
  CheckCheck, 
  Trash2, 
  Info, 
  Flame, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Megaphone,
  BellRing
} from 'lucide-react';

interface NotificationsProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onToggleRead: (id: string) => void;
}

export default function Notifications({ 
  notifications, 
  onMarkAllAsRead, 
  onClearAll, 
  onToggleRead 
}: NotificationsProps) {
  const [toastMessage, setToastMessage] = useState('');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Bible Study': return <BookOpen className="w-4 h-4" />;
      case 'FS': return <GraduationCap className="w-4 h-4" />;
      case 'Meeting': return <Info className="w-4 h-4" />;
      case 'Special Program': return <Calendar className="w-4 h-4" />;
      default: return <Megaphone className="w-4 h-4" />;
    }
  };

  const handleMarkReadClick = () => {
    onMarkAllAsRead();
    setToastMessage('All notifications marked as read.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleClearClick = () => {
    onClearAll();
    setToastMessage('Notifications cleared successfully.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="flex-1 p-5 max-w-lg mx-auto w-full space-y-6 select-none" id="notifications-screen">
      
      {/* Title with action triggers */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Notifications</h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Stay updated with official fellowship updates</p>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex gap-1">
            <button
              onClick={handleMarkReadClick}
              className="p-2 rounded-full hover:bg-[var(--color-primary-tint)] text-[var(--color-primary)] transition-colors"
              title="Mark all as read"
              id="notif-mark-read-btn"
            >
              <CheckCheck className="w-5 h-5" />
            </button>
            <button
              onClick={handleClearClick}
              className="p-2 rounded-full hover:bg-red-50 text-[var(--color-error)] transition-colors"
              title="Clear all"
              id="notif-clear-btn"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Notifications List or Empty State */}
      {notifications.length === 0 ? (
        <EmptyState
          iconName="BellRing"
          title="You're all caught up"
          description="There are no active notifications. When official announcements or schedules are released, they will appear here instantly."
        />
      ) : (
        <div className="space-y-4.5" id="notifications-list-container">
          {notifications.map((notif) => {
            const isUrgent = notif.priority === 'Urgent';
            const isImportant = notif.priority === 'Important';
            
            return (
              <div
                key={notif.id}
                onClick={() => onToggleRead(notif.id)}
                className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                  notif.read 
                    ? 'bg-white border-[var(--color-border)] opacity-75' 
                    : 'bg-white border-[var(--color-primary)]/10 shadow-sm ring-1 ring-[var(--color-primary)]/5'
                } ${isUrgent ? 'border-red-200 bg-red-50/20' : ''}`}
                id={`notification-item-${notif.id}`}
              >
                {/* Left accent color indicator for unread notifications */}
                {!notif.read && (
                  <span className="absolute top-0 bottom-0 left-0 w-1 bg-[var(--color-primary)] rounded-l-xl"></span>
                )}

                {/* Meta Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {/* Category Label */}
                    <span className="bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                      {getCategoryIcon(notif.category)}
                      <span>{notif.category}</span>
                    </span>

                    {/* Priority Indicator */}
                    {isUrgent && (
                      <span className="bg-red-100 text-[var(--color-error)] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Flame className="w-3 h-3" />
                        <span>URGENT</span>
                      </span>
                    )}
                    {isImportant && !isUrgent && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        IMPORTANT
                      </span>
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <span className="text-[10px] text-[var(--color-text-light)] font-medium">
                    {notif.timestamp}
                  </span>
                </div>

                {/* Content */}
                <h4 className={`text-sm text-[var(--color-text-primary)] leading-snug mb-1 ${
                  notif.read ? 'font-medium' : 'font-bold'
                }`}>
                  {notif.title}
                </h4>
                
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {notif.body}
                </p>

                {/* Toggle Status Tooltip hint on click */}
                <span className="text-[9px] text-[var(--color-text-light)] self-end mt-2 flex items-center gap-1 select-none">
                  <span>Click to mark as {notif.read ? 'unread' : 'read'}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Dynamic Toast popup notifier */}
      {toastMessage && (
        <div 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--color-text-primary)] text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-white/10 max-w-sm w-[90%] flex items-start gap-2 animate-bounce z-50 leading-relaxed"
          id="notif-toast-popup"
        >
          <div className="bg-white/10 p-1 rounded-full text-[var(--color-accent)] shrink-0">
            <CheckCheck className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
