import { useQuery } from '@tanstack/react-query';
import { studentAPI, userAPI } from '../../lib/api';
import { Users, Award, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ParentDashboard() {
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userAPI.getCurrentUser().then((res) => res.data),
  });

  const { data: students } = useQuery({
    queryKey: ['myStudents'],
    queryFn: () => studentAPI.getMyStudents().then((res) => res.data),
  });

  // Calculate aggregate stats
  const totalPoints = students?.reduce((acc: number, s: any) => acc + s.total_points, 0) || 0;
  const totalChildren = students?.length || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {currentUser?.full_name}!
        </h1>
        <p className="text-gray-600 mt-1">Monitor and manage your children's Bible learning journey.</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Children Registered</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalChildren}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Family Points</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalPoints}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Weekly Activity</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">-- hrs</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Ready to add another learner?</h2>
            <p className="text-teal-100">Create a new profile for your child to start tracking their progress.</p>
          </div>
          <Link
            to="/parent/register-child"
            className="bg-white text-teal-700 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors w-full md:w-auto text-center"
          >
            Register Child
          </Link>
        </div>
      </div>

      {/* Recent Activity Feed (Placeholder) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          {students?.length > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm text-center italic">Detailed activity tracking coming soon.</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No activity yet. Add a child to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}