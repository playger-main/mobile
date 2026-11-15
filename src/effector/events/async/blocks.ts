// src/effector/events/async/blocks.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';

/** ✅ Список id заблокированных пользователей */
export const fetchMyBlocksFx = createEffect(async () => {
  const { data } = await apiInstance.get<string[]>('/block');
  return data;
});

export const blockUserFx = createEffect(async (userId: string) => {
  await apiInstance.post(`/block/${userId}`);
  return userId;
});

export const unblockUserFx = createEffect(async (userId: string) => {
  await apiInstance.delete(`/block/${userId}`);
  return userId;
});
