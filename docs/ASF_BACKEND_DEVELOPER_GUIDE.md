# ASF DIGITAL PLATFORM

# Backend Developer Guide

**Project:** Anglican Students’ Fellowship (ASF) — FUTA Digital Platform  
**Document Type:** Backend Developer Orientation & Implementation Guide  
**Status:** Active  
**Audience:** Backend Developers, Backend AI/Coding Agents, Technical Administrator  
**Primary Technical Specification:** `ASF_BACKEND_SPECIFICATION_FINAL.md`  

---

## 1. PURPOSE OF THIS DOCUMENT

This document gives the backend developer the **product context, boundaries, business rules, architectural principles, and implementation expectations** required to work on the ASF Digital Platform correctly.

It is intentionally not a replacement for the full backend specification.

Use the documents in this order:

1. **This document** — understand what the product is and why the backend exists.
2. **`ASF_BACKEND_SPECIFICATION_FINAL.md`** — understand the detailed backend architecture, database model, API contracts, security requirements, migrations, testing, and deployment.
3. **The existing source code** — understand what is currently implemented and how the specification maps to reality.
4. **Other project documentation** — use as supporting or historical context only when it does not conflict with the current specification or implementation.

When there is a conflict, do not silently choose whichever document is convenient. Follow the project's evidence hierarchy:

> **Current implementation/code → confirmed product decisions → explicit requirements → current authoritative specifications → historical documentation → inference/proposal.**

If an ambiguity materially affects architecture, data, security, or product behavior, flag it before implementing.

---

# 2. WHAT IS ASF DIGITAL PLATFORM?

ASF Digital Platform is a digital ecosystem for the **Anglican Students’ Fellowship (ASF)**, initially focused on the FUTA branch.

It is being built to provide one central digital environment where ASF members can:

* access fellowship information;
* authenticate and maintain their member account;
* access Bible resources;
* read and interact with Bible Study materials;
* participate in Foundational School where applicable;
* view fellowship events and announcements;
* access relevant fellowship resources;
* maintain a consistent member profile;
* experience selected functionality offline;
* and interact with the fellowship through a modern public website and member platform.

The platform also provides authorized fellowship workers and administrators with tools to manage content, members, events, media, Bible Study materials, Foundational School operations, and system administration.

The platform is initially intended for a relatively small fellowship population, but the architecture should not be designed as a throwaway application.

The initial population may be in the hundreds, but the system should reasonably support growth into several thousand users without requiring a complete architectural rewrite.

---

# 3. THE PROBLEM WE ARE SOLVING

The fellowship currently has information, resources, activities, administrative processes, and learning materials distributed across different channels and tools.

The platform is intended to provide a central digital foundation for these activities.

The goal is **not simply to put existing information on a website**.

The goal is to create a maintainable fellowship platform in which:

* members have a consistent digital identity;
* fellowship content has a central source of truth;
* administrators can manage content without directly touching the database;
* Bible and Bible Study resources can be centrally managed;
* Foundational School can have structured digital support;
* important information can be accessed efficiently;
* the platform can support offline-friendly experiences where appropriate;
* and future ASF branches or larger populations can be accommodated without rebuilding the entire system.

---

# 4. WHAT WE ARE BUILDING

The platform consists of several related surfaces.

## 4.1 Public Website

The public website is the outward-facing ASF presence.

It is intended for:

* fellowship introduction;
* information about ASF;
* fellowship activities;
* events;
* announcements;
* selected content;
* contact/information pages;
* controlled website sections.

The website is **not** intended to become an unrestricted page-builder.

Content should be managed through structured, controlled content models.

---

## 4.2 Member Platform

The member platform is the authenticated environment for ASF members.

It may provide:

* member profile;
* fellowship information;
* Bible;
* Bible Study;
* Foundational School access where applicable;
* announcements;
* events;
* selected fellowship resources;
* offline-capable content;
* other approved member functionality.

The member platform is the main digital hub for authenticated fellowship users.

---

## 4.3 Administrative Workspace

Authorized fellowship personnel should be able to manage appropriate areas of the platform through administrative interfaces.

Examples include:

* Publicity Coordinator → publicity/content/media;
* Bible Study Coordinator → Bible Study content and publication workflow;
* FS Coordinator/Teachers → Foundational School operations;
* Technical Administrator → technical/system administration;
* executives → authorized fellowship administration and oversight.

Executives and coordinators should **not need direct backend/database access** for normal operational work.

The backend should expose the necessary APIs and permission boundaries so that administrative operations can happen through the application.

---

## 4.4 Technical Administration

The Technical Administrator is responsible for technical/system-level functions exposed by the application.

This may include:

* system health;
* operational visibility;
* role administration;
* security-related administration;
* audit visibility;
* service status;
* technical controls supported by the current product.

There is **no separate "Technical Coordinator" role** in the canonical role model.

---

# 5. WHAT WE ARE NOT BUILDING

