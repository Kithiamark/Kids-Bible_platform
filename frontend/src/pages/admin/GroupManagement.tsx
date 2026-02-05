import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupAPI, studentAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { Plus, Users, Edit, Trash2, UserPlus, X } from 'lucide-react';

export default function GroupManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [managingGroupId, setManagingGroupId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch Groups
  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupAPI.listGroups().then((res) => res.data),
  });

  // Fetch Members of Selected Group
  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['groupMembers', managingGroupId],
    queryFn: () => groupAPI.getGroupMembers(managingGroupId!).then((res) => res.data),
    enabled: !!managingGroupId,
  });

  // Search Students to Add
  const { data: searchResults } = useQuery({
    queryKey: ['searchStudents', searchTerm],
    queryFn: () => studentAPI.listStudents({ search: searchTerm }).then((res) => res.data),
    enabled: searchTerm.length > 2,
  });

  const createGroup = useMutation({
    mutationFn: (data: any) => groupAPI.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group created successfully');
      setShowCreateModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create group');
    },
  });

  const deleteGroup = useMutation({
    mutationFn: (id: number) => groupAPI.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete group');
    },
  });

  const addMember = useMutation({
    mutationFn: ({ groupId, studentId }: { groupId: number; studentId: number }) =>
      groupAPI.addMember(groupId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupMembers', managingGroupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] }); // Update member count
      toast.success('Student added to group');
      setSearchTerm(''); // Clear search
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to add student');
    },
  });

  const removeMember = useMutation({
    mutationFn: ({ groupId, studentId }: { groupId: number; studentId: number }) =>
      groupAPI.removeMember(groupId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupMembers', managingGroupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] }); // Update member count
      toast.success('Student removed from group');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to remove student');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      group_type: formData.get('group_type'),
      age_group: formData.get('age_group') || null,
      is_active: formData.get('is_active') === 'on',
    };

    createGroup.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Group Management</h1>
          <p className="text-gray-600 mt-1">Create and manage learning groups</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Group</span>
        </button>
      </div>

      {/* Manage Members Modal */}
      {managingGroupId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Manage Members: {groups?.find((g: any) => g.id === managingGroupId)?.name}
              </h2>
              <button
                onClick={() => setManagingGroupId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Add Member Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Add New Member</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search students by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {searchTerm.length > 2 && searchResults && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {searchResults.map((student: any) => (
                        <button
                          key={student.id}
                          onClick={() => addMember.mutate({ groupId: managingGroupId, studentId: student.id })}
                          disabled={members?.some((m: any) => m.student_id === student.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{student.display_name}</p>
                            <p className="text-xs text-gray-500">@{student.username}</p>
                          </div>
                          {members?.some((m: any) => m.student_id === student.id) ? (
                            <span className="text-xs text-green-600 font-medium">Already Member</span>
                          ) : (
                            <Plus className="w-4 h-4 text-teal-600" />
                          )}
                        </button>
                      ))}
                      {searchResults.length === 0 && (
                        <p className="px-4 py-2 text-sm text-gray-500">No students found.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Current Members List */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">
                  Current Members ({members?.length || 0})
                </h3>
                {isLoadingMembers ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                  </div>
                ) : members?.length > 0 ? (
                  <div className="space-y-2">
                    {members.map((member: any) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-xs">
                            ID:{member.student_id}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Student ID: {member.student_id}</p>
                            <p className="text-xs text-gray-500">Joined: {new Date(member.joined_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeMember.mutate({ groupId: managingGroupId, studentId: member.student_id })}
                          className="text-red-400 hover:text-red-600 p-2"
                          title="Remove from group"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No members in this group yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Create New Group</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                <input
                  name="name"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Group Type</label>
                <select
                  name="group_type"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="age_group">Age Group</option>
                  <option value="class">Class</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Group (Optional)</label>
                <select
                  name="age_group"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">None</option>
                  <option value="toddlers">Toddlers</option>
                  <option value="ages_4_9">Ages 4-9</option>
                  <option value="ages_10_12">Ages 10-12</option>
                  <option value="teens">Teens</option>
                </select>
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
                  disabled={createGroup.isPending}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {createGroup.isPending ? 'Creating...' : 'Create Group'}
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
          {groups?.map((group: any) => (
            <div key={group.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-teal-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setManagingGroupId(group.id)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title="Manage Members"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-blue-500 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this group?')) {
                        deleteGroup.mutate(group.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">{group.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded capitalize">
                  {group.group_type.replace('_', ' ')}
                </span>
                <span className="flex items-center">
                   <Users className="w-3 h-3 mr-1" />
                   {group.member_count} members
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {groups?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
          <p className="text-gray-600 mb-4">Create groups to organize students</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            Create Group
          </button>
        </div>
      )}
    </div>
  );
}
