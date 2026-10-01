// src/effector/events/async/grounds.ts
import { createEffect } from 'effector';

import { apiInstance } from '../../api';
import { ExtendedGroundItem } from '@/components/ui/CardGround';

// ==========================================
// ТИПЫ
// ==========================================

export interface GetGroundsParams {
  kindofsport?: string;
  search?: string;
  skip?: number;
  take?: number;
  lat?: number;
  lng?: number;
  maxDistance?: number;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  playersCount: string;
}

export interface GroundDetailItem {
  id: string;
  name: string;
  kindofsport: string[];
  coverage: string[];
  amenities: string[];
  description: string | null;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
  address: string | null;

  avatar: string | null;
  avatarPath: string | null;
  photos: string[];
  photoPaths: string[];
  photoIds: string[];

  avgRating: number;
  eventsCount: number;
  isFavorite: boolean;
  distanceMeters?: number;
  creator?: { id: string; name: string } | null;
  upcomingEvents?: EventItem[];
  geolocation: { lat: string; lng: string } | null;
}

export interface CreateGroundPayload {
  name: string;
  kindofsport: string[];
  address: string;
  coverage?: string[];
  description?: string;
  amenities?: string[];
  geolocation: { lat: number; lng: number };
  photoUris?: string[];
  mainPhotoIndex?: number;
}

export interface UpdateGroundPayload {
  id: string;
  name?: string;
  kindofsport?: string[];
  address?: string;
  coverage?: string[];
  description?: string;
  amenities?: string[];
  geolocation?: { lat: number; lng: number };
  newPhotoUris?: string[];
  removedPhotoIds?: string[];
  mainPhotoPath?: string | null;
  mainNewPhotoIndex?: number | null;
}

// ==========================================
// ✅ UPLOAD ЧЕРЕЗ AXIOS
// В RN работает корректно, если:
//   1) использовать transformRequest: [(data) => data]
//   2) НЕ задавать Content-Type вручную
// ==========================================

const uploadOnePhoto = async (
  uri: string,
  groundId: string,
  setAsMain: boolean,
): Promise<any> => {
  const formData = new FormData();

  // @ts-ignore — RN-специфичный объект для файла
  formData.append('file', {
    uri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  });
  formData.append('groundId', groundId);
  formData.append('setAsMain', setAsMain ? 'true' : 'false');

  const response = await apiInstance.post('/photo', formData, {
    // ✅ Не даём axios сериализовать FormData в JSON
    transformRequest: [(data) => data],
    // ✅ Content-Type НЕ ставим — axios сам подставит boundary
  });

  return response.data;
};

// ==========================================
// API
// ==========================================

const groundApi = {
  getAll: async (params?: GetGroundsParams): Promise<ExtendedGroundItem[]> => {
    const res = await apiInstance.get<ExtendedGroundItem[]>('/ground', { params });
    return res.data;
  },

  getById: async (id: string): Promise<GroundDetailItem> => {
    const res = await apiInstance.get<GroundDetailItem>(`/ground/${id}`);
    return res.data;
  },

  create: async (payload: CreateGroundPayload): Promise<GroundDetailItem> => {
    // 1. Создаём площадку
    const groundRes = await apiInstance.post<GroundDetailItem>('/ground', {
      name: payload.name,
      kindofsport: payload.kindofsport,
      coverage: payload.coverage || [],
      description: payload.description,
      amenities: payload.amenities || [],
    });
    const createdGround = groundRes.data;

    // 2. Создаём локацию
    await apiInstance.post(`/location/ground/${createdGround.id}`, {
      lat: String(payload.geolocation.lat),
      lng: String(payload.geolocation.lng),
      address: payload.address,
    });

    // 3. Загружаем фото
    if (payload.photoUris && payload.photoUris.length > 0) {
      const mainIndex = payload.mainPhotoIndex ?? 0;
      for (let i = 0; i < payload.photoUris.length; i++) {
        await uploadOnePhoto(
          payload.photoUris[i],
          createdGround.id,
          i === mainIndex,
        );
      }
    }

    // 4. Возвращаем актуальные данные
    const final = await apiInstance.get<GroundDetailItem>(
      `/ground/${createdGround.id}`,
    );
    return final.data;
  },

  update: async (payload: UpdateGroundPayload): Promise<GroundDetailItem> => {
    const {
      id,
      geolocation,
      address,
      coverage,
      newPhotoUris,
      removedPhotoIds,
      mainPhotoPath,
      mainNewPhotoIndex,
      ...rest
    } = payload;

    // 1. Обновляем площадку
    await apiInstance.patch(`/ground/${id}`, {
      name: rest.name,
      kindofsport: rest.kindofsport,
      description: rest.description,
      amenities: rest.amenities,
      coverage,
    });

    // 2. Обновляем локацию
    if (geolocation && address) {
      await apiInstance.put(`/location/ground/${id}`, {
        lat: String(geolocation.lat),
        lng: String(geolocation.lng),
        address,
      });
    }

    // 3. Удаляем помеченные фото
    if (removedPhotoIds && removedPhotoIds.length > 0) {
      for (const photoId of removedPhotoIds) {
        try {
          await apiInstance.delete(`/photo/${photoId}`);
        } catch (e) {
          console.warn('[update] delete photo failed:', photoId, e);
        }
      }
    }

    // 4. Загружаем новые фото
    if (newPhotoUris && newPhotoUris.length > 0) {
      for (let i = 0; i < newPhotoUris.length; i++) {
        const isMain = mainNewPhotoIndex === i;
        await uploadOnePhoto(newPhotoUris[i], id, isMain);
      }
    }

    // 5. Смена главного на существующее (если главное — не из новых)
    if (mainPhotoPath && mainNewPhotoIndex == null) {
      await apiInstance.patch(`/ground/${id}/avatar`, { path: mainPhotoPath });
    }

    // 6. Возвращаем актуальные данные
    const final = await apiInstance.get<GroundDetailItem>(`/ground/${id}`);
    return final.data;
  },

  setConfirmed: async (p: { id: string; confirmed: boolean }) => {
    const res = await apiInstance.patch<GroundDetailItem>(
      `/ground/${p.id}/confirm`,
      { confirmed: p.confirmed },
    );
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiInstance.delete(`/ground/${id}`);
  },
};

// ==========================================
// ЭФФЕКТЫ
// ==========================================

export const fetchGroundsFx = createEffect(groundApi.getAll);
export const fetchGroundByIdFx = createEffect(groundApi.getById);
export const createGroundFx = createEffect(groundApi.create);
export const updateGroundFx = createEffect(groundApi.update);
export const confirmGroundFx = createEffect(groundApi.setConfirmed);
export const deleteGroundFx = createEffect(groundApi.remove);