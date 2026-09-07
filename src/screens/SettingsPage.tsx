/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  RotateCcw, 
  Wifi, 
  Bell, 
  Info, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface SettingsPageProps {
  onLogout: () => void;
}

export default function SettingsPage({ onLogout }: SettingsPageProps) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    onLogout();
    setShowLogoutModal(false);
    navigate('/');
  };

  return (
    <div className="flex-1 bg-[#FDFBF9] text-[#18181B] min-h-screen font-sans pb-16" id="settings-screen">
      
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E4E4E7] h-14 px-4 flex items-center justify-between shadow-xs">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full text-[#7A1F2B] hover:bg-[#FAF8F5] transition-colors active:scale-95"
          aria-label="Go back"
          id="settings-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-[#7A1F2B] tracking-tight">
          Settings
        </h1>

        <div className="w-9"></div> {/* Spacer */}
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Group 1: Account */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] px-1">
            Account
          </h2>
          <div className="bg-white border border-[#E4E4E7] rounded-xl overflow-hidden shadow-xs">
            <Link
              to="/profile"
              className="flex items-center justify-between p-4 hover:bg-[#FAF8F5] transition-colors group"
              id="settings-profile-link"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#7A1F2B]/10 text-[#7A1F2B]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#18181B] group-hover:text-[#7A1F2B] transition-colors block">
                    Account Profile
                  </span>
                  <span className="text-xs text-[#52525B] block mt-0.5">
                    Student Details, Department & Level
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#52525B] group-hover:text-[#7A1F2B] transition-colors" />
            </Link>
          </div>
        </div>

        {/* Group 2: Preferences */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] px-1">
            Preferences
          </h2>
          <div className="bg-white border border-[#E4E4E7] rounded-xl divide-y divide-[#E4E4E7] overflow-hidden shadow-xs">
            <Link
              to="/offline-sync"
              className="flex items-center justify-between p-4 hover:bg-[#FAF8F5] transition-colors group"
              id="settings-offline-sync-link"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#7A1F2B]/10 text-[#7A1F2B]">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#18181B] group-hover:text-[#7A1F2B] transition-colors block">
                    Offline & Sync Settings
                  </span>
                  <span className="text-xs text-[#52525B] block mt-0.5">
                    Storage management & offline resources
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#52525B] group-hover:text-[#7A1F2B] transition-colors" />
            </Link>

            <Link
              to="/notifications"
              className="flex items-center justify-between p-4 hover:bg-[#FAF8F5] transition-colors group"
              id="settings-notifications-link"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#7A1F2B]/10 text-[#7A1F2B]">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#18181B] group-hover:text-[#7A1F2B] transition-colors block">
                    Notifications
                  </span>
                  <span className="text-xs text-[#52525B] block mt-0.5">
                    Alert preferences & fellowship news
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#52525B] group-hover:text-[#7A1F2B] transition-colors" />
            </Link>
          </div>
        </div>

        {/* Group 3: Information */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] px-1">
            Information
          </h2>
          <div className="bg-white border border-[#E4E4E7] rounded-xl divide-y divide-[#E4E4E7] overflow-hidden shadow-xs">
            <Link
              to="/about"
              className="flex items-center justify-between p-4 hover:bg-[#FAF8F5] transition-colors group"
              id="settings-about-link"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#7A1F2B]/10 text-[#7A1F2B]">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#18181B] group-hover:text-[#7A1F2B] transition-colors block">
                    About ASF
                  </span>
                  <span className="text-xs text-[#52525B] block mt-0.5">
                    Fellowship vision, mission & crest
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#52525B] group-hover:text-[#7A1F2B] transition-colors" />
            </Link>

            <Link
              to="/help"
              className="flex items-center justify-between p-4 hover:bg-[#FAF8F5] transition-colors group"
              id="settings-help-link"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#7A1F2B]/10 text-[#7A1F2B]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#18181B] group-hover:text-[#7A1F2B] transition-colors block">
                    Help & Support
                  </span>
                  <span className="text-xs text-[#52525B] block mt-0.5">
                    FAQ guides & Publicity contact
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#52525B] group-hover:text-[#7A1F2B] transition-colors" />
            </Link>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-2">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 p-3.5 bg-white border border-red-200 text-red-700 font-bold text-xs rounded-xl hover:bg-red-50 transition-colors shadow-xs"
            id="settings-logout-btn"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>Sign Out of Account</span>
          </button>
        </div>

      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in" id="logout-modal-backdrop">
          <div className="bg-white border border-[#E4E4E7] rounded-xl shadow-xl w-full max-w-sm overflow-hidden space-y-4 p-6 text-center animate-scale-up" id="logout-modal-card">
            
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#18181B]">Log Out?</h3>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Are you sure you want to sign out of your ASF account on this device?
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-bold text-[#52525B] hover:bg-[#E4E4E7]/40 rounded-lg transition-colors"
                id="cancel-logout-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 bg-[#7A1F2B] text-white text-xs font-bold rounded-lg hover:bg-[#5B0617] transition-colors shadow-xs"
                id="confirm-logout-btn"
              >
                Log Out
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
