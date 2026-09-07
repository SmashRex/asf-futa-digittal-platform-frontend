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
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  currentUser,
  children,
  requiredPermission,
  requiresAuth = true,
}) => {
  const location = useLocation();

  if (requiresAuth && !currentUser) {
    return <Navigate to={ROUTES.PUBLIC_HOME} state={{ from: location }} replace />;
  }

  if (requiredPermission && currentUser && !hasPermission(currentUser.role, requiredPermission)) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-12 card-surface">
        <h2 className="text-xl font-bold text-rose-700 mb-2">Access Restricted</h2>
        <p className="text-xs text-[var(--color-text-secondary)] mb-4">
          Your active role ({currentUser.role}) does not have permission for this section.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
