import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWebsiteCopy } from '../../../hooks/useWebsiteCopy';
import { VisitSectionCopy } from '../../../types/websiteCopy';

interface VisitSectionProps {
  visitContent?: VisitSectionCopy;
}

export default function VisitSection({ visitContent }: VisitSectionProps = {}) {
  const { visit: fallbackVisit } = useWebsiteCopy();
  const visit = visitContent || fallbackVisit;

  return (
    <section data-section-id="visit" className="py-24 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          {/* Never Been Before */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-label-caps text-[#5B0617] text-sm uppercase tracking-widest font-bold mb-4">
                First Time at ASF?
              </h2>
              <h3 className="font-display-reading text-4xl sm:text-5xl text-[#18181B] leading-tight mb-6">
                {visit.headline}
              </h3>
              <p className="font-body-reading text-2xl text-stone-600 font-medium mb-8">
                {visit.subheading}
              </p>
              <div className="space-y-3 font-body-md text-stone-600 text-lg whitespace-pre-wrap">
                {visit.introText.split('\n').map((line, idx) => {
                  const isLast = idx === visit.introText.split('\n').length - 1;
                  return (
                    <p key={idx} className={isLast ? "font-bold text-[#18181B] text-xl mt-6" : ""}>
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-8 mt-4">
              <div className="flex gap-4">
                <span className="font-display-reading text-3xl text-[#5B0617] opacity-40">01</span>
                <div>
                  <h4 className="font-headline-md font-bold text-[#18181B]">{visit.step1Title}</h4>
                  <p className="font-body-md text-stone-600">{visit.step1Desc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-display-reading text-3xl text-[#5B0617] opacity-40">02</span>
                <div>
                  <h4 className="font-headline-md font-bold text-[#18181B]">{visit.step2Title}</h4>
                  <p className="font-body-md text-stone-600">{visit.step2Desc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-display-reading text-3xl text-[#5B0617] opacity-40">03</span>
                <div>
                  <h4 className="font-headline-md font-bold text-[#18181B]">{visit.step3Title}</h4>
                  <p className="font-body-md text-stone-600">{visit.step3Desc}</p>
                </div>
              </div>
            </div>
            
            <p className="font-display-reading text-2xl text-[#18181B] mt-4">Come as you are.</p>
          </div>

          {/* Come Worship With Us & Location */}
          <div className="flex flex-col justify-center">
            <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm relative overflow-hidden">
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B0617]/5 rounded-bl-full" />
              
              <h3 className="font-display-reading text-3xl text-[#18181B] mb-4">{visit.visitHeadline}</h3>
              <p className="font-body-md text-stone-600 mb-8">
                {visit.visitSubheading}
              </p>

              <div className="space-y-6 mb-10">
                <div>
                  <p className="font-label-caps text-xs text-stone-500 uppercase tracking-wider font-bold mb-1">Location</p>
                  <p className="font-body-md font-medium text-[#18181B] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#5B0617]" /> {visit.locationName}
                  </p>
                </div>
                <div>
                  <p className="font-label-caps text-xs text-stone-500 uppercase tracking-wider font-bold mb-1">Main Gathering</p>
                  <p className="font-body-md font-medium text-[#18181B]">{visit.mainGatheringName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-label-caps text-xs text-stone-500 uppercase tracking-wider font-bold mb-1">Time</p>
                    <p className="font-body-md font-medium text-[#18181B]">{visit.serviceTime}</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-xs text-stone-500 uppercase tracking-wider font-bold mb-1">Venue</p>
                    <p className="font-body-md font-medium text-[#18181B]">{visit.serviceVenue}</p>
                  </div>
                </div>
              </div>

              <a href="#" className="inline-flex items-center justify-center w-full gap-2 bg-[#18181B] text-white font-body-md font-semibold h-[48px] px-6 rounded-xl hover:bg-[#27272A] transition-colors shadow-sm">
                {visit.directionsCtaText}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
