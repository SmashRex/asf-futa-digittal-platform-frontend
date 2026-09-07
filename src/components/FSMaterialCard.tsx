/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileText, ChevronRight, CheckCircle2 } from 'lucide-react';
import { FSMaterial } from '../types';

interface FSMaterialCardProps {
  material: FSMaterial;
  onClick?: () => void;
  onSelect?: (materialId: string) => void;
}

export const FSMaterialCard: React.FC<FSMaterialCardProps> = ({ material, onClick, onSelect }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onSelect) {
      onSelect(material.id);
    }
  };

  return (
    <li className="group border-b border-[#E4E4E7] last:border-b-0 list-none">
      <button
        onClick={handleClick}
        className="w-full flex items-center p-4 hover:bg-[#FDFBF9] transition-colors active:bg-[#F4F2FD] text-left group"
        id={`fs-material-item-${material.id}`}
      >
        {/* Document Icon Box */}
        <div className="w-12 h-12 rounded-lg bg-[#FDFBF9] border border-[#E4E4E7] flex items-center justify-center text-[#5B0617] shrink-0 mr-4 group-hover:bg-[#5B0617] group-hover:text-white transition-colors">
          <FileText className="w-6 h-6" />
        </div>

        {/* Info */}
        <div className="flex-grow min-w-0 pr-2">
          <h2 className="font-semibold text-base text-[#18181B] truncate group-hover:text-[#5B0617] transition-colors">
            {material.title}
          </h2>
          {material.isAvailableOffline ? (
            <div className="flex items-center gap-1 mt-1 text-[#52525B]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#805600] shrink-0" />
              <span className="text-xs font-medium text-[#52525B]">Available Offline</span>
            </div>
          ) : (
            <div className="mt-1 text-xs text-[#52525B] truncate">
              {material.subtitle || 'Online Discipleship Module'}
            </div>
          )}
        </div>

        {/* Chevron Affordance */}
        <div className="shrink-0 text-[#564242] group-hover:text-[#5B0617] group-hover:translate-x-0.5 transition-all">
          <ChevronRight className="w-5 h-5" />
        </div>
      </button>
    </li>
  );
};

export default FSMaterialCard;
