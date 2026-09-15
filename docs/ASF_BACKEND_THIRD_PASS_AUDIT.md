# ASF DIGITAL PLATFORM
# THIRD-PASS BACKEND CONTRACT VERIFICATION, DECISION RESOLUTION & FORENSIC AUDIT

**Classification:** Architectural Forensic Audit & Contract Resolution Report  
**Author:** Principal Backend Architect & Codebase Forensic Analyst  
**Platform:** Anglican Students' Fellowship (ASF), Federal University of Technology, Akure (FUTA)  
**Date:** September 2026  
**Status:** COMPLETE & AUTHORITATIVE  

---

## 1. EXECUTIVE SUMMARY & AUDIT TRAIL

This third-pass verification serves as the definitive evaluation of the backend architecture for the **ASF Digital Platform**. 

The verification trail followed a strict progression:
```
CODEBASE (Primary Ground Truth)
       ↓
FIRST SPECIFICATION (ASF_BACKEND_SPECIFICATION.md)
       ↓
SECOND-PASS AUDIT (ASF_BACKEND_SPECIFICATION_AUDIT.md)
       ↓
SECOND-PASS SPECIFICATION (ASF_BACKEND_SPECIFICATION_FINAL.md v2)
       ↓
THIRD-PASS CONTRACT VERIFICATION & RESOLUTION (This Audit)
       ↓
FINAL BACKEND CONTRACT (ASF_BACKEND_SPECIFICATION_FINAL.md v3)
```

### 1.1 Summary of Third-Pass Findings

1. **Authentication Architecture Definitively Resolved `[HUMAN DECISION — RESOLVED]`**:
   * The first specification proposed a generic auth system with unspecified password/magic link mechanics.
   * The second pass correctly identified the passwordless frontend flow, but prematurely re-introduced a `password_hash` column to the `users` table as a speculative fallback.
   * **Third-Pass Correction**: The frontend (`SignIn.tsx`, `CheckEmail.tsx`, `WelcomeBack.tsx`, `auth.service.ts`) is exclusively passwordless. There are no password inputs, validation rules, or reset workflows. Therefore, `password_hash` is **REJECTED** from the MVP schema. MVP authentication is **100% Magic Link via Email**.

2. **Persistent Session Architecture Established `[ARCHITECTURAL RECOMMENDATION]`**:
   * The first specification proposed an indefinitely long JWT (anti-pattern).
   * The second pass suggested standard JWTs but left the refresh mechanism vague.
   * **Third-Pass Resolution**: A secure dual-token persistent session model:
     * **Access Token**: Short-lived (15 minutes), in-memory / `Authorization: Bearer <token>`, used for API requests.
     * **Persistent Session / Refresh Credential**: Long-lived (30–90 days rolling), stored in a secure, `HttpOnly`, `SameSite=Lax`, `Secure` cookie, mapped to an explicit server-side `user_sessions` record.
     * Survives browser restarts and page refreshes.
     * Revoked immediately upon explicit logout or administrative account suspension.

3. **Foundational School (FS) Rescued from Over-Aggressive Pruning `[VERIFIED]`**:
   * The first specification created a sprawling schema without grounding in screen state.
   * The second pass over-corrected and collapsed the entire Foundational School into a single `fs_students` table with serialized JSON strings.
   * **Third-Pass Correction**: Deep inspection of `AdminFSStudents.tsx` (1,034 lines), `AdminFSAdmissions.tsx` (378 lines), `AdminFSClasses.tsx` (141 lines), `AdminFSTeachers.tsx` (179 lines), and `fsAdminTypes.ts` revealed that four distinct domain entities are actively managed and persisted in `localStorage`:
     1. Admission applications (`fs_admissions`)
     2. Student records (`fs_students`)
     3. Discipleship classes/levels (`fs_classes`)
     4. Chapter progress and scores (`fs_chapter_progress`)
   * Forcing all of these into a single table breaks relational queries, teacher assignments, and progress analytics. A clean 4-table normalized sub-domain is required and specified.

