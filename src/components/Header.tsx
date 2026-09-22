/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  onMenuClick: () => void;
  unreadCount: number;
}

export default function Header({ 
  onMenuClick, 
  unreadCount 
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header 
      className="sticky top-0 z-50 h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 flex items-center justify-between shadow-xs select-none"
      id="app-header-bar"
    >
      {/* Left Menu trigger */}
      <button
        onClick={onMenuClick}
        className="w-10 h-10 -ml-1 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-background)] border border-[var(--color-border)] active:scale-95 transition-all text-[var(--color-text-primary)] flex items-center justify-center shadow-2xs group cursor-pointer"
        aria-label="Open navigation drawer"
        id="hamburger-menu-trigger"
      >
        <div className="w-5 h-4 flex flex-col justify-between items-start">
          <span className="w-5 h-0.5 bg-[var(--color-text-primary)] group-hover:bg-[var(--color-primary)] transition-all rounded-full" />
          <span className="w-3.5 h-0.5 bg-[var(--color-text-primary)] group-hover:w-5 group-hover:bg-[var(--color-primary)] transition-all rounded-full" />
          <span className="w-5 h-0.5 bg-[var(--color-text-primary)] group-hover:bg-[var(--color-primary)] transition-all rounded-full" />
        </div>
      </button>

      {/* Center Brand header - Responsive container holding official logo asset and FUTA label */}
      <div 
        onClick={() => navigate('/home')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate('/home');
          }
        }}
        role="button"
        tabIndex={0}
        className="flex items-center cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all py-1 px-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        id="brand-header-trigger"
        aria-label="ASF FUTA Home"
      >
        <Logo size="sm" theme="maroon" variant="futa" />
      </div>

      {/* Right Notifications bell */}
      <button
        onClick={() => navigate('/notifications')}
        className="min-w-[44px] min-h-[44px] -mr-2 rounded-full hover:bg-[var(--color-background)] active:scale-95 transition-all text-[var(--color-text-primary)] relative flex items-center justify-center cursor-pointer"
        aria-label="View notifications"
        id="notifications-bell-trigger"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span 
            className="absolute top-1.5 right-1.5 bg-[var(--color-error)] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[var(--color-surface)] animate-pulse"
            id="notifications-badge-count"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </header>
  );
}

