/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, UserPlus } from 'lucide-react';
import { FSApplicationModal } from '../components/FSApplicationModal';

export const FSRestricted: React.FC = () => {
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 md:px-8 pt-12 pb-8 md:pb-12 w-full max-w-[1140px] mx-auto select-none min-h-[70vh]" id="fs-restricted-screen">
      <div className="flex flex-col items-center text-center max-w-[500px] bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-12 shadow-[0px_4px_20px_rgba(122,31,43,0.04)] space-y-6">
        
        {/* Warm Lock Icon Container */}
        <div className="w-20 h-20 rounded-full bg-[#FAF8F5] border border-[#E4E4E7] flex items-center justify-center shrink-0">
          <Lock className="w-10 h-10 text-[#5B0617]" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#18181B]">
            Access Restricted
          </h2>
          <p className="font-serif text-sm text-[#52525B] leading-relaxed">
            Foundational School materials are reserved for authorized students. If you are not yet enrolled, you can submit your admission application below.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="bg-[#5B0617] hover:bg-[#7A1F2B] text-white font-bold text-xs uppercase tracking-wider h-11 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center w-full shadow-xs gap-2"
            id="fs-restricted-apply-btn"
          >
            <UserPlus className="w-4 h-4" />
            <span>Apply for Admission</span>
          </button>

          <button
            onClick={() => navigate('/fs')}
            className="border border-[#E4E4E7] bg-[#FAF8F5] hover:bg-white text-[#18181B] font-bold text-xs uppercase tracking-wider h-11 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center w-full gap-2"
            id="restricted-return-home-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to FS Home</span>
          </button>
        </div>
      </div>

      {/* Student Application Modal */}
      <FSApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};

export default FSRestricted;
