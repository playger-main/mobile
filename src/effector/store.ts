// src\effector\store.ts
import { createDomain } from 'effector';
import { combine } from 'effector';

import { ExtendedGroundItem } from '@/components/ui/CardGround';

// Импорт синхронных экшенов
import { 
  clearGrounds, 
  toggleFavoriteInStore, 
  setSearchQuery, 
  setSelectedCategory,
  setSelectedDate
} from './events/sync';

// Импорт асинхронных эффектов
import { fetchGroundByIdFx, fetchGroundsFx, GroundDetailItem } from './events/async/grounds';
import { fetchAllEventsFx, fetchEventsByGroundIdFx, fetchEventByIdFx, RealEventItem, ServerEventItem,  DetailedEventItem } from './events/async/events';
import { getTodayString } from '@/utils/getTodayString';

// ==========================================
// 1. ДОМЕН: ФИЛЬТРЫ И ПОИСК
// ==========================================
const filter = createDomain('filter');

export const $searchQuery = filter
  .createStore<string>('')
  .on(setSearchQuery, (_, value) => value);

export const $selectedCategory = filter
  .createStore<string>('all')
  .on(setSelectedCategory, (_, value) => value);

// ==========================================
// 2. ДОМЕН: ДАННЫЕ С СЕРВЕРА
// ==========================================
const data = createDomain('data');

export const $grounds = data
  .createStore<ExtendedGroundItem[]>([])
  .on(fetchGroundsFx.doneData, (_, payload) => payload)
  .on(fetchGroundsFx.failData, () => [])
  .on(clearGrounds, () => [])
  .on(toggleFavoriteInStore, (state, id) =>
    state.map((item: any) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
  );

export const $isGroundsLoading = data
  .createStore<boolean>(false)
  .on(fetchGroundsFx, () => true)
  .on(fetchGroundsFx.finally, () => false);

export const $groundsError = data
  .createStore<string | null>(null)
  .on(fetchGroundsFx.failData, (_, error: any) => error.message || 'Ошибка сети')
  .on(fetchGroundsFx, () => null);
  
export const $currentGround = data
  .createStore<GroundDetailItem | null>(null)
  .on(fetchGroundByIdFx.doneData, (_, payload) => payload)
  .on(fetchGroundByIdFx.failData, () => null);

export const $isGroundDetailLoading = data
  .createStore<boolean>(false)
  .on(fetchGroundByIdFx, () => true)
  .on(fetchGroundByIdFx.finally, () => false);

export const $currentGroundEvents = data
  .createStore<RealEventItem[]>([])
  .on(fetchEventsByGroundIdFx.doneData, (_, payload) => payload)
  .on(fetchEventsByGroundIdFx.failData, () => []);

export const $selectedDate = filter
  .createStore<string>(getTodayString())
  .on(setSelectedDate, (_, date) => date);

// Стор всех событий с сервера
export const $events = data
  .createStore<ServerEventItem[]>([])
  .on(fetchAllEventsFx.doneData, (_, payload) => payload)
  .on(fetchAllEventsFx.failData, () => []);

export const $isEventsLoading = data
  .createStore<boolean>(false)
  .on(fetchAllEventsFx, () => true)
  .on(fetchAllEventsFx.finally, () => false);

// ⚡️ ВАЖНО: Селектор для автоматической фильтрации событий под выбранный день
export const $filteredEvents = data.createStore<ServerEventItem[]>([]);

// Объединяем сторы: как только меняются все ивенты ИЛИ выбранная дата, 
// filteredEvents автоматически пересчитывается без лишних перерендеров
export const $currentDayEvents = combine(
  $events, $selectedDate,
  (events, selectedDate) => events.filter(evt => evt.date === selectedDate)
);

export const $currentEvent = data
  .createStore<DetailedEventItem | null>(null)
  .on(fetchEventByIdFx.doneData, (_, payload) => payload)
  .on(fetchEventByIdFx.failData, () => null);

export const $isEventDetailLoading = data
  .createStore<boolean>(false)
  .on(fetchEventByIdFx, () => true)
  .on(fetchEventByIdFx.finally, () => false);