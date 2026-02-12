import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizAPI, lessonAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

export default function QuizEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizAPI.getQuiz(Number(id)).then((res) => res.data),
    enabled: !!id,
  });

  const { data: lessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => lessonAPI.listLessons().then((res) => res.data),
  });

  const updateQuiz = useMutation({
    mutationFn: (data: any) => quizAPI.updateQuiz(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz', id] });
      toast.success('Quiz updated successfully');
      navigate('/admin/quizzes');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update quiz');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      lesson_id: Number(formData.get('lesson_id')),
      passing_score: Number(formData.get('passing_score')),
      max_attempts: Number(formData.get('max_attempts')),
      is_active: formData.get('is_active') === 'on',
    };

    updateQuiz.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/admin/quizzes')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Quiz</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              name="title"
              type="text"
              required
              defaultValue={quiz.title}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={quiz.description}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson</label>
            <select
              name="lesson_id"
              required
              defaultValue={quiz.lesson_id}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select a lesson...</option>
              {lessons?.map((lesson: any) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
              <input
                name="passing_score"
                type="number"
                min="0"
                max="100"
                defaultValue={quiz.passing_score}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Attempts</label>
              <input
                name="max_attempts"
                type="number"
                min="1"
                defaultValue={quiz.max_attempts}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              name="is_active"
              type="checkbox"
              id="is_active"
              defaultChecked={quiz.is_active}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              Note: Editing questions is coming soon. Currently updating quiz metadata only.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={updateQuiz.isPending}
              className="flex items-center space-x-2 px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{updateQuiz.isPending ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}