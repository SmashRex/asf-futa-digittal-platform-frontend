/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HymnStanza } from '../../types';

interface HymnLyricsProps {
  stanzas: HymnStanza[];
  chorus?: string[];
  chorusPosition?: 'after-stanza-1' | 'after-each-stanza' | 'top';
  className?: string;
}

export default function HymnLyrics({
  stanzas,
  chorus,
  chorusPosition = 'after-stanza-1',
  className = '',
}: HymnLyricsProps) {
  if (!stanzas || stanzas.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-[var(--color-text-secondary)] italic">
        No lyrics recorded for this hymn.
      </div>
    );
  }

  const renderChorus = (keyPrefix: string) => {
    if (!chorus || chorus.length === 0) return null;
    return (
      <div 
        key={`${keyPrefix}-chorus`}
        className="hymn-chorus space-y-1.5 my-6 p-4 bg-[#FAF8F5] border-l-4 border-[var(--color-primary)] rounded-r-xl"
        id="hymn-chorus-block"
      >
        <span className="font-sans font-extrabold text-[11px] uppercase tracking-wider text-[var(--color-primary)] block not-italic mb-1.5">
          Refrain / Chorus
        </span>
        <div className="font-serif text-base sm:text-lg leading-relaxed text-[var(--color-text-primary)] space-y-1">
          {chorus.map((line, cIdx) => (
            <p key={cIdx} className="leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-8 pt-2 ${className}`} id="hymn-lyrics-body">
      {chorusPosition === 'top' && renderChorus('top')}

      {stanzas.map((stanza, sIdx) => (
        <React.Fragment key={stanza.number || sIdx + 1}>
          {/* Stanza Block */}
          <div className="hymn-stanza flex items-start gap-3 sm:gap-4" id={`hymn-stanza-${stanza.number}`}>
            <span className="hymn-stanza-number font-sans font-bold text-xs sm:text-sm text-[var(--color-primary)] bg-[var(--color-primary-tint)] px-2 py-0.5 rounded border border-[var(--color-primary)]/20 shrink-0 mt-1">
              {stanza.number}.
            </span>
            <div className="space-y-1 font-serif text-base sm:text-lg leading-relaxed text-[var(--color-text-primary)] flex-1">
              {stanza.lines.map((line, lIdx) => (
                <p key={lIdx} className="leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Refrain after stanza 1 or after each stanza */}
          {chorusPosition === 'after-stanza-1' && sIdx === 0 && renderChorus(`s-${sIdx}`)}
          {chorusPosition === 'after-each-stanza' && renderChorus(`s-${sIdx}`)}
        </React.Fragment>
      ))}
    </div>
  );
}