4. **Governance Dual-Approval Workflow Preserved Without Cryptography `[VERIFIED]`**:
   * The frontend (`AdminGovernance.tsx`, `AdminHandover.tsx`, `adminTypes.ts`) contains an explicit dual-approval workflow (`requiredApprovals: 2`, `currentApprovals: Array<{ approverName, approverRole, approvedAt }>`).
   * The second pass discarded cryptographic signatures (correct), but failed to provide an explicit relational model for approvals.
   * **Third-Pass Resolution**: Implemented as simple, clean relational tables: `governance_requests` and `governance_approvals`. No public-key cryptography or blockchain bloat is required; standard session-authenticated approvals fulfill the constitutional requirement.

5. **Elimination of Dead and Hallucinated Requirements**:
   * **Holy Bible Database**: Rejected. 31,102 verses prebundled in `bibleData.ts` / IndexedDB.
   * **Hymn Book Database**: Rejected. 400 hymns prebundled in `hymnData.ts` / IndexedDB.
   * **Member Notes**: Rejected (`NOT IMPLEMENTED` in frontend).
   * **Member Bookmarks Sync**: Rejected for MVP (mock static array in `BookmarksPage.tsx`).
   * **Gemini AI Extraction**: Rejected for MVP (simulated UI timer in `AdminContentLibrary.tsx`). Manual outline curation is the true operational requirement.
   * **Delta Sync Engine**: Rejected for MVP. Frontend does not maintain sync cursors.
   * **System Health Table**: Rejected. Health metrics are computed dynamically in memory.

---

## 2. DETAILED COMPARATIVE AUDIT: PASS 1 vs. PASS 2 vs. PASS 3

| Feature / Domain | Pass 1 (First Spec) | Pass 2 (Audit & Final v2) | Pass 3 (Third Pass Verification) | Evidence & Ground Truth |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication Strategy** | Ambiguous (Password + Magic Link suggested) | Magic Link identified, but retained `password_hash` column | **Pure Passwordless Magic Link** (No passwords, no `password_hash`) | `SignIn.tsx` only has email/profile fields. `auth.service.ts` calls `/api/auth/magic-link`. |
| **Session Lifetime & Persistence** | Vague, single long-lived JWT suggested | Standard JWT + Refresh Token mentioned briefly | **Dual-Token Persistent Session**: 15-min Access Token + 60-day rolling Refresh Token in HttpOnly cookie | Required UX: User stays logged in across restarts; immediate revocation on logout/suspension. |
| **Foundational School Model** | Complex hypothetical schema | Over-simplified to 1 single table (`fs_students`) | **4 Normalized Tables**: `fs_admissions`, `fs_students`, `fs_classes`, `fs_chapter_progress` | `AdminFSStudents.tsx`, `AdminFSAdmissions.tsx`, `AdminFSClasses.tsx` manage distinct relational datasets. |
| **Governance Approvals** | Over-engineered multi-sig cryptography proposed | Rejected cryptography, but left approval storage unclear | **Relational Approvals**: `governance_requests` + `governance_approvals` | `AdminGovernance.tsx` models 2-person approval with comments and timestamps. |
| **Executive Handover** | Generic multi-step workflow engine | Dropped into JSON strings | **Structured Relational Handover**: `executive_handovers` + `handover_checklists` | `AdminHandover.tsx` manages office transfers, CSV imports, checklist items per office. |
| **Website Copy Model** | Draft + Publish dual-schema | Versioned published copy (instant live updates) | **Versioned Published Copy**: Single active version with historical audit records | `AdminWebsiteContentEditor.tsx` publishes changes directly to live site on save. |
| **Bible & Hymnal Data** | 31,102 verses & 400 hymns in DB tables | Removed from DB (client-side only) | **Confirmed Client-Side Static Storage**; Zero DB tables | `bibleData.ts` & `hymnData.ts` are prebundled. Offline campus reading is paramount. |
| **Media Uploads** | Hardcoded to Cloudinary SDK everywhere | Decoupled via `media_assets` and presigned signatures | **Provider-Agnostic Storage Service** with Cloudinary as MVP provider | `cloudinary.service.ts` exists in frontend. Backend issues signed tickets; frontend uploads direct. |
| **System Settings** | Key-value generic metadata table | Not specified or deferred | **Single-Row `system_settings` Table** | `AdminSystemConfiguration.tsx` manages maintenance mode, upload limits, and sync policies. |
| **System Health Monitoring** | Proposed a `system_health` DB table | Dynamic runtime health check endpoint | **Confirmed In-Memory Diagnostic Probe** (`GET /api/v1/admin/system/health`) | Storing transient pings in PostgreSQL is an anti-pattern. Computed on the fly. |
| **Bookmarks & Notes** | Proposed DB tables and sync APIs | Bookmarks hardcoded; Notes non-existent | **Rejected from MVP Backend**: Bookmarks client-only; Notes not implemented | `BookmarksPage.tsx` has static mock arrays; Notes has no code anywhere. |
| **Delta Synchronization** | Mandated `GET /api/v1/sync/delta?since=...` | Questioned feasibility | **Deferred / Rejected for MVP**: Standard REST endpoints with HTTP caching headers | Frontend has no vector clocks, sync cursors, or merge conflict handlers. |

