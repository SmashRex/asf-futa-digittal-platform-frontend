/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Megaphone, 
  Calendar, 
  ImageIcon, 
  Globe, 
  ChevronRight, 
  Plus, 
  Eye, 
  Sparkles,
  Send,
  Clock,
  CheckCircle2,
  FileEdit,
  ExternalLink
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';

export const AdminPublicityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { contentItems } = useOutletContext<AdminContextType>();

  const announcements = contentItems.filter(i => i.type === 'Announcement' || !i.type);
  const publishedCount = announcements.filter(i => i.status === 'Published').length;
  const draftCount = announcements.filter(i => i.status === 'Draft').length;
  const scheduledCount = announcements.filter(i => i.status === 'Approved' || i.status === 'Pending Review').length;

  return (
    <div className="space-y-6 sm:space-y-8 select-none" id="publicity-coordinator-workspace">
      
      {/* Welcome Header */}
      <section className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-[#5B0617] text-white rounded">
              PUBLICITY WORKSPACE
            </span>
            <span className="text-xs text-[#52525B] font-medium">• Media & Communications Desk</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Welcome back, Coordinator
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl">
            This is your Publicity Workspace. Manage announcements, oversee event promotions, manage the fellowship photo gallery, and keep the public website up to date.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/content/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold transition-all shadow-sm shrink-0"
          id="publicity-create-announcement-btn"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </section>

      {/* Task List / Operational Modules */}
      <section className="flex flex-col gap-3.5">
        
        {/* Manage Announcements */}
        <div
          onClick={() => navigate('/admin/content')}
          className="group bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 flex items-center gap-4 sm:gap-6 hover:border-[#5B0617] hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#FFDADA] flex items-center justify-center shrink-0 text-[#5B0617] group-hover:scale-105 transition-transform">
            <Megaphone className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[#18181B] group-hover:text-[#5B0617] transition-colors">
                Manage Announcements
              </h3>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-full">
                {publishedCount} Published
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#52525B] mt-0.5">
              Draft, schedule, and publish weekly updates, service broadcasts, and congregational notices.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#E4E4E7] group-hover:text-[#5B0617] group-hover:translate-x-1 transition-all shrink-0" />
        </div>

        {/* Manage Events */}
        <div
          onClick={() => navigate('/admin/events')}
          className="group bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 flex items-center gap-4 sm:gap-6 hover:border-[#5B0617] hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#FFDADA] flex items-center justify-center shrink-0 text-[#5B0617] group-hover:scale-105 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-[#18181B] group-hover:text-[#5B0617] transition-colors">
              Manage Events
            </h3>
            <p className="text-xs sm:text-sm text-[#52525B] mt-0.5">
              Update event schedules, program locations, speakers, and promotional banners.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#E4E4E7] group-hover:text-[#5B0617] group-hover:translate-x-1 transition-all shrink-0" />
        </div>

        {/* Manage Gallery / Media */}
        <div
          onClick={() => navigate('/admin/media')}
          className="group bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 flex items-center gap-4 sm:gap-6 hover:border-[#5B0617] hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#FFDADA] flex items-center justify-center shrink-0 text-[#5B0617] group-hover:scale-105 transition-transform">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-[#18181B] group-hover:text-[#5B0617] transition-colors">
              Manage Gallery
            </h3>
            <p className="text-xs sm:text-sm text-[#52525B] mt-0.5">
              Upload and organize photos, event albums, and promotional flyers from recent fellowship gatherings.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#E4E4E7] group-hover:text-[#5B0617] group-hover:translate-x-1 transition-all shrink-0" />
        </div>

        {/* Edit Website Copy */}
        <div
          onClick={() => navigate('/admin/website-content')}
          className="group bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 flex items-center gap-4 sm:gap-6 hover:border-[#5B0617] hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#FFDADA] flex items-center justify-center shrink-0 text-[#5B0617] group-hover:scale-105 transition-transform">
            <Globe className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[#18181B] group-hover:text-[#5B0617] transition-colors">
                Edit Website Copy & Narrative
              </h3>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-full flex items-center gap-1">
                Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#52525B] mt-0.5">
              Edit hero headlines, narratives, core values pillars, and meeting locations on the public website.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#E4E4E7] group-hover:text-[#5B0617] group-hover:translate-x-1 transition-all shrink-0" />
        </div>

      </section>

      {/* Recent Publicity Status Stream */}
      <section className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
          <div>
            <h2 className="font-serif font-bold text-base text-[#18181B]">
              Recent Announcement Publications
            </h2>
            <p className="text-xs text-[#52525B]">Broadcasts currently visible to fellowship brethren</p>
          </div>

          <button
            onClick={() => navigate('/admin/content')}
            className="text-xs font-bold text-[#5B0617] hover:underline"
          >
            View All Content
          </button>
        </div>

        <div className="divide-y divide-[#E4E4E7]">
          {announcements.slice(0, 3).map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate(`/admin/content/preview/${item.id}`)}
              className="py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5] px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E4E4E7] flex items-center justify-center text-[#5B0617] shrink-0">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#18181B] line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-[#52525B]">{item.date || 'Active broadcast'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  item.status === 'Published' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {item.status}
                </span>
                <ChevronRight className="w-4 h-4 text-[#52525B]" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
