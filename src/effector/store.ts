// src\effector\store.ts
import { createDomain } from 'effector';
import { ExtendedGroundItem } from '@/components/ui/CardGround';

// Импорт синхронных экшенов
import { 
  clearGrounds, 
  toggleFavoriteInStore, 
  setSearchQuery, 
  setSelectedCategory 
} from './events/sync';

// Импорт асинхронных эффектов
import { fetchGroundsFx } from './events/async/grounds';

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
