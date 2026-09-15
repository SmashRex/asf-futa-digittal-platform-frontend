# ASF DIGITAL PLATFORM — MASTER BACKEND IMPLEMENTATION CHECKLIST

This document is the **single, exhaustive, living progress tracker** for building, testing, integrating, securing, and deploying the ASF Digital Platform Express + TypeScript + PostgreSQL backend.

---

## PROGRESS DASHBOARD

```text
TOTAL TASKS: 200

P0: 175
P1: 23
P2: 2
P3: 0

COMPLETE: 0
IN PROGRESS: 0
NOT STARTED: 198
BLOCKED: 0
DEFERRED: 2

CURRENT STAGE:
Backend planning / not started

LAST UPDATED:
2026-09-06
```

---

## CHECKLIST STATUS LEGEND

```text
[ ] NOT STARTED
[~] IN PROGRESS
[x] COMPLETE
[!] BLOCKED
[-] DEFERRED
```

---

## SECTION 00 — PROJECT / REPOSITORY PREPARATION

[ ] BE-001 — Configure server TypeScript compilation settings

Priority: P0
Depends on: None
File: tsconfig.server.json
Purpose: Define TypeScript compiler options specifically for backend Node.js server execution.
Done when: `tsconfig.server.json` exists with valid target (`ES2022`), module (`NodeNext`), and moduleResolution settings.

[ ] BE-002 — Add backend npm dependencies to package.json

Priority: P0
Depends on: BE-001
File: package.json
Purpose: Add required runtime and development dependencies for ORM, security, database pool, and utility packages.
Done when: `package.json` contains `drizzle-orm`, `pg`, `@types/pg`, `cors`, `helmet`, `express-rate-limit`, `zod`, `dotenv`, and `tsx`.

[ ] BE-003 — Configure package.json dev, build, and start scripts

Priority: P0
Depends on: BE-002
File: package.json
Purpose: Update script commands to support server execution in dev mode, esbuild bundling, and CJS start.
Done when: `"dev"` runs `tsx server.ts`, `"build"` runs `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`, and `"start"` runs `node dist/server.cjs`.

[ ] BE-004 — Create environment configuration template file

Priority: P0
Depends on: None
File: .env.example
Purpose: Document all required backend environment variables and default fallback values.
Done when: `.env.example` contains declarations for `NODE_ENV`, `PORT`, `DATABASE_URL`, `APP_BASE_URL`, `MAIL_FROM_ADDRESS`, `MAILER_API_KEY`, `MEDIA_STORAGE_KEY`, `MEDIA_STORAGE_SECRET`, and `COOKIE_SECRET`.

[ ] BE-005 — Create environment variable loader and Zod schema validator

Priority: P0
Depends on: BE-004
File: src/config/env.config.ts
Purpose: Validate environment variables at application startup using Zod and fail fast if required keys are missing.
Done when: `env.config.ts` exports typed `env` object and throws clear error if `DATABASE_URL` or required secrets are missing.

[ ] BE-006 — Create app configuration constants file

Priority: P0
Depends on: BE-005
File: src/config/app.config.ts
Purpose: Store system-wide application configuration constants such as token TTLs, pagination limits, and upload limits.
Done when: `app.config.ts` exports constants for `MAGIC_LINK_TTL_MINUTES = 15`, `SESSION_TTL_DAYS = 30`, `MAX_FILE_SIZE_BYTES = 5242880`.

[ ] BE-007 — Configure Vitest environment setup hook for backend tests

Priority: P0
Depends on: BE-001
File: src/test/setup.ts
Purpose: Initialize test database client, run schema migrations, and reset test tables before test execution.
Done when: `src/test/setup.ts` connects to test PostgreSQL database, runs migrations, and cleans up between test suites.

---

## SECTION 01 — BACKEND ARCHITECTURE

[ ] BE-008 — Create server entry point with Express application bootstrap

Priority: P0
Depends on: BE-003, BE-005
File: server.ts
Purpose: Initialize Express application, mount core middlewares, bind to host `0.0.0.0` and port `3000`.
Done when: `server.ts` starts Express server listening on `0.0.0.0:3000` with basic health route `/api/health`.

[ ] BE-009 — Implement Vite development middleware integration in server.ts

Priority: P0
Depends on: BE-008
File: server.ts
Purpose: Mount Vite middleware when `NODE_ENV !== 'production'` to serve SPA client assets alongside backend API routes.
Done when: Server serves Vite frontend in dev mode and static dist directory in production mode.

[ ] BE-010 — Create custom AppError class for standardized operational errors

Priority: P0
Depends on: None
File: src/errors/appError.ts
Purpose: Provide operational error handling class with HTTP status code, error code, and operational flag.
Done when: `AppError` class can be instantiated with status code (e.g., 400, 401, 403, 404, 422) and serialized cleanly.

[ ] BE-011 — Implement global JSON error envelope handler middleware

Priority: P0
Depends on: BE-010
File: src/middleware/errorHandler.middleware.ts
Purpose: Catch all thrown errors and format consistent JSON error response envelopes `{ success: false, error: { message, code } }`.
Done when: Error middleware returns standardized HTTP status and JSON payload without leaking stack traces in production.

[ ] BE-012 — Implement request rate limiting middleware

Priority: P0
Depends on: BE-008
File: src/middleware/rateLimiter.middleware.ts
Purpose: Protect sensitive endpoints (magic-link request, verification, login) against brute-force attacks.
Done when: Rate limiter returns HTTP 429 Too Many Requests when request threshold is exceeded.

[ ] BE-013 — Create transactional mailer interface abstraction

Priority: P0
Depends on: None
File: src/adapters/mailer/mailer.interface.ts
Purpose: Decouple domain authentication logic from specific third-party transactional email vendors.
Implementation notes: Define `IMailerAdapter` with `sendMagicLink(email, token, url)` and `sendNotification(email, subject, body)`.
Done when: Interface TypeScript file defined and exported.

[ ] BE-014 — Implement dev console mailer adapter

Priority: P0
Depends on: BE-013
File: src/adapters/mailer/consoleMailer.adapter.ts
Purpose: Log magic links and transactional emails directly to stdout during development without external network calls.
Done when: `ConsoleMailerAdapter` logs clickable magic link URLs to terminal output.

[ ] BE-015 — Implement production SMTP/HTTP mailer adapter

Priority: P0
Depends on: BE-013
File: src/adapters/mailer/smtpMailer.adapter.ts
Purpose: Send actual transactional emails via production SMTP/HTTP provider when `NODE_ENV === 'production'`.
Done when: `SmtpMailerAdapter` dispatches transactional emails using configured API key.

[ ] BE-016 — Create media storage interface abstraction

Priority: P0
Depends on: None
File: src/adapters/media/mediaStorage.interface.ts
Purpose: Decouple media file uploads from specific storage backends.
Implementation notes: Define `IMediaStorageAdapter` with `uploadFile(buffer, filename, mimeType)` and `deleteFile(key)`.
Done when: Interface TypeScript file defined and exported.

[ ] BE-017 — Implement local media storage adapter for development

Priority: P0
Depends on: BE-016
File: src/adapters/media/localStorage.adapter.ts
Purpose: Save uploaded media files to local disk under `public/uploads` directory in development.
Done when: `LocalStorageAdapter` writes buffer to disk and returns accessible local URL `/uploads/...`.

[ ] BE-018 — Implement cloud object media storage adapter for production

Priority: P0
Depends on: BE-016
File: src/adapters/media/cloudStorage.adapter.ts
Purpose: Upload files to production S3/Cloud Storage bucket when in production mode.
Done when: `CloudStorageAdapter` streams buffer to bucket and returns HTTPS CDN URL.

---

## SECTION 02 — DATABASE FOUNDATION

[ ] BE-019 — Create PostgreSQL connection pool and Drizzle client initialization

Priority: P0
Depends on: BE-002, BE-005
File: src/db/index.ts
Purpose: Initialize `pg` Pool and Drizzle ORM client using validated `DATABASE_URL`.
Done when: `db` object is exported and connects to PostgreSQL database successfully.

[ ] BE-020 — Configure Drizzle ORM CLI configuration file

Priority: P0
Depends on: BE-019
File: drizzle.config.ts
Purpose: Provide configuration for Drizzle Kit schema migrations and introspection.
Done when: `drizzle.config.ts` specifies schema paths (`src/db/schema/*`), migrations output folder (`src/db/migrations`), and dialect `postgresql`.

[ ] BE-021 — Implement database transaction helper wrapper utility

Priority: P0
Depends on: BE-019
File: src/db/transaction.ts
Purpose: Provide reusable wrapper function for executing multi-table atomic operations inside SQL transactions.
Done when: `runTransaction` helper executes callback within `db.transaction()` and rolls back cleanly on error.

