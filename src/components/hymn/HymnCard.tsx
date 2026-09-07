/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bookmark, ChevronRight, WifiOff, Sparkles } from 'lucide-react';
import { HymnItem } from '../../types';

interface HymnCardProps {
  key?: React.Key;
  hymn: HymnItem;
  onClick: (hymn: HymnItem) => void;
  isBookmarked?: boolean;
  isOfflineSimulated?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export default function HymnCard({
  hymn,
  onClick,
  isBookmarked = false,
  isOfflineSimulated = false,
  variant = 'default',
  className = '',
}: HymnCardProps) {
  const isUnavailableOffline = isOfflineSimulated && !hymn.isPrebundledOffline;
  const firstLine = hymn.stanzas && hymn.stanzas.length > 0 && hymn.stanzas[0].lines.length > 0 
    ? hymn.stanzas[0].lines[0] 
    : '';

  if (variant === 'featured') {
    return (
      <div
        onClick={() => onClick(hymn)}
        className={`bg-surface rounded-xl border border-[var(--color-border)] p-5 relative overflow-hidden shadow-2xs hover:shadow-xs transition-all cursor-pointer group ${className}`}
        id={`featured-hymn-card-${hymn.id}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary-tint)] px-2.5 py-1 rounded-full border border-[var(--color-primary)]/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>TODAY'S HYMN</span>
            </span>
            {hymn.category && (
              <span className="text-[10px] font-medium text-[var(--color-text-secondary)] hidden sm:inline">
                • {hymn.category}
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-[var(--color-text-secondary)]">
            SOP {hymn.number}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
            {hymn.title}
          </h3>
          {firstLine && (
            <p className="text-xs text-[var(--color-text-secondary)] italic font-serif line-clamp-1">
              "{firstLine}"
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={() => onClick(hymn)}
        className={`bg-surface border border-[var(--color-border)] rounded-xl p-3 hover:border-[var(--color-primary)] hover:shadow-2xs transition-all cursor-pointer group flex items-center gap-3 ${
          isUnavailableOffline ? 'opacity-70 bg-gray-50' : ''
        } ${className}`}
        id={`compact-hymn-card-${hymn.id}`}
      >
        <div className="w-9 h-9 rounded-lg bg-[var(--color-primary-tint)] text-[var(--color-primary)] flex items-center justify-center font-bold text-xs shrink-0 border border-[var(--color-primary)]/20 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
          {hymn.number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-primary)] transition-colors">
              {hymn.title}
            </h4>
            {isBookmarked && (
              <Bookmark className="w-3.5 h-3.5 text-[var(--color-primary)] fill-current shrink-0 ml-1.5" />
            )}
          </div>
          {firstLine && (
            <p className="text-xs font-serif italic text-[var(--color-text-secondary)] truncate">
              "{firstLine}"
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default List Item Card
  return (
    <div
      onClick={() => onClick(hymn)}
      className={`hymn-card group ${isUnavailableOffline ? 'opacity-70 bg-gray-50' : ''} ${className}`}
      id={`hymn-card-${hymn.id}`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-full bg-[var(--color-primary-tint)] text-[var(--color-primary)] font-extrabold text-xs flex items-center justify-center shrink-0 border border-[var(--color-primary)]/20 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
          {hymn.number}
        </div>

        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-sm md:text-base text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors truncate">
              {hymn.title}
            </h3>
            {hymn.isTodayService && (
              <span className="text-[9px] font-extrabold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded uppercase shrink-0">
                Today
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            {firstLine && (
              <p className="font-serif italic truncate flex-1">
                "{firstLine}"
              </p>
            )}
            {hymn.category && (
              <span className="text-[10px] text-[var(--color-text-light)] shrink-0 hidden md:inline">
                {hymn.category}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        {isBookmarked && (
          <Bookmark className="w-4 h-4 text-[var(--color-primary)] fill-current" />
        )}
        {isUnavailableOffline && (
          <span title="Requires active connection">
            <WifiOff className="w-4 h-4 text-[var(--color-error)]" />
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-[var(--color-text-light)] group-hover:text-[var(--color-primary)] transition-colors" />
      </div>
    </div>
  );
}
