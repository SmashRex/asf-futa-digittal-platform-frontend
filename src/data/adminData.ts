/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  AdminContentItem, 
  AdminMember, 
  AuditLog, 
  RolePermissions, 
  AdminRole, 
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
  OfficeDefinition
} from '../types/adminTypes';

export const ALL_PERMISSION_KEYS: PermissionKey[] = [
  'dashboard.view',
  'members.view',
  'members.create',
  'members.edit',
  'memberAccounts.resetAccess',
  'announcements.view',
  'announcements.create',
  'announcements.edit',
  'announcements.publish',
  'events.view',
  'events.create',
  'events.edit',
  'events.publish',
  'media.view',
  'media.upload',
  'media.edit',
  'media.delete',
  'bibleStudy.view',
  'bibleStudy.create',
  'bibleStudy.edit',
  'bibleStudy.import',
  'bibleStudy.publish',
  'bibleStudy.manageGroups',
  'foundationalSchool.view',
  'foundationalSchool.manage',
  'fs.students.view',
  'fs.students.manage',
  'fs.teachers.assign',
  'fs.admissions.review',
  'fs.classes.manage',
  'fs.materials.manage',
  'leadership.view',
  'leadership.manage',
  'handover.view',
  'handover.manage',
  'governance.view',
  'governance.review',
  'governance.approve',
  'system.health.view',
  'system.logs.view',
  'system.configuration.view',
  'system.configuration.edit',
  'system.academicSessions.manage',
  'system.technicalAdmin',
  'system.dataBackup'
];

export const OFFICES_REGISTRY: OfficeDefinition[] = [
  {
    id: 'off-pres',
    name: 'President / Executive',
    description: 'President & Executive Leader. Highest overall authority in the fellowship. Directs the Executive Council, oversees all ministries and spiritual directions, and provides final sign-off for fellowship-wide governance and transitions.',
    isExecutiveOffice: true,
    authorityLevel: 'GLOBAL_AUTHORITY',
    domain: 'Global Fellowship Oversight',
    domainDescription: 'Fellowship-wide executive leadership, ministry supervision, policy ratification, and overall organizational governance.',
    defaultPermissions: [
      'dashboard.view',
      'members.view',
      'members.create',
      'members.edit',
      'memberAccounts.resetAccess',
      'announcements.view',
      'announcements.create',
      'announcements.edit',
      'announcements.publish',
      'events.view',
      'events.create',
      'events.edit',
      'events.publish',
      'media.view',
      'media.upload',
      'media.edit',
      'media.delete',
      'bibleStudy.view',
      'bibleStudy.create',
      'bibleStudy.edit',
      'bibleStudy.import',
      'bibleStudy.publish',
      'bibleStudy.manageGroups',
      'foundationalSchool.view',
      'foundationalSchool.manage',
      'leadership.view',
      'leadership.manage',
      'handover.view',
      'handover.manage',
      'governance.view',
      'governance.review',
      'governance.approve',
      'system.health.view',
      'system.logs.view',
      'system.configuration.view',
      'system.configuration.edit',
      'system.academicSessions.manage',
      'system.technicalAdmin',
      'system.dataBackup',
      'website.view',
      'website.editCopy',
      'website.manageSections',
      'website.publish'
    ]
  },
  {
    id: 'off-vp-fs',
    name: 'VP / FS Coordinator',
    description: 'Vice President & Foundational School Coordinator. Holds highest administrative authority specifically over the Foundational School (discipleship induction, student progression, classes, teacher assignments, curriculum, materials, and spiritual follow-up across all cohorts).',
    isExecutiveOffice: true,
    authorityLevel: 'DOMAIN_AUTHORITY',
    domain: 'Foundational School',
    domainDescription: 'Highest administrative authority over Foundational School operations (induction, discipleship modules, student advancement, classes, and FS facilitators).',
    defaultPermissions: [
      'dashboard.view',
      'foundationalSchool.view',
      'foundationalSchool.manage',
      'fs.students.view',
      'fs.students.manage',
      'fs.teachers.assign',
      'fs.admissions.review',
      'fs.classes.manage',
      'fs.materials.manage'
    ]
  },
  {
    id: 'off-pub',
    name: 'Publicity Coordinator',
    description: 'Public communications, announcements, graphics, media assets, member directory, and access recovery link reset.',
    isExecutiveOffice: true,
    authorityLevel: 'DOMAIN_AUTHORITY',
    domain: 'Publicity & Media',
    domainDescription: 'Media broadcasts, public graphics, promotional content, digital noticeboard, and communications channels.',
    defaultPermissions: [
      'dashboard.view',
      'announcements.view',
      'announcements.create',
      'announcements.edit',
      'announcements.publish',
      'events.view',
      'events.create',
      'events.edit',
      'events.publish',
      'media.view',
      'media.upload',
      'media.edit',
      'media.delete',
      'members.view',
      'memberAccounts.resetAccess',
      'website.view',
      'website.editCopy',
      'website.manageSections',
      'website.publish',
    ]
  },
  {
    id: 'off-bs',
    name: 'Bible Study Coordinator',
    description: 'Directing annual Bible study syllabus creation, outline verification, and group leader assignments.',
    isExecutiveOffice: true,
    authorityLevel: 'DOMAIN_AUTHORITY',
    domain: 'Bible Study & Curriculum',
    domainDescription: 'Bible study syllabus design, Scripture outlines, teacher guidelines, and discussion group leader supervision.',
    defaultPermissions: [
      'dashboard.view',
      'bibleStudy.view',
      'bibleStudy.create',
      'bibleStudy.edit',
      'bibleStudy.import',
      'bibleStudy.publish',
      'bibleStudy.manageGroups',
      'announcements.view',
      'events.view',
    ]
  },
  {
    id: 'off-sec',
    name: 'General Secretary',
    description: 'Responsible for fellowship meeting minutes, executive correspondence, attendance logs, and official records.',
    isExecutiveOffice: true,
    authorityLevel: 'DOMAIN_AUTHORITY',
    domain: 'Secretariat & Official Records',
    domainDescription: 'Secretariat administration, executive council documentation, official registers, and archival communications.',
    defaultPermissions: [
      'dashboard.view',
      'announcements.view',
      'announcements.create',
      'announcements.edit',
      'events.view',
      'events.create',
      'members.view',
      'governance.view',
      'system.academicSessions.manage',
    ]
  },
  {
    id: 'off-org',
    name: 'Organizing Coordinator',
    description: 'Logistics, physical venue arrangements, security, and fellowship event preparation.',
    isExecutiveOffice: true,
    authorityLevel: 'DELEGATED_COORDINATOR',
    domain: 'Organizing & Logistics',
    domainDescription: 'Logistics management, venue procurement, technical staging, and physical event management.',
    defaultPermissions: [
      'dashboard.view',
      'events.view'
    ]
  },
  {
    id: 'off-drama',
    name: 'Drama Coordinator',
    description: 'Evangelistic drama ministrations, stage productions, and script writing.',
    isExecutiveOffice: true,
    authorityLevel: 'DELEGATED_COORDINATOR',
    domain: 'Drama & Creative Arts',
    domainDescription: 'Christian drama evangelism, script development, rehearsals, and theatrical productions.',
    defaultPermissions: [
      'dashboard.view',
      'events.view'
    ]
  },
  {
    id: 'off-prayer',
    name: 'Prayer Coordinator',
    description: 'Intercession, prayer meetings, retreats, and spiritual vigils.',
    isExecutiveOffice: true,
    authorityLevel: 'DELEGATED_COORDINATOR',
    domain: 'Prayer & Intercession',
    domainDescription: 'Prayer chains, intercessory teams, prayer vigils, and spiritual retreats.',
    defaultPermissions: [
      'dashboard.view',
      'events.view'
    ]
  },
  {
    id: 'off-finsec',
    name: 'Financial Secretary',
    description: 'Financial record-keeping, tithes/offerings auditing, and budget tracking.',
    isExecutiveOffice: true,
    authorityLevel: 'DELEGATED_COORDINATOR',
    domain: 'Finance & Accounts',
    domainDescription: 'Financial ledgers, tithes and offerings bookkeeping, budget monitoring, and financial auditing.',
    defaultPermissions: [
      'dashboard.view',
      'members.view'
    ]
  },
  {
    id: 'off-treasurer',
    name: 'Treasurer',
    description: 'Treasury management, bank operations, and disbursement records.',
    isExecutiveOffice: true,
    authorityLevel: 'DELEGATED_COORDINATOR',
    domain: 'Treasury & Assets',
    domainDescription: 'Disbursements, bank account management, and physical assets custody.',
    defaultPermissions: [
      'dashboard.view',
      'members.view'
    ]
  },
  {
    id: 'off-lib',
    name: 'Librarian',
    description: 'Fellowship book library, study cataloging, and material lending.',
    isExecutiveOffice: true,
    authorityLevel: 'DELEGATED_COORDINATOR',
    domain: 'Library & Resources',
    domainDescription: 'Spiritual library management, book lending catalog, and digital study resources.',
    defaultPermissions: [
      'dashboard.view',
      'bibleStudy.view'
    ]
  }
];