Understanding the boundaries is just as important as understanding the features.

## 5.1 Not a University Management System

ASF Digital Platform is **not**:

* FUTA's student portal;
* a school management system;
* a university registration system;
* a course registration system;
* a university result-processing system;
* a general academic management platform.

Academic department and academic level exist because they are relevant to fellowship membership and lifecycle management.

They do not turn this platform into an academic management system.

---

## 5.2 Not a Social Network

We are not building:

* a Facebook-like platform;
* a general-purpose social feed;
* a public messaging network;
* an unrestricted user-generated content network.

Any community functionality must have a clear fellowship purpose.

---

## 5.3 Not a Generic CMS

The website CMS must use controlled content structures.

Do not create a field that allows administrators to inject arbitrary:

* HTML;
* CSS;
* JavaScript;
* iframes;
* scripts;
* arbitrary executable content.

If a new website section type is required, it should be implemented deliberately by developers and then exposed through the CMS.

---

## 5.4 Not a Microservices Platform

The initial backend should be a **modular monolith**.

Do not introduce:

* unnecessary microservices;
* Kubernetes;
* service meshes;
* message brokers;
* distributed infrastructure;
* complex event-driven architecture;

unless a real requirement later justifies them.

The system should be modular internally while remaining operationally simple.

---

## 5.5 Not Password-Based Authentication

Password authentication is **not part of the product**.

Do not implement:

* `password_hash`;
* password login;
* password reset;
* password recovery;
* password change;
* password-based JWT authentication.

Authentication is based on **magic links**.

---

## 5.6 Not a Membership Approval Queue

Registration does not create a pending account awaiting manual approval.

A successful registration creates an **active ASF member account**.

Do not introduce an approval queue unless a future product decision explicitly changes this rule.

Membership status and account status are separate concepts.

---

## 5.7 Not a Blockchain / Multisig Governance System

Where governance or approval workflows exist, they are application-level workflows.

Do not introduce:

* blockchain;
* cryptocurrency;
* multisignature wallets;
* smart contracts;

for fellowship approval processes.

---

## 5.8 Not an Automatic FS Graduation Algorithm

Foundational School completion/graduation must not be invented by the backend.

The platform can manage:

* applications;
* admissions;
* classes;
* levels;
* progress;
* assignments;
* teacher grading;
* feedback;
* attendance/materials where supported;
* completion records;
* certification/graduation records.

However, the platform must not invent an automatic graduation formula unless leadership explicitly defines and approves one.

Leadership-controlled completion/certification records are the source of truth.

---

# 6. PRODUCT USERS

The platform has different categories of users.

## 6.1 General Member

A normal authenticated ASF member.

A member can have:

* identity information;
* department;
* academic level;
* membership status;
* profile information;
* appropriate access to member functionality.

---

## 6.2 Fellowship Coordinators / Officers

Different fellowship responsibilities require different permissions.

Examples include:

* Bible Study Coordinator;
* Publicity Coordinator;
* General Secretary;
* Organizing Coordinator;
* Drama Coordinator;
* Prayer Coordinator;
* Financial Secretary;
* Treasurer;
* Librarian;
* President / Executive;
* Technical Administrator.

The exact permission matrix is defined by the backend specification and current product requirements.

Do not create roles simply because a feature appears to need one.

---

## 6.3 Foundational School Users

Foundational School has its own operational roles, including:

* FS Student;
* FS Teacher;
* VP / FS Coordinator.

FS roles and ASF academic levels are different concepts.

An FS level is **not** the same thing as a university academic level such as 100, 200, 300, or 400 level.

---

## 6.4 Alumni

Alumni is a **membership/lifecycle status**, not an RBAC role.

Do not use `Alumni` as an administrative permission role.

A member may become an alumnus as a result of the academic/lifecycle progression system.

---

# 7. CORE PRODUCT RULES

These rules should be treated as non-negotiable unless the product owner explicitly changes them.

---

## 7.1 Registration

Registration is for a new member.

Required registration information includes:

* name;
* email;
* department;
* academic level.

Other fields may be optional where defined by the API contract.

Department is compulsory.

Academic level is compulsory.

On successful registration:

1. Validate the input.
2. Normalize the email.
3. Verify the relevant active academic session.
4. Create the member account.
5. Set the account to active.
6. Set the appropriate membership status.
7. Assign the base Member role.
8. Record the initial academic history.
9. Generate a secure magic-link token.
10. Send the magic link through the configured mail provider.
11. Do not create a membership approval queue.

---

# 8. MAGIC-LINK AUTHENTICATION

Authentication uses magic links.

The intended conceptual flow is:

```text
User enters email
       ↓
Backend determines whether authentication request is allowed
       ↓
Secure one-time token generated
       ↓
Token stored as a cryptographic hash
       ↓
Magic link delivered through mail provider
       ↓
User opens link
       ↓
Backend validates token
       ↓
Token atomically consumed
       ↓
Authenticated session established
       ↓
User remains signed in
```

