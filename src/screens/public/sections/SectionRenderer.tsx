/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DynamicWebsiteSection, WebsiteCopyModel } from '../../../types/websiteCopy';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import ScheduleSection from './ScheduleSection';
import LifeSection from './LifeSection';
import VisitSection from './VisitSection';
import CTASection from './CTASection';
import { ControlledSection } from './ControlledSection';

interface SectionRendererProps {
  section: DynamicWebsiteSection;
  copy: WebsiteCopyModel;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  sectionId: string;
  sectionType: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Section-level Error Boundary to ensure a malformed or crashing section
 * fails safely without breaking the entire public website.
 */
class SectionErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn(`[SectionRenderer] Section "${this.props.sectionId}" (${this.props.sectionType}) failed to render safely:`, error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      // In development or when logging, render a graceful invisible fallback
      return null;
    }
    return this.props.children;
  }
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, copy }) => {
  if (!section || !section.isVisible) {
    return null;
  }

  const renderSectionComponent = () => {
    switch (section.type) {
      case 'hero':
        return <HeroSection heroContent={copy.hero} />;

      case 'about':
        return <AboutSection aboutContent={copy.about} />;

      case 'schedule':
        return <ScheduleSection />;

      case 'life':
        return <LifeSection lifeContent={copy.life} />;

      case 'visit':
        return <VisitSection visitContent={copy.visit} />;

      case 'cta':
        return <CTASection ctaContent={copy.cta} />;

      case 'text_image':
      case 'feature_grid':
      case 'card_grid':
      case 'quote':
      case 'callout':
      case 'event_highlight':
      case 'announcement_highlight':
      case 'gallery_preview':
      case 'scripture_highlight':
      case 'custom_content':
        return <ControlledSection section={section} />;

      default:
        // Graceful handling of unknown or unsupported section types
        console.warn(`[SectionRenderer] Unsupported section type: "${(section as any).type}". Section skipped.`);
        return null;
    }
  };

  return (
    <SectionErrorBoundary sectionId={section.id} sectionType={section.type}>
      {renderSectionComponent()}
    </SectionErrorBoundary>
  );
};

export default SectionRenderer;