export function computeEffectivePermissions(
  officeName?: string,
  overrides?: PermissionOverride
): EffectivePermissions {
  const result: Partial<EffectivePermissions> = {};
  
  const office = OFFICES_REGISTRY.find(o => o.name === officeName);
  const defaultSet = new Set(office?.defaultPermissions || []);

  const grantedSet = new Set(overrides?.granted || []);
  const revokedSet = new Set(overrides?.revoked || []);

  for (const key of ALL_PERMISSION_KEYS) {
    let effective = defaultSet.has(key);
    if (grantedSet.has(key)) {
      effective = true;
    }
    if (revokedSet.has(key)) {
      effective = false;
    }
    result[key] = effective;
  }

  // If Technical Administration capability is active (system.technicalAdmin),
  // enable technical domain permissions unless explicitly revoked
  if (result['system.technicalAdmin']) {
    const techKeys: PermissionKey[] = [
      'system.health.view',
      'system.logs.view',
      'system.configuration.view',
      'system.configuration.edit',
      'system.dataBackup'
    ];
    for (const tk of techKeys) {
      if (!revokedSet.has(tk)) {
        result[tk] = true;
      }
    }
  }

  return result as EffectivePermissions;
}

export function getPermissionState(
  key: PermissionKey,
  officeName?: string,
  overrides?: PermissionOverride
): 'DEFAULT' | 'GRANTED' | 'REVOKED' | 'NONE' {
  if (overrides?.granted?.includes(key)) {
    return 'GRANTED';
  }
  if (overrides?.revoked?.includes(key)) {
    return 'REVOKED';
  }
  const office = OFFICES_REGISTRY.find(o => o.name === officeName);
  if (office?.defaultPermissions.includes(key)) {
    return 'DEFAULT';
  }
  return 'NONE';
}