---

## 3. EVIDENCE-BASED DOMAIN DEEP DIVES

### 3.1 Authentication & Session Management

#### Forensic Code Inspection
* In `src/screens/SignIn.tsx`, the form has two states controlled by the `isSignUp` boolean flag:
  * **Sign In State**: Inputs: `Email Address` (`#email-input`).
  * **Sign Up State**: Inputs: `Email Address`, `Full Name` (`#name-input`), `Department` (`#department-input`), `Academic Level` (`#level-select`), and optional `Subgroup` (`#subgroup-input`).
  * At no point does a password input exist.
* In `src/services/auth/auth.service.ts`:
  ```typescript
  export interface MagicLinkRequestPayload {
    email: string;
    name?: string;
    department?: string;
    level?: string;
    subgroup?: string;
    isSignUp?: boolean;
  }
  ```
  The service invokes `POST /api/auth/magic-link` and verifies via `POST /api/auth/verify`.
* In `src/screens/WelcomeBack.tsx`, the verification handler receives token query parameters and updates the global user session.

#### Resolution & Contract
1. **No Password Authentication**: Do not create a `password_hash` column. Do not create password login endpoints.
2. **Registration vs. Login**:
   * If a user requests a magic link with `isSignUp: true`, their submitted registration details (`name`, `department`, `level`, `subgroup`) are temporarily stored in the `magic_link_tokens` record.
   * Upon token verification, the backend upserts the `users` record.
   * If a user requests a magic link with `isSignUp: false` for an email that does not exist in `users`, the backend rejects the request with code `ACCOUNT_NOT_FOUND` (or optionally initiates an auto-registration if permitted by policy).
3. **Session Persistence**:
   * The user must not be repeatedly prompted to log in.
   * Upon magic link verification, the backend creates a `user_sessions` database row containing:
     * `user_id`
     * `refresh_token_hash` (SHA-256)
     * `user_agent`, `ip_address`
     * `expires_at` (60 days from issuance)
   * The backend responds with:
     * JSON payload: `{ success: true, data: { user, accessToken } }`
     * HTTP Response Header: `Set-Cookie: asf_refresh_token=<token>; HttpOnly; Secure; SameSite=Lax; Path=/api/v1/auth; Max-Age=5184000`
   * The client uses `accessToken` (15-minute expiry) in `Authorization: Bearer <token>`.
   * When `accessToken` expires, the client's HTTP interceptor calls `POST /api/v1/auth/refresh` (which automatically transmits the HttpOnly cookie).
   * The backend validates the session, rotates the refresh token, and issues a fresh `accessToken`.
   * **Explicit Logout**: Calls `POST /api/v1/auth/logout`, which deletes the session from `user_sessions` and clears the cookie.
   * **Account Suspension**: Setting `users.status = 'suspended'` immediately invalidates all active sessions during the refresh cycle.

---

### 3.2 Foundational School (FS) Deep Forensic Verification

