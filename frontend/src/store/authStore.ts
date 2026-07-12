import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'parent' | 'student';
}

interface Student {
  id: number;
  username: string;
  display_name: string;
  age_group: string;
  avatar_url?: string | null;
  current_level: number;
  total_points: number;
}

interface AuthState {
  user: User | null;
  student: Student | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setStudent: (student: Student) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updateStudent: (student: Partial<Student>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      student: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      setStudent: (student) => {
        set({ student });
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({
          user: null,
          student: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      updateStudent: (studentData) => {
        set((state) => ({
          student: state.student ? { ...state.student, ...studentData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
