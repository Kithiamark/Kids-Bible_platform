import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatAPI } from '../../lib/api';
import { Send, Flag, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ChatWindowProps {
  groupId: number;
  currentUserId: number; // Student ID or User ID
  isStudent: boolean; // True if current user is student
  theme?: any; // Theme object for styling
  isReadOnly?: boolean; // For parent monitoring
  canModerate?: boolean;
}

export default function ChatWindow({ groupId, currentUserId, isStudent, theme, isReadOnly = false, canModerate = false }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const useStudentAuth = isStudent && !isReadOnly;

  // Default theme fallback
  const currentTheme = theme || {
    primary: 'bg-teal-600',
    secondary: 'bg-gray-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-500',
    cardBg: 'bg-white',
    background: 'bg-gray-50',
  };

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', groupId],
    queryFn: () => (
      useStudentAuth
        ? chatAPI.getStudentGroupMessages(groupId)
        : chatAPI.getGroupMessages(groupId)
    ).then((res) => res.data.reverse()), // Reverse to show oldest first at top
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      const data = {
        group_id: groupId,
        content: content,
        message_type: 'text',
      };
      return useStudentAuth 
        ? chatAPI.sendStudentMessage(data)
        : chatAPI.sendMessage(data);
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', groupId] });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: number) => (
      useStudentAuth
        ? chatAPI.deleteStudentMessage(messageId)
        : chatAPI.deleteMessage(messageId)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', groupId] });
    },
  });

  const flagMessageMutation = useMutation({
    mutationFn: (messageId: number) => (
      useStudentAuth
        ? chatAPI.flagStudentMessage(messageId)
        : chatAPI.flagMessage(messageId)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', groupId] });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${currentTheme.cardBg} rounded-xl shadow-sm overflow-hidden border border-gray-100`}>
      {/* Chat Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${currentTheme.background} bg-opacity-50`}>
        {messages?.map((msg: any) => {
          const isMe = isStudent 
            ? msg.student_sender_id === currentUserId
            : msg.sender_id === currentUserId;
          const canDelete = !isReadOnly && (isMe || canModerate);
            
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center space-x-2 mb-1">
                  {!isMe && (
                    <span className={`text-xs font-medium ${currentTheme.textSecondary}`}>
                      {msg.sender_name}
                    </span>
                  )}
                </div>
                
                <div
                  className={`px-4 py-2 rounded-2xl shadow-sm ${
                    isMe
                      ? `${currentTheme.primary} text-white rounded-br-none`
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[10px] text-gray-400">
                    {format(new Date(msg.created_at), 'h:mm a')}
                  </span>
                  {msg.is_flagged && (
                    <Flag className="w-3 h-3 text-red-500" />
                  )}
                  {!isReadOnly && !msg.is_flagged && (
                    <button
                      type="button"
                      onClick={() => flagMessageMutation.mutate(msg.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title="Flag message"
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => deleteMessageMutation.mutate(msg.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!isReadOnly && (
        <div className="p-4 bg-white border-t">
          <form onSubmit={handleSend} className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!message.trim() || sendMessageMutation.isPending}
              className={`p-2 rounded-full ${currentTheme.primary} text-white hover:opacity-90 transition-opacity disabled:opacity-50`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
