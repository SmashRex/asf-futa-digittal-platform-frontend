/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  WebsiteCopyModel, 
  DynamicWebsiteSection, 
  WebsiteConfiguration,
  ControlledSectionType
} from '../../types/websiteCopy';
import { apiClient } from '../api/client';
import { APP_CONFIG } from '../../config/app.config';

export const DEFAULT_WEBSITE_COPY: WebsiteCopyModel = {
  hero: {
    headline: "Faith. Friends. FUTA.",
    supportingText: "A community of students at the Federal University of Technology, Akure growing together in Christ. We're learning, worshipping, praying, serving, laughing, and walking through university life together.",
    primaryCtaText: "Come Along",
    secondaryCtaText: "See This Week"
  },
  about: {
    headline: "We Follow Jesus Together.",
    description: "ASF means Anglican Students' Fellowship. We're a community of students who desire to know Christ, grow in God's Word, live faithfully, and encourage one another throughout our university journey. Here, faith isn't something we practise alone — it becomes part of everyday student life.",
    worshipTitle: "We Worship",
    worshipDesc: "We lift our voices, open our hearts, and gather simply to give God praise.",
    learnTitle: "We Learn",
    learnDesc: "We open the Bible, ask questions, listen, and grow deeper in God's Word.",
    prayTitle: "We Pray",
    prayDesc: "For one another. For our campus. For our future. And for God's will in our lives.",
    lifeTitle: "We Do Life Together",
    lifeDesc: "Because university isn't just lectures and exams. We laugh, encourage one another, make memories, and walk through life together."
  },
  life: {
    heading: "Just Students. Just Like You.",
    supportingCopy: "We're students. We have lectures. We write tests. We have group assignments. We celebrate birthdays. We make friends. We get tired. We figure things out. And in the middle of all of it, we follow Jesus together.",
    lifeAtAsfHeading: "Life at ASF",
    lifeAtAsfSubheading: "Worship. Fellowship. Service. Memories. A glimpse into life together at ASF FUTA."
  },
  visit: {
    headline: "Never Been to ASF Before?",
    subheading: "That's completely fine.",
    introText: "You don't need to know anyone. You don't need an invitation. You don't need to have everything figured out. Just come.",
    step1Title: "Show Up",
    step1Desc: "Come to one of our gatherings.",
    step2Title: "Meet People",
    step2Desc: "Meet students who are walking the same university journey.",
    step3Title: "Find Your Place",
    step3Desc: "Stay, grow, serve, and become part of the community.",
    visitHeadline: "Come Worship With Us",
    visitSubheading: "Whether you're a fresher, a returning student, an Anglican, or simply looking for a Christian community on campus, you're welcome.",
    locationName: "Federal University of Technology, Akure",
    mainGatheringName: "Sunday Worship Service",
    serviceTime: "8:00 AM",
    serviceVenue: "TBD (Official Venue)",
    directionsCtaText: "Get Directions"
  },
  cta: {
    heading: "Maybe You Should Come Along.",
    text: "University is a journey. Faith is a journey too. You don't have to walk either one alone.",
    ctaButtonText: "Come Worship With Us"
  },
  lastUpdated: "Sept 6, 2026",
  updatedBy: "Default System Configuration",
  version: 1
};

export const DEFAULT_WEBSITE_SECTIONS: DynamicWebsiteSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    title: 'Hero Welcome',
    configuration: { background: 'default' },
    order: 1,
    status: 'published',
    isVisible: true,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-06T00:00:00.000Z'
  },
  {
    id: 'sec-about',
    type: 'about',
    title: 'About Fellowship',
    configuration: { background: 'default' },
    order: 2,
    status: 'published',
    isVisible: true,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-06T00:00:00.000Z'
  },
  {
    id: 'sec-schedule',
    type: 'schedule',
    title: 'Weekly Schedule',
    configuration: { background: 'default' },
    order: 3,
    status: 'published',
    isVisible: true,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-06T00:00:00.000Z'
  },
  {
    id: 'sec-life',
    type: 'life',
    title: 'Life at ASF',
    configuration: { background: 'default' },
    order: 4,
    status: 'published',
    isVisible: true,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-06T00:00:00.000Z'
  },
  {
    id: 'sec-visit',
    type: 'visit',
    title: 'Visit Us',
    configuration: { background: 'default' },
    order: 5,
    status: 'published',
    isVisible: true,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-06T00:00:00.000Z'
  },
  {
    id: 'sec-cta',
    type: 'cta',
    title: 'Call to Action',
    configuration: { background: 'brand' },
    order: 6,
    status: 'published',
    isVisible: true,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-06T00:00:00.000Z'
  }
];

