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
export const setAuthStep = createEvent<'welcome' | 'signin' | 'signup' | 'verify'>();
export const logout = createEvent();

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