/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, UserRole } from '../types';
import { APP_CONFIG } from '../config/app.config';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  Save, 
  ShieldCheck,
  Camera,
  Trash2,
  UploadCloud
} from 'lucide-react';
import Input from '../components/common/Input';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface ProfileProps {
  currentUser: UserProfile | null;
  onUpdateProfile: (updated: UserProfile) => void;
  onToggleRole?: (newRole: UserRole) => void;
}

export default function Profile({ currentUser, onUpdateProfile }: ProfileProps) {
  // If no user context, fallback
  const user: UserProfile = currentUser || {
    id: 'user_01',
    name: 'Temiloluwa Afolabi',
    email: 'member@asf-futa.org',
    department: 'Computer Science',
    academicLevel: '400 Level',
    level: '400 Level',
    subgroup: 'Technical Team',
    roles: ['Member'],
    role: 'Member',
    accountStatus: 'Active',
    membershipStatus: 'Active Student',
    isAlumni: false
  };

  // Editable fields state
  const [name, setName] = useState(user.name);
  const [department, setDepartment] = useState(user.department);
  const [level, setLevel] = useState(user.academicLevel || user.level || '400 Level');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  
  const [toastMessage, setToastMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trigger update handler (excluding subgroup which is administered by leadership)
    onUpdateProfile({
      ...user,
      name,
      department,
      academicLevel: level,
      level: level,
      avatarUrl: avatarUrl || undefined
    });

    setToastMessage('Profile details updated successfully!');
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };


  return (
    <div className="flex-1 p-5 max-w-lg mx-auto w-full space-y-6 select-none" id="profile-screen">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">My Fellowship Profile</h2>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Manage your student details and membership credentials</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="card-surface-raised space-y-5" id="profile-form">
        
        {/* Dynamic Profile Photo Slot */}
        <div className="flex flex-col space-y-2">
          <label className="input-label">Profile Photo</label>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]">
            {/* Photo Preview Container */}
            <div className="relative group shrink-0">
              {avatarUrl ? (
                <ImageWithFallback
                  src={avatarUrl}
                  fallbackType="userAvatar"
                  preset="avatar"
                  aspectRatio="aspect-square"
                  alt={`${name}'s Profile Photo`}
                  className="w-20 h-20 rounded-full border-2 border-[var(--color-primary)] object-cover shadow-2xs"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-primary-tint)] flex items-center justify-center text-[var(--color-primary)] font-bold text-xl uppercase shadow-2xs">
                  {name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'M'}
                </div>
              )}
              
              {/* Floating Camera Icon Indicator */}
              <div className="absolute -bottom-1 -right-1 bg-[var(--color-primary)] text-white p-1.5 rounded-full shadow-2xs border border-white">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div 
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) {
                    setToastMessage('Error: Image size exceeds 2MB limit.');
                    setTimeout(() => setToastMessage(''), 3000);
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (re) => {
                    if (re.target?.result && typeof re.target.result === 'string') {
                      setAvatarUrl(re.target.result);
                      setToastMessage('Selected avatar image ready to save.');
                      setTimeout(() => setToastMessage(''), 3000);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className={`flex-1 w-full flex flex-col items-center justify-center py-3 px-4 border border-dashed rounded-xl transition-all text-center ${
                isDragging 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-tint)]/45' 
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/40 bg-white'
              }`}
            >
              <UploadCloud className="w-6 h-6 text-[var(--color-primary)] mb-1.5 opacity-80" />
              <label htmlFor="avatar-file-upload" className="cursor-pointer">
                <span className="text-xs font-bold text-[var(--color-primary)] hover:underline block mb-0.5">
                  Drag & drop or Click to upload
                </span>
                <span className="text-[10px] text-[var(--color-text-secondary)] block">
                  PNG, JPG or WEBP (Max 2MB)
                </span>
              </label>
              <input 
                id="avatar-file-upload"
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                      setToastMessage('Error: Image size exceeds 2MB limit.');
                      setTimeout(() => setToastMessage(''), 3000);
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = (re) => {
                      if (re.target?.result && typeof re.target.result === 'string') {
                        setAvatarUrl(re.target.result);
                        setToastMessage('Selected avatar image ready to save.');
                        setTimeout(() => setToastMessage(''), 3000);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            {/* Clear Button */}
            {avatarUrl && (
              <button
                type="button"
                onClick={() => {
                  setAvatarUrl('');
                  setToastMessage('Removed profile photo (falling back to initials)');
                  setTimeout(() => setToastMessage(''), 3000);
                }}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100 shrink-0 self-center sm:self-auto"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Full Name field */}
        <Input
          id="profile-name"
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leadingIcon={User}
          required
        />

        {/* Contact/Email (Read-only) */}
        <div>
          <Input
            id="profile-email"
            label="Primary Contact (Email)"
            type="email"
            value={user.email}
            leadingIcon={Mail}
            disabled
            className="opacity-60 cursor-not-allowed bg-[#FAF8F5]"
          />
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-1 ml-1">
            Registered credential email cannot be modified by the member.
          </p>
        </div>

        {/* Department and Level Row */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="profile-dept"
            label="Department"
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />

          <div className="flex flex-col align-start text-left">
            <label className="input-label" htmlFor="profile-level">Level</label>
            <select
              id="profile-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="input-box"
            >
              <option value="100 Level">100 Level</option>
              <option value="200 Level">200 Level</option>
              <option value="300 Level">300 Level</option>
              <option value="400 Level">400 Level</option>
              <option value="500 Level">500 Level</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>
        </div>

        {/* Subgroup Designation (Administered by fellowship coordinators) */}
        <div className="bg-[var(--color-background)] p-3.5 rounded-xl border border-[var(--color-border)] space-y-2" id="profile-subgroup-info">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[var(--color-primary)]" />
            <label className="text-xs font-semibold text-[var(--color-text-primary)]">
              Fellowship Subgroup
            </label>
          </div>
          <div>
            <span className="inline-block text-xs font-bold text-[var(--color-primary)] bg-[var(--color-surface)] px-2.5 py-1 rounded-lg border border-[var(--color-border)]">
              {user.subgroup || 'General Assembly'}
            </span>
          </div>
        </div>

        {/* System Assigned Role (Clearance status) */}
        <div className="bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">Clearance & Role Assignment</p>
                <p className="text-[11px] text-[var(--color-text-secondary)]">Designated by fellowship leadership</p>
              </div>
            </div>
            <span className="text-xs bg-[var(--color-surface)] border border-[var(--color-border)] font-bold py-1 px-2.5 rounded-lg text-[var(--color-primary)]">
              {user.roles?.join(', ') || user.role}
            </span>
          </div>
        </div>


        {/* Submit */}
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center gap-2"
          id="profile-save-btn"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>

        {/* Public Website Link */}
        <div className="pt-2 flex justify-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium border border-transparent hover:border-[var(--color-border)] px-4 py-2 rounded-lg"
          >
            Visit ASF FUTA Website
          </Link>
        </div>
      </form>

      {/* Dynamic Toast popup notifier */}
      {toastMessage && (
        <div 
          className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 left-1/2 -translate-x-1/2 bg-[var(--color-text-primary)] text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-white/10 max-w-sm w-[90%] flex items-start gap-2 animate-bounce z-50 leading-relaxed"
          id="profile-toast-popup"
        >
          <div className="bg-white/10 p-1 rounded-full text-[var(--color-accent)] shrink-0">
            <User className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
