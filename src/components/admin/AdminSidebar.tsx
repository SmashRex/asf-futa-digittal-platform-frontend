/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminRole, PermissionKey } from '../../types/adminTypes';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Calendar, 
  Settings, 
  BookOpen, 
  LogOut, 
  ShieldAlert,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Megaphone,
  Image as ImageIcon,
  UserCheck,
  Repeat,
  Scale,
  Activity,
  Terminal,
  Sliders,
  ShieldCheck,
  UserPlus,
  Layers,
  BookMarked,
  Clock,
  Globe
} from 'lucide-react';

interface AdminSidebarProps {
  activeRole: AdminRole;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  hasPermission?: (key: PermissionKey) => boolean;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
  requiredPermission: PermissionKey | 'always';
  category?: 'core' | 'fs' | 'system';
}

export const PRESIDENT_NAV_ITEMS: NavItem[] = [
  {
    id: 'president-dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    requiredPermission: 'always',
    category: 'core'
  },
  {
    id: 'president-roster',
    label: 'Fellowship Roster',
    path: '/admin/members',
    icon: Users,
    requiredPermission: 'members.view',
    category: 'core'
  },
  {
    id: 'president-programs',
    label: 'Programs',
    path: '/admin/programs',
    icon: Calendar,
    requiredPermission: 'events.view',
    category: 'core'
  },
  {
    id: 'president-governance',
    label: 'Governance & Approvals',
    path: '/admin/governance',
    icon: Scale,
    requiredPermission: 'governance.view',
    category: 'core'
  },
  {
    id: 'president-handover',
    label: 'Executive Handover',
    path: '/admin/handover',
    icon: Repeat,
    requiredPermission: 'handover.view',
    category: 'core'
  },
  {
    id: 'president-analytics',
    label: 'Analytics / Overview',
    path: '/admin/analytics',
    icon: Activity,
    requiredPermission: 'always',
    category: 'core'
  }
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    requiredPermission: 'dashboard.view',
    category: 'core'
  },
  // Foundational School (FS) Domain Navigation Items
  {
    id: 'fs-students',
    label: 'FS Students',
    path: '/admin/fs/students',
    icon: Users,
    requiredPermission: 'fs.students.view',
    category: 'fs'
  },
  {
    id: 'fs-admissions',
    label: 'FS Admissions',
    path: '/admin/fs/admissions',
    icon: UserPlus,
    requiredPermission: 'fs.admissions.review',
    category: 'fs'
  },
  {
    id: 'fs-teachers',
    label: 'FS Facilitators',
    path: '/admin/fs/teachers',
    icon: UserCheck,
    requiredPermission: 'fs.teachers.assign',
    category: 'fs'
  },
  {
    id: 'fs-classes',
    label: 'FS Classes & Levels',
    path: '/admin/fs/classes',
    icon: Layers,
    requiredPermission: 'fs.classes.manage',
    category: 'fs'
  },
  {
    id: 'fs-materials',
    label: 'FS Study Materials',
    path: '/admin/fs/materials',
    icon: BookMarked,
    requiredPermission: 'fs.materials.manage',
    category: 'fs'
  },
  {
    id: 'fs-activity',
    label: 'FS Activity Logs',
    path: '/admin/fs/activity',
    icon: Clock,
    requiredPermission: 'fs.students.view',
    category: 'fs'
  },
  // Executive Governance & Continuity
  {
    id: 'leadership',
    label: 'Leadership & Roles',
    path: '/admin/leadership',
    icon: UserCheck,
    requiredPermission: 'leadership.view',
    category: 'core'
  },
  {
    id: 'handover',
    label: 'Handover & Continuity',
    path: '/admin/handover',
    icon: Repeat,
    requiredPermission: 'handover.view',
    category: 'core'
  },
  {
    id: 'governance',
    label: 'Governance & Approvals',
    path: '/admin/governance',
    icon: Scale,
    requiredPermission: 'governance.view',
    category: 'core'
  },
  // Ministry Operations
  {
    id: 'announcements',
    label: 'Announcements',
    path: '/admin/content',
    icon: Megaphone,
    requiredPermission: 'announcements.view',
    category: 'core'
  },
  {
    id: 'events',
    label: 'Events',
    path: '/admin/events',
    icon: Calendar,
    requiredPermission: 'events.view',
    category: 'core'
  },
  {
    id: 'media',
    label: 'Media Library',
    path: '/admin/media',
    icon: ImageIcon,
    requiredPermission: 'media.view',
    category: 'core'
  },
  {
    id: 'website-content',
    label: 'Website Copy',
    path: '/admin/website-content',
    icon: Globe,
    requiredPermission: 'announcements.edit',
    category: 'core'
  },
  {
    id: 'members',
    label: 'Members Directory',
    path: '/admin/members',
    icon: Users,
    requiredPermission: 'members.view',
    category: 'core'
  },
  // Technical & System Administration
  {
    id: 'system-health',
    label: 'System Health',
    path: '/admin/system-health',
    icon: Activity,
    requiredPermission: 'system.health.view',
    category: 'system'
  },
  {
    id: 'system-logs',
    label: 'Technical Logs',
    path: '/admin/logs',
    icon: Terminal,
    requiredPermission: 'system.logs.view',
    category: 'system'
  },
  {
    id: 'system-config',
    label: 'System Configuration',
    path: '/admin/system-configuration',
    icon: Sliders,
    requiredPermission: 'system.configuration.view',
    category: 'system'
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    icon: Settings,
    requiredPermission: 'always',
    category: 'core'
  }
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeRole,
  isMobileOpen,
  onCloseMobile,
  hasPermission = (_key: PermissionKey) => true
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    onCloseMobile();
  };

  const isPresident = activeRole === 'President / Executive';
  const navItemsPool = isPresident ? PRESIDENT_NAV_ITEMS : ADMIN_NAV_ITEMS;

  // Filter navigation items: strictly omit if user lacks permission
  const visibleNavItems = navItemsPool.filter(item => {
    if (item.requiredPermission === 'always') return true;
    return hasPermission(item.requiredPermission);
  });

  const navContent = (
    <div className="flex flex-col h-full bg-[#FFFFFF] border-r border-[#E4E4E7]">
      
      {/* Role Context Header inside Sidebar */}
      <div className="p-4 border-b border-[#E4E4E7] bg-[#FAF8F5]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5B0617]">
            {isPresident ? 'PRESIDENTIAL WORKSPACE' : 'EXECUTIVE CONTEXT'}
          </span>
        </div>
        <p className="text-xs font-bold text-[#18181B] truncate">
          {activeRole}
        </p>
        <p className="text-[11px] text-[#52525B] mt-0.5 leading-tight">
          {visibleNavItems.length} accessible module{visibleNavItems.length === 1 ? '' : 's'}
        </p>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#52525B]">
          {isPresident ? 'PRESIDENTIAL DESKS' : 'PERMITTED MODULES'}
        </div>

        {visibleNavItems.length === 0 ? (
          <div className="p-3 text-xs text-[#52525B] italic">
            No administrative modules assigned to this persona.
          </div>
        ) : (
          visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path) || (item.id === 'president-programs' && location.pathname.startsWith('/admin/events'));

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all text-left ${
                  isActive
                    ? 'bg-[#5B0617] text-white shadow-sm font-semibold'
                    : 'text-[#18181B] hover:bg-[#FAF8F5] hover:text-[#5B0617]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#52525B]'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })
        )}
      </nav>

      {/* Quick Shortcuts & Exit Panel */}
      <div className="p-3 border-t border-[#E4E4E7] bg-[#FAF8F5] space-y-2">
        <button
          onClick={() => handleNavigate('/home')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#5B0617] hover:bg-[#5B0617]/10 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Member App View</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {navContent}
      </aside>

      {/* Mobile Backdrop & Slide-over Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile} 
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
