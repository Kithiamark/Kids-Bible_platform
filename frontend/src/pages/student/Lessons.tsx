import { useQuery } from '@tanstack/react-query';
import { lessonAPI } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { BookOpen, PlayCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStudentTheme } from '../../lib/theme';

export default function StudentLessons() {
  const navigate = useNavigate();
  const theme = useStudentTheme();

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['studentLessons'],
    queryFn: () => lessonAPI.getStudentLessons().then((res) => res.data),
  });

  const getLessonStatus = (lesson: any) => {
    if (lesson.is_completed) {
      return {
        icon: CheckCircle,
        label: 'Completed',
        color: 'text-green-600 bg-green-100',
      };
    }
    if (lesson.is_started) {
      return {
        icon: PlayCircle,
        label: 'In Progress',
        color: 'text-blue-600 bg-blue-100',
      };
    }
    return {
      icon: BookOpen,
      label: 'Not Started',
      color: 'text-gray-600 bg-gray-100',
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${theme.text}`}>My Lessons</h1>
        <p className={`${theme.textSecondary} mt-1`}>Continue your Bible learning journey</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme.primary.replace('bg-', 'border-')}`}></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons?.map((lesson: any, index: number) => {
            const status = getLessonStatus(lesson);
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/student/lessons/${lesson.id}`)}
                className={`${theme.cardBg} rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group`}
              >
                {lesson.thumbnail_url ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={lesson.thumbnail_url}
                      alt={lesson.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} inline-flex items-center space-x-1`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{status.label}</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={`h-48 ${theme.primary} flex items-center justify-center opacity-90`}>
                    <BookOpen className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}

                <div className="p-6">
                  <h3 className={`text-lg font-semibold ${theme.text} mb-2 group-hover:${theme.textSecondary} transition-colors`}>
                    {lesson.title}
                  </h3>
                  <p className={`${theme.textSecondary} text-sm line-clamp-2 mb-4`}>
                    {lesson.description}
                  </p>

                  {lesson.is_started && (
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
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
