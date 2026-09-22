/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { UserProfile, Notification, UserRole } from './types';
import { mockNotifications } from './data/mockData';
import { useDevState, devStateStore } from './dev/simulations/devState';
import { isAuthorizedAdminRole } from './types/adminTypes';

// Screens
import PublicHome from './screens/public/PublicHome';
import Welcome from './screens/Welcome';
import SignIn from './screens/SignIn';
import Register from './screens/Register';
import CheckEmail from './screens/CheckEmail';
import WelcomeBack from './screens/WelcomeBack';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Notifications from './screens/Notifications';
import HelpSupportPage from './screens/HelpSupportPage';
import OfflineSyncPage from './screens/OfflineSyncPage';
import SettingsPage from './screens/SettingsPage';
import AboutPage from './screens/AboutPage';
import BookmarksPage from './screens/BookmarksPage';
import BibleHome from './screens/BibleHome';
import BibleReaderPage from './screens/BibleReaderPage';
import BibleSearchPage from './screens/BibleSearchPage';
import BibleStudyHome from './screens/BibleStudyHome';
import BibleStudyReader from './screens/BibleStudyReader';
import BibleStudyArchive from './screens/BibleStudyArchive';
import HymnHome from './screens/HymnHome';
import HymnReader from './screens/HymnReader';
import AnnouncementHome from './screens/AnnouncementHome';
import AnnouncementDetail from './screens/AnnouncementDetail';
import EventHome from './screens/EventHome';
import EventSchedule from './screens/EventSchedule';
import EventDetail from './screens/EventDetail';
import BottomNav from './components/BottomNav';
import { ReminderOffset } from './types';

// Foundational School Screens (Batch 06)
import FSHome from './screens/FSHome';
import FSMaterials from './screens/FSMaterials';
import FSReader from './screens/FSReader';
import FSRestricted from './screens/FSRestricted';
import FSOffline from './screens/FSOffline';

// Admin Platform Screens
import { AdminLayout } from './screens/admin/AdminLayout';
import { AdminEntry } from './screens/admin/AdminEntry';
import { AdminDashboard } from './screens/admin/AdminDashboard';
import { AdminContentLibrary } from './screens/admin/AdminContentLibrary';
import { AdminContentEditor } from './screens/admin/AdminContentEditor';
import { AdminContentPreview } from './screens/admin/AdminContentPreview';
import { AdminMediaLibrary } from './screens/admin/AdminMediaLibrary';
import { AdminMembers } from './screens/admin/AdminMembers';
import { AdminEvents } from './screens/admin/AdminEvents';
import { AdminSettings } from './screens/admin/AdminSettings';
import { AdminLeadership } from './screens/admin/AdminLeadership';
import { AdminHandover } from './screens/admin/AdminHandover';
import { AdminGovernance } from './screens/admin/AdminGovernance';
import { AdminGovernanceDetail } from './screens/admin/AdminGovernanceDetail';
import { AdminSystemHealth } from './screens/admin/AdminSystemHealth';
import { AdminTechnicalLogs } from './screens/admin/AdminTechnicalLogs';
import { AdminSystemConfiguration } from './screens/admin/AdminSystemConfiguration';
import { AdminRoleAssignmentExecution } from './screens/admin/AdminRoleAssignmentExecution';
import { AdminWebsiteContentEditor } from './screens/admin/AdminWebsiteContentEditor';

// Foundational School Admin Platform Screens
import { AdminFSStudents } from './screens/admin/AdminFSStudents';
import { AdminFSAdmissions } from './screens/admin/AdminFSAdmissions';
import { AdminFSTeachers } from './screens/admin/AdminFSTeachers';
import { AdminFSClasses } from './screens/admin/AdminFSClasses';
import { AdminFSMaterials } from './screens/admin/AdminFSMaterials';
import { AdminFSActivity } from './screens/admin/AdminFSActivity';
import { AdminRouteGuard } from './components/admin/AdminRouteGuard';


