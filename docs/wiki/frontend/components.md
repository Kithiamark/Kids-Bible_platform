# Frontend Shared Components

Shared components live under:
- [frontend/src/components/](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/components/)

## ChatWindow

File: [components/chat/ChatWindow.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/components/chat/ChatWindow.tsx)

Responsibilities:
- Fetch and render group messages (polling via React Query)
- Send messages (mutations via API client)
- Support moderation actions (flag, delete, moderation update) depending on props
- Support read-only mode for parent monitoring

Backend dependencies:
- Group messages: backend chat endpoints in [api/v1/chat.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/chat.py)
- Groups/Direct chats: [api/v1/groups.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/groups.py)

Frontend dependencies:
- API client: [chatAPI](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L127-L142)

## MediaPlayer

File: [components/MediaPlayer.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/components/MediaPlayer.tsx)

Responsibilities:
- Render media items attached to lessons:
  - YouTube embeds (via `react-youtube`)
  - Spotify embeds (iframe)
  - Generic audio playback

Backend dependency:
- Lesson media is stored under `LessonMedia` in [models/lesson.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/lesson.py)

## Student Theme Helpers

File: [lib/theme.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/theme.ts)

Responsibilities:
- Define theme palettes keyed by `age_group`
- Provide `useStudentTheme()` hook that maps stored student profile to a theme

Used by:
- Student UI pages and parent monitoring pages (e.g. [ChatMonitoring.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/parent/ChatMonitoring.tsx))