#### Forensic Code Inspection
* `src/screens/admin/AdminFSStudents.tsx` (1,034 lines):
  * Manages `students` via `localStorage.getItem('asf_fs_students')`.
  * Allows assigning teachers (`selectedTeacherId`), adding admin notes (`newNoteText`), tracking chapter progress (`chapterProgress`), and certifying completion (`completionCertified`).
* `src/screens/admin/AdminFSAdmissions.tsx` (378 lines):
  * Manages `admissions` via `localStorage.getItem('asf_fs_admissions')`.
  * Reviews discipleship applications with statuses: `'Pending Review' | 'Approved' | 'Interview Scheduled' | 'Declined'`.
  * Tracks `previousChurchAffiliation`, `salvationTestimonySummary`, `reasonForJoining`, and `reviewerNotes`.
* `src/screens/admin/AdminFSClasses.tsx` (141 lines):
  * Manages `classes` via `localStorage.getItem('asf_fs_classes')`.
  * Defines curriculum levels (Level 1: Basic Doctrines, Level 2: Spiritual Growth, Level 3: Christian Stewardship), meeting schedules, and curriculum modules.
* `src/screens/admin/AdminFSTeachers.tsx` (179 lines):
  * Manages `teachers` via `localStorage.getItem('asf_fs_teachers')`.
  * Lists teacher assignments, contact details, and assigned students count.
* `src/types/fsAdminTypes.ts`:
  * Explicitly defines `FSStudent`, `FSTeacher`, `FSAdmissionApplication`, `FSClassLevel`, `FSChapterProgress`, and `FSAdminNote`.

#### Evaluation of Pass 2 Compression
The second-pass audit collapsed all of this into `fs_students` with JSON columns. This was an over-aggressive reduction that:
* Destroyed the relational link between applicants and enrolled students.
* Prevented querying progress per chapter across all students.
* Made teacher assignment a loose string rather than a relational foreign key.
* Obscured the discipleship class curriculum structure.

#### Resolution & Normalized FS Model
The authoritative backend establishes four targeted relational tables:
1. `fs_classes`: Stores the class levels, syllabus, and meeting schedules.
2. `fs_admissions`: Manages discipleship intake applications and review decisions.
3. `fs_students`: Represents an enrolled discipleship student, linked to `users.id` (if registered) or maintained as a candidate profile, assigned to `fs_classes.id` and a teacher (`users.id`).
4. `fs_chapter_progress`: Stores chapter-by-chapter progression, test scores, and facilitator feedback.
*(Teachers are simply `users` with role `FS Teacher` or `VP / FS Coordinator`, linked via foreign key in `fs_students.assigned_teacher_id`)*.

---

### 3.3 Governance & Executive Handover

#### Forensic Code Inspection
* In `src/screens/admin/AdminGovernance.tsx`:
  * Displays critical action proposals (Bible Study Deletion, Emergency Retraction, Role Elevation, System Reset).
  * Shows `req.currentApprovals.length of req.requiredApprovals`.
  * Each proposal requires dual executive sign-off before being executed.
* In `src/screens/admin/AdminHandover.tsx`:
  * Tracks executive roles (`leadershipRoles`), their current holder, designated successor, and readiness percentage.
  * Manages office-specific handover checklists (`handoverChecklist`) across four categories: `Documentation`, `Access & Keys`, `Resource Transfer`, and `Briefing`.
  * Executes role transfers (`executeExecutiveHandover`), updating the assigned member and logging the transition.

#### Resolution & Contract
* **No Cryptographic Multi-Sig**: Do not introduce asymmetric keypairs or blockchain contracts.
* **Relational Governance Model**:
  * `governance_requests`: Tracks the proposal type, target, requester, status, and required approvals count.
  * `governance_approvals`: Stores individual executive approvals (`approver_id`, `approved_at`, `comments`).
  * Once `current_approvals >= required_approvals`, an executive can invoke `/execute`.
* **Handover Persistence**:
  * `executive_handovers`: Tracks office, outgoing executive, incoming executive, readiness percent, and execution timestamp.
  * `handover_checklists`: Tracks individual item status, category, and completion timestamps.

---

### 3.4 Website Copy & Public Sections

