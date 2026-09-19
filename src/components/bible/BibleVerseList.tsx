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
  verses,
  targetVerse,
  fontSize = 18,
  theme = 'cream',
  onVerseClick,
  className = ''
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

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
      return isTarget ? 'text-[#F59E0B]' : 'text-[#A1A1AA] group-hover:text-[#F59E0B]';
    }
    return isTarget ? 'text-[#7A1F2B]' : 'text-[#71717A] group-hover:text-[#7A1F2B]';
  };

  const getTargetBg = () => {
    if (theme === 'dark') {
      return 'bg-amber-950/40 ring-1 ring-amber-500/40 font-medium rounded-lg';
    }
    return 'bg-amber-50/80 ring-1 ring-amber-300/80 font-medium rounded-lg';
  };

  return (
    <div 
      className={`font-serif select-text space-y-2.5 sm:space-y-3 ${className}`}
      id="bible-verse-list-container"
    >
      {verses.map((v) => {
        const isTarget = targetVerse === v.number;
        return (
          <div 
            key={v.number} 
            ref={isTarget ? targetRef : undefined}
            onClick={() => onVerseClick && onVerseClick(v)}
            className={`flex items-start gap-2.5 sm:gap-3.5 p-2 rounded-lg transition-all group ${
              isTarget 
                ? getTargetBg()
                : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
            }`}
            id={`verse-item-${v.number}`}
          >
            <span 
              className={`font-sans text-xs sm:text-sm font-bold min-w-[1.75rem] sm:min-w-[2rem] text-right shrink-0 select-none pt-0.5 transition-colors ${getVerseNumberColor(isTarget)}`}
              aria-label={`Verse ${v.number}`}
            >
              {v.number}
            </span>
            <p 
              className={`flex-1 text-left ${getTextColor()}`}
              style={{ fontSize: `${fontSize}px`, lineHeight: `${Math.round(fontSize * 1.68)}px` }}
            >
              {v.text}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default BibleVerseList;
