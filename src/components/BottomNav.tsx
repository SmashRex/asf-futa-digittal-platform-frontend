/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, BookOpen, User, Megaphone } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', path: '/home', icon: Home },
    { id: 'events', label: 'Events', path: '/events', icon: Calendar },
    { id: 'announcements', label: 'Updates', path: '/announcements', icon: Megaphone },
    { id: 'bible', label: 'Bible Study', path: '/bible-study', icon: BookOpen },
    { id: 'profile', label: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] px-2 pt-1 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around z-40 shadow-lg select-none"
      id="mobile-bottom-nav"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname.startsWith(item.path);

        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[54px] py-1 px-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
              isActive
                ? 'text-[var(--color-primary)] font-bold'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium'
            }`}
            id={`bottom-nav-${item.id}`}
          >
            <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-[var(--color-primary-tint)]' : ''}`}>
              <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--color-primary)]' : ''}`} />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
