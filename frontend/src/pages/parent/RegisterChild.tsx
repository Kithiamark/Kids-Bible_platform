import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { UserPlus, User, Lock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../store/authStore';

export default function RegisterChild() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const registerChild = useMutation({
    mutationFn: (data: any) => studentAPI.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myStudents'] });
      toast.success('Child account created successfully!');
      navigate('/parent/children');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create account');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      username: formData.get('username'),
      display_name: formData.get('display_name'),
      age_group: formData.get('age_group'),
      pin_code: formData.get('pin_code') || null,
      parent_id: user?.id, // Explicitly include parent_id from current auth user
    };

    registerChild.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Add a Child Profile</h1>
          <p className="text-gray-600 mt-2">Create a separate learning space for your child</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="display_name"
                type="text"
                required
                placeholder="e.g. Noah"
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">Name shown on their dashboard</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="username"
                type="text"
                required
                placeholder="e.g. noah123"
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">Used for login along with your email</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="age_group"
                required
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="toddlers">Toddlers (Ages 0-3)</option>
                <option value="ages_4_9">Kids Delight(Ages 4-9)</option>
                <option value="ages_10_12">Pre-Teens (Ages 10-12)</option>
                <option value="teens">Teens (Ages 13+)</option>
              </select>
            </div>
            <p className="mt-1 text-sm text-gray-500">Determines appropriate content</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secret PIN (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="pin_code"
                type="text"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="e.g. 1234"
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">Simple 4-digit PIN for easier login</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={registerChild.isPending}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {registerChild.isPending ? 'Creating Profile...' : 'Create Child Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
