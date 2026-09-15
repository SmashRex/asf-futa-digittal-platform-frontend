# ASF Digital Platform — API Documentation

**Document Type:** API Specification & Route Reference  
**Parent Document:** `ASF_BACKEND_SPECIFICATION_FINAL.md`  
**Status:** Authoritative Blueprint  

---

## 1. API Overview

The ASF Digital Platform exposes a clean, RESTful JSON HTTP API served by the Node.js/Express modular monolith.

### Key Conventions
- **Base URL**: `/api` (or `https://api.asf-futa.org` in production).
- **Authentication**: Opaque session cookie (`asf_session`) or Bearer token header (`Authorization: Bearer <session_token>`).
- **Response Format**: All endpoints return standard structured JSON:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Optional contextual message"
  }
  ```
- **Error Format**:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Field 'email' must be a valid institutional or personal email address.",
      "details": []
    }
  }
  ```

---

## 2. Core Endpoint Catalog

### 2.1 Authentication (`/api/auth`)
- `POST /api/auth/register`: Register new member (immediately active; initiates magic link).
- `POST /api/auth/magic-link`: Request sign-in magic link for existing email.
- `POST /api/auth/verify`: Verify magic-link token and create persistent 30-day session cookie.
- `GET /api/auth/me`: Retrieve current authenticated member identity, roles, and status.
- `POST /api/auth/logout`: Revoke active session and clear cookie.

### 2.2 Profile & Member Administration (`/api/users`, `/api/members`)
- `GET /api/users/profile`: Get logged-in user profile.
- `PUT /api/users/profile`: Update self profile information.
- `GET /api/members`: Search and list fellowship members (Authorized roles: Executive, Secretary, Tech Admin).
- `PATCH /api/members/:id/role`: Assign or modify member roles (Requires Executive / Tech Admin).
- `PATCH /api/members/:id/status`: Update member lifecycle status (`Active Student`, `Alumni`, `Suspended`).
- `PATCH /api/members/:id/academic-level`: Override member academic level (Secretary / Tech Admin).

### 2.3 Academic Sessions & Progression (`/api/academic-sessions`)
- `GET /api/academic-sessions`: List academic sessions and activation status.
- `POST /api/academic-sessions`: Create new fellowship academic session (e.g. `2025/2026`).
- `POST /api/academic-sessions/:id/activate-and-progress`: Activate session and atomically increment active student levels (`100` -> `200`, ..., `500` -> `Alumni`).

### 2.4 Events & Reminders (`/api/events`)
- `GET /api/events`: List public and fellowship events.
- `GET /api/events/:id`: Get detailed event metadata.
- `POST /api/events`: Create new fellowship event (Publicity / General Secretary).
- `PUT /api/events/:id`: Update event details.
- `PATCH /api/events/:id/cancel`: Cancel an event with member notice.

### 2.5 Announcements (`/api/announcements`)
- `GET /api/announcements`: List published announcements.
- `POST /api/announcements`: Create draft announcement (Publicity / General Secretary).
- `PATCH /api/announcements/:id/publish`: Publish announcement to feed.

### 2.6 Holy Bible Engine (`/api/bible`)
- `GET /api/bible/versions`: List supported Bible translations (`KJV`, `WEB`).
- `GET /api/bible/:version/:book/:chapter`: Fetch chapter text and verse structure.
- `GET /api/bible/search`: Search full-text Bible database by keyword or citation.

### 2.7 Bible Study Manual (`/api/bible-study`)
- `GET /api/bible-study`: List published Bible studies.
- `GET /api/bible-study/current`: Retrieve active study for current Tuesday fellowship.
- `GET /api/bible-study/:id`: Retrieve single study outline.
- `POST /api/bible-study`: Create study outline draft (Bible Study Coordinator).
- `POST /api/bible-study/upload-outline`: Upload raw manual document for automated structured extraction.
- `PUT /api/bible-study/:id`: Update study content.
- `PATCH /api/bible-study/:id/publish`: Publish study for fellowship access.

### 2.8 Foundational School (`/api/fs`, `/api/fs/admin`)
- `GET /api/fs/materials`: Get syllabus modules (Enrolled FS Student / Teacher).
- `GET /api/fs/progress`: View individual chapter progress.
- `POST /api/fs/admissions`: Submit FS enrollment application.
- `GET /api/fs/admin/students`: View cohort roster and completion records.
- `PATCH /api/fs/admin/students/:id/grade`: Grade chapter submission (FS Teacher / Coord).
- `PATCH /api/fs/admin/admissions/:id/review`: Approve or reject applicant (FS Coord).
- `PATCH /api/fs/admin/students/:id/record-completion`: Mark student as completed/graduated (FS Coord).

### 2.9 Website Content CMS (`/api/content/website`)
- `GET /api/content/website`: Get published site copy (Public).
- `GET /api/content/website/draft`: Get draft site copy (Publicity / Tech Admin).
- `PUT /api/content/website/draft`: Update draft revision blocks.
- `POST /api/content/website/publish`: Publish draft revision to live website.

### 2.10 Media & Storage (`/api/media`)
- `POST /api/media/upload`: Multipart upload proxy via `IMediaStorageAdapter`.
- `GET /api/media`: List uploaded fellowship media assets.

### 2.11 Audit & Health (`/api/admin`)
- `GET /api/admin/audit-logs`: View system administrative activity audit trail.
- `GET /api/admin/health`: Check database, mailer, and storage subsystem health.
