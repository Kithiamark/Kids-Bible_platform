import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

type UserRole = 'admin' | 'teacher' | 'parent' | 'student';
type AgeGroup = 'toddlers' | 'ages_4_9' | 'ages_10_12' | 'teens';
type GroupType = 'age_group' | 'class' | 'direct' | 'custom';
type MediaType = 'video' | 'podcast' | 'audio';
type MessageType = 'text' | 'image' | 'video' | 'audio' | 'system';
type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface Student {
  id: number;
  parent_id: number;
  username: string;
  display_name: string;
  age_group: AgeGroup;
  avatar_url?: string | null;
  current_level: number;
  total_points: number;
  created_at: string;
  updated_at?: string | null;
}

export interface StudentWithProgress extends Student {
  lessons_completed: number;
  lessons_in_progress: number;
  average_quiz_score: number;
  total_time_spent_minutes: number;
}

export interface LessonMedia {
  id?: number;
  lesson_id?: number;
  media_type: MediaType;
  title: string;
  description?: string | null;
  url: string;
  thumbnail_url?: string | null;
  duration?: number | null;
  order_index: number;
  created_at?: string;
}

export interface Lesson {
  id: number;
  created_by: number;
  title: string;
  description?: string | null;
  content: string;
  age_group: AgeGroup;
  order_index: number;
  is_published: boolean;
  thumbnail_url?: string | null;
  media_items: LessonMedia[];
  created_at: string;
  updated_at?: string | null;
}

export interface LessonWithProgress extends Lesson {
  is_started: boolean;
  is_completed: boolean;
  completion_percentage: number;
}

export interface QuizOption {
  id: string;
  text: string;
  image_url?: string | null;
}

export interface QuizQuestion {
  id?: number;
  quiz_id?: number;
  question_type: QuestionType | string;
  question_text: string;
  image_url?: string | null;
  options: QuizOption[];
  correct_answer?: string;
  points: number;
  order_index: number;
  explanation?: string | null;
  created_at?: string;
}

export interface Quiz {
  id: number;
  lesson_id: number;
  created_by: number;
  title: string;
  description?: string | null;
  passing_score: number;
  max_attempts?: number | null;
  is_active: boolean;
  questions: QuizQuestion[];
  created_at: string;
  updated_at?: string | null;
}

export interface StudentQuizQuestion {
  id: number;
  question_type: QuestionType | string;
  question_text: string;
  image_url?: string | null;
  options: QuizOption[];
  points: number;
  order_index: number;
}

export interface StudentQuiz {
  id: number;
  lesson_id: number;
  title: string;
  description?: string | null;
  passing_score: number;
  max_attempts?: number | null;
  is_active: boolean;
  questions: StudentQuizQuestion[];
}

export interface QuizAnswerSubmit {
  question_id: number;
  selected_answer: string;
}

export interface QuizAttemptAnswerResult {
  question_id: number;
  selected_answer: string;
  is_correct: boolean;
  correct_answer: string;
  points_earned: number;
  explanation?: string | null;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  student_id: number;
  attempt_number: number;
  score?: number | null;
  total_points?: number | null;
  max_points?: number | null;
  is_passed: boolean;
  is_completed: boolean;
  started_at: string;
  completed_at?: string | null;
  answers: QuizAttemptAnswerResult[];
}

export interface StudentDashboardStats {
  total_lessons: number;
  lessons_completed: number;
  lessons_in_progress: number;
  current_level: number;
  total_points: number;
  average_quiz_score: number;
  quizzes_attempted: number;
  quizzes_passed: number;
  total_time_spent_minutes: number;
  recent_achievements: string[];
}

export interface ParentChildProgressSummary {
  student_id: number;
  display_name: string;
  username: string;
  age_group: AgeGroup | string;
  current_level: number;
  total_points: number;
  lessons_completed: number;
  lessons_in_progress: number;
  quizzes_attempted: number;
  quizzes_passed: number;
  average_quiz_score: number;
  total_time_spent_minutes: number;
}

export interface ParentRecentActivity {
  student_id: number;
  student_name: string;
  activity_type: string;
  title: string;
  occurred_at?: string | null;
  score?: number | null;
}

