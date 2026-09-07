/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WifiOff, ArrowLeft } from 'lucide-react';

export const FSOffline: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 pt-12 pb-8 md:pb-12 w-full max-w-lg mx-auto text-center select-none min-h-[70vh]" id="fs-offline-screen">
      
      {/* Illustrative Icon Circle with warm pulsing accent */}
      <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#FAF8F5] border border-[#E4E4E7] mb-6 shadow-[0px_4px_20px_rgba(122,31,43,0.04)]">
        <div className="absolute inset-0 rounded-full bg-[#FEBE56]/20 animate-pulse"></div>
        <WifiOff className="w-16 h-16 text-[#805600] relative z-10" />
      </div>

      {/* Typography */}
      <h2 className="font-bold text-lg sm:text-xl text-[#18181B] mb-2 font-serif">
        Content not available offline
      </h2>

      <p className="text-sm md:text-base text-[#52525B] mb-8 max-w-sm leading-relaxed font-sans">
        You haven't downloaded this material yet. Please connect to the internet to sync this document for offline reading.
      </p>

      {/* Action Button */}
      <button
        onClick={() => navigate('/fs/materials')}
        className="group flex items-center justify-center gap-2 bg-[#5B0617] text-white font-bold text-xs uppercase tracking-wider h-12 px-8 rounded-full hover:bg-[#7A1F2B] transition-colors shadow-sm active:scale-95 duration-150"
        id="offline-back-to-materials-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Materials</span>
      </button>

    </div>
  );
};

export default FSOffline;
