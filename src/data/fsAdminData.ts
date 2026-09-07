/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  FSStudent, 
  FSTeacher, 
  FSAdmissionApplication, 
  FSClassLevel, 
  FSActivityLog 
} from '../types/fsAdminTypes';

export const initialFSTeachers: FSTeacher[] = [
  {
    id: 'teacher-1',
    name: 'Sister Mary Bamidele',
    email: 'vp.fs@asf-futa.org',
    phone: '+234 810 444 8899',
    department: 'Biochemistry',
    academicLevel: '500 Level',
    assignedStudentsCount: 6,
    assignedFoundationalLevel: 'Level 1: Basic Doctrines',
    status: 'Active',
    specialization: 'Doctrinal Foundations, Salvation & Assurance'
  },
  {
    id: 'teacher-2',
    name: 'Brother Samuel Adebayo',
    email: 'samuel.a@asf-futa.org',
    phone: '+234 802 987 6543',
    department: 'Electrical Engineering',
    academicLevel: '500 Level',
    assignedStudentsCount: 5,
    assignedFoundationalLevel: 'Level 2: Spiritual Growth',
    status: 'Active',
    specialization: 'Prayer Disciplines, Scripture Hermeneutics & Fasting'
  },
  {
    id: 'teacher-3',
    name: 'Sister Ruth Agbede',
    email: 'ruth.a@asf-futa.org',
    phone: '+234 807 111 2233',
    department: 'Civil Engineering',
    academicLevel: '400 Level',
    assignedStudentsCount: 4,
    assignedFoundationalLevel: 'Level 1: Basic Doctrines',
    status: 'Active',
    specialization: 'Induction Care, Campus Disciple Mentorship'
  },
  {
    id: 'teacher-4',
    name: 'Brother Daniel Chukwu',
    email: 'daniel.c@asf-futa.org',
    phone: '+234 816 777 3322',
    department: 'Architecture',
    academicLevel: '300 Level',
    assignedStudentsCount: 3,
    assignedFoundationalLevel: 'Level 3: Christian Stewardship',
    status: 'Active',
    specialization: 'Stewardship, Ministry Ethics & Fellowship Service'
  },
  {
    id: 'teacher-5',
    name: 'Sister Deborah Adeleke',
    email: 'deborah.ad@asf-futa.org',
    phone: '+234 803 555 7788',
    department: 'Meteorology',
    academicLevel: '400 Level',
    assignedStudentsCount: 4,
    assignedFoundationalLevel: 'Level 2: Spiritual Growth',
    status: 'Active',
    specialization: 'Holy Spirit Baptism & Spiritual Gifts'
  },
  {
    id: 'teacher-6',
    name: 'Brother Paul Eniola',
    email: 'paul.e@asf-futa.org',
    phone: '+234 812 333 9900',
    department: 'Computer Science',
    academicLevel: '500 Level',
    assignedStudentsCount: 2,
    assignedFoundationalLevel: 'Level 3: Christian Stewardship',
    status: 'Active',
    specialization: 'Personal Evangelism, Outreach & Apologetics'
  }
];

