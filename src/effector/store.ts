// src/effector/store.ts

// ==========================================
// 1. ФИЛЬТРЫ И ПОИСК
// ==========================================
export { $searchQuery, $selectedCategory, $selectedDate } from './domains/filter';

// ==========================================
// 2. ДАННЫЕ (ПЛОЩАДКИ, СОБЫТИЯ)
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
  $upcomingEventsCountByGround,
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
// 3. АВТОРИЗАЦИЯ
// ==========================================
export {
  $authStep,
  $userSession,
  $accessToken,
  $isAuthSubmitting,
  $isHydrating,
  hydrateSessionFx,
} from './domains/auth';

export {
  verifyCodeFx,
  signUpFx,
  signInFx,
  resendCodeFx,
} from './events/async/auth';

export type { SessionUser } from './domains/auth';

// ==========================================
// 3b. ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ (NEW)
// ==========================================
export {
  fetchMyProfileFx,
  updateProfileFx,
  requestEmailChangeFx,
  confirmEmailChangeFx,
  updateAvatarFx,
  uploadUserPhotoFx,
  deleteUserPhotoFx,
} from './events/async/users';

export type {
  ServerUserProfile,
  UpdateProfilePayload,
} from './events/async/users';

// ==========================================
// 3c. СПИСКИ ПОЛЬЗОВАТЕЛЯ (NEW)
// ==========================================
export {
  fetchMyCreatedEventsFx,
  fetchMyJoinedEventsFx,
  fetchMyFavoriteGroundsFx,
  addFavoriteFx,
  removeFavoriteFx,
} from './events/async/userLists';

export {
  $myCreatedEvents,
  $myJoinedEvents,
  $myFavoriteGrounds,
  $isMyCreatedLoading,
  $isMyJoinedLoading,
  $isMyFavoritesLoading,
} from './domains/userLists';

// ==========================================
// 4. НАСТРОЙКИ
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
// 5. ГЕОЛОКАЦИЯ И ГОРОД
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
// 6. SYNC-СОБЫТИЯ
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