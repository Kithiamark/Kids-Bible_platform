import { useQuery } from '@tanstack/react-query';
import { userAPI, lessonAPI, studentAPI, quizAPI, groupAPI } from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, Award, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userAPI.getCurrentUser().then((res) => res.data),
  });

  const { data: lessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => lessonAPI.listLessons().then((res) => res.data),
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentAPI.listStudents().then((res) => res.data),
  });

  const { data: quizzes } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizAPI.listQuizzes().then((res) => res.data),
  });

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupAPI.listGroups().then((res) => res.data),
  });

  // Calculate real stats
  const publishedLessons = lessons?.filter((l: any) => l.is_published).length || 0;
  const totalStudents = students?.length || 0;

  const stats = [
    { label: 'Total Students', value: totalStudents.toString(), icon: Users, color: 'bg-blue-500' },
    { label: 'Published Lessons', value: publishedLessons.toString(), icon: BookOpen, color: 'bg-green-500' },
    { label: 'Quizzes Created', value: (quizzes?.length || 0).toString(), icon: Award, color: 'bg-purple-500' },
    { label: 'Active Groups', value: (groups?.length || 0).toString(), icon: MessageSquare, color: 'bg-pink-500' },
  ];

  const chartData = [
    { name: 'Toddlers', students: students?.filter((s: any) => s.age_group === 'toddlers').length || 0 },
    { name: 'Ages 4-9', students: students?.filter((s: any) => s.age_group === 'ages_4_9').length || 0 },
    { name: 'Ages 10-12', students: students?.filter((s: any) => s.age_group === 'ages_10_12').length || 0 },
    { name: 'Teens', students: students?.filter((s: any) => s.age_group === 'teens').length || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {currentUser?.full_name}!
        </h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Students by Age Group</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {lessons?.slice(0, 5).map((lesson: any) => (
              <div key={lesson.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${lesson.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {lesson.is_published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-sm text-gray-900 font-medium">{lesson.title}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(lesson.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {(!lessons || lessons.length === 0) && (
              <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/admin/lessons')}
            className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors text-left"
          >
            <BookOpen className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Create Lesson</span>
          </button>
          <button 
            onClick={() => navigate('/admin/quizzes')}
            className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors text-left"
          >
            <Award className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">New Quiz</span>
          </button>
          <button 
            onClick={() => navigate('/admin/groups')}
            className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors text-left"
          >
            <Users className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Add Group</span>
          </button>
          <button 
            onClick={() => navigate('/admin/chat')}
            className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors text-left"
          >
            <MessageSquare className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">View Messages</span>
          </button>
        </div>
      </div>
    </div>
  );
}