#### Forensic Code Inspection
* `src/screens/admin/AdminWebsiteContentEditor.tsx`:
  * Edits home hero text, about vision/mission, meeting times, and leadership greetings.
  * Saving writes directly to `useWebsiteContent()` / `websiteCopy.service.ts`.
  * Changes are immediately visible on the public website.

#### Resolution & Contract
* **Single-Version Published Copy with Audit History**:
  * A complex draft/review/publish staging system is unrequested and contradictory to current frontend UX.
  * The backend stores copy in `website_copy` with an auto-incrementing `version` number.
  * `PUT /api/v1/admin/website-copy` commits the update as the new active version and inserts a row into `audit_logs`.
  * `GET /api/v1/website-copy` returns the currently active version.
  * Previous versions remain in the table for historical auditability and emergency rollback.

---

### 3.5 Bible, Hymnal & Study Outlines

#### Forensic Code Inspection
* `src/data/bibleData.ts`: Prebundles the entire King James Version (KJV) and World English Bible (WEB) text.
* `src/data/hymnData.ts`: Prebundles all 400 Sacred Songs and Solos (SOP) hymns.
* `src/screens/OfflineSyncPage.tsx`:
  * Explicitly confirms that the Bible (4.2 MB) and Hymn Book (1.2 MB) are auto-cached and prebundled for zero-latency, offline reading.
* `src/screens/admin/AdminContentLibrary.tsx`:
  * Manages Bible Study outlines.
  * The "AI Extraction" feature is an in-browser `setInterval` mock that displays a progress bar and loads static Matthew 13 mock data.

#### Resolution & Contract
1. **Bible & Hymns**: Strictly client-side. Zero backend database tables or search endpoints are needed for MVP.
2. **Bible Study Outlines**:
   * Stored in `bible_studies` table with structured JSON for sections and discussion questions.
   * Optional `pdf_url` points to an uploaded study manual.
   * Statuses: `'Draft' | 'Published' | 'Archived'`.
3. **AI Extraction**: **REJECTED FROM MVP**. The Bible Study Coordinator creates and edits outlines directly via structured forms. An AI extraction pipeline can be added in a future phase without modifying the core outline schema.

---

## 4. RESOLUTION OF REMAINING CONTRADICTIONS

| Contradiction | Document A (Spec 1) | Document B (Audit 2) | Third-Pass Resolution | Authoritative Justification |
| :--- | :--- | :--- | :--- | :--- |
| **Password Hash in Database** | Included | Included as "fallback" | **Completely Removed** | Frontend is strictly passwordless. Adding dead fields violates lean schema principles and creates confusion. |
| **Token in URL Callback** | Indefinite session token | Single-use magic token | **Single-use cryptographic token** | Magic link URL contains high-entropy raw token. Backend stores SHA-256 hash. Verified once, then invalidated. |
| **Event Status Representation** | Display string ("Upcoming") | Display string | **Derived dynamically from `start_time` and `end_time`** | Persisting "Happening Today" in a database row leads to stale data. Backend queries filter by temporal ranges; frontend computes display chips. |
| **Event Reminders** | Server notification queue | Client-side only | **Client-side only for MVP** | `reminders.service.ts` uses `localStorage`. No push tokens or background workers exist in the project. |
| **Foundational School Table Count** | 6 tables | 1 table | **4 Normalized Tables** | Deep audit proves student rosters, admissions, class curriculums, and chapter progress are independent functional entities. |
| **Technical Administrator Role** | Omitted | Added | **Confirmed in Canonical Roles** | `AdminSystemConfiguration.tsx` explicitly checks for "Technical Administrator" privileges. |
| **Role Elevation Approvals** | Crypto multi-sig | Simple boolean flag | **Relational Governance Workflow** | `AdminGovernance.tsx` requires 2-person approval for role elevation. |

---

## 5. REJECTED & DEFERRED FEATURES (DO NOT BUILD IN MVP)

1. **Password Authentication & Password Hashing**:
   * *Status:* REJECTED.
   * *Reason:* Frontend contains no password interfaces or reset flows. Pure Magic Link architecture is the established product decision.
