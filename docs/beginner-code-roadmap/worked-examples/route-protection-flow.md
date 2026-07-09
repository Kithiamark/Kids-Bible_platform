# Worked Example: Route Protection

## Goal

Understand how the app stops the wrong user from accessing the wrong screen.

## Frontend Protection

Frontend route protection is handled in:
- [ProtectedRoute](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx#L50-L62)

It checks:
- is the user authenticated
- if a role is required, does the user have that role

## Frontend State Source

It gets auth state from:
- [authStore.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts)

## Backend Protection

Backend route protection is handled using dependencies in:
- [security.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py)

Important pieces:
- `get_current_user`
- `get_current_student`
- `RoleChecker`
- `require_admin`
- `require_teacher`
- `require_parent`

## Why Both Frontend and Backend Matter

Frontend protection improves user experience.
Backend protection enforces real security.

If you only protect the frontend, someone can still call the backend directly.

## Good Test Ideas

- unauthenticated user blocked
- wrong role blocked
- correct role allowed
- student token rejected from user-only route

