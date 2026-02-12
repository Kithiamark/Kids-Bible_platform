import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Home, BookOpen, TrendingUp, MessageSquare, LogOut, Award } from 'lucide-react';
import { useStudentTheme } from '../lib/theme';

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, logout } = useAuthStore();
  const theme = useStudentTheme();

  const handleLogout = () => {
    logout();
    navigate('/student-login');
  };

  const navItems = [
    { path: '/student', icon: Home, label: 'Dashboard' },
    { path: '/student/lessons', icon: BookOpen, label: 'Lessons' },
    { path: '/student/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/student/chat', icon: MessageSquare, label: 'Chat' },
  ];

  return (
    <div className={`min-h-screen ${theme.background} ${theme.font} transition-colors duration-300`}>
      {/* Top Bar */}
      <div className={`${theme.cardBg} shadow-sm sticky top-0 z-10 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">📖</div>
              <div>
                <h1 className={`text-xl font-bold ${theme.text}`}>
                  Kids Delight
                </h1>
                <p className={`text-xs ${theme.textSecondary}`}>Learning Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Level Badge */}
              <div className={`${theme.primary} text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-sm`}>
                <Award className="w-4 h-4" />
                <span className="font-semibold">Level {student?.current_level || 1}</span>
              </div>

              {/* Points Badge */}
              <div className={`${theme.secondary} text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-sm`}>
                <span className="text-lg">⭐</span>
                <span className="font-semibold">{student?.total_points || 0} pts</span>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                {student?.avatar_url ? (
                  <img
                    src={student.avatar_url}
                    alt={student.display_name}
                    className={`w-10 h-10 rounded-full border-2 ${theme.primary.replace('bg-', 'border-')}`}
                  />
                ) : (
                  <div className={`w-10 h-10 ${theme.accent} rounded-full flex items-center justify-center text-white font-bold shadow-sm`}>
                    {student?.display_name?.charAt(0)}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className={`${theme.textSecondary} hover:${theme.text} transition-colors`}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={`${theme.cardBg} border-b transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 py-3 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? `${theme.primary} text-white shadow-md`
                      : `${theme.textSecondary} hover:${theme.background}`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
}
