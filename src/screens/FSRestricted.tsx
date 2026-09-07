/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

export const FSRestricted: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 md:px-8 pt-12 pb-8 md:pb-12 w-full max-w-[1140px] mx-auto select-none min-h-[70vh]" id="fs-restricted-screen">
      <div className="flex flex-col items-center text-center max-w-[480px] bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-12 shadow-[0px_4px_20px_rgba(122,31,43,0.04)]">
        
        {/* Warm Lock Icon Container */}
        <div className="w-20 h-20 rounded-full bg-[#FAF8F5] border border-[#E4E4E7] flex items-center justify-center mb-6 shrink-0">
          <Lock className="w-10 h-10 text-[#5B0617]" />
        </div>

        {/* Content */}
        <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#18181B] mb-3">
          Access Restricted
        </h2>

        <p className="font-serif text-base text-[#52525B] leading-relaxed mb-8">
          Foundational School materials are reserved for authorized students. If you are part of a current FS cohort but cannot access this section, please contact your FS Teacher or the Vice President.
        </p>

        {/* Primary CTA */}
        <button
          onClick={() => navigate('/home')}
          className="bg-[#5B0617] hover:bg-[#7A1F2B] text-white font-bold text-xs uppercase tracking-wider h-12 px-8 rounded-full transition-all active:scale-95 flex items-center justify-center w-full md:w-auto shadow-sm gap-2"
          id="restricted-return-home-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </button>
      </div>
    </div>
  );
};

export default FSRestricted;
