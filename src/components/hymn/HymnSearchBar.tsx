/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, X } from 'lucide-react';

interface HymnSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export default function HymnSearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search by number (e.g. 201), title, or lyric line...',
  autoFocus = false,
  className = '',
}: HymnSearchBarProps) {
  return (
    <div className={`relative ${className}`} id="hymn-search-bar-wrapper">
      <div className="hymn-search relative flex items-center">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--color-text-secondary)] pointer-events-none">
          <Search className="w-4 h-4 text-[var(--color-primary)]" />
        </span>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="hymn-search-input pl-10 pr-10 w-full"
          id="hymn-search-input"
        />

        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            aria-label="Clear hymn search"
            id="clear-hymn-search-btn"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
