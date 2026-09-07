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
  const targetRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (targetVerse && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [targetVerse, verses]);

  const getTextColor = () => {
    if (theme === 'dark') return 'text-[#FAF8F5]';
    return 'text-[#18181B]';
  };

  return (
    <div 
      className={`font-serif leading-relaxed text-justify sm:text-left select-text space-y-3 ${className}`}
      style={{ fontSize: `${fontSize}px`, lineHeight: `${Math.round(fontSize * 1.65)}px` }}
      id="bible-verse-list-container"
    >
      {verses.map((v) => {
        const isTarget = targetVerse === v.number;
        return (
          <span 
            key={v.number} 
            ref={isTarget ? targetRef : undefined}
            onClick={() => onVerseClick && onVerseClick(v)}
            className={`inline group rounded transition-colors px-1 py-0.5 ${
              isTarget 
                ? 'bg-[#7A1F2B]/15 ring-2 ring-[#7A1F2B]/30 font-medium rounded-sm' 
                : 'hover:bg-[#7A1F2B]/5'
            }`}
            id={`verse-item-${v.number}`}
          >
            <sup className={`font-sans text-[0.65em] font-bold mr-1.5 select-none align-baseline ${
              isTarget ? 'text-[#7A1F2B] underline' : 'text-[#7A1F2B]'
            }`}>
              {v.number}
            </sup>
            <span className={getTextColor()}>
              {v.text}{' '}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export default BibleVerseList;
