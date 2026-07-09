# Frontend Overview (React + Vite)

Frontend code lives under [frontend/](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/), with application code in [frontend/src/](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/).

## Stack

Declared dependencies:
- [frontend/package.json](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/package.json)

Core libraries used in the app:
- Routing: `react-router-dom`
- Server state: `@tanstack/react-query`
- HTTP: `axios`
- Client state: `zustand` (auth/session)
- UI: Tailwind CSS + Framer Motion + Recharts + lucide-react

## Entry Point

- App mount: [main.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/main.tsx)
- Route definitions and top-level providers: [App.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx)

Providers:
- React Query: [QueryClientProvider](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx#L41-L49) wraps the router.
- Toast notifications: [Toaster](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx#L68-L71).

## Project Structure (frontend/src)

- `layouts/`: route shells with navigation and `<Outlet />` rendering
- `pages/`: route endpoints grouped by role (admin, parent, student, auth)
- `components/`: reusable UI building blocks (chat window, media player, etc.)
- `lib/`: API client (`api.ts`), theme helpers, and other utilities
- `store/`: Zustand stores (authStore)

## Role-Based UX

The frontend organizes the experience into three main route trees:
- `/admin/*`: Admin and teacher tooling
- `/parent/*`: Parent dashboard and monitoring
- `/student/*`: Student learning experience

The role redirect logic is implemented in [App.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx#L130-L146).

