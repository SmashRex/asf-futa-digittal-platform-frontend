# ASF FUTA Digital Portal — API Integration Specification

This document provides the authoritative API integration surface of the **Anglican Students' Fellowship (ASF FUTA) Digital Portal**, detailing endpoints consumed by the frontend, authentication mechanics, and data payload contracts, reconciled with `ASF_BACKEND_SPECIFICATION_FINAL.md`.

---

## Architecture Overview

- **Service Pattern**: `UI / Screen` → `Custom Service Hook / Service Module` → `API Client / Gateway` → `Backend API`
- **Environment Toggle**: Controlled via `VITE_USE_MOCK_SERVICES` (configured in `src/config/app.config.ts` and `src/config/api.config.ts`).
  - `VITE_USE_MOCK_SERVICES=true`: Serves typed local seed data while offline or during frontend development.
  - `VITE_USE_MOCK_SERVICES=false`: Directs all requests to the backend base URL (`VITE_API_BASE_URL` or `/api`).
- **Authentication**: Opaque persistent session cookies (`asf_session`, HTTP-only, Secure, SameSite=Lax) with optional `Authorization: Bearer <token>` fallback header for all protected endpoints.
- **Backend Architecture**: Node.js/Express with PostgreSQL modular monolith and pluggable adapters (`IMailerAdapter`, `IMediaStorageAdapter`).

---

## Endpoint Catalog & Integration Status

