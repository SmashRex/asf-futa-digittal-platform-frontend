/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BibleStudyItem } from '../types';

export const mockBibleStudies: BibleStudyItem[] = [
  {
    id: 'study-01',
    lessonNumber: 1,
    title: 'Universal Concepts of Marriage',
    annualTheme: 'The Reign of God: Marriage And Christian Lifestyle',
    subTheme: 'The Concept of Marriage (1)',
    date: 'Jan 4, 2026',
    keyScripture: 'Gen 2:24',
    textScriptures: ['Gen 2:24', 'Josh 11:1-5'],
    references: [
      { book: 'Genesis', bookId: 'GEN', chapter: 2, verseStart: 24, raw: 'Gen 2:24' },
      { book: 'Joshua', bookId: 'JOS', chapter: 11, verseStart: 1, verseEnd: 5, raw: 'Josh 11:1-5' },
      { book: 'Amos', bookId: 'AMO', chapter: 3, verseStart: 3, raw: 'Amos 3:3' }
    ],
    summary: 'A deep examination of God\'s original blueprint for marriage, contrasting divine covenant with contemporary cultural distortions and unscriptural concepts.',
    aims: [
      'To understand the origin and universal definition of marriage according to God\'s word.',
      'To identify unscriptural concepts and societal distortions of marriage in our society today.',
      'To emphasize the importance of shared spiritual values and agreement in a Christian marriage.'
    ],
    memoryVerse: {
      reference: 'Amos 3:3',
      text: 'Can two walk together, except they agree?',
      structuredRef: { book: 'Amos', bookId: 'AMO', chapter: 3, verseStart: 3, raw: 'Amos 3:3' }
    },
    introduction: 'Marriage is an institution ordained by God from the beginning, designed for companionship, procreation, and reflecting the sacred relationship between Christ and the Church. However, throughout history and increasingly in contemporary society, the concept of marriage has been subjected to various interpretations and distortions that deviate from biblical truth. As believers, it is crucial to return to the scriptural foundation to understand what constitutes a true marriage in God\'s eyes and to guard against cultural ideologies that undermine this sacred covenant.',
    sections: [
      {
        id: 'sec-1',
        title: '1. The Origin and Covenant of Marriage',
        paragraphs: [
          'In creation, God established marriage as a sacred, heterosexual, and monogamous covenant. Leaving father and mother to cleave unto one\'s spouse creates a unified spiritual and physical bond.',
          'When we surrender our lives to Christ, our understanding of covenant relationships is elevated beyond societal convenience into divine alignment.'
        ],
        scriptureRefs: ['Gen 2:23-24', 'Matt 19:4-6']
      },
      {
        id: 'sec-2',
        title: '2. Guarding Against Unscriptural Ideologies',
        paragraphs: [
          'Contemporary society frequently redefines marriage to accommodate personal desires, casual cohabitation, and unscriptural unions that contradict God\'s design.',
          'A genuine disciple cannot compromise on God\'s holy standards. Our convictions must remain rooted in scripture rather than fleeting cultural trends.'
        ],
        scriptureRefs: ['Amos 3:3', '2 Cor 6:14-17']
      }
    ],
    studyGuide: [
      {
        id: 'q1',
        number: 1,
        question: 'Based on Gen 2:23-24, what are the fundamental elements that constitute a marriage according to God\'s original design?',
        scriptureRefs: ['Gen 2:23-24']
      },
      {
        id: 'q2',
        number: 2,
        question: 'Read Josh 11:1-5 and Jeremiah 3:18. How do these passages contrast with unscriptural unions, and what warnings do they provide?',
        scriptureRefs: ['Josh 11:1-5', 'Jer 3:18']
      },
      {
        id: 'q3',
        number: 3,
        question: 'Discuss the implications of Amos 3:3 and 2 Cor 6:14-17 regarding the necessity of agreement and shared faith in marriage.',
        scriptureRefs: ['Amos 3:3', '2 Cor 6:14-17']
      },
      {
        id: 'q4',
        number: 4,
        question: 'In light of 1 Cor 5:1-2 and Ezekiel 27:16-17, identify common societal practices or ideologies today that corrupt the biblical concept of marriage. How should the Church respond?',
        scriptureRefs: ['1 Cor 5:1-2', 'Ezek 27:16-17']
      }
    ],
    discussionQuestions: [
      'Based on Gen 2:23-24, what are the fundamental elements that constitute a marriage according to God\'s original design?',
      'Read Josh 11:1-5 and Jeremiah 3:18. How do these passages contrast with unscriptural unions, and what warnings do they provide?',
      'Discuss the implications of Amos 3:3 and 2 Cor 6:14-17 regarding the necessity of agreement and shared faith in marriage.',
      'In light of 1 Cor 5:1-2 and Ezekiel 27:16-17, identify common societal practices or ideologies today that corrupt the biblical concept of marriage.'
    ],
    conclusion: 'A true Christian marriage is not merely a social contract but a divine covenant requiring agreement, shared faith, and adherence to biblical principles. As the world pushes unscriptural definitions of unions, believers must stand firm on God\'s Word, recognizing that enduring companionship and godly legacy are built only when Christ is at the center.',
    foodForThought: 'Are your current views on marriage and relationships shaped more by societal campus trends or by the uncompromised Word of God?',
    prayerPoints: [
      'Lord Jesus, anchor my heart in Your eternal Word regarding purity and Christian relationships.',
      'Father, protect the Anglican Students\' Fellowship (ASF FUTA) from subtle worldly compromises.',
      'Grant us the grace to uphold uncompromising Christian integrity in our personal lives, courtships, and homes.'
    ],
    prayerText: 'Heavenly Father, we thank You for the divine institution of marriage and Christian fellowship. Grant us the wisdom and strength to uphold Your holy truth in our generation. Help us to walk in divine agreement with Your Word, resisting cultural distortions, and reflecting the glory of Christ in our daily lives. In Jesus\' mighty name we pray. Amen.',
    author: 'ASF FUTA Bible Study Unit',
    teacher: 'Bro. Emmanuel & Sis. Ruth',
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    documentType: 'pdf',
    isCurrent: true,
    isPublished: true
  },
  {
    id: 'study-02',
    lessonNumber: 2,
    title: 'Biblical Foundations of Marriage',
    annualTheme: 'The Reign of God: Marriage And Christian Lifestyle',
    subTheme: 'The Concept of Marriage (2)',
    date: 'Jan 11, 2026',
    keyScripture: 'Eph 5:22-33',
    textScriptures: ['Eph 5:22-33', 'Col 3:18-19'],
    references: [
      { book: 'Ephesians', bookId: 'EPH', chapter: 5, verseStart: 22, verseEnd: 33, raw: 'Eph 5:22-33' },
      { book: 'Colossians', bookId: 'COL', chapter: 3, verseStart: 18, verseEnd: 19, raw: 'Col 3:18-19' }
    ],
    summary: 'Exploring the covenantal blueprint of Christ and the Church as the gold standard for marital roles, sacrificial love, and mutual respect.',
    aims: [
      'To examine the relationship between Christ and the Church as the model for marriage.',
      'To understand biblical roles of sacrificial leadership and submission in the home.',
      'To cultivate practical habits of spiritual intimacy and mutual encouragement.'
    ],
    memoryVerse: {
      reference: 'Eph 5:25',
      text: 'Husbands, love your wives, even as Christ also loved the church, and gave himself for it.',
      structuredRef: { book: 'Ephesians', bookId: 'EPH', chapter: 5, verseStart: 25, raw: 'Eph 5:25' }
    },
    introduction: 'The scriptures do not leave believers in doubt regarding how marriage should function. In Paul\'s epistle to the Ephesians, Christian marriage is unveiled as a living parable of Christ\'s redemptive love for His Church.',
    sections: [
      {
        id: 'sec-21',
        title: '1. Sacrificial Leadership and Love',
        paragraphs: [
          'Christ demonstrated leadership not through authoritarian dominance, but through self-giving, washing the feet of His disciples and laying down His life.',
          'In a Christian marriage, leadership is measured by Christlike sacrifice, protection, and spiritual nurture.'
        ],
        scriptureRefs: ['Eph 5:25-28', '1 Pet 3:7']
      }
    ],
    studyGuide: [
      {
        id: 'q21',
        number: 1,
        question: 'How does Christ\'s relationship with the Church redefine the worldly concept of headship and submission in Eph 5:22-25?',
        scriptureRefs: ['Eph 5:22-25']
      },
      {
        id: 'q22',
        number: 2,
        question: 'What practical steps can young Christian students take today to prepare for a Christ-centered marriage in the future?',
        scriptureRefs: ['Col 3:18-19', '1 Tim 4:12']
      }
    ],
    discussionQuestions: [
      'How does Christ\'s relationship with the Church redefine headship and submission?',
      'What practical steps can young Christian students take today to prepare for a Christ-centered marriage?'
    ],
    conclusion: 'When Christ is at the center of a relationship, marriage becomes a vibrant testimony of divine grace, peace, and spiritual power.',
    foodForThought: 'In what ways does your character currently reflect the sacrificial love and humility required for Christian partnership?',
    prayerPoints: [
      'Oh Lord, fill our fellowship with young men and women of high moral and spiritual integrity.',
      'Father, let our homes and future marriages be living altars of Your glory.'
    ],
    prayerText: 'Lord God Almighty, teach us to love with Your divine, unconditional love. May our lives, courtships, and future homes honor You in all things. In Jesus\' name. Amen.',
    author: 'ASF FUTA Bible Study Unit',
    teacher: 'Pastor Kayode',
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    documentType: 'pdf',
    isCurrent: false,
    isPublished: true
  },
  {
    id: 'study-03',
    lessonNumber: 3,
    title: 'Roles and Responsibilities',
    annualTheme: 'The Reign of God: Marriage And Christian Lifestyle',
    subTheme: 'Navigating Partnership',
    date: 'Jan 18, 2026',
    keyScripture: '1 Pet 3:1-7',
    textScriptures: ['1 Pet 3:1-7', 'Prov 31:10-31'],
    references: [
      { book: '1 Peter', bookId: '1PE', chapter: 3, verseStart: 1, verseEnd: 7, raw: '1 Pet 3:1-7' },
      { book: 'Proverbs', bookId: 'PRO', chapter: 31, verseStart: 10, verseEnd: 31, raw: 'Prov 31:10-31' }
    ],
    summary: 'A detailed look into complementary roles, spiritual stewardship, and building a peaceful, God-fearing home environment.',
    aims: [
      'To understand complementary roles in Christian partnership.',
      'To study the virtues of a God-fearing spouse as described in Proverbs 31 and 1 Peter 3.',
      'To learn how to handle misunderstandings through humility and prayer.'
    ],
    memoryVerse: {
      reference: '1 Pet 3:7',
      text: 'Likewise, ye husbands, dwell with them according to knowledge, giving honour unto the wife... as being heirs together of the grace of life.',
      structuredRef: { book: '1 Peter', bookId: '1PE', chapter: 3, verseStart: 7, raw: '1 Pet 3:7' }
    },
    introduction: 'God created man and woman with complementary strengths to fulfill His purpose together. Recognizing and honoring these God-given roles prevents strife and fosters enduring harmony.',
    sections: [
      {
        id: 'sec-31',
        title: '1. Heirs Together of Grace',
        paragraphs: [
          'Peter emphasizes that husbands and wives are joint heirs of the grace of life. Hindered prayers are often the result of marital discord and dishonor.'
        ],
        scriptureRefs: ['1 Pet 3:7', 'Mal 2:14-15']
      }
    ],
    studyGuide: [
      {
        id: 'q31',
        number: 1,
        question: 'According to 1 Pet 3:7, why is mutual honor and spiritual understanding essential for answered prayers?',
        scriptureRefs: ['1 Pet 3:7']
      }
    ],
    discussionQuestions: [
      'According to 1 Pet 3:7, why is mutual honor and spiritual understanding essential for answered prayers?'
    ],
    conclusion: 'A God-honoring partnership thrives on mutual respect, joint prayer, and adherence to scriptural responsibilities.',
    foodForThought: 'Are you actively cultivating habits of honor, patience, and active listening in your daily fellowship relationships?',
    prayerPoints: [
      'Lord, grant us spiritual discernment and emotional maturity in all our interpersonal relationships.',
      'Father, let Your peace reign supreme in every family represented in ASF.'
    ],
    prayerText: 'Father Lord, make us instruments of Your peace and wisdom. Help us to walk in honor and grace with one another. Amen.',
    author: 'ASF FUTA Bible Study Unit',
    teacher: 'Bro. David',
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    documentType: 'pdf',
    isCurrent: false,
    isPublished: true
  }
];
