import { useQuery } from '@tanstack/react-query';
import { progressAPI, lessonAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useStudentTheme } from '../../lib/theme';
import { BookOpen, Award, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { student } = useAuthStore();
  const theme = useStudentTheme();
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => progressAPI.getDashboardStats().then((res) => res.data),
  });

  const { data: recentLessons } = useQuery({
    queryKey: ['recentLessons'],
    queryFn: () => lessonAPI.getStudentLessons().then((res) => res.data.slice(0, 3)),
  });

  const statCards = [
    {
      label: 'Lessons Completed',
      value: stats?.lessons_completed || 0,
      total: stats?.total_lessons || 0,
      icon: BookOpen,
      bg: theme.primary,
    },
    {
      label: 'Current Level',
      value: stats?.current_level || 1,
      icon: TrendingUp,
      bg: theme.secondary,
    },
    {
      label: 'Total Points',
      value: stats?.total_points || 0,
      icon: Award,
      bg: theme.accent,
    },
    {
      label: 'Time Learning',
      value: `${Math.floor((stats?.total_time_spent_minutes || 0) / 60)}h`,
      icon: Clock,
      bg: 'bg-emerald-500', // Hardcoded for variety, or add to theme
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.primary} rounded-2xl p-8 text-white shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {student?.display_name}! 👋
            </h1>
            <p className="text-lg opacity-90">Ready to continue your Bible learning journey?</p>
          </div>
          {student?.avatar_url && (
            <img
              src={student.avatar_url}
              alt={student.display_name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bg} rounded-xl shadow-lg p-6 text-white`}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-8 h-8" />
              <div className="text-right">
                <p className="text-3xl font-bold">
                  {stat.value}
                  {stat.total && (
                    <span className="text-lg opacity-75">/{stat.total}</span>
                  )}
                </p>
              </div>
            </div>
            <p className="text-sm opacity-90">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      {stats?.recent_achievements && stats.recent_achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${theme.cardBg} rounded-xl shadow-sm p-6`}
        >
          <h2 className={`text-2xl font-bold ${theme.text} mb-4 flex items-center`}>
            <Award className="w-6 h-6 mr-2 text-yellow-500" />
            Recent Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recent_achievements.map((achievement: string, index: number) => (
              <div
                key={index}
                className={`${theme.background} rounded-lg p-4 border-2 ${theme.primary.replace('bg-', 'border-')} border-opacity-20`}
              >
                <div className="text-3xl mb-2">🏆</div>
                <p className={`font-medium ${theme.text}`}>{achievement}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Continue Learning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`${theme.cardBg} rounded-xl shadow-sm p-6`}
      >
        <h2 className={`text-2xl font-bold ${theme.text} mb-4`}>Continue Learning</h2>
        {recentLessons && recentLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentLessons.map((lesson: any) => (
              <div
                key={lesson.id}
                onClick={() => navigate(`/student/lessons/${lesson.id}`)}
                className={`${theme.background} rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className={`w-12 h-12 ${theme.primary} rounded-lg flex items-center justify-center mb-4 text-white`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className={`font-semibold ${theme.text} mb-2`}>{lesson.title}</h3>
                <p className={`text-sm ${theme.textSecondary} line-clamp-2 mb-4`}>{lesson.description}</p>
                {lesson.completion_percentage > 0 && (
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between text-xs ${theme.textSecondary}`}>
                      <span>Progress</span>
                      <span>{Math.round(lesson.completion_percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${theme.primary} h-2 rounded-full transition-all`}
                        style={{ width: `${lesson.completion_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
             <p className={`${theme.textSecondary} mb-4`}>No lessons started yet.</p>
             <button 
               onClick={() => navigate('/student/lessons')}
               className={`${theme.primary} text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity`}
             >
               Explore Lessons
             </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