export const ROLE_PERMISSIONS_MATRIX: Record<AdminRole, RolePermissions> = {
  'President / Executive': {
    role: 'President / Executive',
    authorityLevel: 'GLOBAL_AUTHORITY',
    canManageStudies: true,
    canApproveStudies: true,
    canManageFS: true,
    canManageAnnouncements: true,
    canManageEvents: true,
    canManageMembers: true,
    canAccessSettings: true,
  },
  'VP / FS Coordinator': {
    role: 'VP / FS Coordinator',
    authorityLevel: 'DOMAIN_AUTHORITY',
    canManageStudies: false,
    canApproveStudies: false,
    canManageFS: true,
    canManageAnnouncements: false,
    canManageEvents: false,
    canManageMembers: false,
    canAccessSettings: false,
  },
  'Bible Study Coordinator': {
    role: 'Bible Study Coordinator',
    authorityLevel: 'DOMAIN_AUTHORITY',
    canManageStudies: true,
    canApproveStudies: true,
    canManageFS: false,
    canManageAnnouncements: true,
    canManageEvents: true,
    canManageMembers: false,
    canAccessSettings: false,
  },
  'Publicity Coordinator': {
    role: 'Publicity Coordinator',
    authorityLevel: 'DOMAIN_AUTHORITY',
    canManageStudies: false,
    canApproveStudies: false,
    canManageFS: false,
    canManageAnnouncements: true,
    canManageEvents: true,
    canManageMembers: false,
    canAccessSettings: true,
  },
  'General Secretary': {
    role: 'General Secretary',
    authorityLevel: 'DOMAIN_AUTHORITY',
    canManageStudies: false,
    canApproveStudies: false,
    canManageFS: false,
    canManageAnnouncements: true,
    canManageEvents: true,
    canManageMembers: true,
    canAccessSettings: false,
  },
  'Organizing Coordinator': {
    role: 'Organizing Coordinator',
    authorityLevel: 'DELEGATED_COORDINATOR',
    canManageStudies: false,
    canApproveStudies: false,
    canManageFS: false,
    canManageAnnouncements: true,
    canManageEvents: true,
    canManageMembers: false,
    canAccessSettings: false,
  },
  'Drama Coordinator': {
    role: 'Drama Coordinator',
    authorityLevel: 'DELEGATED_COORDINATOR',
    canManageStudies: false,
    canApproveStudies: false,
    canManageFS: false,
    canManageAnnouncements: true,
    canManageEvents: true,
    canManageMembers: false,
    canAccessSettings: false,
  },
  'Prayer Coordinator': {
    role: 'Prayer Coordinator',
    authorityLevel: 'DELEGATED_COORDINATOR',
    canManageStudies: false,
    canApproveStudies: false,
    canManageFS: false,
    canManageAnnouncements: true,
    canManageEvents: true,
    canManageMembers: false,
    canAccessSettings: false,
  },
  'Financial Secretary': {
    role: 'Financial Secretary',
    authorityLevel: 'DELEGATED_COORDINATOR',
    canManageStudies: false,
    canApproveStudies: false,
    canManageFS: false,
    canManageAnnouncements: false,
    canManageEvents: false,
    canManageMembers: true,
    canAccessSettings: false,
  },
  'Treasurer': {
    role: 'Treasurer',
    authorityLevel: 'DELEGATED_COORDINATOR',
    canManageStudies: false,
    canApproveStudies: false,
    canManageFS: false,
    canManageAnnouncements: false,
    canManageEvents: false,
    canManageMembers: true,
    canAccessSettings: false,
  },
  'Librarian': {
    role: 'Librarian',
    authorityLevel: 'DELEGATED_COORDINATOR',
    canManageStudies: true,
    canApproveStudies: false,
    canManageFS: false,
    canManageAnnouncements: false,
    canManageEvents: false,
    canManageMembers: false,
    canAccessSettings: false,
  },
  'Technical Administrator': {
    role: 'Technical Administrator',
    authorityLevel: 'DOMAIN_AUTHORITY',
    canManageStudies: false,
    canApproveStudies: false,
    canManageFS: false,
    canManageAnnouncements: false,
    canManageEvents: false,
    canManageMembers: false,
    canAccessSettings: true,
  },
};

