/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from '../api/client';
import { API_CONFIG } from '../../config/api.config';

export const CANONICAL_EXECUTIVE_OFFICES = [
  'President',
  'Vice President',
  'General Secretary',
  'Sisters’ Coordinator',
  'Financial Secretary',
  'Bible Study Coordinator',
  'Brothers’ Coordinator',
  'Prayer Coordinator',
  'Organizing Coordinator',
  'Evangelism/Follow-up Coordinator',
  'Church Mission Coordinator',
  'Public Relation Officer (PRO)/Publicity Coordinator',
  'Assistant General Secretary',
  'Choir Coordinator',
  'Drama Coordinator',
  'Academic Coordinator',
  'Librarian',
  'Off-Campus Coordinator',
  'Assistant Organizing Coordinator',
  'Assistant Off-Campus Coordinator',
  'Akindeko Hall Coordinator',
  'Obanla Male Coordinator',
  'Obanla Female Coordinator',
] as const;

export type CanonicalExecutiveOffice = typeof CANONICAL_EXECUTIVE_OFFICES[number];

export const CANONICAL_SUBGROUPS = [
  'Bible Study',
  'Prayer',
  'Drama',
  'Organizing',
  'Choir',
  'Church Mission',
  'Academic',
  'Evangelism/Follow-up',
  'Publicity',
] as const;

export type CanonicalSubgroup = typeof CANONICAL_SUBGROUPS[number];

export interface PresidentExecutiveOfficeItem {
  id?: string;
  officeId?: string;
  name?: string;
  officeName?: string;
  title?: string;
}

export interface PresidentRosterMember {
  id: string;
  name: string;
  department: string;
  departmentId?: string | null;
  academicLevel: string;
  membershipStatus: string;
  subgroup: string | null;
  avatarUrl?: string | null;
  executiveOffices: Array<string | PresidentExecutiveOfficeItem>;
}

export interface PresidentRosterQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  academicLevel?: string;
  subgroup?: string;
  office?: string;
  departmentId?: string;
}

export interface PresidentRosterResult {
  data: PresidentRosterMember[];
  total: number;
  page: number;
  limit: number;
}

export interface PresidentAnalyticsQueryParams {
  academicSession?: string;
  subgroup?: string;
  office?: string;
}

export interface DistributionEntry {
  label: string;
  count: number;
}

export interface PresidentAnalyticsData {
  totalMembers: number;
  subgroupDistribution: Record<string, number> | Array<Record<string, any>>;
  academicLevelDistribution: Record<string, number> | Array<Record<string, any>>;
  officeDistribution: Record<string, number> | Array<Record<string, any>>;
  eventCount: number;
}

/**
 * Safely extract display names from a member's executiveOffices field
 * without inventing or fabricating office values.
 */
export function formatExecutiveOffices(
  offices: Array<string | PresidentExecutiveOfficeItem> | undefined | null
): string[] {
  if (!Array.isArray(offices)) return [];
  return offices
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object') {
        return String(item.name || item.officeName || item.title || item.id || item.officeId || '').trim();
      }
      return '';
    })
    .filter(Boolean);
}

/**
 * Normalize backend distribution payload (whether Record<string, number> or Array<{ key, count }>)
 * into a clean array of { label, count } without inventing values.
 */
export function normalizeDistribution(
  rawDist: unknown,
  keyFields: string[] = ['label', 'name', 'subgroup', 'academicLevel', 'level', 'office', 'officeName']
): DistributionEntry[] {
  if (!rawDist) return [];

  if (Array.isArray(rawDist)) {
    return rawDist
      .map((entry) => {
        if (!entry || typeof entry !== 'object') return null;
        let label = '';
        for (const k of keyFields) {
          if (entry[k] !== undefined && entry[k] !== null && String(entry[k]).trim() !== '') {
            label = String(entry[k]).trim();
            break;
          }
        }
        if (!label) {
          const fallbackKey = Object.keys(entry).find((k) => k !== 'count' && k !== 'total' && k !== 'value');
          if (fallbackKey && entry[fallbackKey] !== undefined && entry[fallbackKey] !== null) {
            label = String(entry[fallbackKey]).trim();
          }
        }
        const countVal = Number(entry.count ?? entry.total ?? entry.value ?? 0);
        return {
          label: label || 'Unspecified',
          count: Number.isNaN(countVal) ? 0 : countVal,
        };
      })
      .filter((item): item is DistributionEntry => item !== null);
  }

  if (typeof rawDist === 'object') {
    return Object.entries(rawDist as Record<string, unknown>).map(([key, val]) => {
      const num = typeof val === 'number' ? val : Number((val as any)?.count ?? val ?? 0);
      return {
        label: key,
        count: Number.isNaN(num) ? 0 : num,
      };
    });
  }

  return [];
}