| Category | Method | Endpoint Path | Status | Auth Required | Feature Flag / Handler |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Contract Reconciled | No | `authService.register()` |
| **Auth** | `POST` | `/api/auth/magic-link` | Contract Reconciled | No | `authService.sendMagicLink()` |
| **Auth** | `POST` | `/api/auth/verify` | Contract Reconciled | No | `authService.verifyMagicLinkToken()` |
| **Auth** | `GET` | `/api/auth/me` | Contract Reconciled | Yes (Session Cookie) | `authService.getCurrentUser()` |
| **Auth** | `POST` | `/api/auth/logout` | Contract Reconciled | Yes (Session Cookie) | `authService.logout()` |
| **Profile** | `GET` | `/api/users/profile` | Contract Reconciled | Yes | `usersService.getProfile()` |
| **Profile** | `PUT` | `/api/users/profile` | Contract Reconciled | Yes | `usersService.updateProfile()` |
| **Members** | `GET` | `/api/members` | Contract Reconciled | Yes (Scoped) | `adminService.getMembers()` |
| **Members** | `PATCH` | `/api/members/:id/role` | Contract Reconciled | Yes (Exec/Admin) | `adminService.updateMemberRole()` |
| **Members** | `PATCH` | `/api/members/:id/status` | Contract Reconciled | Yes (Exec/Admin) | `adminService.updateMemberStatus()` |
| **Members** | `PATCH` | `/api/members/:id/academic-level` | Contract Reconciled | Yes (Sec/Admin) | `adminService.overrideAcademicLevel()` |
| **Academic** | `GET` | `/api/academic-sessions` | Contract Reconciled | Yes (Sec/Admin) | `adminService.getAcademicSessions()` |
| **Academic** | `POST` | `/api/academic-sessions` | Contract Reconciled | Yes (Sec/Admin) | `adminService.createAcademicSession()` |
| **Academic** | `POST` | `/api/academic-sessions/:id/activate-and-progress` | Contract Reconciled | Yes (Sec/Admin) | `adminService.activateAndProgress()` |
| **Events** | `GET` | `/api/events` | Contract Reconciled | Optional | `eventsService.getEvents()` |
| **Events** | `GET` | `/api/events/:id` | Contract Reconciled | Optional | `eventsService.getEventById()` |
| **Events** | `POST` | `/api/events` | Contract Reconciled | Yes (Pub/Sec) | `eventsService.createEvent()` |
| **Events** | `PUT` | `/api/events/:id` | Contract Reconciled | Yes (Pub/Sec) | `eventsService.updateEvent()` |
| **Events** | `PATCH` | `/api/events/:id/cancel` | Contract Reconciled | Yes (Pub/Sec) | `eventsService.cancelEvent()` |
| **Announcements** | `GET` | `/api/announcements` | Contract Reconciled | Optional | `announcementsService.getAnnouncements()` |
| **Announcements** | `POST` | `/api/announcements` | Contract Reconciled | Yes (Pub/Sec) | `announcementsService.createAnnouncement()` |
| **Announcements** | `PATCH` | `/api/announcements/:id/publish` | Contract Reconciled | Yes (Pub/Sec) | `announcementsService.publishAnnouncement()` |
| **Hymns** | `GET` | `/api/hymns` | Static / Offline Ready | No | `hymnsService.getHymns()` |
| **Hymns** | `GET` | `/api/hymns/:id` | Static / Offline Ready | No | `hymnsService.getHymnById()` |
| **Holy Bible** | `GET` | `/api/bible/versions` | Contract Reconciled | No | `bibleService.getVersions()` |
| **Holy Bible** | `GET` | `/api/bible/:version/:book/:chapter` | Contract Reconciled | No | `bibleService.getChapter()` |
| **Holy Bible** | `GET` | `/api/bible/search` | Contract Reconciled | No | `bibleService.searchBible()` |
| **Bible Study** | `GET` | `/api/bible-study` | Contract Reconciled | No | `bibleStudyService.getStudies()` |
| **Bible Study** | `GET` | `/api/bible-study/current` | Contract Reconciled | No | `bibleStudyService.getCurrentStudy()` |
| **Bible Study** | `GET` | `/api/bible-study/:id` | Contract Reconciled | No | `bibleStudyService.getStudyById()` |
| **Bible Study** | `POST` | `/api/bible-study` | Contract Reconciled | Yes (BS Coord/Exec) | `bibleStudyService.createStudyDraft()` |
| **Bible Study** | `POST` | `/api/bible-study/upload-outline` | Contract Reconciled | Yes (BS Coord/Exec) | `bibleStudyService.uploadOutline()` |
| **Bible Study** | `PUT` | `/api/bible-study/:id` | Contract Reconciled | Yes (BS Coord/Exec) | `bibleStudyService.updateStudy()` |
| **Bible Study** | `PATCH` | `/api/bible-study/:id/publish` | Contract Reconciled | Yes (BS Coord/Exec) | `bibleStudyService.publishStudy()` |
| **Foundational School** | `GET` | `/api/fs/materials` | Contract Reconciled | Yes (FS Role) | `fsService.getMaterials()` |
| **Foundational School** | `GET` | `/api/fs/progress` | Contract Reconciled | Yes (FS Student) | `fsService.getProgress()` |
| **Foundational School** | `POST` | `/api/fs/admissions` | Contract Reconciled | No | `fsService.submitAdmission()` |
| **FS Admin** | `GET` | `/api/fs/admin/students` | Contract Reconciled | Yes (FS Teacher/Coord) | `fsService.getEnrolledStudents()` |
| **FS Admin** | `PATCH` | `/api/fs/admin/students/:id/grade` | Contract Reconciled | Yes (FS Teacher/Coord) | `fsService.gradeChapter()` |
| **FS Admin** | `PATCH` | `/api/fs/admin/admissions/:id/review` | Contract Reconciled | Yes (FS Coord) | `fsService.reviewAdmission()` |
| **FS Admin** | `PATCH` | `/api/fs/admin/students/:id/record-completion` | Contract Reconciled | Yes (FS Coord) | `fsService.recordCompletion()` |
| **CMS** | `GET` | `/api/content/website` | Contract Reconciled | No | `websiteCopyService.getPublishedCopy()` |
| **CMS** | `GET` | `/api/content/website/draft` | Contract Reconciled | Yes (Pub/Tech Admin) | `websiteCopyService.getDraftCopy()` |
| **CMS** | `PUT` | `/api/content/website/draft` | Contract Reconciled | Yes (Pub/Tech Admin) | `websiteCopyService.saveDraftCopy()` |
| **CMS** | `POST` | `/api/content/website/publish` | Contract Reconciled | Yes (Pub/Tech Admin) | `websiteCopyService.publishDraftCopy()` |
| **Media** | `POST` | `/api/media/upload` | Contract Reconciled | Yes (Pub/Tech Admin) | `mediaService.uploadAsset()` |
| **Media** | `GET` | `/api/media` | Contract Reconciled | Yes (Pub/Tech Admin) | `mediaService.getAssets()` |
| **Audit** | `GET` | `/api/admin/audit-logs` | Contract Reconciled | Yes (Exec/Tech Admin) | `adminService.getAuditLogs()` |
| **Health** | `GET` | `/api/admin/health` | Contract Reconciled | Yes (Exec/Tech Admin) | `adminService.getHealth()` |

