import React from 'react';
import { Music, BookOpen, Users } from 'lucide-react';
import { useWebsiteCopy } from '../../../hooks/useWebsiteCopy';
import { AboutSectionCopy } from '../../../types/websiteCopy';
import { useMediaPlacement } from '../../../hooks/useMediaPlacement';
import { ImageWithFallback } from '../../../components/common/ImageWithFallback';

function PrayIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v13" />
      <path d="M9 7l3-4 3 4" />
      <path d="M8 12a3 3 0 0 0-3 3v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3" />
      <path d="M16 12a3 3 0 0 1 3 3v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3" />
    </svg>
  );
}

interface AboutSectionProps {
  aboutContent?: AboutSectionCopy;
}

export default function AboutSection({ aboutContent }: AboutSectionProps = {}) {
  const { about: fallbackAbout } = useWebsiteCopy();
  const about = aboutContent || fallbackAbout;
  const { asset } = useMediaPlacement('public.about.community_photo');

  return (
    <section data-section-id="about" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* We Follow Jesus Together */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="order-2 lg:order-1 relative">
            {asset && asset.url ? (
              <div className="rounded-3xl overflow-hidden shadow-sm relative">
                <ImageWithFallback
                  src={asset.url}
                  fallbackType="worship"
                  preset="card"
                  aspectRatio="aspect-[4/3]"
                  alt={asset.altText || 'ASF Community Photo'}
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-stone-100 rounded-3xl overflow-hidden shadow-sm relative">
                <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                  <span className="font-label-caps tracking-widest text-xs uppercase">Community Photo Placeholder</span>
                </div>
              </div>
            )}
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
              There is more to ASF than showing up for a meeting. It's about what happens when students choose to walk with Christ, together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-stone-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#5B0617] mb-2">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="font-headline-md text-xl font-bold text-[#18181B]">{about.worshipTitle}</h3>
              <p className="font-body-md text-stone-600 leading-relaxed">
                {about.worshipDesc}
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-stone-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#5B0617] mb-2">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-headline-md text-xl font-bold text-[#18181B]">{about.learnTitle}</h3>
              <p className="font-body-md text-stone-600 leading-relaxed">
                {about.learnDesc}
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-stone-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#5B0617] mb-2">
                <PrayIcon className="w-6 h-6" />
              </div>
              <h3 className="font-headline-md text-xl font-bold text-[#18181B]">{about.prayTitle}</h3>
              <p className="font-body-md text-stone-600 leading-relaxed">
                {about.prayDesc}
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-stone-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#5B0617] mb-2">
                <Users className="w-6 h-6" />
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
