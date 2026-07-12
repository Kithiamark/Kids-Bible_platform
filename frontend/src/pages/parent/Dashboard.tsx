import { useQuery } from '@tanstack/react-query';
import { progressAPI, userAPI } from '../../lib/api';
import { Users, Award, BookOpen, Clock, CheckCircle2, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function ParentDashboard() {
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userAPI.getCurrentUser().then((res) => res.data),
  });

  const { data: dashboard } = useQuery({
    queryKey: ['parentDashboardStats'],
    queryFn: () => progressAPI.getParentDashboardStats().then((res) => res.data),
  });

  const weeklyHours = Math.round(((dashboard?.weekly_activity_minutes || 0) / 60) * 10) / 10;

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
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard?.total_children || 0}</p>
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
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard?.total_family_points || 0}</p>
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
              <p className="text-3xl font-bold text-gray-900 mt-2">{weeklyHours} hrs</p>
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          {(dashboard?.recent_activity?.length || 0) > 0 ? (
            <div className="space-y-4">
              {(dashboard?.recent_activity ?? []).map((activity: any, index: number) => (
                <div key={`${activity.student_id}-${activity.activity_type}-${index}`} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                  <div className={`mt-1 rounded-full p-2 ${activity.activity_type.includes('quiz') ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600'}`}>
                    {activity.activity_type.includes('quiz') ? <CheckCircle2 className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.student_name} {activity.activity_type === 'lesson_completed' ? 'completed' : activity.activity_type === 'lesson_progress' ? 'worked on' : activity.activity_type === 'quiz_passed' ? 'passed' : 'attempted'} {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.score !== null && activity.score !== undefined ? `${Math.round(activity.score)}% score • ` : ''}
                      {activity.occurred_at ? formatDistanceToNow(new Date(activity.occurred_at), { addSuffix: true }) : 'Recently'}
                    </p>
                  </div>
                </div>
              ))}
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