---

## Detailed Data Contracts

### 1. Authentication API (`/api/auth/*`)

#### `POST /api/auth/register`
- **Request Body**:
```json
{
  "email": "student@futa.edu.ng",
  "name": "Emmanuel Adeleke",
  "department": "Computer Science",
  "academic_level": "300 Level",
  "phone_number": "+2348012345678",
  "subgroup": "Technical Team"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Registration successful. A verification link has been sent to your email."
}
```

#### `POST /api/auth/magic-link`
- **Request Body**:
```json
{
  "email": "student@futa.edu.ng"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "If an account exists, a sign-in link has been sent."
}
```

#### `POST /api/auth/verify`
- **Request Body**:
```json
{
  "token": "a1b2c3d4e5f6..."
}
```
- **Response `200 OK`** (Sets `asf_session` cookie):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "email": "student@futa.edu.ng",
      "name": "Emmanuel Adeleke",
      "department": "Computer Science",
      "academic_level": "300 Level",
      "membership_status": "Active Student",
      "roles": ["Member", "FS Student"]
    }
  },
  "message": "Authentication successful"
}
```

---

### 2. Holy Bible API (`/api/bible/*`)

#### `GET /api/bible/:version/:book/:chapter`
- **Parameters**:
  - `version`: `kjv` | `web`
  - `book`: `john`, `genesis`, `romans`, etc.
  - `chapter`: integer
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "version": "kjv",
    "book": "john",
    "bookName": "John",
    "chapter": 3,
    "verses": [
      { "verse": 16, "text": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." }
    ]
  }
}
```

---

### 3. Bible Study Manual API (`/api/bible-study/*`)

#### `GET /api/bible-study/current`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "lesson_number": 1,
    "title": "Divine Light in the Academic Wilderness",
    "topic": "Walking in the Light of Christ",
    "theme": "The Reign of God: Marriage And Christian Lifestyle",
    "study_date": "2026-09-08",
    "text_ref": "Matthew 5:14-16",
    "text_content": "Ye are the light of the world...",
    "memory_verse_ref": "Matthew 5:16",
    "memory_verse_text": "Let your light so shine before men...",
    "aim": "To understand Christian integrity on campus.",
    "introduction": "In a challenging academic setting...",
    "study_guide": [
      {
        "heading": "1. The Reality of Darkness",
        "scriptureRefs": ["1 John 1:5-7"],
        "paragraphs": ["Living as believers requires continuous walking in truth..."]
      }
    ],
    "discussion_questions": [
      "How do we handle moral pressure in lecture halls?"
    ],
    "conclusion": "Believers are called to distinct campus witness.",
    "prayer_points": [
      "Grace to remain steadfast in academic integrity."
    ],
    "publication_status": "published"
  }
}
```

---

## Connecting Real Backend Services

To connect the frontend application to your live production backend:

1. Deploy the Node.js/Express API server implementing the endpoints specified in `ASF_BACKEND_SPECIFICATION_FINAL.md`.
2. Configure `.env`:
   ```bash
   VITE_API_BASE_URL=https://api.asf-futa.org
   VITE_USE_MOCK_SERVICES=false
   ```
3. The frontend `apiClient` automatically sends HTTP requests with session credentials (`credentials: 'include'`), handles offline fallbacks when network disconnects occur, and manages state hydration.
