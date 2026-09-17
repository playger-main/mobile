// src\effector\events\async\grounds.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';
import { ExtendedGroundItem } from '@/components/ui/CardGround';

export interface GetGroundsParams {
  // 🛠 ИСПРАВЛЕНО: Заменили category на kindofsport
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
  date: string; // Например, "17 SEP"
  time: string; // "18:30"
  playersCount: string; // "7/10"
}

export interface GroundDetailItem {
  id: string;
  name: string;
  kindofsport: string[];
  coverage: string[];
  description: string | null;
  address: string | null;
  avatar: string;
  avgRating: number;
  eventsCount: number;
  isFavorite: boolean;
  distanceMeters?: number;
  amenities?: string[]; // Удобства: ['Floodlights', 'Benches']
  upcomingEvents?: EventItem[]; // Связанные события
}

const groundApi = {
  getAll: async (params?: GetGroundsParams): Promise<ExtendedGroundItem[]> => {
    // Axios автоматически преобразует params в строку: /ground?kindofsport=basketball&search=...
    const response = await apiInstance.get<ExtendedGroundItem[]>('/ground', { params });
    return response.data;
  },
  getById: async (id: string): Promise<GroundDetailItem> => {
    const response = await apiInstance.get<GroundDetailItem>(`/ground/${id}`);
    return response.data;
    }
};

export const fetchGroundsFx = createEffect(groundApi.getAll);
export const fetchGroundByIdFx = createEffect(groundApi.getById);