export const initialAdminContent: AdminContentItem[] = [
  {
    id: 'admin-bs-01',
    type: 'Bible Study',
    lessonNumber: 1,
    title: 'Universal Concepts of Marriage',
    subTheme: 'The Concept of Marriage (1)',
    annualTheme: 'The Reign of God: Marriage And Christian Lifestyle',
    author: 'Brother Samuel Adebayo',
    authorRole: 'Bible Study Coordinator',
    status: 'Published',
    category: 'Bible Study',
    date: 'Jan 4, 2026',
    createdAt: '2026-01-02T08:00:00Z',
    updatedAt: '2026-01-03T14:30:00Z',
    keyScripture: 'Gen 2:24',
    textScriptures: ['Gen 2:24', 'Josh 11:1-5'],
    summary: 'A deep examination of God\'s original blueprint for marriage, contrasting divine covenant with contemporary cultural distortions.',
    aims: [
      'To understand the origin and universal definition of marriage according to God\'s word.',
      'To identify unscriptural concepts and societal distortions of marriage in our society today.',
      'To emphasize the importance of shared spiritual values and agreement in a Christian marriage.'
    ],
    introduction: 'Marriage is an institution ordained by God from the beginning, designed for companionship, procreation, and reflecting the sacred relationship between Christ and the Church.',
    sections: [
      {
        id: 'sec-1',
        title: '1. The Origin and Covenant of Marriage',
        paragraphs: [
          'In creation, God established marriage as a sacred, heterosexual, and monogamous covenant. Leaving father and mother to cleave unto one\'s spouse creates a unified spiritual and physical bond.'
        ],
        scriptureRefs: ['Gen 2:23-24', 'Matt 19:4-6']
      }
    ],
    memoryVerse: {
      reference: 'Amos 3:3',
      text: 'Can two walk together, except they agree?'
    },
    discussionQuestions: [
      'Based on Gen 2:23-24, what are the fundamental elements that constitute a marriage according to God\'s original design?',
      'Discuss the implications of Amos 3:3 regarding shared faith in Christian relationships.'
    ],
    prayerPoints: [
      'Lord Jesus, anchor my heart in Your eternal Word regarding purity and Christian relationships.',
      'Father, protect the Anglican Students\' Fellowship (ASF FUTA) from subtle worldly compromises.'
    ],
    isCurrent: true,
    isPublished: true
  },
  {
    id: 'admin-bs-02',
    type: 'Bible Study',
    lessonNumber: 2,
    title: 'Biblical Foundations of Covenant Unions',
    subTheme: 'The Concept of Marriage (2)',
    annualTheme: 'The Reign of God: Marriage And Christian Lifestyle',
    author: 'Brother Emmanuel Okafor',
    authorRole: 'Assistant Bible Study Leader',
    status: 'Pending Review',
    category: 'Bible Study',
    date: 'Jan 11, 2026',
    createdAt: '2026-01-08T09:15:00Z',
    updatedAt: '2026-01-09T11:00:00Z',
    reviewComments: [
      'Please verify the Greek translation note in Section 2 before final approval.',
      'Formatting and scriptures look well grounded.'
    ],
    keyScripture: 'Eph 5:22-33',
    textScriptures: ['Eph 5:22-33', 'Col 3:18-19'],
    summary: 'Exploring the sacrificial Christ-like love and godly submission required in Christian homes.',
    aims: [
      'To study Christ\'s relationship with the Church as the gold standard for Christian unions.',
      'To provide practical biblical guidelines for single brethren preparing for godly coursthip.'
    ],
    introduction: 'The Apostle Paul compares the relationship between husband and wife to that of Christ and the Church. This reveals that Christian covenant unions are spiritual testimonies.',
    memoryVerse: {
      reference: 'Ephesians 5:25',
      text: 'Husbands, love your wives, even as Christ also loved the church, and gave himself for it.'
    },
    discussionQuestions: [
      'How does Christ\'s self-sacrificing love reframe the biblical definition of headship?'
    ],
    prayerPoints: [
      'Lord, grant our youth grace to honor You in courtship and singlehood.'
    ],
    isCurrent: false,
    isPublished: false
  },
  {
    id: 'admin-bs-03',
    type: 'Bible Study',
    lessonNumber: 3,
    title: 'Walking in Sexual Purity on Campus',
    subTheme: 'Holiness & Youth',
    annualTheme: 'The Reign of God: Marriage And Christian Lifestyle',
    author: 'Sister Grace Temi',
    authorRole: 'Study Writer',
    status: 'Draft',
    category: 'Bible Study',
    date: 'Jan 18, 2026',
    createdAt: '2026-01-14T16:00:00Z',
    updatedAt: '2026-01-14T18:20:00Z',
    keyScripture: '1 Thess 4:3-5',
    textScriptures: ['1 Thess 4:3-5', '1 Cor 6:18-20'],
    summary: 'Practical study on maintaining sanctification and honoring God with our bodies amidst campus pressures.',
    aims: [
      'To understand God\'s clear command regarding holiness.',
      'To equip students with practical tools to flee youthful lusts.'
    ],
    introduction: 'In a university environment filled with permissive messaging, God\'s call to holiness remains immutable.',
    memoryVerse: {
      reference: '1 Thessalonians 4:3',
      text: 'For this is the will of God, even your sanctification, that ye should abstain from fornication.'
    },
    discussionQuestions: [
      'What practical boundaries should a Christian student set in daily interactions?'
    ],
    prayerPoints: [
      'Holy Spirit, purify our desires and keep us blameless.'
    ],
    isCurrent: false,
    isPublished: false
  },
  {
    id: 'admin-ann-01',
    type: 'Announcement',
    title: 'Semester Prayer Retreat Announcement',
    author: 'Brother Samuel Adebayo',
    authorRole: 'Publicity Coordinator',
    status: 'Published',
    category: 'Announcement',
    date: 'Feb 1, 2026',
    createdAt: '2026-01-28T10:00:00Z',
    updatedAt: '2026-01-29T08:00:00Z',
    summary: 'The annual ASF Semester Prayer Retreat will hold at the Prayer Mountain on Feb 20-22.',
    introduction: 'Brethren are requested to prepare fasting and praying towards our upcoming retreat.',
    isPublished: true
  },
  {
    id: 'admin-ev-01',
    type: 'Event',
    title: 'Special Joint Service & Praise Night',
    author: 'General Secretary',
    authorRole: 'General Secretary',
    status: 'Published',
    category: 'Event',
    date: 'Mar 15, 2026',
    createdAt: '2026-02-01T12:00:00Z',
    updatedAt: '2026-02-02T10:00:00Z',
    venue: 'ASF Fellowship Hall, FUTA',
    startTime: '5:00 PM',
    endTime: '8:30 PM',
    speaker: 'Venerable Dr. J. A. Adediran',
    speakerRole: 'Chaplain & Diocesan Missioner',
    mode: 'Hybrid',
    summary: 'Joint fellowship service with guest ministers, chorale renditions, and spiritual revival.',
    isPublished: true
  }
];