export interface ParentDashboardStats {
  total_children: number;
  total_family_points: number;
  weekly_activity_minutes: number;
  children: ParentChildProgressSummary[];
  recent_activity: ParentRecentActivity[];
}

export interface ProgressRecord {
  id: number;
  student_id: number;
  lesson_id: number;
  is_started: boolean;
  is_completed: boolean;
  completion_percentage: number;
  time_spent_minutes: number;
  started_at?: string | null;
  completed_at?: string | null;
  last_accessed_at: string;
}

export interface Message {
  id: number;
  group_id: number;
  sender_id?: number | null;
  student_sender_id?: number | null;
  sender_name?: string | null;
  sender_avatar?: string | null;
  content: string;
  message_type: MessageType | string;
  extra_data?: string | null;
  is_moderated: boolean;
  is_flagged: boolean;
  created_at: string;
  edited_at?: string | null;
}

export interface Group {
  id: number;
  name: string;
  description?: string | null;
  group_type: GroupType | string;
  age_group?: AgeGroup | null;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at?: string | null;
  member_count: number;
}

export interface GroupMember {
  id: number;
  group_id: number;
  student_id?: number | null;
  user_id?: number | null;
  joined_at: string;
  is_active: boolean;
  member_type?: 'student' | 'user' | string | null;
  display_name?: string | null;
  username?: string | null;
  role?: UserRole | string | null;
  avatar_url?: string | null;
  age_group?: AgeGroup | string | null;
}

export interface ApiMessage {
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface StudentLoginPayload {
  username: string;
  parent_email: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
}

export interface StudentCreatePayload {
  username: string;
  display_name: string;
  age_group: AgeGroup;
  avatar_url?: string | null;
  parent_id?: number | null;
}

export interface LessonListParams extends Record<string, CompactParamValue> {
  age_group?: AgeGroup;
  published_only?: boolean;
  skip?: number;
  limit?: number;
}

export interface LessonCreatePayload {
  title: string;
  description?: string | null;
  content: string;
  age_group: AgeGroup;
  order_index: number;
  is_published?: boolean;
  thumbnail_url?: string | null;
  media_items?: LessonMedia[];
}

export interface LessonUpdatePayload {
  title?: string;
  description?: string | null;
  content?: string;
  age_group?: AgeGroup;
  order_index?: number;
  is_published?: boolean;
  thumbnail_url?: string | null;
}

export interface QuizCreatePayload {
  lesson_id: number;
  title: string;
  description?: string | null;
  passing_score?: number;
  max_attempts?: number | null;
  is_active?: boolean;
  questions?: QuizQuestion[];
}

export interface QuizUpdatePayload extends Partial<QuizCreatePayload> {}

export interface ProgressUpdatePayload {
  is_started?: boolean;
  is_completed?: boolean;
  completion_percentage?: number;
  time_spent_minutes?: number;
}

export interface MessageCreatePayload {
  group_id: number;
  content: string;
  message_type?: MessageType | string;
  extra_data?: string | null;
}

export interface GroupCreatePayload {
  name: string;
  description?: string | null;
  group_type: GroupType | string;
  age_group?: AgeGroup | null;
  is_active?: boolean;
}

export interface GroupUpdatePayload {
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

export interface StudentSearchParams extends Record<string, CompactParamValue> {
  skip?: number;
  limit?: number;
  search?: string;
}

type CompactParamValue = string | number | boolean | null | undefined;

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  'http://localhost:8000/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }

    return Promise.reject(error);
  },
);

const compactParams = <T extends Record<string, CompactParamValue>>(
  params?: T,
): Record<string, string | number | boolean> | undefined => {
  if (!params) return undefined;

  const entries = Object.entries(params).filter(([, value]) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
  });

  return Object.fromEntries(entries) as Record<string, string | number | boolean>;
};

export const authAPI = {
  login: (email: string, password: string): Promise<AxiosResponse<TokenResponse>> =>
    apiClient.post('/auth/login', { email, password } satisfies LoginPayload),

  studentLogin: (username: string, parent_email: string): Promise<AxiosResponse<TokenResponse>> =>
    apiClient.post('/auth/student-login', { username, parent_email } satisfies StudentLoginPayload),

  register: (data: RegisterPayload): Promise<AxiosResponse<User>> =>
    apiClient.post('/auth/register', data),

  refresh: (refresh_token: string): Promise<AxiosResponse<TokenResponse>> =>
    apiClient.post('/auth/refresh', { refresh_token }),
};