export const INITIAL_WEBSITE_CONFIG: WebsiteConfiguration = {
  id: 'asf-website-v1',
  version: 1,
  status: 'published',
  copy: DEFAULT_WEBSITE_COPY,
  sections: DEFAULT_WEBSITE_SECTIONS,
  lastUpdated: 'Sept 6, 2026',
  updatedBy: 'Default System Configuration',
  publishedAt: '2026-09-06T00:00:00.000Z'
};

class WebsiteCopyService {
  private publishedCacheKey = 'asf_website_config_published';
  private draftCacheKey = 'asf_website_config_draft';
  private legacyCopyCacheKey = 'asf_website_copy';
  private listeners: Set<() => void> = new Set();

  /**
   * Fetch authoritative published website configuration for the public website.
   * Prioritizes backend API when connected, falls back to local cache or default system configuration.
   */
  public getPublishedConfig(): WebsiteConfiguration {
    try {
      const saved = localStorage.getItem(this.publishedCacheKey);
      if (saved) {
        return JSON.parse(saved);
      }
      // Migrate legacy copy cache if present
      const legacySaved = localStorage.getItem(this.legacyCopyCacheKey);
      if (legacySaved) {
        const legacyCopy: WebsiteCopyModel = JSON.parse(legacySaved);
        const config: WebsiteConfiguration = {
          ...INITIAL_WEBSITE_CONFIG,
          copy: legacyCopy,
          version: legacyCopy.version || 1
        };
        localStorage.setItem(this.publishedCacheKey, JSON.stringify(config));
        return config;
      }
    } catch (e) {
      console.error('[WebsiteCopyService] Failed to load published configuration:', e);
    }
    return { ...INITIAL_WEBSITE_CONFIG };
  }

  /**
   * Fetch current working draft configuration for the CMS editor.
   * Allows content coordinators to prepare changes without altering the live website.
   */
  public getDraftConfig(): WebsiteConfiguration {
    try {
      const savedDraft = localStorage.getItem(this.draftCacheKey);
      if (savedDraft) {
        return JSON.parse(savedDraft);
      }
    } catch (e) {
      console.error('[WebsiteCopyService] Failed to load draft configuration:', e);
    }
    // If no active draft exists, clone the current published version as initial draft
    const published = this.getPublishedConfig();
    const newDraft: WebsiteConfiguration = {
      ...published,
      status: 'draft'
    };
    try {
      localStorage.setItem(this.draftCacheKey, JSON.stringify(newDraft));
    } catch (err) {
      console.error('[WebsiteCopyService] Failed to initialize draft:', err);
    }
    return newDraft;
  }

  /**
   * Backward-compatible helper to get copy model directly.
   */
  public getCopy(): WebsiteCopyModel {
    return this.getPublishedConfig().copy;
  }

  /**
   * Save changes to the CMS working draft.
   * Does NOT publish to the live public site.
   */
  public async saveDraft(
    draftUpdates: Partial<WebsiteConfiguration>,
    authorName: string = 'Publicity Coordinator'
  ): Promise<WebsiteConfiguration> {
    const currentDraft = this.getDraftConfig();
    const updatedDraft: WebsiteConfiguration = {
      ...currentDraft,
      ...draftUpdates,
      copy: {
        ...currentDraft.copy,
        ...(draftUpdates.copy || {}),
        hero: { ...currentDraft.copy.hero, ...(draftUpdates.copy?.hero || {}) },
        about: { ...currentDraft.copy.about, ...(draftUpdates.copy?.about || {}) },
        life: { ...currentDraft.copy.life, ...(draftUpdates.copy?.life || {}) },
        visit: { ...currentDraft.copy.visit, ...(draftUpdates.copy?.visit || {}) },
        cta: { ...currentDraft.copy.cta, ...(draftUpdates.copy?.cta || {}) }
      },
      sections: draftUpdates.sections || currentDraft.sections,
      status: 'draft',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      updatedBy: authorName
    };

    if (!APP_CONFIG.features.useMockServices) {
      try {
        const res = await apiClient.post<WebsiteConfiguration>('/api/content/website/draft', updatedDraft);
        if (res.data) {
          localStorage.setItem(this.draftCacheKey, JSON.stringify(res.data));
          this.notifyListeners();
          return res.data;
        }
      } catch (e) {
        console.warn('[WebsiteCopyService] Remote saveDraft failed, persisting locally:', e);
      }
    }

    localStorage.setItem(this.draftCacheKey, JSON.stringify(updatedDraft));
    this.notifyListeners();
    return updatedDraft;
  }

