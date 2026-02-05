import { useQuery } from '@tanstack/react-query';
import { progressAPI } from '../../lib/api';
import { useStudentTheme } from '../../lib/theme';
import { TrendingUp, Award, Clock, Star, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentProgress() {
  const theme = useStudentTheme();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => progressAPI.getDashboardStats().then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme.primary.replace('bg-', 'border-')}`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className={`w-20 h-20 ${theme.primary} rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
          <TrendingUp className="w-10 h-10" />
        </div>
        <h1 className={`text-3xl font-bold ${theme.text} mb-2`}>My Progress</h1>
        <p className={theme.textSecondary}>Keep up the great work!</p>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`${theme.cardBg} p-6 rounded-2xl shadow-sm text-center border-b-4 ${theme.primary.replace('bg-', 'border-')}`}
        >
          <div className="flex justify-center mb-4">
            <div className={`${theme.background} p-4 rounded-full`}>
              <Star className={`w-8 h-8 ${theme.iconStyle}`} />
            </div>
          </div>
          <p className={`text-4xl font-bold ${theme.text} mb-1`}>{stats?.total_points || 0}</p>
          <p className={theme.textSecondary}>Total Points</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`${theme.cardBg} p-6 rounded-2xl shadow-sm text-center border-b-4 ${theme.secondary.replace('bg-', 'border-')}`}
        >
          <div className="flex justify-center mb-4">
            <div className={`${theme.background} p-4 rounded-full`}>
              <Award className={`w-8 h-8 ${theme.secondary.replace('bg-', 'text-')}`} />
            </div>
          </div>
          <p className={`text-4xl font-bold ${theme.text} mb-1`}>{Math.round(stats?.average_quiz_score || 0)}%</p>
          <p className={theme.textSecondary}>Average Quiz Score</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`${theme.cardBg} p-6 rounded-2xl shadow-sm text-center border-b-4 ${theme.accent.replace('bg-', 'border-')}`}
        >
          <div className="flex justify-center mb-4">
            <div className={`${theme.background} p-4 rounded-full`}>
              <Clock className={`w-8 h-8 ${theme.accent.replace('bg-', 'text-')}`} />
            </div>
          </div>
          <p className={`text-4xl font-bold ${theme.text} mb-1`}>{Math.floor((stats?.total_time_spent_minutes || 0) / 60)}h</p>
          <p className={theme.textSecondary}>Time Spent Learning</p>
        </motion.div>
      </div>

      {/* Detailed Stats */}
      <div className={`${theme.cardBg} rounded-xl shadow-sm p-8`}>
        <h2 className={`text-xl font-bold ${theme.text} mb-6`}>Detailed Statistics</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className={theme.textSecondary}>Lessons Completed</span>
              <span className={`font-bold ${theme.text}`}>{stats?.lessons_completed || 0} / {stats?.total_lessons || 0}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div 
                className={`${theme.primary} h-3 rounded-full transition-all duration-1000`}
                style={{ width: `${stats?.total_lessons ? (stats.lessons_completed / stats.total_lessons) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className={theme.textSecondary}>Quizzes Passed</span>
              <span className={`font-bold ${theme.text}`}>0</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div 
                className={`${theme.secondary} h-3 rounded-full transition-all duration-1000`}
                style={{ width: '0%' }} // TODO: Add quizzes passed to stats
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
