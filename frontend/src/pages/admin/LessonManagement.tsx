import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, BookOpen } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function LessonManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Silence unused variable warning until implemented
  console.log(showCreateModal);

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => lessonAPI.listLessons({ published_only: false }).then((res) => res.data),
  });

  const deleteLesson = useMutation({
    mutationFn: (id: number) => lessonAPI.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete lesson');
    },
  });

  const createLesson = useMutation({
    mutationFn: (data: any) => lessonAPI.createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson created successfully');
      setShowCreateModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create lesson');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Handle Media Items
    const mediaItems = [];
    const mediaUrl = formData.get('media_url') as string;
    const mediaType = formData.get('media_type') as string;
    
    if (mediaUrl) {
      mediaItems.push({
        media_type: mediaType,
        title: formData.get('media_title') || 'Lesson Media',
        url: mediaUrl,
        order_index: 1,
      });
    }

    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      content: formData.get('content'),
      age_group: formData.get('age_group'),
      order_index: Number(formData.get('order_index')),
      is_published: formData.get('is_published') === 'on',
      thumbnail_url: formData.get('thumbnail_url'),
      media_items: mediaItems,
    };

    createLesson.mutate(data);
  };

  const ageGroupLabels: Record<string, string> = {
    toddlers: 'Toddlers',
    ages_4_9: 'Ages 4-9',
    ages_10_12: 'Ages 10-12',
    teens: 'Teens',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lesson Management</h1>
          <p className="text-gray-600 mt-1">Create and manage Bible lessons</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Lesson</span>
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Create New Lesson</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown supported)</label>
                <textarea
                  name="content"
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                  <select
                    name="age_group"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="toddlers">Toddlers</option>
                    <option value="ages_4_9">Ages 4-9</option>
                    <option value="ages_10_12">Ages 10-12</option>
                    <option value="teens">Teens</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Index</label>
                  <input
                    name="order_index"
                    type="number"
                    defaultValue={1}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                <input
                  name="thumbnail_url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Media Attachment (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                    <select
                      name="media_type"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="video">YouTube Video</option>
                      <option value="podcast">Spotify/Audio Podcast</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Media URL</label>
                    <input
                      name="media_url"
                      type="url"
                      placeholder="https://youtube.com/watch?v=... or https://open.spotify.com/..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Media Title</label>
                    <input
                      name="media_title"
                      type="text"
                      placeholder="Introduction Video"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  name="is_published"
                  type="checkbox"
                  id="is_published"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                  Publish immediately
                </label>
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
                  disabled={createLesson.isPending}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {createLesson.isPending ? 'Creating...' : 'Create Lesson'}
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
          {lessons?.map((lesson: any) => (
            <div key={lesson.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {lesson.thumbnail_url && (
                <img
                  src={lesson.thumbnail_url}
                  alt={lesson.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded-full">
                    {ageGroupLabels[lesson.age_group] || lesson.age_group}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      lesson.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {lesson.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{lesson.description}</p>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => navigate(`/admin/lessons/${lesson.id}/preview`)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button 
                    onClick={() => navigate(`/admin/lessons/${lesson.id}/edit`)}
                    className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this lesson?')) {
                        deleteLesson.mutate(lesson.id);
                      }
                    }}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {lessons?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first lesson</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            Create Lesson
          </button>
        </div>
      )}
    </div>
  );
}
