/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  User, 
  Bell, 
  Bookmark, 
  Info, 
  ShieldCheck, 
  LogOut, 
  X,
  BookOpen,
  Book,
  Music,
  Megaphone,
  Calendar,
  GraduationCap,
  HelpCircle,
  Settings,
  Wifi,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { isAuthorizedAdminRole, resolveUserAdminRoles } from '../types/adminTypes';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function NavigationDrawer({ 
  isOpen, 
  onClose, 
  currentUser, 
  onLogout 
}: NavigationDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  const hasAdminAccess = Boolean(
    currentUser && (
      resolveUserAdminRoles(currentUser).length > 0 ||
      (Array.isArray(currentUser.roles) && currentUser.roles.some(r => isAuthorizedAdminRole(r)))
    )
  );

  const handleNavClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleAdminClick = () => {
    navigate('/admin/dashboard');
    onClose();
  };

  const confirmLogout = () => {
    onLogout();
    onClose();
    setShowLogoutConfirm(false);
    navigate('/');
  };

  // Structured and logically grouped navigation sections
  const navSections: NavSection[] = [
    {
      title: 'Main & Fellowship',
      items: [
        { label: 'Home', icon: Home, path: '/home' },
        { label: 'Announcements', icon: Megaphone, path: '/announcements' },
        { label: 'Events & Calendar', icon: Calendar, path: '/events' },
      ]
    },
    {
      title: 'Word & Worship',
      items: [
        { label: 'Holy Bible', icon: Book, path: '/bible' },
        { label: 'Bible Study', icon: BookOpen, path: '/bible-study' },
        { label: 'Hymn Book (SOP)', icon: Music, path: '/hymns' },
        { label: 'Foundational School', icon: GraduationCap, path: '/fs' },
      ]
    },
    {
      title: 'Personal',
      items: [
        { label: 'My Profile', icon: User, path: '/profile' },
        { label: 'My Bookmarks', icon: Bookmark, path: '/bookmarks' },
        { label: 'Notifications', icon: Bell, path: '/notifications' },
      ]
    },
    {
      title: 'Preferences & Support',
      items: [
        { label: 'Settings', icon: Settings, path: '/settings' },
        { label: 'Help & Support', icon: HelpCircle, path: '/help' },
        { label: 'About ASF', icon: Info, path: '/about' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex" id="drawer-overlay">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" 
        onClick={onClose}
        id="drawer-backdrop"
      ></div>

      {/* Modern Drawer content panel */}
      <div 
        className="relative flex w-full max-w-[320px] sm:max-w-[340px] flex-col bg-[var(--color-surface)] h-full shadow-2xl animate-[drawerSlideIn_0.25s_cubic-bezier(0.16,1,0.3,1)] select-none border-r border-[var(--color-border)]"
        id="drawer-panel"
      >
        {/* Maroon Modern Header with User Profile Summary */}
        <div 
          className="relative bg-gradient-to-b from-[#5B0617] via-[#7A1F2B] to-[#7A1F2B] text-white p-5 pt-[max(2.5rem,env(safe-area-inset-top))] flex flex-col justify-end shadow-sm overflow-hidden" 
          id="drawer-header-panel"
        >
          {/* Subtle background decorative shapes */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-6 -mb-6 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3.5 top-3.5 w-9 h-9 flex items-center justify-center rounded-xl bg-black/15 hover:bg-white/20 active:scale-95 text-white/90 hover:text-white transition-all z-10 cursor-pointer border border-white/10"
            aria-label="Close drawer"
          >
            <X className="w-4.5 h-4.5" />
          </button>

          {/* User Profile Card within Header */}
          <div 
            onClick={() => handleNavClick('/profile')}
            className="flex items-center gap-3.5 group cursor-pointer relative z-10 bg-white/10 hover:bg-white/15 p-2.5 rounded-2xl border border-white/15 transition-all active:scale-[0.99]"
          >
            <div className="relative">
              <div className="bg-gradient-to-tr from-amber-400/30 to-white/30 p-0.5 rounded-2xl shadow-xs">
                <div className="bg-[#5B0617] w-12 h-12 rounded-xl flex items-center justify-center border border-white/20 text-white group-hover:scale-105 transition-transform">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#7A1F2B] rounded-full" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-sm leading-snug truncate text-white group-hover:text-white">
                {currentUser ? currentUser.name : 'Fellowship Member'}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-white/90 text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-md whitespace-nowrap">
                  {hasAdminAccess && <ShieldCheck className="w-3 h-3 text-amber-300 shrink-0" />}
                  <span className="truncate">{currentUser?.roles?.join(', ') || currentUser?.role || 'Member'}</span>
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </div>

        {/* Categorized Navigation list */}
        <nav className="flex-1 px-3 py-3.5 overflow-y-auto space-y-4" id="drawer-nav-items">
          {navSections.map((section, sIndex) => (
            <div key={section.title} className={sIndex > 0 ? 'pt-2.5 border-t border-[var(--color-border)]/70' : ''}>
              <p className="text-[10px] font-bold tracking-wider text-[var(--color-text-secondary)] uppercase px-3 pb-1.5 opacity-75">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] cursor-pointer group ${
                        isActive 
                          ? 'bg-[var(--color-primary-tint)] text-[var(--color-primary)] font-bold shadow-2xs' 
                          : 'text-[var(--color-text-primary)] hover:bg-[var(--color-background)] font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                          isActive 
                            ? 'bg-[var(--color-primary)] text-white' 
                            : 'bg-[var(--color-background)] text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] group-hover:bg-[var(--color-primary-tint)]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </div>

                      {isActive && (
                        <div className="w-1.5 h-4 bg-[var(--color-primary)] rounded-full shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* ADMIN-ONLY EXPOSURE ACCESS RULE */}
          {hasAdminAccess && (
            <div className="pt-2.5 border-t border-[var(--color-border)]/70">
              <p className="text-[10px] font-bold tracking-wider text-[var(--color-text-secondary)] uppercase px-3 pb-1.5 opacity-75">
                Executive Portal
              </p>
              <div className="p-1 bg-[#FAF8F5] rounded-xl border border-[#E4E4E7] shadow-xs">
                <button
                  onClick={handleAdminClick}
                  className="w-full flex items-center justify-between gap-3 bg-[#7A1F2B] hover:bg-[#5B0617] text-white rounded-lg px-3.5 py-2.5 transition-all group shadow-2xs text-left cursor-pointer"
                  id="drawer-admin-shortcut-btn"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ShieldCheck className="w-4.5 h-4.5 text-amber-300 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">Admin Workspace</div>
                      <div className="text-[10px] text-white/80 font-medium truncate">
                        {currentUser?.role || 'Executive Authority'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Dynamic Toasts Inside Drawer */}
        {toastMessage && (
          <div className="mx-3 p-3 bg-[var(--color-text-primary)] text-white text-xs rounded-xl shadow-md mb-2 leading-relaxed flex items-start gap-2 border border-white/10 animate-fade-in">
            <BookOpen className="w-4 h-4 text-[var(--color-accent)] mt-0.5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modern Footer actions */}
        <div className="p-3.5 border-t border-[var(--color-border)] flex flex-col gap-2.5 bg-[var(--color-background)]/50">
          {showLogoutConfirm ? (
            <div className="bg-red-50 p-3.5 rounded-xl border border-red-100 space-y-2.5 shadow-2xs">
              <p className="text-xs text-[var(--color-text-primary)] font-semibold text-center">
                Are you sure you want to sign out?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-2 bg-[var(--color-error)] hover:bg-red-700 active:scale-95 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  id="drawer-logout-confirm"
                >
                  Yes, Sign Out
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2 bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-black/5 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                  id="drawer-logout-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-700 hover:bg-red-50 hover:text-red-800 transition-colors border border-transparent hover:border-red-100 cursor-pointer"
              id="drawer-logout-trigger"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Log Out</span>
            </button>
          )}
          
          <div className="text-center pt-0.5">
            <Link 
              to="/" 
              onClick={onClose}
              className="text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors font-semibold tracking-wider uppercase inline-block"
            >
              Powered by ASF FUTA
            </Link>
          </div>
        </div>
      </div>
      
      {/* Dynamic SlideIn CSS definition */}
      <style>{`
        @keyframes drawerSlideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

