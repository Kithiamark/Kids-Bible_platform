# Frontend Pages (By Role)

Pages are grouped by role under:
- [frontend/src/pages/](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/)

Route definitions live in:
- [App.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx#L71-L146)

## Auth Pages

Folder: [pages/auth/](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/auth/)

- Login (admin/teacher/parent): [Login.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/auth/Login.tsx)
  - Uses [authAPI.login](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L63-L72)
  - Fetches user profile via [userAPI.getCurrentUser](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L74-L80)
  - Saves session via [useAuthStore.setAuth](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts#L44-L53)
- Student login: [StudentLogin.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/auth/StudentLogin.tsx)
  - Uses [authAPI.studentLogin](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L63-L72)
  - Loads student profile via [studentAPI.getCurrentStudent](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L82-L91)
- Registration: [Register.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/auth/Register.tsx)

## Admin/Teacher Pages

Folder: [pages/admin/](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/)

Shell layout:
- [AdminLayout.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/layouts/AdminLayout.tsx)

Key pages:
- Dashboard: [Dashboard.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/Dashboard.tsx)
  - Pulls aggregates from multiple endpoints and renders charts (Recharts)
- Lessons:
  - List/manage: [LessonManagement.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/LessonManagement.tsx)
  - Edit: [LessonEdit.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/LessonEdit.tsx)
  - Preview: [LessonPreview.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/LessonPreview.tsx)
- Quizzes:
  - Manage: [QuizManagement.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/QuizManagement.tsx)
  - Edit: [QuizEdit.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/QuizEdit.tsx)
- Users: [UserManagement.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/UserManagement.tsx)
- Groups: [GroupManagement.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/GroupManagement.tsx)
- Chat moderation/management: [ChatManagement.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/admin/ChatManagement.tsx)

## Parent Pages

Folder: [pages/parent/](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/parent/)

Shell layout:
- [ParentLayout.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/layouts/ParentLayout.tsx)

Key pages:
- Dashboard: [Dashboard.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/parent/Dashboard.tsx)
- My children: [MyChildren.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/parent/MyChildren.tsx)
- Register child: [RegisterChild.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/parent/RegisterChild.tsx)
- Chat monitoring: [ChatMonitoring.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/parent/ChatMonitoring.tsx)
  - Uses [ChatWindow](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/components/chat/ChatWindow.tsx) in read-only mode
- Parent messages: [ParentMessages.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/parent/ParentMessages.tsx)

## Student Pages

Folder: [pages/student/](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/)

Shell layout:
- [StudentLayout.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/layouts/StudentLayout.tsx)

Key pages:
- Dashboard: [Dashboard.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/Dashboard.tsx)
- Lessons list: [Lessons.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/Lessons.tsx)
- Lesson view: [LessonView.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/LessonView.tsx)
  - Starts lesson progress via [progressAPI.startLesson](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L120-L125)
  - Updates progress via [progressAPI.updateProgress](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L120-L125)
- Quiz view: [QuizView.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/QuizView.tsx)
  - Starts attempt via [quizAPI.startQuiz](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L104-L118)
  - Submits answers via [quizAPI.submitQuiz](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L104-L118)
- Progress: [Progress.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/Progress.tsx)
- Chat: [Chat.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/pages/student/Chat.tsx)

