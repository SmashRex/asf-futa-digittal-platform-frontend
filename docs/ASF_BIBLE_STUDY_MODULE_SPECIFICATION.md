# ASF Digital Platform — Bible Study Module Specification

**Document type:** Feature / Module Functional Specification (not a PRD, not a TRD, not a database design)
**Parent document:** ASF Digital Platform — Product Requirements Document (PRD), §12.2 (BS)
**Source material:** ASF PRD v1.0 (Draft); full brainstorming conversation between Smash and the design AI
**Audience:** UI/UX designer, frontend developer, backend developer, QA engineer, future ASF technical/content team
**Status:** Draft — contains open DECISION REQUIRED items that must be resolved by ASF leadership/content owners before final build

---

## 1. Module Overview

The Bible Study module is the digital replacement for ASF's physical Bible Study manual. Its job is not to display a document — it is to turn the manual into structured, searchable, interactive content that works whether or not the member has internet access.

The module's guiding principle, carried directly from the PRD (§12.2) and the brainstorming conversation: this is **not** "upload PDF → display PDF." It is "convert the Bible Study material into structured, searchable, interactive, and mostly offline digital content."

The module preserves everything that already works about the physical manual (its structure, its weekly rhythm, its content) while improving the experience through:

- Clickable Bible references that resolve inside the platform's own Bible reader
- A searchable archive of every past study, not just the current one
- Offline reading once content has been synchronized
- Personal tools — bookmarks, notes, highlights, reading progress — that sit on top of the official content without altering it
- A foundation for future study aids (commentary, verse comparison) without committing to them now

This is one of the platform's most-used modules and is part of the MVP (PRD §18).

---

## 2. Module Goals

- Every member can find "this week's" Bible Study without searching.
- Every member can find any past Bible Study, turning the platform into a permanent archive rather than a disposable weekly handout.
- Every Bible reference in a study is one tap away from being read, in context, without leaving the flow of study.
- The module works fully offline once a member has been online at least once since the last update.
- A non-technical Bible Study Coordinator can publish a new study, and correct a published study, without developer involvement.
- Official published content stays under human (administrator) control — automatic extraction assists but never auto-publishes.
- Destructive actions against published content are protected against accidental or unilateral loss.

**Non-goals for this specification:** database schema, system architecture, hosting/infrastructure choices, Bible-text data source implementation. These belong to a future TRD.

---

## 3. User Types

Aligned to the roles defined in PRD §8.2:

