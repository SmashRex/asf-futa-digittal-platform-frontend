/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import PublicHeader from '../../components/public/PublicHeader';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ScheduleSection from './sections/ScheduleSection';
import LifeSection from './sections/LifeSection';
import VisitSection from './sections/VisitSection';
import CTASection from './sections/CTASection';
import PublicFooter from './sections/PublicFooter';
import SectionRenderer from './sections/SectionRenderer';
import { useWebsiteConfiguration } from '../../hooks/useWebsiteContent';

export default function PublicHome() {
  const { sections, copy } = useWebsiteConfiguration();

  // Always scroll to top of page on mount and re-render
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans selection:bg-[#5B0617]/20 selection:text-[#5B0617]">
      <PublicHeader />
      
      <main data-main-content="true" className="min-h-[calc(100vh-5rem)] relative">
        {sections && sections.length > 0 ? (
          sections.map(section => (
            <SectionRenderer key={section.id} section={section} copy={copy} />
          ))
        ) : (
          /* Graceful fallback if no sections array initialized */
          <>
            <HeroSection heroContent={copy.hero} />
            <AboutSection aboutContent={copy.about} />
            <ScheduleSection />
            <LifeSection lifeContent={copy.life} />
            <VisitSection visitContent={copy.visit} />
            <CTASection ctaContent={copy.cta} />
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