export const initialAdminMembers: AdminMember[] = [
  {
    id: 'user_01',
    name: 'Temiloluwa Afolabi',
    email: 'member@asf-futa.org',
    department: 'Computer Science',
    level: '400 Level',
    subgroup: 'Technical Team',
    role: 'Member',
    isExecutive: false,
    status: 'Active',
    joinDate: '2023-09-15',
    lastActive: 'Today, 11:20 AM',
    phone: '+234 803 123 4567'
  },
  {
    id: 'user_02',
    name: 'Brother Samuel Adebayo',
    email: 'admin@asf-futa.org',
    department: 'Electrical Engineering',
    level: '500 Level',
    subgroup: 'Executives',
    office: 'Bible Study Coordinator',
    isExecutive: true,
    role: 'Bible Study Coordinator',
    status: 'Active',
    joinDate: '2022-10-01',
    lastActive: '10 mins ago',
    phone: '+234 802 987 6543'
  },
  {
    id: 'user_03',
    name: 'Brother David Olatunji',
    email: 'president@asf-futa.org',
    department: 'Mechanical Engineering',
    level: '500 Level',
    subgroup: 'Executives',
    office: 'President / Executive',
    isExecutive: true,
    role: 'President / Executive',
    status: 'Active',
    joinDate: '2022-10-01',
    lastActive: '1 hour ago',
    phone: '+234 805 555 1212'
  },
  {
    id: 'user_04',
    name: 'Sister Mary Bamidele',
    email: 'vp.fs@asf-futa.org',
    department: 'Biochemistry',
    level: '500 Level',
    subgroup: 'Foundational School',
    office: 'VP / FS Coordinator',
    isExecutive: true,
    role: 'VP / FS Coordinator',
    status: 'Active',
    joinDate: '2022-11-10',
    lastActive: 'Yesterday',
    phone: '+234 810 444 8899'
  },
  {
    id: 'user_05',
    name: 'Brother Daniel Chukwu',
    email: 'publicity@asf-futa.org',
    department: 'Architecture',
    level: '300 Level',
    subgroup: 'Publicity Unit',
    office: 'Publicity Coordinator',
    isExecutive: true,
    role: 'Publicity Coordinator',
    status: 'Active',
    joinDate: '2024-02-14',
    lastActive: '3 hours ago',
    phone: '+234 816 777 3322'
  },
  {
    id: 'user_06',
    name: 'Sister Ruth Agbede',
    email: 'ruth.a@asf-futa.org',
    department: 'Civil Engineering',
    level: '200 Level',
    subgroup: 'Choir',
    role: 'FS Student',
    isExecutive: false,
    status: 'Pending Approval',
    joinDate: '2026-01-10',
    lastActive: '2 days ago',
    phone: '+234 807 111 2233'
  },
  {
    id: 'user_07',
    name: 'Brother Samuel Okafor',
    email: 'organizing@asf-futa.org',
    department: 'Industrial Design',
    level: '400 Level',
    subgroup: 'Organizing Unit',
    office: 'Organizing Coordinator',
    isExecutive: true,
    role: 'Organizing Coordinator',
    status: 'Active',
    joinDate: '2023-11-01',
    lastActive: '5 hours ago',
    phone: '+234 809 333 4455'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    timestamp: 'Today, 10:45 AM',
    actor: 'Brother David Olatunji',
    actorRole: 'President / Executive',
    actorAuthorityLevel: 'GLOBAL_AUTHORITY',
    action: 'Approved & Ratified Executive Governance Request',
    target: 'Universal Concepts of Marriage (Lesson 1)',
    details: 'Executive review completed and approved for revised study outline.',
    approvalState: 'Presidential Executive Approval'
  },
  {
    id: 'audit-2',
    timestamp: 'Yesterday, 04:20 PM',
    actor: 'Brother Samuel Adebayo',
    actorRole: 'Bible Study Coordinator',
    actorAuthorityLevel: 'DOMAIN_AUTHORITY',
    action: 'Submitted for Executive Review',
    target: 'Biblical Foundations of Covenant Unions (Lesson 2)',
    details: 'Draft submitted for Presidential executive sign-off.',
    approvalState: 'Pending Executive Review'
  },
  {
    id: 'audit-3',
    timestamp: '2 days ago',
    actor: 'Sister Mary Bamidele',
    actorRole: 'VP / FS Coordinator',
    actorAuthorityLevel: 'DOMAIN_AUTHORITY',
    action: 'Enrolled FS Discipleship Cohort & Assigned Facilitator',
    target: 'Foundational School — Induction Cohort B',
    details: 'Assigned Sister Ruth Agbede to Foundational School teaching team and finalized syllabus.',
    approvalState: 'Executed by FS Authority'
  },
  {
    id: 'audit-4',
    timestamp: '3 days ago',
    actor: 'Brother David Olatunji',
    actorRole: 'President / Executive',
    actorAuthorityLevel: 'GLOBAL_AUTHORITY',
    action: 'Ratified Executive Council Schedule',
    target: 'Semester Theme Announcement',
    details: 'Approved official semester theme release for member mobile application.',
    approvalState: 'Executive Sign-off'
  }
];

