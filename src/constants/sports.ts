// src/constants/sports.ts

/**
 * Список видов спорта для площадок.
 */
export const SPORT_OPTIONS = [
  { id: 'basketball', label: 'Basketball', icon: 'basketball-outline' },
  { id: 'football', label: 'Football', icon: 'football-outline' },
  { id: 'tennis', label: 'Tennis', icon: 'tennisball-outline' },
  { id: 'volleyball', label: 'Volleyball', icon: 'basketball-outline' },
  { id: 'pickleball', label: 'Pickleball', icon: 'trophy-outline' },
  { id: 'skateboarding', label: 'Skatepark', icon: 'bicycle-outline' },
  { id: 'running', label: 'Running', icon: 'walk-outline' },
] as const;

/**
 * ✅ Явный интерфейс вместо юниона из `as const`.
 * Это позволяет возвращать fallback-объект без ошибок TS.
 */
export interface SportOption {
  id: string;
  label: string;
  icon: string;
}

export type SportId = (typeof SPORT_OPTIONS)[number]['id'];

/**
 * Специальная "псевдо-категория" для фильтра "All sports".
 */
export const ALL_SPORTS_OPTION: SportOption = {
  id: 'all',
  label: 'All sports',
  icon: 'grid-outline',
};

/**
 * Полный список категорий для фильтра (включая "All sports").
 */
export const SPORT_CATEGORIES: SportOption[] = [ALL_SPORTS_OPTION, ...SPORT_OPTIONS];

/**
 * Находит опцию спорта по id (без учёта регистра).
 * Если не находит — возвращает fallback-объект.
 */
export const getSportOption = (sportId: string): SportOption => {
  const normalized = sportId.toLowerCase().trim();
  const found = SPORT_OPTIONS.find((s) => s.id === normalized);

  if (found) return found;

  // Fallback для неизвестных видов спорта
  return {
    id: normalized,
    label: sportId.charAt(0).toUpperCase() + sportId.slice(1),
    icon: 'fitness-outline',
  };
};

/**
 * Возвращает иконку Ionicons для вида спорта.
 */
export const getSportIcon = (sportId: string): string =>
  getSportOption(sportId).icon;

/**
 * Возвращает человекочитаемое название вида спорта.
 */
export const getSportLabel = (sportId: string): string =>
  getSportOption(sportId).label;