### Security requirements

Magic-link tokens must:

* be cryptographically random;
* have a short expiration window;
* be stored hashed;
* be single-use;
* be atomically consumed;
* prevent replay;
* invalidate previous applicable tokens where required;
* be rate limited;
* avoid account enumeration;
* use safe redirects.

The current technical specification defines the concrete token/session implementation.

---

# 9. SESSION BEHAVIOR

The user should not be forced to request a new magic link every time the application restarts.

The intended experience is persistent authentication.

The implementation should therefore use:

* a short-lived access credential where applicable;
* a persistent server-controlled session/refresh mechanism;
* secure cookies/credentials appropriate to the application;
* session revocation.

A session must be revocable.

For example, a suspended account must not continue operating indefinitely using an existing session.

---

# 10. ACCOUNT STATUS VS MEMBERSHIP STATUS

These are separate concepts.

### Account status

Describes whether the account can operate.

Examples:

* Active;
* Suspended;
* Deactivated.

### Membership status

Describes the person's relationship with ASF.

Examples:

* Active Student;
* Alumni;
* Visiting.

Do not merge these concepts into one status field.

A member can, for example, have:

```text
account_status = Active
membership_status = Alumni
```

The precise allowed combinations should follow the database constraints and product rules.

---

# 11. ACADEMIC INFORMATION

Department and academic level are part of the member model because they are relevant to fellowship lifecycle and administration.

They are not being used to reproduce FUTA's academic systems.

## Required

* Department;
* Academic level.

## Automatic progression

Academic level increases automatically according to the **academic session/year model**, not according to a rolling 365-day calculation.

The platform therefore maintains academic sessions and academic history.

The progression system should:

* identify the active academic session;
* determine eligible members;
* promote academic levels according to the defined progression rules;
* record the result in academic history;
* handle final-year progression to Alumni where applicable;
* support controlled manual overrides;
* preserve an audit trail.

Do not implement academic progression using:

```text
created_at + 365 days
```

Academic progression is tied to academic-session boundaries.

---

# 12. BACKEND SOURCE OF TRUTH

The backend is the authoritative source of truth for server-managed product data.

This includes areas such as:

* users;
* roles;
* sessions;
* academic sessions/history;
* Bible content;
* Bible Study content;
* events;
* announcements;
* website content;
* media metadata;
* Foundational School records;
* audit records.

The frontend may maintain local caches for offline experiences, but local frontend data must not silently become the authoritative production record.

---

# 13. BIBLE MODULE

The Bible is **backend-managed**.

The frontend should not treat bundled Bible data as the production source of truth.

The architecture should support:

```text
Frontend Bible Repository
        ↓
Backend Bible API
        ↓
Database / managed Bible data
        ↓
Frontend local cache
```

The initial backend seed contains the versions currently defined by the project specification.

The initial planned versions are:

* KJV;
* WEB.

Additional translations can be introduced later subject to product and licensing decisions.

The Bible module should support the capabilities defined by the current specification, including:

* books;
* chapters;
* verses;
* search;
* translation/version selection;
* Bible Study integration;
* appropriate offline reading/cache;
* bookmarks where the product actually requires synchronization.

The database design includes optimized Bible search support.

---

# 14. BIBLE STUDY MODULE

Bible Study is a distinct backend domain.

It is not merely a collection of Bible references.

A Bible Study record can contain:

1. Theme
2. Topic
3. Text
4. Memory Verse
5. Aim
6. Introduction
7. Study Guide
8. Discussion Questions
9. Conclusion
10. Prayer

It also needs appropriate metadata such as:

* study date;
* publication status;
* references;
* timestamps;
* authorship/management information where required.

---

## 14.1 Bible Study PDF Processing

The system may support a document extraction workflow.

The intended workflow is:

```text
PDF uploaded
      ↓
Text/structure extraction
      ↓
Content segmentation
      ↓
Bible reference detection
      ↓
Structured draft
      ↓
Human review
      ↓
Correction
      ↓
Explicit publication
```

AI/document extraction does **not** automatically make content authoritative.

Human review is required before publication.

---

# 15. FOUNDATIONAL SCHOOL

Foundational School is a structured fellowship learning domain.

It is separate from ordinary member academic progression.

The backend should support evidence-backed FS concepts such as:

* applications;
* admissions;
* students;
* classes;
* levels;
* teachers;
* assignments;
* progress;
* grading;
* feedback;
* attendance/materials where supported;
* completion;
* certification/graduation records.

Do not reduce the entire FS domain to a simplistic:

```text
fs_students
fs_progress
```

model if the existing product requirements/code demonstrate richer behavior.

At the same time, do not invent entities simply because they might be useful someday.

The FS model should be based on actual product requirements and implementation evidence.

---

# 16. FS COMPLETION AND CERTIFICATION

