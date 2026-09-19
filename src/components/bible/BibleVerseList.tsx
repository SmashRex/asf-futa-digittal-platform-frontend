/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { BibleVerseDetail } from '../../types';

export interface BibleVerseListProps {
  verses: BibleVerseDetail[];
  targetVerse?: number;
  fontSize?: number;
  theme?: 'white' | 'cream' | 'dark';
  onVerseClick?: (verse: BibleVerseDetail) => void;
  className?: string;
}

export const BibleVerseList: React.FC<BibleVerseListProps> = ({
  verses = [],
  targetVerse,
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

  const getVerseNumberColor = (isTarget: boolean) => {
    if (theme === 'dark') {
      return isTarget ? 'text-[#F59E0B]' : 'text-amber-400/90';
    }
    return isTarget ? 'text-[#5B0617]' : 'text-[#7A1F2B]';
  };

  const getTargetHighlightClass = () => {
    if (theme === 'dark') {
      return 'bg-[#7A1F2B]/40 text-[#FAF8F5] px-1 py-0.5 rounded-sm ring-1 ring-[#F59E0B]/60 font-medium transition-all duration-300';
    }
    return 'bg-[#FBE8EA] text-[#18181B] px-1 py-0.5 rounded-sm ring-1 ring-[#7A1F2B]/30 font-medium transition-all duration-300';
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
          return (
            <span 
              key={v.number} 
              ref={isTarget ? targetRef : undefined}
              onClick={() => onVerseClick && onVerseClick(v)}
              className={`inline transition-colors duration-150 ${
                isTarget 
                  ? getTargetHighlightClass()
                  : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.05] rounded-xs'
              } ${onVerseClick ? 'cursor-pointer' : ''}`}
              id={`verse-item-${v.number}`}
            >
              <sup 
                className={`font-sans font-bold text-[0.7em] tracking-tight mr-1 select-none align-super leading-none ${getVerseNumberColor(isTarget)}`}
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