[ ] BE-022 — Define standard database timestamp and primary key schema mixins

Priority: P0
Depends on: BE-019
File: src/db/schema/common.ts
Purpose: Standardize `id` (UUID), `created_at`, and `updated_at` column definitions across all Drizzle schema tables.
Done when: `common.ts` exports reusable column builders for primary keys and timestamps.

---

## SECTION 03 — DATABASE ENTITIES

[ ] BE-023 — Create users table schema definition

Priority: P0
Depends on: BE-022
File: src/db/schema/users.ts
Purpose: Store core member records including name, email, phone number, department, academic level, membership status, and account status.
Done when: Table `users` defined with fields `id`, `full_name`, `email` (unique), `phone_number`, `department`, `academic_level`, `membership_status` ('Active Student'|'Alumni'|'Staff'|'Associate'), `account_status` ('Active'|'Suspended'|'Deactivated'), timestamps.

[ ] BE-024 — Create user_academic_history table schema definition

Priority: P0
Depends on: BE-023
File: src/db/schema/users.ts
Purpose: Track student academic level progression history and manual overrides over time.
Done when: Table `user_academic_history` defined with fields `id`, `user_id` (FK), `academic_session_id` (FK), `from_level`, `to_level`, `is_override`, `override_reason`, `created_at`.

[ ] BE-025 — Create academic_sessions table schema definition

Priority: P0
Depends on: BE-022
File: src/db/schema/academic.ts
Purpose: Store annual fellowship academic session records and active session flag.
Done when: Table `academic_sessions` defined with `id`, `session_name` (e.g. '2024/2025'), `start_date`, `end_date`, `is_active` (boolean), timestamps.

[ ] BE-026 — Create roles table schema definition

Priority: P0
Depends on: BE-022
File: src/db/schema/roles.ts
Purpose: Store canonical role definitions across the 15 fellowship administrative roles.
Done when: Table `roles` defined with `id` (role ID string), `role_name`, `description`, timestamps.

[ ] BE-027 — Create user_roles junction table schema definition

Priority: P0
Depends on: BE-023, BE-026
File: src/db/schema/roles.ts
Purpose: Map members to one or more administrative roles in normalized user-role association.
Done when: Table `user_roles` defined with `user_id` (FK), `role_id` (FK), composite primary key `(user_id, role_id)`, `assigned_at`, `assigned_by`.

[ ] BE-028 — Create magic_link_tokens table schema definition

Priority: P0
Depends on: BE-023
File: src/db/schema/auth.ts
Purpose: Store passwordless magic-link authentication tokens with SHA-256 hash at rest, 15-minute TTL, and single-use flag.
Done when: Table `magic_link_tokens` defined with `id`, `user_id` (FK), `token_hash` (unique), `expires_at`, `is_used` (boolean), `created_at`.

[ ] BE-029 — Create user_sessions table schema definition

Priority: P0
Depends on: BE-023
File: src/db/schema/auth.ts
Purpose: Track active server-side sliding sessions with SHA-256 token hash, 30-day idle expiration, and revocation status.
Done when: Table `user_sessions` defined with `id`, `user_id` (FK), `session_token_hash` (unique), `expires_at`, `is_revoked` (boolean), `user_agent`, `ip_address`, timestamps.

[ ] BE-030 — Create bible_translations table schema definition

Priority: P0
Depends on: BE-022
File: src/db/schema/bible.ts
Purpose: Store Bible translation metadata (e.g. KJV, WEB).
Done when: Table `bible_translations` defined with `id` ('KJV', 'WEB'), `name`, `language`, timestamps.

[ ] BE-031 — Create bible_books table schema definition

Priority: P0
Depends on: BE-030
File: src/db/schema/bible.ts
Purpose: Store 66 Bible books with testaments and order positions.
Done when: Table `bible_books` defined with `id`, `translation_id` (FK), `book_number`, `name`, `testament` ('OT'|'NT'), `chapter_count`.

[ ] BE-032 — Create bible_verses table schema definition with GIN-indexed tsvector

Priority: P0
Depends on: BE-031
File: src/db/schema/bible.ts
Purpose: Store scripture text verses and GIN-indexed PostgreSQL `tsvector` column for full-text search.
Done when: Table `bible_verses` defined with `id`, `translation_id` (FK), `book_id` (FK), `chapter`, `verse`, `text`, `tsv` (tsvector column and GIN index).

[ ] BE-033 — Create bible_studies table schema definition for 10-part outlines

Priority: P0
Depends on: BE-023
File: src/db/schema/bibleStudy.ts
Purpose: Store weekly Bible Study outlines structured across 10 canonical fields.
Done when: Table `bible_studies` defined with `id`, `study_number`, `study_date`, `theme`, `topic`, `text_reference`, `text_content`, `memory_verse`, `aim`, `introduction`, `outline_sections` (JSONB), `discussion_questions` (JSONB), `conclusion`, `prayer`, `publication_status` ('draft'|'published'|'archived'), `created_by`, timestamps.

[ ] BE-034 — Create fs_classes table schema definition

Priority: P0
Depends on: BE-022
File: src/db/schema/fs.ts
Purpose: Store Foundational School class cohort sessions.
Done when: Table `fs_classes` defined with `id`, `class_name`, `academic_session_id` (FK), `status` ('Upcoming'|'Active'|'Completed'), timestamps.

[ ] BE-035 — Create fs_admissions table schema definition

Priority: P0
Depends on: BE-023, BE-034
File: src/db/schema/fs.ts
Purpose: Store candidate application records for Foundational School discipleship enrollment.
Done when: Table `fs_admissions` defined with `id`, `user_id` (FK), `class_id` (FK), `status` ('Pending Review'|'Approved'|'Rejected'), `submitted_at`, `reviewed_at`, `reviewed_by`, `review_notes`.

[ ] BE-036 — Create fs_students table schema definition

Priority: P0
Depends on: BE-023, BE-034
File: src/db/schema/fs.ts
Purpose: Store enrolled Foundational School student records, assigned teacher, and completion recording flags.
Done when: Table `fs_students` defined with `id`, `user_id` (FK), `class_id` (FK), `assigned_teacher_id` (FK), `fs_id_number` (unique), `status` ('Enrolled'|'Completed'|'Dropped'), `completion_recorded` (boolean), `completed_at`, `recorded_by` (FK), timestamps.

[ ] BE-037 — Create fs_chapter_progress table schema definition

Priority: P0
Depends on: BE-036
File: src/db/schema/fs.ts
Purpose: Track student chapter completion, reading scores (0-100), and facilitator evaluations.
Done when: Table `fs_chapter_progress` defined with `id`, `student_id` (FK), `chapter_number`, `chapter_title`, `is_completed` (boolean), `score` (integer), `feedback`, `graded_by` (FK), `graded_at`.

[ ] BE-038 — Create events table schema definition

Priority: P0
Depends on: BE-023
File: src/db/schema/content.ts
Purpose: Store fellowship calendar events with date ranges and cancellation status.
Done when: Table `events` defined with `id`, `title`, `description`, `location`, `start_time`, `end_time`, `category`, `banner_url`, `status` ('scheduled'|'cancelled'), `created_by`, timestamps.

[ ] BE-039 — Create announcements table schema definition

Priority: P0
Depends on: BE-023
File: src/db/schema/content.ts
Purpose: Store broadcast notices with priority handling ('Standard'|'High'|'Urgent') and expiration filtering.
Done when: Table `announcements` defined with `id`, `title`, `content`, `priority`, `published_at`, `expires_at`, `created_by`, timestamps.

[ ] BE-040 — Create website_revisions table schema definition

Priority: P0
Depends on: BE-023
File: src/db/schema/content.ts
Purpose: Support Controlled CMS single-active-published revision model with staging draft support.
Done when: Table `website_revisions` defined with `id`, `version_number`, `status` ('draft'|'published'|'archived'), `sections_data` (JSONB), `created_by`, `published_at`, timestamps.

[ ] BE-041 — Create media_assets table schema definition

Priority: P0
Depends on: BE-023
File: src/db/schema/media.ts
Purpose: Store uploaded media file metadata including secure HTTPS CDN URLs, file size, MIME type, and uploader user ID.
Done when: Table `media_assets` defined with `id`, `filename`, `mime_type`, `file_size_bytes`, `storage_key`, `public_url`, `uploaded_by` (FK), timestamps.

[ ] BE-042 — Create audit_logs table schema definition

Priority: P0
Depends on: BE-023
File: src/db/schema/audit.ts
Purpose: Append-only audit table logging security-critical administrative actions.
Done when: Table `audit_logs` defined with `id`, `actor_id` (FK), `actor_name`, `actor_role`, `action`, `target_type`, `target_id`, `details` (JSONB), `ip_address`, `created_at`.

