import { useQuery } from '@tanstack/react-query';
import { progressAPI } from '../../lib/api';
import { User, Award, TrendingUp, Plus, BookOpen, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyChildren() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['parentDashboardStats'],
    queryFn: () => progressAPI.getParentDashboardStats().then((res) => res.data),
  });
  const students = dashboard?.children || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
          <p className="text-gray-600 mt-1">Manage profiles and view progress</p>
        </div>
        <Link
          to="/parent/register-child"
          className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Child</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students?.map((student: any) => (
          <div key={student.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {student.display_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{student.display_name}</h3>
                    <p className="text-sm text-gray-500">@{student.username}</p>
                  </div>
                </div>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium capitalize">
                  {student.age_group.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Award className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>Current Level</span>
                  </div>
                  <span className="font-bold text-gray-900">{student.current_level}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                    <span>Total Points</span>
                  </div>
                  <span className="font-bold text-gray-900">{student.total_points} pts</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Lessons Done</span>
                  </div>
                  <span className="font-bold text-gray-900">{student.lessons_completed}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-teal-500" />
                    <span>Quizzes Passed</span>
                  </div>
                  <span className="font-bold text-gray-900">{student.quizzes_passed} / {student.quizzes_attempted}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State Card */}
        {students?.length === 0 && (
          <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center h-full min-h-[250px]">
            <User className="w-12 h-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No profiles yet</h3>
            <p className="text-sm text-gray-500 mb-4">Add your child to start their learning journey</p>
            <Link
              to="/parent/register-child"
              className="text-teal-600 font-medium hover:text-teal-700"
            >
              Create First Profile &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
