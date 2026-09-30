// src/effector/store.ts

// ==========================================
// 1. ДОМЕН: ФИЛЬТРЫ И ПОИСК
// ==========================================
export { $searchQuery, $selectedCategory, $selectedDate } from './domains/filter';

// ==========================================
// 2. ДОМЕН: СЕРВЕРНЫЕ ДАННЫЕ (ПЛОЩАДКИ И СОБЫТИЯ)
// ==========================================
export {
  $grounds,
  $isGroundsLoading,
  $groundsError,
  $currentGround,
  $isGroundDetailLoading,
  $currentGroundEvents,
  $pendingGrounds,
  $isPendingLoading,
  $events,
  $isEventsLoading,
  $filteredEvents,
  $currentEvent,
  $isEventDetailLoading,
  $currentDayEvents,
} from './domains/data';

export {
  fetchGroundsFx,
  fetchGroundByIdFx,
  createGroundFx,
  updateGroundFx,
  confirmGroundFx,
  deleteGroundFx,
} from './events/async/grounds';

export {
  fetchAllEventsFx,
  fetchEventsByGroundIdFx,
  fetchEventByIdFx,
  createEventFx,
  updateEventFx, 
  toggleJoinEventFx,
} from './events/async/events';

// ==========================================
// 3. ДОМЕН: АВТОРИЗАЦИЯ, СЕССИЯ И ВЕРИФИКАЦИЯ
// ==========================================
export {
  $authStep,
  $userSession,
  $accessToken,
  $isAuthSubmitting,
  $isHydrating,
  hydrateSessionFx,
} from './domains/auth';

export { verifyCodeFx, signUpFx, signInFx, resendCodeFx } from './events/async/auth';
export type { SessionUser } from './domains/auth';

// ==========================================
// 4. ДОМЕН: НАСТРОЙКИ ПРИЛОЖЕНИЯ
// ==========================================
export {
  $eventReminders,
  $useLocation,
  $appLanguage,
  toggleEventReminders,
  toggleUseLocation,
  changeLanguage,
  hydrateSettingsFx,
} from './domains/settings';

// ==========================================
// 5. ДОМЕН: ГЕОЛОКАЦИЯ И ГОРОД
// ==========================================
export {
  $userLocation,
  $locationPermission,
  $currentCity,
  $cityCenter,
  $isDetectingCity,
  $mapCenter,
  $mapFocusTarget,
  $clusterSheetVisible,  
  requestUserLocationFx,
  checkLocationPermissionFx,
  detectCityFx,
} from './domains/location';

// ==========================================
// 6. SYNC-СОБЫТИЯ (для использования в UI)
// ==========================================
export {
  setMapFocusTarget,
  clearMapFocusTarget,
  setClusterSheetVisible,
  setSearchQuery,
  setSelectedCategory,
  setSelectedDate,
  setAuthStep,
  logout,
  clearGrounds,
  toggleFavoriteInStore,
} from './events/sync';