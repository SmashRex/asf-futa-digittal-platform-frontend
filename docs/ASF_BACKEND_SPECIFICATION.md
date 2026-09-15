# ASF DIGITAL PLATFORM — BACKEND ENGINEERING SPECIFICATION (HISTORICAL DRAFT)

> [!WARNING]
> **HISTORICAL / SUPERSEDED DOCUMENT**: This document represents the initial v1.0.0 engineering specification draft.
> For the authoritative, final backend blueprint reconciled with all forensic audit passes, see **[`ASF_BACKEND_SPECIFICATION_FINAL.md`](./ASF_BACKEND_SPECIFICATION_FINAL.md)**.

**Architectural Blueprint & System Design Document (Initial Draft)**
*Version 1.0.0 — Historical Reference*
*Platform: Anglican Students' Fellowship (ASF), Federal University of Technology, Akure (FUTA)*

---

## CONFIDENCE & EVIDENCE CLASSIFICATION SYSTEM
Throughout this document, all specifications, entities, endpoints, and architectural assertions are tagged with strict forensic confidence levels derived directly from codebase inspection:
* `[VERIFIED]`: Directly confirmed from existing, functional frontend/service code in the workspace.
* `[DOCUMENTED]`: Explicitly specified in project markdown files, configuration contracts, or architecture guides.
* `[INFERRED]`: Strongly required and necessitated by the frontend UX/state patterns, but not yet wired to a live backend.
* `[PROPOSED]`: Recommended backend engineering design to fulfill frontend requirements safely and efficiently.
* `[NOT IMPLEMENTED]`: Planned, referenced, or simulated in the frontend UI, but lacking any real backend or storage backing.
* `[NOT YET DECIDED]`: Architectural or product question requiring explicit human decision before backend implementation.
* `[UNKNOWN]`: Data or workflow details that cannot be conclusively determined from the current codebase.
* `[REQUIRES CONFIRMATION]`: Ambiguity between multiple conflicting files or conventions that needs human sign-off.

---

## 0. INSPECTION SUMMARY & CODEBASE FORENSICS

### 0.1 What Was Inspected
1. **Application Configuration & Entrypoints**: `src/config/app.config.ts`, `src/config/api.config.ts`, `src/config/media.config.ts`, `src/config/bible.config.ts`, `src/config/hymns.config.ts`, `src/App.tsx`, `index.html`.
2. **API & Service Layer**: `src/services/api/client.ts`, `src/services/auth/auth.service.ts`, `src/services/events/events.service.ts`, `src/services/announcements/announcements.service.ts`, `src/services/bible/bible.service.ts`, `src/services/bibleStudy/bibleStudy.service.ts`, `src/services/hymns/hymns.service.ts`, `src/services/fs/fs.service.ts`, `src/services/reminders/reminders.service.ts`, `src/services/users/users.service.ts`, `src/services/websiteCopy/websiteCopy.service.ts`, `src/services/websiteContent.service.ts`, `src/services/image/imageCache.service.ts`.
3. **Data Stores & Mock State**: `src/data/mockData.ts`, `src/data/adminData.ts`, `src/data/announcementData.ts`, `src/data/eventData.ts`, `src/data/bibleData.ts`, `src/data/bibleStudyData.ts`, `src/data/hymnData.ts`, `src/data/fsData.ts`, `src/data/fsAdminData.ts`.
4. **TypeScript Interfaces & Domain Types**: `src/types/index.ts`, `src/types/adminTypes.ts`, `src/types/role.ts`, `src/types/user.ts`, `src/types/event.ts`, `src/types/reminder.ts`, `src/types/bible.ts`, `src/types/bibleStudy.ts`, `src/types/hymn.ts`, `src/types/fsAdminTypes.ts`, `src/types/websiteCopy.ts`.
5. **Authentication, Authorization & Role Security**: `src/auth/permissions.ts`, `src/screens/SignIn.tsx`, `src/screens/CheckEmail.tsx`, `src/screens/WelcomeBack.tsx`, `src/screens/admin/AdminLayout.tsx`, `src/dev/simulations/devState.ts`.
6. **Public Website Frontend**: `src/screens/public/PublicHome.tsx`, `src/screens/public/sections/HeroSection.tsx`, `src/screens/public/sections/AboutSection.tsx`, `src/screens/public/sections/ScheduleSection.tsx`, `src/screens/public/sections/LifeSection.tsx`, `src/screens/public/sections/VisitSection.tsx`, `src/screens/public/sections/CTASection.tsx`.
7. **Admin Workspace**: `src/screens/admin/AdminDashboard.tsx`, `src/screens/admin/AdminWebsiteContentEditor.tsx`, `src/screens/admin/AdminContentLibrary.tsx`, `src/screens/admin/AdminContentEditor.tsx`, `src/screens/admin/AdminContentPreview.tsx`, `src/screens/admin/AdminEvents.tsx`, `src/screens/admin/AdminMediaLibrary.tsx`, `src/screens/admin/AdminMembers.tsx`, `src/screens/admin/AdminLeadership.tsx`, `src/screens/admin/AdminHandover.tsx`, `src/screens/admin/AdminGovernance.tsx`, `src/screens/admin/AdminSystemConfiguration.tsx`, `src/screens/admin/AdminSystemHealth.tsx`, `src/screens/admin/AdminTechnicalLogs.tsx`, `src/screens/admin/AdminFSCoordinatorDashboard.tsx`, `src/screens/admin/AdminFSStudents.tsx`, `src/screens/admin/AdminFSAdmissions.tsx`, `src/screens/admin/AdminFSClasses.tsx`, `src/screens/admin/AdminFSTeachers.tsx`, `src/screens/admin/AdminFSMaterials.tsx`, `src/screens/admin/AdminFSActivity.tsx`.
8. **Member Screens**: `src/screens/Home.tsx`, `src/screens/Profile.tsx`, `src/screens/BibleHome.tsx`, `src/screens/BibleReaderPage.tsx`, `src/screens/BibleStudyHome.tsx`, `src/screens/BibleStudyReader.tsx`, `src/screens/HymnHome.tsx`, `src/screens/HymnReader.tsx`, `src/screens/FSHome.tsx`, `src/screens/FSReader.tsx`, `src/screens/BookmarksPage.tsx`, `src/screens/Notifications.tsx`, `src/screens/OfflineSyncPage.tsx`.

---

### 0.2 Forensic Discoveries: What Actually Exists vs What Is Mocked

| Subsystem | Frontend Code Existence | Data Source Currently Used | Actual Implementation Reality |
| :--- | :--- | :--- | :--- |
| **Authentication** | `[VERIFIED]` Complete UI & flow | `localStorage` (`asf_user_session`, `asf_auth_token`) | **Passwordless Magic Link** via email. Matric numbers are **NOT** the primary login. Auth state is simulated in `auth.service.ts`. |
| **Website Copy** | `[VERIFIED]` Full Admin Editor & Public Binding | `localStorage` (`asf_website_copy`) | Single JSON model (`WebsiteCopyModel`) holding 5 sections (`hero`, `about`, `life`, `visit`, `cta`). Saving updates the live site immediately. **No separate Draft/Publish lifecycle** exists in storage. |
| **Events** | `[VERIFIED]` Rich calendar, filters, reminders | In-memory `mockEvents` array (`eventData.ts`) | Reads from `mockEvents`. `POST /api/events` is stubbed in `events.service.ts`. Reminders stored in `localStorage` (`asf_event_reminders`). |
| **Announcements** | `[VERIFIED]` Feed, detail view, categories | In-memory `mockAnnouncements` array | Read-only client filtration with simulated offline pre-bundling. |
| **Media Library** | `[VERIFIED]` Admin gallery, tagging, modal upload | In-memory `INITIAL_MEDIA_ITEMS` | Cloudinary presets & URL generator exist in `media.config.ts`. Direct upload is simulated using local state & Unsplash fallbacks. **No secure upload signature endpoint exists**. |
| **Bible & Versions** | `[VERIFIED]` Dual version (KJV & WEB), chapter picker, search | Static data (`bibleData.ts`) | Fully client-side pre-bundled static JSON. API queries `/api/bible/*` are defined in `bible.service.ts` but fall back to local objects when `useMockServices=true`. |
| **Bible Study Manual** | `[VERIFIED]` Weekly outline reader, PDF viewer tab, archive | `mockBibleStudies` (`bibleStudyData.ts`) | Outlines have structured scriptures, study questions, memory verses, and `documentUrl` (PDF). Extraction pipeline in `AdminContentLibrary.tsx` is an **interval timer simulation** using hardcoded Lesson 46 text. |
| **Hymn Book** | `[VERIFIED]` SOP Collection (Hymns 1–400), categories, audio player | `mockHymns` (`hymnData.ts`) | Fully pre-bundled in frontend. Audio URLs point to external audio or mock strings. |
| **Foundational School** | `[VERIFIED]` Complete 7-screen Admin suite + Member Reader | `fsData.ts` & `fsAdminData.ts` | 60+ sample students, teachers, admission forms, and chapters. Deep data structures exist in TypeScript (`fsAdminTypes.ts`) but are 100% in-memory/mocked. |
| **Member Bookmarks** | `[VERIFIED]` Bookmarks Screen | Hardcoded arrays in component | `BookmarksPage.tsx` contains static in-component arrays. No persistence in `localStorage` or backend. |
| **Member Notes** | `[NOT IMPLEMENTED]` | None | Referenced in UI copy, but no persistent note-taking repository exists. |
| **Executive Handover** | `[VERIFIED]` Multi-step wizard & checklists | In-memory `initialHandoverChecklist` in `adminData.ts` | Complete UI and checklist state machine, but updates only exist in React component state. |
| **Governance Requests** | `[VERIFIED]` Dual-approval workflow | In-memory `initialGovernanceRequests` | State transitions (`Approved`, `Rejected`, `Executed`) are executed via React state in `AdminLayout.tsx`. |
| **Technical Logs & Health** | `[VERIFIED]` Filterable log dashboard, health cards | In-memory `initialSystemHealth`, `initialSystemLogs` | UI simulates API Gateway, Gemini Proxy, Firestore DB, and PWA Cache ping checks. |
| **System Settings** | `[VERIFIED]` Admin configuration form | In-memory `initialSystemConfig` | Sync intervals, maintenance mode, cache limits are managed in local state. |

---

