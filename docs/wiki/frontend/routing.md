# Frontend Routing and Layouts

Routes are defined in [App.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx).

## ProtectedRoute (Auth + RBAC Gate)

Implementation:
- [ProtectedRoute](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx#L50-L62)

Behavior:
- If not authenticated, redirects to `/login`.
- If `requiredRole` is provided and the user role is not included, redirects to `/`.

Auth state source:
- [useAuthStore](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts#L35-L87)

## Route Map

### Public Routes

- `/login`: [pages/auth/Login.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/auth/Login.tsx)
- `/register`: [pages/auth/Register.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/auth/Register.tsx)
- `/student-login`: [pages/auth/StudentLogin.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/auth/StudentLogin.tsx)

### Admin/Teacher Routes: `/admin/*`

Shell:
- [AdminLayout](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/layouts/AdminLayout.tsx)

Protected by:
- `requiredRole={['admin', 'teacher']}` ([App.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx#L77-L95))

Pages:
- `/admin`: [pages/admin/Dashboard.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/Dashboard.tsx)
- `/admin/lessons`: [LessonManagement.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/LessonManagement.tsx)
- `/admin/lessons/:id/edit`: [LessonEdit.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/LessonEdit.tsx)
- `/admin/lessons/:id/preview`: [LessonPreview.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/LessonPreview.tsx)
- `/admin/quizzes`: [QuizManagement.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/QuizManagement.tsx)
- `/admin/quizzes/:id/edit`: [QuizEdit.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/QuizEdit.tsx)
- `/admin/users`: [UserManagement.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/UserManagement.tsx)
- `/admin/groups`: [GroupManagement.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/GroupManagement.tsx)
- `/admin/chat`: [ChatManagement.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/ChatManagement.tsx)

### Parent Routes: `/parent/*`

Shell:
- [ParentLayout](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/layouts/ParentLayout.tsx)

Protected by:
- `requiredRole={['parent']}` ([App.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx#L97-L111))

Pages:
- `/parent`: [pages/parent/Dashboard.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/parent/Dashboard.tsx)
- `/parent/children`: [MyChildren.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/parent/MyChildren.tsx)
- `/parent/register-child`: [RegisterChild.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/parent/RegisterChild.tsx)
- `/parent/chat-monitoring`: [ChatMonitoring.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/parent/ChatMonitoring.tsx)
- `/parent/messages`: [ParentMessages.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/parent/ParentMessages.tsx)

### Student Routes: `/student/*`

Shell:
- [StudentLayout](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/layouts/StudentLayout.tsx)

Protected by:
- `requiredRole={['student', 'parent']}` ([App.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx#L113-L128))

Pages:
- `/student`: [pages/student/Dashboard.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/Dashboard.tsx)
- `/student/lessons`: [Lessons.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/Lessons.tsx)
- `/student/lessons/:id`: [LessonView.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/LessonView.tsx)
- `/student/quiz/:id`: [QuizView.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/QuizView.tsx)
- `/student/progress`: [Progress.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/Progress.tsx)
- `/student/chat`: [Chat.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/Chat.tsx)

## Root Redirect

The `/` route redirects based on the authenticated user’s role:
- [role redirect logic](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx#L130-L146)

