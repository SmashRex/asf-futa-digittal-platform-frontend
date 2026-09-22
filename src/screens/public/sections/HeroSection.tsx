import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { useWebsiteContent } from '../../../hooks/useWebsiteContent';
import { useMediaPlacement } from '../../../hooks/useMediaPlacement';
import { HeroSectionCopy } from '../../../types/websiteCopy';

export interface HeroBackgroundImageConfig {
  imageUrl?: string;
  mobileImageUrl?: string;
  altText?: string;
  overlayOpacity?: number;
}

interface HeroSectionProps {
  heroContent?: HeroSectionCopy;
  backgroundImage?: HeroBackgroundImageConfig;
}

export default function HeroSection({ heroContent, backgroundImage }: HeroSectionProps) {
  const websiteContent = useWebsiteContent();
  const hero = heroContent || websiteContent.hero;
  const { asset: mediaAsset } = useMediaPlacement('public.hero.background');

  const activeBackground = backgroundImage || (mediaAsset?.url ? { imageUrl: mediaAsset.url, altText: mediaAsset.altText } : undefined);
  const hasBackgroundImage = Boolean(activeBackground?.imageUrl);

  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] sm:min-h-[640px] flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-[#FDFBF9] overflow-hidden">
      {/* Responsive Background Layer */}
      {hasBackgroundImage ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <picture>
            {activeBackground?.mobileImageUrl && (
              <source media="(max-width: 639px)" srcSet={activeBackground.mobileImageUrl} />
            )}
            <img
              src={activeBackground?.imageUrl}
              alt={activeBackground?.altText || 'ASF Fellowship'}
              className="w-full h-full object-cover object-center max-sm:object-top"
            />
          </picture>
          <div 
            className="absolute inset-0 bg-gradient-to-b from-[#FDFBF9]/92 via-[#FDFBF9]/88 to-[#FDFBF9]"
            style={{ opacity: activeBackground?.overlayOpacity ?? 1 }}
          />
        </div>
      ) : (
        /* Background Decorative Elements (Current intentional design) */
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#5B0617]/5 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#FEBE56]/10 blur-[120px]" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="font-display-reading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#18181B] tracking-tight leading-[1.05] mb-6 max-w-4xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {hero.headline.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < hero.headline.split('\n').length - 1 && <br className="hidden sm:block" />}
            </React.Fragment>
          ))}
        </h1>
        
        <p className="font-body-reading text-body-reading text-[#52525B] max-w-2xl mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {hero.supportingText}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Link to="/portal" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#5B0617] text-white font-body-md font-semibold h-[52px] px-8 rounded-xl hover:bg-[#7A1F2B] transition-colors active:scale-95 shadow-lg shadow-[#5B0617]/20">
            {hero.primaryCtaText}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#schedule" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-[#E4E4E7] text-[#18181B] font-body-md font-semibold h-[52px] px-8 rounded-xl hover:bg-[#FDFBF9] transition-colors active:scale-95 shadow-sm">
            <Calendar className="w-4 h-4 text-[#52525B]" />
            {hero.secondaryCtaText}
          </a>
        </div>
      </div>
    </section>
  );
}