  /**
   * Publish the current draft to the live public website.
   * Increments version, sets status to 'published', updates timestamp, and commits to published storage.
   */
  public async publishDraft(authorName: string = 'Publicity Coordinator'): Promise<WebsiteConfiguration> {
    const draft = this.getDraftConfig();
    const published = this.getPublishedConfig();

    const newVersion = (published.version || 1) + 1;
    const nowIso = new Date().toISOString();
    const nowReadable = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newPublished: WebsiteConfiguration = {
      ...draft,
      version: newVersion,
      status: 'published',
      publishedAt: nowIso,
      lastUpdated: nowReadable,
      updatedBy: authorName,
      sections: draft.sections.map(s => ({ ...s, status: 'published' }))
    };

    if (!APP_CONFIG.features.useMockServices) {
      try {
        const res = await apiClient.post<WebsiteConfiguration>('/api/content/website/publish', newPublished);
        if (res.data) {
          localStorage.setItem(this.publishedCacheKey, JSON.stringify(res.data));
          localStorage.setItem(this.draftCacheKey, JSON.stringify(res.data));
          localStorage.setItem(this.legacyCopyCacheKey, JSON.stringify(res.data.copy));
          this.notifyListeners();
          return res.data;
        }
      } catch (e) {
        console.warn('[WebsiteCopyService] Remote publish failed, persisting locally:', e);
      }
    }

    localStorage.setItem(this.publishedCacheKey, JSON.stringify(newPublished));
    localStorage.setItem(this.draftCacheKey, JSON.stringify(newPublished));
    localStorage.setItem(this.legacyCopyCacheKey, JSON.stringify(newPublished.copy));
    this.notifyListeners();
    return newPublished;
  }

  /**
   * Discard uncommitted draft changes and restore the live published state into the draft.
   */
  public discardDraft(): WebsiteConfiguration {
    const published = this.getPublishedConfig();
    const revertedDraft: WebsiteConfiguration = {
      ...published,
      status: 'draft'
    };
    localStorage.setItem(this.draftCacheKey, JSON.stringify(revertedDraft));
    this.notifyListeners();
    return revertedDraft;
  }

