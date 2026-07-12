import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

export default function LessonEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonAPI.getLesson(Number(id)).then((res) => res.data),
    enabled: !!id,
  });

  const updateLesson = useMutation({
    mutationFn: (data: any) => lessonAPI.updateLesson(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lesson', id] });
      toast.success('Lesson updated successfully');
      navigate('/admin/lessons');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update lesson');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Handle Media Items (Simplified for single item update)
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
      // Only include media_items if they are changed/provided. 
      // A robust implementation would manage the media array state more carefully.
      media_items: mediaItems.length > 0 ? mediaItems : undefined,
    };

    updateLesson.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!lesson) return <div>Lesson not found</div>;

  const currentMedia = lesson.media_items?.[0] || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/admin/lessons')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Lesson</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              name="title"
              type="text"
              required
              defaultValue={lesson.title}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={lesson.description ?? ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown supported)</label>
            <textarea
              name="content"
              required
              rows={10}
              defaultValue={lesson.content}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
              <select
                name="age_group"
                required
                defaultValue={lesson.age_group}
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
                defaultValue={lesson.order_index}
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
              defaultValue={lesson.thumbnail_url ?? ''}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Media Attachment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                <select
                  name="media_type"
                  defaultValue={currentMedia.media_type || 'video'}
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
                  defaultValue={currentMedia.url ?? ''}
                  placeholder="https://youtube.com/watch?v=... or https://open.spotify.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Title</label>
                <input
                  name="media_title"
                  type="text"
                  defaultValue={currentMedia.title ?? ''}
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
              defaultChecked={lesson.is_published}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
              Published
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={updateLesson.isPending}
              className="flex items-center space-x-2 px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{updateLesson.isPending ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
