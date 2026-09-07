/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { ROLE_PERMISSIONS_MATRIX } from '../../data/adminData';
import { 
  Settings, 
  Shield, 
  Check, 
  X, 
  Download, 
  Save, 
  Sparkles, 
  BookOpen, 
  Bell, 
  Database,
  CheckCircle2,
  Lock,
  User,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { activeRole, contentItems, members, auditLogs, hasPermission } = useOutletContext<AdminContextType>();

  // Determine allowed setting tabs based on effective permissions
  const canAccessGeneral = hasPermission('system.configuration.view') || hasPermission('governance.view') || hasPermission('leadership.view');
  const canAccessWorkflow = hasPermission('governance.view') || hasPermission('system.configuration.view');
  const canAccessRoles = hasPermission('leadership.view') || hasPermission('governance.view');
  const canAccessDistribution = hasPermission('announcements.view') || hasPermission('bibleStudy.view') || hasPermission('system.configuration.view');
  const canAccessBackup = hasPermission('system.technicalAdmin') || hasPermission('system.configuration.edit') || hasPermission('system.dataBackup');

  type SettingTab = 'Personal' | 'General' | 'Workflow' | 'Roles' | 'Distribution' | 'Backup';

  const [activeTab, setActiveTab] = useState<SettingTab>('Personal');
  
  // Settings Form State
  const [fellowshipName, setFellowshipName] = useState('Anglican Students\' Fellowship (ASF FUTA)');
  const [semesterTheme, setSemesterTheme] = useState('Arise, Shine! For thy light is come.');
  const [academicSession, setAcademicSession] = useState('2025/2026 Session');
  const [requireTwoStepReview, setRequireTwoStepReview] = useState(true);
  const [defaultBibleVersion, setDefaultBibleVersion] = useState('KJV');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Personal Settings State
  const [themePreference, setThemePreference] = useState<'Light' | 'Dark' | 'System'>('Light');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportJSON = () => {
    if (!canAccessBackup) return;

    const backupData = {
      exportedAt: new Date().toISOString(),
      fellowshipName,
      semesterTheme,
      contentItems,
      members,
      auditLogs
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asf_admin_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12" id="admin-settings-screen">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E4E7] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Settings & Governance
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-0.5">
            Personal preferences and platform configuration scoped to your active permissions ({activeRole}).
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings updated successfully!</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-2 shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('Personal')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'Personal'
              ? 'bg-[#5B0617] text-white shadow-xs'
              : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#FAF8F5]'
          }`}
        >
          Personal Preferences
        </button>

        {canAccessGeneral && (
          <button
            onClick={() => setActiveTab('General')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'General'
                ? 'bg-[#5B0617] text-white shadow-xs'
                : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#FAF8F5]'
            }`}
          >
            General Platform
          </button>
        )}

        {canAccessWorkflow && (
          <button
            onClick={() => setActiveTab('Workflow')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'Workflow'
                ? 'bg-[#5B0617] text-white shadow-xs'
                : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#FAF8F5]'
            }`}
          >
            Workflow & Approvals
          </button>
        )}

        {canAccessRoles && (
          <button
            onClick={() => setActiveTab('Roles')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'Roles'
                ? 'bg-[#5B0617] text-white shadow-xs'
                : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#FAF8F5]'
            }`}
          >
            Role Matrix (RBAC)
          </button>
        )}

        {canAccessDistribution && (
          <button
            onClick={() => setActiveTab('Distribution')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'Distribution'
                ? 'bg-[#5B0617] text-white shadow-xs'
                : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#FAF8F5]'
            }`}
          >
            Scripture & Versions
          </button>
        )}

        {canAccessBackup && (
          <button
            onClick={() => setActiveTab('Backup')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'Backup'
                ? 'bg-[#5B0617] text-white shadow-xs'
                : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#FAF8F5]'
            }`}
          >
            Data Snapshot & Export
          </button>
        )}
      </div>

      {/* TAB 0: PERSONAL PREFERENCES (All Users) */}
      {activeTab === 'Personal' && (
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-5">
          <h2 className="font-serif font-bold text-base text-[#18181B] border-b border-[#E4E4E7] pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[#5B0617]" />
            <span>Personal Preferences & Appearance</span>
          </h2>

          <div className="space-y-4 text-xs">
            {/* Theme Preference */}
            <div>
              <label className="font-semibold text-[#18181B] block mb-2">Display Theme Mode</label>
              <div className="grid grid-cols-3 gap-3 max-w-sm">
                {(['Light', 'Dark', 'System'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setThemePreference(mode)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      themePreference === mode
                        ? 'border-[#5B0617] bg-[#5B0617]/5 text-[#5B0617] font-bold'
                        : 'border-[#E4E4E7] bg-[#FAF8F5] text-[#52525B] hover:bg-white'
                    }`}
                  >
                    {mode === 'Light' && <Sun className="w-4 h-4" />}
                    {mode === 'Dark' && <Moon className="w-4 h-4" />}
                    {mode === 'System' && <Laptop className="w-4 h-4" />}
                    <span>{mode}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-2 pt-3 border-t border-[#E4E4E7]">
              <label className="font-semibold text-[#18181B] block">Notification Channels</label>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="rounded text-[#5B0617] focus:ring-[#5B0617]"
                />
                <div>
                  <span className="font-bold text-[#18181B] block">Email Notifications</span>
                  <span className="text-[#52525B]">Receive email alerts for published announcements and assigned duties.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={(e) => setPushNotifs(e.target.checked)}
                  className="rounded text-[#5B0617] focus:ring-[#5B0617]"
                />
                <div>
                  <span className="font-bold text-[#18181B] block">App Push Alerts</span>
                  <span className="text-[#52525B]">In-app notification badge counters for upcoming fellowship events.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: GENERAL PLATFORM */}
      {activeTab === 'General' && canAccessGeneral && (
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-base text-[#18181B] border-b border-[#E4E4E7] pb-3">
            Fellowship Platform Identity
          </h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#18181B]">Fellowship Official Title</label>
              <input
                type="text"
                value={fellowshipName}
                onChange={(e) => setFellowshipName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#18181B]">Active Semester Theme</label>
              <input
                type="text"
                value={semesterTheme}
                onChange={(e) => setSemesterTheme(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] font-serif font-bold text-[#5B0617] text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#18181B]">Academic Session / Calendar Year</label>
              <input
                type="text"
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORKFLOW & APPROVALS */}
      {activeTab === 'Workflow' && canAccessWorkflow && (
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-base text-[#18181B] border-b border-[#E4E4E7] pb-3">
            Content Review & Approval Mandates
          </h2>

          <div className="space-y-4 text-xs">
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] cursor-pointer">
              <input
                type="checkbox"
                checked={requireTwoStepReview}
                onChange={(e) => setRequireTwoStepReview(e.target.checked)}
                className="mt-0.5 rounded text-[#5B0617] focus:ring-[#5B0617]"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-[#18181B] block">Require Coordinator Review Before Publishing</span>
                <span className="text-[#52525B]">Submissions by assistant study writers must be reviewed by the Bible Study Coordinator or President.</span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* TAB 3: ROLE PERMISSIONS (RBAC MATRIX) */}
      {activeTab === 'Roles' && canAccessRoles && (
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4 overflow-x-auto">
          <h2 className="font-serif font-bold text-base text-[#18181B] border-b border-[#E4E4E7] pb-3">
            Role-Based Access Control (RBAC Matrix)
          </h2>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E4E4E7] text-[10px] font-bold uppercase text-[#52525B]">
                <th className="p-2.5">Administrative Role</th>
                <th className="p-2.5 text-center">Manage Studies</th>
                <th className="p-2.5 text-center">Approve Outlines</th>
                <th className="p-2.5 text-center">Foundational School</th>
                <th className="p-2.5 text-center">Announcements</th>
                <th className="p-2.5 text-center">Events</th>
                <th className="p-2.5 text-center">Manage Members</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {Object.entries(ROLE_PERMISSIONS_MATRIX).map(([roleName, p]) => (
                <tr key={roleName} className="hover:bg-[#FAF8F5]">
                  <td className="p-2.5 font-bold text-[#18181B]">{roleName}</td>
                  <td className="p-2.5 text-center">{p.canManageStudies ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}</td>
                  <td className="p-2.5 text-center">{p.canApproveStudies ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}</td>
                  <td className="p-2.5 text-center">{p.canManageFS ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}</td>
                  <td className="p-2.5 text-center">{p.canManageAnnouncements ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}</td>
                  <td className="p-2.5 text-center">{p.canManageEvents ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}</td>
                  <td className="p-2.5 text-center">{p.canManageMembers ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: DISTRIBUTION & OFFLINE */}
      {activeTab === 'Distribution' && canAccessDistribution && (
        <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-base text-[#18181B] border-b border-[#E4E4E7] pb-3">
            Content Distribution & Scripture Versioning
          </h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#18181B]">Default Scripture Translation</label>
              <select
                value={defaultBibleVersion}
                onChange={(e) => setDefaultBibleVersion(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] font-semibold text-[#18181B]"
              >
                <option value="KJV">King James Version (KJV)</option>
                <option value="NKJV">New King James Version (NKJV)</option>
                <option value="NIV">New International Version (NIV)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP & EXPORT (Restricted to Technical Administration capability or System Config Edit) */}
      {activeTab === 'Backup' && (
        canAccessBackup ? (
          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-base text-[#18181B] border-b border-[#E4E4E7] pb-3">
              Platform Data Snapshot & Backup
            </h2>

            <p className="text-xs text-[#52525B]">
              Export a full JSON archive containing outlines, member records, and administrative audit logs for offline archival or data restoration.
            </p>

            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Platform Backup (JSON)</span>
            </button>
          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl space-y-2 text-rose-900">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Lock className="w-4 h-4 text-rose-600" />
              <span>Access Restricted: Data Backup & Export</span>
            </div>
            <p className="text-xs text-rose-800">
              Exporting raw platform snapshots requires Technical Administration Capability or System Configuration Edit privileges. Your current active role ({activeRole}) does not possess this capability.
            </p>
          </div>
        )
      )}

    </div>
  );
};
