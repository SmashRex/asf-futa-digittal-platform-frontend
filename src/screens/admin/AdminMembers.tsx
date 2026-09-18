/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { AdminMember } from '../../types/adminTypes';
import { UserRole } from '../../types';
import { membersService } from '../../services/members/members.service';
import { 
  Users, 
  Search, 
  Filter, 
  Shield, 
  Mail, 
  Phone, 
  GraduationCap, 
  CheckCircle2,
  X,
  BookOpen,
  UserCheck,
  UserX,
  RefreshCw,
  Building2,
  Layers,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Briefcase
} from 'lucide-react';

const ACADEMIC_LEVELS = [
  'All Academic Levels',
  '100 Level',
  '200 Level',
  '300 Level',
  '400 Level',
  '500 Level',
  'Postgraduate',
  'Alumni'
];

const SUBGROUP_FILTERS = [
  'All Subgroups',
  'Technical Team',
  'Publicity & Editorial',
  'Choir / Music Ministry',
  'Ushering & Protocol',
  'Prayer Force',
  'Drama Ministry',
  'Foundational School',
  'Organizing Committee'
];

const ROLE_FILTERS: (UserRole | 'All Roles')[] = [
  'All Roles',
  'Member',
  'President / Executive',
  'VP / FS Coordinator',
  'General Secretary',
  'Publicity Coordinator',
  'Bible Study Coordinator',
  'FS Teacher',
  'FS Student',
  'Alumni',
  'Technical Administrator'
];

