# ASF Digital Platform — Data Dictionary & Entity Reference

**Document Status:** Reconciled & Authoritative  
**Architecture Foundation:** PostgreSQL, UUIDv4 Primary Keys, Foreign Key Integrity  
**Naming Standard:** `snake_case` tables and columns, singular table names.

---

## 1. Entity-Relationship Overview

```
                      ┌───────────────────┐
                      │      users        │
                      └─────────┬─────────┘
                                │ 1:N
                      ┌─────────▼─────────┐
                      │     sessions      │
                      └───────────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │ 1:N                 │ 1:N                 │ 1:N
┌─────────▼─────────┐ ┌─────────▼─────────┐ ┌─────────▼─────────┐
│ role_assignments  │ │    audit_logs     │ │  fs_enrollments   │
└─────────┬─────────┘ └───────────────────┘ └───────────────────┘
          │ N:1
┌─────────▼─────────┐
│      roles        │
└───────────────────┘

┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ academic_sessions │ │   bible_studies   │ │  fs_submissions   │
└───────────────────┘ └───────────────────┘ └───────────────────┘

┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│   announcements   │ │      events       │ │ website_revisions │
└───────────────────┘ └───────────────────┘ └───────────────────┘

┌───────────────────┐ ┌───────────────────┐
│    event_rsvps    │ │   media_assets    │
└───────────────────┘ └───────────────────┘
```

---

## 2. Core Entities

### 2.1 `users`
Represents the core fellowship member record.
- `id` (UUID, PK)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `name` (VARCHAR(150), NOT NULL)
- `phone_number` (VARCHAR(25), NULL)
- `department` (VARCHAR(100), NOT NULL)
- `academic_level` (VARCHAR(20), NOT NULL) — e.g. `'100'`, `'200'`, `'300'`, `'400'`, `'500'`, `'Spillover'`, `'Postgraduate'`
- `membership_status` (VARCHAR(30), NOT NULL, DEFAULT `'Active Student'`) — e.g. `'Active Student'`, `'Alumni'`, `'Suspended'`
- `subgroup` (VARCHAR(100), NULL) — e.g. `'Choir'`, `'Ushering'`, `'Technical'`
- `is_verified` (BOOLEAN, NOT NULL, DEFAULT FALSE)
- `created_at` (TIMESTAMPTZ, NOT NULL)
- `updated_at` (TIMESTAMPTZ, NOT NULL)

### 2.2 `sessions`
Represents persistent, server-side authenticated sessions.
- `id` (UUID, PK)
- `user_id` (UUID, FK -> `users.id` ON DELETE CASCADE, NOT NULL)
- `session_token_hash` (VARCHAR(255), UNIQUE, NOT NULL)
- `user_agent` (VARCHAR(500), NULL)
- `ip_address` (VARCHAR(45), NULL)
- `expires_at` (TIMESTAMPTZ, NOT NULL) — 30-day sliding TTL
- `created_at` (TIMESTAMPTZ, NOT NULL)

### 2.3 `roles` and `role_assignments`
Canonical RBAC architecture.
- `roles`: `id` (UUID, PK), `role_key` (VARCHAR(50), UNIQUE), `display_name` (VARCHAR(100)), `description` (TEXT)
  - Canonical Role Keys: `member`, `executive`, `president`, `general_secretary`, `bible_study_coordinator`, `publicity_coordinator`, `fs_coordinator`, `fs_teacher`, `fs_student`, `technical_administrator`.
- `role_assignments`: `id` (UUID, PK), `user_id` (UUID, FK -> `users.id`), `role_id` (UUID, FK -> `roles.id`), `assigned_by` (UUID, FK -> `users.id`), `created_at` (TIMESTAMPTZ).

### 2.4 `academic_sessions`
Tracks academic years and drives automatic academic level progression.
- `id` (UUID, PK)
- `session_name` (VARCHAR(20), UNIQUE, NOT NULL) — e.g. `'2024/2025'`, `'2025/2026'`
- `is_current` (BOOLEAN, NOT NULL, DEFAULT FALSE)
- `start_date` (DATE, NOT NULL)
- `end_date` (DATE, NULL)
- `created_at` (TIMESTAMPTZ, NOT NULL)

