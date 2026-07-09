# Worked Example: Login Flow

## Goal

See how one real feature moves from frontend to backend.

## Frontend Start

The flow begins in:
- [Login.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/auth/Login.tsx)

This page:
- collects email and password
- calls the login API helper
- fetches the current user after login
- stores session state
- redirects based on role

## Frontend API Layer

The request helper lives in:
- [api.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts)

Important pieces:
- `authAPI.login(...)`
- `userAPI.getCurrentUser()`

## Backend Route

The backend receives login at:
- [auth.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/auth.py)

The route should stay fairly small:
- accept request data
- call service
- return response

## Backend Service

The real auth work is in:
- [auth_service.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/auth_service.py)

This is where credentials are checked and tokens are prepared.

## Security Layer

Token helpers live in:
- [security.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py)

This keeps token creation separate from route code.

## Why This Is Clean

- page handles UI
- API helper handles request details
- route handles HTTP
- service handles business logic
- security helper handles tokens

