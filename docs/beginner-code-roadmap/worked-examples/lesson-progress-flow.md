# Worked Example: Lesson Progress Flow

## Goal

See how lesson progress is tracked across the system.

## Frontend Trigger

The student lesson page is:
- [LessonView.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/LessonView.tsx)

This page:
- loads lesson details
- starts lesson progress
- updates lesson progress as the student uses the page

## Frontend API Calls

These helpers live in:
- [progressAPI](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L120-L125)

Important calls:
- `startLesson`
- `updateProgress`

## Backend Route

Progress routes live here:
- [progress.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/progress.py)

## Backend Service

Progress rules live here:
- [progress_service.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/progress_service.py)

This service is responsible for:
- creating progress records
- updating completion percentage
- tracking time spent
- calculating student dashboard stats
- updating levels and achievement-style summaries

## Why This Separation Helps

- page handles user interaction
- API helper handles request details
- route handles HTTP
- service handles progress rules
- model stores the progress data

