/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { UserRole } from '../../types';

export interface DevState {
  isOfflineSimulated: boolean;
  isRestrictedSimulated: boolean;
  isEmptyStateSimulated: boolean;
  simulatedRoleOverride: UserRole | null;
  isDevDrawerOpen: boolean;
}

const STORAGE_KEY = 'asf_dev_state';

const initialDevState: DevState = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      isOfflineSimulated: false,
      isRestrictedSimulated: false,
      isEmptyStateSimulated: false,
      simulatedRoleOverride: null,
      isDevDrawerOpen: false,
    };
  } catch {
    return {
      isOfflineSimulated: false,
      isRestrictedSimulated: false,
      isEmptyStateSimulated: false,
      simulatedRoleOverride: null,
      isDevDrawerOpen: false,
    };
  }
})();

let currentDevState: DevState = initialDevState;
const listeners = new Set<(state: DevState) => void>();

function notify() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentDevState));
  } catch {
    // ignore
  }
  listeners.forEach(fn => fn(currentDevState));
}

export const devStateStore = {
  getState: (): DevState => currentDevState,

  setState: (partial: Partial<DevState>) => {
    currentDevState = { ...currentDevState, ...partial };
    notify();
  },

  toggleOffline: () => {
    devStateStore.setState({ isOfflineSimulated: !currentDevState.isOfflineSimulated });
  },

  toggleRestricted: () => {
    devStateStore.setState({ isRestrictedSimulated: !currentDevState.isRestrictedSimulated });
  },

  toggleEmptyState: () => {
    devStateStore.setState({ isEmptyStateSimulated: !currentDevState.isEmptyStateSimulated });
  },

  setSimulatedRole: (role: UserRole | null) => {
    devStateStore.setState({ simulatedRoleOverride: role });
  },

  toggleDevDrawer: () => {
    devStateStore.setState({ isDevDrawerOpen: !currentDevState.isDevDrawerOpen });
  },

  subscribe: (fn: (state: DevState) => void) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }
};

export function useDevState(): DevState {
  const [state, setState] = useState<DevState>(devStateStore.getState());

  useEffect(() => {
    return devStateStore.subscribe(setState);
  }, []);

  return state;
}
