// src/constants/sports.ts

/**
 * Список видов спорта для площадок.
 * ✅ ID используется в БД (поле `kindofsport`).
 * ✅ ID — всегда lowercase.
 * ✅ Иконки — MaterialDesignIcons (@react-native-vector-icons).
 */
export const SPORT_OPTIONS = [
  { id: 'basketball', icon: 'basketball' },
  { id: 'football', icon: 'soccer' },
  { id: 'tennis', icon: 'tennis' },
  { id: 'volleyball', icon: 'volleyball' },
  { id: 'pickleball', icon: 'tennis-ball' },
  { id: 'skateboarding', icon: 'skateboard' },
  { id: 'running', icon: 'run' },
  { id: 'tabletennis', icon: 'table-tennis' },
  { id: 'workout', icon: 'dumbbell' },
  { id: 'hockey', icon: 'hockey-sticks' },
] as const;

export interface SportOption {
  id: string;
  icon: string;
}

export type SportId = (typeof SPORT_OPTIONS)[number]['id'];

export const ALL_SPORTS_OPTION: SportOption = {
  id: 'all',
  icon: 'grid',
};

export const SPORT_CATEGORIES: SportOption[] = [
  ALL_SPORTS_OPTION,
  ...SPORT_OPTIONS,
];

export const getSportKey = (sportId: string): string =>
  `sport.${sportId.toLowerCase().trim()}`;

/**
 * Находит опцию спорта по id.
 * Если не находит — fallback с иконкой fitness.
 */
export const getSportOption = (sportId: string): SportOption => {
  const normalized = sportId.toLowerCase().trim();
  const found = SPORT_OPTIONS.find((s) => s.id === normalized);
  if (found) return found;
  return { id: normalized, icon: 'dumbbell' };
};

export const getSportIcon = (sportId: string): string =>
  getSportOption(sportId).icon;