The backend must not invent a mathematical completion/graduation formula.

For example, do not assume:

```text
average >= 50% = graduated
```

unless leadership explicitly defines that rule.

The platform may calculate and display progress where the product defines the calculation.

However, final completion/certification/graduation should remain a leadership-controlled record unless a formal product rule is later established.

---

# 17. MEMBER DIRECTORY

Authorized fellowship roles may view the active fellowship member directory.

The directory is primarily an administrative/member-management capability.

It is **not an approval mechanism**.

Because registration immediately creates an active member account:

```text
Registration
    ↓
Active Member
    ↓
Directory visibility according to permissions
```

not:

```text
Registration
    ↓
Pending
    ↓
Approval
    ↓
Active Member
```

Privacy-sensitive fields must only be exposed according to authorization rules.

---

# 18. EVENTS

The event system should support fellowship activities such as:

* services;
* Bible Study;
* programs;
* meetings;
* special events.

The backend should provide structured event data rather than requiring the frontend to hardcode event information.

Where reminders or notification functionality is implemented, it should follow the current API/product specification.

Do not build a generic notification platform merely because events exist.

---

# 19. ANNOUNCEMENTS

Announcements are backend-managed content.

Authorized users should be able to create and publish announcements through the appropriate administrative interface.

The frontend should retrieve published announcements through the API rather than relying on hardcoded announcement arrays.

The backend should enforce:

* authorization;
* validation;
* publication status;
* timestamps;
* appropriate auditability.

---

# 20. WEBSITE / CMS

The public website uses a controlled CMS approach.

The CMS should support defined section types such as those approved by the product.

Each section should have a known schema.

Conceptually:

```text
Website Page
   ├── Section A
   ├── Section B
   ├── Section C
   └── Section D
```

Each section has structured content.

### Do not implement

```text
raw_html
raw_css
raw_javascript
arbitrary_iframe
```

as an unrestricted administrative content mechanism.

If the product later requires a new section type:

1. Define the section schema.
2. Implement validation.
3. Implement backend support.
4. Implement frontend rendering.
5. Add it to the controlled CMS.

This keeps the website maintainable and secure.

---

# 21. MEDIA

Media must be abstracted behind a media-storage interface.

The application should not be tightly coupled to one vendor.

Conceptually:

```text
Application
    ↓
IMediaStorageAdapter
    ↓
Configured Media Provider
```

The provider may change because of:

* cost;
* free-tier limits;
* operational requirements;
* storage requirements;
* deployment environment.

Cloudinary may be used as a provider, but the architecture must not make Cloudinary impossible to replace.

Secrets must never be exposed to the frontend.

---

# 22. EMAIL

Email delivery must also be provider-agnostic.

Use an abstraction such as:

```text
IMailerAdapter
```

rather than embedding a specific provider throughout the application.

The deployment environment may use one provider initially and another provider later.

This is particularly important because infrastructure and free-tier availability may change.

The backend should therefore separate:

```text
Authentication logic
```

from:

```text
Email delivery implementation
```

The authentication system should know that it needs to send a magic link.

It should not need to know the internal details of the mail provider.

---

# 23. OFFLINE-FIRST PRINCIPLES

Some platform experiences should remain useful when internet connectivity is limited.

Priority areas include:

* Bible;
* Bible Study where appropriate;
* Hymn Book where appropriate;
* recent/relevant content where justified.

The architecture should support:

```text
Backend = source of truth
        ↓
Frontend local cache
        ↓
Offline usage
        ↓
Refresh/sync when connection returns
```

Do not build a large generic synchronization engine unless the actual product requires it.

Offline functionality should be implemented deliberately per domain.

---

# 24. HYMΝ BOOK

The Hymn Book should be treated according to the actual implementation and product requirements.

Potentially supported functionality includes:

* hymn number search;
* title search;
* hymn reading;
* highlighting the relevant/current hymn;
* offline access.

Do not automatically convert the Hymn Book into a backend-managed CRUD system if the existing implementation demonstrates that static bundled content is sufficient.

First determine whether the Hymn Book actually requires server management.

---

# 25. NOTES AND BOOKMARKS

Do not create generic backend systems merely because they were discussed during brainstorming.

For example:

* personal notes;
* bookmarks;
* generic user preferences;
* generic system settings;
* generic synchronization.

These must be implemented only where the current product requirements and implementation justify them.

If a feature is not implemented, classify it as:

> **NOT IMPLEMENTED**

rather than pretending it exists.

If synchronization is not currently required, keep it deferred.

---

# 26. GOVERNANCE

If the current product contains executive approval workflows, preserve them where they are supported by actual requirements and implementation.

Do not remove an existing two-person approval workflow merely because the fellowship is small.

However, governance should remain an application-level workflow.

Use:

* database records;
* authorization;
* approval states;
* audit logs;
* explicit actions.

Do not use blockchain or multisig infrastructure.

