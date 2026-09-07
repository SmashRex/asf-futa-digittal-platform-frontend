/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

interface EventsOfflineProps {
  onRetry?: () => void;
}

export default function EventsOffline({ onRetry }: EventsOfflineProps) {
  return (
    <div className="events-offline" id="events-offline-state">
      <div className="bg-red-100 p-4 rounded-full mb-3 text-red-700 shrink-0">
        <WifiOff className="w-10 h-10" />
      </div>

      <h3 className="text-xl font-bold text-red-900 mb-2 font-serif">
        Connectivity Unavailable
      </h3>

      <p className="text-sm text-red-800 leading-relaxed max-w-md mx-auto mb-4">
        Events and program schedules cannot currently be retrieved because network connectivity is unavailable.
      </p>

      {/* Offline Access Summary */}
      <div className="bg-white/80 p-3.5 rounded-xl border border-red-200 text-left text-xs text-red-950 space-y-2 mb-5 w-full max-w-md shadow-xs">
        <p className="font-bold flex items-center gap-1.5 text-red-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Offline Access Summary:</span>
        </p>
        <ul className="list-disc list-inside space-y-1 text-red-900/90 pl-1">
          <li>Prebundled fellowship event schedules remain accessible offline.</li>
          <li>Saved event reminders are locally stored in your browser.</li>
          <li>Connect to Wi-Fi or cellular data to fetch new calendar updates.</li>
        </ul>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-red-800 text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-red-900 transition-colors inline-flex items-center gap-2"
          id="events-offline-retry-btn"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reconnect & Refresh</span>
        </button>
      )}
    </div>
  );
}
