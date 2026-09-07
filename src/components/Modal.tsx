/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id="modal-container-overlay">
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        id="modal-card-element"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h3 className="font-semibold text-[var(--color-text-primary)] text-lg">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--color-border)] transition-colors text-[var(--color-text-secondary)]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body Content */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
