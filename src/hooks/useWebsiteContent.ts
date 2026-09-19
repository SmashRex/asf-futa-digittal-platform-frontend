/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { websiteContentService } from '../services/websiteContent.service';
import { WebsiteCopyModel, WebsiteConfiguration, DynamicWebsiteSection } from '../types/websiteCopy';

/**
 * Hook to retrieve the published website copy (backward-compatible).
 */
export function useWebsiteContent(): WebsiteCopyModel {
  const [copy, setCopy] = useState<WebsiteCopyModel>(() => websiteContentService.getCopy());

  useEffect(() => {
    websiteContentService.fetchPublishedConfig()
      .then(config => setCopy(config.copy))
      .catch(err => console.warn('[useWebsiteContent] Failed to fetch published copy:', err));

    const unsubscribe = websiteContentService.subscribe(() => {
      setCopy(websiteContentService.getCopy());
    });
    return unsubscribe;
  }, []);

  return copy;
}

/**
 * Hook to retrieve the full published website configuration,
 * including ordered sections and copy for the public landing page.
 */
export function useWebsiteConfiguration(): {
  config: WebsiteConfiguration;
  sections: DynamicWebsiteSection[];
  copy: WebsiteCopyModel;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [config, setConfig] = useState<WebsiteConfiguration>(() => websiteContentService.getPublishedConfig());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await websiteContentService.fetchPublishedConfig();
      setConfig(data);
    } catch (err: any) {
      console.warn('[useWebsiteConfiguration] Failed to fetch published config:', err);
      setError(err?.message || 'Failed to load website configuration');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();

    const unsubscribe = websiteContentService.subscribe(() => {
      setConfig(websiteContentService.getPublishedConfig());
    });
    return unsubscribe;
  }, []);

  // Return visible sections sorted by order
  const sortedSections = [...(config.sections || [])]
    .filter(s => s.isVisible)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return {
    config,
    sections: sortedSections,
    copy: config.copy,
    isLoading,
    error,
    refresh: fetchConfig
  };
}

/**
 * Hook to retrieve the current working CMS draft configuration for editors.
 */
export function useWebsiteDraftConfiguration(): {
  draft: WebsiteConfiguration;
  sections: DynamicWebsiteSection[];
  isLoading: boolean;
  error: string | null;
  refreshDraft: () => Promise<void>;
} {
  const [draft, setDraft] = useState<WebsiteConfiguration>(() => websiteContentService.getDraftConfig());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDraft = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await websiteContentService.fetchDraftConfig();
      setDraft(data);
    } catch (err: any) {
      console.warn('[useWebsiteDraftConfiguration] Failed to fetch draft config:', err);
      setError(err?.message || 'Failed to load website draft');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDraft();

    const unsubscribe = websiteContentService.subscribe(() => {
      setDraft(websiteContentService.getDraftConfig());
    });
    return unsubscribe;
  }, []);

  const sortedSections = [...(draft.sections || [])]
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return {
    draft,
    sections: sortedSections,
    isLoading,
    error,
    refreshDraft: fetchDraft
  };
}

export { useWebsiteContent as useWebsiteCopy };
