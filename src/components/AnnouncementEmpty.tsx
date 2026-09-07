/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Megaphone, RefreshCw } from 'lucide-react';

interface AnnouncementEmptyProps {
  onResetFilter?: () => void;
  resetButtonText?: string;
}

export default function AnnouncementEmpty({ onResetFilter, resetButtonText }: AnnouncementEmptyProps) {
  return (
    <div className="announcement-empty" id="announcement-empty-state">
      <div className="bg-[var(--color-primary-tint)] p-4 rounded-full mb-4 text-[var(--color-primary)] border border-amber-200/40">
        <Megaphone className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 font-serif">
        No announcements yet.
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-md mx-auto mb-6">
        Check back later for official notices from the fellowship.
      </p>
      {onResetFilter && (
        <button
          onClick={onResetFilter}
          className="btn-primary inline-flex items-center gap-2"
          id="announcement-empty-reset-btn"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{resetButtonText || 'View All Categories'}</span>
        </button>
      )}
    </div>
  );
}
