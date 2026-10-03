// src/constants/theme.ts
import '@/global.css';
import { Platform } from 'react-native';

// ============================================================
// 1. СИСТЕМНЫЕ ЦВЕТА (для expo-router ThemeProvider)
// ============================================================

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#0F1115',
    backgroundElement: '#1A1D23',
    backgroundSelected: '#22262E',
    textSecondary: '#9BA8BD',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// ============================================================
// 2. ПАЛИТРА ПРИЛОЖЕНИЯ
// ============================================================

export interface AppColors {
  // Фоны
  background: string;
  surface: string;
  surfaceSecondary: string;
  /** ✅ NEW — фон-подложка для списков (между background и surface) */
  listBackground: string;
  border: string;
  borderSubtle: string;
  disabledBg: string;

  // Текст
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Акценты
  primary: string;
  primaryDark: string;
  primaryBg: string;
  accent: string;
  accentBg: string;
  warning: string;
  warningBg: string;
  danger: string;
  dangerBg: string;

  // Служебные
  overlay: string;
  shadow: string;
}

export const AppThemeColors: Record<'light' | 'dark', AppColors> = {
  light: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceSecondary: '#F8FAFC',
    listBackground: '#F8FAFC', // светло-серый под карточками
    border: '#E6F4FE',
    borderSubtle: '#F0F6FC',
    disabledBg: '#E6EAF0',

    textPrimary: '#334A77',
    textSecondary: '#6080A8',
    textTertiary: '#BACAD6',
    textInverse: '#FFFFFF',

    primary: '#208AEF',
    primaryDark: '#006EE6',
    primaryBg: '#EBF3FF',
    accent: '#27AE60',
    accentBg: '#EAF9F5',
    warning: '#FF8000',
    warningBg: '#FFF8EC',
    danger: '#FF3B30',
    dangerBg: '#FFF5F5',

    overlay: 'rgba(0,0,0,0.4)',
    shadow: '#334A77',
  },
  dark: {
    background: '#0F1115',
    surface: '#1A1D23',
    surfaceSecondary: '#22262E',
    listBackground: '#0F1115', // тот же, что background — карточки (#1A1D23) светлее
    border: '#3A4048',
    borderSubtle: '#272D36',
    disabledBg: '#2A3038',

    textPrimary: '#E8EDF5',
    textSecondary: '#9BA8BD',
    textTertiary: '#6E7A8F',
    textInverse: '#0F1115',

    primary: '#3A9BF5',
    primaryDark: '#208AEF',
    primaryBg: '#16283D',
    accent: '#3DCB78',
    accentBg: '#14301F',
    warning: '#FF9F33',
    warningBg: '#2A1F0F',
    danger: '#FF5A4F',
    dangerBg: '#2A1513',

    overlay: 'rgba(0,0,0,0.6)',
    shadow: '#000000',
  },
};

// ============================================================
// 3. ШРИФТЫ И ОТСТУПЫ
// ============================================================

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 800;