| User type | Relationship to this module |
|---|---|
| **Unauthenticated Visitor** | May read Bible Study content where the platform allows public reading (see §23 Open Decisions). Cannot use personal features. |
| **General Member** | Full reading access; personal tools (notes, highlights, bookmarks, progress) once authenticated. |
| **Bible Study Coordinator** | Uploads, reviews, corrects, and publishes Bible Study content. Manages the archive. This is the module's primary content owner. |
| **President** | Content oversight; participant in the multi-person approval workflow for sensitive deletion/archiving (§26); can monitor module status without needing backend access. |
| **Publicity Coordinator** | Participant in the multi-person approval workflow for sensitive deletion/archiving (§26); can monitor module status. |
| **Technical Administrator** | Technical maintenance only — does not have content-authority over Bible Study by default (per PRD §8.2's separation of technical and content roles). |

---

## 4. Module Navigation

- **Primary entry point:** the platform dashboard/home surfaces the current/most relevant Bible Study directly (PRD §11), so a member reaches it in one tap from login.
- **Module entry point:** a dedicated "Bible Study" section in the member platform's main navigation.
- **Deep-link entry points:** a Bible reference tapped anywhere else in the platform (Hymn Book, devotionals) may open the Bible reader directly; conversely, the Bible reader should offer a way back to whichever Bible Study screen launched it.
- Within the module: Home (current/relevant study) → Calendar/Archive → Search → Individual study reader → Bible reader (via reference tap) → My Notes (future cross-module).

---

## 5. Bible Study Home

**BS-FUNC-001 — Home screen content.** On opening the module, the member sees:
- The relevant date label (see §6 for logic)
- Theme (semester/manual-level theme)
- Topic (this week's topic)
- Text (the primary Bible passage(s) for this study)
- A primary action: **Read Today's Study** / **Read This Study**
- Secondary navigation to: Other Studies / Archive, Calendar, Search

**States to design for:**
- Loaded, study available
- Empty (no study published yet for the relevant date)
- Loading (skeleton/placeholder)
- Offline, content cached
- Offline, content not cached

---

## 6. Date & Calendar Logic

**BS-FUNC-002 — Weekly schedule awareness.** Bible Study occurs weekly on **Tuesdays**. The module must reason in weeks, not days, and must not default to "today" as the label for content that isn't actually today's.

**Date-selection logic (using the device/current date):**
1. **If today is Tuesday and a study exists for today's date** → label as **"Today"**, show today's date, and treat it as the current/default study.
2. **If today is not Tuesday** → determine the most recent past Tuesday with a published study and the next upcoming Tuesday:
   - If the most recent past study is closer/more relevant, label it appropriately (e.g., **"Most Recent Bible Study — Tuesday, [date]"**).
   - Always also surface the next upcoming study as **"Upcoming Bible Study — Tuesday, [date]"**.
3. **Never label every date "Today's Bible Study."**

**BS-FUNC-003 — Calendar/date navigation.** A calendar view must let the member view by month, distinguish dates with studies, navigate past semesters, and open any study directly.

---

## 7. Bible Study Content Structure

**BS-CONTENT-001 — Flexible content model.** Core sections (expected in nearly every study):
- Theme, Topic, Text, Memory Verse, Aim, Introduction, Study Guide, Conclusion, Prayer.

Optional/custom sections:
- Additional explanations, Discussion questions, Activities, Further reading, Custom sections.

---

## 8. Digital Reading Experience & Reference Linking

**BS-BIBLE-001 — Detection.** Bible references appearing in Study Guide, Text, Memory Verse, and any other content block are automatically detected and rendered as interactive elements.
**BS-BIBLE-002 — Tap behavior.** Tapping a reference opens the platform's internal Bible reader directly at that passage.
**BS-BIBLE-003 — Return path.** Tapping back returns to the exact scroll position in the Bible Study entry.
**BS-BIBLE-004 — Multiple references.** Each reference resolves independently.
**BS-BIBLE-005 — Unresolved references.** Plain text fallback if non-standard or unparsed.

---

## 9. Bible Versions & Offline Support

**BS-BIBLE-006 — Version support.** Multi-version capability (KJV, NIV, NKJV, NLT, AMP) subject to licensing clearance.
**BS-OFF-001 — Offline Bible.** Downloaded versions function entirely offline with search and chapter navigation.
**BS-OFF-002 — Bundling.** At least one version preloaded.
**BS-OFF-003 — Automatic sync.** Bible Study materials sync automatically on connectivity without manual file downloads.

---

## 10. Search & Archive

**BS-FUNC-004 — Search.** Topic, theme, date, scripture reference, and full-text keyword search across local and archived studies.
**BS-FUNC-005 — Archive access.** Historical studies organized by Semester and Year. Retained permanently.

---

## 11. Personal Study Tools

Authenticated members only (private):
- **Highlighter** (BS-FUNC-006)
- **Bookmarks** (BS-FUNC-007)
- **Reading Progress** (BS-FUNC-008)
- **Personal Notes** (BS-FUNC-009)

---

## 12. Administration & Content Publishing

- **Upload workflow (BS-ADMIN-001):** Coordinator uploads PDF/manual → parsing pipeline extracts structure.
- **Human review gate (BS-ADMIN-003):** Extracted content is reviewed and validated before publishing. Never auto-publishes.
- **Post-publish edits (BS-CONTENT-003):** Inline corrections sync to client devices on next connection.
- **Deletion governance (BS-SEC-001):** Permanent deletion requires multi-person approval (President, Publicity, Bible Study Coordinator).

---

## 13. Acceptance Criteria & MVP Scope

- Correct weekly Tuesday relative dating.
- Offline readability after initial sync.
- Interactive Scripture references opening the built-in Bible reader with position preservation.
- Functional Coordinator upload and review workflow.
- Complete private notes, highlights, and bookmark tools for members.
