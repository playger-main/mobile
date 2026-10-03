// src/effector/events/async/userPublic.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';

export interface PublicUserProfile {
  id: string;
  username: string;
  roles: string[];
  city: string | null;
  bio: string;
  preferredSports: string[];
  avatar: string | null;
  avatarPath: string | null;
  photos: string[];
  photoPaths: string[];
  photoIds: string[];

  // ✅ Приходит только для своего профиля
  email?: string;
  isEmailConfirmed?: boolean;

  // ✅ Публичная статистика
  joinedCount: number;
  gamesCount: number;

  // Только для своего профиля
  savedCount?: number;

  createdAt: number;
  updatedAt: number;
}

export const fetchPublicUserFx = createEffect(
  async (userId: string): Promise<PublicUserProfile> => {
    const res = await apiInstance.get<PublicUserProfile>(`/user/${userId}`);
    return res.data;
  },
);