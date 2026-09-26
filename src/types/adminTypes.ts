/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from '../types';

export type PermissionKey =
  | 'dashboard.view'
  | 'members.view'
  | 'members.create'
  | 'members.edit'
  | 'memberAccounts.resetAccess'
  | 'announcements.view'
  | 'announcements.create'
  | 'announcements.edit'
  | 'announcements.publish'
  | 'events.view'
  | 'events.create'
  | 'events.edit'
  | 'events.publish'
  | 'media.view'
  | 'media.upload'
  | 'media.edit'
  | 'media.delete'
  | 'bibleStudy.view'
  | 'bibleStudy.create'
  | 'bibleStudy.edit'
  | 'bibleStudy.import'
  | 'bibleStudy.publish'
  | 'bibleStudy.manageGroups'
  | 'foundationalSchool.view'
  | 'foundationalSchool.manage'
  | 'fs.students.view'
  | 'fs.students.manage'
  | 'fs.teachers.assign'
  | 'fs.admissions.review'
  | 'fs.classes.manage'
  | 'fs.materials.manage'
  | 'leadership.view'
  | 'leadership.manage'
  | 'leadership.assign'
  | 'handover.view'
  | 'handover.manage'
  | 'governance.view'
  | 'governance.review'
  | 'governance.approve'
  | 'system.health.view'
  | 'system.logs.view'
  | 'system.configuration.view'
  | 'system.configuration.edit'
  | 'system.academicSessions.manage'
  | 'system.technicalAdmin'
  | 'system.dataBackup'
  | 'website.view'
  | 'website.editCopy'
  | 'website.manageSections'
  | 'website.publish';

export type EffectivePermissions = Record<PermissionKey, boolean>;

export interface PermissionOverride {
  granted: PermissionKey[];
  revoked: PermissionKey[];
}

export type AuthorityLevel = 
  | 'GLOBAL_AUTHORITY'
  | 'DOMAIN_AUTHORITY'
  | 'EXECUTIVE_AUTHORITY'
  | 'DELEGATED_COORDINATOR';

export type AuthorityDomain = 
  | 'Global Fellowship Oversight'
  | 'Foundational School'
  | 'Publicity & Media'
  | 'Bible Study & Curriculum'
  | 'Secretariat & Official Records'
  | 'Organizing & Logistics'
  | 'Drama & Creative Arts'
  | 'Prayer & Intercession'
  | 'Finance & Accounts'
  | 'Treasury & Assets'
  | 'Library & Resources'
  | 'General Membership';

export interface OfficeDefinition {
  id: string;
  name: string;
  description: string;
  isExecutiveOffice: boolean;
  authorityLevel: AuthorityLevel;
  domain?: AuthorityDomain;
  domainDescription?: string;
  defaultPermissions: PermissionKey[];
}

export type AdminRole = 
  | 'President / Executive'
  | 'VP / FS Coordinator'
  | 'Publicity Coordinator'
  | 'Bible Study Coordinator'
  | 'General Secretary'
  | 'Organizing Coordinator'
  | 'Drama Coordinator'
  | 'Prayer Coordinator'
  | 'Financial Secretary'
  | 'Treasurer'
  | 'Librarian'
  | 'Technical Administrator';

export const VALID_ADMIN_ROLES: AdminRole[] = [
  'President / Executive',
  'VP / FS Coordinator',
  'Publicity Coordinator',
  'Bible Study Coordinator',
  'General Secretary',
  'Organizing Coordinator',
  'Drama Coordinator',
  'Prayer Coordinator',
  'Financial Secretary',
  'Treasurer',
  'Librarian',
  'Technical Administrator'
];

