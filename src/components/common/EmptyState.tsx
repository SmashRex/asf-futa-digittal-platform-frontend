/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalendarX, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  resetText?: string;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are no items matching your filter or search criteria.',
  onReset,
  resetText = 'Reset Filters',
  icon = <CalendarX className="w-10 h-10 text-[var(--color-text-light)]" />,
}) => {
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && '$$typeof' in icon)) {
      const IconComp = icon as React.ComponentType<{ className?: string }>;
      return <IconComp className="w-10 h-10 text-[var(--color-text-light)]" />;
    }
    return <>{icon}</>;
  };

  return (
    <div className="card-surface p-8 sm:p-12 text-center flex flex-col items-center justify-center my-6">
      <div className="p-4 bg-[var(--color-bg-subtle)] rounded-full mb-4">
        {renderIcon()}
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-md mx-auto mb-6">
        {description}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="btn-secondary text-xs sm:text-sm inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{resetText}</span>
        </button>
      )}
    </div>
  );
};
