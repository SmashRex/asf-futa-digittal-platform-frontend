/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { ROLE_PERMISSIONS_MATRIX } from '../../data/adminData';
import { academicSessionsService } from '../../services/academicSessions/academicSessions.service';
import { AcademicSession } from '../../types/academicSession';
import { bibleService } from '../../services/bible/bible.service';
import { BibleVersion } from '../../types';
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
  Laptop,
  Calendar,
  GraduationCap,
  Plus,
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { activeRole, contentItems, members, hasPermission } = useOutletContext<AdminContextType>();

  // Determine allowed setting tabs based on effective permissions
  const canAccessGeneral = hasPermission('system.configuration.view') || hasPermission('governance.view') || hasPermission('leadership.view');
  const canAccessAcademicSessions = hasPermission('system.academicSessions.manage') || activeRole === 'President / Executive' || activeRole === 'General Secretary' || activeRole === 'Technical Administrator';
  const canAccessWorkflow = hasPermission('governance.view') || hasPermission('system.configuration.view');
  const canAccessRoles = hasPermission('leadership.view') || hasPermission('governance.view');
  const canAccessDistribution = hasPermission('announcements.view') || hasPermission('bibleStudy.view') || hasPermission('system.configuration.view');
  const canAccessBackup = hasPermission('system.technicalAdmin') || hasPermission('system.configuration.edit') || hasPermission('system.dataBackup');

  type SettingTab = 'Personal' | 'General' | 'AcademicSessions' | 'Workflow' | 'Roles' | 'Distribution' | 'Backup';

  const [activeTab, setActiveTab] = useState<SettingTab>('Personal');
  
  // Settings Form State
  const [fellowshipName, setFellowshipName] = useState('Anglican Students\' Fellowship (ASF FUTA)');
  const [semesterTheme, setSemesterTheme] = useState('Arise, Shine! For thy light is come.');
  const [academicSession, setAcademicSession] = useState('2025/2026 Session');
  const [requireTwoStepReview, setRequireTwoStepReview] = useState(true);
  const [defaultBibleVersion, setDefaultBibleVersion] = useState('KJV');
  const [availableTranslations, setAvailableTranslations] = useState<BibleVersion[]>([
    { id: 'kjv', name: 'King James Version', shortName: 'KJV', isPrebundled: true, isDefault: true }
  ]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    bibleService.getTranslations()
      .then(translations => {
        if (isMounted && translations && translations.length > 0) {
          setAvailableTranslations(translations);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Personal Settings State
  const [themePreference, setThemePreference] = useState<'Light' | 'Dark' | 'System'>('Light');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  // Academic Sessions Management State
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionSuccess, setSessionSuccess] = useState<string | null>(null);

  // Create Session Form State
  const [newSessionId, setNewSessionId] = useState('');
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionStartDate, setNewSessionStartDate] = useState('');
  const [newSessionEndDate, setNewSessionEndDate] = useState('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // Progression Confirmation Modal State
  const [sessionToProgress, setSessionToProgress] = useState<AcademicSession | null>(null);
  const [isProgressing, setIsProgressing] = useState(false);

  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    setSessionError(null);
    try {
      const data = await academicSessionsService.getAcademicSessions();
      setSessions(data);
    } catch (err: any) {
      setSessionError(err.message || 'Failed to load academic sessions');
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'AcademicSessions') {
      fetchSessions();
    }
  }, [activeTab]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = newSessionId.trim();
    if (!trimmedId) {
      setSessionError('Please provide a session ID (e.g. 2027/2028)');
      return;
    }

    setIsCreatingSession(true);
    setSessionError(null);
    setSessionSuccess(null);

    try {
      const created = await academicSessionsService.createAcademicSession({
        id: trimmedId,
        name: newSessionName.trim() || undefined,
        startDate: newSessionStartDate || undefined,
        endDate: newSessionEndDate || undefined,
      });
      setSessionSuccess(`Academic session "${created.id}" created successfully.`);
      setNewSessionId('');
      setNewSessionName('');
      setNewSessionStartDate('');
      setNewSessionEndDate('');
      await fetchSessions();
    } catch (err: any) {
      setSessionError(err.message || 'Failed to create academic session');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleExecuteProgression = async () => {
    if (!sessionToProgress) return;

    setIsProgressing(true);
    setSessionError(null);
    setSessionSuccess(null);

    try {
      const result = await academicSessionsService.activateAndProgress(sessionToProgress.id);
      setSessionSuccess(result.message || `Session ${sessionToProgress.id} activated and student progression completed successfully.`);
      setSessionToProgress(null);
      await fetchSessions();
    } catch (err: any) {
      setSessionError(err.message || 'Failed to execute academic progression');
    } finally {
      setIsProgressing(false);
    }
  };

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
      members
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

        {canAccessAcademicSessions && (
          <button
            onClick={() => setActiveTab('AcademicSessions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'AcademicSessions'
                ? 'bg-[#5B0617] text-white shadow-xs'
                : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#FAF8F5]'
            }`}
          >
            Academic Sessions & Progression
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

      {/* TAB: ACADEMIC SESSIONS & PROGRESSION */}
      {activeTab === 'AcademicSessions' && (
        canAccessAcademicSessions ? (
          <div className="space-y-6">
            {/* Feedback Banners */}
            {sessionSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in" id="academic-session-success-banner">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{sessionSuccess}</span>
                </div>
                <button onClick={() => setSessionSuccess(null)} className="text-emerald-700 hover:text-emerald-900 text-xs">Dismiss</button>
              </div>
            )}

            {sessionError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in" id="academic-session-error-banner">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{sessionError}</span>
                </div>
                <button onClick={() => setSessionError(null)} className="text-rose-700 hover:text-rose-900 text-xs">Dismiss</button>
              </div>
            )}

            {/* Create Academic Session Form */}
            <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4">
              <h2 className="font-serif font-bold text-base text-[#18181B] border-b border-[#E4E4E7] pb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#5B0617]" />
                <span>Create New Academic Session</span>
              </h2>

              <form onSubmit={handleCreateSession} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="font-semibold text-[#18181B]" htmlFor="session-id-input">
                      Session Identifier (Format: YYYY/YYYY) *
                    </label>
                    <input
                      id="session-id-input"
                      type="text"
                      placeholder="e.g. 2027/2028"
                      value={newSessionId}
                      onChange={(e) => setNewSessionId(e.target.value)}
                      disabled={isCreatingSession}
                      className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B]"
                      required
                    />
                    <p className="text-[11px] text-[#71717A]">Session IDs containing slashes (e.g. 2027/2028) are fully supported.</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-semibold text-[#18181B]" htmlFor="session-name-input">
                      Session Display Name (Optional)
                    </label>
                    <input
                      id="session-name-input"
                      type="text"
                      placeholder="e.g. 2027/2028 Academic Session"
                      value={newSessionName}
                      onChange={(e) => setNewSessionName(e.target.value)}
                      disabled={isCreatingSession}
                      className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B]"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-semibold text-[#18181B]" htmlFor="session-start-date">
                      Session Start Date (Optional)
                    </label>
                    <input
                      id="session-start-date"
                      type="date"
                      value={newSessionStartDate}
                      onChange={(e) => setNewSessionStartDate(e.target.value)}
                      disabled={isCreatingSession}
                      className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B]"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-semibold text-[#18181B]" htmlFor="session-end-date">
                      Session End Date (Optional)
                    </label>
                    <input
                      id="session-end-date"
                      type="date"
                      value={newSessionEndDate}
                      onChange={(e) => setNewSessionEndDate(e.target.value)}
                      disabled={isCreatingSession}
                      className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingSession || !newSessionId.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                  id="create-session-submit-btn"
                >
                  {isCreatingSession ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Session...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Session</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Academic Sessions Registry */}
            <div className="bg-white rounded-2xl border border-[#E4E4E7] p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
                <h2 className="font-serif font-bold text-base text-[#18181B] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#5B0617]" />
                  <span>Academic Sessions & Progression History</span>
                </h2>
                <button
                  onClick={fetchSessions}
                  disabled={isLoadingSessions}
                  className="text-xs text-[#5B0617] hover:underline font-medium"
                >
                  Refresh
                </button>
              </div>

              {isLoadingSessions ? (
                <div className="py-8 text-center text-xs text-[#71717A] flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#5B0617]" />
                  <span>Loading academic sessions...</span>
                </div>
              ) : sessions.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#71717A]">
                  No academic sessions registered yet. Use the form above to initialize the next session.
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        sess.status === 'active'
                          ? 'border-emerald-300 bg-emerald-50/50'
                          : sess.status === 'archived'
                          ? 'border-[#E4E4E7] bg-[#FAF8F5]'
                          : 'border-[#E4E4E7] bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#18181B]">{sess.id}</span>
                          {sess.name && <span className="text-xs text-[#71717A]">({sess.name})</span>}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              sess.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sess.status === 'archived'
                                ? 'bg-stone-100 text-stone-600'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {sess.status}
                          </span>
                        </div>
                        {(sess.startDate || sess.endDate) && (
                          <p className="text-[11px] text-[#71717A]">
                            Period: {sess.startDate || 'N/A'} &mdash; {sess.endDate || 'N/A'}
                          </p>
                        )}
                        {sess.progressionCompletedAt && (
                          <p className="text-[11px] text-emerald-700">
                            Student progression executed at: {new Date(sess.progressionCompletedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {sess.status !== 'active' ? (
                          <button
                            onClick={() => setSessionToProgress(sess)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <span>Activate &amp; Progress</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 px-2.5 py-1 bg-emerald-100 rounded-md">
                            <Check className="w-3.5 h-3.5" />
                            <span>Current Active Session</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progression Confirmation Modal */}
            {sessionToProgress && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in" id="progression-confirm-modal">
                <div className="bg-white rounded-2xl border border-[#E4E4E7] shadow-xl max-w-md w-full p-6 space-y-4">
                  <div className="flex items-center gap-3 text-amber-800">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-amber-800" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#18181B]">
                        Activate Session &amp; Progress Students
                      </h3>
                      <p className="text-xs text-[#71717A]">Target Session: {sessionToProgress.id}</p>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E4E4E7] text-xs text-[#52525B] space-y-2 leading-relaxed">
                    <p className="font-semibold text-[#18181B]">This action will perform the following operations:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Set <span className="font-bold">{sessionToProgress.id}</span> as the current active academic session.</li>
                      <li>Advance all active undergraduate students to their next academic level (100L &rarr; 200L, 200L &rarr; 300L, etc.).</li>
                      <li>Transition final-year students (400L for 4-yr courses, 500L for 5-yr courses) to <span className="font-bold">Alumni</span> status.</li>
                      <li>Record an immutable governance progression log.</li>
                    </ul>
                    <p className="text-amber-800 font-medium pt-1">Note: This action cannot be undone once confirmed.</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4E4E7]">
                    <button
                      type="button"
                      onClick={() => setSessionToProgress(null)}
                      disabled={isProgressing}
                      className="px-4 py-2 rounded-xl border border-[#E4E4E7] text-xs font-semibold text-[#52525B] hover:bg-[#FAF8F5]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteProgression}
                      disabled={isProgressing}
                      className="px-4 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                      id="confirm-progress-btn"
                    >
                      {isProgressing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Progressing Students...</span>
                        </>
                      ) : (
                        <span>Confirm &amp; Progress</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl space-y-2 text-rose-900">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Lock className="w-4 h-4 text-rose-600" />
              <span>Access Restricted: Academic Sessions Management</span>
            </div>
            <p className="text-xs text-rose-800">
              Managing academic sessions and advancing student cohorts requires Executive, Secretariat, or Technical Administration privileges. Your active role ({activeRole}) does not have permission for this operation.
            </p>
          </div>
        )
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
                id="default-bible-version-select"
              >
                {availableTranslations.map(t => {
                  const val = (t.shortName || t.id).toUpperCase();
                  return (
                    <option key={t.id} value={val}>
                      {t.name} ({val})
                    </option>
                  );
                })}
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
              Export a full JSON archive containing outlines and member records for offline archival or data restoration.
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
