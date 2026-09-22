/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ImageWithFallback } from '../../../components/common/ImageWithFallback';
import { useWebsiteCopy } from '../../../hooks/useWebsiteCopy';
import { LifeSectionCopy } from '../../../types/websiteCopy';
import { useMediaPlacements } from '../../../hooks/useMediaPlacement';

interface LifeSectionProps {
  lifeContent?: LifeSectionCopy;
}

const STUDENT_GRID_SLOTS = [
  {
    key: 'public.life.student_grid_1',
    fallbackType: 'worship' as const,
    aspectRatio: 'aspect-[4/5]',
    fallbackAlt: 'Group of students collaborating on campus',
  },
  {
    key: 'public.life.student_grid_2',
    fallbackType: 'userAvatar' as const,
    aspectRatio: 'aspect-square',
    fallbackAlt: 'Sharing warm fellowship moments',
  },
  {
    key: 'public.life.student_grid_3',
    fallbackType: 'eventHero' as const,
    aspectRatio: 'aspect-square',
    fallbackAlt: 'Joyful community celebrations',
  },
  {
    key: 'public.life.student_grid_4',
    fallbackType: 'bibleStudy' as const,
    aspectRatio: 'aspect-[4/5]',
    fallbackAlt: 'Studying together in the library',
  },
];

const LIFE_GALLERY_SLOTS = [
  {
    key: 'public.life.gallery_1',
    category: 'Worship',
    fallbackAlt: 'Singing praises during weekly fellowship',
  },
  {
    key: 'public.life.gallery_2',
    category: 'Bible Study',
    fallbackAlt: 'Interactive group discussions and scriptural study',
  },
  {
    key: 'public.life.gallery_3',
    category: 'Prayer',
    fallbackAlt: 'Interceding together in faith',
  },
  {
    key: 'public.life.gallery_4',
    category: 'Community',
    fallbackAlt: 'Moments of laughter and campus community',
  },
  {
    key: 'public.life.gallery_5',
    category: 'Events',
    fallbackAlt: 'Memories from our annual homecoming gala',
  },
  {
    key: 'public.life.gallery_6',
    category: 'Campus Life',
    fallbackAlt: 'Spreading the divine light across FUTA campus',
  },
];

const ALL_LIFE_KEYS = [
  ...STUDENT_GRID_SLOTS.map((s) => s.key),
  ...LIFE_GALLERY_SLOTS.map((s) => s.key),
];

export default function LifeSection({ lifeContent }: LifeSectionProps = {}) {
  const { life: fallbackLife } = useWebsiteCopy();
  const life = lifeContent || fallbackLife;
  const { placements } = useMediaPlacements(ALL_LIFE_KEYS);

  return (
    <section data-section-id="life" className="py-24 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Just Students */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div className="flex flex-col gap-8">
            <h2 className="font-display-reading text-4xl sm:text-5xl text-[#18181B] leading-tight">
              {life.heading.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < life.heading.split('\n').length - 1 && <br/>}
                </React.Fragment>
              ))}
            </h2>
            <div className="font-body-reading text-lg text-stone-600 space-y-4 max-w-lg whitespace-pre-wrap">
              {life.supportingCopy.split('\n\n').map((paragraph, index) => (
                <p key={index} className="font-normal text-stone-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="rounded-2xl overflow-hidden shadow-sm relative group">
                <ImageWithFallback
                  src={placements['public.life.student_grid_1']?.url || undefined}
                  fallbackType={STUDENT_GRID_SLOTS[0].fallbackType}
                  preset="card"
                  aspectRatio={STUDENT_GRID_SLOTS[0].aspectRatio}
                  alt={placements['public.life.student_grid_1']?.altText || STUDENT_GRID_SLOTS[0].fallbackAlt}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-sm relative group">
                <ImageWithFallback
                  src={placements['public.life.student_grid_2']?.url || undefined}
                  fallbackType={STUDENT_GRID_SLOTS[1].fallbackType}
                  preset="card"
                  aspectRatio={STUDENT_GRID_SLOTS[1].aspectRatio}
                  alt={placements['public.life.student_grid_2']?.altText || STUDENT_GRID_SLOTS[1].fallbackAlt}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-sm relative group">
                <ImageWithFallback
                  src={placements['public.life.student_grid_3']?.url || undefined}
                  fallbackType={STUDENT_GRID_SLOTS[2].fallbackType}
                  preset="card"
                  aspectRatio={STUDENT_GRID_SLOTS[2].aspectRatio}
                  alt={placements['public.life.student_grid_3']?.altText || STUDENT_GRID_SLOTS[2].fallbackAlt}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-sm relative group">
                <ImageWithFallback
                  src={placements['public.life.student_grid_4']?.url || undefined}
                  fallbackType={STUDENT_GRID_SLOTS[3].fallbackType}
                  preset="card"
                  aspectRatio={STUDENT_GRID_SLOTS[3].aspectRatio}
                  alt={placements['public.life.student_grid_4']?.altText || STUDENT_GRID_SLOTS[3].fallbackAlt}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Life at ASF Grid */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="font-display-reading text-3xl sm:text-4xl text-[#18181B] mb-4">
              {life.lifeAtAsfHeading}
            </h2>
            <p className="font-body-reading text-lg text-stone-600 max-w-2xl mx-auto">
              {life.lifeAtAsfSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LIFE_GALLERY_SLOTS.map((slot) => {
              const asset = placements[slot.key];
              const altText = asset?.altText || slot.fallbackAlt;
              return (
                <div key={slot.key} className="group relative rounded-2xl overflow-hidden shadow-sm">
                  <ImageWithFallback
                    src={asset?.url || undefined}
                    fallbackType="worship"
                    preset="card"
                    aspectRatio="aspect-[4/3]"
                    alt={altText}
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                      {slot.category}
                    </span>
                    <p className="text-white font-body-md font-medium">{altText}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
