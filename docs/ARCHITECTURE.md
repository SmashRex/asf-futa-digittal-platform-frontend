# ASF Events & Portal — Production Frontend Architecture

## 1. Overview
The **ASF Events & Portal** frontend is engineered as a clean, modular, service-oriented Single Page Application (SPA) built with React 18, TypeScript, Vite, and Tailwind CSS.

The application follows strict architectural separation of concerns:
- **`src/types/`**: Domain models, entity contracts, and status enums.
- **`src/config/`**: App-wide constants, feature flags, API base paths, image fallbacks, and route paths.
- **`src/content/`**: Static text content, copy, and UI strings isolated from visual components.
- **`src/services/`**: Abstracted service interfaces (`ApiClient`, `eventsService`, `authService`, `remindersService`, `contentService`, `usersService`) with clean mock/real API toggles.
- **`src/auth/`**: Role-based access control policies (`permissions.ts`).
- **`src/routes/`**: Declarative route configurations and RouteGuard wrappers.
- **`src/dev/`**: Isolated development drawer, simulation state store (`devState.ts`), and testing utilities.

---

## 2. Directory Structure

```
/src
  ├── auth/                  # Access controls & permission policies
  │   └── permissions.ts
  ├── components/            # Visual UI components
  │   ├── admin/             # Administrative platform components
  │   ├── common/            # Shared reusable UI (ImageWithFallback, EmptyState, OfflineBanner, LoadingState)
  │   └── events/            # Events module UI (EventCard, EventHero, EventMeta, EventReminderModal)
  ├── config/                # Centralized environment & app settings
  │   ├── api.config.ts
  │   ├── app.config.ts
  │   ├── media.config.ts
  │   └── routes.config.ts
  ├── content/               # Isolated textual content & UI strings
  │   ├── announcements-content.ts
  │   ├── events-content.ts
  │   └── site-content.ts
  ├── data/                  # Static prebundled dataset (fallback & offline cache)
  │   └── eventData.ts
  ├── dev/                   # Isolated simulation & dev tools
  │   ├── DevToolsDrawer.tsx
  │   └── simulations/
  │       └── devState.ts
  ├── routes/                # Route guards and declarative definitions
  │   ├── RouteGuard.tsx
  │   └── index.ts
  ├── screens/               # Screen views / page containers
  │   ├── admin/             # Admin console modules
  │   ├── public/            # Public website
  │   ├── AnnouncementDetail.tsx
  │   , AnnouncementHome.tsx
  │   , EventDetail.tsx
  │   , EventHome.tsx
  │   , EventSchedule.tsx
  │   , FSHome.tsx
  │   , FSMaterials.tsx
  │   , SignIn.tsx
  │   , Welcome.tsx
  │   └── WelcomeBack.tsx
  ├── services/              # Clean API abstraction & data services
  │   ├── api/               # Generic API client (`client.ts`)
  │   ├── auth/              # Authentication service (`auth.service.ts`)
  │   ├── content/           # Editorial content service (`content.service.ts`)
  │   ├── events/            # Event management service (`events.service.ts`)
  │   ├── reminders/         # Reminders persistence service (`reminders.service.ts`)
  │   └── users/             # User management service (`users.service.ts`)
  └── types/                 # Centralized TypeScript definitions
      ├── event.ts
      ├── index.ts
      ├── reminder.ts
      ├── role.ts
      └── user.ts
```

---

## 3. Data Flow Architecture

1. **User Action / UI Render** → React Component (e.g., `EventHome`) calls Service method (e.g., `eventsService.getEvents()`).
2. **Service Layer** → Inspects `APP_CONFIG.features.useMockServices` and `isOfflineSimulated` from `devState`.
3. **HTTP / Mock Adapter** → If mock mode is active, returns formatted data from prebundled dataset. If mock mode is false, executes clean HTTP requests via `ApiClient`.
4. **State Update** → UI updates reactively using domain types from `/src/types/`.

---

## 4. Auth & Role-Based Access Control
- Supported Roles: `Guest`, `Member`, `Executive`, `Publicity Coordinator`, `President / Executive`, `System Administrator`.
- Permission evaluation handled by `hasPermission(role, permissionKey)` in `src/auth/permissions.ts`.
- Protected routes guarded by `RouteGuard` or `AdminRouteGuard`.
