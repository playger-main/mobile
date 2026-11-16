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

/**
 * Независимые признаки площадки. Нужны для фильтров: площадка с событием
 * сегодня И завтра должна попадать в оба фильтра, поэтому уровень
 * (одно значение) для этого не подходит.
 */
export interface GroundEventFlags {
  /** есть незавершённое событие сегодня */
  today: boolean;
  /** есть незавершённое событие завтра или позже */
  upcoming: boolean;
}

export const getGroundEventFlags = (
  events: ServerEventItem[],
): GroundEventFlags => {
  const flags: GroundEventFlags = { today: false, upcoming: false };
  if (!events || events.length === 0) return flags;

  const today = getTodayString();

  for (const event of events) {
    const status = getEventStatus(event.date, event.startTime, event.duration);
    if (status === 'finished') continue;

    // идёт сейчас (даже если началось вчера) или запланировано на сегодня
    if (status === 'active' || event.date === today) flags.today = true;
    else flags.upcoming = true;
  }

  return flags;
};

export const getGroundActivityLevel = (
  events: ServerEventItem[],
): GroundActivityLevel => {
  const flags = getGroundEventFlags(events);
  if (flags.today) return 'active';
  if (flags.upcoming) return 'upcoming';
  return 'none';
};

/** Событие идёт прямо сейчас (для бейджей/подписей, где нужна строгость) */
export const isEventActiveNow = (event: ServerEventItem): boolean =>
  getEventStatus(event.date, event.startTime, event.duration) === 'active';

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
