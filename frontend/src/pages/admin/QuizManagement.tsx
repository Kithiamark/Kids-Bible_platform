import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizAPI, lessonAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Award, BookOpen } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function QuizManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizAPI.listQuizzes().then((res) => res.data),
  });

  const deleteQuiz = useMutation({
    mutationFn: (id: number) => quizAPI.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete quiz');
    },
  });

  // Since we don't have a list all quizzes endpoint yet, we'll fetch lessons first then quizzes
  // For now, let's just show a placeholder or implement the create modal
  
  const createQuiz = useMutation({
    mutationFn: (data: any) => quizAPI.createQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz created successfully');
      setShowCreateModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create quiz');
    },
  });

  const { data: lessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => lessonAPI.listLessons().then((res) => res.data),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Basic quiz data structure - in a real app this would be more complex
    // with dynamic question adding
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      lesson_id: Number(formData.get('lesson_id')),
      passing_score: Number(formData.get('passing_score')),
      max_attempts: Number(formData.get('max_attempts')),
      is_active: formData.get('is_active') === 'on',
      questions: [], // Questions would be added here in a full implementation
    };

    createQuiz.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
          <p className="text-gray-600 mt-1">Create and manage quizzes</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Quiz</span>
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Create New Quiz</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lesson</label>
                <select
                  name="lesson_id"
                  required
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
                    defaultValue={70}
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
                    defaultValue={3}
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
                  defaultChecked
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Note: Adding questions is not yet supported in this quick view. Please create the quiz first, then add questions.
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createQuiz.isPending}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {createQuiz.isPending ? 'Creating...' : 'Create Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes?.map((quiz: any) => (
            <div key={quiz.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate(`/admin/quizzes/${quiz.id}/edit`)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this quiz?')) {
                        deleteQuiz.mutate(quiz.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">{quiz.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded capitalize">
                  {quiz.lesson_id ? `Lesson ${quiz.lesson_id}` : 'General'}
                </span>
                <span>{quiz.passing_score}% Pass</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {quizzes?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
          <p className="text-gray-600 mb-4">Create a quiz to get started</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            Create Quiz
          </button>
        </div>
      )}
    </div>
  );
}