export const initialFSStudents: FSStudent[] = [
  {
    id: 'fs-stud-01',
    fsIdNumber: 'FS-2025-001',
    name: 'Temiloluwa Afolabi',
    email: 'temi.afolabi@futa.edu.ng',
    phone: '+234 803 123 4567',
    department: 'Computer Science',
    academicLevel: '300 Level',
    foundationalLevel: 'Level 1: Basic Doctrines',
    status: 'Active',
    previousAffiliation: 'Anglican Youth Fellowship (AYF), St. David Cathedral Akure',
    enrollmentDate: '2025-10-15',
    assignedTeacherId: 'teacher-1',
    assignedTeacherName: 'Sister Mary Bamidele',
    completedChaptersCount: 4,
    totalChaptersCount: 6,
    attendancePercent: 92,
    verificationNotes: 'Baptism verified with baptismal card. Regularly participates in Sunday discussion sessions.',
    isVerified: true,
    completionCertified: false,
    chapterProgress: [
      { chapterNumber: 1, title: 'Salvation and the New Birth', status: 'Completed', completedDate: '2025-10-22', score: 94, facilitatorFeedback: 'Excellent scriptural grasp of Romans 10:9-10.' },
      { chapterNumber: 2, title: 'The Authority of the Scriptures', status: 'Completed', completedDate: '2025-11-05', score: 88, facilitatorFeedback: 'Good memory verse recitation.' },
      { chapterNumber: 3, title: 'The Trinity & Person of the Holy Spirit', status: 'Completed', completedDate: '2025-11-19', score: 90, facilitatorFeedback: 'Clear understanding of the divinity of Christ.' },
      { chapterNumber: 4, title: 'Water Baptism & The Lord’s Supper', status: 'Completed', completedDate: '2025-12-03', score: 85, facilitatorFeedback: 'Understands sacramental theology within Anglican liturgy.' },
      { chapterNumber: 5, title: 'Prayer and Daily Quiet Time', status: 'In Progress' },
      { chapterNumber: 6, title: 'Christian Fellowship and Evangelism', status: 'Not Started' }
    ],
    adminNotes: [
      {
        id: 'note-1',
        author: 'Sister Mary Bamidele',
        authorRole: 'VP / FS Coordinator',
        timestamp: '2025-11-20 14:30',
        text: 'Showing exemplary diligence in doctrinal comprehension. Ready for Level 1 practical assessment.'
      }
    ]
  },
  {
    id: 'fs-stud-02',
    fsIdNumber: 'FS-2025-002',
    name: 'Kelechi Emmanuel Obi',
    email: 'k.obi@futa.edu.ng',
    phone: '+234 806 789 0123',
    department: 'Electrical & Electronics Engineering',
    academicLevel: '200 Level',
    foundationalLevel: 'Level 1: Basic Doctrines',
    status: 'Active',
    previousAffiliation: 'Anglican Church of Epiphany, FUTA Campus',
    enrollmentDate: '2025-10-18',
    assignedTeacherId: 'teacher-3',
    assignedTeacherName: 'Sister Ruth Agbede',
    completedChaptersCount: 3,
    totalChaptersCount: 6,
    attendancePercent: 84,
    verificationNotes: 'Inducted during Alpha Semester Freshers Welcome. Submitted personal testimony.',
    isVerified: true,
    completionCertified: false,
    chapterProgress: [
      { chapterNumber: 1, title: 'Salvation and the New Birth', status: 'Completed', completedDate: '2025-10-25', score: 82 },
      { chapterNumber: 2, title: 'The Authority of the Scriptures', status: 'Completed', completedDate: '2025-11-08', score: 79 },
      { chapterNumber: 3, title: 'The Trinity & Person of the Holy Spirit', status: 'Completed', completedDate: '2025-11-24', score: 86 },
      { chapterNumber: 4, title: 'Water Baptism & The Lord’s Supper', status: 'In Progress' },
      { chapterNumber: 5, title: 'Prayer and Daily Quiet Time', status: 'Not Started' },
      { chapterNumber: 6, title: 'Christian Fellowship and Evangelism', status: 'Not Started' }
    ],
    adminNotes: []
  },
  {
    id: 'fs-stud-03',
    fsIdNumber: 'FS-2025-003',
    name: 'Oluwaseun Victoria Adeleke',
    email: 'victoria.adeleke@futa.edu.ng',
    phone: '+234 813 456 7890',
    department: 'Biochemistry',
    academicLevel: '400 Level',
    foundationalLevel: 'Level 2: Spiritual Growth',
    status: 'Active',
    previousAffiliation: 'St. James Anglican Church, Ibadan Diocese',
    enrollmentDate: '2025-09-20',
    assignedTeacherId: 'teacher-2',
    assignedTeacherName: 'Brother Samuel Adebayo',
    completedChaptersCount: 5,
    totalChaptersCount: 6,
    attendancePercent: 96,
    verificationNotes: 'Completed Level 1 with 91% distinction. Active in Bible study sub-group.',
    isVerified: true,
    completionCertified: false,
    chapterProgress: [
      { chapterNumber: 1, title: 'Overcoming Temptation & Walking in Purity', status: 'Completed', completedDate: '2025-10-04', score: 95 },
      { chapterNumber: 2, title: 'Spiritual Disciplines: Fasting & Solitude', status: 'Completed', completedDate: '2025-10-18', score: 92 },
      { chapterNumber: 3, title: 'The Fruit of the Spirit & Sanctification', status: 'Completed', completedDate: '2025-11-01', score: 89 },
      { chapterNumber: 4, title: 'Spiritual Warfare and the Armor of God', status: 'Completed', completedDate: '2025-11-15', score: 94 },
      { chapterNumber: 5, title: 'Discovering Your Spiritual Gifts', status: 'Completed', completedDate: '2025-11-29', score: 90 },
      { chapterNumber: 6, title: 'Personal Discipleship Multiplication', status: 'In Progress' }
    ],
    adminNotes: [
      {
        id: 'note-2',
        author: 'Brother Samuel Adebayo',
        authorRole: 'Bible Study Coordinator',
        timestamp: '2025-12-01 10:15',
        text: 'Exceptional spiritual maturity and consistency in Level 2 discussions.'
      }
    ]
  },
  {
    id: 'fs-stud-04',
    fsIdNumber: 'FS-2025-004',
    name: 'Chinedu Franklin Nnaji',
    email: 'chinedu.nnaji@futa.edu.ng',
    phone: '+234 805 678 9012',
    department: 'Civil Engineering',
    academicLevel: '300 Level',
    foundationalLevel: 'Level 1: Basic Doctrines',
    status: 'Needs Attention',
    previousAffiliation: 'Transfer from ASF UNN Branch',
    enrollmentDate: '2025-10-12',
    assignedTeacherId: 'teacher-1',
    assignedTeacherName: 'Sister Mary Bamidele',
    completedChaptersCount: 1,
    totalChaptersCount: 6,
    attendancePercent: 55,
    verificationNotes: 'Missed 3 consecutive Foundational School weekend classes due to department lab conflicts.',
    isVerified: true,
    completionCertified: false,
    chapterProgress: [
      { chapterNumber: 1, title: 'Salvation and the New Birth', status: 'Completed', completedDate: '2025-10-20', score: 70 },
      { chapterNumber: 2, title: 'The Authority of the Scriptures', status: 'In Progress' },
      { chapterNumber: 3, title: 'The Trinity & Person of the Holy Spirit', status: 'Not Started' },
      { chapterNumber: 4, title: 'Water Baptism & The Lord’s Supper', status: 'Not Started' },
      { chapterNumber: 5, title: 'Prayer and Daily Quiet Time', status: 'Not Started' },
      { chapterNumber: 6, title: 'Christian Fellowship and Evangelism', status: 'Not Started' }
    ],
    adminNotes: [
      {
        id: 'note-3',
        author: 'Sister Mary Bamidele',
        authorRole: 'VP / FS Coordinator',
        timestamp: '2026-01-05 16:45',
        text: 'Follow-up call conducted. Scheduled makeup weekday tutorial with Brother Paul.'
      }
    ]
  },
  {
    id: 'fs-stud-05',
    fsIdNumber: 'FS-2025-005',
    name: 'Blessing Morayo Popoola',
    email: 'blessing.popoola@futa.edu.ng',
    phone: '+234 818 901 2345',
    department: 'Agricultural & Resource Economics',
    academicLevel: '500 Level',
    foundationalLevel: 'Level 3: Christian Stewardship',
    status: 'Completed',
    previousAffiliation: 'All Saints Anglican Church, Osogbo',
    enrollmentDate: '2025-08-10',
    assignedTeacherId: 'teacher-4',
    assignedTeacherName: 'Brother Daniel Chukwu',
    completedChaptersCount: 6,
    totalChaptersCount: 6,
    attendancePercent: 98,
    verificationNotes: 'Successfully completed all 3 levels of Foundational School. Ready for graduation induction.',
    isVerified: true,
    completionCertified: true,
    completionCertifiedDate: '2025-12-18',
    chapterProgress: [
      { chapterNumber: 1, title: 'Biblical Stewardship of Time and Talents', status: 'Completed', completedDate: '2025-09-02', score: 96 },
      { chapterNumber: 2, title: 'Financial Integrity, Tithes & Offerings', status: 'Completed', completedDate: '2025-09-16', score: 92 },
      { chapterNumber: 3, title: 'Servant Leadership in the Body of Christ', status: 'Completed', completedDate: '2025-09-30', score: 94 },
      { chapterNumber: 4, title: 'Anglican Heritage and Church Order', status: 'Completed', completedDate: '2025-10-14', score: 90 },
      { chapterNumber: 5, title: 'Great Commission & World Missions', status: 'Completed', completedDate: '2025-10-28', score: 98 },
      { chapterNumber: 6, title: 'Graduation Capstone: Life Purpose & Ministry', status: 'Completed', completedDate: '2025-11-12', score: 95 }
    ],
    adminNotes: [
      {
        id: 'note-4',
        author: 'Sister Mary Bamidele',
        authorRole: 'VP / FS Coordinator',
        timestamp: '2025-12-18 11:00',
        text: 'FS Graduation Certificate approved and signed by VP/FS Coordinator. Recommended for Sub-group leadership.'
      }
    ]
  },
  {
    id: 'fs-stud-06',
    fsIdNumber: 'FS-2025-006',
    name: 'Gbenga Daniel Alabi',
    email: 'gbenga.alabi@futa.edu.ng',
    phone: '+234 814 567 8901',
    department: 'Mining Engineering',
    academicLevel: '100 Level',
    foundationalLevel: 'Level 1: Basic Doctrines',
    status: 'Pending Review',
    previousAffiliation: 'New Believer / Campus Harvest Evangelism 2025',
    enrollmentDate: '2026-01-10',
    assignedTeacherId: undefined,
    assignedTeacherName: undefined,
    completedChaptersCount: 0,
    totalChaptersCount: 6,
    attendancePercent: 100,
    verificationNotes: 'Newly accepted Christ during New Year Campus Crusade. Needs teacher assignment and induction kit.',
    isVerified: false,
    completionCertified: false,
    chapterProgress: [
      { chapterNumber: 1, title: 'Salvation and the New Birth', status: 'Not Started' },
      { chapterNumber: 2, title: 'The Authority of the Scriptures', status: 'Not Started' },
      { chapterNumber: 3, title: 'The Trinity & Person of the Holy Spirit', status: 'Not Started' },
      { chapterNumber: 4, title: 'Water Baptism & The Lord’s Supper', status: 'Not Started' },
      { chapterNumber: 5, title: 'Prayer and Daily Quiet Time', status: 'Not Started' },
      { chapterNumber: 6, title: 'Christian Fellowship and Evangelism', status: 'Not Started' }
    ],
    adminNotes: [
      {
        id: 'note-5',
        author: 'Sister Mary Bamidele',
        authorRole: 'VP / FS Coordinator',
        timestamp: '2026-01-12 09:30',
        text: 'Application accepted. Needs pairing with an experienced Level 1 facilitator.'
      }
    ]
  },
  {
    id: 'fs-stud-07',
    fsIdNumber: 'FS-2025-007',
    name: 'Zainab Esther Olayinka',
    email: 'esther.olayinka@futa.edu.ng',
    phone: '+234 809 876 5432',
    department: 'Food Science & Technology',
    academicLevel: '300 Level',
    foundationalLevel: 'Level 2: Spiritual Growth',
    status: 'Active',
    previousAffiliation: 'Christ Anglican Church, Owo',
    enrollmentDate: '2025-09-28',
    assignedTeacherId: 'teacher-5',
    assignedTeacherName: 'Sister Deborah Adeleke',
    completedChaptersCount: 4,
    totalChaptersCount: 6,
    attendancePercent: 90,
    verificationNotes: 'Level 1 verified. Demonstrates strong commitment to discipleship workbook assignments.',
    isVerified: true,
    completionCertified: false,
    chapterProgress: [
      { chapterNumber: 1, title: 'Overcoming Temptation & Walking in Purity', status: 'Completed', completedDate: '2025-10-10', score: 88 },
      { chapterNumber: 2, title: 'Spiritual Disciplines: Fasting & Solitude', status: 'Completed', completedDate: '2025-10-24', score: 91 },
      { chapterNumber: 3, title: 'The Fruit of the Spirit & Sanctification', status: 'Completed', completedDate: '2025-11-07', score: 87 },
      { chapterNumber: 4, title: 'Spiritual Warfare and the Armor of God', status: 'Completed', completedDate: '2025-11-21', score: 93 },
      { chapterNumber: 5, title: 'Discovering Your Spiritual Gifts', status: 'In Progress' },
      { chapterNumber: 6, title: 'Personal Discipleship Multiplication', status: 'Not Started' }
    ],
    adminNotes: []
  },
  {
    id: 'fs-stud-08',
    fsIdNumber: 'FS-2025-008',
    name: 'Ayomide Joshua Fashola',
    email: 'joshua.fashola@futa.edu.ng',
    phone: '+234 811 234 5678',
    department: 'Industrial & Production Engineering',
    academicLevel: '400 Level',
    foundationalLevel: 'Level 3: Christian Stewardship',
    status: 'Completed',
    previousAffiliation: 'ASF FUTA General Body Member',
    enrollmentDate: '2025-08-15',
    assignedTeacherId: 'teacher-6',
    assignedTeacherName: 'Brother Paul Eniola',
    completedChaptersCount: 6,
    totalChaptersCount: 6,
    attendancePercent: 94,
    verificationNotes: 'Completed stewardship field practicals and community outreach.',
    isVerified: true,
    completionCertified: true,
    completionCertifiedDate: '2025-12-15',
    chapterProgress: [
      { chapterNumber: 1, title: 'Biblical Stewardship of Time and Talents', status: 'Completed', completedDate: '2025-09-05', score: 90 },
      { chapterNumber: 2, title: 'Financial Integrity, Tithes & Offerings', status: 'Completed', completedDate: '2025-09-19', score: 88 },
      { chapterNumber: 3, title: 'Servant Leadership in the Body of Christ', status: 'Completed', completedDate: '2025-10-03', score: 92 },
      { chapterNumber: 4, title: 'Anglican Heritage and Church Order', status: 'Completed', completedDate: '2025-10-17', score: 89 },
      { chapterNumber: 5, title: 'Great Commission & World Missions', status: 'Completed', completedDate: '2025-10-31', score: 95 },
      { chapterNumber: 6, title: 'Graduation Capstone: Life Purpose & Ministry', status: 'Completed', completedDate: '2025-11-14', score: 91 }
    ],
    adminNotes: []
  },
  {
    id: 'fs-stud-09',
    fsIdNumber: 'FS-2025-009',
    name: 'Faithfulness Anuoluwapo Oni',
    email: 'anu.oni@futa.edu.ng',
    phone: '+234 815 678 1234',
    department: 'Microbiology',
    academicLevel: '200 Level',
    foundationalLevel: 'Level 1: Basic Doctrines',
    status: 'Active',
    previousAffiliation: 'St. Paul Anglican Church, Ondo Diocese',
    enrollmentDate: '2025-10-20',
    assignedTeacherId: 'teacher-3',
    assignedTeacherName: 'Sister Ruth Agbede',
    completedChaptersCount: 2,
    totalChaptersCount: 6,
    attendancePercent: 88,
    verificationNotes: 'Submitted testimony of salvation and confirmation certificate.',
    isVerified: true,
    completionCertified: false,
    chapterProgress: [
      { chapterNumber: 1, title: 'Salvation and the New Birth', status: 'Completed', completedDate: '2025-11-02', score: 89 },
      { chapterNumber: 2, title: 'The Authority of the Scriptures', status: 'Completed', completedDate: '2025-11-16', score: 84 },
      { chapterNumber: 3, title: 'The Trinity & Person of the Holy Spirit', status: 'In Progress' },
      { chapterNumber: 4, title: 'Water Baptism & The Lord’s Supper', status: 'Not Started' },
      { chapterNumber: 5, title: 'Prayer and Daily Quiet Time', status: 'Not Started' },
      { chapterNumber: 6, title: 'Christian Fellowship and Evangelism', status: 'Not Started' }
    ],
    adminNotes: []
  },
  {
    id: 'fs-stud-10',
    fsIdNumber: 'FS-2025-010',
    name: 'Samuel Chukwuemeka Eze',
    email: 'samuel.eze@futa.edu.ng',
    phone: '+234 802 345 6789',
    department: 'Mechanical Engineering',
    academicLevel: '300 Level',
    foundationalLevel: 'Level 1: Basic Doctrines',
    status: 'Needs Attention',
    previousAffiliation: 'New Believer / Hall of Residence Bible Study',
    enrollmentDate: '2025-10-25',
    assignedTeacherId: 'teacher-1',
    assignedTeacherName: 'Sister Mary Bamidele',
    completedChaptersCount: 1,
    totalChaptersCount: 6,
    attendancePercent: 60,
    verificationNotes: 'Needs follow-up on Chapter 2 assignment submission.',
    isVerified: true,
    completionCertified: false,
    chapterProgress: [
      { chapterNumber: 1, title: 'Salvation and the New Birth', status: 'Completed', completedDate: '2025-11-05', score: 75 },
      { chapterNumber: 2, title: 'The Authority of the Scriptures', status: 'In Progress' },
      { chapterNumber: 3, title: 'The Trinity & Person of the Holy Spirit', status: 'Not Started' },
      { chapterNumber: 4, title: 'Water Baptism & The Lord’s Supper', status: 'Not Started' },
      { chapterNumber: 5, title: 'Prayer and Daily Quiet Time', status: 'Not Started' },
      { chapterNumber: 6, title: 'Christian Fellowship and Evangelism', status: 'Not Started' }
    ],
    adminNotes: [
      {
        id: 'note-6',
        author: 'Sister Mary Bamidele',
        authorRole: 'VP / FS Coordinator',
        timestamp: '2026-01-08 15:00',
        text: 'Followed up regarding academic test clash. Agreed on weekend workbook review.'
      }
    ]
  },
  {
    id: 'fs-stud-11',
    fsIdNumber: 'FS-2025-011',
    name: 'Grace Oluwatosin Babalola',
    email: 'tosin.babalola@futa.edu.ng',
    phone: '+234 817 890 1234',
    department: 'Urban & Regional Planning',
    academicLevel: '200 Level',
    foundationalLevel: 'Level 1: Basic Doctrines',
    status: 'Pending Review',
    previousAffiliation: 'St. John’s Anglican Church, Akure',
    enrollmentDate: '2026-01-14',
    assignedTeacherId: undefined,
    assignedTeacherName: undefined,
    completedChaptersCount: 0,
    totalChaptersCount: 6,
    attendancePercent: 100,
    verificationNotes: 'Fresh applicant awaiting interview and facilitator assignment.',
    isVerified: false,
    completionCertified: false,
    chapterProgress: [
      { chapterNumber: 1, title: 'Salvation and the New Birth', status: 'Not Started' },
      { chapterNumber: 2, title: 'The Authority of the Scriptures', status: 'Not Started' },
      { chapterNumber: 3, title: 'The Trinity & Person of the Holy Spirit', status: 'Not Started' },
      { chapterNumber: 4, title: 'Water Baptism & The Lord’s Supper', status: 'Not Started' },
      { chapterNumber: 5, title: 'Prayer and Daily Quiet Time', status: 'Not Started' },
      { chapterNumber: 6, title: 'Christian Fellowship and Evangelism', status: 'Not Started' }
    ],
    adminNotes: []
  }
];

