# ASF Digital Platform — Development Roadmap & Release Plan

**Document Status:** Approved & Authoritative
**Guiding Principle:** Ship core fellowship spiritual value first (Bible Study, Hymns, Devotionals, Announcements), harden offline sync, then expand to academic tools and library.

---

## 1. Roadmap Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Foundation & Auth (Weeks 1-2)                                  │
│ • Database Schema & RLS Setup (Supabase)                                │
│ • Magic-Link Auth Flow & Member Profiles                                │
│ • Role-Based Access Framework                                           │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│ Phase 2: Core Fellowship Modules & Offline Reader (Weeks 3-5)           │
│ • Bible Study Module (Manual entry, Section rendering, Scripture links) │
│ • Bible Engine (Multi-version, Verse resolution, Offline caching)       │
│ • Hymn Book (Search, Lyrics, Service Selections)                        │
│ • Daily Devotionals                                                     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│ Phase 3: Engagement & Communications (Weeks 6-7)                        │
│ • Announcements & Event Calendar                                        │
│ • Foundation School (FS) Role-Gated Portal                              │
│ • Personal Notes, Highlights, and Bookmarks                             │
│ • Multi-Person Deletion Approval Workflow                               │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│ Phase 4: Academic & Library Expansion (Weeks 8-10)                      │
│ • Library Catalogue & Digital Past Questions                            │
│ • CGPA / Academic Calculator                                            │
│ • Executive Analytics Dashboard & Content Management                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase Breakdown

### Phase 1: Core Foundation, Security & Auth (Weeks 1–2)
- **Deliverables:**
  - Setup PostgreSQL schemas, tables, constraints, indexes.
  - Implement RLS security policies for profiles, roles, and content.
  - Magic-link authentication integration (email verification, token exchange).
  - Profile completion and onboarding experience.
  - Role assignment engine and step-up re-authentication safeguards.
- **Exit Criteria:**
  - Members can authenticate seamlessly without passwords.
  - Role-based route guards and database policies pass security tests.

### Phase 2: Fellowship Spiritual Modules & Offline Storage (Weeks 3–5)
- **Deliverables:**
  - Bible Study structured reader (Tuesday dating logic, memory verse, discussion).
  - Scripture reference auto-detection and internal reader modal with back-navigation.
  - Multi-version Bible reader with pre-bundled offline KJV text.
  - Hymn Book searchable archive by number, title, and lyrics.
  - Service hymn selection builder for Sunday and Tuesday services.
  - Daily Devotional automated calendar reader.
  - IndexedDB client-side caching engine for complete offline operation.
- **Exit Criteria:**
  - All spiritual modules are fully readable offline after initial sync.
  - Scripture references resolve instantly without network round-trips.

### Phase 3: Community, Foundation School & Governance (Weeks 6–7)
- **Deliverables:**
  - Real-time announcements with audience scoping (`platform`, `fs_only`).
  - Interactive event calendar with countdowns and reminders.
  - Foundation School student & teacher portal with syllabus and classes.
  - Member personal tools: private notes, scripture highlights, bookmarks.
  - Multi-signature approval workflow for Bible study deletion (2-of-2 required).
  - Full audit logging for executive actions.
- **Exit Criteria:**
  - Foundation School students and teachers have isolated, secure access.
  - Deletions cannot execute without dual-executive approval.

### Phase 4: Academic Hub, Digital Library & Polish (Weeks 8–10)
- **Deliverables:**
  - Digital library catalog with authorized spiritual books and past questions.
  - Academic tools: GPA/CGPA calculator, exam countdown.
  - Admin Content Studio for Bible Study Coordinator and Publicity Team.
  - Final UX polish, contrast checks, PWA service worker hardening.
- **Exit Criteria:**
  - Successful end-to-end pilot with 50 fellowship members.
  - 100% test coverage on critical RLS policies.
