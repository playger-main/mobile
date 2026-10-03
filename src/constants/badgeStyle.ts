// src/constants/badgeStyle.ts

type Theme = 'light' | 'dark';

interface SportPalette {
  light: { bg: string; text: string };
  dark: { bg: string; text: string };
}

const PALETTES: Record<string, SportPalette> = {
  basketball: {
    light: { bg: '#D7E9FC', text: '#116CC7' },
    dark: { bg: '#1E3A5F', text: '#7CB8F5' },
  },
  football: {
    light: { bg: '#D9F2E1', text: '#1B7A42' },
    dark: { bg: '#1B3A28', text: '#5FD98A' },
  },
  tennis: {
    light: { bg: '#FFF1CC', text: '#B26A00' },
    dark: { bg: '#3A2E14', text: '#FFCB66' },
  },
  volleyball: {
    light: { bg: '#FFE0D4', text: '#C2410C' },
    dark: { bg: '#3A1E14', text: '#FF9366' },
  },
  pickleball: {
    light: { bg: '#E9DDFF', text: '#6B3EBD' },
    dark: { bg: '#2B1F45', text: '#B498F0' },
  },
  skateboarding: {
    light: { bg: '#FFDBE7', text: '#B3195C' },
    dark: { bg: '#3A1526', text: '#FF7BA8' },
  },
  running: {
    light: { bg: '#D5F3F5', text: '#0E7490' },
    dark: { bg: '#12333A', text: '#5ECFDC' },
  },
};

const DEFAULT_PALETTE: SportPalette = {
  light: { bg: '#D7E9FC', text: '#116CC7' },
  dark: { bg: '#1E3A5F', text: '#7CB8F5' },
};

/**
 * ✅ Теперь учитывает тему.
 * Вызов: getBadgeStyle(sportId, theme)
 */
export const getBadgeStyle = (
  sport: string,
  theme: Theme = 'light',
): { bg: string; text: string } => {
  const key = sport.toLowerCase().trim();
  const palette = PALETTES[key] ?? DEFAULT_PALETTE;
  return palette[theme];
};