/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import { buildHymnRoute, parseHymnReference } from '../../config/hymns.config';

interface HymnReferenceLinkProps {
  hymnNumber?: number | string;
  hymnId?: string;
  reference?: string; // e.g. "SOP 201", "Hymn 45", "sop-3"
  title?: string;
  variant?: 'inline' | 'badge' | 'chip' | 'card';
  showIcon?: boolean;
  className?: string;
}

export default function HymnReferenceLink({
  hymnNumber,
  hymnId,
  reference,
  title,
  variant = 'badge',
  showIcon = true,
  className = '',
}: HymnReferenceLinkProps) {
  const navigate = useNavigate();

  // Determine target identifier
  let targetIdOrNum: string | number = hymnId || hymnNumber || '';
  let displayLabel = '';

  if (reference) {
    const parsed = parseHymnReference(reference);
    if (parsed) {
      targetIdOrNum = parsed.number;
      displayLabel = `SOP ${parsed.number}`;
    } else {
      displayLabel = reference;
      targetIdOrNum = reference;
    }
  } else if (hymnNumber !== undefined) {
    targetIdOrNum = hymnNumber;
    displayLabel = `SOP ${hymnNumber}`;
  } else if (hymnId) {
    targetIdOrNum = hymnId;
    const parsed = parseHymnReference(hymnId);
    displayLabel = parsed ? `SOP ${parsed.number}` : hymnId;
  }

  if (title) {
    displayLabel = displayLabel ? `${displayLabel} — ${title}` : title;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (targetIdOrNum) {
      navigate(buildHymnRoute(targetIdOrNum));
    }
  };

  if (variant === 'inline') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1 font-semibold text-[var(--color-primary)] hover:underline cursor-pointer ${className}`}
        title={`Open ${displayLabel}`}
      >
        {showIcon && <Music className="w-3.5 h-3.5 inline-block text-[var(--color-primary)] shrink-0" />}
        <span>{displayLabel}</span>
      </button>
    );
  }

  if (variant === 'chip') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-primary-tint)] text-[var(--color-primary)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-2xs active:scale-95 cursor-pointer ${className}`}
        title={`Open ${displayLabel}`}
      >
        {showIcon && <Music className="w-3 h-3 shrink-0" />}
        <span>{displayLabel}</span>
      </button>
    );
  }

  // Default 'badge' variant
  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-tint)] transition-all shadow-2xs active:scale-95 cursor-pointer ${className}`}
      title={`Open ${displayLabel}`}
    >
      {showIcon && <Music className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />}
      <span>{displayLabel}</span>
    </button>
  );
}
