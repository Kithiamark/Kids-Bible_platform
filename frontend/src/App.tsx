import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import ParentLayout from './layouts/ParentLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentLogin from './pages/auth/StudentLogin';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import LessonManagement from './pages/admin/LessonManagement';
import LessonEdit from './pages/admin/LessonEdit';
import LessonPreview from './pages/admin/LessonPreview';
import QuizManagement from './pages/admin/QuizManagement';
import QuizEdit from './pages/admin/QuizEdit';
import UserManagement from './pages/admin/UserManagement';
import GroupManagement from './pages/admin/GroupManagement';
import ChatManagement from './pages/admin/ChatManagement';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentLessons from './pages/student/Lessons';
import LessonView from './pages/student/LessonView';
import QuizView from './pages/student/QuizView';
import StudentProgress from './pages/student/Progress';
import StudentChat from './pages/student/Chat';

import ParentDashboard from './pages/parent/Dashboard';
import MyChildren from './pages/parent/MyChildren';
import RegisterChild from './pages/parent/RegisterChild';
import ChatMonitoring from './pages/parent/ChatMonitoring';
import ParentMessages from './pages/parent/ParentMessages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-login" element={<StudentLogin />} />

          {/* Admin/Teacher Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole={['admin', 'teacher']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="lessons" element={<LessonManagement />} />
            <Route path="lessons/:id/edit" element={<LessonEdit />} />
            <Route path="lessons/:id/preview" element={<LessonPreview />} />
            <Route path="quizzes" element={<QuizManagement />} />
            <Route path="quizzes/:id/edit" element={<QuizEdit />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="groups" element={<GroupManagement />} />
            <Route path="chat" element={<ChatManagement />} />
          </Route>

          {/* Parent Routes */}
          <Route
            path="/parent/*"
            element={
              <ProtectedRoute requiredRole={['parent']}>
                <ParentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ParentDashboard />} />
            <Route path="children" element={<MyChildren />} />
            <Route path="register-child" element={<RegisterChild />} />
            <Route path="chat-monitoring" element={<ChatMonitoring />} />
            <Route path="messages" element={<ParentMessages />} />
          </Route>

          {/* Student Routes */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute requiredRole={['student', 'parent']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="lessons" element={<StudentLessons />} />
            <Route path="lessons/:id" element={<LessonView />} />
            <Route path="quiz/:id" element={<QuizView />} />
            <Route path="progress" element={<StudentProgress />} />
            <Route path="chat" element={<StudentChat />} />
          </Route>

          {/* Root redirect based on role */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                user?.role === 'admin' || user?.role === 'teacher' ? (
                  <Navigate to="/admin" replace />
                ) : user?.role === 'parent' ? (
                  <Navigate to="/parent" replace />
                ) : (
                  <Navigate to="/student" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
