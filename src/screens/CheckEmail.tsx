/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Mail, ArrowLeft, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';

export default function CheckEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get email from router state (fallback if none provided directly)
  const stateData = location.state || {};
  const email = stateData.email || 'brother@asf-futa.org';

  const handleSimulateClick = () => {
    // Route to canonical /auth/verify state with a mock verification token
    const mockToken = `simulated_magic_token_${Date.now()}`;
    navigate(`/auth/verify?token=${mockToken}&email=${encodeURIComponent(email)}`, { 
      state: { ...stateData, token: mockToken, email } 
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-md mx-auto w-full" id="check-email-screen">
      {/* Back button */}
      <button 
        onClick={() => navigate('/sign-in')}
        className="self-start flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-6"
        id="check-email-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Login</span>
      </button>

      <div className="flex flex-col items-center text-center mb-8">
        <Logo size="sm" theme="maroon" />
        <h2 className="mt-4 text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
          Check Your Inbox
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          We have dispatched your passwordless login link
        </p>
      </div>

      <div className="card-surface-raised text-center p-6 space-y-6">
        {/* Dispatched Icon indicator */}
        <div className="relative mx-auto w-20 h-20 bg-[var(--color-primary-tint)] rounded-full flex items-center justify-center text-[var(--color-primary)]">
          <Mail className="w-10 h-10 animate-pulse" />
          <span className="absolute top-1 right-1 bg-[var(--color-accent)] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </span>
        </div>

        {/* Dynamic target email */}
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            A magic link was successfully dispatched to:
          </p>
          <p className="text-base font-semibold text-[var(--color-text-primary)] mt-1.5 break-all">
            {email}
          </p>
        </div>

        {/* Real-world offline hint */}
        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[var(--color-border)] text-left text-xs text-[var(--color-text-secondary)] leading-relaxed space-y-1.5">
          <p className="font-semibold text-[var(--color-text-primary)]">What to do next:</p>
          <p>1. Open your mail client app on this or another device.</p>
          <p>2. Tap the confirmation link button in the email from Anglican Students' Fellowship FUTA.</p>
          <p>3. You will be authenticated instantly on this platform.</p>
        </div>

        {/* Demo simulator panel */}
        <div className="border-t border-dashed border-[var(--color-border)] pt-5">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left mb-4">
            <p className="text-[11px] font-bold tracking-wide uppercase text-amber-800 flex items-center gap-1">
              <span>Demo Simulation Panel</span>
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Because this is a frontend-only mock environment, tap the button below to simulate opening the email and clicking the magic authorization link.
            </p>
          </div>

          <button
            onClick={handleSimulateClick}
            className="btn-primary w-full flex items-center justify-center gap-2"
            id="simulate-magic-link-btn"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Simulate Mail Link Click</span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button 
          onClick={() => navigate('/sign-in')}
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] flex items-center gap-1.5 justify-center mx-auto transition-colors font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Resend magic link</span>
        </button>
      </div>
    </div>
  );
}
