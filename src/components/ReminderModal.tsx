/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, BellOff, X, Check, Clock } from 'lucide-react';
import { ReminderOffset } from '../types';

interface ReminderModalProps {
  isOpen: boolean;
  eventTitle: string;
  currentOffset?: ReminderOffset;
  isReminded: boolean;
  onClose: () => void;
  onSaveReminder: (offset: ReminderOffset) => void;
  onRemoveReminder: () => void;
}

export default function ReminderModal({
  isOpen,
  eventTitle,
  currentOffset = '30m',
  isReminded,
  onClose,
  onSaveReminder,
  onRemoveReminder
}: ReminderModalProps) {
  const [selectedOffset, setSelectedOffset] = useState<ReminderOffset>(currentOffset);

  if (!isOpen) return null;

  const options: { id: ReminderOffset; label: string; desc: string }[] = [
    { id: '15m', label: '15 Minutes Before', desc: 'Quick alert right before gathering begins' },
    { id: '30m', label: '30 Minutes Before', desc: 'Recommended time to prepare & travel to venue' },
    { id: '1h', label: '1 Hour Before', desc: 'Generous notice for early campus shuttles' },
    { id: '1d', label: '1 Day Before', desc: 'Advance notification day prior' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none" id="reminder-modal-overlay">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity animate-fade-in"
        onClick={onClose}
        id="reminder-backdrop"
      ></div>

      {/* Dialog card */}
      <div 
        className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden z-10 animate-scale-up"
        id="reminder-modal-content"
      >
        {/* Header */}
        <div className="bg-[var(--color-primary)] text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20">
              <Bell className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif leading-tight">
                {isReminded ? 'Manage Reminder' : 'Set Event Reminder'}
              </h3>
              <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                {eventTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] -mr-2 -mt-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-medium">
            Select when you would like to receive your notification prior to the event start:
          </p>

          <div className="space-y-2">
            {options.map((opt) => {
              const isSelected = selectedOffset === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOffset(opt.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between active:scale-[0.99] ${
                    isSelected
                      ? 'bg-[var(--color-primary-tint)] border-[var(--color-primary)] shadow-2xs'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-background)]'
                  }`}
                  id={`reminder-option-${opt.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected 
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' 
                        : 'border-[var(--color-text-light)] bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>
                        {opt.label}
                      </div>
                      <div className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                  </div>

                  <Clock className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-light)]'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[var(--color-background)] border-t border-[var(--color-border)] flex items-center justify-between gap-3">
          {isReminded ? (
            <button
              onClick={onRemoveReminder}
              className="px-3 py-2 text-xs font-bold text-[var(--color-error)] hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              id="remove-reminder-btn"
            >
              <BellOff className="w-4 h-4" />
              <span>Turn Off</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-black/5 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={() => onSaveReminder(selectedOffset)}
              className="btn-primary py-2 px-4 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
              id="confirm-save-reminder-btn"
            >
              <Check className="w-4 h-4" />
              <span>Save Reminder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
