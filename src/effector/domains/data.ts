// src/effector/domains/data.ts
import { createDomain, combine } from 'effector';

import { ExtendedGroundItem } from '@/components/ui/CardGround';
import { clearGrounds, logout } from '../events/sync';
import { $selectedDate } from './filter';
import { getEventStatus } from '@/utils/eventStatus';

import {
  fetchGroundByIdFx,
  fetchGroundsFx,
  createGroundFx,
  updateGroundFx,
  confirmGroundFx,
  deleteGroundFx,
  GroundDetailItem,
} from '../events/async/grounds';

import {
  fetchAllEventsFx,
  fetchEventsByGroundIdFx,
  fetchEventByIdFx,
  RealEventItem,
  ServerEventItem,
  DetailedEventItem,
  toggleJoinEventFx,
  updateEventFx,
} from '../events/async/events';

import {
  addFavoriteFx,
  removeFavoriteFx,
  fetchMyFavoriteGroundsFx,
} from '../events/async/userLists';

const dataDomain = createDomain('data');

/**
 * ✅ P2: канонический ключ запроса — нужен для latest-wins гейтинга.
 * Порядок ключей сортируется, чтобы одинаковые параметры давали один ключ.
 */
const requestKey = (params?: unknown): string => {
  if (!params || typeof params !== 'object') return String(params ?? '');
  const entries = Object.entries(params as Record<string, unknown>)
    .filter(([, value]) => value !== undefined && value !== null)
    .sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(entries);
};

/** Ключ последнего запущенного запроса площадок. */
export const $groundsRequestKey = dataDomain
  .createStore<string>('')
  .on(fetchGroundsFx, (_, params) => requestKey(params));

/**
 * ✅ ЕДИНЫЙ источник истины по избранному — список id.
 *
 * Раньше число в профиле (`savedCount` из GET /user/me + арифметика ±1)
 * и сердечки на карточках (флаги из GET /ground + локальный реестр) считались
 * независимо, поэтому могли расходиться. Теперь и число, и сердечки выводятся
 * из одного множества id:
 *   - наполняется полным списком из GET /favorite;
 *   - меняется только подтверждёнными ответами add/remove;
 *   - 409 при добавлении = «уже в избранном», 404 при удалении = «уже нет».
 */
export const $favoriteIds = dataDomain
  .createStore<string[]>([])
  .on(fetchMyFavoriteGroundsFx.doneData, (_, favorites) =>
    favorites.map((ground) => ground.id),
  )
  .on(addFavoriteFx.done, (state, { params: groundId }) =>
    state.includes(groundId) ? state : [...state, groundId],
  )
  .on(removeFavoriteFx.done, (state, { params: groundId, result }) =>
    (result?.deleted ?? 0) > 0
      ? state.filter((id) => id !== groundId)
      : state,
  )
  // 409 = уже в избранном → считаем подтверждённым; прочие ошибки не трогают набор
  .on(addFavoriteFx.fail, (state, { params: groundId, error }) =>
    (error as any)?.response?.status === 409 && !state.includes(groundId)
      ? [...state, groundId]
      : state,
  )
  .on(removeFavoriteFx.fail, (state, { params: groundId, error }) =>
    (error as any)?.response?.status === 404
      ? state.filter((id) => id !== groundId)
      : state,
  );

/** Число избранного для профиля — производное от того же множества. */
export const $favoritesCount = $favoriteIds.map((ids) => ids.length);

/** Загружался ли полный список избранного (чтобы не мигать нулём). */
export const $favoriteIdsLoaded = dataDomain
  .createStore<boolean>(false)
  .on(fetchMyFavoriteGroundsFx.doneData, () => true)
  .on(logout, () => {
    return false;
  });

const withFavorites = (
  items: ExtendedGroundItem[],
  favoriteIds: string[],
  loaded: boolean,
): ExtendedGroundItem[] =>
  loaded
    ? items.map((item) => ({
        ...item,
        isFavorite: favoriteIds.includes(item.id),
      }))
    : items;

// ==========================================
// ПЛОЩАДКИ
// ==========================================

