// src/effector/events/async/grounds.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';
import { ExtendedGroundItem } from '@/components/ui/CardGround';

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
  coverage: string[];           // ✅ массив
  amenities: string[];
  description: string | null;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
  address: string | null;
  avatar: string;
  avgRating: number;
  eventsCount: number;
  isFavorite: boolean;
  distanceMeters?: number;
  creator?: { id: string; name: string } | null;
  upcomingEvents?: EventItem[];
  geolocation: { lat: string; lng: string } | null;
}

// ✅ coverage теперь массив
export interface CreateGroundPayload {
  name: string;
  kindofsport: string[];
  address: string;
  coverage?: string[];          // ✅ массив
  description?: string;
  amenities?: string[];
  geolocation: { lat: number; lng: number };
  avatar?: {
    uri: string;
    name: string;
    type: string;
  } | null;
}

export interface UpdateGroundPayload {
  id: string;
  name?: string;
  kindofsport?: string[];
  address?: string;
  coverage?: string[];          // ✅ массив
  description?: string;
  amenities?: string[];
  geolocation?: { lat: number; lng: number };
  avatar?: {
    uri: string;
    name: string;
    type: string;
  } | null;
}

const groundApi = {
  getAll: async (params?: GetGroundsParams): Promise<ExtendedGroundItem[]> => {
    const response = await apiInstance.get<ExtendedGroundItem[]>('/ground', { params });
    return response.data;
  },

  getById: async (id: string): Promise<GroundDetailItem> => {
    const response = await apiInstance.get<GroundDetailItem>(`/ground/${id}`);
    return response.data;
  },

  create: async (payload: CreateGroundPayload): Promise<GroundDetailItem> => {
    const groundResponse = await apiInstance.post<GroundDetailItem>('/ground', {
      name: payload.name,
      kindofsport: payload.kindofsport,
      coverage: payload.coverage || [],       // ✅ массив
      description: payload.description,
      amenities: payload.amenities || [],
    });
    const createdGround = groundResponse.data;

    await apiInstance.post(`/location/ground/${createdGround.id}`, {
      lat: String(payload.geolocation.lat),
      lng: String(payload.geolocation.lng),
      address: payload.address,
    });

    if (payload.avatar) {
      const formData = new FormData();
      // @ts-ignore
      formData.append('file', {
        uri: payload.avatar.uri,
        name: payload.avatar.name,
        type: payload.avatar.type,
      });
      formData.append('groundId', createdGround.id);
      formData.append('message', `feat: add photo for ${createdGround.name}`);

      await apiInstance.post('/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    const finalResponse = await apiInstance.get<GroundDetailItem>(`/ground/${createdGround.id}`);
    return finalResponse.data;
  },

  update: async (payload: UpdateGroundPayload): Promise<GroundDetailItem> => {
    const { id, geolocation, avatar, address, coverage, ...rest } = payload;

    await apiInstance.patch(`/ground/${id}`, {
      name: rest.name,
      kindofsport: rest.kindofsport,
      description: rest.description,
      amenities: rest.amenities,
      coverage: coverage,                      // ✅ массив
    });

    if (geolocation && address) {
      await apiInstance.put(`/location/ground/${id}`, {
        lat: String(geolocation.lat),
        lng: String(geolocation.lng),
        address,
      });
    }

    if (avatar) {
      const formData = new FormData();
      // @ts-ignore
      formData.append('file', {
        uri: avatar.uri,
        name: avatar.name,
        type: avatar.type,
      });
      formData.append('groundId', id);
      formData.append('message', `feat: update photo for ${rest.name ?? id}`);
      await apiInstance.post('/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    const response = await apiInstance.get<GroundDetailItem>(`/ground/${id}`);
    return response.data;
  },

  setConfirmed: async (payload: { id: string; confirmed: boolean }): Promise<GroundDetailItem> => {
    const response = await apiInstance.patch<GroundDetailItem>(
      `/ground/${payload.id}/confirm`,
      { confirmed: payload.confirmed },
    );
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiInstance.delete(`/ground/${id}`);
  },
};

export const fetchGroundsFx = createEffect(groundApi.getAll);
export const fetchGroundByIdFx = createEffect(groundApi.getById);
export const createGroundFx = createEffect(groundApi.create);
export const updateGroundFx = createEffect(groundApi.update);
export const confirmGroundFx = createEffect(groundApi.setConfirmed);
export const deleteGroundFx = createEffect(groundApi.remove);