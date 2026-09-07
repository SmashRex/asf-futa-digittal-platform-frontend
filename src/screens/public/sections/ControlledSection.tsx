/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DynamicWebsiteSection } from '../../../types/websiteCopy';
import { ImageWithFallback } from '../../../components/common/ImageWithFallback';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Quote as QuoteIcon, 
  BookOpen, 
  Calendar, 
  Megaphone,
  HeartHandshake,
  Star
} from 'lucide-react';

interface ControlledSectionProps {
  section: DynamicWebsiteSection;
}

export const ControlledSection: React.FC<ControlledSectionProps> = ({ section }) => {
  const { title, subtitle, description, imageUrl, items, configuration } = section;
  const {
    alignment = 'left',
    layout = 'text_image',
    background = 'default',
    showCta = false,
    ctaText = 'Learn More',
    ctaLink = '#visit',
    badge
  } = configuration || {};

  // Background styling mapping following ASF design system
  const bgClasses: Record<string, string> = {
    default: 'bg-[#FDFBF9] text-[#18181B]',
    subtle: 'bg-[#F4EFEA] text-[#18181B] border-y border-[#E8E1D9]',
    brand: 'bg-[#5B0617] text-white selection:bg-amber-400 selection:text-[#5B0617]',
    accent: 'bg-[#FEF9EE] text-[#18181B] border-y border-[#F3E5C2]'
  };

  const isBrand = background === 'brand';
  const alignClass = alignment === 'center' ? 'text-center mx-auto' : alignment === 'right' ? 'text-right ml-auto' : 'text-left';

  // Render Section Based on Controlled Section Type
  switch (section.type) {
    case 'quote':
      return (
        <section className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 ${bgClasses[background] || bgClasses.default}`} data-section-id={section.id}>
          <div className="max-w-4xl mx-auto text-center">
            <QuoteIcon className={`w-10 h-10 mx-auto mb-6 ${isBrand ? 'text-amber-300/80' : 'text-[#5B0617]/40'}`} />
            <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium leading-snug tracking-tight mb-6">
              "{description || title}"
            </blockquote>
            {subtitle && (
              <p className={`text-base sm:text-lg font-sans font-semibold tracking-wide uppercase text-sm ${isBrand ? 'text-amber-300' : 'text-[#5B0617]'}`}>
                — {subtitle}
              </p>
            )}
          </div>
        </section>
      );

    case 'callout':
      return (
        <section className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 ${bgClasses[background] || bgClasses.default}`} data-section-id={section.id}>
          <div className="max-w-4xl mx-auto">
            <div className={`p-8 sm:p-12 rounded-2xl border ${
              isBrand 
                ? 'bg-white/10 border-white/20' 
                : 'bg-white border-[#E8E1D9] shadow-sm'
            }`}>
              {badge && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 ${
                  isBrand ? 'bg-amber-300 text-[#5B0617]' : 'bg-[#5B0617]/10 text-[#5B0617]'
                }`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {badge}
                </span>
              )}
              <h2 className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight mb-3 ${isBrand ? 'text-white' : 'text-[#18181B]'}`}>
                {title}
              </h2>
              {subtitle && (
                <p className={`text-sm sm:text-base font-medium mb-3 ${isBrand ? 'text-amber-200' : 'text-[#5B0617]'}`}>
                  {subtitle}
                </p>
              )}
              {description && (
                <p className={`text-base leading-relaxed mb-6 ${isBrand ? 'text-white/90' : 'text-[#52525B]'}`}>
                  {description}
                </p>
              )}
              {showCta && ctaLink && (
                <a
                  href={ctaLink}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm ${
                    isBrand 
                      ? 'bg-amber-400 text-[#5B0617] hover:bg-amber-300 font-bold' 
                      : 'bg-[#5B0617] text-white hover:bg-[#480512]'
                  }`}
                >
                  {ctaText}
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </section>
      );

    case 'scripture_highlight':
      return (
        <section className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 ${bgClasses[background] || bgClasses.default}`} data-section-id={section.id}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#FAF7F2] border border-[#E8E1D9] rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B0617]/5 rounded-bl-full pointer-events-none" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B0617]/10 text-[#5B0617] text-xs font-semibold uppercase tracking-wider mb-4">
                <BookOpen className="w-3.5 h-3.5" />
                {badge || 'Scripture Highlight'}
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#18181B] font-semibold leading-relaxed mb-4">
                "{description || title}"
              </h3>
              <p className="text-[#5B0617] font-bold text-base tracking-wide">
                — {subtitle || title}
              </p>
              {showCta && (
                <div className="mt-6">
                  <a
                    href={ctaLink || '#/bible'}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#5B0617] hover:underline"
                  >
                    {ctaText || 'Read in Bible'}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case 'feature_grid':
    case 'card_grid':
      return (
        <section className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 ${bgClasses[background] || bgClasses.default}`} data-section-id={section.id}>
          <div className="max-w-6xl mx-auto">
            <div className={`max-w-3xl mb-12 sm:mb-16 ${alignClass}`}>
              {badge && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 ${
                  isBrand ? 'bg-white/20 text-amber-300' : 'bg-[#5B0617]/10 text-[#5B0617]'
                }`}>
                  {badge}
                </span>
              )}
              <h2 className={`text-2xl sm:text-4xl font-serif font-bold tracking-tight mb-4 ${isBrand ? 'text-white' : 'text-[#18181B]'}`}>
                {title}
              </h2>
              {subtitle && (
                <p className={`text-base sm:text-lg mb-2 ${isBrand ? 'text-amber-200' : 'text-[#5B0617] font-medium'}`}>
                  {subtitle}
                </p>
              )}
              {description && (
                <p className={`text-sm sm:text-base leading-relaxed ${isBrand ? 'text-white/80' : 'text-[#52525B]'}`}>
                  {description}
                </p>
              )}
            </div>

            {/* Grid Items */}
            {items && items.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 ${
                      isBrand 
                        ? 'bg-white/10 border-white/20 hover:bg-white/15' 
                        : 'bg-white border-[#E8E1D9] hover:border-[#5B0617]/30 hover:shadow-md'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 bg-[#5B0617]/10 text-[#5B0617]">
                      {idx % 4 === 0 ? <Star className="w-5 h-5 text-[#5B0617]" /> :
                       idx % 4 === 1 ? <BookOpen className="w-5 h-5 text-[#5B0617]" /> :
                       idx % 4 === 2 ? <HeartHandshake className="w-5 h-5 text-[#5B0617]" /> :
                       <CheckCircle2 className="w-5 h-5 text-[#5B0617]" />}
                    </div>
                    <h3 className={`text-lg sm:text-xl font-serif font-bold mb-2 ${isBrand ? 'text-white' : 'text-[#18181B]'}`}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className={`text-sm leading-relaxed ${isBrand ? 'text-white/80' : 'text-[#52525B]'}`}>
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case 'event_highlight':
    case 'announcement_highlight':
      return (
        <section className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 ${bgClasses[background] || bgClasses.default}`} data-section-id={section.id}>
          <div className="max-w-5xl mx-auto">
            <div className={`p-8 sm:p-12 rounded-3xl border flex flex-col md:flex-row items-center gap-8 ${
              isBrand 
                ? 'bg-white/10 border-white/20' 
                : 'bg-white border-[#E8E1D9] shadow-sm'
            }`}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-[#5B0617] text-white">
                {section.type === 'event_highlight' ? <Calendar className="w-8 h-8 text-amber-300" /> : <Megaphone className="w-8 h-8 text-amber-300" />}
              </div>
              <div className="flex-1 text-left">
                {badge && (
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#5B0617] mb-1">
                    {badge}
                  </span>
                )}
                <h3 className={`text-2xl font-serif font-bold tracking-tight mb-2 ${isBrand ? 'text-white' : 'text-[#18181B]'}`}>
                  {title}
                </h3>
                {subtitle && (
                  <p className={`text-sm font-semibold mb-2 ${isBrand ? 'text-amber-200' : 'text-[#5B0617]'}`}>
                    {subtitle}
                  </p>
                )}
                {description && (
                  <p className={`text-sm sm:text-base leading-relaxed ${isBrand ? 'text-white/80' : 'text-[#52525B]'}`}>
                    {description}
                  </p>
                )}
              </div>
              {showCta && (
                <div className="shrink-0">
                  <a
                    href={ctaLink}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5B0617] text-white text-sm font-medium hover:bg-[#480512] transition-colors shadow-sm"
                  >
                    {ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case 'text_image':
    default:
      const isReversed = layout === 'image_text';
      return (
        <section className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 ${bgClasses[background] || bgClasses.default}`} data-section-id={section.id}>
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
              {/* Text Column */}
              <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : 'lg:order-1'} ${alignClass}`}>
                {badge && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 ${
                    isBrand ? 'bg-white/20 text-amber-300' : 'bg-[#5B0617]/10 text-[#5B0617]'
                  }`}>
                    {badge}
                  </span>
                )}
                <h2 className={`text-2xl sm:text-4xl font-serif font-bold tracking-tight mb-4 ${isBrand ? 'text-white' : 'text-[#18181B]'}`}>
                  {title}
                </h2>
                {subtitle && (
                  <p className={`text-base sm:text-lg mb-3 ${isBrand ? 'text-amber-200' : 'text-[#5B0617] font-medium'}`}>
                    {subtitle}
                  </p>
                )}
                {description && (
                  <p className={`text-sm sm:text-base leading-relaxed mb-8 ${isBrand ? 'text-white/80' : 'text-[#52525B]'}`}>
                    {description}
                  </p>
                )}
                {showCta && ctaLink && (
                  <a
                    href={ctaLink}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm ${
                      isBrand 
                        ? 'bg-amber-400 text-[#5B0617] hover:bg-amber-300 font-bold' 
                        : 'bg-[#5B0617] text-white hover:bg-[#480512]'
                    }`}
                  >
                    {ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Image Column */}
              {imageUrl && (
                <div className={`lg:col-span-5 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E8E1D9] bg-white aspect-4/3">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={title}
                      fallbackType="worship"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      );
  }
};