export const initialLeadershipRoles: LeadershipRole[] = [
  {
    id: 'role-pres',
    roleName: 'President / Executive',
    category: 'Executive',
    authorityLevel: 'GLOBAL_AUTHORITY',
    domain: 'Global Fellowship Oversight',
    domainDescription: 'Fellowship-wide executive leadership, spiritual oversight, policy ratification, and overall organizational governance.',
    description: 'President & Executive Leader. Highest overall authority in the fellowship. Directs the Executive Council, oversees all ministries and spiritual directions, and provides final sign-off for fellowship-wide governance and transitions.',
    assignedMember: {
      id: 'user_03',
      name: 'Brother David Olatunji',
      email: 'president@asf-futa.org',
      department: 'Mechanical Engineering',
      level: '500 Level',
      phone: '+234 805 555 1212'
    },
    status: 'Active',
    isProtectedRole: true,
    responsibilities: [
      'Preside as the highest overall authority over Executive Council meetings and general assemblies.',
      'Provide final executive approval on governance proposals, policy updates, and executive handovers.',
      'Supervise all departmental coordinators and spiritual arms of the fellowship.'
    ],
    capabilitiesSummary: [
      'Global Fellowship Authority',
      'Executive Oversight',
      'Policy Ratification',
      'Governance Sign-off',
      'Executive Council Leadership',
      'Leadership Handover Supervision'
    ],
    handoverStatus: 'Ready',
    handoverReadinessPercent: 95,
    lastUpdated: '1 hour ago'
  },
  {
    id: 'role-vp-fs',
    roleName: 'VP / FS Coordinator',
    category: 'Executive',
    authorityLevel: 'DOMAIN_AUTHORITY',
    domain: 'Foundational School',
    domainDescription: 'Highest administrative authority over Foundational School operations (induction, discipleship modules, classes, student advancement, and FS facilitators).',
    description: 'Vice President & Foundational School Coordinator. Holds highest administrative authority specifically over the Foundational School. Leads discipleship curricula, student induction, classes, FS facilitators, and spiritual mentorship.',
    assignedMember: {
      id: 'user_04',
      name: 'Sister Mary Bamidele',
      email: 'vp.fs@asf-futa.org',
      department: 'Biochemistry',
      level: '500 Level',
      phone: '+234 810 444 8899'
    },
    status: 'Active',
    isProtectedRole: true,
    responsibilities: [
      'Serve as the highest administrative authority specifically over the Foundational School.',
      'Oversee FS student induction, attendance records, cohort progression, and certifications.',
      'Manage FS classes, levels, syllabi, study materials, and facilitator assignments.'
    ],
    capabilitiesSummary: [
      'FS Domain Authority',
      'Discipleship Curriculum Management',
      'Student Induction & Progress Tracking',
      'FS Facilitator Assignment',
      'FS Classes & Materials Management'
    ],
    handoverStatus: 'Ready',
    handoverReadinessPercent: 90,
    lastUpdated: '2 hours ago'
  },
  {
    id: 'role-pub-coord',
    roleName: 'Publicity Coordinator',
    category: 'Coordinator',
    authorityLevel: 'DOMAIN_AUTHORITY',
    domain: 'Publicity & Media',
    domainDescription: 'Authority over public communications, graphics, announcements, digital noticeboard, and member directory access.',
    description: 'Oversees public communications, announcements, graphics, media library, member directory administration, and platform diagnostics/logs.',
    assignedMember: {
      id: 'user_05',
      name: 'Brother Daniel Chukwu',
      email: 'publicity@asf-futa.org',
      department: 'Architecture',
      level: '300 Level',
      phone: '+234 816 777 3322'
    },
    status: 'Active',
    responsibilities: [
      'Draft and publish fellowship-wide announcements and public event notices.',
      'Maintain member directory registrations and dispatch access recovery links.',
      'Monitor platform health diagnostics and technical system logs.'
    ],
    capabilitiesSummary: [
      'Publicity Content Creation',
      'Media Asset Upload',
      'Member Directory Access',
      'Platform Health Logs'
    ],
    handoverStatus: 'Ready',
    handoverReadinessPercent: 90,
    lastUpdated: '3 hours ago'
  },
  {
    id: 'role-bs-coord',
    roleName: 'Bible Study Coordinator',
    category: 'Coordinator',
    authorityLevel: 'DOMAIN_AUTHORITY',
    domain: 'Bible Study & Curriculum',
    domainDescription: 'Authority over Bible study outlines, Scripture curricula, facilitator training, and group discussion leaders.',
    description: 'Directs Bible Study syllabus creation, outline verification, and discussion group leadership.',
    assignedMember: {
      id: 'user_02',
      name: 'Brother Samuel Adebayo',
      email: 'admin@asf-futa.org',
      department: 'Electrical Engineering',
      level: '500 Level',
      phone: '+234 802 987 6543'
    },
    status: 'Active',
    responsibilities: [
      'Author and edit annual theme Bible study outlines.',
      'Train Bible study discussion facilitators across subgroups.',
      'Verify Scripture references and submit for Executive review.'
    ],
    capabilitiesSummary: [
      'Bible Outline Creation',
      'Study Facilitator Assignment',
      'Outline Verification'
    ],
    handoverStatus: 'In Progress',
    handoverReadinessPercent: 65,
    lastUpdated: 'Yesterday'
  },
  {
    id: 'role-gen-sec',
    roleName: 'General Secretary',
    category: 'Executive',
    authorityLevel: 'DOMAIN_AUTHORITY',
    domain: 'Secretariat & Official Records',
    domainDescription: 'Authority over meeting records, official registers, correspondence archives, and administrative documentation.',
    description: 'Responsible for fellowship records, meeting minutes, correspondence, and official documentation.',
    assignedMember: {
      id: 'user_sec',
      name: 'Sister Deborah Adeyemi',
      email: 'secretary@asf-futa.org',
      department: 'Civil Engineering',
      level: '400 Level',
      phone: '+234 803 999 1122'
    },
    status: 'Active',
    responsibilities: [
      'Record minutes at Executive Committee and General Body meetings.',
      'Manage official correspondence with campus authorities and alumni.',
      'Maintain executive archives and attendance logs.'
    ],
    capabilitiesSummary: [
      'Meeting Minutes Logging',
      'Official Correspondence',
      'Records Archiving'
    ],
    handoverStatus: 'In Progress',
    handoverReadinessPercent: 50,
    lastUpdated: '4 days ago'
  },
  {
    id: 'role-org-coord',
    roleName: 'Organizing Coordinator',
    category: 'Executive',
    authorityLevel: 'DELEGATED_COORDINATOR',
    domain: 'Organizing & Logistics',
    domainDescription: 'Authority over physical event setup, venue logistics, technical staging, and ushering coordination.',
    description: 'Logistics management, venue arrangements, security, and physical fellowship setup.',
    assignedMember: {
      id: 'user_07',
      name: 'Brother Samuel Okafor',
      email: 'organizing@asf-futa.org',
      department: 'Industrial Design',
      level: '400 Level',
      phone: '+234 809 333 4455'
    },
    status: 'Active',
    responsibilities: [
      'Coordinate fellowship venue seating, lighting, and sound equipment.',
      'Manage ushering and security logistics during general services.',
      'Organize physical logistics for special fellowship programs.'
    ],
    capabilitiesSummary: [
      'Venue Setup',
      'Logistics Management',
      'Event Security Coordination'
    ],
    handoverStatus: 'In Progress',
    handoverReadinessPercent: 60,
    lastUpdated: '1 day ago'
  }
];

