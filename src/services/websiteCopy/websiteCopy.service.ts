/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  WebsiteCopyModel, 
  DynamicWebsiteSection, 
  WebsiteConfiguration,
  ControlledSectionType,
  CORE_SECTION_KEYS,
  CoreSectionKey
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
    sectionKey: 'sec-hero',
    isCore: true,
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
    sectionKey: 'sec-about',
    isCore: true,
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
    sectionKey: 'sec-schedule',
    isCore: true,
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
    sectionKey: 'sec-life',
    isCore: true,
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
    sectionKey: 'sec-visit',
    isCore: true,
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
    sectionKey: 'sec-cta',
    isCore: true,
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

/**
 * Normalizes backend response or storage object into a strongly typed WebsiteConfiguration.
 */
function normalizeWebsiteConfiguration(data: any): WebsiteConfiguration {
  if (!data) return { ...INITIAL_WEBSITE_CONFIG };

  const raw = data.data || data;
  const rawCopy = raw.copy || raw;

  const mergedCopy: WebsiteCopyModel = {
    hero: { ...DEFAULT_WEBSITE_COPY.hero, ...(rawCopy.hero || {}) },
    about: { ...DEFAULT_WEBSITE_COPY.about, ...(rawCopy.about || {}) },
    life: { ...DEFAULT_WEBSITE_COPY.life, ...(rawCopy.life || {}) },
    visit: { ...DEFAULT_WEBSITE_COPY.visit, ...(rawCopy.visit || {}) },
    cta: { ...DEFAULT_WEBSITE_COPY.cta, ...(rawCopy.cta || {}) },
    lastUpdated: rawCopy.lastUpdated || raw.lastUpdated || new Date().toISOString(),
    updatedBy: rawCopy.updatedBy || raw.updatedBy || 'Publicity Coordinator',
    version: raw.version || rawCopy.version || 1
  };

  const rawSections: any[] = Array.isArray(raw.sections) ? raw.sections : DEFAULT_WEBSITE_SECTIONS;
  const normalizedSections: DynamicWebsiteSection[] = rawSections.map((s, index) => {
    const key = s.sectionKey || s.id || `sec-${index}`;
    const isCore = s.isCore ?? CORE_SECTION_KEYS.includes(key as CoreSectionKey);
    return {
      id: s.id || key,
      sectionKey: key,
      isCore,
      type: s.type || 'text_image',
      title: s.title || 'Untitled Section',
      subtitle: s.subtitle,
      description: s.description,
      imageUrl: s.imageUrl,
      items: Array.isArray(s.items) ? s.items : undefined,
      configuration: s.configuration || s.config || {},
      order: typeof s.order === 'number' ? s.order : index + 1,
      status: s.status || raw.status || 'published',
      isVisible: typeof s.isVisible === 'boolean' ? s.isVisible : true,
      createdAt: s.createdAt || new Date().toISOString(),
      updatedAt: s.updatedAt || new Date().toISOString(),
      updatedBy: s.updatedBy || raw.updatedBy
    };
  });

  // Ensure all 6 core sections exist in the sections list
  const ensuredSections = ensureAllCoreSections(normalizedSections);

  return {
    id: raw.id || 'asf-website-config',
    version: raw.version || 1,
    status: raw.status || 'published',
    copy: mergedCopy,
    sections: ensuredSections,
    lastUpdated: raw.lastUpdated || mergedCopy.lastUpdated,
    updatedBy: raw.updatedBy || mergedCopy.updatedBy,
    publishedAt: raw.publishedAt
  };
}

/**
 * Ensures all 6 required core sections are present in the list.
 */
function ensureAllCoreSections(sections: DynamicWebsiteSection[]): DynamicWebsiteSection[] {
  const result = [...sections];
  
  CORE_SECTION_KEYS.forEach((coreKey, idx) => {
    const exists = result.some(s => s.sectionKey === coreKey || s.id === coreKey);
    if (!exists) {
      const defaultSec = DEFAULT_WEBSITE_SECTIONS.find(s => s.id === coreKey || s.sectionKey === coreKey);
      if (defaultSec) {
        result.push({
          ...defaultSec,
          order: result.length + 1
        });
      }
    }
  });

  return result;
}