---

## SECTION 04 — DATABASE MIGRATIONS & SEEDS

[ ] BE-043 — Generate initial PostgreSQL DDL migration script

Priority: P0
Depends on: BE-023 to BE-042
File: src/db/migrations/0000_initial_schema.sql
Purpose: Output complete SQL DDL statements creating all 20 database tables, foreign keys, constraints, and indexes.
Done when: Migration file `0000_initial_schema.sql` generated and executes cleanly against empty PostgreSQL database.

[ ] BE-044 — Create initial system seeder for 15 canonical roles and initial academic session

Priority: P0
Depends on: BE-043
File: src/db/seeds/initialSeed.ts
Purpose: Populate production database with 15 fellowship roles and default active academic session ('2024/2025').
Done when: Seed script executes idempotently and populates `roles` and `academic_sessions` tables.

[ ] BE-045 — Create scripture repository seeder pipeline for KJV and WEB translations

Priority: P0
Depends on: BE-043
File: src/db/seeds/bibleSeed.ts
Purpose: Populate production database with 66 books and ~62,200 verses for KJV and WEB Bible translations.
Done when: `bibleSeed.ts` populates `bible_translations`, `bible_books`, and `bible_verses` with GIN `tsvector` data.

[ ] BE-046 — Implement database migration runner script

Priority: P0
Depends on: BE-043
File: src/db/migrate.ts
Purpose: Programmatically run pending Drizzle ORM migrations on application startup or deploy pipeline.
Done when: `npm run db:migrate` connects to database, applies pending migrations, and exits cleanly.

---

## SECTION 05 — ENVIRONMENT & CONFIGURATION

[ ] BE-047 — Document all required environment variables in .env.example

Priority: P0
Depends on: BE-004
File: .env.example
Purpose: Ensure `.env.example` lists every configuration variable required by database, authentication, mailer, media, and security modules.
Done when: `.env.example` contains clear comments and key names for all environment settings.

[ ] BE-048 — Configure CORS middleware with credentials support

Priority: P0
Depends on: BE-005, BE-008
File: src/config/cors.config.ts
Purpose: Restrict cross-origin HTTP requests to authorized `APP_BASE_URL` origin while enabling `credentials: true` for HTTP-only cookies.
Done when: CORS rejects unauthorized origin preflight requests and allows authorized client credentials.

[ ] BE-049 — Configure Helmet HTTP security headers in Express server

Priority: P0
Depends on: BE-008
File: server.ts
Purpose: Mount Helmet middleware setting CSP, HSTS, X-Content-Type-Options, X-Frame-Options, and Referrer-Policy headers.
Done when: HTTP responses contain standard security headers inspected via curl or browser DevTools.

---

## SECTION 06 — AUTHENTICATION

[ ] BE-050 — Implement magic-link raw token generator and SHA-256 hashing utilities

Priority: P0
Depends on: BE-006
File: src/modules/auth/auth.utils.ts
Purpose: Generate cryptographically secure 256-bit random tokens via `crypto.randomBytes(32)` and SHA-256 hashing helper functions.
Done when: `generateMagicLinkToken()` returns raw hex token and SHA-256 hash string.

[ ] BE-051 — Implement HTTP-only secure cookie helper utilities

Priority: P0
Depends on: BE-006
File: src/modules/auth/cookie.utils.ts
Purpose: Standardize `asf_session` cookie options (`HttpOnly = true`, `Secure = (NODE_ENV === 'production')`, `SameSite = 'Lax'`, `Max-Age = 30 days`).
Done when: `setSessionCookie(res, token)` and `clearSessionCookie(res)` set and clear `asf_session` cookie correctly.

[ ] BE-052 — Create user registration logic in Auth Service

Priority: P0
Depends on: BE-023, BE-028, BE-050
File: src/modules/auth/auth.service.ts
Purpose: Register new user with `account_status = 'Active'`, assign default 'Member' role, and issue magic link email.
Done when: Registration creates user row, inserts 'Member' role, generates magic link token, and calls mailer adapter.

[ ] BE-053 — Create magic-link request logic with enumeration protection

Priority: P0
Depends on: BE-023, BE-028, BE-050
File: src/modules/auth/auth.service.ts
Purpose: Handle magic-link requests by returning identical HTTP 200 OK message regardless of whether email exists in database.
Done when: Account enumeration attacks are mitigated by generic response timing and parity.

[ ] BE-054 — Create magic-link token verification logic with single-use atomic consumption

Priority: P0
Depends on: BE-028, BE-029, BE-050
File: src/modules/auth/auth.service.ts
Purpose: Verify raw token against stored SHA-256 hash inside database transaction using `FOR UPDATE` lock, mark used, and issue session cookie.
Done when: Valid token issues session cookie and invalid/expired/reused token returns HTTP 401 Unauthorized.

[ ] BE-055 — Create 30-day sliding session creation and update logic

Priority: P0
Depends on: BE-029, BE-051
File: src/modules/auth/auth.service.ts
Purpose: Maintain server-side session in `user_sessions`. If request occurs within 7 days of expiry, extend `expires_at` by 30 days.
Done when: Sliding expiration logic extends valid session automatically on active requests.

[ ] BE-056 — Create logout and session revocation logic

Priority: P0
Depends on: BE-029, BE-051
File: src/modules/auth/auth.service.ts
Purpose: Revoke active session row (`is_revoked = TRUE`) and clear `asf_session` HTTP-only cookie on logout.
Done when: Logout revokes session server-side and clears client cookie.

[ ] BE-057 — Create session authentication middleware

Priority: P0
Depends on: BE-029, BE-051
File: src/middleware/auth.middleware.ts
Purpose: Extract `asf_session` cookie, hash token, query active non-revoked session, verify `account_status = 'Active'`, and attach `req.user`.
Done when: Unauthenticated requests return HTTP 401 Unauthorized and valid sessions attach user object to request context.

[ ] BE-058 — Implement account suspension session revocation hook

Priority: P0
Depends on: BE-029
File: src/modules/members/members.service.ts
Purpose: Automatically revoke all active sessions (`UPDATE user_sessions SET is_revoked = TRUE`) when account is suspended.
Done when: Suspending user account immediately invalidates all active sessions across all devices.

---

## SECTION 07 — USERS / MEMBERS

[ ] BE-059 — Create Member Service for profile management

Priority: P0
Depends on: BE-023
File: src/modules/members/members.service.ts
Purpose: Provide profile retrieval, profile updates, and administrative member directory querying logic.
Done when: Member Service exports functions for `getMemberProfile`, `updateMemberProfile`, and `getMemberDirectory`.

[ ] BE-060 — Implement GET /api/members/me handler in Member Controller

Priority: P0
Depends on: BE-057, BE-059
File: src/modules/members/members.controller.ts
Purpose: Return authenticated member's personal profile and assigned administrative roles.
Done when: GET `/api/members/me` returns current user profile and role array.

[ ] BE-061 — Implement PUT /api/members/me handler in Member Controller

Priority: P0
Depends on: BE-057, BE-059
File: src/modules/members/members.controller.ts
Purpose: Allow authenticated user to update their editable profile fields (full name, phone number, department).
Done when: PUT `/api/members/me` updates user record and returns updated profile.

[ ] BE-062 — Implement privacy-scoped directory query with phone/email masking

Priority: P0
Depends on: BE-057, BE-059
File: src/modules/members/members.service.ts
Purpose: Provide member directory. Mask phone and email for standard members (`members.view_private` false); display full contact info for authorized Executives.
Done when: Standard members receive masked contacts and Executives receive unmasked directory details.

[ ] BE-063 — Implement administrative role assignment handler

Priority: P0
Depends on: BE-027, BE-059
File: src/modules/members/members.service.ts
Purpose: Allow President or Technical Administrator to assign or replace member administrative roles.
Done when: Role updates persist in `user_roles` and trigger audit log entry.

[ ] BE-064 — Implement administrative account status toggle handler

Priority: P0
Depends on: BE-023, BE-058, BE-059
File: src/modules/members/members.service.ts
Purpose: Allow President or Technical Administrator to toggle account status ('Active'|'Suspended'|'Deactivated').
Done when: Status updates persist and suspending account revokes user sessions.

---

## SECTION 08 — ACADEMIC SESSIONS & PROGRESSION

[ ] BE-065 — Create Academic Session Service

Priority: P0
Depends on: BE-025
File: src/modules/academic_session/academic.service.ts
Purpose: Manage academic session lifecycle, active session query, and batch student progression.
Done when: Academic Service handles creation, activation, and automated level rollover.

[ ] BE-066 — Implement active academic session getter endpoint

