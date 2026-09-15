# ASF Digital Platform — UX Flow & Interaction Specification

**Target Platform:** Mobile-First Responsive PWA & Desktop Web
**Design System Rules:** Accessible contrast, clear hierarchy, zero promotional jargon, generous tap targets (44px min).

---

## 1. User Journey & Experience Maps

### 1.1 First-Time Member Onboarding (Magic Link)
```
Member enters Email or Phone
        │
        ▼
Receives Magic Link in Inbox
        │
        ▼
Clicks Link → Lands on Welcome Screen
        │
        ▼
Quick Profile Setup (Name, Department, Level, Unit)
        │
        ▼
Personalized Member Dashboard
```

### 1.2 Bible Study Tuesday Fellowship Flow
```
Open App (Online or Offline)
        │
        ▼
Dashboard highlights "Today's Bible Study" (Tuesday logic)
        │
        ▼
Taps "Read Today's Study" → Opens structured study
        │
        ▼
Member encounters Scripture Reference (e.g. "James 2:14")
        │
        ▼
Taps Reference → Scripture Drawer/Modal opens passage in context
        │
        ▼
Member reads passage → Closes modal → Returns to exact scroll position
```

### 1.3 Sunday Hymn Lookup Flow
```
Member enters Hymn Number (e.g. "245") or Title search
        │
        ▼
Instant live filter on local Hymnal dataset (<20ms)
        │
        ▼
Full hymn view with formatted stanzas and chorus
        │
        ▼
Optional: Bookmark hymn for service
```

---

## 2. Navigation Architecture

```
Member Navigation (Bottom Bar / Sidebar):
├── 🏠 Home (Devotional, Today's Study, Next Meeting, Announcements)
├── 📖 Bible (Multi-Version Reader, Search, Book/Chapter Selector)
├── 📚 Bible Study (Current, Archive, Semester Calendar, Outline)
├── 🎵 Hymns (Search by #/title/lyrics, Service Collections)
├── 🏫 Foundation School (Lessons, Progress, Teacher Studio - role gated)
└── 👤 Profile (Personal Notes, Bookmarks, Settings, Sign Out)
```

---

## 3. Key Interaction & Offline State Patterns

| Screen / State | Online Behavior | Offline Behavior |
|---|---|---|
| **Bible Study** | Reads latest published version, checks for updates | Reads locally cached study seamlessly with subtle offline pill |
| **Scripture Links** | Resolves verse in built-in reader | Resolves verse from local downloaded Bible version |
| **Personal Notes** | Saves note and syncs to cloud | Saves note locally in IndexedDB; queues for background sync |
| **Hymn Search** | Real-time search across local catalog | 100% full search functionality over local catalog |
| **Announcements** | Displays live feed with badges | Displays last cached feed with last-sync timestamp |
