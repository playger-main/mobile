// src/effector/events/sync.ts
import { createEvent } from 'effector';

// ==========================================
// ПЛОЩАДКИ
// ==========================================
export const clearGrounds = createEvent();
export const toggleFavoriteInStore = createEvent<string>();

// ==========================================
// ФИЛЬТРЫ И ПОИСК
// ==========================================
export const setSearchQuery = createEvent<string>();
export const setSelectedCategory = createEvent<string>();
export const setSelectedDate = createEvent<string>();

// ==========================================
// АВТОРИЗАЦИЯ
// ==========================================
export const setAuthStep = createEvent<
  'welcome' | 'signin' | 'signup' | 'verify' | 'forgot' | 'reset'
>();
export const logout = createEvent();

// ✅ №21-23: сессия истекла (refresh не удался)
export const sessionExpired = createEvent();

// ==========================================
// ГЕОЛОКАЦИЯ
// ==========================================
export const setUserLocation = createEvent<{
  latitude: number;
  longitude: number;
} | null>();

export const setLocationPermission = createEvent<
  'granted' | 'denied' | 'undetermined'
>();

export const clearUserLocation = createEvent();

// ==========================================
// ФОКУС НА КАРТЕ (переход с другого экрана)
// ==========================================
export const setMapFocusTarget = createEvent<{
  latitude: number;
  longitude: number;
  zoom?: number;
}>();
export const clearMapFocusTarget = createEvent();

// ==========================================
// ВИДИМОСТЬ СПИСКА КЛАСТЕРА
// ==========================================
export const setClusterSheetVisible = createEvent<boolean>();

// ==========================================
// ✅ №6: ВИДИМАЯ ОБЛАСТЬ КАРТЫ (bbox)
// ==========================================
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export const setMapVisibleBounds = createEvent<MapBounds | null>();
export const clearMapVisibleBounds = createEvent();

// ==========================================
// ✅ Фильтр по локации
// ==========================================
export type LocationFilter = 'all' | 'visible' | 'near' | 'city';

export const setLocationFilter = createEvent<LocationFilter>();