Priority: P0
Depends on: BE-065
File: src/modules/academic_session/academic.controller.ts
Purpose: Return current active academic session record (`WHERE is_active = TRUE`).
Done when: GET `/api/academic-sessions/active` returns active session name and dates.

[ ] BE-067 — Implement automated batch student level progression on session activation

Priority: P0
Depends on: BE-024, BE-065
File: src/modules/academic_session/academic.service.ts
Purpose: Execute atomic database transaction on new session activation: promote 100L->200L, 200L->300L, 300L->400L, 400L(4yr)->Alumni, 400L(5yr)->500L, 500L->Alumni.
Done when: Rollover updates user academic levels and creates history entries in `user_academic_history`.

[ ] BE-068 — Implement manual student academic level override handler

Priority: P0
Depends on: BE-024, BE-059
File: src/modules/members/members.service.ts
Purpose: Allow General Secretary or President to manually override a student's academic level for extra semesters or program transfers.
Done when: Level override updates user record and logs history entry with `is_override = TRUE` and override reason.

---

## SECTION 09 — RBAC / AUTHORIZATION

[ ] BE-069 — Define 15 canonical roles constants and permission matrix

Priority: P0
Depends on: BE-026
File: src/modules/roles/roles.constants.ts
Purpose: Export canonical role ID definitions and map permission keys across the 15 fellowship administrative roles.
Done when: `roles.constants.ts` defines all 15 roles and permission keys matching normalized system specs.

[ ] BE-070 — Implement requireRole middleware guard

Priority: P0
Depends on: BE-057, BE-069
File: src/middleware/rbac.middleware.ts
Purpose: Restrict endpoint access to specific authorized role IDs (e.g. `requireRole('President / Executive', 'Technical Administrator')`).
Done when: Unauthorized roles receive HTTP 403 Forbidden error response.

[ ] BE-071 — Implement requirePermission middleware guard

Priority: P0
Depends on: BE-057, BE-069
File: src/middleware/rbac.middleware.ts
Purpose: Restrict endpoint access based on assigned permission keys (e.g. `requirePermission('members.edit_role')`).
Done when: Middleware checks user role permissions and rejects unauthorized requests with HTTP 403 Forbidden.

[ ] BE-072 — Add RBAC evaluation tests for permission key verification

Priority: P0
Depends on: BE-069, BE-071
File: src/test/unit/rbac.test.ts
Purpose: Verify permission evaluation functions across all 15 canonical roles.
Done when: Unit tests confirm Member lacks admin rights, President has admin rights, and FS Teacher has grading rights.

---

## SECTION 10 — API FOUNDATION

[ ] BE-073 — Create Zod boundary request payload validator middleware

Priority: P0
Depends on: BE-010
File: src/middleware/validate.middleware.ts
Purpose: Sanitize and validate request body, query parameters, and URL params against Zod schemas before controller execution.
Done when: Invalid request payloads return HTTP 422 Unprocessable Entity with specific field error details.

[ ] BE-074 — Define standard API success and error JSON response envelope formatting helpers

Priority: P0
Depends on: None
File: src/utils/response.ts
Purpose: Provide helper functions `sendSuccess(res, data, statusCode)` and `sendError(res, message, code, statusCode)`.
Done when: All API endpoints return standardized JSON envelope structures `{ success: true, data }` or `{ success: false, error }`.

[ ] BE-075 — Register all API router modules under /api namespace

Priority: P0
Depends on: BE-008
File: server.ts
Purpose: Mount router modules (`/api/auth`, `/api/members`, `/api/academic-sessions`, `/api/content`, `/api/bible`, `/api/bible-study`, `/api/fs`, `/api/events`, `/api/announcements`, `/api/media`, `/api/admin`).
Done when: Server routes all incoming `/api/*` HTTP requests to appropriate router modules.

---

## SECTION 11 — COMPLETE API ROUTES

[ ] BE-076 — Implement POST /api/auth/register route

Priority: P0
Depends on: BE-052, BE-073, BE-074
File: src/modules/auth/auth.routes.ts
Purpose: Public endpoint registering new user account and dispatching magic link email.
Done when: POST request with valid registration body creates user and returns HTTP 201 Created.

[ ] BE-077 — Implement POST /api/auth/magic-link route

Priority: P0
Depends on: BE-053, BE-073, BE-074
File: src/modules/auth/auth.routes.ts
Purpose: Public endpoint requesting magic-link login email for existing email address.
Done when: POST request returns generic HTTP 200 OK enumeration-resistant response.

[ ] BE-078 — Implement POST /api/auth/verify route

Priority: P0
Depends on: BE-054, BE-073, BE-074
File: src/modules/auth/auth.routes.ts
Purpose: Public endpoint verifying raw magic-link token, consuming token atomically, and issuing session cookie.
Done when: Valid token returns user object and sets `asf_session` HTTP-only cookie.

[ ] BE-079 — Implement GET /api/auth/me route

Priority: P0
Depends on: BE-057, BE-074
File: src/modules/auth/auth.routes.ts
Purpose: Authenticated endpoint returning current session user profile and administrative roles.
Done when: Authenticated GET request returns profile data and unauthenticated request returns 401.

[ ] BE-080 — Implement POST /api/auth/logout route

Priority: P0
Depends on: BE-056, BE-057, BE-074
File: src/modules/auth/auth.routes.ts
Purpose: Authenticated endpoint revoking active session and clearing HTTP-only cookie.
Done when: POST request revokes session row in DB and clears cookie.

[ ] BE-081 — Implement GET /api/members/me route

Priority: P0
Depends on: BE-060, BE-074
File: src/modules/members/members.routes.ts
Purpose: Authenticated endpoint fetching logged-in member details.
Done when: Returns current user profile record.

[ ] BE-082 — Implement PUT /api/members/me route

Priority: P0
Depends on: BE-061, BE-073, BE-074
File: src/modules/members/members.routes.ts
Purpose: Authenticated endpoint updating member profile details.
Done when: Valid payload updates user details and returns updated profile.

[ ] BE-083 — Implement GET /api/members directory route

Priority: P0
Depends on: BE-062, BE-071, BE-074
File: src/modules/members/members.routes.ts
Purpose: Authenticated endpoint returning member directory with privacy-scoped phone/email masking.
Done when: GET request returns directory array with appropriate privacy field masking based on requester role.

[ ] BE-084 — Implement GET /api/members/:id route

Priority: P0
Depends on: BE-059, BE-071, BE-074
File: src/modules/members/members.routes.ts
Purpose: Authenticated endpoint fetching specific member details by ID.
Done when: Returns member details or HTTP 404 Not Found.

[ ] BE-085 — Implement PATCH /api/members/:id/role route

Priority: P0
Depends on: BE-063, BE-071, BE-074
File: src/modules/members/members.routes.ts
Purpose: Protected endpoint (`members.edit_role`) updating member assigned administrative roles.
Done when: Updates user roles in database and logs audit event.

[ ] BE-086 — Implement PATCH /api/members/:id/status route

Priority: P0
Depends on: BE-064, BE-071, BE-074
File: src/modules/members/members.routes.ts
Purpose: Protected endpoint (`members.edit_status`) updating user account status ('Active'|'Suspended'|'Deactivated').
Done when: Status update persists, suspends sessions if applicable, and logs audit event.

[ ] BE-087 — Implement PATCH /api/members/:id/academic-level route

Priority: P0
Depends on: BE-068, BE-071, BE-074
File: src/modules/members/members.routes.ts
Purpose: Protected endpoint (`academic.rollover`) manually updating student academic level.
Done when: Level updated and entry created in `user_academic_history` with `is_override = TRUE`.

[ ] BE-088 — Implement GET /api/academic-sessions/active route

Priority: P0
Depends on: BE-066, BE-074
File: src/modules/academic_session/academic.routes.ts
Purpose: Authenticated endpoint fetching active academic session details.
Done when: Returns active session record.

[ ] BE-089 — Implement POST /api/academic-sessions route

Priority: P0
Depends on: BE-065, BE-071, BE-074
File: src/modules/academic_session/academic.routes.ts
Purpose: Protected endpoint (`academic.rollover`) creating new academic session.
Done when: Creates session row in database.

[ ] BE-090 — Implement POST /api/academic-sessions/:id/activate-and-progress route

Priority: P0
Depends on: BE-067, BE-071, BE-074
File: src/modules/academic_session/academic.routes.ts
Purpose: Protected endpoint (`academic.rollover`) activating target session and executing batch student level rollover.
Done when: Atomically activates session and updates student academic levels.

[ ] BE-091 — Implement GET /api/content/website public route

Priority: P0
Depends on: BE-074
File: src/modules/cms/cms.routes.ts
Purpose: Public endpoint returning active published website revision content (`WHERE status = 'published'`).
Done when: Returns published dynamic sections JSON data.

