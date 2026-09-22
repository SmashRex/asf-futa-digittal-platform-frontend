/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { BibleVerseDetail } from '../../types';

export interface BibleVerseListProps {
  verses: BibleVerseDetail[];
  targetVerse?: number;
  highlightedVerses?: number[];
  fontSize?: number;
  theme?: 'white' | 'cream' | 'dark';
  onVerseClick?: (verse: BibleVerseDetail) => void;
  className?: string;
}

export const BibleVerseList: React.FC<BibleVerseListProps> = ({
  verses = [],
  targetVerse,
  highlightedVerses = [],
  fontSize = 18,
  theme = 'cream',
  onVerseClick,
  className = ''
}) => {
  const targetRef = useRef<HTMLSpanElement | null>(null);

  // Smooth scroll to target verse when present or updated
  useEffect(() => {
    if (targetVerse && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [targetVerse, verses]);

  const getTextColor = () => {
    if (theme === 'dark') return 'text-[#FAF8F5]';
    return 'text-[#18181B]';
  };

  const getVerseNumberColor = (isTarget: boolean, isHighlighted: boolean) => {
    if (theme === 'dark') {
      if (isTarget) return 'text-[#F59E0B]';
      if (isHighlighted) return 'text-amber-300 font-bold';
      return 'text-amber-400/90';
    }
    if (isTarget) return 'text-[#5B0617]';
    if (isHighlighted) return 'text-[#7A1F2B] font-bold';
    return 'text-[#7A1F2B]';
  };

  const getVerseHighlightClass = (isTarget: boolean, isHighlighted: boolean) => {
    if (isTarget) {
      if (theme === 'dark') {
        return 'bg-[#7A1F2B]/50 text-[#FAF8F5] px-1 py-0.5 rounded-sm ring-1 ring-[#F59E0B]/60 font-medium transition-all duration-300';
      }
      return 'bg-[#FBE8EA] text-[#18181B] px-1 py-0.5 rounded-sm ring-1 ring-[#7A1F2B]/30 font-medium transition-all duration-300';
    }
    if (isHighlighted) {
      if (theme === 'dark') {
        return 'bg-amber-500/20 text-[#FAF8F5] px-1 py-0.5 rounded-sm ring-1 ring-amber-400/40 transition-all duration-300';
      }
      return 'bg-amber-100/90 text-[#18181B] px-1 py-0.5 rounded-sm ring-1 ring-amber-300 transition-all duration-300';
    }
    return 'hover:bg-black/[0.04] dark:hover:bg-white/[0.05] rounded-xs';
  };

  // Optical line-height proportional to font size for scripture flow
  const lineHeight = Math.round(fontSize * 1.75);

  return (
    <div 
      className={`font-serif select-text leading-relaxed ${className}`}
      style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }}
      id="bible-verse-list-container"
    >
      {/* Continuous scripture text stream: verses flow as seamless prose */}
      <p className={`${getTextColor()} text-left`}>
        {verses.map((v) => {
          const isTarget = targetVerse === v.number;
          const isHighlighted = highlightedVerses.includes(v.number);
          return (
            <span 
              key={v.number} 
              ref={isTarget ? targetRef : undefined}
              onClick={() => onVerseClick && onVerseClick(v)}
              className={`inline transition-colors duration-150 ${getVerseHighlightClass(isTarget, isHighlighted)} ${
                onVerseClick ? 'cursor-pointer' : ''
              }`}
              id={`verse-item-${v.number}`}
            >
              <sup 
                className={`font-sans font-bold text-[0.7em] tracking-tight mr-1 select-none align-super leading-none ${getVerseNumberColor(isTarget, isHighlighted)}`}
                aria-label={`Verse ${v.number}`}
              >
                {v.number}
              </sup>
              <span>{v.text}</span>
              {' '}
            </span>
          );
        })}
      </p>
    </div>
  );
};

export default BibleVerseList;
