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

const groundApi = {
  getAll: async (params?: GetGroundsParams): Promise<ExtendedGroundItem[]> => {
    // Axios автоматически преобразует params в строку: /ground?kindofsport=basketball&search=...
    const response = await apiInstance.get<ExtendedGroundItem[]>('/ground', { params });
    return response.data;
  },
  getById: async (id: string): Promise<ExtendedGroundItem> => {
    const response = await apiInstance.get<ExtendedGroundItem>(`/ground/${id}`);
    return response.data;
  },
};

export const fetchGroundsFx = createEffect(groundApi.getAll);