[ ] BE-092 — Implement GET /api/content/website/draft route

Priority: P0
Depends on: BE-071, BE-074
File: src/modules/cms/cms.routes.ts
Purpose: Protected endpoint (`website.edit_draft`) fetching active working website draft revision.
Done when: Returns working draft sections data.

[ ] BE-093 — Implement PUT /api/content/website/draft route

Priority: P0
Depends on: BE-071, BE-073, BE-074
File: src/modules/cms/cms.routes.ts
Purpose: Protected endpoint (`website.edit_draft`) updating draft website section content with Zod schema validation.
Done when: Validates section schemas and saves draft revision.

[ ] BE-094 — Implement POST /api/content/website/publish route

Priority: P0
Depends on: BE-071, BE-074
File: src/modules/cms/cms.routes.ts
Purpose: Protected endpoint (`website.publish`) promoting draft revision to active published state and archiving prior revision.
Done when: Atomically updates revision statuses and publishes website changes.

[ ] BE-095 — Implement GET /api/bible/translations route

Priority: P0
Depends on: BE-074
File: src/modules/bible/bible.routes.ts
Purpose: Public endpoint returning available Bible translation list ('KJV', 'WEB').
Done when: Returns array of Bible translations.

[ ] BE-096 — Implement GET /api/bible/:version/books route

Priority: P0
Depends on: BE-074
File: src/modules/bible/bible.routes.ts
Purpose: Public endpoint returning 66 Bible books for requested translation.
Done when: Returns books list for translation version.

[ ] BE-097 — Implement GET /api/bible/:version/:book/:chapter route

Priority: P0
Depends on: BE-074
File: src/modules/bible/bible.routes.ts
Purpose: Public endpoint returning scripture verses for specified book and chapter.
Done when: Returns ordered array of verse objects `{ verse, text }`.

[ ] BE-098 — Implement GET /api/bible/search route

Priority: P0
Depends on: BE-074
File: src/modules/bible/bible.routes.ts
Purpose: Public endpoint executing full-text keyword search across scriptures using PostgreSQL `tsvector`.
Done when: GET `/api/bible/search?q=grace&version=KJV` returns ranked matching verses.

[ ] BE-099 — Implement GET /api/bible-study list route

Priority: P0
Depends on: BE-074
File: src/modules/bible_study/bibleStudy.routes.ts
Purpose: Public endpoint returning published weekly Bible Study outline list.
Done when: Returns list of published Bible Study outlines.

[ ] BE-100 — Implement GET /api/bible-study/current route

Priority: P0
Depends on: BE-074
File: src/modules/bible_study/bibleStudy.routes.ts
Purpose: Public endpoint deriving active current week Bible Study outline.
Done when: Returns latest published study outline where `study_date <= CURRENT_DATE`.

[ ] BE-101 — Implement GET /api/bible-study/:id route

Priority: P0
Depends on: BE-074
File: src/modules/bible_study/bibleStudy.routes.ts
Purpose: Public endpoint fetching single Bible Study outline by ID.
Done when: Returns study outline details or 404.

[ ] BE-102 — Implement POST /api/bible-study create route

Priority: P0
Depends on: BE-071, BE-073, BE-074
File: src/modules/bible_study/bibleStudy.routes.ts
Purpose: Protected endpoint (`bible_study.create`) creating draft 10-part Bible Study outline.
Done when: Creates draft outline record in database.

[ ] BE-103 — Implement PUT /api/bible-study/:id update route

Priority: P0
Depends on: BE-071, BE-073, BE-074
File: src/modules/bible_study/bibleStudy.routes.ts
Purpose: Protected endpoint (`bible_study.create`) updating draft Bible Study outline.
Done when: Updates study outline record.

[ ] BE-104 — Implement PATCH /api/bible-study/:id/publish route

Priority: P0
Depends on: BE-071, BE-074
File: src/modules/bible_study/bibleStudy.routes.ts
Purpose: Protected endpoint (`bible_study.publish`) setting study outline status to 'published'.
Done when: Updates publication status to 'published' and logs audit event.

[ ] BE-105 — Implement POST /api/bible-study/upload-outline route

Priority: P1
Depends on: BE-071, BE-074
File: src/modules/bible_study/bibleStudy.routes.ts
Purpose: Protected endpoint (`bible_study.create`) accepting syllabus PDF upload and staging draft outlines.
Done when: Parses PDF file, extracts outline sections, and inserts draft study outline.

[ ] BE-106 — Implement POST /api/fs/admissions public application route

Priority: P0
Depends on: BE-073, BE-074
File: src/modules/foundational_school/fs.routes.ts
Purpose: Authenticated member endpoint submitting candidate application for Foundational School enrollment.
Done when: Inserts application row with status = 'Pending Review'.

[ ] BE-107 — Implement GET /api/fs/admin/admissions review list route

Priority: P0
Depends on: BE-071, BE-074
File: src/modules/foundational_school/fs.routes.ts
Purpose: Protected endpoint (`fs.admissions.review`) returning pending FS candidate applications.
Done when: Returns pending admissions applications.

[ ] BE-108 — Implement PATCH /api/fs/admin/admissions/:id/review route

Priority: P0
Depends on: BE-071, BE-073, BE-074
File: src/modules/foundational_school/fs.routes.ts
Purpose: Protected endpoint (`fs.admissions.review`) reviewing application; if approved, enrolls candidate in `fs_students`.
Done when: Updates application status and creates student record with generated `fs_id_number`.

[ ] BE-109 — Implement GET /api/fs/materials student reader route

Priority: P0
Depends on: BE-057, BE-074
File: src/modules/foundational_school/fs.routes.ts
Purpose: Authenticated FS Student endpoint fetching curriculum materials.
Done when: Returns discipleship chapter reading list.

[ ] BE-110 — Implement GET /api/fs/progress student progress route

Priority: P0
Depends on: BE-057, BE-074
File: src/modules/foundational_school/fs.routes.ts
Purpose: Authenticated FS Student endpoint fetching personal chapter completions and grades.
Done when: Returns progress records for authenticated student.

[ ] BE-111 — Implement PATCH /api/fs/admin/students/:id/grade route

Priority: P0
Depends on: BE-071, BE-073, BE-074
File: src/modules/foundational_school/fs.routes.ts
Purpose: Protected endpoint (`fs.students.grade`) allowing assigned FS Teacher to grade chapter progress (score 0-100 and feedback).
Done when: Inserts or updates chapter grade in `fs_chapter_progress`.

[ ] BE-112 — Implement PATCH /api/fs/admin/students/:id/record-completion route

Priority: P0
Depends on: BE-071, BE-074
File: src/modules/foundational_school/fs.routes.ts
Purpose: Protected endpoint (`fs.students.record_completion`) allowing VP / FS Coordinator to record official completion/graduation.
Done when: Sets `completion_recorded = TRUE`, status = 'Completed', and logs audit event.

[ ] BE-113 — Implement GET /api/events calendar list route

Priority: P0
Depends on: BE-074
File: src/modules/events/events.routes.ts
Purpose: Public endpoint returning events calendar with optional filter (`?filter=upcoming` vs `filter=past`).
Done when: Returns filtered array of events.

[ ] BE-114 — Implement POST /api/events create route

Priority: P0
Depends on: BE-071, BE-073, BE-074
File: src/modules/events/events.routes.ts
Purpose: Protected endpoint (`events.create_edit`) creating calendar event.
Done when: Creates event record in database.

[ ] BE-115 — Implement PUT /api/events/:id update route

Priority: P0
Depends on: BE-071, BE-073, BE-074
File: src/modules/events/events.routes.ts
Purpose: Protected endpoint (`events.create_edit`) updating event details.
Done when: Updates event record.

[ ] BE-116 — Implement PATCH /api/events/:id/cancel soft cancellation route

Priority: P0
Depends on: BE-071, BE-074
File: src/modules/events/events.routes.ts
Purpose: Protected endpoint (`events.create_edit`) marking event status as 'cancelled'.
Done when: Updates event status to 'cancelled'.

[ ] BE-117 — Implement GET /api/announcements feed route

Priority: P0
Depends on: BE-074
File: src/modules/announcements/announcements.routes.ts
Purpose: Public endpoint returning active non-expired broadcast announcements sorted by priority.
Done when: Returns announcements sorted by priority (`Urgent` > `High` > `Standard`).

[ ] BE-118 — Implement POST /api/announcements create route

Priority: P0
Depends on: BE-071, BE-073, BE-074
File: src/modules/announcements/announcements.routes.ts
Purpose: Protected endpoint (`announcements.publish`) creating broadcast announcement.
Done when: Creates announcement record in database.

