/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Scale, 
  Repeat, 
  Activity, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  GraduationCap, 
  Layers, 
  RefreshCw,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { EventItem } from '../../types/event';
import { eventsService } from '../../services/events/events.service';
import { academicSessionsService } from '../../services/academicSessions/academicSessions.service';
import { AcademicSession } from '../../types/academicSession';
import { formatEventDate, formatEventTime } from '../../utils/eventDate';
import {
  presidentService,
  PresidentAnalyticsData,
  PresidentRosterMember,
  CANONICAL_SUBGROUPS,
  normalizeDistribution,
} from '../../services/president/president.service';

export const AdminPresidentDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<PresidentAnalyticsData | null>(null);
  const [rosterSample, setRosterSample] = useState<PresidentRosterMember[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [activeSession, setActiveSession] = useState<AcademicSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const [analyticsRes, rosterRes, eventsRes, sessionRes] = await Promise.allSettled([
        presidentService.getAnalytics(),
        presidentService.getRoster({ page: 1, limit: 100 }),
        eventsService.getUpcomingEvents(),
        academicSessionsService.getActiveSession()
      ]);

      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value);
      } else {
        const err = analyticsRes.reason;
        setFetchError(err?.message || 'Unable to load presidential analytics from backend.');
      }

      if (rosterRes.status === 'fulfilled') {
        setRosterSample(rosterRes.value.data);
      }

      if (eventsRes.status === 'fulfilled') {
        setUpcomingEvents(eventsRes.value);
      }

      if (sessionRes.status === 'fulfilled') {
        setActiveSession(sessionRes.value);
      }
    } catch (err: any) {
      setFetchError(err?.message || 'Some live metrics could not be refreshed from the server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Authoritative total members from GET /api/president/analytics
  const totalMembers = analytics?.totalMembers ?? rosterSample.length;

  // Academic level distribution from GET /api/president/analytics
  const levelEntries = normalizeDistribution(analytics?.academicLevelDistribution, [
    'academicLevel',
    'level',
    'label',
    'name',
  ]);

  let alumniMembers = 0;
  let postgraduateMembers = 0;
  let undergraduateMembers = 0;

  levelEntries.forEach((entry) => {
    const lower = entry.label.toLowerCase();
    if (lower.includes('alumni')) {
      alumniMembers += entry.count;
    } else if (lower.includes('postgraduate') || lower.includes('pg')) {
      postgraduateMembers += entry.count;
    } else {
      undergraduateMembers += entry.count;
    }
  });

  // Platform Account Status (distinct from academic classification)
  const activeAccounts = rosterSample.filter(
    (m) => !m.membershipStatus || m.membershipStatus.toLowerCase() === 'active'
  ).length;
  const otherAccountsCount = Math.max(0, rosterSample.length - activeAccounts);

  // Subgroup distribution from GET /api/president/analytics
  const subgroupEntries = normalizeDistribution(analytics?.subgroupDistribution, [
    'subgroup',
    'label',
    'name',
  ]);
  const subgroupCountMap: Record<string, number> = {};
  subgroupEntries.forEach((e) => {
    subgroupCountMap[e.label] = e.count;
  });

  const nextProgram = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  const authoritativeEventCount = analytics?.eventCount ?? upcomingEvents.length;

  return (
    <div className="space-y-6 sm:space-y-8" id="president-portal-workspace">
      
      {/* Leadership Context Header */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#5B0617] text-white px-2 py-0.5 rounded-sm">
                EXECUTIVE OVERSIGHT
              </span>
              <span className="text-xs text-[#52525B]">
                {activeSession ? `${activeSession.id} Academic Session` : 'Active University Session'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
              Presidential Leadership Workspace
            </h1>
            <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-3xl">
              Authoritative executive oversight for the Anglican Students' Fellowship. Review fellowship roster, supervise programs calendar, review governance requests, and manage executive handovers.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={loadDashboardData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E4E4E7] bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs font-semibold text-[#18181B] transition-colors"
              title="Refresh live metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#5B0617]' : 'text-[#52525B]'}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => navigate('/admin/analytics')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-xs font-semibold text-white transition-colors shadow-xs"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Fellowship Analytics</span>
            </button>
          </div>
        </div>

        {fetchError && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{fetchError}</span>
          </div>
        )}
      </div>

      {/* Authoritative Real Backend Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Fellowship Roster */}
        <div 
          onClick={() => navigate('/admin/members')}
          className="bg-white border border-[#E4E4E7] rounded-2xl p-5 hover:border-[#5B0617]/40 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-[#5B0617]">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#52525B]">
              Fellowship Roster
            </span>
            <Users className="w-4 h-4 text-[#5B0617]" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-[#18181B] tracking-tight">{totalMembers}</div>
            <p className="text-xs text-[#52525B] mt-1">
              <span className="font-semibold text-[#18181B]">{undergraduateMembers} undergrad</span> · {postgraduateMembers} postgrad · {alumniMembers} alumni
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-[11px] font-semibold text-[#5B0617]">
            <span>Inspect Roster (View-Only)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Metric 2: Platform Account Status */}
        <div 
          onClick={() => navigate('/admin/members')}
          className="bg-white border border-[#E4E4E7] rounded-2xl p-5 hover:border-[#5B0617]/40 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-[#52525B]">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">
              Platform Account Status
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-emerald-700 tracking-tight">
              {rosterSample.length > 0 ? activeAccounts : totalMembers}
            </div>
            <p className="text-xs text-[#52525B] mt-1">
              {rosterSample.length > 0
                ? `${activeAccounts} active · ${otherAccountsCount} other standing`
                : 'Distinct from academic level'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-[11px] font-semibold text-[#5B0617]">
            <span>Account Standing</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Metric 3: Active Academic Session */}
        <div 
          onClick={() => navigate('/admin/analytics')}
          className="bg-white border border-[#E4E4E7] rounded-2xl p-5 hover:border-[#5B0617]/40 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-[#52525B]">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">
              Active Session
            </span>
            <GraduationCap className="w-4 h-4 text-[#805600]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight truncate">
              {activeSession?.id || 'Current'}
            </div>
            <p className="text-xs text-[#52525B] mt-1">
              {activeSession ? 'Authoritative calendar session' : 'Session records connected'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-[11px] font-semibold text-[#5B0617]">
            <span>Session Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Metric 4: Recorded Programs */}
        <div 
          onClick={() => navigate('/admin/programs')}
          className="bg-white border border-[#E4E4E7] rounded-2xl p-5 hover:border-[#5B0617]/40 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-[#52525B]">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">
              Fellowship Programs
            </span>
            <Calendar className="w-4 h-4 text-[#5B0617]" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-[#18181B] tracking-tight">{authoritativeEventCount}</div>
            <p className="text-xs text-[#52525B] mt-1 truncate">
              {nextProgram ? `Next: ${nextProgram.title}` : 'Programs schedule connected'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-[11px] font-semibold text-[#5B0617]">
            <span>Programs Oversight</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Main Leadership Oversight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Programs Schedule & Official Subgroups */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Programs Schedule Oversight */}
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#5B0617]/10 text-[#5B0617]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base sm:text-lg text-[#18181B]">
                    Fellowship Programs Calendar
                  </h2>
                  <p className="text-xs text-[#52525B]">
                    Authoritative upcoming spiritual gatherings, Bible studies, and prayer convocations from backend.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/admin/programs')}
                className="text-xs font-bold text-[#5B0617] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>All Programs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-[#52525B]">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#5B0617] mb-2" />
                <p className="text-xs">Loading programs from backend...</p>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF8F5] rounded-xl border border-dashed border-[#E4E4E7]">
                <Clock className="w-8 h-8 text-[#52525B] mx-auto mb-2 opacity-60" />
                <p className="text-xs font-semibold text-[#18181B]">No Upcoming Programs Scheduled</p>
                <p className="text-[11px] text-[#52525B] mt-1">
                  Programs can be scheduled by Publicity Coordinators and General Secretariat.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.slice(0, 4).map((program) => (
                  <div
                    key={program.id}
                    className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#5B0617]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-[#52525B]">
                        <span className="font-bold text-[#5B0617]">{program.category}</span>
                        <span>·</span>
                        <span>{program.mode}</span>
                        {program.status === 'Cancelled' && (
                          <>
                            <span>·</span>
                            <span className="text-rose-700 font-bold">Cancelled</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-[#18181B] leading-snug">
                        {program.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#52525B]">
                        <span>{formatEventDate(program.startTime)}</span>
                        <span>·</span>
                        <span>{formatEventTime(program.startTime)}</span>
                        <span>·</span>
                        <span>{program.location}</span>
                        {program.speaker && (
                          <>
                            <span>·</span>
                            <span>Speaker: {program.speaker}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => navigate('/admin/programs')}
                        className="px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-white text-xs font-medium text-[#18181B] hover:bg-[#FAF8F5] transition-colors"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Official Subgroup Enrolment Snapshot */}
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#5B0617]/10 text-[#5B0617]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base sm:text-lg text-[#18181B]">
                    Official Subgroup Distribution
                  </h2>
                  <p className="text-xs text-[#52525B]">
                    Distribution of fellowship members across the 9 canonical ASF subgroups.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/admin/analytics')}
                className="text-xs font-bold text-[#5B0617] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Analytics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CANONICAL_SUBGROUPS.map((sg) => {
                const count = subgroupCountMap[sg] || 0;
                const pct = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;
                return (
                  <div key={sg} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] space-y-1">
                    <span className="text-[11px] font-bold text-[#18181B] block truncate">{sg}</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-bold text-[#5B0617]">{count}</span>
                      <span className="text-[10px] text-[#52525B]">{pct}% share</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Academic Demographics & Desks Status */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Roster Level Distribution */}
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <h3 className="font-serif font-bold text-sm text-[#18181B]">Academic Level Breakdown</h3>
              <button
                onClick={() => navigate('/admin/members')}
                className="text-xs font-bold text-[#5B0617] hover:underline"
              >
                Inspect Roster
              </button>
            </div>

            {levelEntries.length === 0 ? (
              <p className="text-xs text-[#52525B] italic py-2">
                No academic level breakdown available yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {levelEntries.map(({ label, count }) => {
                  const pct = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;
                  return (
                    <div key={label} className="text-xs space-y-1">
                      <div className="flex items-center justify-between text-[#52525B]">
                        <span>{label}</span>
                        <span className="font-semibold text-[#18181B]">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#FAF8F5] border border-[#E4E4E7] rounded-full h-1.5 overflow-hidden">
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

          {/* Presidential Desks & Capability Readiness */}
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#18181B] border-b border-[#E4E4E7] pb-3">
              Presidential Desks & Workspaces
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => navigate('/admin/members')}
                className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#5B0617]" />
                  <div>
                    <span className="text-xs font-bold text-[#18181B] block">Fellowship Roster</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Connected (View-Only)</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#52525B] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/admin/programs')}
                className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#5B0617]" />
                  <div>
                    <span className="text-xs font-bold text-[#18181B] block">Programs Schedule</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Connected (View-Only)</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#52525B] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/admin/analytics')}
                className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="text-xs font-bold text-[#18181B] block">Analytics & Overview</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Connected (Live)</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#52525B] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/admin/governance')}
                className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Scale className="w-4 h-4 text-[#5B0617]" />
                  <div>
                    <span className="text-xs font-bold text-[#18181B] block">Governance & Approvals</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Connected (Live)</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#52525B] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/admin/handover')}
                className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Repeat className="w-4 h-4 text-[#5B0617]" />
                  <div>
                    <span className="text-xs font-bold text-[#18181B] block">Executive Handover</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Connected (Live)</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#52525B] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
