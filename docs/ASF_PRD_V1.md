# ASF Digital Platform — Product Requirements Document (PRD) v1.0

**Document Owner:** ASF Technical & Product Leadership
**Target Audience:** Engineering, Product, UI/UX, Fellowship Executives
**Target Release:** MVP / v1.0

---

## 1. Product Vision & Executive Summary

The **Anglican Students' Fellowship (ASF), FUTA Chapter** is a vibrant campus ministry with hundreds of students engaging across spiritual, academic, and fellowship activities.

Currently, fellowship resources are fragmented across physical manuals, WhatsApp groups, printed announcements, and personal notebooks. The **ASF Digital Platform** provides a single, unified, offline-first digital home for the fellowship.

### Core Value Propositions
1. **Spiritual Continuity:** Never miss a Bible study or hymn, even when disconnected from the internet.
2. **Accessible Resources:** Digitize decades of fellowship literature, past examination questions, and study manuals.
3. **Decentralized Administration:** Allow individual coordinators (Bible Study, Publicity, Foundation School) to manage their content autonomously without technical bottlenecks.
4. **Member-First Experience:** Zero password friction, respectful privacy, and personalized spiritual tools.

---

## 2. Personas & Target Users

### 👤 1. Active Member (Student)
- Needs quick access to today's Bible Study during Tuesday fellowship.
- Needs the Hymn Book during Sunday worship.
- Wants to download departmental past questions during exam season.

### 👤 2. Bible Study Coordinator
- Uploads and formats semester Bible Study outlines.
- Reviews extracted scripture references before publication.
- Corrects typos or text post-publication.

### 👤 3. Foundation School (FS) Student & Teacher
- Student: reads assigned lesson modules, tracks syllabus progress.
- Teacher: accesses class roster, monitors assigned cohort.

### 👤 4. Publicity Coordinator & President
- Publishes fellowship-wide announcements and event schedules.
- Approves critical content lifecycle changes.

---

## 3. Core Feature Requirements

### 3.1 Authentication & Profile
- **Passwordless Magic-Link Auth:** Fast, secure login via email or phone token.
- **Member Profile:** Academic department, level, unit, and contact preferences.

### 3.2 Bible Study Module
- Structured lesson reader (Aim, Intro, Study Guide, Conclusion, Prayer).
- Automatic detection of Scripture citations (e.g. `Romans 8:28`) linked to built-in Bible reader.
- Tuesday-aware calendar navigation (Current, Archive, Search).
- Offline-ready local database synchronization.

### 3.3 Bible Reader
- Built-in multi-version reader (KJV default, NIV, NKJV).
- Verse-by-verse view, chapter selector, and search.
- Seamless modal popup when triggered from Bible Study.

### 3.4 Hymn Book
- Searchable directory of 600+ Anglican hymns by number, title, or lyric snippet.
- Service selection tool for choir and service leaders.

### 3.5 Daily Devotionals
- Pre-scheduled daily readings with memory verses and prayers.
- Automated date matching.

### 3.6 Announcements & Events
- Fellowship newsfeed with audience filters (`General`, `FS Only`).
- Upcoming fellowship meetings and academic milestones.

### 3.7 Foundation School (FS) Portal
- Role-gated module for enrolled students and assigned teachers.
- Structured curriculum with progressive unlocking.

### 3.8 Personal Spiritual Tools (Private)
- Personal notes attached to studies or verses.
- Scripture highlighting and bookmarking.

### 3.9 Academic Hub (V1.1)
- Departmental past questions archive.
- Semester GPA/CGPA estimator.

---

## 4. Non-Functional Requirements

| Dimension | Requirement |
|---|---|
| **Performance** | Initial load under 1.5s; cached content renders in <50ms. |
| **Offline Capability** | 100% reading functionality for cached Bible, Studies, and Hymns without data. |
| **Security** | Row-Level Security on all database tables; zero cross-member private note access. |
| **Responsiveness** | Mobile-first viewport optimization (320px to 1440px+). |
| **Accessibility** | High-contrast typography, adjustable font sizes, dark mode support. |