### 2.5 `bible_studies`
Structured curriculum for Tuesday Bible Study fellowship meetings.
- `id` (UUID, PK)
- `lesson_number` (INTEGER, NOT NULL)
- `title` (VARCHAR(255), NOT NULL)
- `topic` (VARCHAR(255), NOT NULL)
- `theme` (VARCHAR(255), NOT NULL)
- `study_date` (DATE, NOT NULL)
- `text_ref` (VARCHAR(150), NOT NULL)
- `text_content` (TEXT, NOT NULL)
- `memory_verse_ref` (VARCHAR(150), NOT NULL)
- `memory_verse_text` (TEXT, NOT NULL)
- `aim` (TEXT, NOT NULL)
- `introduction` (TEXT, NOT NULL)
- `study_guide` (JSONB, NOT NULL) — Structured array of `{ heading, scriptureRefs, paragraphs }`
- `discussion_questions` (JSONB, NOT NULL) — Array of question strings
- `conclusion` (TEXT, NOT NULL)
- `prayer_points` (JSONB, NOT NULL) — Array of prayer point strings
- `publication_status` (VARCHAR(30), NOT NULL, DEFAULT `'draft'`) — `'draft'`, `'published'`, `'archived'`
- `created_by` (UUID, FK -> `users.id`)
- `published_at` (TIMESTAMPTZ, NULL)
- `created_at` (TIMESTAMPTZ, NOT NULL)
- `updated_at` (TIMESTAMPTZ, NOT NULL)

### 2.6 `fs_enrollments` and `fs_submissions`
Foundational School operations.
- `fs_enrollments`: `id` (UUID, PK), `user_id` (UUID, FK -> `users.id`), `cohort_name` (VARCHAR(50)), `teacher_id` (UUID, FK -> `users.id`), `status` (VARCHAR(30) - `'applied'`, `'enrolled'`, `'completed'`, `'dropped'`), `enrolled_at` (TIMESTAMPTZ), `completed_at` (TIMESTAMPTZ).
- `fs_submissions`: `id` (UUID, PK), `enrollment_id` (UUID, FK -> `fs_enrollments.id`), `chapter_id` (VARCHAR(50)), `answers` (JSONB), `score` (NUMERIC(5,2)), `graded_by` (UUID, FK -> `users.id`), `feedback` (TEXT), `submitted_at` (TIMESTAMPTZ).

### 2.7 `events` and `event_rsvps`
Fellowship events and attendance interest.
- `events`: `id` (UUID, PK), `title` (VARCHAR(255)), `description` (TEXT), `event_date` (TIMESTAMPTZ), `location` (VARCHAR(255)), `flyer_url` (VARCHAR(500)), `is_cancelled` (BOOLEAN, DEFAULT FALSE).
- `event_rsvps`: `id` (UUID, PK), `event_id` (UUID, FK -> `events.id`), `user_id` (UUID, FK -> `users.id`), `created_at` (TIMESTAMPTZ).

### 2.8 `announcements`
Fellowship-wide notifications and notices.
- `id` (UUID, PK)
- `title` (VARCHAR(255), NOT NULL)
- `content` (TEXT, NOT NULL)
- `category` (VARCHAR(50), NOT NULL) — e.g. `'General'`, `'Executive'`, `'Academic'`
- `is_published` (BOOLEAN, NOT NULL, DEFAULT FALSE)
- `published_at` (TIMESTAMPTZ, NULL)
- `created_by` (UUID, FK -> `users.id`)

### 2.9 `website_revisions`
Versioned public CMS content blocks.
- `id` (UUID, PK)
- `section_key` (VARCHAR(100), NOT NULL)
- `content_json` (JSONB, NOT NULL)
- `status` (VARCHAR(20), NOT NULL) — `'draft'`, `'published'`
- `published_at` (TIMESTAMPTZ, NULL)
- `updated_by` (UUID, FK -> `users.id`)

### 2.10 `media_assets`
Uploaded media files tracked through `IMediaStorageAdapter`.
- `id` (UUID, PK)
- `filename` (VARCHAR(255), NOT NULL)
- `url` (VARCHAR(500), NOT NULL)
- `mime_type` (VARCHAR(100), NOT NULL)
- `size_bytes` (BIGINT, NOT NULL)
- `uploaded_by` (UUID, FK -> `users.id`)
- `created_at` (TIMESTAMPTZ, NOT NULL)

### 2.11 `audit_logs`
Immutable administrative audit log.
- `id` (UUID, PK)
- `user_id` (UUID, FK -> `users.id`, NULL)
- `action` (VARCHAR(100), NOT NULL)
- `entity_type` (VARCHAR(50), NOT NULL)
- `entity_id` (VARCHAR(100), NULL)
- `details` (JSONB, NULL)
- `ip_address` (VARCHAR(45), NULL)
- `created_at` (TIMESTAMPTZ, NOT NULL)