---

# 27. AUDIT LOGGING

Important administrative and security-sensitive operations should be auditable.

Audit logs should be treated as:

> **append-oriented and restricted-mutation records.**

Do not casually describe them as "tamper-proof" unless the system genuinely provides such a guarantee.

Audit information should help answer questions such as:

* who performed an action?
* what action occurred?
* what resource was affected?
* when did it happen?
* what relevant context was available?

Audit logging must not become a mechanism for storing arbitrary application data.

---

# 28. AUTHORIZATION

Authorization must be enforced by the backend.

The frontend hiding a button is not authorization.

For every protected operation:

```text
Request
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Business Rule
   ↓
Database Operation
```

A user should not be able to access an administrative endpoint simply because they manually call it from a browser.

RBAC should be normalized and centrally enforced.

Avoid having multiple contradictory role systems such as:

```text
UserRole
AdminRole
LegacyRole
FrontendRole
```

unless there is a clear architectural reason.

The backend should have one canonical authorization model, with domain-specific permissions where required.

---

# 29. DATABASE PHILOSOPHY

PostgreSQL is the preferred relational database.

The database should be:

* relational;
* normalized where appropriate;
* constrained;
* indexed intentionally;
* migration-managed;
* transactionally safe;
* designed around actual domain requirements.

The database is not merely a storage bucket for frontend objects.

Important rules should be represented through appropriate:

* constraints;
* foreign keys;
* unique indexes;
* checks;
* transactions;
* triggers where justified.

Do not add database complexity simply for theoretical robustness.

---

# 30. CORE DATABASE DOMAINS

The current backend architecture includes domains around:

* users;
* roles;
* sessions;
* magic-link tokens;
* academic sessions;
* academic history;
* Bible;
* Bible Study;
* Foundational School;
* events;
* announcements;
* website/CMS;
* media;
* governance where applicable;
* audit logs.

The exact table definitions, fields, constraints, and indexes are maintained in:

`ASF_BACKEND_SPECIFICATION_FINAL.md`

That document is the technical authority for the current schema.

---

# 31. API DESIGN

The backend should expose a clean API contract for the frontend.

The frontend should not:

* access the database directly;
* know database table structure unnecessarily;
* contain provider secrets;
* call third-party infrastructure directly when the backend owns the operation;
* duplicate backend business rules.

Conceptually:

```text
Frontend
   ↓
API
   ↓
Application/Domain Logic
   ↓
Repository/Data Layer
   ↓
PostgreSQL / External Provider Adapter
```

---

# 32. API RESPONSE CONSISTENCY

APIs should use consistent response and error structures.

A frontend developer should be able to predict:

* successful response shape;
* validation errors;
* authentication errors;
* authorization errors;
* not-found errors;
* conflict errors;
* rate-limit errors;
* server errors.

The exact response envelopes are defined in the full backend specification.

Do not create arbitrary response shapes for every endpoint.

---

# 33. VALIDATION

Validate at the backend boundary.

Frontend validation is useful for user experience, but backend validation is authoritative.

Validate:

* request body;
* query parameters;
* path parameters;
* enums;
* required fields;
* formats;
* lengths;
* relationships;
* business rules.

For controlled CMS content, schemas must be explicit.

Zod or the validation approach defined by the project may be used to ensure request and domain integrity.

---

# 34. SECURITY PRINCIPLES

Security is part of the architecture, not a later feature.

At minimum, pay attention to:

* authentication security;
* session security;
* token hashing;
* token expiry;
* replay prevention;
* rate limiting;
* account enumeration;
* authorization;
* input validation;
* SQL injection prevention;
* XSS considerations;
* CSRF considerations where applicable;
* secure cookies;
* secret management;
* file upload validation;
* media authorization;
* audit logging;
* safe redirects;
* dependency security.

Never expose:

* API secrets;
* database credentials;
* mail-provider credentials;
* storage-provider credentials;

to the frontend.

---

# 35. FILE / DOCUMENT UPLOADS

Uploads must be treated as untrusted input.

The backend should consider:

* file type;
* file size;
* upload authorization;
* storage destination;
* filename handling;
* metadata;
* malicious file considerations;
* access permissions.

For document-processing workflows such as Bible Study PDFs:

```text
Upload
 ↓
Validate
 ↓
Store
 ↓
Process
 ↓
Extract
 ↓
Human Review
 ↓
Publish
```

Do not automatically publish extracted content.

---

# 36. CURRENT ARCHITECTURAL DIRECTION

The backend should initially use a **modular monolith**.

A conceptual structure is:

```text
ASF Backend
│
├── Auth
├── Members
├── Roles / Authorization
├── Academic Sessions
├── Bible
├── Bible Study
├── Foundational School
├── Events
├── Announcements
├── Website / CMS
├── Media
├── Governance
├── Audit
└── Health / Operations
```

The modules should have clear boundaries without requiring separate deployed services.

