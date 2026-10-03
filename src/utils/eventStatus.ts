// src/utils/eventStatus.ts

export type EventStatus = 'upcoming' | 'active' | 'finished';

type Theme = 'light' | 'dark';

interface StatusPalette {
  light: { bg: string; text: string };
  dark: { bg: string; text: string };
}

export const parseDurationToMinutes = (duration: string): number => {
  if (!duration) return 60;
  const normalized = duration.toLowerCase().trim();

  const hoursMatch = normalized.match(/([\d.]+)\s*(h|hour|hours)/);
  if (hoursMatch) return Math.round(parseFloat(hoursMatch[1]) * 60);

  const minutesMatch = normalized.match(/([\d.]+)\s*(m|min|minutes)/);
  if (minutesMatch) return Math.round(parseFloat(minutesMatch[1]));

  const numberMatch = normalized.match(/^([\d.]+)$/);
  if (numberMatch) return Math.round(parseFloat(numberMatch[1]));

  return 60;
};

export const getEventStatus = (
  date: string,
  startTime: string,
  duration: string,
): EventStatus => {
  try {
    const startDate = new Date(`${date}T${startTime}:00`);
    if (isNaN(startDate.getTime())) return 'upcoming';

    const durationMinutes = parseDurationToMinutes(duration);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
    const now = new Date();

    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'active';
    return 'finished';
  } catch {
    return 'upcoming';
  }
};

/**
 * ✅ Возвращает КЛЮЧ перевода, а не текст.
 * В компонентах использовать так:
 *   const statusLabel = t(getEventStatusLabelKey(status));
 */
export const getEventStatusLabelKey = (status: EventStatus): string => {
  switch (status) {
    case 'upcoming': return 'status.event.upcoming';
    case 'active':   return 'status.event.active';
    case 'finished': return 'status.event.finished';
  }
};

/**
 * ⚠️ Legacy: возвращает английский текст.
 * Оставлено для обратной совместимости — если где-то ещё не
 * переведено на i18n. В новом коде используйте getEventStatusLabelKey.
 */
export const getEventStatusLabel = (status: EventStatus): string => {
  switch (status) {
    case 'upcoming': return 'Upcoming';
    case 'active':   return 'Active';
    case 'finished': return 'Finished';
  }
};

// ============================================================
// СТИЛИ (с учётом темы)
// ============================================================

const STATUS_PALETTES: Record<EventStatus, StatusPalette> = {
  upcoming: {
    light: { bg: '#EBF3FF', text: '#208AEF' },
    dark: { bg: '#16283D', text: '#3A9BF5' },
  },
  active: {
    light: { bg: '#EAF9F5', text: '#27AE60' },
    dark: { bg: '#14301F', text: '#3DCB78' },
  },
  finished: {
    light: { bg: '#F1F3F5', text: '#86909C' },
    dark: { bg: '#2A3038', text: '#6E7A8F' },
  },
};

/**
 * ✅ Учитывает тему.
 * Вызов: getEventStatusStyle(status, theme)
 */
export const getEventStatusStyle = (
  status: EventStatus,
  theme: Theme = 'light',
): { bg: string; text: string } => {
  return STATUS_PALETTES[status][theme];
};