[ ] BE-119 — Implement PATCH /api/announcements/:id/publish route

Priority: P0
Depends on: BE-071, BE-074
File: src/modules/announcements/announcements.routes.ts
Purpose: Protected endpoint (`announcements.publish`) publishing announcement notice.
Done when: Updates `published_at` timestamp.

[ ] BE-120 — Implement POST /api/media/upload asset upload route

Priority: P0
Depends on: BE-071, BE-074
File: src/modules/media/media.routes.ts
Purpose: Protected endpoint (`media.upload`) uploading file buffer, validating MIME magic bytes, saving to storage adapter, and persisting metadata.
Done when: Saves file, inserts row in `media_assets`, and returns HTTPS CDN URL.

[ ] BE-121 — Implement GET /api/media/assets metadata list route

Priority: P0
Depends on: BE-071, BE-074
File: src/modules/media/media.routes.ts
Purpose: Protected endpoint (`media.upload`) returning list of uploaded media assets.
Done when: Returns array of media asset metadata objects.

[ ] BE-122 — Implement GET /api/admin/audit-logs query route

Priority: P0
Depends on: BE-071, BE-074
File: src/modules/audit/audit.routes.ts
Purpose: Protected endpoint (`system.logs.view`) querying append-only audit log records.
Done when: Returns paginated audit logs array.

[ ] BE-123 — Implement GET /api/admin/health liveness/readiness check route

Priority: P0
Depends on: BE-074
File: server.ts
Purpose: Health telemetry endpoint for container runtime checking uptime, database connectivity, and latency.
Done when: Returns HTTP 200 OK with `{ success: true, data: { status: 'ok', dbConnected: true } }`.

---

## SECTION 12 — WEBSITE / CMS

[ ] BE-124 — Create Zod dynamic section schemas

Priority: P0
Depends on: BE-005
File: src/modules/cms/cms.schema.ts
Purpose: Strictly validate dynamic section types (`text_image`, `feature_grid`, `quote`, `callout`, `scripture_highlight`) and reject unrecognized fields or script injection.
Done when: Zod schema rejects raw `<script>` tags or unknown section type strings.

[ ] BE-125 — Create CMS Service managing website revisions

Priority: P0
Depends on: BE-040, BE-124
File: src/modules/cms/cms.service.ts
Purpose: Manage single-active-published revision model, draft staging, and content queries.
Done when: CMS Service handles `getPublishedRevision`, `getDraftRevision`, `saveDraft`, and `publishDraft`.

[ ] BE-126 — Implement revision publishing workflow with atomic draft promotion

Priority: P0
Depends on: BE-125
File: src/modules/cms/cms.service.ts
Purpose: Atomically archive current published revision (`status = 'archived'`) and promote draft (`status = 'published'`, `published_at = NOW()`) inside database transaction.
Done when: Publishing draft updates active website content instantly.

[ ] BE-127 — Add CMS section schema validation unit tests

Priority: P0
Depends on: BE-124
File: src/test/integration/cms.test.ts
Purpose: Verify dynamic section schemas accept valid blocks and reject invalid structures.
Done when: Tests pass for all 5 section types.

---

## SECTION 13 — MEDIA

[ ] BE-128 — Create Media Service handling file uploads and asset metadata

Priority: P0
Depends on: BE-016, BE-041
File: src/modules/media/media.service.ts
Purpose: Validate file size (max 5MB), verify MIME type, upload to storage adapter, and record asset metadata.
Done when: Media Service handles file upload pipeline and database metadata creation.

[ ] BE-129 — Implement file magic byte header verification for MIME security

Priority: P0
Depends on: BE-128
File: src/modules/media/media.service.ts
Purpose: Read first 12 bytes of uploaded buffer to confirm file header matches image/jpeg, image/png, or image/webp.
Done when: Renamed executable files with image extensions are rejected.

[ ] BE-130 — Implement image asset resizing and optimization pipeline

Priority: P1
Depends on: BE-128
File: src/modules/media/media.service.ts
Purpose: Strip metadata and optimize image file size prior to storage.
Done when: Uploaded images are optimized before saving to storage adapter.

[ ] BE-131 — Add media upload validation tests

Priority: P0
Depends on: BE-128, BE-129
File: src/test/integration/media.test.ts
Purpose: Test file size limit, magic byte validation, and storage adapter integration.
Done when: Integration tests confirm valid images uploaded and executables rejected.

---

## SECTION 14 — EVENTS

[ ] BE-132 — Create Events Service managing calendar events

Priority: P0
Depends on: BE-038
File: src/modules/events/events.service.ts
Purpose: Provide CRUD operations for fellowship calendar events.
Done when: Events Service handles creation, retrieval, updates, and soft cancellation.

[ ] BE-133 — Implement date filtering for upcoming vs past events

Priority: P0
Depends on: BE-132
File: src/modules/events/events.service.ts
Purpose: Filter events list by `start_time >= NOW()` (upcoming) or `start_time < NOW()` (past).
Done when: Query parameters filter events correctly based on date.

[ ] BE-134 — Implement soft cancellation handler for events

Priority: P0
Depends on: BE-132
File: src/modules/events/events.service.ts
Purpose: Update event status to 'cancelled' without deleting record from database.
Done when: Cancelled events remain in database marked with status = 'cancelled'.

---

## SECTION 15 — ANNOUNCEMENTS

[ ] BE-135 — Create Announcements Service managing broadcast notices

Priority: P0
Depends on: BE-039
File: src/modules/announcements/announcements.service.ts
Purpose: Provide notice creation, listing, publishing, and prioritization logic.
Done when: Announcements Service manages notice feed lifecycle.

[ ] BE-136 — Implement announcement priority sorting

Priority: P0
Depends on: BE-135
File: src/modules/announcements/announcements.service.ts
Purpose: Sort announcements feed by priority category (`Urgent` > `High` > `Standard`).
Done when: Urgent announcements appear at top of broadcast feed.

[ ] BE-137 — Implement announcement expiration date filtering

Priority: P0
Depends on: BE-135
File: src/modules/announcements/announcements.service.ts
Purpose: Exclude announcements where `expires_at <= NOW()` from default member feed.
Done when: Expired notices are excluded from active broadcast query.

---

## SECTION 16 — BIBLE

[ ] BE-138 — Create Bible Service managing multi-translation chapter reading

Priority: P0
Depends on: BE-030, BE-031, BE-032
File: src/modules/bible/bible.service.ts
Purpose: Provide Bible translation listing, books retrieval, and chapter verse reader.
Done when: Bible Service returns structured chapter verse array for requested book and chapter.

[ ] BE-139 — Implement PostgreSQL full-text keyword search using tsvector and GIN index

Priority: P0
Depends on: BE-032, BE-138
File: src/modules/bible/bible.service.ts
Purpose: Execute SQL full-text search query `WHERE tsv @@ plainto_tsquery('english', :query) ORDER BY ts_rank(...) DESC`.
Done when: Keyword search returns ranked matching scripture verses.

[ ] BE-140 — Implement scripture chapter caching headers

Priority: P1
Depends on: BE-138
File: src/modules/bible/bible.controller.ts
Purpose: Set `Cache-Control: public, max-age=86400, immutable` on static scripture endpoints.
Done when: Scripture GET requests include caching headers.

---

## SECTION 17 — BIBLE STUDY

[ ] BE-141 — Create Bible Study Service for 10-part outlines

Priority: P0
Depends on: BE-033
File: src/modules/bible_study/bibleStudy.service.ts
Purpose: Manage weekly Bible Study outlines structured across 10 canonical fields.
Done when: Service handles creation, updates, listing, single fetching, and publishing.

[ ] BE-142 — Implement active current week outline derivation based on study date

Priority: P0
Depends on: BE-141
File: src/modules/bible_study/bibleStudy.service.ts
Purpose: Query latest published study outline where `study_date <= CURRENT_DATE`.
Done when: Returns active week's study outline for Tuesday study cycle.

[ ] BE-143 — Create Syllabus PDF outline extraction pipeline service

Priority: P1
Depends on: BE-141
File: src/modules/bible_study/pdfExtractor.service.ts
Purpose: Parse uploaded syllabus PDF, extract structured text sections, and stage draft study outlines.
Done when: Uploaded syllabus PDF creates staged draft study outlines awaiting human review.

[ ] BE-144 — Implement outline publication workflow

Priority: P0
Depends on: BE-141
File: src/modules/bible_study/bibleStudy.service.ts
Purpose: Transition study outline from 'draft' to 'published' status and record publisher ID.
Done when: Published study becomes visible on public current week endpoint.

---

## SECTION 18 — FOUNDATIONAL SCHOOL

[ ] BE-145 — Create Foundational School Service

