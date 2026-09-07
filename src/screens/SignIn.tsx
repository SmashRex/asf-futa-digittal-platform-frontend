/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Mail, ArrowLeft, ChevronRight, HelpCircle, UserPlus } from 'lucide-react';
import Input from '../components/common/Input';
import { authService } from '../services/auth/auth.service';

export default function SignIn() {
  const navigate = useNavigate();

  // Login Email Field
  const [email, setEmail] = useState('');
  
  // Validation & Loading State
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      // Connect to backend magic link service
      await authService.requestMagicLink({ email: trimmedEmail });
      
      // Route to check-email screen with email state
      navigate('/check-email', { 
        state: { email: trimmedEmail } 
      });
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch magic link. Please check your network or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-md mx-auto w-full" id="signin-screen">
      {/* Back to welcome */}
      <button 
        onClick={() => navigate('/')}
        className="self-start flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-6"
        id="signin-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Welcome</span>
      </button>

      <div className="flex flex-col items-center text-center mb-8">
        <Logo size="sm" theme="maroon" />
        <h1 className="mt-4 text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
          Sign In to Portal
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          Enter your registered email address for a secure passwordless magic link
        </p>
      </div>

      <div className="card-surface-raised">
        <form onSubmit={handleSubmit} className="space-y-5" id="signin-form">
          {/* Email input */}
          <Input
            id="signin-email-input"
            label="Registered Email Address"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="e.g. brother@asf-futa.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leadingIcon={Mail}
            disabled={isLoading}
            showClearButton={true}
            onClear={() => setEmail('')}
          />

          {/* Inline Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-[var(--color-error)] flex items-start gap-2" id="signin-error-msg">
              <span className="font-semibold text-xs mt-0.5 border border-[var(--color-error)] rounded-full w-4 h-4 flex items-center justify-center select-none shrink-0">!</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            disabled={isLoading}
            id="signin-submit-btn"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Requesting magic link...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 w-full">
                <span>Get Magic Link</span>
                <ChevronRight className="w-5 h-5" />
              </span>
            )}
          </button>
        </form>

        {/* Link to Registration */}
        <div className="mt-6 text-center border-t border-[var(--color-border)] pt-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            New to the ASF fellowship platform?{' '}
            <Link
              to="/register"
              className="text-[var(--color-primary)] font-semibold hover:underline inline-flex items-center gap-1 ml-1"
              id="signin-to-register-link"
            >
              <span>Create Account</span>
            </Link>
          </p>
        </div>
      </div>

      {/* Info helper text */}
      <div className="mt-8 text-center text-xs text-[var(--color-text-secondary)] flex items-center gap-2 justify-center leading-relaxed">
        <HelpCircle className="w-4 h-4 text-[var(--color-text-light)] shrink-0" />
        <span>Passwordless authentication sends a single-use token to verify your identity.</span>
      </div>
    </div>
  );
}