export function normalizeAdminRole(roleOrOffice: string | null | undefined): AdminRole | null {
  if (!roleOrOffice || typeof roleOrOffice !== 'string') return null;
  const trimmed = roleOrOffice.trim();
  if (!trimmed) return null;

  if (VALID_ADMIN_ROLES.includes(trimmed as AdminRole)) {
    return trimmed as AdminRole;
  }

  const lower = trimmed.toLowerCase();
  if (
    lower === 'president' ||
    lower === 'president / executive' ||
    lower === 'president_dashboard'
  ) {
    return 'President / Executive';
  }
  if (
    lower === 'vice president' ||
    lower === 'vp / fs coordinator' ||
    lower === 'foundational school coordinator' ||
    lower === 'fs_dashboard'
  ) {
    return 'VP / FS Coordinator';
  }
  if (
    lower === 'public relation officer (pro)/publicity coordinator' ||
    lower === 'public relations officer' ||
    lower === 'publicity coordinator' ||
    lower === 'publicity_dashboard'
  ) {
    return 'Publicity Coordinator';
  }
  if (
    lower === 'technical head' ||
    lower === 'technical administrator' ||
    lower === 'technical_head' ||
    lower === 'technical_admin' ||
    lower === 'technical_console'
  ) {
    return 'Technical Administrator';
  }
  if (lower === 'general secretary' || lower === 'assistant general secretary') {
    return 'General Secretary';
  }
  if (lower === 'bible study coordinator') {
    return 'Bible Study Coordinator';
  }
  if (lower === 'organizing coordinator' || lower === 'assistant organizing coordinator') {
    return 'Organizing Coordinator';
  }
  if (lower === 'drama coordinator') {
    return 'Drama Coordinator';
  }
  if (lower === 'prayer coordinator') {
    return 'Prayer Coordinator';
  }
  if (lower === 'financial secretary') {
    return 'Financial Secretary';
  }
  if (lower === 'treasurer') {
    return 'Treasurer';
  }
  if (lower === 'librarian') {
    return 'Librarian';
  }

  return null;
}

export function isAuthorizedAdminRole(role: string | null | undefined): role is AdminRole {
  return normalizeAdminRole(role) !== null;
}

export function resolveUserAdminRoles(user: any): AdminRole[] {
  if (!user || typeof user !== 'object') return [];
  const resolved: AdminRole[] = [];
  const addRole = (candidate: unknown) => {
    if (!candidate) return;
    if (typeof candidate === 'string') {
      const norm = normalizeAdminRole(candidate);
      if (norm && !resolved.includes(norm)) {
        resolved.push(norm);
      }
    } else if (typeof candidate === 'object') {
      const obj = candidate as Record<string, any>;
      const rawName = obj.name || obj.officeName || obj.title || obj.id || obj.officeId || obj.dashboardId || obj.capabilityId;
      if (typeof rawName === 'string') {
        const norm = normalizeAdminRole(rawName);
        if (norm && !resolved.includes(norm)) {
          resolved.push(norm);
        }
      }
    }
  };

  if (Array.isArray(user.roles)) user.roles.forEach(addRole);
  if (Array.isArray(user.executiveOffices)) user.executiveOffices.forEach(addRole);
  if (Array.isArray(user.dashboards)) user.dashboards.forEach(addRole);
  if (Array.isArray(user.dashboardGrants)) user.dashboardGrants.forEach(addRole);
  if (Array.isArray(user.capabilities)) user.capabilities.forEach(addRole);
  if (typeof user.office === 'string') addRole(user.office);
  if (typeof user.role === 'string') addRole(user.role);

  // If the user holds President authority, ensure 'President / Executive' is first
  const presIdx = resolved.indexOf('President / Executive');
  if (presIdx > 0) {
    resolved.splice(presIdx, 1);
    resolved.unshift('President / Executive');
  }

  return resolved;
}

export type ContentStatus = 
  | 'Draft'
  | 'Pending Review'
  | 'Revision Requested'
  | 'Approved'
  | 'Published'
  | 'Archived';

export type ContentType = 
  | 'Bible Study'
  | 'Announcement'
  | 'Event'
  | 'FS Material'
  | 'Daily Verse';

export interface AdminContentItem {
  id: string;
  type: ContentType;
  title: string;
  subTheme?: string;
  annualTheme?: string;
  author: string;
  authorRole?: string;
  status: ContentStatus;
  category?: string;
  date?: string;
  createdAt: string;
  updatedAt: string;
  reviewComments?: string[];
  
  // Specific payload fields
  lessonNumber?: number;
  keyScripture?: string;
  textScriptures?: string[];
  summary?: string;
  aims?: string[];
  introduction?: string;
  sections?: Array<{
    id: string;
    title: string;
    paragraphs: string[];
    scriptureRefs?: string[];
  }>;
  memoryVerse?: {
    reference: string;
    text: string;
  };
  discussionQuestions?: string[];
  prayerPoints?: string[];
  prayerText?: string;
  
