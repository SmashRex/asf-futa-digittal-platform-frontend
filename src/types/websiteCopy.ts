/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HeroSectionCopy {
  headline: string;
  supportingText: string;
  primaryCtaText: string;
  secondaryCtaText: string;
}

export interface AboutSectionCopy {
  headline: string;
  description: string;
  worshipTitle: string;
  worshipDesc: string;
  learnTitle: string;
  learnDesc: string;
  prayTitle: string;
  prayDesc: string;
  lifeTitle: string;
  lifeDesc: string;
}

export interface LifeSectionCopy {
  heading: string;
  supportingCopy: string;
  lifeAtAsfHeading: string;
  lifeAtAsfSubheading: string;
}

export interface VisitSectionCopy {
  headline: string;
  subheading: string;
  introText: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  visitHeadline: string;
  visitSubheading: string;
  locationName: string;
  mainGatheringName: string;
  serviceTime: string;
  serviceVenue: string;
  directionsCtaText: string;
}

export interface CtaSectionCopy {
  heading: string;
  text: string;
  ctaButtonText: string;
}

export interface WebsiteCopyModel {
  hero: HeroSectionCopy;
  about: AboutSectionCopy;
  life: LifeSectionCopy;
  visit: VisitSectionCopy;
  cta: CtaSectionCopy;
  lastUpdated: string;
  updatedBy: string;
  version: number;
}

/**
 * Controlled section types available in the CMS Add Section builder.
 * Free-form arbitrary HTML, CSS, or JS injection is strictly prohibited.
 */
export type ControlledSectionType =
  | 'hero'
  | 'about'
  | 'schedule'
  | 'life'
  | 'visit'
  | 'cta'
  | 'text_image'
  | 'feature_grid'
  | 'card_grid'
  | 'quote'
  | 'callout'
  | 'event_highlight'
  | 'announcement_highlight'
  | 'gallery_preview'
  | 'scripture_highlight'
  | 'custom_content';

export type SectionBackground = 'default' | 'subtle' | 'brand' | 'accent';
export type SectionAlignment = 'left' | 'center' | 'right';
export type SectionImagePosition = 'left' | 'right' | 'top' | 'bottom';
export type SectionLayout = 'text_image' | 'image_text' | 'stacked' | 'grid_2' | 'grid_3' | 'grid_4';

export interface ControlledSectionConfig {
  alignment?: SectionAlignment;
  layout?: SectionLayout;
  imagePosition?: SectionImagePosition;
  background?: SectionBackground;
  showCta?: boolean;
  ctaText?: string;
  ctaLink?: string;
  badge?: string;
}

export interface WebsiteSectionItem {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  tag?: string;
  linkText?: string;
  linkUrl?: string;
}

export interface DynamicWebsiteSection {
  id: string;
  type: ControlledSectionType;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  items?: WebsiteSectionItem[];
  configuration: ControlledSectionConfig;
  order: number;
  status: 'draft' | 'published';
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface WebsiteConfiguration {
  id: string;
  version: number;
  status: 'draft' | 'published';
  copy: WebsiteCopyModel;
  sections: DynamicWebsiteSection[];
  lastUpdated: string;
  updatedBy: string;
  publishedAt?: string;
}

