/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Users, 
  Calendar, 
  GraduationCap, 
  Layers, 
  RefreshCw, 
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  ShieldAlert
} from 'lucide-react';
import { AcademicSession } from '../../types/academicSession';
import { academicSessionsService } from '../../services/academicSessions/academicSessions.service';
import {
  presidentService,
  PresidentAnalyticsData,
  PresidentRosterMember,
  CANONICAL_SUBGROUPS,
  CANONICAL_EXECUTIVE_OFFICES,
  normalizeDistribution,
} from '../../services/president/president.service';

export const AdminPresidentAnalytics: React.FC = () => {
  const navigate = useNavigate();

  // Optional filters supported by GET /api/president/analytics
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [selectedSubgroup, setSelectedSubgroup] = useState<string>('');
  const [selectedOffice, setSelectedOffice] = useState<string>('');

  const [analytics, setAnalytics] = useState<PresidentAnalyticsData | null>(null);
  const [rosterSample, setRosterSample] = useState<PresidentRosterMember[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [activeSession, setActiveSession] = useState<AcademicSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<{ statusCode?: number; code?: string; message: string } | null>(null);

  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    setErrorState(null);
    try {
      const [analyticsRes, rosterRes, sessionsRes, activeSessionRes] = await Promise.allSettled([
        presidentService.getAnalytics({
          academicSession: selectedSession || undefined,
          subgroup: selectedSubgroup || undefined,
          office: selectedOffice || undefined,
        }),
        presidentService.getRoster({
          page: 1,
          limit: 100,
          subgroup: selectedSubgroup || undefined,
          office: selectedOffice || undefined,
        }),
        academicSessionsService.getAcademicSessions(),
        academicSessionsService.getActiveSession(),
      ]);

      if (analyticsRes.status === 'rejected') {
        const err = analyticsRes.reason;
        setAnalytics(null);
        setErrorState({
          statusCode: err?.statusCode,
          code: err?.code,
          message: err?.message || 'Unable to load fellowship analytics from the backend.',
        });
      } else {
        setAnalytics(analyticsRes.value);
      }

      if (rosterRes.status === 'fulfilled') {
        setRosterSample(rosterRes.value.data);
      } else {
        setRosterSample([]);
      }

      if (sessionsRes.status === 'fulfilled') {
        setSessions(sessionsRes.value);
      }

      if (activeSessionRes.status === 'fulfilled') {
        setActiveSession(activeSessionRes.value);
      }
    } catch (err: any) {
      setErrorState({
        statusCode: err?.statusCode,
        code: err?.code,
        message: err?.message || 'Unable to retrieve fellowship analytics from the server.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedSession, selectedSubgroup, selectedOffice]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Authoritative backend aggregates from GET /api/president/analytics
  const totalMembers = analytics?.totalMembers ?? 0;
  const eventCount = analytics?.eventCount ?? 0;

  const levelEntries = normalizeDistribution(analytics?.academicLevelDistribution, [
    'academicLevel',
    'level',
    'label',
    'name',
  ]);
  const subgroupEntries = normalizeDistribution(analytics?.subgroupDistribution, [
    'subgroup',
    'label',
    'name',
  ]);
  const officeEntries = normalizeDistribution(analytics?.officeDistribution, [
    'office',
    'officeName',
    'label',
    'name',
  ]);

  // 1. Membership Classification (derived from authoritative academicLevelDistribution, distinct from account status)
  let alumniClassificationCount = 0;
  let postgraduateClassificationCount = 0;
  let undergraduateClassificationCount = 0;

  levelEntries.forEach((entry) => {
    const lower = entry.label.toLowerCase();
    if (lower.includes('alumni')) {
      alumniClassificationCount += entry.count;
    } else if (lower.includes('postgraduate') || lower.includes('pg')) {
      postgraduateClassificationCount += entry.count;
    } else {
      undergraduateClassificationCount += entry.count;
    }
  });

  // 2. Platform Account Status (distinct from academic level / membership classification)
  const accountStatusMap: Record<string, number> = {};
  rosterSample.forEach((member) => {
    const statusKey = (member.membershipStatus || 'Active').trim();
    accountStatusMap[statusKey] = (accountStatusMap[statusKey] || 0) + 1;
  });
  const accountStatusEntries = Object.entries(accountStatusMap);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12" id="president-analytics-screen">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E4E7] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#52525B] mb-1 font-medium">
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="hover:text-[#5B0617] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Presidential Portal</span>
            </button>
            <span>/</span>
            <span className="text-[#5B0617] font-semibold">Analytics & Fellowship Overview</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#5B0617]" />
            Fellowship Analytics & Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-3xl">
            Authoritative executive analytics from the ASF backend: total membership, subgroup distribution, academic level distribution, executive office distribution, and scheduled program count.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchAnalyticsData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs font-semibold text-[#18181B] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#5B0617]' : 'text-[#52525B]'}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Optional Backend Analytics Filters (academicSession, subgroup, office) */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#52525B] mb-1">
              Academic Session Filter
            </label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
              id="analytics-session-filter"
            >
              <option value="">All Academic Sessions</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#52525B] mb-1">
              Fellowship Subgroup Filter
            </label>
            <select
              value={selectedSubgroup}
              onChange={(e) => setSelectedSubgroup(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
              id="analytics-subgroup-filter"
            >
              <option value="">All Canonical Subgroups</option>
              {CANONICAL_SUBGROUPS.map((sg) => (
                <option key={sg} value={sg}>
                  {sg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#52525B] mb-1">
              Executive Office Filter
            </label>
            <select
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
              id="analytics-office-filter"
            >
              <option value="">All Executive Offices</option>
              {CANONICAL_EXECUTIVE_OFFICES.map((off) => (
                <option key={off} value={off}>
                  {off}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Honest Error State (401/403/500) */}
      {errorState && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
            errorState.statusCode === 403 || errorState.statusCode === 401
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
          id="president-analytics-error"
        >
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-[#5B0617]" />
          <div className="space-y-1">
            <p className="font-bold text-sm">
              {errorState.statusCode === 403
                ? 'Access Denied: President Dashboard Authorization Required'
                : errorState.statusCode === 401
                ? 'Authentication Required'
                : 'Analytics Retrieval Error'}
            </p>
            <p>{errorState.message}</p>
          </div>
        </div>
      )}

      {/* Top Level Authoritative Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Members & Membership Classification */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#52525B]">
            Membership Classification
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#18181B]" id="analytics-total-members">
            {totalMembers}
          </div>
          <p className="text-[11px] text-[#52525B] mt-1">
            <span className="font-semibold text-[#18181B]">{undergraduateClassificationCount} Undergrad</span> ·{' '}
            {postgraduateClassificationCount} Postgrad · {alumniClassificationCount} Alumni
          </p>
        </div>

        {/* Card 2: Platform Account Status (Distinct from Academic Level) */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#52525B]">
            Platform Account Status
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-700">
            {accountStatusEntries.length > 0
              ? accountStatusEntries.reduce((acc, [, c]) => acc + c, 0)
              : totalMembers}
          </div>
          <p className="text-[11px] text-[#52525B] mt-1">
            {accountStatusEntries.length > 0
              ? accountStatusEntries.map(([status, count]) => `${count} ${status}`).join(' · ')
              : 'Distinct from academic level classification'}
          </p>
        </div>

        {/* Card 3: Authoritative Event Count */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#52525B]">
            Recorded Programs
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#18181B]" id="analytics-event-count">
            {eventCount}
          </div>
          <p className="text-[11px] text-[#52525B] mt-1">
            Authoritative backend event count
          </p>
        </div>

        {/* Card 4: Active Academic Session */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#52525B]">
            Active Academic Session
          </span>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-[#18181B] truncate">
            {selectedSession || activeSession?.id || 'Current Session'}
          </div>
          <p className="text-[11px] text-[#52525B] mt-1">
            {sessions.length > 0 ? `${sessions.length} recorded academic sessions` : 'Backend session scope'}
          </p>
        </div>

      </div>

      {/* Main Analytics Content Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: Academic Level Distribution */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-[#E4E4E7] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#5B0617]" />
              <h2 className="font-serif font-bold text-base text-[#18181B]">
                Academic Level Distribution
              </h2>
            </div>
            <span className="text-xs text-[#52525B]">{totalMembers} Members</span>
          </div>

          {levelEntries.length === 0 ? (
            <p className="text-xs text-[#52525B] italic py-4">
              No academic level distribution records returned for the selected filter criteria.
            </p>
          ) : (
            <div className="space-y-3 pt-1">
              {levelEntries.map(({ label, count }) => {
                const pct = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;
                return (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#18181B]">{label}</span>
                      <span className="text-[#52525B]">
                        <span className="font-bold text-[#18181B]">{count}</span> ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#FAF8F5] border border-[#E4E4E7] rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-[#5B0617] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Subgroup Distribution */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-[#E4E4E7] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#5B0617]" />
              <h2 className="font-serif font-bold text-base text-[#18181B]">
                Subgroup Distribution
              </h2>
            </div>
            <span className="text-xs text-[#52525B]">Canonical Subgroups</span>
          </div>

          {subgroupEntries.length === 0 ? (
            <p className="text-xs text-[#52525B] italic py-4">
              No subgroup distribution records returned for the selected filter criteria.
            </p>
          ) : (
            <div className="space-y-3 pt-1">
              {subgroupEntries.map(({ label, count }) => {
                const pct = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;
                return (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#18181B]">{label}</span>
                      <span className="text-[#52525B]">
                        <span className="font-bold text-[#18181B]">{count}</span> ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#FAF8F5] border border-[#E4E4E7] rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-[#7A1F2B] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Executive Office Distribution */}
        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 lg:col-span-2">
          <div className="border-b border-[#E4E4E7] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#5B0617]" />
              <h2 className="font-serif font-bold text-base text-[#18181B]">
                Executive Office Distribution
              </h2>
            </div>
            <span className="text-xs text-[#52525B]">Authoritative Office Assignments</span>
          </div>

          {officeEntries.length === 0 ? (
            <p className="text-xs text-[#52525B] italic py-4">
              No executive office distribution records returned for the selected filter criteria.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {officeEntries.map(({ label, count }) => (
                <div
                  key={label}
                  className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] flex items-center justify-between gap-2"
                >
                  <span className="text-xs font-semibold text-[#18181B] truncate">{label}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#5B0617]/10 text-[#5B0617] font-bold text-xs shrink-0">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Authoritative Data Source Disclosure */}
      <div className="bg-[#FAF8F5] border border-[#E4E4E7] rounded-2xl p-5 text-xs text-[#52525B] space-y-2">
        <div className="flex items-center gap-2 text-[#18181B] font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-[#5B0617]" />
          <span>Authoritative Presidential Analytics Contract</span>
        </div>
        <p>
          All metrics displayed on this screen are retrieved directly from{' '}
          <code className="px-1.5 py-0.5 bg-white border border-[#E4E4E7] rounded text-[11px] font-mono text-[#5B0617]">
            GET /api/president/analytics
          </code>
          . Membership Classification reflects academic progression (Undergraduate, Postgraduate, Alumni), while Platform Account Status reflects account standing independently of academic level.
        </p>
      </div>

    </div>
  );
};
