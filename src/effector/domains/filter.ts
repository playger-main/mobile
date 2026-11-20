// src/effector/domains/filter.ts
import { createDomain } from 'effector';
import {
  setSearchQuery,
  setSelectedCategory,
  setSelectedDate,
  setLocationFilter,
  setEventFilter,
} from '../events/sync';
import type { EventFilter, LocationFilter } from '../events/sync';
import { toggleUseLocation } from './settings';
import { getTodayString } from '@/utils/getTodayString';

const filterDomain = createDomain('filter');

export const $searchQuery = filterDomain
  .createStore<string>('')
  .on(setSearchQuery, (_, value) => value);

export const $selectedCategory = filterDomain
  .createStore<string>('all')
  .on(setSelectedCategory, (_, value) => value);

export const $selectedDate = filterDomain
  .createStore<string>(getTodayString())
  .on(setSelectedDate, (_, date) => date);

// ✅ Фильтр по локации
export const $locationFilter = filterDomain
  .createStore<LocationFilter>('all')
  .on(setLocationFilter, (_, value) => value)
  // ✅ фильтры «рядом 5 км» и «город 20 км» требуют координат:
  // при выключенной геолокации возвращаемся к «Все площадки»
  .on(toggleUseLocation, (current, enabled) =>
    enabled ? current : current === 'all' || current === 'visible' ? current : 'all',
  );
// ✅ Фильтр по событиям: все площадки / с любыми событиями / только с идущим
export const $eventFilter = filterDomain
  .createStore<EventFilter>('all')
  .on(setEventFilter, (_, value) => value);
