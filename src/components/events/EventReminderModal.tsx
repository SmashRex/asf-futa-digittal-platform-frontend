/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EventItem, ReminderOffset } from '../../types';
import { EVENTS_CONTENT } from '../../content/events-content';
import { Bell, Check, X, Clock } from 'lucide-react';
import { formatEventDateTime } from '../../utils/eventDate';

interface EventReminderModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  onSaveReminder: (offset: ReminderOffset) => void;
  onRemoveReminder: () => void;
  isReminded: boolean;
}

export const EventReminderModal: React.FC<EventReminderModalProps> = ({
  event,
  isOpen,
  onClose,
  onSaveReminder,
  onRemoveReminder,
  isReminded,
}) => {
  const [selectedOffset, setSelectedOffset] = useState<ReminderOffset>('30m');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="card-surface max-w-md w-full p-6 relative rounded-2xl shadow-xl border border-[var(--color-border)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary-tint)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
              {EVENTS_CONTENT.reminderModal.title}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {EVENTS_CONTENT.reminderModal.subtitle}
            </p>
          </div>
        </div>

        {/* Event Title Brief */}
        <div className="bg-[var(--color-bg-subtle)] p-3 rounded-lg mb-5 border border-[var(--color-border)]">
          <p className="text-xs font-semibold text-[var(--color-text-primary)] line-clamp-1">{event.title}</p>
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[var(--color-primary)]" />
            <span>{formatEventDateTime(event.startTime, event.endTime)}</span>
          </p>
        </div>

        {/* Offset Selector */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wider block">
            Select Lead Time
          </label>
          <div className="grid grid-cols-1 gap-2">
            {EVENTS_CONTENT.reminderModal.offsets.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedOffset(opt.id as ReminderOffset)}
                className={`p-3 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                  selectedOffset === opt.id
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-tint)] text-[var(--color-text-primary)] font-semibold'
                    : 'border-[var(--color-border)] hover:border-slate-300 text-[var(--color-text-secondary)]'
                }`}
              >
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)]">{opt.label}</p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] font-normal mt-0.5">{opt.desc}</p>
                </div>
                {selectedOffset === opt.id && (
                  <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isReminded && (
            <button
              type="button"
              onClick={onRemoveReminder}
              className="btn-secondary text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-200"
            >
              {EVENTS_CONTENT.reminderModal.cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={() => onSaveReminder(selectedOffset)}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{EVENTS_CONTENT.reminderModal.confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
