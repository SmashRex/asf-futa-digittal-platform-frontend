/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Smartphone, Monitor, Eye, Sparkles } from 'lucide-react';

interface MobilePreviewFrameProps {
  children: React.ReactNode;
  title?: string;
  category?: string;
}

export const MobilePreviewFrame: React.FC<MobilePreviewFrameProps> = ({
  children,
  title = 'Content Preview',
  category = 'Member Experience'
}) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  return (
    <div className="flex flex-col w-full items-center">
      
      {/* Top Banner & Mode Toggle */}
      <div className="w-full bg-[#5B0617] text-white p-3 px-4 sm:px-6 rounded-2xl mb-6 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white/10 text-amber-300">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                MEMBER PREVIEW
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-white/20 text-white rounded font-medium">
                LIVE MIRROR
              </span>
            </div>
            <p className="text-xs text-white/80 font-medium">
              "THIS IS WHAT THE MEMBER WILL SEE"
            </p>
          </div>
        </div>

        {/* Device Switcher Controls */}
        <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/10 text-xs font-medium">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'mobile'
                ? 'bg-white text-[#5B0617] font-bold shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Phone</span>
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'desktop'
                ? 'bg-white text-[#5B0617] font-bold shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Layout</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      {viewMode === 'mobile' ? (
        <div className="relative w-full max-w-[390px] mx-auto transition-all">
          
          {/* Simulated Mobile Device Frame */}
          <div className="bg-[#18181B] rounded-[44px] p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border-4 border-[#27272A]">
            
            {/* Notch / Speaker bar */}
            <div className="w-28 h-4 bg-[#09090B] rounded-full mx-auto mb-3 flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#18181B]" />
              <span className="w-10 h-1 bg-[#27272A] rounded-full" />
            </div>

            {/* Inner Mobile Screen Canvas */}
            <div className="bg-[#FDFBF9] text-[#18181B] rounded-[32px] overflow-hidden min-h-[680px] max-h-[750px] overflow-y-auto border border-[#E4E4E7] shadow-inner select-none p-4 sm:p-5">
              {children}
            </div>

            {/* Home Indicator bar */}
            <div className="w-32 h-1 bg-stone-600 rounded-full mx-auto mt-3 opacity-60" />
          </div>

          <p className="text-center text-xs text-[#52525B] mt-3 font-medium">
            Simulating 390px Mobile Viewport (iPhone / Android)
          </p>
        </div>
      ) : (
        <div className="w-full bg-[#FDFBF9] rounded-2xl border border-[#E4E4E7] p-6 sm:p-8 shadow-sm">
          {children}
        </div>
      )}

    </div>
  );
};
