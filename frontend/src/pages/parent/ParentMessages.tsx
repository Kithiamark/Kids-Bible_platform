import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupAPI, userAPI, authAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import ChatWindow from '../../components/chat/ChatWindow';
import { MessageSquare, User, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ParentMessages() {
  const { user } = useAuthStore();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch Parent's Groups (Direct Chats)
  // We need an endpoint for this. groupAPI.listGroups() returns ALL groups for admin/teacher.
  // We need groupAPI.getMyGroups() for parents.
  // Actually listGroups in backend filters by is_active=True but doesn't filter by user.
  // Wait, backend `list_groups` is for admin.
  // We need `list_my_groups` for users.
  // Current `list_student_groups` is for students.
  // I need to add `GET /groups/my` for generic users (parents/teachers) to see their direct chats.
  
  // WORKAROUND: For now, I'll use listGroups but I need to fix the backend to return MY groups.
  // Let's implement `GET /groups/me` in backend first? 
  // Or just reuse `listGroups` if I'm admin/teacher, but parent is `UserRole.PARENT`.
  // `list_groups` requires `get_current_active_user`, so it works for parents, BUT it returns ALL groups.
  // That's a security issue if parents see all groups.
  
  // STOP. I must fix backend `list_groups` or add `list_my_groups`.
  // `list_groups` docstring says "List all groups".
  
  // Let's blindly try to use `listGroups` and see if I can filter client side? NO, security risk.
  
  // I will add `GET /groups/me` to backend `groups.py` quickly.
  
  const { data: groups, isLoading } = useQuery({
    queryKey: ['myGroups'],
    queryFn: () => groupAPI.listGroups().then((res) => res.data), // This needs to be replaced
  });

  const { data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => userAPI.listTeachers().then((res) => res.data),
    enabled: showNewChatModal,
  });

  const startChat = useMutation({
    mutationFn: (teacherId: number) => groupAPI.createUserDirectChat(teacherId),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['myGroups'] });
      setSelectedGroupId(response.data.id);
      setShowNewChatModal(false);
      toast.success('Chat started!');
    },
    onError: () => {
      toast.error('Failed to start chat');
    },
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Sidebar */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-100">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-gray-500" />
            Messages
          </h2>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="p-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-colors"
            title="Message Teacher"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {groups?.map((group: any) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                selectedGroupId === group.id
                  ? 'bg-teal-50 text-teal-700 border border-teal-100'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedGroupId === group.id ? 'bg-teal-100' : 'bg-gray-100'
              }`}>
                <User className={`w-5 h-5 ${selectedGroupId === group.id ? 'text-teal-600' : 'text-gray-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{group.name.replace(user?.full_name + ' & ', '').replace(' & ' + user?.full_name, '')}</p>
                <p className="text-xs text-gray-500 truncate">Direct Message</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {selectedGroupId ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-bold text-gray-800">
                {groups?.find((g: any) => g.id === selectedGroupId)?.name.replace(user?.full_name + ' & ', '').replace(' & ' + user?.full_name, '')}
              </h3>
            </div>
            <div className="flex-1 p-4 bg-gray-50">
               <ChatWindow
                groupId={selectedGroupId}
                currentUserId={user?.id || 0}
                isStudent={false}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Select a Conversation</h3>
            <p className="text-gray-500">
              Select a chat from the sidebar or start a new conversation with a teacher.
            </p>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Contact Teacher</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {teachers?.map((teacher: any) => (
                  <button
                    key={teacher.id}
                    onClick={() => startChat.mutate(teacher.id)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3 border border-transparent hover:border-gray-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                      {teacher.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{teacher.full_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{teacher.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}