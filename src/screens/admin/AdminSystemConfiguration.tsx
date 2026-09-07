/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { ROLE_PERMISSIONS_MATRIX } from '../../data/adminData';
import { SystemConfiguration } from '../../types/adminTypes';
import { 
  Sliders, 
  ShieldAlert, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  HardDrive, 
  Languages, 
  Clock, 
  Power,
  RotateCcw,
  FileCheck
} from 'lucide-react';

export const AdminSystemConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const { activeRole, systemConfig, updateSystemConfig } = useOutletContext<AdminContextType>();
  const permissions = ROLE_PERMISSIONS_MATRIX[activeRole];

  // Local form state
  const [formData, setFormData] = useState<SystemConfiguration>(systemConfig);
  const [isSavedBannerVisible, setIsSavedBannerVisible] = useState<boolean>(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState<boolean>(false);

  // RBAC Access Check
  if (!permissions.canAccessSettings) {
    return (
      <div className="system-config-page p-6 bg-white rounded-2xl border border-[#E4E4E7] shadow-xs text-center max-w-xl mx-auto my-12">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#18181B] mb-2">Access Restricted</h2>
        <p className="text-sm text-[#52525B] mb-6">
          System configuration edits require Technical Administrator or Executive privileges. Your current role is <span className="font-semibold">{activeRole}</span>.
        </p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-[#5B0617] text-white rounded-xl text-sm font-semibold hover:bg-[#7A1F2B] transition-colors"
        >
          Return to Admin Dashboard
        </button>
      </div>
    );
  }

  const handleToggleMaintenance = () => {
    if (!formData.maintenanceModeActive) {
      // Prompt warning confirmation when turning ON
      setShowMaintenanceModal(true);
    } else {
      // Turn OFF immediately
      setFormData(prev => ({ ...prev, maintenanceModeActive: false }));
    }
  };

  const confirmMaintenanceOn = () => {
    setFormData(prev => ({ ...prev, maintenanceModeActive: true }));
    setShowMaintenanceModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig(formData);
    setIsSavedBannerVisible(true);
    setTimeout(() => setIsSavedBannerVisible(false), 4000);
  };

  return (
    <div className="system-config-page space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-[#5B0617]" />
            <h1 className="text-xl font-extrabold text-[#18181B] tracking-tight">System Configuration</h1>
          </div>
          <p className="text-xs text-[#52525B]">
            Manage global settings, automated policies, and technical defaults for the ASF ecosystem.
          </p>
        </div>

        <div className="text-right text-xs text-[#52525B]">
          <div>Last Updated: <span className="font-bold text-[#18181B]">{systemConfig.lastUpdated}</span></div>
          <div className="text-[11px]">{systemConfig.updatedBy}</div>
        </div>
      </div>

      {/* Save Feedback Banner */}
      {isSavedBannerVisible && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Platform configuration updated successfully! Changes applied to local administrative state.</span>
          </div>
          <button 
            onClick={() => setIsSavedBannerVisible(false)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Maintenance Mode Alert Banner if Active */}
      {formData.maintenanceModeActive && (
        <div className="maintenance-warning p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 flex items-start gap-3 text-xs">
          <Power className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-rose-950">SYSTEM MAINTENANCE MODE IS ACTIVE</h3>
            <p>
              Member application views are currently set to read-only mode and background prefetching is suspended.
            </p>
            {formData.maintenanceReason && (
              <p className="font-mono bg-rose-100 p-2 rounded text-[11px] border border-rose-200">
                Reason: {formData.maintenanceReason}
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section 1: Synchronization Policies */}
        <div className="config-section bg-white p-6 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E4E4E7]">
            <RefreshCw className="w-4 h-4 text-[#5B0617]" />
            <h2 className="font-bold text-[#18181B] text-base">Synchronization & Storage Policies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="config-field space-y-1">
              <label className="block text-xs font-bold text-[#18181B]">Auto-Sync Interval (Minutes)</label>
              <input
                type="number"
                min={1}
                max={120}
                value={formData.syncIntervalMinutes}
                onChange={(e) => setFormData(prev => ({ ...prev, syncIntervalMinutes: parseInt(e.target.value) || 15 }))}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-xs font-semibold text-[#18181B]"
              />
              <p className="text-[11px] text-[#52525B]">Frequency of background content synchronization for active devices.</p>
            </div>

            <div className="config-field space-y-1">
              <label className="block text-xs font-bold text-[#18181B]">Offline Cache Limit (MB)</label>
              <input
                type="number"
                min={10}
                max={500}
                value={formData.offlineCacheLimitMB}
                onChange={(e) => setFormData(prev => ({ ...prev, offlineCacheLimitMB: parseInt(e.target.value) || 100 }))}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-xs font-semibold text-[#18181B]"
              />
              <p className="text-[11px] text-[#52525B]">Maximum disk storage allocated for PWA offline Bible Study cache.</p>
            </div>

            <div className="config-field space-y-1">
              <label className="block text-xs font-bold text-[#18181B]">Conflict Resolution Policy</label>
              <select
                value={formData.conflictResolutionPolicy}
                onChange={(e) => setFormData(prev => ({ ...prev, conflictResolutionPolicy: e.target.value as any }))}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-xs font-semibold text-[#18181B]"
              >
                <option value="Server Wins">Server Wins (Recommended)</option>
                <option value="Client Wins">Client Wins</option>
                <option value="Manual Merge">Manual Admin Merge</option>
              </select>
              <p className="text-[11px] text-[#52525B]">Strategy applied during offline data synchronization conflicts.</p>
            </div>

          </div>
        </div>

        {/* Section 2: Technical Defaults */}
        <div className="config-section bg-white p-6 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E4E4E7]">
            <HardDrive className="w-4 h-4 text-[#5B0617]" />
            <h2 className="font-bold text-[#18181B] text-base">Technical Defaults & Limits</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="config-field space-y-1">
              <label className="block text-xs font-bold text-[#18181B]">Default Bible Study Language</label>
              <select
                value={formData.defaultStudyLanguage}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultStudyLanguage: e.target.value as any }))}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-xs font-semibold text-[#18181B]"
              >
                <option value="English">English</option>
                <option value="Yoruba">Yoruba</option>
                <option value="Bilingual">Bilingual (English + Yoruba)</option>
              </select>
              <p className="text-[11px] text-[#52525B]">Primary language setting for newly imported outlines.</p>
            </div>

            <div className="config-field space-y-1">
              <label className="block text-xs font-bold text-[#18181B]">Max Media Upload Size (MB)</label>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.maxMediaUploadSizeMB}
                onChange={(e) => setFormData(prev => ({ ...prev, maxMediaUploadSizeMB: parseInt(e.target.value) || 10 }))}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-xs font-semibold text-[#18181B]"
              />
              <p className="text-[11px] text-[#52525B]">Maximum allowed image asset file size in Media Library uploads.</p>
            </div>

            <div className="config-field space-y-1">
              <label className="block text-xs font-bold text-[#18181B]">API Timeout Duration (Seconds)</label>
              <input
                type="number"
                min={5}
                max={120}
                value={formData.apiTimeoutSeconds}
                onChange={(e) => setFormData(prev => ({ ...prev, apiTimeoutSeconds: parseInt(e.target.value) || 30 }))}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-xs font-semibold text-[#18181B]"
              />
              <p className="text-[11px] text-[#52525B]">Maximum wait time for Gemini AI proxy & API gateway pings.</p>
            </div>

          </div>
        </div>

        {/* Section 3: Maintenance Control */}
        <div className="config-section bg-white p-6 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4 text-[#5B0617]" />
              <h2 className="font-bold text-[#18181B] text-base">Platform Maintenance Controls</h2>
            </div>
            
            <button
              type="button"
              onClick={handleToggleMaintenance}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
                formData.maintenanceModeActive
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-[#E4E4E7]'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{formData.maintenanceModeActive ? 'MAINTENANCE MODE ACTIVE' : 'INACTIVE'}</span>
            </button>
          </div>

          <p className="text-xs text-[#52525B]">
            Enabling maintenance mode will restrict non-administrative users to read-only offline views.
          </p>

          {formData.maintenanceModeActive && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-[#18181B]">Maintenance Notice Message</label>
              <input
                type="text"
                value={formData.maintenanceReason || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, maintenanceReason: e.target.value }))}
                placeholder="e.g. Scheduled platform database schema upgrade..."
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-rose-300 rounded-xl text-xs font-medium text-[#18181B]"
              />
            </div>
          )}
        </div>

        {/* Section 4: Automated Policies */}
        <div className="config-section bg-white p-6 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E4E4E7]">
            <Clock className="w-4 h-4 text-[#5B0617]" />
            <h2 className="font-bold text-[#18181B] text-base">Automated Retention & Archival Policies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex items-start gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#E4E4E7]">
              <input
                type="checkbox"
                id="autoArchive"
                checked={formData.autoArchiveOutlinesSemesterEnd}
                onChange={(e) => setFormData(prev => ({ ...prev, autoArchiveOutlinesSemesterEnd: e.target.checked }))}
                className="mt-1 rounded text-[#5B0617] focus:ring-[#5B0617]"
              />
              <label htmlFor="autoArchive" className="text-xs cursor-pointer space-y-1">
                <span className="font-bold text-[#18181B] block">Auto-Archive Outlines at Semester End</span>
                <span className="text-[#52525B] block">Automatically transition published study outlines to Archived status upon academic term closure.</span>
              </label>
            </div>

            <div className="config-field space-y-1">
              <label className="block text-xs font-bold text-[#18181B]">Audit Log Retention (Days)</label>
              <input
                type="number"
                min={30}
                max={365}
                value={formData.auditLogRetentionDays}
                onChange={(e) => setFormData(prev => ({ ...prev, auditLogRetentionDays: parseInt(e.target.value) || 90 }))}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-xs font-semibold text-[#18181B]"
              />
              <p className="text-[11px] text-[#52525B]">Number of days before administrative audit logs are compressed.</p>
            </div>

          </div>
        </div>

        {/* Submit Actions Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setFormData(systemConfig)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E4E4E7] text-[#52525B] hover:text-[#18181B] rounded-xl text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Changes</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#5B0617] text-white rounded-xl text-xs font-bold hover:bg-[#7A1F2B] shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save System Configuration</span>
          </button>
        </div>

      </form>

      {/* Confirmation Modal when turning ON Maintenance Mode */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-[#E4E4E7] p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg text-[#18181B]">Enable System Maintenance Mode?</h3>
              <p className="text-xs text-[#52525B]">
                This action will notify all active sessions and toggle member applications into read-only offline mode.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#18181B]">Reason / Maintenance Notice</label>
              <input
                type="text"
                value={formData.maintenanceReason || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, maintenanceReason: e.target.value }))}
                placeholder="e.g. Scheduled platform database schema upgrade..."
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-xs font-medium text-[#18181B]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowMaintenanceModal(false)}
                className="flex-1 py-2.5 border border-[#E4E4E7] rounded-xl text-xs font-semibold text-[#52525B] hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmMaintenanceOn}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
              >
                Enable Maintenance
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
