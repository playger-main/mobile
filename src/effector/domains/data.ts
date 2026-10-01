// src/effector/domains/data.ts
import { createDomain, combine } from 'effector';

import { ExtendedGroundItem } from '@/components/ui/CardGround';
import { clearGrounds, toggleFavoriteInStore } from '../events/sync';
import { $selectedDate } from './filter';
import { getEventStatus } from '@/utils/eventStatus';

import {
  fetchGroundByIdFx,
  fetchGroundsFx,
  createGroundFx,
  updateGroundFx,
  confirmGroundFx,
  deleteGroundFx,
  GroundDetailItem,
} from '../events/async/grounds';

import {
  fetchAllEventsFx,
  fetchEventsByGroundIdFx,
  fetchEventByIdFx,
  RealEventItem,
  ServerEventItem,
  DetailedEventItem,
  toggleJoinEventFx,
  updateEventFx,
} from '../events/async/events';

const dataDomain = createDomain('data');

// ==========================================
// ПЛОЩАДКИ
// ==========================================

export const $grounds = dataDomain
  .createStore<ExtendedGroundItem[]>([])
  .on(fetchGroundsFx.doneData, (_, payload) => payload)
  .on(fetchGroundsFx.failData, () => [])
  .on(clearGrounds, () => [])
  .on(toggleFavoriteInStore, (state, id) =>
    state.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
    ),
  )
  .on(createGroundFx.doneData, (state, newGround) => {
    const extendedGround: ExtendedGroundItem = {
      ...newGround,
      eventsCount: 0,
      isFavorite: false,
      avgRating: 0,
      distanceMeters: undefined,
    };
    return [extendedGround, ...state];
  })
  // ✅ После редактирования — обновляем avatar/photos, сохраняем остальные поля
  .on(updateGroundFx.doneData, (state, updated) =>
    state.map((g) =>
      g.id === updated.id
        ? {
            ...g,
            name: updated.name ?? g.name,
            address: updated.address ?? g.address,
            confirmed: updated.confirmed ?? g.confirmed,
            avatar: updated.avatar,
            avatarPath: updated.avatarPath,
            photos: updated.photos,
            photoPaths: updated.photoPaths,
            photoIds: updated.photoIds,
            updatedAt: updated.updatedAt,
          }
        : g,
    ),
  )
  // ✅ Когда открыли детали — синхронизируем список
  .on(fetchGroundByIdFx.doneData, (state, fresh) =>
    state.map((g) =>
      g.id === fresh.id
        ? {
            ...g,
            name: fresh.name ?? g.name,
            address: fresh.address ?? g.address,
            avatar: fresh.avatar,
            avatarPath: fresh.avatarPath,
            photos: fresh.photos,
            photoPaths: fresh.photoPaths,
            photoIds: fresh.photoIds,
            updatedAt: fresh.updatedAt,
          }
        : g,
    ),
  )
  .on(confirmGroundFx.doneData, (state, updated) =>
    state.map((item) =>
      item.id === updated.id ? { ...item, confirmed: updated.confirmed } : item,
    ),
  )
  .on(deleteGroundFx.done, (state, { params: id }) =>
    state.filter((item) => item.id !== id),
  );

export const $isGroundsLoading = dataDomain
  .createStore<boolean>(false)
  .on(fetchGroundsFx, () => true)
  .on(fetchGroundsFx.finally, () => false);

export const $groundsError = dataDomain
  .createStore<string | null>(null)
  .on(fetchGroundsFx.failData, (_, error: any) => error.message || 'Ошибка сети')
  .on(fetchGroundsFx, () => null);

export const $currentGround = dataDomain
  .createStore<GroundDetailItem | null>(null)
  .on(fetchGroundByIdFx.doneData, (_, payload) => payload)
  .on(fetchGroundByIdFx.failData, () => null)
  .on(updateGroundFx.doneData, (_, updated) => updated);

export const $isGroundDetailLoading = dataDomain
  .createStore<boolean>(false)
  .on(fetchGroundByIdFx, () => true)
  .on(fetchGroundByIdFx.finally, () => false);

export const $currentGroundEvents = dataDomain
  .createStore<RealEventItem[]>([])
  .on(fetchEventsByGroundIdFx.doneData, (_, payload) => payload)
  .on(fetchEventsByGroundIdFx.failData, () => []);

// ✅ Стор для неподтверждённых площадок (для модерации)
export const $pendingGrounds = dataDomain
  .createStore<ExtendedGroundItem[]>([])
  .on(fetchGroundsFx.doneData, (_, payload) =>
    payload.filter((g) => g.confirmed === false),
  )
  .on(updateGroundFx.doneData, (state, updated) => {
    if (updated.confirmed !== false) {
      return state.filter((item) => item.id !== updated.id);
    }
    return state.map((item) =>
      item.id === updated.id ? { ...item, ...updated } : item,
    );
  })
  .on(confirmGroundFx.doneData, (state, updated) =>
    state.filter((item) => item.id !== updated.id),
  )
  .on(deleteGroundFx.done, (state, { params: id }) =>
    state.filter((item) => item.id !== id),
  );

export const $isPendingLoading = dataDomain
  .createStore<boolean>(false)
  .on(fetchGroundsFx, () => true)
  .on(fetchGroundsFx.finally, () => false);

// ==========================================
// СОБЫТИЯ
// ==========================================

export const $events = dataDomain
  .createStore<ServerEventItem[]>([])
  .on(fetchAllEventsFx.doneData, (_, payload) => payload)
  .on(fetchAllEventsFx.failData, () => []);

export const $isEventsLoading = dataDomain
  .createStore<boolean>(false)
  .on(fetchAllEventsFx, () => true)
  .on(fetchAllEventsFx.finally, () => false);

export const $filteredEvents = dataDomain.createStore<ServerEventItem[]>([]);

export const $currentEvent = dataDomain
  .createStore<DetailedEventItem | null>(null)
  .on(fetchEventByIdFx.doneData, (_, payload) => payload)
  .on(fetchEventByIdFx.failData, () => null)
  .on(toggleJoinEventFx.doneData, (_, payload) => payload)
  .on(updateEventFx.doneData, (_, payload) => payload);

export const $isEventDetailLoading = dataDomain
  .createStore<boolean>(false)
  .on(fetchEventByIdFx, () => true)
  .on(fetchEventByIdFx.finally, () => false);

export const $currentDayEvents = combine(
  $events,
  $selectedDate,
  (events, selectedDate) => events.filter((evt) => evt.date === selectedDate),
);

// ==========================================
// ПРОИЗВОДНЫЕ СТОРЫ
// ==========================================

// ✅ Количество предстоящих/активных событий на площадке
export const $upcomingEventsCountByGround = $events.map((events) => {
  const map: Record<string, number> = {};
  for (const e of events) {
    const groundId = e.ground?.id;
    if (!groundId) continue;
    const status = getEventStatus(e.date, e.startTime, e.duration);
    if (status !== 'finished') {
      map[groundId] = (map[groundId] || 0) + 1;
    }
  }
  return map;
});