Priority: P0
Depends on: BE-034 to BE-037
File: src/modules/foundational_school/fs.service.ts
Purpose: Manage candidate applications, student enrollment, chapter progress, and completion recording.
Done when: FS Service manages discipleship lifecycle.

[ ] BE-146 — Implement candidate admissions application and approval workflow

Priority: P0
Depends on: BE-145
File: src/modules/foundational_school/fs.service.ts
Purpose: Submit application, allow coordinator review, and enroll candidate into `fs_students` on approval.
Done when: Candidate application approval automatically creates student record with `fs_id_number`.

[ ] BE-147 — Implement student chapter reading progress tracking

Priority: P0
Depends on: BE-145
File: src/modules/foundational_school/fs.service.ts
Purpose: Record student chapter completion state in `fs_chapter_progress`.
Done when: Student chapter completion persists.

[ ] BE-148 — Implement teacher chapter grading and feedback handler

Priority: P0
Depends on: BE-145
File: src/modules/foundational_school/fs.service.ts
Purpose: Allow assigned FS Teacher to submit chapter reading score (0-100) and feedback.
Done when: Teacher score and feedback persist in `fs_chapter_progress`.

[ ] BE-149 — Implement leadership-controlled completion recording handler

Priority: P0
Depends on: BE-145
File: src/modules/foundational_school/fs.service.ts
Purpose: Allow VP / FS Coordinator to record official completion (`completion_recorded = TRUE`, `status = 'Completed'`).
Done when: Completion recorded without automated formulas and audit log entry recorded.

---

## SECTION 19 — GOVERNANCE

[-] BE-150 — Implement dual-executive governance approval workflow

Priority: P2
Depends on: BE-104
File: src/modules/governance/governance.service.ts
Purpose: Handle two-person voting for published Bible Study outline deletion.
Done when: Feature implemented in Phase 2. Currently deferred.

[-] BE-151 — Implement governance request notification dispatch

Priority: P2
Depends on: BE-150
File: src/modules/governance/governance.service.ts
Purpose: Send email notifications to eligible Executive approvers when governance request is created.
Done when: Feature implemented in Phase 2. Currently deferred.

---

## SECTION 20 — AUDIT LOGGING

[ ] BE-152 — Create Audit Logger Service

Priority: P0
Depends on: BE-042
File: src/modules/audit/audit.service.ts
Purpose: Record security-critical administrative events into append-only `audit_logs` table.
Done when: `logAuditEvent(...)` creates audit log entry with actor ID, action, target, details, and IP address.

[ ] BE-153 — Create audit logging interceptor middleware

Priority: P0
Depends on: BE-152
File: src/middleware/audit.middleware.ts
Purpose: Intercept administrative state mutations and record audit events automatically.
Done when: Administrative PUT/POST/PATCH/DELETE actions log audit rows.

[ ] BE-154 — Implement audit log query endpoint handler

Priority: P0
Depends on: BE-152
File: src/modules/audit/audit.controller.ts
Purpose: Allow Technical Administrator or President to query paginated audit logs.
Done when: GET `/api/admin/audit-logs` returns audit entries sorted by timestamp descending.

---

## SECTION 21 — HEALTH & OPERATIONS

[ ] BE-155 — Create health check telemetry endpoint handler

Priority: P0
Depends on: BE-019
File: src/modules/audit/audit.service.ts
Purpose: Execute `SELECT 1` SQL query against PostgreSQL database and return health metrics.
Done when: GET `/api/admin/health` returns `dbConnected: true` and uptime duration.

[ ] BE-156 — Implement graceful shutdown signal handlers in server.ts

Priority: P0
Depends on: BE-008, BE-019
File: server.ts
Purpose: Catch `SIGTERM` and `SIGINT` signals, stop accepting new HTTP requests, and close PostgreSQL connection pool gracefully.
Done when: Server closes database connection pool and shuts down cleanly on SIGTERM.

[ ] BE-157 — Implement database connection check probe

Priority: P0
Depends on: BE-019
File: src/db/index.ts
Purpose: Verify database connection on application startup and log error if database is unreachable.
Done when: Application logs database connection status on boot.

---

## SECTION 22 — OFFLINE / CACHE SUPPORT

[ ] BE-158 — Ensure ETag and Cache-Control headers on GET scripture endpoints

Priority: P1
Depends on: BE-138
File: src/modules/bible/bible.controller.ts
Purpose: Return `ETag` headers for scripture chapter content to enable client HTTP caching.
Done when: Repeat scripture requests return HTTP 304 Not Modified when ETag matches.

[ ] BE-159 — Ensure ETag and Cache-Control headers on GET public website content endpoint

Priority: P1
Depends on: BE-125
File: src/modules/cms/cms.controller.ts
Purpose: Return `ETag` and `Cache-Control` headers on public website content query.
Done when: Website content endpoint supports client conditional GET caching.

[ ] BE-160 — Ensure ETag and Cache-Control headers on GET active Bible Study outline endpoint

Priority: P1
Depends on: BE-141
File: src/modules/bible_study/bibleStudy.controller.ts
Purpose: Return caching headers for active current week Bible Study outline.
Done when: Active study outline query includes caching headers.

---

## SECTION 23 — FRONTEND INTEGRATION

[ ] BE-161 — Configure frontend API client credentials and baseURL

Priority: P0
Depends on: BE-048
File: src/services/api/client.ts
Purpose: Configure fetch client with `credentials: 'include'` to send/receive `asf_session` HTTP-only cookie.
Done when: API client transmits session cookie on cross-origin requests.

[ ] BE-162 — Replace mock auth service with backend auth endpoints

Priority: P0
Depends on: BE-076 to BE-080
File: src/services/auth/auth.service.ts
Purpose: Wire `auth.service.ts` methods to real `/api/auth/*` HTTP endpoints when `VITE_USE_MOCK_SERVICES=false`.
Done when: User registration, magic link login, verification, me query, and logout run against real backend.

[ ] BE-163 — Replace mock admin service with backend members API

Priority: P0
Depends on: BE-083 to BE-087
File: src/services/adminService.ts
Purpose: Wire member directory, role assignment, and status toggle functions to `/api/members/*` backend endpoints.
Done when: Admin console member directory fetches and updates data from backend database.

[ ] BE-164 — Replace mock website content service with backend content API

Priority: P0
Depends on: BE-091 to BE-094
File: src/services/websiteContent.service.ts
Purpose: Wire public home page and admin CMS editor to `/api/content/website/*` backend endpoints.
Done when: Website copy updates and publishes against backend database.

[ ] BE-165 — Replace mock events service with backend events API

Priority: P0
Depends on: BE-113 to BE-116
File: src/services/eventsService.ts
Purpose: Wire events calendar UI to `/api/events/*` backend endpoints.
Done when: Events calendar loads and manages events from backend database.

[ ] BE-166 — Replace mock announcements service with backend announcements API

Priority: P0
Depends on: BE-117 to BE-119
File: src/services/announcementsService.ts
Purpose: Wire broadcast notice feed UI to `/api/announcements/*` backend endpoints.
Done when: Announcements feed displays notices fetched from backend database.

[ ] BE-167 — Replace mock Bible service with backend scripture API

Priority: P0
Depends on: BE-095 to BE-098
File: src/services/bibleService.ts
Purpose: Wire Bible reader UI and search bar to `/api/bible/*` backend endpoints.
Done when: Bible reader fetches chapters and full-text search queries backend API.

[ ] BE-168 — Replace mock Bible Study service with backend study outline API

Priority: P0
Depends on: BE-099 to BE-105
File: src/services/bibleStudyService.ts
Purpose: Wire active study reader and admin syllabus uploader to `/api/bible-study/*` backend endpoints.
Done when: Study outlines load and publish against backend database.

[ ] BE-169 — Replace mock Foundational School service with backend FS API

Priority: P0
Depends on: BE-106 to BE-112
File: src/services/fsService.ts
Purpose: Wire FS application form, student reader, teacher grading desk, and coordinator completion to `/api/fs/*` backend endpoints.
Done when: Complete FS discipleship workflow operates against real backend database.

---

## SECTION 24 — SECURITY HARDENING

[ ] BE-170 — Verify CORS settings restrict unauthorized cross-origin requests

Priority: P0
Depends on: BE-048
File: src/config/cors.config.ts
Purpose: Verify CORS rejects preflight OPTIONS requests from unauthorized origins.
Done when: Requests from unauthorized origin domain receive HTTP 403 / CORS block.

[ ] BE-171 — Verify Helmet config enforces Strict-Transport-Security and CSP

Priority: P0
Depends on: BE-049
File: server.ts
Purpose: Ensure responses set `Content-Security-Policy` and `Strict-Transport-Security` headers.
Done when: Security headers pass security audit inspection.

