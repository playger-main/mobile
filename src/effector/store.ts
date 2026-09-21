// src/effector/store.ts

// 1. Экспортируем фильтры
export { $searchQuery, $selectedCategory, $selectedDate } from './domains/filter';

// 2. Экспортируем серверные данные
export { 
  $grounds, 
  $isGroundsLoading, 
  $groundsError, 
  $currentGround, 
  $isGroundDetailLoading, 
  $currentGroundEvents, 
  $events, 
  $isEventsLoading, 
  $filteredEvents, 
  $currentEvent, 
  $isEventDetailLoading, 
  $currentDayEvents 
} from './domains/data';

// 3. Экспортируем данные авторизации и интерфейс пользователя
// Добавьте к экспортам из домена auth:
export { 
  $authStep, 
  $userSession, 
  $accessToken, 
  $isAuthSubmitting, 
  $isHydrating, 
  hydrateSessionFx 
} from './domains/auth';

// ✅ ДОБАВЬТЕ ЭКСПОРТ ЭФФЕКТА ИЗ АСИНХРОННОГО ФАЙЛА
export { verifyCodeFx } from './events/async/auth';
export type { SessionUser } from './domains/auth';

// Экспортируем сторы и экшены настроек
export { 
  $eventReminders, 
  $useLocation, 
  $appLanguage, 
  toggleEventReminders, 
  toggleUseLocation, 
  changeLanguage,
  hydrateSettingsFx 
} from './domains/settings';