export const initialHandoverChecklist: HandoverChecklistItem[] = [
  {
    id: 'chk-1',
    roleId: 'role-pres',
    roleName: 'President / Executive',
    label: 'Current role holder and incoming executive candidate identified',
    category: 'Briefing',
    completed: true,
    updatedAt: 'Aug 18, 2026'
  },
  {
    id: 'chk-2',
    roleId: 'role-pres',
    roleName: 'President / Executive',
    label: 'Diocesan chaplaincy contact protocols and constitution documented',
    category: 'Documentation',
    completed: true,
    updatedAt: 'Aug 19, 2026'
  },
  {
    id: 'chk-3',
    roleId: 'role-bs-coord',
    roleName: 'Bible Study Coordinator',
    label: 'Annual Bible Study outline master templates organized in shared drive',
    category: 'Resource Transfer',
    completed: true,
    updatedAt: 'Aug 20, 2026'
  },
  {
    id: 'chk-4',
    roleId: 'role-bs-coord',
    roleName: 'Bible Study Coordinator',
    label: 'Facilitator training slides and group leader handbook transferred',
    category: 'Resource Transfer',
    completed: false,
    updatedAt: 'Aug 21, 2026'
  },
  {
    id: 'chk-5',
    roleId: 'role-pub-coord',
    roleName: 'Publicity Coordinator',
    label: 'Social media handles, Canva brand kit, and publicity drive credentials reviewed',
    category: 'Access & Keys',
    completed: true,
    updatedAt: 'Aug 20, 2026'
  },
  {
    id: 'chk-6',
    roleId: 'role-vp-fs',
    roleName: 'VP / FS Coordinator',
    label: 'FS Student registration logs and graduation certificates folder organized',
    category: 'Documentation',
    completed: false,
    updatedAt: 'Aug 15, 2026'
  },
  {
    id: 'chk-7',
    roleId: 'role-vp-fs',
    roleName: 'VP / FS Coordinator',
    label: 'Incoming FS Coordinator introductory briefing session conducted',
    category: 'Briefing',
    completed: false,
    updatedAt: 'Aug 12, 2026'
  },
  {
    id: 'chk-8',
    roleId: 'role-gen-sec',
    roleName: 'General Secretary',
    label: 'Executive meeting minutes archive and attendance registers uploaded',
    category: 'Documentation',
    completed: true,
    updatedAt: 'Aug 17, 2026'
  }
];

export const initialGovernanceRequests: GovernanceRequest[] = [
  {
    id: 'gov-req-1',
    type: 'Bible Study Deletion',
    target: 'Universal Concepts of Marriage (Lesson 1)',
    targetId: 'admin-bs-01',
    requester: {
      name: 'Brother Samuel Adebayo',
      role: 'Bible Study Coordinator',
      authorityLevel: 'DOMAIN_AUTHORITY',
      email: 'admin@asf-futa.org'
    },
    reason: 'Superseded by updated 2026 Revised Edition containing expanded Greek translation notes and revised group discussion questions.',
    createdAt: '2026-08-20T14:30:00Z',
    status: 'Pending',
    requiredApprovals: 2,
    currentApprovals: [
      {
        approverName: 'Brother Samuel Adebayo',
        approverRole: 'Bible Study Coordinator',
        approverAuthorityLevel: 'DOMAIN_AUTHORITY',
        approvedAt: '2026-08-20T14:30:00Z',
        comments: 'Initiated deletion request for obsolete version. Awaiting Executive President review.'
      }
    ],
    consequences: [
      'This published study outline will be permanently unpublished from the member application upon Executive approval.',
      'Members will no longer be able to access Lesson 1 notes or discussion questions in the reader.',
      'Associated offline cached copies on member devices will be invalidated upon next sync.'
    ],
    isDestructive: true
  },
  {
    id: 'gov-req-2',
    type: 'Emergency Retraction',
    target: 'Semester Prayer Retreat Notice',
    targetId: 'admin-ann-01',
    requester: {
      name: 'Brother Daniel Chukwu',
      role: 'Publicity Coordinator',
      authorityLevel: 'DOMAIN_AUTHORITY',
      email: 'publicity@asf-futa.org'
    },
    reason: 'Venue changed from Mountain Hall to Main Sanctuary due to maintenance schedule.',
    createdAt: '2026-08-21T09:15:00Z',
    status: 'Approved',
    requiredApprovals: 1,
    currentApprovals: [
      {
        approverName: 'Brother David Olatunji',
        approverRole: 'President / Executive',
        approverAuthorityLevel: 'GLOBAL_AUTHORITY',
        approvedAt: '2026-08-21T09:30:00Z',
        comments: 'Executive President approved retraction. Corrected notice published.'
      }
    ],
    consequences: [
      'Notice will be immediately removed from active member push feeds.',
      'Correction banner will be appended to the announcement history.'
    ],
    isDestructive: false
  },
  {
    id: 'gov-req-3',
    type: 'Role Elevation',
    target: 'Sister Ruth Agbede -> Assistant FS Coordinator',
    requester: {
      name: 'Sister Mary Bamidele',
      role: 'VP / FS Coordinator',
      authorityLevel: 'DOMAIN_AUTHORITY',
      email: 'vp.fs@asf-futa.org'
    },
    reason: 'Appointment of Assistant FS Coordinator for the upcoming Foundational School semester cohort.',
    createdAt: '2026-08-21T18:00:00Z',
    status: 'Pending',
    requiredApprovals: 1,
    currentApprovals: [],
    consequences: [
      'Grants user privileges to manage FS student enrollment, discipleship classes, and graduation logs.',
      'Elevates user permissions in the Foundational School admin module.'
    ],
    isDestructive: false
  }
];

export const initialSystemHealth: SystemHealthItem[] = [
  {
    id: 'health-api',
    name: 'API Gateway & Gemini Proxy',
    category: 'Core API',
    status: 'Operational',
    uptimeMetric: '99.98%',
    latencyMs: 42,
    lastChecked: 'Just now',
    diagnosticDetails: 'Express API server active. Server-side Gemini AI proxy operational with active rate limits.',
    endpointOrResource: 'https://api.asf-futa.org/api/v1'
  },
  {
    id: 'health-db',
    name: 'Firestore Central Database',
    category: 'Database',
    status: 'Operational',
    uptimeMetric: '100%',
    latencyMs: 18,
    lastChecked: 'Just now',
    diagnosticDetails: 'Real-time database sync active. Security rules verified and indexed for member queries.',
    endpointOrResource: 'firestore.googleapis.com / asf-futa-db'
  },
  {
    id: 'health-storage',
    name: 'Cloud Media Storage & Assets',
    category: 'Storage',
    status: 'Operational',
    uptimeMetric: '99.95%',
    latencyMs: 65,
    lastChecked: '2 mins ago',
    diagnosticDetails: 'Media library CDN storage accessible. Image generation assets cached.',
    endpointOrResource: 'storage.googleapis.com/asf-media-bucket'
  },
  {
    id: 'health-pwa',
    name: 'Service Worker & Offline Engine',
    category: 'Offline Sync',
    status: 'Operational',
    uptimeMetric: '100%',
    latencyMs: 5,
    lastChecked: 'Just now',
    diagnosticDetails: 'PWA service worker active. Pre-cached 12 Bible study outlines and 5 announcement files.',
    endpointOrResource: 'CacheStorage / asf-offline-v2'
  }
];

