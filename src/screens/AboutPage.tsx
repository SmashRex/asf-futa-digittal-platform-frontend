/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sun, 
  BookOpen, 
  Sparkles, 
  Heart, 
  Globe, 
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-[#FDFBF9] text-[#18181B] min-h-screen font-sans pb-16" id="about-asf-screen">
      
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E4E4E7] h-14 px-4 flex items-center justify-between shadow-xs">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full text-[#7A1F2B] hover:bg-[#FAF8F5] transition-colors active:scale-95"
          aria-label="Go back"
          id="about-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-[#7A1F2B] tracking-tight">
          About ASF
        </h1>

        <div className="w-9"></div> {/* Spacer */}
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro Crest Section */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#7A1F2B]/10 border border-[#7A1F2B]/20 flex items-center justify-center mx-auto text-[#7A1F2B] shadow-xs">
            <Compass className="w-10 h-10 text-[#7A1F2B]" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1F2B]">
              Welcome Home.
            </h2>
            <p className="font-serif text-sm sm:text-base text-[#52525B] leading-relaxed">
              Welcome to the digital expression of the Anglican Students' Fellowship (ASF) at the Federal University of Technology, Akure (FUTA). This is your digital home for spiritual growth, genuine fellowship, and walking together in faith.
            </p>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Item 1: Our Digital Home */}
          <div className="md:col-span-8 bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#7A1F2B]">
              <Globe className="w-5 h-5" />
              <h3 className="text-sm font-bold text-[#18181B]">Our Digital Home</h3>
            </div>
            <p className="font-serif text-xs sm:text-sm text-[#52525B] leading-relaxed">
              More than just an app, this platform is built to sustain the warmth of our fellowship throughout the week. Whether catching up on sermon outlines, downloading study manuals, or connecting with brethren, this space nurtures your walk with Christ in an academic environment.
            </p>
          </div>

          {/* Item 2: Arise Shine */}
          <div className="md:col-span-4 bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-amber-600">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-[#18181B]">Arise, Shine</h3>
            </div>
            <p className="font-serif text-xs text-[#52525B] leading-relaxed">
              Embodying the call in Isaiah 60:1, reminding us daily to rise above academic and worldly noise, shining the light of Christ on campus and beyond.
            </p>
          </div>

          {/* Item 3: Our Mission */}
          <div className="md:col-span-12 bg-[#FAF8F5] border border-[#E4E4E7] rounded-xl p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#7A1F2B]">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-sm font-bold text-[#18181B]">Our Mission</h3>
            </div>
            <p className="font-serif text-xs sm:text-sm text-[#52525B] leading-relaxed">
              To raise heaven-bound, academically sound, and socially responsible Christians who will impact FUTA and the world at large for Christ. We believe in balancing academic excellence with fervent spirituality.
            </p>
          </div>

        </div>

        {/* Platform Version Footer */}
        <div className="text-center pt-4 space-y-1">
          <p className="text-xs font-bold text-[#52525B] uppercase tracking-wider">ASF Digital Platform</p>
          <p className="text-[11px] text-[#52525B]">Version 1.0.0 • Built with love for the fellowship</p>
        </div>

      </main>
    </div>
  );
}
