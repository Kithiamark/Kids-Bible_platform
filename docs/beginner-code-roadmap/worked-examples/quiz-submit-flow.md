# Worked Example: Quiz Submit Flow

## Goal

Understand a real business-logic-heavy flow.

## Frontend

Student quiz UI lives here:
- [QuizView.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/QuizView.tsx)

The API helper used for submit lives here:
- [quizAPI.submitQuiz](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L104-L118)

## Backend Route

Quiz endpoints live here:
- [quizzes.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/quizzes.py)

The route’s job is to:
- accept the request
- ensure student auth is present
- call service logic
- return response

## Service Logic

Most of the important logic is here:
- [QuizService.submit_quiz](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py#L126-L211)

This service:
- loads the attempt
- checks completion status
- loads quiz questions
- compares answers
- calculates total points and score
- marks attempt complete
- updates student points if passed
- builds response data

## Why This Belongs In a Service

This flow has many steps and touches many records.

If all of that lived inside the route file, the endpoint would become hard to read and harder to test.

## Good Test Cases For This Flow

- attempt exists and succeeds
- attempt not found
- attempt already completed
- wrong quiz id submitted
- passing score awards points
- failing score does not award points