export const initialSystemLogs: SystemLogItem[] = [
  {
    id: 'log-001',
    timestamp: 'Today, 11:15 AM',
    severity: 'Info',
    component: 'Sync Worker',
    event: 'Prefetch Completed',
    status: '200 OK',
    message: 'Bible Study Lesson 1 & 2 pre-cached for 142 offline registered devices.',
    details: 'Triggered by automated content publication listener.'
  },
  {
    id: 'log-002',
    timestamp: 'Today, 11:02 AM',
    severity: 'Success',
    component: 'Auth Service',
    event: 'Role Verification',
    status: '200 OK',
    message: 'Authenticated session initialized for Technical Administrator (user_01).',
    details: 'JWT token validated with canAccessSettings scope.'
  },
  {
    id: 'log-003',
    timestamp: 'Today, 10:45 AM',
    severity: 'Warning',
    component: 'Storage',
    event: 'Media Upload Size',
    status: '200 OK',
    message: 'Uploaded PNG asset (fellowship_banner.png) exceeds 8MB recommended size.',
    details: 'File size: 8.4MB. Automatic WebP compression applied.'
  },
  {
    id: 'log-004',
    timestamp: 'Today, 09:30 AM',
    severity: 'Error',
    component: 'API Gateway',
    event: 'Gemini Proxy Rate Limit',
    status: '404 Not Found',
    message: 'Rate limit threshold reached during automated outline translation. Retry scheduled in 30s.',
    details: 'Quota exceeded for model gemini-2.5-flash.'
  },
  {
    id: 'log-005',
    timestamp: 'Yesterday, 06:12 PM',
    severity: 'Info',
    component: 'Database',
    event: 'Governance Audit Sync',
    status: '200 OK',
    message: 'Governance request #gov-req-1 audit trail synchronized successfully.',
    details: 'Logged signature by Bible Study Coordinator.'
  },
  {
    id: 'log-006',
    timestamp: 'Yesterday, 04:20 PM',
    severity: 'Success',
    component: 'Bible Study Engine',
    event: 'Outline Status Update',
    status: '200 OK',
    message: 'Updated status for Lesson 1 (Universal Concepts of Marriage) to Published.',
    details: 'Published by Brother Samuel Adebayo.'
  },
  {
    id: 'log-007',
    timestamp: '2 days ago',
    severity: 'Info',
    component: 'Storage',
    event: 'Cache Clearance',
    status: '200 OK',
    message: 'Invalidated stale announcement cache for 312 active member sessions.',
    details: 'Automated cache purge on new announcement release.'
  },
  {
    id: 'log-008',
    timestamp: '3 days ago',
    severity: 'Warning',
    component: 'Auth Service',
    event: 'Role Switch Attempt',
    status: '403 Forbidden',
    message: 'Unauthorized role switch attempt to President / Executive blocked by RBAC matrix.',
    details: 'User ID: user_05 (Publicity Coordinator).'
  },
  {
    id: 'log-009',
    timestamp: '3 days ago',
    severity: 'Error',
    component: 'Sync Worker',
    event: 'Offline Delta Sync',
    status: 'Timeout',
    message: 'Network timeout during offline sync handshake for 3 member clients.',
    details: 'Client connection dropped before completion.'
  },
  {
    id: 'log-010',
    timestamp: '4 days ago',
    severity: 'Success',
    component: 'Database',
    event: 'Backup Verification',
    status: '200 OK',
    message: 'Automated nightly snapshot verified. Total records: 1,420.',
    details: 'Snapshot checksum matched master integrity hash.'
  }
];

export const initialSystemConfig: SystemConfiguration = {
  syncIntervalMinutes: 15,
  offlineCacheLimitMB: 100,
  conflictResolutionPolicy: 'Server Wins',
  defaultStudyLanguage: 'English',
  maxMediaUploadSizeMB: 10,
  apiTimeoutSeconds: 30,
  maintenanceModeActive: false,
  maintenanceReason: 'Scheduled platform database schema upgrade and server optimization.',
  autoArchiveOutlinesSemesterEnd: true,
  auditLogRetentionDays: 90,
  lastUpdated: 'Aug 21, 2026, 04:30 PM',
  updatedBy: 'Temiloluwa Afolabi (Technical Administrator)'
};

export const initialRoleAssignments: RoleAssignmentExecution[] = [
  {
    id: 'exec-001',
    targetMemberId: 'user_06',
    targetMemberName: 'Sister Ruth Agbede',
    targetMemberEmail: 'ruth.a@asf-futa.org',
    department: 'Civil Engineering',
    level: '200 Level',
    currentRole: 'FS Student / Member',
    newRole: 'VP / FS Coordinator',
    approvalStatus: 'Approved',
    requestedBy: 'Sister Mary Bamidele (VP / FS Coordinator)',
    approvedBy: 'Brother David Olatunji (President / Executive)',
    reason: 'Approved semester leadership transition for Foundational School Coordinator role.',
    createdAt: '2026-08-20T11:00:00Z',
    consequences: [
      'Grants administrative rights to manage Foundational School syllabus and student rosters.',
      'Updates member status in ASF Central Member Directory.',
      'Issues role-scoped permissions in the ASF Admin Dashboard.'
    ]
  }
];


