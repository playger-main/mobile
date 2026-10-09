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
  descriptionTranslate: Record<string, string>;
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
  totalReviews: number;
  eventsCount: number;
  isFavorite: boolean;
  distanceMeters?: number;
  creator?: {
    id: string;
    name: string;
    avatar?: string | null;
    email?: string;
  } | null;
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
  description?: string | null;
  descriptionTranslate?: Record<string, string>;
  amenities?: string[];
  geolocation?: { lat: number; lng: number };
  newPhotoUris?: string[];
  removedPhotoIds?: string[];
  mainPhotoPath?: string | null;
  mainNewPhotoIndex?: number | null;
}

// ==========================================
// ✅ UPLOAD ЧЕРЕЗ AXIOS
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
    transformRequest: [(data) => data],
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
    const groundRes = await apiInstance.post<GroundDetailItem>('/ground', {
      name: payload.name,
      kindofsport: payload.kindofsport,
      coverage: payload.coverage || [],
      description: payload.description,
      amenities: payload.amenities || [],
    });
    const createdGround = groundRes.data;

    await apiInstance.post(`/location/ground/${createdGround.id}`, {
      lat: String(payload.geolocation.lat),
      lng: String(payload.geolocation.lng),
      address: payload.address,
    });

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
      descriptionTranslate,
      newPhotoUris,
      removedPhotoIds,
      mainPhotoPath,
      mainNewPhotoIndex,
      ...rest
    } = payload;

    // ✅ Собираем body аккуратно:
    //   - descriptionTranslate — только если реально задано
    //   - description — может быть null (для удаления)
    const body: any = {
      name: rest.name,
      kindofsport: rest.kindofsport,
      amenities: rest.amenities,
      coverage,
    };

    if ('description' in rest) {
      body.description = rest.description;
    }

    if (descriptionTranslate !== undefined) {
      body.descriptionTranslate = descriptionTranslate;
    }

    await apiInstance.patch(`/ground/${id}`, body);

    if (geolocation && address) {
      await apiInstance.put(`/location/ground/${id}`, {
        lat: String(geolocation.lat),
        lng: String(geolocation.lng),
        address,
      });
    }

    if (removedPhotoIds && removedPhotoIds.length > 0) {
      for (const photoId of removedPhotoIds) {
        try {
          await apiInstance.delete(`/photo/${photoId}`);
        } catch (e) {
          console.warn('[update] delete photo failed:', photoId, e);
        }
      }
    }

    if (newPhotoUris && newPhotoUris.length > 0) {
      for (let i = 0; i < newPhotoUris.length; i++) {
        const isMain = mainNewPhotoIndex === i;
        await uploadOnePhoto(newPhotoUris[i], id, isMain);
      }
    }

    if (mainPhotoPath && mainNewPhotoIndex == null) {
      await apiInstance.patch(`/ground/${id}/avatar`, { path: mainPhotoPath });
    }

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