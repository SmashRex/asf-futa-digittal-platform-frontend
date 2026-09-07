/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { 
  LeadershipRole, 
  AdminRole, 
  AuthorityLevel, 
  getAuthorityLevelForRole,
  getAuthorityScopeForRole 
} from '../../types/adminTypes';
import { 
  UserCheck, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Building2, 
  GraduationCap, 
  ArrowRight,
  FileText,
  Crown,
  Award,
  BookOpen,
  Radio,
  Layers,
  ChevronRight
} from 'lucide-react';

export const AdminLeadership: React.FC = () => {
  const { leadershipRoles, members, updateLeadershipRole, updateMemberOverrides, addAuditLog } = useOutletContext<AdminContextType>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Global Authority' | 'FS Authority' | 'Domain & Coordinators'>('All');
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState<LeadershipRole | null>(null);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [selectedMemberIdForReassign, setSelectedMemberIdForReassign] = useState('');

  // Filter roles based on search and category
  const filteredRoles = leadershipRoles.filter(role => {
    const scope = getAuthorityScopeForRole(role.roleName);
    const matchesSearch = role.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          role.assignedMember.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (role.domain && role.domain.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesCategory = true;
    if (selectedCategory === 'Global Authority') {
      matchesCategory = scope.isGlobal;
    } else if (selectedCategory === 'FS Authority') {
      matchesCategory = scope.isFSLead;
    } else if (selectedCategory === 'Domain & Coordinators') {
      matchesCategory = !scope.isGlobal && !scope.isFSLead;
    }

    return matchesSearch && matchesCategory;
  });

  const globalRoles = filteredRoles.filter(r => getAuthorityScopeForRole(r.roleName).isGlobal);
  const fsRoles = filteredRoles.filter(r => getAuthorityScopeForRole(r.roleName).isFSLead);
  const domainAndCoordRoles = filteredRoles.filter(r => {
    const s = getAuthorityScopeForRole(r.roleName);
    return !s.isGlobal && !s.isFSLead;
  });

  const getHandoverBadge = (status: LeadershipRole['handoverStatus']) => {
    switch (status) {
      case 'Ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Ready ({status})
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </span>
        );
      case 'Needs Attention':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Needs Attention
          </span>
        );
    }
  };

  const getAuthorityBadge = (roleName: AdminRole) => {
    const scope = getAuthorityScopeForRole(roleName);

    if (scope.isGlobal) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-950 border border-purple-300 shadow-2xs">
          <Crown className="w-3 h-3 text-purple-800" />
          Global Authority — Highest Overall
        </span>
      );
    }

    if (scope.isFSLead) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs">
          <BookOpen className="w-3 h-3 text-amber-800" />
          FS Domain Authority — Head of Foundational School
        </span>
      );
    }

    if (roleName === 'Publicity Coordinator') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-200">
          <Radio className="w-3 h-3 text-sky-700" />
          Domain Lead — Publicity & Media
        </span>
      );
    }

    if (roleName === 'Bible Study Coordinator') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200">
          <BookOpen className="w-3 h-3 text-emerald-700" />
          Domain Lead — Bible Study Curriculum
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-300">
        <UserCheck className="w-3 h-3 text-stone-600" />
        {scope.title}
      </span>
    );
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleForDetail || !selectedMemberIdForReassign) return;

    const targetMember = members.find(m => m.id === selectedMemberIdForReassign);
    if (!targetMember) return;

    updateLeadershipRole(selectedRoleForDetail.id, {
      assignedMember: {
        id: targetMember.id,
        name: targetMember.name,
        email: targetMember.email,
        department: targetMember.department,
        level: targetMember.level,
        phone: targetMember.phone
      },
      status: 'Active'
    });

    addAuditLog('Reassigned Role Leadership', selectedRoleForDetail.roleName, `New Assignee: ${targetMember.name}`);
    setIsReassignModalOpen(false);
    setSelectedRoleForDetail(prev => prev ? {
      ...prev,
      assignedMember: {
        id: targetMember.id,
        name: targetMember.name,
        email: targetMember.email,
        department: targetMember.department,
        level: targetMember.level,
        phone: targetMember.phone
      }
    } : null);
  };

  const renderRoleCard = (role: LeadershipRole, borderType: 'global' | 'fs' | 'standard' = 'standard') => {
    const scope = getAuthorityScopeForRole(role.roleName);

    let borderClass = 'hover:border-[#7A1F2B]';
    if (borderType === 'global') {
      borderClass = 'border-2 border-purple-500 bg-gradient-to-br from-purple-50/40 via-white to-stone-50 ring-2 ring-purple-400/20';
    } else if (borderType === 'fs') {
      borderClass = 'border-2 border-amber-500/80 bg-gradient-to-br from-amber-50/40 via-white to-stone-50 ring-2 ring-amber-400/20';
    }

    return (
      <div
        key={role.id}
        className={`leadership-role-card card-surface p-5 flex flex-col justify-between transition-all relative group shadow-xs ${borderClass}`}
        id={`role-card-${role.id}`}
      >
        <div>
          {/* Header: Authority Badge & Handover Status */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-col gap-1">
              {getAuthorityBadge(role.roleName)}
              <h3 className="leadership-role-title text-base font-bold text-[#18181B] leading-snug mt-1">
                {role.roleName}
              </h3>
              {role.domain && (
                <span className="text-[11px] font-semibold text-[#5B0617] flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  Domain: {role.domain}
                </span>
              )}
            </div>

            {getHandoverBadge(role.handoverStatus)}
          </div>

          {/* Role Description */}
          <p className="text-xs text-[#52525B] leading-relaxed mb-4">
            {role.description}
          </p>

          {/* Assigned Leader Profile Box */}
          <div className="bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl p-3 mb-4 space-y-1">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full font-black flex items-center justify-center text-xs shrink-0 shadow-xs ${
                scope.isGlobal ? 'bg-purple-900 text-white' : scope.isFSLead ? 'bg-amber-700 text-white' : 'bg-[#7A1F2B] text-white'
              }`}>
                {role.assignedMember.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#18181B] truncate flex items-center gap-1.5">
                  <span>{role.assignedMember.name}</span>
                  {scope.isGlobal && (
                    <span className="text-[9px] font-black bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded">
                      President
                    </span>
                  )}
                  {scope.isFSLead && (
                    <span className="text-[9px] font-black bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                      FS Coordinator
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-[#52525B] truncate">
                  {role.assignedMember.department} • {role.assignedMember.level}
                </p>
              </div>
            </div>
          </div>

          {/* Handover Readiness Mini Progress */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-[#52525B]">Continuity Readiness</span>
              <span className="font-bold text-[#18181B]">{role.handoverReadinessPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  role.handoverReadinessPercent >= 80
                    ? 'bg-emerald-600'
                    : role.handoverReadinessPercent >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${role.handoverReadinessPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Inspect Scope Action Button */}
        <button
          onClick={() => setSelectedRoleForDetail(role)}
          className={`w-full text-xs py-2 px-3 flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors ${
            scope.isGlobal
              ? 'bg-purple-900 text-white hover:bg-purple-950 shadow-2xs'
              : scope.isFSLead
              ? 'bg-amber-800 text-white hover:bg-amber-900 shadow-2xs'
              : 'btn-secondary hover:bg-[#7A1F2B] hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Inspect Authority & Domain Scope</span>
        </button>
      </div>
    );
  };

  return (
    <div className="leadership-page space-y-6 max-w-7xl mx-auto pb-12" id="leadership-matrix-view">
      
      {/* Page Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E4E4E7] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#52525B] mb-1 font-medium">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#7A1F2B] font-semibold">Organizational Leadership & Domain Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-[#7A1F2B]" />
            Executive Leadership & Domain Governance
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl">
            Domain-scoped governance of ASF FUTA. The President holds the highest overall authority in the fellowship, while the VP / FS Coordinator exercises domain authority over the Foundational School.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/admin/handover')}
            className="btn-primary text-xs sm:text-sm flex items-center gap-2 py-2.5 px-4 shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Go to Handover Dashboard</span>
          </button>
        </div>
      </div>

      {/* Domain-Scoped Architecture Guide Callout */}
      <div className="bg-gradient-to-r from-purple-950 via-[#5B0617] to-amber-950 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-purple-500/30">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-purple-200 shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-purple-400 text-purple-950 px-2 py-0.5 rounded font-mono">
                Domain-Scoped Authority Architecture
              </span>
              <span className="text-xs text-purple-200 font-medium hidden sm:inline">
                Fellowship Governance Principles
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              President = Global Authority • VP = Foundational School Authority
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs text-purple-100/90 leading-relaxed">
              <div className="bg-black/20 p-2.5 rounded-lg border border-white/10">
                <span className="font-bold text-purple-300 block mb-0.5">1. Global Fellowship Authority (President)</span>
                Highest overall leadership in ASF FUTA. Presides over the Executive Council, ratifies fellowship policies, and oversees general governance.
              </div>
              <div className="bg-black/20 p-2.5 rounded-lg border border-white/10">
                <span className="font-bold text-amber-300 block mb-0.5">2. Foundational School Authority (VP / FS Coordinator)</span>
                Highest authority specifically within the Foundational School (discipleship induction, teacher follow-up, curricula, and student progress).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-surface p-4 flex items-center justify-between border-l-4 border-l-purple-700">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#52525B]">Highest Overall Authority</p>
            <p className="text-lg font-black text-[#18181B] mt-0.5">President / Executive</p>
            <p className="text-[11px] text-purple-700 font-medium">Brother David Olatunji</p>
          </div>
          <Crown className="w-8 h-8 text-purple-700 opacity-80" />
        </div>

        <div className="card-surface p-4 flex items-center justify-between border-l-4 border-l-amber-600">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#52525B]">Foundational School Authority</p>
            <p className="text-lg font-black text-[#18181B] mt-0.5">VP / FS Coordinator</p>
            <p className="text-[11px] text-amber-700 font-medium">Sister Mary Bamidele</p>
          </div>
          <BookOpen className="w-8 h-8 text-amber-600 opacity-80" />
        </div>

        <div className="card-surface p-4 flex items-center justify-between border-l-4 border-l-emerald-600">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#52525B]">Active Leadership Offices</p>
            <p className="text-2xl font-black text-[#18181B] mt-0.5">
              {leadershipRoles.filter(r => r.status === 'Active').length} / {leadershipRoles.length}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">All Executive & Departmental Units</p>
          </div>
          <UserCheck className="w-8 h-8 text-emerald-600 opacity-80" />
        </div>
      </div>

      {/* Controls Bar: Search & Level Tabs */}
      <div className="card-surface p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search role, leader name, domain..."
            className="input-box pl-10 text-xs sm:text-sm py-2"
          />
        </div>

        {/* Authority Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['All', 'Global Authority', 'FS Authority', 'Domain & Coordinators'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#7A1F2B] text-white shadow-xs'
                  : 'bg-stone-100 text-[#52525B] hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: GLOBAL OVERALL AUTHORITY (PRESIDENT) */}
      {globalRoles.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-purple-500 pb-2">
            <Crown className="w-5 h-5 text-purple-700" />
            <h2 className="text-base font-extrabold text-[#18181B] uppercase tracking-wider">
              Global Overall Fellowship Authority
            </h2>
            <span className="text-xs text-stone-500 font-medium ml-2">
              (President / Executive — Overall Executive Leadership & Governance)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {globalRoles.map(role => renderRoleCard(role, 'global'))}
          </div>
        </section>
      )}

      {/* SECTION 2: FOUNDATIONAL SCHOOL AUTHORITY (VP / FS COORDINATOR) */}
      {fsRoles.length > 0 && (
        <section className="space-y-3 pt-4">
          <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <h2 className="text-base font-extrabold text-[#18181B] uppercase tracking-wider">
              Foundational School Authority
            </h2>
            <span className="text-xs text-stone-500 font-medium ml-2">
              (VP / FS Coordinator — Discipleship, Induction & Spiritual Mentorship)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fsRoles.map(role => renderRoleCard(role, 'fs'))}
          </div>
        </section>
      )}

      {/* SECTION 3: MINISTRY & DEPARTMENTAL DOMAINS */}
      {domainAndCoordRoles.length > 0 && (
        <section className="space-y-3 pt-4">
          <div className="flex items-center gap-2 border-b border-stone-300 pb-2">
            <Layers className="w-5 h-5 text-[#7A1F2B]" />
            <h2 className="text-base font-extrabold text-[#18181B] uppercase tracking-wider">
              Ministry & Departmental Domain Authorities
            </h2>
            <span className="text-xs text-stone-500 font-medium ml-2">
              (Publicity, Bible Study, Secretariat, Organizing, Prayer & Operational Units)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {domainAndCoordRoles.map(role => renderRoleCard(role, 'standard'))}
          </div>
        </section>
      )}

      {/* Role Detail Modal */}
      {selectedRoleForDetail && (
        <div className="modal-overlay" id="role-scope-modal">
          <div className="modal-content max-w-xl p-0 overflow-hidden">
            {/* Header */}
            {(() => {
              const scope = getAuthorityScopeForRole(selectedRoleForDetail.roleName);
              const headerBg = scope.isGlobal
                ? 'bg-gradient-to-r from-purple-950 to-purple-800'
                : scope.isFSLead
                ? 'bg-gradient-to-r from-amber-950 to-amber-800'
                : 'bg-[#7A1F2B]';

              return (
                <div className={`p-5 flex items-start justify-between text-white ${headerBg}`}>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white mb-1">
                      {scope.title}
                    </span>
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                      <span>{selectedRoleForDetail.roleName}</span>
                      {scope.isGlobal && <Crown className="w-5 h-5 text-purple-300" />}
                      {scope.isFSLead && <BookOpen className="w-5 h-5 text-amber-300" />}
                    </h2>
                    <p className="text-xs text-stone-200 mt-0.5">
                      {scope.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedRoleForDetail(null)}
                    className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              );
            })()}

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Domain & Authority Summary */}
              {selectedRoleForDetail.domain && (
                <div className="bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5B0617]">
                    <Layers className="w-4 h-4" />
                    <span>Domain: {selectedRoleForDetail.domain}</span>
                  </div>
                  {selectedRoleForDetail.domainDescription && (
                    <p className="text-xs text-[#52525B] leading-relaxed">
                      {selectedRoleForDetail.domainDescription}
                    </p>
                  )}
                </div>
              )}

              {/* Assigned Leader Card */}
              <div>
                <h4 className="text-xs font-bold text-[#52525B] uppercase tracking-wider mb-2">
                  Assigned Leader
                </h4>
                <div className="bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7A1F2B] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {selectedRoleForDetail.assignedMember.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-[#18181B]">
                        {selectedRoleForDetail.assignedMember.name}
                      </h5>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#52525B] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#52525B]" />
                          {selectedRoleForDetail.assignedMember.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-[#52525B]" />
                          {selectedRoleForDetail.assignedMember.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMemberIdForReassign(selectedRoleForDetail.assignedMember.id);
                      setIsReassignModalOpen(true);
                    }}
                    className="btn-tertiary text-xs px-2.5 py-1.5 border border-[#E4E4E7] hover:border-[#7A1F2B]"
                  >
                    Reassign
                  </button>
                </div>
              </div>

              {/* Technical Administration Capability Override */}
              {(() => {
                const assignedMem = members.find(m => m.id === selectedRoleForDetail.assignedMember.id || m.name.toLowerCase() === selectedRoleForDetail.assignedMember.name.toLowerCase());
                const isTechAdminAssigned = assignedMem?.permissionOverrides?.granted?.includes('system.technicalAdmin');

                const handleToggleTechAdmin = () => {
                  if (!assignedMem) return;
                  const currentGranted = assignedMem.permissionOverrides?.granted || [];
                  const currentRevoked = assignedMem.permissionOverrides?.revoked || [];

                  let newGranted: typeof currentGranted;
                  if (isTechAdminAssigned) {
                    newGranted = currentGranted.filter(k => k !== 'system.technicalAdmin');
                  } else {
                    newGranted = [...currentGranted, 'system.technicalAdmin'];
                  }

                  updateMemberOverrides(assignedMem.id, {
                    granted: newGranted,
                    revoked: currentRevoked
                  });
                  addAuditLog('Updated Capability Override', assignedMem.name, `Technical Administration: ${!isTechAdminAssigned ? 'Assigned' : 'Revoked'}`);
                };

                return (
                  <div className="p-4 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#7A1F2B]" />
                        <span className="text-xs font-bold text-[#18181B]">Technical Administration Capability</span>
                      </div>

                      <button
                        onClick={handleToggleTechAdmin}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          isTechAdminAssigned
                            ? 'bg-purple-900 text-white shadow-xs'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        {isTechAdminAssigned ? 'Capability Assigned' : 'Assign Technical Admin'}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#52525B]">
                      Grants platform diagnostics, system health monitoring, technical logs, and system configuration access to this officer.
                    </p>
                  </div>
                );
              })()}

              {/* Responsibilities List */}
              <div>
                <h4 className="text-xs font-bold text-[#52525B] uppercase tracking-wider mb-2">
                  Core Responsibilities
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#18181B]">
                  {selectedRoleForDetail.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <CheckCircle2 className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Transition Status */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#18181B]">Transition Readiness</span>
                  {getHandoverBadge(selectedRoleForDetail.handoverStatus)}
                </div>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#7A1F2B]" 
                    style={{ width: `${selectedRoleForDetail.handoverReadinessPercent}%` }} 
                  />
                </div>
                <p className="text-[11px] text-[#52525B]">
                  Last updated: {selectedRoleForDetail.lastUpdated}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-[#FAF8F5] border-t border-[#E4E4E7] flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedRoleForDetail(null)}
                className="btn-tertiary text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedRoleForDetail(null);
                  navigate('/admin/handover');
                }}
                className="btn-primary text-xs flex items-center gap-1.5 py-2 px-3"
              >
                <span>Update Transition Checklist</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Member Modal */}
      {isReassignModalOpen && selectedRoleForDetail && (
        <div className="modal-overlay" id="reassign-role-modal">
          <div className="modal-content p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <h3 className="text-base font-bold text-[#18181B]">
                Reassign Role: {selectedRoleForDetail.roleName}
              </h3>
              <button onClick={() => setIsReassignModalOpen(false)}>
                <X className="w-5 h-5 text-[#52525B]" />
              </button>
            </div>

            <form onSubmit={handleReassignSubmit} className="space-y-4">
              <div>
                <label className="input-label text-xs">Select New Member Assignee</label>
                <select
                  value={selectedMemberIdForReassign}
                  onChange={(e) => setSelectedMemberIdForReassign(e.target.value)}
                  className="input-box text-xs py-2"
                  required
                >
                  <option value="">-- Choose Member --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.department} - {m.subgroup})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReassignModalOpen(false)}
                  className="btn-tertiary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
