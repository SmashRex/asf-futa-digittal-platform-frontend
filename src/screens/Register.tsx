/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { User, Mail, Phone, ArrowLeft, ChevronRight, HelpCircle, GraduationCap, Lock, RefreshCw } from 'lucide-react';
import Input from '../components/common/Input';
import { authService } from '../services/auth/auth.service';
import { UserProfile } from '../types';
import { departmentService, Department } from '../services/departments/department.service';

interface RegisterProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function Register({ onLoginSuccess }: RegisterProps) {
  const navigate = useNavigate();

  // Required Account Creation Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [level, setLevel] = useState('100 Level');
  const [programDurationYears, setProgramDurationYears] = useState<4 | 5>(4);

  // Optional Fellowship Profile Fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [subgroup, setSubgroup] = useState('');

  // Canonical departments dynamically fetched from GET /api/departments
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(true);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);

  // Fetch canonical departments from GET /api/departments on mount
  const fetchDepartments = async () => {
    setIsDepartmentsLoading(true);
    setDepartmentsError(null);
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (err: any) {
      console.warn('Canonical departments currently unavailable:', err?.message || err);
      setDepartmentsError('Unable to load departments list.');
    } finally {
      setIsDepartmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Group departments by school if school metadata is present for clean display
  const groupedDepartments = useMemo(() => {
    const hasSchools = departments.some(d => Boolean(d.school));
    if (!hasSchools) return null;

    const groups: Record<string, Department[]> = {};
    const ungrouped: Department[] = [];

    departments.forEach((dept) => {
      if (dept.school && dept.id !== 'other') {
        if (!groups[dept.school]) {
          groups[dept.school] = [];
        }
        groups[dept.school].push(dept);
      } else {
        ungrouped.push(dept);
      }
    });

    return { groups, ungrouped };
  }, [departments]);

  // UI State
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');

    // Field Validation
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!gender) {
      setError('Please select your gender.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!departmentId) {
      setError('Please select your academic department.');
      return;
    }

    setIsLoading(true);

    try {
      // Determine if level is undergraduate
      const isUndergraduate = ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level'].includes(level);
      // Direct registration call creating an active member account (default to 4 for non-undergraduates)
      const effectiveDuration: 4 | 5 = isUndergraduate ? (Number(programDurationYears) === 5 ? 5 : 4) : 4;
      const response = await authService.register({
        name: trimmedName,
        email: trimmedEmail,
        password: password,
        departmentId: departmentId,
        gender: gender,
        level,
        academicLevel: level,
        programDurationYears: effectiveDuration,
        phoneNumber: phoneNumber.trim() || undefined,
        subgroup: subgroup.trim() || undefined,
      });

      if (response.user) {
        // Update application auth state for immediate session
        onLoginSuccess(response.user);
        navigate('/home', { replace: true });
      } else {
        // Production backend dispatches magic link after registration
        navigate('/check-email', { 
          state: { email: trimmedEmail } 
        });
      }
    } catch (err: any) {
      if (err.statusCode === 429 || err.code === 'TOO_MANY_REQUESTS') {
        setError('Too many attempts. Please wait a while before trying again.');
      } else {
        setError(err.message || 'Registration failed. Please verify your details and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-10 max-w-md mx-auto w-full" id="register-screen">
      {/* Back to Welcome */}
      <button 
        onClick={() => navigate('/')}
        className="self-start flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-6"
        id="register-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Welcome</span>
      </button>

      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <Logo size="sm" theme="maroon" />
        <h1 className="mt-3 text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
          Create Member Account
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          Join the Anglican Students' Fellowship digital home
        </p>
      </div>

      <div className="card-surface-raised">
        <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
          
          {/* Required Fields Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Required Account Information
              </span>
            </div>

            {/* Full Name */}
            <Input
              id="register-name-input"
              label="Full Name *"
              type="text"
              autoComplete="name"
              autoCapitalize="words"
              placeholder="e.g. Samuel Adebayo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leadingIcon={User}
              disabled={isLoading}
              showClearButton={true}
              onClear={() => setName('')}
            />

            {/* Email */}
            <Input
              id="register-email-input"
              label="Email Address *"
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

            {/* Gender Selection (Required) */}
            <div className="flex flex-col align-start text-left">
              <label className="input-label mb-1.5 text-sm font-medium text-[var(--color-text-primary)]" htmlFor="register-gender-input">
                Gender *
              </label>
              <select
                id="register-gender-input"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                className="input-box"
                disabled={isLoading}
              >
                <option value="">Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Input
                id="register-password-input"
                label="Password *"
                type="password"
                autoComplete="new-password"
                placeholder="Enter a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leadingIcon={Lock}
                disabled={isLoading}
              />
              <p className="text-[11px] text-[var(--color-text-secondary)] pl-0.5" id="register-password-hint">
                Password must be at least 8 characters long.
              </p>
            </div>

            {/* Department & Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col align-start text-left">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="input-label text-sm font-medium text-[var(--color-text-primary)]" htmlFor="register-dept-input">
                    Department *
                  </label>
                  {departmentsError && (
                    <button
                      type="button"
                      onClick={() => {
                        departmentService.clearCache();
                        fetchDepartments();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] text-[var(--color-primary)] hover:underline"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                  )}
                </div>
                <select
                  id="register-dept-input"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="input-box"
                  disabled={isLoading || isDepartmentsLoading}
                >
                  <option value="">
                    {isDepartmentsLoading ? 'Loading departments...' : 'Select your department'}
                  </option>
                  {groupedDepartments ? (
                    <>
                      {Object.entries(groupedDepartments.groups).map(([school, depts]) => (
                        <optgroup key={school} label={school}>
                          {depts.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      {groupedDepartments.ungrouped.length > 0 ? (
                        <optgroup label="Other / General">
                          {groupedDepartments.ungrouped.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name === 'Other' ? 'Other / Not Listed' : dept.name}
                            </option>
                          ))}
                        </optgroup>
                      ) : !departments.some(d => d.id === 'other') ? (
                        <optgroup label="Other / General">
                          <option value="other">Other / Not Listed</option>
                        </optgroup>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name === 'Other' ? 'Other / Not Listed' : dept.name}
                        </option>
                      ))}
                      {departments.length > 0 && !departments.some(d => d.id === 'other') && (
                        <option value="other">Other / Not Listed</option>
                      )}
                    </>
                  )}
                </select>
                {departmentsError && (
                  <p className="text-[11px] text-red-600 mt-1">
                    {departmentsError} Tap retry to fetch again.
                  </p>
                )}
              </div>

              <div className="flex flex-col align-start text-left">
                <label className="input-label mb-1.5 text-sm font-medium text-[var(--color-text-primary)]" htmlFor="register-level-input">
                  Academic Level *
                </label>
                <select
                  id="register-level-input"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="input-box"
                  disabled={isLoading}
                >
                  <option value="100 Level">100 Level</option>
                  <option value="200 Level">200 Level</option>
                  <option value="300 Level">300 Level</option>
                  <option value="400 Level">400 Level</option>
                  <option value="500 Level">500 Level</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
            </div>

            {/* Undergraduate Program Duration (4 or 5 years) */}
            {['100 Level', '200 Level', '300 Level', '400 Level', '500 Level'].includes(level) && (
              <div className="flex flex-col align-start text-left">
                <label className="input-label mb-1.5 text-sm font-medium text-[var(--color-text-primary)]" htmlFor="register-duration-input">
                  Program Duration *
                </label>
                <select
                  id="register-duration-input"
                  value={programDurationYears}
                  onChange={(e) => setProgramDurationYears(Number(e.target.value) as 4 | 5)}
                  className="input-box"
                  disabled={isLoading}
                >
                  <option value={4}>4 years</option>
                  <option value={5}>5 years</option>
                </select>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">
                  Select the standard duration of your undergraduate programme.
                </p>
              </div>
            )}
          </div>

          {/* Optional Profile Information Section */}
          <div className="space-y-4 pt-3 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Optional Profile Information
              </span>
            </div>

            {/* Phone Number */}
            <Input
              id="register-phone-input"
              label="Phone Number (Optional)"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="e.g. 08012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              leadingIcon={Phone}
              disabled={isLoading}
              showClearButton={true}
              onClear={() => setPhoneNumber('')}
            />

            {/* Fellowship Subgroup */}
            <Input
              id="register-subgroup-input"
              label="Fellowship Subgroup (Optional)"
              type="text"
              placeholder="e.g. Choir, Technical, Ushering, Prayer"
              value={subgroup}
              onChange={(e) => setSubgroup(e.target.value)}
              disabled={isLoading}
              showClearButton={true}
              onClear={() => setSubgroup('')}
            />
          </div>

          {/* Inline Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-[var(--color-error)] flex items-start gap-2" id="register-error-msg">
              <span className="font-semibold text-xs mt-0.5 border border-[var(--color-error)] rounded-full w-4 h-4 flex items-center justify-center select-none shrink-0">!</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
            disabled={isLoading}
            id="register-submit-btn"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating active account...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 w-full">
                <span>Create Active Account</span>
                <ChevronRight className="w-5 h-5" />
              </span>
            )}
          </button>
        </form>

        {/* Link to Sign In */}
        <div className="mt-6 text-center border-t border-[var(--color-border)] pt-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Already have an active account?{' '}
            <Link
              to="/sign-in"
              className="text-[var(--color-primary)] font-semibold hover:underline"
              id="register-to-signin-link"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Info helper text */}
      <div className="mt-6 text-center text-xs text-[var(--color-text-secondary)] flex items-center gap-2 justify-center leading-relaxed">
        <HelpCircle className="w-4 h-4 text-[var(--color-text-light)] shrink-0" />
        <span>Registration creates an active member profile accessible across fellowship devices.</span>
      </div>
    </div>
  );
}