export const initialFSAdmissions: FSAdmissionApplication[] = [
  {
    id: 'adm-01',
    applicantName: 'Gbenga Daniel Alabi',
    email: 'gbenga.alabi@futa.edu.ng',
    phone: '+234 814 567 8901',
    department: 'Mining Engineering',
    academicLevel: '100 Level',
    previousChurchAffiliation: 'New Believer / Campus Harvest Evangelism 2025',
    salvationTestimonySummary: 'Surrendered my life to Christ at the Alpha Semester crusade after hearing the message on John 3:16. Desires to know God deeply.',
    reasonForJoining: 'To establish firm biblical foundations and understand Christian doctrine.',
    applicationDate: '2026-01-10',
    status: 'Pending Review',
    assignedFoundationalLevel: 'Level 1: Basic Doctrines'
  },
  {
    id: 'adm-02',
    applicantName: 'Grace Oluwatosin Babalola',
    email: 'tosin.babalola@futa.edu.ng',
    phone: '+234 817 890 1234',
    department: 'Urban & Regional Planning',
    academicLevel: '200 Level',
    previousChurchAffiliation: 'St. John’s Anglican Church, Akure',
    salvationTestimonySummary: 'Confirmed in the Anglican Communion in 2021; re-dedicated life to Christ during Freshers Prayer Vigil.',
    reasonForJoining: 'I want to be grounded in the Word and equipped for fellowship service.',
    applicationDate: '2026-01-14',
    status: 'Pending Review',
    assignedFoundationalLevel: 'Level 1: Basic Doctrines'
  },
  {
    id: 'adm-03',
    applicantName: 'Ebenezer Ifeanyi Okoro',
    email: 'ebenezer.okoro@futa.edu.ng',
    phone: '+234 803 777 8899',
    department: 'Physics Electronics',
    academicLevel: '300 Level',
    previousChurchAffiliation: 'Anglican Students Fellowship UNIBEN (Direct Entry Transfer)',
    salvationTestimonySummary: 'Born again since 2022. Active in evangelism and campus outreach in Benin.',
    reasonForJoining: 'Transferred to FUTA and seeking continuation in Foundational School discipleship curriculum.',
    applicationDate: '2026-01-08',
    status: 'Interview Scheduled',
    assignedFoundationalLevel: 'Level 2: Spiritual Growth',
    reviewerNotes: 'Interview scheduled with VP / FS Coordinator for Wednesday 4:00 PM.'
  },
  {
    id: 'adm-04',
    applicantName: 'Mercy Oluwadamilola Akinsola',
    email: 'mercy.akinsola@futa.edu.ng',
    phone: '+234 816 222 3344',
    department: 'Microbiology',
    academicLevel: '100 Level',
    previousChurchAffiliation: 'St. Peter’s Anglican Church, Ilesa',
    salvationTestimonySummary: 'Grew up in Anglican vicarage; accepted Christ personally during secondary school valedictory retreat.',
    reasonForJoining: 'To grow spiritually and prepare for ministry inside ASF.',
    applicationDate: '2026-01-04',
    status: 'Approved',
    assignedFoundationalLevel: 'Level 1: Basic Doctrines',
    reviewerNotes: 'Approved by VP / FS Coordinator Sister Mary Bamidele on Jan 6.'
  }
];