---

# 37. PROVIDER ABSTRACTION

External providers must be replaceable.

Examples:

```text
IMailerAdapter
IMediaStorageAdapter
```

The core application should depend on the interface, not the provider.

This allows infrastructure to change later because of:

* pricing;
* free-tier changes;
* reliability;
* deployment requirements;
* product growth.

Provider choice is an implementation/deployment concern, not a reason to contaminate the domain layer.

---

# 38. COST AND SCALE

The project is intentionally cost-conscious.

The initial fellowship population is expected to be relatively small.

Therefore:

> **Prefer simple, reliable, low-cost infrastructure over unnecessary enterprise complexity.**

The system should nevertheless avoid architectural decisions that make modest growth painful.

Good:

* PostgreSQL;
* modular monolith;
* provider adapters;
* object/media storage;
* caching where useful;
* background processing where justified;
* simple deployment.

Avoid premature:

* Kubernetes;
* microservices;
* distributed databases;
* complex service meshes;
* unnecessary queues;
* complicated event buses.

---

# 39. CURRENT PRODUCT STATUS MODEL

When working on the backend, classify functionality honestly.

Use these states:

### BUILT

The feature is implemented and working in the current application.

### PARTIAL

Some of the feature exists, but important backend/integration work remains.

### NOT IMPLEMENTED

The feature is defined or discussed but does not currently exist.

### DEFERRED

The feature is intentionally postponed to a later phase.

### REJECTED

The feature or approach was considered and explicitly removed from the current product.

### PLANNED

The feature is intended for a future implementation but is not yet part of the current implementation.

### HISTORICAL

The feature or design exists only in older documentation and should not be treated as current product behavior.

This classification is important because the repository contains historical brainstorming and earlier technical proposals.

---

# 40. LEGACY FRONTEND DATA IS NOT BACKEND TRUTH

The existing frontend may contain:

* hardcoded arrays;
* mock announcements;
* sample users;
* static Bible data;
* in-memory media;
* fake extraction states;
* sample FS records;
* local-only settings;
* placeholder governance;
* development fixtures.

Do not interpret the existence of a frontend data structure as proof that the backend must reproduce it exactly.

Instead determine:

1. Is the feature actually part of the current product?
2. Should it be backend-managed?
3. Is the current implementation only a demo?
4. Has the product decision changed?
5. Is it intentionally static/offline content?
6. Is it deferred?

Then implement the correct backend contract.

---

# 41. FRONTEND ↔ BACKEND RESPONSIBILITIES

## Backend owns

* persistent data;
* authentication;
* authorization;
* business rules;
* database integrity;
* role enforcement;
* session management;
* content publication state;
* server-side validation;
* audit records;
* provider integrations;
* authoritative progression;
* API contracts.

## Frontend owns

* presentation;
* interaction;
* navigation;
* responsive layouts;
* local UI state;
* user experience;
* local caching;
* offline presentation;
* optimistic UI where appropriate;
* client-side validation for UX.

The frontend should not become a second backend.

---

# 42. OFFLINE RESPONSIBILITY

Offline functionality does not mean the frontend gets to permanently diverge from the backend.

The correct model is:

```text
Backend
  = Source of Truth

Frontend Cache
  = Local Representation
```

When connectivity returns, the frontend should refresh according to the domain's synchronization requirements.

Do not create a universal sync protocol before there is a demonstrated need.

---

# 43. IMPLEMENTATION RULES

When implementing a new backend feature:

### Step 1 — Understand the product requirement

Ask:

> Why does this feature exist?

Do not start by designing tables.

### Step 2 — Inspect existing implementation

Look at:

* frontend;
* existing backend;
* routes;
* models;
* services;
* repositories;
* database;
* existing API contracts.

### Step 3 — Determine authoritative behavior

Use the project's evidence hierarchy.

### Step 4 — Define the domain

Determine:

* entities;
* relationships;
* states;
* permissions;
* business rules.

### Step 5 — Define the API

Determine:

* endpoints;
* request schemas;
* response schemas;
* errors;
* authorization.

### Step 6 — Implement

Use the established architecture.

### Step 7 — Test

Test:

* happy paths;
* validation;
* authorization;
* edge cases;
* state transitions;
* security-sensitive behavior.

### Step 8 — Verify integration

Confirm the frontend can consume the API without introducing backend logic into the frontend.

---

# 44. DO NOT IMPLEMENT FROM ASSUMPTIONS

A major project rule is:

> **Do not turn a plausible idea into a backend requirement without evidence.**

For example:

Do not assume we need:

* generic system settings;
* generic notifications;
* generic bookmarks;
* generic notes;
* generic user preferences;
* generic sync engines;
* generic content types;
* generic workflow engines;
* generic file managers.

If a requirement is unclear, investigate the existing implementation and documentation first.

If it remains unclear and affects architecture, flag it.

---

# 45. MIGRATIONS AND DATA SAFETY

