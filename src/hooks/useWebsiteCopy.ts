/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { websiteCopyService } from '../services/websiteCopy/websiteCopy.service';
import { WebsiteCopyModel } from '../types/websiteCopy';

export function useWebsiteCopy(): WebsiteCopyModel {
  const [copy, setCopy] = useState<WebsiteCopyModel>(() => websiteCopyService.getCopy());

  useEffect(() => {
    // Subscribe to updates so public/admin sections update instantly on change
    const unsubscribe = websiteCopyService.subscribe(() => {
      setCopy(websiteCopyService.getCopy());
    });
    return unsubscribe;
  }, []);

  return copy;
}
