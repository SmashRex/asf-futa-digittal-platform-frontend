/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../config/app.config';
import { imageCacheService, CacheStats } from '../services/image/imageCache.service';
import { 
  ArrowLeft, 
  Wifi, 
  WifiOff, 
  RotateCw, 
  CheckCircle2, 
  BookOpen, 
  BookMarked, 
  Music, 
  GraduationCap, 
  HardDrive, 
  Trash2,
  Sparkles,
  RefreshCw,
  Zap,
  Image as ImageIcon
} from 'lucide-react';

interface OfflineSyncPageProps {
  isOfflineSimulated: boolean;
  onToggleOffline: () => void;
}

export default function OfflineSyncPage({ isOfflineSimulated, onToggleOffline }: OfflineSyncPageProps) {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [lastSynced, setLastSynced] = useState('Just now (Auto-synced)');
  const [toastMessage, setToastMessage] = useState('');
  const [imgCacheStats, setImgCacheStats] = useState<CacheStats>({ sizeInMb: 0, itemCount: 0 });

  // Load and sync cache stats
  const fetchCacheStats = async () => {
    const stats = await imageCacheService.getCacheStats();
    setImgCacheStats(stats);
  };

  useEffect(() => {
    fetchCacheStats();
  }, [isSyncing]);

  // Auto-sync seamlessly on page open when online
  useEffect(() => {
    if (!isOfflineSimulated && autoSyncEnabled) {
      const timer = setTimeout(() => {
        setLastSynced('Just now (Auto-synced)');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOfflineSimulated, autoSyncEnabled]);

  const offlineResources = [
    {
      id: 'kjv',
      title: 'King James Version (KJV)',
      subtitle: 'Complete Holy Bible (Prebundled & Auto-Cached)',
      size: '4.2 MB',
      icon: BookOpen,
      status: 'Auto-Synced'
    },
    {
      id: 'study',
      title: 'Current Bible Study Manual',
      subtitle: 'Q3 Outlines & Weekly Study Guides',
      size: '1.8 MB',
      icon: BookMarked,
      status: 'Auto-Synced'
    },
    {
      id: 'hymns',
      title: 'SOP Hymn Book',
      subtitle: 'Complete Fellowship Collection (Hymns 1-400)',
      size: '2.5 MB',
      icon: Music,
      status: 'Auto-Synced'
    },
    {
      id: 'fs',
      title: 'Foundational School Guide',
      subtitle: 'Modules 1 to 4 Lecture Notes & Scriptures',
      size: '3.1 MB',
      icon: GraduationCap,
      status: 'Auto-Synced'
    }
  ];

  const handleSyncNow = () => {
    if (isOfflineSimulated) {
      setToastMessage('Device is currently offline. Connect to internet or disable offline simulator to sync.');
      setTimeout(() => setToastMessage(''), 3500);
      return;
    }

    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced('Just now');
      setToastMessage('All spiritual resources synchronized and cached successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    }, 1200);
  };

  const handleClearCache = async () => {
    setIsSyncing(true);
    await imageCacheService.clearImageCache();
    await fetchCacheStats();
    setIsSyncing(false);
    setToastMessage('Temporary image cache and offline assets refreshed.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="flex-1 bg-[#FDFBF9] text-[#18181B] min-h-screen font-sans pb-16" id="offline-sync-screen">
      
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E4E4E7] h-14 px-4 flex items-center justify-between shadow-xs">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full text-[#7A1F2B] hover:bg-[#FAF8F5] transition-colors active:scale-95"
          aria-label="Go back"
          id="offline-sync-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-[#7A1F2B] tracking-tight">
          Offline & Sync Settings
        </h1>

        <div className="w-9"></div> {/* Spacer */}
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Automatic Sync Banner Card */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden" id="auto-sync-banner">
          <div className="absolute right-0 top-0 w-36 h-36 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/15 text-emerald-200">
                  <Zap className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Automatic Background Sync
                </h2>
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed max-w-md pt-1">
                Your spiritual materials (Holy Bible, Hymn Book, Study Manuals, and announcements) automatically download and stay cached for instant offline access.
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
        </div>

        {/* Sync Status Primary Card */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 space-y-4 shadow-xs" id="sync-status-card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#18181B]">
                  {isOfflineSimulated ? 'Offline Mode (Using Local Cache)' : 'Cloud Synchronized'}
                </h2>
                <p className="text-xs text-[#52525B]">{lastSynced}</p>
              </div>
            </div>

            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="px-3.5 py-1.5 bg-[#FAF8F5] hover:bg-[#7A1F2B] hover:text-white active:scale-95 text-[#7A1F2B] border border-[#E4E4E7] hover:border-[#7A1F2B] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              id="manual-refresh-sync-btn"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#E4E4E7] flex items-center justify-between text-xs text-[#52525B]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All 4 spiritual libraries ready offline
            </span>
            <span className="font-semibold text-[#18181B]">~11.6 MB</span>
          </div>
        </div>

        {/* Content Available Offline Section */}
        <div className="space-y-3" id="offline-resources-section">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] px-1">
              Content Available Offline
            </h3>
            <p className="text-[11px] text-[#52525B] px-1 mt-0.5">
              These resources are preloaded and synchronized automatically in the background.
            </p>
          </div>

          <div className="bg-white border border-[#E4E4E7] rounded-2xl divide-y divide-[#E4E4E7] overflow-hidden shadow-xs">
            {offlineResources.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-[#7A1F2B]">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#18181B]">{item.title}</h4>
                      <p className="text-[11px] text-[#52525B]">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#52525B] font-medium hidden sm:inline">{item.size}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{item.status}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Storage Management Options */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 space-y-4 shadow-xs" id="storage-management-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#18181B]">
              <HardDrive className="w-4 h-4 text-[#7A1F2B]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A1F2B]">Storage & Local Cache</h4>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              <ImageIcon className="w-3 h-3 text-amber-600" />
              <span>{imgCacheStats.itemCount} Cached Media {imgCacheStats.itemCount === 1 ? 'Asset' : 'Assets'}</span>
            </span>
          </div>

          <p className="text-xs text-[#52525B] leading-relaxed">
            All spiritual resources and media are saved safely on your device for uninterrupted offline fellowship, study sessions, and travel.
          </p>

          {imgCacheStats.itemCount > 0 && (
            <div className="p-3 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#7A1F2B] opacity-70" />
                <span className="text-xs font-medium text-[#18181B]">Offline Media Size</span>
              </div>
              <span className="text-xs font-bold text-[#7A1F2B]">{imgCacheStats.sizeInMb} MB</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleClearCache}
              disabled={isSyncing}
              className="px-3.5 py-2 bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#7A1F2B] hover:text-[#7A1F2B] text-xs font-semibold text-[#52525B] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              id="clear-cache-btn"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#7A1F2B]" />
              <span>{isSyncing ? 'Refreshing Cache...' : 'Refresh Local Cache'}</span>
            </button>
          </div>
        </div>

      </main>

      {/* Toast Popup */}
      {toastMessage && (
        <div 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#18181B] text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-white/10 max-w-sm w-[90%] flex items-center gap-2.5 z-50 leading-relaxed"
          id="offline-sync-toast"
        >
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
