/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';

interface EventsEmptyProps {
  onResetFilter?: () => void;
  resetButtonText?: string;
}

export default function EventsEmpty({ onResetFilter, resetButtonText }: EventsEmptyProps) {
  return (
    <div className="events-empty" id="events-empty-state">
      <div className="bg-[var(--color-primary-tint)] p-4 rounded-full mb-4 text-[var(--color-primary)] border border-amber-200/50">
        <Calendar className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 font-serif">
        No upcoming programs yet.
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-md mx-auto mb-6">
        Check back soon for the latest fellowship schedule and special event updates.
      </p>
      {onResetFilter && (
        <button
          onClick={onResetFilter}
          className="btn-primary inline-flex items-center gap-2"
          id="events-empty-reset-btn"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{resetButtonText || 'Clear Filters'}</span>
        </button>
      )}
    </div>
  );
}