export const $grounds = dataDomain
  .createStore<ExtendedGroundItem[]>([])
  // ✅ P2: применяем ответ, только если он принадлежит последнему запросу —
  // иначе ответ на «vil» может перетереть результат для «vilnius».
  .on(fetchGroundsFx.done, (state, { params, result }) =>
    requestKey(params) === $groundsRequestKey.getState()
      ? withFavorites(
          result,
          $favoriteIds.getState(),
          $favoriteIdsLoaded.getState(),
        )
      : state,
  )
  // ✅ P2: ошибка сети больше не обнуляет уже загруженные данные
  .on(clearGrounds, () => [])
  // ✅ Подтверждение от сервера: ставим ровно то значение, что просили
  .on(addFavoriteFx.done, (state, { params: groundId }) =>
    state.map((g) => (g.id === groundId ? { ...g, isFavorite: true } : g)),
  )
  .on(removeFavoriteFx.done, (state, { params: groundId }) =>
    state.map((g) => (g.id === groundId ? { ...g, isFavorite: false } : g)),
  )
  // ✅ Отказ сервера: 409 = «уже в избранном», 404 = «уже удалено» —
  // это не ошибка, поэтому оставляем целевое состояние.
  .on(addFavoriteFx.fail, (state, { params: groundId, error }) => {
    const status = (error as any)?.response?.status;
    const target = status === 409;
    return state.map((g) => (g.id === groundId ? { ...g, isFavorite: target } : g));
  })
  .on(removeFavoriteFx.fail, (state, { params: groundId, error }) => {
    const status = (error as any)?.response?.status;
    const target = status !== 404;
    return state.map((g) => (g.id === groundId ? { ...g, isFavorite: target } : g));
  })
  // ✅ Полный список избранного — авторитетный источник: выравниваем весь
  // загруженный список, чтобы карточки и описание не расходились.
  .on(fetchMyFavoriteGroundsFx.doneData, (state, favorites) => {
    const favoriteIds = new Set(favorites.map((ground) => ground.id));
    return state.map((item) => ({
      ...item,
      isFavorite: favoriteIds.has(item.id),
    }));
  })
  .on(createGroundFx.doneData, (state, newGround) => {
    const extendedGround: ExtendedGroundItem = {
      ...newGround,
      eventsCount: 0,
      isFavorite: false,
      avgRating: 0,
      totalReviews: 0,
      distanceMeters: undefined,
    };
    return [extendedGround, ...state];
  })
  .on(updateGroundFx.doneData, (state, updated) =>
    state.map((g) =>
      g.id === updated.id
        ? {
            ...g,
            name: updated.name ?? g.name,
            address: updated.address ?? g.address,
            confirmed: updated.confirmed ?? g.confirmed,
            avatar: updated.avatar,
            avatarPath: updated.avatarPath,
            photos: updated.photos,
            photoPaths: updated.photoPaths,
            photoIds: updated.photoIds,
            avgRating: updated.avgRating ?? g.avgRating,
            totalReviews: updated.totalReviews ?? g.totalReviews,
            updatedAt: updated.updatedAt,
          }
        : g,
    ),
  )
  .on(fetchGroundByIdFx.doneData, (state, fresh) =>
    state.map((g) =>
      g.id === fresh.id
        ? {
            ...g,
            name: fresh.name ?? g.name,
            address: fresh.address ?? g.address,
            avatar: fresh.avatar,
            avatarPath: fresh.avatarPath,
            photos: fresh.photos,
            photoPaths: fresh.photoPaths,
            photoIds: fresh.photoIds,
            avgRating: fresh.avgRating ?? g.avgRating,
            totalReviews: fresh.totalReviews ?? g.totalReviews,
            // ✅ приоритет: единый набор избранного → ответ детального запроса
            isFavorite: $favoriteIdsLoaded.getState()
              ? $favoriteIds.getState().includes(fresh.id)
              : fresh.isFavorite ?? g.isFavorite,
            updatedAt: fresh.updatedAt,
          }
        : g,
    ),
  )
  .on(confirmGroundFx.doneData, (state, updated) =>
    state.map((item) =>
      item.id === updated.id ? { ...item, confirmed: updated.confirmed } : item,
    ),
  )
  .on(deleteGroundFx.done, (state, { params: id }) =>
    state.filter((item) => item.id !== id),
  );

export const $isGroundsLoading = dataDomain
  .createStore<boolean>(false)
  .on(fetchGroundsFx, () => true)
  .on(fetchGroundsFx.finally, () => false);

export const $groundsError = dataDomain
  .createStore<string | null>(null)
  .on(fetchGroundsFx.failData, (_, error: any) => error.message || 'Ошибка сети')
  .on(fetchGroundsFx, () => null);

