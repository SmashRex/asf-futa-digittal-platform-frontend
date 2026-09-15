/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { publicMediaService } from '../services/media/media.service';
import { MediaAsset } from '../types/media';

export function useMediaPlacement(key: string): { asset: MediaAsset | null; loading: boolean } {
  const [asset, setAsset] = useState<MediaAsset | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    publicMediaService.getPlacement(key)
      .then((res) => {
        if (isMounted) {
          setAsset(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAsset(null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [key]);

  return { asset, loading };
}

export function useMediaPlacements(keys: string[]): { placements: Record<string, MediaAsset | null>; loading: boolean } {
  const [placements, setPlacements] = useState<Record<string, MediaAsset | null>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const keysString = keys.join(',');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    if (keys.length === 0) {
      setPlacements({});
      setLoading(false);
      return;
    }

    publicMediaService.getPlacements(keys)
      .then((res) => {
        if (isMounted) {
          setPlacements(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          const fallbackMap: Record<string, MediaAsset | null> = {};
          keys.forEach((k) => { fallbackMap[k] = null; });
          setPlacements(fallbackMap);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [keysString]);

  return { placements, loading };
}
