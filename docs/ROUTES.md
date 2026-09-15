# Application Routes & Permissions

## Overview
This document specifies all application routes, public vs. authenticated access requirements, and role-based permissions in the ASF Events & Portal.

---

## 1. Public Routes (No Authentication Required)
- **`/`**: Public Website Landing Page.
- **`/portal`**: Mobile Portal Welcome / Landing Screen.
- **`/sign-in`**: Sign In / Registration Form.
- **`/check-email`**: Magic link confirmation prompt screen.
- **`/welcome-back`**: Authentication magic link token validation & session redirection screen.

---

## 2. Main Portal Routes (Authentication Required)
- **`/home`**: Main Portal Dashboard (Daily Bible Verse, Quick Links, Announcements, Next Event Highlight).
- **`/events`**: Events Directory (Category Filters, Horizon Tabs, Search).
- **`/events/schedule`**: Semester Program Schedule Timetable.
- **`/events/:eventId`**: Event Detail Screen (Agenda, Location, Reminders, Guidelines).
- **`/announcements`**: Announcements & Fellowship Updates Feed.
- **`/announcements/:announcementId`**: Detailed Announcement Reader.
- **`/bible`**: Holy Bible Digital Reader.
- **`/bible/read/:bookId/:chapterId`**: Chapter Text Viewer.
- **`/bible/search`**: Scripture Search Page.
- **`/bible-study`**: Bible Study Manuals & Outline Hub.
- **`/bible-study/read/:studyId`**: Study Outline Reader.
- **`/hymns`**: Hymn Book (Song of Praise) Directory, today's service hymn, category filters, and quick numeric lookup.
- **`/hymns/search`**: Hymn Search by number, title, author, or lyric phrases.
- **`/hymns/bookmarks`**: Member Bookmarked / Saved Hymns.
- **`/hymns/read/:hymnId`**: Canonical Hymn Lyrics Reader with audio support and adjacent sequential navigation.
- **`/hymns/:hymnId`**: Direct Deep-Link alias for Hymn Lyrics Reader (supports IDs like `sop-201` and numbers like `201`).
- **`/fs`**: Foundational School Hub.
- **`/fs/materials`**: FS Study Manuals & Materials.
- **`/fs/materials/:materialId`**: FS Material Reader.
- **`/fs/restricted`**: FS Access Restriction Screen (for non-enrolled members).
- **`/profile`**: Member Profile & Subgroup Information.
- **`/notifications`**: System Notifications Center.
- **`/settings`**: Member Account Settings.
- **`/help`**: Help, Support & FAQs.
- **`/offline-sync`**: Offline Storage & Cache Sync Status.

---

## 3. Executive & Admin Routes (Admin Layout & Permissions)
All admin routes are mounted under `/admin/*` and guarded by `AdminRouteGuard`:
- **`/admin`**: Admin Portal Entry & Access Gateway.
- **`/admin/dashboard`**: Executive Dashboard & System Overview.
- **`/admin/content`**: Content Management Library (Announcements, Event Drafts, Study Outlines).
- **`/admin/content/editor`**: Editorial Content Editor.
- **`/admin/media`**: Media Library & Assets Storage.
- **`/admin/members`**: Member Directory & Subgroup Roster.
- **`/admin/events`**: Event Management Console.
- **`/admin/governance`**: Executive Governance & Policy Matrix.
- **`/admin/leadership`**: Executive Leadership Roster.
- **`/admin/handover`**: Tenure Handover Documentation.
- **`/admin/fs/students`**: Foundational School Student Management.
- **`/admin/fs/teachers`**: Foundational School Teacher Assignments.
- **`/admin/fs/materials`**: Foundational School Curriculum Editor.
- **`/admin/system/health`**: System Diagnostics & Infrastructure Health.
- **`/admin/system/logs`**: Technical Audit Logs.
- **`/admin/system/config`**: Platform Global Configuration.
- **`/admin/system/roles`**: Role Assignment & Execution Matrix.