export const $currentGround = dataDomain
  .createStore<GroundDetailItem | null>(null)
  // ✅ P2-fix: устаревший ответ не должен перетирать локально известное избранное
  .on(fetchGroundByIdFx.doneData, (_, payload) => {
    if (!$favoriteIdsLoaded.getState()) return payload;
    return {
      ...payload,
      isFavorite: $favoriteIds.getState().includes(payload.id),
    };
  })
  .on(fetchGroundByIdFx.failData, () => null)
  // ✅ P2-fix: ответ PATCH/PUT /ground не содержит isFavorite — без этого
  // сердечко после редактирования площадки «слетало» в false.
  .on(updateGroundFx.doneData, (state, updated) => {
    const fallback =
      state && state.id === updated.id ? state.isFavorite : undefined;
    return {
      ...updated,
      isFavorite: $favoriteIdsLoaded.getState()
        ? $favoriteIds.getState().includes(updated.id)
        : fallback ?? (updated as any).isFavorite ?? false,
    };
  })
  // ✅ Синхронизация с сервером
  .on(addFavoriteFx.done, (state, { params: groundId }) =>
    state && state.id === groundId ? { ...state, isFavorite: true } : state,
  )
  .on(removeFavoriteFx.done, (state, { params: groundId }) =>
    state && state.id === groundId ? { ...state, isFavorite: false } : state,
  )
  // ✅ Отказ сервера: 409/404 — не ошибка, оставляем целевое состояние
  .on(addFavoriteFx.fail, (state, { params: groundId, error }) => {
    const target = (error as any)?.response?.status === 409;
    return state && state.id === groundId
      ? { ...state, isFavorite: target }
      : state;
  })
  .on(removeFavoriteFx.fail, (state, { params: groundId, error }) => {
    const target = (error as any)?.response?.status !== 404;
    return state && state.id === groundId
      ? { ...state, isFavorite: target }
      : state;
  })
  // ✅ Полный список избранного выравнивает и текущую площадку
  .on(fetchMyFavoriteGroundsFx.doneData, (state, favorites) => {
    if (!state) return state;
    const favoriteIds = new Set(favorites.map((ground) => ground.id));
    return { ...state, isFavorite: favoriteIds.has(state.id) };
  });

export const $isGroundDetailLoading = dataDomain
  .createStore<boolean>(false)
  .on(fetchGroundByIdFx, () => true)
  .on(fetchGroundByIdFx.finally, () => false);

export const $currentGroundEvents = dataDomain
  .createStore<RealEventItem[]>([])
  .on(fetchEventsByGroundIdFx.doneData, (_, payload) => payload);

/**
 * ✅ P2: единственный источник истины — `$grounds`.
 * Раньше здесь был дублирующий стор со своими редукторами на update/confirm/delete.
 */
export const $pendingGrounds = $grounds.map((grounds) =>
  grounds.filter((g) => g.confirmed === false),
);

export const $isPendingLoading = dataDomain
  .createStore<boolean>(false)
  .on(fetchGroundsFx, () => true)
  .on(fetchGroundsFx.finally, () => false);

// ==========================================
// СОБЫТИЯ
// ==========================================

export const $events = dataDomain
  .createStore<ServerEventItem[]>([])
  // ✅ P2: ошибка сети не обнуляет список событий
  .on(fetchAllEventsFx.doneData, (_, payload) => payload);

export const $isEventsLoading = dataDomain
  .createStore<boolean>(false)
  .on(fetchAllEventsFx, () => true)
  .on(fetchAllEventsFx.finally, () => false);

export const $filteredEvents = dataDomain.createStore<ServerEventItem[]>([]);

export const $currentEvent = dataDomain
  .createStore<DetailedEventItem | null>(null)
  .on(fetchEventByIdFx.doneData, (_, payload) => payload)
  .on(fetchEventByIdFx.failData, () => null)
  .on(toggleJoinEventFx.doneData, (_, payload) => payload)
  .on(updateEventFx.doneData, (_, payload) => payload);

export const $isEventDetailLoading = dataDomain
  .createStore<boolean>(false)
  .on(fetchEventByIdFx, () => true)
  .on(fetchEventByIdFx.finally, () => false);

export const $currentDayEvents = combine(
  $events,
  $selectedDate,
  (events, selectedDate) => events.filter((evt) => evt.date === selectedDate),
);

// ==========================================
// ПРОИЗВОДНЫЕ СТОРЫ
// ==========================================

export const $upcomingEventsCountByGround = $events.map((events) => {
  const map: Record<string, number> = {};
  for (const e of events) {
    const groundId = e.ground?.id;
    if (!groundId) continue;
    const status = getEventStatus(e.date, e.startTime, e.duration);
    if (status !== 'finished') {
      map[groundId] = (map[groundId] || 0) + 1;
    }
  }
  return map;
});