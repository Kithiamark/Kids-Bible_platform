import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { groupAPI, userAPI } from '../../lib/api';
import ChatWindow from '../../components/chat/ChatWindow';
import { MessageSquare, Users, Hash } from 'lucide-react';

export default function ChatManagement() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // Fetch current user for ID
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userAPI.getCurrentUser().then((res) => res.data),
  });

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupAPI.listGroups().then((res) => res.data),
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Groups List Sidebar */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-100">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Users className="w-5 h-5 mr-2 text-gray-500" />
            Active Groups
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            groups?.map((group: any) => (
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
                  <Hash className={`w-5 h-5 ${selectedGroupId === group.id ? 'text-teal-600' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{group.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {group.member_count} members • {group.age_group || 'Mixed'}
                  </p>
                </div>
              </button>
            ))
          )}

          {(!groups || groups.length === 0) && !isLoading && (
            <div className="text-center py-8 px-4">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">No active groups found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {selectedGroupId ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">
                {groups?.find((g: any) => g.id === selectedGroupId)?.name}
              </h3>
              <div className="text-xs text-gray-500 bg-yellow-100 px-2 py-1 rounded text-yellow-700">
                Teacher Mode
              </div>
            </div>
            <div className="flex-1 p-4 bg-gray-50">
               <ChatWindow
                groupId={selectedGroupId}
                currentUserId={user?.id || 0}
                isStudent={false}
                canModerate={true}
                // Teacher Theme
                theme={{
                  primary: 'bg-teal-600',
                  secondary: 'bg-gray-200',
                  text: 'text-gray-900',
                  textSecondary: 'text-gray-500',
                  cardBg: 'bg-white',
                  background: 'bg-gray-50',
                }}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Select a Group to Monitor</h3>
            <p className="text-gray-500">
              Select a group from the sidebar to view messages and interact with students.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
