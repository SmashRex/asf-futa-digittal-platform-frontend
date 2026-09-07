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
} {
  const [config, setConfig] = useState<WebsiteConfiguration>(() => websiteContentService.getPublishedConfig());

  useEffect(() => {
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
    copy: config.copy
  };
}

/**
 * Hook to retrieve the current working CMS draft configuration for editors.
 */
export function useWebsiteDraftConfiguration(): {
  draft: WebsiteConfiguration;
  sections: DynamicWebsiteSection[];
  refreshDraft: () => void;
} {
  const [draft, setDraft] = useState<WebsiteConfiguration>(() => websiteContentService.getDraftConfig());

  const refreshDraft = () => {
    setDraft(websiteContentService.getDraftConfig());
  };

  useEffect(() => {
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
    refreshDraft
  };
}

export { useWebsiteContent as useWebsiteCopy };
