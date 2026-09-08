/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserProfile } from '../types';
import { Permission, hasPermission } from '../auth/permissions';
import { ROUTES } from '../config/routes.config';

interface RouteGuardProps {
  currentUser: UserProfile | null;
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiresAuth?: boolean;
  isAuthLoading?: boolean;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  currentUser,
  children,
  requiredPermission,
  requiresAuth = true,
  isAuthLoading = false,
}) => {
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (requiresAuth && !currentUser) {
    return <Navigate to={ROUTES.PUBLIC_HOME} state={{ from: location }} replace />;
  }

  if (requiredPermission && currentUser && !hasPermission(currentUser.roles, requiredPermission)) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-12 card-surface">
        <h2 className="text-xl font-bold text-rose-700 mb-2">Access Restricted</h2>
        <p className="text-xs text-[var(--color-text-secondary)] mb-4">
          Your active assigned roles ({currentUser.roles?.join(', ') || 'None'}) do not have permission for this section.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
