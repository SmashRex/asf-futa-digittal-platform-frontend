/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  AdminRole, 
  AdminContentItem, 
  AdminMember, 
  AuditLog, 
  LeadershipRole, 
  HandoverChecklistItem, 
  GovernanceRequest, 
  SystemHealthItem, 
  SystemLogItem, 
  SystemConfiguration, 
  RoleAssignmentExecution,
  PermissionKey,
  EffectivePermissions,
  PermissionOverride,
  isAuthorizedAdminRole
} from '../../types/adminTypes';
import { 
  initialAdminContent, 
  initialAdminMembers, 
  initialAuditLogs, 
  initialLeadershipRoles, 
  initialHandoverChecklist, 
  initialGovernanceRequests, 
  initialSystemHealth, 
  initialSystemLogs, 
  initialSystemConfig, 
  initialRoleAssignments,
  computeEffectivePermissions,
  getPermissionState as calcPermissionState,
  OFFICES_REGISTRY
} from '../../data/adminData';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { useDevState } from '../../dev/simulations/devState';
import { APP_CONFIG } from '../../config/app.config';
import { membersService } from '../../services/members/members.service';

export interface AdminContextType {
  activeRole: AdminRole;
  setActiveRole: (role: AdminRole) => void;
  effectivePermissions: EffectivePermissions;
  hasPermission: (key: PermissionKey) => boolean;
  getPermissionState: (key: PermissionKey, officeName?: string, overrides?: PermissionOverride) => 'DEFAULT' | 'GRANTED' | 'REVOKED' | 'NONE';
  contentItems: AdminContentItem[];
  members: AdminMember[];
  auditLogs: AuditLog[];
  leadershipRoles: LeadershipRole[];
  handoverChecklist: HandoverChecklistItem[];
  governanceRequests: GovernanceRequest[];
  systemHealth: SystemHealthItem[];
  systemLogs: SystemLogItem[];
  systemConfig: SystemConfiguration;
  roleAssignments: RoleAssignmentExecution[];
  addContent: (item: Omit<AdminContentItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateContent: (item: AdminContentItem) => void;
  deleteContent: (id: string) => void;
  updateContentStatus: (id: string, newStatus: AdminContentItem['status'], comment?: string) => void;
  addMember: (memberData: Omit<AdminMember, 'id' | 'joinDate' | 'lastActive'>) => void;
  updateMemberRole: (memberId: string, role: AdminMember['role']) => void;
  updateMemberLevel: (memberId: string, level: string) => void;
  updateMemberSubgroup: (memberId: string, subgroup: string) => void;
  updateMemberOverrides: (memberId: string, overrides: PermissionOverride) => void;
  resetMemberAccess: (memberId: string, customNewPassword?: string) => Promise<void> | void;
  toggleMemberStatus: (memberId: string) => void;
  activeMember?: AdminMember;
  userRoles?: string[];
  addAuditLog: (action: string, target: string, details?: string) => void;
  updateLeadershipRole: (roleId: string, updates: Partial<LeadershipRole>) => void;
  toggleHandoverChecklistItem: (itemId: string) => void;
  addHandoverChecklistItem: (roleId: string, roleName: AdminRole, label: string, category: HandoverChecklistItem['category']) => void;
  executeExecutiveHandover: (incomingList: Array<{ memberId: string; name: string; officeName: string }>) => void;
  approveGovernanceRequest: (requestId: string, comment?: string) => void;
  rejectGovernanceRequest: (requestId: string, reason: string) => void;
  executeGovernanceAction: (requestId: string) => void;
  refreshHealthDiagnostics: () => void;
  updateSystemHealthStatus: (healthId: string, status: SystemHealthItem['status'], details?: string) => void;
  addSystemLog: (severity: SystemLogItem['severity'], component: SystemLogItem['component'], event: string, status: SystemLogItem['status'], message: string, details?: string) => void;
  clearSystemLogs: () => void;
  updateSystemConfig: (updates: Partial<SystemConfiguration>) => void;
  executeRoleAssignment: (assignmentId: string) => void;
}

let globalIdCounter = 0;
const generateUniqueId = (prefix: string = 'id'): string => {
  globalIdCounter += 1;
  const rand = Math.random().toString(36).substring(2, 9);
  const time = Date.now();
  const perf = typeof performance !== 'undefined' ? Math.floor(performance.now() * 100) : 0;
  return `${prefix}-${time}-${globalIdCounter}-${rand}-${perf}`;
};

const sanitizeListWithIds = <T extends { id: string }>(list: T[], prefix: string): T[] => {
  const seenIds = new Set<string>();
  return list.map((item, idx) => {
    if (!item.id || seenIds.has(item.id)) {
      const uniqueId = generateUniqueId(`${prefix}-${idx}`);
      seenIds.add(uniqueId);
      return { ...item, id: uniqueId };
    }
    seenIds.add(item.id);
    return item;
  });
};

export const AdminLayout: React.FC = () => {
  const devState = useDevState();

  // Perform Admin Portal Authorization Entry Guard
  const userSession = (() => {
    try {
      const saved = localStorage.getItem('asf_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const userRolesList: string[] = Array.isArray(userSession?.roles)
    ? userSession.roles
    : [];

  const adminRoleInSession = userRolesList.find(r => isAuthorizedAdminRole(r));
  const effectiveCurrentRole = devState.simulatedRoleOverride || adminRoleInSession;

  const [activeRole, setActiveRole] = useState<AdminRole>(() => {
    if (effectiveCurrentRole && isAuthorizedAdminRole(effectiveCurrentRole)) {
      return effectiveCurrentRole;
    }
    try {
      const saved = localStorage.getItem('asf_admin_role');
      return (saved as AdminRole) || 'President / Executive';
    } catch {
      return 'President / Executive';
    }
  });

  // Keep activeRole synchronized with simulated role changes
  useEffect(() => {
    if (devState.simulatedRoleOverride && isAuthorizedAdminRole(devState.simulatedRoleOverride)) {
      setActiveRole(devState.simulatedRoleOverride);
    } else if (adminRoleInSession && isAuthorizedAdminRole(adminRoleInSession)) {
      setActiveRole(adminRoleInSession);
    }
  }, [devState.simulatedRoleOverride, adminRoleInSession]);

  const hasAnyAdminRole = devState.simulatedRoleOverride 
    ? isAuthorizedAdminRole(devState.simulatedRoleOverride)
    : userRolesList.some(r => isAuthorizedAdminRole(r));

  const isActiveRoleAuthorized = isAuthorizedAdminRole(activeRole);

  // If user session has no authorized admin roles, OR if activeRole is not an authorized admin role:
  // IMMEDIATELY RETURN TO MEMBER APP (DO NOT RENDER ADMIN PORTAL)
  if (!hasAnyAdminRole || !isActiveRoleAuthorized) {
    return <Navigate to="/home" replace />;
  }


  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Local storage persisted Admin Content Store
  const [contentItems, setContentItems] = useState<AdminContentItem[]>(() => {
    try {
      const saved = localStorage.getItem('asf_admin_content');
      const parsed = saved ? JSON.parse(saved) : initialAdminContent;
      return sanitizeListWithIds(parsed, 'admin-item');
    } catch {
      return sanitizeListWithIds(initialAdminContent, 'admin-item');
    }
  });

  // Local storage persisted Admin Members Store
  const [members, setMembers] = useState<AdminMember[]>(() => {
    try {
      const saved = localStorage.getItem('asf_admin_members');
      const parsed = saved ? JSON.parse(saved) : initialAdminMembers;
      return sanitizeListWithIds(parsed, 'user');
    } catch {
      return sanitizeListWithIds(initialAdminMembers, 'user');
    }
  });

  // Audit logs store
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('asf_admin_audit');
      const parsed = saved ? JSON.parse(saved) : initialAuditLogs;
      return sanitizeListWithIds(parsed, 'audit');
    } catch {
      return sanitizeListWithIds(initialAuditLogs, 'audit');
    }
  });

  // Leadership roles store
  const [leadershipRoles, setLeadershipRoles] = useState<LeadershipRole[]>(() => {
    try {
      const saved = localStorage.getItem('asf_admin_leadership');
      const parsed = saved ? JSON.parse(saved) : initialLeadershipRoles;
      return sanitizeListWithIds(parsed, 'role');
    } catch {
      return sanitizeListWithIds(initialLeadershipRoles, 'role');
    }
  });

  // Handover checklist store
  const [handoverChecklist, setHandoverChecklist] = useState<HandoverChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem('asf_admin_handover');
      const parsed = saved ? JSON.parse(saved) : initialHandoverChecklist;
      return sanitizeListWithIds(parsed, 'chk');
    } catch {
      return sanitizeListWithIds(initialHandoverChecklist, 'chk');
    }
  });

  // Governance requests store
  const [governanceRequests, setGovernanceRequests] = useState<GovernanceRequest[]>(() => {
    try {
      const saved = localStorage.getItem('asf_admin_governance');
      const parsed = saved ? JSON.parse(saved) : initialGovernanceRequests;
      return sanitizeListWithIds(parsed, 'gov');
    } catch {
      return sanitizeListWithIds(initialGovernanceRequests, 'gov');
    }
  });

  // Batch 07 Stores
  const [systemHealth, setSystemHealth] = useState<SystemHealthItem[]>(() => {
    try {
      const saved = localStorage.getItem('asf_admin_health');
      const parsed = saved ? JSON.parse(saved) : initialSystemHealth;
      return sanitizeListWithIds(parsed, 'health');
    } catch {
      return sanitizeListWithIds(initialSystemHealth, 'health');
    }
  });

  const [systemLogs, setSystemLogs] = useState<SystemLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('asf_admin_logs');
      const parsed = saved ? JSON.parse(saved) : initialSystemLogs;
      return sanitizeListWithIds(parsed, 'log');
    } catch {
      return sanitizeListWithIds(initialSystemLogs, 'log');
    }
  });

  const [systemConfig, setSystemConfigState] = useState<SystemConfiguration>(() => {
    try {
      const saved = localStorage.getItem('asf_admin_config');
      return saved ? JSON.parse(saved) : initialSystemConfig;
    } catch {
      return initialSystemConfig;
    }
  });

  const [roleAssignments, setRoleAssignments] = useState<RoleAssignmentExecution[]>(() => {
    try {
      const saved = localStorage.getItem('asf_admin_role_exec');
      const parsed = saved ? JSON.parse(saved) : initialRoleAssignments;
      return sanitizeListWithIds(parsed, 'exec');
    } catch {
      return sanitizeListWithIds(initialRoleAssignments, 'exec');
    }
  });

  // Calculate effective permissions for active persona
  const activeMember = members.find(m => m.office === activeRole || m.role === activeRole);
  const effectivePermissions = useMemo(() => {
    return computeEffectivePermissions(activeRole, activeMember?.permissionOverrides);
  }, [activeRole, activeMember]);

  const hasPermission = (key: PermissionKey): boolean => {
    return !!effectivePermissions[key];
  };

  const getPermissionState = (
    key: PermissionKey,
    officeName?: string,
    overrides?: PermissionOverride
  ): 'DEFAULT' | 'GRANTED' | 'REVOKED' | 'NONE' => {
    return calcPermissionState(key, officeName || activeRole, overrides || activeMember?.permissionOverrides);
  };

  useEffect(() => {
    localStorage.setItem('asf_admin_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('asf_admin_content', JSON.stringify(contentItems));
  }, [contentItems]);

  useEffect(() => {
    localStorage.setItem('asf_admin_members', JSON.stringify(members));
  }, [members]);

  // When connected to the staging backend, fetch authoritative members
  useEffect(() => {
    if (!APP_CONFIG.features.useMockServices) {
      membersService.getMembers({ limit: 100 })
        .then(result => {
          const memberList = result?.data || (result as any)?.members;
          if (Array.isArray(memberList) && memberList.length > 0) {
            const backendMembers: AdminMember[] = memberList.map((m: any) => ({
              id: m.id,
              name: m.name || m.fullName || `${m.firstName || ''} ${m.lastName || ''}`.trim() || m.email,
              email: m.email,
              phone: m.phone || '',
              role: (m.role || m.roles?.[0] || 'Member') as any,
              level: m.level || m.academicLevel || '100L',
              status: m.status || (m.accountStatus === 'suspended' ? 'Suspended' : (m.accountStatus === 'inactive' ? 'Inactive' : 'Active')),
              joinDate: m.joinDate || (m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'Recent'),
              lastActive: m.lastActive || 'Recently',
              department: m.department || '',
              faculty: m.faculty || '',
              subgroup: m.subgroup || 'General Member',
            }));
            setMembers(backendMembers);
          }
        })
        .catch(err => {
          console.warn('Real backend members fetch error in AdminLayout:', err);
        });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('asf_admin_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('asf_admin_leadership', JSON.stringify(leadershipRoles));
  }, [leadershipRoles]);

  useEffect(() => {
    localStorage.setItem('asf_admin_handover', JSON.stringify(handoverChecklist));
  }, [handoverChecklist]);

  useEffect(() => {
    localStorage.setItem('asf_admin_governance', JSON.stringify(governanceRequests));
  }, [governanceRequests]);

  useEffect(() => {
    localStorage.setItem('asf_admin_health', JSON.stringify(systemHealth));
  }, [systemHealth]);

  useEffect(() => {
    localStorage.setItem('asf_admin_logs', JSON.stringify(systemLogs));
  }, [systemLogs]);

  useEffect(() => {
    localStorage.setItem('asf_admin_config', JSON.stringify(systemConfig));
  }, [systemConfig]);

  useEffect(() => {
    localStorage.setItem('asf_admin_role_exec', JSON.stringify(roleAssignments));
  }, [roleAssignments]);

  const addAuditLog = (action: string, target: string, details?: string) => {
    const newLog: AuditLog = {
      id: generateUniqueId('audit'),
      timestamp: 'Just now',
      actor: 'Current Admin',
      actorRole: activeRole,
      action,
      target,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addContent = (itemData: Omit<AdminContentItem, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = generateUniqueId('admin-item');
    const newItem: AdminContentItem = {
      ...itemData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setContentItems(prev => [newItem, ...prev]);
    addAuditLog('Created Content', newItem.title, `Type: ${newItem.type}, Status: ${newItem.status}`);
    return id;
  };

  const updateContent = (updatedItem: AdminContentItem) => {
    setContentItems(prev => prev.map(item => item.id === updatedItem.id ? { ...updatedItem, updatedAt: new Date().toISOString() } : item));
    addAuditLog('Updated Content', updatedItem.title, `Status: ${updatedItem.status}`);
  };

  const deleteContent = (id: string) => {
    const targetItem = contentItems.find(i => i.id === id);
    setContentItems(prev => prev.filter(item => item.id !== id));
    if (targetItem) {
      addAuditLog('Deleted Content', targetItem.title, `Removed from library`);
    }
  };

  const updateContentStatus = (id: string, newStatus: AdminContentItem['status'], comment?: string) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === id) {
        const reviewComments = comment ? [...(item.reviewComments || []), comment] : item.reviewComments;
        return {
          ...item,
          status: newStatus,
          isPublished: newStatus === 'Published',
          reviewComments,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    }));
    
    const targetItem = contentItems.find(i => i.id === id);
    addAuditLog(`Changed Status to ${newStatus}`, targetItem ? targetItem.title : id, comment);
  };

  const addMember = (memberData: Omit<AdminMember, 'id' | 'joinDate' | 'lastActive'>) => {
    const newId = generateUniqueId('user');
    const newMember: AdminMember = {
      ...memberData,
      id: newId,
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now'
    };
    setMembers(prev => [newMember, ...prev]);
    addAuditLog('Registered Member', newMember.name, `Added to ${newMember.department} (${newMember.level})`);
  };

  const updateMemberRole = (memberId: string, role: AdminMember['role']) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role, office: role, isExecutive: OFFICES_REGISTRY.some(o => o.name === role) } : m));
    const target = members.find(m => m.id === memberId);
    addAuditLog('Updated Member Office/Role', target ? target.name : memberId, `New Office: ${role}`);
  };

  const updateMemberLevel = (memberId: string, level: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, level } : m));
    const target = members.find(m => m.id === memberId);
    addAuditLog('Overrode Academic Level', target ? target.name : memberId, `New Level: ${level}`);
  };

  const updateMemberSubgroup = (memberId: string, subgroup: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, subgroup } : m));
    const target = members.find(m => m.id === memberId);
    addAuditLog('Updated Member Subgroup', target ? target.name : memberId, `New Subgroup: ${subgroup}`);
  };

  const updateMemberOverrides = (memberId: string, overrides: PermissionOverride) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, permissionOverrides: overrides } : m));
    const target = members.find(m => m.id === memberId);
    addAuditLog('Updated Permission Overrides', target ? target.name : memberId, `Granted: ${overrides.granted.length}, Revoked: ${overrides.revoked.length}`);
  };

  const resetMemberAccess = async (memberId: string, customNewPassword?: string) => {
    const target = members.find(m => m.id === memberId);
    if (!target) return;
    if (customNewPassword) {
      try {
        await membersService.resetPassword(memberId, customNewPassword);
        addAuditLog('Admin Reset Member Password', target.name, 'Password reset by administrator');
        addSystemLog('Info', 'Auth Service', 'Member Password Reset', '200 OK', `Direct password reset applied for ${target.email}`);
        return;
      } catch (err: any) {
        addSystemLog('Error', 'Auth Service', 'Password Reset Failed', '500 Server Error', err.message);
        throw err;
      }
    }
    addAuditLog('Dispatched Access Recovery Link', target.name, `Secure reset link sent to ${target.email}`);
    addSystemLog('Info', 'Auth Service', 'Access Recovery Dispatched', '200 OK', `One-time login recovery link dispatched to ${target.email}`);
  };

  const toggleMemberStatus = (memberId: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const newStatus = m.status === 'Active' ? 'Suspended' : 'Active';
        return { ...m, status: newStatus };
      }
      return m;
    }));
  };

  const updateLeadershipRole = (roleId: string, updates: Partial<LeadershipRole>) => {
    setLeadershipRoles(prev => prev.map(r => r.id === roleId ? { ...r, ...updates, lastUpdated: 'Just now' } : r));
    const target = leadershipRoles.find(r => r.id === roleId);
    addAuditLog('Updated Leadership Role', target ? target.roleName : roleId, `Updated properties: ${Object.keys(updates).join(', ')}`);
  };

  const toggleHandoverChecklistItem = (itemId: string) => {
    setHandoverChecklist(prev => prev.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, completed: !item.completed, updatedAt: 'Just now' };
        return updated;
      }
      return item;
    }));
  };

  const addHandoverChecklistItem = (roleId: string, roleName: AdminRole, label: string, category: HandoverChecklistItem['category']) => {
    const newItem: HandoverChecklistItem = {
      id: generateUniqueId('chk'),
      roleId,
      roleName,
      label,
      category,
      completed: false,
      updatedAt: 'Just now'
    };
    setHandoverChecklist(prev => [...prev, newItem]);
    addAuditLog('Added Continuity Item', roleName, label);
  };

  const executeExecutiveHandover = (incomingList: Array<{ memberId: string; name: string; officeName: string }>) => {
    // Re-assign leadership roles and member offices
    incomingList.forEach(inc => {
      // Find matching leadership role
      setLeadershipRoles(prev => prev.map(lr => {
        if (lr.roleName === inc.officeName) {
          const targetMember = members.find(m => m.id === inc.memberId || m.name.toLowerCase() === inc.name.toLowerCase());
          return {
            ...lr,
            status: 'Active',
            handoverStatus: 'Ready',
            handoverReadinessPercent: 100,
            lastUpdated: 'Just now',
            assignedMember: {
              id: targetMember ? targetMember.id : generateUniqueId('inc'),
              name: inc.name,
              email: targetMember ? targetMember.email : `${inc.name.toLowerCase().replace(/\s+/g, '.')}@asf-futa.org`,
              department: targetMember ? targetMember.department : 'Engineering',
              level: targetMember ? targetMember.level : '400 Level'
            }
          };
        }
        return lr;
      }));

      // Update member office
      setMembers(prev => prev.map(m => {
        if (m.id === inc.memberId || m.name.toLowerCase() === inc.name.toLowerCase()) {
          return {
            ...m,
            office: inc.officeName,
            isExecutive: true,
            role: inc.officeName as AdminRole,
            permissionOverrides: { granted: [], revoked: [] } // Reset overrides for new tenure
          };
        } else if (m.office === inc.officeName) {
          // Outgoing officer returns to regular member
          return {
            ...m,
            office: undefined,
            isExecutive: false,
            role: 'Member'
          };
        }
        return m;
      }));
    });

    addAuditLog('Executed Executive Council Handover', 'Executive Committee Succession', `Transferred ${incomingList.length} executive offices.`);
    addSystemLog('Success', 'Auth Service', 'Executive Succession Executed', '200 OK', `Successfully updated Executive Committee roster and default office permissions.`);
  };

  const approveGovernanceRequest = (requestId: string, comment?: string) => {
    setGovernanceRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const newApproval = {
          approverName: 'Current Administrator',
          approverRole: activeRole,
          approvedAt: new Date().toISOString(),
          comments: comment || 'Approved in governance review.'
        };
        const updatedApprovals = [...req.currentApprovals, newApproval];
        const isFullyApproved = updatedApprovals.length >= req.requiredApprovals;
        const newStatus = isFullyApproved ? 'Approved' : 'Under Review';
        return {
          ...req,
          currentApprovals: updatedApprovals,
          status: newStatus
        };
      }
      return req;
    }));
    
    const targetReq = governanceRequests.find(r => r.id === requestId);
    addAuditLog('Approved Governance Request', targetReq ? targetReq.type : requestId, comment);
  };

  const rejectGovernanceRequest = (requestId: string, reason: string) => {
    setGovernanceRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'Rejected' };
      }
      return req;
    }));
    const targetReq = governanceRequests.find(r => r.id === requestId);
    addAuditLog('Rejected Governance Request', targetReq ? targetReq.type : requestId, `Reason: ${reason}`);
  };

  const executeGovernanceAction = (requestId: string) => {
    const req = governanceRequests.find(r => r.id === requestId);
    if (!req) return;

    if (req.type === 'Bible Study Deletion' && req.targetId) {
      deleteContent(req.targetId);
    }

    setGovernanceRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Completed/Deleted' } : r));
    addAuditLog('Executed Governance Action', req.target, `Action type: ${req.type}`);
  };

  const refreshHealthDiagnostics = () => {
    setSystemHealth(prev => prev.map(item => ({
      ...item,
      lastChecked: 'Just now',
      latencyMs: Math.floor(Math.random() * 30) + 15
    })));
    addAuditLog('Triggered Health Check', 'All System Dependencies', 'Manual diagnostic ping completed.');
  };

  const updateSystemHealthStatus = (healthId: string, status: SystemHealthItem['status'], details?: string) => {
    setSystemHealth(prev => prev.map(item => {
      if (item.id === healthId) {
        return {
          ...item,
          status,
          diagnosticDetails: details || item.diagnosticDetails,
          lastChecked: 'Just now'
        };
      }
      return item;
    }));
    const target = systemHealth.find(h => h.id === healthId);
    addAuditLog('Updated System Health State', target ? target.name : healthId, `New State: ${status}`);
  };

  const addSystemLog = (
    severity: SystemLogItem['severity'],
    component: SystemLogItem['component'],
    event: string,
    status: SystemLogItem['status'],
    message: string,
    details?: string
  ) => {
    const newLog: SystemLogItem = {
      id: generateUniqueId('log'),
      timestamp: 'Just now',
      severity,
      component,
      event,
      status,
      message,
      details
    };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  const clearSystemLogs = () => {
    setSystemLogs([]);
    addAuditLog('Cleared System Logs', 'Technical Logs Archive', 'Purged all temporary operational logs.');
  };

  const updateSystemConfig = (updates: Partial<SystemConfiguration>) => {
    const updated = {
      ...systemConfig,
      ...updates,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + `, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      updatedBy: `Current Admin (${activeRole})`
    };
    setSystemConfigState(updated);
    addAuditLog('Updated System Configuration', 'Global Platform Settings', `Modified fields: ${Object.keys(updates).join(', ')}`);
  };

  const executeRoleAssignment = (assignmentId: string) => {
    const targetAssignment = roleAssignments.find(a => a.id === assignmentId);
    if (!targetAssignment) return;

    setRoleAssignments(prev => prev.map(a => a.id === assignmentId ? {
      ...a,
      approvalStatus: 'Executed',
      executedAt: new Date().toISOString(),
      executedBy: `Current Admin (${activeRole})`
    } : a));

    updateMemberRole(targetAssignment.targetMemberId, targetAssignment.newRole);

    addAuditLog('Executed Role Assignment', targetAssignment.targetMemberName, `Elevated to ${targetAssignment.newRole}`);
    addSystemLog('Success', 'Auth Service', 'Role Elevation Executed', '200 OK', `Successfully updated role for ${targetAssignment.targetMemberName} to ${targetAssignment.newRole}.`);
  };

  const adminContextValue: AdminContextType = {
    activeRole,
    setActiveRole,
    effectivePermissions,
    hasPermission,
    getPermissionState,
    contentItems,
    members,
    auditLogs,
    leadershipRoles,
    handoverChecklist,
    governanceRequests,
    systemHealth,
    systemLogs,
    systemConfig,
    roleAssignments,
    addContent,
    updateContent,
    deleteContent,
    updateContentStatus,
    addMember,
    updateMemberRole,
    updateMemberLevel,
    updateMemberSubgroup,
    updateMemberOverrides,
    resetMemberAccess,
    toggleMemberStatus,
    activeMember,
    userRoles: userRolesList,
    addAuditLog,
    updateLeadershipRole,
    toggleHandoverChecklistItem,
    addHandoverChecklistItem,
    executeExecutiveHandover,
    approveGovernanceRequest,
    rejectGovernanceRequest,
    executeGovernanceAction,
    refreshHealthDiagnostics,
    updateSystemHealthStatus,
    addSystemLog,
    clearSystemLogs,
    updateSystemConfig,
    executeRoleAssignment
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#18181B] flex flex-col font-sans" id="asf-admin-app-root">
      {/* Admin Top Header */}
      <AdminHeader 
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        isMobileNavOpen={isMobileNavOpen}
      />

      {/* Main Container Layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex">
        {/* Left Sidebar */}
        <AdminSidebar 
          activeRole={activeRole}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          hasPermission={hasPermission}
        />

        {/* Content Canvas */}
        <main className="flex-1 p-3 sm:p-5 lg:p-8 min-w-0 overflow-y-auto">
          <Outlet context={adminContextValue} />
        </main>
      </div>
    </div>
  );
};