### 0.3 Major Uncertainties & Architectural Risks Identified
1. **Website Copy Versioning vs Instant Publish**: The design envisions a "Draft -> Review -> Publish" workflow, but `AdminWebsiteContentEditor.tsx` and `websiteCopy.service.ts` write directly to a single `asf_website_copy` object which instantly alters the public landing page. The backend must introduce true `draft` vs `published` records without breaking the current single-call frontend contract.
2. **Offline Data Volume & Mobile Bandwidth**: The frontend currently bundles KJV, WEB Bible chapters, 400 hymns, and sample studies in JavaScript bundles (`bibleData.ts`, `hymnData.ts`). If the backend replaces this with remote API endpoints without a SQLite/IndexedDB caching layer, the mobile PWA will fail in low-connectivity Nigerian campus environments.
3. **Cloudinary Upload Architecture**: The frontend code has presets and responsive widths (`media.config.ts`) but no secure direct-upload or presigned signature endpoint. The backend must implement signed upload tickets (`/api/v1/media/upload-signature`) so the client uploads directly to Cloudinary without streaming large media files through the backend container.
4. **Bible Study Document Extraction Reality**: `AdminContentLibrary.tsx` has a modal simulating PDF upload and AI extraction using a JavaScript `setInterval` timer that completes in 2.4 seconds and injects static Matthew 13 text. The backend will need a realistic asynchronous document storage and text extraction contract.
5. **Database Multiplicity in UI Copy**: Frontend log simulations in `adminData.ts` mention "Firestore Central Database", while other services use REST endpoints (`apiClient.get('/api/...')`). The backend specification must define a single authoritative database architecture.

---

# 1. PRIMARY OBJECTIVE & CURRENT PLATFORM STATE

### 1.1 What the ASF Digital Platform Is
The Anglican Students' Fellowship (ASF), FUTA Chapter, Digital Platform is an integrated fellowship ecosystem serving undergraduate students, alumni, executive leaders, and fellowship coordinators. It comprises three primary operational surfaces:
1. **Public Information Website**: Responsive landing page providing welcoming copy, meeting schedules, fellowship life photos, first-time visitor guides, and fellowship identity.
2. **Member Progressive Web App (PWA)**: Student-facing portal providing spiritual nourishment and fellowship tools:
   * Scripture reading (KJV and WEB translations).
   * Fellowship Hymn Book (Sacred Songs & Solos / SOP hymnal with 400 hymns).
   * Weekly Bible Study Manual outlines with PDF document viewer and scripture cross-references.
   * Foundational School (discipleship academy) curriculum, progress tracker, and reading modules.
   * Fellowship calendar, event details, and reminder subscriptions.
   * Fellowship announcements and emergency pastoral notices.
   * Personal bookmarks and offline synchronization engine.
3. **Administrative & Governance Workspace**: Multi-domain administrative suite for departmental coordinators and executives:
   * **Publicity & Media**: Website Copy Editor, Media Library (photography & banners), Event Creator, and Announcement Publisher.
   * **Bible Study Department**: Outline library, PDF study manual upload/review, study calendar.
   * **Foundational School Administration**: Admissions review, student roster, chapter grading, teacher assignment, and class management.
   * **Executive Committee (CEC)**: Executive handover workflow, leadership registry, governance requests with dual approvals.
   * **Technical Administration**: System health monitoring, diagnostic logs, and platform configuration.

---

# 2. FRONTEND ARCHITECTURE & DATA TRACEABILITY

### 2.1 Component → Service → Storage Trace
All data interactions in the existing codebase follow a 4-tier abstraction layer:

