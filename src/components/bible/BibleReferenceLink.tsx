/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ExternalLink } from 'lucide-react';
import { BibleReference } from '../../types';
import { buildBibleRoute, formatBibleReference, parseBibleReference } from '../../config/bible.config';

export interface BibleReferenceLinkProps {
  reference: string | BibleReference;
  variant?: 'inline' | 'badge' | 'button' | 'card';
  mode?: 'navigate' | 'overlay';
  onOverlayOpen?: (refString: string) => void;
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export const BibleReferenceLink: React.FC<BibleReferenceLinkProps> = ({
  reference,
  variant = 'inline',
  mode = 'navigate',
  onOverlayOpen,
  className = '',
  showIcon = false,
  children
}) => {
  const navigate = useNavigate();

  const parsedRef: BibleReference | null = typeof reference === 'string' 
    ? parseBibleReference(reference)
    : reference;

  const displayString = children || (
    typeof reference === 'string' 
      ? reference 
      : formatBibleReference(reference)
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const refString = typeof reference === 'string' 
      ? reference 
      : formatBibleReference(reference);

    if (mode === 'overlay' && onOverlayOpen) {
      onOverlayOpen(refString);
      return;
    }

    if (parsedRef) {
      const targetRoute = buildBibleRoute(parsedRef);
      navigate(targetRoute);
    } else if (typeof reference === 'string') {
      navigate(`/bible/search?q=${encodeURIComponent(reference)}`);
    } else {
      navigate('/bible');
    }
  };

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-primary-tint)] text-[var(--color-primary)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)] hover:text-white transition-all cursor-pointer shadow-2xs ${className}`}
        title={`Read ${displayString} in Holy Bible`}
      >
        {showIcon && <BookOpen className="w-3 h-3 shrink-0" />}
        <span>{displayString}</span>
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-tint)] transition-all shadow-xs ${className}`}
      >
        {showIcon && <BookOpen className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />}
        <span>{displayString}</span>
        <ExternalLink className="w-3 h-3 text-[var(--color-text-secondary)] opacity-70 shrink-0" />
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <div
        onClick={handleClick}
        className={`flex items-center justify-between p-3 rounded-xl bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xs transition-all cursor-pointer group ${className}`}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[var(--color-primary-tint)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
              {displayString}
            </p>
            <p className="text-[10px] text-[var(--color-text-secondary)]">Holy Bible Scripture Reference</p>
          </div>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors" />
      </div>
    );
  }

  // Default: 'inline'
  return (
    <span
      onClick={handleClick}
      className={`bible-reference inline-flex items-baseline gap-0.5 cursor-pointer font-semibold text-[var(--color-primary)] hover:underline decoration-1 underline-offset-2 ${className}`}
      role="link"
      tabIndex={0}
      title={`Open ${displayString} in Bible`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as any);
        }
      }}
    >
      {showIcon && <BookOpen className="w-3 h-3 inline self-center mr-0.5 text-[var(--color-primary)]" />}
      <span>{displayString}</span>
    </span>
  );
};

export default BibleReferenceLink;
