// src/hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { useUnit } from 'effector-react';
import { $themeMode } from '@/effector/store';
import type { ThemeMode } from '@/effector/domains/settings';
import { AppThemeColors, type AppColors } from '@/constants/theme';

export type EffectiveTheme = 'light' | 'dark';

export function useTheme(): {
  theme: EffectiveTheme;
  colors: AppColors;
  mode: ThemeMode;
} {
  const mode = useUnit($themeMode);
  const systemScheme = useColorScheme();

  // ✅ Явная нормализация: только 'dark' → 'dark', всё остальное ('light', 'unspecified', null) → 'light'
  const theme: EffectiveTheme =
    mode === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : mode;

  return {
    theme,
    colors: AppThemeColors[theme],
    mode,
  };
}