export const initialFSClasses: FSClassLevel[] = [
  {
    id: 'fs-lvl-1',
    levelName: 'Level 1: Basic Doctrines & Salvation',
    code: 'FS-LVL-1',
    description: 'Foundational Christian theology covering Salvation, Biblical Authority, The Holy Spirit, Anglican Liturgy, and Prayer Basics.',
    enrolledCount: 12,
    facilitatorLead: 'Sister Mary Bamidele (VP / FS Coordinator)',
    meetingSchedule: 'Sundays 3:30 PM - 5:00 PM (Chapel Annex Room A)',
    curriculumModules: [
      'Salvation and the New Birth',
      'The Authority of the Scriptures',
      'The Trinity & Person of the Holy Spirit',
      'Water Baptism & The Lord’s Supper',
      'Prayer and Daily Quiet Time',
      'Christian Fellowship and Evangelism'
    ],
    status: 'Active'
  },
  {
    id: 'fs-lvl-2',
    levelName: 'Level 2: Spiritual Growth & Maturity',
    code: 'FS-LVL-2',
    description: 'Deeper discipleship covering Spiritual Disciplines, Overcoming Temptation, Fruit & Gifts of the Holy Spirit, and Spiritual Warfare.',
    enrolledCount: 8,
    facilitatorLead: 'Brother Samuel Adebayo',
    meetingSchedule: 'Sundays 4:00 PM - 5:30 PM (Seminar Room 2)',
    curriculumModules: [
      'Overcoming Temptation & Walking in Purity',
      'Spiritual Disciplines: Fasting & Solitude',
      'The Fruit of the Spirit & Sanctification',
      'Spiritual Warfare and the Armor of God',
      'Discovering Your Spiritual Gifts',
      'Personal Discipleship Multiplication'
    ],
    status: 'Active'
  },
  {
    id: 'fs-lvl-3',
    levelName: 'Level 3: Christian Stewardship & Service',
    code: 'FS-LVL-3',
    description: 'Leadership preparation covering Biblical Stewardship, Anglican Heritage, Servant Leadership, World Missions, and Graduation Capstone.',
    enrolledCount: 4,
    facilitatorLead: 'Brother Daniel Chukwu',
    meetingSchedule: 'Saturdays 5:00 PM - 6:30 PM (Fellowship Boardroom)',
    curriculumModules: [
      'Biblical Stewardship of Time and Talents',
      'Financial Integrity, Tithes & Offerings',
      'Servant Leadership in the Body of Christ',
      'Anglican Heritage and Church Order',
      'Great Commission & World Missions',
      'Graduation Capstone: Life Purpose & Ministry'
    ],
    status: 'Active'
  }
];

