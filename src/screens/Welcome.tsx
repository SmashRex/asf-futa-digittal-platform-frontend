/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { LogIn, UserPlus, BookOpen } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto" id="welcome-screen">
      {/* Visual Identity Brand Seal */}
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo size="lg" theme="maroon" />
        <h1 className="mt-6 text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Anglican Students' Fellowship
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1 font-medium tracking-wide uppercase">
          FUTA Branch
        </p>
        <div className="w-12 h-1 bg-[var(--color-primary)] rounded-full mt-4"></div>
      </div>

      {/* Greeting & Slogan */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--color-primary)] mb-3">
          Arise, Shine!
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
          Welcome to your digital fellowship home. Access outlines, hymns, scripture, communications, and member services in one unified platform.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-4">
        <button 
          onClick={() => navigate('/sign-in')}
          className="btn-primary w-full flex items-center justify-center gap-2"
          id="welcome-login-btn"
        >
          <LogIn className="w-5 h-5" />
          <span>Sign In to Portal</span>
        </button>

        <button 
          onClick={() => navigate('/register')}
          className="btn-secondary w-full flex items-center justify-center gap-2"
          id="welcome-signup-btn"
        >
          <UserPlus className="w-5 h-5" />
          <span>Create Account</span>
        </button>
      </div>

      {/* Public Facing Footer */}
      <div className="mt-12 text-center text-xs text-[var(--color-text-light)] flex items-center gap-1.5 justify-center">
        <BookOpen className="w-3.5 h-3.5" />
        <span>"For the glory of the Lord is risen upon thee."</span>
      </div>
    </div>
  );
}