export const userAPI = {
  getCurrentUser: (): Promise<AxiosResponse<User>> => apiClient.get('/users/me'),

  listUsers: (): Promise<AxiosResponse<User[]>> => apiClient.get('/users'),

  listTeachers: (): Promise<AxiosResponse<User[]>> => apiClient.get('/users/teachers'),

  updateCurrentUser: (data: Partial<Pick<User, 'email' | 'full_name'>>): Promise<AxiosResponse<User>> =>
    apiClient.put('/users/me', data),
};

export const studentAPI = {
  listStudents: (params?: StudentSearchParams): Promise<AxiosResponse<Student[]>> =>
    apiClient.get('/students', { params: compactParams(params) }),

  createStudent: (data: StudentCreatePayload): Promise<AxiosResponse<Student>> =>
    apiClient.post('/students', data),

  getMyStudents: (): Promise<AxiosResponse<Student[]>> => apiClient.get('/students/my-students'),

  getCurrentStudent: (): Promise<AxiosResponse<StudentWithProgress>> => apiClient.get('/students/me'),

  listPeers: (): Promise<AxiosResponse<Student[]>> => apiClient.get('/students/peers'),
};

export const lessonAPI = {
  listLessons: (params?: LessonListParams): Promise<AxiosResponse<Lesson[]>> =>
    apiClient.get('/lessons', { params: compactParams(params) }),

  getLesson: (lessonId: number): Promise<AxiosResponse<Lesson>> =>
    apiClient.get(`/lessons/${lessonId}`),

  createLesson: (data: LessonCreatePayload): Promise<AxiosResponse<Lesson>> =>
    apiClient.post('/lessons', data),

  updateLesson: (lessonId: number, data: LessonUpdatePayload): Promise<AxiosResponse<Lesson>> =>
    apiClient.put(`/lessons/${lessonId}`, data),

  deleteLesson: (lessonId: number): Promise<AxiosResponse<ApiMessage>> =>
    apiClient.delete(`/lessons/${lessonId}`),

  getStudentLessons: (): Promise<AxiosResponse<LessonWithProgress[]>> =>
    apiClient.get('/lessons/student'),

  getStudentLesson: (lessonId: number): Promise<AxiosResponse<Lesson>> =>
    apiClient.get(`/lessons/student/${lessonId}`),
};

export const quizAPI = {
  listQuizzes: (): Promise<AxiosResponse<Quiz[]>> => apiClient.get('/quizzes'),

  getQuiz: (quizId: number): Promise<AxiosResponse<Quiz>> =>
    apiClient.get(`/quizzes/${quizId}`),

  createQuiz: (data: QuizCreatePayload): Promise<AxiosResponse<Quiz>> =>
    apiClient.post('/quizzes', data),

  updateQuiz: (quizId: number, data: QuizUpdatePayload): Promise<AxiosResponse<Quiz>> =>
    apiClient.put(`/quizzes/${quizId}`, data),

  deleteQuiz: (quizId: number): Promise<AxiosResponse<ApiMessage>> =>
    apiClient.delete(`/quizzes/${quizId}`),

  getLessonQuizzes: (lessonId: number): Promise<AxiosResponse<Quiz[]>> =>
    apiClient.get(`/quizzes/lesson/${lessonId}`),

  getStudentQuizzesForLesson: (lessonId: number): Promise<AxiosResponse<StudentQuiz[]>> =>
    apiClient.get(`/quizzes/student/lesson/${lessonId}`),

  getStudentQuiz: (quizId: number): Promise<AxiosResponse<StudentQuiz>> =>
    apiClient.get(`/quizzes/${quizId}/student`),

  startQuiz: (quizId: number): Promise<AxiosResponse<QuizAttempt>> =>
    apiClient.post(`/quizzes/${quizId}/start`),

  submitQuiz: (
    attemptId: number,
    quizId: number,
    answers: QuizAnswerSubmit[],
  ): Promise<AxiosResponse<QuizAttempt>> =>
    apiClient.post(`/quizzes/attempts/${attemptId}/submit`, { quiz_id: quizId, answers }),
};

