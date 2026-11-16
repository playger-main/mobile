// src/utils/groundActivity.ts
import { ServerEventItem } from '@/effector/events/async/events';
import { getEventStatus } from './eventStatus';
import { getTodayString } from './getTodayString';

/**
 * ✅ Единая цветовая логика приложения (карта, кластеры, карточки, фильтр):
 *
 *   active   — есть событие СЕГОДНЯ (идёт сейчас или начнётся позже сегодня) → зелёный, «молния»
 *   upcoming — события только на будущие дни (завтра и дальше)              → оранжевый, «календарь»
 *   none     — событий сегодня или в будущем нет                            → синий / без бейджа
 */
export type GroundActivityLevel = 'active' | 'upcoming' | 'none';

/** Событие уже закончилось — не влияет ни на цвет, ни на счётчик */
const isFinished = (event: ServerEventItem): boolean =>
  getEventStatus(event.date, event.startTime, event.duration) === 'finished';

/** Событие идёт прямо сейчас */
export const isEventActiveNow = (event: ServerEventItem): boolean =>
  getEventStatus(event.date, event.startTime, event.duration) === 'active';

/** Событие запланировано на сегодня (по локальной дате) */
const isToday = (event: ServerEventItem): boolean =>
  event.date === getTodayString();

export const getGroundActivityLevel = (
  events: ServerEventItem[],
): GroundActivityLevel => {
  if (!events || events.length === 0) return 'none';

  let hasFuture = false;

  for (const event of events) {
    if (isFinished(event)) continue;

    // идёт сейчас или запланировано на сегодня → «сегодня»
    if (isEventActiveNow(event) || isToday(event)) return 'active';

    hasFuture = true;
  }

  return hasFuture ? 'upcoming' : 'none';
};

/** ✅ Строгая проверка «идёт прямо сейчас» — для фильтра «Сейчас идёт» */
export const hasEventActiveNow = (events: ServerEventItem[]): boolean =>
  (events ?? []).some(isEventActiveNow);

export const ACTIVITY_COLORS: Record<
  GroundActivityLevel,
  { bg: string; border: string; text: string }
> = {
  active: { bg: '#27AE60', border: '#1E8449', text: '#FFFFFF' },
  upcoming: { bg: '#FF8000', border: '#CC6600', text: '#FFFFFF' },
  none: { bg: '#208AEF', border: '#006EE6', text: '#FFFFFF' },
};

/** ✅ Иконки статуса: молния — сегодня, календарь — будущие дни */
export const ACTIVITY_ICONS: Record<GroundActivityLevel, string> = {
  active: 'flash',
  upcoming: 'calendar',
  none: 'calendar-outline',
};

/**
 * ✅ Ключи перевода для уровня активности.
 * Существуют ключи:
 *   - status.ground.active
 *   - status.ground.upcoming
 *   - status.ground.none
 */
export const getActivityLabelKey = (level: GroundActivityLevel): string => {
  switch (level) {
    case 'active': return 'status.ground.active';
    case 'upcoming': return 'status.ground.upcoming';
    case 'none': return 'status.ground.none';
  }
};