```
[ UI Component / Screen ]
          │
          ▼
[ React Hook / Custom Context ]
(e.g., useWebsiteContent, useWebsiteCopy, useOutletContext<AdminContextType>)
          │
          ▼
[ Domain Service Abstraction ]
(e.g., authService, eventsService, websiteCopyService, bibleStudyService, fsService)
          │
          ▼
[ Current: LocalStorage / Mock Arrays / DevState ]
          │
          ▼ (Future Backend Target)
[ ApiClient (`src/services/api/client.ts`) ]
          │
          ▼ (HTTP / Bearer Token)
[ Backend REST API Gateway (`/api/v1/*`) ]
```

### 2.2 Client-Side Storage Keys In Use
The frontend currently uses the following explicit `localStorage` keys (verified in `src/config/app.config.ts` and domain services):
* `asf_user_session`: Serialized `UserProfile` object representing current authenticated session.
* `asf_auth_token`: Bearer JWT token string.
* `asf_admin_role`: Currently simulated administrative role in Admin Workspace.
* `asf_website_copy`: Serialized `WebsiteCopyModel` JSON holding the 5 landing page sections.
* `asf_event_reminders`: JSON array of string IDs representing event reminder subscriptions.
* `asf_offline_events`: Cached snapshot of prebundled events.
* `asf_offline_announcements`: Cached snapshot of prebundled announcements.
* `asf_dev_state`: Debug simulation settings (role overrides, mock latency, empty state toggles).

---

# 3. FRONTEND → BACKEND REQUIREMENT MATRIX

| Module / Feature | Existing Frontend Screen | Current Data Mechanism | Backend Needed? | Backend Engineering Responsibility | Priority |
| :--- | :--- | :--- | :---: | :--- | :---: |
| **Magic Link Auth** | `SignIn.tsx`, `CheckEmail.tsx`, `WelcomeBack.tsx` | Simulated in `auth.service.ts` | **YES** | Generate cryptographically secure single-use tokens; dispatch email via SMTP/Resend; verify token; issue signed JWT. | `CRITICAL (P0)` |
| **User Profile & RBAC** | `Profile.tsx`, `AdminLayout.tsx` | `localStorage` (`asf_user_session`) | **YES** | Store user accounts, roles, departmental metadata; return authenticated user in `GET /api/v1/auth/me`. | `CRITICAL (P0)` |
| **Website Copy** | `AdminWebsiteContentEditor.tsx`, `PublicHome.tsx` | `localStorage` (`asf_website_copy`) | **YES** | Multi-section copy storage; draft vs published separation; version incrementing; audit trail logging. | `HIGH (P1)` |
| **Announcements** | `AnnouncementHome.tsx`, `AnnouncementDetail.tsx` | Static array `mockAnnouncements` | **YES** | CRUD endpoints; authoring metadata; category filtering; publish status flag; pinned announcements. | `HIGH (P1)` |
| **Events & Timetable** | `EventHome.tsx`, `EventDetail.tsx`, `AdminEvents.tsx` | Static array `mockEvents` | **YES** | CRUD endpoints; semester schedule; date/horizon filtering (`upcoming`, `today`, `past`); calendar metadata. | `HIGH (P1)` |
| **Media Library** | `AdminMediaLibrary.tsx` | In-memory `INITIAL_MEDIA_ITEMS` | **YES** | Media metadata catalog; presigned Cloudinary upload signatures; tagging; status toggle (`Live` vs `Hidden`). | `HIGH (P1)` |
| **Bible Study Manual** | `BibleStudyHome.tsx`, `BibleStudyReader.tsx`, `AdminContentLibrary.tsx` | Static array `mockBibleStudies` | **YES** | Structured outline JSON storage; document URL linking; PDF file hosting; publishing workflow (`Draft` -> `Published`). | `HIGH (P1)` |
| **Event Reminders** | `EventDetail.tsx`, `reminders.service.ts` | `localStorage` (`asf_event_reminders`) | **YES** | User reminder subscription table; push notification scheduling or email dispatch queue. | `MEDIUM (P2)` |
| **Foundational School** | `AdminFSStudents.tsx`, `AdminFSAdmissions.tsx`, `FSReader.tsx` | Static `fsData.ts` & `fsAdminData.ts` | **YES** | Student rosters, admission applications, progress tracking per chapter, facilitator notes, certification records. | `MEDIUM (P2)` |
| **Governance & CEC** | `AdminGovernance.tsx`, `AdminHandover.tsx`, `AdminLeadership.tsx` | Static `adminData.ts` | **YES** | Executive office roster; formal governance request state machine; handover checklist persistence. | `MEDIUM (P2)` |
| **Audit Logs** | `AdminTechnicalLogs.tsx`, `AdminWebsiteContentEditor.tsx` | In-memory `initialAuditLogs` | **YES** | Immutable append-only audit trail logging administrative modifications, actor IDs, IP addresses, and timestamps. | `HIGH (P1)` |
| **System Settings** | `AdminSystemConfiguration.tsx` | In-memory `initialSystemConfig` | **YES** | Global key-value system configuration store (maintenance mode, cache limits, study language defaults). | `LOW (P3)` |
| **Bible Text Engine** | `BibleReaderPage.tsx`, `BibleSearchPage.tsx` | Prebundled `bibleData.ts` | **OPTIONAL** | Frontend can remain offline-first with prebundled JSON or query backend API when online. | `LOW (P3)` |
| **Hymn Collection** | `HymnHome.tsx`, `HymnReader.tsx` | Prebundled `hymnData.ts` | **OPTIONAL** | Static hymnal content prebundled on client; backend only needed for remote audio streaming URLs or dynamic additions. | `LOW (P3)` |
| **Member Bookmarks** | `BookmarksPage.tsx` | Hardcoded in component | **YES** | User bookmark sync across devices (saved study IDs, hymn IDs, and scripture verses). | `MEDIUM (P2)` |

---

# 4. BACKEND BOUNDARY DEFINITION

### 4.1 What the Backend IS Responsible For
1. **Security & Identity**: Authentication credential verification, magic link token lifecycle, JWT issuance, passwordless login rate limiting, and server-side RBAC validation.
2. **Authoritative Persistence**: Transactional relational storage for users, roles, website copy versions, announcements, events, Bible study outlines, Foundational School rosters, and executive governance workflows.
3. **Publishing Integrity**: Enforcing publication states (`Draft`, `Pending Review`, `Approved`, `Published`, `Archived`) so unapproved or draft content is never served to the public or general members.
4. **Asset Security & Authorization**: Signing Cloudinary upload tickets using secret API keys; ensuring only authorized Publicity Coordinators can upload or delete media.
5. **Data Auditability**: Maintaining immutable audit logs of all state modifications (who edited website copy, who approved admissions, who triggered role handovers).
6. **Data Sanitization & Integrity**: Validating all payloads (schema, string lengths, HTML escaping to prevent XSS).
7. **Offline Sync Signposts**: Generating entity `version` integers, `updatedAt` ISO timestamps, and soft-delete tombstones (`deletedAt`) to enable deterministic client synchronization.

### 4.2 What the Frontend REMAINS Responsible For
1. **Offline Capability & Local Caching**: Service Worker asset caching, IndexedDB caching for large Bible/Hymn texts, and fallback rendering when network requests fail.
2. **Optimistic UI Updates**: Immediate client responsiveness during copy edits, event bookmarking, and reading progress toggling.
3. **Image Transformation URLs**: Constructing Cloudinary URLs using client-side breakpoints and presets (`w_1200,c_fill,f_auto,q_auto`) using the base URL returned by the backend.
4. **Client-Side Form Validation**: Real-time email syntax checks, missing field warnings, and character counts before network submission.
5. **Presentation & Layout Transitions**: Responsive Tailwind rendering, Lucide SVG iconography, and routing.

---

# 5. ROLE & PERMISSION ARCHITECTURE

### 5.1 Verified Roles
From `src/types/role.ts` and `src/types/adminTypes.ts`, the platform defines 17 specific user roles and 11 administrative offices:

**Standard Fellowship Roles**:
1. `Guest` (`RoleLevel.PUBLIC = 0`)
2. `Member` / `Regular Member` (`RoleLevel.MEMBER = 10`)
3. `FS Student` (`RoleLevel.FS_STUDENT = 15`)
4. `FS Teacher` (`RoleLevel.FS_TEACHER = 20`)
5. `Alumni` (`RoleLevel.MEMBER = 10`)

**Administrative & Executive Offices (`VALID_ADMIN_ROLES`)**:
6. `President / Executive` (Global Executive Authority)
7. `VP / FS Coordinator` (Foundational School Authority)
8. `Publicity Coordinator` (Publicity & Media Domain Authority)
9. `Bible Study Coordinator` (Bible Study Curriculum Authority)
10. `General Secretary` (Secretariat & Official Records Authority)
11. `Organizing Coordinator` (Organizing & Logistics Authority)
12. `Drama Coordinator` (Drama Ministry Authority)
13. `Prayer Coordinator` (Prayer & Intercession Authority)
14. `Financial Secretary` (Finance & Accounts Authority)
15. `Treasurer` (Treasury & Assets Authority)
16. `Librarian` (Library & Resources Authority)
17. `Choir Coordinator` (Music Ministry Authority)

---

### 5.2 Verified Authorization Matrix (Codebase Ground Truth)

| Verified Permission Key (`src/types/adminTypes.ts`) | Member | FS Student | FS Teacher | Publicity Coord | Bible Study Coord | VP / FS Coord | President / Exec | Technical Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `view_member_content` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `view_fs_materials` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `manage_fs_school` | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ |
| `create_events` / `edit_events` | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ | ✓ |
| `delete_events` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| `publish_announcements` | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ |
| `manage_members` | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ | ✓ |
| `manage_leadership` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| `access_admin_dashboard` | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `manage_system_settings` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| `websiteCopy.edit` `[INFERRED]` | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ | ✓ |
| `websiteCopy.publish` `[INFERRED]` | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ | ✓ |
| `media.upload` / `media.delete` | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ | ✓ |
| `bibleStudy.create` / `publish` | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | ✓ |
| `fs.admissions.review` | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| `governance.approve` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| `system.technicalAdmin` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

---

# 6. WEBSITE COPY MANAGEMENT ARCHITECTURE

### 6.1 Current Frontend Reality vs Architectural Goal
* **Current Frontend Implementation `[VERIFIED]`**:
  * Stored as a single monolithic JSON document in `localStorage` under `asf_website_copy`.
  * The model (`WebsiteCopyModel`) contains 5 sections: `hero`, `about`, `life`, `visit`, `cta`, plus top-level metadata: `lastUpdated`, `updatedBy`, `version`.
  * The admin form updates local state and writes back the entire object via `websiteCopyService.saveCopy(...)`.
  * The public website subscribes directly to this object via `useWebsiteContent()`.
  * **There is currently NO database separation between Draft and Published states on the client**. Saving immediately modifies what the public sees.

### 6.2 Proposed Authoritative Backend Architecture `[PROPOSED]`
To fulfill the project's governance requirements without breaking the frontend's single-object contract:
1. The backend stores website copy in a **versioned relational entity** (`website_copy_versions`) and a **singleton pointer table** (`website_copy_state`).
2. The backend maintains two distinct active states:
   * **`published_version_id`**: The copy currently served to unauthenticated public visitors (`GET /api/v1/public/website-copy`).
   * **`draft_version_id`**: The copy currently being modified in the Admin Workspace (`GET /api/v1/admin/website-copy/draft`).
3. When the Publicity Coordinator saves in `AdminWebsiteContentEditor.tsx`:
   * The client calls `PUT /api/v1/admin/website-copy/draft`.
   * This updates or creates a draft version without affecting the public site.
4. When the Publicity Coordinator clicks "Publish":
   * The client calls `POST /api/v1/admin/website-copy/publish`.
   * The backend promotes the current draft to `published`, increments the version number, creates an audit record, and updates the public cache.
5. An emergency reset endpoint (`POST /api/v1/admin/website-copy/reset`) restores the factory-default copy verified in `websiteCopy.service.ts`.

---

# 7. MEDIA & CLOUDINARY ARCHITECTURE

### 7.1 Forensic Inspection of Existing Media Layer
* **Config `[VERIFIED]`**: `src/config/media.config.ts` configures `cloudinaryBaseUrl` (`https://res.cloudinary.com/asf-futa/image/upload`), transformation presets (`hero`, `card`, `thumbnail`, `avatar`, `banner`, `raw`), and responsive widths (`[320, 640, 768, 1024, 1280, 1600]`).
* **Admin Screen `[VERIFIED]`**: `src/screens/admin/AdminMediaLibrary.tsx` manages media assets with properties: `id`, `title`, `event`, `category`, `status` (`Live` | `Hidden`), `uploadDate`, `dimensions`, `fileSize`, `imageUrl`, `tags`.
* **Security Risk**: The frontend must **NEVER** possess the Cloudinary API Secret. Uploads must not be unauthenticated.

### 7.2 Secure Upload Flow `[PROPOSED]`
To preserve security and eliminate backend file buffering:

```
[ Admin Client (AdminMediaLibrary.tsx) ]
               │
               │ 1. POST /api/v1/media/upload-signature
               │    (Requires 'media.upload' permission)
               ▼
   [ ASF Backend API Gateway ]
               │
               │ 2. Generates SHA1/SHA256 signature using CLOUDINARY_API_SECRET
               │    Returns { signature, timestamp, apiKey, cloudName, folder }
               ▼
[ Admin Client (AdminMediaLibrary.tsx) ]
               │
               │ 3. Direct Multipart POST to Cloudinary API
               │    (https://api.cloudinary.com/v1_1/<cloud_name>/image/upload)
               ▼
      [ Cloudinary CDN ]
               │
               │ 4. Returns { public_id, secure_url, width, height, format, bytes }
               ▼
[ Admin Client (AdminMediaLibrary.tsx) ]
               │
               │ 5. POST /api/v1/media/assets
               │    Payload: { title, event, category, publicId, secureUrl, ... }
               ▼
   [ ASF Backend Database ] (Stores record in `media_assets` table)
```

---

# 8. BIBLE STUDY & DOCUMENT PROCESSING PIPELINE

### 8.1 Forensic Inspection of Current Implementation
* **Frontend Screen `[VERIFIED]`**: `src/screens/admin/AdminContentLibrary.tsx` features a 3-step modal:
  * Step 1: File selection (`.pdf` input or drag & drop).
  * Step 2: "Extracting Theology & Context..." featuring a simulated 0% -> 100% progress bar executed via a JavaScript `setInterval` timer.
  * Step 3: Review form pre-populated with hardcoded mock text (Lesson 46, Matthew 13:1-23, memory verse, intro, and 4 questions).
* **Document Viewer `[VERIFIED]`**: `src/components/bibleStudy/StudyDocumentViewer.tsx` displays embedded PDF manuals inside an `<iframe>` toolbar using `documentUrl`.

### 8.2 Backend Responsibility vs AI/Worker Responsibility `[PROPOSED]`
1. **Document Storage Responsibility**:
   * The backend stores the raw PDF in Cloudinary (or Google Cloud Storage / S3) under `/bible-studies/manuals/`.
   * The backend creates a `bible_studies` database record containing `document_url` and `document_type = 'pdf'`.
2. **Text & Reference Extraction Responsibility**:
   * **Phase 1 (Immediate / MVP)**: The backend accepts the file upload, stores the URL, and allows the Bible Study Coordinator to manually type or verify the title, scripture references, and questions in the existing review form.
   * **Phase 2 (Automated AI Extraction)**: An asynchronous background endpoint (`POST /api/v1/bible-studies/extract-document`) passes the document buffer to the Gemini API (`gemini-2.5-flash`) to parse structured sections, scripture references, and discussion questions into the JSON schema defined in `src/types/bibleStudy.ts`.

---

# 9. DATABASE ARCHITECTURE & SCHEMAS

### 9.1 Database Technology Selection
* **Architecture**: Relational Database (PostgreSQL / Cloud SQL / Supabase / Neon).
* **Reasoning**: The ASF platform features highly structured relationships: Users have Roles and Overrides; Governance Requests require dual member signatures; Foundational School Students have Class Levels, Teachers, and Chapter Progress; Audit Logs require referential integrity.
* **ORM Recommendation**: Drizzle ORM or Prisma (TypeScript type-safe, lightweight, zero runtime bloat).

---

### 9.2 Complete Entity Definitions

#### Entity 1: `users` `[REQUIRED]`
* **Purpose**: Core user account directory for all fellowship members, coordinators, and executives.
* **Why it exists**: Backs `src/types/user.ts` (`UserProfile`) and authentication.
* **Fields**:
  * `id` (`VARCHAR(36)` / `UUID`): Primary Key.
  * `email` (`VARCHAR(255)`): Unique, Indexed. Normalized to lowercase.
  * `full_name` (`VARCHAR(255)`): Required.
  * `department` (`VARCHAR(150)`): Optional (e.g. "Computer Science").
  * `academic_level` (`VARCHAR(50)`): Optional (e.g. "100 Level", "400 Level", "Alumni").
  * `subgroup` (`VARCHAR(100)`): Optional (e.g. "Technical Team", "Choir", "Ushering").
  * `phone_number` (`VARCHAR(30)`): Optional.
  * `role` (`VARCHAR(50)`): Required. Default `'Member'`. Maps to `UserRole`.
  * `is_alumni` (`BOOLEAN`): Default `false`.
  * `status` (`VARCHAR(30)`): Default `'Active'` (`'Active'`, `'Suspended'`, `'Graduated'`).
  * `avatar_url` (`TEXT`): Optional.
  * `created_at` (`TIMESTAMPTZ`): Default `NOW()`.
  * `updated_at` (`TIMESTAMPTZ`): Default `NOW()`.
  * `last_active_at` (`TIMESTAMPTZ`): Optional.

#### Entity 2: `magic_link_tokens` `[REQUIRED]`
* **Purpose**: Ephemeral tokens for passwordless authentication.
* **Why it exists**: Backs `POST /api/auth/magic-link` and `POST /api/auth/verify`.
* **Fields**:
  * `id` (`UUID`): Primary Key.
  * `token_hash` (`VARCHAR(255)`): Unique, Indexed. Cryptographic SHA-256 hash of random token.
  * `email` (`VARCHAR(255)`): Required.
  * `payload` (`JSONB`): Optional metadata passed during registration (name, department, level, subgroup).
  * `expires_at` (`TIMESTAMPTZ`): Required (15 minutes from generation).
  * `consumed_at` (`TIMESTAMPTZ`): Nullable. Set upon successful verification.
  * `ip_address` (`VARCHAR(45)`): Security audit.
  * `created_at` (`TIMESTAMPTZ`): Default `NOW()`.

#### Entity 3: `permission_overrides` `[REQUIRED]`
* **Purpose**: Dynamic grant or revocation of permissions per member outside their base role.
* **Why it exists**: Backs `AdminMember.overrides` and `src/auth/permissions.ts`.
* **Fields**:
  * `id` (`UUID`): Primary Key.
  * `user_id` (`UUID`): FK -> `users(id)` ON DELETE CASCADE.
  * `permission_key` (`VARCHAR(100)`): Required. Maps to `PermissionKey`.
  * `override_type` (`VARCHAR(20)`): `'GRANTED'` or `'REVOKED'`.
  * `assigned_by` (`UUID`): FK -> `users(id)`.
  * `created_at` (`TIMESTAMPTZ`): Default `NOW()`.

#### Entity 4: `website_copy_versions` `[REQUIRED]`
* **Purpose**: Immutable history of website copy configurations.
* **Why it exists**: Backs `WebsiteCopyModel` and `AdminWebsiteContentEditor.tsx`.
* **Fields**:
  * `id` (`UUID`): Primary Key.
  * `version_number` (`INTEGER`): Incremental. Indexed.
  * `hero` (`JSONB`): Required. Matching `HeroSectionCopy` structure.
  * `about` (`JSONB`): Required. Matching `AboutSectionCopy` structure.
  * `life` (`JSONB`): Required. Matching `LifeSectionCopy` structure.
  * `visit` (`JSONB`): Required. Matching `VisitSectionCopy` structure.
  * `cta` (`JSONB`): Required. Matching `CtaSectionCopy` structure.
  * `created_by_user_id` (`UUID`): FK -> `users(id)`.
  * `created_by_role` (`VARCHAR(50)`): Role string snapshot.
  * `created_at` (`TIMESTAMPTZ`): Default `NOW()`.

#### Entity 5: `website_copy_state` `[REQUIRED]`
* **Purpose**: Singleton pointer maintaining the current live published version and active working draft.
* **Fields**:
  * `id` (`INTEGER`): Primary Key (Value: `1`).
  * `published_version_id` (`UUID`): FK -> `website_copy_versions(id)`.
  * `draft_version_id` (`UUID`): FK -> `website_copy_versions(id)`.
  * `updated_at` (`TIMESTAMPTZ`): Default `NOW()`.

#### Entity 6: `events` `[REQUIRED]`
* **Purpose**: Fellowship gatherings, vigils, Sunday services, and rehearsals.
* **Why it exists**: Backs `src/types/event.ts` (`EventItem`) and `AdminEvents.tsx`.
* **Fields**:
  * `id` (`VARCHAR(50)`): Primary Key (e.g. `evt-1725600000`).
  * `title` (`VARCHAR(255)`): Required.
  * `short_description` (`VARCHAR(300)`): Required.
  * `description` (`TEXT`): Required.
  * `category` (`VARCHAR(50)`): Required. (`Worship`, `Bible Study`, `Vigil`, `Special`, `Outreach`).
  * `start_date` (`DATE`): Required.
  * `start_time` (`VARCHAR(20)`): Required (e.g. `'8:00 AM'`).
  * `end_time` (`VARCHAR(20)`): Optional (e.g. `'11:30 AM'`).
  * `month` (`VARCHAR(10)`): Derived (e.g. `'OCT'`).
  * `day_number` (`VARCHAR(5)`): Derived (e.g. `'25'`).
  * `venue` (`VARCHAR(255)`): Required.
  * `address` (`VARCHAR(255)`): Optional.
  * `mode` (`VARCHAR(30)`): Default `'In-Person'` (`'In-Person'`, `'Online'`, `'Hybrid'`).
  * `organizer` (`VARCHAR(150)`): Default `'ASF Executive Committee'`.
  * `status` (`VARCHAR(50)`): Required. (`'Upcoming'`, `'Happening Today'`, `'Past'`).
  * `theme` (`VARCHAR(255)`): Optional.
  * `speaker` (`VARCHAR(150)`): Optional.
  * `banner_url` (`TEXT`): Optional.
  * `is_featured` (`BOOLEAN`): Default `false`.
  * `is_prebundled_offline` (`BOOLEAN`): Default `false`.
  * `created_by` (`UUID`): FK -> `users(id)`.
  * `created_at` (`TIMESTAMPTZ`): Default `NOW()`.
  * `updated_at` (`TIMESTAMPTZ`): Default `NOW()`.
  * `deleted_at` (`TIMESTAMPTZ`): Soft delete support.

#### Entity 7: `event_reminders` `[REQUIRED]`
* **Purpose**: Tracks member reminders for upcoming fellowship events.
* **Why it exists**: Backs `reminders.service.ts` and `src/types/reminder.ts`.
* **Fields**:
  * `id` (`UUID`): Primary Key.
  * `user_id` (`UUID`): FK -> `users(id)` ON DELETE CASCADE.
  * `event_id` (`VARCHAR(50)`): FK -> `events(id)` ON DELETE CASCADE.
  * `offset_minutes` (`INTEGER`): Default `30` (e.g., 15, 30, 60, 1440).
  * `is_dispatched` (`BOOLEAN`): Default `false`.
  * `created_at` (`TIMESTAMPTZ`): Default `NOW()`.
* **Constraints**: Unique constraint on `(user_id, event_id)`.

#### Entity 8: `announcements` `[REQUIRED]`
* **Purpose**: Official announcements, executive notices, and prayer alerts.
* **Why it exists**: Backs `src/types/index.ts` (`Announcement`) and `announcements.service.ts`.
* **Fields**:
  * `id` (`VARCHAR(50)`): Primary Key.
  * `title` (`VARCHAR(255)`): Required.
  * `summary` (`TEXT`): Required.
  * `content` (`TEXT`): Required. Supports markdown.
  * `category` (`VARCHAR(50)`): Required. (`Fellowship`, `Foundational School`, `Bible Study`, `Academic`, `General`).
  * `date` (`VARCHAR(30)`): Display date string.
  * `author` (`VARCHAR(150)`): Required.
  * `author_role` (`VARCHAR(100)`): Required.
  * `author_user_id` (`UUID`): Optional FK -> `users(id)`.
  * `is_pinned` (`BOOLEAN`): Default `false`.
  * `is_urgent` (`BOOLEAN`): Default `false`.
  * `is_prebundled_offline` (`BOOLEAN`): Default `false`.
  * `created_at` (`TIMESTAMPTZ`): Default `NOW()`.
  * `updated_at` (`TIMESTAMPTZ`): Default `NOW()`.
  * `deleted_at` (`TIMESTAMPTZ`): Soft delete support.

#### Entity 9: `media_assets` `[REQUIRED]`
* **Purpose**: Visual asset catalog backing the publicity media library.
* **Why it exists**: Backs `AdminMediaLibrary.tsx` and `MediaAsset` interface.
* **Fields**:
  * `id` (`VARCHAR(50)`): Primary Key.
  * `title` (`VARCHAR(255)`): Required.
  * `event_name` (`VARCHAR(255)`): Optional.
  * `category` (`VARCHAR(50)`): Required (`Retreat`, `Worship`, `Outreach`, `Flyer`, `Fellowship`).
  * `status` (`VARCHAR(20)`): Required (`'Live'`, `'Hidden'`, `'Draft'`).
  * `dimensions` (`VARCHAR(30)`): e.g. `'1920x1080'`.
  * `file_size_bytes` (`BIGINT`): File size.
  * `public_id` (`VARCHAR(255)`): Cloudinary Public ID.
  * `secure_url` (`TEXT`): Cloudinary HTTPS URL.
  * `tags` (`TEXT[]`): Array of search tags.
  * `uploaded_by` (`UUID`): FK -> `users(id)`.
  * `created_at` (`TIMESTAMPTZ`): Default `NOW()`.
  * `updated_at` (`TIMESTAMPTZ`): Default `NOW()`.

#### Entity 10: `bible_studies` `[REQUIRED]`
* **Purpose**: Weekly Bible study manual outlines, questions, and attached documents.
* **Why it exists**: Backs `src/types/bibleStudy.ts` (`BibleStudyItem`).
* **Fields**:
  * `id` (`VARCHAR(50)`): Primary Key (e.g. `bs-01`).
  * `lesson_number` (`INTEGER`): Required. Indexed.
  * `title` (`VARCHAR(255)`): Required.
  * `annual_theme` (`VARCHAR(255)`): Optional.
  * `sub_theme` (`VARCHAR(255)`): Required.
  * `study_date` (`DATE`): Required.
  * `key_scripture` (`VARCHAR(150)`): Required (e.g. `'Matthew 13:1-23'`).
  * `text_scriptures` (`TEXT[]`): Optional array of companion references.
  * `summary` (`TEXT`): Required.
  * `aims` (`TEXT[]`): Array of lesson goals.
  * `introduction` (`TEXT`): Required.
  * `sections` (`JSONB`): Array of `BibleStudySection` objects.
  * `study_guide` (`JSONB`): Array of `StudyQuestionItem` objects.
  * `discussion_questions` (`TEXT[]`): Required array of discussion questions.
  * `conclusion` (`TEXT`): Optional.
  * `memory_verse_ref` (`VARCHAR(100)`): Required.
  * `memory_verse_text` (`TEXT`): Required.
  * `prayer_points` (`TEXT[]`): Array of prayer prompts.
  * `author` (`VARCHAR(150)`): e.g. `'Bible Study Secretary'`.
  * `document_url` (`TEXT`): URL to attached study manual PDF.
  * `document_type` (`VARCHAR(20)`): `'pdf'`, `'html'`, or `'external'`.
  * `is_current` (`BOOLEAN`): Default `false`.
  * `is_published` (`BOOLEAN`): Default `false`. Indexed.
  * `created_by` (`UUID`): FK -> `users(id)`.
  * `created_at` (`TIMESTAMPTZ`): Default `NOW()`.
  * `updated_at` (`TIMESTAMPTZ`): Default `NOW()`.

#### Entity 11: `fs_students` `[REQUIRED]`
* **Purpose**: Foundational School student enrollment and discipleship tracking.
* **Why it exists**: Backs `src/types/fsAdminTypes.ts` (`FSStudent`).
* **Fields**:
  * `id` (`UUID`): Primary Key.
  * `fs_id_number` (`VARCHAR(30)`): Unique. e.g. `'FS-2025-001'`.
  * `user_id` (`UUID`): Optional FK -> `users(id)`.
  * `name` (`VARCHAR(255)`): Required.
  * `email` (`VARCHAR(255)`): Required.
  * `phone` (`VARCHAR(30)`): Required.
  * `department` (`VARCHAR(150)`): Required.
  * `academic_level` (`VARCHAR(50)`): Required.
  * `foundational_level` (`VARCHAR(100)`): Required (e.g. `'Level 1: Basic Doctrines'`).
  * `status` (`VARCHAR(30)`): Required (`'Active'`, `'Completed'`, `'Pending Review'`, `'Needs Attention'`).
  * `previous_affiliation` (`TEXT`): Church background.
  * `enrollment_date` (`DATE`): Required.
  * `assigned_teacher_id` (`UUID`): Optional FK -> `users(id)`.
  * `assigned_teacher_name` (`VARCHAR(255)`): Optional cache.
  * `completed_chapters_count` (`INTEGER`): Default `0`.
  * `total_chapters_count` (`INTEGER`): Default `12`.
  * `attendance_percent` (`INTEGER`): Default `100`.
  * `is_verified` (`BOOLEAN`): Default `true`.
  * `completion_certified` (`BOOLEAN`): Default `false`.
  * `completion_certified_date` (`DATE`): Optional.
  * `created_at` (`TIMESTAMPTZ`): Default `NOW()`.
  * `updated_at` (`TIMESTAMPTZ`): Default `NOW()`.

#### Entity 12: `fs_chapter_progress` `[REQUIRED]`
* **Purpose**: Chapter-by-chapter progression per discipleship student.
* **Why it exists**: Backs `FSChapterProgress` in `fsAdminTypes.ts`.
* **Fields**:
  * `id` (`UUID`): Primary Key.
  * `student_id` (`UUID`): FK -> `fs_students(id)` ON DELETE CASCADE.
  * `chapter_number` (`INTEGER`): Required.
  * `title` (`VARCHAR(255)`): Required.
  * `status` (`VARCHAR(30)`): Required (`'Completed'`, `'In Progress'`, `'Not Started'`).
  * `completed_date` (`DATE`): Optional.
  * `score` (`INTEGER`): Optional (percentage 0-100).
  * `facilitator_feedback` (`TEXT`): Optional notes from teacher.
  * `updated_at` (`TIMESTAMPTZ`): Default `NOW()`.
* **Constraints**: Unique constraint on `(student_id, chapter_number)`.

#### Entity 13: `fs_admissions` `[REQUIRED]`
* **Purpose**: Intake applications for new converts and members joining discipleship school.
* **Why it exists**: Backs `FSAdmissionApplication` in `fsAdminTypes.ts`.
* **Fields**:
  * `id` (`UUID`): Primary Key.
  * `applicant_name` (`VARCHAR(255)`): Required.
  * `email` (`VARCHAR(255)`): Required.
  * `phone` (`VARCHAR(30)`): Required.
  * `department` (`VARCHAR(150)`): Required.
  * `academic_level` (`VARCHAR(50)`): Required.
  * `previous_church_affiliation` (`TEXT`): Required.
  * `salvation_testimony_summary` (`TEXT`): Required.
  * `reason_for_joining` (`TEXT`): Required.
  * `status` (`VARCHAR(30)`): Default `'Pending Review'` (`'Pending Review'`, `'Approved'`, `'Interview Scheduled'`, `'Declined'`).
  * `assigned_foundational_level` (`VARCHAR(100)`): Optional.
  * `reviewer_notes` (`TEXT`): Optional.
  * `reviewed_by` (`UUID`): Optional FK -> `users(id)`.
  * `application_date` (`TIMESTAMPTZ`): Default `NOW()`.

#### Entity 14: `governance_requests` `[REQUIRED]`
* **Purpose**: Formal executive requests requiring constitutional quorum/approval.
* **Why it exists**: Backs `GovernanceRequest` in `adminTypes.ts` and `AdminGovernance.tsx`.
* **Fields**:
  * `id` (`VARCHAR(50)`): Primary Key (e.g. `gov-req-1`).
  * `title` (`VARCHAR(255)`): Required.
  * `office` (`VARCHAR(100)`): Required office initiating request.
  * `submitted_by_user_id` (`UUID`): FK -> `users(id)`.
  * `submitted_by_name` (`VARCHAR(255)`): Submitter name cache.
  * `date` (`VARCHAR(30)`): Submitting date string.
  * `type` (`VARCHAR(50)`): Required (`'Role Handover'`, `'Constitutional Amendment'`, `'Budget Approval'`, `'Curriculum Change'`).
  * `summary` (`TEXT`): Required.
  * `impact` (`TEXT`): Required.
  * `status` (`VARCHAR(30)`): Default `'Pending'` (`'Pending'`, `'Approved'`, `'Executed'`, `'Rejected'`).
  * `required_approvals` (`INTEGER`): Default `2`.
  * `current_approvals` (`TEXT[]`): Array of approver user IDs or office titles.
  * `consequences` (`TEXT[]`): Array of operational impacts.
  * `is_destructive` (`BOOLEAN`): Default `false`.
  * `created_at` (`TIMESTAMPTZ`): Default `NOW()`.
  * `executed_at` (`TIMESTAMPTZ`): Optional.

#### Entity 15: `audit_logs` `[REQUIRED]`
* **Purpose**: Immutable, tamper-evident log of administrative actions.
* **Why it exists**: Backs `AuditLog` in `adminTypes.ts` and `AdminTechnicalLogs.tsx`.
* **Fields**:
  * `id` (`VARCHAR(50)`): Primary Key (e.g. `log-001`).
  * `timestamp` (`TIMESTAMPTZ`): Default `NOW()`. Indexed.
  * `actor_user_id` (`UUID`): Optional FK -> `users(id)`.
  * `actor_name` (`VARCHAR(255)`): Required.
  * `actor_role` (`VARCHAR(100)`): Required.
  * `action` (`VARCHAR(100)`): Required (e.g. `'UPDATE_WEBSITE_COPY'`, `'CREATE_EVENT'`, `'APPROVE_ADMISSION'`).
  * `target` (`VARCHAR(255)`): Target entity or ID (e.g. `'v2'`, `'evt-1725600000'`).
  * `details` (`TEXT`): Human-readable description of change.
  * `severity` (`VARCHAR(20)`): Default `'Info'` (`'Info'`, `'Warning'`, `'Error'`, `'Success'`).
  * `ip_address` (`VARCHAR(45)`): Optional client IP.

#### Entity 16: `user_bookmarks` `[REQUIRED]`
* **Purpose**: Cross-device persistence of member bookmarks for studies, hymns, and scriptures.
* **Why it exists**: Backs `BookmarksPage.tsx`.
* **Fields**:
  * `id` (`UUID`): Primary Key.
  * `user_id` (`UUID`): FK -> `users(id)` ON DELETE CASCADE.
  * `item_type` (`VARCHAR(30)`): Required (`'bible_study'`, `'bible_passage'`, `'hymn'`).
  * `item_id` (`VARCHAR(100)`): Required (study ID, hymn ID, or scripture ref).
  * `title` (`VARCHAR(255)`): Required.
  * `subtitle` (`VARCHAR(255)`): Optional.
  * `metadata` (`JSONB`): Optional metadata (version, chapter, verse).
  * `created_at` (`TIMESTAMPTZ`): Default `NOW()`.
* **Constraints**: Unique constraint on `(user_id, item_type, item_id)`.

---

### 9.3 Textual Entity-Relationship Diagram (ERD)

```
[ users ]
   │
   ├── (1:N) ──< magic_link_tokens
   ├── (1:N) ──< permission_overrides
   ├── (1:N) ──< event_reminders >── (N:1) ──[ events ]
   ├── (1:N) ──< user_bookmarks
   ├── (1:N) ──< audit_logs
   ├── (1:N) ──< media_assets
   ├── (1:N) ──< bible_studies
   ├── (1:N) ──< fs_students (as assigned teacher)
   │                  │
   │                  └── (1:N) ──< fs_chapter_progress
   │
   └── (1:N) ──< governance_requests

[ website_copy_versions ]
   │
   └── (N:1) ──< website_copy_state (singleton pointers to published & draft)
```

---

# 10. API ARCHITECTURE & CONVENTIONS

### 10.1 Standards & Protocol
* **Architecture**: Pragmatic RESTful JSON API.
* **Base URL**: `/api/v1`
* **Transport**: HTTPS strictly enforced in production.
* **Authentication**: HTTP Authorization Header with Bearer JWT: `Authorization: Bearer <token>`.
* **Content Negotiation**: `Accept: application/json`, `Content-Type: application/json`.

### 10.2 Standard Response Wrapper
All successful responses return HTTP status codes `200`, `201`, or `204` with a consistent envelope:

```typescript
export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    version?: number;
    timestamp: string;
  };
}
```

### 10.3 Standard Error Contract
All failure responses return HTTP status codes `400`, `401`, `403`, `404`, `409`, `429`, or `500` with a consistent error structure matching `src/services/api/types.ts`:

```typescript
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;           // Machine-readable (e.g. "AUTH_TOKEN_EXPIRED", "VALIDATION_FAILED")
    message: string;        // Human-readable summary
    statusCode: number;     // HTTP status mirroring response
    details?: Array<{       // Field-specific validation failures
      field: string;
      message: string;
    }>;
    requestId?: string;     // Correlation ID for technical log inspection
  };
}
```

---

# 11. COMPLETE API ROUTE INVENTORY

### Module 1: Authentication & Identity

#### `POST /api/v1/auth/magic-link`
* **Purpose**: Request a passwordless login or registration link.
* **Auth Required**: No.
* **Rate Limit**: 5 requests per 15 minutes per IP/Email.
* **Request Body**:
  ```json
  {
    "email": "brother@asf-futa.org",
    "name": "Samuel Adebayo",
    "department": "Computer Science",
    "level": "400 Level",
    "subgroup": "Technical Team",
    "isSignUp": false
  }
  ```
* **Validation**: `email` must be valid format. If `isSignUp=true`, `name` and `department` are required.
* **Response `(200 OK)`**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Magic link dispatched to brother@asf-futa.org"
    }
  }
  ```
* **Requirement Source**: `src/services/auth/auth.service.ts`, `src/screens/SignIn.tsx`.

#### `POST /api/v1/auth/verify`
* **Purpose**: Validate single-use token from email magic link and issue authenticated session token.
* **Auth Required**: No.
* **Request Body**:
  ```json
  {
    "email": "brother@asf-futa.org",
    "token": "a8f3b20c9e..."
  }
  ```
* **Response `(200 OK)`**:
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "id": "usr_1725600000",
        "name": "Samuel Adebayo",
        "email": "brother@asf-futa.org",
        "department": "Computer Science",
        "level": "400 Level",
        "subgroup": "Technical Team",
        "role": "Publicity Coordinator",
        "isAlumni": false
      }
    }
  }
  ```
* **Side Effects**: Consumes token; records `last_active_at`; records audit log.
* **Requirement Source**: `src/services/auth/auth.service.ts`, `src/screens/WelcomeBack.tsx`.

#### `GET /api/v1/auth/me`
* **Purpose**: Retrieve current authenticated user profile and permissions.
* **Auth Required**: Yes (`Bearer <token>`).
* **Response `(200 OK)`**: Current `UserProfile` object plus effective permissions map.
* **Requirement Source**: `src/config/api.config.ts`, `src/App.tsx`.

---

### Module 2: Website Copy Management

#### `GET /api/v1/public/website-copy`
* **Purpose**: Fetch the authoritative published copy for the public landing page.
* **Auth Required**: No (Public Endpoint).
* **Caching**: `Cache-Control: public, max-age=300, stale-while-revalidate=600`.
* **Response `(200 OK)`**: Returns `WebsiteCopyModel` JSON holding `hero`, `about`, `life`, `visit`, `cta`, `version`, `lastUpdated`.
* **Requirement Source**: `src/screens/public/PublicHome.tsx`, `src/services/websiteCopy/websiteCopy.service.ts`.

#### `GET /api/v1/admin/website-copy/draft`
* **Purpose**: Fetch the working copy draft in the Admin Workspace.
* **Auth Required**: Yes.
* **Required Permission**: `access_admin_dashboard`.
* **Response `(200 OK)`**: Returns draft `WebsiteCopyModel` JSON.
* **Requirement Source**: `src/screens/admin/AdminWebsiteContentEditor.tsx`.

#### `PUT /api/v1/admin/website-copy/draft`
* **Purpose**: Save work-in-progress edits to website copy sections.
* **Auth Required**: Yes.
* **Required Role**: `Publicity Coordinator`, `President / Executive`, or `Technical Administrator`.
* **Request Body**: Partial or full `WebsiteCopyModel`.
* **Side Effects**: Creates a new draft version; creates audit record.
* **Requirement Source**: `src/screens/admin/AdminWebsiteContentEditor.tsx`.

#### `POST /api/v1/admin/website-copy/publish`
* **Purpose**: Promote working draft to live public website.
* **Auth Required**: Yes.
* **Required Role**: `Publicity Coordinator` or `President / Executive`.
* **Response `(200 OK)`**: Published `WebsiteCopyModel` with incremented `version`.
* **Side Effects**: Updates `website_copy_state.published_version_id`; creates audit log; invalidates public cache.
* **Requirement Source**: `src/screens/admin/AdminWebsiteContentEditor.tsx`.

#### `POST /api/v1/admin/website-copy/reset`
* **Purpose**: Reset landing page copy back to factory default.
* **Auth Required**: Yes.
* **Required Role**: `President / Executive` or `Technical Administrator`.
* **Response `(200 OK)`**: Default `WebsiteCopyModel`.
* **Requirement Source**: `src/screens/admin/AdminWebsiteContentEditor.tsx` (`handleResetToDefault`).

---

### Module 3: Events & Schedule

#### `GET /api/v1/events`
* **Purpose**: List fellowship events with optional horizon/category filters.
* **Auth Required**: No (Public & Member feed).
* **Query Parameters**:
  * `category`: `'All'` | `'Worship'` | `'Bible Study'` | `'Vigil'` | `'Special'` | `'Outreach'`.
  * `horizon`: `'all'` | `'upcoming'` | `'today'` | `'past'`.
  * `search`: String search query.
* **Response `(200 OK)`**: `ApiResponse<EventItem[]>`.
* **Requirement Source**: `src/services/events/events.service.ts`, `src/screens/EventHome.tsx`.

#### `GET /api/v1/events/:id`
* **Purpose**: Fetch complete event details by ID.
* **Auth Required**: No.
* **Response `(200 OK)`**: `ApiResponse<EventItem>`.
* **Requirement Source**: `src/screens/EventDetail.tsx`.

#### `POST /api/v1/events`
* **Purpose**: Create a new fellowship gathering.
* **Auth Required**: Yes.
* **Required Permission**: `create_events`.
* **Request Body**: `Partial<EventItem>`.
* **Requirement Source**: `src/screens/admin/AdminEvents.tsx`, `events.service.ts`.

#### `PUT /api/v1/events/:id`
* **Purpose**: Update event venue, dates, description, or banner.
* **Auth Required**: Yes.
* **Required Permission**: `edit_events`.
* **Requirement Source**: `src/screens/admin/AdminEvents.tsx`.

#### `DELETE /api/v1/events/:id`
* **Purpose**: Soft delete an event.
* **Auth Required**: Yes.
* **Required Permission**: `delete_events`.
* **Requirement Source**: `src/screens/admin/AdminEvents.tsx`.

#### `POST /api/v1/events/:id/remind`
* **Purpose**: Toggle or subscribe to a reminder for an event.
* **Auth Required**: Yes.
* **Request Body**: `{ "offset": "30m" }`.
* **Requirement Source**: `src/services/reminders/reminders.service.ts`, `EventDetail.tsx`.

---

### Module 4: Announcements

#### `GET /api/v1/announcements`
* **Purpose**: List published announcements.
* **Auth Required**: No.
* **Query Parameters**: `category`, `searchQuery`.
* **Response `(200 OK)`**: `ApiResponse<Announcement[]>`.
* **Requirement Source**: `src/services/announcements/announcements.service.ts`, `AnnouncementHome.tsx`.

#### `GET /api/v1/announcements/:id`
* **Purpose**: View full announcement and pastoral notice.
* **Auth Required**: No.
* **Response `(200 OK)`**: `ApiResponse<Announcement>`.
* **Requirement Source**: `src/screens/AnnouncementDetail.tsx`.

#### `POST /api/v1/announcements`
* **Purpose**: Publish new official announcement.
* **Auth Required**: Yes.
* **Required Permission**: `publish_announcements`.
* **Requirement Source**: `src/screens/admin/AdminContentEditor.tsx`.

---

### Module 5: Media & Cloudinary Integration

#### `POST /api/v1/media/upload-signature`
* **Purpose**: Generate secure signed upload ticket for direct browser -> Cloudinary uploads.
* **Auth Required**: Yes.
* **Required Permission**: `media.upload`.
* **Response `(200 OK)`**:
  ```json
  {
    "success": true,
    "data": {
      "signature": "d982b610c...",
      "timestamp": 1725600000,
      "apiKey": "123456789012345",
      "cloudName": "asf-futa",
      "folder": "fellowship-media"
    }
  }
  ```
* **Requirement Source**: `src/screens/admin/AdminMediaLibrary.tsx`, `src/config/media.config.ts`.

#### `GET /api/v1/media/assets`
* **Purpose**: List media assets in the publicity library with category/status filters.
* **Auth Required**: Yes.
* **Required Permission**: `media.view`.
* **Requirement Source**: `src/screens/admin/AdminMediaLibrary.tsx`.

#### `POST /api/v1/media/assets`
* **Purpose**: Register uploaded Cloudinary asset in database.
* **Auth Required**: Yes.
* **Required Permission**: `media.upload`.
* **Request Body**:
  ```json
  {
    "title": "Freshmen Welcome Gathering",
    "event": "Freshers Orientation",
    "category": "Fellowship",
    "publicId": "fellowship-media/freshers-2026",
    "secureUrl": "https://res.cloudinary.com/asf-futa/image/upload/v1/fellowship-media/freshers-2026.jpg",
    "dimensions": "1920x1080",
    "fileSizeBytes": 1540000,
    "tags": ["Freshers", "Orientation", "Fellowship"]
  }
  ```
* **Requirement Source**: `src/screens/admin/AdminMediaLibrary.tsx`.

#### `DELETE /api/v1/media/assets/:id`
* **Purpose**: Remove an asset from the media library.
* **Auth Required**: Yes.
* **Required Permission**: `media.delete`.
* **Requirement Source**: `src/screens/admin/AdminMediaLibrary.tsx`.

---

### Module 6: Bible Study Manual & Curriculum

#### `GET /api/v1/bible-studies`
* **Purpose**: List published Bible study outlines.
* **Auth Required**: No.
* **Response `(200 OK)`**: `ApiResponse<BibleStudyItem[]>`.
* **Requirement Source**: `src/services/bibleStudy/bibleStudy.service.ts`, `BibleStudyHome.tsx`.

#### `GET /api/v1/bible-studies/:id`
* **Purpose**: Fetch detailed study outline with scripture references, questions, and conclusions.
* **Auth Required**: No.
* **Response `(200 OK)`**: `ApiResponse<BibleStudyItem>`.
* **Requirement Source**: `src/screens/BibleStudyReader.tsx`.

#### `GET /api/v1/bible-studies/latest`
* **Purpose**: Retrieve current week's active Bible study outline.
* **Auth Required**: No.
* **Requirement Source**: `src/services/bibleStudy/bibleStudy.service.ts`.

#### `POST /api/v1/bible-studies`
* **Purpose**: Create or import a new Bible study outline.
* **Auth Required**: Yes.
* **Required Permission**: `bibleStudy.create`.
* **Requirement Source**: `src/screens/admin/AdminContentLibrary.tsx`.

#### `PUT /api/v1/bible-studies/:id`
* **Purpose**: Update outline content or publish status (`Pending Review` -> `Published`).
* **Auth Required**: Yes.
* **Required Permission**: `bibleStudy.publish`.
* **Requirement Source**: `src/screens/admin/AdminContentLibrary.tsx`, `AdminContentPreview.tsx`.

---

### Module 7: Foundational School Administration

#### `GET /api/v1/fs/materials`
* **Purpose**: Fetch discipleship curriculum modules for student reading.
* **Auth Required**: Yes (`view_fs_materials`).
* **Requirement Source**: `src/services/fs/fs.service.ts`, `FSHome.tsx`.

#### `GET /api/v1/fs/admin/students`
* **Purpose**: Fetch student enrollment roster with progress percentages and chapter scores.
* **Auth Required**: Yes.
* **Required Permission**: `fs.students.view`.
* **Requirement Source**: `src/screens/admin/AdminFSStudents.tsx`.

#### `POST /api/v1/fs/admin/students/:id/progress`
* **Purpose**: Record completed chapter, facilitator score, and teacher feedback.
* **Auth Required**: Yes.
* **Required Role**: `FS Teacher`, `VP / FS Coordinator`, or `Technical Administrator`.
* **Requirement Source**: `src/screens/admin/AdminFSStudents.tsx`.

#### `GET /api/v1/fs/admin/admissions`
* **Purpose**: List intake admission applications.
* **Auth Required**: Yes.
* **Required Permission**: `fs.admissions.review`.
* **Requirement Source**: `src/screens/admin/AdminFSAdmissions.tsx`.

#### `POST /api/v1/fs/admin/admissions/:id/review`
* **Purpose**: Approve or decline admission application.
* **Auth Required**: Yes.
* **Required Permission**: `fs.admissions.review`.
* **Request Body**: `{ "status": "Approved", "assignedLevel": "Level 1: Basic Doctrines", "notes": "..." }`.
* **Requirement Source**: `src/screens/admin/AdminFSAdmissions.tsx`.

---

### Module 8: Governance & Executive Committee (CEC)

#### `GET /api/v1/admin/governance/requests`
* **Purpose**: List pending governance approvals, handover submissions, and constitutional matters.
* **Auth Required**: Yes.
* **Required Permission**: `governance.view`.
* **Requirement Source**: `src/screens/admin/AdminGovernance.tsx`.

#### `POST /api/v1/admin/governance/requests/:id/approve`
* **Purpose**: Sign and approve a governance request.
* **Auth Required**: Yes.
* **Required Permission**: `governance.approve`.
* **Requirement Source**: `src/screens/admin/AdminGovernance.tsx`, `AdminLayout.tsx`.

#### `POST /api/v1/admin/handover/execute`
* **Purpose**: Execute formal executive handover of office rosters and permissions.
* **Auth Required**: Yes.
* **Required Role**: `President / Executive` or `Technical Administrator`.
* **Requirement Source**: `src/screens/admin/AdminHandover.tsx`.

---

### Module 9: Member Personal State & Bookmarks

#### `GET /api/v1/members/bookmarks`
* **Purpose**: Fetch user's saved Bible studies, hymns, and scripture passages across devices.
* **Auth Required**: Yes.
* **Requirement Source**: `src/screens/BookmarksPage.tsx`.

#### `POST /api/v1/members/bookmarks`
* **Purpose**: Save a study, hymn, or passage to bookmarks.
* **Auth Required**: Yes.
* **Request Body**:
  ```json
  {
    "itemType": "bible_study",
    "itemId": "study-01",
    "title": "The Sermon on the Mount",
    "subtitle": "Matthew 5-7 Analysis"
  }
  ```
* **Requirement Source**: `src/screens/BookmarksPage.tsx`, `BibleStudyReader.tsx`.

#### `DELETE /api/v1/members/bookmarks/:id`
* **Purpose**: Remove a saved bookmark.
* **Auth Required**: Yes.
* **Requirement Source**: `src/screens/BookmarksPage.tsx`.

---

### Module 10: Technical Administration, Audit & Health

#### `GET /api/v1/admin/audit-logs`
* **Purpose**: Retrieve filterable administrative audit logs.
* **Auth Required**: Yes.
* **Required Permission**: `system.logs.view`.
* **Query Parameters**: `severity`, `actor`, `limit`, `page`.
* **Requirement Source**: `src/screens/admin/AdminTechnicalLogs.tsx`.

#### `GET /api/v1/admin/system/health`
* **Purpose**: Real-time diagnostic telemetry (Database connectivity, Cloudinary latency, Gemini proxy quota, Cache worker).
* **Auth Required**: Yes.
* **Required Permission**: `system.health.view`.
* **Requirement Source**: `src/screens/admin/AdminSystemHealth.tsx`.

#### `GET /api/v1/admin/system/configuration`
* **Purpose**: Fetch global system config (maintenance mode, sync intervals, study language).
* **Auth Required**: Yes.
* **Required Permission**: `system.configuration.view`.
* **Requirement Source**: `src/screens/admin/AdminSystemConfiguration.tsx`.

#### `PUT /api/v1/admin/system/configuration`
* **Purpose**: Update system configuration.
* **Auth Required**: Yes.
* **Required Permission**: `system.configuration.edit`.
* **Requirement Source**: `src/screens/admin/AdminSystemConfiguration.tsx`.

---

# 12. WHAT IS NOT CURRENTLY REQUIRED (OVERBUILDING PREVENTION)

To prevent wasted engineering effort and avoid unneeded complexity, the backend developer **MUST NOT** build:
1. **Generic User CRUD (`DELETE /users/:id`, `POST /users` by arbitrary users)**: User accounts are created via magic link sign-up and managed via the `AdminMembers.tsx` role assignment pipeline.
2. **Real-time WebSockets / Socket.io Engine**: The current frontend does not contain live group chat or real-time collaborative whiteboards. Standard HTTP REST with appropriate caching is sufficient.
3. **Complex Multi-Tenancy Architecture**: ASF is a single fellowship organization at FUTA. Multi-tenant company/tenant IDs are unnecessary.
4. **Third-Party OAuth Callback Handlers (Google, Facebook, GitHub)**: The project uses email passwordless magic links exclusively; no OAuth callback infrastructure is present or requested.
5. **Direct Video Transcoding / Streaming Server**: All media consists of photography, flyers, and audio hymns linked via external CDN URLs. No custom video transcoding server is needed.
6. **Full-Text ElasticSearch Cluster**: Postgres indexed ILIKE or `tsvector` queries will comfortably handle search across fellowship events, hymns, and Bible studies.

---

# 13. AUTHENTICATION & SECURITY SPECIFICATION

### 13.1 Authentication Sequence
1. **No Matric Number Login**: The project has formally established that student matric numbers are **NOT** used for login.
2. **Passwordless Magic Link**:
   * User enters their email in `SignIn.tsx`.
   * Server validates email format, generates a 256-bit cryptographically random token (`crypto.randomBytes(32).toString('hex')`), hashes it using SHA-256, and stores it in `magic_link_tokens` with a 15-minute expiration.
   * Server dispatches an email via SMTP / transactional email provider with link:
     `https://asf-futa.org/welcome-back?token=<token>&email=<email>`.
   * When clicked, the frontend `WelcomeBack.tsx` submits the token to `POST /api/v1/auth/verify`.
   * Upon verification, the token is invalidated (`consumed_at = NOW()`), and the server returns a signed JWT.

### 13.2 JWT Token Specification
* **Algorithm**: `HS256` (HMAC SHA-256).
* **Expiration**: 7 days.
* **Payload Claims**:
  ```json
  {
    "sub": "usr_1725600000",
    "email": "brother@asf-futa.org",
    "role": "Publicity Coordinator",
    "name": "Samuel Adebayo",
    "iat": 1725600000,
    "exp": 1726204800
  }
  ```

### 13.3 Security Controls (Day One Requirements)
* **SQL / NoSQL Injection**: Strict parameterized queries via Drizzle ORM / Prisma.
* **Cross-Site Scripting (XSS)**: HTML sanitization on all markdown inputs (`announcements.content`, `introduction`, `summary`) using `DOMPurify` / `sanitize-html`.
* **CORS Policy**: Restrict allowed origins to frontend production URL and preview environments (`https://asf-futa.org`, `localhost:3000`).
* **Rate Limiting**:
  * Auth endpoints: 5 attempts per 15 minutes per IP.
  * General API: 100 requests per minute per IP.
* **Secrets Isolation**: Cloudinary secrets and JWT signing secrets must reside strictly in server environment variables. Never return them in responses or client bundles.

---

# 14. OFFLINE & SYNCHRONIZATION ARCHITECTURE

### 14.1 Offline Data Scope
The ASF platform operates in a university environment where mobile data may be intermittent or costly. The frontend currently specifies offline capabilities for:
* Holy Bible (KJV & WEB).
* Sacred Songs & Solos (SOP) Hymn Book (Hymns 1–400).
* Current Quarter Bible Study Outlines.
* Foundational School Study Guides.
* Prebundled Event & Announcement snapshots.
* Cached Fellowship Photography (`imageCacheService`).

### 14.2 Synchronization Protocol
* Every syncable entity (`events`, `announcements`, `bible_studies`, `website_copy`) includes:
  * `version` (`INTEGER`): Incremented on every mutation.
  * `updated_at` (`TIMESTAMPTZ`): ISO 8601 timestamp.
  * `deleted_at` (`TIMESTAMPTZ`): Tombstone indicator for soft-deleted items.
* **Delta Sync Endpoint `[PROPOSED]`**:
  `GET /api/v1/sync/delta?since=<ISO_TIMESTAMP>`
  Returns all records across core modules modified since the client's last sync timestamp.
* **Conflict Resolution**: "Server Wins" policy (`initialSystemConfig.conflictResolutionPolicy = 'Server Wins'`). Client overwrites local IndexedDB caches with server records.

---

# 15. AUDIT LOGGING SPECIFICATION

### 15.1 Events Requiring Mandatory Audit Records
1. `WEBSITE_COPY_UPDATE`: Edits to any landing page section.
2. `WEBSITE_COPY_PUBLISH`: Promoting draft to live public site.
3. `WEBSITE_COPY_RESET`: Restoring default landing page copy.
4. `EVENT_CREATE`, `EVENT_UPDATE`, `EVENT_DELETE`: Modifications to fellowship calendar.
5. `ANNOUNCEMENT_PUBLISH`: Publishing new public announcements.
6. `MEDIA_UPLOAD`, `MEDIA_DELETE`, `MEDIA_STATUS_CHANGE`: Changes in Publicity Media Library.
7. `BIBLE_STUDY_PUBLISH`: Moving Bible study outline to `Published` status.
8. `FS_ADMISSION_DECISION`: Approving or declining Foundational School applications.
9. `MEMBER_ROLE_CHANGE`: Elevating or revoking member administrative roles.
10. `EXECUTIVE_HANDOVER_EXECUTE`: Transferring CEC office registries to incoming executives.

---

# 16. ENVIRONMENT & CONFIGURATION SPECIFICATION

### 16.1 Server Environment Variables (`.env`)
```env
# Application Runtime
NODE_ENV=production
PORT=3000
API_BASE_PATH=/api/v1
CORS_ORIGIN=https://asf-futa.org,http://localhost:3000

# Database Credentials
DATABASE_URL=postgresql://asf_db_user:SUPER_SECURE_PASSWORD@postgres.internal:5432/asf_production?sslmode=require

# Authentication & JWT
JWT_SECRET=super_secret_cryptographic_random_string_min_32_chars
JWT_EXPIRATION=7d
MAGIC_LINK_SECRET=another_super_secret_string_for_tokens
MAGIC_LINK_TTL_MINUTES=15

# Transactional Email (Resend or SMTP)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_123456789...
EMAIL_FROM_ADDRESS=Anglican Students' Fellowship <noreply@asf-futa.org>

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=asf-futa
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz12345
CLOUDINARY_UPLOAD_FOLDER=fellowship-media

# Optional AI Document Extraction (Gemini)
GEMINI_API_KEY=AIzaSy...
```

---

# 17. TESTING STRATEGY

### 17.1 Test Matrix
1. **Unit Tests**:
   * JWT generation and verification.
   * Permission evaluation logic (`hasPermission(role, key)`).
   * Passwordless token expiration math.
   * Cloudinary SHA signature calculation.
2. **Integration & API Route Tests**:
   * `POST /api/v1/auth/magic-link` -> Rate limiting & token creation.
   * `POST /api/v1/auth/verify` -> Valid token returns 200 + user session; invalid token returns 401.
   * `PUT /api/v1/admin/website-copy/draft` -> Rejects unauthorized roles with 403 Forbidden.
   * `POST /api/v1/admin/website-copy/publish` -> Increments version and updates public endpoint.
   * `POST /api/v1/media/upload-signature` -> Confirms valid signature generation.
3. **Security & Boundary Tests**:
   * Parameter tampering on member role escalation.
   * Cross-site scripting payload injections in announcement HTML bodies.
   * Soft delete validation (deleted events do not appear in public feeds).

---

# 18. PRACTICAL IMPLEMENTATION ROADMAP

```
[ Phase 1: Core Foundation & Database ]
  1. Initialize Express/TypeScript or Hono framework.
  2. Setup PostgreSQL database connection and run migrations for initial schema.
  3. Implement standardized ApiResponse and ApiError handlers.
              │
              ▼
[ Phase 2: Authentication & RBAC ]
  4. Implement Magic Link generation and email dispatch service.
  5. Implement token verification and JWT signing.
  6. Implement authentication middleware (`requireAuth`) and role guards (`requirePermission`).
              │
              ▼
[ Phase 3: Public Website & Copy Management ]
  7. Seed default website copy into `website_copy_versions` and `website_copy_state`.
  8. Implement `GET /api/v1/public/website-copy`.
  9. Implement `GET /api/v1/admin/website-copy/draft`, `PUT /draft`, and `POST /publish`.
              │
              ▼
[ Phase 4: Announcements, Events & Media ]
  10. Implement Events CRUD and horizon filters.
  11. Implement Announcements CRUD.
  12. Implement Cloudinary upload signature generation (`POST /media/upload-signature`).
  13. Implement Media Asset metadata registry.
              │
              ▼
[ Phase 5: Bible Study & Discipleship Engine ]
  14. Implement Bible Studies CRUD and document linking.
  15. Implement Foundational School roster, admissions review, and progress logging.
              │
              ▼
[ Phase 6: Member Features, Bookmarks & Sync ]
  16. Implement Member Bookmarks endpoints (`/api/v1/members/bookmarks`).
  17. Implement Event Reminder subscriptions (`/api/v1/events/:id/remind`).
  18. Implement Delta Sync endpoint (`/api/v1/sync/delta`).
              │
              ▼
[ Phase 7: Governance, Audit & Observability ]
  19. Implement immutable Audit Logging service.
  20. Implement Executive Governance request workflow.
  21. Implement System Health & Diagnostics endpoint.
```

---

# 19. CONTRADICTIONS & ARCHITECTURAL RISKS

| Issue / Contradiction | Codebase Evidence | Impact | Recommended Resolution | Requires Human Decision? |
| :--- | :--- | :--- | :--- | :---: |
| **Website Copy Draft vs Publish State** | Frontend writes directly to `asf_website_copy` in `localStorage`, immediately changing public home page. | Lack of approval gate; accidental typo published live. | Implement dual pointer (`published_version_id` vs `draft_version_id`) in backend. | **NO (Resolved by Design)** |
| **Simulated PDF AI Extraction** | `AdminContentLibrary.tsx` runs a 2.4s timer and injects hardcoded Matthew 13 outline. | Users expect real PDF parsing; currently mock. | Deploy MVP as manual outline form with attached PDF; add Gemini worker in Phase 2. | **YES (Confirm timing)** |
| **Bible Text Storage Location** | `bible.service.ts` has endpoints `/api/bible/*` but `bibleData.ts` has 4MB of local text. | Hosting entire Bible in DB increases database queries needlessly. | Keep Bible & Hymns prebundled/cached on client; use backend only for search/sync. | **YES (Confirm storage)** |
| **Dual Role Definitions** | `src/types/role.ts` has `UserRole`, while `src/types/adminTypes.ts` has `AdminRole`. | Role name mismatches (e.g. `'President / Executive'` vs `'Executive'`). | Standardize backend on authoritative `UserRole` union. | **NO (Resolved)** |

---

# 20. OPEN ARCHITECTURAL DECISIONS (FOR HUMAN DEVELOPER)

The human developer must review and decide the following items prior to backend coding:
1. **Transactional Email Provider**: Will magic link emails be sent via **Resend**, **SendGrid**, or **Standard SMTP** (e.g. university/domain mail server)? *(Recommendation: Resend - fast setup, generous free tier).*
2. **Database Hosting Provider**: Will the database run on **Neon Serverless Postgres**, **Supabase**, or **Cloud SQL**? *(Recommendation: Neon or Supabase free tier for zero cost).*
3. **Bible Study Document Storage**: Should PDF study manuals be stored in **Cloudinary raw assets** or a dedicated **GCS/S3 bucket**? *(Recommendation: Cloudinary raw assets to consolidate media providers).*
4. **Offline Bible Delivery**: Should the full Bible text remain client-bundled in the PWA, or do you want the backend to serve individual chapters on demand? *(Recommendation: Keep client-bundled in IndexedDB for resilience in lecture halls without internet).*

---

# 21. FINAL BACKEND CONTRACT SUMMARY

* **Inputs**: JSON request payloads, JWT Bearer tokens, magic link authentication callbacks, Cloudinary upload metadata, PDF file buffers.
* **Outputs**: Standardized JSON envelopes (`ApiResponse<T>`), signed JWT tokens, signed Cloudinary upload tickets, published website copy.
* **Primary Actors**:
  * Public Visitors (Read-only access to published copy, schedule, and announcements).
  * Fellowship Members (Access to Bible studies, hymnal, foundational school, personal bookmarks).
  * Publicity Coordinator (Manage website copy, events, announcements, and media gallery).
  * Bible Study Coordinator (Upload and publish weekly Bible study outlines and study guides).
  * Foundational School Coordinator / Teachers (Review admissions, grade chapters, track student progress).
  * Executive Committee / President (Approve governance requests, execute executive handover).
  * Technical Administrator (System health, configuration, diagnostic logs, access overrides).
* **Persistence Engine**: Relational PostgreSQL database with 16 core entities.
* **External Services**: Transactional Email API (Magic links), Cloudinary (Visual assets and PDF storage).
* **Auditing**: Tamper-evident append-only `audit_logs` table tracking all administrative mutations.

---

# 22. IMPLEMENTATION READINESS CHECKLIST

### Foundation & Environment
- [ ] Initialize Node.js/TypeScript backend project repository.
- [ ] Configure `.env` and `.env.example` with strict variable separation.
- [ ] Setup Drizzle ORM / Prisma database connection with PostgreSQL.
- [ ] Implement global error handling middleware and `ApiResponse` envelope formatter.
- [ ] Implement CORS and Helmet security headers.

### Authentication & Authorization
- [ ] Create `users` and `magic_link_tokens` database migrations.
- [ ] Implement `POST /api/v1/auth/magic-link` with email dispatcher.
- [ ] Implement `POST /api/v1/auth/verify` with JWT issuance.
- [ ] Implement `requireAuth` JWT middleware.
- [ ] Implement `requirePermission` RBAC guard matching `src/auth/permissions.ts`.

### Public Website & Website Copy
- [ ] Create `website_copy_versions` and `website_copy_state` migrations.
- [ ] Seed factory default copy from `websiteCopy.service.ts`.
- [ ] Implement `GET /api/v1/public/website-copy` (Public cached).
- [ ] Implement `GET /api/v1/admin/website-copy/draft` (Admin protected).
- [ ] Implement `PUT /api/v1/admin/website-copy/draft` and `POST /publish`.
- [ ] Implement `POST /api/v1/admin/website-copy/reset`.

### Events, Announcements & Media
- [ ] Create `events`, `event_reminders`, `announcements`, and `media_assets` migrations.
- [ ] Implement Events CRUD and horizon filtration (`upcoming`, `today`, `past`).
- [ ] Implement Announcements CRUD and category filtration.
- [ ] Implement `POST /api/v1/media/upload-signature` using Cloudinary API secret.
- [ ] Implement `POST /api/v1/media/assets` metadata registration.

### Bible Study & Discipleship Engine
- [ ] Create `bible_studies`, `fs_students`, `fs_chapter_progress`, and `fs_admissions` migrations.
- [ ] Implement Bible study outline publishing endpoints.
- [ ] Implement Foundational School roster and chapter score updates.
- [ ] Implement admission application review workflow.

### Executive Governance, Bookmarks & Sync
- [ ] Create `governance_requests`, `audit_logs`, and `user_bookmarks` migrations.
- [ ] Implement Member Bookmark sync endpoints.
- [ ] Implement Governance Request dual-approval endpoints.
- [ ] Implement immutable Audit Log recording service.
- [ ] Implement System Health telemetry and diagnostics endpoint.
- [ ] Implement Delta Sync endpoint for offline PWA clients.

---
*End of Authoritative Backend Specification.*