  // Event specific fields
  venue?: string;
  startTime?: string;
  endTime?: string;
  speaker?: string;
  speakerRole?: string;
  mode?: 'In-Person' | 'Online / Zoom' | 'Hybrid';
  
  // Flags
  isCurrent?: boolean;
  isPublished?: boolean;
}

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  department: string;
  level: string;
  subgroup: string;
  office?: string;
  isExecutive?: boolean;
  role: UserRole;
  status: 'Active' | 'Pending Approval' | 'Suspended' | 'Alumni';
  joinDate: string;
  lastActive: string;
  phone?: string;
  permissionOverrides?: PermissionOverride;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  actorAuthorityLevel?: AuthorityLevel;
  action: string;
  target: string;
  details?: string;
  reason?: string;
  approvalState?: string;
  result?: string;
}

export interface RolePermissions {
  role: AdminRole;
  authorityLevel: AuthorityLevel;
  canManageStudies: boolean;
  canApproveStudies: boolean;
  canManageFS: boolean;
  canManageAnnouncements: boolean;
  canManageEvents: boolean;
  canManageMembers: boolean;
  canAccessSettings: boolean;
}

export interface LeadershipRole {
  id: string;
  roleName: AdminRole;
  category: 'Executive' | 'Coordinator' | 'Operations';
  authorityLevel: AuthorityLevel;
  domain?: AuthorityDomain;
  domainDescription?: string;
  description: string;
  assignedMember: {
    id: string;
    name: string;
    email: string;
    department: string;
    level: string;
    phone?: string;
  };
  status: 'Active' | 'Vacant' | 'Transition Pending';
  responsibilities: string[];
  capabilitiesSummary?: string[];
  isProtectedRole?: boolean;
  handoverStatus: 'Ready' | 'In Progress' | 'Needs Attention';
  handoverReadinessPercent: number;
  lastUpdated: string;
}

export interface HandoverChecklistItem {
  id: string;
  roleId: string;
  roleName: AdminRole;
  label: string;
  category: 'Documentation' | 'Access & Keys' | 'Resource Transfer' | 'Briefing';
  completed: boolean;
  updatedAt: string;
}

export interface GovernanceRequest {
  id: string;
  type: 'Bible Study Deletion' | 'Emergency Retraction' | 'Role Elevation' | 'System Reset';
  target: string;
  targetId?: string;
  requester: {
    name: string;
    role: AdminRole;
    email: string;
    authorityLevel?: AuthorityLevel;
  };
  reason: string;
  createdAt: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed/Deleted';
  requiredApprovals: number;
  currentApprovals: Array<{
    approverName: string;
    approverRole: AdminRole;
    approverAuthorityLevel?: AuthorityLevel;
    approvedAt: string;
    comments?: string;
  }>;
  consequences: string[];
  isDestructive: boolean;
}

export type HealthStatus = 'Operational' | 'Degraded' | 'Warning' | 'Error' | 'Unknown';

export interface SystemHealthItem {
  id: string;
  name: string;
  category: 'Core API' | 'Database' | 'Storage' | 'Offline Sync';
  status: HealthStatus;
  uptimeMetric: string;
  latencyMs: number;
  lastChecked: string;
  diagnosticDetails: string;
  endpointOrResource: string;
}

export type LogSeverity = 'Info' | 'Success' | 'Warning' | 'Error';

export interface SystemLogItem {
  id: string;
  timestamp: string;
  severity: LogSeverity;
  component: 'API Gateway' | 'Database' | 'Storage' | 'Auth Service' | 'Bible Study Engine' | 'Sync Worker';
  event: string;
  status: '200 OK' | '201 Created' | '401 Unauthorized' | '403 Forbidden' | '404 Not Found' | '500 Server Error' | 'Timeout' | 'Completed';
  message: string;
  details?: string;
}

export interface SystemConfiguration {
  syncIntervalMinutes: number;
  offlineCacheLimitMB: number;
  conflictResolutionPolicy: 'Server Wins' | 'Client Wins' | 'Manual Merge';
  defaultStudyLanguage: 'English' | 'Yoruba' | 'Bilingual';
  maxMediaUploadSizeMB: number;
  apiTimeoutSeconds: number;
  maintenanceModeActive: boolean;
  maintenanceReason?: string;
  autoArchiveOutlinesSemesterEnd: boolean;
  auditLogRetentionDays: number;
  lastUpdated: string;
  updatedBy: string;
}

