import { useMemo } from 'react';
import { useAuthStore } from '../store/authStore';

export type AgeGroupThemeKey = 'toddlers' | 'ages_4_9' | 'ages_10_12' | 'teens';

export interface StudentTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  iconStyle: string;
  font: string;
}

export const themes: Record<AgeGroupThemeKey, StudentTheme> = {
  toddlers: {
    primary: 'bg-pink-500',
    secondary: 'bg-orange-400',
    accent: 'bg-amber-400',
    background: 'bg-pink-50',
    cardBg: 'bg-white',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    iconStyle: 'text-pink-500',
    font: 'font-sans',
  },
  ages_4_9: {
    primary: 'bg-purple-500',
    secondary: 'bg-sky-500',
    accent: 'bg-emerald-500',
    background: 'bg-purple-50',
    cardBg: 'bg-white',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    iconStyle: 'text-purple-500',
    font: 'font-sans',
  },
  ages_10_12: {
    primary: 'bg-teal-600',
    secondary: 'bg-cyan-500',
    accent: 'bg-indigo-500',
    background: 'bg-cyan-50',
    cardBg: 'bg-white',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    iconStyle: 'text-teal-600',
    font: 'font-sans',
  },
  teens: {
    primary: 'bg-slate-800',
    secondary: 'bg-violet-600',
    accent: 'bg-fuchsia-500',
    background: 'bg-slate-100',
    cardBg: 'bg-white',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    iconStyle: 'text-slate-700',
    font: 'font-sans',
  },
};

const defaultTheme = themes.ages_4_9;

export function useStudentTheme(): StudentTheme {
  const ageGroup = useAuthStore((state) => state.student?.age_group);

  return useMemo(() => {
    if (!ageGroup) return defaultTheme;
    return themes[ageGroup as AgeGroupThemeKey] ?? defaultTheme;
  }, [ageGroup]);
}
