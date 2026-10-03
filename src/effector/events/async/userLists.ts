// src/effector/events/async/userLists.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';
import { ServerEventItem } from './events';
import { ExtendedGroundItem } from '@/components/ui/CardGround';

// ==========================================
// API
// ==========================================

const userListsApi = {
  getMyCreatedEvents: async (): Promise<ServerEventItem[]> => {
    const res = await apiInstance.get<ServerEventItem[]>('/event/mine', {
      params: { type: 'created' },
    });
    return res.data;
  },

  getMyJoinedEvents: async (): Promise<ServerEventItem[]> => {
    const res = await apiInstance.get<ServerEventItem[]>('/event/mine', {
      params: { type: 'joined' },
    });
    return res.data;
  },

  getMyFavoriteGrounds: async (): Promise<ExtendedGroundItem[]> => {
    const res = await apiInstance.get<{ ground: ExtendedGroundItem }[]>(
      '/favorite',
    );
    return res.data.map((fav) => fav.ground).filter(Boolean);
  },

  addFavorite: async (groundId: string): Promise<void> => {
    await apiInstance.post('/favorite', { groundId });
  },

  removeFavorite: async (groundId: string): Promise<void> => {
    await apiInstance.delete(`/favorite/${groundId}`);
  },
};

// ==========================================
// ЭФФЕКТЫ
// ==========================================

export const fetchMyCreatedEventsFx = createEffect(
  userListsApi.getMyCreatedEvents,
);
export const fetchMyJoinedEventsFx = createEffect(
  userListsApi.getMyJoinedEvents,
);
export const fetchMyFavoriteGroundsFx = createEffect(
  userListsApi.getMyFavoriteGrounds,
);

export const addFavoriteFx = createEffect(userListsApi.addFavorite);
export const removeFavoriteFx = createEffect(userListsApi.removeFavorite);