2. **Gemini / AI Document Extraction**:
   * *Status:* REJECTED / DEFERRED.
   * *Reason:* Current UI uses a mock timer. Curation is done manually by the Bible Study Coordinator.
3. **Holy Bible Database (31,102 Verses)**:
   * *Status:* REJECTED.
   * *Reason:* Bundled locally in static assets and IndexedDB. Storing on server would cause campus latency and offline failures.
4. **Hymnal Database (400 Hymns)**:
   * *Status:* REJECTED.
   * *Reason:* Bundled locally in client assets. Offline-first requirement dictates client-side availability.
5. **Cross-Device Bookmark Synchronization**:
   * *Status:* DEFERRED.
   * *Reason:* `BookmarksPage.tsx` currently renders hardcoded mock arrays. No persistent client store or sync service exists.
6. **Member Personal Notes Module**:
   * *Status:* REJECTED.
   * *Reason:* Completely unrepresented in code, routes, or UI components.
7. **Delta Synchronization Engine (`/sync/delta?since=...`)**:
   * *Status:* DEFERRED.
   * *Reason:* Frontend lacks sync tokens, vector clocks, or client-side conflict resolution engines. Standard HTTP caching headers (`ETag`, `If-Modified-Since`) suffice for MVP.
8. **Server-Side Event Push Notification Queue**:
   * *Status:* DEFERRED.
   * *Reason:* Reminders are purely local in `localStorage`. Web Push service workers and VAPID keys are not implemented in frontend.
9. **System Health Database Table**:
   * *Status:* REJECTED.
   * *Reason:* Diagnostic telemetry must be evaluated live in memory, not logged as permanent relational entities.
10. **Microservices / Message Brokers (Redis, Kafka, RabbitMQ)**:
    * *Status:* REJECTED.
    * *Reason:* Unwarranted operational complexity for a fellowship with hundreds of users. Modular monolith pattern is the correct architectural choice.

---

## 6. FINAL CLASSIFICATION MATRIX

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EVIDENCE CLASSIFICATION                         │
├────────────────────────────────┬───────────────────────────────────────┤
│ Concept / Component            │ Classification                        │
├────────────────────────────────┼───────────────────────────────────────┤
│ Passwordless Magic Link Auth   │ VERIFIED                              │
│ Dual-Token Persistent Session  │ ARCHITECTURAL RECOMMENDATION          │
│ Canonical 11 Admin Roles       │ VERIFIED                              │
│ Dynamic Website Copy (Single)  │ VERIFIED                              │
│ Announcements CRUD             │ VERIFIED                              │
│ Events CRUD & Range Filtering  │ VERIFIED                              │
│ Direct Media Upload / Tickets  │ VERIFIED                              │
│ Bible Study Manual Outlines    │ VERIFIED                              │
│ FS Admissions Workflow         │ VERIFIED                              │
│ FS Student Roster & Progress   │ VERIFIED                              │
│ FS Classes & Curriculum Levels │ VERIFIED                              │
│ Dual-Approval Governance       │ VERIFIED                              │
│ Executive Handover Tracking    │ VERIFIED                              │
│ System Settings Persistence    │ VERIFIED                              │
│ Application Audit Logging      │ VERIFIED                              │
│ Dynamic Health Diagnostics     │ PROPOSED (In-Memory)                  │
│ AI Document Extraction         │ REJECTED (Simulated Mock)             │
│ Password Login Endpoints       │ REJECTED                              │
│ Bible & Hymn Server Database   │ REJECTED                              │
│ Member Bookmarks Backend Sync  │ DEFERRED (Not Implemented)            │
│ Member Notes API               │ REJECTED (Not Implemented)            │
│ Generic Delta Sync Engine      │ DEFERRED                              │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 7. AUDIT CONCLUSION & NEXT STEPS

With this third-pass forensic verification complete:
1. All contradictions between earlier specifications have been resolved.
2. The exact database schema has been right-sized to 18 normalized tables reflecting actual frontend components.
3. Magic Link authentication and persistent session management are unambiguously specified.
4. The authoritative engineering blueprint is ready to be written to `ASF_BACKEND_SPECIFICATION_FINAL.md`.