export interface RoleAssignmentExecution {
  id: string;
  targetMemberId: string;
  targetMemberName: string;
  targetMemberEmail: string;
  department: string;
  level: string;
  currentRole: string;
  newRole: AdminRole;
  approvalStatus: 'Approved' | 'Pending Dual Approval' | 'Executed' | 'Cancelled';
  requestedBy: string;
  approvedBy: string;
  reason: string;
  createdAt: string;
  executedAt?: string;
  executedBy?: string;
  consequences: string[];
}

export function getAuthorityLevelForRole(role: AdminRole): AuthorityLevel {
  if (role === 'President / Executive') {
    return 'GLOBAL_AUTHORITY';
  }
  if (
    role === 'VP / FS Coordinator' ||
    role === 'Publicity Coordinator' ||
    role === 'Bible Study Coordinator' ||
    role === 'General Secretary'
  ) {
    return 'DOMAIN_AUTHORITY';
  }
  return 'DELEGATED_COORDINATOR';
}

export function getAuthorityScopeForRole(role: AdminRole): {
  domain: AuthorityDomain;
  title: string;
  subtitle: string;
  isGlobal: boolean;
  isFSLead: boolean;
} {
  if (role === 'President / Executive') {
    return {
      domain: 'Global Fellowship Oversight',
      title: 'Highest Overall Authority',
      subtitle: 'Global Executive Oversight & General Governance',
      isGlobal: true,
      isFSLead: false
    };
  }
  if (role === 'VP / FS Coordinator') {
    return {
      domain: 'Foundational School',
      title: 'FS Domain Authority',
      subtitle: 'Head of Foundational School (Discipleship & Induction)',
      isGlobal: false,
      isFSLead: true
    };
  }
  if (role === 'Publicity Coordinator') {
    return {
      domain: 'Publicity & Media',
      title: 'Publicity Domain Authority',
      subtitle: 'Media Communications, Public Broadcasts & Graphics',
      isGlobal: false,
      isFSLead: false
    };
  }
  if (role === 'Bible Study Coordinator') {
    return {
      domain: 'Bible Study & Curriculum',
      title: 'Bible Study Domain Authority',
      subtitle: 'Syllabus Development, Outlines & Discussion Facilitators',
      isGlobal: false,
      isFSLead: false
    };
  }
  if (role === 'General Secretary') {
    return {
      domain: 'Secretariat & Official Records',
      title: 'Secretariat Domain Authority',
      subtitle: 'Official Minutes, Rosters & Secretariat Governance',
      isGlobal: false,
      isFSLead: false
    };
  }
  if (role === 'Organizing Coordinator') {
    return {
      domain: 'Organizing & Logistics',
      title: 'Logistics Domain Authority',
      subtitle: 'Venue Arrangements, Event Scheduling & Operations',
      isGlobal: false,
      isFSLead: false
    };
  }
  if (role === 'Drama Coordinator') {
    return {
      domain: 'Drama & Creative Arts',
      title: 'Drama Ministry Lead',
      subtitle: 'Evangelistic Scripts, Rehearsals & Production',
      isGlobal: false,
      isFSLead: false
    };
  }
  if (role === 'Prayer Coordinator') {
    return {
      domain: 'Prayer & Intercession',
      title: 'Prayer Ministry Lead',
      subtitle: 'Intercessory Chains, Vigils & Spiritual Warfare',
      isGlobal: false,
      isFSLead: false
    };
  }
  if (role === 'Financial Secretary') {
    return {
      domain: 'Finance & Accounts',
      title: 'Finance Administrator',
      subtitle: 'Budget Formulations, Tithes & Financial Records',
      isGlobal: false,
      isFSLead: false
    };
  }
  if (role === 'Treasurer') {
    return {
      domain: 'Treasury & Assets',
      title: 'Treasury Officer',
      subtitle: 'Disbursements, Physical Custody & Account Balancing',
      isGlobal: false,
      isFSLead: false
    };
  }
  if (role === 'Librarian') {
    return {
      domain: 'Library & Resources',
      title: 'Resource Administrator',
      subtitle: 'Spiritual Book Catalog, E-Library & Archive Custody',
      isGlobal: false,
      isFSLead: false
    };
  }
  return {
    domain: 'General Membership',
    title: 'Fellowship Member',
    subtitle: 'Standard Member Access',
    isGlobal: false,
    isFSLead: false
  };
}



