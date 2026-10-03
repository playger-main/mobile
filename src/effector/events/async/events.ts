// src/effector/events/async/events.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';

// ==========================================
// ТИПЫ
// ==========================================

export interface ServerEventItem {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  duration: string;
  createdAt: string;
  updatedAt: string;
  maxPlayers: number;
  currentPlayers: number;
  level?: string;
  creator: {
    id: string;
    name: string;
    role: string[];
    avatar?: string | null;   // ✅ добавлено
  };
  ground: {
    id: string;
    name: string;
    address: string;
    kindofsport?: string[];
    avatar?: string | null;
  };
}

export interface RealEventItem {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  duration: string;
  creator: {
    id: string;
    name: string;
    role: string[];
    avatar?: string | null;
  };
}

export interface DetailedEventItem {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  duration: string;
  level?: string;
  playersCount?: string;
  maxPlayers?: number;
  currentPlayers?: number;

  // ✅ Participants с аватарами
  players?: Array<{ id: string; name: string; avatar?: string | null }>;

  creator: {
    id: string;
    name: string;
    avatar?: string | null;   // ✅ добавлено
  };

  ground: {
    id: string;
    name: string;
    address: string;
    kindofsport?: string[];
    avatar?: string | null;
    geolocation?: { lat: string; lng: string } | null;
  };
}

export interface CreateEventPayload {
  name: string;
  description: string;
  date: string;
  startTime: string;
  duration: string;
  level: string;
  maxPlayers: number;
  groundId: string;
}

export interface UpdateEventPayload {
  id: string;
  name?: string;
  description?: string;
  date?: string;
  startTime?: string;
  duration?: string;
  level?: string;
  maxPlayers?: number;
  groundId?: string;
}

// ==========================================
// API
// ==========================================

const eventApi = {
  getAll: async (): Promise<ServerEventItem[]> => {
    const response = await apiInstance.get<ServerEventItem[]>('/event');
    return response.data;
  },

  getByGroundId: async (groundId: string): Promise<RealEventItem[]> => {
    const response = await apiInstance.get<RealEventItem[]>(
      `/event/ground/${groundId}`,
    );
    return response.data;
  },

  getById: async (id: string): Promise<DetailedEventItem> => {
    const response = await apiInstance.get<DetailedEventItem>(`/event/${id}`);
    return response.data;
  },

  create: async (payload: CreateEventPayload): Promise<DetailedEventItem> => {
    const response = await apiInstance.post<DetailedEventItem>(
      '/event',
      payload,
    );
    return response.data;
  },

  update: async (payload: UpdateEventPayload): Promise<DetailedEventItem> => {
    const { id, ...rest } = payload;
    const response = await apiInstance.put<DetailedEventItem>(
      `/event/${id}`,
      rest,
    );
    return response.data;
  },

  toggleJoin: async (eventId: string): Promise<DetailedEventItem> => {
    const response = await apiInstance.post<DetailedEventItem>(
      `/event/${eventId}/join`,
    );
    return response.data;
  },
};

// ==========================================
// ЭФФЕКТЫ
// ==========================================

export const fetchAllEventsFx = createEffect(eventApi.getAll);
export const fetchEventsByGroundIdFx = createEffect(eventApi.getByGroundId);
export const fetchEventByIdFx = createEffect(eventApi.getById);
export const createEventFx = createEffect(eventApi.create);
export const updateEventFx = createEffect(eventApi.update);
export const toggleJoinEventFx = createEffect(eventApi.toggleJoin);