/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, ArrowRight, Users, Lock, WifiOff } from 'lucide-react';
import { useDevState } from '../dev/simulations/devState';
import { OfflineBanner } from '../components/common/OfflineBanner';

interface FSHomeProps {
  isOfflineSimulated?: boolean;
  isRestrictedSimulated?: boolean;
  onToggleOffline?: () => void;
  onToggleRestricted?: () => void;
}

export const FSHome: React.FC<FSHomeProps> = ({
  isOfflineSimulated: externalOffline,
  isRestrictedSimulated: externalRestricted,
}) => {
  const navigate = useNavigate();
  const devState = useDevState();

  const isOffline = externalOffline ?? devState.isOfflineSimulated;
  const isRestricted = externalRestricted ?? devState.isRestrictedSimulated;

  const handleViewMaterials = () => {
    if (isRestricted) {
      navigate('/fs/restricted');
    } else {
      navigate('/fs/materials');
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-[1140px] mx-auto px-4 md:px-8 pt-4 pb-8 md:pb-12 space-y-8 select-none" id="fs-home-screen">
      {/* Offline Alert Banner */}
      {isOffline && (
        <OfflineBanner message="Offline Mode Active: Showing downloaded Foundational School materials." />
      )}

      {/* Welcome Banner Section */}
      <section className="text-center md:text-left flex flex-col items-center md:items-start gap-3 mt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FEBE56]/20 text-[#805600] rounded-full border border-[#FEBE56]/40">
          <Sparkles className="w-4 h-4 text-[#805600]" />
          <span className="text-xs font-bold uppercase tracking-wider">WELCOME TO YOUR JOURNEY</span>
        </div>
        
        <h1 className="font-serif font-semibold text-2xl sm:text-3xl text-[#5B0617] tracking-tight">
          Foundational School
        </h1>
        
        <p className="text-sm md:text-base text-[#52525B] max-w-xl leading-relaxed">
          Nurturing spiritual growth, grounding in Christian doctrine, and equipping believers for effective ministry in ASF FUTA.
        </p>
      </section>

      {/* Overview & Quick Entry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FAF8F5] border border-[#E4E4E7] rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#5B0617]/10 text-[#5B0617] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-serif text-[#18181B]">Class Materials & Outlines</h2>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Access comprehensive study guides, foundational doctrines, memory verses, and homework assignments for all modules.
            </p>
          </div>

          <button
            onClick={handleViewMaterials}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <span>Explore Course Materials</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E4E4E7] rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#805600]/10 text-[#805600] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-serif text-[#18181B]">Student Portal & Registry</h2>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Check attendance records, class schedules, teacher assignments, and graduation eligibility status.
            </p>
          </div>

          <button
            onClick={() => navigate('/fs/restricted')}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-[#805600]" />
            <span>Check Access Status</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FSHome;
