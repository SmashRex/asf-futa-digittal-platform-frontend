/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  BookMarked, 
  Music, 
  ChevronRight,
  Bookmark
} from 'lucide-react';

export default function BookmarksPage() {
  const navigate = useNavigate();

  const savedStudies = [
    { id: 'study-01', title: 'The Sermon on the Mount', subtitle: 'Matthew 5-7 Analysis', date: 'Oct 12' },
    { id: 'study-02', title: 'Parables of the Kingdom', subtitle: 'Weekly Study Notes', date: 'Sep 28' }
  ];

  const savedPassages = [
    { bookId: 'JHN', chapter: 3, reference: 'John 3:16', subtitle: 'World English Bible (WEB)', date: 'Oct 05' },
    { bookId: 'PSA', chapter: 23, reference: 'Psalm 23', subtitle: 'King James Version (KJV)', date: 'Sep 15' }
  ];

  const savedHymns = [
    { id: '42', title: 'Hymn #42: Amazing Grace', subtitle: 'SOP Collection', date: 'Oct 10' }
  ];

  return (
    <div className="flex-1 bg-[#FDFBF9] text-[#18181B] min-h-screen font-sans pb-16" id="bookmarks-screen">
      
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E4E4E7] h-14 px-4 flex items-center justify-between shadow-xs">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full text-[#7A1F2B] hover:bg-[#FAF8F5] transition-colors active:scale-95"
          aria-label="Go back"
          id="bookmarks-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-[#7A1F2B] tracking-tight">
          My Bookmarks
        </h1>

        <div className="w-9"></div> {/* Spacer */}
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Category 1: Bible Study */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 pb-1 border-b border-[#E4E4E7]">
            <BookMarked className="w-4 h-4 text-[#7A1F2B]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B]">
              Bible Study Outlines
            </h2>
          </div>

          <div className="bg-white border border-[#E4E4E7] rounded-xl divide-y divide-[#E4E4E7] overflow-hidden shadow-xs">
            {savedStudies.map((study) => (
              <Link
                key={study.id}
                to={`/bible-study/read/${study.id}`}
                className="p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors group block"
              >
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#18181B] group-hover:text-[#7A1F2B] transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-xs text-[#52525B] mt-0.5">{study.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#52525B] font-medium">{study.date}</span>
                  <ChevronRight className="w-4 h-4 text-[#E4E4E7] group-hover:text-[#7A1F2B] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Category 2: Bible Scriptures */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 pb-1 border-b border-[#E4E4E7]">
            <BookOpen className="w-4 h-4 text-[#7A1F2B]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B]">
              Scripture Passages
            </h2>
          </div>

          <div className="bg-white border border-[#E4E4E7] rounded-xl divide-y divide-[#E4E4E7] overflow-hidden shadow-xs">
            {savedPassages.map((p, idx) => (
              <Link
                key={idx}
                to={`/bible/read/${p.bookId}/${p.chapter}`}
                className="p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors group block"
              >
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#18181B] group-hover:text-[#7A1F2B] transition-colors">
                    {p.reference}
                  </h3>
                  <p className="text-xs text-[#52525B] mt-0.5">{p.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#52525B] font-medium">{p.date}</span>
                  <ChevronRight className="w-4 h-4 text-[#E4E4E7] group-hover:text-[#7A1F2B] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Category 3: Hymns */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 pb-1 border-b border-[#E4E4E7]">
            <Music className="w-4 h-4 text-[#7A1F2B]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B]">
              Hymn Book
            </h2>
          </div>

          <div className="bg-white border border-[#E4E4E7] rounded-xl divide-y divide-[#E4E4E7] overflow-hidden shadow-xs">
            {savedHymns.map((hymn) => (
              <Link
                key={hymn.id}
                to={`/hymns/read/${hymn.id}`}
                className="p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors group block"
              >
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#18181B] group-hover:text-[#7A1F2B] transition-colors">
                    {hymn.title}
                  </h3>
                  <p className="text-xs text-[#52525B] mt-0.5">{hymn.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#52525B] font-medium">{hymn.date}</span>
                  <ChevronRight className="w-4 h-4 text-[#E4E4E7] group-hover:text-[#7A1F2B] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
