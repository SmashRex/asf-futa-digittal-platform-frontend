import React from 'react';
import { useWebsiteCopy } from '../../../hooks/useWebsiteCopy';
import { AboutSectionCopy } from '../../../types/websiteCopy';

interface AboutSectionProps {
  aboutContent?: AboutSectionCopy;
}

export default function AboutSection({ aboutContent }: AboutSectionProps = {}) {
  const { about: fallbackAbout } = useWebsiteCopy();
  const about = aboutContent || fallbackAbout;

  return (
    <section data-section-id="about" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* We Follow Jesus Together */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="order-2 lg:order-1 relative">
            <div className="aspect-[4/3] bg-stone-100 rounded-3xl overflow-hidden shadow-sm relative">
              <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                <span className="font-label-caps tracking-widest text-xs uppercase">Community Photo Placeholder</span>
              </div>
            </div>
            {/* Decorative float */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#FEBE56]/20 rounded-full blur-3xl -z-10" />
          </div>
          <div className="order-1 lg:order-2 flex flex-col gap-6">
            <h2 className="font-display-reading text-4xl sm:text-5xl text-[#18181B] leading-tight">
              {about.headline}
            </h2>
            <div className="font-body-reading text-lg text-stone-600 space-y-4 whitespace-pre-wrap">
              {about.description.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* It's More Than a Service */}
        <div className="flex flex-col gap-12">
          <div className="max-w-2xl">
            <h2 className="font-display-reading text-3xl sm:text-4xl text-[#18181B] mb-4">
              It's More Than a Service.
            </h2>
            <p className="font-body-reading text-lg text-stone-600">
              There is more to ASF than showing up for a meeting. It's about what happens when students choose to walk with Christ — together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-stone-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#5B0617] mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-[#18181B]">{about.worshipTitle}</h3>
              <p className="font-body-md text-stone-600 leading-relaxed">
                {about.worshipDesc}
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-stone-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#5B0617] mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-[#18181B]">{about.learnTitle}</h3>
              <p className="font-body-md text-stone-600 leading-relaxed">
                {about.learnDesc}
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-stone-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#5B0617] mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-[#18181B]">{about.prayTitle}</h3>
              <p className="font-body-md text-stone-600 leading-relaxed">
                {about.prayDesc}
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-stone-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#5B0617] mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-[#18181B]">{about.lifeTitle}</h3>
              <p className="font-body-md text-stone-600 leading-relaxed">
                {about.lifeDesc}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
