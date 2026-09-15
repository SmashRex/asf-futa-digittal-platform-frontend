# ASF Digital Platform — System Architecture Document (SAD)

**Document Type:** Technical Architecture Document (SAD)  
**Architecture Pattern:** Modular Monolith (Node.js / Express / TypeScript + PostgreSQL) + React SPA / PWA + Offline IndexedDB Sync  
**Status:** Authoritative Blueprint (Reconciled with `ASF_BACKEND_SPECIFICATION_FINAL.md`)

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER                                    │
│                                                                             │
│   ┌───────────────────────────┐         ┌───────────────────────────────┐   │
│   │     Public Web Portal     │         │   Member Progressive Web App  │   │
│   │   (About, Giving, Events) │         │   (Bible, Study, Hymns, FS)   │   │
│   └─────────────┬─────────────┘         └───────────────┬───────────────┘   │
│                 │                                       │                   │
│                 └───────────────────┬───────────────────┘                   │
│                                     │                                       │
│                       ┌─────────────▼─────────────┐                         │
│                       │ Local Data Cache & Sync   │                         │
│                       │ (IndexedDB / LocalStorage)│                         │
│                       └─────────────┬─────────────┘                         │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │ HTTPS REST API (Session Cookie / Bearer)
┌─────────────────────────────────────▼───────────────────────────────────────┐
│                    NODE.JS / EXPRESS MODULAR MONOLITH                       │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  Core Middlewares (Session Auth, RBAC Policy, Helmet, Rate Limiter) │   │
│   └──────────────────────────────────┬──────────────────────────────────┘   │
│                                      │                                       │
│   ┌──────────────────────────────────▼──────────────────────────────────┐   │
│   │                         Domain Modules                              │   │
│   │  • Auth & Sessions (Magic Link)  • Bible & Verse Resolver           │   │
│   │  • Member Directory & Academic   • Bible Study CMS & Outlines       │   │
│   │  • Events & Reminders            • Foundational School (FS)         │   │
│   │  • Announcements & News          • Public Website CMS & Revision    │   │
│   │  • Song of Praise (SOP) Hymnal   • Audit Logging & Health           │   │
│   └──────────────────────────────────┬──────────────────────────────────┘   │
│                                      │                                       │
│   ┌──────────────────────────────────▼──────────────────────────────────┐   │
│   │                       Pluggable Adapters                            │   │
│   │  • IMailerAdapter (Transactional Email Provider)                    │   │
│   │  • IMediaStorageAdapter (Cloud/Local Asset Storage)                 │   │
│   └──────────────────────────────────┬──────────────────────────────────┘   │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │ SQL (Drizzle ORM / pg pool)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    POSTGRESQL RELATIONAL DATABASE                           │
│  (Users, Sessions, Roles, Academic Sessions, Studies, FS, Events, Audits)   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Key Architecture Decision Records (ADRs)

### ADR-1: Node.js/Express Modular Monolith with PostgreSQL
- **Context:** Student developer familiarity, low operational complexity, high cohesion across fellowship modules, and straightforward self-hosting or cloud deployment on standard container infrastructure.
- **Decision:** Modular monolith built in TypeScript with Express and PostgreSQL. Database access managed via strongly typed migrations and schema definitions.

### ADR-2: Passwordless Magic-Link Authentication & Persistent Sessions
- **Context:** Eliminate password creation, credential stuffing, forgotten password burdens, and account recovery friction for busy students.
- **Decision:** Cryptographically secure single-use magic links sent via email. Upon verification, the server issues an opaque sliding session token stored in an HTTP-only, Secure, SameSite=Lax cookie (`asf_session`) with 30-day sliding TTL.

### ADR-3: Offline-First Synchronization Architecture
- **Context:** Campus cellular networks at FUTA are frequently congested or unavailable inside lecture theatres and fellowship auditoriums.
- **Decision:** Client stores static/curriculum content (Scripture text, Song of Praise hymns, recent Bible Studies) in IndexedDB. Reading experiences execute against local storage first, hydrating and syncing updates asynchronously when connected.

### ADR-4: Scripture Reference Parsing & Linking
- **Context:** Bible Study outlines and FS lessons cite Scripture extensively (e.g. `Romans 8:28`, `1 Cor 13:4-8`).
- **Decision:** Scripture citations are automatically resolved via a built-in multi-translation Bible engine (KJV, WEB) and rendered as interactive modal passages on both web and mobile clients.

### ADR-5: Pluggable Adapter Interfaces for Infrastructure
- **Context:** Fellowship operational budgets and provider availability change over time.
- **Decision:** Third-party dependencies (email delivery, media/image storage) are strictly abstracted behind TypeScript interfaces (`IMailerAdapter`, `IMediaStorageAdapter`). Switching providers requires zero changes to core domain logic or API contracts.

---

## 3. Component Breakdown

### 3.1 Client Tier (React / TypeScript PWA)
- **Framework:** React 18+ with Vite, Tailwind CSS for accessible styling.
- **State & Caching:** React hooks + local IndexedDB store.
- **Service Worker / PWA Shell:** Caches application assets for offline startup.

### 3.2 Backend Tier (Express + TypeScript)
- **Runtime:** Node.js 18+ with Express REST controllers.
- **Security:** Strict RBAC middleware, rate limiting, request validation, structured error handling, and dual-authorization governance for destructive operations.
- **Database:** PostgreSQL with relational integrity, foreign key cascading, and automated academic progression.
