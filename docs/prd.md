# ASF Digital Platform — Master Product Requirements Document (PRD)

**Anglican Students' Fellowship — Federal University of Technology, Akure (FUTA)**  
**Version:** 1.0 (Master, Consolidated Draft)  
**Status:** Draft — consolidates all prior project documents; contains unresolved items requiring leadership decision

---

# Table of Contents

1. Document Control
2. Executive Summary
3. Product Vision
4. Problem Statement
5. Product Goals
6. Non-Goals
7. Product Principles
8. Users and Personas
9. Role and Permission Model
10. Product Information Architecture
11. Authentication and Account Lifecycle
12. Home Experience
13. Module Requirements (13.1 Bible Study – 13.12 Photo/Memory Calendar)
14. Cross-Module Integration
15. Content Management
16. Offline-First Requirements
17. Non-Functional Requirements
18. Security and Privacy
19. Technical Architecture Reference
20. MVP Definition and Release Roadmap
21. Development Phasing Reference
22. Testing and Launch Criteria
23. Leadership and Technical Handover Requirements
24. Success Metrics
25. Risks and Considerations
26. Consolidated Open Decisions and Questions
27. Cross-Document Conflicts and Gaps
28. Future Possibilities
29. Related Documents Index

---

# 1. Document Control

This document is the **master, product-level source of truth** for the ASF Digital Platform. It consolidates and reconciles the project's full document set — the original Proposal, the v1.0 PRD, five Module Specifications (Bible Study, FS, Hymn Book, Library, Announcements), the UX/User Flow Document, the System Architecture Document (SAD), the Data Model and Data Dictionary, the Security & Privacy Document, the Development Plan/Roadmap, the Environment & Configuration Document, the Deployment Guide, and the Testing & QA Plan — into one coherent product narrative.

**Where this document is authoritative:** what is being built, for whom, why, and to what product-level behavior.

**Where this document defers:** exact database schema (Data Model/Data Dictionary), system architecture and technology choices (SAD), API shape (API Documentation), security implementation detail (Security & Privacy Document), environment/deployment mechanics (Environment & Configuration Document, Deployment Guide), and test execution detail (Testing & QA Plan). This document references those documents rather than duplicating their content, per its own scope discipline.

| **Field** | **Detail** |
| --- | --- |
| Document title | ASF Digital Platform — Master Product Requirements Document |
| Product name | ASF Digital Platform |
| Organization | Anglican Students' Fellowship (ASF), Federal University of Technology, Akure (FUTA) |
| Document type | Master Product Requirements Document (consolidated) |
| Version | 1.0 (Master, Consolidated Draft) |
| Status | Draft — for internal development team use, pending leadership decisions on the items in Section 26 |
| Owner | The two Computer Science student developers who founded and are building the platform, on behalf of ASF FUTA |
| Intended audience | The development team; UI/UX designers; QA; ASF leadership and content coordinators; any future ASF technical or content administrator who inherits this project |
| Related documents | Project Proposal ("A Digital Home for ASF"); PRD v1.0; Bible Study, FS, Hymn Book, Library, and Announcements Module Specifications; UX/User Flow Document; System Architecture Document; Data Model / Database Design Document; Data Dictionary; Security & Privacy Document; Development Plan / Roadmap; Environment & Configuration Document; Deployment Guide; Testing & QA Plan |

**Change history.** This is the first consolidated master edition. Prior documents were produced sequentially (Proposal → PRD → Module Specs → UX Flow → SAD → Data Model/Dictionary → Security & Privacy → Roadmap → Environment/Deployment/QA), and later documents in that sequence occasionally refine or resolve questions the earlier ones left open. Where this happened, this master document uses the **most recent, most specific** resolution and flags the earlier document's version as superseded rather than silently discarding the history (see Section 27, Cross-Document Conflicts).

---

# 2. Executive Summary

The ASF Digital Platform is a digital home for the Anglican Students' Fellowship at FUTA: a public website, an authenticated member application, and role-scoped admin tooling, built by two Computer Science students who are themselves ASF members, as a contribution to the fellowship rather than a commercial product.

**The problem it solves:** ASF FUTA already has real spiritual and organizational resources — a Bible Study curriculum, a Hymn Book, Foundational School (FS) materials, devotionals, a library, and a full calendar of events and announcements — but these are scattered across WhatsApp groups, physical manuals, and the memory of whoever currently holds a given role. The platform's job is to centralize and preserve these resources without changing what ASF fundamentally is, and to make sure access to them survives beyond any one generation of executives or developers.

**What makes it different:** it is explicitly **not** a school portal, not an LMS, and not a generic church-management SaaS product. Every product principle (Section 7) exists to keep it feeling like a fellowship's own space — simple, fast, offline-first, and built so that a non-technical executive can run their part of it from a phone with no developer involvement.

**Major modules:** Bible Study, Bible, Hymn Book, Foundational School, Daily Devotional, Announcements, Events, Notifications, Digital Library, Help & Suggestion Box, Weekly Challenges, and a Photo/Memory Calendar, sitting alongside a public website and role-scoped admin dashboards (Section 13).

**Technical posture, referenced not duplicated:** the confirmed architecture (SAD, ADR-1 through ADR-5) is a single Next.js Progressive Web App backed by Supabase (PostgreSQL, Auth, Storage, Edge Functions), with Postgres Row-Level Security as the actual enforcement layer for every permission in this document, local offline storage for the platform's most-used reading content, and Google Drive reserved narrowly for large archival files. This is deliberately a low-cost, portable, two-person-team-maintainable stack — full detail lives in the SAD, Data Model, and Deployment Guide, not here.

