// src/effector/domains/filter.ts
import { createDomain } from 'effector';
import { setSearchQuery, setSelectedCategory, setSelectedDate } from '../events/sync';
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
