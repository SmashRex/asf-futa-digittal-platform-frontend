/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { ROLE_PERMISSIONS_MATRIX } from '../../data/adminData';
import { HealthStatus, SystemHealthItem } from '../../types/adminTypes';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  RefreshCw, 
  Server, 
  Database, 
  HardDrive, 
  Wifi, 
  ShieldAlert, 
  ExternalLink,
  Radio,
  SlidersHorizontal,
  Cloud,
  Shield,
  Key,
  Clock,
  ArrowRight,
  Layers,
  X,
  BookOpen,
  Image as ImageIcon,
  Check,
  RotateCw
} from 'lucide-react';

export const AdminSystemHealth: React.FC = () => {
  const navigate = useNavigate();
  const { activeRole, systemHealth, refreshHealthDiagnostics, updateSystemHealthStatus, addSystemLog, addAuditLog } = useOutletContext<AdminContextType>();
  const permissions = ROLE_PERMISSIONS_MATRIX[activeRole];

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // RBAC Access Check
  if (!permissions.canAccessSettings) {
    return (
      <div className="system-health-page p-6 bg-white rounded-2xl border border-[#E4E4E7] shadow-xs text-center max-w-xl mx-auto my-12">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#18181B] mb-2">Access Restricted</h2>
        <p className="text-sm text-[#52525B] mb-6">
          Your active role (<span className="font-semibold">{activeRole}</span>) does not have technical administration privileges to inspect platform infrastructure.
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

  // Metrics
  const totalServices = systemHealth.length;
  const operationalCount = systemHealth.filter(s => s.status === 'Operational').length;
  const degradedCount = systemHealth.filter(s => s.status === 'Degraded').length;
  const errorCount = systemHealth.filter(s => s.status === 'Error').length;

  let overallStatus: HealthStatus = 'Operational';
  if (errorCount > 0) overallStatus = 'Error';
  else if (degradedCount > 0) overallStatus = 'Degraded';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      refreshHealthDiagnostics();
      setIsRefreshing(false);
    }, 600);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setSyncSuccessMessage(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccessMessage('Global synchronization completed successfully across all databases and asset caches.');
      addSystemLog('Success', 'Sync Worker', 'Manual Global Sync Triggered', '200 OK', 'Manual global synchronization executed by Technical Administrator.');
      addAuditLog('Executed Global Sync', activeRole, 'Manual synchronization triggered for platform assets');
      setTimeout(() => setSyncSuccessMessage(null), 4000);
    }, 1200);
  };

  const getCategoryIcon = (category: SystemHealthItem['category']) => {
    switch (category) {
      case 'Core API': return Server;
      case 'Database': return Database;
      case 'Storage': return HardDrive;
      case 'Offline Sync': return Wifi;
      default: return Activity;
    }
  };

  const filteredServices = filterCategory === 'All' 
    ? systemHealth 
    : systemHealth.filter(s => s.category === filterCategory);

  return (
    <div className="technical-console-container space-y-6 max-w-[1400px] mx-auto pb-12" id="asf-technical-console">
      
      {/* Console Sub-Header Identity & Status Indicator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E4E4E7] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              System Healthy
            </span>
            <span className="text-xs text-[#52525B]">• Technical Administrator Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
            Technical Console
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1 max-w-xl">
            Overview of core services, infrastructure metrics, and real-time operational status.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#5B0617] text-[#5B0617] hover:bg-[#FAF8F5] rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <RefreshCw className="w-4 h-4 text-[#5B0617]" />
            <span>Sync Status</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5B0617] hover:bg-[#7A1F2B] text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
          >
            <Activity className={`w-4 h-4 text-amber-300 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Ping Active...' : 'System Health'}</span>
          </button>
        </div>
      </div>

      {/* Critical Alerts Area */}
      <div className="bg-[#FAF8F5] border border-[#E4E4E7] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#18181B]">Configuration Pending</h3>
            <p className="text-xs text-[#52525B] mt-0.5">
              2 leadership role definitions require manual coordinator approval after recent sync.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/role-assignment')}
          className="text-xs font-bold text-[#5B0617] hover:text-[#7A1F2B] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Review Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Grid: Services Overview vs System Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8/12): Services Overview */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#18181B] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#5B0617]" />
              <span>Service Overview</span>
            </h2>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {['All', 'Core API', 'Database', 'Storage', 'Offline Sync'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    filterCategory === cat
                      ? 'bg-[#5B0617] text-white'
                      : 'bg-white border border-[#E4E4E7] text-[#52525B] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredServices.map((service) => {
              const ServiceIcon = getCategoryIcon(service.category);
              return (
                <div
                  key={service.id}
                  className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#E4E4E7] p-4 space-y-3 shadow-xs hover:border-[#5B0617]/40 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] flex items-center justify-center text-[#52525B]">
                      <ServiceIcon className="w-5 h-5 text-[#5B0617]" />
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      service.status === 'Operational'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : service.status === 'Warning' || service.status === 'Degraded'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        service.status === 'Operational' ? 'bg-emerald-600' : service.status === 'Error' ? 'bg-rose-600' : 'bg-amber-600'
                      }`} />
                      {service.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#18181B]">{service.name}</h3>
                    <p className="text-xs text-[#52525B] mt-0.5">{service.diagnosticDetails}</p>
                  </div>

                  <div className="pt-2 border-t border-[#E4E4E7] flex items-center justify-between text-[11px] text-[#52525B]">
                    <span>Metric: <strong className="text-[#18181B]">{service.uptimeMetric}</strong></span>
                    <span>Latency: <strong className="text-[#18181B]">{service.latencyMs}ms</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4/12): System Pulse */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-[#18181B] flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#5B0617]" />
            <span>System Pulse</span>
          </h2>

          <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 shadow-xs space-y-4">
            
            {/* Timeline Item 1 */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E4E4E7] flex items-center justify-center text-[#5B0617] shrink-0 mt-0.5">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div className="w-px h-10 bg-[#E4E4E7] my-1"></div>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#18181B]">Sync completed</p>
                <p className="text-[11px] text-[#52525B]">1,402 records updated successfully.</p>
                <p className="text-[10px] font-bold text-[#9A9A9E] uppercase tracking-wider">10 MINS AGO</p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="w-px h-10 bg-[#E4E4E7] my-1"></div>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#18181B]">Backup successful</p>
                <p className="text-[11px] text-[#52525B]">Automated daily snapshot verified.</p>
                <p className="text-[10px] font-bold text-[#9A9A9E] uppercase tracking-wider">2 HOURS AGO</p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 mt-0.5">
                  <Key className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#18181B]">New roles provisioned</p>
                <p className="text-[11px] text-[#52525B]">5 new user permissions granted access.</p>
                <p className="text-[10px] font-bold text-[#9A9A9E] uppercase tracking-wider">5 HOURS AGO</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Sync Status Modal */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E4E4E7] shadow-xl w-full max-w-xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#5B0617]" />
                <h2 className="font-bold text-base text-[#18181B]">System Synchronization</h2>
              </div>
              <button onClick={() => setIsSyncModalOpen(false)}>
                <X className="w-5 h-5 text-[#52525B]" />
              </button>
            </div>

            {syncSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{syncSuccessMessage}</span>
              </div>
            )}

            {/* Status Card */}
            <div className="bg-[#FAF8F5] rounded-xl border border-[#E4E4E7] p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#52525B] block">GLOBAL STATUS</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-sm text-emerald-900">All Systems Synced</span>
                </div>
                <p className="text-xs text-[#52525B] mt-1">Last successful sync: 4 minutes ago</p>
              </div>

              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="px-4 py-2.5 bg-[#5B0617] hover:bg-[#7A1F2B] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Trigger Manual Sync'}</span>
              </button>
            </div>

            {/* Recent Sync Logs */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs text-[#18181B] uppercase tracking-wider">Recent Sync Operations</h3>
              
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white border border-[#E4E4E7] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-[#5B0617]" />
                    <div>
                      <span className="font-bold text-[#18181B] block">Hymn Book Payload Sync</span>
                      <span className="text-[#52525B] text-[11px]">Database delta update • 12:45 PM</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Success</span>
                </div>

                <div className="p-3 bg-white border border-[#E4E4E7] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-[#5B0617]" />
                    <div>
                      <span className="font-bold text-[#18181B] block">Bible Study Outlines Payload</span>
                      <span className="text-[#52525B] text-[11px]">User input sync • 10:30 AM</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Success</span>
                </div>

                <div className="p-3 bg-white border border-[#E4E4E7] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-4 h-4 text-[#5B0617]" />
                    <div>
                      <span className="font-bold text-[#18181B] block">Media Asset Caches</span>
                      <span className="text-[#52525B] text-[11px]">Media payload • 09:12 AM</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Success</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

