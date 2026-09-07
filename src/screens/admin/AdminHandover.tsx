/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { AdminRole, HandoverChecklistItem } from '../../types/adminTypes';
import { 
  Repeat, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Filter, 
  Search, 
  FileCheck, 
  Key, 
  FolderSync, 
  Users, 
  ArrowRight, 
  X,
  ShieldCheck,
  Sparkles,
  Upload,
  Download,
  FileSpreadsheet,
  Check,
  UserCheck,
  Building2,
  GraduationCap
} from 'lucide-react';

interface ParsedCsvExecutive {
  name: string;
  officeName: string;
  level: string;
  department: string;
  email: string;
  matchedMemberId?: string;
  isMatched: boolean;
}

export const AdminHandover: React.FC = () => {
  const { 
    leadershipRoles, 
    handoverChecklist, 
    toggleHandoverChecklistItem, 
    addHandoverChecklistItem,
    updateLeadershipRole,
    executeExecutiveHandover,
    members,
    addAuditLog 
  } = useOutletContext<AdminContextType>();
  const navigate = useNavigate();

  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Form state for adding new item
  const [newLabel, setNewLabel] = useState('');
  const [newRoleId, setNewRoleId] = useState(leadershipRoles[0]?.id || '');
  const [newCategory, setNewCategory] = useState<HandoverChecklistItem['category']>('Documentation');

  // CSV Import State
  const [csvStep, setCsvStep] = useState<1 | 2 | 3>(1); // 1: Upload, 2: Match & Validate, 3: Preview & Confirm
  const [parsedExecutives, setParsedExecutives] = useState<ParsedCsvExecutive[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [handoverExecutedSuccess, setHandoverExecutedSuccess] = useState(false);

  // Calculated Metrics
  const totalItems = handoverChecklist.length;
  const completedItems = handoverChecklist.filter(i => i.completed).length;
  const overallPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const totalRoles = leadershipRoles.length;
  const readyRoles = leadershipRoles.filter(r => r.handoverStatus === 'Ready').length;

  // Filtered Checklist
  const filteredChecklist = handoverChecklist.filter(item => {
    const matchesRole = selectedRoleFilter === 'All' || item.roleId === selectedRoleFilter;
    const matchesCategory = selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
    return matchesRole && matchesCategory;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const targetRole = leadershipRoles.find(r => r.id === newRoleId);
    const roleName = targetRole ? targetRole.roleName : 'President / Executive';

    addHandoverChecklistItem(newRoleId, roleName, newLabel.trim(), newCategory);
    setNewLabel('');
    setIsAddItemModalOpen(false);
  };

  const handleDownloadCsvTemplate = () => {
    const templateRows = [
      'Name,Office,Level,Department,Email',
      'Temiloluwa Afolabi,President / Executive,400 Level,Electrical Engineering,president@asf-futa.org',
      'Oluwaseun Vance,VP / FS Coordinator,400 Level,Computer Science,seun.vance@asf-futa.org',
      'Deborah Adebayo,Publicity Coordinator,400 Level,Architecture,deborah.adebayo@asf-futa.org',
      'Emmanuel Ogunleye,Bible Study Coordinator,400 Level,Mechanical Engineering,emmanuel.o@asf-futa.org',
      'Grace Nwosu,General Secretary,300 Level,Biochemistry,grace.nwosu@asf-futa.org',
      'Samuel Kalu,Organizing Coordinator,300 Level,Civil Engineering,samuel.kalu@asf-futa.org',
      'Ruth Oladipo,Drama Coordinator,300 Level,Industrial Design,ruth.o@asf-futa.org',
      'Michael Adeyemi,Prayer Coordinator,400 Level,Physics,michael.a@asf-futa.org',
      'Esther Bakare,Financial Secretary,300 Level,Accounting,esther.b@asf-futa.org',
      'Peter Okon,Treasurer,400 Level,Economics,peter.o@asf-futa.org',
      'Hannah Ezekiel,Librarian,200 Level,Library Science,hannah.e@asf-futa.org'
    ];

    const blob = new Blob([templateRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'asf_incoming_executive_council_template.csv';
    a.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        setCsvError('File content is empty.');
        return;
      }

      const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        setCsvError('CSV file must contain a header row and at least one executive record.');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const nameIdx = headers.indexOf('name');
      const officeIdx = headers.indexOf('office');
      const levelIdx = headers.indexOf('level');
      const deptIdx = headers.indexOf('department');
      const emailIdx = headers.indexOf('email');

      if (nameIdx === -1 || officeIdx === -1) {
        setCsvError('CSV must include "Name" and "Office" columns in header.');
        return;
      }

      const parsed: ParsedCsvExecutive[] = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(c => c.trim());
        if (row.length <= nameIdx) continue;

        const name = row[nameIdx] || '';
        const officeName = row[officeIdx] || '';
        const level = levelIdx !== -1 ? row[levelIdx] || '400 Level' : '400 Level';
        const department = deptIdx !== -1 ? row[deptIdx] || 'Engineering' : 'Engineering';
        const email = emailIdx !== -1 ? row[emailIdx] || `${name.toLowerCase().replace(/\s+/g, '.')}@asf-futa.org` : `${name.toLowerCase().replace(/\s+/g, '.')}@asf-futa.org`;

        // Match against existing members in database
        const matched = members.find(m => 
          m.email.toLowerCase() === email.toLowerCase() || 
          m.name.toLowerCase() === name.toLowerCase()
        );

        parsed.push({
          name,
          officeName,
          level,
          department,
          email,
          matchedMemberId: matched?.id,
          isMatched: !!matched
        });
      }

      if (parsed.length === 0) {
        setCsvError('No valid executive rows found in CSV.');
        return;
      }

      setParsedExecutives(parsed);
      setCsvStep(2);
    };

    reader.readAsText(file);
  };

  const handleResolveMatch = (index: number, selectedMemberId: string) => {
    const chosenMember = members.find(m => m.id === selectedMemberId);
    setParsedExecutives(prev => prev.map((item, idx) => {
      if (idx === index) {
        if (chosenMember) {
          return {
            ...item,
            name: chosenMember.name,
            email: chosenMember.email,
            department: chosenMember.department,
            level: chosenMember.level,
            matchedMemberId: chosenMember.id,
            isMatched: true
          };
        }
      }
      return item;
    }));
  };

  const handleExecuteHandover = () => {
    const incomingList = parsedExecutives.map(p => ({
      memberId: p.matchedMemberId || `user_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      name: p.name,
      officeName: p.officeName
    }));

    executeExecutiveHandover(incomingList);
    setHandoverExecutedSuccess(true);
    setIsCsvModalOpen(false);
    setCsvStep(1);
    setParsedExecutives([]);
    setTimeout(() => setHandoverExecutedSuccess(false), 5000);
  };

  const getCategoryIcon = (category: HandoverChecklistItem['category']) => {
    switch (category) {
      case 'Documentation':
        return <FileCheck className="w-4 h-4 text-blue-600" />;
      case 'Access & Keys':
        return <Key className="w-4 h-4 text-purple-600" />;
      case 'Resource Transfer':
        return <FolderSync className="w-4 h-4 text-emerald-600" />;
      case 'Briefing':
        return <Users className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="handover-page space-y-6 max-w-7xl mx-auto pb-12" id="handover-continuity-view">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E4E4E7] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#52525B] mb-1 font-medium">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#7A1F2B] font-semibold">Handover & Continuity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight flex items-center gap-2.5">
            <Repeat className="w-7 h-7 text-[#7A1F2B]" />
            Tenure Succession & Executive Handover
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-2xl">
            Supervised by the VP / FS Coordinator (Primary Authority). Transfer active Executive Council tenure, upload incoming roster via CSV, and execute protected handovers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setCsvStep(1);
              setIsCsvModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7A1F2B] hover:bg-[#5B0617] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Incoming Executive CSV</span>
          </button>

          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-[#18181B] hover:bg-[#F3EFEA] text-xs font-bold transition-all"
          >
            <Plus className="w-4 h-4 text-[#7A1F2B]" />
            <span>Add Checklist Item</span>
          </button>
        </div>
      </div>

      {handoverExecutedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Executive Council Tenure Succession Complete!</p>
            <p className="text-[#52525B] font-normal mt-0.5">Newly inducted Executive Officers have been activated with default office permissions. Outgoing executives have been transitioned back to regular member access while preserving historical activity.</p>
          </div>
        </div>
      )}

      {/* Handover Readiness Banner */}
      <div className="handover-readiness bg-gradient-to-r from-[#5B0617] to-[#7A1F2B] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white backdrop-blur-xs mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                TRANSITION READINESS SUMMARY
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {readyRoles} of {totalRoles} Administrative Roles Prepared
              </h2>
            </div>

            <div className="text-right sm:text-right">
              <span className="text-3xl font-black text-amber-300">{overallPercent}%</span>
              <p className="text-xs text-stone-200">Total Tasks Complete</p>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-xs">
              <div 
                className="handover-progress h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-stone-200">
              <span>{completedItems} items verified</span>
              <span>{totalItems - completedItems} remaining</span>
            </div>
          </div>

          <p className="text-xs text-stone-100 max-w-3xl leading-relaxed">
            Continuity checklists ensure that credentials, drive folders, constitution guidelines, and operational notes are transferred smoothly to incoming executive candidates.
          </p>
        </div>
      </div>

      {/* Main Grid: Checklist vs Role Attention Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Continuity Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <h3 className="text-base font-bold text-[#18181B] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#5B0617]" />
              <span>Continuity Checklist</span>
              <span className="text-xs bg-stone-100 text-[#52525B] px-2 py-0.5 rounded-full font-bold">
                {filteredChecklist.length}
              </span>
            </h3>

            {/* Role Filter Selector */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#52525B]" />
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="input-box text-xs py-1.5 px-2.5 w-auto"
              >
                <option value="All">All Roles</option>
                {leadershipRoles.map(r => (
                  <option key={r.id} value={r.id}>{r.roleName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Checklist Items List */}
          <div className="continuity-checklist space-y-2.5">
            {filteredChecklist.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 text-center text-xs text-[#52525B]">
                No checklist items match the selected filter.
              </div>
            ) : (
              filteredChecklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleHandoverChecklistItem(item.id)}
                  className={`continuity-item bg-white rounded-2xl border border-[#E4E4E7] p-4 flex items-start gap-3.5 cursor-pointer transition-all hover:border-[#5B0617] ${
                    item.completed ? 'bg-stone-50/80 border-stone-200 opacity-90' : 'bg-white'
                  }`}
                  id={`chk-item-${item.id}`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}} // Handled by parent div
                    className="mt-1 w-4 h-4 rounded text-[#5B0617] focus:ring-[#5B0617] border-stone-300 cursor-pointer shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#18181B]">
                        {item.roleName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#52525B] bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                    </div>

                    <p className={`text-xs sm:text-sm font-medium ${
                      item.completed ? 'line-through text-[#52525B]' : 'text-[#18181B]'
                    }`}>
                      {item.label}
                    </p>

                    <p className="text-[10px] text-[#52525B] mt-1">
                      Updated: {item.updatedAt}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Column: Roles Attention Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 shadow-xs">
            <h3 className="text-base font-bold text-[#18181B] flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>Roles Status Summary</span>
            </h3>

            <div className="space-y-3">
              {leadershipRoles.map(role => (
                <div 
                  key={role.id}
                  className="p-3 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl space-y-2 hover:border-[#5B0617] transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-[#18181B] truncate">
                      {role.roleName}
                    </h4>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      role.handoverStatus === 'Ready'
                        ? 'bg-emerald-100 text-emerald-800'
                        : role.handoverStatus === 'In Progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {role.handoverStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#52525B]">
                    <span>Assignee: {role.assignedMember.name}</span>
                    <span className="font-bold text-[#18181B]">{role.handoverReadinessPercent}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        role.handoverStatus === 'Ready'
                          ? 'bg-emerald-600'
                          : role.handoverStatus === 'In Progress'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${role.handoverReadinessPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-1">
                    <button
                      onClick={() => {
                        const nextStatus = role.handoverStatus === 'Ready' ? 'In Progress' : 'Ready';
                        const nextPercent = nextStatus === 'Ready' ? 90 : 50;
                        updateLeadershipRole(role.id, {
                          handoverStatus: nextStatus,
                          handoverReadinessPercent: nextPercent
                        });
                      }}
                      className="text-[10px] text-[#5B0617] font-bold hover:underline"
                    >
                      Toggle Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CSV Handover Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E4E4E7] shadow-xl w-full max-w-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#5B0617]/10 text-[#5B0617] rounded-xl">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#18181B]">
                    Upload Incoming Executive Council CSV
                  </h2>
                  <p className="text-xs text-[#52525B]">
                    Step {csvStep} of 3: {csvStep === 1 ? 'Upload File' : csvStep === 2 ? 'Validate & Match Directory' : 'Preview & Confirm Transition'}
                  </p>
                </div>
              </div>

              <button onClick={() => setIsCsvModalOpen(false)} className="text-[#52525B] hover:text-[#18181B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: Upload CSV File & Template Download */}
            {csvStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#18181B]">Download Sample Executive Council CSV Template</span>
                    <button
                      onClick={handleDownloadCsvTemplate}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5B0617] text-white font-semibold text-xs hover:bg-[#7A1F2B]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Template</span>
                    </button>
                  </div>
                  <p className="text-[#52525B]">
                    Template columns: <code className="bg-white px-1 py-0.5 rounded border border-[#E4E4E7]">Name, Office, Level, Department, Email</code>
                  </p>
                </div>

                <div className="border-2 border-dashed border-[#E4E4E7] hover:border-[#5B0617] rounded-2xl p-8 text-center space-y-3 bg-[#FAF8F5]/50 transition-colors">
                  <Upload className="w-8 h-8 text-[#5B0617] mx-auto opacity-80" />
                  <div>
                    <p className="font-bold text-[#18181B] text-sm">Select or Drag Executive Council CSV</p>
                    <p className="text-[#52525B] text-xs mt-0.5">Supports .csv files formatted with Name, Office, Email</p>
                  </div>

                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-[#52525B] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#5B0617] file:text-white hover:file:bg-[#7A1F2B] cursor-pointer"
                  />
                </div>

                {csvError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{csvError}</span>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Validate & Match Directory */}
            {csvStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-700" />
                    <span>{parsedExecutives.length} Executive Candidates Parsed from CSV</span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-800">
                    {parsedExecutives.filter(p => p.isMatched).length} Matched / {parsedExecutives.filter(p => !p.isMatched).length} Unmatched
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 border border-[#E4E4E7] rounded-xl p-3 bg-[#FAF8F5]">
                  {parsedExecutives.map((exec, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-[#E4E4E7] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#18181B]">{exec.name}</span>
                          <span className="px-2 py-0.5 text-[10px] bg-[#5B0617]/10 text-[#5B0617] font-bold rounded">
                            {exec.officeName}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#52525B] mt-0.5">{exec.department} • {exec.level} • {exec.email}</p>
                      </div>

                      <div className="shrink-0">
                        {exec.isMatched ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold text-[10px]">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Matched to Member Directory
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-amber-800 font-semibold">Match to:</span>
                            <select
                              onChange={(e) => handleResolveMatch(idx, e.target.value)}
                              className="p-1 rounded bg-stone-50 border border-[#E4E4E7] text-[11px] font-semibold"
                            >
                              <option value="">-- Choose Member --</option>
                              {members.map(m => (
                                <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setCsvStep(1)}
                    className="px-4 py-2 rounded-xl border border-[#E4E4E7] text-[#18181B] font-semibold hover:bg-[#FAF8F5]"
                  >
                    Back to Upload
                  </button>
                  <button
                    onClick={() => setCsvStep(3)}
                    className="px-4 py-2 rounded-xl bg-[#5B0617] text-white font-semibold hover:bg-[#7A1F2B]"
                  >
                    Proceed to Handover Preview
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Preview & Confirm Handover */}
            {csvStep === 3 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-[#FAF8F5] border border-[#E4E4E7] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B0617]">TENURE COMPARISON</span>
                      <h3 className="font-serif font-bold text-base text-[#18181B]">Outgoing Tenure (2025/2026) → Incoming Tenure (2026/2027)</h3>
                    </div>
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-900 border border-purple-200 font-extrabold text-[10px] rounded-full">
                      Automated Succession
                    </span>
                  </div>
                  <p className="text-[#52525B]">
                    Confirming this handover will assign incoming members as Executive Officers with default permissions, and transition outgoing executives back to regular member access.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-[#18181B]">Incoming Executive Appointments:</h4>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 border border-[#E4E4E7] rounded-xl p-2.5 bg-white">
                    {parsedExecutives.map((exec, idx) => (
                      <div key={idx} className="p-2 bg-[#FAF8F5] rounded-lg flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-[#18181B]">{exec.name}</span>
                          <span className="text-[#52525B]"> ({exec.email})</span>
                        </div>
                        <span className="px-2 py-0.5 bg-[#5B0617] text-white font-bold rounded text-[10px]">
                          {exec.officeName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E4E4E7]">
                  <button
                    onClick={() => setCsvStep(2)}
                    className="px-4 py-2 rounded-xl border border-[#E4E4E7] text-[#18181B] font-semibold hover:bg-[#FAF8F5]"
                  >
                    Back to Matching
                  </button>
                  <button
                    onClick={handleExecuteHandover}
                    className="px-5 py-2.5 rounded-xl bg-[#5B0617] text-white font-bold hover:bg-[#7A1F2B] shadow-sm flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Confirm & Execute Executive Handover</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddItemModalOpen && (
        <div className="modal-overlay" id="add-continuity-item-modal">
          <div className="modal-content p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <h3 className="text-base font-bold text-[#18181B]">
                Add Continuity Checklist Item
              </h3>
              <button onClick={() => setIsAddItemModalOpen(false)}>
                <X className="w-5 h-5 text-[#52525B]" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="input-label text-xs">Target Administrative Role</label>
                <select
                  value={newRoleId}
                  onChange={(e) => setNewRoleId(e.target.value)}
                  className="input-box text-xs py-2"
                  required
                >
                  {leadershipRoles.map(r => (
                    <option key={r.id} value={r.id}>{r.roleName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label text-xs">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as HandoverChecklistItem['category'])}
                  className="input-box text-xs py-2"
                  required
                >
                  <option value="Documentation">Documentation</option>
                  <option value="Access & Keys">Access & Keys</option>
                  <option value="Resource Transfer">Resource Transfer</option>
                  <option value="Briefing">Briefing</option>
                </select>
              </div>

              <div>
                <label className="input-label text-xs">Checklist Item Description</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Verify shared Google Drive folder permissions..."
                  className="input-box text-xs py-2"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="btn-tertiary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
