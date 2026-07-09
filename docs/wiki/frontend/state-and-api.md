# Frontend State and API Client

The frontend has two primary “data planes”:

- Session/auth state stored in Zustand (persisted) under [authStore.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts)
- Backend communication via Axios under [api.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts)

## Auth Store (Zustand)

File: [authStore.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts)

State:
- `user`: currently logged-in identity (admin/teacher/parent/student)
- `student`: populated for student sessions (used for theming and student-specific UI)
- `accessToken` and `refreshToken` mirrored in both store state and localStorage
- `isAuthenticated` boolean

Key actions:
- `setAuth`: writes tokens to localStorage and marks session authenticated:
  - [setAuth implementation](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts#L44-L53)
- `logout`: clears localStorage and resets state:
  - [logout implementation](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts#L59-L69)
- `updateUser` / `updateStudent`: partial updates:
  - [updateUser](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts#L71-L75)
  - [updateStudent](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts#L77-L81)

Persistence:
- Store uses `zustand/middleware/persist` with name `auth-storage`:
  - [persist config](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts#L35-L86)

## API Client (Axios)

File: [lib/api.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts)

Base URL:
- Uses `import.meta.env.VITE_API_BASE_URL`, defaulting to `http://localhost:8000/api/v1`:
  - [API_BASE_URL](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L3-L4)

Auth header injection:
- Request interceptor reads `access_token` from localStorage and sets the `Authorization` header:
  - [request interceptor](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L39-L45)

401 handling:
- Response interceptor clears tokens when backend returns 401:
  - [response interceptor](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L47-L56)

Query param normalization:
- Removes `undefined`, `null`, and empty strings before sending:
  - [compactParams](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L58-L62)

## API Modules (Endpoints)

The repo exposes domain-specific API modules, all implemented in [api.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts):

- Auth: `authAPI` ([authAPI](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L63-L72))
- Users: `userAPI` ([userAPI](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L74-L80))
- Students: `studentAPI` ([studentAPI](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L82-L91))
- Lessons: `lessonAPI` ([lessonAPI](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L93-L102))
- Quizzes: `quizAPI` ([quizAPI](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L104-L118))
- Progress: `progressAPI` ([progressAPI](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L120-L125))
- Chat: `chatAPI` ([chatAPI](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L127-L142))
- Groups: `groupAPI` ([groupAPI](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L144-L163))

## Auth Flows (Frontend Perspective)

User login and redirect logic is implemented in pages:
- Staff/parent login: [pages/auth/Login.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/auth/Login.tsx)
- Student login: [pages/auth/StudentLogin.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/auth/StudentLogin.tsx)

Route gating:
- [ProtectedRoute](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx#L50-L62)

