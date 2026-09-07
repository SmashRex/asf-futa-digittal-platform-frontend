/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminContextType } from '../../screens/admin/AdminLayout';
import { PermissionKey } from '../../types/adminTypes';
import { AdminAccessDenied } from '../../screens/admin/AdminAccessDenied';

interface AdminRouteGuardProps {
  requiredPermission?: PermissionKey;
  children: React.ReactNode;
  moduleName?: string;
  requiredScope?: string;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  requiredPermission,
  children,
  moduleName,
  requiredScope
}) => {
  const { activeRole, hasPermission } = useOutletContext<AdminContextType>();

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <AdminAccessDenied 
        activeRole={activeRole} 
        moduleName={moduleName} 
        requiredScope={requiredScope} 
      />
    );
  }

  return <>{children}</>;
};
