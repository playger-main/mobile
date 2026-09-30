// src/effector/store.ts

// ==========================================
// 1. ДОМЕН: ФИЛЬТРЫ И ПОИСК
// ==========================================
export { $searchQuery, $selectedCategory, $selectedDate } from './domains/filter';

// ==========================================
// 2. ДОМЕН: СЕРВЕРНЫЕ ДАННЫЕ (ПЛОЩАДКИ И СОБЫТИЯ)
// ==========================================
// Сторы состояния данных и лоадеров
export {
  $grounds,
  $isGroundsLoading,
  $groundsError,
  $currentGround,
  $isGroundDetailLoading,
  $currentGroundEvents,
  $pendingGrounds,     // ✅
  $isPendingLoading,   // ✅
  $events,
  $isEventsLoading,
  $filteredEvents,
  $currentEvent,
  $isEventDetailLoading,
  $currentDayEvents,
} from './domains/data';

// Эффекты площадок
export {
  fetchGroundsFx,
  fetchGroundByIdFx,
  createGroundFx,
  confirmGroundFx,     // ✅
  deleteGroundFx,      // ✅
} from './events/async/grounds';

export { 
  fetchAllEventsFx, 
  fetchEventsByGroundIdFx, 
  fetchEventByIdFx,
  createEventFx,
  toggleJoinEventFx
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
  hydrateSessionFx 
} from './domains/auth';

export { verifyCodeFx, signUpFx, signInFx, resendCodeFx } from './events/async/auth';
export type { SessionUser } from './domains/auth';

// ==========================================
// 4. ДОМЕН: НАСТРОЙКИ ПРИЛОЖЕНИЯ (ЛОКАЛЬНАЯ ПАМЯТЬ)
// ==========================================
export { 
  $eventReminders, 
  $useLocation, 
  $appLanguage, 
  toggleEventReminders, 
  toggleUseLocation, 
  changeLanguage,
  hydrateSettingsFx 
} from './domains/settings';
