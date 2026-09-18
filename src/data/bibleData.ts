/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BibleBookDetail, BibleVersion } from '../types';

export const mockBibleVersions: BibleVersion[] = [
  {
    id: 'kjv',
    name: 'King James Version',
    shortName: 'KJV',
    isPrebundled: true,
    isDefault: true
  },
  {
    id: 'bsb',
    name: 'Berean Standard Bible',
    shortName: 'BSB',
    isPrebundled: false,
    isDefault: false
  },
  {
    id: 'asv',
    name: 'American Standard Version',
    shortName: 'ASV',
    isPrebundled: false,
    isDefault: false
  },
  {
    id: 'web',
    name: 'World English Bible',
    shortName: 'WEB',
    isPrebundled: false,
    isDefault: false
  }
];

export const mockBibleBooks: BibleBookDetail[] = [
  {
    id: 'genesis',
    name: 'Genesis',
    testament: 'Old',
    chapterCount: 50,
    totalChapters: 50,
    chapters: [
      {
        number: 1,
        verses: [
          { number: 1, text: 'In the beginning God created the heaven and the earth.' },
          { number: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
          { number: 3, text: 'And God said, Let there be light: and there was light.' },
          { number: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
          { number: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' }
        ]
      },
      {
        number: 2,
        verses: [
          { number: 1, text: 'Thus the heavens and the earth were finished, and all the host of them.' },
          { number: 2, text: 'And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.' },
          { number: 3, text: 'And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made.' }
        ]
      }
    ]
  },
  {
    id: 'matthew',
    name: 'Matthew',
    testament: 'New',
    chapterCount: 28,
    totalChapters: 28,
    chapters: [
      {
        number: 5,
        verses: [
          { number: 1, text: 'And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him:' },
          { number: 13, text: 'Ye are the salt of the earth: but if the salt have lost his savour, wherewith shall it be salted? it is thenceforth good for nothing, but to be cast out, and to be trodden under foot of men.' },
          { number: 14, text: 'Ye are the light of the world. A city that is set on an hill cannot be hid.' },
          { number: 16, text: 'Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.' }
        ]
      },
      {
        number: 6,
        verses: [
          { number: 9, text: 'After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name.' },
          { number: 10, text: 'Thy kingdom come. Thy will be done in earth, as it is in heaven.' },
          { number: 33, text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.' }
        ]
      }
    ]
  },
  {
    id: 'john',
    name: 'John',
    testament: 'New',
    chapterCount: 21,
    totalChapters: 21,
    chapters: [
      {
        number: 1,
        verses: [
          { number: 1, text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
          { number: 2, text: 'The same was in the beginning with God.' },
          { number: 3, text: 'All things were made by him; and without him was not any thing made that was made.' },
          { number: 4, text: 'In him was life; and the life was the light of men.' },
          { number: 5, text: 'And the light shineth in darkness; and the darkness comprehended it not.' }
        ]
      },
      {
        number: 3,
        verses: [
          { number: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
          { number: 17, text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.' },
          { number: 18, text: 'He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.' }
        ]
      }
    ]
  }
];

// Alternate translation mock for World English Bible (WEB) to test version switching
export const mockBibleBooksWEB: BibleBookDetail[] = [
  {
    id: 'genesis',
    name: 'Genesis',
    testament: 'Old',
    chapterCount: 50,
    totalChapters: 50,
    chapters: [
      {
        number: 1,
        verses: [
          { number: 1, text: 'In the beginning, God created the heavens and the earth.' },
          { number: 2, text: 'The earth was formless and empty. Darkness was on the surface of the deep. God\'s Spirit was hovering over the surface of the waters.' },
          { number: 3, text: 'God said, "Let there be light," and there was light.' },
          { number: 4, text: 'God saw the light, and saw that it was good. God divided the light from the darkness.' },
          { number: 5, text: 'God called the light "day," and the darkness he called "night." There was evening and there was morning, one day.' }
        ]
      },
      {
        number: 2,
        verses: [
          { number: 1, text: 'The heavens, the earth, and all their vast array were finished.' },
          { number: 2, text: 'On the seventh day God finished his work which he had made; and he rested on the seventh day from all his work which he had made.' },
          { number: 3, text: 'God blessed the seventh day, and made it holy, because he rested in it from all his work which he had created and made.' }
        ]
      }
    ]
  },
  {
    id: 'matthew',
    name: 'Matthew',
    testament: 'New',
    chapterCount: 28,
    totalChapters: 28,
    chapters: [
      {
        number: 5,
        verses: [
          { number: 1, text: 'Seeing the multitudes, he went up onto the mountain. When he had sat down, his disciples came to him.' },
          { number: 13, text: 'You are the salt of the earth, but if the salt has lost its flavor, with what will it be salted? It is then good for nothing, but to be cast out and trodden under foot of men.' },
          { number: 14, text: 'You are the light of the world. A city located on a hill can\'t be hidden.' },
          { number: 16, text: 'Even so, let your light shine before men, that they may see your good works, and glorify your Father who is in heaven.' }
        ]
      },
      {
        number: 6,
        verses: [
          { number: 9, text: 'Pray like this: "Our Father in heaven, may your name be kept holy.' },
          { number: 10, text: 'Let your Kingdom come. Let your will be done on earth as it is in heaven.' },
          { number: 33, text: 'But seek first God\'s Kingdom, and his righteousness; and all these things will be given to you as well.' }
        ]
      }
    ]
  },
  {
    id: 'john',
    name: 'John',
    testament: 'New',
    chapterCount: 21,
    totalChapters: 21,
    chapters: [
      {
        number: 1,
        verses: [
          { number: 1, text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
          { number: 2, text: 'The same was in the beginning with God.' },
          { number: 3, text: 'All things were made through him. Without him was not anything made that has been made.' },
          { number: 4, text: 'In him was life, and the life was the light of men.' },
          { number: 5, text: 'The light shines in the darkness, and the darkness hasn\'t overcome it.' }
        ]
      },
      {
        number: 3,
        verses: [
          { number: 16, text: 'For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.' },
          { number: 17, text: 'For God didn\'t send his Son into the world to judge the world, but that the world should be saved through him.' },
          { number: 18, text: 'He who believes in him is not judged. He who doesn\'t believe has been judged already, because he has not believed in the name of the one and only Son of God.' }
        ]
      }
    ]
  }
];

// Clean Utility search resolver to search Scripture
export function searchBible(query: string, versionId: string = 'kjv'): {
  reference: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const sourceBooks = versionId === 'web' ? mockBibleBooksWEB : mockBibleBooks;
  const results: any[] = [];

  // 1. Try parsing Reference (e.g. "John 3:16" or "Genesis 1:1" or "Mat 5:14" or "John 3")
  const refRegex = /^([a-zA-Z\s]+)\s+(\d+)(?::(\d+))?$/i;
  const match = cleanQuery.match(refRegex);

  if (match) {
    const bookSearch = match[1].toLowerCase().trim();
    const chapterNum = parseInt(match[2], 10);
    const verseNum = match[3] ? parseInt(match[3], 10) : null;

    const book = sourceBooks.find(b => 
      b.name.toLowerCase().startsWith(bookSearch) || 
      b.id.toLowerCase() === bookSearch
    );

    if (book) {
      const chapter = book.chapters.find(c => c.number === chapterNum);
      if (chapter) {
        if (verseNum !== null) {
          const verse = chapter.verses.find(v => v.number === verseNum);
          if (verse) {
            results.push({
              reference: `${book.name} ${chapter.number}:${verse.number}`,
              bookId: book.id,
              bookName: book.name,
              chapter: chapter.number,
              verse: verse.number,
              text: verse.text
            });
            return results; // perfect reference match
          }
        } else {
          // match whole chapter verses
          chapter.verses.forEach(v => {
            results.push({
              reference: `${book.name} ${chapter.number}:${v.number}`,
              bookId: book.id,
              bookName: book.name,
              chapter: chapter.number,
              verse: v.number,
              text: v.text
            });
          });
          return results;
        }
      }
    }
  }

  // 2. Otherwise execute full-text search query (keyword based)
  sourceBooks.forEach(book => {
    book.chapters.forEach(chapter => {
      chapter.verses.forEach(verse => {
        if (verse.text.toLowerCase().includes(cleanQuery)) {
          results.push({
            reference: `${book.name} ${chapter.number}:${verse.number}`,
            bookId: book.id,
            bookName: book.name,
            chapter: chapter.number,
            verse: verse.number,
            text: verse.text
          });
        }
      });
    });
  });

  return results;
}
