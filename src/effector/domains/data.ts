// src/effector/domains/data.ts
import { createDomain, combine } from 'effector';
import { ExtendedGroundItem } from '@/components/ui/CardGround';
import { clearGrounds, toggleFavoriteInStore } from '../events/sync';
import { $selectedDate } from './filter';

import {
  fetchGroundByIdFx,
  fetchGroundsFx,
  createGroundFx,
  confirmGroundFx,
  deleteGroundFx,
  GroundDetailItem,
  updateGroundFx,
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

// ================== ПЛОЩАДКИ ==================

export const $grounds = dataDomain
  .createStore<ExtendedGroundItem[]>([])
  .on(fetchGroundsFx.doneData, (_, payload) => payload)
  .on(fetchGroundsFx.failData, () => [])
  .on(clearGrounds, () => [])
  .on(toggleFavoriteInStore, (state, id) =>
    state.map((item: any) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
  )
  .on(createGroundFx.doneData, (state, newGround) => {
    const extendedGround: ExtendedGroundItem = {
      ...newGround,
      // Уже есть: createdAt, updatedAt, creator
      eventsCount: 0,
      isFavorite: false,
      avgRating: 0,
      distanceMeters: undefined,
      // amenities, confirmed тоже есть
    };
    return [extendedGround, ...state];
  })
  .on(updateGroundFx.doneData, (state, updated) =>
    // Если это currentGround — обновится через отдельный стор ниже
    state,
  )
  .on(confirmGroundFx.doneData, (state, updated) =>
    state.map((item) =>
      item.id === updated.id ? { ...item, confirmed: updated.confirmed } : item,
    ),
  )
  .on(deleteGroundFx.done, (state, { params: id }) => state.filter((item) => item.id !== id));

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

// ✅ Стор для неподтверждённых площадок (для модерации)
export const $pendingGrounds = dataDomain
  .createStore<ExtendedGroundItem[]>([])
  .on(fetchGroundsFx.doneData, (_, payload) =>
    // Фильтруем на клиенте: показываем только неподтверждённые
    // (сервер отдаёт их модератору в общем списке)
    payload.filter((g) => g.confirmed === false),
  )
  .on(confirmGroundFx.doneData, (state, updated) =>
    // После подтверждения убираем из pending
    state.filter((item) => item.id !== updated.id),
  )
  .on(deleteGroundFx.done, (state, { params: id }) =>
    state.filter((item) => item.id !== id),
  );

export const $isPendingLoading = dataDomain
  .createStore<boolean>(false)
  .on(fetchGroundsFx, () => true)
  .on(fetchGroundsFx.finally, () => false);

// ================== СОБЫТИЯ ==================

export const $currentGroundEvents = dataDomain
  .createStore<RealEventItem[]>([])
  .on(fetchEventsByGroundIdFx.doneData, (_, payload) => payload)
  .on(fetchEventsByGroundIdFx.failData, () => []);

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