All production schema changes must be migration-controlled.

Do not manually modify the production database as the normal development process.

Migrations should be:

* versioned;
* reproducible;
* reviewable;
* safe;
* ordered.

Seed data should be clearly separated from production-created data.

Seeded Bible content, for example, must not be confused with user-generated Bible Study content.

---

# 46. TESTING EXPECTATIONS

The backend should have tests around important domains.

At minimum, test:

### Authentication

* registration;
* magic-link request;
* token expiration;
* invalid token;
* replay;
* previous-token invalidation;
* session creation;
* session revocation;
* rate limiting.

### Authorization

* member access;
* coordinator access;
* executive access;
* technical administration;
* unauthorized access attempts.

### Academic progression

* valid promotion;
* session boundaries;
* final-year handling;
* Alumni transition;
* manual override;
* history recording;
* idempotency.

### Content

* announcements;
* events;
* website sections;
* publication states;
* permissions.

### Bible / Bible Study

* retrieval;
* search;
* references;
* publishing;
* extraction/review workflow.

### Foundational School

* admissions;
* enrollment;
* class/level relationships;
* teacher access;
* grading;
* progress;
* completion/certification records.

---

# 47. HEALTH AND OPERATIONS

The backend should expose appropriate health/operational endpoints.

Health checks should help determine whether critical infrastructure is functioning.

Examples include:

* API process;
* database connectivity;
* relevant provider availability where appropriate.

Health endpoints should not leak secrets or sensitive internal information.

---

# 48. DATA LIFECYCLE

Data should have deliberate lifecycle behavior.

Consider:

* active records;
* archived records;
* deactivated accounts;
* Alumni transitions;
* historical academic records;
* published/unpublished content;
* expired authentication tokens;
* sessions;
* audit records.

Do not casually delete historical information simply because it is no longer active.

Likewise, do not retain sensitive transient data indefinitely without reason.

---

# 49. MVP PRIORITIES

The backend MVP should prioritize the product foundation.

### Core

* authentication;
* sessions;
* users/members;
* roles/authorization;
* academic sessions/progression;
* member directory;
* Bible;
* Bible Study;
* events;
* announcements;
* controlled website CMS;
* media abstraction;
* Foundational School;
* audit logging;
* health/operations.

### Offline-capable

* Bible;
* Bible Study where appropriate;
* Hymn Book where appropriate;
* relevant cached content.

The exact MVP boundary remains governed by the full backend specification.

---

# 50. FUTURE / DEFERRED AREAS

Some ideas may exist in the broader product vision but should not automatically become MVP backend work.

Examples include:

* additional Bible translations;
* richer cloud synchronization;
* expanded governance workflows;
* additional CMS section types;
* future library/e-book functionality;
* other future fellowship modules.

A deferred feature should remain clearly marked as deferred rather than quietly implemented halfway.

---

# 51. DOCUMENTATION AUTHORITY

The following hierarchy should be used when working on the project:

### 1. Current source code

What actually exists in the repository.

### 2. Confirmed product decisions

Decisions explicitly confirmed by the project owner.

### 3. Explicit current requirements

Requirements that have been formally established.

### 4. `ASF_BACKEND_SPECIFICATION_FINAL.md`

The current detailed backend architecture and technical contract.

### 5. Other current project documentation

Useful supporting material.

### 6. Historical documentation

Useful for understanding how decisions evolved, but not authoritative for current behavior.

### 7. Assumptions

Lowest confidence.

Never use a historical document to override a confirmed current decision.

---

# 52. IMPORTANT CURRENT DECISIONS

The following decisions are especially important because earlier project documents contained conflicting ideas.

| Area                             | Current Decision                                            |
| -------------------------------- | ----------------------------------------------------------- |
| Authentication                   | Magic-link only                                             |
| Passwords                        | Not supported                                               |
| Registration                     | Immediately creates active member                           |
| Membership approval queue        | Not part of current product                                 |
| Session                          | Persistent until logout/revocation/invalidating event       |
| Department                       | Required                                                    |
| Academic level                   | Required                                                    |
| Academic progression             | Automatic by academic session/year                          |
| Alumni                           | Membership/lifecycle status, not RBAC role                  |
| Technical Coordinator            | Not a canonical role                                        |
| Bible                            | Backend-managed                                             |
| Bible Study                      | Backend-managed                                             |
| CMS                              | Controlled structured sections                              |
| Arbitrary HTML/CSS/JS            | Not allowed                                                 |
| FS                               | Structured domain, not simple student/progress tables       |
| FS graduation                    | Leadership-controlled; no invented automatic formula        |
| Backend architecture             | Modular monolith                                            |
| Database                         | PostgreSQL                                                  |
| Email                            | Provider abstraction                                        |
| Media                            | Provider abstraction                                        |
| Frontend                         | Not source of truth                                         |
| Offline                          | Local cache/offline experience over backend source of truth |
| Microservices                    | Not required for MVP                                        |
| Blockchain governance            | Not required                                                |
| Generic sync engine              | Not required                                                |
| Generic settings/notes/bookmarks | Only if explicitly required                                 |
| Library/e-books                  | Future/deferred                                             |
| Vendor choice                    | Replaceable                                                 |

