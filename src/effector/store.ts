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
  forgotPasswordFx,
  resetPasswordFx,
} from './events/async/auth';

export type { SessionUser } from './domains/auth';

// ==========================================
// 3b. ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
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
// 3c. СПИСКИ ПОЛЬЗОВАТЕЛЯ
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

export { fetchPublicUserFx } from './events/async/userPublic';
export type { PublicUserProfile } from './events/async/userPublic';

export {
  $viewedUser,
  $isViewedUserLoading,
} from './domains/userPublic';

// ==========================================
// 4. НАСТРОЙКИ
// ==========================================
export {
  $eventReminders,
  $useLocation,
  $appLanguage,
  $themeMode,
  toggleEventReminders,
  toggleUseLocation,
  changeLanguage,
  changeThemeMode,
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
  $mapVisibleBounds,
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
  setMapVisibleBounds,
  clearMapVisibleBounds,
  setSearchQuery,
  setSelectedCategory,
  setSelectedDate,
  setAuthStep,
  logout,
  sessionExpired,
  clearGrounds,
  toggleFavoriteInStore,
} from './events/sync';

export type { MapBounds } from './events/sync';

// ==========================================
// 7. ОТЗЫВЫ
// ==========================================
export {
  fetchGroundReviewsFx,
  fetchMyReviewFx,
  fetchMyReviewsFx,
  createReviewFx,
  updateReviewFx,
  deleteReviewFx,
} from './events/async/reviews';

export type {
  GroundReview,
  ReviewStats,
  ReviewAuthor,
  MyReview,
} from './events/async/reviews';

export {
  $groundReviews,
  $groundReviewStats,
  $isReviewsLoading,
  $myReview,
  $canCreateReview,
  $hasMyReview,
  $myReviews,
  $myReviewsCount,
  $isMyReviewsLoading,
} from './domains/reviews';

// ==========================================
// 8. МОДЕРАЦИЯ (форма)
// ==========================================
export {
  $moderateForm,
  $moderateHasChanges,
  $moderateIsValid,
  $moderateActiveLang,
  moderateFormInitialized,
  moderateFormReset,
  moderateFieldChanged,
  moderateSportsChanged,
  moderateCoverageChanged,
  moderateAmenitiesChanged,
  moderateGeolocationChanged,
  moderatePhotosChanged,
  moderateActiveLangChanged,
  moderateTranslateChanged,
  moderateCopyOriginalToActiveLang,
} from './domains/moderateGround';

export type { ModerateFormState } from './domains/moderateGround';