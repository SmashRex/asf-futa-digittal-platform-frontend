/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import { HymnItem } from '../../types';

interface HymnHeaderProps {
  hymn: HymnItem;
  className?: string;
}

export default function HymnHeader({ hymn, className = '' }: HymnHeaderProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <div 
      className={`text-center mb-8 pb-6 border-b border-dashed border-[var(--color-border)] ${className}`}
      id="hymn-header-panel"
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="hymn-number inline-flex items-center gap-1">
          <span>HYMN {hymn.number}</span>
        </span>
        {hymn.isTodayService && (
          <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-700" />
            <span>Today's Service</span>
          </span>
        )}
      </div>

      <h1 className="hymn-title text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[var(--color-text-primary)] mt-2 mb-3">
        {hymn.title}
      </h1>

      <div className="text-xs text-[var(--color-text-secondary)] font-sans space-y-1 mt-3">
        <p className="font-bold text-[var(--color-primary)] tracking-wide">
          {hymn.category}
        </p>

        {hymn.author && (
          <p className="italic">
            Words: {hymn.author}
          </p>
        )}

        {(hymn.composer || hymn.meter || hymn.tune) && (
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-[var(--color-text-light)]">
            {hymn.composer && <span>Music: {hymn.composer}</span>}
            {hymn.tune && <span>Tune: {hymn.tune}</span>}
            {hymn.meter && <span>Meter: {hymn.meter}</span>}
            {hymn.keySignature && <span>Key: {hymn.keySignature}</span>}
          </div>
        )}
      </div>

      {/* Backend Audio Player Slot (Ready for backend audio integration) */}
      {hymn.audioUrl && (
        <div className="mt-4 flex items-center justify-center" id="hymn-audio-player-container">
          <audio 
            src={hymn.audioUrl} 
            controls 
            className="h-9 w-full max-w-sm rounded-lg"
            onPlay={() => setIsPlayingAudio(true)}
            onPause={() => setIsPlayingAudio(false)}
            onEnded={() => setIsPlayingAudio(false)}
          >
            Your browser does not support audio playback.
          </audio>
        </div>
      )}
    </div>
  );
}