---

# 53. WHAT SUCCESS LOOKS LIKE

A successful backend is not simply one with many endpoints.

The backend should provide a stable foundation where:

* the frontend can reliably consume well-defined APIs;
* authentication is secure and pleasant to use;
* permissions are enforced server-side;
* member data is consistent;
* academic progression is deterministic and auditable;
* Bible and Bible Study content are centrally managed;
* FS operations have a proper domain model;
* content managers do not need database access;
* media/email providers can be replaced;
* offline-capable features can cache authoritative content;
* database integrity is protected;
* important actions are auditable;
* the system is affordable to operate;
* and future developers can understand the architecture without reverse-engineering it.

---

# 54. NON-NEGOTIABLE BACKEND PRINCIPLES

Keep these principles visible during development.

### 1. Build the product, not the imagination.

Do not implement features simply because they sound useful.

### 2. Backend is the source of truth.

Frontend state is not authoritative production data.

### 3. Security belongs in the backend.

Never rely on frontend restrictions for authorization.

### 4. Keep providers replaceable.

Infrastructure choices may change.

### 5. Prefer simple architecture.

A modular monolith is sufficient for the current scale.

### 6. Do not recreate FUTA systems.

Academic information exists for fellowship lifecycle purposes.

### 7. Do not invent business rules.

Especially for FS completion, graduation, governance, and membership.

### 8. Preserve history.

Historical documentation explains why the system looks the way it does, but does not override current decisions.

### 9. Make contracts stable.

The frontend should be able to build against predictable APIs.

### 10. Design for handover.

This project is intended to outlive the current developers.

---

# 55. WHEN A REQUIREMENT CHANGES

Product decisions will evolve.

When a confirmed requirement changes:

1. Identify the affected domain.
2. Identify affected database structures.
3. Identify affected APIs.
4. Identify affected frontend contracts.
5. Identify affected security rules.
6. Update the authoritative documentation.
7. Create/update migrations where required.
8. Update tests.
9. Record the change where appropriate.
10. Do not leave contradictory legacy behavior in the active implementation.

Do not create:

```text
FINAL.md
FINAL2.md
FINAL_NEW.md
FINAL_LATEST.md
FINAL_LATEST_REAL.md
```

The project should maintain a clear canonical specification.

---

# 56. REFERENCE DOCUMENTS

The backend developer should use the following documents where available:

### Primary

`ASF_BACKEND_SPECIFICATION_FINAL.md`

Detailed backend implementation specification.

### Supporting

* Current PRD / product documentation
* Current architecture documentation
* Current UI/UX documentation
* Current security documentation
* Current API documentation
* Current testing documentation
* Current deployment documentation

### Historical

Earlier ASF documents may be consulted to understand decisions and changes, but should not override current requirements.

---

# 57. FINAL DEVELOPER CHECKLIST

Before implementing a backend feature, ask:

### Product

* What problem does this solve?
* Is it actually part of the current ASF product?
* Is it MVP, future, deferred, or historical?

### Domain

* What entities are actually required?
* What are their relationships?
* What states exist?
* What business rules apply?

### Authorization

* Who can access this?
* Who can create it?
* Who can modify it?
* Who can publish it?
* Who can delete/archive it?

### API

* What endpoint is required?
* What request does the frontend send?
* What response does the frontend receive?
* What errors can occur?

### Database

* What tables are required?
* What constraints are required?
* What indexes are required?
* What migration is required?

### Security

* Can the operation be abused?
* Can unauthorized users call it directly?
* Does it expose sensitive data?
* Does it need auditing?

### Offline

* Does this feature need offline support?
* If yes, what data is cached?
* What remains authoritative?

### Infrastructure

* Does this require an external provider?
* Can the provider be abstracted?
* Are secrets kept server-side?

### Testing

* What are the happy paths?
* What are the failure paths?
* What are the authorization cases?
* What happens at boundaries?

If these questions cannot be answered confidently, inspect the current repository and documentation before implementing.

---

# 58. FINAL WORD

ASF Digital Platform is a **fellowship digital ecosystem**, not simply a website and not a university management system.

The backend exists to provide a secure, maintainable, authoritative foundation for the fellowship's digital operations.

The goal is not to build the largest possible system.

The goal is to build the **right system**, with clear boundaries, reliable APIs, strong security, maintainable architecture, and enough flexibility to grow.

When uncertain:

> **Understand the product first. Inspect the existing implementation. Check the authoritative specification. Verify the business rule. Then implement.**

And above all:

> **Do not invent requirements just because the technology makes them possible.**
