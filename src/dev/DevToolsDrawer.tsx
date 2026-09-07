/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDevState, devStateStore } from './simulations/devState';
import { UserRole } from '../types';
import { APP_CONFIG } from '../config/app.config';
import { isAuthorizedAdminRole, AdminRole } from '../types/adminTypes';
import { 
  Wrench, 
  WifiOff, 
  Lock, 
  EyeOff, 
  UserCheck, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  GraduationCap, 
  Users, 
  Crown,
  Check
} from 'lucide-react';

interface DevToolsDrawerProps {
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

interface RoleCategoryGroup {
  category: string;
  roles: {
    role: UserRole;
    label: string;
    description: string;
    icon: React.ElementType;
    isAdmin?: boolean;
  }[];
}

const ROLE_GROUPS: RoleCategoryGroup[] = [
  {
    category: 'Fellowship & Discipleship',
    roles: [
      {
        role: 'Member',
        label: 'Regular Member',
        description: 'Standard member view with bible, study guides & announcements',
        icon: Users
      },
      {
        role: 'FS Student',
        label: 'FS Student',
        description: 'Active Foundational School student with unlocked course modules',
        icon: GraduationCap
      },
      {
        role: 'FS Teacher',
        label: 'FS Teacher / Facilitator',
        description: 'Foundational School instructor with lesson outlines & assessment view',
        icon: GraduationCap
      },
      {
        role: 'Alumni',
        label: 'Alumni Brethren',
        description: 'Postgraduate brethren network, giving & homecoming portal',
        icon: ShieldCheck
      }
    ]
  },
  {
    category: 'Executive & Admin Platform',
    roles: [
      {
        role: 'President / Executive',
        label: 'President / Executive',
        description: 'Full administrative authority across governance, appointments & systems',
        icon: Crown,
        isAdmin: true
      },
      {
        role: 'VP / FS Coordinator',
        label: 'VP / FS Coordinator',
        description: 'Domain authority over FS admissions, classes, facilitators & syllabus',
        icon: GraduationCap,
        isAdmin: true
      },
      {
        role: 'Publicity Coordinator',
        label: 'Publicity Coordinator',
        description: 'Editorial & media desk for announcements, news & public relations',
        icon: ShieldCheck,
        isAdmin: true
      },
      {
        role: 'General Secretary',
        label: 'General Secretary',
        description: 'Secretariat oversight, membership directory & executive records',
        icon: ShieldCheck,
        isAdmin: true
      },
      {
        role: 'Bible Study Coordinator',
        label: 'Bible Study Coordinator',
        description: 'Bible study curriculum, weekly outlines & study group moderation',
        icon: ShieldCheck,
        isAdmin: true
      }
    ]
  }
];

export const DevToolsDrawer: React.FC<DevToolsDrawerProps> = ({ currentRole, onRoleChange }) => {
  const devState = useDevState();
  const effectiveRole = currentRole || devState.simulatedRoleOverride || 'Member';

  if (!APP_CONFIG.features.enableDevSimulations) {
    return null;
  }

  const handleSelectRole = (role: UserRole) => {
    devStateStore.setSimulatedRole(role);
    if (isAuthorizedAdminRole(role)) {
      try {
        localStorage.setItem('asf_admin_role', role);
      } catch {
        // ignore
      }
    }
    if (onRoleChange) {
      onRoleChange(role);
    }
  };

  if (!devState.isDevDrawerOpen) {
    return (
      <button
        onClick={() => devStateStore.toggleDevDrawer()}
        className="fixed bottom-20 right-4 z-50 bg-slate-900 text-amber-400 p-2.5 rounded-full shadow-lg border border-slate-700 hover:bg-slate-800 transition-all text-xs font-mono flex items-center gap-1.5 opacity-90 hover:opacity-100 cursor-pointer group"
        title="Open Developer & Simulation Controls"
        id="dev-tools-trigger-btn"
      >
        <Wrench className="w-4 h-4 group-hover:rotate-45 transition-transform" />
        <span className="hidden sm:inline font-bold">DEV TOOLS</span>
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs" id="dev-tools-overlay">
      <div className="w-full max-w-md bg-slate-900 text-slate-100 h-full flex flex-col shadow-2xl border-l border-slate-800 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-semibold text-sm text-slate-100 font-mono">Dev & Simulation Toolbar</h3>
              <p className="text-[10px] text-slate-400 font-mono">Real-time role & screen switcher</p>
            </div>
          </div>
          <button
            onClick={() => devStateStore.toggleDevDrawer()}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close DevTools"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-6 flex-1">
          {/* Active Role Quick Overview Card */}
          <div className="bg-gradient-to-r from-amber-950/60 to-slate-800/80 border border-amber-800/60 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-[10px] text-amber-400">Current Active Role</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                Live Simulation
              </span>
            </div>
            <p className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>{effectiveRole}</span>
            </p>
            <p className="text-[11px] text-slate-300 leading-tight">
              Selecting a role instantly updates your session, security clearances, navigation items, and screen flows.
            </p>
          </div>

          {/* Role Switching Groups */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Role & Clearance Switcher
              </h4>
            </div>

            {ROLE_GROUPS.map((group) => (
              <div key={group.category} className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  {group.category}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {group.roles.map((item) => {
                    const Icon = item.icon;
                    const isSelected = effectiveRole === item.role;
                    return (
                      <button
                        key={item.role}
                        onClick={() => handleSelectRole(item.role)}
                        className={`flex items-start justify-between p-3 rounded-xl text-xs transition-all text-left border cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-200 border-amber-500/70 shadow-xs'
                            : 'bg-slate-800/50 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                        id={`dev-role-btn-${item.role.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                      >
                        <div className="flex items-start gap-3 min-w-0 pr-2">
                          <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            isSelected 
                              ? 'bg-amber-500/30 text-amber-300' 
                              : 'bg-slate-700/60 text-slate-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-100">{item.label}</span>
                              {item.isAdmin && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="shrink-0 p-1 rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/50">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono mt-1 shrink-0">Switch</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Network & Access Simulations */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Network & Feature State</h4>
            
            {/* Offline Simulation */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2.5 text-xs font-medium">
                <WifiOff className={`w-4 h-4 ${devState.isOfflineSimulated ? 'text-rose-400' : 'text-slate-500'}`} />
                <div>
                  <p className="font-bold text-slate-200">Simulate Offline Mode</p>
                  <p className="text-[10px] text-slate-400">Tests offline caching & prebundled data</p>
                </div>
              </div>
              <button
                onClick={() => devStateStore.toggleOffline()}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                  devState.isOfflineSimulated 
                    ? 'bg-rose-500 text-white shadow-xs' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                id="dev-offline-toggle"
              >
                {devState.isOfflineSimulated ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            {/* Restricted Auth Simulation */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2.5 text-xs font-medium">
                <Lock className={`w-4 h-4 ${devState.isRestrictedSimulated ? 'text-amber-400' : 'text-slate-500'}`} />
                <div>
                  <p className="font-bold text-slate-200">Simulate Restricted FS Auth</p>
                  <p className="text-[10px] text-slate-400">Locks FS study guides behind permission gate</p>
                </div>
              </div>
              <button
                onClick={() => devStateStore.toggleRestricted()}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                  devState.isRestrictedSimulated 
                    ? 'bg-amber-500 text-slate-950 shadow-xs' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                id="dev-restricted-toggle"
              >
                {devState.isRestrictedSimulated ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            {/* Empty State Simulation */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2.5 text-xs font-medium">
                <EyeOff className={`w-4 h-4 ${devState.isEmptyStateSimulated ? 'text-sky-400' : 'text-slate-500'}`} />
                <div>
                  <p className="font-bold text-slate-200">Simulate Empty List State</p>
                  <p className="text-[10px] text-slate-400">Tests zero-data states across modules</p>
                </div>
              </div>
              <button
                onClick={() => devStateStore.toggleEmptyState()}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                  devState.isEmptyStateSimulated 
                    ? 'bg-sky-500 text-white shadow-xs' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                id="dev-empty-toggle"
              >
                {devState.isEmptyStateSimulated ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Local Storage & Cache Controls */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Storage Utilities</h4>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 text-rose-200 border border-rose-800/60 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-98"
              id="dev-clear-storage-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Local Storage & Reset App</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-400 font-mono">
          ASF FUTA Digital Fellowship Platform
        </div>
      </div>
    </div>
  );
};

