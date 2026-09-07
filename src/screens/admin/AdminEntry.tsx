/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { isAuthorizedAdminRole, getAuthorityScopeForRole } from '../../types/adminTypes';
import { ShieldCheck, Loader2 } from 'lucide-react';

export const AdminEntry: React.FC = () => {
  const navigate = useNavigate();
  const { activeRole } = useOutletContext<AdminContextType>();

  useEffect(() => {
    // Automatically verify administrative authority and route to authorized workspace
    if (isAuthorizedAdminRole(activeRole)) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/home', { replace: true });
    }
  }, [activeRole, navigate]);

  const authorityScope = getAuthorityScopeForRole(activeRole);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 max-w-md w-full shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#5B0617]/10 text-[#5B0617] mx-auto flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#52525B]">
            AUTOMATED AUTHORITY RESOLUTION
          </span>
          <h2 className="text-lg font-serif font-bold text-[#18181B]">
            Opening {authorityScope.domain}
          </h2>
          <p className="text-xs text-[#52525B]">
            Resolving workspace permissions for <strong className="text-[#5B0617]">{activeRole}</strong>...
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2 text-xs font-semibold text-[#5B0617]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Redirecting to authorized workspace...</span>
        </div>
      </div>
    </div>
  );
};