[ ] BE-172 — Verify Zod validation strips unrecognized fields on body/params/query

Priority: P0
Depends on: BE-073
File: src/middleware/validate.middleware.ts
Purpose: Configure `strip()` behavior in Zod validation middleware to remove arbitrary input fields.
Done when: Unknown payload keys are stripped before controller execution.

[ ] BE-173 — Perform secret leakage audit across build output files

Priority: P0
Depends on: BE-003, BE-005
File: src/config/env.config.ts
Purpose: Search client JS bundles in `dist/` to verify zero database credentials or secret API keys are leaked.
Done when: Client bundle search returns zero matches for secret environment variable keys.

[ ] BE-174 — Enforce magic byte file upload verification to block executable scripts

Priority: P0
Depends on: BE-129
File: src/modules/media/media.service.ts
Purpose: Validate file buffer magic numbers before saving file uploads.
Done when: Executables disguised with image file extensions are rejected.

---

## SECTION 25 — TESTING

[ ] BE-175 — Implement Foundation unit tests

Priority: P0
Depends on: BE-010, BE-011, BE-012
File: src/test/unit/foundation.test.ts
Purpose: Verify `AppError`, error handler middleware, and rate limiter.
Done when: Foundation unit tests pass 100%.

[ ] BE-176 — Implement Auth Service unit tests

Priority: P0
Depends on: BE-050, BE-054, BE-055
File: src/test/unit/auth.service.test.ts
Purpose: Verify magic-link token generation entropy, SHA-256 hash correctness, and 30-day sliding session math.
Done when: Auth Service unit tests pass 100%.

[ ] BE-177 — Implement Auth API HTTP integration tests

Priority: P0
Depends on: BE-076 to BE-080
File: src/test/integration/auth.test.ts
Purpose: Test registration, magic-link request enumeration resistance, token verification, session issuance, `/api/auth/me`, and logout via Supertest.
Done when: Auth integration tests pass 100%.

[ ] BE-178 — Implement RBAC Permission Matrix unit tests

Priority: P0
Depends on: BE-069, BE-071
File: src/test/unit/rbac.test.ts
Purpose: Test permission evaluation across all 15 canonical roles against authority matrix.
Done when: RBAC permission tests pass 100%.

[ ] BE-179 — Implement Member Directory integration tests

Priority: P0
Depends on: BE-083 to BE-087
File: src/test/integration/members.test.ts
Purpose: Verify phone/email masking for standard members and full visibility for Executives.
Done when: Member Directory integration tests pass 100%.

[ ] BE-180 — Implement Academic Session Progression unit tests

Priority: P0
Depends on: BE-067
File: src/test/unit/academic.service.test.ts
Purpose: Verify batch student level progression math (100L->200L, 400L 4yr->Alumni, 500L->Alumni).
Done when: Academic progression unit tests pass 100%.

[ ] BE-181 — Implement Controlled CMS integration tests

Priority: P0
Depends on: BE-091 to BE-094
File: src/test/integration/cms.test.ts
Purpose: Verify dynamic section Zod validation and draft-to-published revision lifecycle.
Done when: CMS integration tests pass 100%.

[ ] BE-182 — Implement Bible Engine integration tests

Priority: P0
Depends on: BE-095 to BE-098
File: src/test/integration/bible.test.ts
Purpose: Verify scripture chapter reading and PostgreSQL `tsvector` full-text search.
Done when: Bible Engine integration tests pass 100%.

[ ] BE-183 — Implement Bible Study Outline integration tests

Priority: P0
Depends on: BE-099 to BE-105
File: src/test/integration/bibleStudy.test.ts
Purpose: Verify 10-part study outline CRUD, active week derivation, and syllabus PDF extraction.
Done when: Bible Study integration tests pass 100%.

[ ] BE-184 — Implement Foundational School integration tests

Priority: P0
Depends on: BE-106 to BE-112
File: src/test/integration/fs.test.ts
Purpose: Verify candidate admissions review, teacher chapter grading, and coordinator completion recording.
Done when: Foundational School integration tests pass 100%.

[ ] BE-185 — Implement Events & Announcements integration tests

Priority: P0
Depends on: BE-113 to BE-119
File: src/test/integration/events.test.ts
Purpose: Verify event date filtering, soft cancellation, and priority notice sorting.
Done when: Events & Announcements integration tests pass 100%.

[ ] BE-186 — Implement Media Vault & Audit Logger integration tests

Priority: P0
Depends on: BE-120, BE-122
File: src/test/integration/media.test.ts
Purpose: Verify file upload validation and append-only audit logging.
Done when: Media & Audit integration tests pass 100%.

---

## SECTION 26 — PERFORMANCE & RELIABILITY

[ ] BE-187 — Add database index on users.email and users.account_status

Priority: P0
Depends on: BE-023
File: src/db/schema/users.ts
Purpose: Accelerate login user lookup and directory queries.
Done when: Index definitions added to `users` schema table.

[ ] BE-188 — Add database index on user_sessions.session_token_hash

Priority: P0
Depends on: BE-029
File: src/db/schema/auth.ts
Purpose: Speed up session validation query executed on every authenticated request.
Done when: Unique index definition added to `user_sessions` schema table.

[ ] BE-189 — Add GIN index on bible_verses.tsv

Priority: P0
Depends on: BE-032
File: src/db/schema/bible.ts
Purpose: Accelerate PostgreSQL full-text keyword search across ~62,200 verses.
Done when: GIN index definition added to `bible_verses` schema table.

[ ] BE-190 — Add database index on events.start_time and announcements.created_at

Priority: P0
Depends on: BE-038, BE-039
File: src/db/schema/content.ts
Purpose: Speed up calendar date filtering and announcement feed priority sorting queries.
Done when: Indexes added to `events` and `announcements` schema tables.

---

## SECTION 27 — DEPLOYMENT

[ ] BE-191 — Verify production build script bundles server.ts into dist/server.cjs

Priority: P0
Depends on: BE-003
File: package.json
Purpose: Confirm `npm run build` generates self-contained bundled file `dist/server.cjs`.
Done when: `npm run build` completes and `dist/server.cjs` exists.

[ ] BE-192 — Provision production PostgreSQL database instance and apply migrations

Priority: P0
Depends on: BE-043, BE-046
File: drizzle.config.ts
Purpose: Provision managed PostgreSQL instance and execute DDL migrations.
Done when: Production database contains all 20 tables, indexes, and constraints.

[ ] BE-193 — Execute production seeder for 15 roles and active academic session

Priority: P0
Depends on: BE-044, BE-192
File: src/db/seeds/initialSeed.ts
Purpose: Populate production database with 15 canonical roles and initial active academic session.
Done when: Production database contains 15 roles and active session record.

[ ] BE-194 — Seed production scripture database for KJV and WEB

Priority: P0
Depends on: BE-045, BE-192
File: src/db/seeds/bibleSeed.ts
Purpose: Populate production database with KJV and WEB scripture verses and search vectors.
Done when: Production database contains ~62,200 verses across KJV and WEB.

[ ] BE-195 — Configure production secrets and environment variables

Priority: P0
Depends on: BE-004
File: .env.example
Purpose: Securely set production environment variables in container runtime.
Done when: Production container starts cleanly with production environment values.

[ ] BE-196 — Verify container deployment liveness check probe

Priority: P0
Depends on: BE-123
File: server.ts
Purpose: Configure liveness probe targeting `/api/admin/health`.
Done when: Container deployment passes health check probe.

---

## SECTION 28 — DOCUMENTATION

[ ] BE-197 — Update API integration documentation

Priority: P1
Depends on: BE-161 to BE-169
File: API_INTEGRATION.md
Purpose: Document real API endpoints, request/response formats, and authentication requirements for frontend developers.
Done when: `API_INTEGRATION.md` reflects real backend API endpoints.

[ ] BE-198 — Update environment variable documentation

Priority: P1
Depends on: BE-004
File: .env.example
Purpose: Ensure `.env.example` contains complete configuration instructions and default values.
Done when: `.env.example` is fully documented.

---

## SECTION 29 — FINAL INTEGRATION

[ ] BE-199 — Execute full test suite npm run test and verify 100% pass rate

Priority: P0
Depends on: BE-175 to BE-186
File: package.json
Purpose: Execute all unit, integration, and security test suites using Vitest.
Done when: `npm run test` completes with 100% tests passing green.

[ ] BE-200 — Perform end-to-end production build and smoke test

Priority: P0
Depends on: BE-191, BE-199
File: package.json
Purpose: Execute `npm run build` and `npm run start` in production mode and verify core user flows against live database.
Done when: Application boots cleanly, serves SPA frontend, and executes API calls against backend database.
