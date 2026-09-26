/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminRole } from '../../types/adminTypes';
import { APP_CONFIG } from '../../config/app.config';
import Logo from '../Logo';
import { 
  ArrowLeft, 
  Menu, 
  X, 
  Shield, 
  ChevronDown, 
  Check, 
  UserCheck, 
  Bell, 
  Search,
  ExternalLink
} from 'lucide-react';

interface AdminHeaderProps {
  activeRole: AdminRole;
  onRoleChange: (role: AdminRole) => void;
  availableRoles?: AdminRole[];
  onToggleMobileNav: () => void;
  isMobileNavOpen: boolean;
  unreadCount?: number;
}

const ALL_ADMIN_ROLES: AdminRole[] = [
  'President / Executive',
  'VP / FS Coordinator',
  'Publicity Coordinator',
  'Bible Study Coordinator',
  'General Secretary',
  'Organizing Coordinator',
  'Drama Coordinator',
  'Prayer Coordinator',
  'Financial Secretary',
  'Treasurer',
  'Librarian'
];

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeRole,
  onRoleChange,
  availableRoles,
  onToggleMobileNav,
  isMobileNavOpen,
  unreadCount = 2
}) => {
  const navigate = useNavigate();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const selectableRoles = APP_CONFIG.features.enableDevSimulations
    ? ALL_ADMIN_ROLES
    : (availableRoles && availableRoles.length > 0 ? availableRoles : [activeRole]);
  const canSwitchRole = APP_CONFIG.features.enableDevSimulations || selectableRoles.length > 1;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)]" id="asf-admin-header">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Brand Identity & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 rounded-lg text-[#52525B] hover:text-[#18181B] hover:bg-[#FDFBF9] border border-transparent hover:border-[#E4E4E7] transition-all"
            aria-label="Toggle Navigation Drawer"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <Logo size="sm" theme="maroon" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-base sm:text-lg text-[#5B0617] tracking-tight group-hover:text-[#7A1F2B] transition-colors">
                  ASF Admin
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-[#5B0617]/10 text-[#5B0617] rounded">
                  PORTAL
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#52525B] hidden sm:block">
                Anglican Students' Fellowship Platform Management
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Role Indicator / Scoped Selector */}
          <div className="relative">
            <button
              onClick={() => canSwitchRole && setIsRoleMenuOpen(!isRoleMenuOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] transition-all ${
                canSwitchRole ? 'hover:bg-[#F3EFEA] cursor-pointer' : 'cursor-default'
              }`}
              title={canSwitchRole ? 'Switch active administrative role' : 'Active administrative role'}
            >
              <Shield className="w-3.5 h-3.5 text-[#5B0617] shrink-0" />
              <div className="text-left hidden md:block">
                <span className="text-[10px] uppercase tracking-wider text-[#52525B] block font-semibold leading-none mb-0.5">
                  Active Role
                </span>
                <span className="text-xs font-semibold text-[#18181B] leading-none">
                  {activeRole}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#18181B] md:hidden truncate max-w-[100px]">
                {activeRole.split(' ')[0]}
              </span>
              {canSwitchRole && <ChevronDown className="w-3.5 h-3.5 text-[#52525B] shrink-0" />}
            </button>

            {/* Role Dropdown Popup */}
            {canSwitchRole && isRoleMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsRoleMenuOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#E4E4E7] p-1.5 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-[#E4E4E7] mb-1">
                    <p className="font-semibold text-[#18181B]">Switch Admin Role</p>
                    <p className="text-[11px] text-[#52525B]">
                      {APP_CONFIG.features.enableDevSimulations ? 'Tests role-scoped navigation & controls' : 'Select from your assigned offices'}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    {selectableRoles.map((role) => {
                      const isPres = role === 'President / Executive';
                      const isFS = role === 'VP / FS Coordinator';
                      return (
                        <button
                          key={role}
                          onClick={() => {
                            onRoleChange(role);
                            setIsRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                            activeRole === role 
                              ? 'bg-[#7A1F2B]/10 text-[#7A1F2B] font-semibold' 
                              : 'text-[#18181B] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1.5">
                              <span>{role}</span>
                              {isPres && (
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-900">
                                  Global Authority
                                </span>
                              )}
                              {isFS && (
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                                  FS Authority
                                </span>
                              )}
                            </span>
                            {isPres && (
                              <span className="text-[10px] text-purple-700">
                                Highest Overall Authority
                              </span>
                            )}
                            {isFS && (
                              <span className="text-[10px] text-amber-800">
                                Head of Foundational School
                              </span>
                            )}
                          </div>
                          {activeRole === role && <Check className="w-4 h-4 text-[#7A1F2B]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Return to Member App Action */}
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs sm:text-sm font-medium transition-colors shadow-sm"
            id="back-to-member-app-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Member App</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80 hidden md:inline" />
          </button>
        </div>

      </div>
    </header>
  );
};