class WebsiteCopyService {
  private publishedCacheKey = 'asf_website_config_published';
  private draftCacheKey = 'asf_website_config_draft';
  private legacyCopyCacheKey = 'asf_website_copy';
  private listeners: Set<() => void> = new Set();

  /**
   * Fetch authoritative published website configuration for the public website.
   * In live mode, makes GET /api/content/website.
   */
  public async fetchPublishedConfig(): Promise<WebsiteConfiguration> {
    if (!APP_CONFIG.features.useMockServices) {
      const res = await apiClient.get<any>('/api/content/website');
      const normalized = normalizeWebsiteConfiguration(res.data);
      try {
        localStorage.setItem(this.publishedCacheKey, JSON.stringify(normalized));
      } catch (err) {
        console.warn('[WebsiteCopyService] Local cache save failed:', err);
      }
      this.notifyListeners();
      return normalized;
    }

    return this.getPublishedConfig();
  }

  /**
   * Synchronous getter for published config (reads cache or defaults).
   */
  public getPublishedConfig(): WebsiteConfiguration {
    try {
      const saved = localStorage.getItem(this.publishedCacheKey);
      if (saved) {
        return normalizeWebsiteConfiguration(JSON.parse(saved));
      }
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
   * In live mode, makes GET /api/content/website/draft.
   */
  public async fetchDraftConfig(): Promise<WebsiteConfiguration> {
    if (!APP_CONFIG.features.useMockServices) {
      const res = await apiClient.get<any>('/api/content/website/draft');
      const normalized = normalizeWebsiteConfiguration(res.data);
      try {
        localStorage.setItem(this.draftCacheKey, JSON.stringify(normalized));
      } catch (err) {
        console.warn('[WebsiteCopyService] Local draft cache save failed:', err);
      }
      this.notifyListeners();
      return normalized;
    }

    return this.getDraftConfig();
  }

  /**
   * Synchronous getter for draft config (reads cache or falls back to published).
   */
  public getDraftConfig(): WebsiteConfiguration {
    try {
      const savedDraft = localStorage.getItem(this.draftCacheKey);
      if (savedDraft) {
        return normalizeWebsiteConfiguration(JSON.parse(savedDraft));
      }
    } catch (e) {
      console.error('[WebsiteCopyService] Failed to load draft configuration:', e);
    }
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
   * In live mode, sends POST /api/content/website/draft.
   * Preserves all six core sections in the sections array.
   */
  public async saveDraft(
    draftUpdates: Partial<WebsiteConfiguration>,
    authorName: string = 'Publicity Coordinator'
  ): Promise<WebsiteConfiguration> {
    const currentDraft = this.getDraftConfig();
    const fullCopy: WebsiteCopyModel = {
      ...currentDraft.copy,
      ...(draftUpdates.copy || {}),
      hero: { ...currentDraft.copy.hero, ...(draftUpdates.copy?.hero || {}) },
      about: { ...currentDraft.copy.about, ...(draftUpdates.copy?.about || {}) },
      life: { ...currentDraft.copy.life, ...(draftUpdates.copy?.life || {}) },
      visit: { ...currentDraft.copy.visit, ...(draftUpdates.copy?.visit || {}) },
      cta: { ...currentDraft.copy.cta, ...(draftUpdates.copy?.cta || {}) }
    };

    const candidateSections = draftUpdates.sections || currentDraft.sections;
    const fullSections = ensureAllCoreSections(candidateSections);

    const updatedDraft: WebsiteConfiguration = {
      ...currentDraft,
      ...draftUpdates,
      copy: fullCopy,
      sections: fullSections,
      status: 'draft',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      updatedBy: authorName
    };

    if (!APP_CONFIG.features.useMockServices) {
      const payload = {
        copy: fullCopy,
        sections: fullSections.map((s, idx) => ({
          id: s.id,
          sectionKey: s.sectionKey || s.id,
          type: s.type,
          title: s.title,
          isCore: s.isCore ?? CORE_SECTION_KEYS.includes((s.sectionKey || s.id) as CoreSectionKey),
          order: typeof s.order === 'number' ? s.order : idx + 1,
          isVisible: Boolean(s.isVisible),
          subtitle: s.subtitle,
          description: s.description,
          imageUrl: s.imageUrl,
          items: s.items,
          configuration: s.configuration
        }))
      };

      const res = await apiClient.post<any>('/api/content/website/draft', payload);
      const normalized = normalizeWebsiteConfiguration(res.data);
      try {
        localStorage.setItem(this.draftCacheKey, JSON.stringify(normalized));
      } catch (err) {
        console.warn('[WebsiteCopyService] Local draft save failed:', err);
      }
      this.notifyListeners();
      return normalized;
    }

    localStorage.setItem(this.draftCacheKey, JSON.stringify(updatedDraft));
    this.notifyListeners();
    return updatedDraft;
  }

  /**
   * Publish the current draft to the live public website.
   * In live mode, sends POST /api/content/website/publish (no body).
   */
  public async publishDraft(authorName: string = 'Publicity Coordinator'): Promise<WebsiteConfiguration> {
    if (!APP_CONFIG.features.useMockServices) {
      const res = await apiClient.post<any>('/api/content/website/publish');
      const normalized = normalizeWebsiteConfiguration(res.data);
      try {
        localStorage.setItem(this.publishedCacheKey, JSON.stringify(normalized));
        localStorage.setItem(this.draftCacheKey, JSON.stringify(normalized));
      } catch (err) {
        console.warn('[WebsiteCopyService] Local storage update failed:', err);
      }
      this.notifyListeners();
      return normalized;
    }

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

    localStorage.setItem(this.publishedCacheKey, JSON.stringify(newPublished));
    localStorage.setItem(this.draftCacheKey, JSON.stringify(newPublished));
    localStorage.setItem(this.legacyCopyCacheKey, JSON.stringify(newPublished.copy));
    this.notifyListeners();
    return newPublished;
  }

  /**
   * Discard uncommitted draft changes and restore the live published state into the draft.
   * In live mode, sends POST /api/content/website/draft/discard (no body) then reloads draft.
   */
  public async discardDraft(): Promise<WebsiteConfiguration> {
    if (!APP_CONFIG.features.useMockServices) {
      await apiClient.post<any>('/api/content/website/draft/discard');
      return await this.fetchDraftConfig();
    }

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
   * Reset website copy and sections back to pristine system defaults.
   * In live mode, sends POST /api/content/website/reset (no body) then reloads draft.
   * NOTE: Reset does NOT publish! It only resets the draft.
   */
  public async resetCopy(authorName: string = 'System Admin'): Promise<WebsiteConfiguration> {
    if (!APP_CONFIG.features.useMockServices) {
      await apiClient.post<any>('/api/content/website/reset');
      return await this.fetchDraftConfig();
    }

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
    return resetConfig;
  }

  /**
   * Add a new controlled section to the website draft.
   */
  public async addSection(
    sectionData: Omit<DynamicWebsiteSection, 'id' | 'createdAt' | 'updatedAt' | 'order' | 'status'>,
    authorName: string = 'Publicity Coordinator'
  ): Promise<DynamicWebsiteSection> {
    const draft = this.getDraftConfig();
    const maxOrder = draft.sections.reduce((max, s) => Math.max(max, s.order || 0), 0);

    const newSection: DynamicWebsiteSection = {
      id: `sec-custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      sectionKey: `sec-custom-${Date.now()}`,
      isCore: false,
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
    const idx = draft.sections.findIndex(s => s.id === sectionId || s.sectionKey === sectionId);
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
   * Reorder sections in the draft.
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

    let nextOrder = reordered.length + 1;
    sectionMap.forEach(sec => {
      reordered.push({ ...sec, order: nextOrder++ });
    });

    const ensured = ensureAllCoreSections(reordered);
    await this.saveDraft({ sections: ensured }, authorName);
    return ensured;
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
   * Core sections cannot be deleted, only hidden.
   */
  public async deleteSection(
    sectionId: string,
    authorName: string = 'Publicity Coordinator'
  ): Promise<boolean> {
    const draft = this.getDraftConfig();
    const isCoreSection = CORE_SECTION_KEYS.includes(sectionId as CoreSectionKey) ||
      draft.sections.find(s => s.id === sectionId && s.isCore);

    if (isCoreSection) {
      await this.toggleSectionVisibility(sectionId, false, authorName);
      return true;
    }

    const updatedSections = draft.sections.filter(s => s.id !== sectionId && s.sectionKey !== sectionId);
    const ensured = ensureAllCoreSections(updatedSections);
    await this.saveDraft({ sections: ensured }, authorName);
    return true;
  }

  /**
   * Legacy method for saving copy directly.
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
