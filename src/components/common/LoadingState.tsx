/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading content...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-[var(--color-text-secondary)]">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)] mb-3" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};