**MVP direction:** a member can sign in, read the current Bible Study (manually entered by the Coordinator, with working clickable Bible references), open the Bible directly, look up a hymn, read today's devotional, and see current announcements and upcoming events — all fully usable offline once synced — while executives manage all of that content from an admin dashboard with zero backend access. Automatic PDF extraction for Bible Study, the Digital Library, Help & Suggestion Box, Weekly Challenges, and the Photo/Memory Calendar are deliberately sequenced after MVP (Section 20).

**Long-term vision:** a platform that keeps working, unmodified in spirit, through multiple generations of ASF executives and technical maintainers — where a leadership handover means reassigning roles, not losing content or rebuilding access from scratch (Section 23).

---

# 3. Product Vision

_"To create a digital home for ASF that brings fellowship information, spiritual resources, educational resources, communication, and useful member services into one accessible platform."_

Supporting statement, meant to guide every design decision made against this document: **we are not trying to replace the fellowship or its existing activities.** We are using technology to make the fellowship's resources, information, and support more accessible to its members — and to make sure that access survives beyond any one generation of executives or developers.

## 3.1 What the platform should become over time

- **Digital fellowship infrastructure** — the default place a member goes for Bible Study, the Bible, the Hymn Book, and fellowship news, the way the physical manual and WhatsApp groups currently are.
- **Continuity beyond leadership tenure** — the platform's value compounds specifically because it does not reset every time an executive graduates (Section 23).
- **Centralized fellowship knowledge** — a growing, searchable archive of Bible Studies, FS materials, and fellowship history (photos, past programs) that would otherwise live only in individual memory or scattered physical copies.
- **Reduced dependence on physical materials** — without eliminating them; the platform supplements ASF's existing life rather than digitizing it away.
- **Reliable communication** — replacing the WhatsApp-broadcast pattern with a channel every member can rely on, online or offline.
- **A useful everyday member experience** — something a member opens outside of fellowship meetings, not only during them.

This document deliberately does **not** invent a grandiose commercial vision, a multi-institution product strategy, or a monetization plan — none of that is supported by the source material, and inventing it would violate this document's own source-of-truth discipline.

---

# 4. Problem Statement

ASF FUTA already has substantial resources and activity: a Bible Study curriculum, Foundational School, a Hymn Book, devotionals, a library of books and past questions, regular announcements, and a full calendar of events. **The problem is not a lack of resources — it is that these resources are hard to find, hard to keep organized, and dependent on specific individuals to distribute.**

| **Problem** | **Who experiences it** | **Current situation** | **Impact** | **Product response** |
| --- | --- | --- | --- | --- |
| Bible Study requires a physical manual | Every member | Manual must be physically present to study; no searchable history | Members without the manual can't engage; no archive of past studies | Bible Study module (13.1) — digital, searchable, offline-capable, with a growing archive |
| Announcements live and die in WhatsApp groups | Every member, executives | Easy to miss, no persistent record, no read/unread tracking | Members miss time-sensitive information; executives repeat themselves | Announcements module (13.5) with a persistent, searchable, offline-cached feed |
| FS materials are loose PDFs/handouts | FS students and teachers | No structured access; hard to preserve across cohorts | Materials are lost or inconsistently distributed between cohorts | FS module (13.8) with a structured, versioned, cohort-aware manual |
| Past questions/study materials obtained by asking around | Members, especially newer ones | Informal, person-dependent distribution | Newer or less-connected members are disadvantaged | Digital Library (13.9), respecting copyright throughout |
| A member needing help must locate the right person physically | Members with a concern, question, or need | No structured, private channel | Sensitive needs may go unaddressed or become semi-public by accident | Help & Suggestion Box (13.10) with category-based private routing |
| Fellowship history (photos, past programs) isn't centrally preserved | The fellowship as a whole | Scattered across personal devices and social media | Institutional memory degrades over time | Photo/Memory Calendar (13.12), scheduled for a later version |
| Executive turnover loses institutional knowledge and access | Incoming executives, the fellowship | Manual re-sharing of materials and access each session | Repeated rebuilding effort; risk of permanent content loss | Leadership/Handover requirements (Section 23), treated as a first-class requirement platform-wide |

**The platform's job is to remove this friction, without changing what ASF fundamentally is.**

---

# 5. Product Goals

## 5.1 Primary goals

- Bring ASF's scattered resources (Bible Study, Bible, Hymn Book, FS, devotionals, announcements, events, library) into one platform.
- Make core spiritual materials usable even with poor or no internet connectivity.
- Let non-technical fellowship leaders manage their own content without developer involvement.
- Design the platform so it survives leadership transitions and eventually the graduation of its original developers.
- Start with a small, realistic, buildable first version — not an attempt to ship every idea at once.

## 5.2 Secondary goals

- Preserve ASF's institutional memory (Bible Study archive, event history, photos) over time.
- Give students a reason to open the platform outside of fellowship meetings.
- Keep operating cost near zero at current scale, honestly, without promising "free forever" (SAD §29).

## 5.3 Long-term goals

- A platform that has survived at least one full leadership handover with no data loss (Section 24, Success Metrics).
- A technology foundation (Postgres-based, RLS-enforced, Supabase-hosted) that a future, different technical team can operate from documentation alone (SAD §32).
- Room to grow from ~500 members toward 5,000–10,000 without a structural rebuild (SAD §31), and room, though not a commitment, to expand beyond ASF FUTA (Section 28).

## 5.4 Observable success indicators