export const initialFSActivityLogs: FSActivityLog[] = [
  {
    id: 'fs-act-01',
    timestamp: 'Today, 11:30 AM',
    studentName: 'Temiloluwa Afolabi',
    studentId: 'fs-stud-01',
    actor: 'Sister Mary Bamidele',
    actorRole: 'VP / FS Coordinator',
    type: 'submission',
    title: 'Chapter 4 Assignment Graded',
    description: 'Graded Water Baptism & The Lord’s Supper module (Score: 85%).',
    severity: 'normal'
  },
  {
    id: 'fs-act-02',
    timestamp: 'Today, 09:15 AM',
    studentName: 'Chinedu Franklin Nnaji',
    studentId: 'fs-stud-04',
    actor: 'Sister Mary Bamidele',
    actorRole: 'VP / FS Coordinator',
    type: 'status_change',
    title: 'Flagged for Academic Attention',
    description: 'Attendance dropped below 60%. Makeup tutorial scheduled.',
    severity: 'attention'
  },
  {
    id: 'fs-act-03',
    timestamp: 'Yesterday, 04:00 PM',
    studentName: 'Gbenga Daniel Alabi',
    studentId: 'fs-stud-06',
    actor: 'Sister Mary Bamidele',
    actorRole: 'VP / FS Coordinator',
    type: 'admission',
    title: 'New Student Application Reviewed',
    description: 'Application for Level 1 Basic Doctrines accepted for onboarding.',
    severity: 'normal'
  },
  {
    id: 'fs-act-04',
    timestamp: '2 days ago',
    studentName: 'Blessing Morayo Popoola',
    studentId: 'fs-stud-05',
    actor: 'Sister Mary Bamidele',
    actorRole: 'VP / FS Coordinator',
    type: 'completion',
    title: 'Foundational School Completion Certified',
    description: 'Final Level 3 Capstone passed. Discipleship Certificate issued.',
    severity: 'success'
  },
  {
    id: 'fs-act-05',
    timestamp: '3 days ago',
    studentName: 'Kelechi Emmanuel Obi',
    studentId: 'fs-stud-02',
    actor: 'Sister Ruth Agbede',
    actorRole: 'FS Facilitator',
    type: 'teacher_assigned',
    title: 'Facilitator Mentorship Assigned',
    description: 'Assigned Sister Ruth Agbede as primary discipleship mentor.',
    severity: 'normal'
  }
];
