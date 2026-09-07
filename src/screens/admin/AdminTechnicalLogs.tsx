/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { ROLE_PERMISSIONS_MATRIX } from '../../data/adminData';
import { LogSeverity, SystemLogItem } from '../../types/adminTypes';
import { 
  Terminal, 
  Search, 
  Filter, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Plus, 
  RefreshCw,
  FileCode2,
  ListFilter
} from 'lucide-react';

export const AdminTechnicalLogs: React.FC = () => {
  const navigate = useNavigate();
  const { activeRole, systemLogs, addSystemLog, clearSystemLogs } = useOutletContext<AdminContextType>();
  const permissions = ROLE_PERMISSIONS_MATRIX[activeRole];

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedComponent, setSelectedComponent] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // New Log Modal state
  const [isNewLogModalOpen, setIsNewLogModalOpen] = useState<boolean>(false);
  const [newLogSeverity, setNewLogSeverity] = useState<LogSeverity>('Info');
  const [newLogComponent, setNewLogComponent] = useState<SystemLogItem['component']>('API Gateway');
  const [newLogEvent, setNewLogEvent] = useState<string>('');
  const [newLogMessage, setNewLogMessage] = useState<string>('');

  // RBAC Check
  if (!permissions.canAccessSettings) {
    return (
      <div className="technical-logs-page p-6 bg-white rounded-2xl border border-[#E4E4E7] shadow-xs text-center max-w-xl mx-auto my-12">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#18181B] mb-2">Access Restricted</h2>
        <p className="text-sm text-[#52525B] mb-6">
          Your active role (<span className="font-semibold">{activeRole}</span>) is not permitted to view technical operational logs.
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

  // Filter logic
  const filteredLogs = useMemo(() => {
    return systemLogs.filter(log => {
      const matchesSearch = searchQuery === '' || 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.component.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = selectedSeverity === 'All' || log.severity === selectedSeverity;
      const matchesComponent = selectedComponent === 'All' || log.component === selectedComponent;

      return matchesSearch && matchesSeverity && matchesComponent;
    });
  }, [systemLogs, searchQuery, selectedSeverity, selectedComponent]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const currentLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const handleCreateTestLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogEvent || !newLogMessage) return;

    addSystemLog(
      newLogSeverity,
      newLogComponent,
      newLogEvent,
      newLogSeverity === 'Error' ? '500 Server Error' : '200 OK',
      newLogMessage,
      `Manually triggered test log entry by ${activeRole}.`
    );

    setNewLogEvent('');
    setNewLogMessage('');
    setIsNewLogModalOpen(false);
  };

  const getSeverityBadge = (severity: LogSeverity) => {
    switch (severity) {
      case 'Info':
        return (
          <span className="log-severity inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-sky-50 text-sky-700 rounded-full text-xs font-semibold border border-sky-200">
            <Info className="w-3 h-3 text-sky-600" />
            <span>INFO</span>
          </span>
        );
      case 'Success':
        return (
          <span className="log-severity inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>SUCCESS</span>
          </span>
        );
      case 'Warning':
        return (
          <span className="log-severity inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>WARNING</span>
          </span>
        );
      case 'Error':
        return (
          <span className="log-severity inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 text-rose-700 rounded-full text-xs font-semibold border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>ERROR</span>
          </span>
        );
    }
  };

  return (
    <div className="technical-logs-page space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="w-5 h-5 text-[#5B0617]" />
            <h1 className="text-xl font-extrabold text-[#18181B] tracking-tight">Technical Logs</h1>
            <span className="px-2 py-0.5 text-[10px] bg-[#5B0617]/10 text-[#5B0617] rounded-md font-bold uppercase tracking-wider">
              Technical Administrator
            </span>
          </div>
          <p className="text-xs text-[#52525B]">
            Real-time operational event stream, error diagnostics, and system API logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewLogModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[#5B0617] text-white rounded-xl text-xs font-semibold hover:bg-[#7A1F2B] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Test Log</span>
          </button>

          {systemLogs.length > 0 && (
            <button
              onClick={clearSystemLogs}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 text-stone-700 hover:bg-rose-50 hover:text-rose-700 border border-[#E4E4E7] rounded-xl text-xs font-semibold transition-colors"
              title="Clear temporary log stream"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="log-filters bg-white p-4 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Bar */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#52525B] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search logs by event name, message, or details..."
              className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-xs font-medium text-[#18181B] focus:outline-hidden focus:border-[#5B0617]"
            />
          </div>

          {/* Severity Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedSeverity}
              onChange={(e) => { setSelectedSeverity(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-xs font-semibold text-[#18181B] focus:outline-hidden focus:border-[#5B0617]"
            >
              <option value="All">All Severities</option>
              <option value="Info">Info</option>
              <option value="Success">Success</option>
              <option value="Warning">Warning</option>
              <option value="Error">Error</option>
            </select>
          </div>

          {/* Component Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedComponent}
              onChange={(e) => { setSelectedComponent(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-xs font-semibold text-[#18181B] focus:outline-hidden focus:border-[#5B0617]"
            >
              <option value="All">All Components</option>
              <option value="API Gateway">API Gateway</option>
              <option value="Database">Database</option>
              <option value="Storage">Storage</option>
              <option value="Auth Service">Auth Service</option>
              <option value="Bible Study Engine">Bible Study Engine</option>
              <option value="Sync Worker">Sync Worker</option>
            </select>
          </div>

        </div>

        {/* Applied filters bar summary */}
        <div className="flex items-center justify-between text-xs text-[#52525B] pt-1 border-t border-[#E4E4E7]">
          <span>Showing <strong className="text-[#18181B]">{filteredLogs.length}</strong> log entries</span>
          {(searchQuery || selectedSeverity !== 'All' || selectedComponent !== 'All') && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedSeverity('All'); setSelectedComponent('All'); setCurrentPage(1); }}
              className="text-[#5B0617] font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Log Entries View */}
      {currentLogs.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#E4E4E7] text-center space-y-3">
          <FileCode2 className="w-10 h-10 text-[#9A9A9E] mx-auto opacity-50" />
          <p className="text-sm font-bold text-[#18181B]">No log entries found</p>
          <p className="text-xs text-[#52525B]">Try relaxing your search query or severity filter.</p>
        </div>
      ) : (
        <>
          {/* Desktop Log Table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-[#E4E4E7] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="log-table w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E4E4E7] text-[11px] font-bold uppercase text-[#52525B]">
                    <th className="py-3 px-4">TIMESTAMP</th>
                    <th className="py-3 px-3">SEVERITY</th>
                    <th className="py-3 px-3">COMPONENT</th>
                    <th className="py-3 px-4">EVENT</th>
                    <th className="py-3 px-3">STATUS</th>
                    <th className="py-3 px-4">MESSAGE / DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E7] text-xs font-mono">
                  {currentLogs.map((log, idx) => (
                    <tr key={log.id ? `${log.id}-${idx}` : `techlog-${idx}`} className="log-row hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 text-[#52525B] whitespace-nowrap text-[11px]">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {getSeverityBadge(log.severity)}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#18181B] whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-stone-100 rounded text-[11px] border border-stone-200">
                          {log.component}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#5B0617] whitespace-nowrap">
                        {log.event}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-[11px] font-bold text-[#52525B]">
                        {log.status}
                      </td>
                      <td className="py-3 px-4 text-[#18181B] text-xs leading-normal">
                        <p className="font-sans font-medium">{log.message}</p>
                        {log.details && (
                          <p className="text-[11px] text-[#52525B] mt-0.5 font-mono">{log.details}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile / Tablet Log Cards */}
          <div className="lg:hidden space-y-3">
            {currentLogs.map((log, idx) => (
              <div key={log.id ? `${log.id}-${idx}` : `techcard-${idx}`} className="bg-white p-4 rounded-xl border border-[#E4E4E7] shadow-xs space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(log.severity)}
                    <span className="font-bold text-[#18181B]">{log.component}</span>
                  </div>
                  <span className="text-[11px] text-[#52525B]">{log.timestamp}</span>
                </div>
                <div className="font-bold text-[#5B0617] text-sm">{log.event}</div>
                <p className="text-[#18181B] font-medium">{log.message}</p>
                {log.details && (
                  <p className="text-[11px] text-[#52525B] bg-[#FAF8F5] p-2 rounded border border-[#E4E4E7] font-mono">{log.details}</p>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="log-pagination flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E4E4E7] shadow-xs">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-xs font-semibold text-[#18181B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5B0617]/5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-semibold text-[#52525B]">
              Page <strong className="text-[#18181B]">{currentPage}</strong> of <strong className="text-[#18181B]">{totalPages}</strong>
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl text-xs font-semibold text-[#18181B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5B0617]/5"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}

      {/* Record Test Log Modal */}
      {isNewLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-[#E4E4E7] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#E4E4E7] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#5B0617]" />
                <h3 className="font-bold text-[#18181B] text-base">Record Test Event Log</h3>
              </div>
              <button 
                onClick={() => setIsNewLogModalOpen(false)}
                className="text-[#52525B] hover:text-[#18181B] text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTestLog} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#18181B] mb-1">Log Severity</label>
                <select
                  value={newLogSeverity}
                  onChange={(e) => setNewLogSeverity(e.target.value as LogSeverity)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl font-semibold"
                >
                  <option value="Info">Info</option>
                  <option value="Success">Success</option>
                  <option value="Warning">Warning</option>
                  <option value="Error">Error</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#18181B] mb-1">Target Component</label>
                <select
                  value={newLogComponent}
                  onChange={(e) => setNewLogComponent(e.target.value as SystemLogItem['component'])}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl font-semibold"
                >
                  <option value="API Gateway">API Gateway</option>
                  <option value="Database">Database</option>
                  <option value="Storage">Storage</option>
                  <option value="Auth Service">Auth Service</option>
                  <option value="Bible Study Engine">Bible Study Engine</option>
                  <option value="Sync Worker">Sync Worker</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#18181B] mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={newLogEvent}
                  onChange={(e) => setNewLogEvent(e.target.value)}
                  placeholder="e.g. Manual Database Index Audit"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18181B] mb-1">Log Message</label>
                <textarea
                  required
                  rows={3}
                  value={newLogMessage}
                  onChange={(e) => setNewLogMessage(e.target.value)}
                  placeholder="Describe the diagnostic details..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4E4E7]">
                <button
                  type="button"
                  onClick={() => setIsNewLogModalOpen(false)}
                  className="px-4 py-2 border border-[#E4E4E7] rounded-xl font-semibold text-[#52525B] hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5B0617] text-white rounded-xl font-semibold hover:bg-[#7A1F2B]"
                >
                  Submit Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