See Section 24 (Success Metrics) for the full list; the headline ones worth stating here: proportion of members who return outside the immediate fellowship-meeting window, proportion of members with offline downloads of Bible/Bible Study/Hymn Book, and the number of content updates published by fellowship leaders **without developer involvement** — this last one is the clearest test of whether the platform's central promise is actually working.

---

# 6. Non-Goals

Explicitly **out of scope** for the foreseeable versions of this product — not just "later," but deliberately rejected unless ASF leadership says otherwise.

## 6.1 Confirmed non-goals

- **Not a school/departmental portal.** No matric-number-based login, no academic-institution branding or tone (PRD §6; Security §3.1, 3.6).
- **No QR-code or biometric attendance tracking.** The Events module is for awareness and reminders, not attendance enforcement (PRD §6, §12.8).
- **No live location sharing or "nearest member" discovery.** Excluded from every planned version on privacy/safety grounds (PRD §12.14; UX Flow §29; Security §11). If ever revisited, it requires a dedicated privacy/safety review before any design work begins — this document does not pre-design a "safer version" of a feature that isn't planned.
- **No redistribution of copyrighted material ASF does not own or have permission to share.** The Library catalogues and links to such material rather than hosting it by default (PRD §6, §12.10, §21; Library Spec §21).
- **No promise of "free forever" infrastructure.** The product is designed to be affordable and sustainable, not to guarantee zero operating cost indefinitely — a resourcing/expectations decision for leadership, not a product feature (PRD §6; SAD §29).
- **No monetized or commercial features** — no ads, no marketplace, no paid tiers — unless the fellowship explicitly decides otherwise (PRD §6).
- **Not a Learning Management System for FS.** FS does not replace human discipleship, interviews, attendance follow-up, or leadership judgment about who is ready to graduate (FS Spec §1, §17).
- **Not a teacher-surveillance tool.** FS Teachers do not get reading-percentage dashboards, activity logs, or performance analytics on their students by default (FS Spec §18, §44).

## 6.2 Recommended, not yet formally confirmed, non-goals

- A full multi-role approval chain for routine publishing (Coordinator → President → Publicity Coordinator) is **recommended against** — it would contradict the platform's core promise of fast executive action (UX Flow §21).
- Custom rate-limiting, anomaly/suspicious-activity detection, and device/session management are recommended as **not built for MVP**, relying instead on Supabase's built-in protections at this scale (Security §6.3, §18, §23).

---

# 7. Product Principles

These principles, gathered from the UX/User Flow Document (§2, §35) and reinforced throughout every module specification, govern every design and engineering decision made against this document.

