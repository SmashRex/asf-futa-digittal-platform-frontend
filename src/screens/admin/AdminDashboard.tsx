/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminFSCoordinatorDashboard } from './AdminFSCoordinatorDashboard';
import { AdminPublicityDashboard } from './AdminPublicityDashboard';
import { AdminBibleStudyDashboard } from './AdminBibleStudyDashboard';
import { AdminPresidentDashboard } from './AdminPresidentDashboard';
import { 
  BookOpen, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Archive, 
  Upload,
  RefreshCw,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  FilePlus,
  Send,
  Calendar,
  Users,
  Megaphone,
  Image as ImageIcon,
  MoreVertical,
  Eye,
  ExternalLink,
  Repeat,
  Scale,
  Activity
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activeRole, contentItems, members, systemHealth, hasPermission } = useOutletContext<AdminContextType>();

  // If the active role is President / Executive, render the dedicated Presidential Leadership Workspace
  if (activeRole === 'President / Executive') {
    return <AdminPresidentDashboard />;
  }

  // If the active role is VP / FS Coordinator, render the dedicated FS Coordinator Dashboard
  if (activeRole === 'VP / FS Coordinator') {
    return <AdminFSCoordinatorDashboard />;
  }

  // If the active role is Publicity Coordinator, render the dedicated Publicity Workspace
  if (activeRole === 'Publicity Coordinator') {
    return <AdminPublicityDashboard />;
  }

  // If the active role is Bible Study Coordinator, render the dedicated Bible Study Workspace
  if (activeRole === 'Bible Study Coordinator') {
    return <AdminBibleStudyDashboard />;
  }

  const isGenSecRole = activeRole === 'General Secretary';

  // Calculate real statistics from authoritative state
  const publishedCount = contentItems.filter(i => i.status === 'Published').length;
  const draftCount = contentItems.filter(i => i.status === 'Draft').length;
  const readyForReviewCount = contentItems.filter(i => i.status === 'Pending Review' || i.status === 'Approved').length;
  const needsAttentionCount = contentItems.filter(i => i.status === 'Revision Requested').length;
  const pendingItems = contentItems.filter(i => i.status === 'Pending Review' || i.status === 'Revision Requested');

  return (
    <div className="space-y-6 sm:space-y-8" id="admin-dashboard-screen">
      
      {/* Top Welcome Banner */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-[#5B0617] text-white rounded">
              EXECUTIVE WORKSPACE
            </span>
            <span className="text-xs text-[#52525B] font-medium">• {activeRole}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Peace and greetings, {activeRole.split('/')[0].trim()}
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1">
            Role-scoped executive workspace for Anglican Students' Fellowship digital operations.
          </p>
        </div>

        {/* Action Buttons based on Role Permissions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {hasPermission('announcements.create') && (
            <button
              onClick={() => navigate('/admin/content/new')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Announcement</span>
            </button>
          )}

          {hasPermission('events.create') && (
            <button
              onClick={() => navigate('/admin/events')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#5B0617] text-[#5B0617] hover:bg-[#5B0617]/5 text-xs font-bold transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Manage Events</span>
            </button>
          )}

          {hasPermission('members.create') && (
            <button
              onClick={() => navigate('/admin/members')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-[#18181B] hover:bg-[#F3EFEA] text-xs font-bold transition-all"
            >
              <Users className="w-4 h-4 text-[#5B0617]" />
              <span>Manage Roster</span>
            </button>
          )}
        </div>
      </div>

      {/* Overview Stats Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Stat 1: Total Fellowship Members */}
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#5B0617]/30 transition-colors">
          <div className="flex items-center justify-between text-[#5B0617]">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Registered Members</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#18181B]">{members.length}</div>
            <span className="text-[11px] text-[#52525B]">Active chapter directory</span>
          </div>
        </div>

        {/* Stat 2: Active Published Content */}
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-emerald-800">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Published Content</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#18181B]">{publishedCount}</div>
            <span className="text-[11px] text-[#52525B]">Live on member app</span>
          </div>
        </div>

        {/* Stat 3: Pending Review */}
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-[#805600]">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <FileCheck className="w-4 h-4" />
              <span>Pending Review</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-900 rounded font-bold">{readyForReviewCount}</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#18181B]">{readyForReviewCount}</div>
            <span className="text-[11px] text-[#52525B]">Awaiting approval</span>
          </div>
        </div>

        {/* Stat 4: Needs Attention */}
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-colors">
          <div className="flex items-center justify-between text-rose-700">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>Needs Action</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#18181B]">{needsAttentionCount}</div>
            <span className="text-[11px] text-[#52525B]">Items requiring updates</span>
          </div>
        </div>

      </div>

      {/* Main Administrative Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Activities & Content Queue */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Pending Items Queue */}
          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#5B0617]/10 text-[#5B0617]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base sm:text-lg text-[#18181B]">
                    Pending Administrative Items
                  </h2>
                  <p className="text-xs text-[#52525B]">
                    Announcements and study outlines currently requiring executive review or approval.
                  </p>
                </div>
              </div>

              {hasPermission('announcements.view') && (
                <button 
                  onClick={() => navigate('/admin/content')}
                  className="text-xs font-bold text-[#5B0617] hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {pendingItems.length === 0 ? (
              <div className="p-6 text-center bg-[#FAF8F5] rounded-xl border border-dashed border-[#E4E4E7]">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-[#18181B]">Queue Clear!</p>
                <p className="text-xs text-[#52525B] mt-0.5">No administrative items currently awaiting review.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingItems.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#5B0617]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.status} size="sm" />
                        <span className="text-xs font-semibold text-[#52525B]">
                          {item.type || 'Announcement'} • {item.keyScripture || 'General'}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#18181B]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#52525B]">
                        Submitted by <span className="font-medium text-[#18181B]">{item.author}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {hasPermission('announcements.view') && (
                        <button
                          onClick={() => navigate(`/admin/content/preview/${item.id}`)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-[#E4E4E7] hover:bg-[#FAF8F5] text-xs font-medium text-[#18181B] transition-colors"
                        >
                          Preview
                        </button>
                      )}
                      {hasPermission('announcements.edit') && (
                        <button
                          onClick={() => navigate(`/admin/content/edit/${item.id}`)}
                          className="px-3 py-1.5 rounded-lg bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-colors"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Executive Shortcuts & Active Theme */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Executive Shortcuts */}
          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-sm space-y-3">
            <h2 className="font-serif font-bold text-base text-[#18181B] border-b border-[#E4E4E7] pb-3">
              Executive Shortcuts
            </h2>

            <div className="space-y-2">
              {hasPermission('leadership.view') && (
                <button
                  onClick={() => navigate('/admin/leadership')}
                  className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-[#5B0617]" />
                    <div>
                      <h3 className="font-bold text-xs text-[#18181B]">Leadership & Roles</h3>
                      <p className="text-[10px] text-[#52525B]">Executive offices & permissions</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#52525B]" />
                </button>
              )}

              {hasPermission('handover.view') && (
                <button
                  onClick={() => navigate('/admin/handover')}
                  className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <Repeat className="w-4 h-4 text-[#805600]" />
                    <div>
                      <h3 className="font-bold text-xs text-[#18181B]">Executive Handover</h3>
                      <p className="text-[10px] text-[#52525B]">Transition executive office</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#52525B]" />
                </button>
              )}

              {hasPermission('governance.view') && (
                <button
                  onClick={() => navigate('/admin/governance')}
                  className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <Scale className="w-4 h-4 text-purple-700" />
                    <div>
                      <h3 className="font-bold text-xs text-[#18181B]">Governance & Approvals</h3>
                      <p className="text-[10px] text-[#52525B]">Review executive requests</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#52525B]" />
                </button>
              )}

              {hasPermission('system.health.view') && (
                <button
                  onClick={() => navigate('/admin/system-health')}
                  className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] hover:border-[#5B0617] hover:bg-white text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-emerald-700" />
                    <div>
                      <h3 className="font-bold text-xs text-[#18181B]">System Operations</h3>
                      <p className="text-[10px] text-[#52525B]">Health & platform diagnostics</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#52525B]" />
                </button>
              )}
            </div>
          </div>

          {/* Active Annual Theme Card */}
          <div className="bg-[#5B0617] text-white p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                ACTIVE FELLOWSHIP THEME
              </span>
            </div>
            <p className="font-serif font-bold text-base leading-snug text-white">
              "The Reign of God: Marriage And Christian Lifestyle"
            </p>
            <p className="text-xs text-white/80 leading-relaxed">
              Anglican Students' Fellowship Platform Management • Executive Council Operations.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

