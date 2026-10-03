// src/utils/groundActivity.ts
import { ServerEventItem } from '@/effector/events/async/events';
import { getEventStatus } from './eventStatus';

export type GroundActivityLevel = 'active' | 'upcoming' | 'none';

export const getGroundActivityLevel = (
  events: ServerEventItem[],
): GroundActivityLevel => {
  if (!events || events.length === 0) return 'none';
  let hasUpcoming = false;
  for (const e of events) {
    const status = getEventStatus(e.date, e.startTime, e.duration);
    if (status === 'active') return 'active';
    if (status === 'upcoming') hasUpcoming = true;
  }
  return hasUpcoming ? 'upcoming' : 'none';
};

export const ACTIVITY_COLORS: Record<
  GroundActivityLevel,
  { bg: string; border: string; text: string }
> = {
  active: { bg: '#27AE60', border: '#1E8449', text: '#FFFFFF' },
  upcoming: { bg: '#FF8000', border: '#CC6600', text: '#FFFFFF' },
  none: { bg: '#208AEF', border: '#006EE6', text: '#FFFFFF' },
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