| **Principle** | **What it means in practice** |
| --- | --- |
| Simple | A first-time member finds Bible Study, the Bible, and Announcements without instructions. Home is a module menu, not a dashboard trying to show everything at once (UX Flow §5, §9). |
| Fast | Core screens load quickly on modest connections; cached content opens near-instantly (PRD §20; module-level Performance sections throughout). |
| Offline-first | Bible, Bible Study, and Hymn Book must work with zero connectivity once synced — treated as a hard constraint, not a nice-to-have (Section 16; SAD §2). |
| Low data usage | Text-based content where possible (e.g., the Hymn Book, Hymn Book Spec §15); no unnecessary media weight; automatic image compression (Announcements Spec §21). |
| Mobile-first | Designed for typical student smartphones as the primary device, not desktop-first (PRD §20). |
| Easy for non-technical executives | Every content type a leader owns has a management interface usable with no developer, database, or backend-tool access (PRD §12.15, ADM-001; every module's Admin section). |
| Easy for students | No academic-institution tone; a warm, fellowship-feeling entry experience, not an admin panel (UX Flow §2). |
| Minimal unnecessary steps | E.g., the Hymn Book prioritizes direct number entry as its single most time-critical interaction (Hymn Book Spec §7). |
| Clear navigation | Hamburger-menu primary navigation, role-based module visibility with no locked/greyed placeholders (UX Flow §5). |
| Accessible | Resizable, legible text; usable without relying on color alone; comfortable touch targets on real phones (PRD §20; module Accessibility sections). |
| Maintainable | Documented well enough that a future technical team member — not one of the original two developers — can understand and operate it (PRD §20; SAD §32). |
| Scalable | Comfortably supports ASF FUTA's current and near-future size without redesign; not built for a national platform on day one (PRD §20; SAD §33). |
| Fellowship-oriented | Feels like ASF's own space, never like a school/departmental system (UX Flow §2, §35; PRD throughout). |
| Leadership-handover friendly | Roles belong to positions, not people; content persists independently of who holds a role (Section 23). |
| Content/code separation | New Bible Study entries, FS materials, announcements, and library items never require a developer to touch code (Section 15). |

---

# 8. Users and Personas

Every user category identified across the PRD, module specs, UX Flow document, and Security & Privacy Document.

## 8.1 Public Visitor

- **Who:** anyone with no ASF account — prospective members, parents, alumni researching the fellowship, the general public.
- **Goals:** learn about ASF, find contact/meeting information, decide whether to join.
- **Access:** the public website only (Section 10.1). No member-platform content, ever, under any current decision.
- **Key workflow:** Public Website Flow → Login/Create Account → becomes a Member (UX Flow §30).

## 8.2 Member (general, authenticated)

- **Who:** any current ASF FUTA student with a platform account. The base role every other role builds on.
- **Goals:** read Bible Study, the Bible, and the Hymn Book; stay informed via Announcements and Events; manage their own profile and personal content.
- **Access:** the full member platform, scoped to whatever additional roles they hold (Section 9).
- **Cannot access:** any admin/content-management tooling, or any other member's personal notes/bookmarks/highlights (Security §13).

## 8.3 FS Student

- **Who:** a Member currently or historically enrolled in a Foundational School cohort.
- **Goals:** read the FS Manual at their own pace, track their own reading progress, receive FS-specific announcements.
- **Access:** everything a Member can do, plus their assigned cohort's FS Manual and materials (FS Spec §4, §7).
- **Cannot access:** other cohorts' materials, or any FS administrative tooling.

## 8.4 FS Teacher

- **Who:** a member assigned to lead one or more FS teaching groups.
- **Goals:** manage materials and (where granted) announcements for their own group(s) only.
- **Access:** their assigned group's roster (read-only) and materials (manage). Deliberately **not** given student-monitoring dashboards (FS Spec §18, §31).
- **Cannot access:** other teaching groups, or FS-wide cohort administration.

## 8.5 Vice President / FS Coordinator (FS's head role)

**[CONFLICT]** the PRD names this role "FS Coordinator"; the FS Module Specification states the Vice President is FS's actual head, and that the VP is not simply an FS Coordinator (FS Spec §0). This master document uses **Vice President (VP)** as the more recent, more detailed source, and flags the PRD's role table as needing reconciliation. See Section 27.

- **Goals:** run FS administration end-to-end — cohorts, student registration, teacher assignment, manual publishing, visibility control — without any backend access.
- **Access:** full FS administrative authority (FS Spec §31).

## 8.6 Bible Study Coordinator

- **Goals:** keep the Bible Study archive current, accurate, and published on schedule.
- **Access:** full content authority over Bible Study — upload, review, correct, publish, archive (Bible Study Spec §25); can request but not unilaterally execute permanent deletion of a published study (Security §6.1).

## 8.7 Publicity Coordinator

- **Goals:** keep announcements, events, the public website, and the gallery current; run service preparation for the Hymn Book.
- **Access:** the platform's broadest practical single-role authority — announcements, events, public-website content, account-recovery re-linking, service-hymn selection, and a required approver on the Bible Study deletion workflow (Security §4.3, §6.1).

## 8.8 General Secretary

- **Goals:** co-manage announcements alongside the President and Publicity Coordinator; support Hymn Book content management.
- **Access:** full announcement authority, co-equal with President and Publicity Coordinator (Announcements Spec §3); Hymn Book content management with a scope relative to the Choir Coordinator still **DECISION REQUIRED** (Hymn Book Spec §18).

## 8.9 Choir Coordinator

- **Goals:** keep the Hymn Book accurate.
- **Access:** primary Hymn Book content-management role (Hymn Book Spec §18). This role is a **PRD gap** — not currently in the PRD's role table (Section 27).

## 8.10 Librarian / Library Coordinator

- **Goals:** keep the Digital Library current, correctly categorized, and copyright-compliant.
- **Access:** full Library content authority — upload, metadata, categorization, featuring, archiving, borrowing/request management (Library Spec §22).

## 8.11 President / Executive

- **Goals:** fellowship-wide oversight; approve the Bible Study deletion workflow; initiate leadership handovers.
- **Access:** oversight-only — broad read visibility across modules, approval participation — does **not** directly manage day-to-day content in another Coordinator's module (Security §4.2, Summary item 6).

## 8.12 Technical Administrator

- **Who:** a developer/maintainer with system-level access, distinct from fellowship-leadership access.
- **Goals:** keep the system running; execute role-assignment changes; hold infrastructure-level access.
- **Access:** system/infrastructure-level configuration and account recovery; executes every role reassignment regardless of who initiates it (Security §4.3); does **not** automatically receive content authority in any module (PRD §8.2).

## 8.13 Alumni

- **Who:** a former member/executive who has graduated.
- **Goals:** retain some connection to ASF after graduation.
- **Access:** reduced Member-level access — exact reduction is **DECISION REQUIRED** (PRD §23 item 11; Security §4.2, §30 item 2). No administrative access unless separately re-appointed.

---

# 9. Role and Permission Model

**[CONFIRMED DECISION]** roles belong to a position or responsibility, never to a person. When a person leaves a position, the role is reassigned to their successor; the outgoing person's account typically reverts to Member or Alumni status rather than being deleted (PRD §8.1, §15; FS Spec §40; Security §28). This is the mechanism that makes the platform survive leadership transitions — see Section 23.

**[CONFIRMED DECISION]** authorization is purely role-based with no individual-level overrides, enforced primarily through Postgres Row-Level Security rather than hidden UI alone (Security §4.1, §5). A compromised or buggy frontend cannot bypass this — the database itself enforces every rule in the table below.

## 9.1 Role summary and authority

| **Role** | **Public access?** | **Core capability** |
| --- | --- | --- |
| Public Visitor | Yes (no login) | View the public website only. |
| Member | No — requires account | Read/use all member-platform content; submit Help/Library requests; manage own profile and personal content. |
| FS Student | No | Everything a Member can do, plus their assigned cohort's FS Manual and progress. |
| FS Teacher | No | Manage materials for their assigned teaching group(s) only; view (read-only) their own group's roster. |
| Vice President (FS's head role) | No | Full FS administrative authority — cohorts, registration, teachers, manual, visibility (see §8.5 conflict note). |
| Bible Study Coordinator | No | Add/edit/publish/archive Bible Study content; can request but not unilaterally execute permanent deletion. |
| Publicity Coordinator | No | Broadest practical authority — announcements, events, public site, gallery, account recovery, Bible Study deletion approval. |
| General Secretary | No | Co-equal announcement authority with President/Publicity Coordinator; Hymn Book content management (scope vs. Choir Coordinator open). |
| Choir Coordinator | No | Primary Hymn Book content manager (PRD role-table gap — Section 27). |
| Librarian | No | Manage the Digital Library catalogue and content-licensing classification. |
| President / Executive | No | Oversight only — broad visibility, Bible Study deletion approval — not routine content editing in others' modules. |
| Technical Administrator | No | System-level configuration, account recovery, executes all role reassignments. Never implies content authority. |
| Alumni | No | Reduced Member-level access; exact scope DECISION REQUIRED. |

**Product rule, restated:** a Technical Administrator role does not automatically imply Executive authority, and vice versa. A future President does not need to know how to maintain the system; a future technical maintainer does not need authority to publish fellowship announcements (PRD §8.2). This separation is what allows a clean handover on either axis independently.

## 9.2 CRUD authority by role (cross-module summary)

| **Role** | **View** | **Create** | **Edit** | **Publish** | **Archive** | **Delete (published)** | **Approve** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Member | Own scope | Personal content only | Own personal content | — | — | — | — |
| FS Teacher | Own group + read-only roster | Own group materials | Own group materials | Own group materials | Own group materials | — | — |
| Vice President | All FS | Cohorts/groups | FS structure | FS Manuals | FS content | FS content (no multi-approval) | FS access grants/revokes |
| Bible Study Coordinator | All Bible Study | New studies | Bible Study content | Bible Study | Bible Study | Cannot unilaterally — requires approval (§9.3) | — |
| Publicity Coordinator | Broadest | Announcements/Events/Site | Same | Same | Same | Announcements/Events (no multi-approval) | Bible Study deletion; directs role changes |
| General Secretary | Announcements, Hymn Book | Announcements | Announcements, Hymn Book (scope open) | Announcements | Announcements | Announcements (no multi-approval) | — |
| Choir Coordinator | Hymn Book | Hymn Book resources | Hymn Book resources | Hymn Book resources | Hymn Book versions | — | — |
| Librarian | Library | Library resources | Library resources | Library resources | Library resources | Library resources | — |
| President | Broad (oversight) | — | — | — | — | — | Bible Study deletion |
| Technical Administrator | System-level | — | — | — | — | — | Executes role-assignment changes |

## 9.3 The one multi-person approval action on the platform

**[CONFIRMED DECISION]** multi-person approval applies to exactly **one** action on the entire platform: permanently deleting an already-published Bible Study entry. Every other destructive action (archiving, deleting a draft, deleting an announcement/event/library resource, FS content deletion) uses a lightweight single-executive confirm dialog (Security §6.1, §6.4).

| **Element** | **Confirmed configuration** |
| --- | --- |
| Requester | Bible Study Coordinator (the only role that manages this content) |
| Required approvers | President **and** Publicity Coordinator (2-of-2) |
| Rejection | Either approver can reject, cancelling the request outright; the Coordinator must submit a new request |
| Expiry | A pending request expires after 14 days if not acted on; the Coordinator is notified and may resubmit |
| No response | Request stays pending until expiry — no escalation mechanism for MVP |
| Delegation | None for MVP — if an approver is unavailable, the request simply waits (DECISION REQUIRED if this should change) |
| Re-authentication | Step-up re-authentication (a fresh magic-link tap) is required to cast a vote, regardless of how recently the approver last logged in (Security §6.2) |

This resolves the Bible Study Module Specification's own open item ("2-of-3 vs. 3-of-3", Bible Study Spec §26, §35 item 6) at the Security & Privacy Document level, which is the most recent and most specific source on this question. The Data Model and SAD both model the approval threshold as **configurable data**, not a hard-coded number, so this configuration can change without a code change (Data Model §18; SAD §34, Risks table).

## 9.4 Governance questions not yet resolved

- **Who has final authority to assign a role** (President directly, Technical Administrator on the President's instruction, or jointly)? (PRD §8.2, Open Question.)
- **Whether Technical Administrator and content-Coordinator roles being held by the same two people** is an accepted long-term pattern or a temporary bootstrapping state (Security §4.4).
- **Who holds "break glass" emergency access** if both current technical students are simultaneously unreachable (Security §29, §30 item 10; Environment & Configuration §19).

---

# 10. Product Information Architecture

## 10.1 Public Website (unauthenticated)

| **Page** | **Content** | **Managed by** | **Version** |
| --- | --- | --- | --- |
| Home | Introduction, highlights, upcoming-event teaser, call to action | Publicity Coordinator | MVP (Phase 7) |
| About | History, mission, beliefs/affiliation, structure | Publicity Coordinator / President | MVP (Phase 7) |
| Programs | Recurring activities described at a public level | Publicity Coordinator | MVP (Phase 7) |
| Events | Public-facing upcoming events/programs | Publicity Coordinator | MVP (Phase 7) |
| Leadership | Current executives, roles, optionally photos | Publicity Coordinator, confirmed by President | MVP (Phase 7) |
| Gallery | Public photos from fellowship activities | Publicity Coordinator | MVP (Phase 7) |
| Contact | Contact channel, meeting location and service times | Publicity Coordinator | MVP (Phase 7) |
| Giving | Information on financially supporting ASF, where public | President / Publicity Coordinator | MVP (Phase 7) |
| News | Public announcements appropriate for external visibility | Publicity Coordinator | MVP (Phase 7) |
| Join ASF | How a prospective student can get involved | Publicity Coordinator | MVP (Phase 7) |
| Login / Create Account | Shared identity system with the member app | — | MVP (Phase 1) |

The public website shares one identity system with the member application (UX Flow §30): a visitor who creates an account on the website lands in the same Member Platform. Per the Roadmap, the public website is a lower-priority parallel track (Phase 7) that can be built alongside the member-app phases, since it shares almost no data model with the member app beyond Events/Announcements.

## 10.2 Member Platform (authenticated) navigation

Primary navigation is a **hamburger menu**; there is no bottom tab bar (UX Flow §5, §38, Confirmed UX Decision 2). Module visibility is role-based: a module a member has no access to simply never appears — not as a locked or greyed-out placeholder (UX Flow §5).

| **Item** | **Location** | **Version** | **Visible to** |
| --- | --- | --- | --- |
| Home (module menu + daily verse card) | Landing screen after login | MVP | All members |
| Bible Study | Home menu | MVP | All members |
| Bible | Home menu | MVP | All members |
| Hymn Book | Home menu | MVP | All members (authenticated) |
| Daily Devotional | Home menu | MVP (timeline-dependent) | All members |
| Announcements | Home menu | MVP | All members |
| Events | Home menu | MVP | All members |
| FS | Home menu, only once granted | MVP (code); launch gated per cohort readiness | Members granted FS access |
| Library | Home menu | V1.1 | All members, once shipped |
| Help & Suggestion Box | Home menu | V1.1 | All members, once shipped |
| Weekly Challenges | Home menu | V2 | All members, once shipped |
| Photo/Memory Calendar | Home menu | V2 | All members, once shipped |
| Profile | Hamburger drawer | MVP | All members |
| My Bookmarks | Hamburger drawer | MVP | All members |
| Notifications | Hamburger drawer + bell icon on top bar | MVP (in-app only; push is V1.1+) | All members |
| Settings (offline downloads, sync) | Hamburger drawer | MVP | All members |
| About ASF / Help | Hamburger drawer | MVP | All members |
| Admin Dashboard | Hamburger drawer, role-conditional | MVP | Any executive/coordinator role |
| Technical Admin | Hamburger drawer, separate entry | MVP | Technical Administrator only |
| Logout | Hamburger drawer | MVP | All members |

---

# 11. Authentication and Account Lifecycle

Full technical implementation belongs to the SAD and Security & Privacy Document; this section states the confirmed product-level behavior.

## 11.1 Confirmed decisions

| **Aspect** | **Confirmed behavior** |
| --- | --- |
| Login method | Email/contact-based sign-in (magic link), with optional Google OAuth. No matric-number login. No SMS one-time-code by default, due to its recurring per-message cost (Security §3.1; SAD ADR-3). |
| Registration model | Open, self-service. Any visitor can create an account instantly — no admin-approval waiting room (Security §3.2). |
| What a new member provides | Name, contact method (email), department, and subgroup (optional). No matric number, no unnecessary identity documentation (UX Flow §6; Security §3.6). |
| Background review | Silent, backend-only, occurring after account creation — never shown to the member in advance. A flagged account is auto-suspended (UX Flow §6, §8). |
| Session persistence | Sessions persist across normal use; a member is not asked to log in every time they open the app (UX Flow §7). |
| Multi-device | Simultaneous logins on multiple devices are permitted — an accepted, low-risk gap, not an enforced feature (Security §3.5). |
| Account recovery | Human-verified: the member meets the Publicity Coordinator in person to verify identity and re-link the account — deliberately not self-service, appropriate to a small, in-person fellowship (Security §3.4). |
| FS access | Not selected at signup; granted after account creation by the Vice President / FS Coordinator (UX Flow §6, §38 item 7). |
| Post-signup experience | No onboarding tour — the member lands directly on Home (UX Flow §6, §38 item 8). |
| Public content | Never requires login to view (PRD AUTH-004). |

## 11.2 Genuinely unresolved

- **Background-review verification criteria.** No actual verification logic exists yet — confirmed as a placeholder, not an implemented process. Recommended starting point: manual, periodic review by an executive (e.g., General Secretary or Publicity Coordinator), not automated heuristics (Security §3.3). Until resolved, the platform should be treated, for security planning, as having no real registration-time identity verification.
- **Exact reduced Alumni access** (PRD §23 item 11; Security §4.2, §30 item 2).
- **Alumni transition trigger** — recommended default is member-initiated (from Profile settings) with executive confirmation, rather than purely automatic or purely admin-driven (UX Flow §8, §37 item 7).
- **Member-initiated account deletion** — no prior document addresses this; recommended to route through the Publicity Coordinator, the same human-verified channel as recovery (Security §7).
- **Whether SMS-OTP should ever be added** as an *additional*, not replacement, option, if ASF later chooses to fund it (SAD ADR-3).

---

# 12. Home Experience

**[CONFIRMED DECISION]** Home is a simple, scrollable **module menu** — one row/card per module the member has access to — topped by a daily Bible verse card. It is deliberately **not** a full "everything happening today" dashboard (UX Flow §5, §38 item 1).

## 12.1 Layout

- **Top app bar:** a small ASF crest/mark, a hamburger icon (left), and a notification bell icon (right) giving quick access to the in-app notification feed without cluttering Home itself.
- **Daily Bible verse card:** an independent monthly batch, one verse per assigned calendar day, loaded in advance by the Bible Study Coordinator. Tapping it opens the Bible reader **full-screen** at that chapter — an intentional contrast with Bible Study's lightweight reference pop-up (UX Flow §9, §38 items 9 and 17).
- **Module menu:** a 2-per-row grid of icon+label cards, ordered with Bible Study and Bible near the top (highest daily use), followed by Hymn Book, Devotional, Events, Announcements, then FS/Library/Help where visible to that member.
- **No search bar on Home itself** — search lives inside each module, to protect the "simple menu" decision (UX Flow §9, §25). A cross-module "Search Everything" entry is a reasonable V1.1+ addition, not MVP.

## 12.2 States

| **State** | **Behavior** |
| --- | --- |
| First-time (post-signup) | Lands directly on Home; no onboarding tour. |
| Returning, valid session | Home screen directly, no re-login. |
| Returning, expired session | Login screen, then Home. |
| Module row, unseen content | A small counter badge (e.g., "Announcements •2") — a **recommended default**, not yet confirmed, and the lightest-weight signal available without contradicting the "simple menu" decision (UX Flow §5, §37 item 1). |
| Offline | The app shell and any already-downloaded module content remain fully usable; undownloaded content shows a clear offline message, not a blank screen (UX Flow §23). |

---

# 13. Module Requirements

Each module below states purpose, users, structure, functional requirements, offline/sync behavior, admin workflow, roles, journeys, acceptance criteria, MVP/version scope, and open decisions.

## 13.1 Bible Study

**Dedicated specification exists:** Bible Study Module Specification.

Bible Study is the digital replacement for ASF's physical Bible Study manual, turning the manual into structured, searchable, interactive content that works with or without internet.

### Goals

- Every member finds "this week's" study without searching, and can find any past study.
- Every Bible reference is one tap away from being read in context, without leaving the flow of study.
- The module works fully offline once the member has been online at least once since the last update.
- A non-technical Bible Study Coordinator can publish and correct a study without developer involvement.

### Structure & Date Logic

A study is built from core sections (Theme, Topic, Text, Memory Verse, Aim, Introduction, Study Guide, Conclusion, Prayer) plus optional/custom sections. The module reasons in weeks, occurring on Tuesdays, surfacing the next upcoming study.

### Digital Reading Experience & Bible Linking

- One long, scrollable page per study.
- Tapping Bible Study opens directly into the current week's study.
- Every Bible reference is automatically detected and rendered as an interactive element opening the Bible reader as a **pop-up overlay**.

### MVP / V1 / V2 Scope

- **MVP:** Current study with date-relative labeling, archive via calendar/search, clickable references with return-to-position, offline reading, manual structured entry with review, Bookmarks.
- **V1:** Automatic PDF extraction, Notes & Highlights, multi-version Bible selection.

---

## 13.2 Bible

A built-in Bible reader so members never have to leave the platform, allowing references from Bible Study, Hymn Book, FS, and devotionals to resolve seamlessly.

- **BIB-001:** Search Scripture by keyword and reference (book, chapter, verse).
- **BIB-002:** Browse by book and chapter.
- **BIB-003:** Opening a reference lands directly on that passage.
- **BIB-004:** Available offline once downloaded.

---

## 13.3 Hymn Book

Digital access to **Song of Praise (SOP)**. Must be fast, lightweight, searchable, faithful to the physical book, and fully usable offline for live services.

- **HB-FUNC-003:** Direct number entry opens the hymn instantly.
- **HB-FUNC-005:** Hymn numbers exactly match the physical Song of Praise book.
- **Today's Service:** Publicity Coordinator can select hymns for a service, surfaced prominently on the member view.

---

## 13.4 Daily Devotional

Auto-publishes daily devotionals uploaded in batches by an authorized coordinator. Tapping Daily Devotional opens today's entry; scripture references open the Bible pop-up reader.

---

## 13.5 Announcements

Official member-only communication channel replacing WhatsApp broadcasts.
- **Roles:** President, Publicity Coordinator, General Secretary.
- **Lifecycle:** Draft → (Scheduled | Published) → Expired → Archived.
- **Priority:** Normal, Important, Urgent (pins to top of feed).
- **Notifications:** In-app notifications generated unconditionally; push layered on top.

---

## 13.6 Events

Keeps members aware of fellowship activities and provides simple time-based reminders.
- **EVT-001:** Create event (name, date, time, location/description).
- **EVT-002:** Display upcoming events list.
- **EVT-003:** Simple pre-event reminders.
- **Non-goal:** No QR-code check-in or attendance tracking.

---

## 13.7 Notifications

In-app notification center that operates unconditionally for all members.
- **Channels:** In-app notifications (baseline guarantee), Push notifications (optional V1.1+ layer), Automatic reminders.
- **Preferences:** Per-category toggles; Urgent-priority in-app notifications are never suppressible.

---

## 13.8 Foundational School (FS)

Digital access to the FS Manual and cohort-based discipleship materials.
- **Head Role:** Vice President (VP).
- **Structure:** Cohort-based, semester-long program with smaller teaching groups.
- **Graduation Boundary:** Platform tracks reading progress only; graduation decisions remain human-led by leadership.
- **Manual Visibility:** VP controls whether manual is FS-student-only or visible to all members.

---

## 13.9 Digital Library (V1.1)

Central repository for spiritual books, discipleship materials, academic resources, and past questions.
- **Formats:** PDF and EPUB only.
- **Downloads:** Real device file downloads owned by the member.
- **Licensing:** Every item classified as ASF-owned, permission-granted, public-domain, openly-licensed, or external-reference-only.

---

## 13.10 Help & Suggestion Box (V1.1)

Private, category-based channel for members to submit questions, prayer requests, welfare needs, or feedback, routed directly to the relevant coordinator or pastoral lead.

---

## 13.11 Weekly Challenges (V2)

Simple weekly spiritual challenges (reading, prayer, reflection) marked complete by members.

---

## 13.12 Photo / Memory Calendar (V2)

Date-anchored fellowship photo gallery preserving institutional memory over time.

---

# 14. Cross-Module Integration

Module dependencies are explicit:
- **Bible** provides passage resolution for Bible Study, FS, Devotionals, and Hymns.
- **Shared Offline Sync Engine** built first on Hymn Book, then reused by Bible Study and FS.
- **Events** feeds schedule data for **Announcements'** automatic service reminders.
- **Notifications** serves as the universal delivery mechanism for all modules.

---

# 15. Content Management

**Code is built and maintained by the technical team; content is owned and managed by fellowship leaders.**
- **ADM-001:** Every content type has a non-technical management interface.
- **ADM-002:** Role-scoped access (e.g., Bible Study Coordinator only sees Bible Study tools).
- **Automatic Processing:** Auto-extraction tools assist but **never auto-publish**.
- **Archive-over-delete:** Retiring content moves to an archive state rather than permanent deletion.

---

# 16. Offline-First Requirements

- **Must work offline:** Bible, Bible Study, Hymn Book, FS Manual, Devotionals.
- **Cached for convenience:** Announcements, Events list.
- **Sync pattern:** Initial sync → Opportunistic background sync → Incremental delta updates → Manual refresh fallback.

---

# 17. Non-Functional Requirements

- **Usability:** Simple, intuitive navigation without training.
- **Mobile responsiveness:** Mobile-first PWA design for ordinary student smartphones.
- **Performance:** Instant loading for cached offline content.
- **Security & Privacy:** Database-level Row-Level Security (RLS) enforcement on all entities.

---

# 18. Security and Privacy

- **Auth:** Email magic links + optional Google OAuth; no passwords, no matric numbers.
- **RLS:** Every table guarded by Postgres Row-Level Security policy matching user role assignments.
- **Account Recovery:** In-person human verification with Publicity Coordinator.
- **Multi-person Approval:** 2-of-2 vote (President + Publicity Coordinator) exclusively for deleting published Bible Studies.
- **NDPA Compliance:** Privacy-by-default architecture; minimal data retention.

---

# 19. Technical Architecture Reference

- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions).
- **Frontend:** Next.js Progressive Web App (PWA) with Tailwind CSS.
- **Offline Store:** Client-side IndexedDB cache.
- **Archival Storage:** Google Drive for large static assets (Library).

---

# 20. MVP Definition and Release Roadmap

## MVP (V1) Build Scope
1. Auth (magic link), profiles, roles/RLS.
2. Admin Dashboard shell + role-scoped routing.
3. Shared Offline-Sync Engine.
4. Hymn Book (Song of Praise).
5. Bible reader & passage resolver.
6. Bible Study (manual structured entry).
7. Daily Devotional.
8. Announcements & Events with in-app notifications.
9. Bookmarks.
10. FS (Student + Teacher views, launch gated per cohort).

---

# 21. Development Phasing Reference

- **Phase 0:** Setup & ASF-owned infrastructure accounts.
- **Phase 1:** Auth, RLS, Admin Dashboard shell.
- **Phase 2:** Hymn Book + Offline Sync Engine.
- **Phase 3:** Bible + Bible Study (manual entry).
- **Phase 4:** Devotional, Announcements, Events, Notifications.
- **Phase 5:** Foundational School (FS).
- **Phase 6:** Beta / Hardening & QA.
- **Phase 7:** Public Website & Full Launch.

---

# 22. Testing and Launch Criteria

Launch blockers:
1. Security/permission bypass.
2. Data loss or corruption.
3. Full offline failure for core reading modules.
4. Coordinator unable to publish content without developer intervention.

---

# 23. Leadership and Technical Handover Requirements

- **Accounts belong to positions, not people:** Reassigning a role transfers permissions immediately.
- **Content persistence:** Historical content stays intact across executive transitions.
- **Infrastructure ownership:** All accounts (GitHub, Supabase, Domain, Email) must be organizationally owned by ASF from day one.

---

# 24. Success Metrics

- Active weekly members & return usage outside fellowship hours.
- Offline download adoption rates.
- Admin independence (updates published without developer help).
- Successful leadership handovers with zero data loss.

---

# 25. Risks and Considerations

- Scope creep managed via strict MVP boundaries.
- Single-person developer dependency mitigated via comprehensive documentation and organizational account ownership.
- Copyright risks managed via strict content licensing classification.

---

# 26. Consolidated Open Decisions and Questions

Key questions pending leadership decision:
1. Final role name for FS head (Vice President vs. FS Coordinator).
2. Bible translation licensing clearance.
3. Exact reduced Alumni access scope.
4. Final category routing for Help & Suggestion Box.

---

# 27. Cross-Document Conflicts and Gaps

1. **FS Head Role:** Resolved in favor of Vice President (VP).
2. **Deletion Approval:** Resolved as 2-of-2 vote (President + Publicity Coordinator).
3. **Bible Study Extraction:** Deferred past MVP in favor of manual structured entry.

---

# 28. Future Possibilities

- Mentorship matching & skills directory.
- Sermon/media audio & video archive.
- CGPA calculator & academic planner.
- Multi-branch ASF expansion.

---

# 29. Related Documents Index

- [`/ASF_BACKEND_SPECIFICATION_FINAL.md`](../ASF_BACKEND_SPECIFICATION_FINAL.md) — Backend Engineering Specification.
- [`/API_INTEGRATION.md`](../API_INTEGRATION.md) — Frontend API Integration Catalog.
- [`/ARCHITECTURE.md`](../ARCHITECTURE.md) — Frontend Architecture Blueprint.
- [`/ROUTES.md`](../ROUTES.md) — Frontend Routing & Access Guards.
- [`/DEVELOPMENT_TESTING.md`](../DEVELOPMENT_TESTING.md) — Developer Testing & Simulation Guide.
- [`/docs/README.md`](README.md) — Documentation Master Index.