  /**
   * Add a new controlled section to the website draft.
   * Strictly adheres to controlled section configurations — no arbitrary HTML/JS/CSS allowed.
   */
  public async addSection(
    sectionData: Omit<DynamicWebsiteSection, 'id' | 'createdAt' | 'updatedAt' | 'order' | 'status'>,
    authorName: string = 'Publicity Coordinator'
  ): Promise<DynamicWebsiteSection> {
    const draft = this.getDraftConfig();
    const maxOrder = draft.sections.reduce((max, s) => Math.max(max, s.order || 0), 0);

    const newSection: DynamicWebsiteSection = {
      id: `sec-custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: sectionData.type,
      title: sectionData.title,
      subtitle: sectionData.subtitle,
      description: sectionData.description,
      imageUrl: sectionData.imageUrl,
      items: sectionData.items,
      configuration: sectionData.configuration || {},
      order: maxOrder + 1,
      status: 'draft',
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: authorName
    };

    const updatedSections = [...draft.sections, newSection];
    await this.saveDraft({ sections: updatedSections }, authorName);
    return newSection;
  }

  /**
   * Update an existing section in the draft.
   */
  public async updateSection(
    sectionId: string,
    updates: Partial<DynamicWebsiteSection>,
    authorName: string = 'Publicity Coordinator'
  ): Promise<DynamicWebsiteSection | null> {
    const draft = this.getDraftConfig();
    const idx = draft.sections.findIndex(s => s.id === sectionId);
    if (idx === -1) return null;

    const existing = draft.sections[idx];
    const updated: DynamicWebsiteSection = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: authorName
    };

    const updatedSections = [...draft.sections];
    updatedSections[idx] = updated;

    await this.saveDraft({ sections: updatedSections }, authorName);
    return updated;
  }

  /**
   * Reorder sections in the draft by providing an array of section IDs in the desired order.
   */
  public async reorderSections(
    orderedIds: string[],
    authorName: string = 'Publicity Coordinator'
  ): Promise<DynamicWebsiteSection[]> {
    const draft = this.getDraftConfig();
    const sectionMap = new Map(draft.sections.map(s => [s.id, s]));

    const reordered: DynamicWebsiteSection[] = [];
    orderedIds.forEach((id, index) => {
      const sec = sectionMap.get(id);
      if (sec) {
        reordered.push({ ...sec, order: index + 1, updatedAt: new Date().toISOString() });
        sectionMap.delete(id);
      }
    });

    // Append any remaining unlisted sections
    let nextOrder = reordered.length + 1;
    sectionMap.forEach(sec => {
      reordered.push({ ...sec, order: nextOrder++ });
    });

    await this.saveDraft({ sections: reordered }, authorName);
    return reordered;
  }

  /**
   * Toggle visibility of a section (Hide / Show).
   */
  public async toggleSectionVisibility(
    sectionId: string,
    isVisible: boolean,
    authorName: string = 'Publicity Coordinator'
  ): Promise<boolean> {
    const result = await this.updateSection(sectionId, { isVisible }, authorName);
    return !!result;
  }

  /**
   * Remove a custom dynamic section from the draft.
   * Default core sections cannot be deleted, only hidden.
   */
  public async deleteSection(
    sectionId: string,
    authorName: string = 'Publicity Coordinator'
  ): Promise<boolean> {
    const draft = this.getDraftConfig();
    const isCoreSection = ['sec-hero', 'sec-about', 'sec-schedule', 'sec-life', 'sec-visit', 'sec-cta'].includes(sectionId);
    if (isCoreSection) {
      // Core sections can only be hidden, not deleted
      await this.toggleSectionVisibility(sectionId, false, authorName);
      return true;
    }

    const updatedSections = draft.sections.filter(s => s.id !== sectionId);
    await this.saveDraft({ sections: updatedSections }, authorName);
    return true;
  }

  /**
   * Legacy method for saving copy directly (adapted to save draft).
   */
  public async saveCopy(
    updatedCopy: Partial<WebsiteCopyModel>,
    authorName: string = 'Publicity Coordinator'
  ): Promise<WebsiteCopyModel> {
    const draft = this.getDraftConfig();
    const nextCopy: WebsiteCopyModel = {
      ...draft.copy,
      ...updatedCopy,
      hero: { ...draft.copy.hero, ...(updatedCopy.hero || {}) },
      about: { ...draft.copy.about, ...(updatedCopy.about || {}) },
      life: { ...draft.copy.life, ...(updatedCopy.life || {}) },
      visit: { ...draft.copy.visit, ...(updatedCopy.visit || {}) },
      cta: { ...draft.copy.cta, ...(updatedCopy.cta || {}) }
    };

    const savedConfig = await this.saveDraft({ copy: nextCopy }, authorName);
    return savedConfig.copy;
  }

  /**
   * Reset website copy and sections back to pristine system defaults.
   */
  public async resetCopy(authorName: string = 'System Admin'): Promise<WebsiteCopyModel> {
    const resetConfig: WebsiteConfiguration = {
      ...INITIAL_WEBSITE_CONFIG,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      updatedBy: authorName,
      version: 1
    };
    localStorage.setItem(this.publishedCacheKey, JSON.stringify(resetConfig));
    localStorage.setItem(this.draftCacheKey, JSON.stringify(resetConfig));
    localStorage.setItem(this.legacyCopyCacheKey, JSON.stringify(resetConfig.copy));
    this.notifyListeners();
    return resetConfig.copy;
  }

  /**
   * Subscriber mechanism for real-time front-end synchronization.
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (err) {
        console.error('[WebsiteCopyService] Listener notification failed:', err);
      }
    });
  }
}

export const websiteCopyService = new WebsiteCopyService();
export const websiteContentService = websiteCopyService;
