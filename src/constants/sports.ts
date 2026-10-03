// src/constants/sports.ts

/**
 * Список видов спорта для площадок.
 * ✅ ID используется в БД (поле `kindofsport`).
 * ✅ Label для UI берётся из i18n: t(`sport.${id}`)
 */
export const SPORT_OPTIONS = [
  { id: 'basketball', icon: 'basketball-outline' },
  { id: 'football', icon: 'football-outline' },
  { id: 'tennis', icon: 'tennisball-outline' },
  { id: 'volleyball', icon: 'basketball-outline' },
  { id: 'pickleball', icon: 'trophy-outline' },
  { id: 'skateboarding', icon: 'bicycle-outline' },
  { id: 'running', icon: 'walk-outline' },
] as const;

export interface SportOption {
  id: string;
  icon: string;
}

export type SportId = (typeof SPORT_OPTIONS)[number]['id'];

/**
 * Специальная "псевдо-категория" для фильтра "All sports".
 */
export const ALL_SPORTS_OPTION: SportOption = {
  id: 'all',
  icon: 'grid-outline',
};

/**
 * Полный список категорий для фильтра (включая "All sports").
 */
export const SPORT_CATEGORIES: SportOption[] = [ALL_SPORTS_OPTION, ...SPORT_OPTIONS];

/**
 * Ключ перевода: `sport.basketball`, `sport.all` и т.д.
 */
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
  return { id: normalized, icon: 'fitness-outline' };
};

/**
 * Возвращает иконку Ionicons.
 */
export const getSportIcon = (sportId: string): string =>
  getSportOption(sportId).icon;