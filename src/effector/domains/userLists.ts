// src/effector/domains/userLists.ts
import { createDomain } from 'effector';
import { ServerEventItem } from '../events/async/events';
import { ExtendedGroundItem } from '@/components/ui/CardGround';
import {
  fetchMyCreatedEventsFx,
  fetchMyJoinedEventsFx,
  fetchMyFavoriteGroundsFx,
  removeFavoriteFx,
} from '../events/async/userLists';

const userListsDomain = createDomain('userLists');

// ==========================================
// СОБЫТИЯ — созданные мной
// ==========================================

export const $myCreatedEvents = userListsDomain
  .createStore<ServerEventItem[]>([])
  .on(fetchMyCreatedEventsFx.doneData, (_, payload) => payload)
  .on(fetchMyCreatedEventsFx.failData, () => []);

// ==========================================
// СОБЫТИЯ — где я участник
// ==========================================

export const $myJoinedEvents = userListsDomain
  .createStore<ServerEventItem[]>([])
  .on(fetchMyJoinedEventsFx.doneData, (_, payload) => payload)
  .on(fetchMyJoinedEventsFx.failData, () => []);

// ==========================================
// ИЗБРАННЫЕ ПЛОЩАДКИ
// ==========================================

export const $myFavoriteGrounds = userListsDomain
  .createStore<ExtendedGroundItem[]>([])
  .on(fetchMyFavoriteGroundsFx.doneData, (_, payload) => payload)
  .on(fetchMyFavoriteGroundsFx.failData, () => [])
  // ✅ Убираем из списка сразу после успешного удаления
  .on(removeFavoriteFx.done, (state, { params: groundId }) =>
    state.filter((g) => g.id !== groundId),
  );

// ==========================================
// ЗАГРУЗКА
// ==========================================

export const $isMyCreatedLoading = userListsDomain
  .createStore(false)
  .on(fetchMyCreatedEventsFx, () => true)
  .on(fetchMyCreatedEventsFx.finally, () => false);

export const $isMyJoinedLoading = userListsDomain
  .createStore(false)
  .on(fetchMyJoinedEventsFx, () => true)
  .on(fetchMyJoinedEventsFx.finally, () => false);

export const $isMyFavoritesLoading = userListsDomain
  .createStore(false)
  .on(fetchMyFavoriteGroundsFx, () => true)
  .on(fetchMyFavoriteGroundsFx.finally, () => false);