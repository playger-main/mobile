// src/effector/domains/data.ts
import { createDomain, combine } from 'effector';
import { ExtendedGroundItem } from '@/components/ui/CardGround';
import { clearGrounds, toggleFavoriteInStore } from '../events/sync';
import { $selectedDate } from './filter'; // Импортируем зависимый стор даты

import { fetchGroundByIdFx, fetchGroundsFx, GroundDetailItem } from '../events/async/grounds';
import { fetchAllEventsFx, fetchEventsByGroundIdFx, fetchEventByIdFx, RealEventItem, ServerEventItem, DetailedEventItem, toggleJoinEventFx } from '../events/async/events';

const dataDomain = createDomain('data');

// --- Сторы площадок ---
export const $grounds = dataDomain
  .createStore<ExtendedGroundItem[]>([])
  .on(fetchGroundsFx.doneData, (_, payload) => payload)
  .on(fetchGroundsFx.failData, () => [])
  .on(clearGrounds, () => [])
  .on(toggleFavoriteInStore, (state, id) =>
    state.map((item: any) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
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
  .on(fetchGroundByIdFx.failData, () => null);

export const $isGroundDetailLoading = dataDomain
  .createStore<boolean>(false)
  .on(fetchGroundByIdFx, () => true)
  .on(fetchGroundByIdFx.finally, () => false);

// --- Сторы событий ---
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
  .on(toggleJoinEventFx.doneData, (_, payload) => payload);

export const $isEventDetailLoading = dataDomain
  .createStore<boolean>(false)
  .on(fetchEventByIdFx, () => true)
  .on(fetchEventByIdFx.finally, () => false);

// Селектор-комбайн матчей выбранного дня
export const $currentDayEvents = combine(
  $events, $selectedDate,
  (events, selectedDate) => events.filter(evt => evt.date === selectedDate)
);
