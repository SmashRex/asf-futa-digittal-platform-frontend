# Development & Simulation Testing Guide

## Overview
This document describes how to use the isolated **Development & Simulation Tools** built into the ASF Events & Portal.

---

## 1. Isolation Architecture
All simulation mechanisms (role toggling, offline mode simulation, empty state testing, restricted access flags) are strictly isolated in `src/dev/` and `src/dev/simulations/devState.ts`.

- Production code does **NOT** import mock toggles inside business components.
- Component code subscribes to data via clean service abstractions (`eventsService`, `authService`).
- A floating **DevTools Drawer** is rendered globally in development mode.

---

## 2. Using the DevTools Drawer
To open the DevTools Drawer:
1. Click the floating **🛠️ Dev Tools** trigger button at the bottom-right of the screen.
2. The drawer slides open with controls for:
   - **Active Role Switcher**: Instantly switch between `Guest`, `Member`, `Executive`, `Publicity Coordinator`, `President / Executive`, and `System Administrator` to test RBAC and Admin UI without re-logging in.
   - **Simulated Offline Mode**: Toggle offline status to verify prebundled event caching, offline banners, and network fallback behavior.
   - **Simulated Empty State**: Toggle empty state to verify zero-data UI renders and reset handlers across feeds.
   - **Simulated Restricted Access**: Toggle FS restricted access to test permission boundary screens.
   - **Simulated Mock API Latency**: Adjust simulated API response delay (0ms to 2000ms) to test loading skeletons.

---

## 3. Restoring Production Settings
When building for production:
1. Set `APP_CONFIG.features.useMockServices = false` in `src/config/app.config.ts`.
2. The `DevToolsDrawer` can be disabled or stripped automatically via environment flags (`import.meta.env.DEV`).
