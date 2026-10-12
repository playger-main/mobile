// src/effector/events/async/users.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';

// ==========================================
// ТИПЫ
// ==========================================

export interface ServerUserProfile {
  id: string;
  username: string;
  email: string;
  roles: string[];
  isEmailConfirmed: boolean;
  city: string | null;
  bio: string;
  preferredSports: string[];
  avatar: string | null;
  avatarPath: string | null;
  photos: string[];
  photoPaths: string[];
  photoIds: string[];
  createdAt: number;
  updatedAt: number;

  joinedCount?: number;
  savedCount?: number;
  gamesCount?: number;
  reviewsCount?: number;
}

export interface UpdateProfilePayload {
  username?: string;
  bio?: string;
  city?: string;
  preferredSports?: string[];
}

export interface UploadUserPhotoPayload {
  uri: string;
  setAsMain: boolean;
}

// ==========================================
// API
// ==========================================

const userApi = {
  getMe: async (): Promise<ServerUserProfile> => {
    const res = await apiInstance.get<ServerUserProfile>('/user/me');
    return res.data;
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<ServerUserProfile> => {
    const res = await apiInstance.patch<ServerUserProfile>('/user/me', payload);
    return res.data;
  },

  requestEmailChange: async (
    newEmail: string,
  ): Promise<{ message: string }> => {
    const res = await apiInstance.post<{ message: string }>(
      '/user/me/email/request',
      { newEmail },
    );
    return res.data;
  },

  confirmEmailChange: async (code: string): Promise<ServerUserProfile> => {
    const res = await apiInstance.post<ServerUserProfile>(
      '/user/me/email/confirm',
      { code },
    );
    return res.data;
  },

  updateAvatar: async (path: string | null): Promise<ServerUserProfile> => {
    const res = await apiInstance.patch<ServerUserProfile>('/user/me/avatar', {
      path,
    });
    return res.data;
  },

  uploadPhoto: async (
    payload: UploadUserPhotoPayload,
  ): Promise<{ photo: any; path: string; cdnUrl: string }> => {
    const formData = new FormData();

    // @ts-ignore
    formData.append('file', {
      uri: payload.uri,
      name: 'avatar.jpg',
      type: 'image/jpeg',
    });
    formData.append('setAsMain', payload.setAsMain ? 'true' : 'false');

    const res = await apiInstance.post('/photo', formData, {
      transformRequest: [(data) => data],
    });
    return res.data;
  },

  deletePhoto: async (photoId: string): Promise<void> => {
    await apiInstance.delete(`/photo/${photoId}`);
  },

  // ✅ №5: удаление своего аккаунта
  deleteAccount: async (): Promise<void> => {
    await apiInstance.delete('/user/me');
  },
};

// ==========================================
// ЭФФЕКТЫ
// ==========================================

export const fetchMyProfileFx = createEffect(userApi.getMe);
export const updateProfileFx = createEffect(userApi.updateProfile);
export const requestEmailChangeFx = createEffect(userApi.requestEmailChange);
export const confirmEmailChangeFx = createEffect(userApi.confirmEmailChange);
export const updateAvatarFx = createEffect(userApi.updateAvatar);
export const uploadUserPhotoFx = createEffect(userApi.uploadPhoto);
export const deleteUserPhotoFx = createEffect(userApi.deletePhoto);
export const deleteAccountFx = createEffect(userApi.deleteAccount); // ✅