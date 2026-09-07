/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronDown, 
  LogIn, 
  BookOpen, 
  WifiOff, 
  GraduationCap, 
  Bell, 
  Calendar,
  Headphones,
  CheckCircle2,
  Mail,
  MessageSquare,
  Sparkles,
  Search,
  X
} from 'lucide-react';

export default function HelpSupportPage() {
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState<string | null>('account');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const faqItems = [
    {
      id: 'account',
      category: 'Account & Access',
      icon: LogIn,
      question: 'Signing In & Account Access',
      answer: `ASF Digital Platform uses passwordless Magic-Link authentication for maximum security and ease of use. To sign in, simply enter your registered fellowship email address, and we will send a secure 1-click sign-in link directly to your inbox. You don't need to remember passwords or perform password resets. If you experience delay receiving your magic link, check your spam folder or verify your student registration with the Publicity Team.`
    },
    {
      id: 'bible',
      category: 'Bible & Study',
      icon: BookOpen,
      question: 'Using the Bible & Bible Study',
      answer: `The built-in Scripture library allows you to read, search, and bookmark verses across translations (KJV & WEB). Tap the "Holy Bible" or "Bible Study" option in the drawer or bottom navigation. You can highlight verses, read sermon outlines, download study guides, and search by keywords, phrases, or scripture references.`
    },
    {
      id: 'offline',
      category: 'Offline Content',
      icon: WifiOff,
      question: 'Accessing Content Offline',
      answer: `ASF is engineered offline-first. Key spiritual materials — including the King James Version Holy Bible, SOP Hymn Book, current Bible Study manuals, and downloaded audio sermons — remain fully available even when you have no internet access. You can manage offline storage in Settings > Offline & Sync.`
    },
    {
      id: 'fs',
      category: 'Foundational School',
      icon: GraduationCap,
      question: 'Foundational School (FS) Enrollment',
      answer: `Foundational School is open to all ASF members seeking spiritual grounding and leadership preparation. Navigate to the Foundational School tab to view current cohort intakes, access lecture materials, track progress, and submit assignments. Ensure your profile department and level details are up-to-date.`
    },
    {
      id: 'notifications',
      category: 'Notifications',
      icon: Bell,
      question: 'Troubleshooting Notifications',
      answer: `If you are missing urgent fellowship announcements, event reminders, or study alerts, check your device settings to ensure notification permissions are granted to ASF. You can also customize notification categories (Events, Announcements, Bible Study) in the Notifications screen.`
    },
    {
      id: 'events',
      category: 'Events & Fellowship',
      icon: Calendar,
      question: 'Events & Fellowship Calendar',
      answer: `Browse upcoming weekly fellowship meetings, specialized subgroup gatherings, and academic prayer retreats under Events. You can set individual event reminders that sync to your device or view detailed venue schedules.`
    }
  ];

  const toggleAccordion = (id: string) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  const handleContactCoordinator = () => {
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 4500);
  };

  const filteredFaqs = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#FDFBF9] text-[#18181B] min-h-screen font-sans pb-16" id="help-support-screen">
      
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E4E4E7] h-14 px-4 flex items-center justify-between shadow-xs">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full text-[#7A1F2B] hover:bg-[#FAF8F5] transition-colors active:scale-95"
          aria-label="Go back"
          id="help-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-[#7A1F2B] tracking-tight">
          Help & Support
        </h1>

        <div className="w-9"></div> {/* Balancing spacer */}
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Intro Section */}
        <div className="text-center space-y-2 py-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#7A1F2B] tracking-tight">
            How can we help you today?
          </h2>
          <p className="text-xs sm:text-sm text-[#52525B] max-w-md mx-auto leading-relaxed">
            Find simple answers to common questions about using the ASF App, or reach out to our publicity team for verified assistance.
          </p>
        </div>

        {/* Search Bar for FAQs */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#52525B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search help topics or questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-xs sm:text-sm text-[#18181B] placeholder-[#52525B]/60 focus:outline-none focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/10 shadow-xs transition-all"
            id="help-faq-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#18181B]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3" id="faq-accordion-container">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] px-1">
            Frequently Asked Questions
          </h3>

          {filteredFaqs.length === 0 ? (
            <div className="bg-white border border-[#E4E4E7] rounded-xl p-8 text-center space-y-2">
              <p className="text-sm font-bold text-[#18181B]">No matching help topics</p>
              <p className="text-xs text-[#52525B]">Try searching for "magic link", "bible", "offline", or "foundational school".</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs text-[#7A1F2B] font-bold underline"
              >
                Clear filter
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const IconComponent = faq.icon;
              const isOpen = openCategory === faq.id;

              return (
                <div
                  key={faq.id}
                  className="bg-white border border-[#E4E4E7] rounded-xl overflow-hidden transition-all shadow-xs"
                  id={`faq-item-${faq.id}`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 pr-2">
                      <div className="p-2 rounded-lg bg-[#7A1F2B]/10 text-[#7A1F2B] shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-[#18181B]">
                        {faq.question}
                      </span>
                    </div>

                    <ChevronDown className={`w-4 h-4 text-[#52525B] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#7A1F2B]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-[#E4E4E7] bg-[#FAF8F5]/60 text-xs text-[#52525B] leading-relaxed animate-fade-in">
                      <p className="whitespace-pre-line">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Human Support CTA Card */}
        <div className="bg-[#7A1F2B] text-white rounded-xl p-5 sm:p-6 space-y-4 shadow-sm relative overflow-hidden" id="human-support-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-white/10 rounded-full text-amber-300 shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Need human help?</h3>
                <p className="text-xs text-white/80 leading-relaxed max-w-sm">
                  Reach out directly to the ASF Publicity Coordinator for verified fellowship support and guidance.
                </p>
              </div>
            </div>

            <button
              onClick={handleContactCoordinator}
              className="w-full sm:w-auto px-5 py-2.5 bg-white text-[#7A1F2B] font-bold text-xs rounded-lg hover:bg-[#FAF8F5] active:scale-95 transition-all shadow-xs shrink-0 flex items-center justify-center gap-2"
              id="contact-coordinator-btn"
            >
              <Mail className="w-4 h-4 text-[#7A1F2B]" />
              <span>Contact Coordinator</span>
            </button>
          </div>

          {contactSuccess && (
            <div className="bg-emerald-800/90 text-white p-3 rounded-lg text-xs flex items-center gap-2 border border-emerald-500/30 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Support request initiated. Publicity Coordinator email contact opened (publicity@asf-futa.org).</span>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
