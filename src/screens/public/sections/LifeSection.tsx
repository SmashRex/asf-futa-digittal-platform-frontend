import React from 'react';
import { Camera } from 'lucide-react';
import { ImageWithFallback } from '../../../components/common/ImageWithFallback';
import { useWebsiteCopy } from '../../../hooks/useWebsiteCopy';
import { LifeSectionCopy } from '../../../types/websiteCopy';

interface FellowshipPhoto {
  id: string;
  url?: string;
  category: string;
  description: string;
}

interface LifeSectionProps {
  lifeContent?: LifeSectionCopy;
}

// These represent dynamic slots that can be eventually loaded from the backend
const STUDENT_GRID_PHOTOS: FellowshipPhoto[] = [
  {
    id: 'stud-1',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600',
    category: 'Students',
    description: 'Group of students collaborating on campus'
  },
  {
    id: 'stud-2',
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600',
    category: 'Fellowship',
    description: 'Sharing warm fellowship moments'
  },
  {
    id: 'stud-3',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600',
    category: 'Community',
    description: 'Joyful community celebrations'
  },
  {
    id: 'stud-4',
    url: 'https://images.unsplash.com/photo-1511649475100-1100cca080cf?auto=format&fit=crop&q=80&w=600',
    category: 'Academic Life',
    description: 'Studying together in the library'
  }
];

const LIFE_GALLERY_PHOTOS: FellowshipPhoto[] = [
  {
    id: 'life-1',
    url: 'https://images.unsplash.com/photo-1510561195210-915995574045?auto=format&fit=crop&q=80&w=600',
    category: 'Worship',
    description: 'Singing praises during weekly fellowship'
  },
  {
    id: 'life-2',
    url: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=600',
    category: 'Bible Study',
    description: 'Interactive group discussions and scriptural study'
  },
  {
    id: 'life-3',
    url: 'https://images.unsplash.com/photo-1489641493513-ba4ee84ccea9?auto=format&fit=crop&q=80&w=600',
    category: 'Prayer',
    description: 'Interceding together in faith'
  },
  {
    id: 'life-4',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600',
    category: 'Community',
    description: 'Moments of laughter and campus community'
  },
  {
    id: 'life-5',
    url: 'https://images.unsplash.com/photo-1526976781193-352413b8ebd2?auto=format&fit=crop&q=80&w=600',
    category: 'Events',
    description: 'Memories from our annual homecoming gala'
  },
  {
    id: 'life-6',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600',
    category: 'Campus Life',
    description: 'Spreading the divine light across FUTA campus'
  }
];

export default function LifeSection({ lifeContent }: LifeSectionProps = {}) {
  const { life: fallbackLife } = useWebsiteCopy();
  const life = lifeContent || fallbackLife;

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
              {life.supportingCopy.split('\n\n').map((paragraph, index) => {
                const isLast = index === life.supportingCopy.split('\n\n').length - 1;
                return (
                  <p key={index} className={isLast ? "font-semibold text-[#18181B]" : ""}>
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="rounded-2xl overflow-hidden shadow-sm relative group">
                <ImageWithFallback
                  src={STUDENT_GRID_PHOTOS[0].url}
                  fallbackType="worship"
                  preset="card"
                  aspectRatio="aspect-[4/5]"
                  alt={STUDENT_GRID_PHOTOS[0].description}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-sm relative group">
                <ImageWithFallback
                  src={STUDENT_GRID_PHOTOS[1].url}
                  fallbackType="userAvatar"
                  preset="card"
                  aspectRatio="aspect-square"
                  alt={STUDENT_GRID_PHOTOS[1].description}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-sm relative group">
                <ImageWithFallback
                  src={STUDENT_GRID_PHOTOS[2].url}
                  fallbackType="eventHero"
                  preset="card"
                  aspectRatio="aspect-square"
                  alt={STUDENT_GRID_PHOTOS[2].description}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-sm relative group">
                <ImageWithFallback
                  src={STUDENT_GRID_PHOTOS[3].url}
                  fallbackType="bibleStudy"
                  preset="card"
                  aspectRatio="aspect-[4/5]"
                  alt={STUDENT_GRID_PHOTOS[3].description}
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
            {LIFE_GALLERY_PHOTOS.map((photo) => (
              <div key={photo.id} className="group relative rounded-2xl overflow-hidden shadow-sm">
                <ImageWithFallback
                  src={photo.url}
                  fallbackType="worship"
                  preset="card"
                  aspectRatio="aspect-[4/3]"
                  alt={photo.description}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                    {photo.category}
                  </span>
                  <p className="text-white font-body-md font-medium">{photo.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