function normalizeRosterMember(raw: any): PresidentRosterMember {
  const rawDept = raw?.department;
  const departmentName =
    typeof rawDept === 'string'
      ? rawDept
      : rawDept && typeof rawDept === 'object'
      ? String(rawDept.name ?? rawDept.title ?? rawDept.id ?? '')
      : '';

  const rawDeptId =
    raw?.departmentId !== undefined
      ? raw.departmentId
      : rawDept && typeof rawDept === 'object' && rawDept.id !== undefined
      ? String(rawDept.id)
      : null;

  const rawSubgroup = raw?.subgroup;
  const subgroupName =
    rawSubgroup === undefined || rawSubgroup === null
      ? null
      : typeof rawSubgroup === 'string'
      ? rawSubgroup
      : typeof rawSubgroup === 'object'
      ? String(rawSubgroup.name ?? rawSubgroup.title ?? rawSubgroup.id ?? '')
      : String(rawSubgroup);

  return {
    id: String(raw?.id ?? ''),
    name: String(raw?.name ?? ''),
    department: departmentName,
    departmentId: rawDeptId,
    academicLevel: String(raw?.academicLevel ?? ''),
    membershipStatus: String(raw?.membershipStatus ?? ''),
    subgroup: subgroupName,
    avatarUrl: raw?.avatarUrl !== undefined ? raw.avatarUrl : null,
    executiveOffices: Array.isArray(raw?.executiveOffices) ? raw.executiveOffices : [],
  };
}

export class PresidentService {
  /**
   * Fetch authoritative President Fellowship Roster:
   * GET /api/president/roster
   */
  async getRoster(params: PresidentRosterQueryParams = {}): Promise<PresidentRosterResult> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append('page', String(params.page));
    if (params.limit !== undefined) query.append('limit', String(params.limit));
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.academicLevel && params.academicLevel.trim()) query.append('academicLevel', params.academicLevel.trim());
    if (params.subgroup && params.subgroup.trim()) query.append('subgroup', params.subgroup.trim());
    if (params.office && params.office.trim()) query.append('office', params.office.trim());
    if (params.departmentId && params.departmentId.trim()) query.append('departmentId', params.departmentId.trim());

    const queryString = query.toString();
    const url = `${API_CONFIG.endpoints.president.roster}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<any>(url);
    const payload = response?.data;

    let rawList: any[] = [];
    if (Array.isArray(payload)) {
      rawList = payload;
    } else if (payload && typeof payload === 'object') {
      if (Array.isArray(payload.data)) rawList = payload.data;
      else if (Array.isArray(payload.roster)) rawList = payload.roster;
      else if (Array.isArray(payload.members)) rawList = payload.members;
      else if (Array.isArray(payload.items)) rawList = payload.items;
    }

    const normalizedList = rawList.map(normalizeRosterMember);

    const meta = response?.meta || (payload && typeof payload === 'object' && !Array.isArray(payload) ? (payload.meta || payload) : {});
    const total = typeof meta?.total === 'number'
      ? meta.total
      : typeof (response as any)?.total === 'number'
      ? (response as any).total
      : normalizedList.length;
    const page = typeof meta?.page === 'number'
      ? meta.page
      : typeof (response as any)?.page === 'number'
      ? (response as any).page
      : (params.page ?? 1);
    const limit = typeof meta?.limit === 'number'
      ? meta.limit
      : typeof (response as any)?.limit === 'number'
      ? (response as any).limit
      : (params.limit ?? 20);

    return {
      data: normalizedList,
      total,
      page,
      limit,
    };
  }

  /**
   * Fetch authoritative President Analytics:
   * GET /api/president/analytics
   */
  async getAnalytics(params: PresidentAnalyticsQueryParams = {}): Promise<PresidentAnalyticsData> {
    const query = new URLSearchParams();
    if (params.academicSession && params.academicSession.trim()) {
      query.append('academicSession', params.academicSession.trim());
    }
    if (params.subgroup && params.subgroup.trim()) {
      query.append('subgroup', params.subgroup.trim());
    }
    if (params.office && params.office.trim()) {
      query.append('office', params.office.trim());
    }

    const queryString = query.toString();
    const url = `${API_CONFIG.endpoints.president.analytics}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<any>(url);
    const raw = response?.data?.data ?? response?.data ?? {};

    return {
      totalMembers: typeof raw.totalMembers === 'number' ? raw.totalMembers : 0,
      subgroupDistribution: raw.subgroupDistribution ?? {},
      academicLevelDistribution: raw.academicLevelDistribution ?? {},
      officeDistribution: raw.officeDistribution ?? {},
      eventCount: typeof raw.eventCount === 'number' ? raw.eventCount : 0,
    };
  }
}

export const presidentService = new PresidentService();
