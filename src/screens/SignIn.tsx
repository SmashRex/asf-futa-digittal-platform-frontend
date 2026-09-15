/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Mail, ArrowLeft, ChevronRight, Lock, Eye, EyeOff, HelpCircle, Sparkles } from 'lucide-react';
import Input from '../components/common/Input';
import { authService } from '../services/auth/auth.service';
import { UserProfile } from '../types';

interface SignInProps {
  onLoginSuccess?: (user: UserProfile) => void;
}

export default function SignIn({ onLoginSuccess }: SignInProps) {
  const navigate = useNavigate();

  // Mode: 'password' (primary) | 'magic-link' (secondary)
  const [authMode, setAuthMode] = useState<'password' | 'magic-link'>('password');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation & Loading State
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
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

    if (authMode === 'password') {
      if (!password) {
        setError('Please enter your password.');
        return;
      }

      setIsLoading(true);

      try {
        const res = await authService.login({
          email: trimmedEmail,
          password: password,
        });

        if (res.user) {
          if (onLoginSuccess) {
            onLoginSuccess(res.user);
          }
          navigate('/home');
        }
      } catch (err: any) {
        if (err.statusCode === 429 || err.code === 'TOO_MANY_REQUESTS') {
          setError('Too many attempts. Please wait a while before trying again.');
        } else if (err.code === 'INVALID_CREDENTIALS') {
          setError('Incorrect email or password.');
        } else if (err.code === 'PERMISSION_DENIED') {
          setError('Access denied. Your account does not have permission to sign in.');
        } else if (err.code === 'MEMBER_NOT_FOUND') {
          setError('No account found for this email address.');
        } else if (err.code === 'NO_ACTIVE_SESSION') {
          setError('Session could not be established. Please try again.');
        } else {
          setError(err.message || 'Incorrect email or password.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Secondary Magic Link Flow
      setIsLoading(true);

      try {
        await authService.requestMagicLink({ email: trimmedEmail });
        navigate('/check-email', { 
          state: { email: trimmedEmail } 
        });
      } catch (err: any) {
        if (err.statusCode === 429 || err.code === 'TOO_MANY_REQUESTS') {
          setError('Too many attempts. Please wait a while before trying again.');
        } else {
          setError(err.message || 'Failed to dispatch magic link. Please check your network or try again.');
        }
      } finally {
        setIsLoading(false);
      }
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
          {authMode === 'password'
            ? 'Enter your fellowship credentials to access your account'
            : 'Enter your registered email address for a secure magic link'}
        </p>
      </div>

      <div className="card-surface-raised">
        <form onSubmit={handleSubmit} className="space-y-5" id="signin-form">
          {/* Email input */}
          <Input
            id="signin-email-input"
            label="Email Address"
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

          {/* Password input - only in password mode */}
          {authMode === 'password' && (
            <div className="space-y-1">
              <div className="relative">
                <Input
                  id="signin-password-input"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leadingIcon={Lock}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-[var(--color-text-light)] hover:text-[var(--color-text-primary)] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  id="signin-toggle-password-btn"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot password subtle guidance */}
              <div className="pt-1 text-right">
                <p className="text-xs text-[var(--color-text-secondary)]" id="signin-forgot-password-note">
                  Forgot your password?{' '}
                  <span className="text-[var(--color-text-primary)] font-medium">
                    Contact your fellowship&apos;s Technical Administrator.
                  </span>
                </p>
              </div>
            </div>
          )}

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
                <span>{authMode === 'password' ? 'Signing in...' : 'Requesting link...'}</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 w-full">
                <span>{authMode === 'password' ? 'Sign In' : 'Get Magic Link'}</span>
                <ChevronRight className="w-5 h-5" />
              </span>
            )}
          </button>
        </form>

        {/* Secondary Authentication Switcher */}
        <div className="mt-4 pt-3 text-center border-t border-[var(--color-border)]">
          {authMode === 'password' ? (
            <button
              type="button"
              onClick={() => {
                setAuthMode('magic-link');
                setError('');
              }}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1"
              id="signin-switch-to-magic-link"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Need passwordless access? Sign in with Magic Link</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setError('');
              }}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1"
              id="signin-switch-to-password"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign in with Password instead</span>
            </button>
          )}
        </div>

        {/* Link to Registration */}
        <div className="mt-4 text-center border-t border-[var(--color-border)] pt-4">
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
        <span>Secure authentication powered by ASF FUTA Fellowship Portal.</span>
      </div>
    </div>
  );
}
