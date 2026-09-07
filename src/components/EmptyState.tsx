/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as Icons from 'lucide-react';

interface EmptyStateProps {
  iconName: keyof typeof Icons;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  iconName, 
  title, 
  description, 
  actionText, 
  onAction 
}: EmptyStateProps) {
  const IconComponent = Icons[iconName] as React.ComponentType<{ className?: string }>;

  return (
    <div 
      className="flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto my-12"
      id={`empty-state-${iconName.toString().toLowerCase()}`}
    >
      <div className="bg-[var(--color-primary-tint)] p-4 rounded-full mb-4 text-[var(--color-primary)]">
        {IconComponent && <IconComponent className="w-10 h-10" />}
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="btn-primary"
          id="empty-state-action-btn"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
