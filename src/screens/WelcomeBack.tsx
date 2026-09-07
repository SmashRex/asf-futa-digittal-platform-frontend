/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { CheckCircle2, ShieldCheck, Heart, AlertCircle, RefreshCw } from 'lucide-react';
import { authService } from '../services/auth/auth.service';
import { UserProfile } from '../types';

interface WelcomeBackProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function WelcomeBack({ onLoginSuccess }: WelcomeBackProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState('Verifying digital token...');
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasExecutedRef = useRef(false);

  // Extract query params and router state
  const stateData = location.state || {};
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token') || stateData.token || undefined;
  const email = stateData.email || queryParams.get('email') || 'member@asf-futa.org';

  useEffect(() => {
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    let isSubscribed = true;

    const runAuthSequence = async () => {
      try {
        if (isSubscribed) {
          setStatusText('Validating security credentials...');
          setError(null);
        }

        // Stage 1: Brief artificial delay for visual smoothness
        await new Promise(r => setTimeout(r, 400));

        // Stage 2: Service authentication call
        const response = await authService.verifyMagicLinkToken({
          email,
          token,
        });

        const authenticatedUser = response.user;

        // Overlay state fields if user customized them during sign-up/sign-in
        if (stateData.name) authenticatedUser.name = stateData.name;
        if (stateData.department) authenticatedUser.department = stateData.department;
        if (stateData.level) authenticatedUser.level = stateData.level;
        if (stateData.subgroup) authenticatedUser.subgroup = stateData.subgroup;

        if (!isSubscribed) return;

        setStatusText('Authentication successful!');
        setIsDone(true);

        // Update application global auth state
        onLoginSuccess(authenticatedUser);

        // Stage 3: Immediate clean navigation to home
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 600);
      } catch (err: any) {
        if (isSubscribed) {
          setIsDone(false);
          setError(err.message || 'Token verification failed. Please request a new magic link.');
          setStatusText('Verification Failed');
        }
      }
    };

    runAuthSequence();

    return () => {
      isSubscribed = false;
    };
  }, []); // Run once on mount

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto text-center" id="welcome-back-screen">
      <div className="mb-6">
        <Logo size="lg" theme="maroon" />
      </div>

      <div className="space-y-4 w-full">
        {/* Animated Visual Status Indicator */}
        <div className="flex justify-center h-16 items-center">
          {error ? (
            <div className="bg-red-50 text-red-600 p-3 rounded-full border border-red-200">
              <AlertCircle className="w-10 h-10" />
            </div>
          ) : isDone ? (
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full border border-emerald-200 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
              <ShieldCheck className="w-5 h-5 text-[var(--color-primary)] absolute" />
            </div>
          )}
        </div>

        {/* Dynamic Titles & Status */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
            {error ? 'Authentication Failed' : isDone ? 'Welcome Back!' : 'Please Wait'}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1 select-none">
            {statusText}
          </p>
        </div>

        {/* Error Details & Recovery Actions */}
        {error && (
          <div className="card-surface p-4 mt-4 space-y-4 text-left border border-red-200 bg-red-50/50 rounded-xl" id="auth-error-card">
            <p className="text-xs text-red-800 leading-relaxed font-medium">
              {error}
            </p>
            <button
              onClick={() => navigate('/sign-in', { replace: true })}
              className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5"
              id="return-to-signin-btn"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Request New Magic Link</span>
            </button>
          </div>
        )}

        {/* Spiritual encouragement quote */}
        {!error && (
          <div className="pt-8 opacity-60 text-xs text-[var(--color-text-secondary)] flex flex-col items-center gap-1 leading-relaxed">
            <Heart className="w-3.5 h-3.5 text-[var(--color-primary)] animate-pulse" />
            <span>"Behold, how good and how pleasant it is for</span>
            <span>brethren to dwell together in unity!"</span>
          </div>
        )}
      </div>
    </div>
  );
}
