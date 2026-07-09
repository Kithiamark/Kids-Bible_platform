import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { lessonAPI, progressAPI, quizAPI } from '../../lib/api';
import MediaPlayer from '../../components/MediaPlayer';
import { ArrowLeft, CheckCircle, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonAPI.getStudentLesson(Number(id)).then((res) => res.data),
  });

  const { data: quizzes } = useQuery({
    queryKey: ['lessonQuizzes', id],
    queryFn: () => quizAPI.getStudentQuizzesForLesson(Number(id)).then((res) => res.data),
    enabled: !!id,
  });

  const { mutate: markLessonStarted } = useMutation({
    mutationFn: () => progressAPI.startLesson(Number(id)),
  });

  const updateProgress = useMutation({
    mutationFn: (data: any) => progressAPI.updateProgress(Number(id), data),
    onSuccess: () => {
      toast.success('Progress saved!');
    },
  });

  useEffect(() => {
    if (lesson) {
      markLessonStarted();
    }
  }, [lesson, markLessonStarted]);

  const handleCompleteLesson = () => {
    updateProgress.mutate({
      completion_percentage: 100,
      is_completed: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/student/lessons')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Lessons
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
        <p className="text-lg text-gray-600">{lesson.description}</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      </div>

      {/* Media Items */}
      {lesson.media_items && lesson.media_items.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Media Content</h2>
          {lesson.media_items
            .sort((a: any, b: any) => a.order_index - b.order_index)
            .map((media: any) => (
              <div key={media.id}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{media.title}</h3>
                {media.description && (
                  <p className="text-gray-600 mb-4">{media.description}</p>
                )}
                <MediaPlayer
                  type={media.media_type}
                  url={media.url}
                  title={media.title}
                  thumbnail={media.thumbnail_url}
                />
              </div>
            ))}
        </div>
      )}

      {/* Quizzes */}
      {quizzes && quizzes.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
          <div className="flex items-center mb-4">
            <Award className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Quiz Time!</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Test your knowledge with {quizzes.length} quiz{quizzes.length > 1 ? 'zes' : ''}
          </p>
          <div className="space-y-3">
            {quizzes.map((quiz: any) => (
              <button
                key={quiz.id}
                onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                className="w-full bg-white hover:bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-left transition-colors"
              >
                <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                {quiz.description && (
                  <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Complete Lesson Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCompleteLesson}
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
        >
          <CheckCircle className="w-6 h-6" />
          <span>Mark as Complete</span>
        </button>
      </div>
    </div>
  );
}
