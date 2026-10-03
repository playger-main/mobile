// src/utils/eventStatus.ts

export type EventStatus = 'upcoming' | 'active' | 'finished';

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

export const getEventStatusStyle = (
  status: EventStatus,
): { bg: string; text: string } => {
  switch (status) {
    case 'upcoming': return { bg: '#EBF3FF', text: '#208AEF' };
    case 'active':   return { bg: '#EAF9F5', text: '#27AE60' };
    case 'finished': return { bg: '#F1F3F5', text: '#86909C' };
  }
};