/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mockFSMaterials } from '../data/fsData';
import { FSMaterialCard } from '../components/FSMaterialCard';
import { useDevState } from '../dev/simulations/devState';
import { OfflineBanner } from '../components/common/OfflineBanner';

interface FSMaterialsProps {
  isOfflineSimulated?: boolean;
  isRestrictedSimulated?: boolean;
  onToggleOffline?: () => void;
  onToggleRestricted?: () => void;
}

export const FSMaterials: React.FC<FSMaterialsProps> = ({
  isOfflineSimulated: externalOffline,
  isRestrictedSimulated: externalRestricted,
}) => {
  const navigate = useNavigate();
  const devState = useDevState();

  const isOffline = externalOffline ?? devState.isOfflineSimulated;
  const isRestricted = externalRestricted ?? devState.isRestrictedSimulated;

  const handleSelectMaterial = (materialId: string) => {
    const material = mockFSMaterials.find(m => m.id === materialId);
    if (!material) return;

    if (isRestricted || material.requiresRestrictedAuth) {
      navigate('/fs/restricted');
      return;
    }

    if (isOffline && !material.isAvailableOffline) {
      navigate('/fs/offline');
      return;
    }

    navigate(`/fs/materials/${materialId}`);
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-[1140px] mx-auto px-4 md:px-8 py-6 pb-8 md:pb-12 space-y-6 select-none" id="fs-materials-screen">
      {/* Offline Alert Banner */}
      {isOffline && (
        <OfflineBanner message="Offline Mode Active: Pre-bundled materials available offline." />
      )}

      {/* Top Header Bar with Back Button and Centered Title */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
        <button
          onClick={() => navigate('/fs')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FAF8F5] active:opacity-80 transition-colors text-[#5B0617]"
          aria-label="Back to Foundational School Home"
          id="fs-materials-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="font-semibold text-base sm:text-lg text-[#5B0617] font-serif">
          FS Materials
        </h1>

        <div className="w-10 h-10"></div>
      </div>

      {/* Intro Description */}
      <div className="max-w-2xl mx-auto text-center space-y-1 my-2">
        <p className="font-serif text-sm md:text-base text-[#52525B]">
          Authorized discipleship curriculum, study manuals, and spiritual guides for the academic session.
        </p>
      </div>

      {/* Course Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {mockFSMaterials.map((material) => (
          <FSMaterialCard
            key={material.id}
            material={material}
            onSelect={handleSelectMaterial}
          />
        ))}
      </div>
    </div>
  );
};

export default FSMaterials;
