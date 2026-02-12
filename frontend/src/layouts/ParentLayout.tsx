import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, Users, UserPlus, LogOut, Menu, X, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function ParentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/parent', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/parent/children', icon: Users, label: 'My Children' },
    { path: '/parent/chat-monitoring', icon: MessageSquare, label: 'Chat Monitoring' },
    { path: '/parent/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/parent/register-child', icon: UserPlus, label: 'Register Child' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm sticky top-0 z-20 px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold text-teal-600">Kids Delight: Parent</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar / Mobile Menu */}
      <div className={`
        fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto lg:h-screen lg:flex lg:flex-col
      `}>
        <div className="flex flex-col h-full pt-16 lg:pt-0">
          {/* Logo (Desktop only) */}
          <div className="hidden lg:block p-6 border-b">
            <h1 className="text-2xl font-bold text-teal-600">ble</h1>
            <p className="text-sm text-gray-600 mt-1">Parent Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 font-semibold">
                  {user?.full_name?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.full_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">Parent</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:flex-1 w-full">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}