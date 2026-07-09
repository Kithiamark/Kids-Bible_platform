# How To Structure Code

One of the biggest beginner questions is:

- "Where does this code go?"

That question matters because messy code usually comes from putting the right logic in the wrong place.

## The Main Idea

Do not organize code by what you were thinking at the moment.

Organize code by responsibility.

That means:
- each file has a clear purpose
- each folder solves a specific kind of problem
- logic is placed where someone would expect to find it

## Backend: What Goes Where

Backend folders in this repo:
- [api/v1/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/)
- [services/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/)
- [models/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/)
- [schemas/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/)
- [core/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/)

### `api/`

Put code here when the job is:
- receive an HTTP request
- read path/query/body data
- call auth dependencies
- call a service or perform light CRUD
- return a response

Do not put here:
- long business logic
- scoring systems
- multi-step workflows
- complex calculations

Example:
- [quizzes.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/quizzes.py)

### `services/`

Put code here when the job is:
- perform business logic
- apply rules
- coordinate multiple steps
- touch multiple models/tables
- keep router files small

Do not put here:
- route decorators
- request parsing
- UI logic

Example:
- [quiz_service.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py)

### `models/`

Put code here when the job is:
- describe database tables
- define relationships
- define enum-backed stored values

Do not put here:
- HTTP concerns
- request validation shapes
- UI formatting

Examples:
- [user.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/user.py)
- [quiz.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/quiz.py)

### `schemas/`

Put code here when the job is:
- define what data is allowed in or out
- validate request bodies
- shape response JSON

Do not put here:
- DB queries
- side effects
- HTTP decorators

Examples:
- [quiz.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/quiz.py)
- [auth.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/auth.py)

### `core/`

Put code here when the job is:
- app-wide configuration
- DB setup
- authentication
- shared infrastructure

Examples:
- [config.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/config.py)
- [database.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/database.py)
- [security.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py)

## Frontend: What Goes Where

Frontend folders in this repo:
- [pages/](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/)
- [components/](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/components/)
- [layouts/](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/layouts/)
- [store/](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/)
- [lib/](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/)

### `pages/`

Put code here when the job is:
- represent a route or screen
- fetch page data
- connect UI pieces together

Do not put here:
- reusable generic UI pieces
- app-wide utility logic

Examples:
- [student/LessonView.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/LessonView.tsx)
- [admin/Dashboard.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/Dashboard.tsx)

### `components/`

Put code here when the job is:
- build reusable UI
- display a focused part of a screen

Examples:
- [ChatWindow.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/components/chat/ChatWindow.tsx)
- [MediaPlayer.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/components/MediaPlayer.tsx)

### `layouts/`

Put code here when the job is:
- provide shared page shell
- define navigation/sidebar/topbar around nested pages

Examples:
- [AdminLayout.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/layouts/AdminLayout.tsx)
- [StudentLayout.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/layouts/StudentLayout.tsx)

### `store/`

Put code here when the job is:
- manage client-side state used across many places
- store session/auth state

Example:
- [authStore.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts)

### `lib/`

Put code here when the job is:
- provide shared utilities
- define API client wrappers
- centralize helper logic

Examples:
- [api.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts)
- [theme.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/theme.ts)

## Quick Placement Rules

If you are unsure, ask:

- Is this about HTTP? Put it in `api`.
- Is this a business rule? Put it in `services`.
- Is this DB shape? Put it in `models`.
- Is this input/output shape? Put it in `schemas`.
- Is this page-level UI? Put it in `pages`.
- Is this reusable UI? Put it in `components`.
- Is this shared client state? Put it in `store`.
- Is this general helper logic? Put it in `lib` or `core`.

## Beginner Mistakes To Avoid

- putting calculations directly in route handlers
- putting API calls inside reusable UI without a good reason
- putting DB logic inside schemas
- putting reusable logic inside a single page file
- creating giant files that do everything

## A Good Workflow Before Writing Code

Before you type, write this:

1. what should happen
2. what data comes in
3. what data goes out
4. what folder owns this responsibility
5. what needs testing

That one-minute habit will improve your code structure a lot.

