/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Announcement } from '../types';

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Urgent: Shift in Thursday Prayer Meeting Venue',
    excerpt: 'Please note that our Thursday Prayer Meeting will hold at the New Lecture Theatre (NLT) instead of the Fellowship Hall due to ongoing facility repairs.',
    content: `Brethren in Christ,

Please take note of a temporary adjustment to our meeting schedule. Due to ongoing facility maintenance and minor electrical repairs at the main Fellowship Hall, our Thursday Prayer Meeting this week will hold at the New Lecture Theatre (NLT).

The meeting time remains unchanged at 5:30 PM. We encourage all executive members, unit leaders, and general brethren to arrive promptly as we gather in prayer and supplication.

Please pass this notice along to your unit members and fellow students.

"Praying always with all prayer and supplication in the Spirit, and watching thereunto with all perseverance and supplication for all saints." — Ephesians 6:18`,
    category: 'Administrative',
    priority: 'Urgent',
    publishedAt: 'Today, 8:30 AM',
    author: 'Brother Samuel Adebayo (Publicity Secretary)',
    isRead: false,
    isPrebundledOffline: true,
    attachmentName: 'ASF_Venue_Notice_NLT.pdf',
    attachmentSize: '420 KB'
  },
  {
    id: 'ann-02',
    title: 'Weekly Bible Study Outline: "The Reign of God: Marriage And Christian Lifestyle"',
    excerpt: 'The study outline for Lesson 1 is now published and accessible on the platform. All brethren are urged to study ahead before Tuesday evening.',
    content: `Dear Brethren,

The official Bible Study outline for this week\'s session on "Universal Concepts of Marriage" under our semester annual theme "The Reign of God: Marriage And Christian Lifestyle" is now available in the Bible Study section of the ASF Digital Platform.

Key Scripture focus: Genesis 2:18-25, Joshua 11:1-5, and Amos 3:3.

Session Details:
• Day: Tuesday
• Time: 5:00 PM Prompt
• Venue: Main Fellowship Hall

Kindly come along with your Holy Bible, writing pads, and open hearts ready to receive divine instruction. Printable PDF outlines can also be downloaded directly from the Bible Study reader.`,
    category: 'Bible Study',
    priority: 'Important',
    publishedAt: 'Yesterday, 4:15 PM',
    author: 'Bible Study Committee',
    isRead: false,
    isPrebundledOffline: true
  },
  {
    id: 'ann-03',
    title: 'Foundational School Cohort B Enrolment Now Open',
    excerpt: 'All newly joined members and brethren who have completed preliminary orientation are invited to enroll for Foundational School Cohort B.',
    content: `Praise the Lord, Brethren!

The Vice President and Foundational School Coordination Team hereby announce that registration for Foundational School Cohort B is officially open.

Foundational School is designed to establish every believer in basic Christian doctrines, spiritual growth, fellowship heritage, and effective kingdom service.

Who Should Register?
1. All freshers and newly admitted students.
2. Brethren who missed previous Cohort classes.
3. Members seeking a systematic refresher in foundational Christian doctrines.

Classes will commence this Saturday at 10:00 AM at the Chapel Vestry. Please visit the FS section on the platform or see the Vice President immediately after Sunday service to complete your enrolment form.`,
    category: 'Program',
    priority: 'Important',
    publishedAt: '3 days ago',
    author: 'VP & FS Coordination Desk',
    isRead: true,
    isPrebundledOffline: true,
    attachmentName: 'FS_Cohort_B_Curriculum_Guide.pdf',
    attachmentSize: '1.2 MB'
  },
  {
    id: 'ann-04',
    title: 'Joint Service & Praise Night: "Radiant Praise 2026"',
    excerpt: 'Join the ASF Choir, Drama Unit, and the entire fellowship for an evening of intense worship, thanksgiving, and prophetic declarations.',
    content: `Brethren, get ready for an unforgettable atmosphere of worship!

The Executives, in conjunction with the Choir Unit and Evangelical Committee, cordially invite all students, alumni, and fellowship friends to "Radiant Praise 2026" — a joint evening of high praise, dramatic ministrations, and prophetic prayer.

Event Highlights:
• Theme: "Arise and Shine, For Thy Light Is Come" (Isaiah 60:1)
• Date: Friday, 28th August 2026
• Time: 6:00 PM Red Carpet / 6:30 PM Main Ministration
• Venue: FUTA ETF Hall

Come expecting divine visitation, healing, and spiritual renewal. Invite your room-mates and department colleagues!`,
    category: 'Service',
    priority: 'Normal',
    publishedAt: '5 days ago',
    author: 'Evangelism & Choir Directorate',
    isRead: true,
    isPrebundledOffline: true
  },
  {
    id: 'ann-05',
    title: 'Presidential Address: Semester Prophetic Direction & Theme',
    excerpt: 'Official statement from President David Olatunji declaring the spirit-led vision and thematic direction for the Anglican Students\' Fellowship FUTA.',
    content: `Grace and peace be unto you, beloved brethren of the Anglican Students\' Fellowship FUTA.

As we journey through this academic session, the Lord has laid upon our hearts a clear prophetic mandate anchored on Isaiah 60:1: "Arise, shine; for thy light is come, and the glory of the LORD is risen upon thee."

In a world filled with moral ambiguities and academic pressures, we are called to stand as uncompromised beacons of light, academic excellence, and godly character.

Let us remain steadfast in fellowship attendance, personal devotion, unit commitments, and brotherly love. God is preparing us for great impact across this campus and beyond.

Yours in His Kingdom Service,
Brother David Olatunji
President, ASF FUTA`,
    category: 'Fellowship',
    priority: 'Important',
    publishedAt: '1 week ago',
    author: 'Brother David Olatunji (President)',
    isRead: true,
    isPrebundledOffline: true
  },
  {
    id: 'ann-06',
    title: 'Library & Digital Resource Access Update',
    excerpt: 'The Fellowship Librarian announces updated library hours and new spiritual book downloads available on the digital repository.',
    content: `Notice from the Fellowship Library Unit:

We are pleased to inform the fellowship that physical library borrowing hours at the Chapel Vestry have been expanded:
• Mondays & Wednesdays: 4:00 PM – 6:00 PM
• Saturdays: 2:00 PM – 5:00 PM

Additionally, digital study guides, commentary books, and Christian leadership materials have been uploaded to our digital drive. Brethren requiring specific research materials for personal devotion or unit assignments are encouraged to reach out to the Librarian.`,
    category: 'General',
    priority: 'Normal',
    publishedAt: '2 weeks ago',
    author: 'Fellowship Librarian',
    isRead: true,
    isPrebundledOffline: false // Online-only test item for offline simulator
  }
];

export function searchAnnouncements(
  query: string,
  categoryFilter: string = 'All',
  source: Announcement[] = mockAnnouncements
): Announcement[] {
  let results = source;

  // Apply category filter
  if (categoryFilter !== 'All') {
    if (categoryFilter === 'Urgent') {
      results = results.filter(a => a.priority === 'Urgent' || a.priority === 'Important');
    } else {
      results = results.filter(a => a.category === categoryFilter);
    }
  }

  // Apply query text search
  const term = query.trim().toLowerCase();
  if (!term) return results;

  return results.filter(a => 
    a.title.toLowerCase().includes(term) ||
    a.excerpt.toLowerCase().includes(term) ||
    a.content.toLowerCase().includes(term) ||
    a.author.toLowerCase().includes(term) ||
    a.category.toLowerCase().includes(term)
  );
}
