/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FSMaterial } from '../types';

export const mockFSMaterials: FSMaterial[] = [
  {
    id: 'fs-01',
    title: 'FS Manual: 2025/2026 Session',
    subtitle: 'Core Discipleship & Doctrine',
    academicYear: '2025/2026',
    description: 'Comprehensive manual covering core Christian doctrines, spiritual growth, prayer life, and kingdom stewardship for ASF discipleship cohorts.',
    isAvailableOffline: true,
    requiresRestrictedAuth: false,
    chapters: [
      {
        id: 'ch-01',
        chapterNumber: 1,
        title: 'Introduction to the Faith',
        subtitle: 'Establishing Firm Roots in the Word',
        paragraphs: [
          'The foundation of our spiritual journey begins with an understanding of creation and our place within it. In the beginning, God created the heavens and the earth [[Gen 1:1]]. This foundational truth establishes not just our origin, but the purposeful design that governs all of existence.',
          'As we embark on this 2025/2026 session of the Foundational School, we are called to examine our beliefs not as abstract concepts, but as living realities that shape our daily actions. The core of this revelation is love, famously captured when Jesus spoke of God\'s immense sacrifice [[John 3:16]], demonstrating a love that actively redeems and restores.',
          'Our faith is not meant to be a solitary endeavor. It thrives within the context of fellowship. The early disciples devoted themselves to the apostles\' teaching and to fellowship, to the breaking of bread and to prayer [[Acts 2:42]]. It is in this communal setting that the truths we learn take root and bear fruit. We encourage you to reflect deeply on these passages as you progress through this manual.',
          'Remember that theology is best practiced in the crucible of real life. The doctrines discussed herein are meant to equip you for service, to comfort you in trials, and to guide you in moments of decision. Let the words of scripture be a lamp unto your feet and a light unto your path [[Psalm 119:105]].',
          'A true disciple is characterized by steadfastness in prayer, devotion to God\'s Word, and active engagement in campus evangelism. As Anglican students, our heritage calls us to liturgical reverence combined with vibrant evangelical fire.'
        ],
        scriptureRefs: [
          { ref: 'Gen 1:1', bookId: 'GEN', chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.' },
          { ref: 'John 3:16', bookId: 'JHN', chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
          { ref: 'Acts 2:42', bookId: 'ACT', chapter: 2, verse: 42, text: 'And they continued stedfastly in the apostles\' doctrine and fellowship, and in breaking of bread, and in prayers.' },
          { ref: 'Psalm 119:105', bookId: 'PSA', chapter: 119, verse: 105, text: 'Thy word is a lamp unto my feet, and a light unto my path.' }
        ]
      },
      {
        id: 'ch-02',
        chapterNumber: 2,
        title: 'The Authority of Scripture',
        subtitle: 'Understanding Divine Inspiration and Preservation',
        paragraphs: [
          'All Scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness [[2 Tim 3:16]]. Understanding the divine origin of the Bible builds unshakeable confidence in its promises.',
          'The Word of God is living and active, sharper than any double-edged sword [[Heb 4:12]]. When we read Scripture with a prayerful heart, the Holy Spirit illuminates the text and transforms our inner man.',
          'Daily devotional habits, systematic reading schedules, and Scripture memorization form the tripod of personal spiritual discipline.'
        ],
        scriptureRefs: [
          { ref: '2 Tim 3:16', bookId: '2TI', chapter: 3, verse: 16, text: 'All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness.' },
          { ref: 'Heb 4:12', bookId: 'HEB', chapter: 4, verse: 12, text: 'For the word of God is quick, and powerful, and sharper than any twoedged sword...' }
        ]
      }
    ]
  },
  {
    id: 'fs-02',
    title: 'The Gospel & Salvation',
    subtitle: 'Redemption, Grace, and Justification',
    academicYear: '2025/2026',
    description: 'A study on the redemptive work of Jesus Christ, justification by faith, regeneration, and assurance of salvation.',
    isAvailableOffline: true,
    requiresRestrictedAuth: false,
    chapters: [
      {
        id: 'ch-01',
        chapterNumber: 1,
        title: 'Understanding Grace and Faith',
        subtitle: 'Saved by Grace Through Faith',
        paragraphs: [
          'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God [[Eph 2:8]]. Salvation is entirely a work of divine grace received through faith in Christ.',
          'When we confess with our mouth the Lord Jesus and believe in our heart that God raised Him from the dead, we are saved [[Rom 10:9]]. Assurance of salvation rests on the unchangeable promises of God\'s Word.'
        ],
        scriptureRefs: [
          { ref: 'Eph 2:8', bookId: 'EPH', chapter: 2, verse: 8, text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God.' },
          { ref: 'Rom 10:9', bookId: 'ROM', chapter: 10, verse: 9, text: 'That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart...' }
        ]
      }
    ]
  },
  {
    id: 'fs-03',
    title: 'Christian Values & Ethics',
    subtitle: 'Living as Light on Campus',
    academicYear: '2025/2026',
    description: 'Practical guidelines on Christian integrity, moral purity, academic excellence, and godly relationships for university students.',
    isAvailableOffline: false, // Online sync material
    requiresRestrictedAuth: false,
    chapters: [
      {
        id: 'ch-01',
        chapterNumber: 1,
        title: 'Integrity in Academic Life',
        subtitle: 'Honoring God in Your Studies',
        paragraphs: [
          'And whatsoever ye do, do it heartily, as to the Lord, and not unto men [[Col 3:23]]. Academic honesty, diligent research, and punctuality reflect Christian character.',
          'Shining as lights amidst a perverse generation [[Phil 2:15]] requires refusal to compromise on exams, assignments, and campus ethics.'
        ],
        scriptureRefs: [
          { ref: 'Col 3:23', bookId: 'COL', chapter: 3, verse: 23, text: 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men.' },
          { ref: 'Phil 2:15', bookId: 'PHP', chapter: 2, verse: 15, text: 'That ye may be blameless and harmless, the sons of God, without rebuke, in the midst of a crooked and perverse nation...' }
        ]
      }
    ]
  },
  {
    id: 'fs-04',
    title: 'Foundational Bible Knowledge',
    subtitle: 'Old & New Testament Overview',
    academicYear: '2025/2026',
    description: 'Systematic overview of the 66 books of the Holy Bible, major covenants, prophetic timelines, and gospel harmony.',
    isAvailableOffline: false, // Online sync material
    requiresRestrictedAuth: false,
    chapters: [
      {
        id: 'ch-01',
        chapterNumber: 1,
        title: 'Structure of the Scriptures',
        subtitle: 'The Law, Prophets, and Epistles',
        paragraphs: [
          'The Old Testament lays the foundation of God\'s covenant with Israel and the promise of the Messiah. The New Testament fulfills these promises through the life, death, resurrection, and church of Jesus Christ [[Luke 24:44]].'
        ],
        scriptureRefs: [
          { ref: 'Luke 24:44', bookId: 'LUK', chapter: 24, verse: 44, text: 'And he said unto them, These are the words which I spake unto you...' }
        ]
      }
    ]
  },
  {
    id: 'fs-05',
    title: 'The Holy Spirit & Spiritual Gifts',
    subtitle: 'Pneumatology and Empowerment',
    academicYear: '2025/2026',
    description: 'In-depth teaching on the person, ministry, fruit, and supernatural gifts of the Holy Spirit in the life of a believer.',
    isAvailableOffline: false,
    requiresRestrictedAuth: false,
    chapters: [
      {
        id: 'ch-01',
        chapterNumber: 1,
        title: 'The Person of the Holy Spirit',
        subtitle: 'Comforter, Teacher, and Guide',
        paragraphs: [
          'But the Comforter, which is the Holy Ghost, whom the Father will send in my name, he shall teach you all things [[John 14:26]]. The Holy Spirit is a divine Person who indwells every born-again believer.'
        ],
        scriptureRefs: [
          { ref: 'John 14:26', bookId: 'JHN', chapter: 14, verse: 26, text: 'But the Comforter, which is the Holy Ghost, whom the Father will send in my name...' }
        ]
      }
    ]
  },
  {
    id: 'fs-06',
    title: 'Christian Leadership & Service',
    subtitle: 'Advanced Student Leadership Practicum',
    academicYear: '2025/2026',
    description: 'Restricted cohort manual for executive trainees, unit heads, and student teachers in the fellowship.',
    isAvailableOffline: false,
    requiresRestrictedAuth: true, // Restricted material
    chapters: [
      {
        id: 'ch-01',
        chapterNumber: 1,
        title: 'Servant Leadership in the Church',
        subtitle: 'Leading Like Jesus',
        paragraphs: [
          'Let nothing be done through strife or vainglory; but in lowliness of mind let each esteem other better than themselves [[Phil 2:3]]. True spiritual authority flows from humility and faithful service.'
        ],
        scriptureRefs: [
          { ref: 'Phil 2:3', bookId: 'PHP', chapter: 2, verse: 3, text: 'Let nothing be done through strife or vainglory; but in lowliness of mind let each esteem other better than themselves.' }
        ]
      }
    ]
  }
];

export function getFSMaterialById(id: string): FSMaterial | undefined {
  return mockFSMaterials.find(m => m.id === id);
}
