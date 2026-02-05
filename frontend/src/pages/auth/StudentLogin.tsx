import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, studentAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function StudentLogin() {
  const [username, setUsername] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth, setStudent } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.studentLogin(username, parentEmail);
      const { access_token, refresh_token } = response.data;

      // Set token in localStorage so interceptor can pick it up
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Get student profile
      const studentResponse = await studentAPI.getCurrentStudent();
      const student = studentResponse.data;

      // Create a user object for student
      const user = {
        id: student.parent_id,
        email: parentEmail,
        full_name: student.display_name,
        role: 'student' as const,
      };

      setAuth(user, access_token, refresh_token);
      setStudent(student);
      
      toast.success(`Welcome back, ${student.display_name}!`);
      navigate('/student');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="text-3xl font-bold text-purple-600 mb-2">
            Student Login
          </h1>
          <p className="text-gray-600">Enter to start learning!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              required
              placeholder="Your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent's Email
            </label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              required
              placeholder="parent@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 text-lg"
          >
            {loading ? 'Logging in...' : 'Start Learning! 🚀'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-700"
          >
            ← Back to Parent/Teacher Login
          </Link>
        </div>
      </div>
    </div>
  );
}