// Components
import { DevToolsDrawer } from './dev/DevToolsDrawer';
import Header from './components/Header';
import NavigationDrawer from './components/NavigationDrawer';
import { authService } from './services/auth/auth.service';
import { APP_CONFIG } from './config/app.config';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const devState = useDevState();

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      return authService.getCurrentUser();
    } catch {
      return null;
    }
  });

  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(() => {
    // When using the live backend and no initial cached user is present, mark loading
    return !APP_CONFIG.features.useMockServices && !authService.getCurrentUser();
  });

  // Verify backend session on mount in production mode
  useEffect(() => {
    if (!APP_CONFIG.features.useMockServices) {
      let isSubscribed = true;
      authService.fetchCurrentUser()
        .then(user => {
          if (isSubscribed) {
            setCurrentUser(user);
          }
        })
        .catch((err) => {
          if (isSubscribed) {
            if (err?.code === 'INVALID_USER_CONTRACT') {
              console.error('[App] Auth contract violation on /api/auth/me:', err);
            }
            // Preserve cached session for network issues or 403
            const cached = authService.getCurrentUser();
            if (cached) {
              setCurrentUser(cached);
            } else {
              setCurrentUser(null);
            }
          }
        })
        .finally(() => {
          if (isSubscribed) {
            setIsAuthLoading(false);
          }
        });

      return () => {
        isSubscribed = false;
      };
    }
  }, []);

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('asf_notifications');
      return saved ? JSON.parse(saved) : mockNotifications;
    } catch {
      return mockNotifications;
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [isRestrictedSimulated, setIsRestrictedSimulated] = useState(false);
  const [activeVersionId, setActiveVersionId] = useState('kjv');


  const [bookmarkedStudyIds, setBookmarkedStudyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('asf_bookmarked_studies');
      return saved ? JSON.parse(saved) : ['study-01'];
    } catch {
      return ['study-01'];
    }
  });

  useEffect(() => {
    localStorage.setItem('asf_bookmarked_studies', JSON.stringify(bookmarkedStudyIds));
  }, [bookmarkedStudyIds]);

  const handleToggleBookmarkStudy = (id: string) => {
    setBookmarkedStudyIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const [bookmarkedHymnIds, setBookmarkedHymnIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('asf_bookmarked_hymns');
      return saved ? JSON.parse(saved) : ['sop-12'];
    } catch {
      return ['sop-12'];
    }
  });

  useEffect(() => {
    localStorage.setItem('asf_bookmarked_hymns', JSON.stringify(bookmarkedHymnIds));
  }, [bookmarkedHymnIds]);

  const handleToggleBookmarkHymn = (id: string) => {
    setBookmarkedHymnIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const [readAnnouncementIds, setReadAnnouncementIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('asf_read_announcements');
      return saved ? JSON.parse(saved) : ['ann-03', 'ann-04', 'ann-05'];
    } catch {
      return ['ann-03', 'ann-04', 'ann-05'];
    }
  });

  useEffect(() => {
    localStorage.setItem('asf_read_announcements', JSON.stringify(readAnnouncementIds));
  }, [readAnnouncementIds]);

  const handleMarkAnnouncementAsRead = (id: string) => {
    setReadAnnouncementIds(prev => 
      prev.includes(id) ? prev : [...prev, id]
    );
  };

  const [remindedEventIds, setRemindedEventIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('asf_event_reminders');
      return saved ? JSON.parse(saved) : ['evt-01', 'evt-04'];
    } catch {
      return ['evt-01', 'evt-04'];
    }
  });

  useEffect(() => {
    localStorage.setItem('asf_event_reminders', JSON.stringify(remindedEventIds));
  }, [remindedEventIds]);

  const handleToggleEventReminder = (id: string, offset?: ReminderOffset): boolean => {
    let newState = false;
    if (remindedEventIds.includes(id) && !offset) {
      setRemindedEventIds(prev => prev.filter(i => i !== id));
      newState = false;
    } else {
      setRemindedEventIds(prev => prev.includes(id) ? prev : [...prev, id]);
      newState = true;
    }
    return newState;
  };

  // Sync state modifications to local storage for persistence
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('asf_user_session', JSON.stringify(currentUser));
    } else if (!isAuthLoading) {
      localStorage.removeItem('asf_user_session');
    }
  }, [currentUser, isAuthLoading]);

  useEffect(() => {
    localStorage.setItem('asf_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auth Action handlers
  const handleLoginSuccess = useCallback((userOrFields: UserProfile | {
    name: string;
    email: string;
    department: string;
    level: string;
    subgroup?: string;
    role?: UserRole;
  }) => {
    let profile: UserProfile;

    if ('id' in userOrFields && userOrFields.id) {
      // It is already a full UserProfile object
      profile = userOrFields as UserProfile;
    } else {
      let role: UserRole = userOrFields.role || 'Member';
      const lowerEmail = userOrFields.email.toLowerCase();
      if (lowerEmail === 'admin@asf-futa.org') {
        role = 'Publicity Coordinator';
      } else if (lowerEmail === 'president@asf-futa.org') {
        role = 'President / Executive';
      }

      const levelStr = userOrFields.level || '400 Level';
      profile = {
        id: `user_${Date.now()}`,
        name: userOrFields.name,
        email: userOrFields.email,
        department: userOrFields.department,
        academicLevel: levelStr,
        level: levelStr,
        subgroup: userOrFields.subgroup,
        roles: [role],
        role: role,
        accountStatus: 'Active',
        membershipStatus: levelStr === 'Alumni' ? 'Alumni' : 'Active Student',
        isAlumni: levelStr === 'Alumni'
      };
    }

    setCurrentUser(profile);
    try {
      localStorage.setItem('asf_user_session', JSON.stringify(profile));
    } catch {
      // storage quota or disabled
    }
  }, []);

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
  };

  const handleRoleChange = (newRole: UserRole) => {
    let updatedUser: UserProfile;
    if (currentUser) {
      const currentLevel = currentUser.academicLevel || currentUser.level || '400 Level';
      const newLevel = newRole === 'Alumni' ? 'Alumni' : (currentLevel === 'Alumni' ? '400 Level' : currentLevel);
      updatedUser = {
        ...currentUser,
        roles: [newRole],
        role: newRole,
        academicLevel: newLevel,
        level: newLevel,
        membershipStatus: newLevel === 'Alumni' ? 'Alumni' : 'Active Student',
        isAlumni: newRole === 'Alumni' || newLevel === 'Alumni',
      };
    } else {
      // Auto-provision an active mock session for testing screen flows seamlessly
      const targetLevel = newRole === 'Alumni' ? 'Alumni' : '400 Level';
      updatedUser = {
        id: 'user_active_session',
        name: newRole === 'President / Executive' 
          ? 'Temiloluwa Afolabi (President)' 
          : newRole === 'Publicity Coordinator' 
          ? 'Deborah Adeleke (Publicity)' 
          : newRole === 'VP / FS Coordinator' 
          ? 'Emmanuel Olufemi (VP / FS)' 
          : newRole === 'General Secretary'
          ? 'Grace Adebayo (Gen. Secretary)'
          : newRole === 'Bible Study Coordinator'
          ? 'Samuel Ajayi (Bible Study)'
          : newRole === 'FS Teacher' 
          ? 'David Adeleke (FS Teacher)' 
          : newRole === 'FS Student' 
          ? 'Grace Joshua (FS Student)' 
          : newRole === 'Alumni' 
          ? 'Bro. Segun Fafiolu (Alumni)' 
          : 'Temiloluwa Afolabi',
        email: newRole === 'President / Executive' 
          ? 'president@asf-futa.org' 
          : newRole === 'Publicity Coordinator' 
          ? 'publicity@asf-futa.org' 
          : 'member@asf-futa.org',
        department: 'Computer Science',
        academicLevel: targetLevel,
        level: targetLevel,
        subgroup: newRole === 'President / Executive' 
          ? 'Executive Council' 
          : newRole === 'Publicity Coordinator' 
          ? 'Publicity & Editorial' 
          : newRole === 'FS Teacher' 
          ? 'Foundational School Facilitator' 
          : 'Technical Team',
        roles: [newRole],
        role: newRole,
        accountStatus: 'Active',
        membershipStatus: targetLevel === 'Alumni' ? 'Alumni' : 'Active Student',
        isAlumni: newRole === 'Alumni'
      };
    }

    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('asf_user_session', JSON.stringify(updatedUser));
      if (isAuthorizedAdminRole(newRole)) {
        localStorage.setItem('asf_admin_role', newRole);
      }
    } catch {
      // ignore
    }

    // Auto navigate flow if appropriate
    if (location.pathname === '/' || location.pathname === '/sign-in' || location.pathname === '/portal') {
      navigate('/home');
    } else if (location.pathname.startsWith('/admin') && !isAuthorizedAdminRole(newRole)) {
      navigate('/home');
    }
  };

  // Sync devState role changes if triggered externally
  useEffect(() => {
    if (devState.simulatedRoleOverride && currentUser && currentUser.role !== devState.simulatedRoleOverride) {
      handleRoleChange(devState.simulatedRoleOverride);
    }
  }, [devState.simulatedRoleOverride]);

  const handleToggleRole = (newRole: UserRole) => {
    handleRoleChange(newRole);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Backend session logout notification failed:', e);
    }
    setCurrentUser(null);
    localStorage.removeItem('asf_user_session');
  };


  // Notification handlers
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, read: !n.read };
      }
      return n;
    }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Render Layout Helper: wraps screens with Header and Drawer when authenticated
  const renderLayout = (component: React.ReactNode, options: { hideHeader?: boolean } = {}) => {
    if (isAuthLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!currentUser) {
      // Unauthenticated guard redirect
      return <Navigate to="/" replace />;
    }

    return (
      <div className="app-container">
        {/* Sticky App Header */}
        {!options.hideHeader && (
          <Header 
            onMenuClick={() => setIsDrawerOpen(true)} 
            unreadCount={unreadCount} 
          />
        )}
        
        {/* Sliding drawer */}
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Content canvas pane */}
        <main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
          {component}
        </main>

        {/* Mobile sticky bottom nav */}
        <BottomNav />
      </div>
    );
  };

  return (
    <>
    <Routes>
      {/* Public Website */}
      <Route 
        path="/" 
        element={<PublicHome />} 
      />
      {/* Unauthenticated / Landing Screens for Portal */}
      <Route 
        path="/portal" 
        element={isAuthLoading ? null : (currentUser ? <Navigate to="/home" replace /> : <Welcome />)} 
      />
      <Route 
        path="/sign-in" 
        element={isAuthLoading ? null : (currentUser ? <Navigate to="/home" replace /> : <SignIn onLoginSuccess={handleLoginSuccess} />)} 
      />
      <Route 
        path="/register" 
        element={isAuthLoading ? null : (currentUser ? <Navigate to="/home" replace /> : <Register onLoginSuccess={handleLoginSuccess} />)} 
      />
      <Route 
        path="/check-email" 
        element={isAuthLoading ? null : (currentUser ? <Navigate to="/home" replace /> : <CheckEmail />)} 
      />
      <Route 
        path="/welcome-back" 
        element={<WelcomeBack onLoginSuccess={handleLoginSuccess} />} 
      />
      <Route 
        path="/auth/verify" 
        element={<WelcomeBack onLoginSuccess={handleLoginSuccess} />} 
      />

      {/* Authenticated Member Core Screens */}
      <Route 
        path="/home" 
        element={renderLayout(<Home currentUser={currentUser} />)} 
      />
      <Route 
        path="/profile" 
        element={renderLayout(
          <Profile 
            currentUser={currentUser} 
            onUpdateProfile={handleUpdateProfile}
            onToggleRole={handleToggleRole}
          />
        )} 
      />
      <Route 
        path="/notifications" 
        element={renderLayout(
          <Notifications 
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAll}
            onToggleRead={handleToggleRead}
          />
        )} 
      />

      {/* Support & Utility Routes */}
      <Route 
        path="/help" 
        element={renderLayout(<HelpSupportPage />)} 
      />
      <Route 
        path="/help-support" 
        element={<Navigate to="/help" replace />} 
      />
      <Route 
        path="/offline-sync" 
        element={renderLayout(
          <OfflineSyncPage 
            isOfflineSimulated={isOfflineSimulated}
            onToggleOffline={() => setIsOfflineSimulated(!isOfflineSimulated)}
          />
        )} 
      />
      <Route 
        path="/settings" 
        element={renderLayout(
          <SettingsPage 
            onLogout={handleLogout}
          />
        )} 
      />
      <Route 
        path="/about" 
        element={renderLayout(<AboutPage />)} 
      />
      <Route 
        path="/bookmarks" 
        element={renderLayout(<BookmarksPage />)} 
      />

      {/* Holy Bible Experience routes */}
      <Route 
        path="/bible" 
        element={renderLayout(
          <BibleHome 
            isOfflineSimulated={isOfflineSimulated}
            onToggleOffline={() => setIsOfflineSimulated(!isOfflineSimulated)}
            activeVersionId={activeVersionId}
            onVersionChange={setActiveVersionId}
          />
        )} 
      />
      <Route 
        path="/bible/read/:bookId/:chapterId" 
        element={renderLayout(
          <BibleReaderPage 
            isOfflineSimulated={isOfflineSimulated}
            activeVersionId={activeVersionId}
            onVersionChange={setActiveVersionId}
          />,
          { hideHeader: true }
        )} 
      />
      <Route 
        path="/bible/read/:bookId/:chapterId/:verseId" 
        element={renderLayout(
          <BibleReaderPage 
            isOfflineSimulated={isOfflineSimulated}
            activeVersionId={activeVersionId}
            onVersionChange={setActiveVersionId}
          />,
          { hideHeader: true }
        )} 
      />
      <Route 
        path="/bible/:bookId/:chapterId" 
        element={renderLayout(
          <BibleReaderPage 
            isOfflineSimulated={isOfflineSimulated}
            activeVersionId={activeVersionId}
            onVersionChange={setActiveVersionId}
          />,
          { hideHeader: true }
        )} 
      />
      <Route 
        path="/bible/:bookId/:chapterId/:verseId" 
        element={renderLayout(
          <BibleReaderPage 
            isOfflineSimulated={isOfflineSimulated}
            activeVersionId={activeVersionId}
            onVersionChange={setActiveVersionId}
          />,
          { hideHeader: true }
        )} 
      />
      <Route 
        path="/bible/search" 
        element={renderLayout(
          <BibleSearchPage 
            activeVersionId={activeVersionId}
          />
        )} 
      />

      {/* Bible Study Experience routes (Batch 03) */}
      <Route 
        path="/bible-study" 
        element={renderLayout(
          <BibleStudyHome 
            isOfflineSimulated={isOfflineSimulated}
            onToggleOffline={() => setIsOfflineSimulated(!isOfflineSimulated)}
            bookmarkedStudyIds={bookmarkedStudyIds}
          />
        )} 
      />
      <Route 
        path="/bible-study/read/:studyId" 
        element={renderLayout(
          <BibleStudyReader 
            bookmarkedStudyIds={bookmarkedStudyIds}
            onToggleBookmark={handleToggleBookmarkStudy}
            activeVersionId={activeVersionId}
          />,
          { hideHeader: true }
        )} 
      />
      <Route 
        path="/bible-study/:studyId" 
        element={renderLayout(
          <BibleStudyReader 
            bookmarkedStudyIds={bookmarkedStudyIds}
            onToggleBookmark={handleToggleBookmarkStudy}
            activeVersionId={activeVersionId}
          />,
          { hideHeader: true }
        )} 
      />
      <Route 
        path="/bible-study/archive" 
        element={renderLayout(
          <BibleStudyArchive 
            bookmarkedStudyIds={bookmarkedStudyIds}
          />
        )} 
      />

      {/* Hymn Book Experience routes (Batch 04) */}
      <Route 
        path="/hymns" 
        element={renderLayout(
          <HymnHome 
            isOfflineSimulated={isOfflineSimulated}
            onToggleOffline={() => setIsOfflineSimulated(!isOfflineSimulated)}
            bookmarkedHymnIds={bookmarkedHymnIds}
          />
        )} 
      />
      <Route 
        path="/hymns/bookmarks" 
        element={renderLayout(
          <HymnHome 
            isOfflineSimulated={isOfflineSimulated}
            onToggleOffline={() => setIsOfflineSimulated(!isOfflineSimulated)}
            bookmarkedHymnIds={bookmarkedHymnIds}
          />
        )} 
      />
      <Route 
        path="/hymns/search" 
        element={renderLayout(
          <HymnHome 
            isOfflineSimulated={isOfflineSimulated}
            onToggleOffline={() => setIsOfflineSimulated(!isOfflineSimulated)}
            bookmarkedHymnIds={bookmarkedHymnIds}
          />
        )} 
      />
      <Route 
        path="/hymns/read/:hymnId" 
        element={renderLayout(
          <HymnReader 
            isOfflineSimulated={isOfflineSimulated}
            bookmarkedHymnIds={bookmarkedHymnIds}
            onToggleBookmark={handleToggleBookmarkHymn}
          />,
          { hideHeader: true }
        )} 
      />
      <Route 
        path="/hymns/:hymnId" 
        element={renderLayout(
          <HymnReader 
            isOfflineSimulated={isOfflineSimulated}
            bookmarkedHymnIds={bookmarkedHymnIds}
            onToggleBookmark={handleToggleBookmarkHymn}
          />,
          { hideHeader: true }
        )} 
      />

      {/* Announcement Experience routes (Batch 05A) */}
      <Route 
        path="/announcements" 
        element={renderLayout(
          <AnnouncementHome 
            isOfflineSimulated={isOfflineSimulated}
            onToggleOffline={() => setIsOfflineSimulated(!isOfflineSimulated)}
            readAnnouncementIds={readAnnouncementIds}
            onMarkAsRead={handleMarkAnnouncementAsRead}
          />
        )} 
      />
      <Route 
        path="/announcements/:announcementId" 
        element={renderLayout(
          <AnnouncementDetail 
            isOfflineSimulated={isOfflineSimulated}
            onMarkAsRead={handleMarkAnnouncementAsRead}
          />
        )} 
      />

      {/* Events Experience routes (Batch 05B) */}
      <Route 
        path="/events" 
        element={renderLayout(
          <EventHome 
            isOfflineSimulated={isOfflineSimulated}
            onToggleOffline={() => setIsOfflineSimulated(!isOfflineSimulated)}
            remindedEventIds={remindedEventIds}
          />
        )} 
      />
      <Route 
        path="/events/schedule" 
        element={renderLayout(
          <EventSchedule 
            isOfflineSimulated={isOfflineSimulated}
          />
        )} 
      />
      <Route 
        path="/events/:eventId" 
        element={renderLayout(
          <EventDetail 
            isOfflineSimulated={isOfflineSimulated}
            remindedEventIds={remindedEventIds}
            onToggleReminder={handleToggleEventReminder}
          />
        )} 
      />

      {/* Foundational School Experience routes (Batch 06) */}
      <Route 
        path="/fs" 
        element={renderLayout(
          <FSHome 
            isOfflineSimulated={isOfflineSimulated}
            onToggleOffline={() => setIsOfflineSimulated(!isOfflineSimulated)}
            isRestrictedSimulated={isRestrictedSimulated}
            onToggleRestricted={() => setIsRestrictedSimulated(!isRestrictedSimulated)}
          />
        )} 
      />
      <Route 
        path="/foundational-school" 
        element={<Navigate to="/fs" replace />} 
      />
      <Route 
        path="/fs/materials" 
        element={renderLayout(
          <FSMaterials 
            isOfflineSimulated={isOfflineSimulated}
            onToggleOffline={() => setIsOfflineSimulated(!isOfflineSimulated)}
            isRestrictedSimulated={isRestrictedSimulated}
            onToggleRestricted={() => setIsRestrictedSimulated(!isRestrictedSimulated)}
          />
        )} 
      />
      <Route 
        path="/foundational-school/materials" 
        element={<Navigate to="/fs/materials" replace />} 
      />
      <Route 
        path="/fs/materials/:materialId" 
        element={renderLayout(
          <FSReader />,
          { hideHeader: true }
        )} 
      />
      <Route 
        path="/foundational-school/materials/:materialId" 
        element={<Navigate to="/fs/materials" replace />} 
      />
      <Route 
        path="/fs/restricted" 
        element={renderLayout(
          <FSRestricted />
        )} 
      />
      <Route 
        path="/foundational-school/restricted" 
        element={<Navigate to="/fs/restricted" replace />} 
      />
      <Route 
        path="/fs/offline" 
        element={renderLayout(
          <FSOffline />
        )} 
      />
      <Route 
        path="/foundational-school/offline" 
        element={<Navigate to="/fs/offline" replace />} 
      />

      {/* Authenticated ASF Admin Platform Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="entry" element={<AdminEntry />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Foundational School Executive Domain Routes */}
        <Route 
          path="fs/students" 
          element={
            <AdminRouteGuard requiredPermission="fs.students.view" moduleName="FS Students Management" requiredScope="FS Coordinator / Discipleship Oversight">
              <AdminFSStudents />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="fs/admissions" 
          element={
            <AdminRouteGuard requiredPermission="fs.admissions.review" moduleName="FS Admissions & Applications" requiredScope="FS Coordinator / Discipleship Oversight">
              <AdminFSAdmissions />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="fs/teachers" 
          element={
            <AdminRouteGuard requiredPermission="fs.teachers.assign" moduleName="FS Teachers & Facilitators" requiredScope="FS Coordinator / Discipleship Oversight">
              <AdminFSTeachers />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="fs/classes" 
          element={
            <AdminRouteGuard requiredPermission="fs.classes.manage" moduleName="FS Classes & Levels" requiredScope="FS Coordinator / Discipleship Oversight">
              <AdminFSClasses />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="fs/materials" 
          element={
            <AdminRouteGuard requiredPermission="fs.materials.manage" moduleName="FS Study Materials & Syllabus" requiredScope="FS Coordinator / Discipleship Oversight">
              <AdminFSMaterials />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="fs/activity" 
          element={
            <AdminRouteGuard requiredPermission="fs.students.view" moduleName="FS Activity Audit Trail" requiredScope="FS Coordinator / Discipleship Oversight">
              <AdminFSActivity />
            </AdminRouteGuard>
          } 
        />

        {/* Global Executive Governance & Operations Routes */}
        <Route 
          path="leadership" 
          element={
            <AdminRouteGuard requiredPermission="leadership.view" moduleName="Executive Leadership & Appointments" requiredScope="President & Secretariat">
              <AdminLeadership />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="handover" 
          element={
            <AdminRouteGuard requiredPermission="handover.view" moduleName="Executive Handover & Continuity" requiredScope="President & Executive Council">
              <AdminHandover />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="governance" 
          element={
            <AdminRouteGuard requiredPermission="governance.view" moduleName="Fellowship Governance & Approvals" requiredScope="President & Executive Council">
              <AdminGovernance />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="governance/:requestId" 
          element={
            <AdminRouteGuard requiredPermission="governance.view" moduleName="Fellowship Governance & Approvals" requiredScope="President & Executive Council">
              <AdminGovernanceDetail />
            </AdminRouteGuard>
          } 
        />
        
        {/* Ministry Operations Routes */}
        <Route 
          path="website-content" 
          element={
            <AdminRouteGuard requiredPermission="announcements.edit" moduleName="Website Copy Editing" requiredScope="Publicity & Editorial Desk">
              <AdminWebsiteContentEditor />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="content" 
          element={
            <AdminRouteGuard requiredPermission="announcements.view" moduleName="Announcements Library" requiredScope="Publicity & Editorial Desk">
              <AdminContentLibrary />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="content/new" 
          element={
            <AdminRouteGuard requiredPermission="announcements.create" moduleName="Create Announcement" requiredScope="Publicity & Editorial Desk">
              <AdminContentEditor />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="content/edit/:id" 
          element={
            <AdminRouteGuard requiredPermission="announcements.edit" moduleName="Edit Announcement" requiredScope="Publicity & Editorial Desk">
              <AdminContentEditor />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="content/preview/:id" 
          element={
            <AdminRouteGuard requiredPermission="announcements.view" moduleName="Preview Announcement" requiredScope="Publicity & Editorial Desk">
              <AdminContentPreview />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="media" 
          element={
            <AdminRouteGuard requiredPermission="media.view" moduleName="Media Library" requiredScope="Publicity & Media Desk">
              <AdminMediaLibrary />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="members" 
          element={
            <AdminRouteGuard requiredPermission="members.view" moduleName="Members Directory" requiredScope="Secretariat & Membership Desk">
              <AdminMembers />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="events" 
          element={
            <AdminRouteGuard requiredPermission="events.view" moduleName="Events Management" requiredScope="Secretariat & Events Desk">
              <AdminEvents />
            </AdminRouteGuard>
          } 
        />

        {/* System Administration Routes */}
        <Route 
          path="system-health" 
          element={
            <AdminRouteGuard requiredPermission="system.health.view" moduleName="System Health & Diagnostics" requiredScope="Technical Oversight">
              <AdminSystemHealth />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="logs" 
          element={
            <AdminRouteGuard requiredPermission="system.logs.view" moduleName="Technical Audit & Server Logs" requiredScope="Technical Oversight">
              <AdminTechnicalLogs />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="system-configuration" 
          element={
            <AdminRouteGuard requiredPermission="system.configuration.view" moduleName="Global System Configuration" requiredScope="President & Technical Oversight">
              <AdminSystemConfiguration />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="role-assignment" 
          element={
            <AdminRouteGuard requiredPermission="leadership.assign" moduleName="Role Elevation & Secretarial Assignment" requiredScope="President & Secretariat">
              <AdminRoleAssignmentExecution />
            </AdminRouteGuard>
          } 
        />
        <Route 
          path="role-assignment/:id" 
          element={
            <AdminRouteGuard requiredPermission="leadership.assign" moduleName="Role Elevation & Secretarial Assignment" requiredScope="President & Secretariat">
              <AdminRoleAssignmentExecution />
            </AdminRouteGuard>
          } 
        />
        <Route path="settings" element={<AdminSettings />} />
      </Route>


      {/* Fallback route redirection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    {APP_CONFIG.features.enableDevSimulations && (
      <DevToolsDrawer 
        currentRole={currentUser?.role || devState.simulatedRoleOverride || 'Member'} 
        onRoleChange={handleRoleChange} 
      />
    )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