export const progressAPI = {
  startLesson: (lessonId: number): Promise<AxiosResponse<ProgressRecord>> =>
    apiClient.post(`/progress/lessons/${lessonId}/start`),

  updateProgress: (lessonId: number, data: ProgressUpdatePayload): Promise<AxiosResponse<ProgressRecord>> =>
    apiClient.put(`/progress/lessons/${lessonId}`, data),

  getDashboardStats: (): Promise<AxiosResponse<StudentDashboardStats>> =>
    apiClient.get('/progress/dashboard'),

  getParentDashboardStats: (): Promise<AxiosResponse<ParentDashboardStats>> =>
    apiClient.get('/progress/parent/dashboard'),
};

export const chatAPI = {
  getGroupMessages: (groupId: number): Promise<AxiosResponse<Message[]>> =>
    apiClient.get(`/chat/groups/${groupId}/messages`),

  getStudentGroupMessages: (groupId: number): Promise<AxiosResponse<Message[]>> =>
    apiClient.get(`/chat/student/groups/${groupId}/messages`),

  sendMessage: (data: MessageCreatePayload): Promise<AxiosResponse<Message>> =>
    apiClient.post('/chat/messages', data),

  sendStudentMessage: (data: MessageCreatePayload): Promise<AxiosResponse<Message>> =>
    apiClient.post('/chat/messages/student', data),

  deleteMessage: (messageId: number): Promise<AxiosResponse<ApiMessage>> =>
    apiClient.delete(`/chat/messages/${messageId}`),

  deleteStudentMessage: (messageId: number): Promise<AxiosResponse<ApiMessage>> =>
    apiClient.delete(`/chat/messages/student/${messageId}`),

  flagMessage: (messageId: number): Promise<AxiosResponse<ApiMessage>> =>
    apiClient.put(`/chat/messages/${messageId}/flag`),

  flagStudentMessage: (messageId: number): Promise<AxiosResponse<ApiMessage>> =>
    apiClient.put(`/chat/messages/student/${messageId}/flag`),

  listFlaggedMessages: (): Promise<AxiosResponse<Message[]>> =>
    apiClient.get('/chat/messages/flagged'),
};

export const groupAPI = {
  listGroups: (): Promise<AxiosResponse<Group[]>> => apiClient.get('/groups'),

  getMyGroups: (): Promise<AxiosResponse<Group[]>> => apiClient.get('/groups/me'),

  getStudentGroups: (): Promise<AxiosResponse<Group[]>> => apiClient.get('/groups/student'),

  getGroupsForStudent: (studentId: number): Promise<AxiosResponse<Group[]>> =>
    apiClient.get(`/groups/student/${studentId}`),

  getGroupMembers: (groupId: number): Promise<AxiosResponse<GroupMember[]>> =>
    apiClient.get(`/groups/${groupId}/members`),

  createGroup: (data: GroupCreatePayload): Promise<AxiosResponse<Group>> =>
    apiClient.post('/groups', data),

  updateGroup: (groupId: number, data: GroupUpdatePayload): Promise<AxiosResponse<Group>> =>
    apiClient.put(`/groups/${groupId}`, data),

  deleteGroup: (groupId: number): Promise<AxiosResponse<ApiMessage>> =>
    apiClient.delete(`/groups/${groupId}`),

  addMember: (groupId: number, studentId: number): Promise<AxiosResponse<ApiMessage>> =>
    apiClient.post(`/groups/${groupId}/members`, { student_id: studentId }),

  removeMember: (groupId: number, studentId: number): Promise<AxiosResponse<ApiMessage>> =>
    apiClient.delete(`/groups/${groupId}/members/${studentId}`),

  createStudentDirectChat: (targetStudentId: number): Promise<AxiosResponse<Group>> =>
    apiClient.post('/groups/direct/student', { target_student_id: targetStudentId }),

  createUserDirectChat: (targetUserId: number): Promise<AxiosResponse<Group>> =>
    apiClient.post('/groups/direct/user', { target_user_id: targetUserId }),
};

export { apiClient, API_BASE_URL };
