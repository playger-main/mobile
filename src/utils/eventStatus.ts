// src/utils/eventStatus.ts

/**
 * Утилита для вычисления статуса события:
 *  - upcoming: ещё не началось
 *  - active:   идёт прямо сейчас
 *  - finished: уже закончилось
 *
 * Принимает:
 *   date       — "2026-09-21" (ISO)
 *   startTime  — "18:00"
 *   duration   — "90 min" | "1.5 hours" | "60m" | "2 hours"
 */
export type EventStatus = 'upcoming' | 'active' | 'finished';

/**
 * Парсит строку duration в минуты.
 * Поддерживает: "90 min", "90m", "1.5 hours", "2h", "1.5h", "2 hours".
 * Если не удалось распарсить — возвращает 60 (дефолт).
 */
export const parseDurationToMinutes = (duration: string): number => {
  if (!duration) return 60;

  const normalized = duration.toLowerCase().trim();

  // Часы: "1.5 hours", "2h", "1 hour", "2 hours"
  const hoursMatch = normalized.match(/([\d.]+)\s*(h|hour|hours)/);
  if (hoursMatch) {
    return Math.round(parseFloat(hoursMatch[1]) * 60);
  }

  // Минуты: "90 min", "90m", "90 minutes"
  const minutesMatch = normalized.match(/([\d.]+)\s*(m|min|minutes)/);
  if (minutesMatch) {
    return Math.round(parseFloat(minutesMatch[1]));
  }

  // Просто число — считаем минутами
  const numberMatch = normalized.match(/^([\d.]+)$/);
  if (numberMatch) {
    return Math.round(parseFloat(numberMatch[1]));
  }

  return 60;
};

/**
 * Вычисляет статус события.
 */
export const getEventStatus = (
  date: string,
  startTime: string,
  duration: string,
): EventStatus => {
  try {
    // Собираем дату+время начала
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
 * Человекочитаемый label статуса.
 */
export const getEventStatusLabel = (status: EventStatus): string => {
  switch (status) {
    case 'upcoming':
      return 'Upcoming';
    case 'active':
      return 'Active';
    case 'finished':
      return 'Finished';
  }
};

/**
 * Стили бейджа статуса (bg + text).
 */
export const getEventStatusStyle = (
  status: EventStatus,
): { bg: string; text: string } => {
  switch (status) {
    case 'upcoming':
      return { bg: '#EBF3FF', text: '#208AEF' }; // голубой
    case 'active':
      return { bg: '#EAF9F5', text: '#27AE60' }; // зелёный
    case 'finished':
      return { bg: '#F1F3F5', text: '#86909C' }; // серый
  }
};