export const AdminMembers: React.FC = () => {
  const { members, updateMemberRole, updateMemberLevel, updateMemberSubgroup, toggleMemberStatus, activeRole, activeMember, userRoles } = useOutletContext<AdminContextType>();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('All Academic Levels');
  const [selectedSubgroupFilter, setSelectedSubgroupFilter] = useState<string>('All Subgroups');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All Roles');
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [overrideLevel, setOverrideLevel] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [overrideReasonError, setOverrideReasonError] = useState<string>('');
  const [isSubmittingOverride, setIsSubmittingOverride] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    if (selectedMember) {
      setOverrideLevel(selectedMember.level);
      setOverrideReason('');
      setOverrideReasonError('');
      setNewPassword('');
      setResetPasswordError('');
      setResetPasswordSuccess('');
      setShowResetPassword(false);
    }
  }, [selectedMember?.id]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Authorized roles for academic level override per contract:
  // Technical Administrator, General Secretary, President / Executive
  const authorizedOverrideRoles = ['Technical Administrator', 'General Secretary', 'President / Executive'];
  const canOverrideLevel = Boolean(
    authorizedOverrideRoles.includes(activeRole) ||
    (userRoles && userRoles.some(r => authorizedOverrideRoles.includes(r)))
  );

  // Authorized roles for admin password reset per contract:
  // Technical Administrator, President / Executive
  const authorizedResetPasswordRoles = ['Technical Administrator', 'President / Executive'];
  const canResetPassword = Boolean(
    authorizedResetPasswordRoles.includes(activeRole) ||
    (userRoles && userRoles.some(r => authorizedResetPasswordRoles.includes(r)))
  );

  // Authorized roles for subgroup management per contract:
  // Publicity Coordinator, President / Executive, Technical Administrator
  const authorizedSubgroupRoles = ['Publicity Coordinator', 'President / Executive', 'Technical Administrator'];
  const canManageSubgroup = Boolean(
    authorizedSubgroupRoles.includes(activeRole) ||
    (userRoles && userRoles.some(r => authorizedSubgroupRoles.includes(r)))
  );

  const [subgroupToSet, setSubgroupToSet] = useState('');
  const [isSubmittingSubgroup, setIsSubmittingSubgroup] = useState(false);
  const [subgroupError, setSubgroupError] = useState('');

  const handleSelectMember = async (member: AdminMember) => {
    setSelectedMember(member);
    setNewPassword('');
    setResetPasswordError('');
    setResetPasswordSuccess('');
    setShowResetPassword(false);
    setSubgroupToSet(member.subgroup || '');
    setSubgroupError('');
    try {
      const detailed = await membersService.getMemberById(member.id);
      setSelectedMember(prev => prev && prev.id === member.id ? detailed : prev);
      if (detailed.subgroup) {
        setSubgroupToSet(detailed.subgroup);
      }
    } catch (err) {
      console.warn('Could not fetch detailed member from GET /api/members/:id:', err);
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesLevel = selectedLevelFilter === 'All Academic Levels' || m.level === selectedLevelFilter;
    const matchesSubgroup = selectedSubgroupFilter === 'All Subgroups' || m.subgroup === selectedSubgroupFilter;
    const matchesRole = selectedRoleFilter === 'All Roles' || m.role === selectedRoleFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q) ||
      m.subgroup.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q);
    
    return matchesLevel && matchesSubgroup && matchesRole && matchesSearch;
  });

  const totalPages = Math.ceil(filteredMembers.length / pageSize) || 1;
  const paginatedMembers = filteredMembers.slice((page - 1) * pageSize, page * pageSize);

  const handleRoleUpdate = async (memberId: string, newRole: UserRole) => {
    try {
      await membersService.updateRole(memberId, 'assign', newRole);
      updateMemberRole(memberId, newRole);
      if (selectedMember && selectedMember.id === memberId) {
        setSelectedMember(prev => prev ? { ...prev, role: newRole } : null);
      }
      triggerToast(`Updated role for ${selectedMember?.name || 'member'} to ${newRole}`);
    } catch (err: any) {
      triggerToast(err.message || 'Failed to update role');
    }
  };

  const handleLevelOverride = async (memberId: string) => {
    const levelToSet = overrideLevel || selectedMember?.level || '100 Level';
    const trimmedReason = overrideReason.trim();

    if (trimmedReason.length < 5) {
      setOverrideReasonError('Please provide a reason of at least 5 characters.');
      return;
    }

    setOverrideReasonError('');
    setIsSubmittingOverride(true);
    try {
      await membersService.overrideAcademicLevel(memberId, levelToSet, trimmedReason);
      updateMemberLevel(memberId, levelToSet);
      if (selectedMember && selectedMember.id === memberId) {
        setSelectedMember(prev => prev ? { ...prev, level: levelToSet } : null);
      }
      setOverrideReason('');
      triggerToast(`Academic level for ${selectedMember?.name || 'member'} updated to ${levelToSet}`);
    } catch (err: any) {
      const msg = err.message || 'Failed to override academic level';
      setOverrideReasonError(msg);
      triggerToast(msg);
    } finally {
      setIsSubmittingOverride(false);
    }
  };

  const isSelfSelected = Boolean(
    activeMember && selectedMember && (
      (activeMember.id && selectedMember.id && activeMember.id === selectedMember.id) ||
      (activeMember.email && selectedMember.email && activeMember.email.toLowerCase() === selectedMember.email.toLowerCase())
    )
  );

  const handleStatusToggle = async (memberId: string) => {
    if (isSelfSelected) {
      triggerToast('You cannot modify your own account status.');
      return;
    }
    const nextStatus = selectedMember?.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await membersService.updateStatus(memberId, nextStatus);
      toggleMemberStatus(memberId);
      if (selectedMember && selectedMember.id === memberId) {
        setSelectedMember(prev => prev ? { ...prev, status: nextStatus === 'Active' ? 'Active' : 'Suspended' } : null);
      }
      triggerToast(`Member account ${nextStatus === 'Active' ? 'reactivated' : 'deactivated'}`);
    } catch (err: any) {
      if (err.code === 'CANNOT_SELF_MODIFY' || err.message?.includes('CANNOT_SELF_MODIFY')) {
        triggerToast('You cannot modify your own account status.');
      } else {
        triggerToast(err.message || 'Failed to update account status');
      }
    }
  };

  const handleResetPasswordSubmit = async () => {
    if (!selectedMember) return;
    setResetPasswordError('');
    setResetPasswordSuccess('');
    const trimmed = newPassword.trim();
    if (trimmed.length < 8) {
      setResetPasswordError('Password must be at least 8 characters long.');
      return;
    }
    setIsResettingPassword(true);
    try {
      await membersService.resetPassword(selectedMember.id, trimmed);
      setResetPasswordSuccess(`Password successfully reset for ${selectedMember.name}`);
      setNewPassword('');
      triggerToast(`Password reset for ${selectedMember.name}`);
    } catch (err: any) {
      setResetPasswordError(err.message || 'Failed to reset password');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSubgroupUpdate = async (memberId: string) => {
    if (!subgroupToSet.trim()) {
      setSubgroupError('Please enter a valid fellowship subgroup name.');
      return;
    }
    setSubgroupError('');
    setIsSubmittingSubgroup(true);
    try {
      const updated = await membersService.updateSubgroup(memberId, subgroupToSet.trim());
      updateMemberSubgroup(memberId, updated.subgroup);
      if (selectedMember && selectedMember.id === memberId) {
        setSelectedMember(prev => prev ? { ...prev, subgroup: updated.subgroup } : null);
      }
      triggerToast(`Fellowship subgroup updated to "${updated.subgroup}"`);
    } catch (err: any) {
      const msg = err.message || 'Failed to update subgroup';
      setSubgroupError(msg);
      triggerToast(msg);
    } finally {
      setIsSubmittingSubgroup(false);
    }
  };

  return (
    <div className="space-y-6 select-none" id="admin-members-screen">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 bg-[#5B0617] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#7A1F2B] text-xs font-bold z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#52525B] mb-1">
            <span>Administration</span>
            <span>/</span>
            <span className="text-[#5B0617] font-bold">Member Directory & Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Fellowship Member Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-0.5">
            View registered fellowship members, manage subgroup designations, and review role assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-2 rounded-xl bg-white border border-[#E4E4E7] text-xs font-semibold text-[#18181B] shadow-xs">
            Total Members: <strong className="text-[#5B0617]">{members.length}</strong>
          </span>
          <span className="px-3.5 py-2 rounded-xl bg-white border border-[#E4E4E7] text-xs font-semibold text-[#18181B] shadow-xs">
            Showing: <strong className="text-emerald-800">{filteredMembers.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter Header Controls */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 shadow-sm space-y-3">
        
        {/* Search */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by member name, email, department, level, or subgroup..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs sm:text-sm text-[#18181B] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {/* Academic Level */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#52525B] mb-1">Academic Level</label>
            <select
              value={selectedLevelFilter}
              onChange={(e) => setSelectedLevelFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
            >
              {ACADEMIC_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Subgroup */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#52525B] mb-1">Fellowship Subgroup</label>
            <select
              value={selectedSubgroupFilter}
              onChange={(e) => setSelectedSubgroupFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
            >
              {SUBGROUP_FILTERS.map((grp) => (
                <option key={grp} value={grp}>{grp}</option>
              ))}
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#52525B] mb-1">Fellowship Role</label>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
            >
              {ROLE_FILTERS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Directory Table (Desktop) */}
      <div className="hidden lg:block bg-white rounded-2xl border border-[#E4E4E7] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#E4E4E7] text-[11px] font-bold uppercase tracking-wider text-[#52525B]">
              <th className="p-3.5 pl-5">Member Name & Email</th>
              <th className="p-3.5">Level & Dept</th>
              <th className="p-3.5">Fellowship Role</th>
              <th className="p-3.5">Subgroup / Unit</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right pr-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7] text-xs">
            {paginatedMembers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-xs text-[#52525B]">
                  No fellowship members match the active search and filter criteria.
                </td>
              </tr>
            ) : (
              paginatedMembers.map((member) => (
                <tr key={member.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                  <td className="p-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#5B0617] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-serif font-bold text-sm text-[#18181B]">{member.name}</p>
                        <p className="text-[11px] text-[#52525B]">{member.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 text-[#52525B]">
                    <div className="font-medium text-[#18181B]">{member.level}</div>
                    <div className="text-[11px] text-[#52525B]">{member.department}</div>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-[#18181B] font-semibold text-[11px] border border-[#E4E4E7]">
                      {member.role}
                    </span>
                  </td>

                  <td className="p-3.5 font-semibold text-[#5B0617]">
                    {member.subgroup || 'General Assembly'}
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      member.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {member.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right pr-5">
                    <button
                      onClick={() => handleSelectMember(member)}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E4E4E7] font-semibold text-xs text-[#18181B] cursor-pointer"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Member Cards */}
      <div className="lg:hidden space-y-3">
        {paginatedMembers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 text-center text-xs text-[#52525B]">
            No fellowship members match the active search and filter criteria.
          </div>
        ) : (
          paginatedMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl border border-[#E4E4E7] p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#5B0617] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#18181B]">{member.name}</h3>
                  <p className="text-xs text-[#52525B]">{member.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#E4E4E7]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#52525B]">Level & Dept:</span>
                  <p className="font-semibold text-[#18181B]">{member.level} • {member.department}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#52525B]">Subgroup:</span>
                  <p className="font-semibold text-[#5B0617]">{member.subgroup || 'General Assembly'}</p>
                </div>
              </div>

              <button
                onClick={() => handleSelectMember(member)}
                className="w-full py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] font-semibold text-xs text-[#18181B] cursor-pointer"
              >
                Inspect & Manage Member
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {filteredMembers.length > pageSize && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-[#E4E4E7] text-xs">
          <p className="text-[#52525B]">
            Showing <strong className="text-[#18181B]">{(page - 1) * pageSize + 1}</strong> to <strong className="text-[#18181B]">{Math.min(page * pageSize, filteredMembers.length)}</strong> of <strong className="text-[#18181B]">{filteredMembers.length}</strong> members
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] hover:bg-[#F3EFEA] disabled:opacity-40 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] hover:bg-[#F3EFEA] disabled:opacity-40 disabled:cursor-not-allowed"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Member Inspection & Management Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#E4E4E7] shadow-2xl relative">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-[#52525B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-[#5B0617] text-white rounded">
                MEMBER RECORD
              </span>
              <h2 className="font-serif font-bold text-xl text-[#18181B] mt-1">
                {selectedMember.name}
              </h2>
              <p className="text-xs text-[#52525B]">{selectedMember.email}</p>
            </div>

            {/* Profile Overview Details */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E4E4E7] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#52525B]">Academic Level:</span>
                <strong className="text-[#18181B]">{selectedMember.level}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#52525B]">Department:</span>
                <strong className="text-[#18181B]">{selectedMember.department}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#52525B]">Current Subgroup:</span>
                <strong className="text-[#5B0617]">{selectedMember.subgroup}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#52525B]">Current Role:</span>
                <strong className="text-[#18181B]">{selectedMember.role}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#52525B]">Account Status:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedMember.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {selectedMember.status}
                </span>
              </div>
            </div>

            {/* Role, Academic Level & Status Controls */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">Assign Fellowship Role</label>
                <select
                  value={selectedMember.role}
                  onChange={(e) => handleRoleUpdate(selectedMember.id, e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B]"
                >
                  <option value="Member">Member</option>
                  <option value="FS Student">FS Student</option>
                  <option value="FS Teacher">FS Teacher</option>
                  <option value="Publicity Coordinator">Publicity Coordinator</option>
                  <option value="Bible Study Coordinator">Bible Study Coordinator</option>
                  <option value="VP / FS Coordinator">VP / FS Coordinator</option>
                  <option value="General Secretary">General Secretary</option>
                  <option value="President / Executive">President / Executive</option>
                  <option value="Alumni">Alumni</option>
                  <option value="Technical Administrator">Technical Administrator</option>
                </select>
              </div>

              {/* Academic Level Override (Authorized officers only) */}
              {canOverrideLevel && (
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E4E4E7] space-y-3" id="academic-level-override-section">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#18181B]">
                      Override Academic Level
                    </label>
                    <span className="text-[10px] text-[#5B0617] font-semibold">General Sec / Tech Admin / President</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717A] mb-1">
                        New Academic Level
                      </label>
                      <select
                        value={overrideLevel || selectedMember.level}
                        onChange={(e) => {
                          setOverrideLevel(e.target.value);
                          if (overrideReasonError) setOverrideReasonError('');
                        }}
                        className="w-full p-2 rounded-lg bg-white border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none focus:border-[#5B0617]"
                        id="override-new-level-select"
                      >
                        <option value="100 Level">100 Level</option>
                        <option value="200 Level">200 Level</option>
                        <option value="300 Level">300 Level</option>
                        <option value="400 Level">400 Level</option>
                        <option value="500 Level">500 Level</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Alumni">Alumni</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717A] mb-1">
                        Override Reason <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={overrideReason}
                        onChange={(e) => {
                          setOverrideReason(e.target.value);
                          if (overrideReasonError && e.target.value.trim().length >= 5) {
                            setOverrideReasonError('');
                          }
                        }}
                        placeholder="e.g. Correcting academic progression"
                        className={`w-full p-2 rounded-lg bg-white border text-xs text-[#18181B] focus:outline-none ${
                          overrideReasonError ? 'border-rose-400 focus:border-rose-500' : 'border-[#E4E4E7] focus:border-[#5B0617]'
                        }`}
                        id="override-reason-input"
                      />
                      {overrideReasonError && (
                        <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1" id="override-reason-error">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{overrideReasonError}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isSubmittingOverride}
                      onClick={() => handleLevelOverride(selectedMember.id)}
                      className="w-full py-2 rounded-lg bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                      id="submit-level-override-btn"
                    >
                      {isSubmittingOverride ? 'Submitting Override...' : 'Apply Level Override'}
                    </button>
                  </div>
                </div>
              )}

              {/* Subgroup Designation (Authorized roles: Publicity Coordinator, President / Executive, Technical Administrator) */}
              {canManageSubgroup && (
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E4E4E7] space-y-3" id="admin-subgroup-management-section">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#5B0617]" />
                      <span>Fellowship Subgroup Designation</span>
                    </label>
                    <span className="text-[10px] text-[#5B0617] font-semibold">Publicity / President / Tech Admin</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717A] mb-1">
                        Subgroup Unit <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={subgroupToSet}
                        onChange={(e) => {
                          setSubgroupToSet(e.target.value);
                          if (subgroupError) setSubgroupError('');
                        }}
                        placeholder="e.g. Media Unit, Choir, Technical Team"
                        className={`w-full p-2 rounded-lg bg-white border text-xs text-[#18181B] focus:outline-none ${
                          subgroupError ? 'border-rose-400 focus:border-rose-500' : 'border-[#E4E4E7] focus:border-[#5B0617]'
                        }`}
                        id="admin-subgroup-input"
                      />
                      {subgroupError && (
                        <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1" id="subgroup-error-msg">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{subgroupError}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isSubmittingSubgroup}
                      onClick={() => handleSubgroupUpdate(selectedMember.id)}
                      className="w-full py-2 rounded-lg bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                      id="submit-subgroup-update-btn"
                    >
                      {isSubmittingSubgroup ? 'Updating Subgroup...' : 'Save Subgroup Designation'}
                    </button>
                  </div>
                </div>
              )}

              {/* Admin Password Reset (Technical Administrator & President / Executive only) */}
              {canResetPassword && (
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E4E4E7] space-y-3" id="admin-password-reset-section">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#5B0617]" />
                      <span>Reset Member Password</span>
                    </label>
                    <span className="text-[10px] text-[#5B0617] font-semibold">Tech Admin / President</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#71717A] mb-1">
                        New Password <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showResetPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (resetPasswordError && e.target.value.length >= 8) {
                              setResetPasswordError('');
                            }
                            if (resetPasswordSuccess) setResetPasswordSuccess('');
                          }}
                          placeholder="Min. 8 characters"
                          className={`w-full p-2 pr-9 rounded-lg bg-white border text-xs text-[#18181B] focus:outline-none ${
                            resetPasswordError ? 'border-rose-400 focus:border-rose-500' : 'border-[#E4E4E7] focus:border-[#5B0617]'
                          }`}
                          id="admin-reset-new-password-input"
                        />
                        <button
                          type="button"
                          onClick={() => setShowResetPassword(!showResetPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                          aria-label={showResetPassword ? "Hide password" : "Show password"}
                          id="toggle-reset-password-visibility-btn"
                        >
                          {showResetPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-stone-400" />}
                        </button>
                      </div>
                      {resetPasswordError && (
                        <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1" id="admin-reset-password-error">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{resetPasswordError}</span>
                        </p>
                      )}
                      {resetPasswordSuccess && (
                        <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1" id="admin-reset-password-success">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                          <span>{resetPasswordSuccess}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isResettingPassword || !newPassword}
                      onClick={handleResetPasswordSubmit}
                      className="w-full py-2 rounded-lg bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                      id="submit-admin-password-reset-btn"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{isResettingPassword ? 'Resetting Password...' : 'Reset Password'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isSelfSelected}
                  onClick={() => handleStatusToggle(selectedMember.id)}
                  className={`w-full py-2.5 rounded-xl border font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    isSelfSelected
                      ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed'
                      : selectedMember.status === 'Active'
                      ? 'border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {selectedMember.status === 'Active' ? (
                    <>
                      <UserX className="w-4 h-4" />
                      <span>Deactivate Member Account</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Reactivate Member Account</span>
                    </>
                  )}
                </button>
                {isSelfSelected && (
                  <p className="text-[11px] text-amber-800 font-medium text-center mt-1.5 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>You cannot modify your own account status.</span>
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E4E4E7] flex justify-end">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
