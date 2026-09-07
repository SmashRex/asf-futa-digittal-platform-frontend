/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
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
  const hasExecutedRef = useRef(false);

  // Get sign up or login state details passed from SignIn/CheckEmail
  const stateData = location.state || {};
  const email = stateData.email || 'member@asf-futa.org';
  const name = stateData.name || 'Temiloluwa Afolabi';
  const department = stateData.department || 'Computer Science';
  const level = stateData.level || '400 Level';
  const subgroup = stateData.subgroup || 'Technical Team';

  useEffect(() => {
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    // Async authentication sequence
    let isMounted = true;

    const runAuthSequence = async () => {
      // Stage 1: token validation
      if (isMounted) setStatusText('Validating security credentials...');
      
      await new Promise(r => setTimeout(r, 600));

      // Stage 2: Service authentication call
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token') || undefined;

      const { user } = await authService.verifyMagicLinkToken({
        email,
        token,
      });

      if (!isMounted) return;

      setStatusText('Authentication successful!');
      setIsDone(true);
      
      // Update application auth state
      onLoginSuccess(user);

      // Stage 3: Immediate clean navigation to home
      setTimeout(() => {
        if (isMounted) {
          navigate('/home', { replace: true });
        }
      }, 800);
    };

    runAuthSequence();

    return () => {
      isMounted = false;
    };
  }, [email, name, department, level, subgroup, onLoginSuccess, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto text-center" id="welcome-back-screen">
      <div className="mb-6">
        <Logo size="lg" theme="maroon" />
      </div>

      <div className="space-y-4">
        {/* Animated Visual Loader */}
        <div className="flex justify-center h-16 items-center">
          {isDone ? (
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

        {/* Dynamic Titles */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
            {isDone ? 'Welcome Back!' : 'Please Wait'}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1 select-none">
            {statusText}
          </p>
        </div>

        {/* Spiritual encouragement quote */}
        <div className="pt-8 opacity-60 text-xs text-[var(--color-text-secondary)] flex flex-col items-center gap-1 leading-relaxed">
          <Heart className="w-3.5 h-3.5 text-[var(--color-primary)] animate-pulse" />
          <span>"Behold, how good and how pleasant it is for</span>
          <span>brethren to dwell together in unity!"</span>
        </div>
      </div>
    </div>
  );
}
