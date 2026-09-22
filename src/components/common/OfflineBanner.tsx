/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineBannerProps {
  message?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  message = 'Offline Mode: Showing cached/pre-bundled content stored on device.'
}) => {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-xs text-amber-800 flex items-center justify-center gap-2 text-center font-medium">
      <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
