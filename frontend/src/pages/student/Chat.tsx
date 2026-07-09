import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupAPI, studentAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useStudentTheme } from '../../lib/theme';
import ChatWindow from '../../components/chat/ChatWindow';
import { MessageSquare, Users, Hash, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentChat() {
  const { student } = useAuthStore();
  const theme = useStudentTheme();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['studentGroups'],
    queryFn: () => groupAPI.getStudentGroups().then((res) => res.data),
  });

  const { data: peers } = useQuery({
    queryKey: ['peers'],
    queryFn: () => studentAPI.listPeers().then((res) => res.data),
    enabled: showNewChatModal,
  });

  const startChat = useMutation({
    mutationFn: (peerId: number) => groupAPI.createStudentDirectChat(peerId),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['studentGroups'] });
      setSelectedGroupId(response.data.id);
      setShowNewChatModal(false);
      toast.success('Chat started!');
    },
    onError: () => {
      toast.error('Failed to start chat');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme.primary.replace('bg-', 'border-')}`}></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6">
      {/* Groups List Sidebar */}
      <div className={`w-1/3 ${theme.cardBg} rounded-xl shadow-sm overflow-hidden flex flex-col`}>
        <div className={`p-4 border-b ${theme.background} flex justify-between items-center`}>
          <h2 className={`text-lg font-bold ${theme.text} flex items-center`}>
            <Users className={`w-5 h-5 mr-2 ${theme.textSecondary}`} />
            My Groups
          </h2>
          <button
            onClick={() => setShowNewChatModal(true)}
            className={`p-2 rounded-full ${theme.primary} text-white hover:opacity-90 transition-opacity`}
            title="Start New Chat"
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
                  ? `${theme.primary} text-white shadow-md`
                  : `hover:${theme.background} ${theme.text}`
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedGroupId === group.id ? 'bg-white bg-opacity-20' : theme.background
              }`}>
                <Hash className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium truncate">{group.name}</p>
                <p className={`text-xs truncate ${selectedGroupId === group.id ? 'text-white text-opacity-80' : theme.textSecondary}`}>
                  {group.description || 'No description'}
                </p>
              </div>
            </button>
          ))}

          {(!groups || groups.length === 0) && (
            <div className="text-center py-8 px-4">
              <MessageSquare className={`w-12 h-12 mx-auto mb-2 ${theme.textSecondary}`} />
              <p className={`text-sm ${theme.textSecondary}`}>
                You haven't been added to any groups yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${theme.cardBg} rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col`}>
            <div className={`p-4 border-b flex justify-between items-center ${theme.background}`}>
              <h3 className={`text-lg font-bold ${theme.text}`}>Start New Chat</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className={theme.textSecondary}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <p className={`text-sm ${theme.textSecondary} mb-4`}>
                Find friends in your age group to chat with!
              </p>
              
              <div className="space-y-2">
                {peers?.map((peer: any) => (
                  <button
                    key={peer.id}
                    onClick={() => startChat.mutate(peer.id)}
                    className={`w-full text-left p-3 rounded-lg hover:${theme.background} transition-colors flex items-center space-x-3 border border-transparent hover:border-gray-200`}
                  >
                    {peer.avatar_url ? (
                      <img src={peer.avatar_url} alt={peer.display_name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full ${theme.accent} flex items-center justify-center text-white font-bold`}>
                        {peer.display_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className={`font-medium ${theme.text}`}>{peer.display_name}</p>
                      <p className={`text-xs ${theme.textSecondary}`}>@{peer.username}</p>
                    </div>
                  </button>
                ))}
                
                {(!peers || peers.length === 0) && (
                  <div className="text-center py-8">
                    <p className={theme.textSecondary}>No other students found in your age group yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      <div className="flex-1">
        {selectedGroupId ? (
          <ChatWindow
            groupId={selectedGroupId}
            currentUserId={student?.id || 0}
            isStudent={true}
            theme={theme}
          />
        ) : (
          <div className={`h-full ${theme.cardBg} rounded-xl shadow-sm flex flex-col items-center justify-center text-center p-8`}>
            <div className={`w-20 h-20 ${theme.background} rounded-full flex items-center justify-center mb-6`}>
              <MessageSquare className={`w-10 h-10 ${theme.primary.replace('bg-', 'text-')}`} />
            </div>
            <h3 className={`text-2xl font-bold ${theme.text} mb-2`}>Select a Group</h3>
            <p className={theme.textSecondary}>
              Choose a group from the sidebar to start chatting with your friends and teachers!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
