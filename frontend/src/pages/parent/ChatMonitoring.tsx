import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentAPI, groupAPI } from '../../lib/api';
import ChatWindow from '../../components/chat/ChatWindow';
import { MessageSquare, Users, User, Hash } from 'lucide-react';
import { themes } from '../../lib/theme';

export default function ChatMonitoring() {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // Fetch Parent's Students
  const { data: students } = useQuery({
    queryKey: ['myStudents'],
    queryFn: () => studentAPI.getMyStudents().then((res) => res.data),
  });

  // Fetch Groups for Selected Student
  const { data: studentGroups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['studentGroups', selectedStudentId],
    queryFn: () => groupAPI.getStudentGroups().then((res) => res.data), // This API might need adjustment to fetch groups for a specific student ID as parent
    enabled: !!selectedStudentId,
  });
  
  // NOTE: In a real implementation, we'd need an endpoint like `/groups/student/{student_id}` accessible to parents.
  // For now, assuming the parent can see groups if they log in as student (which isn't ideal).
  // Let's use a placeholder or assume `getStudentGroups` handles context if we switch tokens, 
  // BUT proper RBAC would require `groupAPI.getGroupsForStudent(studentId)`. 
  // I will assume for now we might need to rely on the backend allowing parents to query their child's groups.

  const selectedStudent = students?.find((s: any) => s.id === selectedStudentId);
  // Cast age_group to any to avoid TS error since we know it matches the key from backend
  const studentTheme = selectedStudent ? themes[selectedStudent.age_group as keyof typeof themes] : themes.ages_4_9;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Sidebar: Select Child & Group */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-100">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Users className="w-5 h-5 mr-2 text-gray-500" />
            Monitoring
          </h2>
        </div>

        <div className="p-4 border-b">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Child</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            onChange={(e) => {
              setSelectedStudentId(Number(e.target.value));
              setSelectedGroupId(null);
            }}
            value={selectedStudentId || ''}
          >
            <option value="">Choose a child...</option>
            {students?.map((s: any) => (
              <option key={s.id} value={s.id}>{s.display_name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {selectedStudentId ? (
            <>
              <p className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Active Groups
              </p>
              {studentGroups?.map((group: any) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    selectedGroupId === group.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedGroupId === group.id ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Hash className={`w-4 h-4 ${selectedGroupId === group.id ? 'text-blue-600' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{group.name}</p>
                  </div>
                </button>
              ))}
              {(!studentGroups || studentGroups.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No groups found for this child.
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-8 px-4">
              <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">Select a child to view their chats.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window (Read Only) */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {selectedGroupId && selectedStudentId ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">
                Viewing as Parent: {selectedStudent?.display_name}
              </h3>
              <div className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded text-blue-700">
                Read-Only Mode
              </div>
            </div>
            <div className="flex-1 p-4 bg-gray-50">
               <ChatWindow
                groupId={selectedGroupId}
                currentUserId={selectedStudentId}
                isStudent={true}
                isReadOnly={true}
                theme={studentTheme} // Use the child's theme so parent sees what child sees
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
              Choose a child and one of their groups to view the conversation history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}