/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  ExternalLink
} from 'lucide-react';
import { mockFSMaterials } from '../data/fsData';
import { FSMaterialCard } from '../components/FSMaterialCard';
import { useDevState } from '../dev/simulations/devState';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { fsService } from '../services/fs/fs.service';

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

  // Manual Download State
  const [isDownloading, setIsDownloading] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [manualSuccess, setManualSuccess] = useState<string | null>(null);

  const handleDownloadManual = async () => {
    setIsDownloading(true);
    setManualError(null);
    setManualSuccess(null);

    try {
      const blob = await fsService.getManualBlob();
      const url = URL.createObjectURL(blob);
      
      // Create temporary download anchor
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ASF-Foundational-School-Manual.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setManualSuccess('Official Foundational School manual opened/downloaded successfully.');
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setManualSuccess(null);
      }, 8000);
    } catch (err: any) {
      if (err.statusCode === 403 || err.code === 'MANUAL_ACCESS_DENIED') {
        setManualError('Access Denied: Only active Foundational School students and FS teachers are authorized to access the official manual.');
      } else if (err.statusCode === 404 || err.code === 'MANUAL_NOT_FOUND') {
        setManualError('No published manual found. Please check back when your coordinator uploads the session manual.');
      } else {
        setManualError(err.message || 'Unable to retrieve the Foundational School manual.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

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
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FAF8F5] active:opacity-80 transition-colors text-[#5B0617] cursor-pointer"
          aria-label="Back to Foundational School Home"
          id="fs-materials-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="font-semibold text-base sm:text-lg text-[#5B0617] font-serif">
          FS Materials & Curriculum
        </h1>

        <div className="w-10 h-10"></div>
      </div>

      {/* Official Manual Download / Stream Card */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id="fs-official-manual-card">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#5B0617]/10 flex items-center justify-center text-[#5B0617] shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B0617]">
                AUTHENTICATED ACCESS
              </span>
              <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                Active Enrollees & Teachers
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#18181B] mt-0.5">
              Official Foundational School Manual (PDF)
            </h2>
            <p className="text-xs text-[#52525B] mt-0.5 leading-relaxed">
              Download the complete, authoritative discipleship curriculum textbook published by the leadership.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isDownloading}
          onClick={handleDownloadManual}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 shrink-0 cursor-pointer"
          id="download-fs-manual-btn"
        >
          {isDownloading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Retrieving PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Manual (PDF)</span>
            </>
          )}
        </button>
      </div>

      {/* Status Messages for Manual Access */}
      {manualError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2.5 animate-in fade-in" id="fs-manual-error-banner">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Manual Access Notice</p>
            <p className="mt-0.5">{manualError}</p>
          </div>
        </div>
      )}

      {manualSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2.5 animate-in fade-in" id="fs-manual-success-banner">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{manualSuccess}</span>
        </div>
      )}

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
